import assert from "node:assert/strict";
import test from "node:test";
import { DIFFICULTIES, problemById, problems, tracks } from "../../src/data/curriculum.js";

test("three tracks, thirty uniquely identified, sequentially numbered problems", () => {
  assert.equal(tracks.length, 3);
  assert.equal(problems.length, 30);
  assert.equal(new Set(problems.map((p) => p.id)).size, problems.length);
  problems.forEach((p, i) => assert.equal(p.number, i + 1));
  for (const p of problems) assert.equal(problemById[p.id], p);
});

test("every problem has complete instructional content", () => {
  for (const p of problems) {
    for (const field of ["title", "summary", "statement", "task", "inputFormat", "outputFormat", "starter", "scaffold", "solution"]) {
      assert.ok(typeof p[field] === "string" && p[field].trim(), `${p.id}.${field}`);
    }
    assert.ok(DIFFICULTIES.includes(p.difficulty), `${p.id} difficulty`);
    assert.ok(p.minutes >= 5 && p.minutes <= 60, `${p.id} minutes`);
    assert.ok(p.examples.length >= 1, `${p.id} examples`);
    for (const ex of p.examples) assert.ok(ex.title && ex.input && ex.output && ex.explanation, `${p.id} example`);
    assert.ok(p.constraints.length >= 1, `${p.id} constraints`);
    assert.ok(p.concepts.length >= 2, `${p.id} concepts`);
    assert.ok(p.hints.length >= 3, `${p.id} needs a three-step hint ladder`);
  }
});

test("starters define the function the tests call and leave work to do", () => {
  for (const p of problems) {
    const fn = p.starter.match(/def\s+(\w+)\(/)?.[1];
    assert.ok(fn, `${p.id} starter defines a function`);
    assert.match(p.starter, /NotImplementedError/, `${p.id} starter raises NotImplementedError`);
    assert.match(p.solution, new RegExp(`def\\s+${fn}\\(`), `${p.id} solution defines ${fn}`);
    for (const t of p.tests) assert.match(t.call, new RegExp(`\\b${fn}\\(`), `${p.id} test calls ${fn}`);
  }
});

test("tests mix visible and hidden cases without duplicates", () => {
  for (const p of problems) {
    const visible = p.tests.filter((t) => !t.hidden);
    const hidden = p.tests.filter((t) => t.hidden);
    assert.ok(visible.length >= 2, `${p.id} visible tests`);
    assert.ok(hidden.length >= 1, `${p.id} hidden tests`);
    assert.equal(new Set(p.tests.map((t) => t.call)).size, p.tests.length, `${p.id} duplicate call`);
    for (const t of visible) assert.ok(t.name, `${p.id} visible tests are named`);
  }
});

test("difficulty ramps across the curriculum", () => {
  for (const track of tracks) {
    assert.ok(track.problems.some((p) => p.difficulty === "Easy"), `${track.id} has an easy entry point`);
    assert.ok(track.problems.some((p) => p.difficulty !== "Easy"), `${track.id} has a challenge`);
  }
});
