// Bottom of the editor panel: Test cases / Console / Run insights.
import { summarize } from "../../tutor/engine.js";
import { html, raw } from "../dom.js";

const target = (
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>'
);

function testCard(result) {
  const state = result.passed ? "passed" : "failed";
  const output = result.passed
    ? html`<code class="io io-out">${result.actual}</code>`
    : result.error
      ? html`<code class="io io-error">${result.error.type}: ${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}</code>`
      : html`<code class="io io-error">${result.actual}</code>`;
  return html`
    <article class="test-card ${state}">
      <header><h4>${result.name}</h4><span class="badge badge-${state}">${result.passed ? "Passed" : "Failed"}</span></header>
      <div class="io-grid">
        <div><span class="eyebrow">Input</span><code class="io io-in">${result.call}</code></div>
        <div><span class="eyebrow">${result.passed ? "Output" : "Expected"}</span><code class="io io-out">${result.passed ? result.actual : result.expected}</code></div>
      </div>
      ${result.passed ? "" : raw(html`<div class="got"><span class="eyebrow">Your output</span>${raw(output)}</div>`)}
      ${result.stdout ? raw(html`<details class="stdout"><summary>Printed output</summary><pre>${result.stdout}</pre></details>`) : ""}
    </article>`;
}

/** Cards for visible tests before the first run, so learners see what is checked. */
function previewCards(problem) {
  return problem.tests
    .filter((t) => !t.hidden)
    .map((t) => html`
      <article class="test-card pending">
        <header><h4>${t.name}</h4><span class="badge badge-pending">Not run</span></header>
        <div class="io-grid">
          <div><span class="eyebrow">Input</span><code class="io io-in">${t.call}</code></div>
          <div><span class="eyebrow">Expected</span><code class="io io-out">${t.expected}</code></div>
        </div>
      </article>`)
    .join("");
}

export function renderTests(el, problem, report) {
  const visible = problem.tests.filter((t) => !t.hidden).length;
  const hiddenCount = problem.tests.length - visible;
  if (!report) {
    el.innerHTML = html`
      <div class="tests-box">
        <div class="tests-head"><h3>${raw(target)} Test Cases</h3><span class="muted">(${visible} visible, ${hiddenCount} hidden)</span></div>
        <div class="test-grid">${raw(previewCards(problem))}</div>
      </div>`;
    return;
  }
  if (report.compile_error) {
    const e = report.compile_error;
    el.innerHTML = html`
      <div class="tests-box">
        <div class="tests-head"><h3>${raw(target)} Test Cases</h3><span class="muted">Code could not run</span></div>
        <div class="alert alert-error"><strong>${e.type}</strong>${e.line ? ` on line ${e.line}` : ""}: ${e.message}
          ${e.line ? raw(html` <button type="button" class="link" data-goto-line="${e.line}">Go to line ${e.line}</button>`) : ""}</div>
      </div>`;
    return;
  }
  const s = summarize(report);
  const hiddenNote = s.hiddenTotal ? html`, ${s.hiddenPassed}/${s.hiddenTotal} hidden` : "";
  el.innerHTML = html`
    <div class="tests-box">
      <div class="tests-head">
        <h3>${raw(target)} Test Cases</h3>
        <span class="muted" id="testSummary">(${s.visiblePassed}/${s.visibleTotal} visible passed${raw(hiddenNote)})</span>
      </div>
      ${s.passed === s.total ? raw('<div class="alert alert-success" role="status"><strong>All tests passed.</strong> Problem solved — great work!</div>') : ""}
      <div class="test-grid">${raw(report.results.filter((r) => !r.hidden).map(testCard).join(""))}</div>
      ${s.hiddenTotal && s.hiddenPassed < s.hiddenTotal
        ? raw(html`<p class="hidden-note">${s.hiddenTotal - s.hiddenPassed} hidden ${s.hiddenTotal - s.hiddenPassed === 1 ? "test" : "tests"} failing — ask the tutor “why is my code failing?” for edge cases to check.</p>`)
        : ""}
    </div>`;
}

export function consoleText(report, problemTitle) {
  const stamp = new Date().toLocaleTimeString();
  const lines = [`[${stamp}] Ran ${problemTitle}`];
  if (report.compile_error) {
    const e = report.compile_error;
    lines.push(`  File "<editor>", line ${e.line ?? "?"}`, `${e.type}: ${e.message}`);
    return lines.join("\n");
  }
  if (report.stdout) lines.push(report.stdout.trimEnd());
  if (report.module_error) lines.push(`${report.module_error.type}: ${report.module_error.message} (line ${report.module_error.line ?? "?"})`);
  for (const r of report.results) {
    if (r.hidden) continue;
    if (r.stdout) lines.push(`>>> ${r.call}`, r.stdout.trimEnd());
    if (r.error) lines.push(`>>> ${r.call}`, `${r.error.type}: ${r.error.message}${r.error.line ? ` (line ${r.error.line})` : ""}`);
  }
  const s = summarize(report);
  lines.push(`Result: ${s.passed}/${s.total} tests passed in ${report.elapsed_ms} ms`);
  return lines.join("\n");
}

export function renderInsights(el, problem, report, progress, history) {
  if (!report) {
    el.innerHTML = html`<p class="empty">Run your code to see timing, pass rate and attempt history.</p>`;
    return;
  }
  const s = summarize(report);
  const slowest = [...(report.results ?? [])].sort((a, b) => b.ms - a.ms)[0];
  const stats = [
    ["Pass rate", s.total ? `${Math.round((100 * s.passed) / s.total)}%` : "—"],
    ["Run time", `${report.elapsed_ms ?? 0} ms`],
    ["Attempts", String(progress.attempts)],
    ["Hints used", String(progress.hintsUsed)],
  ];
  el.innerHTML = html`
    <div class="insights">
      <div class="stat-grid">${stats.map(([k, v]) => raw(html`<div class="stat"><span class="stat-value">${v}</span><span class="stat-label">${k}</span></div>`))}</div>
      ${slowest && !report.compile_error ? raw(html`<p class="muted">Slowest case: <code>${slowest.hidden ? "hidden case" : slowest.call}</code> — ${slowest.ms} ms.</p>`) : ""}
      <h4 class="eyebrow">This session</h4>
      <ol class="history">
        ${history.map((h) => raw(html`<li><span class="badge ${h.passed === h.total ? "badge-passed" : "badge-failed"}">${h.passed}/${h.total}</span> <span class="muted">${h.time}</span> ${h.note}</li>`))}
      </ol>
    </div>`;
}
