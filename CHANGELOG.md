# Changelog

## 2.0.0 — Problem workspace

### Added
- Three-panel workspace: problem brief, code editor with test results, and a docked tutor.
- 30 problems across *Python Basics*, *Collections & Algorithms* and *Practical Python*, each with examples, constraints, a 3-step hint ladder, a scaffold, a reference solution, and visible plus hidden tests.
- Function-based grading harness (`src/runtime/harness.py`) shared by the browser and CI.
- `npm run verify:solutions`: every reference solution is graded with CPython in CI.
- Code editor with Python syntax highlighting, line numbers, auto-indent, Tab/Shift-Tab and Ctrl/⌘+Enter.
- Results tabs: test cards, console output, and run insights (timing, attempts, history).
- Local, rule-based tutor: progressive hints, run diagnosis, concept glossary, and a gated solution reveal.
- Curriculum page with per-track progress, a How-to-use page, light/dark themes, and a profile menu with JSON export/import and reset.
- Zero-dependency dev server (`npm start`) and a Playwright end-to-end test.

### Changed
- Reorganised the source into `src/app`, `src/data`, `src/runtime`, `src/tutor`, `src/ui` and `src/styles`. Tests live in `tests/unit` and `tests/e2e`.
- Progress is stored under a new key (`pyquest-workspace-v2`); v1 academy progress is not migrated because its lessons were replaced.

## 1.0.0 — Academy
- Dashboard-style academy with 12 stdin-based lessons, quizzes and Pyodide grading (PR #1).
