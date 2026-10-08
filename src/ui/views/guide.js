// "How to use" page: workflow, shortcuts and honest limits.
import { problems } from "../../data/curriculum.js";
import { lessons } from "../../data/syllabus.js";
import { href } from "../../app/router.js";
import { html, raw } from "../dom.js";

const STEPS = [
  ["Follow the syllabus", "The Syllabus page lists every unit and lesson in order. Each lesson builds on the previous ones, so start at Lesson 1 unless you already know the basics."],
  ["Learn the concept", "Each lesson explains one topic in short sections. Every code example is editable — change it and press Run to see real Python output."],
  ["Check your understanding", "Finish the lesson quiz. Answering every question correctly completes the lesson (or mark it complete if you already know the material)."],
  ["Practise", "The lesson ends with practice problems that use what you just learned. In the workspace, replace the TODO and the raise NotImplementedError line with your function."],
  ["Run the tests", "Run code (Ctrl/⌘ + Enter) grades your function. Visible tests show input, expected and actual output; hidden tests check edge cases."],
  ["Use the tutor", "Get hint reveals progressively more specific hints, then a scaffold, then — if you want it — the reference solution. Ask “why is my code failing?” after a run for a diagnosis. Each problem also links back to the lesson that teaches it."],
  ["Track progress", "Lessons and problems are tracked in this browser. Export your progress as JSON from the profile menu to back it up or move it to another browser."],
];

const SHORTCUTS = [
  ["Ctrl/⌘ + Enter", "Run tests (or the lesson example you are editing)"],
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
          <h1 id="guideTitle">Learn a concept, then put it to work</h1>
          <p class="lead">PyQuest pairs ${lessons.length} guided lessons with ${problems.length} practice problems, a real Python runtime in your browser, instant test feedback and a tutor that nudges instead of solving for you.</p>
        </div>
        <a class="btn btn-primary" href="${href.learn(lessons[0].id)}">Start Lesson 1 →</a>
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
