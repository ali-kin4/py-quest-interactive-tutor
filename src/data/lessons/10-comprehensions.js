import { code } from "../helpers.js";

export default {
  id: "comprehensions",
  unit: "data-structures",
  title: "Comprehensions & Generators",
  minutes: 25,
  summary: "Transform and filter collections in a single readable line, and summarise data without building temporary lists.",
  objectives: [
    "Write list comprehensions that transform and filter",
    "Use generator expressions inside sum(), any() and all()",
    "Build strings with \"\".join() and character tests like isalnum()",
    "Check for None before comparing values",
    "Recognise when a plain loop is clearer than a comprehension",
  ],
  sections: [
    {
      heading: "From loop to comprehension",
      body: [
        "Many loops follow the same shape: start an empty list, loop, append a transformed value. A **list comprehension** says the same thing in one expression: `[expression for item in iterable]`.",
        "Read it left to right as “give me *expression* for each *item* in *iterable*”. Both versions below produce exactly the same list.",
      ],
      example: {
        code: code`
          prices = [10, 25, 40]

          with_tax = []
          for p in prices:
              with_tax.append(p * 1.2)
          print(with_tax)

          print([p * 1.2 for p in prices])
        `,
        output: "[12.0, 30.0, 48.0]\n[12.0, 30.0, 48.0]",
      },
    },
    {
      heading: "Filtering with if",
      body: [
        "Add `if condition` at the end to keep only the items that pass: `[x for x in items if x > 0]`. You can filter and transform at the same time.",
        "Comprehensions work over any iterable — including strings and the pieces you get from `split()` — which makes them perfect for cleaning raw text.",
      ],
      example: {
        code: code`
          temperatures = [21, -3, 18, -7, 0, 25]
          print([t for t in temperatures if t > 0])

          raw = "3, 14, 8, 20"
          numbers = [int(part) for part in raw.split(",")]
          print(numbers)
          print([n * 2 for n in numbers if n % 2 == 0])
        `,
        output: "[21, 18, 25]\n[3, 14, 8, 20]\n[28, 16, 40]",
        note: "int() ignores the spaces around each piece, so \" 14\" becomes 14.",
      },
    },
    {
      heading: "Generator expressions: summarise without a list",
      body: [
        "Swap the square brackets for parentheses and you get a **generator expression**. It produces values one at a time instead of building a whole list in memory. Inside a function call you can even drop the extra parentheses: `sum(x * x for x in nums)`.",
        "Generators pair beautifully with `sum()`, `min()`, `max()`, `any()` and `all()`. A handy counting trick is `sum(1 for x in items if condition)` — add 1 for every item that matches.",
      ],
      example: {
        code: code`
          orders = [120, 45, 300, 80, 210]
          print(sum(o for o in orders if o >= 100))
          print(sum(1 for o in orders if o >= 100))
          print(any(o > 250 for o in orders))
          print(all(o > 50 for o in orders))
        `,
        output: "630\n3\nTrue\nFalse",
      },
      callout: { kind: "tip", text: "`any()` stops as soon as it finds a True value and `all()` stops at the first False, so they can be very fast on long data." },
    },
    {
      heading: "Building strings with join() and character tests",
      body: [
        "`separator.join(strings)` glues strings together. With an empty separator, `\"\".join(...)` and a generator, you can rebuild a string keeping only the characters you want.",
        "String methods test characters for you: `ch.isalnum()` is True for letters and digits, `ch.isdigit()` for digits only, and `ch.isalpha()` for letters only.",
      ],
      example: {
        code: code`
          code_text = "AB-12 / cd!"
          print("".join(ch for ch in code_text if ch.isalnum()))
          print("".join(ch for ch in code_text if ch.isdigit()))
          print("-".join(word.upper() for word in ["ready", "set", "go"]))
          print("7".isdigit(), "x".isdigit(), "_".isalnum())
        `,
        output: "AB12cd\n12\nREADY-SET-GO\nTrue False False",
      },
    },
    {
      heading: "Handling None before comparing",
      body: [
        "Real data has gaps, often represented by `None`. Comparing `None` with a number using `<` or `>` raises a `TypeError`, so check for it first with `value is None`.",
        "Python evaluates `or` from left to right and stops as soon as the answer is known, so `r is None or r < 0` never reaches the comparison when `r` is `None`.",
      ],
      example: {
        code: code`
          readings = [12, None, -4, 30]
          missing = sum(1 for r in readings if r is None)
          print("Missing:", missing)
          print("Problems:", sum(1 for r in readings if r is None or r < 0))
          print(None < 5)
        `,
        output: "Missing: 1\nProblems: 2",
        error: "TypeError",
        note: "Always test is None first; the bare comparison None < 5 fails.",
      },
    },
    {
      heading: "Dictionary and set comprehensions",
      body: [
        "The same idea builds other collections. Curly braces with a `key: value` pair make a **dict comprehension**; curly braces with a single expression make a **set comprehension**.",
      ],
      example: {
        code: code`
          words = ["apple", "fig", "banana"]
          lengths = {w: len(w) for w in words}
          print(lengths)

          first_letters = {w[0] for w in ["ant", "bee", "ape", "bat"]}
          print(sorted(first_letters))
        `,
        output: "{'apple': 5, 'fig': 3, 'banana': 6}\n['a', 'b']",
      },
    },
    {
      heading: "When not to use a comprehension",
      body: [
        "Comprehensions are for **building a collection** from another one. Reach for a regular loop when:",
        {
          list: [
            "the logic needs several steps, `try`/`except`, or `elif` branches;",
            "you are doing something for its effect, such as printing — `[print(x) for x in items]` builds a useless list of `None`s;",
            "the line grows so long that a reader has to decode it.",
          ],
        },
        "Clear beats clever: a four-line loop that anyone can read is better than a one-liner nobody can.",
      ],
    },
  ],
  keyPoints: [
    "[expr for x in items if cond] transforms and filters in one expression.",
    "Parentheses instead of brackets give a generator, ideal inside sum(), any(), all(), min() and max().",
    "sum(1 for x in items if cond) counts matching items.",
    "\"\".join(ch for ch in text if ch.isalnum()) keeps only the characters you want.",
    "Test value is None before comparing it with numbers.",
    "Use a plain loop when the logic is complex or the goal is a side effect.",
  ],
  mistakes: [
    { mistake: "Writing a comprehension just to print: [print(x) for x in items]", fix: "Use a normal for loop for actions; comprehensions are for building collections." },
    { mistake: "Comparing a value that might be None: if r < 0", fix: "Check first: if r is None or r < 0." },
    { mistake: "Putting the filter in the wrong place: [x if x > 0 for x in nums]", fix: "A filter goes at the end: [x for x in nums if x > 0]." },
  ],
  quiz: [
    {
      question: "What does [n * 10 for n in [1, 2, 3] if n != 2] produce?",
      options: ["[10, 20, 30]", "[10, 30]", "[1, 3]", "[20]"],
      answer: 1,
      explanation: "The filter drops 2, and each remaining number is multiplied by 10.",
    },
    {
      question: "What is sum(1 for w in [\"hi\", \"\", \"yo\", \"\"] if w)?",
      options: ["4", "0", "2", "\"hiyo\""],
      answer: 2,
      explanation: "Empty strings are falsy, so only \"hi\" and \"yo\" pass the filter, and 1 is added for each.",
    },
    {
      question: "readings may contain None. Which condition safely flags values below zero or missing?",
      options: ["r < 0 or r is None", "r is None or r < 0", "r == None and r < 0", "r < 0"],
      answer: 1,
      explanation: "or stops at the first True, so checking is None first prevents comparing None with 0, which would raise TypeError.",
    },
    {
      question: "What does \"\".join(c for c in \"a1-b2\" if c.isdigit()) return?",
      options: ["\"ab\"", "\"a1b2\"", "[\"1\", \"2\"]", "\"12\""],
      answer: 3,
      explanation: "Only the digit characters are kept, and join glues them into a single string.",
    },
  ],
  practice: ["palindrome", "clean-amounts", "sensor-quality"],
};
