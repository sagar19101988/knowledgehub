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
};
