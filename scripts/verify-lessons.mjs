// Validate lesson structure and run every code example with CPython.
// Usage: node scripts/verify-lessons.mjs              (all lessons in the syllabus)
//        node scripts/verify-lessons.mjs path/to/lesson.js ...   (specific files)
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { problems } from "../src/data/curriculum.js";
import { validateLesson } from "../src/data/lesson-schema.js";

const files = process.argv.slice(2);
const lessons = files.length
  ? await Promise.all(files.map(async (f) => (await import(pathToFileURL(resolve(f)).href)).default))
  : (await import("../src/data/syllabus.js")).lessons;

const problemIds = new Set(problems.map((p) => p.id));
const structural = lessons.flatMap((lesson) => validateLesson(lesson, problemIds));
structural.forEach((e) => console.log("FAIL", e));

const examples = lessons.flatMap((lesson) =>
  lesson.sections
    .map((s, i) => s.example && { where: `${lesson.id} § ${i + 1} "${s.heading}"`, code: s.example.code, output: s.example.output, error: s.example.error ?? null })
    .filter(Boolean),
);

const script = fileURLToPath(new URL("./verify_examples.py", import.meta.url));
const candidates = process.env.PYTHON ? [process.env.PYTHON] : ["python3", "python"];
let status = null;
for (const python of candidates) {
  const run = spawnSync(python, [script], { input: JSON.stringify(examples), stdio: ["pipe", "inherit", "inherit"] });
  if (run.error?.code === "ENOENT") continue;
  status = run.status;
  break;
}
if (status === null) {
  console.error("Python 3 is required to run lesson examples (set PYTHON=/path/to/python).");
  process.exit(1);
}
console.log(`Checked ${lessons.length} lessons: ${structural.length} structural problems.`);
process.exit(structural.length || status ? 1 : 0);
