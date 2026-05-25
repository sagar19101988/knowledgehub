export interface InterviewQA {
  id: string;
  level: 'junior' | 'mid' | 'senior';
  question: string;
  answer: string;        // markdown — rendered with react-markdown + remark-gfm
  analogy?: string;      // plain-English real-world analogy — the app's USP
  topic?: string;
  code?: string;         // optional schema / scenario shown WITH the question
  codeLanguage?: string;
}

export const INTERVIEW_BANK: Record<string, InterviewQA[]> = {

  sql: [

    // ── Junior (0–2 yrs) ──────────────────────────────────────
    {
      id: 'sql-jr-1',
      level: 'junior',
      topic: 'DDL vs DML',
      question: 'What is the difference between DELETE, TRUNCATE, and DROP?',
      answer: `All three remove data, but they work very differently:

**DELETE** — removes rows one at a time.
- You can add a \`WHERE\` to delete only certain rows.
- It's saved in the log, so you can undo it (roll it back).
- It runs any \`DELETE\` triggers.
- Slowest option on a big table.

**TRUNCATE** — empties the whole table in one go.
- No \`WHERE\` — it clears everything or nothing.
- Much faster than DELETE because it doesn't record every row.
- Resets the auto-increment counter back to the start.
- Keeps the empty table, its columns, and its indexes.

**DROP** — deletes the entire table.
- Removes the data **and** the table itself — columns, indexes, everything.
- After a DROP, the table is gone.

**Quick rule:** DELETE for *some* rows, TRUNCATE to empty a table you want to keep, DROP to throw the table away.

**Example:**
\`\`\`sql
DELETE FROM Orders WHERE status = 'cancelled';  -- removes only cancelled rows
TRUNCATE TABLE Orders;                           -- empties the table, keeps it
DROP TABLE Orders;                               -- the table itself is gone
\`\`\`
After the DELETE, the other rows remain. After TRUNCATE, the table is empty but still exists. After DROP, querying \`Orders\` is an error — there's no table.`,
      analogy: `Think of a whiteboard. **DELETE** is rubbing out words one at a time — slow, but you can stop and undo. **TRUNCATE** is one big swipe that clears the whole board in a second. **DROP** is throwing the whole whiteboard in the bin — board, frame, and all.`,
    },
    {
      id: 'sql-jr-2',
      level: 'junior',
      topic: 'Query Writing',
      question: 'Write a query to find the second-highest salary from an Employee table. What should it return if there is no second salary?',
      code: `-- Employee
-- +----+--------+
-- | id | salary |
-- +----+--------+
-- |  1 |    100 |
-- |  2 |    200 |
-- |  3 |    300 |
-- +----+--------+`,
      codeLanguage: 'sql',
      answer: `The simplest way: find the biggest salary that is *smaller* than the top salary.

\`\`\`sql
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
\`\`\`

Why use \`MAX()\`? If there is no second salary, it returns **NULL** (empty) instead of no rows at all — and that's usually what the interviewer wants to see.

**Another way — sort and skip the top one** (MySQL / Postgres):

\`\`\`sql
SELECT DISTINCT salary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
\`\`\`

\`OFFSET 1\` skips the highest, \`LIMIT 1\` grabs the next. The catch: this returns nothing (not NULL) when there's no second salary.

**For the Nth highest**, use \`DENSE_RANK()\` so people on the same salary share a spot:

\`\`\`sql
SELECT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee
) t
WHERE rnk = 2;
\`\`\``,
      analogy: `Picture a race podium. The gold medal goes to the \`MAX\`. To find silver, you just ask "who's fastest if we ignore the gold winner?" — and that's exactly what \`WHERE salary < (SELECT MAX...)\` does: hide the winner, grab the next-best.`,
    },
    {
      id: 'sql-jr-3',
      level: 'junior',
      topic: 'Aggregation',
      question: 'Write a query to find all duplicate email addresses in a Person table.',
      code: `-- Person
-- +----+---------+
-- | id | email   |
-- +----+---------+
-- |  1 | a@x.com |
-- |  2 | b@x.com |
-- |  3 | a@x.com |
-- +----+---------+`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — GROUP BY + HAVING (the standard, easiest).** Group by email and keep the groups that appear more than once:

\`\`\`sql
SELECT email, COUNT(*) AS occurrences
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`

The duplicate check goes in \`HAVING\`, not \`WHERE\` — \`WHERE\` filters rows *before* grouping, but we can only count *after* grouping.

**Approach 2 — window function (when you want the actual duplicate rows, not just the email).** Tag every row with how many share its email, then keep the tagged ones:

\`\`\`sql
SELECT * FROM (
  SELECT *, COUNT(*) OVER (PARTITION BY email) AS cnt
  FROM Person
) t
WHERE cnt > 1;
\`\`\`

Use Approach 1 to list the duplicated values; use Approach 2 when you need the full rows back (e.g. to review or delete them).`,
      analogy: `It's like checking a party guest list for gate-crashers. You sort everyone into piles by name (\`GROUP BY\`), then point at any pile with more than one person in it (\`HAVING COUNT(*) > 1\`). The single-person piles are fine — the stacks are your duplicates.`,
    },
    {
      id: 'sql-jr-4',
      level: 'junior',
      topic: 'Set Operators',
      question: 'What is the difference between UNION and UNION ALL? Which is faster and why?',
      answer: `Both put the results of two queries together into one list (both queries need the same columns).

**UNION**
- Removes duplicate rows from the final result.
- To spot the duplicates, it has to sort through everything first — and that takes extra time.

**UNION ALL**
- Keeps *every* row, including duplicates.
- No duplicate-checking, so it's **faster** and uses less memory.

**Which to use:** pick \`UNION ALL\` when you know there are no duplicates, or when duplicates are fine — it skips the slow sorting step. Use \`UNION\` only when you actually need to remove duplicates.

Common mistake: people reach for \`UNION\` out of habit and pay for slow duplicate-removal they never needed.

**Example:** two queries that each return \`'Asha'\`:
\`\`\`sql
SELECT name FROM team_a     -- Asha, Ben
UNION ALL
SELECT name FROM team_b;    -- Asha, Carol

-- UNION ALL result: Asha, Ben, Asha, Carol   (Asha appears twice)
-- UNION result:     Asha, Ben, Carol         (Asha appears once)
\`\`\``,
      analogy: `Imagine merging two wedding guest lists. **UNION ALL** just staples the two lists together and hands them over — fast, but Aunt Sue, who's on both, now shows up twice. **UNION** is the careful planner who reads every name and crosses out the repeats — tidier, but reading all those names takes longer.`,
    },
    {
      id: 'sql-jr-5',
      level: 'junior',
      topic: 'Joins',
      question: 'Write a query to list every department along with its employee count — including departments that have zero employees.',
      code: `-- Department(id, name)
-- Employee(id, name, department_id)  -- department_id may be NULL`,
      codeLanguage: 'sql',
      answer: `Use a **LEFT JOIN** starting from Department, so departments with no employees still show up:

\`\`\`sql
SELECT d.name AS department,
       COUNT(e.id) AS employee_count
FROM Department d
LEFT JOIN Employee e ON e.department_id = d.id
GROUP BY d.id, d.name;
\`\`\`

**The detail that matters:** count \`COUNT(e.id)\`, **not** \`COUNT(*)\`.

- \`COUNT(*)\` counts rows. An empty department still makes one row (filled with NULLs from the LEFT JOIN), so it would wrongly show **1**.
- \`COUNT(e.id)\` only counts real employees (non-NULL), so an empty department correctly shows **0**.

This little difference is one of the most common SQL interview traps.`,
      analogy: `Picture taking the register in every classroom, including the empty ones. If you count *chairs* (\`COUNT(*)\`), an empty room still has a chair sitting there, so you'd report "1 student" — wrong. Count *actual students* (\`COUNT(e.id)\`) and the empty room honestly reads zero.`,
    },

    {
      id: 'sql-jr-6',
      level: 'junior',
      topic: 'Keys',
      question: 'What is the difference between a PRIMARY KEY, a UNIQUE key, and a FOREIGN KEY?',
      answer: `**Primary key** — the main ID for a row.
- Can't be NULL, can't repeat.
- Only one per table.

**Unique key** — also stops duplicate values, but:
- Can usually hold one NULL.
- You can have several on a table.

**Foreign key** — links one table to another.
- It points to a primary key in another table.
- It blocks bad links — you can't add an order for a customer who doesn't exist.

In short: primary key = the row's main ID, unique key = "no duplicates allowed here too", foreign key = "this connects to that table".

**Example:**
\`\`\`sql
CREATE TABLE Customers (
  id    INT PRIMARY KEY,        -- main ID, never blank or repeated
  email VARCHAR(255) UNIQUE     -- also no duplicates, but not the main ID
);
CREATE TABLE Orders (
  id          INT PRIMARY KEY,
  customer_id INT REFERENCES Customers(id)  -- foreign key: must be a real customer
);
\`\`\`
Adding an order whose \`customer_id\` isn't in \`Customers\` is rejected.`,
      analogy: `Think of ID documents. Your **primary key** is your passport number — one official ID, never blank, never shared. A **unique key** is like your email address — also one-of-a-kind, but you might have a couple. A **foreign key** is the address on a parcel — it has to point to a real house that actually exists.`,
    },
    {
      id: 'sql-jr-7',
      level: 'junior',
      topic: 'Joins',
      question: 'What are the main types of JOINs in SQL?',
      answer: `- **INNER JOIN** — only rows that match in both tables.
- **LEFT JOIN** — all rows from the left table, plus matches from the right (NULLs where there's no match).
- **RIGHT JOIN** — all rows from the right table, plus matches from the left.
- **FULL OUTER JOIN** — all rows from both tables, with NULLs where there's no match on either side.
- **CROSS JOIN** — every row of one table paired with every row of the other (all combinations).
- **SELF JOIN** — a table joined to itself.

In real work, INNER and LEFT cover the vast majority of cases.

**Example:** two tiny tables —
- Customers: \`(1, Asha)\`, \`(2, Ben)\`
- Orders: \`(o1 → customer 1)\`, \`(o2 → customer 99, no matching customer)\`

Running \`SELECT c.name, o.id FROM Customers c «JOIN» Orders o ON o.customer_id = c.id\` gives:
- **INNER** → \`Asha, o1\`  (only the match — Ben and o2 are both dropped)
- **LEFT** → \`Asha, o1\` · \`Ben, NULL\`  (all customers; o2 dropped)
- **RIGHT** → \`Asha, o1\` · \`NULL, o2\`  (all orders; Ben dropped)
- **FULL OUTER** → \`Asha, o1\` · \`Ben, NULL\` · \`NULL, o2\`  (everything from both sides)
- **CROSS** → 4 rows: every customer paired with every order, no \`ON\` needed

(**SELF JOIN** is the odd one out — a table joined to itself; see the "employees who earn more than their manager" question for that one.)`,
      analogy: `Imagine two groups at a party — the people, and the cars they came in. **INNER** = only people who have a car (and cars with an owner). **LEFT** = everyone, with their car if they have one. **CROSS** = pair up every person with every car, just to list all combinations.`,
    },
    {
      id: 'sql-jr-8',
      level: 'junior',
      topic: 'Filtering',
      question: 'What is the difference between WHERE and HAVING?',
      code: `-- Departments with more than 5 active employees
SELECT department_id, COUNT(*) AS headcount
FROM Employee
WHERE active = 1          -- filter rows first
GROUP BY department_id
HAVING COUNT(*) > 5;      -- filter the groups after`,
      codeLanguage: 'sql',
      answer: `**WHERE** filters individual rows *before* they're grouped.
**HAVING** filters whole *groups* after a \`GROUP BY\` has run.

The simple test: if your filter uses an aggregate like \`COUNT()\`, \`SUM()\`, or \`AVG()\`, it must go in \`HAVING\`, because those values only exist after grouping. Everything else goes in \`WHERE\` — which is also faster, since it cuts rows earlier.`,
      analogy: `Picture sorting job applicants. **WHERE** is the first filter on each individual CV ("must have a driving licence"). **HAVING** is a filter on whole *piles* after you've sorted them ("only keep cities that sent more than 5 applicants"). You can't count a pile until you've made the piles.`,
    },
    {
      id: 'sql-jr-9',
      level: 'junior',
      topic: 'Schema Design',
      question: 'What is database normalization? Briefly explain 1NF, 2NF, and 3NF.',
      answer: `Normalization means organising your tables to avoid repeating data and to keep it consistent.

- **1NF** — each cell holds a single value (no lists crammed into one column), and each row is unique.
- **2NF** — it's in 1NF, and every column depends on the *whole* primary key (this matters when the key is made of more than one column).
- **3NF** — it's in 2NF, and no column depends on another non-key column (no "fact about a fact").

The goal: store each piece of information once, in one place. If it changes, you update it in only one spot.

**Example:** taking one messy table through each step. Start with everything jammed together — several products in one cell, customer details repeated:

| order_id | products | customer | city |
|---|---|---|---|
| 1 | Pen, Book | Asha | Pune |

- **1NF** — one value per cell: split "Pen, Book" into two separate rows.
- **2NF** — pull out facts that depend on only *part* of a key (a product's price belongs in a \`Products\` table, not on every order line).
- **3NF** — pull out facts that depend on another non-key column (\`city\` depends on the customer, so it lives in \`Customers\`, not on every order).

End state: \`Customers(id, name, city)\`, \`Products(id, name, price)\`, \`Orders(id, customer_id)\` — each fact stored exactly once, so a city change is one update.`,
      analogy: `It's like tidying a kitchen. Instead of writing "salt" on twenty different recipe cards, you keep one labelled jar of salt and the recipes just point to it. If you rename it, you change one label — not twenty cards.`,
    },
    {
      id: 'sql-jr-10',
      level: 'junior',
      topic: 'Basics',
      question: 'What does the DISTINCT keyword do?',
      answer: `\`DISTINCT\` removes duplicate rows from your results, so you see each unique value only once.

\`\`\`sql
SELECT DISTINCT country FROM Customers;
\`\`\`

This returns each country once, even if hundreds of customers share it.

One thing to remember: \`DISTINCT\` looks at *all* the columns you select. \`SELECT DISTINCT city, country\` returns unique *combinations* of city and country — not unique cities on their own.`,
      analogy: `It's like building a guest list from a stack of RSVPs where some people replied twice. \`DISTINCT\` keeps one entry per person and quietly drops the repeats.`,
    },
    {
      id: 'sql-jr-11',
      level: 'junior',
      topic: 'Data Types',
      question: 'What is the difference between CHAR and VARCHAR?',
      answer: `Both store text, but:
- **CHAR(n)** — fixed length. It always uses \`n\` characters of space, padding shorter values with blanks. Good when values are always the same size (like a 2-letter country code).
- **VARCHAR(n)** — variable length. It only uses as much space as the text needs, up to a max of \`n\`. Good for things like names or emails that vary in length.

Use CHAR for fixed-size codes, VARCHAR for almost everything else.

**Example:**
\`\`\`sql
CREATE TABLE addresses (
  country_code CHAR(2),     -- always 2 chars: 'US', 'IN'
  city         VARCHAR(50)  -- only as long as needed: 'Pune', 'San Francisco'
);
\`\`\`
Store \`'US'\` and it fills the \`CHAR(2)\` exactly. Store \`'Pune'\` and the \`VARCHAR(50)\` uses just 4 characters, not the full 50.`,
      analogy: `CHAR is like a row of identical lockers — every item gets the same big box, whether it's a coat or a single key. VARCHAR is like a vacuum-seal bag that shrinks to fit whatever you put in.`,
    },
    {
      id: 'sql-jr-12',
      level: 'junior',
      topic: 'NULL Handling',
      question: 'How do you test for and filter NULL values in SQL?',
      answer: `NULL means "unknown" or "missing" — not 0, and not an empty string. The catch: you **cannot** test it with \`=\`, because "unknown = unknown" is itself unknown, never true. So \`WHERE phone = NULL\` returns nothing at all.

Use the special \`IS NULL\` / \`IS NOT NULL\` operators instead:

\`\`\`sql
-- Customers with no phone on file:
SELECT name FROM Customers WHERE phone IS NULL;

-- Customers who DO have a phone:
SELECT name FROM Customers WHERE phone IS NOT NULL;
\`\`\`

(To *replace* a NULL with a fallback value — that's \`COALESCE\` / \`NULLIF\` — see the next question.)`,
      analogy: `NULL is a blank box on a form where someone wrote nothing. You can't ask "does their answer equal blank?" — blank isn't a value. You can only ask "did they leave it empty?" — and that question is exactly what \`IS NULL\` is for.`,
    },
    {
      id: 'sql-jr-13',
      level: 'junior',
      topic: 'Query Execution',
      question: 'In what order does SQL actually run the parts of a SELECT query?',
      answer: `You *write* \`SELECT\` first, but the database *runs* it in this order:

1. **FROM / JOIN** — get the tables and join them.
2. **WHERE** — filter individual rows.
3. **GROUP BY** — bundle rows into groups.
4. **HAVING** — filter those groups.
5. **SELECT** — pick and calculate the columns.
6. **ORDER BY** — sort the result.
7. **LIMIT / OFFSET** — keep just the slice you want.

This explains a common gotcha: you can't use a column alias from \`SELECT\` in your \`WHERE\`, because \`WHERE\` runs *before* \`SELECT\`.

**Example:** this fails, because \`annual\` doesn't exist when \`WHERE\` runs:
\`\`\`sql
SELECT salary * 12 AS annual
FROM Employee
WHERE annual > 100000;       -- ERROR: 'annual' not recognised here
\`\`\`
The fix: repeat the expression (\`WHERE salary * 12 > 100000\`) or wrap it in a subquery.`,
      analogy: `It's like cooking, not reading a menu top to bottom. You don't plate the dish (\`SELECT\`) first — you gather ingredients (\`FROM\`), throw out the bad ones (\`WHERE\`), split them into portions (\`GROUP BY\`), and only then plate and garnish (\`SELECT\`, \`ORDER BY\`).`,
    },
    {
      id: 'sql-jr-14',
      level: 'junior',
      topic: 'Pattern Matching',
      question: 'How does the LIKE operator work, and what do % and _ mean?',
      answer: `\`LIKE\` searches text for a pattern.
- \`%\` matches any number of characters (including none).
- \`_\` matches exactly one character.

\`\`\`sql
SELECT * FROM Customers WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM Customers WHERE name LIKE '%son'; -- ends with 'son'
SELECT * FROM Customers WHERE code LIKE 'A_C';  -- A, any one char, then C
\`\`\`

Heads up: a pattern that *starts* with \`%\` (like \`'%son'\`) can't use an index, so it's slow on big tables.`,
      analogy: `\`%\` is a "fill in anything" blank — like "A______" on a crossword where the rest can be any letters. \`_\` is a single "exactly one letter goes here" square.`,
    },
    {
      id: 'sql-jr-15',
      level: 'junior',
      topic: 'Aggregation',
      question: 'What are aggregate functions? Name the common ones.',
      answer: `Aggregate functions take many rows and return a single summary value. The common five:
- \`COUNT()\` — how many rows.
- \`SUM()\` — total.
- \`AVG()\` — average.
- \`MIN()\` — smallest.
- \`MAX()\` — largest.

**Example:** all five at once, on an \`Orders\` table with amounts \`100, 250, 250, NULL\`:

\`\`\`sql
SELECT COUNT(*)    AS num_orders,  -- 4    (counts every row)
       SUM(amount) AS total,       -- 600
       AVG(amount) AS average,     -- 200  (the NULL is ignored)
       MIN(amount) AS smallest,    -- 100
       MAX(amount) AS largest      -- 250
FROM Orders;
\`\`\`

They're often paired with \`GROUP BY\` to get a value *per group* — e.g. the average salary per department:

\`\`\`sql
SELECT department_id, AVG(salary) AS avg_salary
FROM Employee
GROUP BY department_id;
\`\`\`

One gotcha: \`COUNT(column)\` ignores NULLs, while \`COUNT(*)\` counts every row.`,
      analogy: `Aggregates are the summary line at the bottom of a receipt. The individual items are the rows; \`SUM\` is the total, \`COUNT\` is "number of items", \`AVG\` is the average price. One number that sums up many.`,
    },
    {
      id: 'sql-jr-16',
      level: 'junior',
      topic: 'Date Filtering',
      question: 'Write a query to find all employees hired in the last 30 days.',
      code: `-- Employee(id, name, hire_date)`,
      codeLanguage: 'sql',
      answer: `\`\`\`sql
SELECT id, name, hire_date
FROM Employee
WHERE hire_date >= CURRENT_DATE - INTERVAL '30 days';
\`\`\`

(In SQL Server: \`WHERE hire_date >= DATEADD(DAY, -30, GETDATE())\`.)

**A tip interviewers like:** keep the calculation on the *fixed* side (today's date), not on the column. Writing \`WHERE DATEDIFF(day, hire_date, GETDATE()) <= 30\` wraps \`hire_date\` in a function and stops the database using an index on it.`,
      analogy: `It's like finding everyone whose birthday falls in the next two weeks. You don't recalculate each person's age from scratch — you just set a cutoff date and grab everyone past it.`,
    },
    {
      id: 'sql-jr-17',
      level: 'junior',
      topic: 'Sorting',
      question: 'How does ORDER BY work, including sorting by multiple columns?',
      answer: `\`ORDER BY\` sorts your results.
- \`ASC\` = ascending (the default), \`DESC\` = descending.
- List several columns to sort by the first, then break ties with the next.

\`\`\`sql
SELECT name, department_id, salary
FROM Employee
ORDER BY department_id ASC, salary DESC;
\`\`\`

This sorts by department first, and *within* each department, highest salary first.`,
      analogy: `It's how a contacts list works — sorted by last name, and when two people share a last name, it falls back to first name to break the tie.`,
    },
    {
      id: 'sql-jr-18',
      level: 'junior',
      topic: 'Subqueries',
      question: 'What is a subquery? Give a simple example.',
      answer: `A subquery is a query inside another query. The inner one runs first, and the outer one uses its result.

\`\`\`sql
SELECT name, salary
FROM Employee
WHERE salary > (SELECT AVG(salary) FROM Employee);
\`\`\`

Here the inner query works out the average salary, and the outer query lists everyone earning more than that.

Subqueries can appear in \`WHERE\`, in \`SELECT\`, or in \`FROM\` (where they act like a temporary table).`,
      analogy: `It's like asking a question that depends on another answer: "who's taller than the *average* person in the room?" You first work out the average, then compare everyone to it. The subquery is that first, smaller question.`,
    },
    {
      id: 'sql-jr-19',
      level: 'junior',
      topic: 'Operators',
      question: 'What is the difference between the IN and BETWEEN operators?',
      answer: `Both filter in a \`WHERE\` clause, but:
- **IN** checks if a value matches *any* item in a list: \`WHERE status IN ('new', 'paid', 'shipped')\`.
- **BETWEEN** checks if a value falls in a *range*, and it includes both ends: \`WHERE age BETWEEN 18 AND 30\` (18 and 30 are included).

Use \`IN\` for a set of specific values, \`BETWEEN\` for a continuous range.`,
      analogy: `\`IN\` is a guest list — your name is either on it or not. \`BETWEEN\` is a height limit on a ride — you're allowed if your height lands anywhere between the two marks, ends included.`,
    },
    {
      id: 'sql-jr-20',
      level: 'junior',
      topic: 'Pagination',
      question: 'How do you return just one page of results, like rows 21 to 30?',
      answer: `Use \`LIMIT\` with \`OFFSET\` (MySQL / Postgres):

\`\`\`sql
SELECT * FROM Products
ORDER BY id
LIMIT 10 OFFSET 20;   -- skip 20, take 10  → rows 21–30
\`\`\`

\`OFFSET 20\` skips the first 20 rows, \`LIMIT 10\` takes the next 10.

Always include an \`ORDER BY\` — without it, "page 2" isn't guaranteed to be stable. (SQL Server uses \`OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY\`.)`,
      analogy: `It's flipping to page 3 of search results. You skip the first two pages of hits (\`OFFSET\`) and show the next ten (\`LIMIT\`). And you need a fixed sort order, or "page 3" would show different things each time.`,
    },
    {
      id: 'sql-jr-21',
      level: 'junior',
      topic: 'Constraints',
      question: 'What is a foreign key, and what does ON DELETE CASCADE do?',
      answer: `A **foreign key** links a column to the primary key of another table, and blocks invalid links — you can't add an order for a customer who doesn't exist.

\`ON DELETE CASCADE\` decides what happens to the child rows when the parent is deleted:
- With \`CASCADE\`, deleting a customer automatically deletes all their orders too.
- Without it, the database stops you from deleting a customer who still has orders.

Use CASCADE carefully — it can delete more than you expect.

**Example:**
\`\`\`sql
CREATE TABLE Orders (
  id          INT PRIMARY KEY,
  customer_id INT REFERENCES Customers(id) ON DELETE CASCADE
);

DELETE FROM Customers WHERE id = 7;
-- Every order with customer_id = 7 is automatically deleted too.
-- Without ON DELETE CASCADE, this DELETE is blocked while those orders still exist.
\`\`\``,
      analogy: `A foreign key is the rule that every order must name a real customer. \`ON DELETE CASCADE\` is "when we close a customer's account, shred all their paperwork with them" — convenient, but make sure you really want everything gone.`,
    },
    {
      id: 'sql-jr-22',
      level: 'junior',
      topic: 'Aggregation',
      question: 'Write a query to find total sales for each product category.',
      code: `-- Sales(id, category, amount)`,
      codeLanguage: 'sql',
      answer: `\`\`\`sql
SELECT category, SUM(amount) AS total_sales
FROM Sales
GROUP BY category
ORDER BY total_sales DESC;
\`\`\`

\`GROUP BY category\` bundles all rows of the same category together, \`SUM(amount)\` adds up the sales in each bundle, and \`ORDER BY\` puts the biggest category on top.

Rule of thumb: every column in \`SELECT\` that isn't inside an aggregate must appear in \`GROUP BY\`.`,
      analogy: `It's like sorting your shopping receipts into piles by type — groceries, fuel, clothes — and totalling each pile. \`GROUP BY\` makes the piles, \`SUM\` totals each one.`,
    },
    {
      id: 'sql-jr-23',
      level: 'junior',
      topic: 'NULL Handling',
      question: 'How do you replace or neutralize a NULL value? (COALESCE, NULLIF)',
      answer: `- **COALESCE(a, b, c)** returns the first value that isn't NULL. Great for a fallback: \`COALESCE(nickname, first_name, 'Guest')\`.
- **NULLIF(a, b)** returns NULL if the two values are equal, otherwise it returns the first. Handy to dodge divide-by-zero: \`total / NULLIF(count, 0)\` gives NULL instead of an error when \`count\` is 0.

Both are standard SQL. (SQL Server's \`ISNULL\` is similar to COALESCE, but takes only two arguments.)`,
      analogy: `\`COALESCE\` is a backup plan — "call my mobile; no answer? try home; still nothing? leave a voicemail." It uses the first one that works. \`NULLIF\` is "if these two match, treat it as nothing" — like ignoring a sensor that's stuck reading exactly zero.`,
    },
    {
      id: 'sql-jr-24',
      level: 'junior',
      topic: 'Joins',
      question: 'In a JOIN, what is the difference between a condition in the ON clause and one in the WHERE clause?',
      answer: `For an **INNER JOIN** they behave the same. But for a **LEFT JOIN** they're very different — and this trips people up:

- A condition in **ON** is applied *while matching* the tables, so non-matching left rows are still kept (with NULLs).
- A condition in **WHERE** is applied *after* the join, to the combined result — so it can quietly drop those NULL rows and turn your LEFT JOIN back into an INNER JOIN.

**Example:** "list all customers, plus their 2024 orders if any":
\`\`\`sql
-- RIGHT — keeps customers with no 2024 order (filter in ON):
SELECT c.name, o.id
FROM Customers c
LEFT JOIN Orders o
  ON o.customer_id = c.id AND o.year = 2024;

-- WRONG — drops customers with no 2024 order (filter in WHERE):
SELECT c.name, o.id
FROM Customers c
LEFT JOIN Orders o ON o.customer_id = c.id
WHERE o.year = 2024;        -- a NULL year fails this test → the row vanishes
\`\`\``,
      analogy: `Filtering in **ON** is telling the matchmaker "pair people up, and only count a 2024 order as a match" — everyone still shows up to the party. Filtering in **WHERE** is a bouncer at the *exit* who throws out anyone without a 2024 order, including the people who came alone. With a LEFT JOIN, that bouncer undoes the whole point.`,
    },
    {
      id: 'sql-jr-25',
      level: 'junior',
      topic: 'Aggregation',
      question: 'If both can remove duplicates, what is the difference between DISTINCT and GROUP BY?',
      answer: `For *just* removing duplicate rows, \`SELECT DISTINCT col\` and \`SELECT col ... GROUP BY col\` give the same result.

The difference is intent:
- Use **DISTINCT** when you only want the unique values and nothing more.
- Use **GROUP BY** when you also want to *calculate something per group*, like a count or a sum.

\`\`\`sql
-- DISTINCT: just the unique list
SELECT DISTINCT country FROM Customers;

-- GROUP BY: unique list PLUS a number per group
SELECT country, COUNT(*) FROM Customers GROUP BY country;
\`\`\`

If you're not calculating anything, \`DISTINCT\` reads more clearly.`,
      analogy: `DISTINCT asks "which countries are our customers from?" — just the list. GROUP BY asks "how many customers from each country?" — the list *and* a tally for each. Same piles, but GROUP BY also counts them.`,
    },

    {
      id: 'sql-jr-26',
      level: 'junior',
      topic: 'SQL Categories',
      question: 'What are the four categories of SQL commands — DDL, DML, DCL, and TCL?',
      answer: `SQL commands fall into four families by what they do:

- **DDL (Data Definition)** — define or change *structure*: \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`.
- **DML (Data Manipulation)** — work with the *data inside* tables: \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`.
- **DCL (Data Control)** — manage *permissions*: \`GRANT\`, \`REVOKE\`.
- **TCL (Transaction Control)** — manage *transactions*: \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\`.

**Example:**
\`\`\`sql
CREATE TABLE Orders (id INT);        -- DDL: defines structure
INSERT INTO Orders VALUES (1);       -- DML: changes data
GRANT SELECT ON Orders TO analyst;   -- DCL: controls access
COMMIT;                              -- TCL: finalises the transaction
\`\`\`
A useful tell: DDL auto-commits (you can't roll back a \`DROP\`), while DML changes can be wrapped in a transaction and rolled back.`,
      analogy: `Think of building a house. **DDL** is the architect drawing or changing the rooms. **DML** is moving furniture in and out. **DCL** is handing out door keys. **TCL** is the "save / undo" button on the day's work.`,
    },
    {
      id: 'sql-jr-27',
      level: 'junior',
      topic: 'Constraints',
      question: 'What are the common column constraints, and what does each enforce? (NOT NULL, UNIQUE, CHECK, DEFAULT)',
      answer: `Constraints are rules the database enforces automatically, so bad data can't get in:

- **NOT NULL** — the column must always have a value.
- **UNIQUE** — no two rows can share the same value.
- **CHECK** — the value must satisfy a condition you write.
- **DEFAULT** — if no value is given, use this one.
- (**PRIMARY KEY** = NOT NULL + UNIQUE; **FOREIGN KEY** = must match a row in another table.)

**Example:**
\`\`\`sql
CREATE TABLE Accounts (
  id      INT PRIMARY KEY,
  email   VARCHAR(255) NOT NULL UNIQUE,
  balance NUMERIC      DEFAULT 0,
  status  VARCHAR(10)  CHECK (status IN ('active', 'closed'))
);
\`\`\`
Now an insert with a NULL email, a duplicate email, or a status of \`'banana'\` is rejected before it can corrupt your data.`,
      analogy: `Constraints are a nightclub door policy. **NOT NULL** = "you must show ID", **UNIQUE** = "one entry per person", **CHECK** = "you must meet the dress code", **DEFAULT** = "no stamp? here's the standard one". The bouncer enforces it so troublemakers never get inside.`,
    },
    {
      id: 'sql-jr-28',
      level: 'junior',
      topic: 'Indexing',
      question: 'What is an index, and when should you add one?',
      answer: `An index is a separate, sorted lookup structure the database keeps for a column, so it can find rows *without scanning the whole table*.

**Add one when:**
- A column is frequently used in \`WHERE\`, \`JOIN\`, or \`ORDER BY\`.
- The table is big enough that full scans are slow.

**Be careful, because:**
- Every \`INSERT\`/\`UPDATE\`/\`DELETE\` must also update the index, so too many indexes slow down writes.
- Indexes use extra storage.

**Example:**
\`\`\`sql
-- Slow on a big table — scans every row:
SELECT * FROM Customers WHERE email = 'a@x.com';

-- Add an index so the lookup jumps straight to the row:
CREATE INDEX idx_customers_email ON Customers(email);
\`\`\`
(*How* an index finds rows so fast, and the clustered-vs-non-clustered distinction, are deeper topics — see the mid/senior index questions.)`,
      analogy: `It's the index at the back of a book. Without it you read every page to find a topic; with it you jump straight to the right page. But that index has to be updated every time the book changes — so you don't bother indexing a one-page memo.`,
    },
    {
      id: 'sql-jr-29',
      level: 'junior',
      topic: 'String Functions',
      question: 'What are the common string functions in SQL?',
      answer: `The everyday string toolkit:

- \`CONCAT(a, b)\` (or \`a || b\`) — join strings together.
- \`LENGTH(s)\` — number of characters.
- \`SUBSTRING(s, start, len)\` — pull out part of a string.
- \`UPPER(s)\` / \`LOWER(s)\` — change case.
- \`TRIM(s)\` — remove leading/trailing spaces.
- \`REPLACE(s, from, to)\` — swap text.

**Example:**
\`\`\`sql
SELECT
  CONCAT(first_name, ' ', last_name) AS full_name,
  UPPER(country)                     AS country_code,
  TRIM(email)                        AS clean_email,
  SUBSTRING(phone, 1, 3)             AS area_code
FROM Customers;
\`\`\`
Watch out in \`WHERE\`: \`WHERE UPPER(name) = 'ASHA'\` wraps the column in a function and can stop an index from being used (see the non-sargable question).`,
      analogy: `String functions are a label-maker kit — cut a piece out (\`SUBSTRING\`), stick two together (\`CONCAT\`), tidy the edges (\`TRIM\`), or reprint it in capitals (\`UPPER\`).`,
    },
    {
      id: 'sql-jr-30',
      level: 'junior',
      topic: 'Date Functions',
      question: 'What are the common date/time functions, and how do you work with dates?',
      answer: `The common ones (names vary a little by database):

- \`CURRENT_DATE\` / \`NOW()\` — today / the current timestamp.
- \`EXTRACT(YEAR FROM d)\` (or \`YEAR(d)\`) — pull out a part of a date.
- \`DATEDIFF\` / \`AGE\` — the gap between two dates.
- \`DATE_ADD\` / \`d + INTERVAL '7 days'\` — shift a date.

**Example:**
\`\`\`sql
-- Each order with how many days ago it was placed:
SELECT id,
       order_date,
       CURRENT_DATE - order_date AS days_ago
FROM Orders
WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE);
\`\`\`
**Tip:** filter with a date *range* (\`order_date >= '2024-01-01'\`) rather than wrapping the column in a function (\`YEAR(order_date) = 2024\`) — the bare-column version can use an index, the function version can't.`,
      analogy: `Date functions are a calendar plus a stopwatch. \`EXTRACT\` reads one number off the calendar (the month); \`DATEDIFF\` is the stopwatch between two dates; \`DATE_ADD\` flips the calendar forward.`,
    },
    {
      id: 'sql-jr-31',
      level: 'junior',
      topic: 'Views',
      question: 'What is a view, and why would you use one?',
      answer: `A view is a *saved query* you can treat like a table. It stores no data of its own — each time you query it, the underlying \`SELECT\` runs and gives fresh results.

**Why use one:**
- **Simplify** — hide a complex join behind a friendly name.
- **Reuse** — define the logic once, use it everywhere.
- **Security** — expose only certain columns/rows, hiding the rest of the table.

**Example:**
\`\`\`sql
CREATE VIEW active_customers AS
SELECT id, name, email
FROM Customers
WHERE status = 'active';

-- Now query it just like a table:
SELECT * FROM active_customers WHERE name LIKE 'A%';
\`\`\`
(If you need the *results stored* for speed, that's a materialized view — a more advanced topic; see the senior question.)`,
      analogy: `A view is a saved filter on a spreadsheet, or a TV channel preset — not a new copy of everything, just a convenient, named window onto the data you care about.`,
    },

    // ── Mid (2–5 yrs) ─────────────────────────────────────────
    {
      id: 'sql-mid-1',
      level: 'mid',
      topic: 'Window Functions',
      question: 'Find the top 3 highest-paid employees in each department.',
      code: `-- Employee(id, name, salary, department_id)
-- Department(id, name)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — window function (the standard).** Rank everyone *inside their own department*, then keep the top 3:

\`\`\`sql
WITH ranked AS (
  SELECT e.name, e.salary, d.name AS department,
         DENSE_RANK() OVER (
           PARTITION BY e.department_id
           ORDER BY e.salary DESC
         ) AS rnk
  FROM Employee e
  JOIN Department d ON d.id = e.department_id
)
SELECT department, name, salary
FROM ranked
WHERE rnk <= 3;
\`\`\`

**Why DENSE_RANK, not ROW_NUMBER?** If two people in a department earn the same, they should share a spot. \`DENSE_RANK\` gives ties the same rank (so you get the top 3 salary *amounts*, even if that's more than 3 people); \`ROW_NUMBER\` would split ties and might unfairly drop someone. \`PARTITION BY department\` restarts the ranking per department — that's the "per group" part.

**Approach 2 — correlated subquery (works on older databases with no window functions).** Keep an employee if *fewer than 3* distinct salaries in their department are higher:

\`\`\`sql
SELECT e.name, e.salary, e.department_id
FROM Employee e
WHERE (
  SELECT COUNT(DISTINCT e2.salary)
  FROM Employee e2
  WHERE e2.department_id = e.department_id
    AND e2.salary > e.salary
) < 3;
\`\`\`

Approach 1 is clearer and faster; Approach 2 is the portable fallback when window functions aren't available.`,
      analogy: `Think of the Olympics handing out medals **separately for each sport**. \`PARTITION BY department\` means "each sport gets its own podium". \`DENSE_RANK\` is the medal ceremony — and if two swimmers tie for silver, *both* get silver and the next swimmer still gets bronze. You're crowning the top 3 in every event, not the top 3 athletes overall.`,
    },
    {
      id: 'sql-mid-2',
      level: 'mid',
      topic: 'Self Join',
      question: 'Given an Employee table where each row has a managerId pointing to another employee, find all employees who earn more than their manager.',
      code: `-- Employee
-- +----+-------+--------+-----------+
-- | id | name  | salary | managerId |
-- +----+-------+--------+-----------+
-- |  1 | Joe   |  70000 |         3 |
-- |  2 | Henry |  80000 |         4 |
-- |  3 | Sam   |  60000 |      NULL |
-- |  4 | Max   |  90000 |      NULL |
-- +----+-------+--------+-----------+`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — self-join (the classic).** Join the table to itself, once as "the employee" and once as "the manager":

\`\`\`sql
SELECT e.name AS employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
\`\`\`

In the sample, **Joe** (70k) out-earns his manager Sam (60k), so Joe shows up. The trick: one table, two names (\`e\` for employee, \`m\` for manager). A plain \`JOIN\` also conveniently skips anyone with no manager — they can't out-earn a boss who doesn't exist.

**Approach 2 — correlated subquery (reads more like the question).** For each employee, look up their manager's salary inline and compare:

\`\`\`sql
SELECT e.name AS employee
FROM Employee e
WHERE e.salary > (
  SELECT m.salary FROM Employee m WHERE m.id = e.managerId
);
\`\`\`

Same answer both ways. The self-join is usually faster; the subquery reads closer to plain English ("is my pay above my manager's pay?").`,
      analogy: `Take one company photo and make two copies side by side: the left copy is "the employee", the right copy is "their boss". Tie each person to their boss with a piece of string (\`e.managerId = m.id\`), then walk down the line asking "is the pay on the left bigger than the pay on the right?" One table, two roles — that's a self-join.`,
    },
    {
      id: 'sql-mid-3',
      level: 'mid',
      topic: 'Window Functions',
      question: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with an example.',
      answer: `All three number the rows in order. The difference is how they handle **ties**.

Take salaries from high to low: \`100, 90, 90, 80\`.

| salary | ROW_NUMBER | RANK | DENSE_RANK |
|-------:|:----------:|:----:|:----------:|
| 100    | 1          | 1    | 1          |
| 90     | 2          | 2    | 2          |
| 90     | 3          | 2    | 2          |
| 80     | 4          | 4    | 3          |

- **ROW_NUMBER()** — always a unique number (1, 2, 3, 4). Ties get picked in some order. Good for grabbing exactly one row per group.
- **RANK()** — ties get the same number, then it *skips* ahead (see the jump: 2, 2, 4). Good when "tied for 2nd means the next is 4th."
- **DENSE_RANK()** — ties get the same number, with *no skipping* (2, 2, 3). Good for "top N different values."

If the follow-up is "how do you pick just one row per group?" — that's a clue for ROW_NUMBER with \`PARTITION BY\`.`,
      analogy: `Two runners tie for 2nd in a race. **RANK** is the Olympics: both get silver, and the next runner is 4th — the bronze is *skipped*. **DENSE_RANK** is a kinder league: both get silver, the next runner still gets bronze (3rd) — no medal wasted. **ROW_NUMBER** is the photo finish: someone *has* to be 2nd and someone *has* to be 3rd, even in a dead heat — the system just picks one.`,
    },
    {
      id: 'sql-mid-4',
      level: 'mid',
      topic: 'Window Functions',
      question: 'Write a query that returns each day\'s sales along with a running (cumulative) total of sales over time.',
      code: `-- Sales
-- +------------+--------+
-- | sale_date  | amount |
-- +------------+--------+
-- | 2024-01-01 |    100 |
-- | 2024-01-02 |    150 |
-- | 2024-01-03 |     50 |
-- +------------+--------+`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — window function (modern, easiest).** Use \`SUM()\` with an order:

\`\`\`sql
SELECT sale_date,
       amount,
       SUM(amount) OVER (
         ORDER BY sale_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM Sales
ORDER BY sale_date;
\`\`\`

Result: \`100, 250, 300\`. The \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` means "add up everything from the start through today's row" (without it, rows sharing a date can wrongly show the same total). For a running total *per customer*, add \`PARTITION BY customer_id\`.

**Approach 2 — correlated subquery (works without window functions).** For each row, sum every row dated on or before it:

\`\`\`sql
SELECT s.sale_date, s.amount,
       (SELECT SUM(s2.amount) FROM Sales s2
        WHERE s2.sale_date <= s.sale_date) AS running_total
FROM Sales s
ORDER BY s.sale_date;
\`\`\`

Approach 1 is far faster (one pass); Approach 2 is the old-school fallback, and it slows down on big tables because it re-sums for every row.`,
      analogy: `It's your **bank balance**, not your list of transactions. A plain \`SUM\` is the grand total at the bottom — no use mid-month. The running total is the balance line on your statement: each day shows everything that's come in *up to and including* today, climbing as the month goes on.`,
    },
    {
      id: 'sql-mid-5',
      level: 'mid',
      topic: 'Indexing',
      question: 'What is the difference between a clustered and a non-clustered index? How many of each can a table have?',
      answer: `**Clustered index**
- Decides the *actual order* the rows are stored in. The table itself is sorted by this key.
- You get only **one** per table (you can only sort the rows one way). In SQL Server, the primary key is the clustered index by default.
- Because matching rows sit right next to each other, searching a range of values is very fast.

**Non-clustered index**
- A **separate list**, sorted by the indexed column, with a pointer back to the full row.
- You can have **many** of these.
- It only holds the indexed column plus a pointer — so if your query needs other columns, the database makes an extra trip to fetch the full row (called a "key lookup").

**Handy tip:** if a non-clustered index already contains every column the query needs, the database skips that extra trip. This is called a "covering index" and it's much faster.

*(Note: MySQL/InnoDB always clusters on the primary key. Postgres doesn't have clustered indexes in quite the same way.)*

**Example:**
\`\`\`sql
-- Clustered: the table's rows are physically sorted by this key (only one allowed)
CREATE CLUSTERED INDEX ix_orders_id ON Orders(id);

-- Non-clustered: a separate lookup list that points back to the row (many allowed)
CREATE NONCLUSTERED INDEX ix_orders_email ON Orders(email);
\`\`\`
A lookup by \`id\` walks the table itself; a lookup by \`email\` uses the smaller side-list, then jumps to the row.`,
      analogy: `A **clustered index** is a phone book — the names are physically printed in A–Z order, so the data itself *is* the sorted list. You can only print it one way, so you get just one. A **non-clustered index** is the index at the back of a textbook — a separate little sorted list of topics, each pointing to a page number. You can have lots of those, but you still have to flip to the page to read the real content.`,
    },

    {
      id: 'sql-mid-6',
      level: 'mid',
      topic: 'Window Functions',
      question: 'How would you show the month-over-month change in sales?',
      code: `-- MonthlySales(month, amount)`,
      codeLanguage: 'sql',
      answer: `Use \`LAG()\`, a window function that looks at the *previous* row:

\`\`\`sql
SELECT month,
       amount,
       amount - LAG(amount) OVER (ORDER BY month) AS change_vs_prev,
       LEAD(amount)         OVER (ORDER BY month) AS next_month
FROM MonthlySales
ORDER BY month;
\`\`\`

\`LAG(amount)\` pulls the previous month's amount onto the current row, so you can subtract to get the change. \`LEAD()\` does the same for the *next* row. The first row's \`LAG\` is NULL, since nothing comes before it.`,
      analogy: `It's like checking your weight against last week's. \`LAG\` hands you last week's number to sit right next to today's, so the difference is obvious at a glance — no flipping back and forth.`,
    },
    {
      id: 'sql-mid-7',
      level: 'mid',
      topic: 'Query Writing',
      question: 'How do you find the median salary?',
      code: `-- Employee(id, salary)`,
      codeLanguage: 'sql',
      answer: `The cleanest modern way uses \`PERCENTILE_CONT\`:

\`\`\`sql
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median
FROM Employee;
\`\`\`

If your database doesn't support it, rank rows from both the top and bottom and take the middle:

\`\`\`sql
SELECT AVG(salary) AS median FROM (
  SELECT salary,
         ROW_NUMBER() OVER (ORDER BY salary)      AS asc_pos,
         ROW_NUMBER() OVER (ORDER BY salary DESC) AS desc_pos
  FROM Employee
) t
WHERE asc_pos IN (desc_pos, desc_pos + 1, desc_pos - 1);
\`\`\`

The trick: the middle row is exactly where its position-from-top and position-from-bottom meet.`,
      analogy: `Line everyone up by height. The median is the person standing dead centre. If two people share the middle (an even-sized line), you average the two. It's the "typical" value that isn't dragged around by one giant outlier the way an average is.`,
    },
    {
      id: 'sql-mid-8',
      level: 'mid',
      topic: 'Pivoting',
      question: 'How do you turn rows into columns — for example, total sales per quarter shown as four columns?',
      code: `-- Sales(quarter, amount)  -- quarter is 'Q1'..'Q4'`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — CASE inside aggregates (portable, works everywhere).** One \`CASE\` per output column:

\`\`\`sql
SELECT
  SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS Q1,
  SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS Q2,
  SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS Q3,
  SUM(CASE WHEN quarter = 'Q4' THEN amount ELSE 0 END) AS Q4
FROM Sales;
\`\`\`

Each \`CASE\` keeps only its quarter's rows and zeroes the rest, so each \`SUM\` totals just that quarter.

**Approach 2 — the PIVOT keyword (SQL Server / Oracle).** Some databases have built-in syntax for this:

\`\`\`sql
SELECT Q1, Q2, Q3, Q4
FROM Sales
PIVOT (SUM(amount) FOR quarter IN (Q1, Q2, Q3, Q4)) AS p;
\`\`\`

Approach 1 is what most people reach for — it runs on every database; \`PIVOT\` is tidier but only exists on some engines (Postgres and MySQL don't have it).`,
      analogy: `It's like sorting post into labelled pigeonholes — one slot per quarter — and counting each slot. The \`CASE\` is you deciding which slot each letter drops into; the \`SUM\` tallies each pigeonhole.`,
    },
    {
      id: 'sql-mid-9',
      level: 'mid',
      topic: 'Subqueries',
      question: 'Find customers who bought product A but never bought product B.',
      code: `-- Orders(customer_id, product)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — NOT EXISTS (the safe default).** Find buyers of A, then drop anyone who also bought B:

\`\`\`sql
SELECT DISTINCT o.customer_id
FROM Orders o
WHERE o.product = 'A'
  AND NOT EXISTS (
    SELECT 1 FROM Orders o2
    WHERE o2.customer_id = o.customer_id AND o2.product = 'B'
  );
\`\`\`

\`NOT EXISTS\` behaves correctly even when some rows are NULL (unlike \`NOT IN\`).

**Approach 2 — LEFT JOIN ... IS NULL.** Join A-buyers to their B-orders, keep only the ones with no match:

\`\`\`sql
SELECT a.customer_id
FROM (SELECT DISTINCT customer_id FROM Orders WHERE product = 'A') a
LEFT JOIN (SELECT DISTINCT customer_id FROM Orders WHERE product = 'B') b
  ON a.customer_id = b.customer_id
WHERE b.customer_id IS NULL;
\`\`\`

**Approach 3 — EXCEPT (most readable, if supported).** Literally "A-buyers minus B-buyers":

\`\`\`sql
SELECT customer_id FROM Orders WHERE product = 'A'
EXCEPT
SELECT customer_id FROM Orders WHERE product = 'B';
\`\`\`

Same answer all three ways. \`EXCEPT\` reads the clearest; \`NOT EXISTS\` is the most widely supported.`,
      analogy: `It's like finding people who own a cat but not a dog. You start with all the cat owners, then cross off anyone who also appears on the dog-owners list. What's left is cat-only.`,
    },
    {
      id: 'sql-mid-10',
      level: 'mid',
      topic: 'CTEs',
      question: 'What is a CTE, and when would you use one instead of a subquery?',
      answer: `A CTE (Common Table Expression) is a named, temporary result you define up front with \`WITH\`, then use in your main query:

\`\`\`sql
WITH big_spenders AS (
  SELECT customer_id, SUM(amount) AS total
  FROM Orders
  GROUP BY customer_id
  HAVING SUM(amount) > 1000
)
SELECT c.name, b.total
FROM big_spenders b
JOIN Customers c ON c.id = b.customer_id;
\`\`\`

Use a CTE when:
- you'd otherwise repeat the same subquery more than once,
- the query is complex and a name makes it readable,
- you need recursion (a recursive CTE).

For a simple, one-off filter, a plain subquery is fine.

**Example:** the same "big spenders" logic written both ways —
\`\`\`sql
-- As a CTE (named, readable, reusable):
WITH big_spenders AS (
  SELECT customer_id, SUM(amount) AS total
  FROM Orders GROUP BY customer_id HAVING SUM(amount) > 1000
)
SELECT c.name, b.total
FROM big_spenders b JOIN Customers c ON c.id = b.customer_id;

-- As a subquery (fine here, since it's used only once):
SELECT c.name, b.total
FROM (
  SELECT customer_id, SUM(amount) AS total
  FROM Orders GROUP BY customer_id HAVING SUM(amount) > 1000
) b
JOIN Customers c ON c.id = b.customer_id;
\`\`\`
Same result — the CTE just gives that inner query a name.`,
      analogy: `A subquery is a side note crammed into the middle of a sentence. A CTE is a labelled box you pack at the start — "here's the *big spenders* box" — then refer to by name. Much easier to follow when the recipe has many steps.`,
    },
    {
      id: 'sql-mid-11',
      level: 'mid',
      topic: 'Recursive CTEs',
      question: 'How would you list an employee and everyone below them in the org chart?',
      code: `-- Employee(id, name, manager_id)`,
      codeLanguage: 'sql',
      answer: `A recursive CTE walks the tree level by level:

\`\`\`sql
WITH RECURSIVE org AS (
  SELECT id, name, manager_id
  FROM Employee
  WHERE id = 1                 -- the starting boss
  UNION ALL
  SELECT e.id, e.name, e.manager_id
  FROM Employee e
  JOIN org ON e.manager_id = org.id
)
SELECT * FROM org;
\`\`\`

The first part picks the starting person. The part after \`UNION ALL\` keeps finding everyone who reports to someone already in the list, repeating until nobody new turns up.`,
      analogy: `It's like tracing a family tree downward. Start with one grandparent, find their children, then *their* children, and keep going down each branch until you reach people with no kids. The recursion just repeats "now find the next level down".`,
    },
    {
      id: 'sql-mid-12',
      level: 'mid',
      topic: 'CASE',
      question: 'How do you group salaries into bands like Low / Medium / High?',
      code: `-- Employee(id, salary)`,
      codeLanguage: 'sql',
      answer: `Use \`CASE\` to label each row, then group by the label:

\`\`\`sql
SELECT
  CASE
    WHEN salary < 40000 THEN 'Low'
    WHEN salary < 80000 THEN 'Medium'
    ELSE 'High'
  END AS band,
  COUNT(*) AS people
FROM Employee
GROUP BY
  CASE
    WHEN salary < 40000 THEN 'Low'
    WHEN salary < 80000 THEN 'Medium'
    ELSE 'High'
  END;
\`\`\`

\`CASE\` checks its conditions top to bottom and stops at the first match, so the order of the conditions matters.`,
      analogy: `It's like sorting people into T-shirt sizes. You don't record everyone's exact measurement — you check "under this? small. under that? medium. otherwise large." \`CASE\` is that size chart, applied row by row.`,
    },
    {
      id: 'sql-mid-13',
      level: 'mid',
      topic: 'Subqueries',
      question: 'What is the difference between IN, EXISTS, and a JOIN for checking related rows?',
      answer: `All three can answer "does a related row exist?", but they lean different ways:
- **IN** — checks a value against a list the subquery returns. Fine for small lists.
- **EXISTS** — stops as soon as it finds *one* match, so it's often faster for "does any match exist" checks on big tables.
- **JOIN** — actually combines the rows; use it when you also need columns from the other table.

Modern optimisers often turn these into the same plan, but the safe habit is: use \`EXISTS\` for "does it exist", and \`JOIN\` when you need the other table's data.

**Example:** "customers who have placed an order", three ways:
\`\`\`sql
-- IN
SELECT name FROM Customers
WHERE id IN (SELECT customer_id FROM Orders);

-- EXISTS (stops at the first match)
SELECT name FROM Customers c
WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.id);

-- JOIN (use when you also need order columns)
SELECT DISTINCT c.name FROM Customers c
JOIN Orders o ON o.customer_id = c.id;
\`\`\``,
      analogy: `Imagine checking if a guest is on the VIP list. **IN** reads the whole list and checks. **EXISTS** stops the moment it spots the name — no need to read the rest. **JOIN** is when you also want to grab their table number while you're at it.`,
    },
    {
      id: 'sql-mid-14',
      level: 'mid',
      topic: 'NULL Gotchas',
      question: 'Why can NOT IN with a subquery suddenly return no rows?',
      answer: `If the subquery returns even one NULL, \`NOT IN\` returns *nothing* — a classic, painful bug.

\`\`\`sql
-- If any manager_id is NULL, this returns ZERO rows:
SELECT name FROM Employee
WHERE id NOT IN (SELECT manager_id FROM Employee);
\`\`\`

Why? \`NOT IN\` really means "not equal to every value in the list", and comparing anything to NULL gives "unknown", which fails the test. The fix is \`NOT EXISTS\`, which handles NULLs correctly:

\`\`\`sql
SELECT name FROM Employee e
WHERE NOT EXISTS (
  SELECT 1 FROM Employee m WHERE m.manager_id = e.id
);
\`\`\``,
      analogy: `It's like asking "is this person *not* on any of these lists?" — but one list is smudged and unreadable (the NULL). Since you can't be *sure* they're not on the smudged one, you can't honestly say "not on any" — so the check gives up. \`NOT EXISTS\` doesn't fall for that.`,
    },
    {
      id: 'sql-mid-15',
      level: 'mid',
      topic: 'Aggregation',
      question: 'Find the department with the highest average salary.',
      code: `-- Employee(id, department_id, salary)`,
      codeLanguage: 'sql',
      answer: `Average per department, sort, take the top one:

\`\`\`sql
SELECT department_id, AVG(salary) AS avg_salary
FROM Employee
GROUP BY department_id
ORDER BY avg_salary DESC
LIMIT 1;
\`\`\`

If you need to handle ties (two departments sharing the top average), use a ranking version so you don't accidentally drop one:

\`\`\`sql
SELECT department_id, avg_salary FROM (
  SELECT department_id, AVG(salary) AS avg_salary,
         RANK() OVER (ORDER BY AVG(salary) DESC) AS rnk
  FROM Employee GROUP BY department_id
) t WHERE rnk = 1;
\`\`\``,
      analogy: `It's like finding which class has the highest *average* test score. You don't look at individual students — you work out each class's average, line the classes up, and pick the top. The ranking version is for when two classes tie for first and you want both.`,
    },
    {
      id: 'sql-mid-16',
      level: 'mid',
      topic: 'Window Functions',
      question: 'How do you show each category as a percentage of total sales?',
      code: `-- Sales(category, amount)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — window function (one pass).** A window \`SUM()\` with no partition puts the grand total on every row, then you divide:

\`\`\`sql
SELECT category,
       SUM(amount) AS category_total,
       100.0 * SUM(amount) / SUM(SUM(amount)) OVER () AS pct_of_total
FROM Sales
GROUP BY category;
\`\`\`

\`SUM(SUM(amount)) OVER ()\` reads as "the total of all the category totals" — the whole pie. (Multiply by \`100.0\`, not \`100\`, to keep decimals instead of rounding.)

**Approach 2 — scalar subquery for the total (works without window functions).** Divide each category total by the grand total from a subquery:

\`\`\`sql
SELECT category,
       SUM(amount) AS category_total,
       100.0 * SUM(amount) / (SELECT SUM(amount) FROM Sales) AS pct_of_total
FROM Sales
GROUP BY category;
\`\`\`

Same result. The window version gets the grand total in the same pass; the subquery version reads more simply and runs on older databases.`,
      analogy: `It's working out what slice of the pie each category is. First you measure each slice (the group total), then you divide by the size of the *whole* pie (the grand total) to get the percentage.`,
    },
    {
      id: 'sql-mid-17',
      level: 'mid',
      topic: 'Window Functions',
      question: 'For each customer, find their most recent order.',
      code: `-- Orders(id, customer_id, order_date, amount)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — window function (the standard).** Rank each customer's orders newest-first, then keep rank 1:

\`\`\`sql
WITH ranked AS (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY order_date DESC
         ) AS rn
  FROM Orders
)
SELECT * FROM ranked WHERE rn = 1;
\`\`\`

\`PARTITION BY customer_id\` numbers each customer's orders separately, and \`ROW_NUMBER\` (not \`RANK\`) guarantees exactly one row per customer even if two orders share a date.

**Approach 2 — correlated subquery (works without window functions).** Keep the order whose date equals that customer's latest:

\`\`\`sql
SELECT * FROM Orders o
WHERE order_date = (
  SELECT MAX(order_date) FROM Orders o2
  WHERE o2.customer_id = o.customer_id
);
\`\`\`

Approach 1 is cleaner and always returns one row per customer; Approach 2 is the classic fallback — but watch out: if a customer has two orders on the *same* latest date, it returns both.`,
      analogy: `It's like grabbing the top letter from each person's pile of post, where each pile is sorted newest-on-top. \`PARTITION BY\` makes one pile per person; picking "number 1" takes the latest from each.`,
    },
    {
      id: 'sql-mid-18',
      level: 'mid',
      topic: 'Subqueries',
      question: 'What is a correlated subquery, and why can it be slow?',
      answer: `A correlated subquery is an inner query that depends on the outer row — so it re-runs *once for every outer row*.

\`\`\`sql
SELECT e.name
FROM Employee e
WHERE e.salary > (
  SELECT AVG(salary) FROM Employee
  WHERE department_id = e.department_id   -- depends on the outer row
);
\`\`\`

Because the inner query references \`e.department_id\`, it can't run just once — it runs again for each employee. On large tables that's slow. The usual fix is to calculate the averages once with a \`GROUP BY\` and \`JOIN\` to them.`,
      analogy: `It's like phoning the bank to check your balance before *every single* purchase, instead of checking once and remembering it. Per-purchase works, but it's painfully slow when you shop a lot.`,
    },
    {
      id: 'sql-mid-19',
      level: 'mid',
      topic: 'Window Functions',
      question: 'How do you find missing numbers (gaps) in a column of sequential IDs?',
      code: `-- Invoices(id)  -- ids should be 1,2,3,... but some are missing`,
      codeLanguage: 'sql',
      answer: `Compare each row to the next with \`LEAD\`, and flag where the jump is more than 1:

\`\`\`sql
SELECT id + 1 AS gap_start,
       next_id - 1 AS gap_end
FROM (
  SELECT id, LEAD(id) OVER (ORDER BY id) AS next_id
  FROM Invoices
) t
WHERE next_id - id > 1;
\`\`\`

\`LEAD(id)\` puts the next id on the same row. If the gap between this id and the next is bigger than 1, there are missing numbers in between.`,
      analogy: `It's like checking a roll of numbered tickets for missing ones. You read each ticket and peek at the next — if ticket 5 is followed by ticket 9, you know 6, 7, and 8 are missing.`,
    },
    {
      id: 'sql-mid-20',
      level: 'mid',
      topic: 'Window Functions',
      question: 'Find all employees who earn more than the average salary of their own department.',
      code: `-- Employee(id, name, department_id, salary)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — correlated subquery (easiest to read).** For each employee, compare their salary to their own department's average:

\`\`\`sql
SELECT name, salary, department_id
FROM Employee e
WHERE salary > (
  SELECT AVG(salary) FROM Employee
  WHERE department_id = e.department_id
);
\`\`\`

**Approach 2 — window function (faster on big tables).** Work out each department's average once, alongside every row, then filter:

\`\`\`sql
SELECT name, salary, department_id
FROM (
  SELECT name, salary, department_id,
         AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
  FROM Employee
) t
WHERE salary > dept_avg;
\`\`\`

Approach 1 reads most clearly; Approach 2 works out each average just once instead of re-running it for every row, so it scales better on large tables.`,
      analogy: `It's like asking "who scored above their *own class's* average?" — not the whole school's. \`PARTITION BY department\` works out each class's average separately, then you keep only the students who beat their own class.`,
    },
    {
      id: 'sql-mid-21',
      level: 'mid',
      topic: 'Indexing',
      question: 'Why might a query ignore an index on a column, and how do you fix it?',
      code: `SELECT * FROM Orders WHERE YEAR(order_date) = 2024;`,
      codeLanguage: 'sql',
      answer: `Wrapping the column in a function — \`YEAR(order_date)\` — means the database can't use the index on \`order_date\`, because the index stores the raw dates, not the result of \`YEAR()\`. This is a "non-sargable" condition, and it forces a full scan.

Fix it by leaving the column bare and using a range instead:

\`\`\`sql
SELECT * FROM Orders
WHERE order_date >= '2024-01-01'
  AND order_date <  '2025-01-01';
\`\`\`

Now the index works. The same problem shows up with \`UPPER(name)\`, \`column + 1 = 10\`, and a \`LIKE '%foo'\` that starts with a wildcard.`,
      analogy: `An index is a sorted phone book. Searching by surname is instant. But asking "whose name has exactly 7 letters?" forces you to read every single entry — the book isn't sorted by *length*. Wrapping a column in a function does the same thing: it asks a question the sorted index can't answer.`,
    },
    {
      id: 'sql-mid-22',
      level: 'mid',
      topic: 'Data Quality',
      question: 'How do you find rows that are duplicated across several columns, not just one?',
      code: `-- Orders(customer_id, product, order_date)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — GROUP BY + HAVING (easiest).** Group by all the columns that together define a duplicate, and keep groups with more than one row:

\`\`\`sql
SELECT customer_id, product, order_date, COUNT(*) AS copies
FROM Orders
GROUP BY customer_id, product, order_date
HAVING COUNT(*) > 1;
\`\`\`

The combination of \`customer_id + product + order_date\` defines what "the same" means here.

**Approach 2 — window function (when you want the full duplicate rows back).** Count copies within each group, alongside every row, then keep the ones with more than one:

\`\`\`sql
SELECT * FROM (
  SELECT *, COUNT(*) OVER (
           PARTITION BY customer_id, product, order_date
         ) AS copies
  FROM Orders
) t
WHERE copies > 1;
\`\`\`

Approach 1 lists the duplicated *combinations*; Approach 2 hands back the actual rows (handy when you need to inspect or delete them).`,
      analogy: `It's spotting people who registered twice. One person might share a *first name* with someone else — not a duplicate. But the same first name *and* last name *and* birthday? Now that's almost certainly one person signed up twice.`,
    },
    {
      id: 'sql-mid-23',
      level: 'mid',
      topic: 'Aggregation',
      question: 'How do you get subtotals and a grand total in the same result?',
      code: `-- Sales(region, product, amount)`,
      codeLanguage: 'sql',
      answer: `\`ROLLUP\` adds subtotal and grand-total rows automatically:

\`\`\`sql
SELECT region, product, SUM(amount) AS total
FROM Sales
GROUP BY ROLLUP (region, product);
\`\`\`

You get the normal per-region-per-product totals, *plus* a subtotal per region, *plus* one grand total at the bottom. The summary rows show NULL in the columns they're rolling up over (the grand total has NULL for both region and product).`,
      analogy: `It's a receipt that shows each item, then a subtotal per department, then the total at the very bottom — all in one printout. \`ROLLUP\` adds those summary lines for you, instead of you running three separate queries.`,
    },
    {
      id: 'sql-mid-24',
      level: 'mid',
      topic: 'Self Join',
      question: 'Find all pairs of employees who work in the same department.',
      code: `-- Employee(id, name, department_id)`,
      codeLanguage: 'sql',
      answer: `Join the table to itself on department, and use \`<\` to avoid duplicates and self-pairs:

\`\`\`sql
SELECT a.name AS emp1, b.name AS emp2, a.department_id
FROM Employee a
JOIN Employee b
  ON a.department_id = b.department_id
 AND a.id < b.id;
\`\`\`

\`a.id < b.id\` is the key trick: without it you'd get each pair twice (A–B and B–A) plus everyone paired with themselves.`,
      analogy: `It's like making a handshake list for people in the same room. You don't shake your own hand, and A–B is the same handshake as B–A — so the \`a.id < b.id\` rule counts each handshake just once.`,
    },
    {
      id: 'sql-mid-25',
      level: 'mid',
      topic: 'Window Functions',
      question: 'How do you split rows into 4 equal groups, like salary quartiles?',
      code: `-- Employee(id, name, salary)`,
      codeLanguage: 'sql',
      answer: `\`NTILE(4)\` divides the ordered rows into 4 buckets as evenly as possible:

\`\`\`sql
SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary) AS quartile
FROM Employee;
\`\`\`

Quartile 1 is the lowest-paid quarter, quartile 4 the highest. \`NTILE(10)\` would give deciles, and so on. It's the standard way to split data into equal-sized ranked groups.`,
      analogy: `It's like sorting runners by finish time and splitting them into four equal squads — the fastest quarter, the next quarter, and so on. \`NTILE(4)\` does the dividing for you, keeping the squads as even in size as possible.`,
    },

    {
      id: 'sql-mid-26',
      level: 'mid',
      topic: 'Window Functions',
      question: 'What is the difference between GROUP BY and PARTITION BY?',
      answer: `Both group rows by a column — the difference is what comes *out*:

- **GROUP BY** *collapses* each group into a single summary row. The individual rows are gone.
- **PARTITION BY** (used with a window function) keeps *every* row, and adds the group's calculation alongside each one.

**Example:** same data, two very different outputs —
\`\`\`sql
-- GROUP BY: one row per department (detail rows gone)
SELECT department_id, AVG(salary) AS dept_avg
FROM Employee
GROUP BY department_id;

-- PARTITION BY: every employee, with their department average attached
SELECT name, salary, department_id,
       AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
FROM Employee;
\`\`\`
Use GROUP BY when you only want the summary; use PARTITION BY when you want to compare each row *to* its group (e.g. "is this person above their department average?").`,
      analogy: `GROUP BY is the final scoreboard — one line per team, the players gone. PARTITION BY is each player's stat card that *also* prints their team's average on it — every player still on the page.`,
    },
    {
      id: 'sql-mid-27',
      level: 'mid',
      topic: 'Transactions',
      question: 'How do transactions work — BEGIN, COMMIT, ROLLBACK, and SAVEPOINT?',
      answer: `A transaction groups several statements so they succeed or fail *together*.

- **BEGIN** (or START TRANSACTION) — start grouping.
- **COMMIT** — make all the changes permanent.
- **ROLLBACK** — undo everything since BEGIN.
- **SAVEPOINT** — a checkpoint you can roll back to *partway*, without throwing away the whole transaction.

**Example:**
\`\`\`sql
BEGIN;
UPDATE Accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_debit;
UPDATE Accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK TO after_debit;   -- undoes just the credit, keeps the debit
COMMIT;
\`\`\`
Until you COMMIT, no other session sees your changes, and a crash rolls them back automatically.`,
      analogy: `It's editing a document with "track changes" on. BEGIN starts a draft, SAVEPOINT is a named checkpoint, ROLLBACK is undo (all the way, or back to a checkpoint), and COMMIT is "accept all changes" — only then does everyone else see the final version.`,
    },
    {
      id: 'sql-mid-28',
      level: 'mid',
      topic: 'Programmability',
      question: 'What is the difference between a stored procedure, a function, and a trigger?',
      answer: `All three are saved bits of logic that live inside the database:

- **Stored procedure** — a saved routine you *call explicitly* to do work (often several statements). Can change data. Run it with \`CALL\` / \`EXEC\`.
- **Function** — returns a *single value* (or a table) and is meant to be used *inside a query* (in \`SELECT\`, \`WHERE\`, etc.). Usually can't change data.
- **Trigger** — logic that *fires automatically* in response to an event (INSERT/UPDATE/DELETE on a table). You never call it directly.

**Example:**
\`\`\`sql
-- Function: used inside a query
SELECT id, fn_tax(amount) AS tax FROM Orders;

-- Procedure: called on purpose to do work
CALL archive_old_orders(2020);

-- Trigger: runs by itself on every insert
CREATE TRIGGER set_created_at
BEFORE INSERT ON Orders
FOR EACH ROW SET NEW.created_at = NOW();
\`\`\``,
      analogy: `A **function** is a calculator you use mid-sentence ("what's the tax on this?"). A **stored procedure** is a recipe you deliberately run ("do the month-end cleanup"). A **trigger** is a motion-sensor light — you don't switch it on, it reacts automatically when something happens.`,
    },
    {
      id: 'sql-mid-29',
      level: 'mid',
      topic: 'Data Modification',
      question: 'How do you "insert or update" a row in a single statement (an upsert)?',
      code: `-- Inventory(product_id PRIMARY KEY, qty)`,
      codeLanguage: 'sql',
      answer: `An **upsert** inserts a new row, or updates it if it already exists — in one atomic step, avoiding a race between a separate SELECT and INSERT. The syntax differs by database:

**Postgres / SQLite — \`INSERT ... ON CONFLICT\`:**
\`\`\`sql
INSERT INTO Inventory (product_id, qty)
VALUES (42, 10)
ON CONFLICT (product_id)
DO UPDATE SET qty = Inventory.qty + EXCLUDED.qty;
\`\`\`

**MySQL — \`INSERT ... ON DUPLICATE KEY UPDATE\`:**
\`\`\`sql
INSERT INTO Inventory (product_id, qty)
VALUES (42, 10)
ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty);
\`\`\`

**SQL Server / Oracle — \`MERGE\`:**
\`\`\`sql
MERGE INTO Inventory AS t
USING (SELECT 42 AS product_id, 10 AS qty) AS s
ON t.product_id = s.product_id
WHEN MATCHED THEN UPDATE SET t.qty = t.qty + s.qty
WHEN NOT MATCHED THEN INSERT (product_id, qty) VALUES (s.product_id, s.qty);
\`\`\`
All do the same job; they rely on a unique/primary key to decide "does this already exist?"`,
      analogy: `It's "save" in a video game. If a save slot for this level already exists, overwrite it; if not, create one. One action — not "check whether a save exists, then maybe create it."`,
    },
    {
      id: 'sql-mid-30',
      level: 'mid',
      topic: 'Joins',
      question: 'Find all customers who have never placed an order.',
      code: `-- Customers(id, name)
-- Orders(id, customer_id)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — LEFT JOIN ... IS NULL (the classic anti-join).** Keep customers whose matching order is missing:
\`\`\`sql
SELECT c.id, c.name
FROM Customers c
LEFT JOIN Orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
\`\`\`

**Approach 2 — NOT EXISTS (often the clearest).**
\`\`\`sql
SELECT id, name
FROM Customers c
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.customer_id = c.id
);
\`\`\`

**Approach 3 — NOT IN (watch the NULL trap).**
\`\`\`sql
SELECT id, name FROM Customers
WHERE id NOT IN (SELECT customer_id FROM Orders WHERE customer_id IS NOT NULL);
\`\`\`
\`NOT EXISTS\` and the LEFT JOIN are the safe go-tos; \`NOT IN\` needs the \`IS NOT NULL\` guard, or one NULL makes it return nothing.`,
      analogy: `It's the guest list minus the people who showed up. Start with everyone invited (Customers), cross off anyone who appears in the attendance log (Orders) — whoever's left never came.`,
    },
    {
      id: 'sql-mid-31',
      level: 'mid',
      topic: 'Set Operators',
      question: 'What do EXCEPT and INTERSECT do?',
      answer: `They combine two result sets like UNION, but by *set logic* (both queries must return matching columns):

- **INTERSECT** — rows that appear in **both** queries.
- **EXCEPT** (called **MINUS** in Oracle) — rows in the first query that are **not** in the second.

**Example:**
\`\`\`sql
-- Customers who bought in BOTH 2023 and 2024:
SELECT customer_id FROM Orders WHERE year = 2023
INTERSECT
SELECT customer_id FROM Orders WHERE year = 2024;

-- Customers who bought in 2023 but NOT in 2024 (churned):
SELECT customer_id FROM Orders WHERE year = 2023
EXCEPT
SELECT customer_id FROM Orders WHERE year = 2024;
\`\`\`
Both remove duplicates automatically (like UNION, unlike UNION ALL).`,
      analogy: `Picture two overlapping circles (a Venn diagram). **INTERSECT** is the overlap in the middle; **EXCEPT** is the part of the left circle that the right one doesn't cover.`,
    },

    // ── Senior (5+ yrs) ───────────────────────────────────────
    {
      id: 'sql-sr-1',
      level: 'senior',
      topic: 'Transactions',
      question: 'Explain the four SQL transaction isolation levels and which read phenomena each one prevents.',
      answer: `Isolation levels are a trade-off between **safety** and **speed**. There are three problems they protect against:

- **Dirty read** — you read another transaction's changes *before* it has saved them (and it might still undo them).
- **Non-repeatable read** — you read the same row twice and get different values, because someone changed it in between.
- **Phantom read** — you run the same search twice and get a different set of rows, because someone added or removed matching rows in between.

| Isolation level | Dirty read | Non-repeatable read | Phantom read |
|---|:---:|:---:|:---:|
| READ UNCOMMITTED | possible | possible | possible |
| READ COMMITTED   | prevented | possible | possible |
| REPEATABLE READ  | prevented | prevented | possible* |
| SERIALIZABLE     | prevented | prevented | prevented |

\\* In MySQL, REPEATABLE READ also blocks phantom reads; the official standard doesn't require that.

**How to talk about it:**
- **READ COMMITTED** is the everyday default for most databases (Postgres, Oracle, SQL Server).
- More safety means more waiting and more locking, so it's slower. SERIALIZABLE is the safest, but transactions can fail and need a retry.
- Bonus point: many databases pull this off using "snapshots" (MVCC) instead of locks, which is why readers don't block writers.`,
      analogy: `Think of editing a shared Google Doc with a coworker. **READ UNCOMMITTED**: you see their half-typed, misspelled sentence before they finish (dirty read). **READ COMMITTED**: you only ever see finished sentences. **REPEATABLE READ**: the paragraph you're reading is frozen — it won't change while your eyes are on it. **SERIALIZABLE**: you each take strict turns, nobody types at the same time. The safer you go, the more everyone has to wait.`,
    },
    {
      id: 'sql-sr-2',
      level: 'senior',
      topic: 'Gaps & Islands',
      question: 'Write a query to find every user who has logged in on 3 or more consecutive days, returning the start date and length of each streak.',
      code: `-- Activity(user_id, login_date)  -- one row per user per day they logged in`,
      codeLanguage: 'sql',
      answer: `This is the classic **gaps-and-islands** problem. The trick: on a run of back-to-back dates, \`date − row_number\` stays the *same*, so we can use it to group each streak.

\`\`\`sql
WITH numbered AS (
  SELECT user_id,
         login_date,
         ROW_NUMBER() OVER (
           PARTITION BY user_id ORDER BY login_date
         ) AS rn
  FROM (SELECT DISTINCT user_id, login_date FROM Activity) a
),
streaks AS (
  SELECT user_id,
         login_date,
         DATEADD(DAY, -rn, login_date) AS grp   -- stays the same within one streak
  FROM numbered
)
SELECT user_id,
       MIN(login_date) AS streak_start,
       COUNT(*)        AS streak_length
FROM streaks
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;
\`\`\`

**Why it works (in plain terms):** number each person's login days 1, 2, 3, 4… On a non-stop streak, the date goes up by 1 each day and the number also goes up by 1 — so "date minus number" never changes. The moment they skip a day, that value jumps, which tells us a new streak began. Then we just group by that value and count the days in each streak, keeping the ones with 3 or more.

*(Use \`INTERVAL\` in Postgres or \`DATE_SUB\` in MySQL — same idea.)*`,
      analogy: `Think of marking gym days on a calendar. Number each visit: 1, 2, 3… On a non-stop streak, the date and the visit number both go up by 1 together, so "date minus number" stays the same. Skip a day and that value suddenly jumps — that's how you spot a new streak starting. Same value = same streak; count the days in each.`,
    },
    {
      id: 'sql-sr-3',
      level: 'senior',
      topic: 'Concurrency',
      question: 'Your production application is hitting deadlocks under load. How do you diagnose the cause and resolve them?',
      answer: `**What a deadlock is:** two transactions each hold something the other one needs, so both wait forever. The database notices, picks one as the "loser", and cancels it with an error.

**How to find the cause:**
1. Grab the **deadlock report** your database logs (SQL Server's system_health, the Postgres log, or MySQL's \`SHOW ENGINE INNODB STATUS\`). It tells you the two queries and what each one was waiting on.
2. Look at the **order** each one grabbed its locks. Deadlocks almost always come from two pieces of code locking the same things in the *opposite* order.

**How to fix it (best first):**
- **Lock things in the same order everywhere** — e.g., always update \`accounts\` before \`audit_log\`. If everyone follows the same order, a deadlock can't form. This is the real fix.
- **Keep transactions short** — grab locks late, save quickly, and never wait on a user or an outside service while holding a lock.
- **Add the right indexes** — without them, the database locks far more rows than it needs to, which makes deadlocks more likely.
- **Use a lower safety level** if the work allows it, so locks are held for less time.
- **Add retry logic** — deadlocks can't be 100% prevented, so catch the error and try again. This is a safety net, not the main fix.

**Example:** two sessions lock the same rows in *opposite* order, and freeze:
\`\`\`sql
-- Session 1                          -- Session 2 (at the same time)
BEGIN;                                BEGIN;
UPDATE Accounts SET ... WHERE id = 1; UPDATE Accounts SET ... WHERE id = 2;
UPDATE Accounts SET ... WHERE id = 2; UPDATE Accounts SET ... WHERE id = 1;
-- Session 1 waits for id=2 (held by Session 2)
-- Session 2 waits for id=1 (held by Session 1)  → deadlock
\`\`\`
The fix: make *both* sessions update id=1 before id=2 — then the cycle can't form.`,
      analogy: `Two people meet in a narrow hallway, and each politely waits for the *other* to step aside first. Nobody moves — frozen forever. That's a deadlock. The real fix isn't "wait longer", it's a shared rule: **everyone always passes on the right**. In SQL that rule is "always lock tables in the same order" — if everyone follows it, the standoff simply can't happen.`,
    },
    {
      id: 'sql-sr-4',
      level: 'senior',
      topic: 'Data Cleanup',
      question: 'How would you delete duplicate rows from a large table while keeping exactly one copy of each, efficiently?',
      code: `-- Person(id, email, ...)  -- 'id' is unique; 'email' is duplicated`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — ROW_NUMBER (the standard, flexible).** Number the copies of each email, then delete all but the first:

\`\`\`sql
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY email      -- group the duplicates together
           ORDER BY id             -- keep the lowest id
         ) AS rn
  FROM Person
)
DELETE FROM Person
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
\`\`\`

\`rn = 1\` is the copy you keep. Change the \`ORDER BY\` to choose *which* copy survives (newest, highest, etc.).

**Approach 2 — keep MIN(id) per group (simpler, no window functions).** Delete any row that isn't the lowest id for its email:

\`\`\`sql
DELETE FROM Person
WHERE id NOT IN (
  SELECT MIN(id) FROM Person GROUP BY email
);
\`\`\`

Approach 2 is more portable; Approach 1 is more flexible about which copy to keep.

**On a big table, being correct isn't enough — be safe too:**
- **Delete in small batches** (a few thousand at a time). One huge delete locks the table and blocks other users.
- **Index the duplicate column** (\`email\`) so the scan isn't slow.
- **For very large cleanups, copy-and-swap:** copy the keepers into a fresh table, then swap it in — safer than a giant delete, and you keep the original until verified.
- **Stop it recurring** — add a \`UNIQUE\` rule on \`email\`.`,
      analogy: `It's like clearing the duplicate photos on your phone. You group every shot of the same scene, label them "copy 1, copy 2, copy 3…", keep copy 1, and delete the rest. To stop your phone freezing, you don't wipe 50,000 photos in one tap — you clear them in small batches. Then you switch on "no duplicate uploads" so the mess can't come back (the \`UNIQUE\` rule).`,
    },
    {
      id: 'sql-sr-5',
      level: 'senior',
      topic: 'Performance at Scale',
      question: 'A query that used to be fast has become slow as its table grew to 500M rows. Walk me through your diagnosis and the levers you would pull.',
      answer: `**1. Look at the actual query plan.** Run \`EXPLAIN ANALYZE\`. Compare the *guessed* row counts to the *real* ones — if they're way off, the database's stats are out of date and it's choosing a bad plan.

**2. Find the slowest step.** Look for the database scanning the whole 500M-row table, or sorting so much data that it spills to disk.

**3. Try the cheap fixes first:**
- **Add indexes** on the columns you filter and join on. A "covering index" (one that holds every column the query needs) is even better.
- **Refresh the stats** (\`ANALYZE\`). Cheap, and often fixes it instantly.
- **Fix index-killers** — wrapping a column in a function (like \`YEAR(date)\`) or starting a \`LIKE\` with \`%\` stops the index from working. Rewrite those.

**4. Bigger changes as the table keeps growing:**
- **Partitioning** — split the table by date so a query only looks at one slice instead of all 500M rows. It also makes deleting old data almost instant.
- **Archive old data** — most giant tables are mostly old rows nobody queries. Move them out.
- **A pre-built summary table** for heavy reports, refreshed on a schedule.

**5. Last-resort, big-architecture changes:**
- **Read replicas** — extra copies of the database to take the reporting load off the main one.
- **Sharding** — split the data across several servers. Powerful, but a big jump in complexity, so only when nothing else is left.

The mindset interviewers want to hear: **measure first, fix the part you've proven is slow, and only add big complexity when the simple fixes run out** — don't jump straight to "shard it."`,
      analogy: `It's a library that quietly grew from 1,000 books to 5 million. The old "just walk the shelves" trick now takes all day. First you check the catalogue to see *where* the time goes (the query plan). Then you put up better signs (indexes). Still drowning? Split the building into wings by subject (partitioning) and send the dusty old books to storage (archiving). Only when one building genuinely can't cope do you open a second branch across town (sharding) — because running two buildings is a whole new headache.`,
    },
    {
      id: 'sql-sr-6',
      level: 'senior',
      topic: 'Transactions',
      question: 'What does ACID stand for in databases?',
      answer: `ACID is four guarantees that keep transactions reliable:
- **Atomicity** — all steps in a transaction happen, or none do. A half-done money transfer can't be left hanging.
- **Consistency** — a transaction moves the database from one valid state to another, never breaking its rules (constraints).
- **Isolation** — running transactions don't trip over each other; the result is as if they ran one at a time.
- **Durability** — once committed, the change survives even a crash or power cut.

Together, they're why you can trust a bank transfer or an order to be all-or-nothing and permanent.

**Example:** a money transfer wrapped in a transaction:
\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- from
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- to
COMMIT;
\`\`\`
- **Atomicity** — if the second UPDATE fails, the first is rolled back too; money never half-moves.
- **Consistency** — a rule like \`CHECK (balance >= 0)\` blocks the COMMIT if account 1 would go negative.
- **Isolation** — until COMMIT, no other session sees the half-finished transfer.
- **Durability** — once COMMIT returns, it survives even if the server crashes a second later.`,
      analogy: `Think of an ATM withdrawal. **Atomicity**: you get cash *and* your balance drops, or neither — never cash without the deduction. **Consistency**: you can't end up overdrawn if the rules forbid it. **Isolation**: two people on a joint account don't both grab the last $50. **Durability**: once it says "done", a power cut won't undo it.`,
    },
    {
      id: 'sql-sr-7',
      level: 'senior',
      topic: 'Scaling',
      question: 'What is the difference between sharding, partitioning, and replication?',
      answer: `All three deal with big or busy databases, but solve different problems:
- **Partitioning** — split one big table into chunks *on the same server* (e.g., by month). Queries touch only the chunk they need.
- **Sharding** — split the data across *multiple servers*, each holding a slice (e.g., users A–M on one, N–Z on another). Used when one machine can't handle the write load.
- **Replication** — keep *copies* of the same data on several servers. Great for read-heavy apps (reads spread across copies) and for failover if one dies.

Rough rule: partition for query speed, replicate for read scaling and safety, shard only when writes outgrow a single machine.

**Example:** all three, side by side —

**Partitioning** — one server, one table split into chunks:
\`\`\`sql
CREATE TABLE Orders (id INT, order_date DATE, amount NUMERIC)
PARTITION BY RANGE (order_date);

CREATE TABLE orders_2023 PARTITION OF Orders
  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
\`\`\`
A query for 2023 orders now reads only the \`orders_2023\` chunk.

**Sharding** — many servers, each holding a *slice*: users A–M live on Server 1, N–Z on Server 2. A lookup for "Asha" is routed only to Server 1.

**Replication** — many servers, each holding a *full copy*: the primary takes all writes, and read-only copies serve reports and stand by as backups if the primary fails.`,
      analogy: `Picture a busy restaurant. **Partitioning** is organising one kitchen into stations (grill, salad, dessert) so cooks aren't in each other's way. **Replication** is opening identical kitchens so more orders cook at once — and if one catches fire, the others carry on. **Sharding** is opening separate branches in different cities, each serving its own customers.`,
    },
    {
      id: 'sql-sr-8',
      level: 'senior',
      topic: 'Indexing',
      question: 'How does a database index actually make lookups fast?',
      answer: `Most indexes are a **B-tree** — a sorted, branching structure. Instead of reading every row, the database starts at the top and follows a few branches down to the value, like a decision tree.

Because each step rules out a huge chunk of the data, finding one row in a million takes only a handful of hops instead of a million checks. The data is kept sorted, which is also why range searches (\`BETWEEN\`, \`>\`) and \`ORDER BY\` on the indexed column are fast.

The cost: every insert, update, and delete has to keep the tree sorted — so indexes speed up reads but slightly slow down writes.`,
      analogy: `It's how you find a word in a dictionary. You don't read from page one — you open the middle, see you've gone too far, jump back, narrow it down, and land on the word in seconds. A B-tree lets the database "open to the middle" over and over until it pinpoints the row.`,
    },
    {
      id: 'sql-sr-9',
      level: 'senior',
      topic: 'Concurrency',
      question: 'What is the difference between optimistic and pessimistic locking?',
      answer: `Both stop two people from overwriting each other's changes, but in opposite ways:
- **Pessimistic locking** — lock the row *up front* while you work on it. Others must wait. Safe, but it can cause waiting and deadlocks. Good when conflicts are common.
- **Optimistic locking** — don't lock. Let everyone read freely, but when saving, check whether the row changed since you read it (often via a \`version\` number or timestamp). If it did, reject the save and ask them to retry. Good when conflicts are rare.

Most web apps use optimistic locking, because most edits don't actually collide.

**Example:**
\`\`\`sql
-- Pessimistic: lock the row now; others must wait
SELECT * FROM Accounts WHERE id = 1 FOR UPDATE;

-- Optimistic: no lock; check the version when saving
UPDATE Accounts SET balance = 50, version = version + 1
WHERE id = 1 AND version = 7;   -- 0 rows updated = someone beat you → retry
\`\`\``,
      analogy: `Pessimistic is taking the *only* library copy of a book home so nobody else can touch it until you're done. Optimistic is everyone photocopying the page freely — but before you hand in your edits, you check that nobody changed that page first. If they did, you redo your bit.`,
    },
    {
      id: 'sql-sr-10',
      level: 'senior',
      topic: 'Architecture',
      question: 'What is the difference between OLTP and OLAP systems?',
      answer: `They're databases tuned for opposite jobs:
- **OLTP** (transaction processing) — lots of small, fast reads and writes. Think placing an order or updating a profile. Highly normalised, optimised for quick single-row changes.
- **OLAP** (analytical processing) — big, complex read queries over huge amounts of history. Think "total sales by region over the last 3 years." Often denormalised or column-stored for fast scanning.

You usually keep them separate, so heavy reports don't slow down the live app — analytics run on a copy or a data warehouse.

**Example:**
\`\`\`sql
-- OLTP: tiny, fast, one row (a checkout, thousands per second)
UPDATE Accounts SET balance = balance - 50 WHERE id = 1;

-- OLAP: huge scan + aggregation (an analyst's report, run occasionally)
SELECT region, SUM(amount)
FROM Orders
WHERE order_date >= '2021-01-01'
GROUP BY region;
\`\`\``,
      analogy: `OLTP is the shop's cash register — quick, one customer at a time, all day long. OLAP is the analyst in the back office pulling a year of receipts to spot trends. You wouldn't tie up the till to run that big report, so you give the analyst their own copy of the data.`,
    },
    {
      id: 'sql-sr-11',
      level: 'senior',
      topic: 'Schema Design',
      question: 'When would you deliberately denormalize a database?',
      answer: `Normalisation avoids duplicate data, but it can make reads slow because you join many tables. You denormalise — store some data redundantly — when read speed matters more than tidy storage:
- A report joins 8 tables and is too slow → store a pre-joined summary.
- You constantly count something (likes, comments) → keep a running count column instead of counting every time.

The trade-off: redundant data must be kept in sync, which complicates writes. So denormalise only after measuring a real problem, never by default.

**Example:** showing a post's like-count:
\`\`\`sql
-- Normalized (slow if run on every page view):
SELECT COUNT(*) FROM Likes WHERE post_id = 42;

-- Denormalized: keep a running count on the post itself
UPDATE Posts SET like_count = like_count + 1 WHERE id = 42;
\`\`\`
Reads become instant — but now every like has to update two places.`,
      analogy: `It's like writing your phone number on every page of your notebook instead of once on the cover. Looking it up is instant from any page — but if the number changes, you've got a lot of pages to update. Worth it only if you look it up constantly.`,
    },
    {
      id: 'sql-sr-12',
      level: 'senior',
      topic: 'Views',
      question: 'What is the difference between a view and a materialized view?',
      answer: `- A **view** is a saved query. It stores no data — every time you use it, the underlying query runs fresh. Always up to date, but no speed gain.
- A **materialized view** actually *stores* the results, like a cached table. Reading it is fast because the work is already done, but the data is only as fresh as the last refresh — you have to refresh it on a schedule or trigger.

Use a plain view to simplify and reuse a query; use a materialized view when a heavy query runs often and slightly stale data is acceptable.

**Example:**
\`\`\`sql
-- View: re-runs the query every time, always fresh
CREATE VIEW active_users AS
SELECT * FROM Users WHERE status = 'active';

-- Materialized view: stores the result, fast to read, must be refreshed
CREATE MATERIALIZED VIEW sales_by_region AS
SELECT region, SUM(amount) FROM Orders GROUP BY region;

REFRESH MATERIALIZED VIEW sales_by_region;   -- run on a schedule
\`\`\``,
      analogy: `A view is a recipe — every time you want the dish, you cook it from scratch (always fresh, but it takes time). A materialized view is a batch you cooked earlier and put in the fridge — grab-and-go fast, but you need to remember to cook a fresh batch now and then.`,
    },
    {
      id: 'sql-sr-13',
      level: 'senior',
      topic: 'Indexing',
      question: 'Does the column order in a composite (multi-column) index matter?',
      answer: `Yes — a lot. A composite index on \`(a, b)\` is sorted by \`a\` first, then by \`b\` within each \`a\`. This "leftmost prefix" rule means:
- It helps queries filtering on \`a\`, or on \`a\` and \`b\` together.
- It does *not* help a query filtering on \`b\` alone.

\`\`\`sql
-- Good for:  WHERE a = ?   and   WHERE a = ? AND b = ?
-- Useless for:  WHERE b = ?
CREATE INDEX idx ON Orders (a, b);
\`\`\`

So put the column you filter on most (especially by equality) first.`,
      analogy: `It's a phone book sorted by last name, then first name. Brilliant for finding "Smith", or "Smith, John". But useless for finding everyone called "John" — the book isn't organised by first name, so you'd have to read all of it.`,
    },
    {
      id: 'sql-sr-14',
      level: 'senior',
      topic: 'Indexing',
      question: 'What is a covering index?',
      answer: `A covering index contains *every column a query needs* — both the columns it filters on and the columns it returns. Because everything is right there in the index, the database never has to go back to the table for the full row, saving a whole step.

\`\`\`sql
-- Query: SELECT email FROM Users WHERE status = 'active';
-- Covering index includes status (to filter) and email (to return):
CREATE INDEX idx ON Users (status) INCLUDE (email);
\`\`\`

It's one of the biggest easy wins for a hot, slow query.`,
      analogy: `It's like a contacts list that already shows the phone number next to each name. If all you wanted was the number, you're done — no need to open the full contact card. The index "covers" everything the question asked for.`,
    },
    {
      id: 'sql-sr-15',
      level: 'senior',
      topic: 'Distributed Systems',
      question: 'What is the CAP theorem?',
      answer: `For a distributed database (data spread across servers), the CAP theorem says that when a network problem splits the servers apart, you can only keep *two* of these three:
- **Consistency** — everyone sees the same latest data.
- **Availability** — every request still gets an answer.
- **Partition tolerance** — the system keeps working despite the network split.

Since network splits *will* happen, you must tolerate partitions — so the real choice during a split is: favour **Consistency** (refuse stale answers) or **Availability** (answer anyway, possibly with old data)? Banks lean consistent; social feeds lean available.`,
      analogy: `Two shop branches lose the phone line between them. A customer wants to spend loyalty points. The **consistent** choice: "sorry, can't confirm your balance right now" (correct, but unavailable). The **available** choice: "sure, go ahead" (works, but the two branches might now disagree on the balance). You can't have both while the line is down.`,
    },
    {
      id: 'sql-sr-16',
      level: 'senior',
      topic: 'Migrations',
      question: 'How would you add a new NOT NULL column to a huge, live table without downtime?',
      answer: `Doing it in one step can lock the table and take it offline. Instead, break it into safe stages:
1. Add the column as **nullable** (instant on most modern databases).
2. **Backfill** existing rows in small batches, so you never lock the whole table at once.
3. Update the app to start writing the column for new rows.
4. Once every row has a value, add the **NOT NULL** constraint.

This way the table stays online throughout, and no single step locks it for long.

**Example:** adding a NOT NULL \`country\` column in safe stages:
\`\`\`sql
ALTER TABLE Users ADD COLUMN country VARCHAR(2);          -- 1. nullable, instant
UPDATE Users SET country = 'US'                            -- 2. backfill in batches
  WHERE country IS NULL AND id BETWEEN 1 AND 10000;
-- ...repeat step 2 for the next batches...
ALTER TABLE Users ALTER COLUMN country SET NOT NULL;       -- 4. lock in the rule
\`\`\``,
      analogy: `It's like repainting a busy shop without closing it. You don't shut the doors and paint everything at once — you cordon off one small section at a time, paint it, and move on. Customers keep shopping throughout, and eventually the whole place is done.`,
    },
    {
      id: 'sql-sr-17',
      level: 'senior',
      topic: 'Performance',
      question: 'What is the N+1 query problem, and how do you fix it?',
      answer: `It's when code runs 1 query to get a list, then 1 *more* query for each item in that list — so fetching 100 orders fires 1 + 100 = 101 queries. It's slow because of all the round-trips to the database, and it usually comes from ORMs loading related data lazily.

Fix it by fetching everything in one go:
- Use a \`JOIN\` (or the ORM's "eager loading") to pull the related rows with the main query.
- Or fetch all the related rows with a single \`WHERE id IN (...)\`.

One query instead of 101.

**Example:** showing 100 posts with their author:
\`\`\`sql
-- N+1 (101 queries): 1 for the posts, then 1 per post for its author
SELECT * FROM Posts;                  -- 100 rows
SELECT * FROM Authors WHERE id = ?;   -- fired 100 times, once per post

-- Fixed (1 query): join the author in
SELECT p.*, a.name
FROM Posts p JOIN Authors a ON a.id = p.author_id;
\`\`\``,
      analogy: `It's like grocery shopping by walking to the shop, coming home, then going *back* for each item one at a time — bread, then again for milk, then again for eggs. The fix is obvious: take one list and buy everything in a single trip.`,
    },
    {
      id: 'sql-sr-18',
      level: 'senior',
      topic: 'Replication',
      question: 'What are read replicas, and what is replication lag?',
      answer: `A **read replica** is a copy of your main database that handles read queries, taking load off the primary. Writes go to the primary, then copy across to the replicas.

**Replication lag** is the short delay before a write shows up on a replica. If a user saves something and immediately reads from a replica, they might briefly see the *old* data. Handle it by reading "read-your-own-write" critical data from the primary, while sending heavy reports and non-urgent reads to replicas.`,
      analogy: `The primary is head office; replicas are branch offices that get a copy of every memo. Branches answer most questions, so head office isn't swamped. But there's a small delay before a new memo reaches the branches — so for something you *just* changed, you ask head office directly to be sure.`,
    },
    {
      id: 'sql-sr-19',
      level: 'senior',
      topic: 'Window Functions',
      question: 'How do you find the top 10% of earners?',
      code: `-- Employee(id, name, salary)`,
      codeLanguage: 'sql',
      answer: `**Approach 1 — ORDER BY + LIMIT (simplest).** Sort by salary and take the top tenth of the row count:

\`\`\`sql
SELECT name, salary
FROM Employee
ORDER BY salary DESC
LIMIT (SELECT CEIL(COUNT(*) * 0.1) FROM Employee);
\`\`\`

**Approach 2 — NTILE (clean "which 10% bucket").** Split everyone into 100 equal ranked buckets, keep the top 10:

\`\`\`sql
SELECT name, salary FROM (
  SELECT name, salary,
         NTILE(100) OVER (ORDER BY salary DESC) AS pct
  FROM Employee
) t
WHERE pct <= 10;
\`\`\`

**Approach 3 — PERCENT_RANK (exact percentile).** Keep rows in the top 10% by their precise rank position:

\`\`\`sql
SELECT name, salary FROM (
  SELECT name, salary,
         PERCENT_RANK() OVER (ORDER BY salary DESC) AS pr
  FROM Employee
) t
WHERE pr <= 0.10;
\`\`\`

Approach 1 is the most intuitive; \`NTILE\` / \`PERCENT_RANK\` handle ties and exact boundaries more precisely on large datasets.`,
      analogy: `It's like grading on a curve. You line everyone up by score, slice the line into 100 equal bands, and the top ten bands are your top 10%. \`NTILE(100)\` does the slicing evenly for you.`,
    },
    {
      id: 'sql-sr-20',
      level: 'senior',
      topic: 'Query Optimization',
      question: 'How does the database decide how to run a query?',
      answer: `Modern databases use a **cost-based optimiser**. For a given query there are many possible plans — which index to use, which join order, which join method. The optimiser estimates the "cost" of each, based on table sizes and column statistics, and picks the cheapest.

This is why **statistics matter**: if they're stale, the optimiser misjudges how many rows it'll get and may pick a bad plan. It's also why two similar queries can run very differently. You inspect its choice with \`EXPLAIN\`.

**Example:** ask the database to reveal its plan without running the query:
\`\`\`sql
EXPLAIN
SELECT * FROM Orders WHERE customer_id = 42;
-- "Index Scan using orders_customer_idx"  → good, it's using the index
-- "Seq Scan on orders"                    → reading the whole table, often bad
\`\`\`
A surprise Seq Scan usually means stale statistics or a missing index.`,
      analogy: `It's like a sat-nav planning a route. It knows roughly how busy each road is (the statistics) and picks what it thinks is fastest. If its traffic info is out of date, it'll confidently send you down a jammed road — which is exactly what stale statistics do to a query.`,
    },
    {
      id: 'sql-sr-21',
      level: 'senior',
      topic: 'Durability',
      question: 'How does a database avoid losing committed data in a crash?',
      answer: `Most use a **write-ahead log (WAL)**: before changing the actual data, the database first writes the change to a sequential log on disk and confirms it. So when you \`COMMIT\`, the change is safely in the log even if the main data files haven't been updated yet.

If the server crashes, on restart it replays the log — redoing committed changes and undoing half-finished ones — bringing the database back to a correct state. This is what makes the "D" (durability) in ACID real.`,
      analogy: `It's like jotting every transaction in a notebook *before* updating the big ledger. If the power cuts out mid-update, you reopen the notebook and redo the entries you'd noted but not yet copied over. Nothing confirmed is ever lost.`,
    },
    {
      id: 'sql-sr-22',
      level: 'senior',
      topic: 'Performance',
      question: 'How do you update millions of rows without locking the table for everyone?',
      answer: `Don't do it in one giant statement — that holds locks for ages and bloats the log. Instead, update in **small batches** in a loop:

\`\`\`sql
-- repeat until no rows are left to update
UPDATE Orders
SET status = 'archived'
WHERE id IN (
  SELECT id FROM Orders WHERE status = 'old' LIMIT 5000
);
\`\`\`

Each batch commits quickly, releasing locks so other users can get in between batches. Add a short pause between batches if the server is busy.`,
      analogy: `It's like moving house. You don't carry every box in one impossible trip that blocks the whole hallway — you move a few boxes at a time, letting other people pass between trips. Slower in total, but nobody's left stuck waiting.`,
    },
    {
      id: 'sql-sr-23',
      level: 'senior',
      topic: 'Debugging',
      question: 'A query is fast in your dev database but slow in production. What is going on?',
      answer: `Almost always it's about scale and stats, not the SQL itself:
- **Data size** — dev has 1,000 rows, prod has 50 million. A missing index doesn't hurt on small data but kills you on big.
- **Stale statistics** in prod lead the optimiser to a bad plan.
- **Concurrency** — in prod, other queries compete for locks, CPU, and memory.
- **Different config or hardware** between the two environments.

How to investigate: run \`EXPLAIN\` on production (carefully), compare its plan to dev, and check indexes and statistics first.

**Example:** the same query, two very different worlds:
\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM Orders WHERE customer_id = 42;
-- Dev (1k rows):   Seq Scan ... 2ms      → scanning everything is cheap
-- Prod (50M rows): Seq Scan ... 8000ms   → identical plan, now a disaster
\`\`\`
The usual fix: an index on \`customer_id\` plus refreshed statistics in prod.`,
      analogy: `It's like a recipe that works fine for two but falls apart at a wedding for 500. The steps are identical — what changed is the scale, the busy kitchen, and whether your tools were built for that volume.`,
    },
    {
      id: 'sql-sr-24',
      level: 'senior',
      topic: 'Data Warehousing',
      question: 'In a data warehouse, how do you keep history when a value changes — like a customer moving city?',
      answer: `That's a **slowly changing dimension**, and the common approach is **Type 2**: instead of overwriting the old value, you add a *new row* for the customer and mark which one is current.

You keep columns like \`valid_from\`, \`valid_to\`, and \`is_current\`. The old row gets an end date; the new row is flagged current. Now a report from last year still shows the customer's *old* city, and today's report shows the new one — history is preserved.

(Type 1, by contrast, just overwrites and forgets the old value.)

**Example:** Asha moves from Pune to Delhi — keep both rows:

| id | name | city | valid_from | valid_to | is_current |
|---|---|---|---|---|---|
| 1 | Asha | Pune | 2020-01-01 | 2024-03-01 | false |
| 1 | Asha | Delhi | 2024-03-01 | NULL | true |

A report dated 2023 joins to the Pune row; today's report joins to the Delhi row.`,
      analogy: `It's like keeping every version of your address on file instead of typing over the old one. An old parcel still shows where it was *actually* sent at the time, while new parcels use your current address. You never lose the history of where you used to live.`,
    },
    {
      id: 'sql-sr-25',
      level: 'senior',
      topic: 'Reliability',
      question: 'How do you stop a retried request from charging a customer twice?',
      answer: `You make the operation **idempotent** — safe to run more than once with the same result. The usual trick is an **idempotency key**: the client sends a unique key with the request, and the database has a unique constraint on it.
- First time: the charge is recorded with that key.
- A retry with the same key hits the unique constraint and is safely ignored (or returns the original result) instead of charging again.

This protects against network retries, double-clicks, and timeouts where the client isn't sure the first attempt worked.

**Example:** a unique constraint on the key does the work:
\`\`\`sql
INSERT INTO Charges (idempotency_key, amount)
VALUES ('abc-123', 100);

-- A retry with the SAME key fails the unique constraint instead of charging twice:
-- ERROR: duplicate key value violates unique constraint "charges_idempotency_key"
\`\`\``,
      analogy: `It's like a cloakroom ticket. You hand over your coat and get ticket #42. If you accidentally ask for your coat twice with the same ticket, you still get *one* coat — the ticket number stops them handing you a second one that isn't yours.`,
    },
    {
      id: 'sql-sr-26',
      level: 'senior',
      topic: 'Schema Design',
      question: 'How would you design the database tables for a simple e-commerce site?',
      answer: `Start by finding the **entities** (the nouns) and the **relationships** between them.

Core tables:
- **Customers**(id, name, email)
- **Products**(id, name, price)
- **Orders**(id, customer_id → Customers, order_date, status)
- **OrderItems**(id, order_id → Orders, product_id → Products, quantity, unit_price)

The decisions an interviewer listens for:
- **OrderItems is a junction table** — an order has many products and a product appears in many orders (many-to-many), so you need a table *between* them.
- **Store \`unit_price\` on OrderItems**, not just on Products — the price at *purchase time* must be frozen, even if the product's price changes later.
- Foreign keys make sure every order item points to a real order and a real product.

**Example:**
\`\`\`sql
CREATE TABLE OrderItems (
  id         INT PRIMARY KEY,
  order_id   INT REFERENCES Orders(id),
  product_id INT REFERENCES Products(id),
  quantity   INT NOT NULL,
  unit_price NUMERIC NOT NULL    -- frozen at purchase time
);
\`\`\``,
      analogy: `It's setting up a filing system before the paperwork floods in — one drawer per kind of thing (customers, products, orders), plus a cross-reference card (OrderItems) noting which products went into which order, with the price written down on the day so it never shifts under you.`,
    },
    {
      id: 'sql-sr-27',
      level: 'senior',
      topic: 'Data Warehousing',
      question: 'What is the difference between a star schema and a snowflake schema?',
      answer: `Both are data-warehouse layouts with a central **fact table** (the measurements — sales, clicks) surrounded by **dimension tables** (the context — date, product, store).

- **Star schema** — dimensions are *flat* (denormalised). \`DimProduct\` holds the product *and* its category and brand, all in one table. Fewer joins → fast, simple queries.
- **Snowflake schema** — dimensions are *normalised* into sub-tables: \`DimProduct\` → \`DimCategory\` → \`DimDepartment\`. Less duplicated data, but more joins.

**Example:** a sales fact joined to a flat (star) product dimension:
\`\`\`sql
SELECT p.category, SUM(f.amount)
FROM FactSales f
JOIN DimProduct p ON p.id = f.product_id   -- category lives right here (star)
GROUP BY p.category;
\`\`\`
Star is the common default for reporting (speed + simplicity); snowflake saves space and keeps large or shared dimensions tidy, at the cost of extra joins.`,
      analogy: `A **star** schema is a plate with the main dish in the middle and all the sides in one ring around it — grab anything in a single reach. A **snowflake** adds smaller dishes branching off the sides — neater and less repetition, but you reach further (more joins) to get everything.`,
    },
    {
      id: 'sql-sr-28',
      level: 'senior',
      topic: 'Design',
      question: 'What is the difference between a soft delete and a hard delete, and when would you use each?',
      answer: `- **Hard delete** — actually remove the row with \`DELETE\`. It's gone.
- **Soft delete** — keep the row but mark it inactive, usually with a \`deleted_at\` timestamp or an \`is_deleted\` flag. Queries then filter out the "deleted" rows.

**Example (soft delete):**
\`\`\`sql
-- "Delete" the customer:
UPDATE Customers SET deleted_at = NOW() WHERE id = 7;

-- Every normal query must now exclude them:
SELECT * FROM Customers WHERE deleted_at IS NULL;
\`\`\`
**Use soft delete** when you need history, undo, an audit trail, or to keep referential integrity (old orders still point to the customer). **Use hard delete** for genuinely disposable data, or to honour "delete my data" privacy requests (GDPR).

The catch with soft delete: every query must remember the \`WHERE deleted_at IS NULL\` filter, and the table keeps growing.`,
      analogy: `Soft delete is moving a file to the Recycle Bin — recoverable, still taking up space, you just don't see it normally. Hard delete is running it through the shredder. You bin things you might want back; you shred things that must truly be gone.`,
    },
    {
      id: 'sql-sr-29',
      level: 'senior',
      topic: 'Performance',
      question: 'Why does OFFSET pagination get slow on large tables, and what is the better approach?',
      code: `-- Orders(id PRIMARY KEY, ...)`,
      codeLanguage: 'sql',
      answer: `**The problem:** \`LIMIT 10 OFFSET 100000\` still makes the database *walk through and throw away* the first 100,000 rows before returning 10. The deeper the page, the slower it gets.

**Better — keyset (a.k.a. cursor / seek) pagination.** Remember the last row you saw, and ask for rows *after* it:
\`\`\`sql
-- Page 1:
SELECT * FROM Orders ORDER BY id LIMIT 10;

-- Next page: pass the last id you saw (e.g. 4310)
SELECT * FROM Orders
WHERE id > 4310
ORDER BY id
LIMIT 10;
\`\`\`
Because \`id\` is indexed, the database jumps straight to the spot — page 10,000 is as fast as page 1.

**Trade-off:** keyset can't jump to an arbitrary page number ("go to page 500"); it's built for next/previous and infinite scroll. Plain \`OFFSET\` is fine for small, shallow result sets.`,
      analogy: `OFFSET pagination is counting pages from the front of the book every single time to reach page 500 — slower the deeper you go. Keyset pagination is sticking a bookmark where you stopped and opening straight to it next time.`,
    },
    {
      id: 'sql-sr-30',
      level: 'senior',
      topic: 'Distributed Systems',
      question: 'What is the difference between ACID and BASE?',
      answer: `They're two philosophies for how a system handles data correctness:

- **ACID** (traditional relational databases) — **A**tomic, **C**onsistent, **I**solated, **D**urable. Every transaction is all-or-nothing and the data is always in a valid, up-to-date state. Favours *correctness*.
- **BASE** (many NoSQL / distributed systems) — **B**asically **A**vailable, **S**oft state, **E**ventually consistent. The system stays available and fast, and accepts that different nodes may briefly disagree before *catching up*. Favours *availability and scale*.

This ties back to the CAP theorem: during a network split, ACID systems lean **consistent** (refuse stale answers), BASE systems lean **available** (answer now, reconcile later).

**The trade-off in practice:** a bank balance wants ACID — never show wrong money, even if you have to wait. A social-media "like" count is fine with BASE — if it briefly reads 1,001 instead of 1,002, nobody cares, and the system stays fast for millions of users.`,
      analogy: `ACID is a careful accountant — the books must balance *exactly*, right now, even if that means making you wait. BASE is a busy tally on a whiteboard where everyone adds marks fast; the count might lag a few seconds across the office, but it never stops working and it sorts itself out.`,
    },
    {
      id: 'sql-sr-31',
      level: 'senior',
      topic: 'Indexing',
      question: 'When should you NOT add an index?',
      answer: `Indexes speed up reads but cost you on writes and storage, so they aren't free. Avoid (or rethink) one when:

- **The table is small** — a full scan is already instant; the index just adds overhead.
- **The column is low-cardinality** — very few distinct values (a boolean \`is_active\`, a \`gender\`). The database often scans anyway because the index barely narrows things down.
- **The table is write-heavy** — every \`INSERT\`/\`UPDATE\`/\`DELETE\` must update every index, so lots of indexes slow writes.
- **The column is rarely filtered on** — an index no query uses is pure cost.

**Example:**
\`\`\`sql
-- 'is_active' has only 2 values — an index on it is usually ignored:
CREATE INDEX idx_active ON Users(is_active);          -- often a waste

-- A composite index aimed at a real query pattern is far more useful:
CREATE INDEX idx_active_signup ON Users(is_active, signup_date);
\`\`\`
Rule of thumb: index for the queries you actually run, and measure — don't index "just in case."`,
      analogy: `An index is like adding a detailed table-of-contents to a document. For a 2-page memo it's pointless overhead; for a section that's just "yes/no" it barely helps you find anything; and if the document changes constantly, you're forever reprinting the contents page. Add one only where it genuinely speeds up finding things.`,
    },
  ],

  manual: [

    // ── Junior (0–2 yrs) ──────────────────────────────────────
    {
      id: 'manual-jr-1',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is the difference between verification and validation?',
      answer: `Two checks that sound alike but ask different questions:

- **Verification** — "Are we building the product *right*?" Checking documents, designs, and code against the spec, usually *without running the software* (reviews, walkthroughs, inspections).
- **Validation** — "Are we building the *right* product?" Actually *running* the software to confirm it meets the user's real needs — the actual testing.

Verification happens first and catches issues cheaply on paper; validation confirms the working product.

**Example:** A spec says "lock the account after 3 failed logins." **Verification** = reviewing the design doc and code to confirm that rule is written in. **Validation** = entering a wrong password 3 times and seeing the account actually lock.`,
      analogy: `Building a house from blueprints. **Verification** is checking the blueprint and measuring the half-built walls against it. **Validation** is the family finally walking in to confirm it's the home they actually wanted to live in.`,
    },
    {
      id: 'manual-jr-2',
      level: 'junior',
      topic: 'Defect Management',
      question: 'What is the difference between severity and priority?',
      answer: `- **Severity** = how badly the bug *damages the system* (technical impact). Usually set by the tester.
- **Priority** = how *urgently* it needs fixing (business urgency). Usually set by the lead/PM.

They're independent — you can get any combination:

| | High priority | Low priority |
|---|---|---|
| **High severity** | App crashes on login (blocks everyone) | Crash in a rarely-used admin export |
| **Low severity** | Company name misspelled on the home page | Typo in a help-page footer |

The misspelled logo barely hurts the system (low severity) but the CEO wants it gone before the launch demo (high priority) — that's why both scales exist.`,
      analogy: `Severity is *how serious the injury is*; priority is *how fast the ER sees you*. A stable patient with a broken arm (high severity) may wait behind someone choking right now (high priority). Different scales, set by different people.`,
    },
    {
      id: 'manual-jr-3',
      level: 'junior',
      topic: 'Test Design',
      question: 'What is the difference between a test scenario and a test case?',
      answer: `- **Test scenario** — a high-level *what to test*, one line, broad: "Verify login functionality."
- **Test case** — the detailed *how to test it*: steps, test data, and expected result.

One scenario usually breaks down into many test cases.

**Example:** Scenario — *"Verify login."* Test cases under it:
- valid username + valid password → lands on dashboard
- valid username + wrong password → shows error
- blank fields → shows validation message
- locked account → shows "account locked" message`,
      analogy: `A test scenario is the chapter title ("Getting in the front door"); test cases are the numbered step-by-step instructions inside that chapter.`,
    },
    {
      id: 'manual-jr-4',
      level: 'junior',
      topic: 'Defect Management',
      question: 'Walk me through the defect (bug) life cycle.',
      answer: `The states a bug moves through from found to closed:

**New** → **Assigned** (to a dev) → **Open / In Progress** → **Fixed** → **Retest** (by QA) → **Closed**.

Common side paths:
- **Rejected** — not actually a bug.
- **Duplicate** — already reported.
- **Deferred** — real, but the fix is postponed.
- **Reopened** — the fix didn't work, so it goes back to the dev.

**Example:** You log a checkout crash (New). The lead assigns it (Assigned). The dev fixes it (Fixed). You retest — still crashes → **Reopened**. Dev fixes again → retest passes → **Closed**.`,
      analogy: `It's a repair ticket for a faulty appliance: reported (New), handed to a technician (Assigned), being repaired (Open/Fixed), you try it again (Retest), and either it works (Closed) or it's still broken (Reopened).`,
    },
    {
      id: 'manual-jr-5',
      level: 'junior',
      topic: 'Process',
      question: 'What are the phases of the Software Testing Life Cycle (STLC)?',
      answer: `1. **Requirement analysis** — understand what to test; ask questions about unclear requirements.
2. **Test planning** — decide scope, approach, effort, and who does what.
3. **Test case design** — write test cases and prepare test data.
4. **Test environment setup** — get the test system/build ready.
5. **Test execution** — run the tests, log defects, retest fixes.
6. **Test closure** — report results, capture lessons learned.`,
      analogy: `It's like planning a road trip: decide where you're going (requirements), plan the route and budget (planning), write the itinerary (test design), pack and fuel up (environment), actually drive it (execution), then review the photos and expenses afterward (closure).`,
    },
    {
      id: 'manual-jr-6',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between smoke testing and sanity testing?',
      answer: `- **Smoke testing** — a quick, *broad* check that a new build is stable enough to test at all (do the main features even launch?). Run on every new build; if it fails, the build is rejected before anyone wastes time.
- **Sanity testing** — a narrow, *focused* check that one specific fix or feature works after a change, before deeper testing.

Smoke = wide and shallow; sanity = narrow and deep.`,
      analogy: `Smoke testing is starting a used car to check it turns on, the lights work, and it drives — before bothering with a full inspection. Sanity is, after the mechanic fixes the brakes, specifically test-driving to confirm *the brakes* now work.`,
    },
    {
      id: 'manual-jr-7',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between functional and non-functional testing?',
      answer: `- **Functional** — does the system do *what* it should? (features, business rules). E.g., "transferring money moves the correct amount to the right account."
- **Non-functional** — *how well* does it do it? (performance, security, usability, reliability, compatibility). E.g., "the transfer completes within 2 seconds even with 1,000 users online."

Functional = *what* it does; non-functional = *how well* it does it.`,
      analogy: `Ordering food. **Functional**: "did I get the burger I actually ordered?" **Non-functional**: "did it arrive hot, within 10 minutes, nicely presented, and was the app easy to order on?"`,
    },
    {
      id: 'manual-jr-8',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between black-box, white-box, and grey-box testing?',
      answer: `It's about how much of the internal code the tester can see:

- **Black-box** — test only inputs and outputs, with *no* knowledge of the internal code. (A manual tester's usual view.)
- **White-box** — test *with* full knowledge of the internal code and logic (covering specific paths and branches). Usually done by developers.
- **Grey-box** — *partial* knowledge: you know something internal (the database schema, an API contract) but not all the code, so you can test smarter.`,
      analogy: `A vending machine. **Black-box**: you press B4 and check a snack drops, without seeing inside. **White-box**: the engineer opens it up and inspects the wiring and coils. **Grey-box**: you have the layout map of the coils, so you know exactly which buttons to stress-test.`,
    },
    {
      id: 'manual-jr-9',
      level: 'junior',
      topic: 'Test Design Techniques',
      question: 'What is Boundary Value Analysis (BVA)?',
      answer: `Bugs love edges. BVA tests the values *at and just around the boundaries* of an allowed range, rather than the middle — because off-by-one mistakes hide there.

**Example:** a field accepts **1 to 100**. The values worth testing:

| Value | Why |
|---|---|
| 0 | just below the minimum (should reject) |
| 1 | the minimum (should accept) |
| 100 | the maximum (should accept) |
| 101 | just above the maximum (should reject) |

Testing 50 in the middle rarely finds anything new.`,
      analogy: `It's testing how close you can park to a wall. You don't test parking in the middle of the lot — you test right at the line, one inch before it, and one inch over it. The edges are where you scrape.`,
    },
    {
      id: 'manual-jr-10',
      level: 'junior',
      topic: 'Test Design Techniques',
      question: 'What is Equivalence Partitioning?',
      answer: `Group the inputs into "classes" that should all behave the same way, then test just *one* value from each class instead of all of them — same coverage, far fewer tests.

**Example:** an age field accepts **18–60**. Three classes:
- Below 18 → invalid (test one value, e.g. 10)
- 18–60 → valid (test one value, e.g. 30)
- Above 60 → invalid (test one value, e.g. 70)

Three tests cover the whole range. (It pairs naturally with Boundary Value Analysis — partitions for breadth, boundaries for the edges.)`,
      analogy: `Tasting soup — you don't drink the whole pot to judge it; one spoonful represents the rest because it's all the same mix. Each partition is one well-stirred pot.`,
    },
    {
      id: 'manual-jr-11',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between retesting and regression testing?',
      answer: `- **Retesting** — re-running the *same failed test* on the *same bug* after a fix, to confirm it's truly fixed. Specific and planned.
- **Regression testing** — re-running *other, already-passing* tests to make sure the fix didn't accidentally *break something else*. Broad.

You almost always do both: retest the fix, then regress the surrounding areas.`,
      analogy: `After a plumber fixes a leaking tap: **retesting** is turning *that* tap on to confirm the leak stopped; **regression** is checking the other taps, the shower, and the toilet still work — since they all share the same pipes.`,
    },
    {
      id: 'manual-jr-12',
      level: 'junior',
      topic: 'Test Design',
      question: 'What is positive and negative testing?',
      answer: `- **Positive testing** — feed *valid* input and confirm the system *works* (the "happy path"). Login with correct credentials → success.
- **Negative testing** — feed *invalid or unexpected* input and confirm the system *fails gracefully* (clear message, no crash). Login with a wrong password → friendly error, no crash.

Good testers spend a lot of time on negative cases — that's where the real bugs hide.

**Example:** an "age" field. Positive: type 25 → accepted. Negative: type \`-5\`, \`abc\`, or \`99999\` → does it politely reject, or blow up?`,
      analogy: `Testing a door. Positive testing: the right key opens it. Negative testing: the wrong key, no key, and a hairpin all *fail* to open it — gracefully, without breaking the lock.`,
    },
    {
      id: 'manual-jr-13',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is the difference between an error, a defect/bug, and a failure?',
      answer: `They're three links in a chain:

- **Error (mistake)** — a human mistake by the developer (e.g., wrong logic in the code).
- **Defect / bug** — the flaw that mistake leaves in the product (what testing finds). "Defect" and "bug" are used interchangeably.
- **Failure** — when that defect actually causes wrong behaviour during use (in testing or production).

Chain: **error → defect → failure**. Not every defect becomes a failure (it might sit in code nobody runs).`,
      analogy: `A chef misreads the recipe (**error**), so the cake comes out with salt instead of sugar (**defect**), and the customer bites into it and spits it out (**failure**).`,
    },
    {
      id: 'manual-jr-14',
      level: 'junior',
      topic: 'Test Design',
      question: 'What makes a good test case, and what are its key components?',
      answer: `A good test case is clear enough that *anyone* can run it and get the same result. Key components:

- **ID & Title** — unique, descriptive.
- **Preconditions** — what must be true before you start.
- **Test data** — the exact inputs.
- **Steps** — numbered, unambiguous.
- **Expected result** — what should happen.
- **Actual result & Status** — filled in during execution.

Good qualities: **clear**, **atomic** (tests one thing), **repeatable**, and **traceable** to a requirement.

**Example:** *Title:* Login with valid credentials. *Steps:* 1) open login page 2) enter valid username 3) enter valid password 4) click Login. *Expected:* user lands on the dashboard.`,
      analogy: `A good test case is like a good recipe — exact ingredients (test data), numbered steps, and a clear picture of what the finished dish should look like, so anyone in the kitchen gets the same result.`,
    },
    {
      id: 'manual-jr-15',
      level: 'junior',
      topic: 'Defect Management',
      question: 'What information should a good bug report contain?',
      answer: `Enough that a developer can reproduce it *without asking you anything*:

- **Title** — a clear one-line summary.
- **Steps to reproduce** — numbered and exact.
- **Expected vs Actual result** — what should happen vs what did.
- **Environment** — browser / OS / device / build version.
- **Severity & Priority.**
- **Evidence** — screenshots, video, logs.
- **Test data** used.

A vague report ("login is broken") gets bounced back; a precise one gets fixed fast.`,
      analogy: `It's like reporting a crime. "Something's wrong" is useless — the police need what happened, where, when, and any evidence (photos). A precise bug report is the witness statement that lets the dev solve the case without a follow-up interview.`,
    },
    {
      id: 'manual-jr-16',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between alpha and beta testing?',
      answer: `- **Alpha testing** — done *in-house* by the QA team (and sometimes internal staff), in a controlled environment, before release.
- **Beta testing** — done by *real users* in the real world, on a near-final version, to catch issues the team missed.

Alpha = inside, controlled; Beta = outside, real users, real conditions.`,
      analogy: `A chef tasting a new dish in the kitchen (**alpha**), then handing free samples to a few regular customers for honest feedback before it goes on the menu (**beta**).`,
    },
    {
      id: 'manual-jr-17',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is User Acceptance Testing (UAT)?',
      answer: `The final testing phase where the *actual business users or client* verify the software does what they need in real-world scenarios, before they "accept" it and it goes live.

UAT is about **business fit**, not hunting code bugs — those should already be caught. The question UAT answers is "does this solve our real problem the way we work?"`,
      analogy: `Buying a tailored suit. The tailor's own checks are QA; **UAT** is *you* putting the suit on, moving around in it, and confirming it fits *you* the way you wanted before you pay and take it home.`,
    },
    {
      id: 'manual-jr-18',
      level: 'junior',
      topic: 'Process',
      question: 'What are entry and exit criteria in testing?',
      answer: `- **Entry criteria** — conditions that must be met *before* testing can start. E.g., requirements finalised, build deployed, test cases ready, test environment up.
- **Exit criteria** — conditions that must be met *before* testing is considered done. E.g., all planned tests executed, no open critical/blocker bugs, agreed pass-rate reached.

They're the clear "gates" that stop testing from starting too early or ending too soon.`,
      analogy: `A swimming pool. **Entry criteria**: you must shower first and a lifeguard must be on duty before anyone gets in. **Exit criteria**: the pool only closes once everyone's out and it's been cleaned. Clear conditions to start and to stop.`,
    },
    {
      id: 'manual-jr-19',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is the difference between static and dynamic testing?',
      answer: `- **Static testing** — examining the work *without running the code*: reviews, walkthroughs, and inspections of requirements, design, and code. Catches issues early, when they're cheapest to fix.
- **Dynamic testing** — testing by *actually running* the software and checking its behaviour against expected results.

Static finds problems on paper; dynamic finds them in action. Both matter.`,
      analogy: `Proofreading an essay (**static** — reading it carefully for mistakes) versus reading it aloud to an audience to see how it actually lands (**dynamic**).`,
    },
    {
      id: 'manual-jr-20',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is the difference between QA, QC, and Testing?',
      answer: `- **QA (Quality Assurance)** — *process-focused and preventive*: building good processes so defects don't happen in the first place (standards, reviews, training). A whole-team responsibility.
- **QC (Quality Control)** — *product-focused and detective*: checking the actual product for defects.
- **Testing** — the hands-on activity of running the software to find defects (a core part of QC).

Short version: **QA prevents, QC detects, testing is the detecting work.**`,
      analogy: `Running a safe restaurant kitchen. **QA** = the hygiene rules, staff training, and kitchen process that prevent contamination. **QC** = inspecting the finished plates before they leave the kitchen. **Testing** = the actual tasting and checking of each dish.`,
    },
    {
      id: 'manual-jr-21',
      level: 'junior',
      topic: 'Process',
      question: 'What is a test plan, and what does it typically contain?',
      answer: `A document that defines the *scope, approach, resources, and schedule* of the testing effort. Typical contents:

- **Objective** and **scope** (what's in and out of testing)
- **Test approach / strategy**
- **Entry and exit criteria**
- **Resources and roles** (who does what)
- **Schedule / timeline**
- **Test environment**
- **Risks and mitigations**
- **Deliverables** (what testing will produce)`,
      analogy: `A test plan is the blueprint plus project schedule for testing — like an event plan that spells out what we're testing, who does what, by when, and what "done" looks like.`,
    },
    {
      id: 'manual-jr-22',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is ad-hoc testing?',
      answer: `Informal testing with *no test cases, no documentation, and no plan* — you just explore the application trying to break it, using your experience and intuition. It's quick and unstructured, and good at finding gaps that formal cases miss. The trade-off: it's hard to repeat or measure, since nothing is written down.`,
      analogy: `Wandering a new city with no map and no itinerary, just poking down whatever alley looks interesting. You sometimes stumble onto things a guided tour would never show you — but you can't easily retrace your steps.`,
    },
    {
      id: 'manual-jr-23',
      level: 'junior',
      topic: 'Test Types',
      question: 'What is exploratory testing, and how is it different from ad-hoc testing?',
      answer: `Exploratory testing means *learning, designing, and running* tests at the same time — you explore the app, and what you find guides your next test. Crucially, it's done *with intent*: a goal (a "charter") and notes taken as you go.

**The difference from ad-hoc:** ad-hoc is random with nothing recorded; exploratory is *structured* exploration — purposeful, and documented as you discover.`,
      analogy: `Ad-hoc testing is wandering aimlessly. **Exploratory** testing is being a detective following clues — there's no fixed script, but each discovery points you to where to look next, and you take notes the whole way so you can explain how you got there.`,
    },
    {
      id: 'manual-jr-24',
      level: 'junior',
      topic: 'Process',
      question: 'What is the difference between SDLC and STLC?',
      answer: `- **SDLC (Software Development Life Cycle)** — the whole process of *building* software: requirements → design → development → testing → deployment → maintenance.
- **STLC (Software Testing Life Cycle)** — the *testing-specific* phases that run inside the SDLC: test planning → test design → execution → closure.

STLC is the testing slice that lives within the bigger SDLC.`,
      analogy: `SDLC is making an entire movie — script, shooting, editing, release. STLC is just the editing-and-review track within it: review the footage, flag problems, re-check after fixes.`,
    },
    {
      id: 'manual-jr-25',
      level: 'junior',
      topic: 'Process',
      question: 'What is a Requirement Traceability Matrix (RTM)?',
      answer: `A table that maps each *requirement* to the *test cases* that verify it (and often to the defects found). It proves every requirement is covered by at least one test, and instantly shows any gaps.

**Example:**

| Requirement | Test cases |
|---|---|
| R1 — User can log in | TC1, TC2, TC3 |
| R2 — Password reset | TC4, TC5 |
| R3 — Account lockout | *(none yet — gap!)* |

R3 having no test cases jumps out — that's the RTM doing its job.`,
      analogy: `A packing checklist cross-referenced against your suitcase: every item on the list (requirement) has a tick showing it's actually packed (a test covering it). Anything without a tick is something you're about to forget.`,
    },
    {
      id: 'manual-jr-26',
      level: 'junior',
      topic: 'Practical',
      question: 'How would you test a login page? Give some test cases.',
      answer: `Cover several angles, not just the happy path:

**Functional / positive**
- Valid username + valid password → logs in, lands on dashboard.
- "Remember me" keeps you signed in.
- "Forgot password" link works.

**Negative**
- Valid username + wrong password → clear error, no login.
- Blank username or password → validation message.
- Account locks after N failed attempts.

**Security**
- SQL injection / script text in the fields → safely rejected, no crash.
- Password is masked (shown as dots).
- Session expires after a timeout.

**Non-functional**
- Works across browsers and devices (compatibility).
- Page loads quickly; the form is keyboard- and screen-reader-friendly (usability/accessibility).

Mentioning all these buckets — functional, negative, security, usability, compatibility — is what an interviewer is listening for.`,
      analogy: `Testing a door lock: you confirm the *right* key opens it, the *wrong* key doesn't, *no* key doesn't, a *hairpin* (a hacker) doesn't, and that it still locks behind you. You'd never sign off just because the right key worked once.`,
    },
    // ── Mid (2–5 yrs) ─────────────────────────────────────────
    {
      id: 'manual-mid-1',
      level: 'mid',
      topic: 'Test Strategy',
      question: 'You have far more to test than time allows. How do you decide what to test?',
      answer: `Use **risk-based testing** — prioritise by *risk = likelihood of failure × impact if it fails*.

1. List the features/areas.
2. Score each on **likelihood** (complex, recently changed, historically buggy?) and **impact** (money, safety, how many users?).
3. Test the high-risk areas deepest; give stable, low-impact areas a light smoke check.
4. Clearly communicate what you are **not** testing.

**Example:** an e-commerce release — payment & checkout (high impact, often changing) get deep testing; the "About Us" page (low impact, rarely touched) gets a quick check.`,
      analogy: `It's triage in an emergency room. With limited doctors you don't treat patients first-come-first-served — you treat the most serious *and* urgent cases first. Testing the same way spends your scarce time where failure hurts most.`,
    },
    {
      id: 'manual-mid-2',
      level: 'mid',
      topic: 'Test Design Techniques',
      question: 'What is decision table testing, and when would you use it?',
      answer: `A technique for features where several conditions *combine* into different outcomes. You lay out every combination of the conditions and the expected action for each — so no rule is missed.

**Example:** loan approval based on two conditions:

| Good credit? | Has collateral? | Decision |
|---|---|---|
| Yes | Yes | Approve |
| Yes | No | Approve |
| No | Yes | Review |
| No | No | Reject |

Each row is a test case. It shines whenever you hear "if this AND that, then…" logic.`,
      analogy: `It's a restaurant's combo chart — "if vegetarian AND no nuts → dish X". A grid that spells out every combination of requirements so the kitchen never has to guess.`,
    },
    {
      id: 'manual-mid-3',
      level: 'mid',
      topic: 'Test Design Techniques',
      question: 'What is state transition testing?',
      answer: `For systems that move between **states**, you test the *transitions* — confirming valid moves work and invalid ones are blocked. You map each state and the events that move between them.

**Example:** an order moves \`Placed → Shipped → Delivered\`. You test:
- Valid: Placed → Shipped (allowed)
- Invalid: Delivered → Placed (must be blocked)

Another classic: a bank card that locks after 3 wrong PIN attempts (Active → Active → Active → Locked).`,
      analogy: `A traffic light: green → amber → red → green is valid; green → red (skipping amber) must be impossible. State transition testing checks only the legal moves can happen.`,
    },
    {
      id: 'manual-mid-4',
      level: 'mid',
      topic: 'Test Design Techniques',
      question: 'What is pairwise (all-pairs) testing, and why use it?',
      answer: `When a feature has many input combinations (browser × OS × payment type × language…), testing *every* combination explodes into thousands. **Pairwise testing** covers every *pair* of values at least once — which catches the large majority of combination bugs with a fraction of the tests, because most defects come from *two* factors interacting, not five.

**Example:** 4 factors with 3 options each = 81 full combinations, but a pairwise set might cover all pairs in ~9–15 tests.`,
      analogy: `At a party you can't introduce every guest to every other guest. But making sure every *pair of tables* has at least one shared conversation connects almost everyone, far more efficiently.`,
    },
    {
      id: 'manual-mid-5',
      level: 'mid',
      topic: 'Test Design Techniques',
      question: 'What is use case testing?',
      answer: `Designing tests from **use cases** — the step-by-step ways a user interacts with the system to achieve a goal, including the main flow *and* the alternate/exception flows. It tests real end-to-end journeys, not isolated fields.

**Example:** "Withdraw cash from an ATM":
- **Main flow:** insert card → enter PIN → choose amount → take cash & card.
- **Alternate flows:** wrong PIN, insufficient funds, machine out of cash, card left behind.`,
      analogy: `Rehearsing a play scene-by-scene the way the audience will actually watch it — not just checking each prop works on its own, but that the whole performance flows, including the bits where something goes wrong.`,
    },
    {
      id: 'manual-mid-6',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test a feature when there are no requirements or documentation?',
      answer: `Don't stall — gather the spec from other sources:
- **Ask** the PM, developers, or end users.
- **Explore** the app and similar existing features.
- **Compare** to older versions or competitor products.
- **Apply general standards** (a login should mask the password and lock after repeated failures, a form should validate input).

Then do exploratory testing, **document your assumptions**, get them confirmed, and flag the missing-requirements risk to the team.`,
      analogy: `Cooking a dish with no recipe — you taste as you go, lean on your experience of similar dishes, and ask the head chef when unsure, rather than refusing to cook at all.`,
    },
    {
      id: 'manual-mid-7',
      level: 'mid',
      topic: 'Regression',
      question: 'You cannot re-run the entire regression suite every release. How do you choose what to run?',
      answer: `Prioritise, don't run everything blindly:
- **Change-impacted areas** — what the new code touched, plus anything that depends on it.
- **Business-critical flows** — login, checkout, payments always get checked.
- **Historically fragile areas** — modules that break often.
- **Recently failed tests.**

Keep a small **always-run smoke set**, add the change-impacted tests on top, retire obsolete cases, and automate the stable repetitive ones to free up time.`,
      analogy: `After renovating one room you don't re-inspect the whole house — but you do check the rooms that share plumbing and wiring with it, plus the always-critical things like the smoke alarm.`,
    },
    {
      id: 'manual-mid-8',
      level: 'mid',
      topic: 'Defect Management',
      question: 'A developer says your bug "isn\'t reproducible" or "works on my machine." How do you handle it?',
      answer: `Make it undeniable and help close the gap:
- Provide **exact steps**, **environment** (browser/OS/build/data), **screenshots or video**, **logs**, and the **frequency** (always vs intermittent).
- **Compare environments** — data, config, versions, cache, permissions, and screen size often differ between your setup and theirs.
- **Pair up** and try to reproduce it together.
- Stay factual and collaborative, not defensive — you're both after the same outcome.`,
      analogy: `A car noise that mysteriously vanishes at the mechanic's. You record it on your phone and note exactly when it happens (cold mornings, over 60 mph) so the mechanic can't wave it away — and can actually chase it.`,
    },
    {
      id: 'manual-mid-9',
      level: 'mid',
      topic: 'Process',
      question: 'What is the difference between a test strategy and a test plan?',
      answer: `- **Test strategy** — the high-level, *organisation- or product-level* approach to testing: the types of testing, tools, standards, and environments. Relatively stable; often one per org/product.
- **Test plan** — the *project- or release-specific* details: scope, schedule, resources, and what's being tested right now. Changes with each project.

Strategy is the philosophy; the plan is the to-do list for this release.`,
      analogy: `A sports team's overall game philosophy and playbook (the **strategy**) versus the specific game plan drawn up for this Saturday's particular opponent (the **plan**).`,
    },
    {
      id: 'manual-mid-10',
      level: 'mid',
      topic: 'Test Types',
      question: 'How do you approach cross-browser and device compatibility testing?',
      answer: `You can't test every combination, so be data-driven:
1. Pull your **real user analytics** — which browsers, OS, and devices do your users actually use?
2. Build a **matrix** (browser × OS × screen size) and cover the *top* combinations deeply, the rest lightly.
3. Use **real devices** for the most critical combos and a tool (e.g., BrowserStack) for breadth.
4. Watch for layout breaks, font rendering, responsive breakpoints, and JavaScript behaviour differences.`,
      analogy: `A clothing brand doesn't sew every possible size-and-colour combination — they produce the sizes most customers actually are, and just spot-check the extremes.`,
    },
    {
      id: 'manual-mid-11',
      level: 'mid',
      topic: 'Practical',
      question: 'How would you test a search functionality?',
      answer: `Cover far more than the happy path:
- **Matching:** exact match, partial match, case-insensitivity, relevance/ordering of results.
- **Edge inputs:** no results, empty search, leading/trailing spaces, very long input, special characters.
- **Security:** SQL-injection / script text in the box → safely handled.
- **Behaviour:** autocomplete/suggestions, filters combined with search, pagination of results.
- **Non-functional:** performance on a large dataset.`,
      analogy: `Testing a librarian: ask for an exact title, a partial title, a misspelling, pure gibberish, and a book that doesn't exist — and check each gets a sensible response, not a blank stare or a crash.`,
    },
    {
      id: 'manual-mid-12',
      level: 'mid',
      topic: 'Practical',
      question: 'How would you test a file upload feature?',
      answer: `- **Valid:** allowed types and sizes upload and are retrievable afterward.
- **Invalid:** wrong type (e.g., \`.exe\` where only images allowed), oversized file, zero-byte file, no file selected.
- **Naming:** very long filename, special characters, duplicate names.
- **Security:** a malicious/disguised file is rejected.
- **Resilience:** network interruption mid-upload, cancelling an upload, multiple simultaneous uploads, progress indicator.`,
      analogy: `Testing a parcel drop-box: right-sized parcels fit, oversized ones are refused, empty boxes and suspicious packages are flagged — and you check what happens if someone lets go of the parcel halfway in.`,
    },
    {
      id: 'manual-mid-13',
      level: 'mid',
      topic: 'Practical',
      question: 'How would you test an e-commerce checkout / shopping cart?',
      answer: `- **Cart:** add, remove, update quantity; totals, tax, and discount codes recalculate correctly.
- **Stock & price:** item goes out of stock or changes price while in the cart.
- **Payment:** success, failure, timeout; multiple payment methods; address validation.
- **Integrity:** inventory decrements on purchase; order confirmation + email sent.
- **Edge cases:** back-button or refresh during payment must **not** double-charge; guest vs logged-in checkout; currency handling.`,
      analogy: `A supermarket self-checkout — scanning items, removing one, applying a coupon, a declined card, and simply walking away mid-transaction all have to behave sensibly, not charge you twice or lose your basket.`,
    },
    {
      id: 'manual-mid-14',
      level: 'mid',
      topic: 'Practical',
      question: 'How would you test an API manually, without a UI?',
      answer: `Use a tool like Postman and check:
- **Status codes** — 200/201 for success, 400/401/404/500 for the right error situations.
- **Response body** — correct schema, data types, and values.
- **Inputs** — valid, invalid, missing, and boundary values.
- **Auth** — with a valid token, without one, and with an expired one.
- **Side effects** — after a POST, do a GET to confirm the data actually changed.
- **Non-functional** — response time, and clear error messages.`,
      analogy: `Ordering through a restaurant's kitchen hatch instead of the dining room: you hand in a written order (the request) and inspect exactly what comes back on the tray (the response) — including whether a wrong or rude order is handled politely.`,
    },
    {
      id: 'manual-mid-15',
      level: 'mid',
      topic: 'Strategy',
      question: 'What is the test pyramid, and where does manual testing fit?',
      answer: `A model for balancing automated test types:
- **Base — many unit tests:** fast, cheap, run constantly.
- **Middle — integration / API tests:** fewer, check components work together.
- **Top — few UI / end-to-end tests:** slow and brittle, so keep them minimal.

The idea: catch most bugs cheaply at the bottom. **Manual / exploratory** testing sits *alongside* the top — for things automation can't judge (usability, look-and-feel, exploratory discovery), not for bulk regression.`,
      analogy: `A balanced diet pyramid — lots of the cheap, foundational stuff at the base, only a little of the expensive stuff at the top. Flip it upside-down (mostly slow UI tests) and the whole thing topples: slow, brittle, and expensive.`,
    },
    {
      id: 'manual-mid-16',
      level: 'mid',
      topic: 'Metrics',
      question: 'What defect metrics do you track, and what do they tell you?',
      answer: `- **Defect density** — defects per module/size; points to the most fragile areas.
- **Defect leakage** — bugs that escaped to a later stage or production; measures how effective testing was.
- **Defect age** — how long defects stay open; flags process bottlenecks.
- **Defect removal efficiency** — % of defects caught before release.

Use them to *improve the process*, never to blame individuals — that just makes people hide bugs.`,
      analogy: `A car's dashboard — speed, fuel, and temperature each tell you something different, and you read them *together* to judge the health of the journey. No single gauge is the whole story.`,
    },
    {
      id: 'manual-mid-17',
      level: 'mid',
      topic: 'Defect Management',
      question: 'How do you do root cause analysis on a defect?',
      answer: `Don't stop at the symptom — find *why* it happened. A common technique is the **5 Whys**: keep asking "why" until you reach the underlying cause, then fix *that* (not just the surface bug). Also ask "why didn't testing catch it?" to prevent recurrence.

**Example:**
- Payment failed → *why?* wrong currency rounding → *why?* the requirement never specified rounding rules → **root cause:** ambiguous requirement.
- Fix: not just the code, but the requirements-review process so it can't recur.`,
      analogy: `A doctor treating the disease, not just the symptom. Painkillers stop today's headache, but discovering it's caused by dehydration is what stops tomorrow's.`,
    },
    {
      id: 'manual-mid-18',
      level: 'mid',
      topic: 'Test Types',
      question: 'What is usability testing?',
      answer: `Checking how *easy and pleasant* the product is for real users — can they complete their tasks quickly and intuitively, without confusion or frustration? It focuses on clarity, navigation, consistency, helpful error messages, and friction points, often by watching real users attempt real tasks and noting where they struggle.`,
      analogy: `Handing someone a new TV remote with no manual. If they can change the channel and volume without help, it's usable. If they're squinting, hunting, and muttering, it isn't — no matter how many features it has.`,
    },
    {
      id: 'manual-mid-19',
      level: 'mid',
      topic: 'Test Types',
      question: 'What is accessibility testing, and what would you check?',
      answer: `Making sure people with disabilities can use the product, usually guided by **WCAG** standards. Key checks:
- **Keyboard-only** navigation (no mouse needed) and a sensible focus order.
- **Screen-reader** support — alt text on images, ARIA labels.
- **Colour contrast** sufficient, and no information conveyed by colour *alone*.
- **Text resizing** without breaking the layout; captions for video.

Tools: Axe, Lighthouse, and real screen readers (NVDA, VoiceOver).`,
      analogy: `A building with ramps, braille signs, and lifts — not optional luxuries, but what lets *everyone* get in and use the space. Software needs the same so no user is locked out.`,
    },
    {
      id: 'manual-mid-20',
      level: 'mid',
      topic: 'Test Types',
      question: 'What is the difference between localization and internationalization testing?',
      answer: `- **Internationalization (i18n)** — testing that the app is *built to support* many languages/regions: it handles unicode, varying date/number/currency formats, text that expands when translated, and right-to-left scripts, with no hard-coded assumptions.
- **Localization (l10n)** — testing a *specific* adapted version: correct translations, locally appropriate formats and currency, cultural fit, and no truncated or overlapping text.

i18n is the *capability*; l10n is a *specific* language/region done right.`,
      analogy: `i18n is designing a power strip that *accepts* plugs from any country. l10n is fitting the correct plug for Japan and confirming it actually powers the device there.`,
    },
    {
      id: 'manual-mid-21',
      level: 'mid',
      topic: 'Process',
      question: 'How do you estimate testing effort for a feature?',
      answer: `Break it down, don't guess a single number:
1. List the testing tasks: analysis, test design, execution, retesting, regression.
2. Size each from experience or similar past features (number and complexity of test cases).
3. Add environment/data setup, and a buffer for defects and retesting.
4. Re-estimate as you learn more.

Techniques: experience-based, work-breakdown, or **three-point** (optimistic / likely / pessimistic, averaged).`,
      analogy: `Estimating a road trip — not just the distance, but traffic, rest stops, and a buffer for the unexpected detour. Quoting pure distance always lands you late.`,
    },
    {
      id: 'manual-mid-22',
      level: 'mid',
      topic: 'Exploratory Testing',
      question: 'How do you make exploratory testing structured and accountable?',
      answer: `Use **session-based test management**: run time-boxed sessions (e.g., 60–90 minutes), each with a **charter** — a clear mission like "explore checkout with invalid payment data." Take notes as you go, log defects, and **debrief** afterward (what you covered, what you found, what still feels risky).

It keeps the creativity and adaptability of exploration, but adds coverage tracking and reporting on top.`,
      analogy: `A detective handed a specific case file and a shift to investigate, who files a report at the end. Free to follow hunches, but accountable for the ground they covered.`,
    },
    {
      id: 'manual-mid-23',
      level: 'mid',
      topic: 'Process',
      question: 'It is the day before release and you have not finished testing. What do you do?',
      answer: `Don't silently cut corners. Re-prioritise by risk: make sure the **critical/high-risk flows and the changed areas** are covered, and defer the low-risk, stable areas. Then **communicate clearly** to stakeholders — what's been tested, what hasn't, the known risks, and your recommendation.

The go/no-go is a *business* decision; your job is to give them an honest, complete risk picture so they decide with eyes open.`,
      analogy: `A pilot short on time still completes the *safety-critical* pre-flight checklist and tells the captain what was skipped. They don't quietly skip the engine check to make up minutes.`,
    },
    {
      id: 'manual-mid-24',
      level: 'mid',
      topic: 'Metrics',
      question: 'How do you measure test coverage, and what are its limits?',
      answer: `Coverage comes in two common forms:
- **Requirements coverage** — every requirement maps to at least one test (tracked via an RTM).
- **Code coverage** — the % of code exercised by tests (from developer tools).

The big limitation: high coverage shows *what was touched*, not that it was tested *well*. You can run a line of code without checking the right outcome. So use coverage to find **gaps**, not as a quality guarantee.`,
      analogy: `Visiting every room in a house (coverage) doesn't mean you *inspected* each one — you could walk through without ever checking the taps. Coverage tells you where you've been, not how carefully you looked.`,
    },
    {
      id: 'manual-mid-25',
      level: 'mid',
      topic: 'Defect Management',
      question: 'How do you handle a bug that only happens sometimes (flaky / intermittent)?',
      answer: `Don't dismiss it — hunt the pattern. Capture the **environment, timing, data, sequence, concurrency, and network** conditions each time it appears. Increase logging, run repeatedly, and vary one condition at a time. Common culprits: timing/race conditions, leftover test-data state, caching, async waits, and environment differences.

Even if you can't reproduce it on demand, document the frequency and conditions so it isn't ignored.`,
      analogy: `A rattle in the car that only happens on bumpy roads. You note exactly when it occurs so the mechanic can chase the pattern, instead of shrugging "I can't hear anything."`,
    },
    {
      id: 'manual-mid-26',
      level: 'mid',
      topic: 'Process',
      question: 'When do you decide testing is "done"?',
      answer: `Testing is never truly exhaustive, so "done" is an agreed, risk-based call — you stop when:
- **Exit criteria are met** — planned tests run, no open critical bugs, pass-rate target reached.
- **Risk is acceptably low** — the remaining unknowns aren't worth the cost/time to chase.
- **The defect-find rate has flattened** — lots of effort, very few new bugs.
- **The deadline / budget** is reached and stakeholders accept the residual risk.

It's "good enough for the stakes," not "we found every bug."`,
      analogy: `Proofreading a book — you could always read it once more, but at some point the remaining-error risk is low and the deadline is here. You stop when it's good enough for what's at stake, not when it's provably perfect.`,
    },

    // ── Senior (5+ yrs) ───────────────────────────────────────
    {
      id: 'manual-sr-1',
      level: 'senior',
      topic: 'Test Strategy',
      question: 'How would you build a test strategy for a brand-new product?',
      answer: `Start from the product, users, risks, and business goals — not from a template. Then decide:
- **Scope & test types** — functional, plus the non-functionals that matter here (performance, security, accessibility).
- **Test levels** — the unit / integration / E2E balance.
- **Manual vs automation** — what's worth automating vs exploring by hand.
- **Environments & test data**, **entry/exit criteria & quality gates**, **tools**, **roles**, and **risk priorities**.

Keep it a living document: start lean, mature it as you learn the product.`,
      analogy: `An architect's master plan for a new building. You don't pour concrete first — you assess the site, the purpose, the risks, and the budget, then design how it all comes together.`,
    },
    {
      id: 'manual-sr-2',
      level: 'senior',
      topic: 'Automation',
      question: 'How do you decide what to automate and what to keep manual?',
      answer: `Decide by **ROI**, not by "automate everything":
- **Automate:** stable, repetitive, high-value regression; smoke/sanity; data-driven checks; anything run often across builds.
- **Keep manual:** exploratory testing, usability and look-and-feel, one-off or rapidly-changing features, and complex setups where the automation cost outweighs the benefit.

The rough sum: *(how often it runs × manual cost)* versus *(build + ongoing maintenance cost)*. Maintenance is the part people forget.`,
      analogy: `Automate the dishwasher-safe everyday plates; hand-wash the delicate heirloom china and the one-off party platters. Forcing everything through the machine breaks the things that needed a human touch.`,
    },
    {
      id: 'manual-sr-3',
      level: 'senior',
      topic: 'Agile',
      question: 'How does QA work within an Agile / Scrum team?',
      answer: `QA is **embedded**, not a separate gate at the end:
- Involved from the **start** — review stories, clarify acceptance criteria, help define "done."
- Test **continuously within the sprint** — as each feature lands, not all at the end.
- **Automate alongside** development and pair with developers.
- Give **fast feedback** and treat quality as the whole team's job.`,
      analogy: `A quality inspector who works *on the assembly line* alongside the builders, catching issues as each part is added — not one standing at the very end after everything's already bolted together.`,
    },
    {
      id: 'manual-sr-4',
      level: 'senior',
      topic: 'Strategy',
      question: 'What is shift-left testing (and shift-right)?',
      answer: `- **Shift-left** — test *earlier*. Involve QA in requirements and design, review specs, and write tests up front, so defects are caught when they're cheapest to fix.
- **Shift-right** — test *later, in production*. Monitoring, canary releases, A/B tests, and real-user feedback catch issues that only appear in the real world.

Together they cover the whole lifecycle, not just a testing phase in the middle.`,
      analogy: `Shift-left is proofreading the manuscript *before* it's printed (cheap to fix). Shift-right is reading the reviews *after* publishing to catch what slipped through. The best authors do both.`,
    },
    {
      id: 'manual-sr-5',
      level: 'senior',
      topic: 'Release Management',
      question: 'How do you make a go/no-go release decision when there are still open defects?',
      answer: `Not every open bug blocks a release. For each one, weigh **severity**, **priority**, and whether a **workaround** exists, then map the residual risk:
- Open **critical/blocker** with no workaround → **no-go**.
- Only **minor/cosmetic** issues, or ones with workarounds → can **go**, with a documented known-issues list and a fix plan.

Give a clear, data-backed recommendation. The final call is the business's; QA supplies the honest risk picture.`,
      analogy: `A doctor clearing a patient for a marathon. A blister is fine to run with (documented, manageable); a hairline fracture is not. You give the informed recommendation — the patient makes the call.`,
    },
    {
      id: 'manual-sr-6',
      level: 'senior',
      topic: 'Quality',
      question: 'Bugs keep slipping to production. How do you reduce defect leakage?',
      answer: `Find *where* and *why* they escape before fixing anything — run root-cause analysis on the leaked defects and look for patterns. Then strengthen the weak points:
- **Shift-left** — better requirements and design reviews.
- **Close coverage gaps** in the leaky areas; add automated regression there.
- **Tighten exit criteria / quality gates.**
- **Add production monitoring** to catch escapes fast.
- **Feed every leaked bug back into the test suite** so it can never recur.`,
      analogy: `Water leaking into a basement — you don't just keep mopping. You find the cracks, seal them, and add a sump pump (monitoring) so the next leak is caught the moment it starts.`,
    },
    {
      id: 'manual-sr-7',
      level: 'senior',
      topic: 'Incident Management',
      question: 'A critical bug reached production that testing missed. How do you respond?',
      answer: `1. **Contain it first** — help with the fix or rollback and support the incident response.
2. **Blameless root-cause analysis** — how did it get in, and *why did testing miss it* (a gap in cases, environment, data, or an ambiguous requirement)?
3. **Prevent recurrence** — add a test that would have caught it, fix the underlying process gap, and share the learnings with the team.

Focus on the system that let it through, not on who to blame.`,
      analogy: `An aviation incident review — the goal isn't to fire the pilot, it's to understand the chain of failures and change the procedures so it can never happen the same way again.`,
    },
    {
      id: 'manual-sr-8',
      level: 'senior',
      topic: 'Leadership',
      question: 'How do you mentor junior testers and raise the whole team\'s quality?',
      answer: `- **Pair** on test design and bug investigation so they see your thought process.
- **Review** their test cases and bug reports with specific, constructive feedback.
- Teach the **"why"** behind techniques, not just the steps — and encourage exploratory thinking over rote case-running.
- Give them **ownership** of areas, set up knowledge-sharing, and lead by example on report quality and curiosity.`,
      analogy: `Teaching someone to fish rather than handing them fish. Don't just give them test cases to run — show them how to spot where bugs hide, so they grow into independent testers.`,
    },
    {
      id: 'manual-sr-9',
      level: 'senior',
      topic: 'Test Strategy',
      question: 'How do you apply risk-based thinking when planning testing for a whole project?',
      answer: `Make the risk explicit:
1. With the team, **identify risk areas** — complex, new, recently changed, integration-heavy, business-critical, or historically buggy.
2. **Score** each by *likelihood × impact*.
3. **Allocate testing depth proportional to risk** — heavy on high-risk, light on low.
4. **Document** the assessment and revisit it as the project evolves.

It turns coverage decisions into deliberate, defensible choices instead of "test everything equally."`,
      analogy: `An insurance company prices by risk — it scrutinises the high-risk applicants and fast-tracks the low-risk ones, rather than spending equal effort on everyone.`,
    },
    {
      id: 'manual-sr-10',
      level: 'senior',
      topic: 'Process Improvement',
      question: 'You join a team whose QA isn\'t catching bugs. How do you improve it?',
      answer: `**Diagnose before prescribing.** Look at the patterns in leaked defects, the current process, coverage gaps, environment/data issues, team skills, and how well dev and QA collaborate.

Then target the *biggest* gaps — it might be requirements clarity, regression coverage, or QA being involved too late. Change incrementally, **measure the impact** (is leakage trending down?), and build buy-in rather than imposing a process from above.`,
      analogy: `A doctor doesn't prescribe before diagnosing. You run the tests, find the actual cause of the team's "illness," and treat *that* — instead of guessing at a cure.`,
    },
    {
      id: 'manual-sr-11',
      level: 'senior',
      topic: 'Process',
      question: 'How do you define quality gates or a Definition of Done for QA?',
      answer: `Set clear, objective, *agreed* checkpoints a feature must pass before it moves on — for example: acceptance criteria met, all planned tests executed and passed, no open critical/high defects, code reviewed, automation updated, and accessibility/performance checks done.

The point is to make "done" unambiguous, so half-tested work can't quietly slip through.`,
      analogy: `Airport security gates — you don't board until you've cleared every checkpoint. A quality gate is the same: explicit, non-negotiable conditions before the work proceeds.`,
    },
    {
      id: 'manual-sr-12',
      level: 'senior',
      topic: 'Test Data',
      question: 'What is your strategy for test data management?',
      answer: `Treat test data as a first-class asset — flaky data causes flaky tests. It should be **realistic, sufficient, repeatable, and safe**. Practical approaches:
- **Generate synthetic data**, or **subset and mask** production data (never use raw PII).
- **Seed known states** via scripts so tests start from a predictable point.
- **Reset/refresh** data between runs, and deliberately include **edge cases**.`,
      analogy: `A film set's props department — you need believable, consistent props ready for every scene, safely sourced, and reset between takes. Without that, the whole shoot grinds to a halt.`,
    },
    {
      id: 'manual-sr-13',
      level: 'senior',
      topic: 'CI/CD',
      question: 'What is QA\'s role in a CI/CD pipeline?',
      answer: `Embed automated tests as **pipeline gates** so problems fail fast:
- **Unit & API tests** on every commit.
- **Smoke tests** right after each deploy.
- **Fuller regression** on a schedule or before release.

QA owns *which tests gate which stage*, keeps them **reliable** (a flaky gate that cries wolf is worse than none), and adds monitoring and a rollback path. Manual exploratory testing then runs on the stable builds the pipeline produces.`,
      analogy: `A factory line with automated quality sensors at each station — anything faulty is stopped right there, not discovered later in the finished-goods warehouse.`,
    },
    {
      id: 'manual-sr-14',
      level: 'senior',
      topic: 'Metrics',
      question: 'Which QA metrics actually matter, and which are vanity metrics?',
      answer: `**Matter (outcome-focused):** defect leakage to production, defect removal efficiency, severity of escaped bugs, and time-to-detect. They answer "did quality actually improve?"

**Vanity / easily gamed:** raw test-case count ("we have 5,000 tests!"), number of bugs logged (more isn't better), and pass-percentage alone. They measure *activity*, which is easy to inflate without improving quality.

Track outcomes, and never tie metrics to individual blame.`,
      analogy: `Judging a gym by how many machines it owns (vanity) versus whether its members actually get fitter (outcome). Activity isn't impact.`,
    },
    {
      id: 'manual-sr-15',
      level: 'senior',
      topic: 'Collaboration',
      question: 'A developer or PM disagrees with the severity you assigned a bug. How do you handle it?',
      answer: `Stay objective and **data-driven** — explain the *user impact*, how *often* it happens, and which scenarios it affects, rather than defending an opinion. Listen to their context too (it might be a rare edge case, or there's a workaround).

Remember the split: **severity** is a technical judgement (yours to assess); **priority** is negotiable with the business. If it stays stuck, escalate with facts. The goal is the right outcome, not winning the argument.`,
      analogy: `A building inspector and a contractor disagreeing about a crack — you point to the measurements and the code, not raise your voice. Evidence settles it.`,
    },
    {
      id: 'manual-sr-16',
      level: 'senior',
      topic: 'Regression',
      question: 'Your regression suite has grown huge and slow. How do you keep it manageable?',
      answer: `Treat the suite as a product that needs maintenance:
- **Prune** obsolete and duplicate tests; merge overlapping ones.
- **Prioritise** by risk and change-impact — don't run everything every time.
- **Tag** tests (smoke / critical / full) so you can run targeted subsets.
- **Automate** the stable repetitive ones and **parallelise** execution.
- **Fix or quarantine flaky tests** — they erode trust in the whole suite.`,
      analogy: `A garden — without regular pruning it becomes an overgrown jungle that's slow to walk through. Cut back the dead branches so the healthy ones thrive.`,
    },
    {
      id: 'manual-sr-17',
      level: 'senior',
      topic: 'Architecture',
      question: 'How would you approach testing a microservices-based system?',
      answer: `Test at several levels, and don't lean only on full end-to-end:
- **Each service in isolation** — its own API and behaviour.
- **Interactions between services** — integration and **contract testing**, so a change in one service doesn't silently break the ones that depend on it.
- **Key end-to-end journeys** — a *small* number, since they're slow and brittle.
- **Resilience** — what happens when a service is down or slow? Plus good observability to trace failures.`,
      analogy: `A relay race — you test each runner's individual speed, but you focus on the *baton handoffs* between them (the integration points), because that's where relays are usually won or lost.`,
    },
    {
      id: 'manual-sr-18',
      level: 'senior',
      topic: 'Quality Culture',
      question: 'How do you build a culture where quality is everyone\'s responsibility, not just QA\'s?',
      answer: `Break the "throw it over the wall to QA" mindset:
- Involve QA **early**, and have developers own their **unit tests** and the quality of their own work.
- Define a **shared "done"** and review requirements together.
- Make **defects visible** to the whole team, and celebrate *prevention*, not just bug-finding.

QA shifts from being the sole safety net to a **coach and enabler** of quality across the team.`,
      analogy: `Restaurant hygiene isn't only the inspector's job — every cook washing their hands and every waiter checking plates keeps standards high. One inspector at the end can't rescue a careless kitchen.`,
    },
    {
      id: 'manual-sr-19',
      level: 'senior',
      topic: 'Tooling',
      question: 'How do you decide whether to adopt a new testing tool or process?',
      answer: `Start from the **problem**, not the shiny tool:
1. Define what success looks like (the specific pain you're solving).
2. Run a small **pilot / proof-of-concept** on a real use case.
3. Evaluate fit — team skills, integration with your stack, cost, *maintenance burden*, learning curve, and support.
4. Measure against your success criteria before committing.

Adopt only if it beats the status quo measurably — avoid chasing tools for their own sake.`,
      analogy: `Test-driving a car before buying. You don't pick it for the glossy brochure — you check it actually fits your family, your budget, and your daily route first.`,
    },
    {
      id: 'manual-sr-20',
      level: 'senior',
      topic: 'Non-functional',
      question: 'How do you own the non-functional testing strategy (performance, security, accessibility)?',
      answer: `Treat non-functional requirements as **first-class**, with explicit, measurable targets — e.g., "pages load under 2s at peak load," "WCAG AA," "OWASP Top-10 checks pass."

Plan *when and how* each is tested, with the right tools and specialists, and **bake them into the pipeline and acceptance criteria** — not a panicked check the night before launch. Prioritise by business risk (a banking app weights security far higher than a blog).`,
      analogy: `Building a car — it's not enough that it drives (functional). It must also be safe in a crash, fuel-efficient, and easy to get into. Those aren't optional extras you test the night before launch.`,
    },
    {
      id: 'manual-sr-21',
      level: 'senior',
      topic: 'Metrics',
      question: 'How do you measure whether your testing itself is effective?',
      answer: `Judge it by **outcomes**, not activity:
- **Defect removal efficiency** — the % of defects caught before release (higher is better).
- **Defect leakage trend** — is the number escaping to production going *down* over time?
- **Severity of escapes** — are the ones that slip through getting less serious?
- **Time-to-detect** — are issues found early or late?

Pair these numbers with a qualitative check: *are we testing the right risks?* A team can be busy and still ineffective.`,
      analogy: `Judge a goalkeeper not by how many saves they make, but by how few goals get past them — and how dangerous those few were. The ones that escape tell the real story.`,
    },
    {
      id: 'manual-sr-22',
      level: 'senior',
      topic: 'Strategy',
      question: 'How do you test safely in production?',
      answer: `Use controlled techniques that limit the blast radius:
- **Feature flags** — release to a small % of users, or dark-launch hidden behind a flag.
- **Canary deployments** — roll out to a small subset first, watch the metrics, then expand.
- **A/B tests**, **synthetic monitoring**, and strong **observability/alerting** with a fast **rollback** plan.

The goal is to catch real-world issues staging can't replicate, while keeping any failure small and reversible.`,
      analogy: `A chef putting a new dish on the menu for *one table* first — watching their reaction, ready to pull it — rather than serving it to the whole packed restaurant at once.`,
    },
    {
      id: 'manual-sr-23',
      level: 'senior',
      topic: 'Leadership',
      question: 'How do you balance release speed against quality, and when do you push back?',
      answer: `Make the **risk visible** so the business can decide with eyes open. Low-risk changes can move fast; high-risk areas (payments, data, security) warrant slowing down.

When you push back, do it with **data** — the likely cost of a defect versus the cost of the delay — not "we need more time." And offer **options** (reduce scope, phased rollout, extra monitoring) rather than a flat "no." You're a risk advisor, not a roadblock.`,
      analogy: `A structural engineer signing off a bridge. They'll move fast on a garden footbridge, but they will *not* be rushed on a motorway span — and they explain *why* in terms of consequences, not stubbornness.`,
    },
    {
      id: 'manual-sr-24',
      level: 'senior',
      topic: 'Agile',
      question: 'Requirements keep changing mid-project. How do you keep testing effective?',
      answer: `Build for change instead of fighting it:
- Keep test assets **modular and easy to update**, not giant rigid scripts.
- Lean on **exploratory testing and risk-based prioritisation** over exhaustive pre-written cases.
- Stay close to the PM and devs for **early signals** of change.
- Maintain **traceability** so you instantly know what a change impacts.
- **Automate only the stable parts** — automating a moving target just creates maintenance churn.`,
      analogy: `Sailing in shifting winds — you don't lock the sail in one position and hope. You keep adjusting course toward the destination. Rigidity is what capsizes you.`,
    },
    {
      id: 'manual-sr-25',
      level: 'senior',
      topic: 'Leadership',
      question: 'You are the first QA hire for a new team/product. How do you set up QA from scratch?',
      answer: `Start lean and learn the product, its risks, and the current (probably ad-hoc) practices first. Establish the **essentials** before anything fancy:
- A **bug-tracking** process and a basic **test strategy**.
- **Risk-based priorities** and **smoke/critical** coverage of the core flows.
- A shared **"definition of done."**

Then introduce automation gradually for the stable areas, and start building a **quality culture** (devs owning quality) early. Mature the process as the team grows.`,
      analogy: `Founding a fire department in a new town — you don't open with ten stations. You get one truck, the critical drills, and a working emergency number first, then expand as the town grows.`,
    },
    {
      id: 'manual-sr-26',
      level: 'senior',
      topic: 'Planning',
      question: 'How do you estimate and plan QA capacity across several projects at once?',
      answer: `Map each project's testing needs, risk, and timeline, then **allocate by risk and business priority — not evenly**. Account for the regression load, support/maintenance work, and a buffer for the unexpected. Spot the bottlenecks (shared environments, one key specialist), and use automation to free capacity from repetitive work.

When demand exceeds capacity, be transparent about the trade-offs — *which* areas get lighter coverage and the risk that carries — rather than quietly stretching thin.`,
      analogy: `An ER charge nurse staffing shifts — you put more nurses where the danger and volume are, keep a reserve for emergencies, and you're honest with management when you're too stretched to cover everything safely.`,
    },

  ],
  api: [

    // ── Junior (0–2 yrs) ──────────────────────────────────────
    {
      id: 'api-jr-1',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is an API, and what is API testing?',
      answer: `An **API (Application Programming Interface)** is a contract that lets two pieces of software talk: one sends a *request*, the other sends back a *response* — neither needs to know the other's internals.

**API testing** checks that this layer behaves correctly — right data, right status codes, proper error handling, security, and speed — all *without a UI*.

**Example:**
\`\`\`http
GET /users/123
\`\`\`
\`\`\`json
{ "id": 123, "name": "Asha", "active": true }
\`\`\`
API testing verifies that response: correct status, correct fields, correct values.`,
      analogy: `An API is a **restaurant waiter**. You (one app) give your order (request); the waiter takes it to the kitchen (another system) and brings back your food (response) — you never enter the kitchen. API testing is checking the waiter brings the right dish, handles "we're out of that" politely, and is quick.`,
    },
    {
      id: 'api-jr-2',
      level: 'junior',
      topic: 'REST',
      question: 'What is REST, and what makes an API RESTful?',
      answer: `REST (Representational State Transfer) is a style for web APIs built around **resources** (things like users, orders), each with its own URL, acted on with standard HTTP methods.

Core RESTful principles:
- **Resources have clear URLs** — \`/users/123\`.
- **Standard HTTP methods** for actions — GET, POST, PUT, DELETE.
- **Stateless** — each request carries everything it needs; the server remembers nothing between calls.
- **Standard status codes** and usually **JSON**.`,
      analogy: `REST is a well-organised library: every book (resource) has a fixed shelf address (URL), and you use the same standard actions everywhere — fetch, add, replace, remove. **Stateless** means the librarian doesn't remember your last visit — you show your card every single time.`,
    },
    {
      id: 'api-jr-3',
      level: 'junior',
      topic: 'HTTP',
      question: 'What are the common HTTP methods, and what does each do?',
      answer: `| Method | Purpose |
|---|---|
| **GET** | Read data (no changes) |
| **POST** | Create a new resource |
| **PUT** | Replace an existing resource fully |
| **PATCH** | Update part of a resource |
| **DELETE** | Remove a resource |

**Example:**
\`\`\`http
GET    /users        → list users
POST   /users        → create a user
PUT    /users/123    → replace user 123
PATCH  /users/123    → update part of user 123
DELETE /users/123    → delete user 123
\`\`\``,
      analogy: `Managing a contact list: **GET** = look someone up, **POST** = add a new contact, **PUT** = overwrite their whole card, **PATCH** = just change their phone number, **DELETE** = remove them.`,
    },
    {
      id: 'api-jr-4',
      level: 'junior',
      topic: 'HTTP',
      question: 'What are the HTTP status code categories?',
      answer: `The first digit tells you the family:
- **1xx — Informational** (rare in testing).
- **2xx — Success** (200 OK, 201 Created).
- **3xx — Redirection** (301 Moved Permanently).
- **4xx — Client error**: *you* sent something wrong (400 Bad Request, 404 Not Found).
- **5xx — Server error**: the *server* broke (500 Internal Server Error).

The quick rule: **4xx = your fault, 5xx = their fault.**`,
      analogy: `Ordering at a counter. **2xx** = "here's your order." **4xx** = "you ordered something not on the menu / paid wrong" — your mistake. **5xx** = "the kitchen just caught fire" — their mistake. The first digit tells you who to blame.`,
    },
    {
      id: 'api-jr-5',
      level: 'junior',
      topic: 'HTTP',
      question: 'Which status codes do you check most often in API testing, and what does each mean?',
      answer: `The everyday ones:

| Code | Meaning |
|---|---|
| **200** OK | request succeeded |
| **201** Created | a new resource was created (after POST) |
| **204** No Content | success, but nothing to return (often after DELETE) |
| **400** Bad Request | invalid input from the client |
| **401** Unauthorized | not authenticated (who are you?) |
| **403** Forbidden | authenticated, but not allowed |
| **404** Not Found | the resource doesn't exist |
| **409** Conflict | clashes with current state (e.g., duplicate) |
| **429** Too Many Requests | rate limit hit |
| **500** Internal Server Error | the server crashed |

**Example:** POST a new user → expect **201**; GET a user that doesn't exist → expect **404**.`,
      analogy: `These are the **vital signs** you read off every response — like a nurse glancing at pulse and temperature on every patient before anything else.`,
    },
    {
      id: 'api-jr-6',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between 401 Unauthorized and 403 Forbidden?',
      answer: `- **401 Unauthorized** — you are *not authenticated*. The server doesn't know who you are: missing, invalid, or expired credentials. "Who are you? Log in first."
- **403 Forbidden** — you *are* authenticated, but you're *not allowed*. The server knows exactly who you are, but you lack permission. "I know you, but you can't do that."

The naming is famously misleading: 401 is really about *authentication*, 403 about *authorization*.`,
      analogy: `A members' club. **401** = you're stopped at the door because you didn't show a membership card at all. **403** = your card is valid and they know you — but you're trying to walk into the staff-only room.`,
    },
    {
      id: 'api-jr-7',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between PUT and POST?',
      answer: `- **POST** — *creates* a new resource; the server usually assigns the ID. **Not idempotent** — calling it twice creates two resources.
- **PUT** — *creates or replaces* a resource at a *known* location/ID. **Idempotent** — calling it twice leaves the same result.

**Example:**
\`\`\`http
POST /users        → creates a user, returns new id 123
PUT  /users/123    → replaces user 123 entirely
\`\`\``,
      analogy: `**POST** is mailing a letter to "new customer" — each one opens a brand-new file. **PUT** is writing onto a specific labelled folder — do it twice and the folder just ends up with the same final contents.`,
    },
    {
      id: 'api-jr-8',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between PUT and PATCH?',
      answer: `Both update an *existing* resource, but:
- **PUT** — replaces the **entire** resource. Fields you leave out may be wiped or reset to defaults.
- **PATCH** — updates **only the fields you send**, leaving the rest untouched.

**Example:** a user is \`{ name, email, phone }\`.
\`\`\`http
PATCH /users/123   { "phone": "999" }   → only phone changes
PUT   /users/123   { "phone": "999" }   → name & email may be blanked out!
\`\`\``,
      analogy: `Editing a profile. **PUT** = re-submitting the *whole* form (anything you leave blank gets cleared). **PATCH** = a sticky note saying "just change the phone number, leave everything else alone."`,
    },
    {
      id: 'api-jr-9',
      level: 'junior',
      topic: 'HTTP',
      question: 'What are the parts of an HTTP request?',
      answer: `Four parts:
- **Method** — GET, POST, etc.
- **URL / endpoint** — the resource address, plus any path & query parameters.
- **Headers** — metadata (\`Content-Type\`, \`Authorization\`).
- **Body** — the data payload (for POST/PUT/PATCH).

**Example:**
\`\`\`http
POST /users HTTP/1.1
Authorization: Bearer abc123
Content-Type: application/json

{ "name": "Asha", "email": "asha@x.com" }
\`\`\``,
      analogy: `Posting a parcel: the **action** (send it), the **address** (URL), the **label & customs info** (headers), and the **contents inside** (body).`,
    },
    {
      id: 'api-jr-10',
      level: 'junior',
      topic: 'HTTP',
      question: 'What does an HTTP response contain?',
      answer: `Three parts:
- **Status code** — 200, 404, 500, etc.
- **Headers** — metadata (\`Content-Type\`, caching, etc.).
- **Body** — the returned data, usually JSON.

**Example:**
\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 123, "name": "Asha" }
\`\`\``,
      analogy: `The reply parcel: a **delivery-status sticker** (status code), the **shipping label and handling notes** (headers), and the **actual goods inside** (body).`,
    },
    {
      id: 'api-jr-11',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between request and response headers? Name some common ones.',
      answer: `Headers carry *metadata* about the request or response (not the main data itself).

- **Request headers** (you send): \`Authorization\` (your credentials), \`Content-Type\` (the format you're sending), \`Accept\` (the format you want back).
- **Response headers** (server sends): \`Content-Type\` (the format returned), \`Cache-Control\`, \`Set-Cookie\`.`,
      analogy: `The notes written on an envelope going out (sender's instructions) versus the stamps and handling marks on the reply coming back. Both describe the package — neither is the letter itself.`,
    },
    {
      id: 'api-jr-12',
      level: 'junior',
      topic: 'Data Formats',
      question: 'What is JSON, and why do APIs use it?',
      answer: `**JSON (JavaScript Object Notation)** is a lightweight, human-readable text format for structured data — key/value pairs, arrays, and nesting.

APIs love it because it's compact, easy to read, language-independent, and maps cleanly to objects in almost any programming language.

\`\`\`json
{
  "id": 123,
  "name": "Asha",
  "roles": ["admin", "editor"],
  "active": true
}
\`\`\``,
      analogy: `A clearly labelled form — "name: Asha, age: 30" — that any clerk in any country can read and fill in, versus a rambling paragraph. JSON is that universal labelled form for data.`,
    },
    {
      id: 'api-jr-13',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between path parameters, query parameters, and the request body?',
      answer: `- **Path parameter** — identifies a *specific* resource; part of the URL path: \`/users/123\`.
- **Query parameter** — filters, sorts, or paginates; after the \`?\`: \`/users?status=active&page=2\`.
- **Body** — the data payload for creating/updating (POST/PUT/PATCH), usually JSON.

**Example:**
\`\`\`http
GET /users/123?fields=name,email      ← path = 123, query = fields
POST /users   { "name": "Asha" }      ← body carries the new data
\`\`\``,
      analogy: `Ordering coffee. **Path** = *which* branch (the address). **Query** = your preferences (size=large, milk=oat). **Body** = a detailed custom order written on a card you hand over.`,
    },
    {
      id: 'api-jr-14',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is an API endpoint?',
      answer: `An endpoint is a specific URL where an API receives requests for a particular resource or action — the base URL + a path, usually paired with an HTTP method.

**Example:** \`GET https://api.shop.com/v1/products/42\` — the endpoint for reading product 42.`,
      analogy: `A specific phone extension in a big company. The main number is the API; each extension (endpoint) reaches a specific department for a specific job.`,
    },
    {
      id: 'api-jr-15',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is the difference between SOAP and REST?',
      answer: `- **SOAP** — a strict *protocol*: XML-only, rigid contracts (WSDL), with built-in standards for security and transactions. Heavier and formal. Common in banking/enterprise.
- **REST** — a flexible *architectural style*: usually JSON over HTTP, lightweight and easy to use. The modern default for web and mobile APIs.

In short: **SOAP = strict and heavy; REST = flexible and light.**`,
      analogy: `SOAP is a formal, notarised legal letter in a fixed format. REST is a quick, clear email. Both deliver the message — one is rigid and official, the other flexible and fast.`,
    },
    {
      id: 'api-jr-16',
      level: 'junior',
      topic: 'Security',
      question: 'What is the difference between authentication and authorization in APIs?',
      answer: `- **Authentication** — *who are you?* Verifying identity (login, token, API key).
- **Authorization** — *what are you allowed to do?* Checking that identity's permissions.

Authentication always comes first, then authorization. (This is exactly why **401** means "not authenticated" and **403** means "authenticated but not allowed.")`,
      analogy: `At an airport: **authentication** is showing your passport (proving who you are); **authorization** is your boarding pass deciding which flight and seat you can actually board.`,
    },
    {
      id: 'api-jr-17',
      level: 'junior',
      topic: 'Security',
      question: 'What are the common API authentication methods?',
      answer: `- **API key** — a simple secret string sent in a header or query; identifies the calling app.
- **Basic Auth** — \`username:password\` (base64-encoded) in the header; simple, but must run over HTTPS.
- **Bearer token / JWT** — a token you get after logging in, sent as \`Authorization: Bearer <token>\`; the common choice for REST.
- **OAuth 2.0** — delegated access ("Log in with Google") without sharing your password; used for third-party access.`,
      analogy: `Ways to prove you belong. **API key** = a building keycard. **Basic Auth** = giving your name and password at the desk every time. **Bearer token** = a wristband you get after check-in. **OAuth** = a valet ticket that lets someone use just your car, not your house keys.`,
    },
    {
      id: 'api-jr-18',
      level: 'junior',
      topic: 'HTTP',
      question: 'What does "idempotent" mean, and which HTTP methods are idempotent?',
      answer: `An operation is **idempotent** if doing it multiple times has the *same effect as doing it once*.

- **Idempotent:** GET, PUT, DELETE, HEAD. (GET changes nothing; PUT/DELETE to the same target end in the same final state.)
- **Not idempotent:** POST — each call creates a new resource.

Why it matters: idempotent calls are **safe to retry** after a network glitch, without side effects.`,
      analogy: `A light switch set to "OFF" — flip it once or five times and the light is still off (idempotent). **POST** is like hitting "print" — press it five times and you get five copies.`,
    },
    {
      id: 'api-jr-19',
      level: 'junior',
      topic: 'Tools',
      question: 'What is Postman, and how do you use it for API testing?',
      answer: `Postman is a popular tool for sending API requests and inspecting responses *without writing code*. You:
1. Pick the **method** and enter the **URL**.
2. Add **headers**, **auth**, and a **body** if needed.
3. Hit **Send** and inspect the **status code, response body, and time**.

You can save requests in **collections**, use **variables/environments** (dev vs prod), and add **test scripts** that assert on the response to automate checks.`,
      analogy: `Postman is a TV remote for APIs — instead of rewiring the TV (writing code), you press buttons (set the method, URL, and send) and instantly see what happens on screen (the response).`,
    },
    {
      id: 'api-jr-20',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is CRUD, and how does it map to HTTP methods?',
      answer: `CRUD is the four basic data operations, and each maps to an HTTP method:

| CRUD | HTTP method |
|---|---|
| **C**reate | POST |
| **R**ead | GET |
| **U**pdate | PUT / PATCH |
| **D**elete | DELETE |`,
      analogy: `Managing any list — contacts, to-dos — you **add** (Create/POST), **look at** (Read/GET), **edit** (Update/PUT-PATCH), and **remove** (Delete/DELETE). CRUD names those four verbs; HTTP methods are their web equivalents.`,
    },
    {
      id: 'api-jr-21',
      level: 'junior',
      topic: 'Practical',
      question: 'What do you check when testing an API?',
      answer: `Cover several angles on every endpoint:
- **Status code** — correct for the scenario (200, 201, 404…).
- **Response body** — correct data, schema, field types, and values.
- **Headers** — \`Content-Type\` and others as expected.
- **Response time** — within an acceptable limit.
- **Negative cases** — invalid/missing input returns a proper **4xx** with a clear error message, not a crash.
- **Auth** — works with a valid token; rejected without one or with an expired one.
- **Data integrity** — after a POST/PUT, do a GET to confirm the change actually stuck.
- **Boundary & edge values.**`,
      analogy: `Inspecting a vending-machine delivery: the right snack (body), the "success" light (status), how fast it dropped (time), and what happens with a bent coin or an empty slot (negative cases).`,
    },
    {
      id: 'api-jr-22',
      level: 'junior',
      topic: 'Fundamentals',
      question: 'What is the difference between an API and a web service?',
      answer: `All web services are APIs, but not all APIs are web services.
- A **web service** is an API that works *over a network* (typically HTTP, or SOAP).
- An **API** is the broader term — *any* interface between software components, including local libraries that never touch a network.

In practice for testing, the REST APIs you hit over HTTP are web services.`,
      analogy: `"Vehicle" vs "car." Every car is a vehicle, but vehicles also include bikes and boats. A web service is the *networked* kind of API specifically.`,
    },
    {
      id: 'api-jr-23',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between the Content-Type and Accept headers?',
      answer: `- **Content-Type** — describes the format of the data *you are sending* in the request body, e.g., \`application/json\`.
- **Accept** — tells the server the format *you want back* in the response.

**Example:**
\`\`\`http
Content-Type: application/json   ← "I'm sending JSON"
Accept: application/json         ← "send JSON back, please"
\`\`\``,
      analogy: `At a translation desk: **Content-Type** is "I'm speaking French" (the language going in); **Accept** is "please reply in English" (the language you want out).`,
    },
    {
      id: 'api-jr-24',
      level: 'junior',
      topic: 'HTTP',
      question: 'What is the difference between GET and POST?',
      answer: `- **GET** — *retrieves* data. Parameters go in the URL/query string; no body; **safe and idempotent**; can be cached and bookmarked; visible in logs (so never put secrets in it).
- **POST** — *sends* data to create or process something. Data goes in the **body**; not idempotent; not cached; better for sensitive or large data.`,
      analogy: `**GET** is asking a question through a clear window — everyone can see what you asked. **POST** is handing over a sealed envelope — the contents are tucked in the body, not on display.`,
    },
    {
      id: 'api-jr-25',
      level: 'junior',
      topic: 'Data Formats',
      question: 'What is the difference between JSON and XML?',
      answer: `Both structure data, but:
- **JSON** — lighter, less verbose, easy to read, native to JavaScript; the modern default for REST APIs.
- **XML** — more verbose (every value wrapped in open/close tags), but supports attributes, schemas (XSD), and namespaces; used by SOAP and many legacy systems.

**Example — the same data:**
\`\`\`json
{ "name": "Asha", "age": 30 }
\`\`\`
\`\`\`xml
<person><name>Asha</name><age>30</age></person>
\`\`\``,
      analogy: `JSON is a tidy bullet list. XML is the same information wrapped in labelled opening-and-closing folders for every item — more structure, but more bulk.`,
    },
    {
      id: 'api-jr-26',
      level: 'junior',
      topic: 'REST',
      question: 'How should RESTful API URLs (resources) be structured?',
      answer: `Use **nouns, not verbs**, and let the URL show the hierarchy — the HTTP *method* supplies the action:

- \`/users\` — the collection
- \`/users/123\` — a specific user
- \`/users/123/orders\` — that user's orders

\`\`\`http
GET  /users/123/orders     ✅ noun-based; method = the verb
GET  /getUserOrders?id=123 ❌ verb baked into the URL
\`\`\`
Conventions: plural nouns, lowercase, no action verbs in the path.`,
      analogy: `A REST URL should read like a **postal address** (\`/city/street/house\`), not an instruction (\`/deliverLetterToHouse\`). The address says *where*; the HTTP method (GET/POST/…) says *what to do* there.`,
    },
    // ── Mid (2–5 yrs) ─────────────────────────────────────────
    {
      id: 'api-mid-1',
      level: 'mid',
      topic: 'Practical',
      question: 'Walk me through how you would test a brand-new API endpoint.',
      answer: `1. **Understand the contract** — method, URL, params, request/response schema, auth, and expected status codes (from docs/Swagger or by asking).
2. **Positive:** a valid request returns the right status + body, and the data actually persists (confirm with a GET).
3. **Negative:** missing/invalid/extra fields, wrong types, malformed JSON → correct **4xx** with clear errors.
4. **Boundary values** on every input.
5. **Auth:** valid / missing / invalid / expired token, and permission checks.
6. **Headers & content-type**, and **response time**.
7. **Side effects / data integrity** — verify nothing unexpected changed.
8. **Idempotency**, if the method should be idempotent.`,
      analogy: `Test-driving a new car model — not just "does it start," but reverse, brakes, a full tank, an empty tank, bad fuel, and checking the dashboard reports all of it honestly.`,
    },
    {
      id: 'api-mid-2',
      level: 'mid',
      topic: 'Validation',
      question: 'Checking the status code isn\'t enough — how do you validate a response\'s schema?',
      answer: `A **200** can still return missing fields, wrong types, or unexpected nulls. So validate the *structure*, not just the status: required fields present, correct data types, formats (dates, emails), and array shapes.

In Postman you can assert against a JSON Schema:
\`\`\`js
const schema = {
  type: "object",
  required: ["id", "name"],
  properties: { id: { type: "number" }, name: { type: "string" } }
};
pm.test("matches schema", () => pm.response.to.have.jsonSchema(schema));
\`\`\``,
      analogy: `A parcel can arrive marked "delivered" (200) but contain the wrong item, a broken one, or be half-empty. Schema validation is *opening the box* and checking the contents match the packing list — not just that it arrived.`,
    },
    {
      id: 'api-mid-3',
      level: 'mid',
      topic: 'Security',
      question: 'How do you test a token-based authentication flow?',
      answer: `1. **Login** with valid credentials → returns a token.
2. Use the token on a **protected endpoint** → 200.
3. **No token** → 401.
4. **Invalid / tampered token** → 401.
5. **Expired token** → 401.
6. Token for **user A accessing user B's** resource → 403.
7. **Refresh-token** flow works, if present.

\`\`\`http
Authorization: Bearer eyJhbGciOi...
\`\`\``,
      analogy: `Testing a hotel keycard: it opens *your* room (valid), the front desk re-issues it if lost (refresh), a deactivated card fails (expired), and your card must *not* open someone else's room (authorization).`,
    },
    {
      id: 'api-mid-4',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test a flow where one request depends on the result of a previous one (request chaining)?',
      answer: `Capture a value from the first response and feed it into the next request. For example, \`POST /orders\` returns an \`id\`, which \`GET /orders/{id}\` then uses.

In Postman, save it in the **Tests** tab and reference it later:
\`\`\`js
pm.environment.set("orderId", pm.response.json().id);
// next request URL: GET /orders/{{orderId}}
\`\`\`
This tests realistic end-to-end flows: create → read → update → delete.`,
      analogy: `A relay race — the baton (the id or token) from the first runner has to be passed cleanly to the next, or the whole sequence falls apart.`,
    },
    {
      id: 'api-mid-5',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you run the same API test against many inputs (data-driven testing)?',
      answer: `Move the inputs into a **data file** (CSV or JSON) and run the request once per row, asserting the expected outcome for each. In Postman, the Collection Runner takes a data file; in code, you parametrise the test.

**Example** data file:
\`\`\`json
[
  { "user": "valid@x.com",  "pass": "good",  "expected": 200 },
  { "user": "valid@x.com",  "pass": "wrong", "expected": 401 },
  { "user": "",             "pass": "good",  "expected": 400 }
]
\`\`\`
Great for boundary/equivalence sets and many user types without copy-pasting tests.`,
      analogy: `One quality-control template applied to every item coming off the line — same checks, different units — instead of writing a fresh inspection sheet for each one.`,
    },
    {
      id: 'api-mid-6',
      level: 'mid',
      topic: 'Practical',
      question: 'What negative scenarios do you test for an API?',
      answer: `- Missing required fields; wrong data **types**; extra/unknown fields.
- Invalid values & formats; **boundary** violations; malformed JSON; wrong \`Content-Type\`.
- **Auth:** missing / invalid / expired token; accessing another user's resource.
- Oversized payloads; SQL/script **injection** in fields.
- Nonexistent resource (**404**); unsupported method (**405**).

In every case, confirm a proper **4xx** with a clear error message that doesn't leak internals.`,
      analogy: `Stress-testing a form by feeding it everything it shouldn't accept — blank, gibberish, a whole novel, an emoji, an attack string — and checking it says "no" politely instead of crashing or spilling its guts.`,
    },
    {
      id: 'api-mid-7',
      level: 'mid',
      topic: 'HTTP',
      question: 'Some APIs return 200 OK but include an error inside the body. How do you handle and test that?',
      answer: `It's a common (if poor) design where the HTTP layer says "OK" but the *business result* is a failure:
\`\`\`json
{ "success": false, "error": "Insufficient funds" }
\`\`\`
Don't rely on the status code alone — also assert on the body's \`success\` flag and \`error\` fields. Flag the design to the team (it breaks REST conventions and confuses clients), but test what's actually built.`,
      analogy: `A parcel marked "delivered" but the note inside says "item out of stock." The tracking sticker lied — you have to read the note too.`,
    },
    {
      id: 'api-mid-8',
      level: 'mid',
      topic: 'Tools',
      question: 'How do you write automated assertions in Postman?',
      answer: `In the request's **Tests** tab, using JavaScript with \`pm.test()\` and \`pm.expect()\`. Assert on status, body fields, schema, headers, and response time:

\`\`\`js
pm.test("status is 201", () => pm.response.to.have.status(201));

const body = pm.response.json();
pm.test("returns an id", () => pm.expect(body.id).to.exist);
pm.test("name is correct", () => pm.expect(body.name).to.eql("Asha"));
pm.test("fast enough", () => pm.expect(pm.response.responseTime).to.be.below(800));
\`\`\`
Run them across a collection (and in CI via Newman).`,
      analogy: `Taping a checklist to the machine that ticks *itself* on every run — instead of eyeballing the output by hand each time.`,
    },
    {
      id: 'api-mid-9',
      level: 'mid',
      topic: 'Tools',
      question: 'What are environments and variables in Postman, and why use them?',
      answer: `**Variables** hold reusable values (base URL, token, ids) so you never hard-code them. **Environments** are named sets of those variables — Dev, Staging, Prod — that you switch between, so the *same* collection runs anywhere by flipping the environment.

It also keeps secrets out of the request itself and makes promoting tests across environments painless.`,
      analogy: `A stage play performed in different theatres: the *script* (collection) stays the same, but the set and props (the environment) swap per venue. You don't rewrite the play for each city.`,
    },
    {
      id: 'api-mid-10',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test a paginated API endpoint?',
      answer: `- **Page size** is honoured; the right number of items per page.
- **Navigation** works — next/prev, or offset/limit, or cursor.
- **Total count** is correct; **ordering** is consistent across pages.
- **Edge cases:** first and last page; a page *beyond* the range returns empty (not an error); invalid params (negative, huge, non-numeric) handled.
- **No duplicates or missing items** when you walk every page.`,
      analogy: `Reading a multi-page report — each page has the right number of rows, no row is repeated or skipped between pages, and asking for "page 999" of a 3-page report gives you an empty page, not a crash.`,
    },
    {
      id: 'api-mid-11',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test API rate limiting?',
      answer: `- Send requests **beyond** the allowed rate → expect **429 Too Many Requests**.
- Check the **\`Retry-After\`** header tells the client when to try again.
- Confirm the limit **resets** after the time window.
- Verify the limit is scoped correctly (per user / IP / API key).
- Confirm **normal** usage isn't accidentally blocked.`,
      analogy: `A theme-park ride that allows N people per hour — push past the limit and you're told "come back in X minutes" (\`Retry-After\`), and once the hour resets you're let in again.`,
    },
    {
      id: 'api-mid-12',
      level: 'mid',
      topic: 'REST',
      question: 'What is API versioning, and how do you test across versions?',
      answer: `Versioning (e.g., \`/v1/\`, \`/v2/\`, or a header) lets an API evolve without breaking existing clients. To test:
- **v1 still behaves exactly as before** (backward compatibility) — this is the big one.
- **v2's new behaviour** works as specified.
- **Deprecation warnings** appear where promised.
- Clients pinned to v1 are **unaffected** by v2 changes.`,
      analogy: `A phone app update that keeps the old version working for people who haven't upgraded — you test that *both* the old and new versions still do their job.`,
    },
    {
      id: 'api-mid-13',
      level: 'mid',
      topic: 'Performance',
      question: 'How do you check an API\'s response time, and what counts as a basic performance check?',
      answer: `Assert response time stays under a threshold and measure it under *realistic* data volumes:
\`\`\`js
pm.test("under 800ms", () => pm.expect(pm.response.responseTime).to.be.below(800));
\`\`\`
Run repeatedly for consistency, and watch for slow database queries behind the endpoint. Note: timing a *single* request isn't load testing — measuring behaviour under many concurrent users is a separate, dedicated effort.`,
      analogy: `Timing how fast the waiter returns with *one* order is useful — but it's not the same as seeing how the kitchen copes on a packed Friday night (that's load testing).`,
    },
    {
      id: 'api-mid-14',
      level: 'mid',
      topic: 'HTTP',
      question: 'How do you test that an endpoint is idempotent?',
      answer: `Call it multiple times with the same input and verify the end state doesn't change after the first call:
- \`PUT /users/123\` twice → same final user, not two.
- \`DELETE /users/123\` twice → the second returns 404 or 204, with no error or extra effect.
- \`POST\` with an **idempotency key** → two calls with the same key create only **one** resource.`,
      analogy: `Pressing a lift's "call" button repeatedly — the lift still comes once. Extra presses don't summon five lifts.`,
    },
    {
      id: 'api-mid-15',
      level: 'mid',
      topic: 'Test Design',
      question: 'Your API depends on another service that isn\'t ready or is flaky. How do you test around it?',
      answer: `Use a **mock / stub** that returns canned responses in place of the real dependency, so you can:
- Test your API in **isolation**, deterministically.
- Simulate the dependency's **success, errors, slowness, and edge cases** on demand (e.g., "what if the payment service times out?").

Tools: Postman mock servers, WireMock, etc. Keep a few *real* integration tests too, so the mock doesn't drift from reality.`,
      analogy: `A film shoot using a green screen or a stand-in when the real location isn't available — you film the scene against a controllable fake so production doesn't grind to a halt.`,
    },
    {
      id: 'api-mid-16',
      level: 'mid',
      topic: 'Security',
      question: 'What is CORS, and how can it affect API testing?',
      answer: `**CORS (Cross-Origin Resource Sharing)** is a *browser* security rule controlling which web origins may call an API. It involves a preflight \`OPTIONS\` request and \`Access-Control-Allow-Origin\` headers.

The testing catch: tools like **Postman and curl bypass CORS**, so a call that works perfectly in Postman can still *fail in the browser*. For browser clients, test the CORS headers and preflight behaviour explicitly.`,
      analogy: `A bouncer who only checks IDs for people arriving *on foot* (browsers) but waves through the back-door deliveries (Postman). A test that only uses the back door misses the front-door rules entirely.`,
    },
    {
      id: 'api-mid-17',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test a webhook?',
      answer: `A webhook is a *reverse* API — the server calls **your** URL when an event happens, instead of you polling it. To test:
1. Register a listener endpoint (or use a tool like webhook.site / RequestBin).
2. **Trigger the event** and verify the webhook fires with the correct payload, headers, and timing.
3. Test **retries** on failure, **signature verification** (security), and **idempotency** for duplicate deliveries.`,
      analogy: `Instead of you repeatedly phoning the shop "is my order ready?" (polling), the shop calls *you* when it's done (webhook). You test that they actually call, say the right thing, and try again if you don't pick up.`,
    },
    {
      id: 'api-mid-18',
      level: 'mid',
      topic: 'Validation',
      question: 'How do you verify data integrity between an API and the database?',
      answer: `After a write through the API (POST/PUT/DELETE), confirm the change was *correctly persisted* — either with a follow-up **GET**, or by querying the **database directly**. Check the values, types, related records, and that nothing extra changed.

This catches the nasty case where the API *returns success* but actually stored wrong, partial, or duplicated data.`,
      analogy: `After telling the bank to transfer money and getting a "done" message, you still check the actual account balance — you don't just trust the confirmation screen.`,
    },
    {
      id: 'api-mid-19',
      level: 'mid',
      topic: 'Fundamentals',
      question: 'What is the difference between API testing and integration testing?',
      answer: `- **API testing** focuses on a *single* API's behaviour — its contract, responses, status codes, and error handling.
- **Integration testing** checks that *multiple components or services work together* — it often *uses* API calls, but verifies the end-to-end interaction (API + database + downstream services).

API testing is frequently a tool *within* integration testing, but with a narrower focus.`,
      analogy: `API testing is checking that one musician plays their part correctly. Integration testing is the whole band playing together, in time.`,
    },
    {
      id: 'api-mid-20',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you write assertions when the response contains dynamic values (ids, timestamps)?',
      answer: `Don't hard-code volatile values. Instead:
- Assert on **type / format / presence** (e.g., \`id\` is a number > 0, a timestamp matches the ISO format).
- Use **schema validation** for shape.
- **Capture** generated values into variables for later steps in the flow.
- Assert the **stable business fields** exactly, and the volatile ones loosely.`,
      analogy: `Checking a receipt — you verify the total and the items (stable), not the exact transaction timestamp or receipt number (which change every single time).`,
    },
    {
      id: 'api-mid-21',
      level: 'mid',
      topic: 'Security',
      question: 'What basic security checks do you run on an API?',
      answer: `- **Auth required** on protected endpoints (no token → 401).
- **Authorization enforced** — you can't read or change another user's data (→ 403).
- **HTTPS** enforced; no sensitive data (passwords, tokens) in responses or logs.
- **Injection** inputs (SQL / script) handled safely.
- **Rate limiting** present.
- **Error messages** don't leak internals (stack traces, DB names, versions).
- **Method restrictions** — no unexpected verbs allowed.`,
      analogy: `Checking a building's security: every door needs a badge (auth), staff can't enter rooms above their clearance (authorization), no keys are left under the mat (exposed secrets), and the alarm doesn't print the safe combination when it errors out.`,
    },
    {
      id: 'api-mid-22',
      level: 'mid',
      topic: 'Debugging',
      question: 'An API call returns 500. How do you investigate?',
      answer: `**500 = a server-side fault.** Steps:
1. Re-check your request is actually valid (rule out something that should be a 400).
2. Read the **response body / error id** for clues.
3. Check the **server logs** — that's where the real stack trace lives.
4. Verify the **environment, data, and dependencies** (is the DB up? a downstream service?).
5. **Reproduce minimally** and check if it's data-specific or always.
6. Hand devs the request, response, timestamp, and correlation id.`,
      analogy: `A "kitchen error" when ordering — first confirm your order was sane, then ask the kitchen (the logs) what actually went wrong, instead of guessing from the dining room.`,
    },
    {
      id: 'api-mid-23',
      level: 'mid',
      topic: 'Practical',
      question: 'How do you test file upload through an API?',
      answer: `Uploads use \`multipart/form-data\`. Test:
- **Valid** file types and sizes upload and are retrievable.
- **Invalid type** rejected; **oversized** file → 413/400; **empty / no** file handled.
- **Naming:** long names, special characters, duplicates.
- **Security:** a malicious or disguised file is rejected.
- **Resilience:** interrupted upload, cancelled upload, concurrent uploads, correct \`Content-Type\`.`,
      analogy: `The same checks as a manual file-upload, but you're handing the parcel through the *API hatch*: right size fits, oversized is refused, and a suspicious package gets flagged.`,
    },
    {
      id: 'api-mid-24',
      level: 'mid',
      topic: 'Security',
      question: 'Auth tokens expire midway through a long test run. How do you handle it?',
      answer: `**Automate token refresh** so tests don't depend on a token going stale:
- A **pre-request step** that fetches or refreshes the token when needed and stores it in a variable all requests share.
- Or re-login on a **401** and retry the request.

Also test the expiry behaviour itself: an expired token must return **401**.`,
      analogy: `A day-pass that expires at noon — you set up an auto-renew at the gate so you're never stranded mid-visit, and you *also* test that an expired pass is correctly turned away.`,
    },
    {
      id: 'api-mid-25',
      level: 'mid',
      topic: 'Debugging',
      question: 'How do you trace a single request across multiple services?',
      answer: `Use a **correlation ID** — a unique id attached to a request (often a header like \`X-Request-ID\`) and passed through *every* downstream service and log entry.

In testing, send or capture it, then use it to follow that one request through all the logs when debugging a failure that spans several services.`,
      analogy: `A tracking number on a parcel that every depot scans along the way — you can follow that one package across the whole delivery network, instead of guessing where it got lost.`,
    },
    {
      id: 'api-mid-26',
      level: 'mid',
      topic: 'Fundamentals',
      question: 'How does testing a GraphQL API differ from testing a REST API?',
      answer: `REST has *many* endpoints, each a fixed shape. GraphQL has *one* endpoint where the client **asks for exactly the fields it wants** in a query. So testing differs:
- Validate the response returns **precisely the requested fields** — no over- or under-fetching.
- Errors usually come back as **200 with an \`errors\` array**, not via HTTP status — assert on the body.
- Test the **schema**, nested queries, and **query depth/complexity limits** (to prevent abuse).`,
      analogy: `REST is a fixed-menu restaurant (each dish is preset). GraphQL is a build-your-own bowl — you specify exactly the ingredients. You test that you get precisely what you asked for, no more and no less.`,
    },

    // ── Senior (5+ yrs) ───────────────────────────────────────
    {
      id: 'api-sr-1',
      level: 'senior',
      topic: 'Test Strategy',
      question: 'How would you build an API testing strategy?',
      answer: `Start from **risk**, not from "test everything." Define:
- **Scope & risk** — critical endpoints, data-sensitive flows, high-traffic paths.
- **Test levels** — unit, **contract**, integration, and a thin layer of E2E.
- **Automate vs explore** — automate stable/regression, explore the new.
- **Environments & test data**, **auth handling**, and **tooling**.
- **CI integration** — what gates a merge vs runs nightly.
- **Non-functional** — performance and security coverage.
- **Reporting** — clear pass/fail and trends.`,
      analogy: `A city's transport plan — you don't maintain every street equally. You make sure the highways (critical APIs) are solid and monitored, with a schedule for upkeep (CI) and a plan for emergencies (monitoring).`,
    },
    {
      id: 'api-sr-2',
      level: 'senior',
      topic: 'Contract Testing',
      question: 'What is contract testing, and why does it matter for microservices?',
      answer: `Contract testing verifies that a **provider** API and its **consumers** agree on the request/response shape — *without* spinning up the whole system for full end-to-end tests.

In **consumer-driven** contracts (e.g., Pact), each consumer declares what it expects, and the provider is tested against those expectations in CI. So if a team changes an API in a way that breaks a consumer, it's caught **immediately**, not in production.`,
      analogy: `Two builders constructing a tunnel from opposite ends agree the exact size of the connecting pipe first. Contract testing keeps checking both halves still match that agreed spec — so they actually line up when they meet in the middle.`,
    },
    {
      id: 'api-sr-3',
      level: 'senior',
      topic: 'Strategy',
      question: 'Where should you focus testing — unit, API, or UI?',
      answer: `Follow the **test pyramid**: many fast **unit** tests, a strong layer of **API/integration** tests, and only a *few* slow **UI/E2E** tests.

The API layer is the sweet spot — it's far more **stable** than UI tests, **faster** to run, and **broader** than unit tests, so it gives the best return. Push coverage *down* to the API layer wherever you can, and reserve UI tests for genuine user-journey checks.`,
      analogy: `A pyramid: wide and cheap at the base, narrow and expensive at the top. The API layer is the sturdy middle that carries most of the load. Flip it (mostly UI tests) and it topples — slow and brittle.`,
    },
    {
      id: 'api-sr-4',
      level: 'senior',
      topic: 'Performance',
      question: 'How do you approach API performance and load testing?',
      answer: `1. **Define goals/SLAs** — throughput, latency percentiles (p95/p99), error rate under load.
2. **Pick the critical/high-traffic endpoints.**
3. **Model realistic load profiles** — normal, peak, **stress** (beyond peak), **soak** (sustained), and **spike**.
4. Run in a **production-like** environment with production-like data, and **monitor server resources** too.
5. Find the **breaking point** and the **bottleneck** (DB? a downstream call?).

Tools: JMeter, k6, Gatling.`,
      analogy: `Stress-testing a bridge — not just "can one car cross," but rush-hour traffic, an overloaded truck, and days of continuous use, all while watching for cracks.`,
    },
    {
      id: 'api-sr-5',
      level: 'senior',
      topic: 'Security',
      question: 'How do you approach API security testing?',
      answer: `Use the **OWASP API Security Top 10** as your checklist. The big ones:
- **BOLA (Broken Object-Level Authorization)** — can user A fetch user B's record just by changing an id? The #1 API risk.
- **Broken authentication** — weak/▢missing token checks.
- **Excessive data exposure** — the API returns more fields than the client should see.
- **Lack of rate limiting**, **broken function-level authorization**, **injection**, **security misconfiguration**.

Combine manual probing, automated scanners, and an explicit **auth/permission matrix**, and bake checks into CI.`,
      analogy: `A bank security audit — not just "is the front door locked," but: can a customer open *someone else's* deposit box (BOLA), is the vault on a timer, are there too many master keys floating around, and does an error message accidentally reveal the floor plan?`,
    },
    {
      id: 'api-sr-6',
      level: 'senior',
      topic: 'Architecture',
      question: 'How do you test APIs in a microservices architecture?',
      answer: `Layer it, and don't lean on giant brittle E2E:
- **Each service in isolation** — its own API and behaviour.
- **Contract tests between services** — so a change in one doesn't silently break its consumers.
- **A small set of integration tests** for key cross-service journeys.
- **Resilience tests** — what happens when a dependency is down or slow?
- **Observability/tracing** so failures can be followed across services.`,
      analogy: `A relay race — you test each runner's speed individually, but you focus on the *baton handoffs* (the contracts between services), because that's where relays are usually won or lost.`,
    },
    {
      id: 'api-sr-7',
      level: 'senior',
      topic: 'Test Data',
      question: 'How do you manage test data for API testing at scale?',
      answer: `- **Generate synthetic data**, or use **masked production subsets** (never raw PII).
- **Seed** known states via setup API calls or scripts so tests start predictably.
- **Isolate** data per test/run (namespacing) so parallel tests don't collide.
- **Clean up** afterward, or use ephemeral/disposable data.
- Keep it **repeatable** and version-controlled — treat test data as code.`,
      analogy: `A film set's props department — believable, consistent props ready for every scene, safely sourced, reset between takes, and labelled so two productions never grab the same prop at once.`,
    },
    {
      id: 'api-sr-8',
      level: 'senior',
      topic: 'CI/CD',
      question: 'How do you integrate API tests into CI/CD?',
      answer: `Gate the *fast, reliable* tests and run the heavy ones asynchronously:
- **On every commit/PR** — contract + smoke tests gate the merge.
- **Pre-deploy / nightly** — fuller regression and integration suites.
- Run in **containerised, ephemeral environments** with externals **mocked** for determinism.
- **Fail fast**, surface clear reports, manage **secrets** securely, and keep tests **non-flaky** so a red build genuinely means broken.`,
      analogy: `Quality sensors at each station on a factory line — a faulty build is stopped right there, not discovered later in the finished-goods warehouse.`,
    },
    {
      id: 'api-sr-9',
      level: 'senior',
      topic: 'Versioning',
      question: 'How do you handle API versioning and backward compatibility in your testing strategy?',
      answer: `- Keep a **regression suite per supported version**.
- On any change, run the **old version's contract tests** to *prove* backward compatibility.
- Classify changes: **breaking** (removing/renaming fields, changing types, tightening validation) vs **non-breaking** (adding *optional* fields).
- Test **deprecation paths** and migration, and automate compatibility checks **against the spec**.`,
      analogy: `A power company changing the grid — they make sure old appliances still work (backward compatible) and give plenty of notice before retiring an old socket type (deprecation).`,
    },
    {
      id: 'api-sr-10',
      level: 'senior',
      topic: 'Test Design',
      question: 'How do you use mocking / service virtualization strategically?',
      answer: `**Mock** the dependencies that are unstable, slow, costly, or not-yet-built — so your tests are fast, deterministic, and can simulate edge cases (errors, latency, timeouts) on demand.

But keep a **smaller set of real integration/contract tests**, so the mocks don't quietly **drift** from how the real service actually behaves. The balance: mock for speed and isolation, verify against the real thing for truth.`,
      analogy: `Flight simulators for pilot training — cheap, safe, and able to simulate engine failure on demand. But pilots still need real flight hours, so the simulator's assumptions don't drift from reality.`,
    },
    {
      id: 'api-sr-11',
      level: 'senior',
      topic: 'Reliability',
      question: 'How do you keep API tests reliable and non-flaky?',
      answer: `Common causes of flakiness: shared/leftover **data**, **timing/async** waits, real **external** dependencies, hard-coded **volatile** values, and **order dependencies** between tests.

Fixes: isolated/fresh test data, proper **polling/waits** for async, **mock** externals, assert on **stable fields/schema** (not exact volatile values), make every test **independent and order-agnostic**, and **quarantine then fix** flaky tests fast.`,
      analogy: `A smoke alarm that keeps false-alarming gets its battery pulled — and then it's worse than useless. A reliable test suite keeps its authority; a flaky one gets ignored exactly when it matters.`,
    },
    {
      id: 'api-sr-12',
      level: 'senior',
      topic: 'Async',
      question: 'How do you test event-driven or asynchronous APIs (queues, Kafka)?',
      answer: `The API often responds **202 Accepted** while the real work happens later, so you can't assert immediately. Test:
- The **message is published** with the correct schema/payload.
- The **consumer processes** it correctly.
- The **eventual state** is right — *poll or await* with a timeout (eventual consistency).
- **Ordering and duplicates** are handled.
- **Failures** route to a **retry / dead-letter queue**, and processing is **idempotent**.`,
      analogy: `Posting a letter versus a phone call — you don't get an instant answer. You confirm it was *sent*, then later confirm it *arrived and was acted on*. Testing async is checking the whole delayed journey, not just the drop into the postbox.`,
    },
    {
      id: 'api-sr-13',
      level: 'senior',
      topic: 'Monitoring',
      question: 'How do you monitor APIs in production?',
      answer: `This is **shift-right** testing. Use:
- **Synthetic monitoring** — scripted requests hit key endpoints on a schedule and alert on failure or slowness.
- **Real-user metrics** — error rate, latency percentiles (p95/p99), uptime.
- **Distributed tracing** to follow requests across services.
- **SLOs and alerts** so the right people are paged the moment something drifts.`,
      analogy: `A hospital patient monitor that beeps on abnormal vitals — continuous checks in the live environment, alerting the instant something's off, rather than waiting for the next scheduled check-up.`,
    },
    {
      id: 'api-sr-14',
      level: 'senior',
      topic: 'Regression',
      question: 'How do you keep a large API regression suite maintainable?',
      answer: `Treat the suite as a product:
- **Prune** obsolete and duplicate tests; merge overlapping ones.
- **Prioritise** by risk and change-impact — don't run everything every time.
- **Tag** tests (smoke / critical / full) to run targeted subsets.
- **Parallelise** execution and reuse setup via fixtures/helpers.
- Lean on **contract tests** to reduce heavy E2E, and **fix flaky tests** promptly.`,
      analogy: `A garden — without regular pruning it turns into a slow, tangled jungle. Cut back the dead branches so the healthy ones thrive.`,
    },
    {
      id: 'api-sr-15',
      level: 'senior',
      topic: 'Dependencies',
      question: 'How do you handle testing when your API depends on third-party services?',
      answer: `- **Mock** them for the bulk of tests — deterministic, with no cost, rate limits, or downtime.
- Keep a **small set of real "sanity" tests** against their **sandbox** to catch when *they* change.
- Explicitly test how **your** system handles **their** failures — timeouts, 5xx, malformed responses, slow replies.
- Never let a third-party outage fail *your* CI pipeline.`,
      analogy: `A restaurant with a backup supplier that also tests its recipes with substitute ingredients — so one supplier's bad day doesn't shut the whole kitchen down.`,
    },
    {
      id: 'api-sr-16',
      level: 'senior',
      topic: 'Contract Testing',
      question: 'How do you use an OpenAPI / Swagger spec in your testing?',
      answer: `Treat the spec as the **contract**:
- **Validate** that real responses conform to it (schema, status codes, types).
- **Auto-generate** tests and mocks from it.
- **Detect drift** between the spec and the actual implementation.
- Adopt **contract-first**: design the spec, then test against it *before/while* building — a form of shift-left.

Tools: Dredd, Schemathesis, or importing the spec into Postman.`,
      analogy: `Building from an approved architectural blueprint — you continuously check the actual building matches the plans, and catch deviations early instead of at the final inspection.`,
    },
    {
      id: 'api-sr-17',
      level: 'senior',
      topic: 'Distributed Systems',
      question: 'How do you test retries and idempotency in a distributed system?',
      answer: `Networks fail, so clients retry — and retries must **not** double-charge or duplicate. Test:
- An **idempotency key** makes repeated POSTs create only **one** resource.
- Retried PUT/DELETE are **safe** (same end state).
- **Simulate** timeouts and failures, and verify the **retry + backoff** behaviour.
- Confirm **no duplicate side effects**, and that permanent failures hit a **dead-letter** path.`,
      analogy: `You press "Pay," the screen freezes, so you press it again. The system *must* charge you once, not twice. Testing this means deliberately freezing the screen and confirming the bill is still correct.`,
    },
    {
      id: 'api-sr-18',
      level: 'senior',
      topic: 'Resilience',
      question: 'How do you test API resilience (chaos testing)?',
      answer: `Deliberately **inject failure** and confirm the system degrades *gracefully* rather than collapsing:
- Kill or slow a dependency; drop the network; return 5xx; spike latency; exhaust resources.
- Verify **timeouts, fallbacks, circuit breakers, and clear errors** kick in — no cascading failure that takes everything down.

Do it in **controlled** environments first, then carefully in production with a blast-radius limit.`,
      analogy: `A fire drill — you start a *controlled* fire to confirm the alarms, sprinklers, and exits actually work, instead of just hoping they will during a real one.`,
    },
    {
      id: 'api-sr-19',
      level: 'senior',
      topic: 'Metrics',
      question: 'What metrics tell you about API quality?',
      answer: `Outcome-focused metrics:
- **Error rate** (4xx vs 5xx, trended).
- **Latency percentiles** — p95/p99, not just the average (averages hide the slow tail).
- **Uptime / availability.**
- **Defect leakage** to production and **contract-test pass rate**.
- **Coverage of critical endpoints.**

Avoid vanity metrics like raw request count or total number of tests — they measure activity, not quality.`,
      analogy: `A car dashboard — you read the meaningful gauges *together* to judge the health of the journey. And p99 latency is the gauge that catches the one passenger stuck in a broken seat, which the average happily hides.`,
    },
    {
      id: 'api-sr-20',
      level: 'senior',
      topic: 'Security',
      question: 'How do you handle secrets (tokens, API keys) in API test automation?',
      answer: `- **Never hard-code or commit** them.
- Store in **environment variables**, a **secrets manager/vault**, or your **CI secret store**, and inject at runtime.
- Use **short-lived** tokens and **minimally-scoped** test credentials; **rotate** them.
- **Scrub** secrets from logs and test reports, and keep **separate creds per environment**.`,
      analogy: `You don't write your PIN on the debit card. Secrets live in a locked vault and are handed out only at the moment of use — never taped to the code.`,
    },
    {
      id: 'api-sr-21',
      level: 'senior',
      topic: 'Versioning',
      question: 'How do you manage testing around deprecating or making breaking changes to an API?',
      answer: `- **Identify the consumers** of the endpoint first.
- **Version** the change; keep the **old version tested and running** during a deprecation window.
- Add **deprecation warnings/headers** and provide **migration docs**.
- Run **consumer contract tests** to find exactly who breaks.
- **Monitor old-version usage** and only remove it once it drops to zero. Communicate timelines clearly.`,
      analogy: `Closing an old road — you open the new one first, post signs and a closure date well in advance, and check who's still using the old route before you finally dig it up.`,
    },
    {
      id: 'api-sr-22',
      level: 'senior',
      topic: 'GraphQL',
      question: 'What is different about testing a GraphQL API at a strategic level?',
      answer: `One endpoint, client-specified queries — so beyond functional checks you must test:
- **Field-level authorization** — can a user query fields they shouldn't see?
- **Query depth & complexity limits** — deeply nested queries can become a DoS vector.
- **N+1 performance** from nested resolvers.
- **Errors-in-body** — GraphQL returns 200 with an \`errors\` array, so don't rely on HTTP status.
- The **schema is the contract** — validate against it.`,
      analogy: `A build-your-own buffet — but at scale you also police that no one piles a plate so enormous it crashes the kitchen (complexity limits), and that guests can't reach *behind* the counter (field-level authorization).`,
    },
    {
      id: 'api-sr-23',
      level: 'senior',
      topic: 'Architecture',
      question: 'What gateway-level concerns do you test for in an API platform?',
      answer: `An **API gateway** sits in front of the services and handles cross-cutting concerns. Test these *independently* of the backend:
- **Authentication** enforced at the edge.
- **Rate limiting / throttling** kicks in correctly.
- **Routing / load balancing** hits the right service.
- **Request/response transformation** is correct.
- **Caching** returns fresh-enough data; **logging** captures what's needed.`,
      analogy: `The security-and-reception desk of an office building — it checks IDs (auth), controls how many people enter at once (throttling), and directs visitors to the right floor (routing), regardless of what each office does inside.`,
    },
    {
      id: 'api-sr-24',
      level: 'senior',
      topic: 'Strategy',
      question: 'How do you shift API testing left?',
      answer: `- **Design the contract first** (OpenAPI) and **review it** before any code is written.
- **Generate mocks from the spec** so consumer teams can build in parallel.
- Write **contract/API tests alongside** development, not after.
- **Continuously validate** the implementation against the spec.

The goal: catch mismatches at *design time*, where they're cheap, instead of during integration, where they're expensive.`,
      analogy: `Agreeing the blueprint and the exact pipe sizes *before* two teams build from opposite ends — far cheaper than discovering at the join that nothing lines up.`,
    },
    {
      id: 'api-sr-25',
      level: 'senior',
      topic: 'Leadership',
      question: 'You join a team with no API test coverage. How do you start?',
      answer: `Start where the risk and value are highest:
1. A **smoke suite** of the critical happy-path endpoints, running in **CI** first — fast, visible value.
2. Then add **negative, auth, and contract** tests.
3. Build **test-data and environment** setup so tests are repeatable.
4. **Document** the API's real behaviour as you go.
5. Grow coverage **by risk**, and build the habit of **tests-with-features** so it never falls behind again.`,
      analogy: `Founding a fire department in a new town — you don't open with ten stations. You get one truck, the critical drills, and a working emergency number first, then expand as the town grows.`,
    },
    {
      id: 'api-sr-26',
      level: 'senior',
      topic: 'Leadership',
      question: 'How do you balance release speed with API test coverage, and when do you push back?',
      answer: `Make speed *and* safety possible:
- Gate only **fast, lightweight checks** (contract + smoke) on every change, and run deeper suites **asynchronously** — so testing rarely blocks a release.
- For **high-risk** changes (auth, payments, data-affecting), insist on coverage and make the risk **explicit with data**.
- Offer **options** — feature flag, phased rollout, extra monitoring — rather than a flat "no." You're a risk advisor, not a roadblock.`,
      analogy: `A structural engineer signing off a bridge — fast on a garden footbridge, but firm on a motorway span. And they explain *why* in terms of consequences, not stubbornness.`,
    },

  ],
  typescript: [],
  playwright: [],
  'ai-qa': [],
};
