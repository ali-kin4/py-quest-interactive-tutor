// Left column: the problem statement, rendered from curriculum data.
import { href } from "../../app/router.js";
import { lessonForProblem } from "../../data/syllabus.js";
import { html, raw, richText } from "../dom.js";

const section = (label, body) => html`<section class="spec"><h3 class="eyebrow">${label}</h3>${raw(body)}</section>`;

export function renderProblemPanel(el, problem, { solved }) {
  el.innerHTML = html`
    <header class="problem-head">
      <span class="problem-icon" aria-hidden="true">
        <svg class="icon" viewBox="0 0 24 24"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>
      </span>
      <div>
        <p class="eyebrow">Problem no ${problem.number}</p>
        <div class="title-row">
          <h1 id="problemTitle">${problem.title}</h1>
          <span class="badge diff-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
          ${solved ? raw('<span class="badge solved-badge" title="All tests passed">✓ Solved</span>') : ""}
        </div>
        <p class="eyebrow session">≈ ${problem.minutes} minute session</p>
      </div>
    </header>
    ${lessonForProblem[problem.id] ? raw(html`
      <a class="learn-first" href="${href.learn(lessonForProblem[problem.id].id)}">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>
        <span><span class="eyebrow">Learn first</span>Lesson ${lessonForProblem[problem.id].number}: ${lessonForProblem[problem.id].title}</span>
      </a>`) : ""}
    <div class="problem-body">
      ${raw(section("Summary", html`<p>${richText(problem.summary)}</p>`))}
      ${raw(section("Problem statement", html`<p>${richText(problem.statement)}</p>`))}
      ${raw(section("Task", html`<p>${richText(problem.task)}</p>`))}
      ${raw(section("Examples", problem.examples.map((ex) => html`
        <div class="example">
          <h4>${ex.title}</h4>
          <div class="io-grid">
            <div><span class="eyebrow">Input</span><code class="io io-in">${ex.input}</code></div>
            <div><span class="eyebrow">Output</span><code class="io io-out">${ex.output}</code></div>
          </div>
          <span class="eyebrow">Explanation</span>
          <p>${richText(ex.explanation)}</p>
        </div>`).join("")))}
      ${raw(section("Input format", html`<p>${richText(problem.inputFormat)}</p>`))}
      ${raw(section("Output format", html`<p>${richText(problem.outputFormat)}</p>`))}
      ${raw(section("Constraints", html`<ul class="constraints">${problem.constraints.map((c) => raw(html`<li>${richText(c)}</li>`))}</ul>`))}
      ${raw(section("Concepts", html`<div class="tags">${problem.concepts.map((c) => raw(html`<button type="button" class="tag" data-concept="${c}" title="Ask the tutor about ${c}">${c}</button>`))}</div>`))}
    </div>`;
}
