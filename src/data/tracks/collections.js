import { code, hidden, test } from "../helpers.js";

export default {
  id: "collections",
  title: "Collections & Algorithms",
  description: "Lists, dictionaries, sets and the classic algorithms built on them.",
  problems: [
    {
      id: "list-stats",
      title: "Calculate List Statistics",
      difficulty: "Medium",
      minutes: 15,
      summary: "Return the minimum, maximum and mean of a list of numbers.",
      statement:
        "Given a list of numbers, return a tuple (minimum, maximum, mean) where the mean is rounded to 2 decimals. If the list is empty there are no statistics: return None instead of crashing.",
      task: "Create list_stats(numbers) that returns (min, max, mean) or None.",
      examples: [
        { title: "Three values", input: "list_stats([4, 8, 6])", output: "(4, 8, 6.0)", explanation: "Mean = 18 / 3 = 6.0" },
        { title: "Empty input", input: "list_stats([])", output: "None", explanation: "Guard against dividing by zero." },
      ],
      inputFormat: "A list of ints or floats.",
      outputFormat: "A tuple (min, max, mean) or None.",
      constraints: ["0 ≤ len(numbers) ≤ 10⁵"],
      concepts: ["lists", "min", "max", "sum", "len", "tuples", "None"],
      hints: [
        "Handle the empty list first with an early return.",
        "Python's built-ins min(), max(), sum() and len() do most of the work.",
        "Return a tuple: return (min(numbers), max(numbers), round(sum(numbers) / len(numbers), 2)).",
      ],
      scaffold: code`
        def list_stats(numbers):
            if not numbers:
                return None
            mean = ...
            return (min(numbers), max(numbers), mean)
      `,
      starter: code`
        def list_stats(numbers):
            """Return (minimum, maximum, mean rounded to 2) or None for an empty list."""
            # TODO: implement this function

            raise NotImplementedError("Implement list_stats")
      `,
      solution: code`
        def list_stats(numbers):
            if not numbers:
                return None
            return (min(numbers), max(numbers), round(sum(numbers) / len(numbers), 2))
      `,
      tests: [
        test("Three values", "list_stats([4, 8, 6])", "(4, 8, 6.0)"),
        test("Empty input", "list_stats([])", "None"),
        hidden("list_stats([1, 2])", "(1, 2, 1.5)"),
        hidden("list_stats([-5])", "(-5, -5, -5.0)"),
        hidden("list_stats([1, 1, 2])", "(1, 2, 1.33)"),
      ],
    },
    {
      id: "unique-in-order",
      title: "Remove Duplicates",
      difficulty: "Easy",
      minutes: 12,
      summary: "Drop repeated items while keeping the original order.",
      statement:
        "Return a new list containing each item of items once, in the order of its first appearance. Using set() alone loses the order, so you will need to track what you have already seen.",
      task: "Create unique_in_order(items) that returns the de-duplicated list.",
      examples: [
        { title: "Repeated tags", input: 'unique_in_order(["ai", "data", "ai", "web"])', output: '["ai", "data", "web"]', explanation: "The second 'ai' is dropped." },
      ],
      inputFormat: "A list of hashable values.",
      outputFormat: "A list with duplicates removed, order preserved.",
      constraints: ["0 ≤ len(items) ≤ 10⁵"],
      concepts: ["lists", "sets", "membership", "for"],
      hints: [
        "Keep a set called seen and a list called result.",
        "Set membership checks (x in seen) are fast, list checks are slow for large inputs.",
        "For each item: if it is not in seen, add it to seen and append it to result.",
      ],
      scaffold: code`
        def unique_in_order(items):
            seen = set()
            result = []
            for item in items:
                if item not in seen:
                    ...
            return result
      `,
      starter: code`
        def unique_in_order(items):
            """Return items without duplicates, keeping first-seen order."""
            # TODO: implement this function

            raise NotImplementedError("Implement unique_in_order")
      `,
      solution: code`
        def unique_in_order(items):
            seen = set()
            result = []
            for item in items:
                if item not in seen:
                    seen.add(item)
                    result.append(item)
            return result
      `,
      tests: [
        test("Repeated tags", 'unique_in_order(["ai", "data", "ai", "web"])', '["ai", "data", "web"]'),
        test("Numbers", "unique_in_order([3, 1, 3, 2, 1])", "[3, 1, 2]"),
        hidden("unique_in_order([])", "[]"),
        hidden("unique_in_order([5, 5, 5])", "[5]"),
      ],
    },
    {
      id: "word-frequency",
      title: "Word Frequency",
      difficulty: "Medium",
      minutes: 18,
      summary: "Build a dictionary counting how often each word appears.",
      statement:
        "Count the words in text. Words are compared case-insensitively and the punctuation characters . , ! ? ; : are removed before counting. Return a dictionary mapping each lowercase word to its count.",
      task: "Create word_counts(text) that returns a dict of word → count.",
      examples: [
        { title: "Repeated word", input: 'word_counts("Data beats opinions. DATA wins!")', output: '{"data": 2, "beats": 1, "opinions": 1, "wins": 1}', explanation: "'Data' and 'DATA' are the same word." },
      ],
      inputFormat: "A string text.",
      outputFormat: "A dict[str, int].",
      constraints: ["0 ≤ len(text) ≤ 10⁵"],
      concepts: ["dictionaries", "get", "split", "lower", "replace", "counting"],
      hints: [
        "Lower-case the text, then remove each punctuation character with str.replace.",
        "Split into words with .split().",
        "counts[word] = counts.get(word, 0) + 1 increments safely even for new words.",
      ],
      scaffold: code`
        def word_counts(text):
            text = text.lower()
            for mark in ".,!?;:":
                text = text.replace(mark, "")
            counts = {}
            for word in text.split():
                ...
            return counts
      `,
      starter: code`
        def word_counts(text):
            """Return a dict mapping lowercase words to their counts."""
            # TODO: implement this function

            raise NotImplementedError("Implement word_counts")
      `,
      solution: code`
        def word_counts(text):
            text = text.lower()
            for mark in ".,!?;:":
                text = text.replace(mark, "")
            counts = {}
            for word in text.split():
                counts[word] = counts.get(word, 0) + 1
            return counts
      `,
      tests: [
        test("Repeated word", 'word_counts("Data beats opinions. DATA wins!")', '{"data": 2, "beats": 1, "opinions": 1, "wins": 1}'),
        test("Empty text", 'word_counts("")', "{}"),
        hidden('word_counts("a a a")', '{"a": 3}'),
        hidden('word_counts("Yes; no: yes?")', '{"yes": 2, "no": 1}'),
      ],
    },
    {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "Medium",
      minutes: 20,
      summary: "Find the two positions whose values add up to a target.",
      statement:
        "Given a list of integers nums and an integer target, return a tuple (i, j) with i < j such that nums[i] + nums[j] == target. If several pairs exist, return the one with the smallest j (and then the smallest i). If no pair exists, return None. Aim for a single pass using a dictionary.",
      task: "Create two_sum(nums, target) that returns (i, j) or None.",
      examples: [
        { title: "Classic", input: "two_sum([2, 7, 11, 15], 9)", output: "(0, 1)", explanation: "2 + 7 = 9" },
        { title: "No answer", input: "two_sum([1, 2], 10)", output: "None", explanation: "No pair sums to 10." },
      ],
      inputFormat: "nums: list[int], target: int",
      outputFormat: "A tuple of two indices or None.",
      constraints: ["0 ≤ len(nums) ≤ 10⁵", "An element cannot be paired with itself."],
      concepts: ["dictionaries", "enumerate", "complement", "algorithms"],
      hints: [
        "A double loop works but is O(n²). Can you remember values you have already seen?",
        "Walk the list with enumerate. For each value, the partner you need is target - value.",
        "Store seen[value] = index after checking whether the needed partner is already in seen.",
      ],
      scaffold: code`
        def two_sum(nums, target):
            seen = {}
            for j, value in enumerate(nums):
                need = target - value
                if need in seen:
                    return ...
                seen.setdefault(value, j)
            return None
      `,
      starter: code`
        def two_sum(nums, target):
            """Return indices (i, j), i < j, with nums[i] + nums[j] == target, or None."""
            # TODO: implement this function

            raise NotImplementedError("Implement two_sum")
      `,
      solution: code`
        def two_sum(nums, target):
            seen = {}
            for j, value in enumerate(nums):
                need = target - value
                if need in seen:
                    return (seen[need], j)
                seen.setdefault(value, j)
            return None
      `,
      tests: [
        test("Classic", "two_sum([2, 7, 11, 15], 9)", "(0, 1)"),
        test("No answer", "two_sum([1, 2], 10)", "None"),
        hidden("two_sum([3, 3], 6)", "(0, 1)"),
        hidden("two_sum([3, 2, 4], 6)", "(1, 2)"),
        hidden("two_sum([], 1)", "None"),
      ],
    },
    {
      id: "anagram",
      title: "Anagram Check",
      difficulty: "Easy",
      minutes: 12,
      summary: "Decide whether two phrases use exactly the same letters.",
      statement:
        "Two phrases are anagrams if, after removing spaces and ignoring case, they contain exactly the same letters the same number of times. Return True or False.",
      task: "Create are_anagrams(a, b) that returns a bool.",
      examples: [
        { title: "Classic anagram", input: 'are_anagrams("Listen", "Silent")', output: "True", explanation: "Both contain e, i, l, n, s, t once." },
        { title: "Different counts", input: 'are_anagrams("aab", "abb")', output: "False", explanation: "The letter counts differ." },
      ],
      inputFormat: "Two strings a and b.",
      outputFormat: "True or False.",
      constraints: ["0 ≤ len(a), len(b) ≤ 10⁵"],
      concepts: ["sorted", "strings", "replace", "lower"],
      hints: [
        "Normalise both strings first: lower-case them and remove spaces.",
        "Two strings are anagrams if their sorted characters are equal.",
        "return sorted(clean_a) == sorted(clean_b)",
      ],
      scaffold: code`
        def are_anagrams(a, b):
            clean_a = a.replace(" ", "").lower()
            clean_b = ...
            return ...
      `,
      starter: code`
        def are_anagrams(a, b):
            """Return True if a and b are anagrams (ignoring spaces and case)."""
            # TODO: implement this function

            raise NotImplementedError("Implement are_anagrams")
      `,
      solution: code`
        def are_anagrams(a, b):
            clean = lambda s: sorted(s.replace(" ", "").lower())
            return clean(a) == clean(b)
      `,
      tests: [
        test("Classic anagram", 'are_anagrams("Listen", "Silent")', "True"),
        test("Different counts", 'are_anagrams("aab", "abb")', "False"),
        hidden('are_anagrams("Dormitory", "Dirty room")', "True"),
        hidden('are_anagrams("", "")', "True"),
        hidden('are_anagrams("abc", "abcd")', "False"),
      ],
    },
    {
      id: "second-largest",
      title: "Second Largest Value",
      difficulty: "Medium",
      minutes: 15,
      summary: "Find the second largest distinct number in a list.",
      statement:
        "Return the second largest distinct value in nums. Duplicates of the maximum do not count, so [5, 5, 3] gives 3. If there is no second distinct value, return None.",
      task: "Create second_largest(nums) that returns an int or None.",
      examples: [
        { title: "Duplicates of max", input: "second_largest([5, 5, 3])", output: "3", explanation: "The distinct values are 5 and 3." },
        { title: "All equal", input: "second_largest([7, 7])", output: "None", explanation: "There is only one distinct value." },
      ],
      inputFormat: "A list of integers.",
      outputFormat: "An int or None.",
      constraints: ["0 ≤ len(nums) ≤ 10⁵"],
      concepts: ["sets", "sorted", "edge cases", "None"],
      hints: [
        "Turning the list into a set removes duplicates.",
        "If the set has fewer than two elements there is no answer.",
        "sorted(set(nums))[-2] is the second largest distinct value.",
      ],
      scaffold: code`
        def second_largest(nums):
            distinct = sorted(set(nums))
            if len(distinct) < 2:
                return None
            return ...
      `,
      starter: code`
        def second_largest(nums):
            """Return the second largest distinct value, or None."""
            # TODO: implement this function

            raise NotImplementedError("Implement second_largest")
      `,
      solution: code`
        def second_largest(nums):
            distinct = sorted(set(nums))
            return distinct[-2] if len(distinct) >= 2 else None
      `,
      tests: [
        test("Duplicates of max", "second_largest([5, 5, 3])", "3"),
        test("All equal", "second_largest([7, 7])", "None"),
        hidden("second_largest([1, 9, 4, 9, 8])", "8"),
        hidden("second_largest([])", "None"),
        hidden("second_largest([-2, -1])", "-2"),
      ],
    },
    {
      id: "flatten",
      title: "Flatten Nested Lists",
      difficulty: "Hard",
      minutes: 25,
      summary: "Use recursion to flatten lists nested to any depth.",
      statement:
        "Given a list that may contain other lists nested to any depth, return a single flat list with every non-list element in left-to-right order.",
      task: "Create flatten(nested) that returns a flat list.",
      examples: [
        { title: "Two levels", input: "flatten([1, [2, [3, 4]], 5])", output: "[1, 2, 3, 4, 5]", explanation: "Every nested level is unpacked in order." },
      ],
      inputFormat: "A list whose items are values or lists.",
      outputFormat: "A flat list.",
      constraints: ["Nesting depth ≤ 100", "Only lists are flattened; tuples and strings are values."],
      concepts: ["recursion", "isinstance", "extend", "lists"],
      hints: [
        "A function may call itself on a smaller part of the problem — that is recursion.",
        "For each item: if isinstance(item, list), flatten it and extend the result; otherwise append the item.",
        "The base case is implicit: a list with no nested lists just gets appended item by item.",
      ],
      scaffold: code`
        def flatten(nested):
            result = []
            for item in nested:
                if isinstance(item, list):
                    result.extend(...)   # recursive call
                else:
                    result.append(item)
            return result
      `,
      starter: code`
        def flatten(nested):
            """Return a flat list of all non-list values in nested."""
            # TODO: implement this function

            raise NotImplementedError("Implement flatten")
      `,
      solution: code`
        def flatten(nested):
            result = []
            for item in nested:
                if isinstance(item, list):
                    result.extend(flatten(item))
                else:
                    result.append(item)
            return result
      `,
      tests: [
        test("Two levels", "flatten([1, [2, [3, 4]], 5])", "[1, 2, 3, 4, 5]"),
        test("Already flat", "flatten([1, 2])", "[1, 2]"),
        hidden("flatten([])", "[]"),
        hidden("flatten([[[[]]], [1]])", "[1]"),
        hidden('flatten([("a", 1), ["b"]])', '[("a", 1), "b"]'),
      ],
    },
    {
      id: "merge-sorted",
      title: "Merge Two Sorted Lists",
      difficulty: "Medium",
      minutes: 20,
      summary: "Combine two sorted lists in linear time without sorted().",
      statement:
        "Given two lists that are each sorted ascending, return one sorted list containing all elements of both. Do not call sorted() or .sort(): walk both lists with two pointers instead, the same step merge sort uses.",
      task: "Create merge_sorted(a, b) that returns the merged list.",
      examples: [
        { title: "Interleaved", input: "merge_sorted([1, 4, 9], [2, 3, 10])", output: "[1, 2, 3, 4, 9, 10]", explanation: "Always take the smaller front element." },
      ],
      inputFormat: "Two ascending lists of numbers.",
      outputFormat: "One ascending list.",
      constraints: ["0 ≤ len(a), len(b) ≤ 10⁵", "Do not use sorted() or list.sort()."],
      concepts: ["while", "indices", "two pointers", "algorithms"],
      hints: [
        "Keep an index i into a and j into b, both starting at 0.",
        "While both lists still have elements, append the smaller of a[i] and b[j] and advance that index.",
        "After the loop one list may have leftovers: extend the result with a[i:] and b[j:].",
      ],
      scaffold: code`
        def merge_sorted(a, b):
            i = j = 0
            result = []
            while i < len(a) and j < len(b):
                if a[i] <= b[j]:
                    ...
                else:
                    ...
            return result + a[i:] + b[j:]
      `,
      starter: code`
        def merge_sorted(a, b):
            """Merge two ascending lists into one ascending list without sorted()."""
            # TODO: implement this function

            raise NotImplementedError("Implement merge_sorted")
      `,
      solution: code`
        def merge_sorted(a, b):
            i = j = 0
            result = []
            while i < len(a) and j < len(b):
                if a[i] <= b[j]:
                    result.append(a[i])
                    i += 1
                else:
                    result.append(b[j])
                    j += 1
            return result + a[i:] + b[j:]
      `,
      tests: [
        test("Interleaved", "merge_sorted([1, 4, 9], [2, 3, 10])", "[1, 2, 3, 4, 9, 10]"),
        test("One empty", "merge_sorted([], [1, 2])", "[1, 2]"),
        hidden("merge_sorted([1, 1], [1])", "[1, 1, 1]"),
        hidden("merge_sorted([5], [1, 2, 3])", "[1, 2, 3, 5]"),
      ],
    },
    {
      id: "balanced-brackets",
      title: "Balanced Brackets",
      difficulty: "Hard",
      minutes: 25,
      summary: "Use a stack to validate (), [] and {} pairs.",
      statement:
        "A string is balanced when every opening bracket ( [ { has a matching closing bracket of the same type in the correct order. Characters other than brackets are ignored. Return True if s is balanced.",
      task: "Create is_balanced(s) that returns a bool.",
      examples: [
        { title: "Nested", input: 'is_balanced("{[()]}")', output: "True", explanation: "Each bracket closes in reverse order of opening." },
        { title: "Crossed", input: 'is_balanced("([)]")', output: "False", explanation: "] arrives while ( is still open." },
      ],
      inputFormat: "A string s.",
      outputFormat: "True or False.",
      constraints: ["0 ≤ len(s) ≤ 10⁵"],
      concepts: ["stacks", "lists", "dictionaries", "append", "pop"],
      hints: [
        "A Python list works as a stack: append() pushes, pop() removes the most recent item.",
        "Map each closer to its opener: pairs = {')': '(', ']': '[', '}': '{'}.",
        "On a closer, the stack must be non-empty and its top must be the matching opener. At the end the stack must be empty.",
      ],
      scaffold: code`
        def is_balanced(s):
            pairs = {")": "(", "]": "[", "}": "{"}
            stack = []
            for ch in s:
                if ch in "([{":
                    stack.append(ch)
                elif ch in pairs:
                    if not stack or stack.pop() != pairs[ch]:
                        return False
            return ...
      `,
      starter: code`
        def is_balanced(s):
            """Return True if every bracket in s is correctly matched."""
            # TODO: implement this function

            raise NotImplementedError("Implement is_balanced")
      `,
      solution: code`
        def is_balanced(s):
            pairs = {")": "(", "]": "[", "}": "{"}
            stack = []
            for ch in s:
                if ch in "([{":
                    stack.append(ch)
                elif ch in pairs:
                    if not stack or stack.pop() != pairs[ch]:
                        return False
            return not stack
      `,
      tests: [
        test("Nested", 'is_balanced("{[()]}")', "True"),
        test("Crossed", 'is_balanced("([)]")', "False"),
        hidden('is_balanced("")', "True"),
        hidden('is_balanced("((")', "False"),
        hidden('is_balanced("print(items[0])")', "True"),
        hidden('is_balanced("}")', "False"),
      ],
    },
    {
      id: "chunk-list",
      title: "Chunk a List",
      difficulty: "Easy",
      minutes: 12,
      summary: "Split a list into fixed-size batches.",
      statement:
        "Batch processing APIs often accept a limited number of records per call. Split items into consecutive chunks of length size; the final chunk may be shorter. Return a list of lists.",
      task: "Create chunk(items, size) that returns the list of chunks.",
      examples: [
        { title: "Uneven split", input: "chunk([1, 2, 3, 4, 5], 2)", output: "[[1, 2], [3, 4], [5]]", explanation: "The last chunk holds the remainder." },
      ],
      inputFormat: "items: list, size: int ≥ 1",
      outputFormat: "A list of lists.",
      constraints: ["1 ≤ size ≤ 10⁴"],
      concepts: ["range", "slicing", "comprehension"],
      hints: [
        "range(0, len(items), size) gives the start index of every chunk.",
        "items[start:start + size] safely slices even past the end of the list.",
        "A list comprehension can build all chunks in one line.",
      ],
      scaffold: code`
        def chunk(items, size):
            return [items[i:i + size] for i in range(...)]
      `,
      starter: code`
        def chunk(items, size):
            """Split items into lists of length size (last may be shorter)."""
            # TODO: implement this function

            raise NotImplementedError("Implement chunk")
      `,
      solution: code`
        def chunk(items, size):
            return [items[i:i + size] for i in range(0, len(items), size)]
      `,
      tests: [
        test("Uneven split", "chunk([1, 2, 3, 4, 5], 2)", "[[1, 2], [3, 4], [5]]"),
        test("Exact split", 'chunk(["a", "b", "c"], 3)', '[["a", "b", "c"]]'),
        hidden("chunk([], 4)", "[]"),
        hidden("chunk([1, 2, 3], 1)", "[[1], [2], [3]]"),
      ],
    },
  ],
};
