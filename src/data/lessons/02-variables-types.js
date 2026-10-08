import { code } from "../helpers.js";

export default {
  id: "variables-types",
  unit: "getting-started",
  title: "Variables & Data Types",
  minutes: 20,
  summary: "Store values under names, recognise Python's core data types and convert between them.",
  objectives: [
    "Create and update variables with clear snake_case names",
    "Recognise int, float, str and bool values",
    "Check a value's type with type()",
    "Convert values with int(), float(), str() and bool()",
    "Use None to represent “no value yet”",
  ],
  sections: [
    {
      heading: "Variables are named values",
      body: [
        "A **variable** is a name that refers to a value. You create one with `=`, the *assignment* operator: the name goes on the left, the value on the right. After that, you can use the name anywhere you would use the value.",
        "`=` does not mean “equals” as in maths. Read `city = \"Lisbon\"` as “let `city` refer to the text Lisbon”.",
      ],
      example: {
        code: code`
          city = "Lisbon"
          population = 545000
          print(city, population)
        `,
        output: "Lisbon 545000",
      },
    },
    {
      heading: "Naming rules and conventions",
      body: [
        "Names may contain letters, digits and underscores, but cannot start with a digit or contain spaces. They are case-sensitive: `total` and `Total` are different variables.",
        "Python programmers write variable names in **snake_case** — lowercase words joined by underscores. Choose names that say what the value means, so your code explains itself.",
        { list: ["Good: `unit_price`, `items_in_cart`, `is_member`", "Avoid: `x2`, `a`, `UnitPrice`", "Invalid: `2nd_place`, `unit price`, `class` (a reserved word)"] },
      ],
      example: {
        code: code`
          unit_price = 2.5
          items_in_cart = 4
          print(unit_price * items_in_cart)
        `,
        output: "10.0",
      },
    },
    {
      heading: "Reassigning a variable",
      body: [
        "A variable can be pointed at a new value at any time. The right-hand side is worked out **first**, using the current value, and then the name is updated.",
        "Updating a variable based on itself is so common that Python has shortcuts: `score += 1` means `score = score + 1`. There are also `-=`, `*=` and `/=`.",
      ],
      example: {
        code: code`
          score = 10
          score = score + 5
          print(score)
          score += 1
          print(score)
        `,
        output: "15\n16",
      },
    },
    {
      heading: "The core data types",
      body: [
        "Every value has a **type**, which decides what you can do with it. The four you will use constantly are:",
        { list: ["`int` — whole numbers such as `42` or `-7`", "`float` — numbers with a decimal point such as `3.5`", "`str` — text in quotes such as `\"hi\"`", "`bool` — the truth values `True` and `False`"] },
        "`type(value)` tells you the type of any value — handy when a result surprises you.",
      ],
      example: {
        code: code`
          print(type(42))
          print(type(3.5))
          print(type("hi"))
          print(type(True))
        `,
        output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
      },
    },
    {
      heading: "Converting between types",
      body: [
        "Data often arrives as text — from forms, files or web APIs — even when it looks like a number. Convert it before calculating: `int()` makes a whole number, `float()` a decimal, and `str()` turns anything into text.",
        "`int()` on a float simply drops the decimal part; it does not round.",
      ],
      example: {
        code: code`
          quantity = int("3")
          price = float("4.50")
          print(quantity * price)
          print(str(99) + " bottles")
          print(int(7.9))
        `,
        output: "13.5\n99 bottles\n7",
      },
      callout: { kind: "tip", text: "`int(\"3.5\")` fails because the text is not a whole number. Convert with `float()` first if decimals are possible." },
    },
    {
      heading: "Truthiness with bool()",
      body: [
        "`bool()` converts a value to `True` or `False`. Zero and empty values are **falsy** (`0`, `0.0`, `\"\"`); almost everything else is **truthy**. You will rely on this later when checking whether a list or string is empty.",
      ],
      example: {
        code: code`
          print(bool(0), bool(5))
          print(bool(""), bool("no"))
        `,
        output: "False True\nFalse True",
      },
    },
    {
      heading: "Why \"5\" + 5 fails",
      body: [
        "Python will not guess what you mean when types clash. `\"5\" + 5` could mean joining text or adding numbers, so Python raises a **TypeError** instead. Decide which you want and convert explicitly.",
      ],
      example: {
        code: code`
          age = "5"
          print("Converting first:", int(age) + 5)
          print(age + 5)
        `,
        output: "Converting first: 10",
        error: "TypeError",
        note: "The first print works because int(age) is a number. The second mixes str and int.",
      },
    },
    {
      heading: "None: the absence of a value",
      body: [
        "`None` is a special value meaning “nothing here”. Use it when a value is not known yet, or when a calculation has no sensible answer. Check for it with `is None`.",
      ],
      example: {
        code: code`
          result = None
          print(result)
          print(result is None)
        `,
        output: "None\nTrue",
      },
    },
  ],
  keyPoints: [
    "name = value creates or updates a variable; the right-hand side is evaluated first.",
    "Use descriptive snake_case names; names are case-sensitive.",
    "The core types are int, float, str and bool; type() reveals a value's type.",
    "Convert explicitly with int(), float(), str() — Python will not mix text and numbers for you.",
    "None means “no value”; test for it with is None.",
  ],
  mistakes: [
    { mistake: "Doing arithmetic on text read from a form: \"3\" * 2 gives \"33\"", fix: "Convert first: int(\"3\") * 2 gives 6." },
    { mistake: "Using a variable before assigning it, which raises NameError", fix: "Assign the variable on an earlier line, and check the spelling matches exactly." },
    { mistake: "Expecting int(7.9) to round to 8", fix: "int() truncates towards zero. Use round() when you want rounding." },
  ],
  quiz: [
    {
      question: "What is printed by: x = 4, then x = x * 2, then print(x)?",
      options: ["4", "x * 2", "8", "An error"],
      answer: 2,
      explanation: "The right-hand side x * 2 is calculated with the current value 4, giving 8, which is then stored back in x.",
    },
    {
      question: "Which variable name follows Python conventions?",
      options: ["TotalPrice", "total_price", "total price", "2total"],
      answer: 1,
      explanation: "snake_case is the convention. Spaces and a leading digit are not allowed at all.",
    },
    {
      question: "What does type(\"12\") return?",
      options: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "12"],
      answer: 0,
      explanation: "The quotes make it a string, even though its characters are digits.",
    },
    {
      question: "Which value is falsy?",
      options: ["\"0\"", "-1", "\"False\"", "0"],
      answer: 3,
      explanation: "The number 0 is falsy. \"0\" and \"False\" are non-empty strings, and -1 is a non-zero number, so they are truthy.",
    },
  ],
  practice: [],
};
