import { tracks, lessons, lessonById, totalMinutes } from "./curriculum.mjs";

const STORAGE_KEY = "pyquest-academy-v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const ESCAPE = {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};
const safe = (value) => String(value ?? "").replace(/[&<>"']/g, char => ESCAPE[char]);
const freshState = () => ({version:1, completed:{}, quiz:{}, drafts:{}, lastLesson:"variables"});
const isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
let toastTimeout;
let draftTimeout;

function readState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!isRecord(raw) || raw.version !== 1) return freshState();
    return {
      version:1,
      completed: isRecord(raw.completed) ? raw.completed : {},
      quiz: isRecord(raw.quiz) ? raw.quiz : {},
      drafts: isRecord(raw.drafts) ? raw.drafts : {},
      lastLesson: lessonById[raw.lastLesson] ? raw.lastLesson : "variables"
    };
  } catch { return freshState(); }
}
let state = readState();
let currentLessonId = state.lastLesson;
let visibleHintCount = 0;

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 4000);
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { notify("Browser storage is unavailable. Use Export to save your progress."); }
}
function isCompleted(id) { return Boolean(state.completed[id]); }
function finishedCount() { return lessons.filter(lesson => isCompleted(lesson.id)).length; }
function percent() { return Math.round(100 * finishedCount() / lessons.length); }
function nextLesson() { return lessons.find(lesson => !isCompleted(lesson.id)) ?? lessons[lessons.length - 1]; }
function minutesStudied() { return lessons.filter(lesson => isCompleted(lesson.id)).reduce((n,lesson) => n + lesson.duration,0); }
function correctQuizCount() { return lessons.filter(lesson => state.quiz[lesson.id] === lesson.quiz.answer).length; }
function go(path) { location.hash = "#/" + path; }
function trackProgress(track) { const finished = track.lessons.filter(l => isCompleted(l.id)).length; return {finished, total:track.lessons.length, percent:Math.round(100 * finished / track.lessons.length)}; }
function trackIcon(track) { return track.icon === "terminal" ? "⌘" : track.icon === "blocks" ? "◇" : "▥"; }

function updateSidebar() {
  $("#sidebarPct").textContent = percent() + "%";
  $("#sidebarBar").style.width = percent() + "%";
  $("#sidebarComplete").textContent = finishedCount() + " of " + lessons.length + " lessons completed";
}
function trackCard(track) {
  const p = trackProgress(track);
  const first = track.lessons.find(l => !isCompleted(l.id)) ?? track.lessons[0];
  return '<a href="#/lesson/' + first.id + '" class="track-card ' + track.tone + '">' +
    '<div class="track-header"><span class="track-icon">' + trackIcon(track) + '</span><span class="track-count">' + p.total + ' lessons</span></div>' +
    '<h3>' + safe(track.title) + '</h3><p>' + safe(track.description) + '</p>' +
    '<div class="track-bar"><div style="width:' + p.percent + '%"></div></div>' +
    '<div class="track-footer"><span>' + p.finished + ' / ' + p.total + ' complete</span><span>Explore ↗</span></div></a>';
}
function renderOverview() {
  const stats = [
    ["◎",finishedCount() + " / " + lessons.length,"Coding challenges"],
    ["✓",correctQuizCount() + " / " + lessons.length,"Knowledge checks"],
    ["◷",minutesStudied() + " min","Guided practice"],
    ["↗",percent() + "%","Path completion"]
  ];
  $("#metricGrid").innerHTML = stats.map(([icon,val,label]) => '<article class="metric-card"><span class="metric-icon">' + icon + '</span><div class="metric-value">' + safe(val) + '</div><div class="metric-label">' + safe(label) + '</div></article>').join("");
  $("#overviewTracks").innerHTML = tracks.map(trackCard).join("");
  const next = nextLesson();
  $("#nextLesson").innerHTML = '<h3>' + safe(next.title) + '</h3><p>' + safe(next.goal) + '</p><button type="button" id="continueNext" class="button button-primary">Open lesson <span>→</span></button>';
  $("#continueNext").addEventListener("click", () => go("lesson/" + next.id));
  $("#todayLabel").textContent = new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date());
}
function renderCourses() {
  $("#courseTracks").innerHTML = tracks.map(track => {
    const p = trackProgress(track);
    return '<article class="course-track"><div class="course-track-header"><span class="track-icon">' + trackIcon(track) + '</span><div><h2>' + safe(track.title) + '</h2><p>' + safe(track.description) + '</p></div><span class="course-count">' + p.finished + ' / ' + p.total + ' complete</span></div><div class="lesson-grid">' +
      track.lessons.map((lesson,index) => '<a class="lesson-tile ' + (isCompleted(lesson.id) ? "completed" : "") + '" href="#/lesson/' + lesson.id + '"><span class="lesson-index">' + (isCompleted(lesson.id) ? "✓" : String(index + 1).padStart(2,"0")) + '</span><div class="lesson-tile-content"><h3>' + safe(lesson.title) + '</h3><p>' + lesson.duration + ' min · ' + safe(lesson.level) + '</p></div><span class="lesson-arrow">↗</span></a>').join("") +
      '</div></article>';
  }).join("");
}

function quizMarkup(lesson) {
  const choice = state.quiz[lesson.id];
  const attempted = Number.isInteger(choice);
  const correct = attempted && choice === lesson.quiz.answer;
  return '<div class="quiz-options" id="quizOptions">' +
    lesson.quiz.options.map((option,i) => '<button type="button" data-choice="' + i + '" class="quiz-option' + (attempted && i === lesson.quiz.answer ? ' correct' : '') + (attempted && i === choice && !correct ? ' incorrect' : '') + '"' + (correct ? " disabled" : "") + '>' + String.fromCharCode(65+i) + '. ' + safe(option) + '</button>').join("") +
    '</div><div id="quizFeedback"' + (attempted ? ' class="quiz-feedback"' : ' class="quiz-feedback" hidden') + '>' + (attempted ? (correct ? "✓ Correct. " : "Not quite. Try another answer. ") + safe(lesson.quiz.explanation) : "") + '</div>';
}
function renderLesson(id) {
  const lesson = lessonById[id] ?? lessons[0];
  currentLessonId = lesson.id;
  state.lastLesson = lesson.id;
  persist();
  $("#lessonContent").innerHTML =
    '<a class="text-link lesson-back" style="display:inline-block" href="#/courses">← All learning paths</a>' +
    '<div class="lesson-head"><span class="panel-icon">▤</span><div><p class="eyebrow">' + safe(lesson.trackTitle) + ' · ' + safe(lesson.level) + ' · ' + lesson.duration + ' MIN</p><h1>' + safe(lesson.title) + '</h1></div></div>' +
    '<p class="lesson-description">' + safe(lesson.goal) + '</p>' +
    '<div class="lesson-body-grid"><div>' +
      '<article class="panel lesson-content-card"><p class="eyebrow">UNDERSTAND</p><h2>The idea</h2><p>' + safe(lesson.explanation) + '</p><div class="concept-tags">' + lesson.concepts.map(c => '<span>' + safe(c) + '</span>').join("") + '</div></article>' +
      '<article class="panel lesson-content-card"><p class="eyebrow">SEE IT IN ACTION</p><h2>A practical example</h2><pre class="code-example" id="lessonExample"></pre></article>' +
      '<article class="panel lesson-content-card"><p class="eyebrow">CHECK YOUR UNDERSTANDING</p><h2>' + safe(lesson.quiz.question) + '</h2><div id="quizWrap">' + quizMarkup(lesson) + '</div></article>' +
    '</div><aside><article class="panel lesson-aside-card"><p class="eyebrow">APPLY YOUR SKILL</p><h3>' + safe(lesson.exercise.title) + '</h3><p>' + safe(lesson.exercise.brief) + '</p><ul><li>' + lesson.exercise.tests.length + ' transparent checks</li><li>Run actual Python in browser</li><li>' + (isCompleted(lesson.id) ? "Challenge passed ✓" : "Finish to earn completion") + '</li></ul><button id="launchChallenge" class="button button-primary button-block" type="button">' + (isCompleted(lesson.id) ? "Review your work" : "Start coding challenge") + ' ↗</button></article><article class="panel lesson-aside-card lesson-action"><p class="eyebrow">WHAT'S NEXT?</p><h3>Build something useful</h3><p>Take the concept into the code studio, test your solution, and inspect the cases that need another try.</p></article></aside></div>';
  $("#lessonExample").textContent = lesson.example;
  $("#launchChallenge").addEventListener("click", () => go("studio/" + lesson.id));
  $$("#quizWrap [data-choice]").forEach(button => button.addEventListener("click", () => {
    state.quiz[lesson.id] = Number(button.dataset.choice);
    persist();
    $("#quizWrap").innerHTML = quizMarkup(lesson);
    $$("#quizWrap [data-choice]").forEach(b => b.addEventListener("click", () => {
      state.quiz[lesson.id] = Number(b.dataset.choice);
      persist();
      renderLesson(lesson.id);
      renderOverview();
    }));
    renderOverview();
  }));
}

function renderStudio(id) {
  const lesson = lessonById[id] ?? lessonById[state.lastLesson] ?? lessons[0];
  currentLessonId = lesson.id;
  state.lastLesson = lesson.id;
  persist();
  $("#studioTitle").textContent = lesson.exercise.title;
  $("#studioBrief").textContent = lesson.exercise.brief;
  $("#studioGoal").textContent = lesson.goal;
  $("#studioLevel").textContent = lesson.level;
  $("#studioTestCount").textContent = lesson.exercise.tests.length + " test cases";
  $("#studioConcepts").innerHTML = lesson.concepts.map(concept => '<li>' + safe(concept) + '</li>').join("");
  $("#codeEditor").value = typeof state.drafts[lesson.id] === "string" ? state.drafts[lesson.id] : lesson.exercise.starter;
  $("#codeEditor").setAttribute("aria-label",lesson.exercise.title + " Python code editor");
  $("#editorMessage").textContent = "Your code stays in this browser.";
  $("#testSummary").textContent = isCompleted(lesson.id) ? "Previously passed ✓" : "Not run yet";
  $("#testSummary").className = "pill" + (isCompleted(lesson.id) ? " success" : "");
  $("#testResults").innerHTML = '<div class="empty-results"><span>◇</span><strong>Ready when you are.</strong><p>Run your solution to see transparent, case-by-case feedback.</p></div>';
  visibleHintCount = 0;
  $("#hintList").innerHTML = "";
  $("#showHint").disabled = false;
  $("#showHint").textContent = "Reveal next hint";
  $("#runCode").disabled = false;
  $("#stopCode").hidden = true;
}
function renderProgress() {
  const progress = [
    ["Completed challenges",String(finishedCount()) + " / " + lessons.length],
    ["Knowledge checks",String(correctQuizCount()) + " / " + lessons.length],
    ["Estimated study time",String(minutesStudied()) + " min"]
  ];
  $("#progressSummary").innerHTML = progress.map(([title,val])=>'<article class="progress-card"><strong>' + safe(val) + '</strong><span>' + safe(title) + '</span></article>').join("");
  $("#progressRows").innerHTML = lessons.map(lesson => '<div class="progress-row"><div><strong>' + safe(lesson.title) + '</strong><small>' + safe(lesson.trackTitle) + '</small></div><span class="' + (isCompleted(lesson.id) ? "pass-label" : "todo-label") + '">' + (isCompleted(lesson.id) ? "✓ All checks passed" : "Not completed") + '</span><a href="#/studio/' + lesson.id + '" class="text-link">' + (isCompleted(lesson.id) ? "Review ↗" : "Practice ↗") + '</a></div>').join("");
}
function renderAll() { updateSidebar(); renderOverview(); renderCourses(); renderProgress(); }

function parseRoute() {
  const raw = (location.hash || "#/overview").replace(/^#\//,"");
  const [view,arg] = raw.split("/");
  if (view === "lesson" && lessonById[arg]) return {view,arg};
  if (view === "studio") return {view,arg:lessonById[arg] ? arg : state.lastLesson};
  if (["overview","courses","progress","instructor"].includes(view)) return {view};
  return {view:"overview"};
}
function route() {
  const {view,arg} = parseRoute();
  $$(".view").forEach(element => element.classList.toggle("active",element.id === view + "-view"));
  $$("[data-nav]").forEach(element => {
    const active = element.dataset.nav === (view === "lesson" ? "courses" : view);
    element.classList.toggle("active",active);
    if(active) element.setAttribute("aria-current","page");
    else element.removeAttribute("aria-current");
  });
  const labels = {overview:"Overview",courses:"Learning paths",lesson:"Lesson",studio:"Code studio",progress:"My progress",instructor:"Instructor showcase"};
  $("#pageBreadcrumb").textContent = labels[view];
  if (view === "lesson") renderLesson(arg);
  if (view === "studio") renderStudio(arg);
  if (view === "overview") renderOverview();
  if (view === "courses") renderCourses();
  if (view === "progress") renderProgress();
  $("#sidebar").classList.remove("open");
  $("#mobileShade").hidden = true;
  $("#menuToggle").setAttribute("aria-expanded","false");
  window.scrollTo(0,0);
}

let worker = null;
let readyPromise = null;
let readyResolve = null;
let readyReject = null;
let pending = null;
let workerTimer = null;
let nextRunId = 1;

function setRuntimeStatus(status,kind) {
  $("#runtimeStatus").textContent = status;
  $("#runtimeDot").className = "status-dot " + (kind ?? "");
}
function stopWorker(reason) {
  if (workerTimer) clearTimeout(workerTimer);
  workerTimer = null;
  if (worker) worker.terminate();
  worker = null;
  readyPromise = null;
  if (readyReject) readyReject(new Error(reason || "Python engine stopped."));
  readyReject = readyResolve = null;
  if (pending) pending.reject(new Error(reason || "Execution cancelled."));
  pending = null;
  setRuntimeStatus(reason ? "Python stopped" : "Python loads when needed",reason ? "error" : "");
}
function ensureWorker() {
  if (readyPromise) return readyPromise;
  setRuntimeStatus("Starting Python…","busy");
  readyPromise = new Promise((resolve,reject) => { readyResolve=resolve; readyReject=reject; });
  worker = new Worker(new URL("./python-worker.mjs",import.meta.url),{type:"module"});
  workerTimer = setTimeout(() => stopWorker("Python engine loading timed out. Check your internet connection."),90000);
  worker.addEventListener("message",event => {
    const payload = event.data ?? {};
    if (payload.type === "ready") {
      if (workerTimer) clearTimeout(workerTimer);
      workerTimer = null;
      setRuntimeStatus("Python ready","ready");
      if (readyResolve) readyResolve();
      readyResolve = readyReject = null;
    } else if (pending && payload.runId === pending.id) {
      clearTimeout(workerTimer);
      workerTimer = null;
      const current = pending;
      pending = null;
      if (payload.type === "results") current.resolve(payload.results);
      else current.reject(new Error(payload.error || "Execution failed."));
    }
  });
  worker.addEventListener("error",event => {
    event.preventDefault();
    stopWorker("Python engine failed to load or execute.");
  });
  return readyPromise;
}
async function executePython(code,tests) {
  await ensureWorker();
  return new Promise((resolve,reject) => {
    const id = nextRunId++;
    pending = {id,resolve,reject};
    workerTimer = setTimeout(() => stopWorker("Code exceeded the 15-second execution limit."),15000);
    worker.postMessage({type:"run",runId:id,code,tests});
  });
}
function testResultsMarkup(results) {
  const wrap = document.createDocumentFragment();
  results.forEach((result,index) => {
    const card = document.createElement("div");
    card.className = "test-case " + (result.passed ? "pass" : "fail");
    const top = document.createElement("div");
    top.className = "test-case-top";
    const title = document.createElement("strong");
    title.textContent = "Case " + (index + 1) + " · input: " + (result.input || []).map(v => JSON.stringify(v)).join(", ");
    const badge = document.createElement("span");
    badge.textContent = result.passed ? "✓ Passed" : "✕ Needs work";
    top.append(title,badge);
    const details = document.createElement("pre");
    details.textContent = result.error ? "Error: " + result.error : "Expected: " + JSON.stringify(result.expected) + "\nActual:   " + JSON.stringify(result.actual);
    card.append(top,details);
    wrap.append(card);
  });
  return wrap;
}
async function runCode() {
  if (pending) return;
  const lesson = lessonById[currentLessonId];
  if (!lesson) return;
  const code = $("#codeEditor").value;
  if (!code.trim()) return notify("Write some Python before running your tests.");
  if (code.length > 20000) return notify("The editor supports up to 20,000 characters per run.");
  state.drafts[lesson.id] = code;
  persist();
  $("#runCode").disabled = true;
  $("#stopCode").hidden = false;
  $("#testSummary").textContent = "Running…";
  $("#testSummary").className = "pill";
  $("#testResults").textContent = "Starting or running Python. First load may take a little longer.";
  $("#editorMessage").textContent = "Evaluation is local and may take several seconds.";
  try {
    const results = await executePython(code,lesson.exercise.tests);
    if (currentLessonId !== lesson.id || parseRoute().view !== "studio") return;
    const passed = Array.isArray(results) ? results.filter(x => x.passed).length : 0;
    const success = passed === lesson.exercise.tests.length;
    $("#testSummary").textContent = passed + " / " + lesson.exercise.tests.length + " passed";
    $("#testSummary").className = "pill " + (success ? "success" : "fail");
    $("#testResults").replaceChildren(testResultsMarkup(results));
    $("#editorMessage").textContent = success ? "All checks passed. Challenge completed!" : "Use the feedback to refine your solution.";
    if (success) {
      if (!isCompleted(lesson.id)) notify("Challenge completed! You earned a new skill ✓");
      state.completed[lesson.id] = {at:new Date().toISOString(),tests:passed};
      persist();
      renderAll();
    }
  } catch(err) {
    $("#testSummary").textContent = "Could not finish";
    $("#testSummary").className = "pill fail";
    $("#testResults").textContent = String(err?.message ?? err);
    $("#editorMessage").textContent = "Check the error and try again.";
  } finally {
    $("#runCode").disabled = false;
    $("#stopCode").hidden = true;
  }
}

function downloadObject(filename,content) {
  const blob = new Blob([JSON.stringify(content,null,2)],{type:"application/json;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
function progressReport() {
  return {
    product:"PyQuest Academy",
    exportedAt:new Date().toISOString(),
    overview:{completed:finishedCount(),total:lessons.length,percent:percent(),correctQuizzes:correctQuizCount(),estimatedMinutes:minutesStudied(),catalogMinutes:totalMinutes},
    lessons:lessons.map(lesson => ({id:lesson.id,title:lesson.title,track:lesson.trackTitle,codingChallengePassed:isCompleted(lesson.id),completedAt:state.completed[lesson.id]?.at ?? null,knowledgeCheckPassed:state.quiz[lesson.id] === lesson.quiz.answer})),
    note:"Self-reported client-side learning record; not a proctored certificate or independent competency verification."
  };
}
function saveReport() { downloadObject("pyquest-learning-report.json",progressReport());notify("Learning report downloaded."); }
function backupProgress() { downloadObject("pyquest-progress-backup.json",{format:"pyquest-backup",version:1,createdAt:new Date().toISOString(),state});notify("Progress backup downloaded."); }
function importBackup(file) {
  if (!file || file.size > 1000000) return notify("Choose a PyQuest backup JSON smaller than 1 MB.");
  file.text().then(text => {
    const value = JSON.parse(text);
    if (value.format !== "pyquest-backup" || value.version !== 1 || !isRecord(value.state)) throw new Error("This is not a PyQuest progress backup.");
    const incoming = value.state;
    const normalized = freshState();
    for(const lesson of lessons) {
      const id = lesson.id;
      if (isRecord(incoming.completed?.[id]) && typeof incoming.completed[id].at === "string") normalized.completed[id] = {at:incoming.completed[id].at,tests:lesson.exercise.tests.length};
      if (Number.isInteger(incoming.quiz?.[id]) && incoming.quiz[id]>=0 && incoming.quiz[id]<lesson.quiz.options.length) normalized.quiz[id] = incoming.quiz[id];
      if (typeof incoming.drafts?.[id] === "string") normalized.drafts[id] = incoming.drafts[id].slice(0,20000);
    }
    if (lessonById[incoming.lastLesson]) normalized.lastLesson = incoming.lastLesson;
    state = normalized;
    persist(); renderAll(); route(); notify("Progress restored from your backup.");
  }).catch(err => notify("Import failed: " + String(err.message ?? err)));
}

function bindEvents() {
  window.addEventListener("hashchange",route);
  $("#heroContinue").addEventListener("click",() => go("lesson/" + nextLesson().id));
  $("#menuToggle").addEventListener("click",() => { const expanded = $("#sidebar").classList.toggle("open"); $("#mobileShade").hidden = !expanded; $("#menuToggle").setAttribute("aria-expanded",String(expanded)); });
  $("#mobileShade").addEventListener("click",() => { $("#sidebar").classList.remove("open"); $("#mobileShade").hidden = true; });
  $("#exportProgress").addEventListener("click",backupProgress);
  $("#downloadReport").addEventListener("click",saveReport);
  $("#clearProgress").addEventListener("click",() => $("#resetDialog").showModal());
  $("#confirmClear").addEventListener("click",() => { state=freshState();persist();renderAll();route();notify("Local progress cleared."); });
  $("#importProgress").addEventListener("click",() => $("#importInput").click());
  $("#importInput").addEventListener("change",event => { importBackup(event.target.files[0]);event.target.value=""; });
  $("#showHint").addEventListener("click",() => {
    const hints = lessonById[currentLessonId]?.exercise.hints ?? [];
    if(visibleHintCount>=hints.length) return;
    const node = document.createElement("p");
    node.className="hint-item";
    node.textContent = (visibleHintCount+1) + ". " + hints[visibleHintCount++];
    $("#hintList").append(node);
    if(visibleHintCount>=hints.length){$("#showHint").disabled=true;$("#showHint").textContent="All hints revealed";}
  });
  $("#codeEditor").addEventListener("input",() => {
    const id=currentLessonId;
    clearTimeout(draftTimeout);
    draftTimeout=setTimeout(() => {state.drafts[id]=$("#codeEditor").value;persist();},350);
  });
  $("#codeEditor").addEventListener("keydown",event=>{
    if (event.key==="Tab") {
      event.preventDefault();
      const field=event.target;
      const start=field.selectionStart;
      field.setRangeText("    ",start,field.selectionEnd,"end");
      field.dispatchEvent(new Event("input",{bubbles:true}));
    }
    if(event.key==="Enter" && (event.ctrlKey || event.metaKey)){event.preventDefault();runCode();}
  });
  $("#runCode").addEventListener("click",runCode);
  $("#stopCode").addEventListener("click",() => stopWorker("Execution stopped by learner."));
  $("#resetCode").addEventListener("click",() => {
    const lesson=lessonById[currentLessonId];
    if (!lesson) return;
    if (!confirm("Reset your solution to the starter code?")) return;
    delete state.drafts[lesson.id];persist();$("#codeEditor").value=lesson.exercise.starter;notify("Starter code restored.");
  });
}
function boot() {
  $("#year").textContent=String(new Date().getFullYear());
  renderAll();
  bindEvents();
  route();
}
boot();
