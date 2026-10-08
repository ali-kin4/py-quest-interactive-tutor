"""Grade every reference solution and starter with the real harness (CPython).

Reads a JSON list of problems from stdin (see scripts/verify-solutions.mjs).
A problem passes verification when its solution passes every test, its starter
fails at least one test (so the exercise is not already solved) and its
scaffold compiles.
"""

import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "src" / "runtime"))
from harness import _pyquest_run  # noqa: E402


def main():
    problems = json.load(sys.stdin)
    failures = []
    for problem in problems:
        tests = json.dumps(problem["tests"])
        solved = json.loads(_pyquest_run(problem["solution"], tests))
        for result in solved["results"]:
            if not result["passed"]:
                failures.append(f"{problem['id']}: solution fails {result['call']} -> {result['actual']} {result['error'] or ''}")
        if solved["compile_error"] or solved["module_error"]:
            failures.append(f"{problem['id']}: solution error {solved['compile_error'] or solved['module_error']}")

        started = json.loads(_pyquest_run(problem["starter"], tests))
        if started["compile_error"]:
            failures.append(f"{problem['id']}: starter does not compile {started['compile_error']}")
        if all(r["passed"] for r in started["results"]):
            failures.append(f"{problem['id']}: starter already passes every test")

        try:  # scaffolds contain ... placeholders, so compile them but never run them
            compile(problem["scaffold"], "<scaffold>", "exec")
        except SyntaxError as exc:
            failures.append(f"{problem['id']}: scaffold does not compile ({exc.msg}, line {exc.lineno})")

    for failure in failures:
        print("FAIL", failure)
    print(f"Verified {len(problems)} problems, {sum(len(p['tests']) for p in problems)} tests, {len(failures)} failures.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
