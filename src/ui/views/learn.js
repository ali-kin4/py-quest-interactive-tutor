// Teaching view: syllabus sidebar + a lesson article with runnable examples,
// a quiz, and links to the practice problems the lesson unlocks.
import { href } from "../../app/router.js";
import { problemById } from "../../data/curriculum.js";
import { lessonById, lessons, lessonsInUnit, units } from "../../data/syllabus.js";
import { $, $$, html, raw, richText, toast } from "../dom.js";
import { createEditor } from "../editor.js";

const CALLOUT_LABEL = { tip: "Tip", note: "Note", warning: "Watch out" };
const CALLOUT_ICON = {
  tip: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  note: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
  warning: '<path d="M12 3l10 18H2zM12 10v4M12 17h.01"/>',
};

function bodyMarkup(body) {
  return body
    .map((b) => (typeof b === "string" ? html`<p>${richText(b)}</p>` : html`<ul>${b.list.map((item) => raw(html`<li>${richText(item)}</li>`))}</ul>`))
    .join("");
}

function sidebar(current, store) {
  return html`
    <nav class="syllabus-nav card" aria-label="Syllabus">
      <a class="syllabus-nav-head" href="${href.syllabus()}">
        <span class="eyebrow">Syllabus</span>
        <strong>${store.lessonsDone()}/${lessons.length} lessons complete</strong>
        <div class="meter" aria-hidden="true"><span style="width:${Math.round((100 * store.lessonsDone()) / lessons.length)}%"></span></div>
      </a>
      ${units.map((unit, ui) => raw(html`
        <div class="nav-unit">
          <p class="eyebrow">Unit ${ui + 1} · ${unit.title}</p>
          <ol>
            ${lessonsInUnit(unit.id).map((l) => raw(html`
              <li><a href="${href.learn(l.id)}" class="${[l.id === current.id && "active", store.isLessonDone(l.id) && "done"].filter(Boolean).join(" ")}" ${raw(l.id === current.id ? 'aria-current="page"' : "")}>
                <span class="nav-num" aria-hidden="true">${store.isLessonDone(l.id) ? "✓" : l.number}</span>
                <span>${l.title}</span>${store.isLessonDone(l.id) ? raw('<span class="sr-only">(complete)</span>') : ""}
              </a></li>`))}
          </ol>
        </div>`))}
    </nav>`;
}

function exampleMarkup(example, i) {
  return html`
    <figure class="example-block" data-example="${i}">
      <div class="example-toolbar">
        <span class="eyebrow">Example — editable</span>
        <div class="example-actions">
          <button type="button" class="btn btn-ghost" data-reset-example="${i}">Reset</button>
          <button type="button" class="btn btn-primary btn-sm" data-run-example="${i}">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>Run
          </button>
        </div>
      </div>
      <div class="example-editor code-editor" data-editor="${i}"></div>
      <div class="example-output" data-output="${i}" aria-live="polite">
        <span class="eyebrow">Output</span>
        <pre>${example.output || (example.error ? "" : "(no output)")}${example.error ? raw(html`<span class="out-error">${example.output ? "\n" : ""}${example.error}: …</span>`) : ""}</pre>
      </div>
      ${example.note ? raw(html`<figcaption>${richText(example.note)}</figcaption>`) : ""}
    </figure>`;
}

function quizMarkup(lesson, store) {
  const answers = store.lessonOf(lesson.id).quiz;
  const correct = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;
  return html`
    <section class="lesson-section quiz" id="quiz" aria-labelledby="quizTitle">
      <div class="quiz-head">
        <h2 id="quizTitle">Check your understanding</h2>
        <span class="badge ${correct === lesson.quiz.length ? "badge-passed" : "badge-pending"}" id="quizScore">${correct}/${lesson.quiz.length} correct</span>
      </div>
      ${lesson.quiz.map((q, qi) => {
        const chosen = answers[qi];
        const answered = Number.isInteger(chosen);
        const right = chosen === q.answer;
        return raw(html`
          <fieldset class="question ${answered ? (right ? "is-right" : "is-wrong") : ""}" data-question="${qi}">
            <legend><span class="q-num">${qi + 1}</span>${richText(q.question)}</legend>
            <div class="options">
              ${q.options.map((opt, oi) => raw(html`
                <button type="button" class="option ${answered && oi === chosen ? (right ? "chosen-right" : "chosen-wrong") : ""} ${right && oi === q.answer ? "chosen-right" : ""}"
                  data-option="${oi}" aria-pressed="${answered && oi === chosen}" ${raw(right ? "disabled" : "")}>
                  <span class="opt-letter" aria-hidden="true">${"ABCD"[oi]}</span><span>${richText(opt)}</span>
                </button>`))}
            </div>
            ${answered ? raw(html`<p class="feedback" role="status">${right ? "✓ Correct. " : "✗ Not quite — try again. "}${right ? richText(q.explanation) : ""}</p>`) : ""}
          </fieldset>`);
      })}
    </section>`;
}

function practiceMarkup(lesson, store) {
  const next = lessons[lesson.number];
  if (!lesson.practice.length) {
    return html`
      <section class="lesson-section practice-box" aria-labelledby="practiceTitle">
        <h2 id="practiceTitle">Practice</h2>
        <p class="muted">This lesson builds foundations — hands-on practice problems start in Lesson 4. ${next ? raw(html`Continue with <a class="text-link" href="${href.learn(next.id)}">${next.number}. ${next.title}</a>.`) : ""}</p>
      </section>`;
  }
  return html`
    <section class="lesson-section practice-box" aria-labelledby="practiceTitle">
      <h2 id="practiceTitle">Practise what you learned</h2>
      <p class="muted">Solve these in the coding workspace. The tutor there can give hints if you get stuck.</p>
      <div class="practice-grid">
        ${lesson.practice.map((id) => {
          const p = problemById[id];
          const solved = store.isSolved(id);
          return raw(html`
            <a class="practice-card ${solved ? "solved" : ""}" href="${href.practice(id)}">
              <span class="practice-num">${solved ? "✓" : p.number}</span>
              <span class="practice-main"><strong>${p.title}</strong><span class="muted">${p.summary}</span></span>
              <span class="badge diff-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
            </a>`);
        })}
      </div>
    </section>`;
}

export function createLearnView({ store, runner }) {
  const root = $("#learn-view");
  let lesson = null;
  let editors = [];

  function render() {
    const prev = lessons[lesson.number - 2];
    const next = lessons[lesson.number];
    const unit = units[lesson.unitNumber - 1];
    const done = store.isLessonDone(lesson.id);
    root.innerHTML = html`
      <div class="learn-layout">
        <aside class="learn-sidebar">${raw(sidebar(lesson, store))}</aside>
        <article class="lesson card" aria-labelledby="lessonTitle">
          <header class="lesson-header">
            <p class="eyebrow">Unit ${lesson.unitNumber} · ${unit.title} — Lesson ${lesson.number} of ${lessons.length}</p>
            <h1 id="lessonTitle">${lesson.title}</h1>
            <p class="lead">${richText(lesson.summary)}</p>
            <div class="lesson-meta">
              <span>≈ ${lesson.minutes} min</span>
              <span>${lesson.sections.filter((s) => s.example).length} runnable examples</span>
              <span>${lesson.quiz.length}-question quiz</span>
              ${lesson.practice.length ? raw(html`<span>${lesson.practice.length} practice ${lesson.practice.length === 1 ? "problem" : "problems"}</span>`) : ""}
              ${done ? raw('<span class="badge badge-passed">✓ Completed</span>') : ""}
            </div>
          </header>

          <section class="objectives" aria-labelledby="objTitle">
            <h2 id="objTitle" class="eyebrow">In this lesson you will</h2>
            <ul>${lesson.objectives.map((o) => raw(html`<li>${richText(o)}</li>`))}</ul>
          </section>

          ${lesson.sections.map((s, i) => raw(html`
            <section class="lesson-section" aria-labelledby="sec-${i}">
              <h2 id="sec-${i}">${s.heading}</h2>
              ${raw(bodyMarkup(s.body))}
              ${s.example ? raw(exampleMarkup(s.example, i)) : ""}
              ${s.callout ? raw(html`<aside class="callout callout-${s.callout.kind}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${raw(CALLOUT_ICON[s.callout.kind])}</svg><div><strong>${CALLOUT_LABEL[s.callout.kind]}</strong> ${richText(s.callout.text)}</div></aside>`) : ""}
            </section>`))}

          <section class="lesson-section recap" aria-labelledby="recapTitle">
            <h2 id="recapTitle">Key takeaways</h2>
            <ul class="checklist">${lesson.keyPoints.map((k) => raw(html`<li>${richText(k)}</li>`))}</ul>
          </section>

          <section class="lesson-section" aria-labelledby="mistakesTitle">
            <h2 id="mistakesTitle">Common mistakes</h2>
            <div class="mistakes">
              ${lesson.mistakes.map((m) => raw(html`
                <div class="mistake">
                  <p class="m-wrong"><span aria-hidden="true">✗</span><span class="sr-only">Mistake:</span> ${richText(m.mistake)}</p>
                  <p class="m-fix"><span aria-hidden="true">✓</span><span class="sr-only">Fix:</span> ${richText(m.fix)}</p>
                </div>`))}
            </div>
          </section>

          <div id="quizWrap">${raw(quizMarkup(lesson, store))}</div>

          <div id="completeWrap">${raw(completeMarkup())}</div>

          <div id="practiceWrap">${raw(practiceMarkup(lesson, store))}</div>

          <nav class="lesson-pager" aria-label="Lesson navigation">
            ${prev ? raw(html`<a class="pager prev" href="${href.learn(prev.id)}"><span class="eyebrow">← Previous</span><strong>${prev.number}. ${prev.title}</strong></a>`) : raw("<span></span>")}
            ${next ? raw(html`<a class="pager next" href="${href.learn(next.id)}"><span class="eyebrow">Next →</span><strong>${next.number}. ${next.title}</strong></a>`) : raw(html`<a class="pager next" href="${href.syllabus()}"><span class="eyebrow">Finished</span><strong>Back to the syllabus</strong></a>`)}
          </nav>
        </article>
      </div>`;
    mountEditors();
  }

  function completeMarkup() {
    if (store.isLessonDone(lesson.id)) {
      return html`<div class="complete-banner" role="status"><strong>Lesson complete.</strong> ${lesson.practice.length ? "Now put it into practice below." : "On to the next lesson!"}</div>`;
    }
    return html`<div class="complete-row"><p class="muted">Answer every quiz question correctly to complete this lesson — or mark it complete if you already know this material.</p><button type="button" class="btn btn-outline" id="markComplete">Mark as complete</button></div>`;
  }

  function refreshProgress() {
    $("#quizWrap", root).innerHTML = quizMarkup(lesson, store);
    $("#completeWrap", root).innerHTML = completeMarkup();
    $("#practiceWrap", root).innerHTML = practiceMarkup(lesson, store);
    $(".learn-sidebar", root).innerHTML = sidebar(lesson, store);
  }

  function mountEditors() {
    editors = lesson.sections.map((s, i) => {
      if (!s.example) return null;
      const editor = createEditor($(`[data-editor="${i}"]`, root), { onRun: () => runExample(i) });
      editor.value = s.example.code;
      editor.setLabel(`Editable example: ${s.heading}`);
      return editor;
    });
  }

  async function runExample(i) {
    const out = $(`[data-output="${i}"]`, root);
    const btn = $(`[data-run-example="${i}"]`, root);
    if (runner.busy) {
      toast("Another run is in progress.");
      return;
    }
    btn.disabled = true;
    btn.classList.add("loading");
    out.classList.add("running");
    try {
      const result = await runner.exec(editors[i].value);
      const edited = editors[i].value !== lesson.sections[i].example.code;
      out.innerHTML = html`
        <span class="eyebrow">${edited ? "Your output" : "Output"} <span class="muted">· ${result.elapsed_ms} ms</span></span>
        <pre>${result.stdout || (result.error ? "" : "(no output)")}${result.error ? raw(html`<span class="out-error">${result.stdout ? "\n" : ""}${result.error.type}: ${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}</span>`) : ""}</pre>`;
    } catch (err) {
      out.innerHTML = html`<span class="eyebrow">Output</span><pre><span class="out-error">${err.message}</span></pre>`;
    } finally {
      btn.disabled = false;
      btn.classList.remove("loading");
      out.classList.remove("running");
    }
  }

  root.addEventListener("click", (event) => {
    const run = event.target.closest("[data-run-example]");
    if (run) return runExample(Number(run.dataset.runExample));
    const reset = event.target.closest("[data-reset-example]");
    if (reset) {
      const i = Number(reset.dataset.resetExample);
      editors[i].value = lesson.sections[i].example.code;
      return;
    }
    const option = event.target.closest("[data-option]");
    if (option) {
      const qi = Number(option.closest("[data-question]").dataset.question);
      const wasDone = store.isLessonDone(lesson.id);
      store.answerQuiz(lesson.id, qi, Number(option.dataset.option)); // subscribers re-render
      $(`[data-question="${qi}"] .option[aria-pressed="true"], [data-question="${qi}"] .option:not([disabled])`, root)?.focus();
      if (!wasDone && store.isLessonDone(lesson.id)) toast(`Lesson ${lesson.number} complete!`);
      return;
    }
    if (event.target.closest("#markComplete")) {
      store.markLessonDone(lesson.id);
      toast(`Lesson ${lesson.number} marked complete.`);
    }
  });

  return {
    show(lessonId) {
      const next = lessonById[lessonId] ?? lessons[0];
      if (next !== lesson || !root.firstElementChild) {
        lesson = next;
        render();
        window.scrollTo(0, 0);
      }
      store.visitLesson(lesson.id);
      document.title = `${lesson.title} | PyQuest`;
    },
    refresh() {
      if (lesson) refreshProgress();
    },
  };
}
