// Pipes the curriculum into scripts/verify_solutions.py, which grades every
// reference solution with the same harness the browser uses.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { problems } from "../src/data/curriculum.js";

const script = fileURLToPath(new URL("./verify_solutions.py", import.meta.url));
const payload = JSON.stringify(problems.map(({ id, solution, starter, scaffold, tests }) => ({ id, solution, starter, scaffold, tests })));

const candidates = process.env.PYTHON ? [process.env.PYTHON] : ["python3", "python"];
for (const python of candidates) {
  const run = spawnSync(python, [script], { input: payload, stdio: ["pipe", "inherit", "inherit"] });
  if (run.error?.code === "ENOENT") continue;
  process.exit(run.status ?? 1);
}
console.error("Python 3 is required to verify solutions (set PYTHON=/path/to/python).");
process.exit(1);
