import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tracks, lessons, lessonById, totalMinutes } from "../src/curriculum.mjs";

const html = readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app = readFileSync(new URL("../src/app.mjs",import.meta.url),"utf8");
const worker = readFileSync(new URL("../src/python-worker.mjs",import.meta.url),"utf8");

test("three coherent learning paths and twelve distinct lessons", () => {
  assert.equal(tracks.length,3);
  assert.equal(lessons.length,12);
  assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
  assert.deepEqual(lessons.map(l=>lessonById[l.id].id),lessons.map(l=>l.id));
  assert.ok(totalMinutes>250);
});

test("each lesson has instructional material, a valid quiz and transparent test cases", () => {
  for(const lesson of lessons) {
    assert.ok(lesson.title && lesson.goal && lesson.explanation && lesson.example,lesson.id);
    assert.ok(lesson.concepts.length>=3,lesson.id);
    assert.equal(lesson.quiz.options.length,4,lesson.id);
    assert.ok(Number.isInteger(lesson.quiz.answer) && lesson.quiz.answer>=0 && lesson.quiz.answer<4,lesson.id);
    assert.ok(lesson.quiz.question && lesson.quiz.explanation,lesson.id);
    assert.ok(lesson.exercise.title && lesson.exercise.brief && lesson.exercise.starter,lesson.id);
    assert.ok(lesson.exercise.hints.length>=2,lesson.id);
    assert.ok(lesson.exercise.tests.length>=3,lesson.id);
    const inputs=new Set();
    for(const example of lesson.exercise.tests) {
      assert.ok(Array.isArray(example.input),lesson.id);
      assert.ok(example.input.every(v=>typeof v==="string"),lesson.id);
      assert.equal(typeof example.expected,"string",lesson.id);
      const key=JSON.stringify(example.input);
      assert.ok(!inputs.has(key),"duplicate input for "+lesson.id);
      inputs.add(key);
    }
  }
});

test("all route views and controls exist in the page", () => {
  for (const id of ["overview-view","courses-view","lesson-view","studio-view","progress-view","instructor-view",
    "codeEditor","runCode","stopCode","testResults","courseTracks","progressRows","importInput","resetDialog","menuToggle"]) {
      assert.match(html,new RegExp('id="' + id + '"'),"Missing #"+id);
  }
  assert.match(html,/src="\.\/src\/app\.mjs"/);
  assert.match(html,/rel="stylesheet" href="\.\/src\/styles\.css"/);
  assert.match(html,/<a class="skip-link"/);
});

test("engine uses module worker, timeout and text-only output rendering", () => {
  assert.match(app,/new Worker\(/);
  assert.match(app,/15000/);
  assert.match(app,/\.textContent = result\.error/);
  assert.match(worker,/loadPyodide/);
  assert.match(worker,/exec\(compile/);
  assert.match(worker,/redirect_stdout/);
});

test("no simulated certification or hidden grading services", () => {
  assert.match(html,/not a security sandbox/);
  assert.match(html,/not a remotely verified exam/);
  assert.doesNotMatch(app,/eval\(/);
});
