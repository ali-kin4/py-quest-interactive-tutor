// Structural rules for teaching lessons. Used by unit tests and
// scripts/verify-lessons.mjs; returns human-readable problems (empty = valid).
//
// Lesson shape:
// {
//   id, unit, title, minutes, summary,
//   objectives: string[3..6],
//   sections: [{ heading, body: (string | { list: string[] })[], example?, callout? }],
//   keyPoints: string[3..8],
//   mistakes: [{ mistake, fix }],            // 2+
//   quiz: [{ question, options: string[4], answer: 0..3, explanation }],  // 3+
//   practice: problemId[],
// }
// example: { code, output, error?: "ExceptionType", note? }  — output is the exact stdout.
// callout: { kind: "tip" | "note" | "warning", text }

const isText = (v) => typeof v === "string" && v.trim().length > 0;

export function validateLesson(lesson, problemIds = null) {
  const errors = [];
  const where = (msg) => errors.push(`${lesson?.id ?? "?"}: ${msg}`);
  if (!lesson || typeof lesson !== "object") return ["lesson is not an object"];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(lesson.id ?? "")) where("id must be kebab-case");
  for (const f of ["unit", "title", "summary"]) if (!isText(lesson[f])) where(`${f} is required`);
  if (!(lesson.minutes >= 5 && lesson.minutes <= 90)) where("minutes must be 5–90");
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 3 || lesson.objectives.length > 6 || !lesson.objectives.every(isText)) where("objectives: 3–6 strings");
  if (!Array.isArray(lesson.sections) || lesson.sections.length < 3) where("sections: at least 3");
  for (const [i, s] of (lesson.sections ?? []).entries()) {
    if (!isText(s.heading)) where(`section ${i}: heading required`);
    if (!Array.isArray(s.body) || !s.body.length) where(`section ${i}: body required`);
    for (const b of s.body ?? []) {
      if (!(isText(b) || (b && Array.isArray(b.list) && b.list.length && b.list.every(isText)))) where(`section ${i}: body items are strings or { list: [...] }`);
    }
    if (s.example) {
      if (!isText(s.example.code)) where(`section ${i}: example.code required`);
      if (typeof s.example.output !== "string") where(`section ${i}: example.output must be a string (use "" for no output)`);
      if (s.example.error !== undefined && !/^[A-Z]\w*(Error|Exception)$/.test(s.example.error)) where(`section ${i}: example.error must be an exception name`);
      if (/\binput\s*\(/.test(s.example.code ?? "")) where(`section ${i}: examples must not call input()`);
    }
    if (s.callout && (!["tip", "note", "warning"].includes(s.callout.kind) || !isText(s.callout.text))) where(`section ${i}: callout needs kind tip|note|warning and text`);
  }
  if (!Array.isArray(lesson.keyPoints) || lesson.keyPoints.length < 3 || !lesson.keyPoints.every(isText)) where("keyPoints: at least 3");
  if (!Array.isArray(lesson.mistakes) || lesson.mistakes.length < 2 || !lesson.mistakes.every((m) => isText(m.mistake) && isText(m.fix))) where("mistakes: at least 2 { mistake, fix }");
  if (!Array.isArray(lesson.quiz) || lesson.quiz.length < 3) where("quiz: at least 3 questions");
  for (const [i, q] of (lesson.quiz ?? []).entries()) {
    if (!isText(q.question) || !isText(q.explanation)) where(`quiz ${i}: question and explanation required`);
    if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every(isText) || new Set(q.options).size !== 4) where(`quiz ${i}: exactly 4 distinct options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) where(`quiz ${i}: answer must be 0–3`);
  }
  if (!Array.isArray(lesson.practice)) where("practice must be an array of problem ids");
  else if (problemIds) for (const id of lesson.practice) if (!problemIds.has(id)) where(`practice: unknown problem "${id}"`);
  return errors;
}
