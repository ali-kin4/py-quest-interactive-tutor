// Code editor: a transparent <textarea> layered over a highlighted <pre>.
// Keeps native editing, IME, undo and accessibility while showing colour.
import { $ } from "./dom.js";
import { highlightPython } from "./highlight.js";

const INDENT = "    ";

export function createEditor(root, { onChange = () => {}, onRun = () => {} } = {}) {
  root.innerHTML = `
    <div class="editor-gutter" aria-hidden="true"></div>
    <div class="editor-scroll">
      <div class="editor-layer">
        <pre class="editor-highlight" aria-hidden="true"><code></code></pre>
        <textarea class="editor-input" spellcheck="false" autocapitalize="off" autocomplete="off"
          autocorrect="off" wrap="off" aria-label="Python code editor" aria-describedby="editorHelp"></textarea>
      </div>
    </div>`;
  const gutter = $(".editor-gutter", root);
  const highlight = $(".editor-highlight code", root);
  const input = $(".editor-input", root);
  const scroller = $(".editor-scroll", root);

  let lineCount = 0;
  function render() {
    // Trailing newline keeps the <pre> height in sync with the textarea.
    highlight.innerHTML = highlightPython(input.value) + "\n";
    const lines = input.value.split("\n").length;
    if (lines !== lineCount) {
      lineCount = lines;
      gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<span>${i + 1}</span>`).join("");
    }
    markActiveLine();
  }
  function markActiveLine() {
    const line = input.value.slice(0, input.selectionStart).split("\n").length;
    gutter.querySelector(".active")?.classList.remove("active");
    gutter.children[line - 1]?.classList.add("active");
  }
  function syncScroll() {
    gutter.scrollTop = scroller.scrollTop;
  }

  /** Replace [start, end) with text using execCommand so native undo keeps working. */
  function replaceRange(start, end, text, caret = start + text.length) {
    input.focus();
    input.setSelectionRange(start, end);
    if (!document.execCommand?.("insertText", false, text)) {
      input.setRangeText(text, start, end, "end");
    }
    input.setSelectionRange(caret, caret);
    changed();
  }

  function changed() {
    render();
    onChange(input.value);
  }

  input.addEventListener("input", changed);
  scroller.addEventListener("scroll", syncScroll);
  input.addEventListener("click", markActiveLine);
  input.addEventListener("keyup", markActiveLine);

  input.addEventListener("keydown", (event) => {
    const { selectionStart: start, selectionEnd: end, value } = input;
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
      return;
    }
    if (event.key === "Escape") {
      // Let keyboard users leave the editor (Tab is captured for indentation).
      input.blur();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      if (event.shiftKey || start !== end) {
        const blockEnd = end;
        const block = value.slice(lineStart, blockEnd);
        const updated = event.shiftKey
          ? block.replace(/^( {1,4}|\t)/gm, "")
          : block.replace(/^/gm, INDENT);
        replaceRange(lineStart, blockEnd, updated, lineStart + updated.length);
        input.setSelectionRange(lineStart, lineStart + updated.length);
      } else {
        replaceRange(start, end, INDENT);
      }
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      let indent = line.match(/^\s*/)[0];
      if (/:\s*(#.*)?$/.test(line)) indent += INDENT;
      else if (/^\s*(return|pass|break|continue|raise)\b/.test(line)) indent = indent.slice(0, Math.max(0, indent.length - 4));
      replaceRange(start, end, "\n" + indent);
      return;
    }
    if (event.key === "Backspace" && start === end) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const before = value.slice(lineStart, start);
      if (before.length > 0 && /^ +$/.test(before)) {
        event.preventDefault();
        const remove = before.length % 4 || 4;
        replaceRange(start - remove, start, "");
      }
    }
  });

  return {
    get value() {
      return input.value;
    },
    set value(code) {
      input.value = code;
      render();
      scroller.scrollTop = 0;
      scroller.scrollLeft = 0;
    },
    focus() {
      input.focus();
    },
    /** Move the caret to a 1-based line (used to jump to an error). */
    goToLine(line) {
      const lines = input.value.split("\n");
      const offset = lines.slice(0, Math.max(0, line - 1)).reduce((n, l) => n + l.length + 1, 0);
      input.focus();
      input.setSelectionRange(offset, offset + (lines[line - 1]?.length ?? 0));
      markActiveLine();
    },
    setLabel(label) {
      input.setAttribute("aria-label", label);
    },
  };
}
