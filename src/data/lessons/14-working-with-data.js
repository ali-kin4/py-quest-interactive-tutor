import { code } from "../helpers.js";

export default {
  id: "working-with-data",
  unit: "applied",
  title: "Working with Real Data",
  minutes: 35,
  summary: "Bring everything together: parse raw records, reject bad ones transparently, and turn the rest into a trustworthy report.",
  objectives: [
    "Parse structured text lines with split() and skip blank or malformed lines",
    "Normalise fields so the same value is always written the same way",
    "Aggregate records into a dictionary with fixed keys",
    "Count valid and rejected records instead of silently dropping data",
    "Compute KPIs and return them as a report dictionary",
    "Break a larger problem into small, testable functions",
  ],
  sections: [
    {
      heading: "From raw lines to fields",
      body: [
        "Real data often arrives as lines of text: exports, logs, CSV files. Each line holds several **fields** separated by a delimiter such as a comma or spaces. `split()` turns a line into a list of fields you can index.",
        "`line.split(\",\")` splits on commas exactly; `line.split()` with no argument splits on any run of whitespace and ignores leading and trailing spaces.",
      ],
      example: {
        code: code`
          line = "2026-10-01,North,120.50"
          date, region, amount = line.split(",")
          print(date)
          print(region)
          print(float(amount) * 2)

          print("  09:15   sensor-7    21.4 ".split())
        `,
        output: "2026-10-01\nNorth\n241.0\n['09:15', 'sensor-7', '21.4']",
      },
    },
    {
      heading: "Guard against short and blank lines",
      body: [
        "Never assume every line is well formed. A blank line or a truncated record would make `parts[2]` raise `IndexError`. Check the number of fields **before** you index, and skip or reject lines that do not fit.",
      ],
      example: {
        code: code`
          lines = ["09:15 sensor-7 21.4", "", "09:20 sensor-7", "09:25 sensor-9 19.8"]
          for line in lines:
              parts = line.split()
              if len(parts) < 3:
                  print("skipped:", repr(line))
                  continue
              print(parts[1], "reads", parts[2])
        `,
        output: "sensor-7 reads 21.4\nskipped: ''\nskipped: '09:20 sensor-7'\nsensor-9 reads 19.8",
      },
    },
    {
      heading: "Normalise before you compare",
      body: [
        "Different systems write the same thing differently: `North`, ` north`, `NORTH`. If you count them as they are, one region becomes three. **Normalise** every field — strip spaces, choose one case — before comparing or using it as a dictionary key.",
      ],
      example: {
        code: code`
          raw_regions = ["North", " north", "NORTH ", "South"]
          clean = [r.strip().lower() for r in raw_regions]
          print(clean)
          print(len(set(raw_regions)), "raw spellings ->", len(set(clean)), "regions")
        `,
        output: "['north', 'north', 'north', 'south']\n4 raw spellings -> 2 regions",
      },
    },
    {
      heading: "Aggregate into fixed keys",
      body: [
        "Reports should have the same shape every time, even when some category has no data. Start with a dictionary whose keys are **initialised to 0**, then only increase values for keys that already exist. Unknown categories can be counted separately so nothing disappears.",
      ],
      example: {
        code: code`
          totals = {"north": 0, "south": 0, "east": 0}
          other = 0
          rows = [("north", 120), ("south", 80), ("north", 30), ("west", 50)]
          for region, amount in rows:
              if region in totals:
                  totals[region] += amount
              else:
                  other += amount
          print(totals)
          print("unknown regions:", other)
        `,
        output: "{'north': 150, 'south': 80, 'east': 0}\nunknown regions: 50",
      },
      callout: { kind: "note", text: "east still appears with 0. A dashboard can show 'no sales in the east' instead of wondering whether the region exists." },
    },
    {
      heading: "Valid versus rejected records",
      body: [
        "A trustworthy pipeline **never silently drops data**. Every record is either used or counted as rejected, ideally with a reason. That way, `valid + rejected` always equals the number of records you received, and anyone reading the report can see how clean the input was.",
      ],
      example: {
        code: code`
          readings = ["21.4", "n/a", "19.8", "-300", "22.1"]
          valid = []
          rejected = []
          for text in readings:
              try:
                  value = float(text)
              except ValueError:
                  rejected.append((text, "not a number"))
                  continue
              if value < -90:
                  rejected.append((text, "below physical limit"))
              else:
                  valid.append(value)
          print("valid:", valid)
          print("rejected:", rejected)
          print(len(valid) + len(rejected) == len(readings))
        `,
        output: "valid: [21.4, 19.8, 22.1]\nrejected: [('n/a', 'not a number'), ('-300', 'below physical limit')]\nTrue",
      },
    },
    {
      heading: "KPIs and rounding once",
      body: [
        "Key performance indicators (**KPIs**) are the few numbers people act on: counts, totals, averages, rates. Keep full precision while you calculate and **round once, at the end**. Rounding every intermediate value lets small errors pile up.",
        "Return the results as a dictionary — a *report* — so callers can read each KPI by name.",
      ],
      example: {
        code: code`
          def kpis(values):
              count = len(values)
              total = sum(values)
              average = total / count if count else None
              return {
                  "count": count,
                  "total": round(total, 2),
                  "average": round(average, 2) if average is not None else None,
              }

          print(kpis([21.4, 19.8, 22.1]))
          print(kpis([]))
        `,
        output: "{'count': 3, 'total': 63.3, 'average': 21.1}\n{'count': 0, 'total': 0, 'average': None}",
      },
    },
    {
      heading: "Tackling a bigger problem",
      body: [
        "Larger tasks feel hard because everything happens at once. Split them up:",
        {
          list: [
            "**Plan** — write down the input, the output and the rules for bad data before coding.",
            "**Small functions** — one to parse a single record, one to summarise many. Each is easy to test on its own.",
            "**Test edge cases** — no records, all invalid, a single record, values exactly on a boundary.",
          ],
        },
        "Here the parsing of one sales row is its own function that returns `None` for bad rows; the summary function only has to count and add.",
      ],
      example: {
        code: code`
          def parse_sale(line):
              parts = line.split(",")
              if len(parts) != 3:
                  return None
              region = parts[1].strip().lower()
              try:
                  amount = float(parts[2])
              except ValueError:
                  return None
              return (region, amount) if amount >= 0 else None

          def summarise(lines):
              report = {"rows": 0, "rejected": 0, "revenue": 0.0}
              for line in lines:
                  sale = parse_sale(line)
                  if sale is None:
                      report["rejected"] += 1
                  else:
                      report["rows"] += 1
                      report["revenue"] += sale[1]
              report["revenue"] = round(report["revenue"], 2)
              return report

          data = ["d1,North,120.50", "d1,South,oops", "", "d2, north ,79.5", "d2,East,-5"]
          print(summarise(data))
          print(summarise([]))
        `,
        output: "{'rows': 2, 'rejected': 3, 'revenue': 200.0}\n{'rows': 0, 'rejected': 0, 'revenue': 0.0}",
      },
      callout: { kind: "tip", text: "Run your function on an empty list first. If it crashes or returns something odd there, it will surprise you in production too." },
    },
  ],
  keyPoints: [
    "split() turns a line into fields; check the field count before indexing.",
    "Normalise text fields (strip, lower) before comparing or counting them.",
    "Initialise report keys to 0 so the output always has the same shape.",
    "Every record is either valid or counted as rejected — never silently dropped.",
    "Keep full precision while calculating and round once at the end.",
    "Split big tasks into small functions and test the edge cases first.",
  ],
  mistakes: [
    { mistake: "Indexing parts[2] without checking len(parts)", fix: "Guard first: if len(parts) < 3: reject or skip the line." },
    { mistake: "Counting 'North' and 'north' as different regions", fix: "Normalise with .strip().lower() before using a value as a key." },
    { mistake: "Skipping bad rows without counting them", fix: "Keep a rejected count so valid + rejected equals the input size." },
    { mistake: "Rounding each value before adding them up", fix: "Add with full precision, then round the final total." },
  ],
  quiz: [
    {
      question: "What does \"a,b,,c\".split(\",\") return?",
      options: ["['a', 'b', 'c']", "['a', 'b', '', 'c']", "['a,b,,c']", "['a', 'b', ',', 'c']"],
      answer: 1,
      explanation: "Splitting on an exact separator keeps empty fields, so the two adjacent commas produce an empty string.",
    },
    {
      question: "A report starts as {\"error\": 0, \"warn\": 0} and only increases existing keys. What does it contain after processing no lines?",
      options: ["{}", "None", "{\"error\": 0, \"warn\": 0}", "An error is raised"],
      answer: 2,
      explanation: "The keys were initialised up front, so the report keeps its full shape even when there is no data.",
    },
    {
      question: "You receive 10 records: 7 are valid. What should the report say about the other 3?",
      options: ["Nothing — only valid data matters", "Count them as rejected", "Replace them with 0", "Copy the previous valid value"],
      answer: 1,
      explanation: "Reporting rejected records keeps the pipeline transparent: 7 valid + 3 rejected accounts for all 10 inputs.",
    },
    {
      question: "When should you round a currency total?",
      options: ["Once, after all the additions", "Every value before adding", "Never", "Only when the total is negative"],
      answer: 0,
      explanation: "Rounding intermediate values can accumulate errors; calculating in full precision and rounding once gives the most accurate result.",
    },
  ],
  practice: ["log-levels", "revenue-summary"],
};
