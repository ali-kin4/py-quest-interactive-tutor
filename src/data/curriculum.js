import basics from "./tracks/basics.js";
import collections from "./tracks/collections.js";
import practical from "./tracks/practical.js";

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const tracks = [basics, collections, practical];

/** Every problem, numbered in curriculum order and tagged with its track. */
export const problems = tracks.flatMap((track) => track.problems).map((problem, index) => ({
  ...problem,
  number: index + 1,
  trackId: tracks.find((t) => t.problems.includes(problem)).id,
}));

export const problemById = Object.fromEntries(problems.map((p) => [p.id, p]));

export const problemsInTrack = (trackId) => problems.filter((p) => p.trackId === trackId);

export const totalMinutes = problems.reduce((sum, p) => sum + p.minutes, 0);
