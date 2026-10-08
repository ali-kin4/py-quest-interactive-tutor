// Small builders that keep problem files readable. Problems are plain data:
// review them like prose, and let `npm run verify:solutions` prove them.

/** A visible test case, rendered as a card in the workspace. */
export const test = (name, call, expected) => ({ name, call, expected, hidden: false });

/** A hidden test case: counted in the score, never rendered. */
export const hidden = (call, expected) => ({ name: "Hidden case", call, expected, hidden: true });

/** Trim shared indentation from template literals so code samples stay aligned in source. */
export function code(strings, ...values) {
  const raw = String.raw({ raw: strings }, ...values).replace(/^\n/, "").replace(/\n\s*$/, "");
  const lines = raw.split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join("\n") + "\n";
}
