# CE 6300 Reliability Studio: lesson authoring guide

This static course lives inside `/kanu-ce6300/` in the PyQuest repository and works without a server, authentication or a database. Existing students' progress is held in localStorage (`rs-2026-progress`) and must not be reset when updating the course.

## Navigation model

1. **Course chapters** is the library index. `data.js` supplies `chapters` and 53 `concepts`. Topics follow textbook chapter order and current chapter-specific order in that array. `pageLessons()` shows one chapter at a time.
2. **Topic reader** is a full stand-alone explanation at `#topic/{concept.id}` and shows a sidebar with its chapter TOC plus Previous/Next topic controls across all nine chapters. Chapter 5 includes detailed bespoke sections from `expanded-lessons.js`.
3. **Study session** (`#lesson/{lesson.id}`) is a dated 120-minute *plan* combining several related topics. Its previous/next controls navigate only among dated sessions. These do not imply a tutoring booking.
4. **Chapter 5 quick recall** (`#review`) deliberately stays short and practice-first, following the learner's request.

## Extending Chapters 6–9 next

Use `expanded-lessons.json` as the editable source for per-topic **goal**, **explore** (headings and real explanatory paragraphs), **steps** (true calculation workflow), **decision** (when to use it), **recall** (understanding-based memory probes), and **challenge** (a fresh problem and worked solution). Keep topic IDs exactly equal to the IDs in `data.json`. After editing, run `python scripts/rebuild_expanded_lessons.py` to rebuild the browser-ready JS. Avoid placeholder text and formula-only lessons.

Required pedagogical standards: physical model and practical context, derived formula with every symbol and assumption, at least one complete numerical example with units and sanity check, two or more independent variations with solutions hidden until attempt, selection criteria against closely related methods, and short self-explanation questions. Check references and student-facing safety claims. Do not post copies of the copyrighted textbook, faculty slides, or instructor-only answer keys into this public repository.

When changing the core `concepts` table, edit `data.json` and regenerate `data.js` from JSON using the process documented in the source-package README.

## Release and QA

- Verify all script paths in `index.html` exist and math rendering works.
- Verify `node --check app.js` and `node --check expanded-lessons.js`.
- Test course chapter switching, topic reader navigation, first/last topics, cross-chapter Previous/Next, browser Back, bookmarking, notes, quiz, progress export/import, dark theme, desktop/mobile layout, and Chapter 5 review.
- Open a scoped PR for `/kanu-ce6300/` only; do not change the PyQuest root application.
- Confirm the GitHub Pages build/deploy succeeds before declaring the update live.
