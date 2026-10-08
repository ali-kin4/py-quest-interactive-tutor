# Creating and reviewing PyQuest lessons

Lesson content lives in `src/curriculum.mjs` and is plain data. A lesson requires a stable ID, goal, three or more specific concepts, a precise explanation, a running code example, one multiple-choice knowledge check, and an executable challenge with at least three distinct test cases.

## Quality requirements

1. Start with a real task: invoice processing, data cleaning, reporting, sensor validation, or automation.
2. Define exact input/output contracts. State units, formatting, whitespace, boundaries and invalid-data behavior.
3. Include boundary and counterexample tests, not just happy paths.
4. Test example solution independently against all cases before shipping.
5. Keep the conceptual explanation approachable without obscuring correct terminology.
6. Make errors actionable. Do not claim that passing visible cases proves general correctness.
7. Don't claim remote, proctored, employer-verified or accredited assessment.
8. Avoid collection of personal data in prompts or example source code.
9. Run `npm run check` and manually run challenges through Pyodide in Chrome and Firefox before release.

## Learning-progress semantics

A challenge is complete only when **all available test cases pass**. Knowledge checks are tracked separately. Progress lives in the browser's localStorage and can be exported/imported as JSON. The report is self-reported, not independently verified.

## Security limitations

Pyodide runs downloaded WebAssembly locally. The browser worker improves responsiveness and lets the user stop runaway execution. It is **not** an isolation boundary for adversarial code: learner-written Python can have access to APIs exposed in the worker, including network capabilities. Never use this client-side demo to evaluate trusted exams or secret code, and never load credentials or personal customer data into the page.
