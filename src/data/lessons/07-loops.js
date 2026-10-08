import { code } from "../helpers.js";

export default {
  id: "loops",
  unit: "text-and-logic",
  title: "Repeating with Loops",
  minutes: 30,
  summary: "Use for and while loops to process every character, count, total and repeat until a condition changes.",
  objectives: [
    "Loop over the characters of a string and over a range of numbers",
    "Build totals and counts with the accumulator and counter patterns",
    "Write while loops that are guaranteed to stop",
    "Update several variables at once with tuple assignment",
    "Control a loop early with break and continue",
  ],
  sections: [
    {
      heading: "Looping over a string",
      body: [
        "A `for` loop runs its indented block once for **each item** in a sequence. With a string, each item is one character, stored in the loop variable you name after `for`.",
      ],
      example: {
        code: code`
          for letter in "code":
              print(letter.upper())
        `,
        output: "C\nO\nD\nE",
      },
    },
    {
      heading: "Counting with range()",
      body: [
        "`range()` produces a sequence of whole numbers to loop over:",
        {
          list: [
            "`range(stop)` counts 0, 1, … up to `stop - 1`.",
            "`range(start, stop)` starts at `start`; `stop` is still **excluded**.",
            "`range(start, stop, step)` jumps by `step`, which may be negative to count down.",
          ],
        },
        "To include a number `n`, stop at `n + 1`. Wrapping a range in `list()` lets you see all its values at once.",
      ],
      example: {
        code: code`
          for i in range(3):
              print(i)
          print(list(range(2, 6)))
          print(list(range(1, 5 + 1)))
          print(list(range(10, 0, -3)))
        `,
        output: "0\n1\n2\n[2, 3, 4, 5]\n[1, 2, 3, 4, 5]\n[10, 7, 4, 1]",
      },
    },
    {
      heading: "The accumulator pattern",
      body: [
        "To build up a result, create a variable **before** the loop, update it **inside** the loop, and use it **after** the loop. `total += number` is shorthand for `total = total + number`.",
      ],
      example: {
        code: code`
          def sum_to(n):
              total = 0
              for number in range(1, n + 1):
                  total += number
              return total

          print(sum_to(4))
          print(sum_to(100))
        `,
        output: "10\n5050",
      },
      callout: { kind: "warning", text: "Keep the `return` outside the loop (less indented). Indented inside it, the function would return after the very first item." },
    },
    {
      heading: "Counting matches with if inside a loop",
      body: [
        "Combine a loop with an `if` to count only the items you care about. A counter starts at `0` and grows by `1` each time the condition is true.",
      ],
      example: {
        code: code`
          def count_char(text, target):
              count = 0
              for char in text:
                  if char == target:
                      count += 1
              return count

          print(count_char("banana", "a"))
          print(count_char("Mississippi", "s"))
          print(count_char("Mississippi", "m"))
        `,
        output: "3\n4\n0",
        note: "The last call returns 0 because comparisons are case-sensitive: 'M' is not 'm'.",
      },
    },
    {
      heading: "while loops: repeat until something changes",
      body: [
        "A `while` loop keeps running as long as its condition is true. Use it when you do not know in advance how many repetitions you need.",
        "Something inside the loop **must** move the condition towards false, otherwise the loop never ends.",
      ],
      example: {
        code: code`
          def years_to_double(rate):
              balance = 100
              years = 0
              while balance < 200:
                  balance = balance * (1 + rate)
                  years += 1
              return years

          print(years_to_double(0.07))
          print(years_to_double(0.10))
        `,
        output: "11\n8",
      },
      callout: { kind: "warning", text: "If you forget to update the condition, the loop runs forever. PyQuest stops any run after 15 seconds; press **Stop** to end it sooner." },
    },
    {
      heading: "Updating two variables at once",
      body: [
        "Python can assign several variables in one statement: `a, b = b, a + b`. The right-hand side is calculated **completely first**, using the old values, and only then are both variables updated. This also swaps values neatly: `x, y = y, x`.",
        "Here it produces the Fibonacci sequence, where each number is the sum of the two before it. `print(..., end=\" \")` prints a space instead of starting a new line.",
      ],
      example: {
        code: code`
          a, b = 0, 1
          for _ in range(8):
              print(a, end=" ")
              a, b = b, a + b
          print()
        `,
        output: "0 1 1 2 3 5 8 13",
        note: "The name _ is a convention for a loop variable you do not use.",
      },
    },
    {
      heading: "Working with the digits of a number",
      body: [
        "Two tools from the arithmetic lesson take numbers apart: `n % 10` is the **last digit**, and `n // 10` **drops** it. Repeat both until nothing is left.",
        "Alternatively, `str(n)` turns the number into text you can loop over, with `int(d)` turning each digit back into a number.",
      ],
      example: {
        code: code`
          n = 4071
          while n > 0:
              print(n % 10)
              n = n // 10

          for d in str(905):
              print(int(d) * 2)
        `,
        output: "1\n7\n0\n4\n18\n0\n10",
      },
    },
    {
      heading: "Leaving early: break and continue",
      body: [
        "`continue` skips the rest of the current pass and moves on to the next item. `break` exits the loop completely.",
      ],
      example: {
        code: code`
          for char in "ab-cd!ef":
              if char == "-":
                  continue
              if char == "!":
                  break
              print(char, end="")
          print()
        `,
        output: "abcd",
      },
    },
  ],
  keyPoints: [
    "for repeats once per item: each character of a string or each number of a range.",
    "range(start, stop, step) never includes stop; use n + 1 to include n.",
    "Accumulators and counters start before the loop, change inside it, and are returned after it.",
    "A while loop needs something inside it that eventually makes its condition false.",
    "a, b = b, a + b updates both variables using the old values.",
    "n % 10 gives the last digit and n // 10 removes it.",
  ],
  mistakes: [
    { mistake: "Using range(1, n) to include n", fix: "The stop value is excluded; write range(1, n + 1)." },
    { mistake: "Resetting the total inside the loop", fix: "Create total = 0 once, before the loop starts." },
    { mistake: "Indenting return inside the loop", fix: "Dedent return so it runs after the loop has finished." },
    { mistake: "A while loop whose variable never changes", fix: "Update the variable the condition depends on in every pass." },
  ],
  quiz: [
    {
      question: "What does list(range(2, 10, 3)) produce?",
      options: ["[2, 5, 8]", "[2, 5, 8, 11]", "[3, 6, 9]", "[2, 3, 4]"],
      answer: 0,
      explanation: "Start at 2 and add 3 each time: 2, 5, 8. The next value, 11, is not below the stop value 10.",
    },
    {
      question: "How many times does print run? for c in \"hello\": if c == \"l\": print(c)",
      options: ["0", "1", "2", "5"],
      answer: 2,
      explanation: "The loop visits all five characters, but the if only matches the two 'l' characters.",
    },
    {
      question: "After a, b = 3, 5 and then a, b = b, a, what are a and b?",
      options: ["3 and 5", "5 and 5", "3 and 3", "5 and 3"],
      answer: 3,
      explanation: "The right side (5, 3) is built from the old values first, then assigned, so the values are swapped.",
    },
    {
      question: "What is 5824 % 10 followed by 5824 // 10?",
      options: ["4 and 582", "582 and 4", "4 and 582.4", "58 and 24"],
      answer: 0,
      explanation: "% 10 gives the remainder after dividing by 10 (the last digit) and // 10 removes that digit.",
    },
  ],
  practice: ["digit-sum", "count-vowels", "greatest-common-divisor"],
};
