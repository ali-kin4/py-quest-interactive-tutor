// Local-first learner state. Everything lives in localStorage under one key and
// can be exported/imported as JSON. Nothing is sent anywhere.
import { problemById, problems } from "../data/curriculum.js";
import { lessonById, lessons } from "../data/syllabus.js";

export const STORAGE_KEY = "pyquest-workspace-v2";
const isRecord = (v) => !!v && typeof v === "object" && !Array.isArray(v);

export const freshState = () => ({
  version: 2,
  learner: "Learner",
  theme: "system",
  lastProblem: problems[0].id,
  lastLesson: lessons[0].id,
  progress: {}, // id -> { attempts, solved, solvedAt, hintsUsed, bestPassed }
  lessons: {}, // id -> { completed, completedAt, quiz: { questionIndex: chosenOption } }
  drafts: {}, // id -> code
});

/** Validate untrusted JSON (storage or an imported file) into a well-formed state. */
export function sanitize(raw) {
  const state = freshState();
  if (!isRecord(raw)) return state;
  if (typeof raw.learner === "string" && raw.learner.trim()) state.learner = raw.learner.trim().slice(0, 40);
  if (["light", "dark", "system"].includes(raw.theme)) state.theme = raw.theme;
  if (problemById[raw.lastProblem]) state.lastProblem = raw.lastProblem;
  if (lessonById[raw.lastLesson]) state.lastLesson = raw.lastLesson;
  for (const [id, entry] of Object.entries(isRecord(raw.lessons) ? raw.lessons : {})) {
    const lesson = lessonById[id];
    if (!lesson || !isRecord(entry)) continue;
    const quiz = {};
    for (const [q, choice] of Object.entries(isRecord(entry.quiz) ? entry.quiz : {})) {
      if (lesson.quiz[q] && Number.isInteger(choice) && choice >= 0 && choice < 4) quiz[q] = choice;
    }
    state.lessons[id] = {
      completed: entry.completed === true,
      completedAt: typeof entry.completedAt === "string" ? entry.completedAt : null,
      quiz,
    };
  }
  for (const [id, entry] of Object.entries(isRecord(raw.progress) ? raw.progress : {})) {
    if (!problemById[id] || !isRecord(entry)) continue;
    state.progress[id] = {
      attempts: Math.max(0, Number.parseInt(entry.attempts, 10) || 0),
      solved: entry.solved === true,
      solvedAt: typeof entry.solvedAt === "string" ? entry.solvedAt : null,
      hintsUsed: Math.max(0, Number.parseInt(entry.hintsUsed, 10) || 0),
      bestPassed: Math.max(0, Number.parseInt(entry.bestPassed, 10) || 0),
    };
  }
  for (const [id, draft] of Object.entries(isRecord(raw.drafts) ? raw.drafts : {})) {
    if (problemById[id] && typeof draft === "string") state.drafts[id] = draft.slice(0, 20000);
  }
  return state;
}

export function createStore(storage = globalThis.localStorage) {
  let state;
  try {
    state = sanitize(JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    state = freshState();
  }
  const listeners = new Set();

  const save = () => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };

  const entry = (id) => (state.progress[id] ??= { attempts: 0, solved: false, solvedAt: null, hintsUsed: 0, bestPassed: 0 });

  const store = {
    get state() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    update(mutator, { silent = false } = {}) {
      mutator(state);
      const saved = save();
      if (!silent) listeners.forEach((fn) => fn(state));
      return saved;
    },
    progressOf: (id) => state.progress[id] ?? { attempts: 0, solved: false, solvedAt: null, hintsUsed: 0, bestPassed: 0 },
    isSolved: (id) => state.progress[id]?.solved === true,
    solvedCount: () => problems.filter((p) => state.progress[p.id]?.solved).length,

    recordRun(id, { passed, total }) {
      return store.update((s) => {
        const e = entry(id);
        e.attempts += 1;
        e.bestPassed = Math.max(e.bestPassed, passed);
        if (passed === total && total > 0 && !e.solved) {
          e.solved = true;
          e.solvedAt = new Date().toISOString();
        }
        s.lastProblem = id;
      });
    },
    lessonOf: (id) => state.lessons[id] ?? { completed: false, completedAt: null, quiz: {} },
    isLessonDone: (id) => state.lessons[id]?.completed === true,
    lessonsDone: () => lessons.filter((l) => state.lessons[l.id]?.completed).length,
    /** Record a quiz answer; a lesson completes once every question is answered correctly. */
    answerQuiz(lessonId, questionIndex, choice) {
      return store.update((s) => {
        const e = (s.lessons[lessonId] ??= { completed: false, completedAt: null, quiz: {} });
        e.quiz[questionIndex] = choice;
        const lesson = lessonById[lessonId];
        if (!e.completed && lesson.quiz.every((q, i) => e.quiz[i] === q.answer)) {
          e.completed = true;
          e.completedAt = new Date().toISOString();
        }
      });
    },
    markLessonDone(lessonId) {
      return store.update((s) => {
        const e = (s.lessons[lessonId] ??= { completed: false, completedAt: null, quiz: {} });
        if (!e.completed) Object.assign(e, { completed: true, completedAt: new Date().toISOString() });
      });
    },
    visitLesson(lessonId) {
      return store.update((s) => (s.lastLesson = lessonId), { silent: true });
    },
    recordHint(id) {
      return store.update(() => (entry(id).hintsUsed += 1), { silent: true });
    },
    saveDraft(id, code) {
      return store.update((s) => (s.drafts[id] = code), { silent: true });
    },
    clearDraft(id) {
      return store.update((s) => delete s.drafts[id], { silent: true });
    },
    exportJSON() {
      return JSON.stringify({ ...state, exportedAt: new Date().toISOString(), app: "PyQuest" }, null, 2);
    },
    importJSON(text) {
      const next = sanitize(JSON.parse(text));
      state = next;
      save();
      listeners.forEach((fn) => fn(state));
    },
    reset() {
      const { theme, learner } = state;
      state = { ...freshState(), theme, learner };
      save();
      listeners.forEach((fn) => fn(state));
    },
  };
  return store;
}
