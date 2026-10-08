// "How to use" page: workflow, shortcuts and honest limits.
import { problems } from "../../data/curriculum.js";
import { href } from "../../app/router.js";
import { html, raw } from "../dom.js";

const STEPS = [
  ["Pick a problem", "Use the track menu and the numbered chips above the workspace, or browse the Curriculum page. Problems get harder within each track."],
  ["Read the brief", "The left panel has the summary, full statement, task, worked examples, input/output format and constraints. Click a concept tag to ask the tutor about it."],
  ["Write your function", "Replace the TODO and the raise NotImplementedError line in the editor. Your draft is saved in this browser as you type."],
  ["Run the tests", "Run code (Ctrl/⌘ + Enter) executes real Python 3 in your browser. Visible tests show input, expected and actual output; hidden tests check edge cases."],
  ["Use the tutor", "Get hint reveals progressively more specific hints, then a scaffold, then — if you want it — the reference solution. Ask “why is my code failing?” after a run for a diagnosis."],
  ["Track progress", "A problem is solved when every visible and hidden test passes. Export your progress as JSON from the profile menu to back it up or move it to another browser."],
];

const SHORTCUTS = [
  ["Ctrl/⌘ + Enter", "Run tests"],
  ["Tab / Shift + Tab", "Indent / dedent (works on selections)"],
  ["Enter", "New line with automatic indentation"],
  ["Esc", "Leave the editor so Tab moves focus again"],
  ["Alt + ← / →", "Previous / next problem"],
];

export function renderGuide(el) {
  el.innerHTML = html`
    <div class="page-inner narrow">
      <header class="page-head">
        <div>
          <p class="eyebrow">How to use</p>
          <h1 id="guideTitle">Learn by solving, one function at a time</h1>
          <p class="lead">PyQuest is a practice workspace: ${problems.length} focused problems, a real Python runtime in your browser, instant test feedback and a tutor that nudges instead of solving for you.</p>
        </div>
        <a class="btn btn-primary" href="${href.lesson(problems[0].id)}">Open the first problem →</a>
      </header>

      <ol class="steps">
        ${STEPS.map(([title, body], i) => raw(html`<li class="step card"><span class="step-num">${i + 1}</span><div><h2>${title}</h2><p>${body}</p></div></li>`))}
      </ol>

      <section class="card guide-section" aria-labelledby="shortcutsTitle">
        <h2 id="shortcutsTitle">Keyboard shortcuts</h2>
        <dl class="shortcuts">
          ${SHORTCUTS.map(([keys, what]) => raw(html`<div><dt><kbd>${keys}</kbd></dt><dd>${what}</dd></div>`))}
        </dl>
      </section>

      <section class="card guide-section" aria-labelledby="limitsTitle">
        <h2 id="limitsTitle">What to know</h2>
        <ul class="plain-list">
          <li><strong>Python runs locally.</strong> The first run downloads Pyodide (CPython compiled to WebAssembly, ~10 MB) from jsDelivr; after that it is cached by your browser.</li>
          <li><strong>The tutor is rule-based.</strong> It reads the problem and your latest test report to give hints and diagnoses. It is not a large language model and nothing you type leaves your browser.</li>
          <li><strong>Tests are feedback, not certification.</strong> Grading happens in your browser, so it is not a secure exam and is not a security sandbox for untrusted code.</li>
          <li><strong>Runs stop after 15 seconds.</strong> Infinite loops are terminated and Python reloads on the next run.</li>
          <li><strong>Progress lives in this browser.</strong> Clearing site data erases it — export a backup from the profile menu.</li>
        </ul>
      </section>
    </div>`;
}
