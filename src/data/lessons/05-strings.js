import { code } from "../helpers.js";

export default {
  id: "strings",
  unit: "text-and-logic",
  title: "Working with Strings",
  minutes: 25,
  summary: "Read characters by position, slice text, clean it up with string methods, and build messages with f-strings.",
  objectives: [
    "Read single characters with positive and negative indexes",
    "Take parts of a string with slicing, including reversing it",
    "Clean and reshape text with strip, lower, title, replace and removesuffix",
    "Split text into words and join words back into text",
    "Build readable messages with f-strings and number formatting",
  ],
  sections: [
    {
      heading: "A string is a sequence of characters",
      body: [
        "Every character in a string has a position called an **index**. Counting starts at `0`, so the first character is `text[0]`. Negative indexes count from the end: `text[-1]` is the last character.",
        "`len(text)` tells you how many characters there are. The last valid positive index is always `len(text) - 1`.",
      ],
      example: {
        code: code`
          word = "Python"
          print(word[0])
          print(word[5])
          print(word[-1])
          print(len(word))
        `,
        output: "P\nn\nn\n6",
      },
      callout: { kind: "warning", text: "Asking for a position that does not exist, such as `word[10]`, raises an **IndexError**." },
    },
    {
      heading: "Slicing: taking part of a string",
      body: [
        "A slice `text[start:stop]` returns the characters from `start` up to — but **not including** — `stop`. Leave out `start` to begin at the front, or `stop` to run to the end.",
        "An optional third number is the **step**. `text[::2]` takes every second character, and a step of `-1` walks backwards, so `text[::-1]` is the whole string reversed.",
      ],
      example: {
        code: code`
          word = "Python"
          print(word[0:2])
          print(word[2:])
          print(word[:4])
          print(word[::2])
          print(word[::-1])
        `,
        output: "Py\nthon\nPyth\nPto\nnohtyP",
      },
      callout: { kind: "tip", text: "Slices never raise IndexError. `word[2:100]` simply stops at the end of the string." },
    },
    {
      heading: "Strings cannot be changed in place",
      body: [
        "Strings are **immutable**: once created, they never change. Methods like `.upper()` build and return a *new* string, leaving the original untouched. To keep the result, assign it to a variable.",
        "Trying to replace a single character by index fails with a TypeError.",
      ],
      example: {
        code: code`
          word = "Python"
          print(word.upper())
          print(word)
          word[0] = "J"
        `,
        output: "PYTHON\nPython",
        error: "TypeError",
        note: "Build a new string instead: word = \"J\" + word[1:]",
      },
    },
    {
      heading: "Cleaning text with string methods",
      body: [
        "Text from forms, files and spreadsheets is messy. These methods are your cleaning toolkit:",
        {
          list: [
            "`strip()` removes spaces, tabs and newlines from both ends (inner spaces stay).",
            "`lower()`, `upper()` and `title()` change capitalisation.",
            "`replace(old, new)` swaps every occurrence of one piece of text for another.",
            "`removesuffix(end)` drops a known ending, such as a unit or file extension, if it is there.",
          ],
        },
        "Because each method returns a string, you can **chain** them: `text.strip().lower()`.",
      ],
      example: {
        code: code`
          raw = "  quarterly REPORT  "
          print(raw.strip())
          print(raw.strip().lower())
          print(raw.strip().title())
          print("2026-10-08".replace("-", "/"))
          print("75%".removesuffix("%"))
        `,
        output: "quarterly REPORT\nquarterly report\nQuarterly Report\n2026/10/08\n75",
      },
    },
    {
      heading: "Splitting and joining",
      body: [
        "`split()` breaks a string into a list of pieces. With no argument it splits on any run of whitespace and ignores spaces at the ends. With an argument, such as `split(\",\")`, it splits on exactly that separator — and keeps empty pieces.",
        "`join()` does the opposite: `separator.join(pieces)` glues a list of strings together with the separator between each pair.",
      ],
      example: {
        code: code`
          sentence = "  data   beats  opinions "
          words = sentence.split()
          print(words)
          print(len(words))
          print("-".join(words))
          print("a,b,,c".split(","))
        `,
        output: "['data', 'beats', 'opinions']\n3\ndata-beats-opinions\n['a', 'b', '', 'c']",
      },
      callout: { kind: "note", text: "The square brackets show a **list** — an ordered collection you will study properly in a later lesson. Lists can be sliced just like strings." },
    },
    {
      heading: "Checking for text with in",
      body: [
        "`part in text` is `True` when `part` appears anywhere inside `text`. The check is case-sensitive, so normalise with `.lower()` first if capitalisation should not matter.",
      ],
      example: {
        code: code`
          email = "ada@example.com"
          print("@" in email)
          print("gmail" in email)
          print("A" in "banana")
          print("a" in "BANANA".lower())
        `,
        output: "True\nFalse\nFalse\nTrue",
      },
    },
    {
      heading: "Building messages with f-strings",
      body: [
        "Put an `f` before the opening quote and you can drop any expression inside `{}`. Python evaluates it and inserts the result as text.",
        "A **format spec** after a colon controls how a value looks. `{value:.2f}` shows a number with exactly two decimal places — ideal for money and percentages.",
      ],
      example: {
        code: code`
          def receipt_line(item, price):
              return f"{item}: {price:.2f} EUR"

          name = "Ada"
          print(f"Welcome back, {name}!")
          print(f"{name} has {len(name)} letters")
          print(receipt_line("Coffee", 3.5))
        `,
        output: "Welcome back, Ada!\nAda has 3 letters\nCoffee: 3.50 EUR",
      },
    },
  ],
  keyPoints: [
    "Indexes start at 0; negative indexes count from the end.",
    "text[start:stop:step] slices without including stop; text[::-1] reverses.",
    "Strings are immutable: methods return new strings, so assign the result.",
    "split() turns text into a list of words; separator.join(words) turns it back.",
    "f-strings insert values with {} and format numbers with specs like {x:.2f}.",
  ],
  mistakes: [
    { mistake: "Calling text.strip() and expecting text to change", fix: "Assign the result: text = text.strip()." },
    { mistake: "Using text[len(text)] to get the last character", fix: "The last index is len(text) - 1, or simply use text[-1]." },
    { mistake: "Forgetting the f in f\"Hello, {name}\"", fix: "Without the f prefix, Python prints the braces and the variable name literally." },
    { mistake: "Joining numbers: \", \".join([1, 2])", fix: "join only accepts strings; convert first with str()." },
  ],
  quiz: [
    {
      question: "What does \"banana\"[1:4] return?",
      options: ["\"ban\"", "\"anan\"", "\"ana\"", "\"nan\""],
      answer: 2,
      explanation: "The slice starts at index 1 ('a') and stops before index 4, giving the characters at 1, 2 and 3.",
    },
    {
      question: "After name = \" ada \" and name.title(), what is name?",
      options: ["\" ada \"", "\"Ada\"", "\" Ada \"", "\"ADA\""],
      answer: 0,
      explanation: "title() returns a new string. Because the result was not assigned, name still holds the original text.",
    },
    {
      question: "What does \" \".join(\"a b  c\".split()) produce?",
      options: ["\"a b  c\"", "\"abc\"", "\"a  b  c\"", "\"a b c\""],
      answer: 3,
      explanation: "split() with no argument collapses runs of spaces into separate words, and join puts exactly one space between them.",
    },
    {
      question: "Which f-string displays 7.5 as 7.50?",
      options: ["f\"{7.5:.2f}\"", "f\"{7.5:2}\"", "f\"{7.5}.2f\"", "f\"{round(7.5)}\""],
      answer: 0,
      explanation: "The format spec .2f after the colon means fixed-point with two decimal places.",
    },
  ],
  practice: ["greet-customer", "reverse-words"],
};
