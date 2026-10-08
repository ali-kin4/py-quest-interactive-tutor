// Tiny DOM helpers. All learner- and curriculum-provided text goes through
// escapeHTML (or textContent) before reaching the page.

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Tagged template that escapes every interpolation unless wrapped with raw(). */
export function html(strings, ...values) {
  return strings.reduce((out, str, i) => {
    if (i === 0) return str;
    const value = values[i - 1];
    const text = Array.isArray(value)
      ? value.map((v) => (v instanceof Raw ? v.value : escapeHTML(v))).join("")
      : value instanceof Raw
        ? value.value
        : escapeHTML(value);
    return out + text + str;
  }, "");
}

class Raw {
  constructor(value) {
    this.value = value;
  }
}
/** Mark trusted markup (already escaped or produced by html``). */
export const raw = (value) => new Raw(value);

/** Render inline `code` and **bold** in otherwise plain text, escaping everything first. */
export const richText = (text) =>
  raw(
    escapeHTML(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>"),
  );

export const DIFFICULTY_SHORT = { Easy: "E", Medium: "M", Hard: "H" };

let toastTimer;
export function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3500);
}

export function download(filename, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
