import os
import json

raw_content = r""",
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
      }"""

with open('src/data/analogies.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = "id: 'destructuring',"
target_index = content.find(target)

if target_index != -1:
    end_index = content.find("      }", target_index)
    if end_index != -1:
        insert_index = end_index + 7
        new_content = content[:insert_index] + raw_content + content[insert_index:]
        with open('src/data/analogies.ts', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success! Injected Tier 2 Analogies into analogies.ts")
    else:
        print("Failed to find end brace")
else:
    print("Failed to find target")
