// Short, accurate explanations the tutor can quote. Keys are matched against
// learner questions and problem concepts; aliases point at a canonical entry.

export const GLOSSARY = {
  strings: {
    title: "Strings",
    text: "A string (`str`) is an immutable sequence of characters. Methods such as `.lower()`, `.strip()` and `.replace()` return a *new* string — assign the result to keep it.",
    example: 'name = "  Ada "\nclean = name.strip().lower()  # "ada"',
  },
  strip: {
    title: "str.strip()",
    text: "`text.strip()` removes whitespace from both ends; `.lstrip()` and `.rstrip()` remove it from one side. Inner spaces are untouched.",
    example: '"  hi there  ".strip()  # "hi there"',
  },
  title: {
    title: "str.title()",
    text: "`text.title()` capitalises the first letter of every word and lower-cases the rest.",
    example: '"aDA lovelace".title()  # "Ada Lovelace"',
  },
  lower: {
    title: "str.lower()",
    text: "`text.lower()` returns a lower-case copy. Normalising case first makes comparisons case-insensitive.",
    example: '"PyThOn".lower() == "python"  # True',
  },
  split: {
    title: "str.split()",
    text: "`text.split()` with no argument splits on any run of whitespace and drops empty pieces. `text.split(\",\")` splits on an exact separator and keeps empty pieces.",
    example: '"a  b c".split()   # ["a", "b", "c"]\n"1,,2".split(",")  # ["1", "", "2"]',
  },
  join: {
    title: "str.join()",
    text: "`sep.join(items)` glues an iterable of strings together with `sep` between them. Every item must already be a string.",
    example: '", ".join(["a", "b"])  # "a, b"',
  },
  "f-string": {
    title: "f-strings",
    text: "Prefix a string with `f` to embed expressions in `{}`. Format specs follow a colon, e.g. `{value:.2f}` for two decimals.",
    example: 'total = 3.5\nf"Total: {total:.2f}"  # "Total: 3.50"',
  },
  slicing: {
    title: "Slicing",
    text: "`seq[start:stop:step]` takes a sub-sequence; `stop` is exclusive. `seq[::-1]` reverses. Slicing never raises IndexError — it just returns less.",
    example: '"python"[0:2]   # "py"\n[1, 2, 3][::-1]  # [3, 2, 1]',
  },
  return: {
    title: "return",
    text: "`return value` ends the function and hands `value` to the caller. A function that finishes without `return` gives back `None` — the most common cause of a test showing `None`.",
    example: "def double(x):\n    return x * 2",
  },
  print: {
    title: "print vs return",
    text: "`print()` writes text to the console for humans; `return` gives a value back to code. Tests check what your function *returns*, so printing the answer is not enough.",
    example: "def add(a, b):\n    return a + b  # not print(a + b)",
  },
  function: {
    title: "Functions",
    text: "`def name(params):` defines a reusable block of code. The tests call your function by exactly that name with the documented parameters.",
    example: "def greet(name):\n    return f\"Hello, {name}!\"",
  },
  if: {
    title: "if / elif / else",
    text: "Python checks conditions top to bottom and runs only the first branch that is true. Put the most specific condition first.",
    example: 'if score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"',
  },
  booleans: {
    title: "Booleans",
    text: "`True` and `False` combine with `and`, `or`, `not`. A comparison like `x > 3` already produces a boolean, so `return x > 3` is cleaner than an if/else returning True/False.",
    example: "is_adult = age >= 18 and has_id",
  },
  comparison: {
    title: "Comparisons",
    text: "`==`, `!=`, `<`, `<=`, `>`, `>=` compare values. Python allows chaining: `0 <= x <= 100` means both conditions hold.",
    example: "0 <= 42 <= 100  # True",
  },
  modulus: {
    title: "Modulus %",
    text: "`a % b` is the remainder of `a / b`. `n % 2 == 0` tests evenness; `n % 10` is the last digit. In Python the result takes the sign of `b`, so `-3 % 2 == 1`.",
    example: "17 % 5  # 2",
  },
  "integer division": {
    title: "Integer division //",
    text: "`a // b` divides and rounds down to a whole number. Combined with `%` it splits a number: `n // 10` drops the last digit.",
    example: "1234 // 10  # 123",
  },
  round: {
    title: "round()",
    text: "`round(x, 2)` rounds to two decimal places. Floats are binary, so `0.1 + 0.2` is `0.30000000000000004` — round results you present as money or KPIs.",
    example: "round(2.9699999, 2)  # 2.97",
  },
  for: {
    title: "for loops",
    text: "`for item in iterable:` runs the body once per element. Use `range(n)` for counts and `enumerate(items)` when you also need the index.",
    example: "for i, name in enumerate([\"a\", \"b\"]):\n    print(i, name)",
  },
  while: {
    title: "while loops",
    text: "`while condition:` repeats until the condition is false. Make sure something inside the loop moves towards stopping, or it runs forever (PyQuest stops runs after 15 s).",
    example: "n = 3\nwhile n > 0:\n    n -= 1",
  },
  range: {
    title: "range()",
    text: "`range(stop)` yields 0…stop-1; `range(start, stop, step)` is also exclusive of `stop`. Use `range(1, n + 1)` to include n.",
    example: "list(range(1, 4))  # [1, 2, 3]",
  },
  enumerate: {
    title: "enumerate()",
    text: "`enumerate(items)` yields `(index, item)` pairs so you do not have to manage a counter yourself.",
    example: 'for i, ch in enumerate("hi"):\n    print(i, ch)  # 0 h, 1 i',
  },
  lists: {
    title: "Lists",
    text: "A list is an ordered, mutable sequence. `.append(x)` adds one item, `.extend(items)` adds many, `len(lst)` counts them, and indexes start at 0.",
    example: "nums = [3, 1]\nnums.append(2)  # [3, 1, 2]",
  },
  append: {
    title: "list.append()",
    text: "`lst.append(x)` adds `x` to the end and returns `None` — so write `lst.append(x)`, never `lst = lst.append(x)`.",
    example: "result = []\nresult.append(1)",
  },
  extend: {
    title: "list.extend()",
    text: "`lst.extend(other)` adds every element of `other` to `lst`, whereas `append` would add `other` as a single nested item.",
    example: "a = [1]\na.extend([2, 3])  # [1, 2, 3]",
  },
  tuples: {
    title: "Tuples",
    text: "A tuple is an immutable, ordered group of values, written with parentheses: `(a, b)`. Functions often return tuples to hand back several values.",
    example: "def min_max(nums):\n    return (min(nums), max(nums))",
  },
  dictionaries: {
    title: "Dictionaries",
    text: "A dict maps keys to values. `d.get(key, default)` reads safely; `d[key] = value` writes. Counting pattern: `counts[k] = counts.get(k, 0) + 1`.",
    example: 'counts = {}\nfor w in ["a", "b", "a"]:\n    counts[w] = counts.get(w, 0) + 1',
  },
  get: {
    title: "dict.get()",
    text: "`d.get(key, default)` returns `default` instead of raising KeyError when the key is missing.",
    example: '{"a": 1}.get("b", 0)  # 0',
  },
  sets: {
    title: "Sets",
    text: "A set stores unique values with very fast membership tests (`x in s`). Converting a list to a set removes duplicates but loses order.",
    example: "set([3, 1, 3])  # {1, 3}",
  },
  membership: {
    title: "The in operator",
    text: "`x in container` tests membership. It is O(1) on sets and dicts but O(n) on lists and strings.",
    example: '"e" in "hello"  # True',
  },
  comprehension: {
    title: "Comprehensions",
    text: "`[expr for x in items if cond]` builds a list in one expression. Use parentheses for a lazy generator, e.g. inside `sum(...)`.",
    example: "squares = [x * x for x in range(5) if x % 2 == 0]",
  },
  sorted: {
    title: "sorted()",
    text: "`sorted(items)` returns a new ascending list; `reverse=True` flips it and `key=` customises the comparison. `list.sort()` sorts in place and returns `None`.",
    example: 'sorted(["b", "A", "c"], key=str.lower)',
  },
  None: {
    title: "None",
    text: "`None` represents ‘no value’. Compare with `is None`, not `== None`. Returning `None` deliberately is a clean way to signal ‘no answer’.",
    example: "if result is None:\n    ...",
  },
  try: {
    title: "try / except",
    text: "Wrap code that might fail in `try:` and handle a specific exception in `except ValueError:`. Catch only what you expect so real bugs still surface.",
    example: "try:\n    n = float(text)\nexcept ValueError:\n    n = None",
  },
  ValueError: {
    title: "ValueError",
    text: "Raised when a value has the right type but an invalid content — e.g. `int(\"abc\")` or `float(\"\")`.",
    example: 'int("12")   # 12\nint("1.5")  # ValueError',
  },
  recursion: {
    title: "Recursion",
    text: "A recursive function calls itself on a smaller input. It needs a base case that stops the recursion, otherwise Python raises RecursionError.",
    example: "def total(items):\n    return 0 if not items else items[0] + total(items[1:])",
  },
  isinstance: {
    title: "isinstance()",
    text: "`isinstance(value, list)` checks a value's type, including subclasses. Useful when data can be nested.",
    example: "isinstance([1], list)  # True",
  },
  abs: {
    title: "abs()",
    text: "`abs(x)` returns the absolute value — the distance from zero — so negatives become positive.",
    example: "abs(-7)  # 7",
  },
  stacks: {
    title: "Stacks",
    text: "A stack is last-in, first-out. With a list: `stack.append(x)` pushes and `stack.pop()` removes the most recent item. Check the stack is non-empty before popping.",
    example: "stack = []\nstack.append(\"(\")\ntop = stack.pop()",
  },
  algorithms: {
    title: "Thinking about efficiency",
    text: "Count how many times your code touches each element. One pass is O(n); a loop inside a loop is O(n²). Dicts and sets turn repeated searches into O(1) lookups.",
    example: "seen = set()\nfor x in items:\n    if x in seen: ...  # O(1) check",
  },
  "sliding window": {
    title: "Sliding window",
    text: "Instead of recomputing each window from scratch, keep a running total: add the element entering the window and subtract the one leaving it.",
    example: "total += values[i] - values[i - window]",
  },
  "two pointers": {
    title: "Two pointers",
    text: "Keep one index per sequence and advance whichever one you just consumed. It turns merging or pairing sorted data into a single pass.",
    example: "i = j = 0\nwhile i < len(a) and j < len(b): ...",
  },
  validation: {
    title: "Validating input",
    text: "Decide the rule first (type, range, allowed format), then check it explicitly. Count or report rejected records instead of silently dropping them.",
    example: "if not 0 <= value <= 100:\n    return None",
  },
  "edge cases": {
    title: "Edge cases",
    text: "Hidden tests usually probe: empty input, a single element, boundary values (0, the exact threshold), negatives, duplicates, and odd capitalisation or whitespace.",
    example: "assert fn([]) == ...\nassert fn([x]) == ...",
  },
  arithmetic: {
    title: "Arithmetic operators",
    text: "`+ - * /` work as expected; `/` always returns a float. `//` divides and rounds down, `%` gives the remainder and `**` raises to a power. Use parentheses to make the order explicit.",
    example: "7 / 2   # 3.5\n7 // 2  # 3\n7 % 2   # 1\n2 ** 3  # 8",
  },
  conversion: {
    title: "int() and float()",
    text: "`int(\"42\")` and `float(\"3.5\")` turn text into numbers; `str(42)` goes the other way. Converting text that isn't a number raises ValueError, and `int(3.9)` truncates to 3.",
    example: 'int("42") + 1    # 43\nfloat("2.5") * 2  # 5.0',
  },
  builtins: {
    title: "len, sum, min and max",
    text: "`len(x)` counts items, `sum(nums)` adds numbers, and `min()` / `max()` find the extremes. `min` and `max` raise ValueError on an empty list, so guard that case first.",
    example: "nums = [4, 8, 6]\nlen(nums), sum(nums), min(nums), max(nums)  # (3, 18, 4, 8)",
  },
  replace: {
    title: "str.replace()",
    text: "`text.replace(old, new)` returns a copy with every occurrence of `old` replaced. Replacing with `\"\"` deletes characters.",
    example: '"a,b,c".replace(",", "")  # "abc"',
  },
  isalnum: {
    title: "str.isalnum()",
    text: "`ch.isalnum()` is True for letters and digits and False for spaces and punctuation. Related checks: `.isalpha()` (letters only) and `.isdigit()` (digits only).",
    example: '"a".isalnum(), "7".isalnum(), "!".isalnum()  # (True, True, False)',
  },
  counting: {
    title: "Counting",
    text: "Start a counter at 0 before a loop and add 1 whenever a condition holds. For a one-liner, `sum(1 for x in items if condition)` counts matches.",
    example: 'count = 0\nfor ch in "banana":\n    if ch == "a":\n        count += 1  # 3',
  },
  indexing: {
    title: "Indexing",
    text: "`seq[0]` is the first item and `seq[-1]` the last. Valid indexes run from 0 to `len(seq) - 1`; anything else raises IndexError.",
    example: 'word = "python"\nword[0], word[-1]  # ("p", "n")',
  },
  pop: {
    title: "list.pop()",
    text: "`lst.pop()` removes and returns the last item; `lst.pop(0)` removes the first. Popping an empty list raises IndexError, so check `if lst:` first.",
    example: "stack = [1, 2, 3]\nstack.pop()  # 3, stack is now [1, 2]",
  },
  boundaries: {
    title: "Boundaries",
    text: "Read thresholds carefully: “at least 7” is `>= 7`, “more than 7” is `> 7`. Test the exact boundary value and the values on either side — that's where most bugs live.",
    example: "age >= 18  # 18 counts\nage > 18   # 18 does not",
  },
  complement: {
    title: "The complement trick",
    text: "When you need two values that combine to a target, the partner of `x` is `target - x`. Remember values you've already seen in a dict so you can check for the partner in O(1).",
    example: "seen = {}\nfor i, x in enumerate(nums):\n    if target - x in seen: ...\n    seen[x] = i",
  },
  parsing: {
    title: "Parsing text",
    text: "Break structured text into fields with `split()`, check you got the number of fields you expect, then convert each field to the right type.",
    example: 'date, time, level = "2026-10-08 12:00 INFO".split()',
  },
  "guard clauses": {
    title: "Guard clauses",
    text: "Handle special cases at the top of a function and return early. The main logic below can then assume valid input — no deep nesting needed.",
    example: "def average(nums):\n    if not nums:\n        return None\n    return sum(nums) / len(nums)",
  },
  aggregation: {
    title: "Aggregation and KPIs",
    text: "Aggregating means turning many records into a few numbers: counts, totals, averages. Decide which records count, accumulate in one pass, and round only once at the end.",
    example: "total = sum(amounts)\naverage = round(total / len(amounts), 2)",
  },
  "business rules": {
    title: "Encoding business rules",
    text: "Translate a rule into explicit, testable conditions. Normalise inputs (case, whitespace) first, give every input a defined outcome, and keep thresholds visible in the code.",
    example: 'if urgency == "critical" or age_days >= 7:\n    action = "Escalate"',
  },
};

const ALIASES = {
  string: "strings", str: "strings", "f string": "f-string", fstring: "f-string", format: "f-string",
  modulo: "modulus", remainder: "modulus", "%": "modulus", "//": "integer division", floor: "integer division",
  loop: "for", loops: "for", iterate: "for", iteration: "for",
  list: "lists", array: "lists", dict: "dictionaries", dictionary: "dictionaries", hashmap: "dictionaries",
  set: "sets", tuple: "tuples", except: "try", exception: "try", exceptions: "try",
  def: "function", functions: "function", parameter: "function",
  elif: "if", else: "if", condition: "if", conditions: "if", boolean: "booleans", bool: "booleans",
  "list comprehension": "comprehension", comprehensions: "comprehension", generator: "comprehension",
  sort: "sorted", sorting: "sorted", none: "None", null: "None", recursive: "recursion",
  "big o": "algorithms", complexity: "algorithms", efficient: "algorithms", performance: "algorithms",
  stack: "stacks", "edge case": "edge cases", rounding: "round", decimals: "round", reverse: "slicing", slice: "slicing",
  numbers: "arithmetic", operators: "arithmetic", int: "conversion", float: "conversion", convert: "conversion",
  len: "builtins", sum: "builtins", min: "builtins", max: "builtins", in: "membership", and: "booleans", or: "booleans",
  filtering: "comprehension", indices: "indexing", index: "indexing", boundary: "boundaries",
  "data quality": "validation", kpis: "aggregation", kpi: "aggregation", "running sum": "sliding window", "guard clause": "guard clauses",
};

/** Find the glossary entry most relevant to free text (longest match wins, plurals allowed). */
export function lookupConcept(text) {
  const q = ` ${String(text).toLowerCase().replace(/[^a-z0-9%/\-\s]/g, " ")} `;
  const candidates = [...Object.keys(GLOSSARY), ...Object.keys(ALIASES)].sort((a, b) => b.length - a.length);
  for (const term of candidates) {
    const t = term.toLowerCase();
    const escaped = t.replace(/[-/]/g, "\\$&");
    let found;
    if (!/^[a-z]/.test(t)) found = q.includes(t);
    else if (EVERYDAY_WORDS.has(t)) found = new RegExp(`(what s|what is|what are|what does|explain|about|use|using|${escaped} (loop|statement|keyword|function|method))[^a-z]+(a |an |the )?${escaped}(e?s)?[^a-z]|[^a-z]${escaped} (loop|statement|keyword|function|method)`).test(q);
    else found = new RegExp(`[^a-z]${escaped}(e?s)?[^a-z]`).test(q);
    if (found) return { key: ALIASES[term] ?? term, ...GLOSSARY[ALIASES[term] ?? term] };
  }
  return null;
}

// Keywords that are also ordinary English ("a set FOR the vowels", "IF I return…"):
// they only count when they are clearly the topic of the question.
const EVERYDAY_WORDS = new Set(["in", "and", "or", "sum", "min", "max", "index", "replace", "pop", "counting", "parsing", "numbers", "convert", "for", "if", "while", "return", "print", "set", "get", "title", "range", "join", "split", "strip", "lower", "round", "else", "def", "sort", "reverse", "slice", "condition", "conditions", "loop", "loops", "iterate", "format", "string", "list", "tuple", "function", "functions", "parameter", "none", "null", "abs"]);
