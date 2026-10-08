// Minimal Python syntax highlighter: one pass, escaped output, no dependencies.
import { escapeHTML } from "./dom.js";

const KEYWORDS = new Set(
  "and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case".split(" "),
);
const CONSTANTS = new Set(["True", "False", "None"]);
const BUILTINS = new Set(
  "abs all any bool dict enumerate filter float format input int isinstance len list map max min open print range repr reversed round set sorted str sum tuple type zip Exception ValueError TypeError KeyError IndexError ZeroDivisionError NotImplementedError EOFError".split(" "),
);

const TOKEN = new RegExp(
  [
    String.raw`(?<comment>#[^\n]*)`,
    String.raw`(?<string>[rRbBfFuU]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))`,
    String.raw`(?<number>\b(?:0[xob][\da-fA-F_]+|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?j?)\b)`,
    String.raw`(?<decorator>@[A-Za-z_]\w*)`,
    String.raw`(?<word>[A-Za-z_]\w*)`,
    String.raw`(?<op>[-+*/%=<>!&|^~]+|[()[\]{}:,.;])`,
  ].join("|"),
  "g",
);

/** Returns HTML for the given Python source. */
export function highlightPython(source) {
  let out = "";
  let last = 0;
  let previousWord = "";
  for (const match of source.matchAll(TOKEN)) {
    out += escapeHTML(source.slice(last, match.index));
    last = match.index + match[0].length;
    const text = escapeHTML(match[0]);
    const g = match.groups;
    let cls = "";
    if (g.comment) cls = "tok-comment";
    else if (g.string) cls = "tok-string";
    else if (g.number) cls = "tok-number";
    else if (g.decorator) cls = "tok-decorator";
    else if (g.word) {
      if (KEYWORDS.has(g.word)) cls = "tok-keyword";
      else if (CONSTANTS.has(g.word)) cls = "tok-constant";
      else if (previousWord === "def" || previousWord === "class") cls = "tok-def";
      else if (BUILTINS.has(g.word)) cls = "tok-builtin";
      else if (g.word === "self") cls = "tok-self";
      previousWord = g.word;
    } else if (g.op) cls = /^[()[\]{}]$/.test(g.op) ? "tok-bracket" : "tok-op";
    if (!g.word) previousWord = g.op === "." ? previousWord : "";
    out += cls ? `<span class="${cls}">${text}</span>` : text;
  }
  return out + escapeHTML(source.slice(last));
}
