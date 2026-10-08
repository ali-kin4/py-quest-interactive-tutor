// Main-thread client for the Pyodide worker: lazy start, one run at a time,
// and hard timeouts that terminate (and later recreate) the worker.

export const LOAD_TIMEOUT_MS = 90000;
export const RUN_TIMEOUT_MS = 15000;

export class PythonRunner {
  #worker = null;
  #ready = null;
  #pending = null;
  #abortLoad = null;
  #nextRunId = 1;

  /** @param {(status: {state: "idle"|"loading"|"ready"|"running"|"error", message: string}) => void} onStatus */
  constructor(onStatus = () => {}) {
    this.onStatus = onStatus;
  }

  get busy() {
    return this.#pending !== null;
  }

  /** Start Pyodide in the background (safe to call repeatedly). */
  warmUp() {
    this.#ready ??= new Promise((resolve, reject) => {
      this.onStatus({ state: "loading", message: "Loading Python…" });
      this.#abortLoad = reject;
      const worker = new Worker(new URL("./python-worker.js", import.meta.url), { type: "module" });
      const timer = setTimeout(() => {
        reject(new Error("Python took too long to load. Check your connection and try again."));
        this.#reset();
      }, LOAD_TIMEOUT_MS);

      worker.addEventListener("message", ({ data }) => {
        if (data.type === "ready") {
          clearTimeout(timer);
          this.#abortLoad = null;
          this.onStatus({ state: "ready", message: `Python ${data.version ?? ""} ready`.replace("  ", " ") });
          resolve();
        } else if (data.type === "init-error") {
          clearTimeout(timer);
          reject(new Error(data.error));
          this.#reset();
        } else if (this.#pending && data.runId === this.#pending.runId) {
          const { resolve: done, reject: fail, timer: runTimer } = this.#pending;
          clearTimeout(runTimer);
          this.#pending = null;
          this.onStatus({ state: "ready", message: "Python ready" });
          if (data.type === "report") done(data.report);
          else fail(new Error(data.error));
        }
      });
      worker.addEventListener("error", (event) => {
        clearTimeout(timer);
        reject(new Error(event.message || "The Python worker failed to start."));
        this.#reset();
      });
      worker.postMessage({ type: "init" });
      this.#worker = worker;
    });
    this.#ready.catch((err) => this.onStatus({ state: "error", message: err.message }));
    return this.#ready;
  }

  /** Grade code against tests. Resolves with the harness report. */
  run(code, tests) {
    return this.#send({ type: "run", code, tests }, "Running tests…");
  }

  /** Run a code example as a script. Resolves with { stdout, error, elapsed_ms }. */
  exec(code) {
    return this.#send({ type: "exec", code }, "Running…");
  }

  async #send(message, label) {
    if (this.#pending) throw new Error("A run is already in progress.");
    await this.warmUp();
    const runId = this.#nextRunId++;
    this.onStatus({ state: "running", message: label });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.stop(`Stopped after ${RUN_TIMEOUT_MS / 1000}s — check for an infinite loop.`);
      }, RUN_TIMEOUT_MS);
      this.#pending = { runId, resolve, reject, timer };
      this.#worker.postMessage({ ...message, runId });
    });
  }

  /** Terminate a running submission. Python reloads on the next run. */
  stop(reason = "Run cancelled.") {
    const pending = this.#pending;
    this.#reset();
    this.onStatus({ state: "idle", message: "Python stopped — it reloads on the next run" });
    if (pending) {
      clearTimeout(pending.timer);
      pending.reject(Object.assign(new Error(reason), { cancelled: true }));
    }
  }

  #reset() {
    this.#abortLoad?.(Object.assign(new Error("Python loading was cancelled."), { cancelled: true }));
    this.#abortLoad = null;
    this.#worker?.terminate();
    this.#worker = null;
    this.#ready = null;
    this.#pending = null;
  }
}
