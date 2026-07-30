# PyQuest Interactive Tutor

A zero-setup Python learning experience that combines concise instruction, guided checks, and executable coding challenges in the browser.

PyQuest is designed as a focused demonstration of interactive technical education: learners move from an explanation of Python logic to short knowledge checks, then solve CS50P-style exercises against automated test cases.

## What it demonstrates

- **Python in the browser:** Pyodide executes learner code without a local Python installation.
- **Immediate feedback:** submitted solutions are evaluated against structured test cases.
- **Progressive learning:** lesson, quiz, and coding stages move from understanding to application.
- **Five practice problems:** exercises cover input handling, branching, pattern matching, functions, and time conversion.
- **Responsive interface:** the single-page experience works across desktop and mobile layouts.
- **No backend required:** the project is a static HTML application and can be hosted on any static site service.

## Try it locally

Clone the repository and serve the folder with any static web server:

```bash
git clone https://github.com/ali-kin4/py-quest-interactive-tutor.git
cd py-quest-interactive-tutor
python -m http.server 8000
```

Then open `http://localhost:8000`.

The page loads Pyodide and its interface dependencies from public CDNs, so an internet connection is required on first load.

## Technical design

The project intentionally keeps deployment simple:

- `index.html` contains the interface, lesson content, application state, and grading logic.
- Pyodide provides the Python runtime inside the browser.
- Test execution captures standard input and output, compares results with expected values, and returns per-case feedback.
- Tailwind CSS, Font Awesome, Google Fonts, and Three.js support the visual experience.

## Educational scope

The current module focuses on Python conditional logic and related CS50P practice. It is a compact learning prototype rather than a complete course or a replacement for the official CS50P materials.

## License

Released under the [MIT License](LICENSE).

## Author

Built by [Ali Jabbary](https://alijabbary.com), a licensed Professional Engineer creating practical AI, scientific-computing, and technical-learning systems.
