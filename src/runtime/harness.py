"""PyQuest grading harness.

Shared by the in-browser Pyodide worker and by ``scripts/verify_solutions.py``
(CPython), so the exact grading logic learners see is also what CI verifies.

Each test is ``{"name", "call", "expected", "hidden"}`` where ``call`` is a
Python expression evaluated against the learner's module namespace and
``expected`` is a Python literal. Every test runs in a fresh namespace so state
cannot leak between cases.
"""

import ast
import contextlib
import io
import json
import math
import time
import traceback

_MAX_TEXT = 2000
_LEARNER_FILE = "<learner>"


def _clip(text):
    text = str(text)
    return text if len(text) <= _MAX_TEXT else text[:_MAX_TEXT] + "…"


def _same(actual, expected):
    """Structural equality with float tolerance; lists and tuples compare by items."""
    if isinstance(actual, bool) or isinstance(expected, bool):
        return type(actual) is type(expected) and actual == expected
    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        return math.isclose(actual, expected, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(actual, (list, tuple)) and isinstance(expected, (list, tuple)):
        return len(actual) == len(expected) and all(_same(a, e) for a, e in zip(actual, expected))
    if isinstance(actual, dict) and isinstance(expected, dict):
        return actual.keys() == expected.keys() and all(_same(actual[k], expected[k]) for k in actual)
    return type(actual) is type(expected) and actual == expected


def _learner_error(exc):
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == _LEARNER_FILE]
    line = frames[-1].lineno if frames else getattr(exc, "lineno", None)
    return {"type": type(exc).__name__, "message": _clip(exc), "line": line}


def _no_input(prompt=""):
    raise EOFError("input() is not available in exercises - use the function parameters instead.")


def _fresh_namespace():
    return {"__name__": "__main__", "input": _no_input}


def _pyquest_run(source, tests_json):
    tests = json.loads(tests_json)
    started = time.perf_counter()
    report = {"compile_error": None, "module_error": None, "stdout": "", "results": [], "elapsed_ms": 0}

    try:
        code = compile(source, _LEARNER_FILE, "exec")
    except SyntaxError as exc:
        report["compile_error"] = {"type": type(exc).__name__, "message": _clip(exc.msg), "line": exc.lineno}
        return json.dumps(report)

    # One module-level run feeds the console tab (top-level prints and errors).
    module_out = io.StringIO()
    try:
        with contextlib.redirect_stdout(module_out):
            exec(code, _fresh_namespace())
    except Exception as exc:  # noqa: BLE001 - learner code may raise anything
        report["module_error"] = _learner_error(exc)
    report["stdout"] = _clip(module_out.getvalue())

    for test in tests:
        entry = {
            "name": test.get("name", ""),
            "call": test["call"],
            "expected": test["expected"],
            "hidden": bool(test.get("hidden")),
            "passed": False,
            "actual": None,
            "error": None,
            "stdout": "",
            "ms": 0,
        }
        out = io.StringIO()
        namespace = _fresh_namespace()
        try:
            with contextlib.redirect_stdout(out):
                exec(code, namespace)
                t0 = time.perf_counter()
                value = eval(test["call"], namespace)
                entry["ms"] = round((time.perf_counter() - t0) * 1000, 3)
            entry["actual"] = _clip(repr(value))
            entry["passed"] = _same(value, ast.literal_eval(test["expected"]))
        except Exception as exc:  # noqa: BLE001
            entry["error"] = _learner_error(exc)
        entry["stdout"] = _clip(out.getvalue())
        report["results"].append(entry)

    report["elapsed_ms"] = round((time.perf_counter() - started) * 1000, 2)
    return json.dumps(report)


def _pyquest_exec(source):
    """Run a code example like a script and capture what it prints."""
    report = {"stdout": "", "error": None, "elapsed_ms": 0}
    started = time.perf_counter()
    out = io.StringIO()
    try:
        code = compile(source, _LEARNER_FILE, "exec")
        with contextlib.redirect_stdout(out):
            exec(code, _fresh_namespace())
    except SyntaxError as exc:
        report["error"] = {"type": type(exc).__name__, "message": _clip(exc.msg), "line": exc.lineno}
    except Exception as exc:  # noqa: BLE001
        report["error"] = _learner_error(exc)
    report["stdout"] = _clip(out.getvalue())
    report["elapsed_ms"] = round((time.perf_counter() - started) * 1000, 2)
    return json.dumps(report)
