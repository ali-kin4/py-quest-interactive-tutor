import assert from "node:assert/strict";
import test from "node:test";
import { problems } from "../../src/data/curriculum.js";
import { validateLesson } from "../../src/data/lesson-schema.js";
import { lessonForProblem, lessons, units } from "../../src/data/syllabus.js";

test("fourteen lessons in five units, numbered in order", () => {
  assert.equal(units.length, 5);
  assert.equal(lessons.length, 14);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  lessons.forEach((l, i) => assert.equal(l.number, i + 1));
  for (const unit of units) assert.ok(lessons.some((l) => l.unit === unit.id), `${unit.id} has lessons`);
  // Units are contiguous: lessons of one unit are never interleaved with another.
  const order = lessons.map((l) => l.unitNumber);
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test("every lesson passes the schema", () => {
  const ids = new Set(problems.map((p) => p.id));
  for (const lesson of lessons) assert.deepEqual(validateLesson(lesson, ids), []);
});

test("every practice problem is taught by exactly one lesson", () => {
  const taught = lessons.flatMap((l) => l.practice);
  assert.equal(taught.length, new Set(taught).size, "a problem is linked from two lessons");
  for (const p of problems) assert.ok(lessonForProblem[p.id], `${p.id} has no lesson`);
});

test("functions are taught before the first practice problem", () => {
  const functions = lessons.find((l) => l.id === "functions-basics");
  const firstPractice = lessons.find((l) => l.practice.length);
  assert.ok(functions.number < firstPractice.number);
});

test("quiz answers are spread across positions", () => {
  const positions = new Set(lessons.flatMap((l) => l.quiz.map((q) => q.answer)));
  assert.ok(positions.size >= 3);
});
