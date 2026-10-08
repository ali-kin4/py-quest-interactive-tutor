/**
 * Browser-side Python evaluator.
 * Runs off the main UI thread; terminating this worker is a timeout/recovery mechanism.
 * Workers are NOT a security boundary: never use this evaluator for secrets or high-stakes exams.
 */
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";

let enginePromise;

async function init() {
  if (enginePromise) return enginePromise;
  enginePromise = (async () => {
    const python = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"
    });
    const harness = [
      "import json",
      "import io",
      "import contextlib",
      "import builtins",
      "",
      "def _pyquest_grade(source, tests_json):",
      "    results = []",
      "    tests = json.loads(tests_json)",
      "    for item in tests:",
      "        submitted = iter(item.get('input', []))",
      "        output_buffer = io.StringIO()",
      "        error_buffer = io.StringIO()",
      "        def read_input(prompt=''):",
      "            try:",
      "                return next(submitted)",
      "            except StopIteration:",
      "                raise EOFError('The challenge supplied no more input values.')",
      "        allowed = dict(vars(builtins))",
      "        allowed['input'] = read_input",
      "        env = {'__name__': '__main__', '__builtins__': allowed}",
      "        error = None",
      "        try:",
      "            with contextlib.redirect_stdout(output_buffer), contextlib.redirect_stderr(error_buffer):",
      "                exec(compile(source, '<learner>', 'exec'), env, env)",
      "        except Exception as ex:",
      "            error = type(ex).__name__ + ': ' + str(ex)",
      "        actual = output_buffer.getvalue().strip()",
      "        expected = str(item.get('expected', '')).strip()",
      "        stderr = error_buffer.getvalue().strip()",
      "        results.append({",
      "            'input': item.get('input', []),",
      "            'expected': expected[:800],",
      "            'actual': actual[:800],",
      "            'error': (error or stderr or '')[:800],",
      "            'passed': error is None and not stderr and actual == expected",
      "        })",
      "    return json.dumps(results)"
    ].join("\n");
    python.runPython(harness);
    postMessage({ type: "ready" });
    return python;
  })();
  return enginePromise;
}

self.onmessage = async (event) => {
  const payload = event.data ?? {};
  if (payload.type !== "run") return;
  try {
    const pyodide = await init();
    pyodide.globals.set("pyquest_source", String(payload.code ?? "").slice(0, 20000));
    pyodide.globals.set("pyquest_tests_json", JSON.stringify(payload.tests ?? []));
    const result = await pyodide.runPythonAsync("_pyquest_grade(pyquest_source, pyquest_tests_json)");
    postMessage({ type: "results", runId: payload.runId, results: JSON.parse(result) });
  } catch (err) {
    postMessage({ type: "error", runId: payload.runId, error: String(err?.message ?? err) });
  }
};
