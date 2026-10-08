import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseRoute } from "../../src/app/router.js";
import { createStore, sanitize, STORAGE_KEY } from "../../src/app/store.js";
import { lessons } from "../../src/data/syllabus.js";
import { escapeHTML, html, raw, richText } from "../../src/ui/dom.js";
import { highlightPython } from "../../src/ui/highlight.js";

const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), data };
};

test("router resolves lessons, practice, pages and legacy links", () => {
  const fb = { lesson: "strings", problem: "fizzbuzz" };
  assert.deepEqual(parseRoute("#/learn/loops", fb), { view: "learn", lessonId: "loops" });
  assert.deepEqual(parseRoute("#/learn/nope", fb), { view: "learn", lessonId: "strings" });
  assert.deepEqual(parseRoute("#/practice/two-sum", fb), { view: "practice", problemId: "two-sum" });
  assert.deepEqual(parseRoute("#/practice", fb), { view: "practice", problemId: "fizzbuzz" });
  assert.deepEqual(parseRoute("#/lesson/two-sum", fb), { view: "practice", problemId: "two-sum" });
  assert.deepEqual(parseRoute("#/curriculum", fb), { view: "syllabus" });
  assert.deepEqual(parseRoute("#/syllabus", fb), { view: "syllabus" });
  assert.deepEqual(parseRoute("", fb), { view: "learn", lessonId: "strings" });
  assert.deepEqual(parseRoute("#/admin", fb), { view: "learn", lessonId: "strings" });
});

test("store records runs, solves once, and persists", () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.recordRun("fizzbuzz", { passed: 2, total: 5 });
  assert.equal(store.isSolved("fizzbuzz"), false);
  store.recordRun("fizzbuzz", { passed: 5, total: 5 });
  assert.equal(store.isSolved("fizzbuzz"), true);
  assert.equal(store.progressOf("fizzbuzz").attempts, 2);
  assert.equal(store.progressOf("fizzbuzz").bestPassed, 5);
  store.saveDraft("fizzbuzz", "print(1)");
  const reloaded = createStore(storage);
  assert.equal(reloaded.isSolved("fizzbuzz"), true);
  assert.equal(reloaded.state.drafts.fizzbuzz, "print(1)");
});

test("store completes a lesson only when every quiz answer is right", () => {
  const store = createStore(memoryStorage());
  const lesson = lessons[0];
  lesson.quiz.forEach((q, i) => store.answerQuiz(lesson.id, i, i === 0 ? (q.answer + 1) % 4 : q.answer));
  assert.equal(store.isLessonDone(lesson.id), false);
  store.answerQuiz(lesson.id, 0, lesson.quiz[0].answer);
  assert.equal(store.isLessonDone(lesson.id), true);
  store.markLessonDone(lessons[1].id);
  assert.equal(store.lessonsDone(), 2);
});

test("store sanitizes untrusted imports", () => {
  const state = sanitize({
    learner: "  <b>Ada</b>  ",
    theme: "neon",
    lastProblem: "missing",
    progress: { fizzbuzz: { attempts: "3", solved: "yes", hintsUsed: -4 }, unknown: { solved: true } },
    drafts: { fizzbuzz: 42, "two-sum": "x = 1" },
    lessons: { loops: { completed: true, quiz: { 0: 2, 1: 9, 99: 1 } }, nope: { completed: true } },
    lastLesson: "nope",
  });
  assert.deepEqual(state.lessons, { loops: { completed: true, completedAt: null, quiz: { 0: 2 } } });
  assert.equal(state.lastLesson, "hello-python");
  assert.equal(state.learner, "<b>Ada</b>");
  assert.equal(state.theme, "system");
  assert.equal(state.lastProblem, "greet-customer");
  assert.deepEqual(state.progress.fizzbuzz, { attempts: 3, solved: false, solvedAt: null, hintsUsed: 0, bestPassed: 0 });
  assert.equal(state.progress.unknown, undefined);
  assert.deepEqual(state.drafts, { "two-sum": "x = 1" });
});

test("store survives corrupt storage and export/import round-trips", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, "{not json");
  const store = createStore(storage);
  assert.equal(store.solvedCount(), 0);
  store.recordRun("two-sum", { passed: 5, total: 5 });
  const other = createStore(memoryStorage());
  other.importJSON(store.exportJSON());
  assert.equal(other.isSolved("two-sum"), true);
  other.reset();
  assert.equal(other.solvedCount(), 0);
});

test("html escapes interpolations unless marked raw", () => {
  assert.equal(html`<p>${"<script>"}</p>`, "<p>&lt;script&gt;</p>");
  assert.equal(html`<p>${raw("<b>ok</b>")}</p>`, "<p><b>ok</b></p>");
  assert.equal(html`${["<i>", raw("<u>")]}`, "&lt;i&gt;<u>");
  assert.equal(escapeHTML(`"'&`), "&quot;&#39;&amp;");
  assert.equal(richText("use `x<y` and **bold**").value, "use <code>x&lt;y</code> and <strong>bold</strong>");
});

test("highlighter escapes code and classifies tokens", () => {
  const out = highlightPython('def f(s):\n    return "<a>" # done\n');
  assert.match(out, /<span class="tok-keyword">def<\/span>/);
  assert.match(out, /<span class="tok-def">f<\/span>/);
  assert.match(out, /<span class="tok-string">&quot;&lt;a&gt;&quot;<\/span>/);
  assert.match(out, /<span class="tok-comment"># done<\/span>/);
  assert.doesNotMatch(out, /<a>/);
});

test("page shell keeps required landmarks and controls", () => {
  const page = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  for (const id of ["learn-view", "practice-view", "syllabus-view", "guide-view", "codeEditor", "runCode", "stopCode", "problemChips", "tutorPanel", "hintButton", "askForm", "importInput"]) {
    assert.match(page, new RegExp(`id="${id}"`), `missing #${id}`);
  }
  assert.match(page, /class="skip-link"/);
  assert.match(page, /src="\.\/src\/main\.js"/);
});

test("runtime uses a module worker with timeouts and the shared harness", () => {
  const runner = readFileSync(new URL("../../src/runtime/python-runner.js", import.meta.url), "utf8");
  const worker = readFileSync(new URL("../../src/runtime/python-worker.js", import.meta.url), "utf8");
  assert.match(runner, /new Worker\(/);
  assert.match(runner, /RUN_TIMEOUT_MS = 15000/);
  assert.match(worker, /harness\.py/);
  assert.match(worker, /pyodide\/v0\.27\.7/);
});
