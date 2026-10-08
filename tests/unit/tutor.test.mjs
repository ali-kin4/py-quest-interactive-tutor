import assert from "node:assert/strict";
import test from "node:test";
import { problemById } from "../../src/data/curriculum.js";
import { answer, diagnose, hint, summarize } from "../../src/tutor/engine.js";
import { lookupConcept } from "../../src/tutor/glossary.js";

const problem = problemById["count-vowels"];
const textOf = (reply) => reply.blocks.map((b) => b.text ?? b.code ?? b.items?.join(" ")).join(" ");
const result = (over) => ({ name: "Case", call: 'count_vowels("hello")', expected: "2", hidden: false, passed: false, actual: null, error: null, stdout: "", ms: 0, ...over });
const report = (results, extra = {}) => ({ compile_error: null, module_error: null, stdout: "", results, elapsed_ms: 1, ...extra });

test("hint ladder: hints, then scaffold, then solution offer", () => {
  problem.hints.forEach((h, i) => assert.match(textOf(hint(problem, i)), new RegExp(`Hint ${i + 1} of ${problem.hints.length}`)));
  const scaffold = hint(problem, problem.hints.length);
  assert.ok(scaffold.blocks.some((b) => b.kind === "code"));
  assert.ok(scaffold.actions.some((a) => a.id === "insert-scaffold"));
  assert.ok(hint(problem, problem.hints.length + 1).actions.some((a) => a.id === "reveal-solution"));
});

test("summarize separates visible and hidden results", () => {
  const s = summarize(report([result({ passed: true }), result({ hidden: true }), result({ hidden: true, passed: true })]));
  assert.deepEqual([s.passed, s.total, s.visiblePassed, s.hiddenPassed, s.hiddenTotal], [2, 3, 1, 1, 2]);
});

test("diagnose explains the untouched starter", () => {
  const r = report([result({ error: { type: "NotImplementedError", message: "Implement count_vowels", line: 6 } })]);
  const d = diagnose(problem, r);
  assert.match(textOf(d), /NotImplementedError/);
  assert.deepEqual(d.actions[0], { id: "goto-line", label: "Go to line 6", line: 6 });
});

test("diagnose recognises a missing return", () => {
  assert.match(textOf(diagnose(problem, report([result({ actual: "None" })]))), /missing `return`/);
});

test("diagnose recognises a string returned instead of a number", () => {
  assert.match(textOf(diagnose(problem, report([result({ actual: "'2'" })]))), /returned a string/);
});

test("diagnose points at hidden edge cases when visible tests pass", () => {
  const d = diagnose(problem, report([result({ passed: true, actual: "2" }), result({ hidden: true, actual: "1", expected: "0" })]));
  assert.match(textOf(d), /hidden case fails/);
});

test("diagnose handles syntax errors with a jump action", () => {
  const d = diagnose(problem, report([], { compile_error: { type: "SyntaxError", message: "expected ':'", line: 1 } }));
  assert.match(textOf(d), /colon/);
  assert.equal(d.actions[0].line, 1);
});

test("diagnose celebrates a full pass", () => {
  assert.match(textOf(diagnose(problem, report([result({ passed: true }), result({ passed: true, hidden: true })]))), /All 2 tests pass/);
});

test("answer routes intents", () => {
  assert.equal(answer(problem, "I'm stuck, can I get a hint?", { hintLevel: 0 }).intent, "hint");
  assert.match(textOf(answer(problem, "why is my code failing?", { hintLevel: 0 })), /Run your code first/);
  assert.match(textOf(answer(problem, "just give me the solution", { hintLevel: 0 })), /hold back/);
  assert.match(textOf(answer(problem, "What is a dictionary?", { hintLevel: 0 })), /Dictionaries/);
  assert.match(textOf(answer(problem, "show me an example", { hintLevel: 0 })), /count_vowels\("hello"\)/);
  assert.match(textOf(answer(problem, "asdfgh", { hintLevel: 0 })), /rule-based tutor/);
  assert.match(textOf(answer(problem, "Why use a set for the vowels?", { hintLevel: 0 })), /Sets/, "a 'why' question about a concept is not a failure diagnosis");
});

test("glossary lookup prefers specific terms and ignores word fragments", () => {
  assert.equal(lookupConcept("explain list comprehension").key, "comprehension");
  assert.equal(lookupConcept("what does modulo do").key, "modulus");
  assert.equal(lookupConcept("tell me about f-strings")?.key, "f-string");
  assert.equal(lookupConcept("pineapple"), null);
});

test("everyday words only match the glossary when they are the topic", () => {
  assert.equal(lookupConcept("Why use a set for the vowels?").key, "sets");
  assert.equal(lookupConcept("what is a for loop").key, "for");
  assert.equal(lookupConcept("explain return").key, "return");
  assert.equal(lookupConcept("can I return early if the list is empty"), null);
  assert.equal(lookupConcept("what does strip do").key, "strip");
});

test("every concept tag on every problem has a glossary explanation", async () => {
  const { problems } = await import("../../src/data/curriculum.js");
  for (const p of problems) {
    for (const concept of p.concepts) assert.ok(lookupConcept(`What is ${concept}?`), `${p.id}: no explanation for "${concept}"`);
  }
});
