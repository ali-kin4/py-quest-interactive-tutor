# Security Policy

## Supported versions

PyQuest is a static site deployed continuously from `main`. Only the latest commit on `main` (the live site at https://ali-kin4.github.io/py-quest-interactive-tutor/) receives security fixes.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately through GitHub: go to the repository's **Security** tab → **Report a vulnerability** ([direct link](https://github.com/ali-kin4/py-quest-interactive-tutor/security/advisories/new)). Include:

- what an attacker can do, and against whom (the learner, other visitors, the repository);
- steps or a minimal proof of concept to reproduce it;
- the affected file(s) or URL.

You can expect an acknowledgement within 5 working days and a status update at least every 14 days until the report is resolved. Confirmed issues are fixed on `main` and credited in the advisory unless you prefer to stay anonymous.

## Scope and threat model

PyQuest has no backend, accounts, cookies or analytics. All state lives in the visitor's own `localStorage`. The relevant risks are:

| In scope | Examples |
| --- | --- |
| Script injection in the page | Curriculum, imported progress files or learner text rendered as HTML instead of text |
| Unsafe handling of imported progress | A crafted JSON file that breaks the app or injects markup |
| Supply chain | Changes to the pinned Pyodide CDN URL, GitHub Actions or dev dependencies |

| Out of scope (by design) | Why |
| --- | --- |
| Python code escaping the Web Worker | The worker is documented as **not** a sandbox. Learner code runs with the visitor's own browser privileges, against their own session. |
| Bypassing the tests or the quiz | Grading runs on the client and is feedback, not a credential. |
| Reading the reference solutions | Solutions ship with the page so the tutor can reveal them. |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#security-model) for the controls that are in place: escaping, import sanitisation, and pinned dependencies.
