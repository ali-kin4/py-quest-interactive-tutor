// Lesson workspace controller: problem strip, statement, editor, results, tutor.
import { problemById, problems, problemsInTrack, tracks } from "../../data/curriculum.js";
import { href } from "../../app/router.js";
import * as engine from "../../tutor/engine.js";
import { $, $$, DIFFICULTY_SHORT, html, raw, toast } from "../dom.js";
import { createEditor } from "../editor.js";
import { createTutorPanel } from "../tutor-panel.js";
import { renderProblemPanel } from "./problem-panel.js";
import { consoleText, renderInsights, renderTests } from "./results.js";

export function createWorkspace({ store, runner, confirm }) {
  let problem = problems[0];
  let report = null;
  let hintLevel = 0;
  let history = [];
  let draftTimer;

  const editor = createEditor($("#codeEditor"), {
    onChange(code) {
      clearTimeout(draftTimer);
      const id = problem.id;
      draftTimer = setTimeout(() => store.saveDraft(id, code), 300);
    },
    onRun: () => run(),
  });

  const tutor = createTutorPanel({
    getContext: () => ({ problem, report, hintLevel }),
    onAction: handleTutorAction,
    onHint: () => {
      hintLevel += 1;
      store.recordHint(problem.id);
    },
  });

  // ----- Problem strip --------------------------------------------------------
  const trackButton = $("#trackButton");
  const trackMenu = $("#trackMenu");

  function renderStrip() {
    const track = tracks.find((t) => t.id === problem.trackId);
    $("#trackButtonLabel").textContent = track.title;
    $("#problemChips").innerHTML = problemsInTrack(track.id)
      .map((p) => {
        const classes = ["chip", p.id === problem.id && "active", store.isSolved(p.id) && "solved"].filter(Boolean).join(" ");
        return html`<a class="${classes}" href="${href.lesson(p.id)}" ${raw(p.id === problem.id ? 'aria-current="page"' : "")} title="${p.title} · ${p.difficulty}${store.isSolved(p.id) ? " · solved" : ""}">
          <span>${p.number}. ${p.title}</span><span class="chip-diff diff-${p.difficulty.toLowerCase()}" aria-label="${p.difficulty}">${DIFFICULTY_SHORT[p.difficulty]}</span></a>`;
      })
      .join("");
    $("#problemChips .chip.active")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
    trackMenu.innerHTML = tracks
      .map((t) => {
        const solved = problemsInTrack(t.id).filter((p) => store.isSolved(p.id)).length;
        return html`<li role="option" tabindex="-1" aria-selected="${t.id === track.id}" data-track="${t.id}"><strong>${t.title}</strong><span>${solved}/${t.problems.length} solved</span></li>`;
      })
      .join("");
    const index = problems.indexOf(problem);
    $("#prevProblem").disabled = index === 0;
    $("#nextProblem").disabled = index === problems.length - 1;
  }

  function setTrackMenu(open) {
    trackMenu.hidden = !open;
    trackButton.setAttribute("aria-expanded", String(open));
    if (open) (trackMenu.querySelector('[aria-selected="true"]') ?? trackMenu.firstElementChild)?.focus();
  }
  trackButton.addEventListener("click", () => setTrackMenu(trackMenu.hidden));
  trackMenu.addEventListener("click", (event) => {
    const item = event.target.closest("[data-track]");
    if (!item) return;
    setTrackMenu(false);
    const list = problemsInTrack(item.dataset.track);
    location.hash = href.lesson((list.find((p) => !store.isSolved(p.id)) ?? list[0]).id);
  });
  trackMenu.addEventListener("keydown", (event) => {
    const items = $$("[data-track]", trackMenu);
    const i = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") items[(i + 1) % items.length].focus();
    else if (event.key === "ArrowUp") items[(i - 1 + items.length) % items.length].focus();
    else if (event.key === "Enter" || event.key === " ") document.activeElement.click();
    else if (event.key === "Escape") {
      setTrackMenu(false);
      trackButton.focus();
    } else return;
    event.preventDefault();
  });
  document.addEventListener("click", (event) => {
    if (!trackMenu.hidden && !event.target.closest(".track-picker")) setTrackMenu(false);
  });

  const step = (delta) => {
    const next = problems[problems.indexOf(problem) + delta];
    if (next) location.hash = href.lesson(next.id);
  };
  $("#prevProblem").addEventListener("click", () => step(-1));
  $("#nextProblem").addEventListener("click", () => step(1));

  // ----- Results tabs ------------------------------------------------------------
  const tabs = $$('[role="tab"]');
  function selectTab(name) {
    for (const tab of tabs) {
      const selected = tab.dataset.tab === name;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      $(`#pane-${tab.dataset.tab}`).hidden = !selected;
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!delta) return;
      const next = tabs[(i + delta + tabs.length) % tabs.length];
      next.focus();
      selectTab(next.dataset.tab);
    });
  });

  $("#toggleResults").addEventListener("click", (event) => {
    const pane = $("#resultsPane");
    const show = pane.hidden;
    pane.hidden = !show;
    const btn = event.currentTarget;
    btn.setAttribute("aria-expanded", String(show));
    btn.querySelector("span").textContent = show ? "Hide results" : "Show results";
    btn.classList.toggle("collapsed", !show);
  });
  $("#clearConsole").addEventListener("click", () => {
    $("#consoleOutput").textContent = "";
    selectTab("console");
  });

  $("#resetCode").addEventListener("click", async () => {
    if (editor.value !== problem.starter) {
      const ok = await confirm("Reset your code?", "This replaces your current draft for this problem with the starter code.", "Reset code");
      if (!ok) return;
    }
    editor.value = problem.starter;
    store.clearDraft(problem.id);
    toast("Starter code restored.");
  });

  // Jump to an error line from a results alert.
  $("#pane-tests").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-goto-line]");
    if (btn) editor.goToLine(Number(btn.dataset.gotoLine));
  });
  // Concept tags ask the tutor.
  $("#problemPanel").addEventListener("click", (event) => {
    const tag = event.target.closest("[data-concept]");
    if (!tag) return;
    openTutor();
    tutor.ask(`What is ${tag.dataset.concept}?`);
  });

  // ----- Running -------------------------------------------------------------------
  const runBtn = $("#runCode");
  const stopBtn = $("#stopCode");

  async function run() {
    if (runner.busy) return;
    const id = problem.id;
    const code = editor.value;
    store.saveDraft(id, code);
    runBtn.disabled = true;
    runBtn.classList.add("loading");
    stopBtn.hidden = false;
    selectTab("tests");
    $("#resultsPane").hidden && $("#toggleResults").click();
    try {
      const result = await runner.run(code, problem.tests);
      if (id !== problem.id) return; // learner navigated away mid-run
      report = result;
      const s = engine.summarize(report);
      const wasSolved = store.isSolved(id);
      store.recordRun(id, { passed: report.compile_error ? 0 : s.passed, total: s.total });
      history.unshift({
        passed: report.compile_error ? 0 : s.passed,
        total: s.total,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        note: report.compile_error ? `${report.compile_error.type} on line ${report.compile_error.line ?? "?"}` : s.passed === s.total ? "all tests passed" : "",
      });
      history = history.slice(0, 8);
      const out = $("#consoleOutput");
      out.textContent = (out.textContent ? out.textContent + "\n\n" : "") + consoleText(report, problem.title);
      out.scrollTop = out.scrollHeight;
      renderResults();
      if (!wasSolved && store.isSolved(id)) {
        toast(`Solved ${problem.title}!`);
        renderProblemPanel($("#problemPanel"), problem, { solved: true });
        renderStrip();
        tutor.say(engine.diagnose(problem, report));
      } else if (s.passed !== s.total || report.compile_error) {
        tutor.say(engine.diagnose(problem, report));
      }
    } catch (err) {
      if (id !== problem.id) return;
      const out = $("#consoleOutput");
      out.textContent = (out.textContent ? out.textContent + "\n\n" : "") + `[${new Date().toLocaleTimeString()}] ${err.message}`;
      selectTab("console");
      toast(err.message);
    } finally {
      runBtn.disabled = false;
      runBtn.classList.remove("loading");
      stopBtn.hidden = true;
    }
  }
  runBtn.addEventListener("click", run);
  stopBtn.addEventListener("click", () => runner.stop("Run stopped."));

  function renderResults() {
    renderTests($("#pane-tests"), problem, report);
    renderInsights($("#pane-insights"), problem, report, store.progressOf(problem.id), history);
  }

  // ----- Tutor actions --------------------------------------------------------------
  function giveHint() {
    tutor.userSays("Get hint");
    tutor.say(engine.hint(problem, hintLevel));
    hintLevel += 1;
    store.recordHint(problem.id);
  }
  $("#hintButton").addEventListener("click", giveHint);

  async function handleTutorAction(action) {
    switch (action.id) {
      case "hint":
        giveHint();
        break;
      case "goto-line":
        editor.goToLine(action.line);
        break;
      case "next-problem":
        step(1);
        break;
      case "insert-scaffold": {
        const ok = editor.value === problem.starter || (await confirm("Replace your code with the scaffold?", "Your current draft for this problem will be replaced.", "Insert scaffold"));
        if (ok) {
          editor.value = problem.scaffold;
          store.saveDraft(problem.id, problem.scaffold);
          editor.focus();
        }
        break;
      }
      case "reveal-solution": {
        const ok = await confirm("Reveal the reference solution?", "It will appear in the tutor panel. Try typing it out yourself rather than pasting — that's how it sticks.", "Reveal solution");
        if (ok) tutor.say({ role: "tutor", blocks: [{ kind: "text", text: "One correct approach:" }, { kind: "code", code: problem.solution }], actions: [] });
        break;
      }
      default:
        break;
    }
  }

  // ----- Tutor visibility (drawer on smaller screens) ------------------------------
  const tutorPanel = $("#tutorPanel");
  const toggle = $("#tutorToggle");
  const drawerQuery = matchMedia("(max-width: 1279px)");
  let docked = true;
  function applyTutor() {
    const isDrawer = drawerQuery.matches;
    const open = isDrawer ? tutorPanel.classList.contains("open") : docked;
    document.body.classList.toggle("tutor-hidden", !isDrawer && !docked);
    toggle.setAttribute("aria-expanded", String(open));
    $("#scrim").hidden = !(isDrawer && open);
  }
  function openTutor() {
    if (drawerQuery.matches) tutorPanel.classList.add("open");
    else docked = true;
    applyTutor();
  }
  function closeTutor() {
    tutorPanel.classList.remove("open");
    if (!drawerQuery.matches) docked = false;
    applyTutor();
  }
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) closeTutor();
    else {
      openTutor();
      $("#askInput").focus();
    }
  });
  $("#tutorClose").addEventListener("click", () => {
    closeTutor();
    toggle.focus();
  });
  $("#scrim").addEventListener("click", closeTutor);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && tutorPanel.classList.contains("open")) closeTutor();
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight") && !event.target.closest("input, textarea")) {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  drawerQuery.addEventListener("change", applyTutor);
  applyTutor();

  // ----- Public API ------------------------------------------------------------------
  return {
    /** Open a problem; force reloads it even if it is already open (after reset/import). */
    show(problemId, { force = false } = {}) {
      const next = problemById[problemId] ?? problems[0];
      if (force || next !== problem || !editor.value) {
        if (runner.busy) runner.stop("Run cancelled — you opened another problem.");
        problem = next;
        report = null;
        hintLevel = 0;
        history = [];
        editor.value = store.state.drafts[problem.id] ?? problem.starter;
        editor.setLabel(`Python code editor for ${problem.title}`);
        $("#consoleOutput").textContent = "";
        tutor.reset(problem);
        selectTab("tests");
      }
      store.update((s) => (s.lastProblem = problem.id), { silent: true });
      document.title = `${problem.title} | PyQuest`;
      renderProblemPanel($("#problemPanel"), problem, { solved: store.isSolved(problem.id) });
      $("#problemPanel").scrollTop = 0;
      renderStrip();
      renderResults();
    },
    get problem() {
      return problem;
    },
    openTutor,
    refresh() {
      renderStrip();
      renderProblemPanel($("#problemPanel"), problem, { solved: store.isSolved(problem.id) });
      renderResults();
    },
  };
}
