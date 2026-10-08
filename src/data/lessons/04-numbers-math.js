import { code } from "../helpers.js";

export default {
  id: "numbers-math",
  unit: "getting-started",
  title: "Numbers & Arithmetic",
  minutes: 25,
  summary: "Calculate with Python's operators, control precedence, and round results you can trust.",
  objectives: [
    "Use the arithmetic operators + - * / // % and **",
    "Predict the order operations happen in",
    "Know when a result is an int or a float",
    "Use % and // to work with digits, parity and wrap-around",
    "Round money values and avoid float surprises",
  ],
  sections: [
    {
      heading: "The arithmetic operators",
      body: [
        "Python has an operator for every basic calculation:",
        { list: ["`+` `-` `*` add, subtract, multiply", "`/` divides and always gives a float", "`//` divides and rounds **down** to a whole number (floor division)", "`%` gives the **remainder** of a division (modulus)", "`**` raises to a power"] },
      ],
      example: {
        code: code`
          print(7 + 2, 7 - 2, 7 * 2)
          print(7 / 2)
          print(7 // 2, 7 % 2)
          print(2 ** 10)
        `,
        output: "9 5 14\n3.5\n3 1\n1024",
      },
    },
    {
      heading: "Order of operations",
      body: [
        "Python follows the usual maths rules: `**` first, then `*`, `/`, `//` and `%`, then `+` and `-`. Use parentheses whenever you want a different order — or simply to make your intent obvious to the reader.",
      ],
      example: {
        code: code`
          print(2 + 3 * 4)
          print((2 + 3) * 4)
          print(-2 ** 2)
          print((-2) ** 2)
        `,
        output: "14\n20\n-4\n4",
        note: "-2 ** 2 is -(2 ** 2) because ** binds tighter than the minus sign.",
      },
    },
    {
      heading: "int or float?",
      body: [
        "`/` always produces a float, even when the division is exact. Mixing an int with a float also gives a float. `//` keeps ints as ints, but returns a float if either side is a float.",
      ],
      example: {
        code: code`
          print(10 / 2)
          print(type(10 / 2))
          print(3 + 2.0)
          print(10 // 4, 10.0 // 4)
        `,
        output: "5.0\n<class 'float'>\n5.0\n2 2.0",
      },
    },
    {
      heading: "Putting % and // to work",
      body: [
        "The remainder operator is surprisingly useful:",
        { list: ["`n % 2` is `0` for even numbers and `1` for odd ones", "`n % 10` is the last digit of a positive whole number, and `n // 10` removes it", "`(hour + 5) % 24` wraps around a 24-hour clock"] },
      ],
      example: {
        code: code`
          def last_digit(n):
              return n % 10

          def without_last_digit(n):
              return n // 10

          print(last_digit(2024), without_last_digit(2024))
          print(15 % 3, 16 % 3)
          hour = 22
          print((hour + 5) % 24)
        `,
        output: "4 202\n0 1\n3",
      },
    },
    {
      heading: "Floats are approximations",
      body: [
        "Computers store floats in binary, and most decimals such as `0.1` cannot be represented exactly. Tiny errors appear in results — that is normal, not a bug in your code. Never compare floats with `==` directly; round them first.",
      ],
      example: {
        code: code`
          print(0.1 + 0.2)
          print(0.1 + 0.2 == 0.3)
          print(round(0.1 + 0.2, 2))
        `,
        output: "0.30000000000000004\nFalse\n0.3",
      },
    },
    {
      heading: "Rounding money and measurements",
      body: [
        "`round(x, 2)` rounds to two decimal places — the usual choice for currency. `round(x)` with no second argument returns an int. Python rounds exact halves to the nearest **even** number, so `round(2.5)` is `2`.",
        "Round once, at the end of a calculation, rather than at every step, so rounding errors do not pile up.",
      ],
      example: {
        code: code`
          def tip(bill, rate):
              return round(bill * rate, 2)

          print(tip(48.60, 0.15))
          print(round(3.14159, 2))
          print(round(2.5), round(3.5))
        `,
        output: "7.29\n3.14\n2 4",
      },
      callout: { kind: "tip", text: "Returning a rounded number is different from formatting text. `round(2.5, 2)` returns the number `2.5`, not the string `\"2.50\"`." },
    },
    {
      heading: "abs(), min() and max()",
      body: [
        "`abs(x)` gives the distance from zero, so negatives become positive. `min()` and `max()` return the smallest and largest of their arguments.",
      ],
      example: {
        code: code`
          print(abs(-7), abs(3.5))
          print(min(4, 9, 1), max(4, 9, 1))

          def distance(a, b):
              return abs(a - b)

          print(distance(3, 10))
        `,
        output: "7 3.5\n1 9\n7",
      },
    },
  ],
  keyPoints: [
    "/ always returns a float; // floors and % gives the remainder.",
    "** binds tightest; use parentheses to make the order explicit.",
    "n % 2 tests parity, n % 10 gets the last digit, and n // 10 drops it.",
    "Floats are approximate — round before comparing or presenting them.",
    "round(x, 2) rounds to two decimals; round once at the end of a calculation.",
  ],
  mistakes: [
    { mistake: "Expecting 7 / 2 to be 3", fix: "Use 7 // 2 when you want whole-number division." },
    { mistake: "Comparing floats with ==, e.g. 0.1 + 0.2 == 0.3", fix: "Round both sides first, or compare with a small tolerance." },
    { mistake: "Writing -3 ** 2 and expecting 9", fix: "** happens before the minus; write (-3) ** 2." },
  ],
  quiz: [
    {
      question: "What is 17 % 5?",
      options: ["3", "3.4", "2", "12"],
      answer: 2,
      explanation: "17 divided by 5 is 3 with remainder 2, and % returns the remainder.",
    },
    {
      question: "What does print(8 / 4) display?",
      options: ["2", "2.0", "2.00", "0.5"],
      answer: 1,
      explanation: "/ always produces a float, even for an exact division.",
    },
    {
      question: "What is 2 + 3 ** 2?",
      options: ["25", "13", "11", "10"],
      answer: 2,
      explanation: "** is evaluated first: 3 ** 2 is 9, then 2 + 9 is 11.",
    },
    {
      question: "Which expression gives 1234 without its last digit, i.e. 123?",
      options: ["1234 % 10", "1234 / 10", "round(1234 / 10)", "1234 // 10"],
      answer: 3,
      explanation: "// 10 drops the last digit. % 10 gives the digit itself, and / produces 123.4.",
    },
  ],
  practice: ["invoice-total"],
};
