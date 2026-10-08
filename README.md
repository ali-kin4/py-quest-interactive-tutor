# PyQuest Academy

**Learn Python by building useful things.** PyQuest is a no-account, browser-based learning academy and a live demonstration of practical technical instruction by [Ali Jabbary](https://alijabbary.com).

**Live site:** https://ali-kin4.github.io/py-quest-interactive-tutor/

The academy is designed around a complete learning loop: **understand → see an example → answer a knowledge check → write Python → inspect test feedback → demonstrate progress**. Lessons use authentic business and technical scenarios rather than isolated syntax drills.

## Experience

- **Professional academy interface:** Responsive learning dashboard, lesson catalogue, coding studio, progress overview, and instructor showcase.
- **12 hands-on lessons, 3 connected learning paths:** Python foundations; practical Python; data and automation.
- **Runnable Python in the browser:** Pyodide executes code in a Web Worker after a lazy first load.
- **Transparent feedback:** Every challenge declares example input/output cases. The result shows which passed, what was expected, and what ran.
- **Safe interruption / recovery:** Stop button and per-run execution timeout terminate the worker to recover the interface from long-running code. **This is not a security sandbox.**
- **Local-first progress:** Completed challenges, quiz results, and editable code are saved in your browser. Import/export your progress as JSON.
- **Practical capstone:** Build a validated revenue summary from transactions and invalid records.
- **Keyboard and mobile support:** Accessible navigation, focus indicators, reduced-motion support, responsive layouts, and Ctrl/Cmd+Enter execution.

### Paths and outcomes

| Path | Lessons | Practical outcomes |
| --- | --- | --- |
| Python Foundations | Variables, strings, decisions, loops | Invoices, text cleanup, tiered discounts, sales totals |
| Practical Python | Functions, collections, validation, transformations | Tax calculators, ticket summaries, data validation, transaction cleanup |
| Data & Automation | KPI calculation, quality checks, triage automation, capstone | Business metrics, sensor quality, support routing, validated revenue reporting |

**Assessment scope:** The checks are visible, client-side demonstration tests—not secret graders, proctored assessments, or certifications. Passing them provides feedback about the given cases, not a proof that code is correct for every possible input.

## Run locally

Prerequisites: A modern browser and a lightweight local HTTP server. GitHub Pages needs no build process.

From a local checkout:

~~~bash
python -m http.server 8000
~~~

Open http://localhost:8000. On first test run, your browser downloads Pyodide from a pinned jsDelivr URL. An internet connection is therefore required initially. UI and lessons do not require a Python installation.

Run the built-in structural and curriculum quality checks:

~~~bash
npm run check
~~~

Node.js 20+ is required for checks only, not the public site.

## Architecture

~~~text
index.html                   static app shell and semantic content regions
src/styles.css               responsive design system
src/app.mjs                  routes, UI rendering, browser persistence, worker lifecycle
src/curriculum.mjs           reviewed lessons, quizzes, input/output test cases
src/python-worker.mjs        Pyodide execution and captured test results
tests/curriculum.test.mjs    schema, lesson coverage and application integrity checks
docs/LESSON_AUTHORING.md    standards for adding and validating lessons
.github/workflows/ci.yml    continuous checks for changes and pull requests
~~~

The site is intentionally simple: **no paid APIs, account creation, database, vendor lock-in, or deployment secrets**. Python evaluation and progress processing occur client-side. It uses remote font and Pyodide CDN assets.

### Limits and safety

1. Web Workers provide responsiveness and stoppability, **not an adversarial security boundary**. User Python can potentially interact with browser APIs available to a worker. Do not evaluate untrusted adversarial code, handle sensitive information, or reuse the engine as a remotely verified exam.
2. A cold Pyodide initialization may take time, particularly on mobile or slow networks.
3. No server tracks user accounts, learning progress, grades, certificates, or analytics. Browser data may be lost if storage is cleared.
4. A 15-second runtime timeout terminates the entire worker, after which the engine is lazily loaded again on the next attempt.
5. The curriculum is intentionally selective. It is a structured demonstration, not a complete professional qualification.

## Deploy

GitHub Pages can serve this repository from the root of the default branch. No compilation is necessary. After merging a change, make sure Settings → Pages points to the correct branch/root or a custom Pages workflow; do not deploy untested changes.

For review, run `npm run check` and manually verify lesson routing, first-run Pyodide loading, correct/wrong solutions, timer cancellation, mobile navigation, backup import/export, and keyboard access in a real browser.

## License & creator

MIT License. Created and maintained by **[Ali Jabbary](https://alijabbary.com)**, AI/data practitioner and technical educator.

- [GitHub profile](https://github.com/ali-kin4)
- [Professional website](https://alijabbary.com)
