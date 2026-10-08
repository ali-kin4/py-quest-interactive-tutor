import { code } from "../helpers.js";

export default {
  id: "lists-tuples",
  unit: "data-structures",
  title: "Lists & Tuples",
  minutes: 25,
  summary: "Store many values in one variable, read and change them by position, and return several results at once.",
  objectives: [
    "Create lists and read items by index, negative index and slice",
    "Change a list with append, extend, insert and pop",
    "Build a result list inside a loop",
    "Choose between sorted() and .sort()",
    "Return several values as a tuple and unpack them",
  ],
  sections: [
    {
      heading: "Creating lists and reading items",
      body: [
        "A **list** holds several values in order, written between square brackets and separated by commas. Each item has a position called its **index**, and indexes start at `0`.",
        "Negative indexes count from the end: `-1` is the last item, `-2` the one before it. `len()` tells you how many items there are, so the last valid index is always `len(items) - 1`.",
      ],
      example: {
        code: code`
          scores = [72, 88, 95, 64]
          print(scores[0])
          print(scores[-1])
          print(len(scores))
          print(scores)
        `,
        output: "72\n64\n4\n[72, 88, 95, 64]",
      },
    },
    {
      heading: "Slicing",
      body: [
        "A **slice** `items[start:stop]` returns a new list from `start` up to, but not including, `stop`. Leave out `start` to begin at the front, or `stop` to run to the end. A third number is the step, so `items[::-1]` walks backwards.",
        "Slices are forgiving: if `stop` is past the end, Python simply gives you what is there. Asking for a single index that does not exist, however, raises an error.",
      ],
      example: {
        code: code`
          letters = ["a", "b", "c", "d", "e"]
          print(letters[1:3])
          print(letters[:2])
          print(letters[3:100])
          print(letters[::-1])
          print(letters[10])
        `,
        output: "['b', 'c']\n['a', 'b']\n['d', 'e']\n['e', 'd', 'c', 'b', 'a']",
        error: "IndexError",
        note: "Slicing past the end is safe; indexing past the end raises IndexError.",
      },
    },
    {
      heading: "Changing a list",
      body: [
        "Lists are **mutable**: you can change them after creating them. The most useful methods are:",
        {
          list: [
            "`items.append(x)` adds one item to the end.",
            "`items.extend(other)` adds every item of another list.",
            "`items.insert(i, x)` puts `x` at position `i`.",
            "`items.pop()` removes and returns the last item (or `items.pop(i)` for position `i`).",
            "`items[i] = x` replaces the item at position `i`.",
          ],
        },
      ],
      example: {
        code: code`
          tasks = ["write", "test"]
          tasks.append("ship")
          tasks.insert(0, "plan")
          tasks.extend(["review", "celebrate"])
          done = tasks.pop()
          tasks[1] = "draft"
          print(tasks)
          print("Removed:", done)
        `,
        output: "['plan', 'draft', 'test', 'ship', 'review']\nRemoved: celebrate",
      },
      callout: { kind: "warning", text: "Methods like `append` change the list **in place** and return `None`. Write `tasks.append(x)`, never `tasks = tasks.append(x)` — that replaces your list with `None`." },
    },
    {
      heading: "Building a result list in a loop",
      body: [
        "A very common pattern: start with an empty list, loop over some input, and `append` whatever you want to keep. The built-ins `len()`, `min()`, `max()` and `sum()` then summarise a list of numbers in one call.",
      ],
      example: {
        code: code`
          def squares_up_to(n):
              result = []
              for i in range(1, n + 1):
                  result.append(i * i)
              return result

          values = squares_up_to(5)
          print(values)
          print(min(values), max(values), sum(values))
          print(sum(values) / len(values))
        `,
        output: "[1, 4, 9, 16, 25]\n1 25 55\n11.0",
      },
    },
    {
      heading: "Sorting: sorted() versus .sort()",
      body: [
        "`sorted(items)` returns a **new** sorted list and leaves the original untouched. `items.sort()` sorts the list **in place** and returns `None`. Both accept `reverse=True` for descending order.",
        "Use `sorted()` when you still need the original order, and `.sort()` when you own the list and just want it reordered.",
      ],
      example: {
        code: code`
          prices = [30, 10, 20]
          ordered = sorted(prices)
          print(ordered, prices)

          result = prices.sort(reverse=True)
          print(prices)
          print(result)
        `,
        output: "[10, 20, 30] [30, 10, 20]\n[30, 20, 10]\nNone",
      },
    },
    {
      heading: "Positions with enumerate() and stepping through batches",
      body: [
        "When you need each item **and** its index, `enumerate(items)` gives you both, so you never have to manage a counter by hand.",
        "`range(start, stop, step)` jumps by `step`. Combined with the fact that slices never fail past the end, it is a neat way to visit a list a few items at a time.",
      ],
      example: {
        code: code`
          runners = ["Ada", "Grace", "Linus"]
          for position, name in enumerate(runners):
              print(position + 1, name)

          readings = [5, 8, 2, 9, 4, 7, 1]
          for start in range(0, len(readings), 3):
              print("Window from index", start, "->", readings[start:start + 3])
        `,
        output: "1 Ada\n2 Grace\n3 Linus\nWindow from index 0 -> [5, 8, 2]\nWindow from index 3 -> [9, 4, 7]\nWindow from index 6 -> [1]",
      },
    },
    {
      heading: "Tuples: fixed groups of values",
      body: [
        "A **tuple** is like a list that cannot be changed. You write it with parentheses: `(3, 4)`. Tuples are ideal for a small, fixed group of related values, such as a coordinate or a function's results.",
        "A function can return several values as one tuple, and the caller can **unpack** them into separate variables in a single line. The same trick swaps two variables: `a, b = b, a`.",
      ],
      example: {
        code: code`
          def low_high(numbers):
              return (min(numbers), max(numbers))

          result = low_high([7, 2, 9])
          print(result)

          low, high = low_high([7, 2, 9])
          print("Range:", high - low)

          a, b = 1, 2
          a, b = b, a
          print(a, b)
        `,
        output: "(2, 9)\nRange: 7\n2 1",
      },
    },
    {
      heading: "Guarding against empty lists",
      body: [
        "`min()` and `max()` raise an error on an empty list, and dividing by `len([])` divides by zero. An empty list is **falsy**, so `if not items:` is a clean way to handle that case first and return early — often with `None` to mean “no answer”.",
      ],
      example: {
        code: code`
          def average(numbers):
              if not numbers:
                  return None
              return sum(numbers) / len(numbers)

          print(average([2, 4, 9]))
          print(average([]))
          print(max([]))
        `,
        output: "5.0\nNone",
        error: "ValueError",
        note: "average() handles the empty case; the bare max([]) call does not.",
      },
    },
  ],
  keyPoints: [
    "Lists are ordered and mutable; indexes start at 0 and -1 is the last item.",
    "Slices return new lists and never fail past the end; single indexes do.",
    "append, extend, insert, pop and .sort() change the list in place and (except pop) return None.",
    "sorted() returns a new list; .sort() reorders the existing one.",
    "Tuples group a fixed set of values; return them from functions and unpack with a, b = ...",
    "Check for an empty list before calling min(), max() or dividing by len().",
  ],
  mistakes: [
    { mistake: "Writing items = items.append(x)", fix: "append returns None. Call items.append(x) on its own line." },
    { mistake: "Using items[len(items)] to get the last item", fix: "The last index is len(items) - 1, or simply items[-1]." },
    { mistake: "Printing the result of numbers.sort() and seeing None", fix: "Use sorted(numbers) when you need the sorted list as a value." },
    { mistake: "Calling max() or dividing by len() on data that might be empty", fix: "Handle if not items: first and return a sensible value such as None." },
  ],
  quiz: [
    {
      question: "Given nums = [4, 8, 15, 16], what is nums[-2]?",
      options: ["8", "15", "16", "IndexError"],
      answer: 1,
      explanation: "-1 is the last item (16), so -2 is the one before it: 15.",
    },
    {
      question: "What does print([1, 2, 3, 4, 5][3:10]) display?",
      options: ["IndexError", "[4, 5, None, None]", "[3, 4, 5]", "[4, 5]"],
      answer: 3,
      explanation: "Slices stop quietly at the end of the list, so you get the items from index 3 onward: [4, 5].",
    },
    {
      question: "What is stored in x after x = [3, 1, 2].sort()?",
      options: ["None", "[1, 2, 3]", "[3, 1, 2]", "An error is raised"],
      answer: 0,
      explanation: ".sort() reorders the list in place and returns None, so x is None. Use sorted() to get a value back.",
    },
    {
      question: "def stats(): return 3, 7 — which line puts 3 in a and 7 in b?",
      options: ["a = stats()[1]; b = stats()[0]", "a, b = stats()", "(a + b) = stats()", "a = b = stats()"],
      answer: 1,
      explanation: "The function returns the tuple (3, 7), and a, b = ... unpacks it into two variables in order.",
    },
  ],
  practice: ["fizzbuzz", "list-stats", "chunk-list"],
};
