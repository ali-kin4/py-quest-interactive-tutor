import { code } from "../helpers.js";

export default {
  id: "recursion-stacks",
  unit: "robust-code",
  title: "Recursion & Stacks",
  minutes: 30,
  summary: "Solve problems by letting a function call itself, and use a list as a stack to keep track of unfinished work.",
  objectives: [
    "Write a recursive function with a base case and a recursive case",
    "Trace how recursive calls start and finish",
    "Recognise and fix a RecursionError",
    "Process nested lists with recursion and isinstance()",
    "Use a list as a stack with append() and pop()",
  ],
  sections: [
    {
      heading: "A function that calls itself",
      body: [
        "A **recursive** function solves a problem by calling itself on a *smaller* version of the same problem. Every recursive function has two parts:",
        {
          list: [
            "a **base case** — an input so small the answer is obvious, returned without recursing;",
            "a **recursive case** — do a little work, then call the function on a smaller input.",
          ],
        },
        "Each call shrinks the problem until it reaches the base case, and then the answers flow back up.",
      ],
      example: {
        code: code`
          def countdown(n):
              if n == 0:
                  print("Lift off!")
                  return
              print(n)
              countdown(n - 1)

          countdown(3)
        `,
        output: "3\n2\n1\nLift off!",
      },
    },
    {
      heading: "Tracing the calls",
      body: [
        "To understand recursion, follow the calls. Here `factorial(4)` means `4 × 3 × 2 × 1`. Each call prints itself, indented by how deep it is. Calls go *down* until `n` reaches 1; then each waiting call multiplies the result it receives and returns it *up*.",
      ],
      example: {
        code: code`
          def factorial(n, depth=0):
              print("  " * depth + "factorial(" + str(n) + ")")
              if n <= 1:
                  return 1
              return n * factorial(n - 1, depth + 1)

          print(factorial(4))
        `,
        output: "factorial(4)\n  factorial(3)\n    factorial(2)\n      factorial(1)\n24",
      },
    },
    {
      heading: "Recursion on lists",
      body: [
        "Lists can be broken down the same way: a list is its **first item** plus **the rest** of the list. The empty list is the natural base case.",
        "This is not the fastest way to add numbers — `sum()` is better — but it shows the shape that recursive solutions share.",
      ],
      example: {
        code: code`
          def total(items):
              if not items:
                  return 0
              return items[0] + total(items[1:])

          print(total([5, 10, 20]))
          print(total([]))
        `,
        output: "35\n0",
      },
    },
    {
      heading: "Forgetting the base case",
      body: [
        "Without a base case, the function calls itself forever. Python protects you: after about 1000 nested calls it stops with a **RecursionError**. If you see one, check that a base case exists *and* that every recursive call moves closer to it.",
      ],
      example: {
        code: code`
          def shrink(n):
              return shrink(n - 1)

          print("starting")
          shrink(10)
        `,
        output: "starting",
        error: "RecursionError",
        note: "Fix it with a base case such as: if n == 0: return 0",
      },
      callout: { kind: "warning", text: "A base case that is never reached is as bad as none. shrink(n - 2) with a base case of n == 0 still fails for odd numbers." },
    },
    {
      heading: "Nested data and isinstance()",
      body: [
        "Recursion shines when data contains *copies of its own shape* — lists inside lists, folders inside folders. `isinstance(value, list)` tells you whether an item is itself a list that needs the same treatment.",
        "Here we count every non-list value, however deeply it is nested.",
      ],
      example: {
        code: code`
          def count_values(data):
              count = 0
              for item in data:
                  if isinstance(item, list):
                      count += count_values(item)
                  else:
                      count += 1
              return count

          print(count_values([1, [2, 3], [[4], 5], []]))
          print(isinstance([1, 2], list), isinstance("hi", list))
        `,
        output: "5\nTrue False",
      },
    },
    {
      heading: "Stacks: last in, first out",
      body: [
        "A **stack** is like a pile of plates: you add to the top and take from the top. The most recently added item comes off first — *last in, first out*.",
        "A Python list makes a perfect stack: `append()` pushes onto the top and `pop()` removes and returns the top item. Undo history in an editor works exactly like this.",
      ],
      example: {
        code: code`
          history = []
          history.append("type Hello")
          history.append("make bold")
          history.append("type world")

          print("undo:", history.pop())
          print("undo:", history.pop())
          print("left:", history)
        `,
        output: "undo: type world\nundo: make bold\nleft: ['type Hello']",
      },
      callout: { kind: "tip", text: "Calling pop() on an empty list raises IndexError. Check the stack is non-empty first: if stack: ..." },
    },
    {
      heading: "Matching pairs with a stack",
      body: [
        "Stacks are the tool for checking that things open and close in the right order. Push every *opening* item. When a *closing* item arrives, the top of the stack must be its partner — a dict maps each closer to the opener it needs. At the end, nothing should be left open.",
        "Here the items are HTML-style tags.",
      ],
      example: {
        code: code`
          closes = {"</b>": "<b>", "</i>": "<i>"}

          def tags_ok(tags):
              stack = []
              for tag in tags:
                  if tag in closes.values():
                      stack.append(tag)
                  elif tag in closes:
                      if not stack or stack.pop() != closes[tag]:
                          return False
              return not stack

          print(tags_ok(["<b>", "<i>", "</i>", "</b>"]))
          print(tags_ok(["<b>", "<i>", "</b>", "</i>"]))
          print(tags_ok(["<b>"]))
        `,
        output: "True\nFalse\nFalse",
      },
    },
  ],
  keyPoints: [
    "A recursive function needs a base case and a recursive case that moves towards it.",
    "Calls go down until the base case, then results return back up through each waiting call.",
    "RecursionError means the base case is missing or never reached.",
    "isinstance(item, list) lets recursion handle data nested to any depth.",
    "A list works as a stack: append() pushes, pop() removes the most recent item.",
  ],
  mistakes: [
    { mistake: "No base case, or one the input never reaches", fix: "Write the base case first and make sure every call shrinks the input towards it." },
    { mistake: "Forgetting to return the recursive call's result", fix: "Write return n * factorial(n - 1), not just factorial(n - 1)." },
    { mistake: "Calling pop() on an empty stack", fix: "Check if stack: (or if not stack:) before popping." },
    { mistake: "Ignoring items still on the stack at the end", fix: "Leftover openers mean something was never closed; return not stack." },
  ],
  quiz: [
    {
      question: "What makes a recursive function stop?",
      options: ["Python stops it after one call", "Reaching a base case that returns without recursing", "Using a while loop inside it", "Printing its result"],
      answer: 1,
      explanation: "The base case returns directly. Without one, the calls continue until Python raises RecursionError.",
    },
    {
      question: "stack = [1, 2]; stack.append(3); stack.pop() — what does pop() return?",
      options: ["1", "2", "[1, 2]", "3"],
      answer: 3,
      explanation: "A stack is last in, first out: 3 was pushed last, so it comes off first.",
    },
    {
      question: "What does isinstance([4, 5], list) return?",
      options: ["True", "False", "list", "[4, 5]"],
      answer: 0,
      explanation: "isinstance checks a value's type and returns a boolean; [4, 5] is a list.",
    },
    {
      question: "def f(n): return n + f(n - 1) — what happens when you call f(3)?",
      options: ["It returns 6", "It returns 3", "It raises RecursionError", "It returns None"],
      answer: 2,
      explanation: "There is no base case, so f keeps calling itself with smaller and smaller numbers until Python gives up.",
    },
  ],
  practice: ["flatten", "balanced-brackets"],
};
