// Curriculum is intentionally plain data: easy to review, test, and extend.
export const tracks = [
  {
    id: "foundations", title: "Python Foundations", eyebrow: "PATH 01",
    description: "Write reliable Python from the first line to confident control flow.",
    icon: "terminal", tone: "violet",
    lessons: [
      {
        id:"variables", title:"Variables & types", duration:18, level:"Beginner",
        goal:"Read input, store values, and convert data to the right type.",
        concepts:["input() returns text","int() and float() convert numeric text","clear variable naming"],
        explanation:"A variable gives a value a name. Web forms, CSVs, and APIs often deliver text—even when the content looks like a number. Convert deliberately before arithmetic.",
        example:'price = float(input("Price: "))\nquantity = int(input("Quantity: "))\nprint(f"{price * quantity:.2f}")',
        quiz:{question:"What is the type of input() before conversion?",options:["int","str","float","bool"],answer:1,explanation:"input() always returns a string. Convert it explicitly when you need numeric operations."},
        exercise:{title:"Invoice total",brief:"Read a unit price and quantity on separate lines. Print the total with exactly two decimal places.",starter:'price = float(input())\nquantity = int(input())\n# Calculate and print the total\n',hints:["Multiply price by quantity.","Use an f-string with :.2f for two decimal places."],tests:[{input:["12.5","4"],expected:"50.00"},{input:["0.99","3"],expected:"2.97"},{input:["100","1"],expected:"100.00"}]}
      },
      {
        id:"strings",title:"Strings & formatting",duration:20,level:"Beginner",
        goal:"Clean and format real-world text consistently.",
        concepts:["strip removes outside whitespace","title changes word capitalization","f-strings assemble readable messages"],
        explanation:"User-entered names and labels are messy. Normalize them before including them in reports, emails, or interfaces.",
        example:'name = input().strip().title()\nprint(f"Welcome, {name}!")',
        quiz:{question:"Which expression removes spaces from both ends of a string?",options:["text.strip()","text.split()","text.clean()","text.pop()"],answer:0,explanation:"strip() removes leading and trailing whitespace without changing internal spacing."},
        exercise:{title:"Clean a customer name",brief:"Read a name, remove surrounding whitespace, convert it to title case, and print 'Hello, NAME!' with the normalized name.",starter:'name = input()\n# Normalize and greet the customer\n',hints:["Chain .strip().title() on the input.","Use print(f\"Hello, {name}!\")."],tests:[{input:["  aLI jAbbarY  "],expected:"Hello, Ali Jabbary!"},{input:["jane doe"],expected:"Hello, Jane Doe!"},{input:["   sam   "],expected:"Hello, Sam!"}]}
      },
      {
        id:"conditions",title:"Decisions & branching",duration:25,level:"Beginner",
        goal:"Translate business rules into clear if/elif/else logic.",
        concepts:["conditions run top to bottom","first true branch wins","comparison boundaries matter"],
        explanation:"A pricing or eligibility rule is a decision tree. Write branches from specific to general and test the exact boundaries.",
        example:'score = int(input())\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Pass")\nelse:\n    print("Retry")',
        quiz:{question:"With score = 75, which branch executes?",options:["score >= 90","score >= 70","else","all branches"],answer:1,explanation:"The first condition is false, so Python evaluates elif and executes the first true branch."},
        exercise:{title:"Discount eligibility",brief:"Read an order total. Apply a 15% discount for totals >= 200, 5% for totals >= 100, otherwise none. Print the final total with two decimals.",starter:'total = float(input())\n# Apply the correct discount tier\n',hints:["Check >= 200 before >= 100.","Multiply by 0.85 or 0.95 depending on the tier."],tests:[{input:["200"],expected:"170.00"},{input:["100"],expected:"95.00"},{input:["50"],expected:"50.00"},{input:["300"],expected:"255.00"}]}
      },
      {
        id:"loops",title:"Loops & repetition",duration:25,level:"Beginner",
        goal:"Aggregate repeated inputs without copying the same code.",
        concepts:["range(n) repeats n times","accumulators track running totals","for is appropriate for known counts"],
        explanation:"Reports frequently process batches of records. A loop lets one tested transformation work on every record.",
        example:'total = 0\nfor number in [4, 6, 8]:\n    total += number\nprint(total)',
        quiz:{question:"How many iterations does range(4) produce?",options:["3","4","5","infinite"],answer:1,explanation:"range(4) yields 0, 1, 2, 3: four values."},
        exercise:{title:"Daily sales summary",brief:"Read an integer N followed by N sales amounts. Print their sum to two decimal places.",starter:'count = int(input())\ntotal = 0.0\n# Read count prices and update total\n',hints:["Use for _ in range(count).","Read a float in each iteration and add it to total."],tests:[{input:["3","10.5","20","4.25"],expected:"34.75"},{input:["1","7"],expected:"7.00"},{input:["0"],expected:"0.00"}]}
      }
    ]
  },
  {
    id:"engineering",title:"Practical Python",eyebrow:"PATH 02",
    description:"Turn Python fundamentals into reusable, testable tools.",
    icon:"blocks",tone:"teal",
    lessons:[
      {
        id:"functions",title:"Functions & reuse",duration:25,level:"Intermediate",
        goal:"Write a reusable function and separate logic from input/output.",
        concepts:["def creates a function","return sends a value back","small functions are easier to test"],
        explanation:"Functions let a training exercise become a maintainable business tool. Keep the calculation independent from printing whenever possible.",
        example:'def net_price(price, discount):\n    return price * (1 - discount)\n\nprint(f"{net_price(120, 0.10):.2f}")',
        quiz:{question:"Which keyword sends a value to the caller?",options:["print","def","return","yield from"],answer:2,explanation:"return hands a value back. print only writes to the output stream."},
        exercise:{title:"Tax calculator",brief:"Create a function final_price(amount, tax_rate) returning amount after tax. Read two floats, call the function, and print the result to two decimals.",starter:'def final_price(amount, tax_rate):\n    # Return the amount including tax\n    pass\n\namount = float(input())\ntax_rate = float(input())\n',hints:["Tax-inclusive amount equals amount * (1 + tax_rate).","Call your function and format its result to two decimals."],tests:[{input:["100","0.2"],expected:"120.00"},{input:["25.5","0"],expected:"25.50"},{input:["80","0.075"],expected:"86.00"}]}
      },
      {
        id:"collections",title:"Lists & dictionaries",duration:27,level:"Intermediate",
        goal:"Summarize structured data using appropriate Python collections.",
        concepts:["lists preserve ordered sequences","dictionaries map keys to values","get provides a safe default"],
        explanation:"A dictionary is a lightweight lookup table. Combined with a loop, it turns raw text into a simple frequency report.",
        example:'counts = {}\nfor tag in ["AI", "Data", "AI"]:\n    counts[tag] = counts.get(tag, 0) + 1\nprint(counts["AI"])',
        quiz:{question:"What does counts.get('AI', 0) return if AI is absent?",options:["None","0","False","an error"],answer:1,explanation:"The second argument is the default returned when a key does not exist."},
        exercise:{title:"Count support tickets",brief:"Read N followed by N category labels. Count labels case-insensitively and print the count for 'billing'.",starter:'n = int(input())\ncounts = {}\n# Build the category counts\n',hints:["Normalize each category with .strip().lower().","Increase counts[label] using counts.get(label, 0) + 1."],tests:[{input:["4","billing","technical","Billing","billing"],expected:"3"},{input:["2","sales","technical"],expected:"0"},{input:["1","BILLING"],expected:"1"}]}
      },
      {
        id:"errors",title:"Validation & exceptions",duration:23,level:"Intermediate",
        goal:"Handle invalid input without crashing or hiding useful errors.",
        concepts:["try and except handle anticipated problems","ValueError signals failed conversion","validate expected ranges"],
        explanation:"Real tools have messy inputs. A clear error response beats a silent wrong answer, especially in business reporting.",
        example:'try:\n    age = int(input())\n    print("Valid" if age >= 0 else "Invalid")\nexcept ValueError:\n    print("Invalid")',
        quiz:{question:"Which exception does int('hello') raise?",options:["TypeError","KeyError","ValueError","IndexError"],answer:2,explanation:"ValueError is raised when a string is not a valid numeric representation."},
        exercise:{title:"Validate a percentage",brief:"Read one value. If it converts to a number between 0 and 100 inclusive, print 'Accepted'; otherwise print 'Invalid'.",starter:'raw = input()\n# Validate and handle conversion errors\n',hints:["Use try / except ValueError around float(raw).","Check 0 <= number <= 100."],tests:[{input:["100"],expected:"Accepted"},{input:["0"],expected:"Accepted"},{input:["101"],expected:"Invalid"},{input:["abc"],expected:"Invalid"},{input:["-2"],expected:"Invalid"}]}
      },
      {
        id:"comprehensions",title:"Transforming records",duration:27,level:"Intermediate",
        goal:"Filter and transform numeric data concisely and readably.",
        concepts:["list comprehensions transform sequences","conditions filter values","sorting makes reports deterministic"],
        explanation:"Data preparation often means converting a messy sequence into a clean, predictable result.",
        example:'values = [5, -1, 12, 0]\nclean = sorted([x for x in values if x > 0])\nprint(clean)',
        quiz:{question:"What does [x * 2 for x in [1,2,3]] produce?",options:["[1,2,3]","[2,4,6]","[3,6,9]","6"],answer:1,explanation:"Each element is multiplied by two to construct a new list."},
        exercise:{title:"Clean transaction amounts",brief:"Read comma-separated integers. Keep positive values, sort ascending, and print them joined by commas (without spaces).",starter:'raw = input()\n# Parse, filter, sort, and print\n',hints:["Split on commas and convert each part using int().","Use sorted() then ','.join(str(x) for x in values)."],tests:[{input:["4,-2,1,0,7"],expected:"1,4,7"},{input:["0,-1,-5"],expected:""},{input:["8,3,8"],expected:"3,8,8"}]}
      }
    ]
  },
  {
    id:"data",title:"Data & Automation",eyebrow:"PATH 03",
    description:"Solve practical reporting, quality-control, and workflow problems.",
    icon:"chart",tone:"amber",
    lessons:[
      {
        id:"metrics",title:"KPIs & aggregation",duration:30,level:"Intermediate",
        goal:"Compute descriptive statistics used in performance dashboards.",
        concepts:["sum and len compute averages","guard against empty input","consistent decimal formatting"],
        explanation:"Dashboards begin with trusted metrics. Define precisely which records count before you calculate a summary.",
        example:'sales = [10, 20, 30]\naverage = sum(sales) / len(sales) if sales else 0\nprint(f"{average:.2f}")',
        quiz:{question:"What is the mean of [10, 20, 30]?",options:["15","20","30","60"],answer:1,explanation:"The sum 60 divided by the three observations equals 20."},
        exercise:{title:"Average customer satisfaction",brief:"Read N followed by N ratings (floating-point). Print the mean to two decimals, or 'No data' when N is zero.",starter:'n = int(input())\nratings = []\n# Read ratings and calculate the mean\n',hints:["Append float(input()) inside a loop.","Guard against n == 0 before dividing."],tests:[{input:["3","4","5","3"],expected:"4.00"},{input:["1","4.5"],expected:"4.50"},{input:["0"],expected:"No data"}]}
      },
      {
        id:"dataquality",title:"Data quality checks",duration:30,level:"Intermediate",
        goal:"Apply explicit validation rules to records before reporting.",
        concepts:["missing data should be flagged","invalid values need rules","quality checks are measurable"],
        explanation:"A model or dashboard can only be as reliable as its inputs. Make validation rules visible instead of silently changing data.",
        example:'scores = [50, -3, 91]\ninvalid = [s for s in scores if not 0 <= s <= 100]\nprint(len(invalid))',
        quiz:{question:"A missing value appears in a dataset. What is safest?",options:["Assume zero","Drop it silently","Apply a declared handling rule","Invent a likely value"],answer:2,explanation:"A declared policy maintains traceability and avoids hidden assumptions."},
        exercise:{title:"Flag invalid sensor readings",brief:"Read N followed by N temperature readings. Count readings outside the inclusive range -40 to 125. Print the invalid count.",starter:'n = int(input())\ninvalid = 0\n# Check each sensor measurement\n',hints:["Compare each float against both allowed boundaries.","Increase invalid only when a value is outside the inclusive interval."],tests:[{input:["4","20","-41","125","130"],expected:"2"},{input:["2","-40","125"],expected:"0"},{input:["1","900"],expected:"1"}]}
      },
      {
        id:"automation",title:"Automation decisions",duration:30,level:"Intermediate",
        goal:"Encode a repeatable triage rule without hiding decisions.",
        concepts:["rules should be explainable","branch precedence matters","every input needs a defined outcome"],
        explanation:"An automation system needs predictable actions. Build an explicit mapping from inputs to outcomes, including fallback behavior.",
        example:'severity = input().strip().lower()\nif severity == "critical":\n    print("Escalate")\nelse:\n    print("Queue")',
        quiz:{question:"What makes a rule-based automation auditable?",options:["Secret thresholds","Random decisions","Documented inputs and outputs","More lines of code"],answer:2,explanation:"Clear rules, traceable inputs, and testable outputs make decisions reviewable."},
        exercise:{title:"Support queue triage",brief:"Read an urgency label and an integer customer age in days. Print 'Escalate' if urgency is critical OR the ticket is at least 7 days old; otherwise print 'Queue'.",starter:'urgency = input().strip().lower()\nage_days = int(input())\n# Make and print a triage decision\n',hints:["Use the boolean operator or.","Check urgency == 'critical' or age_days >= 7."],tests:[{input:["critical","0"],expected:"Escalate"},{input:["normal","7"],expected:"Escalate"},{input:["low","2"],expected:"Queue"}]}
      },
      {
        id:"capstone",title:"Capstone: weekly report",duration:45,level:"Applied",
        goal:"Combine parsing, validation, aggregation, and formatting into a small report.",
        concepts:["normalize source data","skip invalid records transparently","emit consistent reports"],
        explanation:"Your final challenge is an end-to-end business task. Convert raw entries into a trustworthy summary rather than just making the code run once.",
        example:'raw = ["12", "bad", "8"]\nvalid = []\nfor item in raw:\n    try:\n        valid.append(float(item))\n    except ValueError:\n        pass\nprint(len(valid))',
        quiz:{question:"What should a trustworthy report do with invalid data?",options:["Hide it","Invent replacements","Declare its handling and report exclusions","Crash intentionally"],answer:2,explanation:"Transparent handling and exclusion counts make the report reviewable."},
        exercise:{title:"Build a validated revenue summary",brief:"Read N followed by N transaction strings. A valid transaction is a non-negative number. Print 'Valid: X', 'Rejected: Y', and 'Total: Z.ZZ' on three lines.",starter:'n = int(input())\nvalid = []\nrejected = 0\n# Parse, validate, and summarize the transactions\n',hints:["Catch ValueError for non-numeric text, and reject negative values.","Print three lines exactly as specified; total uses :.2f."],tests:[{input:["4","10","bad","-4","2.5"],expected:"Valid: 2\nRejected: 2\nTotal: 12.50"},{input:["2","0","15"],expected:"Valid: 2\nRejected: 0\nTotal: 15.00"},{input:["0"],expected:"Valid: 0\nRejected: 0\nTotal: 0.00"}]}
      }
    ]
  }
];

export const lessons = tracks.flatMap(track => track.lessons.map(lesson => ({ ...lesson, trackId: track.id, trackTitle: track.title })));
export const lessonById = Object.fromEntries(lessons.map(lesson => [lesson.id, lesson]));
export const totalExercises = lessons.length;
export const totalMinutes = lessons.reduce((minutes, lesson) => minutes + lesson.duration, 0);
