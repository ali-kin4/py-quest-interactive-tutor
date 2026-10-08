# Writing PyQuest problems

Problems are plain data in `src/data/tracks/*.js`. Each track file exports `{ id, title, description, problems }`; `src/data/curriculum.js` combines the tracks and numbers the problems in order.

## Problem schema

| Field | Purpose |
| --- | --- |
| `id` | Stable kebab-case ID used in URLs and saved progress. **Never rename a shipped ID.** |
| `title`, `difficulty`, `minutes` | Header and strip. `difficulty` is `Easy`, `Medium` or `Hard`. |
| `summary`, `statement`, `task` | The brief, from one-line summary to precise contract. Use `` `code` `` and `**bold**` sparingly. |
| `examples[]` | `{ title, input, output, explanation }`. `input` is the call, `output` the Python repr. |
| `inputFormat`, `outputFormat`, `constraints[]` | Exact types, ranges and edge-case rules. |
| `concepts[]` | Tags; matching keys in `src/tutor/glossary.js` make them clickable explanations. |
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
npm run test:e2e          # optional: full browser run (needs Playwright, see README)
```

`verify:solutions` fails if a reference solution misses any test, if a starter already passes every test, or if a scaffold has a syntax error.
