import { code, hidden, test } from "../helpers.js";

export default {
  id: "practical",
  title: "Practical Python",
  description: "Validation, reporting and automation problems taken from real work.",
  problems: [
    {
      id: "parse-percentage",
      title: "Validate a Percentage",
      difficulty: "Medium",
      minutes: 15,
      summary: "Convert user text to a number safely with try/except.",
      statement:
        "Forms deliver text. Convert raw to a float and return it if it lies between 0 and 100 inclusive. Surrounding whitespace and a trailing % sign are allowed. Anything that is not a number, or is out of range, returns None — the function must never raise.",
      task: "Create parse_percentage(raw) that returns a float or None.",
      examples: [
        { title: "With percent sign", input: 'parse_percentage(" 42.5% ")', output: "42.5", explanation: "Whitespace and % are removed before conversion." },
        { title: "Not a number", input: 'parse_percentage("abc")', output: "None", explanation: "float('abc') raises ValueError, which is caught." },
      ],
      inputFormat: "A string raw.",
      outputFormat: "A float in [0, 100] or None.",
      constraints: ["0 ≤ len(raw) ≤ 100"],
      concepts: ["try", "except", "ValueError", "float", "validation", "strip"],
      hints: [
        "Clean the text first: raw.strip(), then remove a trailing % with removesuffix or rstrip.",
        "Wrap float(...) in try / except ValueError and return None in the except block.",
        "After converting, check 0 <= value <= 100 before returning it.",
      ],
      scaffold: code`
        def parse_percentage(raw):
            text = raw.strip().removesuffix("%")
            try:
                value = float(text)
            except ValueError:
                return None
            return ...
      `,
      starter: code`
        def parse_percentage(raw):
            """Return the percentage as a float in [0, 100], or None if invalid."""
            # TODO: implement this function

            raise NotImplementedError("Implement parse_percentage")
      `,
      solution: code`
        def parse_percentage(raw):
            text = raw.strip().removesuffix("%")
            try:
                value = float(text)
            except ValueError:
                return None
            return value if 0 <= value <= 100 else None
      `,
      tests: [
        test("With percent sign", 'parse_percentage(" 42.5% ")', "42.5"),
        test("Not a number", 'parse_percentage("abc")', "None"),
        hidden('parse_percentage("100")', "100.0"),
        hidden('parse_percentage("101")', "None"),
        hidden('parse_percentage("-0.5")', "None"),
        hidden('parse_percentage("")', "None"),
      ],
    },
    {
      id: "clean-amounts",
      title: "Clean Transaction Amounts",
      difficulty: "Easy",
      minutes: 12,
      summary: "Parse comma-separated numbers, keep positives and sort them.",
      statement:
        "An export gives transaction amounts as one comma-separated string. Parse each integer, keep only positive values (greater than zero), and return them sorted ascending. An empty string means no transactions.",
      task: "Create clean_amounts(raw) that returns a sorted list of positive ints.",
      examples: [
        { title: "Mixed values", input: 'clean_amounts("4,-2,1,0,7")', output: "[1, 4, 7]", explanation: "-2 and 0 are dropped; the rest are sorted." },
      ],
      inputFormat: "A comma-separated string of integers (spaces allowed around values).",
      outputFormat: "A list of ints.",
      constraints: ["0 ≤ number of values ≤ 10⁵"],
      concepts: ["split", "int", "comprehension", "sorted", "filtering"],
      hints: [
        "raw.split(\",\") gives the pieces; int() tolerates surrounding spaces.",
        "Guard the empty string: \"\".split(\",\") returns [''] which int() cannot parse.",
        "sorted(x for x in values if x > 0) filters and sorts in one go.",
      ],
      scaffold: code`
        def clean_amounts(raw):
            if not raw.strip():
                return []
            values = [int(part) for part in raw.split(",")]
            return ...
      `,
      starter: code`
        def clean_amounts(raw):
            """Return positive amounts from a comma-separated string, sorted ascending."""
            # TODO: implement this function

            raise NotImplementedError("Implement clean_amounts")
      `,
      solution: code`
        def clean_amounts(raw):
            if not raw.strip():
                return []
            return sorted(x for x in (int(p) for p in raw.split(",")) if x > 0)
      `,
      tests: [
        test("Mixed values", 'clean_amounts("4,-2,1,0,7")', "[1, 4, 7]"),
        test("Nothing positive", 'clean_amounts("0,-1,-5")', "[]"),
        hidden('clean_amounts("8, 3, 8")', "[3, 8, 8]"),
        hidden('clean_amounts("")', "[]"),
      ],
    },
    {
      id: "ticket-triage",
      title: "Support Ticket Triage",
      difficulty: "Easy",
      minutes: 10,
      summary: "Encode an explainable escalation rule.",
      statement:
        "A support team escalates a ticket when its urgency is \"critical\" (case-insensitive, surrounding spaces ignored) OR when it has been open for at least 7 days. Every other ticket goes to the normal queue.",
      task: "Create triage(urgency, age_days) that returns \"Escalate\" or \"Queue\".",
      examples: [
        { title: "Critical", input: 'triage("Critical", 0)', output: '"Escalate"', explanation: "Urgency alone triggers escalation." },
        { title: "Old ticket", input: 'triage("normal", 7)', output: '"Escalate"', explanation: "7 days is the inclusive threshold." },
      ],
      inputFormat: "urgency: str, age_days: int ≥ 0",
      outputFormat: "\"Escalate\" or \"Queue\".",
      constraints: ["0 ≤ age_days ≤ 3650"],
      concepts: ["booleans", "or", "strip", "lower", "business rules"],
      hints: [
        "Normalise urgency with .strip().lower() before comparing.",
        "Combine the two conditions with or.",
        "return \"Escalate\" if (cond1 or cond2) else \"Queue\"",
      ],
      scaffold: code`
        def triage(urgency, age_days):
            critical = urgency.strip().lower() == "critical"
            stale = ...
            return "Escalate" if critical or stale else "Queue"
      `,
      starter: code`
        def triage(urgency, age_days):
            """Return "Escalate" for critical or >= 7-day-old tickets, else "Queue"."""
            # TODO: implement this function

            raise NotImplementedError("Implement triage")
      `,
      solution: code`
        def triage(urgency, age_days):
            critical = urgency.strip().lower() == "critical"
            return "Escalate" if critical or age_days >= 7 else "Queue"
      `,
      tests: [
        test("Critical", 'triage("Critical", 0)', '"Escalate"'),
        test("Old ticket", 'triage("normal", 7)', '"Escalate"'),
        hidden('triage("low", 2)', '"Queue"'),
        hidden('triage("  CRITICAL ", 1)', '"Escalate"'),
        hidden('triage("high", 6)', '"Queue"'),
      ],
    },
    {
      id: "sensor-quality",
      title: "Flag Invalid Sensor Readings",
      difficulty: "Easy",
      minutes: 12,
      summary: "Count measurements outside a device's valid range.",
      statement:
        "A temperature sensor is rated for -40 °C to 125 °C inclusive. Readings outside that range indicate a fault. Return how many readings are invalid. None values (missing readings) are also invalid.",
      task: "Create invalid_readings(readings) that returns the number of invalid readings.",
      examples: [
        { title: "Two faults", input: "invalid_readings([20, -41, 125, 130])", output: "2", explanation: "-41 and 130 are out of range; 125 is the inclusive limit." },
      ],
      inputFormat: "A list of numbers or None.",
      outputFormat: "An integer count.",
      constraints: ["0 ≤ len(readings) ≤ 10⁵"],
      concepts: ["chained comparison", "None", "for", "counting", "data quality"],
      hints: [
        "Python allows chained comparisons: -40 <= r <= 125.",
        "Check for None first (r is None) — comparing None with a number raises TypeError.",
        "sum(1 for r in readings if r is None or not -40 <= r <= 125)",
      ],
      scaffold: code`
        def invalid_readings(readings):
            invalid = 0
            for r in readings:
                if r is None or ...:
                    invalid += 1
            return invalid
      `,
      starter: code`
        def invalid_readings(readings):
            """Count readings outside [-40, 125] or missing (None)."""
            # TODO: implement this function

            raise NotImplementedError("Implement invalid_readings")
      `,
      solution: code`
        def invalid_readings(readings):
            return sum(1 for r in readings if r is None or not -40 <= r <= 125)
      `,
      tests: [
        test("Two faults", "invalid_readings([20, -41, 125, 130])", "2"),
        test("Boundaries are valid", "invalid_readings([-40, 125])", "0"),
        hidden("invalid_readings([None, 900, 21.5])", "2"),
        hidden("invalid_readings([])", "0"),
      ],
    },
    {
      id: "average-rating",
      title: "Average Customer Rating",
      difficulty: "Easy",
      minutes: 12,
      summary: "Compute a KPI and guard against an empty dataset.",
      statement:
        "Return the mean of a list of customer ratings rounded to 2 decimals. If there are no ratings, return None so dashboards can display 'No data' rather than a misleading 0.",
      task: "Create average_rating(ratings) that returns a float or None.",
      examples: [
        { title: "Three ratings", input: "average_rating([4, 5, 3])", output: "4.0", explanation: "12 / 3 = 4.0" },
        { title: "No data", input: "average_rating([])", output: "None", explanation: "Avoid ZeroDivisionError." },
      ],
      inputFormat: "A list of numbers.",
      outputFormat: "A float rounded to 2 decimals, or None.",
      constraints: ["0 ≤ len(ratings) ≤ 10⁵", "1 ≤ rating ≤ 5"],
      concepts: ["sum", "len", "round", "None", "KPIs"],
      hints: [
        "An empty list is falsy, so if not ratings: return None.",
        "The mean is sum(ratings) / len(ratings).",
        "Wrap the mean in round(..., 2).",
      ],
      scaffold: code`
        def average_rating(ratings):
            if not ratings:
                return None
            return round(..., 2)
      `,
      starter: code`
        def average_rating(ratings):
            """Return the mean rating rounded to 2 decimals, or None if empty."""
            # TODO: implement this function

            raise NotImplementedError("Implement average_rating")
      `,
      solution: code`
        def average_rating(ratings):
            if not ratings:
                return None
            return round(sum(ratings) / len(ratings), 2)
      `,
      tests: [
        test("Three ratings", "average_rating([4, 5, 3])", "4.0"),
        test("No data", "average_rating([])", "None"),
        hidden("average_rating([4.5])", "4.5"),
        hidden("average_rating([5, 4, 4])", "4.33"),
      ],
    },
    {
      id: "log-levels",
      title: "Summarise Log Levels",
      difficulty: "Medium",
      minutes: 18,
      summary: "Parse log lines and count entries per severity.",
      statement:
        "Each log line looks like \"2026-10-08 12:00:01 ERROR Disk full\": a date, a time, a level and a message. Count how many lines have each level. Always include the keys \"ERROR\", \"WARN\" and \"INFO\" (with 0 when absent). Ignore blank lines and lines with any other level.",
      task: "Create count_levels(lines) that returns a dict with ERROR, WARN and INFO counts.",
      examples: [
        { title: "Mixed log", input: 'count_levels(["d t ERROR x", "d t INFO y", "d t ERROR z"])', output: '{"ERROR": 2, "WARN": 0, "INFO": 1}', explanation: "The third token of each line is the level." },
      ],
      inputFormat: "A list of strings.",
      outputFormat: "A dict with exactly the keys ERROR, WARN, INFO.",
      constraints: ["0 ≤ len(lines) ≤ 10⁵"],
      concepts: ["split", "dictionaries", "indexing", "parsing", "guard clauses"],
      hints: [
        "Start with counts = {\"ERROR\": 0, \"WARN\": 0, \"INFO\": 0}.",
        "line.split() gives tokens; the level is tokens[2] — but only if there are at least 3 tokens.",
        "Only increment when the level is already a key in counts.",
      ],
      scaffold: code`
        def count_levels(lines):
            counts = {"ERROR": 0, "WARN": 0, "INFO": 0}
            for line in lines:
                parts = line.split()
                if len(parts) >= 3 and parts[2] in counts:
                    ...
            return counts
      `,
      starter: code`
        def count_levels(lines):
            """Return counts of ERROR, WARN and INFO log lines."""
            # TODO: implement this function

            raise NotImplementedError("Implement count_levels")
      `,
      solution: code`
        def count_levels(lines):
            counts = {"ERROR": 0, "WARN": 0, "INFO": 0}
            for line in lines:
                parts = line.split()
                if len(parts) >= 3 and parts[2] in counts:
                    counts[parts[2]] += 1
            return counts
      `,
      tests: [
        test("Mixed log", 'count_levels(["d t ERROR x", "d t INFO y", "d t ERROR z"])', '{"ERROR": 2, "WARN": 0, "INFO": 1}'),
        test("Empty log", "count_levels([])", '{"ERROR": 0, "WARN": 0, "INFO": 0}'),
        hidden('count_levels(["", "d t DEBUG x", "d t WARN y", "short"])', '{"ERROR": 0, "WARN": 1, "INFO": 0}'),
      ],
    },
    {
      id: "moving-average",
      title: "Moving Average",
      difficulty: "Hard",
      minutes: 25,
      summary: "Smooth a time series with a sliding window.",
      statement:
        "Return the moving averages of values over a window of size window: the mean of values[0:window], then values[1:window+1], and so on. Round each mean to 2 decimals. If window is larger than the number of values, return an empty list. Try to keep a running sum instead of re-summing every window.",
      task: "Create moving_average(values, window) that returns a list of floats.",
      examples: [
        { title: "Window of 3", input: "moving_average([1, 2, 3, 4, 5], 3)", output: "[2.0, 3.0, 4.0]", explanation: "(1+2+3)/3, (2+3+4)/3, (3+4+5)/3" },
      ],
      inputFormat: "values: list of numbers, window: int ≥ 1",
      outputFormat: "A list of len(values) - window + 1 floats (or empty).",
      constraints: ["1 ≤ window ≤ 10⁴", "0 ≤ len(values) ≤ 10⁵"],
      concepts: ["sliding window", "running sum", "range", "algorithms"],
      hints: [
        "There are len(values) - window + 1 windows; if that is ≤ 0 return [].",
        "Start with total = sum(values[:window]). Each step, add the new value and subtract the one that left.",
        "Append round(total / window, 2) for each window position.",
      ],
      scaffold: code`
        def moving_average(values, window):
            if window > len(values):
                return []
            total = sum(values[:window])
            result = [round(total / window, 2)]
            for i in range(window, len(values)):
                total += ... - ...
                result.append(round(total / window, 2))
            return result
      `,
      starter: code`
        def moving_average(values, window):
            """Return rounded moving averages over the given window size."""
            # TODO: implement this function

            raise NotImplementedError("Implement moving_average")
      `,
      solution: code`
        def moving_average(values, window):
            if window > len(values):
                return []
            total = sum(values[:window])
            result = [round(total / window, 2)]
            for i in range(window, len(values)):
                total += values[i] - values[i - window]
                result.append(round(total / window, 2))
            return result
      `,
      tests: [
        test("Window of 3", "moving_average([1, 2, 3, 4, 5], 3)", "[2.0, 3.0, 4.0]"),
        test("Window too large", "moving_average([1, 2], 5)", "[]"),
        hidden("moving_average([10, 20], 1)", "[10.0, 20.0]"),
        hidden("moving_average([1, 2, 4], 2)", "[1.5, 3.0]"),
        hidden("moving_average([1, 1, 2], 3)", "[1.33]"),
      ],
    },
    {
      id: "revenue-summary",
      title: "Capstone: Revenue Summary",
      difficulty: "Hard",
      minutes: 30,
      summary: "Parse, validate and aggregate raw transactions into a report.",
      statement:
        "You receive raw transaction strings from several systems. A valid transaction is text that converts to a non-negative number. Build a summary dictionary with the number of valid transactions, the number rejected, and the total of valid amounts rounded to 2 decimals. Invalid records are counted, never silently dropped.",
      task: "Create summarize(transactions) that returns {\"valid\": int, \"rejected\": int, \"total\": float}.",
      examples: [
        { title: "Mixed batch", input: 'summarize(["10", "bad", "-4", "2.5"])', output: '{"valid": 2, "rejected": 2, "total": 12.5}', explanation: "'bad' is not a number and -4 is negative." },
      ],
      inputFormat: "A list of strings.",
      outputFormat: "A dict with keys valid, rejected, total.",
      constraints: ["0 ≤ len(transactions) ≤ 10⁵"],
      concepts: ["try", "except", "validation", "dictionaries", "aggregation", "round"],
      hints: [
        "Loop over the strings and try float(text); a ValueError means rejected.",
        "A successfully parsed but negative value is also rejected.",
        "Track valid count, rejected count and a running total, then round the total once at the end.",
      ],
      scaffold: code`
        def summarize(transactions):
            valid, rejected, total = 0, 0, 0.0
            for text in transactions:
                try:
                    amount = float(text)
                except ValueError:
                    rejected += 1
                    continue
                # handle negative amounts, then count the valid ones
            return {"valid": valid, "rejected": rejected, "total": round(total, 2)}
      `,
      starter: code`
        def summarize(transactions):
            """Return {"valid": n, "rejected": m, "total": rounded_sum} for raw transactions."""
            # TODO: implement this function

            raise NotImplementedError("Implement summarize")
      `,
      solution: code`
        def summarize(transactions):
            valid, rejected, total = 0, 0, 0.0
            for text in transactions:
                try:
                    amount = float(text)
                except ValueError:
                    rejected += 1
                    continue
                if amount < 0:
                    rejected += 1
                else:
                    valid += 1
                    total += amount
            return {"valid": valid, "rejected": rejected, "total": round(total, 2)}
      `,
      tests: [
        test("Mixed batch", 'summarize(["10", "bad", "-4", "2.5"])', '{"valid": 2, "rejected": 2, "total": 12.5}'),
        test("Empty batch", "summarize([])", '{"valid": 0, "rejected": 0, "total": 0.0}'),
        hidden('summarize(["0", "15"])', '{"valid": 2, "rejected": 0, "total": 15.0}'),
        hidden('summarize(["0.1", "0.2"])', '{"valid": 2, "rejected": 0, "total": 0.3}'),
        hidden('summarize(["", " 7 "])', '{"valid": 1, "rejected": 1, "total": 7.0}'),
      ],
    },
  ],
};
