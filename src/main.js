// Entry point: wires the store, Python runner, header and views together.
import { createStore } from "./app/store.js";
import { parseRoute } from "./app/router.js";
import { problems } from "./data/curriculum.js";
import { PythonRunner } from "./runtime/python-runner.js";
import { $, $$, download, toast } from "./ui/dom.js";
import { renderCurriculum } from "./ui/views/curriculum.js";
import { renderGuide } from "./ui/views/guide.js";
import { createWorkspace } from "./ui/views/workspace.js";

const store = createStore();

// ----- Runtime status pill ------------------------------------------------------------
const statusEl = $("#runtimeStatus");
const runner = new PythonRunner(({ state, message }) => {
  statusEl.dataset.state = state;
  $(".label", statusEl).textContent = message;
});

// ----- Dialogs ----------------------------------------------------------------------------
function confirm(title, body, okLabel = "Confirm") {
  const dialog = $("#confirmDialog");
  $("#confirmTitle").textContent = title;
  $("#confirmBody").textContent = body;
  $("#confirmOk").textContent = okLabel;
  dialog.returnValue = "";
  dialog.showModal();
  return new Promise((resolve) => dialog.addEventListener("close", () => resolve(dialog.returnValue === "confirm"), { once: true }));
}

// ----- Theme --------------------------------------------------------------------------------
const systemDark = matchMedia("(prefers-color-scheme: dark)");
function applyTheme() {
  const { theme } = store.state;
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}
$("#themeToggle").addEventListener("click", () => {
  const current = store.state.theme === "system" ? (systemDark.matches ? "dark" : "light") : store.state.theme;
  store.update((s) => (s.theme = current === "dark" ? "light" : "dark"), { silent: true });
  applyTheme();
});
applyTheme();

// ----- User menu ------------------------------------------------------------------------------
const menuBtn = $("#userMenuButton");
const menu = $("#userMenu");
function renderUser() {
  const name = store.state.learner;
  $("#userName").textContent = name;
  $("#userAvatar").textContent = name.trim()[0]?.toUpperCase() ?? "L";
  const solved = store.solvedCount();
  $("#menuProgress").innerHTML = `<strong>${solved} / ${problems.length}</strong> problems solved<div class="meter"><span style="width:${Math.round((100 * solved) / problems.length)}%"></span></div>`;
}
function setMenu(open) {
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  if (open) menu.querySelector('[role="menuitem"]')?.focus();
}
menuBtn.addEventListener("click", () => setMenu(menu.hidden));
document.addEventListener("click", (event) => {
  if (!menu.hidden && !event.target.closest(".user-menu")) setMenu(false);
});
menu.addEventListener("keydown", (event) => {
  const items = $$('[role="menuitem"]', menu);
  const i = items.indexOf(document.activeElement);
  if (event.key === "ArrowDown") items[(i + 1) % items.length].focus();
  else if (event.key === "ArrowUp") items[(i - 1 + items.length) % items.length].focus();
  else if (event.key === "Escape") {
    setMenu(false);
    menuBtn.focus();
  } else return;
  event.preventDefault();
});
menu.addEventListener("click", async (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  setMenu(false);
  if (action === "rename") {
    const dialog = $("#renameDialog");
    $("#renameInput").value = store.state.learner;
    dialog.returnValue = "";
    dialog.showModal();
    dialog.addEventListener("close", () => {
      const name = $("#renameInput").value.trim();
      if (dialog.returnValue === "save" && name) store.update((s) => (s.learner = name.slice(0, 40)));
    }, { once: true });
  } else if (action === "export") {
    download(`pyquest-progress-${new Date().toISOString().slice(0, 10)}.json`, store.exportJSON());
    toast("Progress exported.");
  } else if (action === "import") {
    $("#importInput").click();
  } else if (action === "reset") {
    if (await confirm("Reset all progress?", "This deletes solved problems, attempts, hints and saved code in this browser. Export first if you want a backup.", "Reset everything")) {
      store.reset();
      workspace.show(workspace.problem.id, { force: true });
      toast("Progress reset.");
    }
  }
});
$("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error("File is too large.");
    store.importJSON(await file.text());
    if (document.body.dataset.view === "lesson") workspace.show(workspace.problem.id, { force: true });
    toast("Progress imported.");
  } catch (err) {
    toast(`Import failed: ${err.message}`);
  }
});

// ----- Views & routing -----------------------------------------------------------------------
const workspace = createWorkspace({ store, runner, confirm });

function route() {
  const { view, problemId } = parseRoute(location.hash, store.state.lastProblem);
  for (const el of $$(".view")) el.hidden = el.id !== `${view}-view`;
  document.body.dataset.view = view;
  for (const link of $$("[data-nav]")) {
    const active = link.dataset.nav === view;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (view === "lesson") workspace.show(problemId);
  if (view === "curriculum") {
    renderCurriculum($("#curriculum-view"), store);
    document.title = "Curriculum | PyQuest";
  }
  if (view === "guide") {
    renderGuide($("#guide-view"));
    document.title = "How to use | PyQuest";
  }
  if (view !== "lesson") window.scrollTo(0, 0);
}

store.subscribe(() => {
  renderUser();
  if (document.body.dataset.view === "lesson") workspace.refresh();
  if (document.body.dataset.view === "curriculum") renderCurriculum($("#curriculum-view"), store);
});

window.addEventListener("hashchange", route);
renderUser();
route();

// Start loading Python while the learner reads the problem, without blocking first paint.
const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1200));
idle(() => runner.warmUp().catch(() => {}));
