// Hash router (works on GitHub Pages without server rewrites):
//   #/learn/<lessonId>     teaching lesson
//   #/practice/<problemId> coding workspace
//   #/syllabus, #/guide
// Older links keep working: #/lesson/<problemId> → practice, #/curriculum → syllabus.
import { problemById } from "../data/curriculum.js";
import { lessonById } from "../data/syllabus.js";

export const VIEWS = ["learn", "practice", "syllabus", "guide"];

/** @param {{ lesson: string, problem: string }} fallback last-visited ids */
export function parseRoute(hash, fallback) {
  const [view, arg] = String(hash || "").replace(/^#\/?/, "").split("/");
  if (view === "learn") return { view, lessonId: lessonById[arg] ? arg : fallback.lesson };
  if (view === "practice" || view === "lesson") return { view: "practice", problemId: problemById[arg] ? arg : fallback.problem };
  if (view === "curriculum") return { view: "syllabus" };
  if (VIEWS.includes(view)) return { view };
  return { view: "learn", lessonId: fallback.lesson };
}

export const href = {
  learn: (id) => `#/learn/${id}`,
  practice: (id) => `#/practice/${id}`,
  syllabus: () => "#/syllabus",
  guide: () => "#/guide",
};
