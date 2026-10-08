import { code } from "../helpers.js";

export default {
  id: "algorithm-patterns",
  unit: "robust-code",
  title: "Algorithm Patterns & Efficiency",
  minutes: 30,
  summary: "Count how much work your code does, and learn three patterns that turn slow solutions into fast ones.",
  objectives: [
    "Estimate how the work a program does grows with the size of its input",
    "Recognise why nested loops become slow on large inputs",
    "Use a dictionary or set to remember what you have already seen",
    "Walk two sorted sequences at once with two pointers",
    "Keep a running total with a sliding window",
  ],
  sections: [
    {
      heading: "What does 'efficient' mean?",
      body: [
        "Two programs can give the same answer while doing very different amounts of work. We measure efficiency by asking: **if the input doubles, how much more work happens?**",
        "A single loop over `n` items does about `n` steps — we call that **O(n)**, or *linear*. A loop inside another loop over the same items does about `n × n` steps — **O(n²)**, or *quadratic*. For 10 items the difference is tiny; for 100,000 items it is the difference between a blink and minutes.",
      ],
      example: {
        code: code`
          for n in [10, 1000, 100000]:
              print(n, "items: single loop", n, "steps, nested loops", n * n, "steps")
        `,
        output: "10 items: single loop 10 steps, nested loops 100 steps\n1000 items: single loop 1000 steps, nested loops 1000000 steps\n100000 items: single loop 100000 steps, nested loops 10000000000 steps",
      },
    },
    {
      heading: "The cost of nested loops",
      body: [
        "Nested loops are the natural first attempt when you need to compare items with each other. They are correct, and fine for small inputs, but every extra item adds a whole extra pass. Here we count how many comparisons a nested loop makes while looking for a repeated name.",
      ],
      example: {
        code: code`
          names = ["ana", "ben", "cara", "dev", "ben"]
          comparisons = 0
          found = None
          for i in range(len(names)):
              for j in range(i + 1, len(names)):
                  comparisons += 1
                  if names[i] == names[j] and found is None:
                      found = names[i]
          print("repeated:", found)
          print("comparisons:", comparisons)
        `,
        output: "repeated: ben\ncomparisons: 10",
      },
    },
    {
      heading: "Remember what you have seen",
      body: [
        "Checking `x in some_set` or `key in some_dict` takes roughly the same time no matter how big the collection is. That lets you replace the inner loop with a **lookup**: walk the data once, and keep a set (or dict) of everything seen so far.",
        "Use a set when you only need to know *whether* you have seen something; use a dict when you also need to remember *where* or *how many*.",
      ],
      example: {
        code: code`
          def first_repeat(items):
              seen = set()
              for item in items:
                  if item in seen:
                      return item
                  seen.add(item)
              return None

          print(first_repeat(["ana", "ben", "cara", "dev", "ben"]))
          print(first_repeat([1, 2, 3]))
        `,
        output: "ben\nNone",
      },
    },
    {
      heading: "Looking up a partner value",
      body: [
        "A dict lookup can also answer *“have I seen the value that would complete this one?”*. Here we look for two readings whose difference is exactly 5. For each reading we ask whether `reading - 5` or `reading + 5` appeared earlier, and remember each reading's position in a dict.",
      ],
      example: {
        code: code`
          readings = [12, 30, 7, 41, 25]
          position = {}
          for index, value in enumerate(readings):
              for partner in (value - 5, value + 5):
                  if partner in position:
                      print("positions", position[partner], "and", index, ":", partner, "and", value)
              position[value] = index
        `,
        output: "positions 0 and 2 : 12 and 7\npositions 1 and 4 : 30 and 25",
        note: "Only one pass over the list, yet every earlier value is checked through the dict.",
      },
      callout: { kind: "tip", text: "Check the dict *before* adding the current item, so an item is never paired with itself." },
    },
    {
      heading: "Two pointers on sorted data",
      body: [
        "When two lists are already **sorted**, you can walk them together with one index each — two *pointers*. Compare the current items, act, and advance whichever pointer makes sense. Each step moves at least one pointer forward, so the whole job takes one pass over both lists.",
        "Here we find the values that appear in both sorted lists. When the items match we record it and move both pointers; otherwise we move the pointer at the smaller value, because it can never match anything later in the other list.",
      ],
      example: {
        code: code`
          def common(a, b):
              i = j = 0
              shared = []
              while i < len(a) and j < len(b):
                  if a[i] == b[j]:
                      shared.append(a[i])
                      i += 1
                      j += 1
                  elif a[i] < b[j]:
                      i += 1
                  else:
                      j += 1
              return shared

          print(common([1, 3, 4, 8, 10], [2, 3, 8, 9, 10]))
        `,
        output: "[3, 8, 10]",
      },
    },
    {
      heading: "Sliding windows with a running total",
      body: [
        "Many problems look at every group of `k` consecutive values. Re-adding all `k` values for each group repeats a lot of work. Instead, keep a **running total**: when the window slides one step, add the value that enters and subtract the value that leaves.",
        "Below we find the best total sales over any 3 consecutive days.",
      ],
      example: {
        code: code`
          def best_window(values, k):
              total = sum(values[:k])
              best = total
              for i in range(k, len(values)):
                  total += values[i] - values[i - k]
                  best = max(best, total)
              return best

          sales = [4, 2, 9, 1, 7, 8, 3]
          print(best_window(sales, 3))
        `,
        output: "18",
        note: "The window totals are 15, 12, 17, 16 and 18 — each computed with one addition and one subtraction.",
      },
    },
    {
      heading: "Choosing the right data structure",
      body: [
        "Most speed-ups come from picking the right container for the questions you will ask:",
        {
          list: [
            "**list** — ordered items, fast to loop over and index; slow to search with `in` on large data.",
            "**set** — fast membership tests and removing duplicates; no order, no counts.",
            "**dict** — fast lookup from a key to a value: positions, counts, totals.",
            "**sorted list** — enables two pointers and finding neighbours in one pass.",
          ],
        },
        "Before writing a nested loop, ask: *could a set, a dict or sorting the data first let me do this in one pass?*",
      ],
    },
  ],
  keyPoints: [
    "Efficiency is about how the amount of work grows as the input grows.",
    "One loop is O(n); a loop inside a loop over the same data is O(n²).",
    "Sets and dicts answer 'have I seen this?' in a single step, replacing an inner loop.",
    "Two pointers process two sorted sequences in one pass.",
    "A sliding window updates a running total instead of re-adding every value.",
  ],
  mistakes: [
    { mistake: "Searching a large list with in inside a loop", fix: "Put the values in a set or dict once, then look them up." },
    { mistake: "Adding the current item to the dict before checking for its partner", fix: "Check first, then store, so an item never pairs with itself." },
    { mistake: "Recomputing sum(values[i:i + k]) for every window", fix: "Keep a running total: add the entering value, subtract the leaving one." },
  ],
  quiz: [
    {
      question: "A function compares every item with every other item using two nested loops. Roughly how does its work grow when the input becomes 10 times larger?",
      options: ["About 10 times more", "About 100 times more", "It stays the same", "About 2 times more"],
      answer: 1,
      explanation: "Nested loops do about n × n steps, so 10 times the items means about 10 × 10 = 100 times the work.",
    },
    {
      question: "Which container gives the fastest answer to \"is this value already present?\" for a large collection?",
      options: ["A list", "A string", "A tuple", "A set"],
      answer: 3,
      explanation: "Set membership takes about the same time regardless of size; lists, strings and tuples are searched item by item.",
    },
    {
      question: "Why do two pointers require sorted input?",
      options: ["Python only allows two indexes on sorted lists", "Sorting removes duplicates", "Order tells you which pointer can safely move forward", "Unsorted lists cannot be indexed"],
      answer: 2,
      explanation: "Because the lists are sorted, the smaller current value can never match anything later in the other list, so its pointer can advance.",
    },
    {
      question: "A window of size 3 slides from [5, 1, 4] to [1, 4, 6]. The old total was 10. What is the new total?",
      options: ["11", "15", "10", "16"],
      answer: 0,
      explanation: "Add the entering value and subtract the leaving one: 10 + 6 - 5 = 11.",
    },
  ],
  practice: ["two-sum", "merge-sorted", "moving-average"],
};
