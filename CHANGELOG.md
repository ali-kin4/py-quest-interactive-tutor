# Changelog

## 2.1.0 — Teaching syllabus

### Added
- A full syllabus: 14 lessons in 5 units (Getting Started → Applied Python). Each lesson has objectives, explanations, 98 editable and runnable examples in total, callouts, key takeaways, common mistakes and a quiz (55 questions overall).
- A lesson reader with a syllabus sidebar, in-place example execution, quiz-based completion (or *Mark as complete*), practice links and previous/next navigation.
- A syllabus page with per-unit progress and each lesson's practice problems. Problems show a "Learn first" link back to their lesson.
- `npm run verify:lessons` (in CI): every example is executed and its output must match the lesson text.
- `npm run screenshots`: regenerates the README images from the real app.
- Glossary entries for every problem concept tag, enforced by a unit test.
- SECURITY.md, CODE_OF_CONDUCT.md, issue and PR templates, CODEOWNERS and Dependabot for GitHub Actions.

### Changed
- Navigation is now Lessons · Practice · Syllabus · How to use. Old `#/lesson/<problem>` and `#/curriculum` links still work.
- The tutor no longer treats every “why …?” question as a request to diagnose a failing run, and everyday words like “for” no longer trigger keyword explanations.
- Test-case inputs and outputs no longer break mid-token, and the phone navigation fits on one line.

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
