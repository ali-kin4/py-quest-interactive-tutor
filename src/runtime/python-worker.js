/**
 * Pyodide worker. Loads CPython (WebAssembly) off the main thread and grades
 * submissions with harness.py — the same file CI uses to verify solutions.
 *
 * A worker gives responsiveness and a hard stop (terminate()), NOT a security
 * boundary: learner code can reach any API the worker can.
 */
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";

let enginePromise;

function init() {
  enginePromise ??= (async () => {
    const [pyodide, harness] = await Promise.all([
      loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" }),
      fetch(new URL("./harness.py", import.meta.url)).then((r) => {
        if (!r.ok) throw new Error(`Could not load grading harness (${r.status}).`);
        return r.text();
      }),
    ]);
    pyodide.runPython(harness);
    return { pyodide, run: pyodide.globals.get("_pyquest_run"), version: pyodide.version };
  })();
  return enginePromise;
}

self.onmessage = async ({ data = {} }) => {
  const { type, runId } = data;
  if (type !== "init" && type !== "run") return;
  try {
    const engine = await init();
    if (type === "init") {
      postMessage({ type: "ready", version: engine.version });
      return;
    }
    const source = String(data.code ?? "").slice(0, 20000);
    const report = JSON.parse(engine.run(source, JSON.stringify(data.tests ?? [])));
    postMessage({ type: "report", runId, report });
  } catch (err) {
    postMessage({ type: type === "init" ? "init-error" : "run-error", runId, error: String(err?.message ?? err) });
  }
};
