// Rule-based tutor. Deterministic, local and honest: it reads the problem data
// and the last grading report — it is not a language model and never sends
// code anywhere. Every reply is { blocks: [...], actions: [...] }.
import { GLOSSARY, lookupConcept } from "./glossary.js";

const text = (value) => ({ kind: "text", text: value });
const list = (items) => ({ kind: "list", items });
const codeBlock = (value) => ({ kind: "code", code: value.trimEnd() });
const reply = (blocks, actions = []) => ({ role: "tutor", blocks, actions });

const fnName = (problem) => problem.starter.match(/def\s+([A-Za-z_]\w*)/)?.[1] ?? "your function";

/** Summary of a harness report used by the tutor and the UI. */
export function summarize(report) {
  const results = report?.results ?? [];
  const visible = results.filter((r) => !r.hidden);
  const hiddenResults = results.filter((r) => r.hidden);
  return {
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    visibleTotal: visible.length,
    visiblePassed: visible.filter((r) => r.passed).length,
    hiddenTotal: hiddenResults.length,
    hiddenPassed: hiddenResults.filter((r) => r.passed).length,
    firstVisibleFailure: visible.find((r) => !r.passed) ?? null,
    firstFailure: results.find((r) => !r.passed) ?? null,
    error: report?.compile_error ?? null,
  };
}

/** Progressive hints: hints[0..n-1], then the scaffold, then a solution offer. */
export function hint(problem, level) {
  const hints = problem.hints;
  if (level < hints.length) {
    return reply(
      [text(`**Hint ${level + 1} of ${hints.length}.** ${hints[level]}`)],
      [{ id: "hint", label: level + 1 < hints.length ? "Next hint" : "Show a scaffold" }],
    );
  }
  if (level === hints.length) {
    return reply(
      [text("Here's a partial scaffold to help you get started — fill in the `...` parts:"), codeBlock(problem.scaffold)],
      [{ id: "insert-scaffold", label: "Insert scaffold into editor" }, { id: "hint", label: "I'm still stuck" }],
    );
  }
  return reply(
    [
      text("You've seen every hint and the scaffold. Before revealing a full answer, try tracing one example by hand — write down each variable's value line by line."),
      text("If you still want it, you can reveal the reference solution. Your progress is kept, and the solution is a learning aid rather than the only correct answer."),
    ],
    [{ id: "reveal-solution", label: "Reveal reference solution" }],
  );
}

function errorAdvice(problem, error) {
  const name = fnName(problem);
  const msg = error.message ?? "";
  const at = error.line ? ` (line ${error.line})` : "";
  switch (error.type) {
    case "NotImplementedError":
      return [
        text(`The starter's \`raise NotImplementedError(...)\` line is still running${at}.`),
        text("Write your logic, make sure the function `return`s before that line — or delete the `raise` line once you're done."),
      ];
    case "SyntaxError":
    case "IndentationError":
    case "TabError": {
      const tips = [];
      if (/expected ':'/.test(msg)) tips.push("Lines that start a block (`def`, `if`, `for`, `while`, `else`…) must end with a colon `:`.");
      if (/indent/i.test(msg) || error.type !== "SyntaxError") tips.push("Python uses indentation to group code. Keep every line of a block at the same depth — 4 spaces per level.");
      if (/unterminated|EOL|EOF/i.test(msg)) tips.push("A string or bracket is not closed. Check quotes and parentheses on that line and the line before.");
      if (/never closed|unmatched|does not match/i.test(msg)) tips.push("A bracket is unbalanced — count your `(`, `[` and `{`.");
      if (!tips.length) tips.push("Look at the end of the previous line too — the real mistake is often just before where Python noticed it.");
      return [text(`Python couldn't read your code: **${error.type}: ${msg}**${at}.`), list(tips)];
    }
    case "NameError": {
      const missing = msg.match(/name '(\w+)'/)?.[1];
      if (missing === name) return [text(`The tests call \`${name}\`, but no function with that exact name exists. Check the \`def\` line spelling.`)];
      return [
        text(`\`${missing ?? "A name"}\` is used before it exists${at}.`),
        list(["Check the spelling and capitalisation.", "Assign a variable before reading it.", "Variables created inside another function are not visible here."]),
      ];
    }
    case "TypeError":
      if (/NoneType/.test(msg)) return [text(`Something is \`None\`${at}: ${msg}.`), text("A frequent cause: calling a method that returns `None` (like `list.append` or `list.sort`) and using its result, or a helper function that forgot to `return`.")];
      if (/positional argument|takes|missing \d+ required/.test(msg)) return [text(`The function signature doesn't match how the tests call it: ${msg}.`), text(`Keep the parameters from the starter: \`${problem.starter.match(/def .*:/)?.[0] ?? name}\`.`)];
      if (/can only concatenate|unsupported operand|not supported between/.test(msg)) return [text(`Mixed types in one operation${at}: ${msg}.`), text("Convert explicitly — `int(...)`, `float(...)` or `str(...)` — so both sides have the same type.")];
      return [text(`**TypeError**${at}: ${msg}. A value has a different type than your code expects — print it with \`print(type(x), x)\` to check.`)];
    case "ZeroDivisionError":
      return [text(`Division by zero${at}. Is there an input where the list is empty or a count is 0? Guard that case before dividing.`)];
    case "IndexError":
      return [text(`An index is out of range${at}: ${msg}.`), list(["Indexes run from 0 to len(seq) - 1.", "Check empty inputs before reading seq[0].", "In loops, make sure the stop value isn't one past the end."])];
    case "KeyError":
      return [text(`Missing dictionary key ${msg}${at}.`), text("Use `d.get(key, default)` or initialise the key before incrementing it.")];
    case "AttributeError":
      return [text(`${msg}${at}.`), text("You're calling a method on a type that doesn't have it — e.g. a string method on a list, or anything on `None`.")];
    case "ValueError":
      return [text(`A conversion failed${at}: ${msg}.`), text("If bad input is expected, wrap the conversion in `try` / `except ValueError` and handle it as the task describes.")];
    case "RecursionError":
      return [text("Your function keeps calling itself without stopping. Every recursive function needs a base case that returns without recursing.")];
    case "EOFError":
      return [text(`\`input()\` isn't used in these exercises — the tests pass values as arguments to \`${name}\`. Use the function parameters instead.`)];
    default:
      return [text(`**${error.type}**${at}: ${msg}`)];
  }
}

function mismatchAdvice(failure) {
  const { actual, expected, call } = failure;
  const blocks = [text(`For \`${call}\` the expected result is \`${expected}\`, but your function returned \`${actual}\`.`)];
  const num = (v) => (/^-?\d+(\.\d+)?(e-?\d+)?$/.test(v) ? Number(v) : NaN);
  if (actual === "None") blocks.push(text("Returning `None` usually means a missing `return` statement, or a `print(...)` where a `return` should be."));
  else if (/^['"]/.test(actual) && !/^['"]/.test(expected)) blocks.push(text("You returned a string, but a number/collection is expected. Return the value itself rather than formatting it as text."));
  else if (!/^['"]/.test(actual) && /^['"]/.test(expected)) blocks.push(text("A string is expected here. Check the exact text, including capitalisation and punctuation."));
  else if (!Number.isNaN(num(actual)) && !Number.isNaN(num(expected))) {
    const diff = Math.abs(num(actual) - num(expected));
    blocks.push(text(diff < 0.05 ? "The numbers are close — check your rounding (`round(x, 2)`)." : "The numbers are off. Trace the example by hand and compare each intermediate value — a boundary like `>` vs `>=` is a common cause."));
  } else if (/^\[/.test(actual) && /^\[/.test(expected)) blocks.push(text("Compare the lists element by element — is the order right, and are any items missing or extra?"));
  else if (/^['"]/.test(actual) && /^['"]/.test(expected)) blocks.push(text("Compare the two strings character by character — watch for spaces, capitalisation and punctuation."));
  return blocks;
}

/** Explain the most important thing about the last run. */
export function diagnose(problem, report) {
  if (!report) return reply([text("Run your code first (**Run code** or Ctrl/⌘ + Enter). I'll then read the results and tell you what to look at.")]);
  const s = summarize(report);
  if (s.error) {
    const actions = s.error.line ? [{ id: "goto-line", label: `Go to line ${s.error.line}`, line: s.error.line }] : [];
    return reply(errorAdvice(problem, s.error), actions);
  }
  if (s.passed === s.total) {
    return reply([
      text(`**All ${s.total} tests pass — including ${s.hiddenTotal} hidden.** Nicely done.`),
      text("Optional polish: could the code be shorter or clearer? Would it still work for very large inputs? When you're ready, move on to the next problem."),
    ], [{ id: "next-problem", label: "Next problem →" }]);
  }
  if (report.module_error && report.module_error.type !== "NotImplementedError") {
    const e = report.module_error;
    return reply([text("Your file raises an error as soon as it runs, before any test can call your function:"), ...errorAdvice(problem, e)], e.line ? [{ id: "goto-line", label: `Go to line ${e.line}`, line: e.line }] : []);
  }
  const failure = s.firstVisibleFailure ?? s.firstFailure;
  if (failure.error) {
    const actions = failure.error.line ? [{ id: "goto-line", label: `Go to line ${failure.error.line}`, line: failure.error.line }] : [];
    const intro = failure.hidden ? [text("A hidden test crashed your code:")] : [text(`While running \`${failure.call}\`:`)];
    return reply([...intro, ...errorAdvice(problem, failure.error)], actions);
  }
  if (!failure.hidden) return reply(mismatchAdvice(failure), [{ id: "hint", label: "Give me a hint" }]);
  const remaining = s.hiddenTotal - s.hiddenPassed;
  return reply([
    text(`Every visible test passes, but **${remaining} hidden ${remaining === 1 ? "case fails" : "cases fail"}**. Hidden tests probe edge cases. Check these against the constraints:`),
    list(["Empty input (\"\", [], 0)", "A single element", "Exact boundary values", "Negative numbers", "Unusual capitalisation or extra whitespace", ...problem.constraints]),
  ], [{ id: "hint", label: "Give me a hint" }]);
}

const INTENTS = [
  { id: "greet", re: /^\s*(hi|hello|hey|yo|salam|good (morning|afternoon|evening))\b/i },
  { id: "solution", re: /\b(solution|answer|full code|solve it|give me the code|just tell me)\b/i },
  { id: "diagnose", re: /\b(why|fail|failing|wrong|error|bug|broken|not work|doesn'?t work|crash|traceback|exception)\b/i },
  { id: "hint", re: /\b(hint|stuck|help|start|begin|approach|how (do|should|can) i|where do i|next step)\b/i },
  { id: "example", re: /\b(example|sample|demo)\b/i },
  { id: "hidden", re: /\b(hidden|test cases?|tests)\b/i },
  { id: "spec", re: /\b(input format|output format|constraint|return type|what should .* return|signature)\b/i },
  { id: "complexity", re: /\b(complexity|big ?o|efficien|faster|optimi[sz]e|performance)\b/i },
  { id: "explain", re: /\b(what (is|are|does)|explain|meaning|mean|difference between|how does)\b/i },
  { id: "thanks", re: /\b(thanks|thank you|thx|cheers)\b/i },
];

/**
 * Answer a free-text question.
 * @param {object} problem
 * @param {string} question
 * @param {{report?: object, hintLevel: number}} ctx
 */
export function answer(problem, question, ctx = { hintLevel: 0 }) {
  const q = String(question ?? "").trim();
  const intent = INTENTS.find((i) => i.re.test(q))?.id;
  const concept = lookupConcept(q);

  switch (intent) {
    case "greet":
      return reply([text(`Hi! We're working on **${problem.title}**. Ask me about a Python concept, why a test fails, or press **Get hint** for a nudge.`)]);
    case "thanks":
      return reply([text("Any time. Keep going — you're building real skill.")]);
    case "solution":
      return reply(
        [text("I'll hold back the full answer for now — you learn far more by getting there yourself. Hints get progressively more specific, and after the scaffold you can reveal the reference solution.")],
        [{ id: "hint", label: "Get a hint instead" }],
      );
    case "diagnose":
      return diagnose(problem, ctx.report);
    case "hint":
      return { ...hint(problem, ctx.hintLevel ?? 0), intent: "hint" };
    case "example": {
      const blocks = [text("Here's how the examples work:")];
      for (const ex of problem.examples) blocks.push(codeBlock(`${ex.input}\n# → ${ex.output}`), text(ex.explanation));
      return reply(blocks);
    }
    case "hidden":
      return reply([
        text(`This problem has ${problem.tests.filter((t) => !t.hidden).length} visible and ${problem.tests.filter((t) => t.hidden).length} hidden tests. Hidden tests use the same rules but check edge cases, so your solution must follow the statement — not just the examples.`),
        text("Tests run in your browser and are not a secure exam: they're feedback, not certification."),
      ]);
    case "spec":
      return reply([
        text(`**Input:** ${problem.inputFormat}`),
        text(`**Output:** ${problem.outputFormat}`),
        list(problem.constraints),
      ]);
    case "complexity":
      return reply([text(GLOSSARY.algorithms.text), text(`For this problem the constraints are: ${problem.constraints.join("; ")}.`)]);
    default:
      break;
  }
  if (concept) return reply([text(`**${concept.title}.** ${concept.text}`), codeBlock(concept.example)]);
  if (intent === "explain") {
    const related = problem.concepts.map((c) => GLOSSARY[c] && c).filter(Boolean);
    return reply([text("I don't have an explanation for that term yet. Concepts used in this problem:"), list(related.length ? related : problem.concepts)]);
  }
  return reply([
    text(`I'm a local, rule-based tutor, so I understand a focused set of questions. For **${problem.title}**, try asking:`),
    list([
      "“Why is my code failing?”",
      `“What is ${problem.concepts[0]}?”`,
      "“Show me an example”",
      "“What are the hidden tests?”",
    ]),
  ], [{ id: "hint", label: "Get hint" }]);
}

/** Greeting shown when a problem opens. */
export function welcome(problem) {
  return reply([
    text(`Ready for **${problem.title}**? ${problem.summary}`),
    text("Ask me anything about the problem or Python, or press **Get hint** for a step-by-step nudge."),
  ]);
}
