import { code } from "../helpers.js";

export default {
  id: "conditions",
  unit: "text-and-logic",
  title: "Decisions with if, elif and else",
  minutes: 25,
  summary: "Compare values, combine conditions with and/or/not, and let your functions choose between different paths.",
  objectives: [
    "Compare values with ==, !=, <, <=, > and >=, including chained comparisons",
    "Combine conditions with and, or and not",
    "Predict which values Python treats as true or false",
    "Write if/elif/else chains in the right order with correct boundaries",
    "Use conditional expressions and return boolean results directly",
  ],
  sections: [
    {
      heading: "Comparisons produce booleans",
      body: [
        "A comparison asks a yes/no question and answers with a **boolean**: `True` or `False`. Use `==` to test equality (a single `=` assigns a variable) and `!=` for “not equal”.",
        "Python lets you **chain** comparisons, so `0 <= score <= 100` reads exactly like the maths and means both conditions hold.",
      ],
      example: {
        code: code`
          print(5 > 3)
          print(3 >= 5)
          print("apple" == "Apple")
          print(7 <= 7)
          score = 42
          print(0 <= score <= 100)
        `,
        output: "True\nFalse\nFalse\nTrue\nTrue",
      },
    },
    {
      heading: "Combining conditions: and, or, not",
      body: [
        {
          list: [
            "`a and b` is `True` only when **both** sides are true.",
            "`a or b` is `True` when **at least one** side is true.",
            "`not a` flips `True` to `False` and back.",
          ],
        },
        "Python stops evaluating as soon as the answer is known: in `a or b`, if `a` is already true, `b` is never checked.",
      ],
      example: {
        code: code`
          is_member = True
          total = 80
          print(is_member and total >= 100)
          print(is_member or total >= 100)
          print(not is_member)
        `,
        output: "False\nTrue\nFalse",
      },
    },
    {
      heading: "Choosing a path with if, elif and else",
      body: [
        "An `if` statement runs its indented block only when its condition is true. Add `elif` (“else if”) branches for more cases and an optional `else` for everything left over.",
        "Python checks the conditions **top to bottom** and runs **only the first** branch whose condition is true. The rest are skipped.",
      ],
      example: {
        code: code`
          def shipping(weight_kg):
              if weight_kg > 20:
                  return "Freight"
              elif weight_kg > 5:
                  return "Parcel"
              else:
                  return "Letter"

          print(shipping(25))
          print(shipping(6))
          print(shipping(5))
        `,
        output: "Freight\nParcel\nLetter",
      },
      callout: { kind: "note", text: "The colon at the end of each condition and the 4-space indentation are required. They tell Python which lines belong to which branch." },
    },
    {
      heading: "Order and boundaries matter",
      body: [
        "Because the first true branch wins, put the **most demanding** condition first. If a low threshold comes first, it also catches values meant for higher tiers.",
        "Read the rules carefully: “100 or more” means `>= 100`, while “over 100” means `> 100`. Always test the exact boundary value.",
      ],
      example: {
        code: code`
          def badge_wrong(points):
              if points >= 100:
                  return "Bronze"
              elif points >= 500:
                  return "Gold"
              return "None yet"

          def badge(points):
              if points >= 500:
                  return "Gold"
              elif points >= 100:
                  return "Bronze"
              return "None yet"

          print(badge_wrong(800))
          print(badge(800))
          print(badge(100))
          print(badge(99))
        `,
        output: "Bronze\nGold\nBronze\nNone yet",
      },
      callout: { kind: "tip", text: "A `return` inside a branch ends the function, so the final line only runs when no branch matched — no `else` needed." },
    },
    {
      heading: "Truthiness: what counts as true",
      body: [
        "Any value can be used as a condition. These are **falsy** (treated as `False`): `0`, `0.0`, the empty string `\"\"`, empty collections such as `[]`, and `None`. Almost everything else is **truthy**.",
        "This lets you write natural checks like `if not text:` to detect an empty string.",
      ],
      example: {
        code: code`
          print(bool(""))
          print(bool("hi"))
          print(bool(0))
          print(bool([]))
          print(bool(None))
          name = ""
          if not name:
              print("Please enter a name")
        `,
        output: "False\nTrue\nFalse\nFalse\nFalse\nPlease enter a name",
      },
    },
    {
      heading: "Short forms: conditional expressions and boolean returns",
      body: [
        "When you only need to pick between two values, a **conditional expression** fits on one line: `value_if_true if condition else value_if_false`.",
        "A comparison is already `True` or `False`, so a function that answers a yes/no question can return it directly instead of using `if ... return True else return False`.",
      ],
      example: {
        code: code`
          def is_teen(age):
              return 13 <= age <= 19

          def account_status(balance):
              return "overdrawn" if balance < 0 else "ok"

          print(is_teen(15))
          print(is_teen(20))
          print(account_status(-5))
          print(account_status(10))
        `,
        output: "True\nFalse\noverdrawn\nok",
      },
    },
    {
      heading: "Normalise text before comparing",
      body: [
        "String comparisons are exact: `\"Yes\" == \"yes\"` is `False`, and so is `\" yes\" == \"yes\"`. When users type the input, clean it first with `.strip()` and `.lower()` so every reasonable variation matches.",
      ],
      example: {
        code: code`
          def wants_newsletter(answer):
              return answer.strip().lower() == "yes"

          print(wants_newsletter("  YES "))
          print(wants_newsletter("Yes"))
          print(wants_newsletter("no"))
        `,
        output: "True\nTrue\nFalse",
      },
    },
  ],
  keyPoints: [
    "Comparisons return True or False; use == to compare and = to assign.",
    "and needs both sides true, or needs one, not flips the result.",
    "Only the first true branch of an if/elif/else chain runs — order tiers from most to least demanding.",
    "0, empty strings, empty collections and None are falsy.",
    "Return comparisons directly, and use a if cond else b to choose between two values.",
  ],
  mistakes: [
    { mistake: "Writing if score = 90:", fix: "Use == for comparison. A single = is assignment and is a syntax error here." },
    { mistake: "Writing if colour == \"red\" or \"blue\":", fix: "Each side of or is a full condition: colour == \"red\" or colour == \"blue\". A non-empty string alone is always truthy." },
    { mistake: "Checking a low threshold before a high one", fix: "Put the highest tier first, or the lower branch swallows every value above it." },
    { mistake: "Mixing up > and >= at a boundary", fix: "Turn “at least” into >= and “more than” into >, then test the exact boundary value." },
  ],
  quiz: [
    {
      question: "What does print(10 > 5 and 2 > 3) display?",
      options: ["True", "False", "None", "An error"],
      answer: 1,
      explanation: "and requires both conditions. 10 > 5 is True but 2 > 3 is False, so the whole expression is False.",
    },
    {
      question: "Which of these values is truthy?",
      options: ["0", "\"\"", "\" \"", "None"],
      answer: 2,
      explanation: "A string containing a space is not empty, so it is truthy. 0, the empty string and None are falsy.",
    },
    {
      question: "With temp = 30, what does this return? if temp > 10: return \"mild\" elif temp > 25: return \"hot\" else: return \"cold\"",
      options: ["\"hot\"", "\"cold\"", "\"mild\" and \"hot\"", "\"mild\""],
      answer: 3,
      explanation: "30 > 10 is true, so the first branch runs and the function returns before the hot check is ever reached. The tiers are in the wrong order.",
    },
    {
      question: "Which is the cleanest body for def is_adult(age):?",
      options: ["return age >= 18", "if age >= 18: return True", "return \"True\" if age >= 18 else \"False\"", "print(age >= 18)"],
      answer: 0,
      explanation: "The comparison already produces a boolean, so return it directly. The string version returns text, and print returns nothing to the caller.",
    },
  ],
  practice: ["even-or-odd", "letter-grade", "discount-tier", "leap-year", "ticket-triage"],
};
