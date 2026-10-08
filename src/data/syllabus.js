// The teaching syllabus: units of lessons, each lesson unlocking practice problems.
import helloPython from "./lessons/01-hello-python.js";
import variablesTypes from "./lessons/02-variables-types.js";
import functionsBasics from "./lessons/03-functions-basics.js";
import numbersMath from "./lessons/04-numbers-math.js";
import strings from "./lessons/05-strings.js";
import conditions from "./lessons/06-conditions.js";
import loops from "./lessons/07-loops.js";
import listsTuples from "./lessons/08-lists-tuples.js";
import dictsSets from "./lessons/09-dicts-sets.js";
import comprehensions from "./lessons/10-comprehensions.js";
import exceptions from "./lessons/11-exceptions.js";
import algorithmPatterns from "./lessons/12-algorithm-patterns.js";
import recursionStacks from "./lessons/13-recursion-stacks.js";
import workingWithData from "./lessons/14-working-with-data.js";

export const units = [
  { id: "getting-started", title: "Getting Started", description: "How Python runs, values and types, writing your own functions, and arithmetic." },
  { id: "text-and-logic", title: "Text & Decisions", description: "Process strings, make decisions with conditions and repeat work with loops." },
  { id: "data-structures", title: "Data Structures", description: "Organise data with lists, tuples, dictionaries and sets, and transform it with comprehensions." },
  { id: "robust-code", title: "Robust & Efficient Code", description: "Handle bad input, think about efficiency, and solve problems recursively." },
  { id: "applied", title: "Applied Python", description: "Bring everything together on real-world data processing." },
];

const ordered = [
  helloPython, variablesTypes, functionsBasics, numbersMath,
  strings, conditions, loops,
  listsTuples, dictsSets, comprehensions,
  exceptions, algorithmPatterns, recursionStacks,
  workingWithData,
];

/** Lessons in teaching order, numbered and tagged with their unit position. */
export const lessons = ordered.map((lesson, index) => ({
  ...lesson,
  number: index + 1,
  unitNumber: units.findIndex((u) => u.id === lesson.unit) + 1,
}));

export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
export const lessonsInUnit = (unitId) => lessons.filter((l) => l.unit === unitId);

/** The lesson that teaches the concepts a practice problem needs. */
export const lessonForProblem = Object.fromEntries(lessons.flatMap((l) => l.practice.map((p) => [p, l])));

export const totalLessonMinutes = lessons.reduce((n, l) => n + l.minutes, 0);
