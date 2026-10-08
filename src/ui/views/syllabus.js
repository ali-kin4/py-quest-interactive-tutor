// Syllabus page: every unit, lesson and the practice problems each lesson unlocks.
import { href } from "../../app/router.js";
import { problemById, problems, totalMinutes } from "../../data/curriculum.js";
import { lessons, lessonsInUnit, totalLessonMinutes, units } from "../../data/syllabus.js";
import { html, raw } from "../dom.js";

export function renderSyllabus(el, store) {
  const lessonsDone = store.lessonsDone();
  const solved = store.solvedCount();
  const next = lessons.find((l) => !store.isLessonDone(l.id));
  const hours = Math.round((totalLessonMinutes + totalMinutes) / 60);
  const pct = (n, of) => Math.round((100 * n) / of);

  el.innerHTML = html`
    <div class="page-inner">
      <header class="page-head">
        <div>
          <p class="eyebrow">Syllabus</p>
          <h1 id="syllabusTitle">Python, from first line to real data</h1>
          <p class="lead">${units.length} units · ${lessons.length} lessons · ${problems.length} practice problems · about ${hours} hours. Each lesson teaches a concept with runnable examples and a quiz, then unlocks practice problems that use exactly what you just learned.</p>
        </div>
        ${next
          ? raw(html`<a class="btn btn-primary" href="${href.learn(next.id)}">${lessonsDone ? "Continue" : "Start"}: Lesson ${next.number} →</a>`)
          : raw('<span class="badge badge-passed">All lessons complete 🎉</span>')}
      </header>

      <div class="stat-grid stat-grid-4">
        <div class="stat card"><span class="stat-value">${lessonsDone}/${lessons.length}</span><span class="stat-label">Lessons completed</span>
          <div class="meter" role="progressbar" aria-label="Lessons completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct(lessonsDone, lessons.length)}"><span style="width:${pct(lessonsDone, lessons.length)}%"></span></div></div>
        <div class="stat card"><span class="stat-value">${solved}/${problems.length}</span><span class="stat-label">Problems solved</span>
          <div class="meter" role="progressbar" aria-label="Problems solved" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct(solved, problems.length)}"><span style="width:${pct(solved, problems.length)}%"></span></div></div>
        <div class="stat card"><span class="stat-value">${problems.filter((p) => store.progressOf(p.id).attempts > 0).length}</span><span class="stat-label">Problems attempted</span></div>
        <div class="stat card"><span class="stat-value">${problems.reduce((n, p) => n + store.progressOf(p.id).hintsUsed, 0)}</span><span class="stat-label">Hints used</span></div>
      </div>

      <ol class="units">
        ${units.map((unit, ui) => {
          const list = lessonsInUnit(unit.id);
          const done = list.filter((l) => store.isLessonDone(l.id)).length;
          return raw(html`
            <li class="unit card" aria-labelledby="unit-${unit.id}">
              <header class="unit-head">
                <span class="unit-num" aria-hidden="true">${ui + 1}</span>
                <div>
                  <p class="eyebrow">Unit ${ui + 1}</p>
                  <h2 id="unit-${unit.id}">${unit.title}</h2>
                  <p class="muted">${unit.description}</p>
                </div>
                <span class="unit-progress muted">${done}/${list.length} lessons</span>
              </header>
              <ol class="lesson-list">
                ${list.map((l) => {
                  const isDone = store.isLessonDone(l.id);
                  return raw(html`
                    <li class="lesson-row ${isDone ? "done" : ""}">
                      <a class="lesson-link" href="${href.learn(l.id)}">
                        <span class="num">${isDone ? "✓" : l.number}</span>
                        <span class="row-main"><strong>${l.title}</strong><span class="muted">${l.summary}</span></span>
                        <span class="row-meta muted">${l.minutes} min</span>
                        <span class="status-pill">${isDone ? "Completed" : "Not started"}</span>
                      </a>
                      ${l.practice.length
                        ? raw(html`<div class="lesson-practice"><span class="eyebrow">Practice</span>${l.practice.map((id) => {
                            const p = problemById[id];
                            const ok = store.isSolved(id);
                            return raw(html`<a class="mini-chip ${ok ? "solved" : ""}" href="${href.practice(id)}" title="${p.difficulty}${ok ? " · solved" : ""}">${ok ? "✓ " : ""}${p.number}. ${p.title}</a>`);
                          })}</div>`)
                        : ""}
                    </li>`);
                })}
              </ol>
            </li>`);
        })}
      </ol>
    </div>`;
}
