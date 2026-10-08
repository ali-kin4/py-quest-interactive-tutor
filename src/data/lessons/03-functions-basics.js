import { code } from "../helpers.js";

export default {
  id: "functions-basics",
  unit: "getting-started",
  title: "Writing Functions",
  minutes: 25,
  summary: "Define reusable functions that take parameters and return results — the shape of every PyQuest practice problem.",
  objectives: [
    "Define a function with def and call it",
    "Distinguish parameters from arguments",
    "Return a value instead of printing it",
    "Document a function with a docstring",
    "Replace the starter's NotImplementedError with your own code",
  ],
  sections: [
    {
      heading: "Defining and calling a function",
      body: [
        "A **function** packages a few lines of code under a name so you can run them whenever you need. You define it with `def`, a name, parentheses and a colon. The lines that belong to it — the *body* — are indented by four spaces.",
        "Defining a function does not run it. The body only runs when you **call** the function by writing its name followed by parentheses.",
      ],
      example: {
        code: code`
          def greet_team():
              print("Good morning, team!")

          greet_team()
          greet_team()
        `,
        output: "Good morning, team!\nGood morning, team!",
      },
    },
    {
      heading: "Parameters and arguments",
      body: [
        "**Parameters** are the names listed in the definition; they act as variables inside the function. **Arguments** are the actual values you pass in when calling. Arguments are matched to parameters in order.",
      ],
      example: {
        code: code`
          def describe(language, year):
              print(language, "appeared in", year)

          describe("Python", 1991)
          describe("JavaScript", 1995)
        `,
        output: "Python appeared in 1991\nJavaScript appeared in 1995",
      },
    },
    {
      heading: "Returning a result",
      body: [
        "`return` sends a value back to whoever called the function, and ends the function immediately. The call then *is* that value: you can store it, print it or use it in a calculation.",
      ],
      example: {
        code: code`
          def square(n):
              return n * n

          result = square(7)
          print(result)
          print(square(3) + square(4))
        `,
        output: "49\n25",
      },
    },
    {
      heading: "return versus print",
      body: [
        "This is the most important idea for the practice problems. `print()` only shows text on the screen; the caller gets nothing back. A function without a `return` statement gives back `None`.",
        "PyQuest's tests call your function and check the value it **returns** — printing the right answer is not enough.",
      ],
      example: {
        code: code`
          def double_print(n):
              print(n * 2)

          def double_return(n):
              return n * 2

          a = double_print(5)
          b = double_return(5)
          print("a is", a)
          print("b is", b)
        `,
        output: "10\na is None\nb is 10",
        note: "double_print displays 10 but returns None, so a is None.",
      },
      callout: { kind: "warning", text: "If a test shows your function returned `None`, you almost certainly printed the answer or forgot a `return`." },
    },
    {
      heading: "Docstrings",
      body: [
        "A string on the first line of the body is a **docstring**. It describes what the function does and what it returns. Every PyQuest starter includes one, telling you the contract your function must meet.",
      ],
      example: {
        code: code`
          def area(width, height):
              """Return the area of a width x height rectangle."""
              return width * height

          print(area(3, 4))
          print(area.__doc__)
        `,
        output: "12\nReturn the area of a width x height rectangle.",
      },
    },
    {
      heading: "Functions that use other functions",
      body: [
        "Small functions can be combined into bigger ones. Each does one job and can be tested on its own — the same habit professional developers use.",
      ],
      example: {
        code: code`
          def subtotal(price, quantity):
              return price * quantity

          def with_shipping(price, quantity):
              return subtotal(price, quantity) + 5

          print(with_shipping(10, 3))
        `,
        output: "35",
      },
    },
    {
      heading: "The practice starter code",
      body: [
        "Every practice problem opens with a starter like the one below: the function name and parameters are fixed (the tests call them), the docstring states the goal, and `raise NotImplementedError(...)` deliberately stops with an error so you know the work is not done yet.",
        "Your job is to **replace** the TODO comment and the `raise` line with code that returns the right value — for example `return n * 3`. If you leave the `raise` line in front of your logic, it still runs first and the tests fail.",
      ],
      example: {
        code: code`
          def triple(n):
              """Return n multiplied by 3."""
              # TODO: implement this function

              raise NotImplementedError("Implement triple")

          print("Calling triple...")
          print(triple(4))
        `,
        output: "Calling triple...",
        error: "NotImplementedError",
        note: "Replace the TODO and raise lines with: return n * 3",
      },
    },
    {
      heading: "Indentation defines the body",
      body: [
        "Python uses indentation, not brackets, to decide which lines belong to a function. Every line of the body must be indented by the same amount — four spaces is the standard. Forget it and Python stops with an **IndentationError** before running anything.",
      ],
      example: {
        code: code`
          def add(a, b):
          return a + b
        `,
        output: "",
        error: "IndentationError",
        note: "Indent the return line by four spaces.",
      },
    },
  ],
  keyPoints: [
    "def name(parameters): defines a function; its indented body runs only when called.",
    "Arguments are matched to parameters in order when you call the function.",
    "return hands a value back to the caller and ends the function.",
    "A function without return gives back None — tests check returned values, not printed ones.",
    "In practice starters, keep the def line and replace the TODO and raise lines with your solution.",
  ],
  mistakes: [
    { mistake: "Printing the answer instead of returning it", fix: "Use return result. Print only when you want to see a value while debugging." },
    { mistake: "Renaming the function or its parameters in the starter", fix: "Keep the def line exactly as given — the tests call that name with those arguments." },
    { mistake: "Leaving raise NotImplementedError above your new code", fix: "Delete the raise line, or make sure your return comes before it." },
    { mistake: "Mixing indentation levels inside one body", fix: "Indent every body line by the same four spaces." },
  ],
  quiz: [
    {
      question: "def f(x): x * 2 — what does f(5) return?",
      options: ["10", "None", "5", "An error"],
      answer: 1,
      explanation: "The body calculates x * 2 but never returns it, so the function returns None.",
    },
    {
      question: "In def area(width, height):, what are width and height?",
      options: ["Arguments", "Return values", "Parameters", "Docstrings"],
      answer: 2,
      explanation: "Names in the definition are parameters. The values passed in a call, like area(3, 4), are arguments.",
    },
    {
      question: "What happens to code after a return statement in the same block?",
      options: ["It runs after returning", "It never runs", "It runs only once", "It raises an error"],
      answer: 1,
      explanation: "return ends the function immediately, so later lines in that block are skipped.",
    },
    {
      question: "Why do practice starters contain raise NotImplementedError?",
      options: ["To mark where your solution goes until you replace it", "To make the tests pass", "To print a hint", "Python requires it in every function"],
      answer: 0,
      explanation: "It is a placeholder that fails loudly until you replace it with your own working code.",
    },
  ],
  practice: [],
};
