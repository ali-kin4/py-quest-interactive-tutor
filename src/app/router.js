// Hash router: #/lesson/<id>, #/curriculum, #/guide. Works on GitHub Pages
// without server rewrites.
import { problemById } from "../data/curriculum.js";

export const VIEWS = ["lesson", "curriculum", "guide"];

export function parseRoute(hash, fallbackProblem) {
  const [view, arg] = String(hash || "").replace(/^#\/?/, "").split("/");
  if (view === "lesson") return { view, problemId: problemById[arg] ? arg : fallbackProblem };
  if (VIEWS.includes(view)) return { view };
  return { view: "lesson", problemId: fallbackProblem };
}

export const href = {
  lesson: (id) => `#/lesson/${id}`,
  curriculum: () => "#/curriculum",
  guide: () => "#/guide",
};
