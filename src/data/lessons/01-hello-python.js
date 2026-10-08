import { code } from "../helpers.js";

export default {
  id: "hello-python",
  unit: "getting-started",
  title: "Your First Python Program",
  minutes: 15,
  summary: "What Python is, how it runs your code line by line, and how to make it print results.",
  objectives: [
    "Explain what happens when Python runs a program",
    "Use print() to display text and numbers",
    "Tell the difference between a string and a number",
    "Write comments that explain your intent",
  ],
  sections: [
    {
      heading: "What is a program?",
      body: [
        "A program is a list of instructions. Python reads your file **from top to bottom** and carries out one instruction (a *statement*) at a time. When it reaches the end, the program stops.",
        "Python is popular because those instructions read almost like English. You will use it for automation, data analysis, web back-ends and machine learning — but every one of those starts with the same few building blocks you are learning here.",
      ],
      callout: { kind: "note", text: "Every example in these lessons is editable and runs real Python 3 in your browser. Change something, press **Run**, and see what happens — experimenting is the fastest way to learn." },
    },
    {
      heading: "Printing output",
      body: [
        "`print()` is a *function*: a named piece of behaviour you call by writing its name followed by parentheses. Whatever you put inside the parentheses — the *argument* — is displayed.",
        "Text must be wrapped in quotes. Single `'...'` and double `\"...\"` quotes both work; just use the same kind at both ends.",
      ],
      example: {
        code: code`
          print("Hello, world!")
          print('Python is fun')
          print("Each print starts a new line.")
        `,
        output: "Hello, world!\nPython is fun\nEach print starts a new line.",
      },
    },
    {
      heading: "Text versus numbers",
      body: [
        "Quotes make a **string** (text). Without quotes, Python treats digits as a **number** and can do arithmetic with them.",
        "Notice the difference below: `\"2 + 3\"` is just three characters of text, while `2 + 3` is a calculation that produces `5`.",
      ],
      example: {
        code: code`
          print("2 + 3")
          print(2 + 3)
          print(10 * 4)
        `,
        output: "2 + 3\n5\n40",
      },
    },
    {
      heading: "Printing several values",
      body: [
        "`print()` accepts several arguments separated by commas. It puts a single space between them, so you can mix text and numbers freely.",
      ],
      example: {
        code: code`
          print("Minutes in a day:", 24 * 60)
          print("Python", 3, "is here")
        `,
        output: "Minutes in a day: 1440\nPython 3 is here",
      },
    },
    {
      heading: "Comments",
      body: [
        "Anything after a `#` on a line is a **comment**. Python ignores it completely; it exists for humans. Good comments explain *why* the code does something, not what each symbol means.",
      ],
      example: {
        code: code`
          # Convert a 90-minute workshop into hours for the schedule.
          print(90 / 60)  # 1.5 hours
        `,
        output: "1.5",
      },
      callout: { kind: "tip", text: "Use a comment to switch a line off temporarily while experimenting: put `#` in front of it, run, then remove the `#` again." },
    },
    {
      heading: "When things go wrong",
      body: [
        "Mistakes are normal. When Python cannot run a line it stops and shows an **error** naming the problem and the line number. Read the last line of the message first — it usually tells you exactly what is wrong.",
        "Below, the closing quote is missing, so Python cannot tell where the text ends. Try fixing it and running again.",
      ],
      example: {
        code: code`
          print("Hello)
        `,
        output: "",
        error: "SyntaxError",
        note: "Add the missing closing quote: print(\"Hello\")",
      },
    },
  ],
  keyPoints: [
    "Python runs statements one at a time, from the top of the file to the bottom.",
    "print() displays its arguments; separate several arguments with commas.",
    "Text in quotes is a string; digits without quotes are numbers you can calculate with.",
    "Comments start with # and are ignored by Python.",
    "Error messages name the problem and the line — read the last line first.",
  ],
  mistakes: [
    { mistake: "Forgetting the closing quote or parenthesis: print(\"Hi)", fix: "Every opening quote and bracket needs a matching closing one." },
    { mistake: "Capitalising the function: Print(\"Hi\")", fix: "Python is case-sensitive. Built-in names like print are lowercase." },
    { mistake: "Expecting \"2 + 3\" to print 5", fix: "Quotes turn it into text. Remove the quotes to calculate." },
  ],
  quiz: [
    {
      question: "What does print(\"7\" + \"1\") display?",
      options: ["8", "71", "7 1", "An error"],
      answer: 1,
      explanation: "Both values are strings, and + joins strings together, so the result is the text 71.",
    },
    {
      question: "Which line is ignored by Python?",
      options: ["print(\"# not a comment\")", "# print(\"hello\")", "print(5) # five", "print()"],
      answer: 1,
      explanation: "A line that starts with # is entirely a comment. In the other options the # is inside a string, after code, or absent.",
    },
    {
      question: "What does print(\"Total:\", 3 * 4) display?",
      options: ["Total:12", "Total: 3 * 4", "Total: 12", "\"Total:\" 12"],
      answer: 2,
      explanation: "The calculation runs first, then print separates its two arguments with one space.",
    },
  ],
  practice: [],
};
