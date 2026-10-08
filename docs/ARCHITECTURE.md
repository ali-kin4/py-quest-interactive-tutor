# Architecture

PyQuest is a static site: plain ES modules and CSS, no build step, no backend. GitHub Pages serves the repository root as-is.

```
index.html ──► src/main.js
                 ├─ app/store.js        local-first state (localStorage, JSON import/export)
                 ├─ app/router.js       #/learn/<lesson>, #/practice/<problem>, #/syllabus, #/guide
                 ├─ ui/views/learn.js   lesson reader: sidebar, runnable examples, quiz, practice links
                 ├─ ui/views/workspace.js
                 │    ├─ ui/editor.js + ui/highlight.js   textarea-over-<pre> code editor
                 │    ├─ ui/views/problem-panel.js        statement rendering
                 │    ├─ ui/views/results.js              tests / console / insights tabs
                 │    └─ ui/tutor-panel.js ─► tutor/engine.js + tutor/glossary.js
                 ├─ ui/views/syllabus.js, ui/views/guide.js
                 └─ runtime/python-runner.js ─► (Web Worker) runtime/python-worker.js
                                                         └─ Pyodide + runtime/harness.py
```

## Content model

- `src/data/syllabus.js` orders 14 lessons (`src/data/lessons/NN-id.js`) into 5 units. Each lesson lists the practice problems it unlocks, and `lessonForProblem` maps each problem back to its lesson.
- `src/data/curriculum.js` combines 30 problems from three tracks (`src/data/tracks/*.js`), which the practice strip uses to group them.
- `src/data/lesson-schema.js` defines the lesson contract. Unit tests and `scripts/verify-lessons.mjs` both enforce it.

## Grading pipeline

1. `PythonRunner.run(code, tests)` posts the source and the problem's tests to the worker. It enforces a 90 s load timeout and a 15 s run timeout. Hitting a timeout, or pressing **Stop**, calls `terminate()` on the worker. A new worker loads lazily on the next run.
2. The worker loads Pyodide 0.27.7 (Python 3.12) from jsDelivr and executes `harness.py`.
3. `_pyquest_run` compiles the learner's code once, executes the module once to capture the console output, then runs each test in a **fresh namespace**: `exec` the module, `eval` the call, and compare against `ast.literal_eval(expected)`.
4. The report (`compile_error`, `module_error`, `stdout`, per-test `passed/actual/error/ms`) goes back to the UI and to the tutor.
5. Lesson examples use `PythonRunner.exec(code)` → `_pyquest_exec`, which runs the code as a script and returns `{ stdout, error }`.

The **same `harness.py`** runs under CPython in CI. `scripts/verify_solutions.py` grades every reference solution, and `scripts/verify_examples.py` runs every lesson example and compares its output with the lesson text. The grader learners use is therefore the grader that verifies the course.

## Tutor

`tutor/engine.js` is deterministic and has no I/O:

- `hint(problem, level)`: hints → scaffold → offer to reveal the solution.
- `diagnose(problem, report)`: maps the first relevant failure to advice (error type, `None` returns, str-vs-number, rounding, list order, hidden edge cases) plus actions such as *Go to line N*.
- `answer(problem, question, ctx)`: intent routing (hint, why-failing, example, spec, hidden tests, complexity) plus glossary lookups.

It is intentionally not an LLM. Adding one would need a server-side proxy to keep API keys secret. The `answer()` signature is the natural seam for that.

## Security model

- All curriculum and learner text is escaped (`html` tagged template, `escapeHTML`, `textContent`). The highlighter escapes before wrapping tokens.
- Imported progress files are validated field by field by `sanitize()`.
- The worker is **not** a sandbox. Learner code can use any API available to a worker. That's acceptable for self-practice and unacceptable for exams or secrets.
