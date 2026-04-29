const fs = require('fs');

const tier2Quizzes = `,
    {
      level: 'type-aliases',
      questions: [
        {
          question: 'What is the primary benefit of a Union Type ("qa" | "staging" | "prod") over a standard string?',
          options: [
            { id: 'a', text: 'It runs faster in the browser', isCorrect: false },
            { id: 'b', text: 'It strictly limits the variable to exact values, preventing typos like "stagingg" from compiling', isCorrect: true },
            { id: 'c', text: 'It automatically encrypts the string data', isCorrect: false }
          ],
          explanation: 'Union types act as an exclusive club, enforcing strict equality to predefined values at compile-time.'
        },
        {
          question: 'Which keyword CANNOT be used to create Union Types?',
          options: [
            { id: 'a', text: 'type', isCorrect: false },
            { id: 'b', text: 'interface', isCorrect: true },
            { id: 'c', text: 'enum', isCorrect: false }
          ],
          explanation: 'Interfaces are strictly used for defining the shape of objects. To create Unions (e.g., A | B), you must use a Type Alias (type).'
        },
        {
          question: 'What does a Type Alias actually do in memory?',
          options: [
            { id: 'a', text: 'It creates a new JavaScript object in the database', isCorrect: false },
            { id: 'b', text: 'It generates a massive array', isCorrect: false },
            { id: 'c', text: 'Nothing. It only exists at compile-time as a blueprint/nickname for TypeScript to check against.', isCorrect: true }
          ],
          explanation: 'Type Aliases compile away to absolutely nothing. They are purely blueprints for your developer experience.'
        }
      ]
    },
    {
      level: 'type-narrowing',
      questions: [
        {
          question: 'What does Type Narrowing do?',
          options: [
            { id: 'a', text: 'Reduces the file size of your codebase', isCorrect: false },
            { id: 'b', text: 'Uses logic (like if-statements) to prove a variables specific type to the TS compiler', isCorrect: true },
            { id: 'c', text: 'Deletes variables that are too large', isCorrect: false }
          ],
          explanation: 'Narrowing is the act of guiding TypeScript through logic to safely lock down an ambiguous type into a specific one.'
        },
        {
          question: 'Why does "typeof null" return "object" in JavaScript?',
          options: [
            { id: 'a', text: 'Because of a historical bug in early JavaScript that cannot be fixed', isCorrect: true },
            { id: 'b', text: 'Because null is actually a complex Object class', isCorrect: false },
            { id: 'c', text: 'Because null stores data arrays', isCorrect: false }
          ],
          explanation: 'This is a famous JS bug. You must explicitly check "if (data !== null)" because checking "typeof data === object" will let null slip through!'
        },
        {
          question: 'If an element can be an Input OR a Dropdown, how do you narrow it down?',
          options: [
            { id: 'a', text: 'Use the "in" operator to check if a unique property (like "clear") exists on the object', isCorrect: true },
            { id: 'b', text: 'Use any to force it', isCorrect: false },
            { id: 'c', text: 'Use the + operator', isCorrect: false }
          ],
          explanation: 'The "in" operator acts as a type guard for objects, narrowing down Unions based on the existence of specific keys.'
        }
      ]
    },
    {
      level: 'generics',
      questions: [
        {
          question: 'What is the best real-world analogy for a Generic <T>?',
          options: [
            { id: 'a', text: 'A locked safe', isCorrect: false },
            { id: 'b', text: 'A blank shipping box that reshapes itself based on the label you slap on it', isCorrect: true },
            { id: 'c', text: 'A pre-cooked meal', isCorrect: false }
          ],
          explanation: 'Generics are placeholders. The code inside the box is reusable, and it dynamically adapts to whatever Type label you assign it.'
        },
        {
          question: 'Why are Generics crucial for API Fetch calls in test automation?',
          options: [
            { id: 'a', text: 'They make the API call execute faster', isCorrect: false },
            { id: 'b', text: 'They allow you to strictly type the unknown JSON response so you get full autocomplete on the returned data', isCorrect: true },
            { id: 'c', text: 'They automatically bypass authentication', isCorrect: false }
          ],
          explanation: 'fetch() natively returns "any". By using generics like fetchApi<UserData>(), you force TypeScript to understand the exact shape of the response.'
        },
        {
          question: 'What is the danger of using "any" instead of a Generic?',
          options: [
            { id: 'a', text: 'any preserves types perfectly', isCorrect: false },
            { id: 'b', text: 'any disables autocomplete and compiler checks completely, while Generics strictly preserve the type throughout the function', isCorrect: true },
            { id: 'c', text: 'any causes syntax errors immediately', isCorrect: false }
          ],
          explanation: 'If a function takes "any" and returns "any", TypeScript forgets what the data was. Generics preserve the exact type identity.'
        }
      ]
    },
    {
      level: 'utility-types',
      questions: [
        {
          question: 'What does the Partial<T> utility type do?',
          options: [
            { id: 'a', text: 'Deletes half of the object properties randomly', isCorrect: false },
            { id: 'b', text: 'Makes every property in the type optional (adds a ? to everything)', isCorrect: true },
            { id: 'c', text: 'Makes every property strictly required', isCorrect: false }
          ],
          explanation: 'Partial is heavily used for "Update" API payloads where you only want to send 1 or 2 fields from a massive User model.'
        },
        {
          question: 'Which utility type should you use to "Laminate" a global test config object so nobody can mutate it?',
          options: [
            { id: 'a', text: 'Omit<>', isCorrect: false },
            { id: 'b', text: 'Pick<>', isCorrect: false },
            { id: 'c', text: 'Readonly<>', isCorrect: true }
          ],
          explanation: 'Readonly<> forces every property to be read-only, throwing a compiler error if a test tries to overwrite global configuration state.'
        },
        {
          question: 'If you have a massive User object but only want to extract the "email" and "password" types for a login test, what do you use?',
          options: [
            { id: 'a', text: 'Pick<User, "email" | "password">', isCorrect: true },
            { id: 'b', text: 'Omit<User>', isCorrect: false },
            { id: 'c', text: 'Partial<User>', isCorrect: false }
          ],
          explanation: 'Pick acts as a crop tool, creating a brand new strict type using only the specific keys you requested from the original interface.'
        }
      ]
    },
    {
      level: 'null-safety',
      questions: [
        {
          question: 'What does the Optional Chaining operator (?.) do?',
          options: [
            { id: 'a', text: 'It creates a random question mark on the UI', isCorrect: false },
            { id: 'b', text: 'It safely stops and returns undefined if an object is null, preventing a catastrophic crash', isCorrect: true },
            { id: 'c', text: 'It loops over an array', isCorrect: false }
          ],
          explanation: 'Optional chaining acts as a bomb disposal robot. It navigates deep into an object and aborts safely if a nested property is missing.'
        },
        {
          question: 'What is the primary difference between Nullish Coalescing (??) and the logical OR (||)?',
          options: [
            { id: 'a', text: 'There is no difference', isCorrect: false },
            { id: 'b', text: '|| fails on ANY falsy value (like 0 or empty string ""). ?? ONLY falls back if the value is strictly null or undefined.', isCorrect: true },
            { id: 'c', text: '?? is used for addition', isCorrect: false }
          ],
          explanation: 'If a user has an empty string for a middle name (""), || will replace it with a fallback. ?? respects the empty string and leaves it alone.'
        },
        {
          question: 'Why is the Non-Null Assertion operator (!) dangerous?',
          options: [
            { id: 'a', text: 'Because it tells TypeScript "I promise this exists", which will crash your test violently if you are wrong.', isCorrect: true },
            { id: 'b', text: 'Because it makes the code run too slowly', isCorrect: false },
            { id: 'c', text: 'It is completely safe and recommended everywhere', isCorrect: false }
          ],
          explanation: 'Using ! removes the safety net. If a DOM element fails to render and you use button!.click(), your test explodes instead of failing gracefully.'
        }
      ]
    }`;

let qContent = fs.readFileSync('src/data/quizzes.ts', 'utf8');

const qTargetIndex = qContent.indexOf("level: 'destructuring',");
if (qTargetIndex > -1) {
    const endDestructuringQ = qContent.indexOf("    }", qTargetIndex);
    if (endDestructuringQ > -1) {
        const insertPosition = endDestructuringQ + 5;
        qContent = qContent.substring(0, insertPosition) + tier2Quizzes + qContent.substring(insertPosition);
        fs.writeFileSync('src/data/quizzes.ts', qContent, 'utf8');
        console.log("Successfully appended Tier 2 quizzes to quizzes.ts");
    } else {
        console.log("Could not find end brace for destructuring in quizzes.ts");
    }
} else {
    console.log("Could not find destructuring block in quizzes.ts");
}
