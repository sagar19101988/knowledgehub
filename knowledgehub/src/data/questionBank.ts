export type QuestionType = 'mcq' | 'tf' | 'code-mcq' | 'fill-blank';

export interface MasteryTrialQuestion {
  id: string;
  type: QuestionType;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  question: string;
  code?: string;
  codeLanguage?: string;
  options?: string[];
  blank?: string;
  chips?: string[];
  correct: number | boolean | string;
  explanation: string;
}

export const MASTERY_BADGES: Record<string, { name: string; icon: string }> = {
  manual:     { name: 'The Inquisitor',  icon: '🔍' },
  sql:        { name: 'Query Oracle',    icon: '🔮' },
  api:        { name: 'Protocol Master', icon: '⚡' },
  typescript: { name: 'Type Architect',  icon: '🏗️' },
  playwright: { name: 'Script Virtuoso', icon: '🎭' },
  'ai-qa':    { name: 'Neural Sage',     icon: '🧠' },
};

export const QUESTION_BANK: Record<string, MasteryTrialQuestion[]> = {
  sql: [
    // ── BEGINNER ──────────────────────────────────────────────────
    {
      id: 'sql-q001',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What does the "R" stand for in RDBMS, and what does it actually mean?',
      options: [
        'Reliable — the database recovers automatically after a crash',
        'Relational — data is organised into tables linked to each other through shared keys',
        'Read-only — the system is optimised for SELECT queries',
        'Replicated — data is automatically copied to multiple servers',
      ],
      correct: 1,
      explanation:
        'RDBMS = Relational Database Management System. Data lives in tables with rows and columns, and tables are connected via shared key columns (e.g. users.id linked to orders.user_id). This relational structure is what enables JOINs.',
    },
    {
      id: 'sql-q002',
      type: 'tf',
      difficulty: 'beginner',
      question: 'In a relational database, a "row" represents a single record and a "column" represents a single attribute shared across all records in that table.',
      correct: true,
      explanation:
        'Rows (also called records or tuples) are individual entries — one customer, one order. Columns (also called fields or attributes) define what data each row carries — name, email, total. This grid model is the foundation of relational design.',
    },
    {
      id: 'sql-q003',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Why is `SELECT *` discouraged in production code, even though it works?',
      options: [
        'It only returns the first 10 rows by default',
        'It returns every column — wasting bandwidth, breaking application code when schemas change, and obscuring developer intent',
        'It is slower than `SELECT name, email` even on small tables',
        'Most databases reject it as invalid syntax',
      ],
      correct: 1,
      explanation:
        'Explicit column lists make queries faster (less data), safer (adding a column to the table does not silently break your code), and self-documenting (you see exactly what the query needs). SELECT * is fine for ad-hoc exploration, not for application code.',
    },
    {
      id: 'sql-q004',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'Given the data below, what does this query return?',
      code: `-- customers table:
-- id | name   | city
-- 1  | Priya  | Mumbai
-- 2  | Rohan  | Delhi
-- 3  | Asha   | Mumbai
-- 4  | Karan  | Bengaluru

SELECT DISTINCT city FROM customers;`,
      codeLanguage: 'sql',
      options: [
        'Mumbai, Delhi, Mumbai, Bengaluru (4 rows)',
        'Mumbai, Delhi, Bengaluru (3 rows)',
        'Mumbai (1 row — only the first match)',
        'An error — DISTINCT requires a GROUP BY',
      ],
      correct: 1,
      explanation:
        'DISTINCT collapses duplicate values in the selected column(s). Two customers live in Mumbai, but DISTINCT returns each unique city only once: Mumbai, Delhi, Bengaluru.',
    },
    {
      id: 'sql-q005',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'In `WHERE age > 18 AND city = "Mumbai" OR status = "VIP"`, which condition is evaluated first?',
      options: [
        'OR has higher precedence than AND',
        'AND has higher precedence than OR — so this reads as `(age > 18 AND city = "Mumbai") OR status = "VIP"`',
        'They are evaluated strictly left-to-right',
        'The order depends on the database vendor',
      ],
      correct: 1,
      explanation:
        'AND binds tighter than OR in SQL — same as in most languages. Without parentheses this query returns: rows where both age > 18 AND city is Mumbai, OR any VIP regardless of age/city. Always use parentheses when mixing AND/OR to avoid surprises.',
    },
    {
      id: 'sql-q006',
      type: 'tf',
      difficulty: 'beginner',
      question: 'The condition `WHERE email = NULL` correctly filters rows where the email column is missing.',
      correct: false,
      explanation:
        'NULL is not a value, so `= NULL` is never true (or false — it returns "unknown"). To filter NULLs you must use `WHERE email IS NULL`. This is one of the most common SQL bugs for beginners.',
    },
    {
      id: 'sql-q007',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'When `ORDER BY price` is written without ASC or DESC, what is the default sort order?',
      options: [
        'Descending (largest first)',
        'Ascending (smallest first)',
        'Insertion order (the order rows were added)',
        'The database picks randomly each time',
      ],
      correct: 1,
      explanation:
        'ORDER BY defaults to ASC (ascending). To sort largest-first you must write `ORDER BY price DESC` explicitly.',
    },
    {
      id: 'sql-q008',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'Looking at this INSERT, what is wrong?',
      code: `-- users table schema:
--   id    INT PRIMARY KEY AUTO_INCREMENT
--   name  VARCHAR(50) NOT NULL
--   email VARCHAR(100) NOT NULL UNIQUE
--   city  VARCHAR(50)

INSERT INTO users (name, email)
VALUES ('priya@gmail.com', 'Priya');`,
      codeLanguage: 'sql',
      options: [
        'Nothing — this insert will succeed',
        'The values are in the wrong order — "priya@gmail.com" is being inserted into the name column, and "Priya" into the email column',
        'The id must always be specified, even for AUTO_INCREMENT columns',
        'You cannot omit the city column — every column must have a value',
      ],
      correct: 1,
      explanation:
        'INSERT pairs the column list with the VALUES list positionally. Here `name` gets the email address and `email` gets the person\'s first name. AUTO_INCREMENT columns are auto-filled; nullable columns can be omitted; but positional mismatches like this silently corrupt your data.',
    },
    {
      id: 'sql-q009',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'A developer runs `UPDATE users SET status = "inactive";` on a production table with 2 million rows. What happens?',
      options: [
        'Only the first row is updated — UPDATE without WHERE is a no-op',
        'Every single row in the table is updated to status = "inactive"',
        'The database raises an error to prevent accidental mass updates',
        'Only rows with a matching unique key are updated',
      ],
      correct: 1,
      explanation:
        'UPDATE without WHERE applies to every row. This is one of the most infamous production accidents in SQL. Always wrap risky UPDATE/DELETE statements in a transaction (BEGIN…) so you can ROLLBACK on mistake.',
    },
    {
      id: 'sql-q010',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A `DELETE FROM orders;` outside of a transaction can be undone by simply running `INSERT` to put the rows back.',
      correct: false,
      explanation:
        'Once a DELETE commits, the rows are gone. Re-inserting requires the original data, which you no longer have. The only true recovery is from backups or from inside an uncommitted transaction (where ROLLBACK can save you).',
    },
    {
      id: 'sql-q011',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'You need a column to store monetary values like 12345.67 with exact precision (no floating-point rounding errors). Which type should you use?',
      blank: 'For exact monetary values, use ___ instead of FLOAT.',
      chips: ['DECIMAL', 'INT', 'VARCHAR', 'BLOB'],
      correct: 'DECIMAL',
      explanation:
        'DECIMAL (or NUMERIC) stores fixed-precision values exactly — essential for currency. FLOAT/DOUBLE are approximate and can introduce rounding errors like 0.1 + 0.2 = 0.30000000000000004. INT discards decimals; VARCHAR loses numeric semantics.',
    },
    {
      id: 'sql-q012',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Given a table where 100 rows have a phone number and 20 rows have NULL phones, which is correct?',
      options: [
        '`COUNT(*)` returns 100, `COUNT(phone)` returns 120',
        '`COUNT(*)` returns 120, `COUNT(phone)` returns 100',
        'Both `COUNT(*)` and `COUNT(phone)` return 120',
        'Both `COUNT(*)` and `COUNT(phone)` return 100',
      ],
      correct: 1,
      explanation:
        'COUNT(*) counts every row regardless of NULLs (120). COUNT(column) counts only rows where that column is NOT NULL (100). COUNT(DISTINCT col) would further deduplicate. This is a common source of off-by-N reporting bugs.',
    },
    {
      id: 'sql-q013',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'A scores table has values: 80, 90, NULL, 70. What does this query return?',
      code: `SELECT AVG(score) FROM scores;`,
      codeLanguage: 'sql',
      options: [
        '60 — NULL is treated as 0 in the average',
        '80 — (80 + 90 + 70) / 3, because NULLs are skipped',
        '60 — (80 + 90 + 0 + 70) / 4',
        'An error — AVG cannot run on a column containing NULLs',
      ],
      correct: 1,
      explanation:
        'Aggregate functions (AVG, SUM, MIN, MAX, COUNT(col)) silently skip NULL values. Average is taken over non-NULL values only: (80 + 90 + 70) / 3 = 80. If you wanted NULLs treated as zero, you would need COALESCE(score, 0).',
    },
    {
      id: 'sql-q014',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'You delete a customer who has 5 orders. To make the orders auto-delete with the customer instead of becoming orphans, the foreign key needs which option?',
      blank: 'Define the FK with `ON DELETE ___` so child orders are removed automatically when the parent customer is deleted.',
      chips: ['CASCADE', 'RESTRICT', 'SET NULL', 'NO ACTION'],
      correct: 'CASCADE',
      explanation:
        'ON DELETE CASCADE propagates the delete down to dependent rows. RESTRICT/NO ACTION blocks the delete entirely if children exist. SET NULL leaves the children but nulls their FK column (only works if the FK column is nullable).',
    },
    {
      id: 'sql-q015',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'You want every user to have a phone number AND you want phone numbers to be globally unique across users. Which combination of constraints is correct?',
      options: [
        'NOT NULL only — uniqueness is implied for required fields',
        'UNIQUE only — uniqueness already prevents NULLs',
        'NOT NULL and UNIQUE together, on the phone column',
        'CHECK (phone IS NOT NULL AND phone NOT IN (SELECT phone FROM users))',
      ],
      correct: 2,
      explanation:
        'NOT NULL and UNIQUE are independent constraints. NOT NULL forbids missing values; UNIQUE forbids duplicates (but typically allows multiple NULLs). To enforce "every user has a phone AND no two share one", you need both.',
    },
    {
      id: 'sql-q016',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A column declared `status VARCHAR(20) DEFAULT "active"` will use "active" whenever the INSERT statement omits the status column.',
      correct: true,
      explanation:
        'DEFAULT values kick in when the column is not listed in an INSERT (or when DEFAULT is explicitly written as the value). If the INSERT explicitly provides NULL, however, NULL is stored — DEFAULT only fills in *missing* values, not *NULL* values.',
    },
    {
      id: 'sql-q017',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which pattern matches strings exactly 4 characters long starting with "A"?',
      options: [
        "LIKE 'A%'",
        "LIKE 'A___'",
        "LIKE 'A%%%'",
        "LIKE 'A____'",
      ],
      correct: 1,
      explanation:
        '`_` matches exactly one character; `%` matches zero or more. `A___` (A + three underscores) matches a 4-character string beginning with A. `A%` would match A, Ab, Abc, Abcdef — any length. The fourth option requires 5 chars.',
    },

    // ── INTERMEDIATE ──────────────────────────────────────────────
    {
      id: 'sql-q018',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A `users` table has 100 rows. An `orders` table has 60 rows, but only 50 of those reference real users (10 orders have invalid `user_id`). What does `SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id` return?',
      options: [
        '100 rows — every user is returned',
        '60 rows — every order is returned',
        '50 rows — only orders whose user_id matches an existing user',
        '160 rows — every user and every order',
      ],
      correct: 2,
      explanation:
        'INNER JOIN returns only rows where the match exists in both tables. The 10 orphan orders are excluded, and any user with no order is also excluded. To include users without orders, switch to LEFT JOIN; to find orphan orders, LEFT JOIN orders→users and filter `WHERE users.id IS NULL`.',
    },
    {
      id: 'sql-q019',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'Which query finds orphan orders — orders whose `user_id` does not match any existing user?',
      code: `-- orders table: 60 rows
-- users table:  100 rows
-- Goal: list orders pointing to non-existent users (data integrity bug)`,
      codeLanguage: 'sql',
      options: [
        'SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id;',
        'SELECT o.* FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL;',
        'SELECT * FROM orders WHERE user_id = NULL;',
        'SELECT * FROM orders EXCEPT SELECT * FROM users;',
      ],
      correct: 1,
      explanation:
        'LEFT JOIN keeps all orders even when no matching user exists; `WHERE u.id IS NULL` then surfaces exactly those mismatches. INNER JOIN hides them. `= NULL` is always unknown. EXCEPT compares the rows of two unrelated shape tables — meaningless here.',
    },
    {
      id: 'sql-q020',
      type: 'tf',
      difficulty: 'intermediate',
      question: '`A LEFT JOIN B` and `B RIGHT JOIN A` return the same result set.',
      correct: true,
      explanation:
        'They are logically identical — both keep all rows from the "outer" side (A in the first case, A in the second because of the swap). Most teams adopt LEFT JOIN as a convention so the table that should be preserved always reads first.',
    },
    {
      id: 'sql-q021',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Which SELECT list is legal alongside `GROUP BY department`?',
      options: [
        'SELECT department, name, COUNT(*) — every non-aggregated column may be selected',
        'SELECT department, COUNT(*), AVG(salary) — only the grouped column and aggregate functions',
        'SELECT * — all columns are allowed under GROUP BY',
        'SELECT name, AVG(salary) — aggregates can appear with any column',
      ],
      correct: 1,
      explanation:
        'Under strict SQL rules, non-aggregated columns in the SELECT must appear in the GROUP BY. Selecting `name` alongside an aggregate makes no sense — there are many names per department, so which one would be shown? Stick to grouped columns + aggregates.',
    },
    {
      id: 'sql-q022',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'What is the practical difference between WHERE and HAVING?',
      options: [
        'WHERE and HAVING are identical — they can be used interchangeably',
        'WHERE filters rows BEFORE aggregation; HAVING filters groups AFTER aggregation',
        'WHERE is for SELECT; HAVING is for UPDATE',
        'HAVING is older syntax and is now deprecated',
      ],
      correct: 1,
      explanation:
        'WHERE filters individual rows before GROUP BY runs. HAVING filters the *grouped* results. To find departments with average salary > 80k, you cannot use `WHERE AVG(salary) > 80000` — averages do not exist yet at the WHERE stage. Use `HAVING AVG(salary) > 80000`.',
    },
    {
      id: 'sql-q023',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Which best describes a correlated subquery?',
      options: [
        'A subquery that runs once and returns a single value to the outer query',
        'A subquery that depends on the outer query — it re-executes once per row of the outer query',
        'Two queries connected by UNION',
        'A subquery that always returns NULL',
      ],
      correct: 1,
      explanation:
        'A correlated subquery references a column from the outer query, so it cannot be evaluated once and cached — it runs per outer row. This is powerful but can be slow; a JOIN or a derived table can sometimes give the same result faster.',
    },
    {
      id: 'sql-q024',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'What does this query return?',
      code: `-- products table:
-- id | name      | category
-- 1  | Laptop    | Electronics
-- 2  | Phone     | Electronics
-- 3  | Notebook  | Stationery

-- order_items table:
-- product_id | qty
-- 1          | 3
-- 2          | 5

SELECT name FROM products
WHERE id IN (SELECT product_id FROM order_items);`,
      codeLanguage: 'sql',
      options: [
        'Laptop, Phone, Notebook (all 3 products)',
        'Laptop, Phone (only products that appear in order_items)',
        'Notebook (only products not in order_items)',
        'An error — IN cannot accept a subquery',
      ],
      correct: 1,
      explanation:
        'The subquery returns [1, 2] (product IDs that have order items). The outer query selects product names whose id is in that list — Laptop and Phone. Notebook is excluded because no order_items reference it.',
    },
    {
      id: 'sql-q025',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'A saved, named SELECT query that you can query like a virtual table — without ever storing its own data — is called a ___.',
      blank: 'A saved named query that acts like a virtual table is called a ___.',
      chips: ['view', 'index', 'trigger', 'procedure'],
      correct: 'view',
      explanation:
        'A view stores only the query definition; the underlying data is fetched live from the base tables each time the view is queried. Indexes accelerate lookups, triggers run on data changes, and procedures are callable code blocks.',
    },
    {
      id: 'sql-q026',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Adding more indexes to a table always improves overall database performance.',
      correct: false,
      explanation:
        'Indexes speed up reads but slow down writes — every INSERT, UPDATE, and DELETE must also update every relevant index. Over-indexing a write-heavy table can hurt throughput. Index only the columns you frequently filter, sort, or join on.',
    },
    {
      id: 'sql-q027',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'In this EXPLAIN output, which row should worry you most?',
      code: `EXPLAIN SELECT * FROM orders WHERE status = 'pending';

id | select_type | table  | type | key            | rows    | Extra
1  | SIMPLE      | orders | ALL  | NULL           | 2400000 | Using where`,
      codeLanguage: 'text',
      options: [
        '`type = ALL` means the query is doing a full table scan over 2.4 million rows — no index is being used',
        '`Extra = Using where` means the WHERE clause is being applied incorrectly',
        '`select_type = SIMPLE` indicates the query is too simple and needs subqueries',
        'Everything looks healthy — `id = 1` confirms the query plan is optimised',
      ],
      correct: 0,
      explanation:
        '`type = ALL` is a full table scan — the database is reading every row. `key = NULL` confirms no index is being used. The fix: create an index on `status` (especially a composite one if combined with other filters). `Using where` just means a WHERE clause exists; it is not a warning.',
    },
    {
      id: 'sql-q028',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Inside a transaction (`BEGIN…`), you run an UPDATE and discover it affected wrong rows. What do you do?',
      options: [
        'Run a reverse UPDATE — you cannot undo committed changes',
        'Issue `ROLLBACK;` — every change since `BEGIN` is undone',
        'Drop and recreate the table',
        'Wait for the auto-undo timer (5 minutes by default)',
      ],
      correct: 1,
      explanation:
        'A transaction is atomic — until COMMIT, none of your changes are visible to other sessions and ROLLBACK undoes everything since BEGIN. Once COMMIT runs, the changes are durable and ROLLBACK no longer works.',
    },
    {
      id: 'sql-q029',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'In ACID, the property that guarantees "either every statement in the transaction succeeds, or none of them take effect" is called ___.',
      blank: 'The "all or nothing" guarantee of a transaction is called ___.',
      chips: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 'Atomicity',
      explanation:
        'Atomicity = all-or-nothing. Consistency = the DB stays valid (constraints hold) before and after. Isolation = concurrent transactions do not see each other\'s in-progress work. Durability = committed changes survive crashes.',
    },
    {
      id: 'sql-q030',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'What does this query return?',
      code: `SELECT CONCAT(first_name, ' ', UPPER(last_name)) AS full_name
FROM users
WHERE id = 1;

-- users.id=1 → first_name='Priya', last_name='Sharma'`,
      codeLanguage: 'sql',
      options: [
        "'Priya Sharma'",
        "'Priya SHARMA'",
        "'PRIYA SHARMA'",
        'NULL — UPPER cannot be applied inside CONCAT',
      ],
      correct: 1,
      explanation:
        'CONCAT joins strings; UPPER converts to uppercase. UPPER is applied only to last_name, then concatenated with first_name and a space. Result: "Priya SHARMA". This pattern is common when normalising names for display or matching.',
    },
    {
      id: 'sql-q031',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Two NULL values are considered equal by SQL — so `WHERE col1 = col2` returns true when both are NULL.',
      correct: false,
      explanation:
        'NULL means "unknown", so comparing two unknowns yields "unknown" (treated as false). To check both are NULL use `col1 IS NULL AND col2 IS NULL`. To treat NULLs as equal in comparisons, use `IS NOT DISTINCT FROM` (Postgres) or wrap with COALESCE.',
    },
    {
      id: 'sql-q032',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'To return the first non-NULL value from a list of expressions — e.g. show `nickname` if present, else `first_name`, else "Guest" — use the ___ function.',
      blank: 'The function that returns the first non-NULL value from its arguments is ___.',
      chips: ['COALESCE', 'NULLIF', 'IFNULL', 'CAST'],
      correct: 'COALESCE',
      explanation:
        'COALESCE(a, b, c) returns the first non-NULL among its arguments and works in every major SQL dialect. IFNULL is a 2-argument MySQL/SQLite shortcut. NULLIF returns NULL if two values are equal (the opposite use case). CAST is for type conversion.',
    },
    {
      id: 'sql-q033',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'You need to instantly clear 10 million test rows from a table during a CI run — fastest option, knowing the rows are not needed for audit?',
      options: [
        'DELETE FROM table_name; — safest and most controllable',
        'TRUNCATE TABLE table_name; — drops all rows almost instantly, resets identity counters, but cannot be filtered',
        'DROP TABLE table_name; — also fast, but you must recreate the table afterward',
        'UPDATE table_name SET deleted = 1; — soft-delete approach',
      ],
      correct: 1,
      explanation:
        'TRUNCATE deallocates the table\'s data pages in one shot — far faster than DELETE which scans and logs row-by-row. It also resets AUTO_INCREMENT. DROP would also remove the schema (you would have to recreate it). For CI test data resets, TRUNCATE is the standard choice.',
    },
    {
      id: 'sql-q034',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'You can populate a new table with the result of a SELECT query in a single statement using `INSERT INTO new_table SELECT ... FROM old_table`.',
      correct: true,
      explanation:
        'INSERT…SELECT is the standard pattern for copying or transforming rows between tables — invaluable for cloning production-like data into a test environment, or splitting a table during refactoring. Just ensure column types and constraints align.',
    },

    // ── EXPERT ────────────────────────────────────────────────────
    {
      id: 'sql-q035',
      type: 'mcq',
      difficulty: 'expert',
      question: 'Three salespeople have revenues 500, 500, 300. Which ranking function gives them the values 1, 1, 2 (no gap)?',
      options: [
        'ROW_NUMBER()',
        'RANK()',
        'DENSE_RANK()',
        'NTILE(3)',
      ],
      correct: 2,
      explanation:
        'ROW_NUMBER → 1, 2, 3 (always unique). RANK → 1, 1, 3 (ties share rank, gap after). DENSE_RANK → 1, 1, 2 (ties share, no gap). NTILE divides into N buckets. Choose based on whether you want gaps after ties (RANK) or compressed ranks (DENSE_RANK).',
    },
    {
      id: 'sql-q036',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'Given daily sales values 100, 200, 150, 300, what running total does this produce?',
      code: `SELECT
  sale_date,
  amount,
  SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM daily_sales;`,
      codeLanguage: 'sql',
      options: [
        '100, 200, 150, 300 — just the amount column',
        '750, 750, 750, 750 — total of all rows on every row',
        '100, 300, 450, 750 — cumulative sum row by row',
        '100, 200, 150, 300 with the final row also showing 750',
      ],
      correct: 2,
      explanation:
        'A window function with `OVER (ORDER BY …)` and no explicit frame defaults to "from start of partition to current row" — i.e. a running total. Each row\'s running_total includes itself plus all previous rows: 100, 100+200, 100+200+150, 100+200+150+300.',
    },
    {
      id: 'sql-q037',
      type: 'mcq',
      difficulty: 'expert',
      question: 'In `ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)`, what is the role of PARTITION BY?',
      options: [
        'It limits the query to only the first partition of the table',
        'It restarts the row numbering at 1 within each department group',
        'It is a synonym for GROUP BY — rows are collapsed into one per department',
        'It physically partitions the table on disk for faster reads',
      ],
      correct: 1,
      explanation:
        'PARTITION BY divides the rows into groups (departments here); the window function runs independently inside each group. So the highest-paid person in each department gets row_number 1, the second 2, and so on. Unlike GROUP BY, no rows are collapsed.',
    },
    {
      id: 'sql-q038',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What is the main practical benefit of using a Common Table Expression (CTE) with `WITH` over a deeply nested subquery?',
      options: [
        'CTEs are always faster — the database materialises the result',
        'CTEs make complex queries readable, support self-reference (recursion), and can be referenced multiple times within the same SELECT',
        'CTEs bypass transaction isolation and run in dirty-read mode',
        'CTEs can run cross-database without permissions',
      ],
      correct: 1,
      explanation:
        'CTEs are primarily a readability and structure win — they break a complex query into named steps and can be referenced multiple times in the same statement. Recursion (e.g. traversing an org chart) is a CTE-only feature. Performance vs nested subquery is usually similar.',
    },
    {
      id: 'sql-q039',
      type: 'tf',
      difficulty: 'expert',
      question: 'A recursive CTE can traverse hierarchical data such as an employee-manager tree, with the recursive part referencing the CTE\'s own name.',
      correct: true,
      explanation:
        'A recursive CTE has two parts joined by UNION ALL: an anchor (the starting rows) and a recursive member that references the CTE itself, joining further rows each iteration. It is the standard SQL pattern for trees, paths, and bill-of-materials problems.',
    },
    {
      id: 'sql-q040',
      type: 'mcq',
      difficulty: 'expert',
      question: 'An `employees` table has columns `id`, `name`, and `manager_id` (which points to another employee in the same table). To list each employee alongside their manager\'s name, which technique is correct?',
      options: [
        'A CROSS JOIN of employees with itself',
        'A SELF JOIN: `employees e JOIN employees m ON e.manager_id = m.id`',
        'A UNION of employees and a copy of itself',
        'A subquery that returns all rows for each manager',
      ],
      correct: 1,
      explanation:
        'A SELF JOIN joins a table to itself using two different aliases. Here `e` represents the employee and `m` represents their manager — both rows live in the same table but the join condition wires up the hierarchy. CROSS JOIN would produce every pair (too many); UNION combines result sets.',
    },
    {
      id: 'sql-q041',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'A CROSS JOIN between a table with 5 rows and a table with 10 rows returns ___ rows.',
      blank: 'A CROSS JOIN of a 5-row table with a 10-row table returns ___ rows.',
      chips: ['50', '15', '10', '5'],
      correct: '50',
      explanation:
        'CROSS JOIN produces the Cartesian product — every row from A paired with every row from B. 5 × 10 = 50. CROSS JOINs are useful for round-robin scenarios and date-spine generation but blow up quickly on large tables — always confirm intent before running.',
    },
    {
      id: 'sql-q042',
      type: 'mcq',
      difficulty: 'expert',
      question: 'Which best captures the practical difference between a stored procedure and a stored function in SQL?',
      options: [
        'A function modifies data; a procedure cannot',
        'A function must return a value and is typically used inside SELECT expressions; a procedure is called standalone and may return zero or many results',
        'A procedure is faster than a function on every database engine',
        'Procedures can only be called from application code, never from SQL itself',
      ],
      correct: 1,
      explanation:
        'Functions are designed to return a single value and can be embedded in expressions: `SELECT compute_tax(amount) FROM orders`. Procedures are invoked with `CALL` (or `EXEC`), can have multiple OUT parameters, and may return result sets but cannot be embedded in SELECT lists.',
    },
    {
      id: 'sql-q043',
      type: 'tf',
      difficulty: 'expert',
      question: 'A stored procedure with an OUT parameter modifies the variable passed in by the caller, allowing the procedure to return computed values without using a SELECT.',
      correct: true,
      explanation:
        'OUT parameters are the standard way to pass results back from a procedure to its caller — common for "give me one computed number" use cases. IN parameters are read-only inputs; INOUT acts as both. Procedures that return tables typically use SELECT or a result set instead.',
    },
    {
      id: 'sql-q044',
      type: 'mcq',
      difficulty: 'expert',
      question: 'A trigger fires `BEFORE INSERT` on the orders table to validate that `total >= 0`. What is the consequence of choosing BEFORE over AFTER?',
      options: [
        'BEFORE means the trigger only logs and does not block; AFTER blocks invalid inserts',
        'BEFORE lets the trigger modify or reject the row before it is written; AFTER runs after the row exists, so a SIGNAL/exception then forces a rollback of the already-inserted row',
        'BEFORE and AFTER are equivalent — choose based on style',
        'BEFORE triggers run only the first time a row is inserted; AFTER fires every time',
      ],
      correct: 1,
      explanation:
        'BEFORE triggers are evaluated before the row hits the table — they can inspect, modify NEW.column values, or raise an error to abort the operation cleanly. AFTER triggers run once the change is committed to the underlying storage, so blocking from AFTER requires rolling back. Choose BEFORE for validation, AFTER for downstream side effects (audit logs, notifications).',
    },
    {
      id: 'sql-q045',
      type: 'tf',
      difficulty: 'expert',
      question: 'A trigger fires automatically when the configured event (INSERT/UPDATE/DELETE) occurs — application code does not need to explicitly call it.',
      correct: true,
      explanation:
        'Triggers are *automatic* by design: they are part of the table\'s definition. This invisibility is also their main risk — performance regressions and surprising side effects are easy to introduce. Always document trigger behaviour clearly and version-control trigger definitions like any other code.',
    },
    {
      id: 'sql-q046',
      type: 'mcq',
      difficulty: 'expert',
      question: 'In an EXPLAIN plan, what does `Seq Scan` (or `type=ALL` in MySQL) typically indicate?',
      options: [
        'The query is using an index for a fast lookup',
        'The database is reading every row in the table — fine for small tables, a red flag for large ones',
        'The query has a syntax error',
        'The plan is sequential and cannot be parallelised',
      ],
      correct: 1,
      explanation:
        'Seq Scan / type=ALL means a full table scan — every row read. On a 10-row lookup table it is irrelevant. On a 10M-row table with a selective WHERE, it usually signals a missing or unused index. Index Scan / type=ref or range is what you usually want for selective queries.',
    },
    {
      id: 'sql-q047',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'Which line of this EXPLAIN output is the strongest signal that the query needs an index?',
      code: `EXPLAIN SELECT * FROM events
WHERE user_id = 42 AND status = 'completed'
ORDER BY created_at DESC;

→ type: ALL
→ key: NULL
→ rows: 12,400,000
→ Extra: Using where; Using filesort`,
      codeLanguage: 'text',
      options: [
        '`type: ALL` plus `key: NULL` — a full table scan with no index in use, on 12M rows',
        '`Using where` — the WHERE is causing the slowness',
        '`Using filesort` is the only real issue; everything else is fine',
        '`rows: 12,400,000` — this is just the table size and is not relevant',
      ],
      correct: 0,
      explanation:
        '`type: ALL` + `key: NULL` is the smoking gun: no index is being used, so 12.4M rows are scanned. A composite index on `(user_id, status, created_at)` would let the planner do an Index Scan and avoid the filesort. `Using where` just means a WHERE clause is being applied — informational only.',
    },
    {
      id: 'sql-q048',
      type: 'mcq',
      difficulty: 'expert',
      question: 'A query has cost 0.04 on a small dev dataset but 4,800,000 on the production-sized dataset. What is the most likely cause?',
      options: [
        'The production database is misconfigured',
        'The query plan does not scale: a Seq Scan or nested loop join that was cheap on tiny data becomes expensive on millions of rows — indexes or rewriting are needed',
        'The query is fundamentally broken and will fail in prod',
        'Costs always look bigger on bigger databases; this is healthy',
      ],
      correct: 1,
      explanation:
        'Plans that are O(n) or worse look fine until n is large. A nested-loop join on 100 rows is instant; on 10M rows it is fatal. Always EXPLAIN on production-shaped data, not toy datasets, and look for plan-shape changes (Seq Scan, nested loop) when scaling up.',
    },
    {
      id: 'sql-q049',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'Inside a stored procedure, the statement that raises a custom error so the caller knows something went wrong is ___.',
      blank: 'To raise a custom error from inside a procedure, use the ___ statement.',
      chips: ['SIGNAL', 'RAISE_EVENT', 'THROW_ERROR', 'COMMIT'],
      correct: 'SIGNAL',
      explanation:
        'SIGNAL (in standard SQL and MySQL) raises an error with a SQLSTATE code and a message — caught by DECLARE HANDLER inside the procedure or by the application. RESIGNAL re-raises an already caught condition. SQL Server uses THROW; Oracle uses RAISE — but SIGNAL is the standard term.',
    },
    {
      id: 'sql-q050',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'This query pivots monthly sales into a cross-tab report. What is the conceptual technique being used?',
      code: `SELECT
  product,
  SUM(CASE WHEN month = 'Jan' THEN revenue ELSE 0 END) AS jan,
  SUM(CASE WHEN month = 'Feb' THEN revenue ELSE 0 END) AS feb,
  SUM(CASE WHEN month = 'Mar' THEN revenue ELSE 0 END) AS mar
FROM sales
GROUP BY product;`,
      codeLanguage: 'sql',
      options: [
        'A correlated subquery',
        'A CASE-based pivot — rows are turned into columns by conditional aggregation',
        'A recursive CTE',
        'A LATERAL JOIN',
      ],
      correct: 1,
      explanation:
        'This is the classic portable PIVOT pattern: one CASE expression per target column, wrapped in an aggregate, with GROUP BY collapsing rows. Vendor-specific PIVOT syntax exists (T-SQL, Oracle), but CASE-based pivots work everywhere and remain the standard reporting idiom.',
    },
  ],

  manual: [
    // ── BEGINNER ──────────────────────────────────────────────────
    {
      id: 'mt-q001',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What is the main difference between verification and validation?',
      options: [
        "Verification checks 'Are we building it right?'; Validation checks 'Are we building the right thing?'",
        'Verification is performed by testers; Validation is performed by developers',
        'Verification is always manual; Validation is always automated',
        'They are the same — the terms are used interchangeably',
      ],
      correct: 0,
      explanation:
        "Verification is process-focused (are we following the spec?); Validation is product-focused (does it meet user needs?). A classic mnemonic: Verification = right product? No — Validation = right product? Yes.",
    },
    {
      id: 'mt-q002',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which testing level validates that separate components or services work correctly together?',
      options: ['Unit testing', 'Integration testing', 'System testing', 'Acceptance testing'],
      correct: 1,
      explanation:
        'Integration testing combines units and tests the interfaces between them — catching defects that unit tests (which run in isolation) cannot expose.',
    },
    {
      id: 'mt-q003',
      type: 'tf',
      difficulty: 'beginner',
      question: 'Exploratory testing requires all test cases to be fully documented before execution begins.',
      correct: false,
      explanation:
        'Exploratory testing is simultaneous learning, design, and execution. It is intentionally unscripted — the tester discovers and adapts as they go.',
    },
    {
      id: 'mt-q004',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A bug with high severity always has high priority.',
      correct: false,
      explanation:
        'Severity and priority are independent. A crash in a rarely-used admin page has high severity but may be low priority. A typo on the homepage has low severity but may be high priority due to brand visibility.',
    },
    {
      id: 'mt-q005',
      type: 'mcq',
      difficulty: 'beginner',
      question: "What does 'severity' measure in defect management?",
      options: [
        'How urgently the bug must be fixed',
        'The technical impact of the bug on the system',
        'How long the bug has been open',
        'How visible the bug is to end users',
      ],
      correct: 1,
      explanation:
        "Severity measures technical impact — how badly the bug breaks the system. Priority measures urgency — how quickly it must be fixed. These are tracked separately because they don't always align.",
    },
    {
      id: 'mt-q006',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'Which type of testing is described below?',
      blank: '___ testing confirms a new build is stable enough for further testing by checking critical paths.',
      chips: ['Smoke', 'Regression', 'Performance', 'Security'],
      correct: 'Smoke',
      explanation:
        "Smoke testing is a quick sanity check on the build's most critical flows. If smoke fails, the build is sent back — there's no point doing deep testing on a broken build.",
    },
    {
      id: 'mt-q007',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which testing level tests individual functions or methods in complete isolation?',
      options: ['Integration testing', 'System testing', 'Unit testing', 'Acceptance testing'],
      correct: 2,
      explanation:
        'Unit testing targets the smallest testable units of code — individual functions or methods — completely isolated from other parts of the system.',
    },
    {
      id: 'mt-q008',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'What is missing from this test case?',
      code: `Test Case: TC-003
Title: Search returns relevant results
Steps:
  1. Navigate to the search page
  2. Enter "laptop" in the search bar
  3. Click the Search button
Actual Result: A list of laptop products is displayed`,
      codeLanguage: 'text',
      options: [
        'Test case ID',
        'Preconditions section',
        'Expected Result',
        'Environment details',
      ],
      correct: 2,
      explanation:
        "Without an Expected Result, the tester cannot determine pass or fail. 'Actual Result' belongs in a defect report, not in the test case template itself.",
    },
    {
      id: 'mt-q009',
      type: 'tf',
      difficulty: 'beginner',
      question: 'Smoke testing and sanity testing are the same process.',
      correct: false,
      explanation:
        'Smoke testing checks broad, critical paths after any new build. Sanity testing is a narrow, focused check after a specific fix to verify that fix works and related areas are intact.',
    },
    {
      id: 'mt-q010',
      type: 'mcq',
      difficulty: 'beginner',
      question: "In the defect life cycle, what does a 'Deferred' status mean?",
      options: [
        'The bug has been fixed and awaits re-testing',
        'The fix is postponed to a future release',
        'The bug cannot be reproduced',
        'The bug report has been rejected as invalid',
      ],
      correct: 1,
      explanation:
        'Deferred means the team acknowledges the bug exists but has decided not to fix it in the current cycle. It is scheduled for a future release or sprint.',
    },

    // ── INTERMEDIATE ──────────────────────────────────────────────
    {
      id: 'mt-q011',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A form accepts ages from 18 to 65. Using Equivalence Partitioning, how many total partitions are defined?',
      options: ['One', 'Two', 'Three', 'Five'],
      correct: 2,
      explanation:
        'EP defines three partitions: one valid (18–65) and two invalid (below 18, above 65). Values within a partition are expected to behave identically, so only one value per partition needs testing.',
    },
    {
      id: 'mt-q012',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'In Boundary Value Analysis, for a field accepting values 1–100, the value 50 is a boundary value.',
      correct: false,
      explanation:
        'BVA tests at and just beyond the edges: 0, 1, 2, 99, 100, 101. The value 50 is mid-range — it belongs to an equivalence partition, not to a boundary.',
    },
    {
      id: 'mt-q013',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'Complete the definition:',
      blank: '___ criteria define the conditions that must be met before a testing phase can begin.',
      chips: ['Entry', 'Exit', 'Pass', 'Acceptance'],
      correct: 'Entry',
      explanation:
        'Entry criteria are the prerequisites to start a test phase (e.g. build deployed, test data ready). Exit criteria define when testing is complete enough to stop.',
    },
    {
      id: 'mt-q014',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'What is the primary purpose of a Decision Table in testing?',
      options: [
        'To define the order in which test cases execute',
        'To capture all combinations of input conditions and their expected outcomes',
        'To measure the percentage of code covered by tests',
        'To document defects discovered during a test cycle',
      ],
      correct: 1,
      explanation:
        'Decision tables systematically map condition combinations (inputs) to expected actions (outputs), ensuring every business rule combination is tested without duplication.',
    },
    {
      id: 'mt-q015',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Regression testing is only required after a bug fix, not after adding new features.',
      correct: false,
      explanation:
        'Regression testing is needed after any code change — bug fixes, new features, refactoring, or configuration changes — to confirm existing functionality has not broken.',
    },
    {
      id: 'mt-q016',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Which test design technique pairs input parameters to reduce test cases while maintaining coverage of all two-way interactions?',
      options: ['Equivalence Partitioning', 'Pairwise Testing', 'State Transition Testing', 'Error Guessing'],
      correct: 1,
      explanation:
        'Pairwise (orthogonal array) testing covers all combinations of any two parameters, dramatically reducing test case count compared to exhaustive combination testing.',
    },
    {
      id: 'mt-q017',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'What is the most critical problem with this bug report?',
      code: `Title: Login button not working
Steps:
  1. Open the app
  2. Click Login
Expected: Login should work
Actual: It doesn't work`,
      codeLanguage: 'text',
      options: [
        'The title is too long and vague',
        'Steps are missing credentials; Expected and Actual results are too vague to reproduce',
        'There are too many steps listed',
        'Only environment details are missing',
      ],
      correct: 1,
      explanation:
        "A good bug report must be reproducible. Missing input data (credentials), a vague expected result, and a vague actual result make it impossible for a developer to reproduce or verify this bug.",
    },
    {
      id: 'mt-q018',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Which test estimation technique uses historical data from comparable past projects?',
      options: [
        'Expert judgment',
        'Work Breakdown Structure (WBS)',
        'Analogy-based estimation',
        'Three-point estimation',
      ],
      correct: 2,
      explanation:
        'Analogy-based estimation draws on metrics from similar past projects to calibrate effort, accounting for known unknowns that pure expert guesses might miss.',
    },
    {
      id: 'mt-q019',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Pairwise testing guarantees 100% coverage of all possible input combinations.',
      correct: false,
      explanation:
        'Pairwise testing covers all two-way combinations (any pair of parameters), not all N-way combinations. It is an efficiency trade-off — not exhaustive coverage.',
    },
    {
      id: 'mt-q020',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'Fill in the blank:',
      blank: '___ testing verifies an application behaves correctly across different browsers, OS versions, and devices.',
      chips: ['Compatibility', 'Regression', 'Security', 'Exploratory'],
      correct: 'Compatibility',
      explanation:
        'Compatibility testing ensures the application works consistently across varied environments — browsers, operating systems, screen sizes, and hardware configurations.',
    },

    // ── EXPERT ────────────────────────────────────────────────────
    {
      id: 'mt-q021',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What is the primary goal of risk-based testing?',
      options: [
        'Apply equal testing effort to every feature',
        'Automate as many test cases as possible',
        'Focus testing effort on the areas with the highest probability and impact of failure',
        'Complete all planned test cases before release',
      ],
      correct: 2,
      explanation:
        'Risk-based testing prioritises where defects are most likely and where their impact would be greatest — maximising quality coverage within limited time and resources.',
    },
    {
      id: 'mt-q022',
      type: 'tf',
      difficulty: 'expert',
      question: 'Chaos engineering involves intentionally injecting failures into a production-like system to verify resilience.',
      correct: true,
      explanation:
        "Chaos engineering (popularised by Netflix's Chaos Monkey) deliberately introduces failures — network outages, instance terminations — to surface weaknesses before they occur organically in production.",
    },
    {
      id: 'mt-q023',
      type: 'mcq',
      difficulty: 'expert',
      question: "What does 'shift-left testing' mean in a CI/CD context?",
      options: [
        'Running UI tests before API tests in the pipeline',
        'Integrating testing activities earlier in the development lifecycle',
        'Moving all testing responsibility to the operations team',
        'Executing tests in left-to-right alphabetical order',
      ],
      correct: 1,
      explanation:
        'Shift-left means bringing testing upstream: writing tests during requirements, designing for testability, and running automated checks on every commit — not just at the end of the cycle.',
    },
    {
      id: 'mt-q024',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'A team tracks Defect Removal Efficiency. What does this result indicate?',
      code: `Pre-release defects found:  75
Post-release defects found: 25

DRE = 75 / (75 + 25) × 100 = 75%`,
      codeLanguage: 'text',
      options: [
        '75% of all test cases passed during the final test cycle',
        '75% of all defects were detected before the software reached production',
        'The development team fixed 75 bugs this sprint',
        '75% of all open defects have been resolved',
      ],
      correct: 1,
      explanation:
        'DRE (Defect Removal Efficiency) measures how effective pre-release testing was. 75% means 75 of 100 total known defects were caught before release — 25 escaped to production.',
    },
    {
      id: 'mt-q025',
      type: 'tf',
      difficulty: 'expert',
      question: 'In A/B testing, all users are shown both variants of the feature simultaneously.',
      correct: false,
      explanation:
        'In A/B testing, users are split into groups — each group sees only one variant. Results are compared across groups, not within the same user session.',
    },
    {
      id: 'mt-q026',
      type: 'mcq',
      difficulty: 'expert',
      question: "Which approach best describes 'testing in production'?",
      options: [
        'Deploying completely untested code directly to production',
        'Using canary releases, feature flags, and real-user monitoring alongside pre-release testing',
        'Replacing pre-release testing entirely with live monitoring',
        'Running full integration test suites directly on the production database',
      ],
      correct: 1,
      explanation:
        'Testing in production uses canary deployments, feature flags, and synthetic monitoring to supplement — not replace — pre-release testing with real-world signals.',
    },
    {
      id: 'mt-q027',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'Identify the testing principle:',
      blank: 'The ___ principle states that defects tend to cluster in a small number of modules.',
      chips: ['Defect clustering', 'Pesticide paradox', 'Exhaustive testing', 'Shift-left'],
      correct: 'Defect clustering',
      explanation:
        'The defect clustering principle (Pareto effect in testing) states that ~80% of defects are typically found in ~20% of modules, guiding testers to focus effort where history shows the highest risk.',
    },
    {
      id: 'mt-q028',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What is the key distinction between load testing and stress testing?',
      options: [
        'They are identical — the terms are interchangeable',
        'Load testing measures behaviour under expected peak load; stress testing pushes beyond capacity to find the breaking point',
        'Stress testing only applies to database layers',
        'Load testing is always manual; stress testing must be automated',
      ],
      correct: 1,
      explanation:
        'Load testing validates performance at expected traffic levels. Stress testing intentionally exceeds capacity to find how and where the system fails — and whether it recovers gracefully.',
    },
    {
      id: 'mt-q029',
      type: 'tf',
      difficulty: 'expert',
      question: 'Test environment management is concerned only with hardware setup, not data or configuration.',
      correct: false,
      explanation:
        'Test environment management covers hardware, OS, software, configuration, and test data — all of which must be consistent and reproducible to produce reliable, repeatable test results.',
    },
    {
      id: 'mt-q030',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'After adding a new feature, the team re-runs the full test suite. What type of testing does this represent?',
      code: `Test run after feature deployment:
─────────────────────────────────
Total test cases:     200
Passed:               197
Failed:                 3  ← failures in pre-existing features
New feature tests:     15 (all pass)`,
      codeLanguage: 'text',
      options: [
        'Smoke testing',
        'Regression testing',
        'Integration testing',
        'Acceptance testing',
      ],
      correct: 1,
      explanation:
        'Regression testing re-runs existing tests after a change to confirm nothing previously working has broken. The 3 failures in pre-existing features are regressions introduced by the new code.',
    },

    // ── BEGINNER (additional) ─────────────────────────────────────
    {
      id: 'mt-q031',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What is the key distinction between a test scenario and a test case?',
      options: [
        'They are different names for the same artefact',
        'A test scenario is a high-level "what to test"; a test case is the detailed step-by-step "how to test"',
        'A test case is high-level; a test scenario is the detailed steps',
        'A test scenario is only used in automation; a test case is only used in manual testing',
      ],
      correct: 1,
      explanation:
        'A test scenario captures intent at a high level ("Verify a user can log in"). A test case breaks that intent into concrete preconditions, steps, inputs and expected results.',
    },
    {
      id: 'mt-q032',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A well-written test case must always include an expected result.',
      correct: true,
      explanation:
        'Without an expected result, there is no objective basis to decide if the test passes or fails — execution becomes guesswork. The expected result is a non-negotiable part of every test case.',
    },
    {
      id: 'mt-q033',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'A field accepts ages from 18 to 60. Which of the following is the BEST application of equivalence partitioning?',
      options: [
        'Test every integer from 18 to 60',
        'Test three groups: < 18 (invalid), 18–60 (valid), > 60 (invalid) — one value from each',
        'Test only the boundary values: 18 and 60',
        'Test only invalid inputs because valid inputs are obvious',
      ],
      correct: 1,
      explanation:
        'Equivalence partitioning divides inputs into groups expected to behave the same way, then picks one representative per group — drastically reducing test count without losing coverage of behaviour.',
    },
    {
      id: 'mt-q034',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'Complete the testing technique: examining the application without knowledge of its internal code is called ___ box testing.',
      blank: 'Examining the application without knowledge of its internal code is called ___ box testing.',
      chips: ['black', 'white', 'grey', 'red'],
      correct: 'black',
      explanation:
        'Black box testing treats the system as an opaque box — testers only see inputs and outputs, not the internal implementation. White box uses code knowledge; grey box is a hybrid.',
    },
    {
      id: 'mt-q035',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'When is sanity testing typically performed?',
      options: [
        'On the very first build, to confirm the app launches at all',
        'After a minor change or bug fix, to confirm the affected area still works',
        'Only at the end of the release cycle, replacing user acceptance testing',
        'Continuously, as part of every commit in CI',
      ],
      correct: 1,
      explanation:
        'Sanity testing is a narrow, focused check that a specific change or fix did what it should without breaking surrounding functionality. Smoke testing is the broader build-acceptance check on a new build.',
    },
    {
      id: 'mt-q036',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A static testing technique like a code review can find defects without ever running the code.',
      correct: true,
      explanation:
        'Static testing examines artefacts (code, requirements, design) without execution — reviews, walkthroughs, inspections, and static analysis all qualify. It is one of the cheapest ways to find defects early.',
    },
    {
      id: 'mt-q037',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which of these is the MOST formal type of review?',
      options: [
        'Informal review',
        'Walkthrough',
        'Technical review',
        'Inspection',
      ],
      correct: 3,
      explanation:
        'Inspections are highly formal: a trained moderator, defined roles, entry/exit criteria, pre-meeting reading, and documented metrics. Walkthroughs are author-led and looser; informal reviews have no defined process.',
    },

    // ── INTERMEDIATE (additional) ─────────────────────────────────
    {
      id: 'mt-q038',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'You are testing a discount rule that depends on three independent conditions (Premium member, Cart > $100, Promo code). Which technique gives you the cleanest coverage of all combinations?',
      options: [
        'Equivalence partitioning',
        'Boundary value analysis',
        'Decision table testing',
        'Exploratory testing',
      ],
      correct: 2,
      explanation:
        'Decision tables systematically list every combination of conditions and their corresponding actions — ideal when business rules are driven by multiple interacting inputs.',
    },
    {
      id: 'mt-q039',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Boundary value analysis only tests values exactly on the boundary — it does not test values just inside or just outside the boundary.',
      correct: false,
      explanation:
        'BVA tests values ON the boundary and immediately adjacent to it (typically boundary, boundary-1, boundary+1). Off-by-one defects cluster around boundaries, so adjacent values are essential.',
    },
    {
      id: 'mt-q040',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'Looking at this state model for an order, which testing technique is the BEST fit?',
      code: `States:      [Draft] → [Placed] → [Shipped] → [Delivered]
                              ↓
                          [Cancelled]

Transitions:
  Draft → Placed       (Submit)
  Placed → Shipped     (Pack)
  Placed → Cancelled   (Cancel)
  Shipped → Delivered  (Confirm)`,
      codeLanguage: 'text',
      options: [
        'Equivalence partitioning',
        'State transition testing',
        'Pairwise testing',
        'Use case testing',
      ],
      correct: 1,
      explanation:
        'State transition testing is designed for systems where behaviour depends on current state. It verifies valid transitions, blocks invalid ones (e.g. Delivered → Draft), and exercises each event.',
    },
    {
      id: 'mt-q041',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'According to the test automation pyramid, which layer should have the LARGEST number of tests?',
      options: [
        'UI / End-to-end tests',
        'Integration / Service tests',
        'Unit tests',
        'Manual exploratory tests',
      ],
      correct: 2,
      explanation:
        "Unit tests sit at the wide base of the pyramid: they're fast, cheap to write, and pinpoint failures precisely. UI tests are slow and brittle, so they form the narrow tip — few but high-value flows.",
    },
    {
      id: 'mt-q042',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'In a typical defect lifecycle, a defect that the developer believes works as designed is moved to the ___ state.',
      blank: 'A defect the developer believes works as designed is moved to the ___ state.',
      chips: ['Rejected', 'Reopened', 'Deferred', 'Duplicate'],
      correct: 'Rejected',
      explanation:
        'Rejected means the team disagrees that this is a bug (works as designed, not reproducible, etc.). Deferred is a real bug postponed; Duplicate matches an existing report; Reopened is for a fix that did not hold.',
    },
    {
      id: 'mt-q043',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Two testers sit at one machine, taking turns driving the keyboard while discussing ideas aloud. This is best described as:',
      options: [
        'Pair testing',
        'Buddy testing',
        'Bug bash',
        'Beta testing',
      ],
      correct: 0,
      explanation:
        'Pair testing puts two testers on one workstation, mixing skill sets and perspectives in real time — often finding defects neither would catch alone. Buddy testing pairs a developer with a tester; a bug bash is a time-boxed group hunt.',
    },
    {
      id: 'mt-q044',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Test estimation based purely on the number of test cases is reliable, since each test case takes a similar amount of time to execute.',
      correct: false,
      explanation:
        "Test cases vary widely in setup cost, complexity, and data needs. Estimation should factor in complexity, automation status, environment readiness, and risk — not raw test-case counts.",
    },

    // ── EXPERT (additional) ───────────────────────────────────────
    {
      id: 'mt-q045',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What does mutation testing measure?',
      options: [
        'The percentage of code lines executed by the test suite',
        'The strength of the test suite by introducing small code changes (mutants) and checking whether tests detect them',
        'How quickly the test suite runs after each commit',
        'The number of duplicated test cases that can be removed',
      ],
      correct: 1,
      explanation:
        "Mutation testing seeds artificial bugs into the source. A test suite that kills few mutants has weak assertions — it can execute the code without actually verifying behaviour. It is a coverage of *test quality*, not test reach.",
    },
    {
      id: 'mt-q046',
      type: 'tf',
      difficulty: 'expert',
      question: '100% code coverage guarantees that the code is defect-free.',
      correct: false,
      explanation:
        "Coverage only proves code was executed — not that it was *verified*. Tests with weak or missing assertions can produce full coverage while letting real defects through. Coverage is a floor, not a guarantee.",
    },
    {
      id: 'mt-q047',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'A team has run the same regression suite weekly for a year. Defects found by it have dropped to zero, yet production bugs continue. Which principle does this illustrate?',
      code: `Week  1: 32 regression defects, 4 production escapes
Week 26: 11 regression defects, 5 production escapes
Week 52:  0 regression defects, 6 production escapes`,
      codeLanguage: 'text',
      options: [
        'Defect clustering',
        'The pesticide paradox',
        'Exhaustive testing fallacy',
        'Absence-of-errors fallacy',
      ],
      correct: 1,
      explanation:
        "The pesticide paradox: the same tests, repeated unchanged, eventually stop finding new defects because the code has been hardened against exactly those scenarios. The fix is to evolve the test suite — new cases, new techniques, new risk areas.",
    },
    {
      id: 'mt-q048',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What is the core idea behind "shift-left" testing?',
      options: [
        'Move all testing to the end of the cycle to consolidate findings',
        'Move testing activities earlier in the SDLC (requirements review, unit tests, static analysis) to catch defects sooner and cheaper',
        'Test only the left-hand path of every decision tree',
        'Always assign testing to junior team members first',
      ],
      correct: 1,
      explanation:
        "Shift-left embeds QA from day one — testers review requirements, developers write unit tests, static analysis runs on every commit. Defects caught early cost a fraction of those caught in production.",
    },
    {
      id: 'mt-q049',
      type: 'mcq',
      difficulty: 'expert',
      question: 'In risk-based testing, how should test effort be allocated when time is limited?',
      options: [
        'Equally across every feature, regardless of risk',
        'Prioritised toward features with the highest combination of business impact and likelihood of failure',
        'Only on features that have never failed before',
        'Only on features the development team identifies as risky',
      ],
      correct: 1,
      explanation:
        "Risk = impact × likelihood. Under time pressure, concentrate testing where a failure would hurt most AND where the code is most likely to break (new, complex, recently changed). Low-risk areas get lighter coverage or get deferred.",
    },
    {
      id: 'mt-q050',
      type: 'mcq',
      difficulty: 'expert',
      question: 'A test environment refresh wipes the database, causing 40% of automated tests to fail on the next run. What is the underlying problem?',
      options: [
        'The test framework is broken and must be replaced',
        'Test data dependencies were not managed — tests assumed pre-existing data that no longer exists',
        'The CI server needs more memory',
        'The application code has regressed',
      ],
      correct: 1,
      explanation:
        "Robust tests own their data: they set up what they need (and tear it down) rather than relying on snapshots of a shared database. Test data management — fixtures, factories, isolation — prevents this whole class of brittleness.",
    },
  ],

  typescript: [
    // ── BEGINNER ──────────────────────────────────────────────────
    {
      id: 'ts-q001',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What does TypeScript add that plain JavaScript does not have?',
      options: [
        'A new runtime engine that replaces V8',
        'Static type checking at compile time — errors are caught before the code ever runs',
        'Automatic UI rendering bound to type definitions',
        'Built-in database access primitives',
      ],
      correct: 1,
      explanation:
        'TypeScript compiles to JavaScript and runs anywhere JavaScript runs — it adds no new runtime. Its value is the *compiler*: it catches type errors, missing properties, wrong arguments, and bad assignments before the code ships, eliminating an entire class of runtime bugs.',
    },
    {
      id: 'ts-q002',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which choice between `let` and `const` does TypeScript pair best with for inferred *literal* types like `"active"` rather than the wider `string`?',
      options: [
        '`let` — TypeScript narrows to the literal value',
        '`const` — TypeScript infers the literal type because the binding cannot change',
        'They are identical in TypeScript',
        '`var` — required for literal inference',
      ],
      correct: 1,
      explanation:
        'With `const x = "active"`, the binding can never be reassigned, so TypeScript safely infers the *literal* type `"active"`. With `let x = "active"`, TS widens to `string` because the value could later change. Use `const` whenever you want the narrowest possible type.',
    },
    {
      id: 'ts-q003',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A `switch` statement with an `assertNever` (or `never`-typed default) branch will fail to compile the day a new case is added to the discriminated union — forcing the developer to handle it.',
      correct: true,
      explanation:
        'Exhaustive switches are one of TypeScript\'s strongest safety nets. By assigning the default branch to a `never`-typed parameter, the compiler refuses to build until the new case is handled. This pattern catches missed updates the moment new states or types are introduced.',
    },
    {
      id: 'ts-q004',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'What does this destructuring assignment bind?',
      code: `const user = { name: "Priya", age: 28, role: "QA" };
const { name, role: position } = user;`,
      codeLanguage: 'typescript',
      options: [
        '`name` is "Priya"; `position` is "QA"; `role` and `age` are not bound',
        '`name` is "Priya"; `role` is "QA"; `position` is undefined',
        'A compile error — you cannot rename keys during destructuring',
        'All three properties are bound under their original names',
      ],
      correct: 0,
      explanation:
        'Object destructuring with `: newName` renames a property locally — `role: position` binds the value of `role` to a new variable `position`. `age` is simply not destructured. This is the standard pattern for avoiding name clashes when destructuring.',
    },
    {
      id: 'ts-q005',
      type: 'tf',
      difficulty: 'beginner',
      question: 'Declaring a variable as `any` keeps TypeScript fully checking it against assignments and operations — it just allows wider types.',
      correct: false,
      explanation:
        '`any` disables type checking entirely for that value. You can read any property, call it like a function, assign anything in or out — TS will not complain. This is why `any` is widely treated as an escape hatch to use sparingly; `unknown` is the safer alternative when you genuinely do not know the type.',
    },
    {
      id: 'ts-q006',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What is the defining difference between an array `string[]` and a tuple `[string, number]`?',
      options: [
        'Arrays are mutable; tuples are immutable',
        'Arrays hold a uniform element type with any length; tuples have a fixed length AND a specific type per position',
        'Tuples are deprecated in modern TypeScript',
        'Arrays cost more memory than tuples',
      ],
      correct: 1,
      explanation:
        'An array `string[]` is "any number of strings". A tuple `[string, number]` is exactly "first a string, then a number". Position and length both matter for tuples. Tuples shine for fixed-shape data like coordinates `[x, y]` or React\'s `[state, setState]`.',
    },
    {
      id: 'ts-q007',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'What is the inferred type of `pair` here?',
      code: `const pair = ["status", 200] as const;`,
      codeLanguage: 'typescript',
      options: [
        '`(string | number)[]`',
        '`string[]`',
        '`readonly ["status", 200]` — a tuple with literal types, locked from mutation',
        '`{ 0: string; 1: number }`',
      ],
      correct: 2,
      explanation:
        '`as const` does two things: it freezes the value as readonly AND it preserves literal types (`"status"` and `200`) instead of widening them. The result is a readonly tuple, perfect for return values that must not be mutated and consumed positionally.',
    },
    {
      id: 'ts-q008',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'In an interface, what does the `?` modifier mean for a property: `email?: string`?',
      options: [
        'The property must be present but its value may be `null`',
        'The property may be absent OR may have value `undefined` — both are accepted',
        'The property type is `string | null`',
        'The property is private to the interface',
      ],
      correct: 1,
      explanation:
        'An optional property may be omitted entirely OR present with value `undefined`. The type becomes effectively `string | undefined`. This is distinct from `email: string | null` (must be present, may be null) — the difference matters when iterating or stringifying.',
    },
    {
      id: 'ts-q009',
      type: 'tf',
      difficulty: 'beginner',
      question: 'An `interface` declaration generates JavaScript code at runtime that can be inspected with `typeof`.',
      correct: false,
      explanation:
        'Interfaces are *erased* at compile time — they exist only in the type system and produce no runtime code. You cannot do `if (x instanceof MyInterface)`. To check shape at runtime you need a type guard function or a runtime schema library (Zod, io-ts).',
    },
    {
      id: 'ts-q010',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'What is the inferred return type of `add`?',
      code: `function add(a: number, b: number) {
  return a + b;
}`,
      codeLanguage: 'typescript',
      options: [
        '`number` — TypeScript infers the return type from the function body',
        '`any` — return types must always be explicit',
        '`void` — no annotation means no return value',
        'A compile error — the function needs a `: number` return annotation',
      ],
      correct: 0,
      explanation:
        'TypeScript infers return types from the body. Adding two `number`s yields `number`. Explicit return annotations are often added at module boundaries (for documentation and to lock the contract) but are not required for internal helpers — let inference do the work.',
    },
    {
      id: 'ts-q011',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A union `string | number` accepts a value of either type, while an intersection `Named & Aged` requires the value to satisfy BOTH types simultaneously.',
      correct: true,
      explanation:
        'Unions are OR (the value can be any one of the listed types); intersections are AND (the value must satisfy all of them at once). Unions are common on input values; intersections are common when combining mixin shapes — like merging `Named` and `Aged` into a single object that has all fields of both.',
    },
    {
      id: 'ts-q012',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'Which line raises a compile error?',
      code: `type Status = "pending" | "active" | "closed";
let s: Status;

s = "pending";   // A
s = "active";    // B
s = "deleted";   // C
s = "closed";    // D`,
      codeLanguage: 'typescript',
      options: [
        'A',
        'B',
        'C — "deleted" is not a member of the union',
        'D',
      ],
      correct: 2,
      explanation:
        'String literal unions restrict the variable to exactly the listed strings. Any other value, including a misspelling, is a compile error. This pattern eliminates "magic string" typos and is a primary reason teams adopt TypeScript.',
    },
    {
      id: 'ts-q013',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which is the strongest reason to prefer string enums (`"OPEN"`, `"CLOSED"`) over numeric enums (auto-incrementing 0, 1, 2)?',
      options: [
        'String enums are faster at runtime',
        'String enums are self-documenting in logs/debugging and stable when items are reordered or inserted; numeric enum values silently shift',
        'String enums use less memory',
        'Numeric enums are deprecated in modern TypeScript',
      ],
      correct: 1,
      explanation:
        'Numeric enums tie values to position — adding a new case at the top renumbers everything, silently breaking serialised data. String enums carry their own readable identity ("OPEN" stays "OPEN"), survive reordering, and read better in logs. Most modern style guides default to string enums.',
    },
    {
      id: 'ts-q014',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'To give a complex type a reusable name without creating a new object shape from scratch, use the ___ keyword.',
      blank: 'To give a complex type a reusable name, use the `___ Foo = ...` keyword.',
      chips: ['type', 'class', 'enum', 'const'],
      correct: 'type',
      explanation:
        '`type Alias = ...` creates a name for an existing shape — it does not generate a new construct, just a label. Works for unions, intersections, tuples, primitives, anything. `interface` is the other naming construct (for object shapes specifically) and supports declaration merging.',
    },
    {
      id: 'ts-q015',
      type: 'tf',
      difficulty: 'beginner',
      question: 'The non-null assertion operator `!` (as in `user!.email`) tells TypeScript the value is not null — and TypeScript also adds a runtime check to enforce that.',
      correct: false,
      explanation:
        '`!` is a *compile-time only* suppression — it tells TypeScript "trust me, this is not null" and erases the check. If the value is null at runtime, you get a `TypeError`. It is a sharp tool: prefer narrowing (`if (user) …`) or optional chaining (`user?.email`) which produce safe runtime behaviour.',
    },
    {
      id: 'ts-q016',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'A runtime check like `if (typeof x === "string")` that narrows the type inside the block is called a type ___.',
      blank: 'A runtime check that narrows the static type is called a type ___.',
      chips: ['guard', 'cast', 'assertion', 'alias'],
      correct: 'guard',
      explanation:
        'Type *guards* (typeof, instanceof, `in`, and user-defined predicates like `x is Foo`) are the safe way to narrow types — they perform a real runtime check and TypeScript follows the narrowing. Type *assertions* (`as`) bypass safety; type *aliases* are naming constructs.',
    },
    {
      id: 'ts-q017',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'The declared return type of an `async` function is always wrapped in a ___.',
      blank: 'An async function `: ___<User>` returns a User asynchronously.',
      chips: ['Promise', 'Future', 'Awaitable', 'Task'],
      correct: 'Promise',
      explanation:
        'Every `async` function returns a `Promise<T>` — even `async () => 1` returns `Promise<number>`. You can write `: Promise<User>` explicitly, or let TS infer it from the body. Inside the function you operate on the unwrapped value with `await`.',
    },

    // ── INTERMEDIATE ──────────────────────────────────────────────
    {
      id: 'ts-q018',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Why write a generic function `function first<T>(arr: T[]): T | undefined` instead of `function first(arr: any[]): any`?',
      options: [
        'It runs faster at runtime',
        'It preserves the input element type at the call site — `first([1, 2, 3])` returns `number | undefined`, not `any` — keeping type safety end-to-end',
        'Generics are required syntax in modern TypeScript',
        'It reduces bundle size',
      ],
      correct: 1,
      explanation:
        'A generic parameter `T` is inferred at each call site. The compiler "plugs in" the actual type and returns it. With `any` you discard all type info — every property access becomes unchecked. Generics are the type-safe way to write reusable container functions.',
    },
    {
      id: 'ts-q019',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'Why does this generic constraint matter?',
      code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "world");        // OK
longest([1, 2, 3], [4, 5]);       // OK
longest(123, 456);                // ❌ ?`,
      codeLanguage: 'typescript',
      options: [
        'The third call is fine — numbers have a `length` of zero',
        'The third call fails — `number` does not have a `length` property, so it does not satisfy the constraint `extends { length: number }`',
        'The constraint is decorative — TypeScript ignores `extends` at compile time',
        'All three calls fail — generics cannot be used with primitive types',
      ],
      correct: 1,
      explanation:
        '`T extends { length: number }` says "T must have a length property of type number". Strings and arrays satisfy this; numbers do not. The constraint guarantees the function body\'s use of `.length` is safe at every call site.',
    },
    {
      id: 'ts-q020',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'You receive a JSON response of completely unknown shape. Which type should the variable be — and what does it force you to do?',
      options: [
        '`any` — fastest and easiest',
        '`unknown` — TypeScript forces you to narrow (typeof / type guard / schema check) before you can use any property',
        '`object` — guaranteed safe for all JSON data',
        '`never` — to signal an impossible value',
      ],
      correct: 1,
      explanation:
        '`unknown` is the type-safe sibling of `any`. You can assign anything *to* it, but you cannot do anything *with* it until you have proven the type via a narrowing check. This is exactly the behaviour you want at trust boundaries — network responses, user input, JSON.parse output.',
    },
    {
      id: 'ts-q021',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'The `never` type represents a value that can never occur — useful for marking unreachable code paths and exhaustive switch defaults.',
      correct: true,
      explanation:
        '`never` is the "bottom" type — assignable to every other type, but holding no values. Functions that always throw or run forever return `never`. The classic `assertNever(x: never): never` is used in exhaustive switch defaults to make TypeScript fail compilation whenever a new union case is added.',
    },
    {
      id: 'ts-q022',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Which is the cleanest way for TypeScript to narrow a discriminated union `type Shape = { kind: "circle"; r: number } | { kind: "square"; side: number }` inside a function body?',
      options: [
        'Check `typeof shape.r === "number"` — duck-type on properties',
        'Use the discriminant: `if (shape.kind === "circle") ...` — TypeScript narrows to the matching variant',
        'Use `instanceof` — it works for object literals too',
        'Type cast with `as` on every branch',
      ],
      correct: 1,
      explanation:
        "Discriminated unions exist for exactly this pattern: a literal `kind` field acts as the tag. Checking the discriminant narrows the type — inside `if (shape.kind === \"circle\")` TypeScript knows `shape` is the circle variant and `shape.r` is in scope. Cleaner and safer than property-existence checks or `as`.",
    },
    {
      id: 'ts-q023',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Why is `const menu = { pizza: 12, pasta: 10 } satisfies Record<string, number>` often better than `const menu: Record<string, number> = ...`?',
      options: [
        'It is shorter to type',
        'It validates the shape AND preserves the literal-key types ("pizza", "pasta"), so `menu.pizza` keeps its specific type information; the explicit annotation widens to `Record<string, number>` and loses those keys',
        'It compiles faster',
        '`satisfies` produces a runtime check; an annotation does not',
      ],
      correct: 1,
      explanation:
        '`satisfies` gives you both validation (shape conforms) AND type preservation (literal types kept). Annotation forces the value down to the annotated type. With `satisfies`, `menu.pizza` is `number` AND `menu` is known to have exactly those keys — you can do `keyof typeof menu` and get `"pizza" | "pasta"`.',
    },
    {
      id: 'ts-q024',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'What does `Partial<User>` produce given `type User = { id: number; name: string; email: string }`?',
      options: [
        '`{ id: number; name?: string; email?: string }` — only the first property remains required',
        '`{ id?: number; name?: string; email?: string }` — every property becomes optional',
        '`{ id: number }` — only the id is kept',
        '`User | undefined` — the user itself becomes optional',
      ],
      correct: 1,
      explanation:
        '`Partial<T>` is a mapped utility type that makes every property of T optional. Perfect for update DTOs where the caller supplies only the fields they want to change. Other useful siblings: `Required<T>` (all required), `Readonly<T>` (all readonly), `Pick<T, K>` and `Omit<T, K>` (subset selection).',
    },
    {
      id: 'ts-q025',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'To select only specific keys from a type — e.g. just `id` and `email` from `User` — use the utility type `Pick`. To drop keys instead, use the utility type ___.',
      blank: 'To remove specific keys from a type, use the utility type ___.',
      chips: ['Omit', 'Exclude', 'Without', 'Drop'],
      correct: 'Omit',
      explanation:
        '`Pick<T, K>` keeps the listed keys; `Omit<T, K>` removes them. Both produce new object types and are the standard tools for derived DTOs. `Exclude` is for union types (removes union members), not object keys — easy to confuse with `Omit`.',
    },
    {
      id: 'ts-q026',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Given `type User = { id: number; name: string; role: "admin" | "viewer" }`, what is `keyof User`?',
      options: [
        '`number | string | "admin" | "viewer"` — the union of value types',
        '`"id" | "name" | "role"` — the union of property names',
        '`User` — the type itself',
        '`unknown` — keyof only works on classes',
      ],
      correct: 1,
      explanation:
        '`keyof T` produces the union of T\'s property *names* as string literals. This is the building block of type-safe accessor patterns: `function get<T, K extends keyof T>(obj: T, key: K): T[K]` lets the compiler verify each `obj[key]` access at compile time.',
    },
    {
      id: 'ts-q027',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'A TypeScript construct that iterates over an existing type\'s keys and transforms each property — e.g. making them all readonly or all optional — is called a ___ type.',
      blank: 'A type that iterates keys of an existing type and transforms each is called a ___ type.',
      chips: ['mapped', 'conditional', 'literal', 'variadic'],
      correct: 'mapped',
      explanation:
        'Mapped types `{ [K in keyof T]: ... }` are the engine behind utility types like `Partial`, `Readonly`, `Pick`. They take an existing type and produce a transformed version of it. Combined with key remapping `as` (TS 4.1+) they can rename, filter, or reshape keys.',
    },
    {
      id: 'ts-q028',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'A conditional type `T extends U ? X : Y` is evaluated at compile time and produces either `X` or `Y`.',
      correct: true,
      explanation:
        'Conditional types are if/else at the type level. They are resolved by the compiler — at runtime no trace remains. Combined with `infer` they extract pieces of types (return types, promise contents, function parameters) and underpin most utility-type libraries.',
    },
    {
      id: 'ts-q029',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'What set of strings does `EventName` allow?',
      code: `type Module = "auth" | "billing";
type Action = "created" | "deleted";
type EventName = \`\${Module}-\${Action}\`;`,
      codeLanguage: 'typescript',
      options: [
        'Just two strings: `"auth"` and `"billing"`',
        'All combinations: `"auth-created"`, `"auth-deleted"`, `"billing-created"`, `"billing-deleted"` (cartesian product of the unions)',
        'Any string at all — template literal types are non-restrictive',
        'Only `"auth-created"` because TS picks the first member',
      ],
      correct: 1,
      explanation:
        'Template literal types distribute over unions: every combination of placeholders is generated. The result is a strongly-typed controlled vocabulary — perfect for event names, route paths, or CSS class patterns where you want type-safe string composition.',
    },
    {
      id: 'ts-q030',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'Given `type User = { id: number; email: string }`, what is `User["email"]`?',
      options: [
        '`string` — indexed access returns the type at that key',
        '`"email"` — the string literal',
        '`{ email: string }` — a new object type',
        'A compile error — bracket syntax is for values, not types',
      ],
      correct: 0,
      explanation:
        'Indexed access types `T[K]` look up the type at a specific key — the type-system analogue of `obj["email"]`. They are essential when you want to refer to one field of a type without restating its definition, especially in generics: `function getField<T, K extends keyof T>(obj: T, key: K): T[K]`.',
    },
    {
      id: 'ts-q031',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'In a TypeScript class, what does `private` actually enforce?',
      options: [
        'Runtime privacy — JavaScript hides the field, even from `Object.keys`',
        'Compile-time visibility only — the field is accessible in plain JavaScript or via type-suppressing tricks, but the compiler blocks normal external access',
        'Both — TypeScript emits closures to truly hide the field',
        'Nothing — `private` is purely documentation',
      ],
      correct: 1,
      explanation:
        '`private`, `protected`, and `public` are *compile-time* access modifiers. At runtime the property is a regular JavaScript property. For runtime privacy, use ECMAScript private fields (`#field`), which the JavaScript runtime itself enforces. Both have their place — TS modifiers for type-level intent, `#field` for hard runtime privacy.',
    },
    {
      id: 'ts-q032',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Encapsulation is an OOP principle that hides an object\'s internal state and exposes a controlled surface for interaction.',
      correct: true,
      explanation:
        'Encapsulation = "decide what to hide, and protect it behind a small public surface". The benefits: callers cannot break invariants by tampering with internals, the implementation can be refactored without breaking consumers, and the public API tells you what is meant to be used. The other three OOP pillars are inheritance, polymorphism, and abstraction.',
    },
    {
      id: 'ts-q033',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'To import a value purely for its type information so it gets erased from the JavaScript output (and avoids circular runtime imports), prefix the import with the keyword ___.',
      blank: 'Use `import ___ { User } from "./types"` to bring in only the type, not the runtime binding.',
      chips: ['type', 'declare', 'readonly', 'pure'],
      correct: 'type',
      explanation:
        '`import type { Foo }` makes the import type-only — the import is erased from the emitted JS. This avoids circular-dependency runtime errors when only the type is needed, and is a recommended default for type-only imports in modern TS code.',
    },
    {
      id: 'ts-q034',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A decorator (e.g. `@Logged` on a class method) does what?',
      options: [
        'Renames the method at compile time',
        'Attaches behaviour — typically wrapping or modifying the target — without changing the original code, executed when the class is defined',
        'Generates JSDoc comments automatically',
        'Adds a runtime type check on the method\'s arguments',
      ],
      correct: 1,
      explanation:
        'Decorators are functions that receive the target (class/method/property) and can return a replacement or attach metadata. They run *once* at definition time, not on each call. Use cases: logging, retry, dependency injection, ORM annotations. They keep cross-cutting concerns out of the business logic.',
    },

    // ── EXPERT ────────────────────────────────────────────────────
    {
      id: 'ts-q035',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What does the `infer` keyword enable inside a conditional type?',
      options: [
        'Inferring the runtime type of a value',
        'Capturing a piece of an existing type as a named variable inside the conditional — e.g. `T extends Array<infer U> ? U : never` extracts the element type',
        'Asking TypeScript to guess types when annotations are missing',
        'Performing a type assertion',
      ],
      correct: 1,
      explanation:
        '`infer` is a placeholder for "let TypeScript figure this out at this position". Built-in utilities like `ReturnType<T>` and `Awaited<T>` use `infer` to extract pieces of function/promise types. It is the core mechanism behind type-level destructuring.',
    },
    {
      id: 'ts-q036',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'What is the resulting type of `Box<string | number>`?',
      code: `type Box<T> = T extends string ? { kind: "text"; value: T }
                          : T extends number ? { kind: "num"; value: T }
                          : never;

type Result = Box<string | number>;`,
      codeLanguage: 'typescript',
      options: [
        '`{ kind: "text"; value: string | number }` — the conditional sees the whole union',
        '`{ kind: "text"; value: string } | { kind: "num"; value: number }` — distributive conditional types distribute over the input union',
        '`never` — neither branch matches a union',
        '`unknown`',
      ],
      correct: 1,
      explanation:
        '*Distributive* conditional types: when `T` is a union and naked (`T extends ...` with T bare on the left), the conditional distributes over each union member separately and recombines them. Wrapping `T` in something like `[T] extends [...]` disables distribution — useful when you do *not* want this behaviour.',
    },
    {
      id: 'ts-q037',
      type: 'tf',
      difficulty: 'expert',
      question: 'When the checked type is a naked type parameter on the left side of `extends`, conditional types distribute automatically over union members.',
      correct: true,
      explanation:
        'Distributive conditional types are a defining feature of the TypeScript type system. `T extends X ? A : B` with `T = U1 | U2` becomes `(U1 extends X ? A : B) | (U2 extends X ? A : B)`. To suppress this, wrap both sides in a tuple: `[T] extends [X]`. Mastering this distinction is essential for accurate type-level programming.',
    },
    {
      id: 'ts-q038',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What does key remapping with `as` in a mapped type let you do?',
      options: [
        'Add a runtime check to property access',
        'Rename keys during the mapping — e.g. prefix every key with "get" to derive a getter API from a value type',
        'Convert a class to an interface',
        'Force every key to be a string',
      ],
      correct: 1,
      explanation:
        "TS 4.1+ allows `as` inside mapped types: `{ [K in keyof T as \`get${Capitalize<string & K>}\`]: () => T[K] }` derives a getter type from a property type. Combined with `never` you can also *filter* keys: `as K extends string ? K : never` drops symbol/number keys.",
    },
    {
      id: 'ts-q039',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'What keys remain in this mapped type result?',
      code: `type User = { id: number; name: string; createdAt: Date; deletedAt: Date };

type DateKeys<T> = {
  [K in keyof T as T[K] extends Date ? K : never]: T[K];
};

type Result = DateKeys<User>;`,
      codeLanguage: 'typescript',
      options: [
        'All four properties from User',
        'Only `createdAt` and `deletedAt` — the `as` clause filters out keys whose value type is not `Date`',
        '`id` and `name` only',
        '`never` — the whole type collapses',
      ],
      correct: 1,
      explanation:
        'Key remapping with `as ... ? K : never` is the canonical filter pattern. Keys remapped to `never` are dropped from the result. Here only properties whose value type extends `Date` survive — a powerful way to derive specialised types from a base shape.',
    },
    {
      id: 'ts-q040',
      type: 'mcq',
      difficulty: 'expert',
      question: 'Variadic tuple types (TS 4.0+) let you do what that earlier TypeScript could not?',
      options: [
        'Use tuples as React props',
        'Spread one tuple inside another with the precise types preserved — `type Combined = [...First, ...Second]` keeps the exact position-by-position types',
        'Create tuples with more than 3 elements',
        'Override the tuple `length` property',
      ],
      correct: 1,
      explanation:
        'Pre-4.0 you could only spread an array (losing positional types). Variadic tuples let you compose tuples with full type fidelity — useful for typed argument forwarding, curry helpers, and type-safe wrapper functions that prepend/append arguments.',
    },
    {
      id: 'ts-q041',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'What is the inferred type of `result`?',
      code: `function prepend<T extends unknown[]>(first: string, rest: [...T]) {
  return [first, ...rest] as const;
}

const result = prepend("hello", [42, true]);`,
      codeLanguage: 'typescript',
      options: [
        '`readonly string[]` — everything widens to string',
        '`readonly ["hello", 42, true]` — variadic tuple inference preserves the exact element types and order',
        '`readonly (string | number | boolean)[]`',
        '`readonly [string, ...unknown[]]`',
      ],
      correct: 1,
      explanation:
        'The `[...T]` parameter pattern captures the rest tuple precisely, and `as const` freezes the spread output as a readonly tuple of literals. This is variadic tuple inference at its most useful — typed forwarding of variable-length arguments without losing precision.',
    },
    {
      id: 'ts-q042',
      type: 'mcq',
      difficulty: 'expert',
      question: 'TypeScript\'s structural typing means a `UserId` (alias for `string`) and an `OrderId` (alias for `string`) are interchangeable — even though semantically they should not be. What is the standard fix?',
      options: [
        'Switch the whole project to nominal typing — TS has a flag for it',
        'Use a *branded* type: `type UserId = string & { readonly __brand: "UserId" }` so the compiler treats the brand as distinguishing, even though at runtime it is still just a string',
        'Wrap each ID in a class with the same shape',
        'There is no way to distinguish — accept the trade-off',
      ],
      correct: 1,
      explanation:
        'Branded types add a phantom property (an intersection with a unique tag) that exists only in the type system. At runtime values are plain strings; at compile time the compiler refuses to mix `UserId` and `OrderId` because their brands differ. This is the standard workaround for nominal-style typing in a structural type system.',
    },
    {
      id: 'ts-q043',
      type: 'tf',
      difficulty: 'expert',
      question: 'Branded types add runtime overhead — extra fields are present on the value at runtime to support the distinction.',
      correct: false,
      explanation:
        'The phantom property in a branded type exists *only* in the type system — it is never assigned at runtime, and adding the brand is purely a compile-time cast (often through a factory function). Zero runtime overhead is one of branded types\' main appeals.',
    },
    {
      id: 'ts-q044',
      type: 'mcq',
      difficulty: 'expert',
      question: 'The Result pattern returns either `{ ok: true; value: T }` or `{ ok: false; error: E }`. What is its main benefit over throwing exceptions?',
      options: [
        'It runs faster than try/catch',
        'Errors become part of the function signature — callers must handle them via narrowing, the compiler enforces it, and the error type is precise (not just `unknown` or `Error`)',
        'It avoids stack traces, which slows debugging',
        'It works only in synchronous code',
      ],
      correct: 1,
      explanation:
        'Thrown errors are invisible to the type system — every function call could secretly throw, and the caught value is `unknown` until you narrow it. The Result pattern makes failure a first-class value: the compiler refuses to compile if you forget to handle the error branch. Trade-off: more verbose call sites.',
    },
    {
      id: 'ts-q045',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'What is the role of the `kind` field in this error type?',
      code: `type ParseError =
  | { kind: "syntax";    line: number;   message: string }
  | { kind: "type";      expected: string; got: string }
  | { kind: "reference"; name: string };

function describe(err: ParseError) {
  if (err.kind === "syntax")    return \`line \${err.line}\`;
  if (err.kind === "type")      return \`expected \${err.expected}\`;
  if (err.kind === "reference") return \`unknown \${err.name}\`;
}`,
      codeLanguage: 'typescript',
      options: [
        'It is for logging only — the compiler ignores it',
        'It is a discriminant — branching on it narrows the type so each branch sees only the fields valid for that variant',
        'It is required by the Error class hierarchy',
        'It is the error code returned to the user',
      ],
      correct: 1,
      explanation:
        'A discriminated error union lets each error type carry its own precise fields. Narrowing on `err.kind` unlocks just those fields in each branch — `err.line` is available only in the syntax branch, `err.expected` only in the type branch. This is the textbook way to model heterogeneous errors in TS.',
    },
    {
      id: 'ts-q046',
      type: 'mcq',
      difficulty: 'expert',
      question: 'A type-safe builder uses what TypeScript trick to refuse to compile if required fields are not yet set before `.build()`?',
      options: [
        'A try/catch wrapped around `.build()`',
        'Progressively narrowed return types — each setter returns a new type that records which fields have been provided, and `.build()` is only available when the type proves all required fields are filled',
        'Runtime assertions inside `.build()`',
        '`@Required` decorators on every setter',
      ],
      correct: 1,
      explanation:
        'The pattern: each setter returns `this & { [field]: T }` (or moves through a state-machine of type parameters). `.build()` is constrained to states that include all required fields. Forgetting `.withEmail(...)` produces a compile error, not a runtime one — the Submit button is greyed out before you run the form.',
    },
    {
      id: 'ts-q047',
      type: 'mcq',
      difficulty: 'expert',
      question: 'Declaration merging works on which constructs?',
      options: [
        'All TypeScript constructs equally',
        'Interfaces, namespaces, and (with the right syntax) modules — but NOT `type` aliases, which are sealed',
        'Only classes',
        'Only enums',
      ],
      correct: 1,
      explanation:
        'Two interface declarations with the same name merge into a single interface with combined members — the basis of module augmentation in libraries like Express (adding `req.user`). Type aliases are sealed — you cannot redeclare or extend them this way. Knowing which construct to reach for is essential when augmenting third-party types.',
    },
    {
      id: 'ts-q048',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'Adding extra properties to a third-party module\'s type definitions from your own code is called module ___.',
      blank: 'Extending a library\'s types from your own code is called module ___.',
      chips: ['augmentation', 'extension', 'merging', 'override'],
      correct: 'augmentation',
      explanation:
        'Module augmentation uses `declare module "library-name" { interface Foo { ... } }` to add to a library\'s exported types — the standard way to extend Express `Request`, attach methods to React types, or extend a CSS-in-JS theme. Powerful but invisible — document it well.',
    },
    {
      id: 'ts-q049',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What does enabling `"strict": true` in `tsconfig.json` actually do?',
      options: [
        'Sets the language target to the latest ES version',
        'Turns on a family of strictness flags together — strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, alwaysStrict, etc. — instead of having to enable each one individually',
        'Enables source maps',
        'Disables decorators',
      ],
      correct: 1,
      explanation:
        '`strict: true` is an umbrella switch for a curated set of safety flags. Enabling individual flags lets you ratchet up strictness gradually; enabling all at once is recommended for new projects. Most teams treat `strict: true` as the minimum baseline for a serious TS codebase.',
    },
    {
      id: 'ts-q050',
      type: 'tf',
      difficulty: 'expert',
      question: 'Changing `tsconfig.json` flags affects the runtime behaviour of the compiled JavaScript output.',
      correct: false,
      explanation:
        'tsconfig settings affect what the *compiler* will reject and how it emits JS (module format, target, source maps, etc.), but the *runtime semantics* of valid programs are unchanged — the same JS executes the same way regardless of whether `strict` was on. Strict mode catches more bugs at compile time; it does not change what the program does once it compiles.',
    },
  ],

  api: [
    // ── BEGINNER ──────────────────────────────────────────────────
    {
      id: 'api-q001',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which best describes what an API really is?',
      options: [
        'A user interface that lets non-technical users browse a database',
        'A contract between a client and a server defining what requests are accepted and what responses are returned',
        'A specific protocol that only works over HTTPS',
        'A user-facing application screen rendered by the browser',
      ],
      correct: 1,
      explanation:
        'An API is the formal contract between two pieces of software. The client sends requests in an agreed shape; the server responds in an agreed shape. The protocol (HTTP, gRPC, etc.) is the transport — the API itself is the contract.',
    },
    {
      id: 'api-q002',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Which statement best captures the fundamental difference between REST and SOAP?',
      options: [
        'SOAP is older and uses XML envelopes with a strict standard; REST is leaner, uses standard HTTP verbs against resource URLs, and typically returns JSON',
        'SOAP only supports GET and POST; REST supports every HTTP method',
        'REST cannot transport binary data; SOAP can',
        'They are the same protocol with different vendor names',
      ],
      correct: 0,
      explanation:
        'SOAP is a heavyweight, XML-based standard with strict envelope structure and WS-* extensions. REST is an architectural style on top of plain HTTP — verbs (GET/POST/PUT/DELETE) act on resource URLs and usually carry JSON. REST has won most modern public APIs because it is simpler and easier to consume.',
    },
    {
      id: 'api-q003',
      type: 'tf',
      difficulty: 'beginner',
      question: 'PUT is idempotent — running the same PUT request multiple times has the same final effect as running it once.',
      correct: true,
      explanation:
        'Idempotency: repeated identical calls leave the system in the same state. PUT replaces a resource with the same body each time → idempotent. POST creates a new resource each call → not idempotent. DELETE is idempotent (resource is gone after the first call). GET is idempotent (and safe — no side effects).',
    },
    {
      id: 'api-q004',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'Looking at the request line, what is happening here?',
      code: `POST /api/orders HTTP/1.1
Host: shop.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "product_id": 42,
  "quantity": 2
}`,
      codeLanguage: 'text',
      options: [
        'Reading an existing order with id 42 from the server',
        'Creating a new order resource — POST means create, the body carries the new order details',
        'Replacing an entire orders collection with the supplied body',
        'Deleting all orders that match product_id 42',
      ],
      correct: 1,
      explanation:
        'POST to a collection URL (/api/orders) means "create a new item in this collection". The JSON body describes the new resource. The server typically responds 201 Created with the new resource\'s URL in the Location header.',
    },
    {
      id: 'api-q005',
      type: 'tf',
      difficulty: 'beginner',
      question: 'A GET request must never carry a request body — sending one is forbidden by the HTTP specification.',
      correct: false,
      explanation:
        'The HTTP spec does not forbid GET with a body, but it explicitly says servers should not use it semantically — many proxies, caches, and frameworks strip or ignore it. Always carry GET parameters in the URL (query string), not in a body.',
    },
    {
      id: 'api-q006',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'When you receive an API response, what is the FIRST thing you should inspect to decide if the call succeeded?',
      options: [
        'The body — parse the JSON and check for an "error" field',
        'The response headers — look at Content-Type first',
        'The HTTP status code — the single number that tells you the result class',
        'The response time — anything over 200ms means failure',
      ],
      correct: 2,
      explanation:
        'The HTTP status code is the canonical success/failure signal. 2xx means success regardless of what the body contains; 4xx/5xx means failure even if the body looks healthy. Always assert on the status first, then drill into the body.',
    },
    {
      id: 'api-q007',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'A POST that successfully creates a new resource should return status code ___.',
      blank: 'A successful POST that creates a new resource should return status ___.',
      chips: ['201', '200', '204', '202'],
      correct: '201',
      explanation:
        '201 Created is the precise code for "resource created successfully" and typically comes with a Location header pointing to the new resource. 200 OK is a generic success (often for reads); 204 No Content for successful operations with no body; 202 Accepted for queued/async operations.',
    },
    {
      id: 'api-q008',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What is the practical difference between 401 Unauthorized and 403 Forbidden?',
      options: [
        'They are interchangeable — pick whichever name reads better',
        '401 = "we don\'t know who you are — authenticate"; 403 = "we know who you are but you cannot access this resource"',
        '401 only applies to expired tokens; 403 only applies to revoked tokens',
        '401 is for users; 403 is for service accounts',
      ],
      correct: 1,
      explanation:
        '401 is an authentication failure — credentials are missing, invalid, or expired. 403 is an authorisation failure — credentials are valid but the user lacks permission. Mixing these up makes debugging painful and is a common API design bug.',
    },
    {
      id: 'api-q009',
      type: 'tf',
      difficulty: 'beginner',
      question: '5xx status codes indicate the client made a mistake in the request.',
      correct: false,
      explanation:
        '5xx codes mean the server failed (500 generic, 502 bad gateway, 503 unavailable, 504 timeout). 4xx codes mean the client erred (400 bad request, 401/403 auth, 404 not found, 422 validation). Confusing the two leads to bug reports filed against the wrong team.',
    },
    {
      id: 'api-q010',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'A DELETE request returns this response. What does the empty body indicate?',
      code: `HTTP/1.1 204 No Content
Date: Mon, 12 May 2026 10:30:00 GMT
Content-Length: 0`,
      codeLanguage: 'text',
      options: [
        'A bug — every successful response must include a JSON body',
        'A 204 indicates success with intentionally no body — common for DELETE and some PUT/PATCH operations',
        'The server is returning an error in headers only',
        'The client should retry — empty body means processing is still in progress',
      ],
      correct: 1,
      explanation:
        '204 No Content is a contract: "I succeeded and have nothing further to say". Standard for DELETE and frequently used for PUT/PATCH when the client already has the latest state. Asserting "200 with a body" against a 204 endpoint is a common false-failure in test suites.',
    },
    {
      id: 'api-q011',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'In JSON, the value `true` is of type ___.',
      blank: 'In JSON, `true` and `false` are values of the ___ type.',
      chips: ['boolean', 'string', 'number', 'null'],
      correct: 'boolean',
      explanation:
        'JSON has exactly six types: string, number, boolean (true/false), null, object, array. Note that `"true"` (with quotes) is a string — a common bug in clients that stringify booleans before sending.',
    },
    {
      id: 'api-q012',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'What is the primary purpose of an Environment in Postman?',
      options: [
        'To store the OS and browser version of the test machine',
        'To hold a set of variables (e.g. base URL, auth token, user ID) so the same collection can run against dev, staging, and prod without editing requests',
        'To enable parallel execution across multiple test machines',
        'To group requests by HTTP method (GET vs POST)',
      ],
      correct: 1,
      explanation:
        "Environments parameterise the collection: `{{base_url}}/users` resolves differently when you switch from \"Dev\" to \"Prod\". This is what makes Postman collections portable and the same tests usable across deployment targets.",
    },
    {
      id: 'api-q013',
      type: 'fill-blank',
      difficulty: 'beginner',
      question: 'The cURL flag used to specify the HTTP method (e.g. PUT or DELETE) is ___.',
      blank: 'To specify the HTTP method in cURL, use the ___ flag.',
      chips: ['-X', '-d', '-H', '-i'],
      correct: '-X',
      explanation:
        '`-X METHOD` sets the verb (default is GET if omitted, or POST when `-d` is used). `-d` adds a body; `-H` adds a header; `-i` includes response headers in the output. These four flags cover most everyday API debugging.',
    },
    {
      id: 'api-q014',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'Where should each piece typically go: an auth token, a search term, and a specific user ID?',
      options: [
        'All three in the URL path',
        'Auth token in header · search term in query string · user ID in path',
        'All three in headers',
        'Auth token in body · search term in path · user ID in query',
      ],
      correct: 1,
      explanation:
        'Auth tokens belong in headers (out of URLs to keep them out of logs and browser history). Search filters are query params (?q=…). Resource identifiers are path params (/users/42). Misplacing any of these leaks secrets, hurts cacheability, or breaks REST conventions.',
    },
    {
      id: 'api-q015',
      type: 'code-mcq',
      difficulty: 'beginner',
      question: 'In the URL `GET /api/users/42?status=active&limit=10`, which parts are path params and which are query params?',
      code: `GET /api/users/42?status=active&limit=10
HTTP/1.1`,
      codeLanguage: 'text',
      options: [
        'Path param: 42 · Query params: status=active, limit=10',
        'Path params: 42, status · Query params: active, limit',
        'Path params: users, 42 · Query params: everything after the ?',
        'Path params: everything before the ? · Query param: only "limit"',
      ],
      correct: 0,
      explanation:
        'Path params are the segments embedded in the URL path itself — here, `42` identifies the user. Query params come after the `?` as key=value pairs separated by `&` — `status=active` and `limit=10` filter or modify the request. Path = identity; query = options.',
    },
    {
      id: 'api-q016',
      type: 'mcq',
      difficulty: 'beginner',
      question: 'A team is choosing between URL-path versioning (`/v1/users`) and header versioning (`Accept: application/vnd.app.v1+json`). Which best captures the trade-off?',
      options: [
        'URL versioning is universally faster — always pick it',
        'URL versioning is more visible and easier to test in a browser; header versioning keeps the URL clean and is technically more "RESTful" but harder to inspect at a glance',
        'Header versioning is deprecated by HTTP/2',
        'They are functionally identical — pick by team preference only',
      ],
      correct: 1,
      explanation:
        "URL versioning is pragmatic and discoverable — easy to test, easy to document. Header versioning is purist (URLs identify resources, not versions) but harder to debug and not browser-friendly. Most public APIs choose URL versioning; some enterprise APIs prefer headers.",
    },
    {
      id: 'api-q017',
      type: 'tf',
      difficulty: 'beginner',
      question: 'Adding a new OPTIONAL field to an API response is considered a breaking change that requires a new API version.',
      correct: false,
      explanation:
        "Adding optional fields is *non-breaking* — clients that ignore unknown fields continue to work. Breaking changes include: removing fields, renaming fields, changing field types, changing status code semantics, making a previously-optional field required. Always know which side of this line a change falls on.",
    },

    // ── INTERMEDIATE ──────────────────────────────────────────────
    {
      id: 'api-q018',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A QA tester needs to call a protected endpoint that issues short-lived access tokens after login. Which authentication scheme fits best?',
      options: [
        'Basic Auth — username and password sent on every request',
        'Bearer Token — login once, server returns a token, client sends `Authorization: Bearer <token>` on subsequent calls',
        'API Key — a single long-lived static key embedded in the URL',
        'No authentication — tokens are unnecessary for read-only endpoints',
      ],
      correct: 1,
      explanation:
        'Bearer Token is the standard short-lived-credential pattern. It avoids sending raw passwords on every call (Basic Auth) and supports expiry/rotation (unlike static API keys). Tokens are usually JWTs but can be opaque strings.',
    },
    {
      id: 'api-q019',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'A JWT looks like this. What does the `.` separate?',
      code: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJzdWIiOiI0MiIsIm5hbWUiOiJQcml5YSIsImV4cCI6MTcwMDAwMDAwMH0
.fL5Wn3xJ8c9q7DTfgD2nMHkLrPbY0nO_yQRsX-3p6mE`,
      codeLanguage: 'text',
      options: [
        'header.payload.signature — three base64url-encoded segments',
        'username.password.session — credentials and a session ID',
        'algorithm.expiry.subject — three claim values',
        'request.response.timestamp — protocol metadata',
      ],
      correct: 0,
      explanation:
        'A JWT has three parts joined by dots: the **header** (algorithm + token type), the **payload** (claims like sub, exp, name), and the **signature** (HMAC or RSA over the first two parts). The first two are base64url — *encoded but not encrypted* — anyone can decode them. The signature is what proves integrity.',
    },
    {
      id: 'api-q020',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'A token-based API expects the auth header value to start with the keyword ___.',
      blank: 'For token auth, the header value typically reads `Authorization: ___ <token>`.',
      chips: ['Bearer', 'Basic', 'Token', 'JWT'],
      correct: 'Bearer',
      explanation:
        '`Authorization: Bearer <token>` is the RFC 6750 standard for OAuth 2.0 token auth and the most widely adopted convention. `Basic` is the HTTP Basic Auth scheme (base64 of user:password). `Token` and `JWT` are non-standard variants seen in some legacy APIs.',
    },
    {
      id: 'api-q021',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'Two error responses for the same failure are shown. Which is the better API design?',
      code: `── Option A ──
HTTP/1.1 400 Bad Request
{"error": "something went wrong"}

── Option B ──
HTTP/1.1 400 Bad Request
{
  "code":    "VALIDATION_FAILED",
  "message": "Email field is required and must be a valid email address",
  "field":   "email",
  "trace_id":"a1b2c3d4"
}`,
      codeLanguage: 'text',
      options: [
        'Option A — short, simple, easy for clients to handle',
        'Option B — structured with a stable code, human message, the offending field, and a trace_id for support — clients can react programmatically, humans can debug',
        'Both are equivalent in quality',
        'Option A is preferred because it does not leak server internals',
      ],
      correct: 1,
      explanation:
        'A good error contract has a *stable machine-readable code*, a *human-readable message*, and *enough context to debug* (field, trace_id). Option A forces clients to parse free-form text — fragile and bad UX. Option B is the pattern used by Stripe, GitHub, and most well-designed public APIs.',
    },
    {
      id: 'api-q022',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A client makes too many requests and gets back a 429. Which header should the client read to know when it is safe to retry?',
      options: [
        'Content-Length',
        'Retry-After — gives seconds to wait (or an HTTP date)',
        'X-RateLimit-Remaining — gives the count of requests left',
        'Authorization — re-auth before retrying',
      ],
      correct: 1,
      explanation:
        '`Retry-After` is the standard header for 429 (and 503) responses telling the client when to retry. Backing off blindly leads to thundering herds; respecting Retry-After is the polite and effective pattern. `X-RateLimit-Remaining` is informational — sent on every response, not the retry signal.',
    },
    {
      id: 'api-q023',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'When designing test scenarios for a "create user" endpoint, which set of buckets gives the broadest coverage?',
      options: [
        'Only the happy path — focus on what users actually do',
        'Positive · negative · boundary · security — covering valid input, invalid input, edge values, and adversarial input',
        'Only failure paths — happy paths are obvious',
        'Only payload tests — ignore headers and auth',
      ],
      correct: 1,
      explanation:
        'A robust API test plan covers four buckets: positive (happy path works), negative (bad input is rejected cleanly), boundary (edges like empty strings, max length, zero, negative numbers), and security (SQL injection, oversized payloads, missing auth, role-bypass attempts).',
    },
    {
      id: 'api-q024',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'In Postman, the most reliable assertion to confirm an API call succeeded is:',
      options: [
        '`pm.expect(pm.response.responseTime).to.be.below(500)` — response time is the success signal',
        '`pm.expect(pm.response.code).to.eql(200)` — assert the exact status code',
        '`pm.expect(pm.response.text()).to.include("success")` — assert the body contains a success string',
        '`pm.expect(pm.cookies.has("session"))` — assert a cookie is set',
      ],
      correct: 1,
      explanation:
        'Status code is the canonical success signal. Body strings vary (locale, future format changes); response time depends on network; cookies may or may not be set. Always assert status first; then layer in body/schema assertions as supporting checks.',
    },
    {
      id: 'api-q025',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'What does this Postman test verify?',
      code: `pm.test("user has a valid email and is active", function () {
  const data = pm.response.json();
  pm.expect(data.email).to.match(/^[^@]+@[^@]+\\.[^@]+$/);
  pm.expect(data.status).to.eql("active");
});`,
      codeLanguage: 'javascript',
      options: [
        'That the response status code is 200',
        'That the response body parses as JSON, the `email` field looks like an email, and the `status` field equals "active"',
        'That the response time is under 200ms',
        'That a session cookie was set',
      ],
      correct: 1,
      explanation:
        'This is a body-level contract test: parse the JSON, regex-check the email shape, and assert the status string. Note it does *not* check the HTTP status code — a complete test would add `pm.response.to.have.status(200)` first. Layered assertions catch more failure modes.',
    },
    {
      id: 'api-q026',
      type: 'code-mcq',
      difficulty: 'intermediate',
      question: 'Two list endpoints page differently. Which is offset-based and which is cursor-based?',
      code: `── Endpoint A ──
GET /api/orders?page=3&limit=20

── Endpoint B ──
GET /api/orders?cursor=eyJpZCI6MTIzNH0&limit=20`,
      codeLanguage: 'text',
      options: [
        'Both are offset-based',
        'A is offset-based (page number); B is cursor-based (opaque token pointing at a position)',
        'A is cursor-based; B is offset-based',
        'Both are cursor-based',
      ],
      correct: 1,
      explanation:
        'Offset pagination uses `page` or `offset` — simple but unstable if rows are inserted/deleted while paging. Cursor pagination uses an opaque token (typically encoding the last-seen row\'s sort key) — stable under writes and more efficient on large tables. Most modern public APIs (GitHub, Stripe) use cursors.',
    },
    {
      id: 'api-q027',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'The common query parameter used to control the maximum number of items returned per page is ___.',
      blank: 'A common query parameter that caps page size is `?___=20`.',
      chips: ['limit', 'count', 'size', 'max'],
      correct: 'limit',
      explanation:
        '`limit` is by far the most common convention (GitHub, Stripe, Twitter). Some APIs use `per_page` or `size`, but `limit` is what most clients expect. Always document the maximum allowed value so callers cannot accidentally fetch millions of rows.',
    },
    {
      id: 'api-q028',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'In a chained test suite (login → get-profile → update-profile), the tests must run in order — running them in parallel or out of sequence breaks them.',
      correct: true,
      explanation:
        'Chained tests share state via captured variables (token, user_id). Parallel or out-of-order execution leaves the variables empty when downstream tests need them. Either keep chained suites sequential, or refactor to independent tests that each set up their own state.',
    },
    {
      id: 'api-q029',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'What does schema validation primarily catch that simple key-existence checks do not?',
      options: [
        'Performance regressions in the API',
        'Type and structural mismatches — a string where a number was expected, a missing nested object, or an array element of the wrong shape',
        'Authentication failures',
        'Network latency between client and server',
      ],
      correct: 1,
      explanation:
        'Schema validation (JSON Schema, OpenAPI) catches *shape* drift: a field that used to be a number is now a string, a required nested object disappears, an array element is missing a property. Manual `expect(data.id).to.exist` only checks presence — it misses type changes that silently break downstream consumers.',
    },
    {
      id: 'api-q030',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'Schema validation catches business-rule violations such as "total must equal sum of line items".',
      correct: false,
      explanation:
        'Schema validation only checks *structure and types*. Business rules (cross-field invariants, value ranges, computed totals) require separate assertions. A response can be schema-valid yet semantically wrong — schema validation is a floor, not a ceiling.',
    },
    {
      id: 'api-q031',
      type: 'fill-blank',
      difficulty: 'intermediate',
      question: 'When uploading a file via HTTP, the request Content-Type is typically ___.',
      blank: 'File uploads typically use Content-Type: `___/form-data`.',
      chips: ['multipart', 'application', 'binary', 'text'],
      correct: 'multipart',
      explanation:
        '`multipart/form-data` allows mixed content (file binaries + text fields) in one request, separated by boundary markers. `application/json` cannot carry raw file bytes. Tests must explicitly set this header and use the right body construction — most clients have a `form()` helper.',
    },
    {
      id: 'api-q032',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'A system needs to know within seconds when a payment is confirmed. Why is a webhook better than polling the payments API every minute?',
      options: [
        'Webhooks are easier to debug than polling',
        'Webhooks push events the moment they happen — lower latency, less wasted traffic, no polling cap',
        'Polling cannot return JSON',
        'Webhooks are encrypted; polling is not',
      ],
      correct: 1,
      explanation:
        'Polling = constant traffic regardless of activity, plus latency equal to half the polling interval on average. Webhooks = the API calls you the instant something happens — near-zero latency, near-zero idle traffic. The trade-off is needing a public callback endpoint and handling delivery retries.',
    },
    {
      id: 'api-q033',
      type: 'tf',
      difficulty: 'intermediate',
      question: 'A webhook always reaches the receiver exactly once.',
      correct: false,
      explanation:
        'Webhook delivery is best-effort with retries. Receivers must handle *at-least-once* delivery — the same event may arrive twice (network glitch, ack lost). The fix is idempotent processing: include a unique event ID, dedupe on it. Treating webhooks as exactly-once will eventually corrupt data.',
    },
    {
      id: 'api-q034',
      type: 'mcq',
      difficulty: 'intermediate',
      question: 'When is using a mock server most valuable?',
      options: [
        'Only after the real API is fully stable',
        'When the real API is not yet built, is unreliable, costs money per call, or is hard to reproduce edge cases against — a mock lets tests proceed in parallel with the real implementation',
        'Only to test load on production systems',
        'Never — mock data hides real bugs',
      ],
      correct: 1,
      explanation:
        'Mocks unblock parallel work (frontend can develop before backend is done), make tests deterministic (no flaky network), enable cheap testing of rare edge cases (force a 500, force a timeout), and protect against rate-limited or expensive third-party APIs. The risk: mocks drift from reality — pair them with contract tests.',
    },

    // ── EXPERT ────────────────────────────────────────────────────
    {
      id: 'api-q035',
      type: 'mcq',
      difficulty: 'expert',
      question: 'Why do most teams eventually move from Postman GUI tests to code-based API automation?',
      options: [
        'Postman is being deprecated',
        'Code-based tests version-control cleanly with the app, run in CI, integrate with reporting and test data factories, and support reuse and refactoring at scale',
        'Code-based tests are always faster',
        'Postman cannot test authenticated endpoints',
      ],
      correct: 1,
      explanation:
        'Postman is excellent for exploration and small-suite regression. At scale it becomes hard to version, share helpers, factor out duplication, and integrate with CI gates. Code (Playwright, REST Assured, supertest, Pact) lives next to the app, leverages developer tooling, and scales with the team.',
    },
    {
      id: 'api-q036',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'What does this automated API test verify?',
      code: `test('rejects negative quantity', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', \`Bearer \${token}\`)
    .send({ product_id: 42, quantity: -1 });

  expect(res.status).toBe(422);
  expect(res.body.code).toBe('VALIDATION_FAILED');
  expect(res.body.field).toBe('quantity');
});`,
      codeLanguage: 'javascript',
      options: [
        'That a negative quantity creates a refund order',
        'That a negative quantity is rejected with 422, a stable error code "VALIDATION_FAILED", and the offending field name',
        'That orders can be deleted when quantity is negative',
        'That the auth token is valid',
      ],
      correct: 1,
      explanation:
        'A negative-case test: the contract is "negative quantity → 422 + structured error". It asserts the *machine-readable code* (stable across UI copy changes) and the *field* (so the frontend can highlight the right input). This is the rhythm of strong API contract tests.',
    },
    {
      id: 'api-q037',
      type: 'tf',
      difficulty: 'expert',
      question: 'In test-data terminology, factories generate fresh data on each call (often randomised), while fixtures are static pre-existing records loaded the same way every run.',
      correct: true,
      explanation:
        'Factories (`createUser({ email: faker.email() })`) eliminate cross-test coupling — each test gets unique data. Fixtures (a seed dataset loaded once) are simpler but introduce shared state and order dependencies. Modern test suites lean toward factories for resilience.',
    },
    {
      id: 'api-q038',
      type: 'tf',
      difficulty: 'expert',
      question: 'Cloning production data into a test environment is always safe as long as the test environment is private.',
      correct: false,
      explanation:
        'Production data carries real PII, real payment details, real auth tokens. Cloning it without sanitisation is a compliance breach (GDPR, HIPAA) waiting to happen — even on "private" environments, access is broader than prod, logs are looser, backups proliferate. Always anonymise/mask before cloning.',
    },
    {
      id: 'api-q039',
      type: 'mcq',
      difficulty: 'expert',
      question: 'A user passes `GET /api/orders/9999` and sees another user\'s order details. What class of vulnerability is this?',
      options: [
        'SQL Injection',
        'BOLA / IDOR — Broken Object Level Authorization, where the server returns objects the requester is authenticated for but not authorised to see',
        'Cross-Site Scripting (XSS)',
        'Denial of Service',
      ],
      correct: 1,
      explanation:
        'BOLA/IDOR (Insecure Direct Object Reference) is the #1 vulnerability in the OWASP API Security Top 10. The fix: every endpoint must verify *both* "is this user authenticated?" *and* "is this user authorised for this specific object?" Authentication alone is not enough.',
    },
    {
      id: 'api-q040',
      type: 'mcq',
      difficulty: 'expert',
      question: 'The most reliable defence against SQL injection in an API is:',
      options: [
        'Stripping single quotes from inputs',
        'Using parameterised queries / prepared statements — the SQL parser is given the structure separately from the user data, so no user string can become SQL',
        'A web application firewall (WAF) blocking common payloads',
        'Rate limiting',
      ],
      correct: 1,
      explanation:
        'Parameterised queries are the gold standard — user input is bound as data, never as SQL syntax. Input sanitisation is brittle (always one bypass away). WAFs add defence in depth but should never be the only layer. Rate limiting addresses abuse, not injection.',
    },
    {
      id: 'api-q041',
      type: 'tf',
      difficulty: 'expert',
      question: 'Serving an API over HTTPS alone is sufficient to consider it secure.',
      correct: false,
      explanation:
        'HTTPS only secures data in transit. It does nothing against weak auth, missing authorisation, injection, mass assignment, broken access control, rate-limit absence, or insecure direct object references. HTTPS is one of many layers — and the easy one. The rest of the OWASP API Top 10 is where most breaches actually happen.',
    },
    {
      id: 'api-q042',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'The non-profit foundation behind the well-known "API Security Top 10" risk list is called ___.',
      blank: 'The foundation publishing the API Security Top 10 risk list is ___.',
      chips: ['OWASP', 'NIST', 'IETF', 'ISO'],
      correct: 'OWASP',
      explanation:
        'OWASP (Open Worldwide Application Security Project) maintains the OWASP API Security Top 10 — the de facto checklist for API security. Knowing the top categories (BOLA, broken auth, broken object property level auth, unrestricted resource consumption, etc.) is table stakes for API security work.',
    },
    {
      id: 'api-q043',
      type: 'mcq',
      difficulty: 'expert',
      question: 'In consumer-driven contract testing (Pact pattern), who defines what the API contract must satisfy?',
      options: [
        'The provider — the API owner publishes the spec and consumers must conform',
        'The consumer — each client declares the response shape it depends on, and the provider verifies its API satisfies all those declared expectations',
        'A neutral third-party auditor',
        'The QA team writes the contract independently of both sides',
      ],
      correct: 1,
      explanation:
        'Consumer-driven contracts flip the usual direction: each consumer publishes "I depend on these fields and behaviours". The provider runs all consumer contracts as part of its build — preventing accidental breaking changes. This is the Pact pattern, the dominant approach in microservice ecosystems.',
    },
    {
      id: 'api-q044',
      type: 'tf',
      difficulty: 'expert',
      question: 'Contract tests fully replace the need for integration tests between services.',
      correct: false,
      explanation:
        'Contract tests verify that two services agree on the message shape and basic semantics — they do not verify end-to-end business flows, real network behaviour, or third-party integrations. Both layers are needed: contract tests catch interface drift quickly and cheaply; integration tests catch wiring and state bugs.',
    },
    {
      id: 'api-q045',
      type: 'mcq',
      difficulty: 'expert',
      question: 'What is the practical distinction between latency and throughput?',
      options: [
        'They are the same thing measured in different units',
        'Latency = how long one request takes (e.g. 80 ms p95); throughput = how many requests the system handles per unit time (e.g. 1200 rps)',
        'Latency is for reads; throughput is for writes',
        'Latency is measured client-side; throughput is measured server-side',
      ],
      correct: 1,
      explanation:
        'Latency is per-request — a user-experience metric. Throughput is per-second — a capacity metric. A system can have low latency at low traffic and unacceptable latency at high throughput. Real performance budgets always specify both: "p95 latency ≤ 200ms at 1000 rps".',
    },
    {
      id: 'api-q046',
      type: 'mcq',
      difficulty: 'expert',
      question: 'In k6 load testing terminology, what is a "VU"?',
      options: [
        'A Virtual User — a simulated concurrent client running through the script',
        'A Validation Unit — a single assertion in the test',
        'A Variable Update — a config change applied mid-run',
        'A View Unit — a frontend render measurement',
      ],
      correct: 0,
      explanation:
        'A Virtual User is one simulated concurrent client. `--vus 100` runs 100 VUs in parallel, each looping through the script. VUs map roughly to "concurrent users", whereas requests-per-second is the resulting load on the server — they are related but not the same.',
    },
    {
      id: 'api-q047',
      type: 'code-mcq',
      difficulty: 'expert',
      question: 'This k6 script defines a load profile. What is happening?',
      code: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // ramp up
    { duration: '5m', target: 100 },   // hold
    { duration: '2m', target: 0 },     // ramp down
  ],
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`,
      codeLanguage: 'javascript',
      options: [
        'A spike test — instantly jumps to 1000 users',
        'A staged load test — ramps to 100 VUs over 2 min, holds for 5 min at 100 VUs, then ramps down over 2 min. Each VU GETs /users with a 1s pause and asserts status 200',
        'A soak test running for 24 hours',
        'A smoke test with a single user',
      ],
      correct: 1,
      explanation:
        'The `stages` array defines a load profile over time. This script is a classic ramp-hold-ramp shape — useful for finding stable behaviour under sustained moderate load. Spike tests jump instantly; soak tests hold for hours; smoke tests use 1 VU briefly to confirm the script works.',
    },
    {
      id: 'api-q048',
      type: 'mcq',
      difficulty: 'expert',
      question: 'The "three pillars of observability" for an API are:',
      options: [
        'Tests, monitoring, alerting',
        'Logs, metrics, traces',
        'Latency, throughput, errors',
        'CPU, memory, disk',
      ],
      correct: 1,
      explanation:
        'Logs answer "what happened?" (events). Metrics answer "how much / how often?" (aggregated numbers). Traces answer "why was this request slow?" (request flow across services). Together they cover detection, quantification, and root-cause — the trio every production API needs.',
    },
    {
      id: 'api-q049',
      type: 'fill-blank',
      difficulty: 'expert',
      question: 'A target you commit to — e.g. "99.9% of requests succeed in under 300ms" — is called a Service Level ___.',
      blank: 'A target like "99.9% of requests under 300ms" is called a Service Level ___.',
      chips: ['Objective', 'Indicator', 'Agreement', 'Standard'],
      correct: 'Objective',
      explanation:
        "SLI = the measurement (e.g. p95 latency, error rate). SLO = the *target* on that measurement (the line you commit to internally). SLA = the externally-promised version, often with financial penalties. SLOs drive on-call escalation; SLAs drive contracts.",
    },
    {
      id: 'api-q050',
      type: 'mcq',
      difficulty: 'expert',
      question: 'When integrating API tests into a CI/CD pipeline, what is the most common pattern for handling flaky or low-priority tests?',
      options: [
        'Disable them entirely until they are stable',
        'Run them in a non-blocking ("report only") stage — failures show up in the dashboard but do not block the deploy, while critical tests stay as blocking gates',
        'Run them only on production after deploy',
        'Move them to a manual QA step',
      ],
      correct: 1,
      explanation:
        "Blocking vs report-only is the standard CI lever. Critical contract and smoke tests block the pipeline; flaky, slow, or low-priority tests run alongside as a report — surfacing signal without halting deploys. Eventually flaky tests should be fixed or quarantined, not silently disabled.",
    },
  ],
};
