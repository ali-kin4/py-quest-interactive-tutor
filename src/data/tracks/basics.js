import { code, hidden, test } from "../helpers.js";

export default {
  id: "basics",
  title: "Python Basics",
  description: "Variables, strings, decisions and loops — the core you will use in every program.",
  problems: [
    {
      id: "greet-customer",
      title: "Greet a Customer",
      difficulty: "Easy",
      minutes: 10,
      summary: "Clean up a messy name and build a friendly greeting.",
      statement:
        "Names typed into web forms are messy: extra spaces, random capitalisation. Given a raw name, remove the surrounding whitespace, convert it to title case and return a greeting of the form \"Hello, Name!\".",
      task: "Create greet(name) that returns the normalised greeting string.",
      examples: [
        { title: "Messy capitalisation", input: 'greet("  aDA lovelace ")', output: '"Hello, Ada Lovelace!"', explanation: "Whitespace is stripped and each word is title-cased." },
      ],
      inputFormat: "A single string name, possibly with leading/trailing spaces.",
      outputFormat: "A string: Hello, <Name>!",
      constraints: ["0 ≤ len(name) ≤ 100", "Only surrounding whitespace is removed; inner spaces stay."],
      concepts: ["strings", "strip", "title", "f-string", "return"],
      hints: [
        "Strings have methods that return new strings — they never change the original.",
        "name.strip() removes outer whitespace and .title() capitalises each word. You can chain them.",
        "Build the result with an f-string: f\"Hello, {clean}!\".",
      ],
      scaffold: code`
        def greet(name):
            clean = name.strip().title()
            return ...  # build the greeting with an f-string
      `,
      starter: code`
        def greet(name):
            """Return 'Hello, <Name>!' with the name stripped and title-cased."""
            # TODO: implement this function

            raise NotImplementedError("Implement greet")
      `,
      solution: code`
        def greet(name):
            clean = name.strip().title()
            return f"Hello, {clean}!"
      `,
      tests: [
        test("Messy capitalisation", 'greet("  aDA lovelace ")', '"Hello, Ada Lovelace!"'),
        test("Already clean", 'greet("Grace")', '"Hello, Grace!"'),
        hidden('greet("   sam   ")', '"Hello, Sam!"'),
        hidden('greet("guido van rossum")', '"Hello, Guido Van Rossum!"'),
      ],
    },
    {
      id: "invoice-total",
      title: "Invoice Total",
      difficulty: "Easy",
      minutes: 10,
      summary: "Multiply a price by a quantity and round to cents.",
      statement:
        "An invoice line has a unit price and a quantity. Return the line total rounded to two decimal places so it can be shown as money.",
      task: "Create invoice_total(price, quantity) that returns price × quantity rounded to 2 decimals.",
      examples: [
        { title: "Four items", input: "invoice_total(12.5, 4)", output: "50.0", explanation: "12.5 × 4 = 50.0" },
        { title: "Floating point", input: "invoice_total(0.99, 3)", output: "2.97", explanation: "0.99 × 3 is 2.9699999… in binary floating point; rounding gives 2.97." },
      ],
      inputFormat: "price: float ≥ 0, quantity: int ≥ 0",
      outputFormat: "A float rounded to 2 decimal places.",
      constraints: ["0 ≤ price ≤ 10⁶", "0 ≤ quantity ≤ 10⁴"],
      concepts: ["numbers", "arithmetic", "round", "return"],
      hints: [
        "This is a single multiplication followed by rounding.",
        "round(value, 2) rounds to two decimal places.",
        "return round(price * quantity, 2)",
      ],
      scaffold: code`
        def invoice_total(price, quantity):
            total = price * quantity
            return ...  # round total to 2 decimals
      `,
      starter: code`
        def invoice_total(price, quantity):
            """Return price * quantity rounded to two decimals."""
            # TODO: implement this function

            raise NotImplementedError("Implement invoice_total")
      `,
      solution: code`
        def invoice_total(price, quantity):
            return round(price * quantity, 2)
      `,
      tests: [
        test("Four items", "invoice_total(12.5, 4)", "50.0"),
        test("Floating point", "invoice_total(0.99, 3)", "2.97"),
        hidden("invoice_total(100, 0)", "0.0"),
        hidden("invoice_total(19.999, 1)", "20.0"),
      ],
    },
    {
      id: "even-or-odd",
      title: "Even or Odd",
      difficulty: "Easy",
      minutes: 8,
      summary: "Use the modulus operator to classify a number.",
      statement: "Given an integer n, return the string \"even\" if it is divisible by 2 and \"odd\" otherwise. Negative numbers and zero follow the same rule.",
      task: "Create parity(n) that returns \"even\" or \"odd\".",
      examples: [
        { title: "Even number", input: "parity(10)", output: '"even"', explanation: "10 % 2 == 0" },
        { title: "Negative odd", input: "parity(-3)", output: '"odd"', explanation: "In Python -3 % 2 == 1, so -3 is odd." },
      ],
      inputFormat: "An integer n.",
      outputFormat: "The string \"even\" or \"odd\".",
      constraints: ["-10⁹ ≤ n ≤ 10⁹"],
      concepts: ["modulus", "if", "comparison"],
      hints: [
        "The remainder after dividing by 2 tells you everything.",
        "n % 2 is 0 for even numbers and 1 for odd numbers (even when n is negative).",
        "Use a conditional expression: return \"even\" if n % 2 == 0 else \"odd\".",
      ],
      scaffold: code`
        def parity(n):
            if n % 2 == 0:
                return ...
            return ...
      `,
      starter: code`
        def parity(n):
            """Return "even" or "odd" for the integer n."""
            # TODO: implement this function

            raise NotImplementedError("Implement parity")
      `,
      solution: code`
        def parity(n):
            return "even" if n % 2 == 0 else "odd"
      `,
      tests: [
        test("Even number", "parity(10)", '"even"'),
        test("Negative odd", "parity(-3)", '"odd"'),
        hidden("parity(0)", '"even"'),
        hidden("parity(7)", '"odd"'),
      ],
    },
    {
      id: "letter-grade",
      title: "Letter Grade",
      difficulty: "Easy",
      minutes: 12,
      summary: "Translate a numeric score into a letter with if/elif/else.",
      statement:
        "A course converts scores to letters: 90 and above is \"A\", 80–89 is \"B\", 70–79 is \"C\", 60–69 is \"D\" and anything below 60 is \"F\". Boundaries are inclusive of the lower value.",
      task: "Create letter_grade(score) that returns the correct letter.",
      examples: [
        { title: "Boundary", input: "letter_grade(90)", output: '"A"', explanation: "90 is the lowest A." },
        { title: "Middle of a band", input: "letter_grade(75)", output: '"C"', explanation: "75 falls between 70 and 79." },
      ],
      inputFormat: "An integer score between 0 and 100.",
      outputFormat: "One of \"A\", \"B\", \"C\", \"D\", \"F\".",
      constraints: ["0 ≤ score ≤ 100"],
      concepts: ["if", "elif", "comparison", "boundaries"],
      hints: [
        "Check the highest band first — the first true branch wins.",
        "Use if score >= 90, then elif score >= 80, and so on.",
        "Finish with else: return \"F\" so every score has an outcome.",
      ],
      scaffold: code`
        def letter_grade(score):
            if score >= 90:
                return "A"
            elif score >= 80:
                return "B"
            # continue the chain...
      `,
      starter: code`
        def letter_grade(score):
            """Return the letter grade for a 0-100 score."""
            # TODO: implement this function

            raise NotImplementedError("Implement letter_grade")
      `,
      solution: code`
        def letter_grade(score):
            if score >= 90:
                return "A"
            elif score >= 80:
                return "B"
            elif score >= 70:
                return "C"
            elif score >= 60:
                return "D"
            return "F"
      `,
      tests: [
        test("Boundary", "letter_grade(90)", '"A"'),
        test("Middle of a band", "letter_grade(75)", '"C"'),
        hidden("letter_grade(59)", '"F"'),
        hidden("letter_grade(80)", '"B"'),
        hidden("letter_grade(60)", '"D"'),
      ],
    },
    {
      id: "discount-tier",
      title: "Discount Tiers",
      difficulty: "Easy",
      minutes: 12,
      summary: "Apply a tiered discount to an order total.",
      statement:
        "A shop gives 15% off orders of 200 or more and 5% off orders of 100 or more. Smaller orders pay full price. Return the final amount rounded to 2 decimals.",
      task: "Create final_total(total) that applies the right discount tier.",
      examples: [
        { title: "Top tier", input: "final_total(200)", output: "170.0", explanation: "200 × 0.85 = 170" },
        { title: "No discount", input: "final_total(50)", output: "50.0", explanation: "Below 100 there is no discount." },
      ],
      inputFormat: "A non-negative float total.",
      outputFormat: "A float rounded to 2 decimals.",
      constraints: ["0 ≤ total ≤ 10⁶"],
      concepts: ["if", "elif", "arithmetic", "round"],
      hints: [
        "Order matters: check the larger threshold before the smaller one.",
        "15% off means multiplying by 0.85; 5% off means multiplying by 0.95.",
        "Store the multiplier in a variable, then return round(total * multiplier, 2).",
      ],
      scaffold: code`
        def final_total(total):
            if total >= 200:
                rate = 0.85
            elif ...:
                rate = ...
            else:
                rate = 1
            return round(total * rate, 2)
      `,
      starter: code`
        def final_total(total):
            """Apply 15% off for >= 200, 5% off for >= 100."""
            # TODO: implement this function

            raise NotImplementedError("Implement final_total")
      `,
      solution: code`
        def final_total(total):
            if total >= 200:
                rate = 0.85
            elif total >= 100:
                rate = 0.95
            else:
                rate = 1
            return round(total * rate, 2)
      `,
      tests: [
        test("Top tier", "final_total(200)", "170.0"),
        test("No discount", "final_total(50)", "50.0"),
        hidden("final_total(100)", "95.0"),
        hidden("final_total(300)", "255.0"),
        hidden("final_total(199.99)", "189.99"),
      ],
    },
    {
      id: "fizzbuzz",
      title: "FizzBuzz",
      difficulty: "Easy",
      minutes: 15,
      summary: "The classic loop-and-branch warm-up, returning a list.",
      statement:
        "For every number from 1 to n inclusive, produce \"Fizz\" if it is divisible by 3, \"Buzz\" if divisible by 5, \"FizzBuzz\" if divisible by both, and the number itself as a string otherwise. Return all values in a list.",
      task: "Create fizzbuzz(n) that returns the list of strings.",
      examples: [
        { title: "First five", input: "fizzbuzz(5)", output: '["1", "2", "Fizz", "4", "Buzz"]', explanation: "3 → Fizz, 5 → Buzz." },
      ],
      inputFormat: "An integer n ≥ 0.",
      outputFormat: "A list of n strings.",
      constraints: ["0 ≤ n ≤ 10⁴"],
      concepts: ["for", "range", "modulus", "lists", "append"],
      hints: [
        "Loop with range(1, n + 1) so both ends are included.",
        "Check divisibility by 15 (both 3 and 5) before checking 3 or 5 alone.",
        "Use str(i) for numbers and append each value to a result list.",
      ],
      scaffold: code`
        def fizzbuzz(n):
            result = []
            for i in range(1, n + 1):
                if i % 15 == 0:
                    result.append("FizzBuzz")
                # handle 3, 5 and the rest
            return result
      `,
      starter: code`
        def fizzbuzz(n):
            """Return the FizzBuzz sequence from 1 to n as strings."""
            # TODO: implement this function

            raise NotImplementedError("Implement fizzbuzz")
      `,
      solution: code`
        def fizzbuzz(n):
            result = []
            for i in range(1, n + 1):
                if i % 15 == 0:
                    result.append("FizzBuzz")
                elif i % 3 == 0:
                    result.append("Fizz")
                elif i % 5 == 0:
                    result.append("Buzz")
                else:
                    result.append(str(i))
            return result
      `,
      tests: [
        test("First five", "fizzbuzz(5)", '["1", "2", "Fizz", "4", "Buzz"]'),
        test("Reaches FizzBuzz", "fizzbuzz(15)[-1]", '"FizzBuzz"'),
        hidden("fizzbuzz(0)", "[]"),
        hidden("len(fizzbuzz(100))", "100"),
        hidden("fizzbuzz(30)[29]", '"FizzBuzz"'),
      ],
    },
    {
      id: "digit-sum",
      title: "Sum of Digits",
      difficulty: "Easy",
      minutes: 12,
      summary: "Add up the digits of an integer, including negatives.",
      statement: "Return the sum of the decimal digits of an integer n. The sign is ignored, so -123 has digit sum 6.",
      task: "Create digit_sum(n) that returns an int.",
      examples: [
        { title: "Positive", input: "digit_sum(1234)", output: "10", explanation: "1 + 2 + 3 + 4 = 10" },
        { title: "Negative", input: "digit_sum(-505)", output: "10", explanation: "The sign is ignored: 5 + 0 + 5." },
      ],
      inputFormat: "An integer n.",
      outputFormat: "A non-negative integer.",
      constraints: ["-10¹⁸ ≤ n ≤ 10¹⁸"],
      concepts: ["abs", "strings", "loops", "modulus", "integer division"],
      hints: [
        "Use abs(n) first so the minus sign never gets in the way.",
        "Two approaches: convert to a string and loop over characters, or repeatedly use n % 10 and n // 10.",
        "sum(int(d) for d in str(abs(n))) solves it in one line.",
      ],
      scaffold: code`
        def digit_sum(n):
            n = abs(n)
            total = 0
            while n > 0:
                total += ...   # last digit
                n = ...        # drop the last digit
            return total
      `,
      starter: code`
        def digit_sum(n):
            """Return the sum of the digits of n (sign ignored)."""
            # TODO: implement this function

            raise NotImplementedError("Implement digit_sum")
      `,
      solution: code`
        def digit_sum(n):
            return sum(int(d) for d in str(abs(n)))
      `,
      tests: [
        test("Positive", "digit_sum(1234)", "10"),
        test("Negative", "digit_sum(-505)", "10"),
        hidden("digit_sum(0)", "0"),
        hidden("digit_sum(999999999)", "81"),
      ],
    },
    {
      id: "reverse-words",
      title: "Reverse the Words",
      difficulty: "Easy",
      minutes: 12,
      summary: "Split a sentence, reverse the word order, join it back.",
      statement:
        "Given a sentence, return a new string with the words in reverse order. Words are separated by any amount of whitespace; the result uses single spaces and has no leading or trailing spaces.",
      task: "Create reverse_words(sentence) that returns the reversed sentence.",
      examples: [
        { title: "Simple sentence", input: 'reverse_words("python is fun")', output: '"fun is python"', explanation: "The three words appear in reverse order." },
      ],
      inputFormat: "A string sentence.",
      outputFormat: "A string with words reversed and single-spaced.",
      constraints: ["0 ≤ len(sentence) ≤ 10⁴"],
      concepts: ["split", "join", "slicing", "lists"],
      hints: [
        "sentence.split() with no arguments splits on any whitespace and drops empty pieces.",
        "A list can be reversed with slicing: words[::-1].",
        "\" \".join(...) glues a list of strings together with single spaces.",
      ],
      scaffold: code`
        def reverse_words(sentence):
            words = sentence.split()
            return " ".join(...)
      `,
      starter: code`
        def reverse_words(sentence):
            """Return the sentence with its words in reverse order."""
            # TODO: implement this function

            raise NotImplementedError("Implement reverse_words")
      `,
      solution: code`
        def reverse_words(sentence):
            return " ".join(sentence.split()[::-1])
      `,
      tests: [
        test("Simple sentence", 'reverse_words("python is fun")', '"fun is python"'),
        test("Extra spaces", 'reverse_words("  hello   world ")', '"world hello"'),
        hidden('reverse_words("")', '""'),
        hidden('reverse_words("one")', '"one"'),
      ],
    },
    {
      id: "count-vowels",
      title: "Count Vowels in a String",
      difficulty: "Medium",
      minutes: 15,
      summary: "Count how many vowels (a, e, i, o, u) appear in a string, case-insensitive.",
      statement:
        "Given a string s, count the number of characters that are vowels (a, e, i, o, u). The check should be case-insensitive and ignore other characters such as spaces, punctuation, and digits. Return the count as an integer.",
      task: "Create count_vowels(s) that returns the number of vowels in s. Treat A, E, I, O, U as vowels regardless of case.",
      examples: [
        { title: "Count vowels in a word", input: 'count_vowels("hello")', output: "2", explanation: "'hello' has 'e' and 'o', so the count is 2." },
        { title: "Mixed content", input: 'count_vowels("Python 3.12!")', output: "1", explanation: "Only the 'o' is a vowel; digits and punctuation are ignored." },
      ],
      inputFormat: "A single string s.",
      outputFormat: "An integer: the number of vowels in s.",
      constraints: ["0 ≤ len(s) ≤ 10⁵", "y is not a vowel in this problem."],
      concepts: ["strings", "lower", "for", "in", "sets", "counting"],
      hints: [
        "Create a collection of vowels for easy checking, e.g. vowels = \"aeiou\".",
        "Convert the input string to lowercase so 'A' and 'a' are treated the same.",
        "Iterate through each character and increase a counter when it is in your vowels collection.",
      ],
      scaffold: code`
        def count_vowels(s):
            vowels = "aeiou"
            count = 0
            for char in s.lower():  # Convert to lowercase
                if char in vowels:   # Check membership
                    count += 1
            return ...
      `,
      starter: code`
        def count_vowels(s):
            """
            Return the number of vowels (a, e, i, o, u) in s, case-insensitive.
            """
            # TODO: implement this function

            raise NotImplementedError("Implement count_vowels")
      `,
      solution: code`
        def count_vowels(s):
            vowels = set("aeiou")
            return sum(1 for char in s.lower() if char in vowels)
      `,
      tests: [
        test("Simple word", 'count_vowels("hello")', "2"),
        test("All vowels uppercase", 'count_vowels("AEIOU")', "5"),
        test("No vowels", 'count_vowels("rhythm")', "0"),
        hidden('count_vowels("")', "0"),
        hidden('count_vowels("The quick brown fox!")', "5"),
      ],
    },
    {
      id: "palindrome",
      title: "Palindrome Check",
      difficulty: "Medium",
      minutes: 15,
      summary: "Decide whether text reads the same backwards, ignoring punctuation.",
      statement:
        "A palindrome reads the same forwards and backwards. Ignore case and every character that is not a letter or digit. Return True if the cleaned text is a palindrome, otherwise False. An empty string counts as a palindrome.",
      task: "Create is_palindrome(text) that returns a bool.",
      examples: [
        { title: "Famous phrase", input: 'is_palindrome("A man, a plan, a canal: Panama")', output: "True", explanation: "Cleaned text is 'amanaplanacanalpanama'." },
        { title: "Not a palindrome", input: 'is_palindrome("python")', output: "False", explanation: "'nohtyp' ≠ 'python'." },
      ],
      inputFormat: "A string text.",
      outputFormat: "True or False.",
      constraints: ["0 ≤ len(text) ≤ 10⁵"],
      concepts: ["strings", "isalnum", "lower", "slicing", "comprehension"],
      hints: [
        "First build a cleaned string containing only lowercase letters and digits.",
        "char.isalnum() tells you whether a character is a letter or digit.",
        "Compare the cleaned string with its reverse: cleaned == cleaned[::-1].",
      ],
      scaffold: code`
        def is_palindrome(text):
            cleaned = "".join(c.lower() for c in text if c.isalnum())
            return ...
      `,
      starter: code`
        def is_palindrome(text):
            """Return True if text is a palindrome, ignoring case and non-alphanumerics."""
            # TODO: implement this function

            raise NotImplementedError("Implement is_palindrome")
      `,
      solution: code`
        def is_palindrome(text):
            cleaned = "".join(c.lower() for c in text if c.isalnum())
            return cleaned == cleaned[::-1]
      `,
      tests: [
        test("Famous phrase", 'is_palindrome("A man, a plan, a canal: Panama")', "True"),
        test("Not a palindrome", 'is_palindrome("python")', "False"),
        hidden('is_palindrome("")', "True"),
        hidden('is_palindrome("No lemon, no melon")', "True"),
        hidden('is_palindrome("ab")', "False"),
      ],
    },
    {
      id: "greatest-common-divisor",
      title: "Find Greatest Common Divisor",
      difficulty: "Hard",
      minutes: 20,
      summary: "Implement Euclid's algorithm without math.gcd.",
      statement:
        "The greatest common divisor (GCD) of two integers is the largest positive integer dividing both. Euclid's algorithm repeatedly replaces (a, b) with (b, a % b) until b is 0. Implement it yourself — math.gcd is not allowed. gcd(0, 0) is defined as 0 and the result is never negative.",
      task: "Create gcd(a, b) that returns the greatest common divisor of a and b.",
      examples: [
        { title: "Shared factor", input: "gcd(48, 18)", output: "6", explanation: "48 = 6×8 and 18 = 6×3." },
        { title: "Coprime", input: "gcd(17, 5)", output: "1", explanation: "No common factor other than 1." },
      ],
      inputFormat: "Two integers a and b.",
      outputFormat: "A non-negative integer.",
      constraints: ["-10⁹ ≤ a, b ≤ 10⁹", "Do not import math."],
      concepts: ["while", "modulus", "tuple unpacking", "algorithms", "abs"],
      hints: [
        "Work with abs(a) and abs(b) so negative inputs behave.",
        "Loop while b != 0 and update both values at once: a, b = b, a % b.",
        "When the loop ends, a holds the answer.",
      ],
      scaffold: code`
        def gcd(a, b):
            a, b = abs(a), abs(b)
            while b != 0:
                a, b = ...
            return a
      `,
      starter: code`
        def gcd(a, b):
            """Return the greatest common divisor of a and b using Euclid's algorithm."""
            # TODO: implement this function

            raise NotImplementedError("Implement gcd")
      `,
      solution: code`
        def gcd(a, b):
            a, b = abs(a), abs(b)
            while b:
                a, b = b, a % b
            return a
      `,
      tests: [
        test("Shared factor", "gcd(48, 18)", "6"),
        test("Coprime", "gcd(17, 5)", "1"),
        hidden("gcd(0, 9)", "9"),
        hidden("gcd(-24, 36)", "12"),
        hidden("gcd(0, 0)", "0"),
      ],
    },
    {
      id: "leap-year",
      title: "Leap Year",
      difficulty: "Medium",
      minutes: 12,
      summary: "Combine boolean conditions to follow the Gregorian calendar rules.",
      statement:
        "A year is a leap year if it is divisible by 4, except years divisible by 100, unless they are also divisible by 400. So 2024 and 2000 are leap years, but 1900 is not.",
      task: "Create is_leap_year(year) that returns True or False.",
      examples: [
        { title: "Century exception", input: "is_leap_year(1900)", output: "False", explanation: "Divisible by 100 but not by 400." },
        { title: "Four-hundred rule", input: "is_leap_year(2000)", output: "True", explanation: "Divisible by 400." },
      ],
      inputFormat: "A positive integer year.",
      outputFormat: "True or False.",
      constraints: ["1 ≤ year ≤ 9999"],
      concepts: ["booleans", "and", "or", "modulus"],
      hints: [
        "Write each rule as its own boolean expression first.",
        "Divisible by 4 and not by 100 → leap. Divisible by 400 → leap.",
        "return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0",
      ],
      scaffold: code`
        def is_leap_year(year):
            by_4 = year % 4 == 0
            by_100 = year % 100 == 0
            by_400 = year % 400 == 0
            return ...
      `,
      starter: code`
        def is_leap_year(year):
            """Return True if year is a Gregorian leap year."""
            # TODO: implement this function

            raise NotImplementedError("Implement is_leap_year")
      `,
      solution: code`
        def is_leap_year(year):
            return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
      `,
      tests: [
        test("Century exception", "is_leap_year(1900)", "False"),
        test("Four-hundred rule", "is_leap_year(2000)", "True"),
        hidden("is_leap_year(2024)", "True"),
        hidden("is_leap_year(2023)", "False"),
        hidden("is_leap_year(2100)", "False"),
      ],
    },
  ],
};
