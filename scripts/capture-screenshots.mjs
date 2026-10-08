// Regenerates the README screenshots in docs/images from the real app.
// Usage: npm run screenshots   (needs Playwright; PW_CHANNEL=chrome to use installed Chrome)
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { STORAGE_KEY } from "../src/app/store.js";
import { problemById } from "../src/data/curriculum.js";
import { lessons } from "../src/data/syllabus.js";
import { startServer } from "./serve.mjs";

const PORT = 8130;
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = "docs/images";

// A learner a few lessons in: realistic, not empty, not finished.
const done = lessons.slice(0, 6);
const solvedIds = ["invoice-total", "greet-customer", "reverse-words", "even-or-odd", "letter-grade", "discount-tier"];
const state = {
  version: 2,
  learner: "Ada Lovelace",
  theme: "light",
  lastLesson: "loops",
  lastProblem: "count-vowels",
  lessons: Object.fromEntries(done.map((l) => [l.id, { completed: true, completedAt: "2026-10-01T10:00:00.000Z", quiz: Object.fromEntries(l.quiz.map((q, i) => [i, q.answer])) }])),
  progress: Object.fromEntries(solvedIds.map((id) => [id, { attempts: 2, solved: true, solvedAt: "2026-10-01T10:00:00.000Z", hintsUsed: 1, bestPassed: problemById[id].tests.length }])),
  drafts: {},
};

const SOLUTION = 'def count_vowels(s):\n    vowels = set("aeiou")\n    count = 0\n    for char in s.lower():\n        if char in vowels:\n            count += 1\n    return count\n';

async function page(browser, viewport, theme = "light") {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, colorScheme: theme });
  await context.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, JSON.stringify({ ...state, theme })]);
  return context.newPage();
}

async function waitForPython(p) {
  await p.waitForFunction(() => document.querySelector("#runtimeStatus")?.dataset.state === "ready", null, { timeout: 120000 });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const server = await startServer(PORT);
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  try {
    // 1. Lesson with a run example.
    let p = await page(browser, { width: 1440, height: 900 });
    await p.goto(`${BASE}#/learn/loops`);
    await waitForPython(p);
    const example = p.locator(".example-block").nth(2);
    await example.locator("[data-run-example]").click();
    await example.locator(".example-output", { hasText: "ms" }).waitFor();
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: `${OUT}/lesson.png` });
    await example.scrollIntoViewIfNeeded();
    await p.evaluate(() => window.scrollBy(0, -120));
    await p.screenshot({ path: `${OUT}/lesson-example.png` });
    await p.locator("[data-question='0'] [data-option]").first().click();
    await p.locator("#quiz").scrollIntoViewIfNeeded();
    await p.evaluate(() => window.scrollBy(0, -90));
    await p.screenshot({ path: `${OUT}/lesson-quiz.png` });
    await p.context().close();

    // 2. Syllabus.
    p = await page(browser, { width: 1440, height: 1000 });
    await p.goto(`${BASE}#/syllabus`);
    await p.locator(".unit").first().waitFor();
    await p.screenshot({ path: `${OUT}/syllabus.png` });
    await p.context().close();

    // 3. Practice workspace: failing run with tutor diagnosis, then solved.
    p = await page(browser, { width: 1600, height: 1000 });
    await p.goto(`${BASE}#/practice/count-vowels`);
    await waitForPython(p);
    await p.locator("#runCode").click();
    await p.locator("#testSummary").waitFor();
    await p.locator("#hintButton").click();
    await p.locator("#practice-view .editor-input").fill(SOLUTION);
    await p.locator("#runCode").click();
    await p.locator(".alert-success").waitFor();
    await p.locator("#askInput").fill("Why use a set for the vowels?");
    await p.locator("#askInput").press("Enter");
    await p.waitForTimeout(600);
    await p.locator(".toast").evaluate((el) => (el.style.display = "none"));
    await p.screenshot({ path: `${OUT}/practice.png` });
    await p.context().close();

    // 4. Dark theme.
    p = await page(browser, { width: 1600, height: 1000 }, "dark");
    await p.goto(`${BASE}#/practice/two-sum`);
    await p.locator(".test-card").first().waitFor();
    await p.screenshot({ path: `${OUT}/practice-dark.png` });
    await p.context().close();

    // 5. Mobile.
    p = await page(browser, { width: 390, height: 844 });
    await p.goto(`${BASE}#/learn/strings`);
    await p.getByRole("heading", { name: "Working with Strings" }).waitFor();
    await p.screenshot({ path: `${OUT}/mobile-lesson.png` });
    await p.goto(`${BASE}#/practice/palindrome`);
    await p.getByRole("heading", { name: "Palindrome Check" }).waitFor();
    await p.locator("#tutorToggle").click();
    await p.locator("#tutorPanel.open").waitFor();
    await p.locator("#hintButton").click();
    await p.locator("#askInput").fill("What does isalnum do?");
    await p.locator("#askInput").press("Enter");
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/mobile-tutor.png` });
    await p.context().close();

    console.log(`Screenshots written to ${OUT}/`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
