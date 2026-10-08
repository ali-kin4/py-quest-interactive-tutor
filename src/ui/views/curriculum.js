// Curriculum page: overall progress plus every track and problem.
import { problems, problemsInTrack, totalMinutes, tracks } from "../../data/curriculum.js";
import { href } from "../../app/router.js";
import { html, raw } from "../dom.js";

export function renderCurriculum(el, store) {
  const solved = store.solvedCount();
  const pct = Math.round((100 * solved) / problems.length);
  const attempted = problems.filter((p) => store.progressOf(p.id).attempts > 0).length;
  const minutes = problems.filter((p) => store.isSolved(p.id)).reduce((n, p) => n + p.minutes, 0);
  const next = problems.find((p) => !store.isSolved(p.id));

  el.innerHTML = html`
    <div class="page-inner">
      <header class="page-head">
        <div>
          <p class="eyebrow">Curriculum</p>
          <h1 id="curriculumTitle">${tracks.length} tracks · ${problems.length} problems</h1>
          <p class="lead">Each problem has a statement, worked examples, visible and hidden tests, progressive hints and a reference solution verified in CI. About ${Math.round(totalMinutes / 60)} hours of practice in total.</p>
        </div>
        ${next ? raw(html`<a class="btn btn-primary" href="${href.lesson(next.id)}">${solved ? "Continue" : "Start"} with ${next.number}. ${next.title} →</a>`) : raw('<span class="badge badge-passed">Curriculum complete 🎉</span>')}
      </header>

      <div class="stat-grid stat-grid-4">
        <div class="stat card"><span class="stat-value">${solved}/${problems.length}</span><span class="stat-label">Problems solved</span>
          <div class="meter" role="progressbar" aria-label="Overall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div></div>
        <div class="stat card"><span class="stat-value">${attempted}</span><span class="stat-label">Problems attempted</span></div>
        <div class="stat card"><span class="stat-value">${minutes} min</span><span class="stat-label">Practice completed</span></div>
        <div class="stat card"><span class="stat-value">${problems.reduce((n, p) => n + store.progressOf(p.id).hintsUsed, 0)}</span><span class="stat-label">Hints used</span></div>
      </div>

      ${tracks.map((track) => {
        const list = problemsInTrack(track.id);
        const done = list.filter((p) => store.isSolved(p.id)).length;
        const trackPct = Math.round((100 * done) / list.length);
        return raw(html`
          <section class="track card" aria-labelledby="track-${track.id}">
            <header class="track-head">
              <div>
                <h2 id="track-${track.id}">${track.title}</h2>
                <p class="muted">${track.description}</p>
              </div>
              <div class="track-progress">
                <span>${done}/${list.length} solved</span>
                <div class="meter" role="progressbar" aria-label="${track.title} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${trackPct}"><span style="width:${trackPct}%"></span></div>
              </div>
            </header>
            <ol class="problem-list">
              ${list.map((p) => {
                const prog = store.progressOf(p.id);
                const status = prog.solved ? "solved" : prog.attempts ? "attempted" : "new";
                const label = { solved: "Solved", attempted: `${prog.bestPassed}/${p.tests.length} passing`, new: "Not started" }[status];
                return raw(html`
                  <li>
                    <a class="problem-row status-${status}" href="${href.lesson(p.id)}">
                      <span class="num">${p.number}</span>
                      <span class="row-main"><strong>${p.title}</strong><span class="muted">${p.summary}</span></span>
                      <span class="badge diff-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                      <span class="row-meta muted">${p.minutes} min</span>
                      <span class="status-pill">${label}</span>
                    </a>
                  </li>`);
              })}
            </ol>
          </section>`);
      })}
    </div>`;
}
