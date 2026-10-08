"""Run every lesson code example and compare its output with the lesson text.

Reads a JSON list of {"where", "code", "output", "error"} from stdin (see
scripts/verify-lessons.mjs). An example passes when its stdout matches
``output`` exactly (ignoring trailing whitespace) and it raises exactly the
declared ``error`` (or nothing when no error is declared).
"""

import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "src" / "runtime"))
from harness import _pyquest_exec  # noqa: E402


def main():
    examples = json.load(sys.stdin)
    failures = 0
    for ex in examples:
        report = json.loads(_pyquest_exec(ex["code"]))
        actual_error = report["error"]["type"] if report["error"] else None
        problems = []
        if report["stdout"].rstrip() != ex["output"].rstrip():
            problems.append(f"output differs\n--- expected\n{ex['output'].rstrip()}\n--- actual\n{report['stdout'].rstrip()}")
        if actual_error != ex.get("error"):
            detail = report["error"]["message"] if report["error"] else ""
            problems.append(f"expected error {ex.get('error')!r}, got {actual_error!r} {detail}")
        if problems:
            failures += 1
            print(f"FAIL {ex['where']}: " + "\n".join(problems) + "\n")
    print(f"Verified {len(examples)} lesson examples, {failures} failures.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
