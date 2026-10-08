// End-to-end smoke test in Chromium: real UI, real Pyodide, real grading.
// Requires `npm install --no-save playwright` and `npx playwright install chromium`
// (or set PW_CHANNEL=chrome to use an installed Google Chrome).
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { startServer } from "../../scripts/serve.mjs";

const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}/`;
const SHOTS = "screenshots";

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const SOLUTION = 'def count_vowels(s):\n    return sum(1 for c in s.lower() if c in "aeiou")\n';

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const server = await startServer(PORT);
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && !/favicon/.test(m.text()) && errors.push(m.text()));

    // 0. Teaching lesson: run an editable example, take the quiz, complete the lesson.
    await page.goto(BASE);
    await page.getByRole("heading", { name: "Your First Python Program" }).waitFor();
    await page.screenshot({ path: `${SHOTS}/00-lesson.png` });
    const firstExample = page.locator(".example-block").first();
    await firstExample.locator(".editor-input").fill('print("edited", 6 * 7)');
    await firstExample.locator("[data-run-example]").click();
    await firstExample.locator(".example-output", { hasText: "edited 42" }).waitFor({ timeout: 120000 });
    const quiz = await page.evaluate(async () => (await import("./src/data/syllabus.js")).lessons[0].quiz.map((q) => q.answer));
    for (const [qi, answer] of quiz.entries()) {
      await page.locator(`[data-question="${qi}"] [data-option="${answer}"]`).click();
    }
    await page.locator(".complete-banner").waitFor();
    check(await page.locator(".nav-unit a.done").count() === 1, "Sidebar should show the lesson as done");
    await page.locator(".pager.next").click();
    await page.getByRole("heading", { name: "Variables & Data Types" }).waitFor();

    // 1. Practice workspace renders the requested problem with its strip, lesson link and tutor.
    await page.goto(`${BASE}#/practice/count-vowels`);
    await page.getByRole("heading", { name: "Count Vowels in a String" }).waitFor();
    check(await page.locator(".chip.active").innerText().then((t) => t.includes("Count Vowels")), "Active chip should be the current problem");
    check(await page.locator(".test-card.pending").count() === 3, "Expected 3 visible test previews before running");
    check((await page.locator(".learn-first").innerText()).includes("Repeating with Loops"), "Problem should link to the lesson that teaches it");
    await page.locator(".msg-tutor").first().waitFor();

    // 2. Untouched starter fails and the tutor diagnoses NotImplementedError.
    await page.locator("#runCode").click();
    await page.locator("#testSummary").waitFor({ timeout: 120000 });
    check((await page.locator("#testSummary").innerText()).includes("0/3 visible passed"), "Starter should fail all visible tests");
    await page.locator(".msg-tutor", { hasText: "NotImplementedError" }).waitFor();

    // 3. Hints walk the ladder.
    await page.locator("#hintButton").click();
    await page.locator(".msg-tutor", { hasText: "Hint 1 of 3" }).waitFor();

    // 4. A correct solution passes visible and hidden tests and marks the problem solved.
    const editor = page.locator("#practice-view .editor-input");
    await editor.fill(SOLUTION);
    await page.keyboard.press("Control+Enter");
    await page.locator(".alert-success").waitFor({ timeout: 30000 });
    check((await page.locator("#testSummary").innerText()).includes("3/3 visible passed, 2/2 hidden"), "All tests should pass");
    check(await page.locator(".chip.active.solved").count() === 1, "Chip should be marked solved");
    await page.screenshot({ path: `${SHOTS}/01-workspace-solved.png` });

    // 5. Console and insights tabs.
    await page.getByRole("tab", { name: "Console" }).click();
    check((await page.locator("#consoleOutput").innerText()).includes("5/5 tests passed"), "Console should report the run");
    await page.getByRole("tab", { name: "Run insights" }).click();
    check(await page.locator(".history li").count() === 2, "Insights should list both runs");

    // 6. Tutor answers a typed question.
    await page.locator("#askInput").fill("What is a dictionary?");
    await page.locator("#askInput").press("Enter");
    await page.locator(".msg-tutor", { hasText: "Dictionaries" }).waitFor();

    // 7. The Stop button kills an infinite loop and Python recovers on the next run.
    await editor.fill("def count_vowels(s):\n    while True:\n        pass\n");
    await page.locator("#runCode").click();
    await page.locator("#stopCode").waitFor({ state: "visible" });
    await page.locator("#stopCode").click();
    await page.locator("#runCode:not([disabled])").waitFor();
    await editor.fill(SOLUTION);
    await page.locator("#runCode").click();
    await page.locator(".alert-success").waitFor({ timeout: 120000 });

    // 8. Progress persists across reloads and shows on the syllabus page.
    await page.reload();
    await page.locator('[data-nav="syllabus"]').click();
    await page.getByRole("heading", { name: /from first line to real data/ }).waitFor();
    const stats = await page.locator(".stat-value").allInnerTexts();
    check(stats[0] === "1/14" && stats[1] === "1/30", `Syllabus should show 1 lesson and 1 problem done, got ${stats}`);
    await page.screenshot({ path: `${SHOTS}/02-syllabus.png`, fullPage: true });

    await page.locator('[data-nav="guide"]').click();
    await page.getByRole("heading", { name: /Learn a concept, then put it to work/ }).waitFor();

    // 9. Dark theme.
    await page.locator('[data-nav="practice"]').click();
    await page.locator("#themeToggle").click();
    await page.waitForTimeout(400); // let colour transitions finish
    await page.screenshot({ path: `${SHOTS}/03-workspace-dark.png` });

    // 10. Mobile layout: no horizontal overflow, tutor opens as a drawer.
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.on("pageerror", (e) => errors.push(e.message));
    await mobile.goto(`${BASE}#/learn/loops`);
    await mobile.getByRole("heading", { name: "Repeating with Loops" }).waitFor();
    check(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal overflow on mobile lesson");
    await mobile.screenshot({ path: `${SHOTS}/06-mobile-lesson.png` });
    await mobile.goto(`${BASE}#/lesson/two-sum`); // legacy link still opens the practice workspace
    await mobile.getByRole("heading", { name: "Two Sum" }).waitFor();
    check(await mobile.locator(".brand").evaluate((el) => el.getBoundingClientRect().top >= 0), "Header content is clipped on mobile");
    check(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal overflow on mobile");
    await mobile.screenshot({ path: `${SHOTS}/04-mobile.png`, fullPage: true });
    await mobile.locator("#tutorToggle").click();
    await mobile.locator("#tutorPanel.open").waitFor();
    await mobile.waitForTimeout(350);
    await mobile.screenshot({ path: `${SHOTS}/05-mobile-tutor.png` });
    await mobile.locator("#tutorClose").click();
    await mobile.locator("#tutorPanel.open").waitFor({ state: "detached" });

    check(errors.length === 0, `Browser errors: ${errors.join(" | ")}`);
    console.log("PASS: lessons, examples, quiz, workspace, grading, hints, tutor, stop/recover, persistence, syllabus, theme, mobile.");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
