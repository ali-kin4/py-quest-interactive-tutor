# Writing PyQuest lessons and problems

PyQuest has two kinds of content: **lessons** teach a concept, and **problems** practise it. Every problem is linked from exactly one lesson.

## Lessons

Lessons live in `src/data/lessons/NN-id.js` and are registered in order in `src/data/syllabus.js`. The full contract is in `src/data/lesson-schema.js`:

| Field | Purpose |
| --- | --- |
| `id`, `unit`, `title`, `minutes`, `summary` | Identity and syllabus placement. **Never rename a shipped `id`.** |
| `objectives[]` | 3–6 outcomes, phrased as things the learner will be able to do. |
| `sections[]` | `{ heading, body, example?, callout? }`. `body` holds paragraphs or `{ list: [...] }`. |
| `example` | `{ code, output, error?, note? }`. `output` is the **exact** stdout; `error` names an exception the example raises deliberately. |
| `callout` | `{ kind, text }` where `kind` is `tip`, `note` or `warning`. |
| `keyPoints[]`, `mistakes[]` | The recap, and `{ mistake, fix }` pairs. |
| `quiz[]` | At least 3 questions: `{ question, options: [4 distinct], answer: 0–3, explanation }`. Vary the position of the correct answer. |
| `practice[]` | Problem ids this lesson unlocks. Teach every concept they need, but never their exact solutions. |

Examples must not call `input()`. Write them so they `print` their results, and check them with:

```bash
npm run verify:lessons                                       # all lessons
node scripts/verify-lessons.mjs src/data/lessons/07-loops.js   # one file while writing
```

## Problems

New problems must also be added to a lesson's `practice` list.

Problems are plain data in `src/data/tracks/*.js`. Each track file exports `{ id, title, description, problems }`; `src/data/curriculum.js` combines the tracks and numbers the problems in order.

## Problem schema

| Field | Purpose |
| --- | --- |
| `id` | Stable kebab-case ID used in URLs and saved progress. **Never rename a shipped ID.** |
| `title`, `difficulty`, `minutes` | Header and strip. `difficulty` is `Easy`, `Medium` or `Hard`. |
| `summary`, `statement`, `task` | The brief, from one-line summary to precise contract. Use `` `code` `` and `**bold**` sparingly. |
| `examples[]` | `{ title, input, output, explanation }`. `input` is the call, `output` the Python repr. |
| `inputFormat`, `outputFormat`, `constraints[]` | Exact types, ranges and edge-case rules. |
| `concepts[]` | Tags. Each must resolve to an entry in `src/tutor/glossary.js` (a unit test enforces this), so clicking a tag always gets an explanation. |
| `hints[]` | At least three, from a gentle nudge to nearly the answer. |
| `scaffold` | Partial code with `...` placeholders, shown after the last hint. Only compiled, never run. |
| `starter` | What the editor opens with. Must define the function and end in `raise NotImplementedError(...)`. |
| `solution` | A clear reference solution. It's shown only on request after the hints. |
| `tests[]` | Built with `test(name, call, expected)` (visible) and `hidden(call, expected)`. |

`call` is a Python expression evaluated against the learner's module; `expected` is a Python **literal** compared structurally (floats with tolerance; lists and tuples by item). Use the `code` template tag for multi-line code so the indentation in the source file stays readable.

## Quality bar

1. **Real tasks.** Prefer reporting, validation, cleaning and automation scenarios over contrived puzzles.
2. **Exact contracts.** State types, rounding, boundaries, and the behaviour for empty or invalid input.
3. **Hidden tests cover edge cases**: empty input, single item, exact thresholds, negatives, case and whitespace. Each problem needs ≥ 2 visible and ≥ 1 hidden test with no duplicate calls.
4. **Hints teach.** Each hint should still leave the learner something to do.
5. **No dishonest claims.** Browser tests are feedback, not proctored or certified assessment.

## Verify before you commit

```bash
npm test                  # schema, tutor, store and rendering checks
npm run verify:solutions  # runs every solution and starter through src/runtime/harness.py with CPython
npm run verify:lessons    # runs every lesson example and compares its output
npm run test:e2e          # optional: full browser run (needs Playwright, see README)
```

`verify:solutions` fails if a reference solution misses any test, if a starter already passes every test, or if a scaffold has a syntax error.
