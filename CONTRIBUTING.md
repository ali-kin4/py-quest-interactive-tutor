# Contributing

Thanks for helping improve PyQuest!

## Setup

```bash
git clone https://github.com/ali-kin4/py-quest-interactive-tutor.git
cd py-quest-interactive-tutor
npm start            # http://127.0.0.1:8000 (Node 20+, no install needed)
```

## Checks

| Command | What it does | Needs |
| --- | --- | --- |
| `npm test` | Unit tests: curriculum and lesson schemas, syllabus rules, tutor engine, store, router, escaping, highlighter | Node 20+ |
| `npm run verify:solutions` | Grades every reference solution and starter with the real harness | Python 3.10+ |
| `npm run verify:lessons` | Runs every lesson example and checks its documented output | Python 3.10+ |
| `npm run check` | All of the above | |
| `npm run test:e2e` | Full browser run with real Pyodide; writes `screenshots/` | `npm i --no-save playwright` + `npx playwright install chromium` (or `PW_CHANNEL=chrome`) |

| `npm run screenshots` | Regenerates the README images from the real app | Playwright (as above) |

CI runs the unit tests, both verifiers and the end-to-end test on every pull request.

## Guidelines

- No build step and no runtime dependencies. Keep the site deployable by copying files.
- Escape all dynamic text (use the `html` tag from `src/ui/dom.js`).
- New lessons or problems: follow [docs/LESSON_AUTHORING.md](docs/LESSON_AUTHORING.md).
- UI changes: regenerate the README screenshots with `npm run screenshots`.
- Security issues: report them privately, see [SECURITY.md](SECURITY.md).
- Be kind: see the [Code of Conduct](CODE_OF_CONDUCT.md).
- Keep accessibility intact: keyboard paths, focus styles, labels and contrast in both themes.
- Use conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
