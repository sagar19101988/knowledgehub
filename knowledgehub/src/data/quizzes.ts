export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizLevel {
  level: string; // 'basic' | 'intermediate' | 'expert'
  questions: QuizQuestion[];
}

export const ZONES_QUIZZES: Record<string, QuizLevel[]> = {
  manual: [
    {
      level: 'basic',
      questions: [
        {
          question: 'What is the main goal of Exploratory Testing?',
          options: [
            { id: 'a', text: 'To follow a script perfectly step-by-step.', isCorrect: false },
            { id: 'b', text: 'To learn, design tests, and execute them all at once using your intuition.', isCorrect: true },
            { id: 'c', text: 'To let automation tools find bugs.', isCorrect: false }
          ],
          explanation: 'Exploratory testing is about learning the system and finding bugs by thinking on your feet, not just following a script.'
        },
        {
          question: 'Why do we test the "Happy Path" first?',
          options: [
            { id: 'a', text: 'To make sure the basic feature actually works before trying to break it.', isCorrect: true },
            { id: 'b', text: 'Because users never make mistakes.', isCorrect: false },
            { id: 'c', text: 'To trick the developers.', isCorrect: false }
          ],
          explanation: 'If the normal, intended way to use the app is broken, there is no point in testing weird edge cases yet.'
        },
        {
          question: 'What is a "Negative Test"?',
          options: [
            { id: 'a', text: 'Testing how the system handles invalid input or unexpected actions.', isCorrect: true },
            { id: 'b', text: 'A test that always fails by design.', isCorrect: false },
            { id: 'c', text: 'A test where the tester has negative expectations.', isCorrect: false }
          ],
          explanation: 'Negative testing checks if the app can gracefully handle wrong data, like entering letters into a phone number field.'
        }
      ]
    },
    {
      level: 'intermediate',
      questions: [
        {
          question: 'If a password must be 8 to 12 characters, what values do you test for Boundary Value Analysis?',
          options: [
            { id: 'a', text: '7, 8, 12, 13', isCorrect: true },
            { id: 'b', text: '8, 9, 10, 11', isCorrect: false },
            { id: 'c', text: '0, 10, 100', isCorrect: false }
          ],
          explanation: 'Boundary Value Analysis focuses on the exact limits and one step outside them (7, 8, 12, 13).'
        },
        {
          question: 'What is Equivalence Partitioning?',
          options: [
            { id: 'a', text: 'Dividing developers into equal teams.', isCorrect: false },
            { id: 'b', text: 'Grouping inputs that should be treated the same way by the app, so you only have to test one.', isCorrect: true },
            { id: 'c', text: 'Running tests on multiple browsers equally.', isCorrect: false }
          ],
          explanation: 'If ages 18-65 are adults, testing age 25 is enough. You do not need to test 26, 27, etc. They are in the same partition.'
        },
        {
          question: 'Why do we use state transition testing?',
          options: [
            { id: 'a', text: 'To test how an app moves from one state to another (e.g., from "In Cart" to "Purchased").', isCorrect: true },
            { id: 'b', text: 'To test if the app works in different states like Texas and Florida.', isCorrect: false },
            { id: 'c', text: 'To see if the app loads fast.', isCorrect: false }
          ],
          explanation: 'State Transition Testing checks if an object can correctly move between allowed statuses, like an order going from Pending to Shipped.'
        }
      ]
    },
    {
      level: 'expert',
      questions: [
        {
          question: 'What does the heuristic "State Dependency" refer to?',
          options: [
            { id: 'a', text: 'When an app relies on data that might be stale across different tabs or sessions.', isCorrect: true },
            { id: 'b', text: 'When code depends on the operating system.', isCorrect: false },
            { id: 'c', text: 'When a button is disabled.', isCorrect: false }
          ],
          explanation: 'State dependency bugs happen when an application gets confused about its current data across multiple tabs (e.g. changing cart items in two tabs).'
        },
        {
          question: 'How do you test for Race Conditions?',
          options: [
            { id: 'a', text: 'By seeing who can write the test faster.', isCorrect: false },
            { id: 'b', text: 'By doing two actions at the exact same time to see if the system handles them correctly.', isCorrect: true },
            { id: 'c', text: 'By slowing down your internet speed.', isCorrect: false }
          ],
          explanation: 'A race condition occurs when two operations hit the system at the same time, often causing duplicate data if not locked properly.'
        },
        {
          question: 'Why test "Interrupts" on a mobile app?',
          options: [
            { id: 'a', text: 'To see if the app crashes when a phone call comes in or the battery dies.', isCorrect: true },
            { id: 'b', text: 'To interrupt the developer during coding.', isCorrect: false },
            { id: 'c', text: 'To stop an automated test early.', isCorrect: false }
          ],
          explanation: 'Mobile apps must handle real-world interruptions gracefully (alarms, phone calls, low battery) without losing the user\'s data.'
        }
      ]
    }
  ],
  sql: [
    {
      level: 'basic',
      questions: [
        {
          question: 'What does the SELECT statement do?',
          options: [
            { id: 'a', text: 'It creates a new table.', isCorrect: false },
            { id: 'b', text: 'It deletes data from the database.', isCorrect: false },
            { id: 'c', text: 'It reads or pulls data out of a database.', isCorrect: true }
          ],
          explanation: 'SELECT is how you ask the database to show you information.'
        },
        {
          question: 'What is a WHERE clause used for?',
          options: [
            { id: 'a', text: 'To filter the results so you only get the data you need.', isCorrect: true },
            { id: 'b', text: 'To find out where the database server is located.', isCorrect: false },
            { id: 'c', text: 'To combine two tables together.', isCorrect: false }
          ],
          explanation: 'WHERE filters the data, like asking only for users who are older than 18.'
        },
        {
          question: 'What does the asterisk (*) mean in SELECT *?',
          options: [
            { id: 'a', text: 'It multiplies the numbers in the table.', isCorrect: false },
            { id: 'b', text: 'It tells the database to return ALL columns.', isCorrect: true },
            { id: 'c', text: 'It makes the query run faster.', isCorrect: false }
          ],
          explanation: 'The * is a wildcard that means "give me every single column in this table".'
        }
      ]
    },
    {
      level: 'intermediate',
      questions: [
        {
          question: 'What does a JOIN do?',
          options: [
            { id: 'a', text: 'It combines rows from two or more tables based on a related column.', isCorrect: true },
            { id: 'b', text: 'It adds a new user to the database.', isCorrect: false },
            { id: 'c', text: 'It merges two databases into one.', isCorrect: false }
          ],
          explanation: 'JOIN acts like a bridge, connecting tables (like Users and Orders) using a common ID.'
        },
        {
          question: 'What is the difference between LEFT JOIN and INNER JOIN?',
          options: [
            { id: 'a', text: 'INNER gets only matching rows. LEFT gets all rows from the first table, even if there is no match.', isCorrect: true },
            { id: 'b', text: 'LEFT JOIN is faster than INNER JOIN.', isCorrect: false },
            { id: 'c', text: 'There is no difference.', isCorrect: false }
          ],
          explanation: 'LEFT JOIN keeps everything from the left table. If there is no match on the right, it just shows NULL.'
        },
        {
          question: 'What does GROUP BY do?',
          options: [
            { id: 'a', text: 'It sorts the results alphabetically.', isCorrect: false },
            { id: 'b', text: 'It groups rows that have the same values into summary rows, like finding the total sales per city.', isCorrect: true },
            { id: 'c', text: 'It creates a new group of users.', isCorrect: false }
          ],
          explanation: 'GROUP BY is used with functions like COUNT or SUM to group data together.'
        }
      ]
    },
    {
      level: 'expert',
      questions: [
        {
          question: 'What is a Subquery?',
          options: [
            { id: 'a', text: 'A query nested inside another query.', isCorrect: true },
            { id: 'b', text: 'A query that runs very slowly.', isCorrect: false },
            { id: 'c', text: 'A query that deletes a subset of data.', isCorrect: false }
          ],
          explanation: 'A subquery is a query inside a query. It calculates a value first, which the main query then uses.'
        },
        {
          question: 'What does an INDEX do in a database?',
          options: [
            { id: 'a', text: 'It makes reading data (SELECT) much faster, like an index in a book.', isCorrect: true },
            { id: 'b', text: 'It automatically fixes broken queries.', isCorrect: false },
            { id: 'c', text: 'It deletes old data automatically.', isCorrect: false }
          ],
          explanation: 'An index creates a quick lookup map, so the database does not have to scan every single row.'
        },
        {
          question: 'What is a Transaction in SQL?',
          options: [
            { id: 'a', text: 'Buying a license for the SQL server.', isCorrect: false },
            { id: 'b', text: 'A block of SQL commands that must ALL succeed, or ALL fail together (like transferring money).', isCorrect: true },
            { id: 'c', text: 'A table that records user clicks.', isCorrect: false }
          ],
          explanation: 'Transactions ensure data is not left halfway changed. If an error happens, it rolls back to how it was.'
        }
      ]
    }
  ],
  api: [
    {
      level: 'basic',
      questions: [
        {
          question: 'What is an API?',
          options: [
            { id: 'a', text: 'A programming language.', isCorrect: false },
            { id: 'b', text: 'A waiter that takes your request to the kitchen (server) and brings the food (data) back to you.', isCorrect: true },
            { id: 'c', text: 'A type of database.', isCorrect: false }
          ],
          explanation: 'An Application Programming Interface (API) is the messenger that lets two applications talk to each other.'
        },
        {
          question: 'What does a GET request do?',
          options: [
            { id: 'a', text: 'It asks the server to send data to you.', isCorrect: true },
            { id: 'b', text: 'It deletes data.', isCorrect: false },
            { id: 'c', text: 'It creates new data on the server.', isCorrect: false }
          ],
          explanation: 'GET is just for reading data. It never changes or creates anything on the server.'
        },
        {
          question: 'What does a 200 OK status code mean?',
          options: [
            { id: 'a', text: 'The request failed.', isCorrect: false },
            { id: 'b', text: 'The server is down.', isCorrect: false },
            { id: 'c', text: 'The request was successful and the server did what you asked.', isCorrect: true }
          ],
          explanation: 'A 200-level status code means everything went well.'
        }
      ]
    },
    {
      level: 'intermediate',
      questions: [
        {
          question: 'What is the difference between POST and PUT?',
          options: [
            { id: 'a', text: 'POST reads data, PUT deletes data.', isCorrect: false },
            { id: 'b', text: 'POST creates a brand new item. PUT completely replaces an existing item.', isCorrect: true },
            { id: 'c', text: 'They are exactly the same.', isCorrect: false }
          ],
          explanation: 'Use POST to make a new record. Use PUT to update an entire record that already exists.'
        },
        {
          question: 'What is a JSON Body?',
          options: [
            { id: 'a', text: 'The data package sent with a request (like POST), formatted in a way machines easily read.', isCorrect: true },
            { id: 'b', text: 'A visual part of the website.', isCorrect: false },
            { id: 'c', text: 'The server\'s hardware.', isCorrect: false }
          ],
          explanation: 'JSON (JavaScript Object Notation) is the standard format for sending data packages back and forth in APIs.'
        },
        {
          question: 'What does a 401 Unauthorized status mean?',
          options: [
            { id: 'a', text: 'The URL does not exist.', isCorrect: false },
            { id: 'b', text: 'You need to log in or provide a valid API key to access this.', isCorrect: true },
            { id: 'c', text: 'The server crashed.', isCorrect: false }
          ],
          explanation: '401 means you are missing the secret key or token required to prove who you are.'
        }
      ]
    },
    {
      level: 'expert',
      questions: [
        {
          question: 'What is API Rate Limiting?',
          options: [
            { id: 'a', text: 'Restricting how many requests a user can make in a certain timeframe to prevent crashing the server.', isCorrect: true },
            { id: 'b', text: 'Making the API respond slower on purpose.', isCorrect: false },
            { id: 'c', text: 'Limiting how many letters you can put in a password.', isCorrect: false }
          ],
          explanation: 'Rate limiting protects servers from being overwhelmed by too many requests (like DDoS attacks or bugs).'
        },
        {
          question: 'What is a GraphQL API?',
          options: [
            { id: 'a', text: 'An API where you write SQL queries directly.', isCorrect: false },
            { id: 'b', text: 'An API where the client asks for exactly the fields it wants, getting no extra data.', isCorrect: true },
            { id: 'c', text: 'An API that only returns graphs and charts.', isCorrect: false }
          ],
          explanation: 'Unlike REST which gives you a fixed structure, GraphQL lets the frontend ask for exactly the shape of data it needs.'
        },
        {
          question: 'What does Idempotency mean in APIs?',
          options: [
            { id: 'a', text: 'The API is very fast.', isCorrect: false },
            { id: 'b', text: 'Making the same request over and over will not change the result beyond the first time.', isCorrect: true },
            { id: 'c', text: 'The API can read minds.', isCorrect: false }
          ],
          explanation: 'A PUT request is idempotent: updating a name to "Bob" 5 times is the same as doing it once. A POST is NOT idempotent (it would create 5 Bobs).'
        }
      ]
    }
  ],
  typescript: [
    {
      level: 'data-types',
      questions: [
        {
          question: 'Which keyword creates a variable that CANNOT be changed later?',
          options: [
            { id: 'a', text: 'let', isCorrect: false },
            { id: 'b', text: 'var', isCorrect: false },
            { id: 'c', text: 'const', isCorrect: true }
          ],
          explanation: 'const creates a constant, permanently sealing the digital box so the data cannot be accidentally overwritten.'
        },
        {
          question: 'Why do we need quotes around text like "QA_Ninja"?',
          options: [
            { id: 'a', text: 'To look pretty', isCorrect: false },
            { id: 'b', text: 'To tell the computer it is text, not code', isCorrect: true },
            { id: 'c', text: 'To make it a number', isCorrect: false }
          ],
          explanation: 'Without quotes, the computer thinks QA_Ninja is a variable name or a command, and it will panic and throw an error.'
        },
        {
          question: 'If you try to put a number into a variable labeled as string, what will TypeScript do?',
          options: [
            { id: 'a', text: 'Convert it automatically', isCorrect: false },
            { id: 'b', text: 'Crash the browser', isCorrect: false },
            { id: 'c', text: 'Throw a strict Type Error', isCorrect: true }
          ],
          explanation: 'TypeScript is strict. If you declare a box is strictly for strings, trying to put a number in it will throw a loud error before the code even runs.'
        }
      ]
    },
    {
      level: 'objects-arrays',
      questions: [
        {
          question: 'What symbol is used to create an Array?',
          options: [
            { id: 'a', text: '{ }', isCorrect: false },
            { id: 'b', text: '( )', isCorrect: false },
            { id: 'c', text: '[ ]', isCorrect: true }
          ],
          explanation: 'Square brackets [ ] are the universal symbol for creating a list of items (an Array).'
        },
        {
          question: 'Inside an Object, what symbol separates the Key from the Value?',
          options: [
            { id: 'a', text: '=', isCorrect: false },
            { id: 'b', text: ':', isCorrect: true },
            { id: 'c', text: ';', isCorrect: false }
          ],
          explanation: 'Inside an object, you must use a colon (:) to assign a value to a key, not an equals sign.'
        },
        {
          question: 'If users = ["Alice", "Bob"], what is the index of "Alice"?',
          options: [
            { id: 'a', text: '1', isCorrect: false },
            { id: 'b', text: '0', isCorrect: true },
            { id: 'c', text: '-1', isCorrect: false }
          ],
          explanation: 'Computers always start counting arrays at zero. So the first item is at index 0.'
        }
      ]
    },
    {
      level: 'control-flow',
      questions: [
        {
          question: 'Which operator checks if two things are strictly identical in both Value AND Type?',
          options: [
            { id: 'a', text: '==', isCorrect: false },
            { id: 'b', text: '===', isCorrect: true },
            { id: 'c', text: '=', isCorrect: false }
          ],
          explanation: 'Triple equals (===) enforces strict equality, meaning it prevents confusing bugs where JavaScript thinks "5" and 5 are the same.'
        },
        {
          question: 'What is the purpose of the else block?',
          options: [
            { id: 'a', text: 'To repeat code', isCorrect: false },
            { id: 'b', text: 'It runs only if the if condition is False', isCorrect: true },
            { id: 'c', text: 'It always runs', isCorrect: false }
          ],
          explanation: 'The else block is the backup plan. It executes immediately if the initial if condition evaluates to False.'
        },
        {
          question: 'Why should you always use { } curly braces for an if-statement?',
          options: [
            { id: 'a', text: 'It makes it run faster', isCorrect: false },
            { id: 'b', text: 'It prevents logic bugs when adding more lines of code', isCorrect: true },
            { id: 'c', text: 'TypeScript enforces it', isCorrect: false }
          ],
          explanation: 'While single-line if-statements work without braces, adding a second line later will completely break the logic flow if you forgot the braces.'
        }
      ]
    },
    {
      level: 'loops',
      questions: [
        {
          question: 'What is the danger of writing i-- instead of i++ in a standard loop counting to 5?',
          options: [
            { id: 'a', text: 'It runs backwards', isCorrect: false },
            { id: 'b', text: 'It creates an infinite loop', isCorrect: true },
            { id: 'c', text: 'It crashes the compiler', isCorrect: false }
          ],
          explanation: 'If i starts at 0 and goes down (-1, -2), it will NEVER reach 5, causing the loop to run forever until the computer crashes.'
        },
        {
          question: 'Which loop is cleanest for pulling values directly out of an Array?',
          options: [
            { id: 'a', text: 'for...in', isCorrect: false },
            { id: 'b', text: 'for...of', isCorrect: true },
            { id: 'c', text: 'while', isCorrect: false }
          ],
          explanation: 'The for...of loop elegantly goes through an array from start to finish, handing you the actual values without messy index numbers.'
        },
        {
          question: 'What does the break keyword do?',
          options: [
            { id: 'a', text: 'Pauses the loop', isCorrect: false },
            { id: 'b', text: 'Skips to the next iteration', isCorrect: false },
            { id: 'c', text: 'Violently destroys the loop permanently', isCorrect: true }
          ],
          explanation: 'The break keyword instantly stops the loop completely, ignoring any remaining items.'
        }
      ]
    },
    {
      level: 'functions',
      questions: [
        {
          question: 'What must you add to a function name to actually execute it?',
          options: [
            { id: 'a', text: 'Quotes', isCorrect: false },
            { id: 'b', text: 'Parentheses ()', isCorrect: true },
            { id: 'c', text: 'Semicolon', isCorrect: false }
          ],
          explanation: 'Typing a function name just references the recipe. You must add () to tell the computer to actually cook it!'
        },
        {
          question: 'What is the modern, sleeker way to write a function in Playwright automation?',
          options: [
            { id: 'a', text: 'Arrow Functions () => {}', isCorrect: true },
            { id: 'b', text: 'The function keyword', isCorrect: false },
            { id: 'c', text: 'Classes', isCorrect: false }
          ],
          explanation: 'Arrow functions are less verbose and fix scoping issues, making them the standard for modern TypeScript.'
        },
        {
          question: 'What does the return keyword do?',
          options: [
            { id: 'a', text: 'Goes back a line', isCorrect: false },
            { id: 'b', text: 'Spits the final answer out of the function', isCorrect: true },
            { id: 'c', text: 'Restarts the loop', isCorrect: false }
          ],
          explanation: 'A function calculates a result internally. The return keyword hands that result back to the rest of the program.'
        }
      ]
    },
    {
      level: 'async',
      questions: [
        {
          question: 'What does the await keyword do?',
          options: [
            { id: 'a', text: 'Speeds up the internet', isCorrect: false },
            { id: 'b', text: 'Freezes code execution until the browser finishes its task', isCorrect: true },
            { id: 'c', text: 'Repeats the task', isCorrect: false }
          ],
          explanation: 'Because the internet is slow, await forces our fast code to wait patiently for a button click or page load to completely finish.'
        },
        {
          question: 'What happens if you forget await before navigating to a URL?',
          options: [
            { id: 'a', text: 'Nothing', isCorrect: false },
            { id: 'b', text: 'The script races ahead and tries to click things before the page loads', isCorrect: true },
            { id: 'c', text: 'It waits automatically', isCorrect: false }
          ],
          explanation: 'Without await, the script instantly moves to the next line, trying to interact with a page that has not even downloaded yet.'
        },
        {
          question: 'What must you put in front of a function before you are allowed to use await inside it?',
          options: [
            { id: 'a', text: 'export', isCorrect: false },
            { id: 'b', text: 'const', isCorrect: false },
            { id: 'c', text: 'async', isCorrect: true }
          ],
          explanation: 'You must label the function with async to warn TypeScript that it contains time-delaying code.'
        }
      ]
    },
    {
      level: 'error-handling',
      questions: [
        {
          question: 'What happens when code inside the try block fails?',
          options: [
            { id: 'a', text: 'The test crashes', isCorrect: false },
            { id: 'b', text: 'It immediately teleports into the catch block', isCorrect: true },
            { id: 'c', text: 'It ignores the error', isCorrect: false }
          ],
          explanation: 'The catch block is a safety net. The moment an error occurs, execution jumps straight there to handle the issue gracefully.'
        },
        {
          question: 'What does the finally block do?',
          options: [
            { id: 'a', text: 'Runs ONLY if the test passes', isCorrect: false },
            { id: 'b', text: 'Runs ALWAYS, no matter if the test passed or failed', isCorrect: true },
            { id: 'c', text: 'Retries the test', isCorrect: false }
          ],
          explanation: 'The finally block is guaranteed to run at the very end, making it the perfect place to close browsers or clean up data.'
        },
        {
          question: 'Why shouldn\'t you wrap your entire 100-line test in one massive try/catch block?',
          options: [
            { id: 'a', text: 'It hides the exact line that failed', isCorrect: true },
            { id: 'b', text: 'TypeScript forbids it', isCorrect: false },
            { id: 'c', text: 'It is too slow', isCorrect: false }
          ],
          explanation: 'If a massive block fails, it is incredibly difficult to debug exactly which of the 100 lines caused the crash.'
        }
      ]
    },
    {
      level: 'oop',
      questions: [
        {
          question: 'What is the difference between a Class and an Instance?',
          options: [
            { id: 'a', text: 'A class is the paper blueprint; an instance is the physical house built from it', isCorrect: true },
            { id: 'b', text: 'They are the same', isCorrect: false },
            { id: 'c', text: 'Class is for functions, instance is for variables', isCorrect: false }
          ],
          explanation: 'You define the structure once in a Class, and then use the new keyword to create many physical Instances of it.'
        },
        {
          question: 'What does the this keyword do inside a Class?',
          options: [
            { id: 'a', text: 'Points to the browser', isCorrect: false },
            { id: 'b', text: 'Tells the class to look inside itself for a property', isCorrect: true },
            { id: 'c', text: 'Restarts the class', isCorrect: false }
          ],
          explanation: 'Typing this.url ensures the class is using its own internal url variable, not a random global variable.'
        },
        {
          question: 'What happens if you mark a class property as private?',
          options: [
            { id: 'a', text: 'It hides it from the UI', isCorrect: false },
            { id: 'b', text: 'It prevents any outside code from seeing or changing it', isCorrect: true },
            { id: 'c', text: 'It encrypts it', isCorrect: false }
          ],
          explanation: 'Private properties enforce strict security, stopping junior developers from accidentally overwriting crucial internal data.'
        }
      ]
    },
    {
      level: 'modules',
      questions: [
        {
          question: 'Why do we split code into multiple files (Modules)?',
          options: [
            { id: 'a', text: 'Because TypeScript requires it', isCorrect: false },
            { id: 'b', text: 'To keep code organized and prevent 5,000-line files', isCorrect: true },
            { id: 'c', text: 'To hide code', isCorrect: false }
          ],
          explanation: 'Modules keep code incredibly organized. You put the Login Page logic in one file, and the Dashboard logic in another.'
        },
        {
          question: 'What keyword unlocks a class so other files can use it?',
          options: [
            { id: 'a', text: 'public', isCorrect: false },
            { id: 'b', text: 'export', isCorrect: true },
            { id: 'c', text: 'share', isCorrect: false }
          ],
          explanation: 'The export keyword explicitly tells TypeScript that it is okay for other files to borrow this code.'
        },
        {
          question: 'When importing a local file, what must you include in the path?',
          options: [
            { id: 'a', text: 'The .js extension', isCorrect: false },
            { id: 'b', text: 'A relative prefix like ./', isCorrect: true },
            { id: 'c', text: 'http://', isCorrect: false }
          ],
          explanation: 'Without ./, TypeScript thinks you are trying to import a massive downloaded library from the internet, not your own local file.'
        }
      ]
    },
    {
      level: 'template-literals',
      questions: [
        {
          question: 'What character is used to create a Template Literal?',
          options: [
            { id: 'a', text: 'Single quotes \' \'', isCorrect: false },
            { id: 'b', text: 'Double quotes " "', isCorrect: false },
            { id: 'c', text: 'Backticks \` \`', isCorrect: true }
          ],
          explanation: 'Backticks (usually next to the 1 key) are required to activate template literals and string interpolation.'
        },
        {
          question: 'How do you inject a variable named userId into a template literal?',
          options: [
            { id: 'a', text: '+ userId +', isCorrect: false },
            { id: 'b', text: '\${userId}', isCorrect: true },
            { id: 'c', text: '{{userId}}', isCorrect: false }
          ],
          explanation: 'The dollar sign and curly braces act as a portal, instantly inserting the variable value directly into the text.'
        },
        {
          question: 'What happens if you use \${userId} inside normal double quotes (" ")?',
          options: [
            { id: 'a', text: 'It literally prints the characters "\${userId}" to the screen as plain text', isCorrect: true },
            { id: 'b', text: 'It works perfectly', isCorrect: false },
            { id: 'c', text: 'It crashes the compiler', isCorrect: false }
          ],
          explanation: 'Normal quotes do not understand interpolation. They treat the dollar sign and curly braces as literal characters.'
        }
      ]
    },
    {
      level: 'destructuring',
      questions: [
        {
          question: 'What is Object Destructuring used for?',
          options: [
            { id: 'a', text: 'To securely encrypt an object', isCorrect: false },
            { id: 'b', text: 'To delete an object from memory', isCorrect: false },
            { id: 'c', text: 'To extract specific properties from an object and instantly turn them into standalone variables', isCorrect: true }
          ],
          explanation: 'Destructuring saves you from typing user.name, user.age, and user.email individually by extracting them all in one clean line.'
        },
        {
          question: 'Why does Playwright use the syntax: test("name", async ({ page }) => { ... }) ?',
          options: [
            { id: 'a', text: 'It is a special Playwright command', isCorrect: false },
            { id: 'b', text: 'It is Destructuring. It extracts the \'page\' tool out of the massive test context object.', isCorrect: true },
            { id: 'c', text: 'It is a typo', isCorrect: false }
          ],
          explanation: 'Playwright hands the function a massive object full of 50+ tools. Using { page } instantly extracts just the browser tool we actually need.'
        },
        {
          question: 'Why is the "any" keyword dangerous in TypeScript?',
          options: [
            { id: 'a', text: 'It completely disables TypeScripts safety net, allowing catastrophic bugs to compile without warnings.', isCorrect: true },
            { id: 'b', text: 'It runs too slowly', isCorrect: false },
            { id: 'c', text: 'It is not dangerous, you should use it constantly', isCorrect: false }
          ],
          explanation: 'Using any turns TypeScript back into regular JavaScript. You lose all autocomplete, strictness, and crash prevention.'
        }
      ]
    },
    {
      level: 'ts-types',
      questions: [
        {
          question: 'What does an Interface do?',
          options: [
            { id: 'a', text: 'Draws the UI', isCorrect: false },
            { id: 'b', text: 'Creates a strict, unbreakable rule for exactly what properties an object must have', isCorrect: true },
            { id: 'c', text: 'Encrypts passwords', isCorrect: false }
          ],
          explanation: 'An Interface acts like a factory blueprint, instantly rejecting any object that is missing a required property or has the wrong data type.'
        },
        {
          question: 'What does putting a question mark (?) after an interface property do?',
          options: [
            { id: 'a', text: 'Deletes the property', isCorrect: false },
            { id: 'b', text: 'Makes the property Optional', isCorrect: true },
            { id: 'c', text: 'Triggers an error', isCorrect: false }
          ],
          explanation: 'The ? tells TypeScript that the object is perfectly valid even if it completely leaves that property out.'
        },
        {
          question: 'Why are Enums safer than raw text strings?',
          options: [
            { id: 'a', text: 'They run faster', isCorrect: false },
            { id: 'b', text: 'They prevent spelling typos by forcing you to choose from a strict list', isCorrect: true },
            { id: 'c', text: 'They are shorter', isCorrect: false }
          ],
          explanation: 'If a status must be "PENDING", an Enum stops a developer from accidentally typing "PENDINGG" and crashing the database.'
        }
      ]
    }
  ],
  playwright: [
    {
      level: 'basic',
      questions: [
        {
          question: 'What is Playwright?',
          options: [
            { id: 'a', text: 'A tool that writes tests for you.', isCorrect: false },
            { id: 'b', text: 'A library that lets code take control of a web browser to automate clicks and typing.', isCorrect: true },
            { id: 'c', text: 'A framework for building websites.', isCorrect: false }
          ],
          explanation: 'Playwright acts like a robot user, opening Chrome or Firefox and clicking through your app.'
        },
        {
          question: 'What is a Locator?',
          options: [
            { id: 'a', text: 'A way to find specific elements (like buttons or inputs) on a webpage.', isCorrect: true },
            { id: 'b', text: 'A GPS map for your code.', isCorrect: false },
            { id: 'c', text: 'A function that finds lost files.', isCorrect: false }
          ],
          explanation: 'Locators tell Playwright exactly what to interact with, e.g., page.getByRole("button").'
        },
        {
          question: 'What does page.goto() do?',
          options: [
            { id: 'a', text: 'It closes the browser.', isCorrect: false },
            { id: 'b', text: 'It navigates the automated browser to a specific URL.', isCorrect: true },
            { id: 'c', text: 'It clicks the "Go" button.', isCorrect: false }
          ],
          explanation: 'page.goto() is always the first step, telling the browser which website to open.'
        }
      ]
    },
    {
      level: 'intermediate',
      questions: [
        {
          question: 'Why does Playwright use "await"?',
          options: [
            { id: 'a', text: 'To make the test run slower on purpose.', isCorrect: false },
            { id: 'b', text: 'Because browser actions take time (like waiting for a page to load), and the code must wait for them to finish.', isCorrect: true },
            { id: 'c', text: 'Because it is a polite framework.', isCorrect: false }
          ],
          explanation: 'Playwright is asynchronous. "await" stops the code from running ahead before the webpage has actually reacted.'
        },
        {
          question: 'What is an Assertion (expect)?',
          options: [
            { id: 'a', text: 'A check that proves the app is in the correct state (e.g. verifying a success message appeared).', isCorrect: true },
            { id: 'b', text: 'A forceful click on a button.', isCorrect: false },
            { id: 'c', text: 'A way to start the test.', isCorrect: false }
          ],
          explanation: 'Without assertions, your test only clicks things. Assertions are the actual "test" part that proves things worked.'
        },
        {
          question: 'Why are CSS selectors considered fragile?',
          options: [
            { id: 'a', text: 'They are made of glass.', isCorrect: false },
            { id: 'b', text: 'Because developers often change class names for styling, which breaks the test.', isCorrect: true },
            { id: 'c', text: 'They only work on Safari.', isCorrect: false }
          ],
          explanation: 'It is better to test by user-visible text (getByText) or roles (getByRole) than invisible CSS classes.'
        }
      ]
    },
    {
      level: 'expert',
      questions: [
        {
          question: 'What is Auto-Waiting in Playwright?',
          options: [
            { id: 'a', text: 'The tool automatically waits for elements to be visible and clickable before acting, reducing flaky tests.', isCorrect: true },
            { id: 'b', text: 'A command you type to pause the test for 5 seconds.', isCorrect: false },
            { id: 'c', text: 'Waiting for the developer to fix the code.', isCorrect: false }
          ],
          explanation: 'Older tools required you to write "sleep(5000)". Playwright automatically polls the page until the button is ready.'
        },
        {
          question: 'What is API Mocking during a UI test?',
          options: [
            { id: 'a', text: 'Making fun of the backend developers.', isCorrect: false },
            { id: 'b', text: 'Intercepting network requests and faking the response, so you can test the UI without a real backend.', isCorrect: true },
            { id: 'c', text: 'Sending fake clicks to the screen.', isCorrect: false }
          ],
          explanation: 'Mocking lets you test what the UI does when the API returns an error, without actually breaking the real API.'
        },
        {
          question: 'What is the Page Object Model (POM)?',
          options: [
            { id: 'a', text: 'A way to design tests where page locators are stored in one central class file, making updates easy.', isCorrect: true },
            { id: 'b', text: 'A fashion show for websites.', isCorrect: false },
            { id: 'c', text: 'A database structure.', isCorrect: false }
          ],
          explanation: 'If a login button changes, POM means you only fix the locator in one file, instead of updating 50 different test files.'
        }
      ]
    }
  ],
  'ai-qa': [
    {
      level: 'basic',
      questions: [
        {
          question: 'What is an AI Prompt?',
          options: [
            { id: 'a', text: 'The instructions or question you give the AI to get it to do what you want.', isCorrect: true },
            { id: 'b', text: 'A timer that limits how long the AI thinks.', isCorrect: false },
            { id: 'c', text: 'The server the AI runs on.', isCorrect: false }
          ],
          explanation: 'A prompt is just the text you type. Good prompts equal good AI results.'
        },
        {
          question: 'Can AI completely replace Manual Testers?',
          options: [
            { id: 'a', text: 'Yes, it can test everything.', isCorrect: false },
            { id: 'b', text: 'No, AI lacks human empathy, intuition, and real-world context.', isCorrect: true },
            { id: 'c', text: 'Yes, but only on Tuesdays.', isCorrect: false }
          ],
          explanation: 'AI is a tool to make you faster, but it does not know what a "frustrating" user experience feels like.'
        },
        {
          question: 'What is a Hallucination?',
          options: [
            { id: 'a', text: 'When the AI makes up a confident-sounding answer that is completely wrong or fake.', isCorrect: true },
            { id: 'b', text: 'When the AI writes good code.', isCorrect: false },
            { id: 'c', text: 'When the website is displaying correctly.', isCorrect: false }
          ],
          explanation: 'AI tries to predict the next word. Sometimes it predicts a totally fake library or method because it sounds right.'
        }
      ]
    },
    {
      level: 'intermediate',
      questions: [
        {
          question: 'What is Zero-Shot Prompting?',
          options: [
            { id: 'a', text: 'Asking the AI a question without giving it any examples of the expected output.', isCorrect: true },
            { id: 'b', text: 'Giving the AI 10 examples before asking the question.', isCorrect: false },
            { id: 'c', text: 'Asking the AI to do nothing.', isCorrect: false }
          ],
          explanation: 'Zero-shot means you just ask "Write a test case." Few-shot means you give an example: "Here is a test case. Write another one like it."'
        },
        {
          question: 'Why give AI a "Persona"?',
          options: [
            { id: 'a', text: 'Telling it "Act as an Expert QA Engineer" shapes the tone and depth of its answers.', isCorrect: true },
            { id: 'b', text: 'To make it feel happy.', isCorrect: false },
            { id: 'c', text: 'It does not change anything.', isCorrect: false }
          ],
          explanation: 'Personas act as filters, forcing the AI to draw from its knowledge base related to that specific profession.'
        },
        {
          question: 'What is the best way to use AI to generate test data?',
          options: [
            { id: 'a', text: 'Ask it to write a Python script or JSON block with 50 fake user profiles.', isCorrect: true },
            { id: 'b', text: 'Ask it to steal real user data.', isCorrect: false },
            { id: 'c', text: 'Ask it to read your database.', isCorrect: false }
          ],
          explanation: 'AI is amazing at quickly generating vast amounts of syntactically correct mock data (JSON, CSV).'
        }
      ]
    },
    {
      level: 'expert',
      questions: [
        {
          question: 'What is Self-Healing Test Automation?',
          options: [
            { id: 'a', text: 'When an AI tool notices a locator changed, and automatically finds the new locator without failing the test.', isCorrect: true },
            { id: 'b', text: 'When the test deletes itself.', isCorrect: false },
            { id: 'c', text: 'When the AI writes code that fixes bugs in the source code.', isCorrect: false }
          ],
          explanation: 'Self-healing tools use AI to look at the DOM tree and realize "The button ID changed, but it is still the Submit button."'
        },
        {
          question: 'What is Chain of Thought prompting?',
          options: [
            { id: 'a', text: 'Forcing the AI to explain its reasoning step-by-step before giving the final answer.', isCorrect: true },
            { id: 'b', text: 'Giving the AI a chain of emails.', isCorrect: false },
            { id: 'c', text: 'A prompt that never ends.', isCorrect: false }
          ],
          explanation: 'Asking the AI to "think step by step" reduces hallucinations and leads to far more accurate complex logical answers.'
        },
        {
          question: 'Why should you NOT paste proprietary source code into public AI tools?',
          options: [
            { id: 'a', text: 'Because it uses up too many tokens.', isCorrect: false },
            { id: 'b', text: 'Because the data might be used to train future models, leaking your company secrets.', isCorrect: true },
            { id: 'c', text: 'Because the AI cannot read source code.', isCorrect: false }
          ],
          explanation: 'Security is paramount. Never paste API keys, customer data, or secret algorithms into public AI chat windows.'
        }
      ]
    }
  ]
};
