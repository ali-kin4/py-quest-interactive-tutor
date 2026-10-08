import { code } from "../helpers.js";

export default {
  id: "exceptions",
  unit: "robust-code",
  title: "Errors, Exceptions & Validation",
  minutes: 25,
  summary: "Read error messages, handle bad input with try/except, and write functions that never crash on messy data.",
  objectives: [
    "Read a traceback and find the exception type, message and line",
    "Recognise the most common built-in exceptions",
    "Handle a failed conversion with try / except ValueError",
    "Use None to signal that there is no valid answer",
    "Guard against empty input and out-of-range values before they cause problems",
  ],
  sections: [
    {
      heading: "Reading an error message",
      body: [
        "When Python hits a problem it cannot handle, it **raises an exception** and stops. The message it prints is called a *traceback*. It looks intimidating, but it always ends with the two facts you need most: the **exception type** and a **message**, plus the line where it happened.",
        "Below, the third item is not a number. Read the last line of the error: the type is `ValueError` and the message quotes the text that could not be converted.",
      ],
      example: {
        code: code`
          prices = ["4.50", "3.20", "free"]
          for text in prices:
              print(float(text))
        `,
        output: "4.5\n3.2",
        error: "ValueError",
        note: "The first two prices print, then float(\"free\") raises ValueError: could not convert string to float: 'free'.",
      },
    },
    {
      heading: "Common exception types",
      body: [
        "Each exception type names a different kind of problem. Learning the common ones makes errors much faster to fix:",
        {
          list: [
            "`ValueError` — the type is right but the content is wrong, like `int(\"abc\")`.",
            "`TypeError` — the wrong type for an operation, like `\"3\" + 4`.",
            "`ZeroDivisionError` — dividing by zero, often an average of an empty list.",
            "`IndexError` — a list position that does not exist, like `[1, 2][5]`.",
            "`KeyError` — a dictionary key that does not exist.",
            "`NameError` — a variable used before it was created, often a typo.",
          ],
        },
      ],
      example: {
        code: code`
          stock = {"apples": 3}
          print(stock["apples"])
          print(stock["pears"])
        `,
        output: "3",
        error: "KeyError",
      },
    },
    {
      heading: "Handling an exception with try / except",
      body: [
        "Some errors are *expected*: users type words where numbers belong. Instead of crashing, put the risky line inside `try:` and say what to do in `except ValueError:`. If the `try` block succeeds, the `except` block is skipped; if it raises a `ValueError`, Python jumps straight to the `except` block and carries on.",
      ],
      example: {
        code: code`
          def to_number(text):
              try:
                  return float(text)
              except ValueError:
                  return None

          print(to_number("12.5"))
          print(to_number("twelve"))
        `,
        output: "12.5\nNone",
      },
      callout: { kind: "warning", text: "Always name the exception you expect. A bare `except:` also swallows typos and real bugs, so a broken program looks like it works." },
    },
    {
      heading: "else and finally",
      body: [
        "Two optional extras complete the picture. Code in `else:` runs only when the `try` block raised nothing, which keeps the `try` block small. Code in `finally:` runs no matter what happened — useful for clean-up such as closing a file.",
      ],
      example: {
        code: code`
          for text in ["8", "eight"]:
              try:
                  value = int(text)
              except ValueError:
                  print(text, "-> not a whole number")
              else:
                  print(text, "-> doubled is", value * 2)
              finally:
                  print("checked", text)
        `,
        output: "8 -> doubled is 16\nchecked 8\neight -> not a whole number\nchecked eight",
      },
    },
    {
      heading: "Returning None for 'no valid answer'",
      body: [
        "A function sometimes has no sensible result: the input was invalid, or there was nothing to compute. Returning `None` says that clearly, and callers can check for it with `is None`. This is better than returning `0` or `-1`, which look like real answers and quietly mislead whoever uses them.",
      ],
      example: {
        code: code`
          def find_price(catalog, item):
              if item not in catalog:
                  return None
              return catalog[item]

          catalog = {"tea": 2.5, "cake": 3.0}
          result = find_price(catalog, "coffee")
          if result is None:
              print("coffee is not on the menu")
          else:
              print("coffee costs", result)
        `,
        output: "coffee is not on the menu",
      },
    },
    {
      heading: "Guard clauses: check before you calculate",
      body: [
        "Not every problem needs `try`. If you can *see* the danger coming, check for it first with a **guard clause** — an early `return` at the top of the function. The classic case is an average: dividing by `len(values)` crashes when the list is empty.",
      ],
      example: {
        code: code`
          def mean(values):
              if not values:
                  return None
              return sum(values) / len(values)

          print(mean([2, 4, 9]))
          print(mean([]))
          print(sum([]) / len([]))
        `,
        output: "5.0\nNone",
        error: "ZeroDivisionError",
        note: "The guarded mean([]) returns None; the unguarded division on the last line raises ZeroDivisionError.",
      },
    },
    {
      heading: "Validate: clean, convert, then check the range",
      body: [
        "Real input needs three steps. **Clean** it (remove spaces with `strip()`, drop a unit with `removesuffix()`), **convert** it inside `try`, then **check** the value is in the allowed range. Only a value that survives all three is valid.",
        "`text.removesuffix(\"kg\")` removes `kg` only if the text ends with it; otherwise it returns the text unchanged.",
      ],
      example: {
        code: code`
          def parse_weight(raw):
              text = raw.strip().removesuffix("kg").strip()
              try:
                  weight = float(text)
              except ValueError:
                  return None
              if not 0 < weight <= 500:
                  return None
              return weight

          for raw in [" 72.5kg ", "heavy", "-3", "80"]:
              print(repr(raw), "->", parse_weight(raw))
        `,
        output: "' 72.5kg ' -> 72.5\n'heavy' -> None\n'-3' -> None\n'80' -> 80.0",
      },
      callout: { kind: "tip", text: "Test validation functions with the awkward cases first: an empty string, extra spaces, a value exactly on the boundary and one just outside it." },
    },
  ],
  keyPoints: [
    "The last line of a traceback gives the exception type and message; the traceback also shows the line number.",
    "Wrap only the risky line in try, and catch the specific exception you expect, such as ValueError.",
    "Return None when there is no valid answer, and check for it with is None.",
    "Guard clauses stop problems like ZeroDivisionError before they happen.",
    "Validate in order: clean the text, convert it, then check the range.",
  ],
  mistakes: [
    { mistake: "Using a bare except: that catches every error", fix: "Name the exception you expect (except ValueError:) so real bugs still show up." },
    { mistake: "Returning 0 for invalid input", fix: "0 looks like a real result. Return None and let the caller decide what to show." },
    { mistake: "Dividing by len(values) without checking for an empty list", fix: "Add a guard clause: if not values: return None." },
    { mistake: "Converting before cleaning: float(\" 5% \")", fix: "strip() spaces and remove units such as % first, then convert." },
  ],
  quiz: [
    {
      question: "Which exception does int(\"3.5\") raise?",
      options: ["TypeError", "ValueError", "ZeroDivisionError", "It returns 3"],
      answer: 1,
      explanation: "It is a string (the right type), but its content is not a valid whole number, so int() raises ValueError.",
    },
    {
      question: "When does the code in an except ValueError: block run?",
      options: ["Always, after the try block", "Only when the try block raises ValueError", "Only when the try block succeeds", "Only when there is a finally block"],
      answer: 1,
      explanation: "The except block runs only if the matching exception is raised inside try. Code that must always run belongs in finally.",
    },
    {
      question: "average([]) should not crash. What is the clearest fix?",
      options: ["Wrap the whole program in try/except", "Return 0 when the list is empty", "Add a guard clause that returns None for an empty list", "Divide by len(values) + 1"],
      answer: 2,
      explanation: "A guard clause handles the known empty case explicitly, and None tells the caller there is no average rather than pretending it is 0.",
    },
    {
      question: "What does \"75%\".removesuffix(\"%\") return?",
      options: ["\"75\"", "75", "\"75%\"", "0.75"],
      answer: 0,
      explanation: "removesuffix returns a new string without the suffix. It is still text, so convert it with float() or int() afterwards.",
    },
  ],
  practice: ["parse-percentage", "average-rating"],
};
