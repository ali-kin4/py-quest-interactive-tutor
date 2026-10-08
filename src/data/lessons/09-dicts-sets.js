import { code } from "../helpers.js";

export default {
  id: "dicts-sets",
  unit: "data-structures",
  title: "Dictionaries & Sets",
  minutes: 25,
  summary: "Look values up by name with dictionaries, count things, and remove duplicates with sets.",
  objectives: [
    "Create a dictionary and read values with [] and .get()",
    "Add, update and loop over dictionary entries",
    "Count occurrences with the counts.get(k, 0) + 1 pattern",
    "Use sets for uniqueness and fast membership checks",
    "Pick the right collection for a task",
  ],
  sections: [
    {
      heading: "Dictionaries map keys to values",
      body: [
        "A **dictionary** (`dict`) stores pairs: a **key** you look things up by, and the **value** stored under it. You write it with curly braces and a colon between each key and value.",
        "Instead of remembering that a price lives at position 2 of some list, you ask for it by name: `prices[\"tea\"]`. Keys are usually strings or numbers, and each key appears only once.",
      ],
      example: {
        code: code`
          prices = {"coffee": 3.5, "tea": 2.75, "cake": 4.0}
          print(prices["tea"])
          print(len(prices))
          print("cake" in prices)
          print("juice" in prices)
        `,
        output: "2.75\n3\nTrue\nFalse",
      },
    },
    {
      heading: "Missing keys: [] versus .get()",
      body: [
        "Reading a key that does not exist with square brackets raises a `KeyError`. `d.get(key, default)` is the safe alternative: it returns `default` when the key is missing (or `None` if you leave the default out).",
        "Use `[]` when the key **must** exist — a crash then points straight at the bug. Use `.get()` when a missing key is a normal situation.",
      ],
      example: {
        code: code`
          stock = {"apples": 12, "pears": 0}
          print(stock.get("pears", 0))
          print(stock.get("plums", 0))
          print(stock.get("plums"))
          print(stock["plums"])
        `,
        output: "0\n0\nNone",
        error: "KeyError",
        note: "stock[\"plums\"] fails because the key does not exist; .get() never does.",
      },
    },
    {
      heading: "Adding, updating and looping",
      body: [
        "Assigning to a key adds it if it is new and replaces the value if it already exists. Dictionaries remember the order in which keys were first added.",
        "Loop over a dictionary in three ways: `for key in d` (keys), `d.values()` (values only) and `d.items()`, which gives you each key and value together.",
      ],
      example: {
        code: code`
          hours = {"Mon": 6}
          hours["Tue"] = 8
          hours["Mon"] = 7
          print(hours)

          for day, worked in hours.items():
              print(day, "->", worked)
          print("Total:", sum(hours.values()))
        `,
        output: "{'Mon': 7, 'Tue': 8}\nMon -> 7\nTue -> 8\nTotal: 15",
      },
    },
    {
      heading: "The counting pattern",
      body: [
        "Counting how often things appear is one of the most common jobs in programming. Start with an empty dictionary and, for each item, add one to its current count — using `.get(item, 0)` so the first sighting starts from zero instead of raising `KeyError`.",
      ],
      example: {
        code: code`
          votes = ["red", "blue", "red", "green", "red", "blue"]
          counts = {}
          for colour in votes:
              counts[colour] = counts.get(colour, 0) + 1
          print(counts)
          print("Red votes:", counts["red"])
        `,
        output: "{'red': 3, 'blue': 2, 'green': 1}\nRed votes: 3",
      },
      callout: { kind: "tip", text: "Normalise before you count — `item.strip().lower()` — so \"Red\", \"red \" and \"RED\" all land on the same key." },
    },
    {
      heading: "Sets: unique values and fast membership",
      body: [
        "A **set** stores each value at most once. Converting a list to a set is the quickest way to drop duplicates, and `x in my_set` is very fast even for millions of items — much faster than searching a list.",
        "Sets have **no order**, so the order they print in is not something to rely on. When you need a stable result, convert with `sorted(...)`.",
      ],
      example: {
        code: code`
          tags = ["python", "data", "python", "web", "data"]
          unique = set(tags)
          print(len(unique))
          print(sorted(unique))
          print("web" in unique)

          empty = set()
          empty.add("first")
          print(len(empty))
        `,
        output: "3\n['data', 'python', 'web']\nTrue\n1",
        note: "Write set() for an empty set — {} creates an empty dictionary.",
      },
    },
    {
      heading: "Keeping order while removing duplicates",
      body: [
        "`set()` loses the original order. When order matters, combine a set with a list: keep a set of what you have already **seen**, and only keep an item the first time you meet it. The set does the fast checking; the list keeps the order.",
      ],
      example: {
        code: code`
          visits = ["home", "about", "home", "blog", "about"]
          seen = set()
          for page in visits:
              if page in seen:
                  print("Repeat visit:", page)
              else:
                  seen.add(page)
          print(len(seen), "distinct pages")
        `,
        output: "Repeat visit: home\nRepeat visit: about\n3 distinct pages",
      },
    },
    {
      heading: "Comparing letters with sorted()",
      body: [
        "`sorted()` works on any sequence, including a string: it returns a list of its characters in alphabetical order. Two strings with exactly the same letters — in any order — produce the same sorted list, which makes letter-by-letter comparisons easy.",
        "Combine it with a set when you only care about **distinct** values, for example `sorted(set(numbers))` to get each number once, smallest first.",
      ],
      example: {
        code: code`
          print(sorted("stop"))
          print(sorted("post") == sorted("stop"))
          print(sorted("post") == sorted("posts"))
          print(sorted(set([5, 3, 5, 1, 3])))
        `,
        output: "['o', 'p', 's', 't']\nTrue\nFalse\n[1, 3, 5]",
      },
    },
    {
      heading: "Choosing the right collection",
      body: [
        "Each collection answers a different question:",
        {
          list: [
            "**list** — ordered items, duplicates allowed, access by position.",
            "**tuple** — a small fixed group of values that will not change.",
            "**dict** — look up a value by its key, or count and group things.",
            "**set** — unique values and fast “have I seen this?” checks.",
          ],
        },
        "Picking well usually makes the code shorter **and** faster.",
      ],
    },
  ],
  keyPoints: [
    "A dict maps unique keys to values; read with d[key] or safely with d.get(key, default).",
    "Assigning d[key] = value adds a new key or replaces an existing value.",
    "Loop over d.items() to get each key and value together.",
    "Count with counts[k] = counts.get(k, 0) + 1.",
    "Sets store unique values and check membership quickly, but have no order.",
    "Use a seen set plus a result list to remove duplicates while keeping order.",
  ],
  mistakes: [
    { mistake: "Writing counts[k] += 1 for a key that has not been added yet", fix: "Use counts[k] = counts.get(k, 0) + 1, or set the key to 0 first." },
    { mistake: "Creating an empty set with {}", fix: "{} is an empty dict. Use set() for an empty set." },
    { mistake: "Relying on the printed order of a set", fix: "Sets are unordered. Use sorted(my_set) when you need a predictable order." },
    { mistake: "Using set(items) to de-duplicate when the original order matters", fix: "Track a seen set and append first occurrences to a list." },
  ],
  quiz: [
    {
      question: "d = {\"a\": 1}. What does d.get(\"b\", 0) return?",
      options: ["None", "KeyError", "0", "1"],
      answer: 2,
      explanation: ".get() returns the default you supply when the key is missing — here 0.",
    },
    {
      question: "What does len(set([1, 2, 2, 3, 3, 3])) return?",
      options: ["3", "6", "4", "1"],
      answer: 0,
      explanation: "A set keeps each value once, so only 1, 2 and 3 remain.",
    },
    {
      question: "Which loop prints each key together with its value?",
      options: ["for k in d.values(): print(k)", "for k, v in d: print(k, v)", "for k in d.keys(): print(d)", "for k, v in d.items(): print(k, v)"],
      answer: 3,
      explanation: "d.items() yields (key, value) pairs, which unpack into k and v. Looping over d directly gives keys only.",
    },
    {
      question: "Which expression is True only when s and t contain exactly the same letters, in any order?",
      options: ["set(s) == set(t)", "sorted(s) == sorted(t)", "len(s) == len(t)", "s in t"],
      answer: 1,
      explanation: "sorted() keeps repeated letters, so the counts must match too. set() would treat \"aab\" and \"ab\" as equal.",
    },
  ],
  practice: ["unique-in-order", "word-frequency", "anagram", "second-largest"],
};
