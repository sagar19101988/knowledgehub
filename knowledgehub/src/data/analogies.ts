export interface ContentLevel {
  id: string;
  title: string;
  analogy: string; // Used for the summary box at the bottom
  lessonMarkdown: string;
}

export interface ZoneData {
  id: string;
  levels: ContentLevel[];
}

export const ZONES_CONTENT: Record<string, ZoneData> = {
  manual: {
    id: 'manual',
    levels: [
      {
        id: 'basic',
        title: 'Basic: Core Testing Ideas',
        analogy: "Testing software is like test-driving a new car. You have to check if it drives normally, but you also have to try slamming the brakes and pressing all the radio buttons at once just to see what happens.",
        lessonMarkdown: `
### 1. Exploratory Testing
*💡 Analogy: It's like walking into a brand new Escape Room. You don't just look at the obvious clues; you start pulling on fake books, turning knobs, and eating the props just to see what the Game Master does!*

Exploratory Testing is the art of testing an application without a pre-defined script. Instead of following a strict checklist (like "Click button A, then type in Box B"), you rely entirely on your intuition, curiosity, and experience. You explore the software dynamically, designing and executing your tests at the exact same time. This is often where the most critical bugs are found, because real users act unpredictably. If you only test what the developer *expected* to happen, you will miss all the things they *didn't* expect.

### 2. The Happy Path
*💡 Analogy: It's the smooth, paved highway. No traffic, perfectly sunny, driving exactly the speed limit. It's exactly how the road was designed to be used.*

The Happy Path is the default, most common scenario where everything goes perfectly right. If an e-commerce site wants a user to add a shirt to their cart, enter their credit card, and click buy—that's the Happy Path. As a tester, you **must** test the Happy Path first. Why? Because if the core, intended functionality of the app doesn't even work, there is absolutely no reason to waste time testing weird edge cases or error messages. 

### 3. Negative Testing
*💡 Analogy: Going to a vending machine, putting in a piece of paper instead of a dollar bill, and pressing the button for a soda just to make sure the machine spits it back out instead of catching fire.*

Negative testing is deliberately doing things you aren't supposed to do. You intentionally provide invalid data or perform unexpected actions to ensure the application handles it gracefully. What happens if you type the letter "A" into a calculator? What happens if you try to submit a form without filling in your email address? A well-built system will catch your mistake and show you a polite, helpful error message. A poorly built system will crash or corrupt its database.
        `
      },
      {
        id: 'intermediate',
        title: 'Intermediate: Test Design',
        analogy: "Being efficient is like a bouncer at a club. You don't need to check every single 20-year-old's ID if you already know the whole group is 20. But you definitely keep an eye on the kid who looks exactly 17.",
        lessonMarkdown: `
### 1. Boundary Value Analysis (BVA)
*💡 Analogy: If a sign says "Bridge Capacity: 10 Cars", you don't care about 5 cars. You care about exactly 10 cars, and you definitely care about what happens when the 11th car tries to drive on.*

Bugs absolutely love to hide at the edges or "boundaries" of rules. Developers frequently make "off-by-one" errors (using \`<\` instead of \`<=\`). If a password field requires between 8 and 12 characters, testing a 10-character password isn't very useful. Instead, BVA tells you to test the exact limits and the numbers just outside those limits. For an 8-12 limit, you must test 7, 8, 12, and 13. If those edges work perfectly, everything in the middle will almost certainly work too.

### 2. Equivalence Partitioning
*💡 Analogy: If you are sorting apples into "Good" and "Rotten" baskets, you don't need to bite into every single good apple to know it's good. Biting one from the "Good" pile is enough to prove the pile is correct.*

This is a technique used to save massive amounts of time. It involves dividing test inputs into groups (partitions) that the application treats exactly the same way. For example, if a movie ticket discount applies to anyone aged 65 to 100, you don't need to write a test case for a 65-year-old, a 66-year-old, a 67-year-old, etc. You just pick one number from that "partition" (like 70) and test it once. If 70 works, you assume 71 works too.

### 3. State Transition Testing
*💡 Analogy: Think of a washing machine. It must go from "Fill" to "Wash" to "Spin". You want to make sure it doesn't try to "Spin" while it's still filling with water.*

State Transition Testing checks if an object or system moves correctly between different allowed statuses. In software, an online order starts as "Pending". Then it moves to "Paid". Then "Shipped". Finally "Delivered". Your job is to test these transitions. Can an order go from "Pending" straight to "Delivered"? Can an order go backwards from "Shipped" to "Pending"? You map out every possible state and test the triggers that cause the system to move between them.
        `
      },
      {
        id: 'expert',
        title: 'Expert: Advanced Heuristics',
        analogy: "Expert testing is looking for the invisible strings holding the app together. It's trying to trick the system by acting faster than it can think, or pulling the plug while it's in the middle of a thought.",
        lessonMarkdown: `
### 1. State Dependency
*💡 Analogy: It's like having a conversation with someone, leaving the room, changing your clothes, walking back in, and seeing if they realize you are wearing something different, or if they still think you have the old clothes on.*

State dependency bugs occur when an application gets confused about its current reality across multiple sessions, tabs, or devices. A classic example is e-commerce: You open Tab A and add 1 laptop to your cart. You open Tab B and add 5 laptops. You go back to Tab A (which still visually says 1 laptop) and click "Buy". Does the system charge you for 1, or does the backend charge you for 6? Applications frequently fail to sync their "state" when the user does unexpected cross-tab wizardry.

### 2. Race Conditions
*💡 Analogy: Two people trying to grab the last slice of pizza at the exact same millisecond. If the system isn't watching closely, both people walk away thinking they got the whole slice.*

A race condition is a dangerous timing bug. It happens when two operations or requests hit the server at the exact same time, and the server processes them out of order or fails to lock the database. For example, if a user has $100 in their bank account and clicks "Transfer $100" on their phone and their laptop at the exact same millisecond. If the bank's database doesn't lock the account during the first transaction, both transfers might succeed, leaving the user with a negative balance.

### 3. Interrupts
*💡 Analogy: You are in the middle of writing a very important essay, and someone unplugs your computer from the wall. When you turn it back on, did you lose everything?*

Particularly critical in mobile app testing, interrupt testing checks how an application behaves when a real-world event brutally interrupts it. What happens to the payment processing screen if a phone call comes in? What happens to your unsaved game if the battery dies, or if you lose Wi-Fi and switch to 4G? A robust application must gracefully pause, save its state, or recover without crashing or corrupting the user's data.
        `
      }
    ]
  },
  sql: {
    id: 'sql',
    levels: [
      {
        id: 'basic',
        title: 'Basic: Reading Data',
        analogy: "A database is just a giant, magical library. SQL is the specific language you have to speak to the librarian to get them to bring you the exact book you want.",
        lessonMarkdown: `
### 1. The SELECT Statement
*💡 Analogy: It is the equivalent of pointing at a menu in a restaurant and saying, "I want that."*

The \`SELECT\` statement is the most fundamental command in SQL. It is used exclusively to read data out of a database. It never deletes, creates, or changes anything. You use it to specify exactly which columns of data you want to look at. For example, \`SELECT first_name, email FROM Users\` tells the database to ignore all the other clutter and only show you the names and emails.

### 2. The WHERE Clause
*💡 Analogy: It's like telling a bouncer, "Only let people in if they are wearing a red shirt."*

If \`SELECT\` chooses the columns, \`WHERE\` chooses the rows. Without a WHERE clause, the database will return every single row in the table, which could be millions of records, crashing your computer. The WHERE clause acts as a strict filter. By typing \`SELECT * FROM Users WHERE age > 18\`, you are commanding the database to scan the table and only return the rows where the age condition is true.

### 3. The Asterisk (*)
*💡 Analogy: Walking into a buffet and saying, "Give me one of absolutely everything you have."*

In SQL, the asterisk \`*\` is a wildcard character that translates to "all columns." When you write \`SELECT * FROM Users\`, you are telling the database that you are too lazy to type out every single column name, and you just want it to return all the data it has for those rows. While useful for quick debugging, it is generally bad practice in production code because it wastes memory pulling data you might not actually need.
        `
      },
      {
        id: 'intermediate',
        title: 'Intermediate: Combining Data',
        analogy: "Data is often split up into different boxes to keep things organized. A JOIN is like taking a puzzle piece from Box A and perfectly snapping it into the matching piece from Box B.",
        lessonMarkdown: `
### 1. What is a JOIN?
*💡 Analogy: Imagine you have a list of students' names, and a separate list of locker numbers. The JOIN is the master key that connects the student to their specific locker using their Student ID.*

In relational databases, data is intentionally broken up into multiple tables to avoid repeating things (this is called normalization). You might have a \`Users\` table and an \`Orders\` table. If you want to see a user's name next to the item they bought, you use a \`JOIN\`. It acts as a bridge, merging rows from two different tables by matching up a shared identifier, like a \`user_id\`.

### 2. INNER vs LEFT JOIN
*💡 Analogy: An INNER JOIN is a strict club; you only get in if you have a partner. A LEFT JOIN is a casual party; everyone from the host's list (the left) gets in, even if they show up completely alone.*

Understanding the difference is critical. 
- **INNER JOIN:** This only returns rows if there is a perfect match in BOTH tables. If a user has never made an order, they won't show up in the results at all.
- **LEFT JOIN:** This returns EVERYTHING from the first (left) table. If the user hasn't made an order, the user still shows up in the results, but the order columns will just be completely blank (NULL).

### 3. GROUP BY
*💡 Analogy: Taking a massive pile of loose change, sorting it into piles of quarters, dimes, and nickels, and then counting how much is in each pile.*

The \`GROUP BY\` statement is used for aggregation and reporting. It takes a massive list of rows that share a certain value and squashes them down into a single summary row. You almost always use it alongside math functions like \`COUNT()\`, \`SUM()\`, or \`AVG()\`. For example, if you want to know how many users live in each city, you would \`SELECT city, COUNT(*) FROM Users GROUP BY city\`.
        `
      },
      {
        id: 'expert',
        title: 'Expert: Database Power Tools',
        analogy: "Expert SQL isn't just about reading data; it's about making the database do heavy math for you, building high-speed indexes, and ensuring money doesn't magically disappear during transfers.",
        lessonMarkdown: `
### 1. Subqueries
*💡 Analogy: It's like asking a friend to go check the weather outside, and based on their answer, you decide whether or not to pack an umbrella.*

A subquery is literally a query nested inside another query. The database solves the inner query first, figures out the answer, and then uses that answer to solve the outer query. For example, if you want to find all employees who earn more than the company average, you have to find the average *first*. You would write: \`SELECT name FROM Employees WHERE salary > (SELECT AVG(salary) FROM Employees)\`.

### 2. Indexes
*💡 Analogy: An index is the glossary at the back of a 1,000-page textbook. Without it, you have to read every single page to find the word "Photosynthesis". With it, you instantly know it is on page 42.*

An index is a special data structure that makes data retrieval incredibly fast. If a table has millions of rows, searching for a specific email without an index forces the database to perform a "Full Table Scan"—checking every single row one by one. An index organizes the data behind the scenes so the database can jump straight to the correct row. However, indexes are a double-edged sword: they make reading (SELECT) faster, but writing (INSERT/UPDATE) slower, because the index must be updated every time data changes.

### 3. Transactions
*💡 Analogy: Buying a house. You don't hand over a suitcase of cash and then hope they give you the keys a week later. Both the money and the keys swap hands at the exact same time, or the deal is cancelled.*

A transaction ensures data integrity by grouping multiple SQL commands into a single, all-or-nothing unit of work. If you are transferring money from Account A to Account B, two things must happen: subtract $50 from A, and add $50 to B. If the server crashes after subtracting from A but before adding to B, the money vanishes. Transactions prevent this. If any part of the transaction fails, the entire thing is "Rolled Back" as if nothing ever happened.
        `
      }
    ]
  },
  api: {
    id: 'api',
    levels: [
      {
        id: 'basic',
        title: 'Basic: API Foundations',
        analogy: "An API is a literal messenger. You (the customer) give your order to the waiter (the API), the waiter walks into the kitchen (the server), gets the chef to make the food (data), and brings it back to your table.",
        lessonMarkdown: `
### 1. What is an API?
*💡 Analogy: It is the universal translator that lets a French speaker and a Japanese speaker negotiate a contract.*

API stands for Application Programming Interface. In modern web development, the visual website you click on (the Frontend) and the database where information is stored (the Backend) are completely separate programs. They don't know how to share data naturally. An API is a strict set of rules and URLs that acts as a bridge, allowing the frontend to ask the backend for data, and the backend to securely deliver it.

### 2. GET Requests
*💡 Analogy: Walking into a library, asking the librarian to hand you a specific book, reading it, and handing it back. You didn't write anything new, you just read.*

APIs use "HTTP Methods" to declare their intentions. The most common is the \`GET\` request. A GET request is completely safe and "read-only". It is used exclusively to fetch data from the server. When you open your web browser and navigate to a URL, your browser is making a massive GET request to fetch the HTML of that page.

### 3. 200 OK Status
*💡 Analogy: Getting a "Thumbs Up" from a construction worker. It means the job is done and there are no problems.*

Every time an API finishes a request, it replies with a 3-digit Status Code so the frontend knows what happened without having to read a long error message. Anything in the \`200\` range is a success. \`200 OK\` means a GET request successfully found the data. \`201 Created\` means a POST request successfully created a new user.
        `
      },
      {
        id: 'intermediate',
        title: 'Intermediate: Sending Data',
        analogy: "If APIs are waiters, GET is asking for the menu. POST is handing them a brand new recipe to cook. PUT is telling them to throw away the soup they just made and replace it with a salad.",
        lessonMarkdown: `
### 1. POST vs PUT
*💡 Analogy: POST is filling out a blank piece of paper and adding it to a folder. PUT is taking a paper out of the folder, throwing it in the trash, and replacing it with a new paper.*

Both POST and PUT are used to send data to the server, but they do completely different things. 
- **POST** is used to CREATE new resources. Every time you hit a POST endpoint, a brand new row is created in the database.
- **PUT** is used to REPLACE an existing resource. You target a specific ID (like User #5) and send a massive block of data. The server completely overwrites User #5 with whatever you just sent.

### 2. JSON Body
*💡 Analogy: It's the standard shipping box of the internet. It doesn't matter what is inside, every post office knows how to scan the barcode on a JSON box.*

When you send a POST or PUT request, you have to attach the actual data you want to save. This data payload is called the "Body", and it is almost always formatted in JSON (JavaScript Object Notation). JSON is a lightweight, text-based format that uses curly braces and key-value pairs (e.g., \`{ "username": "QA_Master", "level": 99 }\`). It is so universally loved because both humans and machines can read it instantly.

### 3. 401 Unauthorized
*💡 Analogy: Trying to walk into a top-secret military base without an ID badge. The guard doesn't even look at what you want to do; they just reject you instantly.*

Status codes in the \`400\` range mean the client (you) made a mistake. \`401 Unauthorized\` specifically means that the API requires authentication (like a secret API Key or a JWT token), and you forgot to include it in the headers of your request. The server is saying, "I don't know who you are, so I'm not giving you this data."
        `
      },
      {
        id: 'expert',
        title: 'Expert: API Concepts',
        analogy: "Advanced APIs require complex traffic control. It's about protecting the server from being crushed by stampedes, and giving frontends the power to ask for exact puzzle pieces instead of whole boxes.",
        lessonMarkdown: `
### 1. Rate Limiting
*💡 Analogy: A bouncer at a wildly popular nightclub. If one person tries to bring 50,000 friends through the door at the exact same second, the bouncer locks the door to prevent the building from collapsing.*

Rate Limiting is a critical security and stability measure. It restricts how many requests a single IP address or user account can make to an API within a specific timeframe (e.g., 100 requests per minute). Without rate limiting, a malicious hacker could write a script that hits the login API a million times a second, overwhelming the server's CPU and causing it to crash for everyone. This is known as a DDoS attack. When you hit a rate limit, the API returns a \`429 Too Many Requests\` status.

### 2. GraphQL
*💡 Analogy: REST APIs are like buying a pre-packaged combo meal at a drive-thru; you get a burger, fries, and a drink whether you want them or not. GraphQL is like a buffet where you hand-pick exactly two fries and a sip of cola, and that is all you are charged for.*

REST APIs suffer from "over-fetching" (sending back 50 fields of user data when the app only needed the user's avatar image). GraphQL solves this. It is a query language for APIs where the client sends a highly specific request outlining the exact shape of the data it wants. The server responds with exactly that shape, reducing payload sizes and making mobile apps much faster.

### 3. Idempotency
*💡 Analogy: An elevator button. If you press the "Lobby" button once, the elevator goes to the lobby. If you smash the "Lobby" button 50 times in a panic, the elevator STILL just goes to the lobby. The end result never changed.*

Idempotency is a crucial concept in system design. An API endpoint is idempotent if making the exact same request multiple times produces the exact same result on the server as making it just once. A \`GET\` request is idempotent (reading data 10 times doesn't change it). A \`PUT\` request is idempotent (updating your name to "Bob" 10 times just leaves it as "Bob"). A \`POST\` request is NOT idempotent (clicking a "Create Order" button 10 times will accidentally charge your credit card 10 times!).
        `
      }
    ]
  },
  typescript: {
    id: 'typescript',
    levels: [
      {
        id: 'data-types',
        title: 'Variables & Data Types',
        analogy: "Think of variables like moving boxes. You need a place to store your stuff, and you need to label the box so you don't accidentally put soup in the 'Books Only' box.",
        lessonMarkdown: `
### 1. What is a Variable?
*💡 Analogy: Imagine you are moving into a new apartment. You don't just throw your shirts on the floor. You put them in a cardboard box, and you write "Shirts" on the outside with a Sharpie. A variable is just a digital cardboard box with a name written on it, used to store data.*

**Deep Explanation:**
Before we can automate a browser, we need a way to remember things. If we want our robot to log in, it needs to remember a username. We create a "variable" (a box) and put the username inside it. Whenever we need the username later, we just ask for the box by its name.

### 2. Line-by-Line Syntax Breakdown
Let's look at how to create a variable in TypeScript.

\`\`\`typescript
let username: string = "QA_Ninja";
\`\`\`

Here is exactly what every single piece of that line means:
*   \`let\` -> This tells the computer, "Hey, I am about to create a new box, and I might want to change what's inside it later."
*   \`username\` -> This is the label we are writing on the outside of the box with our Sharpie.
*   \`: string\` -> This is TypeScript's strict rule. We are telling the computer, "This box is ONLY allowed to hold text. If I try to put a number in here, stop me and throw an error."
*   \`=\` -> This is the assignment operator. It means "take the thing on the right, and put it inside the box on the left."
*   \`"QA_Ninja"\` -> This is the actual data going into the box. Notice the quote marks! Quotes are how we tell the computer "this is a word, not code."
*   \`;\` -> The semicolon is a period at the end of a sentence. It tells the computer we are done with this instruction.

### 3. let vs const
*💡 Analogy: 'let' is a box sealed with easily removable tape. 'const' is a box sealed with titanium superglue.*

If you create a variable with \`let\`, you are allowed to open the box later and swap out the contents. If you use \`const\` (which stands for constant), the box is permanently sealed the moment you put something in it. We use \`const\` for things that should NEVER change, like a website URL.

### 4. Common Beginner Mistakes

**Mistake: Forgetting Quotes around Text**
\`\`\`typescript
// ❌ Error: Cannot find name 'QA_Ninja'
let username: string = QA_Ninja; 

// ✅ Correct
let username: string = "QA_Ninja";
\`\`\`
*Why it happens:* If you don't use quotes, the computer thinks \`QA_Ninja\` is the name of *another* variable box, and it panics because it can't find it.
        `
      },
      {
        id: 'objects-arrays',
        title: 'Objects & Arrays',
        analogy: "An array is like a bookshelf where books are lined up in order. An object is like a filing cabinet where every folder has a highly specific name tab on it.",
        lessonMarkdown: `
### 1. What is an Array?
*💡 Analogy: A numbered pill organizer. Monday is slot 0, Tuesday is slot 1. You don't have a specific name for the pill, you just know it's the 3rd one in the row.*

**Deep Explanation:**
Sometimes you need to store a *list* of things, like 5 different email addresses to test. Instead of creating 5 separate boxes, we create an **Array**. An array is a single variable that holds a list of items.

**Line-by-Line Breakdown:**
\`\`\`typescript
const testUsers: string[] = ["alice", "bob", "charlie"];
console.log(testUsers[0]); // Prints: "alice"
\`\`\`
*   \`string[]\` -> This means "An array of strings". It's a box that only holds a list of text.
*   \`[...]\` -> Square brackets are the universal symbol for "This is an array".
*   \`testUsers[0]\` -> Computers start counting at Zero. To get the first name, we ask for index 0.

### 2. What is an Object?
*💡 Analogy: A contact card in your phone. It doesn't just have a list of random words. It has specific labels: "First Name: John", "Phone: 555-1234".*

**Deep Explanation:**
Arrays are bad when you have complex data. If you have the array \`["John", 25, true]\`, what does the 25 mean? Age? Score? 
An **Object** solves this by using "Key-Value pairs". You provide a specific name (the Key) for every piece of data (the Value).

**Line-by-Line Breakdown:**
\`\`\`typescript
const userObject = {
    name: "John",
    age: 25,
    isAdmin: true
};
console.log(userObject.name); // Prints: "John"
\`\`\`
*   \`{...}\` -> Curly braces are the universal symbol for "This is an Object".
*   \`name: "John"\` -> "name" is the Key. "John" is the Value. They are separated by a colon.
*   \`userObject.name\` -> We use the "dot" operator to look inside the object and grab a specific piece of data.

### 3. Common Beginner Mistakes
**Mistake: Using = instead of : inside an Object**
\`\`\`typescript
// ❌ Error
const user = { name = "John" };

// ✅ Correct
const user = { name: "John" };
\`\`\`
*Why it happens:* Beginners are used to using \`=\` to assign variables. But inside an object, you MUST use a colon \`:\` to assign a value to a key!
        `
      },
      {
        id: 'control-flow',
        title: 'Logic & Decisions',
        analogy: "Control flow is like a train switchyard. The code is the train, and 'if/else' statements are the physical tracks that forcefully route the train to Chicago instead of New York.",
        lessonMarkdown: `
### 1. What is an If-Statement?
*💡 Analogy: A bouncer at a club checking an ID. "IF you are over 21, you go inside. ELSE, you go home."*

**Deep Explanation:**
Code normally runs straight down from top to bottom. But sometimes, we only want code to run *under certain conditions*. For example, IF the user is an admin, show the dashboard. IF they are not, show an error.

**Line-by-Line Breakdown:**
\`\`\`typescript
const userAge: number = 25;

if (userAge >= 21) {
    console.log("Welcome to the club!");
} else {
    console.log("Go home!");
}
\`\`\`
*   \`if (...)\` -> The word 'if' followed by parentheses. Inside the parentheses is the "condition" we are checking.
*   \`userAge >= 21\` -> The condition. It asks a True/False question: "Is 25 greater than or equal to 21?" The answer is True.
*   \`{ ... }\` -> The curly braces define the "block" of code that will execute ONLY if the answer is True.
*   \`else { ... }\` -> This is the backup plan. If the answer was False, this block runs instead.

### 2. Triple Equals (===)
*💡 Analogy: '==' asks "Do these two people have the same name?" '===' asks "Are these two people literally the exact same human being?"*

**Deep Explanation:**
When asking "Is A equal to B?", beginners often use a single equals sign (\`=\`). But \`=\` is for *assigning* variables! To compare things, you must use triple equals (\`===\`). 

\`\`\`typescript
// ❌ Single equals assigns a value. This will cause terrible bugs!
if (userAge = 21) 

// ✅ Triple equals asks a question!
if (userAge === 21) 
\`\`\`

### 3. Common Beginner Mistakes
**Mistake: Forgetting the curly braces**
\`\`\`typescript
// ❌ Messy and prone to bugs
if (userAge > 18) console.log("Adult");
console.log("This always runs!");

// ✅ Always use curly braces!
if (userAge > 18) {
    console.log("Adult");
}
\`\`\`
*Why it happens:* You can technically write a one-line if-statement without braces, but the moment you try to add a second line of code, the logic completely breaks. Always use braces.
        `
      },
      {
        id: 'loops',
        title: 'Loops & Iteration',
        analogy: "A loop is like a printing press. You don't build 500 separate printing presses to print a 500-page book. You build one press, and tell it to stamp paper exactly 500 times in a row.",
        lessonMarkdown: `
### 1. What is a Loop?
*💡 Analogy: A track coach telling a runner: "Start at lap 0. Keep running as long as you haven't reached lap 10. After every lap, add 1 to your counter."*

**Deep Explanation:**
In QA, you often need to do the exact same thing multiple times. E.g., clicking 5 checkboxes. Instead of copying and pasting the "click" code 5 times, we write a Loop. A loop runs a block of code repeatedly until a specific condition tells it to stop.

### 2. Line-by-Line Breakdown (The 'for' Loop)
\`\`\`typescript
for (let i = 0; i < 5; i++) {
    console.log("Checking box number " + i);
}
\`\`\`
This looks scary, but it's just a sentence broken into 3 parts, separated by semicolons:
*   \`let i = 0\` -> Part 1: The Start. We create a counter variable named 'i' and set it to 0.
*   \`i < 5\` -> Part 2: The Condition. Before every loop, the computer asks, "Is i still less than 5?" If True, run the loop. If False, stop completely.
*   \`i++\` -> Part 3: The Step. After the loop finishes one round, we add 1 to 'i' (\`i++\` is a shortcut for \`i = i + 1\`).

### 3. The Easier Way: for...of
*💡 Analogy: Looking inside a carton of eggs and physically pulling out the eggs one by one.*

If you have an Array, the classic 'for' loop is ugly and easy to mess up. TypeScript gives us the \`for...of\` loop, which is much cleaner. It automatically goes through the list from start to finish.

\`\`\`typescript
const users = ["Alice", "Bob", "Charlie"];

// "For every user inside the users array..."
for (const user of users) {
    console.log("Hello, " + user);
}
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: The Infinite Loop**
\`\`\`typescript
// ❌ Error: 'i' gets smaller, so it will ALWAYS be less than 5!
for (let i = 0; i < 5; i--) {
    console.log(i);
}
\`\`\`
*Why it happens:* If you accidentally type \`i--\` (subtract 1) instead of \`i++\` (add 1), the counter goes to -1, -2, -3... It will *never* reach 5. The loop will run forever until your computer crashes!
        `
      },
      {
        id: 'functions',
        title: 'Functions & Scope',
        analogy: "A function is like a recipe in a cookbook. The recipe just sits there doing nothing. It only springs into action when you actually decide to 'call' it and give it ingredients.",
        lessonMarkdown: `
### 1. What is a Function?
*💡 Analogy: A vending machine. You put specific ingredients in (coins), the machine performs a hidden action, and it spits a specific result out (a soda).*

**Deep Explanation:**
As your test files grow, you will find yourself writing the exact same 10 lines of code to log into the website over and over again. A Function allows you to package those 10 lines of code into a single, reusable block with a name. 

### 2. Line-by-Line Breakdown
\`\`\`typescript
// 1. Defining the recipe
function calculateTax(price: number): number {
    const taxAmount = price * 0.10;
    return taxAmount;
}

// 2. Actually using the recipe
const myTax = calculateTax(50);
\`\`\`
*   \`function calculateTax\` -> We are defining a new function named "calculateTax".
*   \`(price: number)\` -> These are the **Parameters** (the ingredients). We are telling the function, "When someone uses you, they MUST give you a number, and internally we will call that number 'price'."
*   \`: number {\` -> This is the **Return Type**. We promise TypeScript that when this function finishes, it will spit out a number.
*   \`return taxAmount;\` -> The \`return\` keyword is the vending machine spitting the soda out. It hands the final answer back to whoever asked for it.

### 3. Arrow Functions
*💡 Analogy: A modern sports car. It does the exact same thing as the old function, but it's sleeker, faster to type, and looks cooler.*

In modern automation (especially Playwright), we almost never use the word \`function\`. We use "Arrow Functions" (\`() => {}\`). They do the exact same thing, just with different punctuation.

\`\`\`typescript
// ✅ The modern Arrow Function
const calculateTax = (price: number): number => {
    return price * 0.10;
};
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Forgetting to "Call" the function**
\`\`\`typescript
const login = () => { console.log("Logging in!"); }

// ❌ This does nothing! It just references the recipe.
login;

// ✅ You must use parentheses to actually run it!
login();
\`\`\`
*Why it happens:* Typing the name of a function is just pointing at the recipe book. You must add the parentheses \`()\` to tell the computer, "Go execute the recipe right now!"
        `
      },
      {
        id: 'async',
        title: 'Async/Await & Promises',
        analogy: "Asynchronous code is like ordering at a restaurant. You don't stand frozen staring at the chef for 20 minutes while they cook. You sit down, check your phone, and the waiter brings the food when it's ready.",
        lessonMarkdown: `
### 1. What is Asynchronous Code?
*💡 Analogy: Sending a letter in the mail. You drop it in the box, but you have absolutely no idea if it will take 2 days or 5 days to reach the destination.*

**Deep Explanation:**
This is the single most important concept in UI Automation! When Playwright clicks a "Login" button, it sends a network request to a server. That server might take 10 milliseconds or 5 seconds to respond. The internet is unpredictable. If our code runs synchronously (instantly moving to the next line), it will try to click the "Dashboard" button before the page has even loaded, causing the test to crash immediately. 

### 2. The Solution: 'await'
*💡 Analogy: A remote control that can pause time. You press 'await', and time freezes until the chef finishes cooking.*

To fix this, we use the \`await\` keyword. It tells our super-fast code to STOP and wait patiently until the browser finishes what it's doing.

**Line-by-Line Breakdown:**
\`\`\`typescript
const runTest = async () => {
    console.log("Starting...");
    await page.click("#login-button");
    console.log("Finished!");
};
\`\`\`
*   \`async () =>\` -> Before you can use 'await' inside a function, you MUST label the function with the word \`async\`. This warns TypeScript that this function contains time-traveling magic.
*   \`await page.click(...)\` -> The code reaches this line and completely freezes. It will not move to the next line until the button is physically clicked and the browser confirms it.

### 3. What is a Promise?
*💡 Analogy: A pager given to you at a busy restaurant. It represents food that doesn't exist yet.*

When you use \`await\`, what you are actually waiting on is a **Promise**. A Promise is a special JavaScript object that says, "I don't have the data yet, but I promise I will tell you if I succeed (Resolve) or if I fail (Reject)."

### 4. Common Beginner Mistakes
**Mistake: Forgetting 'await' on an action**
\`\`\`typescript
// ❌ Error: The script will crash instantly!
page.goto("https://google.com");
page.click("#search");

// ✅ Correct
await page.goto("https://google.com");
await page.click("#search");
\`\`\`
*Why it happens:* If you forget \`await\`, Playwright tells the browser to go to Google, but then the script instantly races to the next line and tries to click the search bar before Google has even begun to load!
        `
      },
      {
        id: 'error-handling',
        title: 'Try/Catch & Debugging',
        analogy: "A try/catch block is like having a safety net under a tightrope walker. If everything goes well, the net isn't used. But if they slip (an error occurs), the net catches them so the entire circus doesn't burn down.",
        lessonMarkdown: `
### 1. What is Error Handling?
*💡 Analogy: Driving a car and getting a flat tire. If you don't know how to handle the error, you just sit in the middle of the highway forever. If you handle the error, you pull over, put on a spare tire, and keep driving.*

**Deep Explanation:**
In automation, things fail constantly. APIs go down, buttons disappear, networks timeout. When an error happens in code, it "Throws an Exception". If you don't catch that exception, your entire test suite will crash violently. We use a **Try/Catch block** to gracefully handle these failures.

### 2. Line-by-Line Breakdown
\`\`\`typescript
try {
    // We try to do something dangerous
    await page.click("#broken-button");
    console.log("Success!");
} catch (error) {
    // If it fails, we teleport here immediately
    console.log("Oh no, something broke!");
    console.error(error.message);
} finally {
    // This always runs, no matter what
    await page.close();
}
\`\`\`
*   \`try { ... }\` -> We wrap our dangerous code inside this block. The computer executes it normally.
*   \`catch (error) { ... }\` -> If ANY line inside the 'try' block fails, the code immediately stops and jumps straight into the 'catch' block. The \`error\` variable holds the exact error message that caused the crash.
*   \`finally { ... }\` -> (Optional) This block runs at the very end, regardless of whether the try succeeded or failed. It is perfect for closing the browser or cleaning up test data.

### 3. Throwing your own Errors
Sometimes, you want to trigger a crash on purpose! If you notice the database is empty before a test even starts, you should throw an error to stop the test immediately.
\`\`\`typescript
if (database === null) {
    throw new Error("Cannot run test: Database is empty!");
}
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Putting too much code in the Try block**
\`\`\`typescript
// ❌ Bad practice
try {
    let x = 5;
    let y = 10;
    await page.click("#btn");
} catch (e) { ... }
\`\`\`
*Why it happens:* Beginners sometimes wrap their entire 100-line test in a massive try/catch block. This makes it incredibly difficult to figure out *which* line actually failed! Only wrap the specific lines that are prone to network or UI failures.
        `
      },
      {
        id: 'oop',
        title: 'Object-Oriented Programming',
        analogy: "OOP is like designing a blueprint for a robot factory. You don't build robots one by one from scratch. You design a 'Robot Class' blueprint, and then stamp out 1,000 individual robot 'instances' that all share the same laser eyes but have different serial numbers.",
        lessonMarkdown: `
### 1. What is a Class?
*💡 Analogy: A 'Class' is the architectural blueprint on paper. An 'Instance' is the actual physical house built out of wood.*

**Deep Explanation:**
When writing automation frameworks, you end up with hundreds of functions and variables. **Object-Oriented Programming (OOP)** is a way to organize your code. A "Class" is a master container that bundles related variables (properties) and functions (methods) together into a single blueprint.

### 2. Line-by-Line Breakdown
Let's build a class for a Login Page.

\`\`\`typescript
class LoginPage {
    // 1. Properties (Variables attached to the class)
    url: string = "https://myapp.com/login";

    // 2. Methods (Functions attached to the class)
    async performLogin() {
        console.log("Navigating to " + this.url);
    }
}

// 3. Creating an Instance
const login = new LoginPage();
await login.performLogin();
\`\`\`
*   \`class LoginPage { ... }\` -> This defines the blueprint.
*   \`url: string = ...\` -> This is a property. It's just a variable that lives permanently inside the class.
*   \`performLogin() { ... }\` -> This is a method. It's just a function that lives inside the class.
*   \`this.url\` -> The **'this'** keyword is crucial. It means "look inside MYSELF". It tells the class to grab its own internal 'url' variable.
*   \`new LoginPage()\` -> The \`new\` keyword takes the blueprint and actually builds the physical object in the computer's memory.

### 3. Public vs Private
*💡 Analogy: 'Public' means anyone can walk into your front yard. 'Private' means locking your diary in a vault so nobody except you can read or change it.*

In TypeScript, you can secure your classes. If you mark a property as \`private\`, no other code outside of that specific class is allowed to touch it. This stops junior developers from accidentally changing crucial test data!
\`\`\`typescript
class BankAccount {
    private balance: number = 100;
}
const myBank = new BankAccount();
// myBank.balance = 5000000; // 🛑 ERROR! TypeScript prevents this!
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Forgetting the 'this' keyword**
\`\`\`typescript
class User {
    name = "John";
    printName() {
        // ❌ Error: Cannot find name 'name'
        console.log(name); 
        
        // ✅ Correct
        console.log(this.name); 
    }
}
\`\`\`
*Why it happens:* If you just type \`name\`, the computer looks for a normal, standalone variable. You MUST use \`this.name\` to tell the computer, "Look inside the class properties!"
        `
      },
      {
        id: 'modules',
        title: 'Imports & Exports',
        analogy: "Exporting is like putting a tool in a shared toolbox. Importing is like walking over to the toolbox and taking out exactly the hammer you need for your current job.",
        lessonMarkdown: `
### 1. What are Modules?
*💡 Analogy: A massive encyclopedia isn't printed as one giant, 10,000-page scroll. It is broken into multiple Volumes (files) so it is easy to read and carry.*

**Deep Explanation:**
If you put all of your test code, locators, and classes into one single file, that file will eventually become 5,000 lines long and impossible to read. Modern TypeScript solves this with the Module System. Every file is completely isolated. If you create a \`LoginPage\` class in File A, File B literally has no idea it exists—until you explicitly "Export" it and "Import" it.

### 2. Line-by-Line Breakdown (Exporting)
Let's say we create a file called \`LoginPage.ts\`.

\`\`\`typescript
// File: LoginPage.ts

export class LoginPage {
    login() { console.log("Logging in!"); }
}

export const TIMEOUT = 5000;
\`\`\`
*   \`export class ...\` -> The \`export\` keyword unlocks the door. It tells TypeScript, "It is okay if other files want to use this class."
*   Notice we exported both a Class and a regular constant variable!

### 3. Line-by-Line Breakdown (Importing)
Now we create our actual test file, \`login.test.ts\`.

\`\`\`typescript
// File: login.test.ts

import { LoginPage, TIMEOUT } from './LoginPage';

const page = new LoginPage();
console.log("Max timeout is: " + TIMEOUT);
\`\`\`
*   \`import { ... }\` -> Inside the curly braces, we type the exact, case-sensitive names of the things we want to borrow.
*   \`from './LoginPage'\` -> This is the relative path to the file. \`./\` means "look in the exact same folder I am currently in." 

### 4. Common Beginner Mistakes
**Mistake: Messing up the file path**
\`\`\`typescript
// ❌ Error: Cannot find module
import { LoginPage } from 'LoginPage';

// ✅ Correct
import { LoginPage } from './LoginPage';
\`\`\`
*Why it happens:* If you don't use \`./\` or \`../\` at the start of your path, TypeScript thinks you are trying to import an external library you downloaded from the internet (like Playwright or React), rather than one of your own local files!
        `
      },
      {
        id: 'ts-types',
        title: 'TypeScript Strict Types',
        analogy: "Strict Types are like a bouncer with a clipboard at a VIP party. It doesn't matter how nice your suit is; if your name isn't exactly spelled right on the 'Interface' clipboard, you are not getting in.",
        lessonMarkdown: `
### 1. What is an Interface?
*💡 Analogy: A blueprint for a Lego character. The blueprint dictates that every character MUST have 1 head, 1 torso, and 2 legs. If you try to build a character with 3 arms, the factory rejects it.*

**Deep Explanation:**
We learned earlier that Objects hold key-value pairs (like \`{name: "John", age: 25}\`). But what if a junior tester accidentally types \`{name: "John", agge: 25}\`? The test will break! An **Interface** allows you to define a strict, unbreakable rule for exactly what an object must look like.

### 2. Line-by-Line Breakdown
\`\`\`typescript
// 1. Defining the Rule
interface User {
    name: string;
    age: number;
    isAdmin?: boolean;
}

// 2. Enforcing the Rule
const myUser: User = {
    name: "Alice",
    age: 30
};
\`\`\`
*   \`interface User { ... }\` -> We are creating a custom rule named "User".
*   \`name: string;\` -> Rule #1: Any object using this rule MUST have a property called 'name', and it MUST be text.
*   \`isAdmin?: boolean;\` -> Notice the question mark (**?**)! This makes the property **Optional**. The object is perfectly valid whether it includes 'isAdmin' or leaves it out entirely.
*   \`const myUser: User\` -> We apply the rule to our variable exactly like we apply \`: string\`. 

### 3. What is an Enum?
*💡 Analogy: A multiple-choice dropdown menu on a website. You cannot invent a new country. You must click a country from the strict list provided.*

If you have an order status that can only be "Pending", "Shipped", or "Delivered", you shouldn't use raw text strings in your code. You create an **Enum** (Enumeration).
\`\`\`typescript
enum Status {
    PENDING = "PENDING",
    SHIPPED = "SHIPPED"
}

// You MUST select from the Enum. You cannot type random strings!
let orderStatus: Status = Status.SHIPPED; 
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Missing a required property in an Interface**
\`\`\`typescript
interface Car {
    brand: string;
    wheels: number;
}

// ❌ Error: Property 'wheels' is missing!
const myCar: Car = {
    brand: "Toyota"
};
\`\`\`
*Why it happens:* If a property in an Interface does NOT have a question mark \`?\`, it is 100% mandatory. TypeScript will refuse to compile your code if you forget it. This is how TypeScript saves you from massive bugs!
        `
      },
      {
        id: 'template-literals',
        title: 'Dynamic Strings',
        analogy: "String concatenation (+) is like cutting letters out of a magazine and gluing them together on a ransom note. Template Literals (``) are like a fill-in-the-blank mad-libs book. It is much cleaner and easier to read.",
        lessonMarkdown: `
### 1. What is a Template Literal?
*💡 Analogy: A name tag at a conference that says "Hello, my name is [BLANK]". You just write the variable in the blank space.*

**Deep Explanation:**
In UI automation, you constantly need to find dynamic elements on the screen. For example, clicking a button with the ID \`#user-123-delete\`, where "123" is a variable. Beginners often use the plus sign (\`+\`) to glue text together, but this quickly becomes an unreadable mess of quotes and pluses. Modern TypeScript uses **Template Literals** (backticks) to instantly inject variables into strings.

### 2. Line-by-Line Breakdown
\`\`\`typescript
const userId = 55;

// ❌ The old, messy way (String Concatenation)
const oldLocator = "#user-" + userId + "-delete-btn";

// ✅ The modern way (Template Literal)
const newLocator = \`#user-\${userId}-delete-btn\`;
\`\`\`
*   \`\`\` (Backticks) -> Notice we are NOT using single or double quotes! We are using the backtick key (usually next to the 1 key on your keyboard).
*   \`\${userId}\` -> The dollar sign and curly braces act as a portal. They tell the string, "Hey, temporarily stop being text, and go grab the value of this variable."

### 3. Common Beginner Mistakes
**Mistake: Using regular quotes with \${}**
\`\`\`typescript
// ❌ Error: This literally prints the text "\${userId}" to the screen!
const badString = "Hello \${userId}"; 

// ✅ Correct
const goodString = \`Hello \${userId}\`;
\`\`\`
*Why it happens:* The \`\${\` portal ONLY activates if the string is wrapped in backticks. If you use normal quotes, TypeScript just assumes it is part of the text!
        `
      },
      {
        id: 'destructuring',
        title: 'Destructuring & Any',
        analogy: "Destructuring is like having a giant toolbox, but instead of carrying the whole heavy box to the worksite, you just instantly pop out the hammer and the screwdriver and leave the box behind.",
        lessonMarkdown: `
### 1. What is Destructuring?
*💡 Analogy: Walking into a buffet. You don't take the entire metal tray of lasagna back to your table. You just scoop out the specific piece you want.*

**Deep Explanation:**
This is the #1 concept that confuses beginners starting Playwright! Often, an object has 50 properties, but you only need 1 of them. Instead of typing \`userObject.firstName\` 100 times, you can "Destructure" the object, extracting the exact variables you need in a single line.

### 2. Line-by-Line Breakdown
\`\`\`typescript
const employee = { name: "Alice", id: 99, department: "QA" };

// ❌ The old way
const empName = employee.name;
const empDept = employee.department;

// ✅ The modern way (Destructuring)
const { name, department } = employee;
console.log(name); // Prints: "Alice"
\`\`\`
*   \`const { name } = employee\` -> We are telling the computer, "Look inside the employee object, find a key called 'name', rip its value out, and create a brand new standalone variable called 'name'."

### Why Playwright Looks Weird:
Now you can understand why Playwright tests look like this:
\`\`\`typescript
test('My test', async ({ page }) => { ... })
\`\`\`
Playwright is handing you a massive "TestContext" object with 50 tools inside it. But you only want the browser \`page\` tool. So you destructure it directly inside the function parentheses!

### 3. The Danger of 'any'
*💡 Analogy: Telling the strict VIP bouncer to completely abandon his post and let literally anyone into the club.*

When TypeScript throws a red squiggly error because types don't match, beginners get frustrated and use the \`any\` keyword to force the code to compile. 
\`\`\`typescript
let username: any = "John";
username = 55; // ❌ No error thrown! You just ruined the database.
\`\`\`
**NEVER use \`any\`.** It completely disables TypeScript's safety net. If you don't know exactly what a type will be, use **Union Types** instead:
\`\`\`typescript
// ✅ This variable is allowed to be a string OR a number, but nothing else.
let score: string | number;
\`\`\`
        `
      },
      {
        id: 'type-aliases',
        title: 'Type Aliases & Unions',
        analogy: "A Type Alias is like creating a custom combo meal at a fast-food restaurant. Instead of ordering 'a burger, fries, and a drink' every single time, you just say 'I want the Combo #1'. A Union Type is like saying 'I want a drink, and it can be *either* Coke *or* Sprite, but nothing else'.",
        lessonMarkdown: `
### 1. The Core Concept
*💡 Analogy: Custom combo meals and strict menus.*

**Deep Explanation:**
In TypeScript, you don't always want to type out \`{ name: string, age: number }\` every single time you create a new variable. A **Type Alias** lets you save that shape under a custom name so you can reuse it.
A **Union Type** (using the \`|\` pipe character) acts like an exclusive club. It forces a variable to strictly be one of a few specific options, preventing typos and invalid data.

### 2. Basic Example: Type Aliases
\`\`\`typescript
// ❌ The repetitive way
let user1: { name: string, age: number } = { name: "John", age: 30 };
let user2: { name: string, age: number } = { name: "Jane", age: 25 };

// ✅ The modern way (Type Alias)
type User = {
  name: string;
  age: number;
};

let betterUser: User = { name: "Bob", age: 40 };
\`\`\`
*   \`type User = ...\` -> We are inventing a brand new data type called "User". It doesn't create any data yet, it just creates the blueprint.

### 3. Automation Example: Union Types
In test automation, you constantly deal with configuration. If you pass a typo into your environment variable, your entire test suite will crash. Union types fix this.
\`\`\`typescript
// ❌ Dangerous string type (Allows typos!)
let environment: string = "stagingg"; // Typo! 

// ✅ Strict Union Type
type Environment = "qa" | "staging" | "prod";
let currentEnv: Environment = "qa";

currentEnv = "testing"; // ❌ Error: Type '"testing"' is not assignable to type 'Environment'.
\`\`\`
*   \`"qa" | "staging" | "prod"\` -> The pipe \`|\` means "OR". The variable MUST be one of these exact three strings.

### 4. Common Beginner Mistakes
**Mistake: Using \`type\` vs \`interface\` interchangeably**
\`\`\`typescript
// Both work for objects:
type PointType = { x: number, y: number };
interface PointInterface { x: number, y: number }

// ❌ But Interfaces CANNOT do Unions!
interface Status = "pass" | "fail"; // ERROR!

// ✅ You MUST use Type Aliases for Unions
type Status = "pass" | "fail";
\`\`\`
*Why it happens:* Beginners see \`type\` and \`interface\` doing the same thing for objects and get confused. **Rule of thumb**: Use \`interface\` for object shapes, use \`type\` for Unions and advanced types.
        `
      },
      {
        id: 'type-narrowing',
        title: 'Type Narrowing & Guards',
        analogy: "Type Narrowing is like a bouncer at a club checking IDs. Once the bouncer verifies you are over 21 (the \`if\` block), you are allowed into the bar. TypeScript watches the bouncer, and magically unlocks specific features only inside that room.",
        lessonMarkdown: `
### 1. The Core Concept
*💡 Analogy: The Bouncer checking your ID.*

**Deep Explanation:**
When a variable can be multiple things (e.g., \`string | number\`), TypeScript locks down its features because it isn't safe to use. You can't use \`.toUpperCase()\` because the variable might be a number! 
**Type Narrowing** is the process of using \`if\` statements (Type Guards) to prove to TypeScript exactly what the variable is right now.

### 2. Basic Example: \`typeof\`
\`\`\`typescript
function printID(id: string | number) {
  // ❌ Error: Property 'toUpperCase' does not exist on type 'number'.
  console.log(id.toUpperCase()); 

  // ✅ The Bouncer (Type Guard)
  if (typeof id === "string") {
    // Inside this block, TS knows \`id\` is 100% a string!
    console.log(id.toUpperCase());
  } else {
    // Inside this block, TS knows \`id\` MUST be a number!
    console.log(id.toFixed(2));
  }
}
\`\`\`
*   \`typeof id === "string"\` -> This is the Type Guard. TypeScript is smart enough to read your \`if\` logic and apply it to the variable's type inside the curly braces.

### 3. Automation Example: The \`in\` Operator
In UI automation, you often fetch elements that might be different shapes (e.g., an Input field vs a Dropdown).
\`\`\`typescript
type InputField = { value: string; clear: () => void };
type Dropdown = { selectedOption: string; select: (opt: string) => void };

function interactWithElement(element: InputField | Dropdown) {
  // Use the 'in' operator to check if a specific property exists!
  if ("clear" in element) {
    // TS narrows this down to an InputField!
    element.clear();
  } else {
    // TS knows it MUST be a Dropdown!
    element.select("Option A");
  }
}
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Forgetting that \`typeof null\` is "object"**
\`\`\`typescript
function process(data: string[] | null) {
  if (typeof data === "object") {
    // ❌ Error! If data is null, typeof null is "object".
    // This will crash when you try to loop over null!
    data.forEach(d => console.log(d));
  }
}

// ✅ Correct
function processSafe(data: string[] | null) {
  if (data !== null) {
    data.forEach(d => console.log(d));
  }
}
\`\`\`
        `
      },
      {
        id: 'generics',
        title: 'Generics (<T>)',
        analogy: "A Generic is like a blank, customizable shipping box. The factory doesn't know if you're putting shoes or laptops inside. But once you slap a \`<Shoes>\` label on it, the box magically reshapes itself to only accept shoes.",
        lessonMarkdown: `
### 1. The Core Concept
*💡 Analogy: The magic, shape-shifting shipping box.*

**Deep Explanation:**
Functions often need to work with many different types of data. Instead of writing 10 different functions (one for strings, one for numbers, one for Users), we write **ONE Generic Function**. 
We use the diamond syntax \`<T>\` (which stands for Type) as a placeholder. It means "I don't know what type this is yet, but whoever calls this function will tell me."

### 2. Basic Example
\`\`\`typescript
// A generic function that takes an item and returns an array of that item
function makeArray<T>(item: T): T[] {
  return [item];
}

// Slapping the label on the box!
const numArr = makeArray<number>(55); // Returns number[]
const strArr = makeArray<string>("hello"); // Returns string[]
\`\`\`
*   \`<T>\` -> This creates a "Type Variable". Just like \`item\` holds data, \`T\` holds a Type.
*   \`(item: T)\` -> We say "the item must be of type T".
*   \`: T[]\` -> We say "this function returns an array of type T".

### 3. Automation Example: API Fetching
This is the **most important use case for Generics** in test automation. When you make an API request, the code doesn't know what the JSON response looks like. Generics let you strictly type your API calls!
\`\`\`typescript
// 1. Define what we expect the API to return
type UserResponse = { id: number; name: string };

// 2. A generic fetch function
async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data; // Returns whatever type <T> we passed in!
}

// 3. The Magic: Using the generic
const user = await apiGet<UserResponse>("/api/v1/user/1");

// ✅ TypeScript provides full autocomplete!
console.log(user.name); 
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Using \`any\` instead of Generics**
\`\`\`typescript
// ❌ Using any ruins TypeScript
function badReturn(item: any): any { return item; }
const result = badReturn("hello"); // result is 'any', no autocomplete!

// ✅ Generics preserve the exact type!
function goodReturn<T>(item: T): T { return item; }
const result2 = goodReturn("hello"); // result2 is strictly 'string'!
\`\`\`
        `
      },
      {
        id: 'utility-types',
        title: 'Utility Types',
        analogy: "Utility Types are like Photoshop filters for your data. If you have a beautiful HD photo of a user profile, \`Partial<>\` makes everything optional, \`Pick<>\` is the crop tool, and \`Readonly<>\` laminates the photo so it can never be changed.",
        lessonMarkdown: `
### 1. The Core Concept
*💡 Analogy: Photoshop filters and Laminating machines.*

**Deep Explanation:**
In testing, you rarely use the *exact* same data model everywhere. Sometimes you need a massive \`User\` object, but for a Login API test, you only need their username and password. 
Instead of writing 5 different versions of the \`User\` type, TypeScript gives you **Utility Types** to instantly transform existing types on the fly!

### 2. Basic Example: Partial & Pick
\`\`\`typescript
type User = { id: number; name: string; email: string; age: number };

// ❌ Bad: Creating a duplicate type just for updates
type UserUpdate = { name?: string; email?: string; age?: number };

// ✅ Good: Using Partial (makes all properties optional!)
type BetterUpdate = Partial<User>;

// ✅ Good: Using Pick (Crops the type to just specific keys!)
type LoginPayload = Pick<User, "email" | "name">;
\`\`\`

### 3. Automation Example: Omit & Readonly
In test automation, you often want to ensure your global test configurations are never accidentally modified by a rogue test.
\`\`\`typescript
type TestConfig = { baseUrl: string; timeout: number; retries: number };

// 1. Omit: Removes specific keys. Great for creating data!
// We omit 'timeout' because the system generates it automatically.
type CreateConfigPayload = Omit<TestConfig, "timeout">;
const newConf: CreateConfigPayload = { baseUrl: "http://qa", retries: 2 };

// 2. Readonly: Laminates the object!
const globalConf: Readonly<TestConfig> = { baseUrl: "http://qa", timeout: 5000, retries: 1 };

// ❌ Error: Cannot assign to 'timeout' because it is a read-only property.
globalConf.timeout = 10000; 
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Creating duplicate types instead of Utilities**
Beginners will often create \`TypeA\`, \`TypeB\`, and \`TypeC\` that share 90% of the same properties. When a requirement changes, they have to update it in 3 different places. Always build a "Master Type" and use Utility Types to derive the rest!
        `
      },
      {
        id: 'null-safety',
        title: 'Null & Undefined Safety',
        analogy: "Null safety is like a bomb disposal robot. Trying to click a button that doesn't exist causes an explosion (a crash). Optional Chaining (\`?.\`) sends the robot in: if the button doesn't exist, it safely powers down instead of blowing up the test.",
        lessonMarkdown: `
### 1. The Core Concept
*💡 Analogy: The bomb disposal robot.*

**Deep Explanation:**
The number one crash in JavaScript is: **"Cannot read properties of undefined (reading 'xyz')"**. This happens when you try to access data inside an object that doesn't exist. 
TypeScript provides powerful operators to safely navigate broken data without crashing your automation framework.

### 2. Basic Example: Optional Chaining (\`?.\`)
\`\`\`typescript
type User = { profile?: { address?: { city: string } } };
const user1: User = {}; // Empty user!

// ❌ Old way: Massive if-statements to prevent crashes
if (user1 && user1.profile && user1.profile.address) {
  console.log(user1.profile.address.city);
}

// ✅ Modern way: Optional Chaining
// If any step is missing, it immediately stops and returns 'undefined' without crashing!
console.log(user1?.profile?.address?.city);
\`\`\`

### 3. Automation Example: Nullish Coalescing (\`??\`)
In testing, you often extract text from the DOM. If the element isn't there, you want a fallback value, not a crash.
\`\`\`typescript
// Let's pretend we are querying the webpage
const toastMessage = document.querySelector('.toast')?.textContent;

// ❌ Bad fallback using OR (||). 
// Fails if the text is legitimately an empty string ""!
const message1 = toastMessage || "Default Error";

// ✅ Good fallback using Nullish Coalescing (??)
// ONLY falls back if the left side is strictly null or undefined!
const message2 = toastMessage ?? "Default Error";
\`\`\`

### 4. Common Beginner Mistakes
**Mistake: Abusing the Non-Null Assertion (\`!\`)**
The exclamation mark tells TypeScript: *"Shut up, I promise this is not null."*
\`\`\`typescript
const button = document.querySelector('#submit-btn');

// ❌ Dangerous! If the button is missing, your test violently crashes!
button!.click();

// ✅ Safe! Only clicks if the button actually exists.
button?.click();
\`\`\`
*Why it happens:* Beginners get annoyed by the "Object is possibly null" red squiggly error and use \`!\` to force it away. You should almost NEVER use \`!\`. Always handle the null case!
        `
      }
    ]
  },
  playwright: {
    id: 'playwright',
    levels: [
      {
        id: 'basic',
        title: 'Basic: Automation',
        analogy: "Playwright is a literal robot ghost that possesses your computer browser. You hand it a script, and it physically opens Chrome, moves the mouse, clicks buttons, and types on the keyboard exactly like a real human QA engineer would.",
        lessonMarkdown: `
### 1. What is Playwright?
*💡 Analogy: It's an incredibly fast, invisible intern who can click through your website a thousand times a minute and never gets bored.*

Playwright is a modern, open-source test automation framework built by Microsoft. It is designed to perform end-to-end (E2E) testing. This means instead of just testing a small chunk of backend code in isolation, Playwright actually spins up a real instance of Chromium, Firefox, or WebKit, navigates to your website, and interacts with the UI directly. This ensures that the frontend buttons, the backend APIs, and the database all work together in harmony.

### 2. Locators
*💡 Analogy: Giving someone a treasure map. You don't just say "Dig somewhere." You say, "Find the giant oak tree, walk 10 paces north, and dig under the red rock."*

Before the robot can click a button, it has to find it. Locators are the core mechanism used to target specific elements in the DOM (the HTML structure of the page). Playwright provides highly resilient locators like \`page.getByRole('button', { name: 'Submit' })\` or \`page.getByText('Welcome back')\`. Locators are the eyes of your automation script.

### 3. Navigation
*💡 Analogy: Getting into a taxi and giving the driver an exact address. The driver cannot take you anywhere until they know where to start.*

Every single end-to-end test must begin by telling the browser where to go. The \`page.goto('https://example.com')\` command instructs the browser to navigate to a specific URL. The script will automatically wait for the page's core HTML to finish loading before it proceeds to the next step, ensuring the test doesn't fail trying to click a button that hasn't downloaded yet.
        `
      },
      {
        id: 'intermediate',
        title: 'Intermediate: Waiting & Asserting',
        analogy: "Automation code processes at the speed of light. If you don't aggressively tell the code to 'wait' for the clumsy, slow website to load its images, the code will try to click a button that hasn't even been painted on the screen yet.",
        lessonMarkdown: `
### 1. The 'await' Keyword
*💡 Analogy: A drill sergeant yelling at a recruit to pause and wait for the target to actually appear before pulling the trigger.*

Playwright is inherently asynchronous because the internet is asynchronous. When you tell a browser to navigate or click, it takes milliseconds (or seconds) for the network to respond and the UI to update. The \`await\` keyword forces your incredibly fast JavaScript code to pause execution and wait for the browser's Promise to resolve. If you forget to use \`await\`, your script will race ahead of the browser, causing horrific, confusing test failures.

### 2. Assertions (expect)
*💡 Analogy: A judge banging a gavel. Clicking the buttons is just presenting the evidence. The Assertion is the final ruling on whether the test passed or failed.*

Automation scripts are utterly useless if they just click around aimlessly. A test must verify that the app is in the correct state after an action is performed. We use "Assertions" for this. By writing \`await expect(page.getByText('Login Successful')).toBeVisible()\`, you are creating a hard rule. If that text does not appear on the screen within a few seconds, Playwright will throw a fatal error and mark the test as a failure.

### 3. Fragile Selectors
*💡 Analogy: Recognizing your friend by the color of their shirt. If they change their shirt the next day, you won't know who they are. You should recognize them by their face instead.*

In the dark ages of automation, testers used CSS classes like \`.btn-blue-xl\` to locate buttons. This was a nightmare, because the moment a frontend developer changed the button to be red, the test broke. Playwright strongly encourages "user-facing" locators. You should find elements by their visible text or their accessibility roles, because those rarely change unless the actual business logic of the app changes.
        `
      },
      {
        id: 'expert',
        title: 'Expert: Advanced Playwright',
        analogy: "Expert automation is about taking total control of reality. It's intercepting the website's radio communications and feeding it fake weather reports to see if the website's umbrella opens correctly.",
        lessonMarkdown: `
### 1. Auto-Waiting
*💡 Analogy: A polite person at a crosswalk. Instead of blindly stepping into the street at an exact second, they actively watch the cars and wait for it to be completely clear before walking.*

Flakiness (tests that pass on Monday but fail on Tuesday for no reason) is the enemy of QA. Old tools forced testers to write hardcoded \`sleep(5000)\` commands to wait for slow animations. Playwright features brilliant "Auto-Waiting". Before clicking a button, Playwright rapidly checks a massive list of conditions: Is the button attached to the DOM? Is it visible? Is it no longer animating? Is it not covered by a modal? It polls these conditions automatically, making tests incredibly stable.

### 2. API Mocking
*💡 Analogy: Testing an airplane's wings in a wind tunnel on the ground. You generate fake wind so you can safely test the plane without actually risking a real flight in the sky.*

Sometimes you want to test how the Frontend UI reacts when the Backend database crashes. But you can't deliberately crash the real production database just for a test! Playwright allows you to intercept the network traffic originating from the browser. You can catch a GET request before it leaves the browser, block it, and instantly return a fake \`500 Internal Server Error\` JSON payload. This allows you to verify that the UI displays the red "Oops, something went wrong!" banner perfectly.

### 3. Page Object Model (POM)
*💡 Analogy: Keeping all your tools in a meticulously organized toolbox in the garage. If your hammer breaks, you know exactly which drawer to open to replace it, instead of hunting all over the house.*

The Page Object Model is a structural design pattern meant to save your sanity. Imagine you have 100 tests that all click the 'Login' button. If the developer changes the login button, you have to manually edit 100 test files. With POM, you create a dedicated class file for the LoginPage, and store the locator there once. All 100 tests reference that one class. When the button changes, you update the locator in exactly one place, and all 100 tests are instantly fixed.
        `
      }
    ]
  },
  'ai-qa': {
    id: 'ai-qa',
    levels: [
      {
        id: 'basic',
        title: 'Basic: Using AI',
        analogy: "Talking to an AI is like talking to a genius intern who has read every book in the world, but has absolutely zero common sense. If you ask them to 'make a sandwich', they might use cardboard instead of bread because you didn't explicitly forbid it.",
        lessonMarkdown: `
### 1. What is a Prompt?
*💡 Analogy: It's the exact blueprint you hand to a construction crew. If the blueprint is vague, you end up with a crooked house.*

A "Prompt" is the text or instructions you type into a Large Language Model (LLM) like ChatGPT or Claude. AI is a garbage-in, garbage-out system. If you ask it a lazy, one-sentence question, you will get a generic, useless answer. Crafting high-quality prompts is a completely new skill for QA engineers, requiring you to be highly specific about context, desired formats, and limitations.

### 2. The Human Element
*💡 Analogy: AI can read sheet music faster than any human, but it cannot actually hear the music to know if it sounds beautiful or sad.*

There is a widespread fear that AI will completely replace manual testers. This is a misunderstanding of what AI is. AI is incredible at rapidly writing boilerplate test scripts, summarizing documentation, and generating data. However, AI completely lacks human empathy, intuition, and real-world context. An AI cannot look at a clunky, frustrating user interface and say, "This feels annoying to use." Exploratory testing and UX evaluation remain strictly human domains.

### 3. Hallucinations
*💡 Analogy: A student taking a test who didn't study, so they confidently invent completely fake historical facts hoping the teacher won't notice.*

AI models do not possess a database of facts; they are massive probability engines designed to predict the next most likely word in a sentence. Because they are designed to be conversational and confident, they will frequently invent completely fake APIs, non-existent software libraries, or wrong test data just to complete a sentence that "sounds" correct. This is called a hallucination, and it is why a QA engineer must always rigorously verify any code an AI generates.
        `
      },
      {
        id: 'intermediate',
        title: 'Intermediate: Better Prompts',
        analogy: "Zero-shot prompting is asking the AI to bake a wedding cake with no recipe. Few-shot prompting is showing the AI three beautiful pictures of wedding cakes and saying, 'Make it exactly like this.'",
        lessonMarkdown: `
### 1. Zero-Shot Prompting
*💡 Analogy: Throwing a dart at a dartboard while blindfolded.*

"Zero-shot" refers to the technique of asking an AI model to perform a task without giving it any prior examples of what a successful output looks like. For simple tasks (like "translate this sentence to French"), zero-shot works fine. For complex QA tasks (like "write a Playwright test script for this complex e-commerce flow"), zero-shot will almost certainly result in messy, unusable code that doesn't follow your company's internal standards.

### 2. Personas
*💡 Analogy: Hiring an actor. If you tell them 'Act like a doctor', they will instantly change their vocabulary, posture, and tone to match.*

One of the most powerful ways to manipulate an AI's output is to assign it a persona at the very beginning of the prompt. By starting your prompt with, "Act as a Senior QA Automation Architect with 15 years of experience in JavaScript," you force the AI to filter its massive knowledge base. It drops the generic, conversational tone and immediately adopts strict, highly-technical industry standards, resulting in significantly higher quality code and test strategies.

### 3. Generating Test Data
*💡 Analogy: Having a magical printing press that can instantly print thousands of completely unique, valid driver's licenses for your testing needs.*

One of the most tedious parts of testing is coming up with mock data. If you need 50 fake user profiles with varied edge-case names, weird email formats, and randomized ages to test a database migration, you could spend an hour typing them out. Or, you can prompt an AI: "Generate a JSON array of 50 mock user objects containing edge-case names (hyphens, apostrophes) and invalid emails." The AI will instantly generate pristine, syntactically perfect mock data, saving you massive amounts of time.
        `
      },
      {
        id: 'expert',
        title: 'Expert: AI Automation',
        analogy: "Self-healing automation is like a bloodhound tracking a scent. If the target changes their jacket (changes their CSS class), the bloodhound doesn't give up; it uses other senses to track them down anyway.",
        lessonMarkdown: `
### 1. Self-Healing Automation
*💡 Analogy: A GPS navigation system. If the main highway is closed due to construction, the GPS doesn't crash your car; it automatically calculates a detour to reach the exact same destination.*

The holy grail of test automation is eliminating flaky tests. "Self-Healing" refers to modern AI-powered testing tools that dynamically adjust to UI changes. If a developer changes a button's ID from \`submit-btn\` to \`login-btn\`, a traditional Playwright test will instantly fail. A self-healing AI tool will analyze the entire DOM tree, realize the button visually looks the same and is in the same place, automatically update its own locator to \`login-btn\`, and pass the test, notifying you of the healed locator later.

### 2. Chain of Thought
*💡 Analogy: A math teacher forcing you to show all your work on the chalkboard, rather than just shouting out a random final answer.*

When dealing with highly complex logic or architectural questions, AI tends to hallucinate if forced to jump straight to the final answer. "Chain of Thought" prompting is the technique of adding the phrase "Think step by step" to the end of your prompt. This forces the AI to output its internal reasoning process sequentially before arriving at a conclusion. By forcing it to process the logic linearly, the accuracy of its final answer skyrockets dramatically.

### 3. Security & Data Leakage
*💡 Analogy: Broadcasting your company's secret recipe on a massive radio tower for the entire world to hear.*

This is the most critical rule of using AI in QA. Public AI models (like the free version of ChatGPT) often use the data typed into them to train their future algorithms. If you paste proprietary source code, secret API keys, or live customer data into an AI prompt to ask it for help finding a bug, you have just leaked corporate secrets to the public domain. Security protocols dictate that only strictly anonymized data, or isolated enterprise AI models, should ever be used for analyzing code.
        `
      }
    ]
  }
};
