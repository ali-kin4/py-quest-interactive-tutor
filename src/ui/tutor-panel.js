// Chat-style tutor panel. Renders engine replies; emits actions to the app.
import * as engine from "../tutor/engine.js";
import { $, html, raw, richText } from "./dom.js";
import { highlightPython } from "./highlight.js";

const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function renderBlock(block) {
  if (block.kind === "text") return html`<p>${richText(block.text)}</p>`;
  if (block.kind === "list") return html`<ul>${block.items.map((item) => raw(html`<li>${richText(item)}</li>`))}</ul>`;
  if (block.kind === "code") return `<pre class="snippet"><code>${highlightPython(block.code)}</code></pre>`;
  return "";
}

/**
 * @param {{ getContext: () => {problem, report, hintLevel}, onAction: (action) => void, onHint: () => void }} deps
 *   onHint is called after a typed question consumed the next hint.
 */
export function createTutorPanel({ getContext, onAction, onHint }) {
  const log = $("#tutorLog");
  const form = $("#askForm");
  const input = $("#askInput");

  function append(message) {
    const node = document.createElement("div");
    node.className = `msg msg-${message.role}`;
    if (message.role === "user") {
      node.innerHTML = html`<div class="bubble">${message.text}<time>${time()}</time></div>`;
    } else {
      node.innerHTML = html`
        <div class="bubble">${raw(message.blocks.map(renderBlock).join(""))}</div>
        ${message.actions?.length
          ? raw(html`<div class="msg-actions">${message.actions.map((a, i) =>
              raw(html`<button type="button" class="chip-btn" data-action-index="${i}">${a.label}</button>`))}</div>`)
          : ""}`;
      node.querySelectorAll("[data-action-index]").forEach((btn) =>
        btn.addEventListener("click", () => onAction(message.actions[Number(btn.dataset.actionIndex)])),
      );
    }
    log.append(node);
    log.scrollTo({ top: log.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function ask(question) {
    const q = question.trim();
    if (!q) return;
    append({ role: "user", text: q });
    const ctx = getContext();
    const response = engine.answer(ctx.problem, q, ctx);
    // A question the engine treated as a hint request advances the hint ladder.
    if (response.intent === "hint") onHint();
    setTimeout(() => append(response), 120);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
  });

  return {
    reset(problem) {
      log.innerHTML = "";
      append(engine.welcome(problem));
    },
    say: append,
    ask,
    userSays(text) {
      append({ role: "user", text });
    },
  };
}
