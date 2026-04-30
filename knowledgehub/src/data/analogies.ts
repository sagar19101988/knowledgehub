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

      // ─── BEGINNER ───────────────────────────────────────────────────────────

      {
        id: 'what-is-testing',
        title: 'Beginner: What is Software Testing?',
        analogy: "Software testing is like being a professional food taster before the dish goes to the king. Your job is to find anything wrong before it poisons someone important.",
        lessonMarkdown: `
## What is Software Testing?

Software testing is the process of **evaluating a software application to find defects** and verify that it behaves exactly as expected. It is not about "breaking things for fun" — it is about ensuring that real users get a reliable, correct experience.

### 1. Why Software Breaks

Software is written by humans, and humans make mistakes. These mistakes can be:

- **Logic errors** — The code does something, just not the right thing. E.g., a discount applies to ALL users, not just premium ones.
- **Missing requirements** — The developer forgot a rule. E.g., the form accepts negative ages.
- **Integration bugs** — Two systems talk to each other incorrectly. E.g., the payment gateway sends a success signal but the order system never receives it.
- **Environmental bugs** — Works on the developer's laptop but breaks in production.

**Real Example:**

In 1996, the Ariane 5 rocket exploded 37 seconds after launch. The cause? A piece of software originally written for Ariane 4 was reused without re-testing it against the new rocket's higher speed. A number conversion overflowed. Cost: $370 million. One untested edge case.

*💡 Analogy: Software breaks for the same reason IKEA furniture wobbles — someone skipped a step in the instructions and assumed it would be fine.*

---

### 2. The QA Mindset vs The Dev Mindset

Developers think: *"How do I build this so it works?"*

Testers think: *"How can I prove this doesn't work?"*

This is not adversarial — it is complementary. A developer who tests their own code will subconsciously avoid the paths they didn't build. A tester approaches it like a stranger who has never seen the app before.

**Key qualities of a great tester:**
- **Curiosity** — always asking "what if I do THIS?"
- **Scepticism** — never assuming the code is correct until proven
- **Empathy** — thinking like a real user, not a developer

*💡 Analogy: A chef who cooks the meal and then also judges it will always say it tastes fine. You need a separate person whose only job is to be brutally honest.*

---

### 3. The Cost of Finding Bugs Late

The later a bug is found, the more expensive it is to fix. This is known as the **Rule of Ten**:

| When Bug is Found | Relative Cost to Fix |
|---|---|
| During requirements | ×1 (cheapest) |
| During design | ×5 |
| During coding | ×10 |
| During testing | ×20 |
| After release (production) | ×100+ |

**Real Example:**

A startup launches a mobile banking app. After 3 weeks in production, users discover they can transfer more money than their balance because the validation was only on the frontend — the API had no server-side check. Fixing it requires a hotfix deployment, a security audit, notifying regulators, and compensating affected users. A 10-minute code review would have caught it.

*💡 Analogy: Finding a crack in a house foundation during construction costs £500 to fix. Finding it after the family has moved in costs £50,000 and involves structural engineers, temporary housing, and a lawsuit.*
        `
      },

      {
        id: 'types-of-testing',
        title: 'Beginner: Types of Testing',
        analogy: "Types of testing are like different tools in a toolbox. A hammer, screwdriver, and wrench all serve different purposes — you wouldn't use a hammer to tighten a bolt.",
        lessonMarkdown: `
## Types of Testing

Not all testing is the same. Different types of testing serve different purposes, and a professional QA engineer needs to know which weapon to pick for which battle.

### 1. Functional vs Non-Functional Testing

**Functional Testing** checks WHAT the software does — does it meet the requirements?

Examples:
- Does clicking "Submit" save the form?
- Does the login page reject wrong passwords?
- Does the search return relevant results?

**Non-Functional Testing** checks HOW WELL the software does it.

| Non-Functional Type | What it Checks | Example |
|---|---|---|
| Performance | Speed under load | Can 10,000 users login simultaneously? |
| Security | Resistance to attacks | Can a user access another user's data? |
| Usability | Ease of use | Can a first-time user find the checkout button? |
| Compatibility | Works on different devices/browsers | Does it look right on Safari? |
| Reliability | Stays stable over time | Does it crash after running for 24 hours? |

*💡 Analogy: Functional testing checks if a car DRIVES. Non-functional testing checks if it drives FAST ENOUGH, SAFELY ENOUGH, and is COMFORTABLE ENOUGH for a 6-hour road trip.*

---

### 2. Black Box, White Box, and Grey Box Testing

These describe HOW MUCH you know about the system's internals when testing.

**Black Box Testing** — You see only the input and output. You have no idea what the code looks like inside. You test as a real user would.

- ✅ No coding knowledge required
- ✅ Tests what users actually experience
- ❌ Cannot test internal logic directly

**Real Example:** You test a login form by entering email/password and checking if you log in. You never look at the database query behind it.

**White Box Testing** — You see ALL the code. You write tests targeting specific lines, branches, and conditions inside the code.

- ✅ Can achieve very high code coverage
- ✅ Can find hidden logic bugs
- ❌ Requires strong programming knowledge

**Grey Box Testing** — You have PARTIAL knowledge. You know the high-level architecture and APIs but not the exact code. Most professional manual QA sits here.

*💡 Analogy: Black box = ordering food at a restaurant. White box = being the chef who knows every ingredient. Grey box = being a food critic who knows the menu, the kitchen layout, but not the exact recipe.*

---

### 3. Manual vs Automated Testing

**Manual Testing** — A human tester interacts with the app directly and checks results with their own eyes and judgment.

✅ Best for: Exploratory testing, UX feedback, one-off tests, visual checks
❌ Slow, prone to human error on repetitive tasks

**Automated Testing** — Code (scripts) clicks buttons, fills forms, and checks results automatically.

✅ Best for: Regression testing, repetitive checks, CI/CD pipelines
❌ Takes time to build, brittle if UI changes frequently

**Real Example:** A banking app has 200 screens. Testing login manually takes 2 minutes. Testing all 200 screens manually after every release takes 3 days. An automated suite can do it in 15 minutes overnight.

*💡 Analogy: Manual testing is hand-washing your dishes. Automation is buying a dishwasher. The dishwasher is faster for the regular load, but you still hand-wash your grandmother's antique china.*
        `
      },

      {
        id: 'writing-test-cases',
        title: 'Beginner: Writing Test Cases',
        analogy: "A test case is like a recipe. If you write 'add some flour', you'll get a different cake every time. You need to write 'add exactly 200g of plain flour, sifted' to get consistent, repeatable results.",
        lessonMarkdown: `
## Writing Test Cases

A test case is a **documented set of conditions and steps** that tell you exactly what to do, what data to use, and what result to expect. Without test cases, testing is guesswork.

### 1. Anatomy of a Test Case

Every professional test case contains these fields:

| Field | Description | Example |
|---|---|---|
| **Test Case ID** | Unique identifier | TC-LOGIN-001 |
| **Title** | What it tests | Verify login with valid credentials |
| **Preconditions** | What must be true before starting | User must be registered with email: test@qa.com |
| **Test Steps** | Numbered, specific actions | 1. Go to /login  2. Enter email  3. Enter password  4. Click Submit |
| **Test Data** | Exact values to use | Email: test@qa.com, Password: Test@1234 |
| **Expected Result** | What SHOULD happen | User is redirected to dashboard, greeting shows "Hello, Test User" |
| **Actual Result** | What DID happen (filled after execution) | ✅ Pass / ❌ Fail + description |
| **Priority** | P1 / P2 / P3 | P1 — Critical path |

---

### 2. Good Test Cases vs Bad Test Cases

**❌ Bad Test Case:**
> "Login with correct details and check it works"

This is useless. What "correct details"? How do you know "it works"?

**✅ Good Test Case:**
> **TC-LOGIN-001:** Verify successful login with registered email and password
> Steps: 1) Navigate to https://app.com/login  2) Enter email "user@test.com"  3) Enter password "ValidPass@123"  4) Click the "Sign In" button
> Expected: Browser redirects to /dashboard. Page title is "Dashboard". User's name "John" appears in the top right corner.

**Why the detail matters:** If a bug exists and different testers run the same case with different data, one might pass and one fail — and you'll never know why.

*💡 Analogy: "Drive to the supermarket and get food" vs "Drive to Tesco on Main Street, park on Level 2, buy 2 litres of semi-skimmed milk (blue cap), and be back by 3pm." Only one of these will reliably get you milk.*

---

### 3. Test Case Coverage — Don't Just Test the Obvious

For a single "Login" feature, a complete test case suite should cover:

\`\`\`
✅ TC-001: Valid email + valid password → Success
❌ TC-002: Valid email + wrong password → Error message shown
❌ TC-003: Unregistered email → Error message shown
❌ TC-004: Empty email field → Validation message
❌ TC-005: Empty password field → Validation message
❌ TC-006: Both fields empty → Validation message
⚠️  TC-007: Email with spaces "  user@test.com  " → Should trim and succeed
⚠️  TC-008: SQL injection in email field → Should be rejected safely
⚠️  TC-009: Password with 100 characters → Should work or show proper limit message
🔒 TC-010: After 5 failed attempts → Account should lock
\`\`\`

Notice how TC-001 is just the beginning. Real testing is everything else.

*💡 Analogy: A doctor doesn't just check if your heart is beating. They check your blood pressure, cholesterol, oxygen levels, and ask if you get chest pain when climbing stairs. A heartbeat alone doesn't mean you're healthy.*
        `
      },

      {
        id: 'happy-path',
        title: 'Beginner: The Happy Path',
        analogy: "The Happy Path is the smooth, paved highway where everything goes perfectly right. No traffic, perfectly sunny, driving exactly the speed limit — exactly how the road was designed to be used.",
        lessonMarkdown: `
## The Happy Path

The Happy Path is the **default, correct, intended flow** through your application — the path a user takes when they do everything right, in the right order, with the right data.

### 1. What is the Happy Path?

It is the sequence of actions a developer designed the system to handle. No surprises, no mistakes, no edge cases. Just the core intended workflow from start to finish.

**Real Example — E-commerce Checkout Happy Path:**

\`\`\`
1. User browses products
2. Clicks "Add to Cart" on a product
3. Clicks the cart icon
4. Reviews items and clicks "Proceed to Checkout"
5. Enters shipping address
6. Enters valid credit card number
7. Clicks "Place Order"
8. Sees "Order Confirmed" screen with order number
\`\`\`

Every single step here assumes the user does the right thing. No expired cards. No out-of-stock items. No address validation failures.

*💡 Analogy: The Happy Path is the demo your sales team shows to potential clients in a perfectly controlled environment. It always works. It is not what real users actually do.*

---

### 2. Why You MUST Test the Happy Path First

If the core intended functionality is broken, there is zero point testing edge cases. You don't test whether a car's cup holder survives a crash if the engine doesn't start.

**Rule of thumb:** If the Happy Path fails, file a **P1 blocker bug** and stop testing until it is fixed.

**Real Example:**

A tester joins a project and immediately starts testing edge cases — what happens if a user submits the registration form with a duplicate email? They spend 2 hours on this. Later they discover the entire registration form crashes on the first click of "Submit" regardless of what you type. All those edge case tests were completely wasted effort.

*💡 Analogy: Don't test whether the fire exits are clearly labelled in a building that is actively on fire and has no front door.*

---

### 3. The Happy Path is Not Enough

Once the Happy Path passes, your job has barely started. The Happy Path represents maybe 10% of what users will actually do. Real users:

- Leave forms half-filled and come back
- Use the browser back button instead of the app's back button
- Copy-paste content with invisible special characters
- Open the same page in 3 tabs simultaneously
- Use your app on a 5-year-old phone with 2G internet

**Happy Path → Alternate Paths → Error Paths → Edge Cases**

That is the order to test. Never skip any layer.

*💡 Analogy: You've tested that the front door opens with the key. Now test the back door, the fire exit, what happens when you lose the key, and whether the door still opens in -10°C weather. The house is not "tested" just because the front door opens.*
        `
      },

      {
        id: 'negative-testing',
        title: 'Beginner: Negative Testing',
        analogy: "Negative testing is putting a square peg in a round hole on purpose, just to make sure the system politely says 'no' instead of exploding.",
        lessonMarkdown: `
## Negative Testing

Negative testing means **deliberately giving the system invalid, unexpected, or incorrect input** to ensure it handles failures gracefully instead of crashing or corrupting data.

### 1. What is Negative Testing?

If positive testing (Happy Path) checks that things work when you do them correctly, negative testing checks that things **fail safely** when you do them incorrectly.

The goal is not to make the app crash for fun — it is to verify that the app produces **clear, helpful error messages** and **does not corrupt any data** when things go wrong.

*💡 Analogy: Going to a vending machine and inserting a banana instead of a coin. A good vending machine politely rejects the banana. A bad vending machine eats the banana, dispenses nothing, and catches fire.*

---

### 2. Categories of Negative Tests

**Invalid Data Type:**
| Field | Valid Input | Negative Test |
|---|---|---|
| Age | 25 | "twenty-five", -5, 999, null |
| Email | user@test.com | "notanemail", "user@", "@test.com" |
| Phone | 07700900000 | "ABCDEFGHIJK", 1234, "++44" |
| Price | 19.99 | "free", -10, 999999999 |

**Real Example — Age field bug:**

A hotel booking site allows guests to enter the number of children. A tester types "-1 children." The site calculates room pricing with a negative person, applies a negative discount, and shows a final price of £-50, which the user could theoretically complete and get paid to stay. This is a real class of exploit found regularly in e-commerce apps.

**Missing Required Data:**

Submitting a form with empty required fields is one of the most common negative tests. The app should show a specific, helpful validation message — not a generic server error.

❌ Bad error: *"Error 500: Internal Server Error"*
✅ Good error: *"Please enter your email address to continue"*

**Exceeding Limits:**

- Upload a 10GB file to a system that accepts 5MB
- Enter 10,000 characters into a field that expects 100
- Submit a form 100 times rapidly by clicking "Submit" repeatedly

*💡 Analogy: Negative testing is what QA Mythbusters do. "They said it can handle 500 users — let's send 5,000 and see what actually happens."*

---

### 3. Security-Focused Negative Testing

Some negative tests protect against deliberate attacks:

**SQL Injection:** Enter \`' OR '1'='1\` into a login email field. A vulnerable app will log you in as the first user in the database. A secure app will show a validation error.

**XSS (Cross-Site Scripting):** Enter \`<script>alert('hacked')</script>\` into a comment field. A vulnerable app executes the script. A secure app renders it as plain text.

**These are not hacker tricks — these are standard test cases.** Every QA engineer should run them on any text field that saves data.

*💡 Analogy: A bank tests its vault by hiring a locksmith to try to break in. They are not hoping he succeeds — they need to know the door is actually secure before putting real money inside.*
        `
      },

      {
        id: 'exploratory-testing',
        title: 'Beginner: Exploratory Testing',
        analogy: "Exploratory testing is being a detective in a city you've never visited. You have no map, no tour guide — just your instincts, a notebook, and a healthy suspicion that something is hidden in that alley.",
        lessonMarkdown: `
## Exploratory Testing

Exploratory Testing is **simultaneous learning, test design, and test execution**. Instead of following a script, you interact with the application freely, guided by your curiosity and intuition, and adjust your approach based on what you discover in real time.

### 1. The Explorer's Mindset

A scripted tester follows a checklist. An exploratory tester asks questions:

- "What happens if I do this in the wrong order?"
- "What if I use this feature in a way it wasn't designed for?"
- "What happens if I combine these two actions?"
- "Can I get the same result via a different route?"

**Real Example:**

A tester is exploring a banking app's money transfer feature. The scripted test says: "Transfer £50 to a saved payee." The exploratory tester tries:
- Transfer £0 — allowed?
- Transfer the exact balance — allowed?
- Transfer £0.001 — what happens?
- Delete a payee mid-transfer in another tab
- Enter a payee account number with letters in it
- Rapidly click "Send" 5 times in a row

None of these are in the script. All of them have found real bugs in real apps.

*💡 Analogy: Scripted testing is following a tourist map. Exploratory testing is wandering off the tourist map because you noticed a suspicious-looking door in an alley and decided to knock.*

---

### 2. Session-Based Exploratory Testing (SBET)

Unstructured exploration can become unfocused. Session-based testing brings **light structure** to exploration:

- **Set a charter** — a brief mission statement for your session: *"Explore the user profile editing feature focusing on photo upload and data validation."*
- **Timebox it** — typically 45–90 minutes
- **Take notes** — write down every bug, question, and observation
- **Debrief** — summarise what you found and what you still have questions about

**Example Charter:**
> *"Explore the checkout process as a guest user, paying attention to how the site handles address validation, coupon codes, and payment failures."*

This is broad enough to allow creativity but focused enough to be useful.

*💡 Analogy: An explorer doesn't wander the jungle with zero plan. They say "Today I'm exploring the north riverbank for 3 hours, looking for signs of wildlife." Structure without a rigid script.*

---

### 3. When to Use Exploratory Testing

| Situation | Use Exploratory? |
|---|---|
| New feature just built by dev | ✅ Yes — learn the feature first |
| Time is short and no test cases exist | ✅ Yes — best use of limited time |
| You have detailed test cases already | ✅ Yes — run after scripted testing |
| Regression testing after a hotfix | ❌ No — use scripted regression cases |
| Performance testing | ❌ No — needs precise tooling |

Exploratory testing finds bugs that scripted tests miss because **real bugs come from unexpected interactions**, not the paths the developer anticipated.

*💡 Analogy: You can read every food review ever written about a restaurant. Or you can just go there and eat. The review tells you what the food is supposed to taste like. Going there tells you what it actually tastes like today.*
        `
      },

      {
        id: 'bug-life-cycle',
        title: 'Beginner: The Bug Life Cycle',
        analogy: "A bug's life cycle is like a parking ticket. It gets issued, assigned to someone to pay, paid (fixed), verified the payment went through, and then filed away. If it bounces, it comes back to haunt you.",
        lessonMarkdown: `
## The Bug Life Cycle

Every defect found in testing goes on a journey from the moment it is discovered to the moment it is resolved. Understanding this journey helps QA engineers communicate, track, and close bugs effectively.

### 1. The Journey of a Bug

\`\`\`
NEW → ASSIGNED → IN PROGRESS → FIXED → RETESTING → CLOSED
                                  ↓
                              REOPENED (if fix didn't work)
                                  ↓
                              REJECTED (if it's not a bug)
                                  ↓
                            DEFERRED (won't fix now)
\`\`\`

---

### 2. Every State Explained

**NEW** — The tester has found and logged the bug. It is sitting unread in the bug tracker (Jira, Azure DevOps, etc.). Nobody has looked at it yet.

**ASSIGNED** — A developer (or team lead) has accepted the bug and assigned it to themselves or someone else for investigation.

**IN PROGRESS** — The developer is actively fixing the code. The bug is being worked on.

**FIXED** — The developer has pushed a code fix and marked it ready for QA to verify. This does NOT mean it is actually fixed — it means the dev thinks it is.

**RETESTING** — The tester now verifies the fix by repeating the exact steps that originally caused the bug.

**CLOSED** — The fix is confirmed. The bug is dead. Everyone celebrates.

**REOPENED** — The fix didn't work. The same bug still occurs. The dev needs another look.

**REJECTED** — The dev investigated and concluded it is NOT a bug — it is intended behaviour, or the tester made an error. The tester and dev may need to discuss.

**DEFERRED** — It is a real bug, but it won't be fixed in this release. Typically because the effort to fix is too high or the impact is too low.

*💡 Analogy: A bug report is like a food health inspection violation notice. "New" = inspector writes it up. "Assigned" = restaurant owner receives it. "Fixed" = kitchen is cleaned. "Retesting" = inspector comes back. "Closed" = pass. "Reopened" = the inspector came back and it was still dirty.*

---

### 3. Real Example — Bug Life Cycle in Action

**Day 1 (Monday):** Tester finds that the "Forgot Password" email is never sent. Logs it as NEW in Jira with full steps, screenshots, and environment details.

**Day 1 afternoon:** Team lead assigns it to the backend developer. Status: ASSIGNED.

**Day 2:** Developer investigates — finds the email service API key expired. Renews it and deploys the fix. Status: FIXED.

**Day 2 afternoon:** Tester gets notification. Re-runs the exact steps: enters email, clicks "Send Reset Link," checks inbox. Email arrives. Status: CLOSED.

**Day 3:** User reports on production that the email arrives but the reset link is expired after 1 minute (should be 24 hours). Tester reopens the bug with new details. Status: REOPENED.

*💡 Analogy: "Fixed" from a developer is like a patient telling the doctor "I feel better." The doctor still needs to run the tests. You don't close a bug because someone SAID they fixed it — you close it because YOU PROVED they fixed it.*
        `
      },

      {
        id: 'severity-vs-priority',
        title: 'Beginner: Severity vs Priority',
        analogy: "Severity is how bad a wound is medically. Priority is how urgently you need to treat it. A paper cut is low severity and low priority. A broken leg before a marathon tomorrow is low severity but extremely high priority.",
        lessonMarkdown: `
## Severity vs Priority

These two concepts are constantly confused — even by experienced testers. Getting them right is what separates a junior QA from a professional one.

### 1. What is Severity?

**Severity** is the **technical impact of the bug on the system**. It describes how badly the bug breaks functionality.

| Severity Level | Description | Example |
|---|---|---|
| **Critical** | System crash, data loss, complete feature failure | Payment processing crashes. Users cannot pay at all. |
| **High** | Major feature broken, serious workaround needed | Search returns wrong results for 30% of queries |
| **Medium** | Feature partially broken, workaround exists | Sorting by price sorts in wrong direction |
| **Low** | Minor issue, cosmetic or trivial | Button label says "Sbumit" instead of "Submit" |

Severity is assessed purely on **technical impact** — how much of the system is affected.

*💡 Analogy: Severity is a doctor rating how bad your injury is, purely medically. A severed artery is Critical. A bruise is Low.*

---

### 2. What is Priority?

**Priority** is the **business urgency of fixing the bug**. It describes how quickly the bug needs to be resolved, considering business context, not just technical impact.

| Priority Level | Description |
|---|---|
| **P1 (Must Fix Now)** | Blocks release. Business cannot ship without this being resolved. |
| **P2 (Fix This Sprint)** | Important, affects many users, but doesn't block the release today. |
| **P3 (Fix When Possible)** | Noticeable but low business impact. Goes in the backlog. |
| **P4 (Nice to Have)** | Cosmetic or trivial. May never be fixed. |

*💡 Analogy: Priority is the doctor's waiting room triage. Someone with a paper cut has low priority even if they arrived first. Someone having a heart attack gets seen immediately regardless of queue position.*

---

### 3. The Severity ≠ Priority Matrix

This is where it gets interesting. Severity and priority are **independent** of each other.

| Scenario | Severity | Priority | Why |
|---|---|---|---|
| Payment button crashes the app | Critical | P1 | Nobody can buy anything. Ship is blocked. |
| CEO's name is misspelt on the About page | Low | P1 | Launch is tomorrow. CEO is watching. Fix NOW. |
| Search sorts in wrong order | High | P3 | Feature is new and not in the marketing material yet |
| The loading spinner is the wrong shade of blue | Low | P4 | Nobody cares |

**Real Example:**

A QA engineer finds two bugs on the day before launch:
- Bug A: The app crashes if you enter an emoji in the username field (Severity: High)
- Bug B: The company logo on the login page is blurry (Severity: Low)

The Marketing Director has told the team the CEO will personally demo the app to 500 investors tomorrow. Which bug has higher Priority?

**Bug B.** Because the CEO will see the logo on screen 1. The emoji crash is unlikely to happen in the demo. Priority is about business context, not just technical severity.

*💡 Analogy: A cracked windscreen (High Severity) in a car you sell in 6 months has lower priority than a scuff on the bumper (Low Severity) before a car show this weekend where first impressions are everything.*
        `
      },

      // ─── INTERMEDIATE ────────────────────────────────────────────────────────

      {
        id: 'bva',
        title: 'Intermediate: Boundary Value Analysis',
        analogy: "Bugs love to live at the edges. If a sign says 'Maximum 10 people in lift', the bug is hiding at person number 10 and 11 — not somewhere in the middle.",
        lessonMarkdown: `
## Boundary Value Analysis (BVA)

Boundary Value Analysis is a **test design technique** that focuses testing effort on the values at the extreme edges of valid and invalid input ranges. The mathematical principle is simple: bugs are disproportionately likely to appear at boundaries because developers make "off-by-one" errors.

### 1. Why Boundaries Are Dangerous

Developers frequently write conditions like:
\`\`\`
if (age < 18) → reject
if (age >= 18) → allow
\`\`\`

An off-by-one error might read:
\`\`\`
if (age <= 18) → reject  // BUG: 18-year-olds are blocked!
\`\`\`

If you only test age 25, this bug is invisible. If you test age 18 specifically, you find it immediately.

*💡 Analogy: A bridge rated for 10 tonnes. Testing with 5 tonnes tells you nothing useful. Testing with exactly 10 tonnes (the boundary) and 10.001 tonnes (just over) tells you everything.*

---

### 2. How to Apply BVA

For any range-based rule, always test these 4 values:

| Position | What to Test |
|---|---|
| Min boundary - 1 | One below the minimum (should FAIL) |
| Min boundary | Exact minimum (should PASS) |
| Max boundary | Exact maximum (should PASS) |
| Max boundary + 1 | One above the maximum (should FAIL) |

**Real Example — Password Length (8–20 characters):**

| Test Value | Characters | Expected Result | Why |
|---|---|---|---|
| TC-01 | 7 chars | ❌ Rejected | Below minimum |
| TC-02 | 8 chars | ✅ Accepted | Exact minimum |
| TC-03 | 20 chars | ✅ Accepted | Exact maximum |
| TC-04 | 21 chars | ❌ Rejected | Above maximum |

You do NOT need to test 9, 10, 11, 12... characters. They are irrelevant to BVA.

*💡 Analogy: A nightclub bouncer checks IDs at age 18. You test with someone who is exactly 17 years 364 days old, someone who is exactly 18 today, and someone who is 18 years and 1 day. Those are your boundaries. A 25-year-old is irrelevant.*

---

### 3. BVA on Real Forms and APIs

**Age verification (must be 18–99):**
Test: 17, 18, 99, 100

**File upload (max 5MB):**
Test: 4.9MB, 5.0MB exactly, 5.1MB

**Discount applied for orders over £50:**
Test: £49.99, £50.00, £50.01

**API rate limit (100 requests per hour):**
Test: 99 requests, 100 requests, 101 requests — does the 101st get rejected correctly?

**Real Bug Found with BVA:**

A lottery app allowed users to pick numbers from 1–49. Testing value 49 passed. Testing value 50 was supposed to be rejected. Instead, the app accepted it silently — stored 50 in the database — and crashed the draw algorithm that only knew about numbers 1–49. This crashed the entire draw for 200,000 users. The boundary test took 2 minutes to run. The incident took 6 hours to recover from.
        `
      },

      {
        id: 'equivalence-partitioning',
        title: 'Intermediate: Equivalence Partitioning',
        analogy: "If you need to taste-test a 50kg barrel of soup to check if it's salty enough, you don't need to taste every spoonful. One spoonful from the middle represents the whole barrel. That spoonful is your partition.",
        lessonMarkdown: `
## Equivalence Partitioning

Equivalence Partitioning is a technique that **divides all possible inputs into groups (partitions)** where every value within the group is expected to behave identically. You then test ONE representative value from each partition instead of testing every possible value.

### 1. The Core Idea

Without partitioning, a field that accepts numbers from 1–100 would theoretically require 100 test cases. With partitioning, you need exactly 3:

| Partition | Range | One Representative | Expected Result |
|---|---|---|---|
| Below valid | Less than 1 | 0 or -5 | ❌ Rejected |
| Valid | 1 to 100 | 50 | ✅ Accepted |
| Above valid | More than 100 | 150 | ❌ Rejected |

*💡 Analogy: A teacher marking 30 essays doesn't re-read every word of every essay to spot the same spelling mistake. They look at one from each "pile" — the A students, the B students, and the failing students — and apply consistent marking.*

---

### 2. Creating Partitions for Real Features

**Real Example — Movie Ticket Pricing by Age:**

| Age Group | Rule | Partition | Test Value |
|---|---|---|---|
| Child | Under 5: Free | 0–4 | 3 |
| Junior | 5–15: £5.99 | 5–15 | 10 |
| Adult | 16–64: £12.99 | 16–64 | 35 |
| Senior | 65+: £7.99 | 65–120 | 70 |
| Invalid | Negative / over 120 | <0, >120 | -1, 130 |

Total test cases needed: 5 (one per partition). Not 121.

**Real Example — Username Validation:**

Rules: 3–15 characters, letters and numbers only, cannot start with a number.

Partitions:
- Too short (< 3 chars)
- Valid length (3–15 chars)
- Too long (> 15 chars)
- Valid characters only (letters + numbers)
- Invalid character (space, @, !)
- Starts with number (e.g., "3user")
- Starts with letter (e.g., "user3")

*💡 Analogy: When testing if a vending machine accepts coins, you don't try every single 5p coin ever minted. You try one valid coin, one invalid coin (a button), and one coin from a foreign country. Each represents an entire class of behaviour.*

---

### 3. Combining EP with BVA

For maximum coverage with minimum tests, use **both techniques together**:

- Equivalence Partitioning identifies the groups
- Boundary Value Analysis tests the edges of each group

For the movie ticket example:
- EP tells you the partitions are: <0, 0–4, 5–15, 16–64, 65+, >120
- BVA then says: test -1, 0, 4, 5, 15, 16, 64, 65, 120, 121

That is 10 targeted tests that cover every meaningful scenario in a system with 121+ possible inputs.
        `
      },

      {
        id: 'state-transition',
        title: 'Intermediate: State Transition Testing',
        analogy: "Think of a traffic light. It MUST go Green → Amber → Red → Green. If it ever goes directly from Red to Green without Amber, or tries to be Green and Red simultaneously, someone is going to get hurt.",
        lessonMarkdown: `
## State Transition Testing

State Transition Testing is a technique for testing systems where **the system's behaviour depends on its current state**, and actions cause transitions between states. It ensures all valid transitions work and all invalid ones are properly blocked.

### 1. What is "State"?

A system has a **state** when its current condition determines how it responds to inputs. An ATM in "Card Inserted" state behaves differently to an ATM in "Idle" state when you press "Withdraw."

**Real Example — ATM States:**

\`\`\`
[Idle] --insert card--> [Card Inserted]
[Card Inserted] --correct PIN--> [Authenticated]
[Card Inserted] --wrong PIN x3--> [Card Retained]
[Authenticated] --withdraw--> [Dispensing Cash]
[Authenticated] --eject card--> [Idle]
[Dispensing Cash] --cash taken--> [Authenticated]
\`\`\`

*💡 Analogy: A vending machine is the perfect state machine. After you insert money, it waits for a selection. After a selection, it dispenses. It cannot dispense before you insert money. It cannot accept a new selection while it is dispensing. Each state has strict rules about what it allows.*

---

### 2. Building a State Transition Table

A state transition table maps every state against every possible event:

**Online Order System:**

| Current State | Event | Next State | Expected Behaviour |
|---|---|---|---|
| Pending | Payment received | Confirmed | Send confirmation email |
| Pending | Payment failed | Pending | Show retry payment prompt |
| Confirmed | Warehouse picks items | Processing | Update tracking page |
| Processing | Courier collects | Shipped | Send tracking number |
| Shipped | Delivered | Delivered | Ask for review |
| Any state | User cancels | Cancelled | Initiate refund |
| Delivered | User cancels | ❌ Invalid | Show "cannot cancel delivered order" |

**Test Cases From This Table:**

- TC-01: Can a Pending order be Cancelled? ✅ Should be yes
- TC-02: Can a Shipped order be Cancelled? ⚠️ Business decision — test what the spec says
- TC-03: Can a Delivered order go back to Processing? ❌ Should be blocked

---

### 3. Testing Invalid Transitions

This is where the real bugs hide. Invalid transitions are actions that should be **impossible**, but developers sometimes forget to block them.

**Real Example:**

A streaming service has a subscription with states: Free → Trial → Paid → Cancelled.

The tester discovered: If a user in "Trial" state called the API directly (bypassing the UI) with a "Cancelled" status, the system accepted it and moved them to Cancelled — but also kept their Trial benefits active because the Trial expiry check still ran. They effectively had free premium content indefinitely.

The UI never showed a "Cancel Trial" button — but the API had no guard against direct calls. **Always test if invalid state transitions are blocked at the API level, not just the UI level.**

*💡 Analogy: A "Cancelled" flight that shows up as "Boarding" at the gate. The database said cancelled. The departure board said boarding. Which one is real? The system is in an inconsistent state — that is a state transition bug.*
        `
      },

      {
        id: 'test-planning',
        title: 'Intermediate: Test Planning & Strategy',
        analogy: "A test plan is your battle map before the war. You wouldn't send soldiers into enemy territory without knowing the objective, the terrain, the resources, and when to retreat. Testing without a plan is exactly that.",
        lessonMarkdown: `
## Test Planning & Strategy

A **Test Plan** is a formal document that defines the **scope, approach, resources, and schedule** for testing activities on a project. Without it, testing is random, incomplete, and unmeasurable.

### 1. What Goes Into a Test Plan?

A professional Test Plan answers these 6 questions:

| Question | Section |
|---|---|
| WHAT are we testing? | Scope & Features in/out of scope |
| HOW are we testing it? | Test approach & techniques |
| WHO is doing the testing? | Roles & responsibilities |
| WHEN will testing happen? | Schedule & milestones |
| WHERE are we testing? | Test environments |
| HOW do we know when we're done? | Entry & Exit criteria |

**Real Example — Test Plan Scope for a Login Feature:**

> **In Scope:** Email/password login, password reset, session management, account lockout
> **Out of Scope:** Social login (Google/Facebook) — scheduled for Q3
> **Test Environments:** Chrome latest, Safari 16, iOS 16, Android 12
> **Test Data:** 10 registered test accounts, 5 with locked status

*💡 Analogy: A film director's shooting schedule. It lists every scene, which actors are needed, which location, which day, and what equipment is required. Without it, everyone shows up to the wrong place on the wrong day.*

---

### 2. Entry and Exit Criteria

**Entry Criteria** — conditions that must be true BEFORE testing begins:
- Build is deployed to the test environment ✅
- Smoke test passed (basic navigation works) ✅
- Test data is set up ✅
- Test cases are reviewed and approved ✅

**Exit Criteria** — conditions that must be true BEFORE testing is considered DONE:
- 100% of P1 test cases executed ✅
- 95% of all test cases executed ✅
- 0 open P1 or P2 bugs ✅
- Defect rate below 5% of test cases ✅
- All reopened bugs re-verified ✅

**Why this matters:** Without exit criteria, testing never officially "ends" — it just stops when someone gets tired or the deadline hits. Exit criteria make the decision objective.

*💡 Analogy: Entry criteria = the ingredients and oven must be ready before you start baking. Exit criteria = the cake is golden brown, passes the skewer test, and has cooled for 30 minutes before serving. Don't serve raw cake just because you ran out of time.*

---

### 3. Test Strategy vs Test Plan

These are often confused. Here is the difference:

| | Test Strategy | Test Plan |
|---|---|---|
| **Level** | Organisation-wide | Project-specific |
| **Scope** | All projects | One project or release |
| **Content** | Principles, tools, standards | Schedule, scope, resources |
| **Changes** | Rarely | Per project |
| **Author** | Test Manager / Head of QA | Lead QA on the project |

**Real Example:**

The Test Strategy says: *"All projects at this company will use BVA and EP techniques, Jira for bug tracking, and require 0 P1 bugs before release."*

The Test Plan for the "December Payment Upgrade" says: *"Testing runs from Dec 1–Dec 15. Three QA engineers. Testing focuses on payment flows and refund processing. Go/No-Go meeting on Dec 14."*
        `
      },

      {
        id: 'defect-reporting',
        title: 'Intermediate: Defect Reporting',
        analogy: "A bug report is a crime scene report. 'Something bad happened' is useless. 'At 3:47pm, in the kitchen, with a candlestick, leaving these specific marks' is what gets the case solved.",
        lessonMarkdown: `
## Defect Reporting

A bug report is only as useful as the information it contains. A poorly written bug report wastes the developer's time, leads to "Cannot Reproduce" responses, and slows the entire team down.

### 1. Why a Great Bug Report Matters

**Bad bug report:**
> "The checkout doesn't work when I add things."

A developer reading this has no idea:
- Which browser/device was used
- Which items were added
- What "doesn't work" means (error? freeze? wrong price?)
- What the user expected to happen
- Whether this is reproducible

**Result:** Developer tries random things, cannot reproduce it, marks it as "Cannot Reproduce," and closes it. Bug survives to production.

*💡 Analogy: Calling a plumber and saying "the house is wet." The plumber needs to know which room, what kind of wet, when it started, whether it's from a pipe or a roof. "The house is wet" sends them in circles.*

---

### 2. Anatomy of a Perfect Bug Report

\`\`\`
Title: "Add to Cart" button returns 500 error for out-of-stock products [Chrome 120, Prod]

Summary:
When a logged-in user attempts to add an out-of-stock product to their
cart on the Product Detail Page, the browser displays a generic 500 error
instead of the expected "Out of Stock" message.

Steps to Reproduce:
1. Log in as test@qa.com / Test@1234
2. Navigate to https://store.com/products/headphones-456
3. Note: Product shows "Out of Stock" badge in the top-right corner
4. Click the "Add to Cart" button
5. Observe the result

Expected Result:
Button should be disabled OR clicking it should show:
"Sorry, this product is currently out of stock. Add to wishlist?"

Actual Result:
Browser displays a full-page "500 Internal Server Error" message.
Cart icon count does not change.

Environment:
- Browser: Chrome 120.0.6099.109
- OS: macOS Sonoma 14.1
- URL: https://store.com/products/headphones-456
- User account: test@qa.com
- Date/Time: 2024-01-15, 14:23 GMT

Severity: High (core e-commerce flow impacted)
Priority: P2 (affects out-of-stock items only, workaround: don't click button)

Attachments:
- screenshot_error.png
- browser_console_errors.txt (shows "Uncaught TypeError: Cannot read property...")
\`\`\`

---

### 3. Good vs Bad: The Full Comparison

| Element | ❌ Bad | ✅ Good |
|---|---|---|
| **Title** | "Checkout broken" | "'Pay Now' crashes on declined cards - Chrome/iOS" |
| **Steps** | "Add item and checkout" | Numbered, specific, with exact URLs and test data |
| **Expected** | "It should work" | "User sees 'Payment declined, please try another card'" |
| **Actual** | "It didn't work" | "Page goes blank. No error message. Console shows 404 on /payment/process" |
| **Environment** | "My computer" | Chrome 120, Windows 11, Test environment URL |
| **Attachments** | None | Screenshot, video, console log, network log |

**Real Example of a Bug That Could Not Be Reproduced (and why):**

A tester filed: "The discount code doesn't work." The developer tried 20 different codes. None failed. Marked: Cannot Reproduce.

The tester had used a code that only worked for accounts created before 2022. Their account was created in 2019. The dev's account was from 2023. Without specifying the account used and the exact code entered, this information was invisible.

*💡 Analogy: A bug report without clear steps is like a recipe that says "cook it until it's done." Every chef will produce something different. Specific instructions are the only way to guarantee a consistent result.*
        `
      },

      {
        id: 'regression-testing',
        title: 'Intermediate: Regression Testing',
        analogy: "Regression testing is checking that the builder who fixed your leaky kitchen tap didn't accidentally break a pipe in the bathroom wall in the process. Things that worked before must still work after.",
        lessonMarkdown: `
## Regression Testing

Regression testing is the practice of **re-testing previously working functionality** after a code change, to ensure the change has not introduced new bugs into areas that were previously stable.

### 1. Why Regression Happens

Every code change carries risk. A developer fixing Bug A may inadvertently:
- Change a shared function used by Feature B and Feature C
- Update a database query that affects multiple pages
- Modify a style that breaks layout on a different screen
- Change an environment variable that affects another service

**Real Example:**

A developer fixes a bug where promo codes weren't being applied at checkout. The fix touches the \`calculateTotal()\` function. Three days later, users report that loyalty points are no longer being deducted correctly — because \`calculateTotal()\` was also used for loyalty point calculations, and the fix changed how it rounds decimal values.

The promo code bug fix broke the loyalty points. This is a regression.

*💡 Analogy: A surgeon fixes a problem with your knee. Two weeks later your hip starts aching because the altered gait from the knee surgery transferred stress to your hip. The surgeon fixed one thing and inadvertently broke something adjacent.*

---

### 2. Smoke, Sanity, and Full Regression Testing

These three levels of regression serve different purposes:

**Smoke Testing** (5–15 minutes)
- Tests only the most critical, core pathways
- Run after every new build to confirm the app is "alive"
- If smoke fails, the build is rejected and sent back to dev immediately
- Example: Can you log in? Can you reach the main page? Do the core APIs respond?

**Sanity Testing** (30–60 minutes)
- Focused on the specific area that was changed
- Run after a bug fix or small change
- Example: Developer fixed the search feature → tester runs all search-related tests only

**Full Regression Testing** (hours to days)
- The entire test suite is executed
- Run before major releases or after large code changes
- Ensures nothing anywhere in the system is broken

| Type | When | Depth | Time |
|---|---|---|---|
| Smoke | Every build | Surface only | Minutes |
| Sanity | After a specific fix | Focused area | Hours |
| Regression | Before release | Full system | Days |

*💡 Analogy: Smoke test = does the car start? Sanity test = does the fixed rear window actually close now? Full regression = test drive every feature including indicators, heating, all gears, and the boot latch.*

---

### 3. What to Include in a Regression Suite

Not everything needs to be regressed every time. A smart regression suite prioritises:

1. **Core business flows** — login, payment, main user journeys
2. **Areas touched by the recent change** — anything using the modified code
3. **Previously failed and fixed bugs** — bugs that were once real tend to come back
4. **Integration points** — where your system talks to external services

**Real Strategy Used by Teams:**

Categorise test cases as:
- 🔴 **Always Regress** — critical path (run every build)
- 🟡 **Sprint Regress** — run every sprint
- 🟢 **Release Regress** — run only before major releases

This keeps the suite manageable without sacrificing coverage where it matters.
        `
      },

      // ─── EXPERT ──────────────────────────────────────────────────────────────

      {
        id: 'risk-based-testing',
        title: 'Expert: Risk-Based Testing',
        analogy: "You cannot inspect every bag at an airport. So you profile — frequent travellers, low-risk routes, known faces get a quick check. Unknown origins, one-way tickets, and last-minute cash purchases get the full screening. You put your resources where the probability of a problem is highest.",
        lessonMarkdown: `
## Risk-Based Testing

Risk-based testing is the practice of **prioritising testing effort based on the probability and impact of failure**, ensuring the highest-risk areas receive the most attention when time and resources are limited.

### 1. Why You Cannot Test Everything

In an ideal world, every feature would be tested exhaustively before every release. In the real world:

- Release deadlines are fixed
- QA team size is finite
- Some features change 5 minutes before release

Risk-based testing is the professional answer to: *"We have 3 days to test 50 features. Where do we spend our time?"*

*💡 Analogy: A hospital cannot give every patient an MRI scan every week. So they prioritise — patients with symptoms, high-risk demographics, and recent exposure to risk factors get the scan. Low-risk patients get a check-up. Resources go to where risk is highest.*

---

### 2. The Risk Matrix

Risk is calculated from two dimensions:

**Risk = Probability of Failure × Impact of Failure**

| | Low Impact | High Impact |
|---|---|---|
| **High Probability** | 🟡 Medium Risk | 🔴 Critical Risk |
| **Low Probability** | 🟢 Low Risk | 🟠 High Risk |

**Practical Assessment:**

| Feature | Probability of Bug | Impact if it Fails | Risk Level | Test Priority |
|---|---|---|---|---|
| Payment processing | Medium (recently changed) | Critical (revenue loss) | 🔴 Critical | Test exhaustively |
| User profile picture upload | Low (stable for 2 years) | Low (cosmetic only) | 🟢 Low | Smoke test only |
| New promo code engine | High (brand new code) | High (financial loss) | 🔴 Critical | Test exhaustively |
| Footer copyright year | Low | Low | 🟢 Low | Visual check only |
| Third-party map widget | Low (vendor managed) | Medium | 🟡 Medium | Basic validation |

---

### 3. Applying Risk-Based Testing in Practice

**Step 1: Identify all features and recent changes**
Work with the developer to get a list of everything that changed in this release.

**Step 2: Assess probability of failure**
- Is this code new or existing? New = higher probability
- Has this area had bugs before? Yes = higher probability
- Is this a complex area (lots of conditions/integrations)? Yes = higher probability

**Step 3: Assess impact of failure**
- Is this on the critical user journey (login, payment, core feature)?
- How many users are affected?
- Is there financial, legal, or reputational risk?

**Step 4: Prioritise your test execution**
- 🔴 Critical Risk areas → Full test coverage, automated + manual
- 🟠 High Risk → Full manual coverage
- 🟡 Medium Risk → Key test cases only
- 🟢 Low Risk → Smoke test / spot check

**Real Example:**

A QA lead has 2 days before a release. 40 features changed. Using risk-based testing:

- 5 features are Critical (payment, auth, new checkout flow) → Full testing
- 12 features are High Risk → Targeted test cases
- 23 features are Low Risk → Smoke tests via the regression suite

Time spent: 80% on the 17 high+critical features, 20% on the 23 low-risk features. This is a defensible, documented approach to quality coverage under constraints.

*💡 Analogy: A building inspector before handover doesn't spend equal time inspecting every room. They spend most of their time on the structural walls, the electrical panel, and the roof — the things that cause catastrophic failure. Less time on whether the door knobs match.*
        `
      },

      {
        id: 'state-dependency',
        title: 'Expert: State Dependency Bugs',
        analogy: "A state dependency bug is like two people editing the same Google Doc simultaneously, but one person's screen never refreshes. They're both convinced they have the latest version. Only one of them is right.",
        lessonMarkdown: `
## State Dependency Bugs

State dependency bugs occur when an application makes decisions based on **stale or inconsistent data** — data that was true at some point but has since changed, and the app doesn't know it.

### 1. The Problem of Stale State

Every time a user's browser or app stores information locally (in memory, in a variable, in the session), that information can become "stale" if the server-side data changes without the client being notified.

**Real Example — E-commerce Cart:**

1. User opens Tab A: Cart shows 1 laptop, price £999
2. An admin removes the laptop from the store (it's discontinued)
3. User never refreshes Tab A
4. User clicks "Proceed to Checkout" on Tab A
5. What happens?

**Bad outcome:** Server accepts the checkout with the deleted product
**Good outcome:** Server rejects it and shows "This item is no longer available"
**Worst outcome:** Order is placed, charged to card, but warehouse tries to fulfil an order for a product that doesn't exist

*💡 Analogy: You're bidding on an item at an auction. You see the current bid as £200. You bid £250. Unknown to you, while you were deciding, three other people bid and the current price is now £450. Your bid goes through at £250. Did you just steal it, or will the auction house catch the discrepancy?*

---

### 2. Multi-Tab and Multi-Device Testing

This is where state dependency bugs love to live. Always test:

**Scenario 1: Parallel Sessions**
- Log in on Chrome and Firefox simultaneously
- Perform an action on Firefox (e.g., change email)
- Go back to Chrome — does it still show the old email?
- Continue using Chrome — does it behave correctly or fail?

**Scenario 2: Session Expiry**
- Log in and stay idle for longer than the session timeout
- Try to perform an action (submit a form, make a purchase)
- Does the app detect the expired session gracefully, or does it silently fail?

**Scenario 3: Cross-Device Conflict**
- Add items to cart on mobile
- Log into the same account on desktop
- Check cart — are the items there?
- Add different items on desktop
- Go back to mobile — does the cart merge, overwrite, or show an error?

---

### 3. Cookie and LocalStorage Attacks

Beyond accidental stale state, expert testers check if **manipulated state** causes security issues.

**Test:** Inspect browser localStorage. Find a variable like \`userRole: "free"\`. Manually change it to \`userRole: "admin"\`. Refresh the page. Did you just get admin access?

If yes — the application trusts client-side state for security decisions. This is a critical security bug.

**Correct behaviour:** The server should re-verify the user's role on every privileged action, not trust what the client sends.

*💡 Analogy: A theme park that stamps your hand for unlimited rides. A state dependency bug is the park not checking if the stamp is real — they accept any hand with ink on it, including the one you drew on yourself with a marker in the carpark.*
        `
      },

      {
        id: 'race-conditions',
        title: 'Expert: Race Conditions',
        analogy: "Two people running to the last seat on a plane. The airline's system must handle the race and give the seat to exactly one of them. If it doesn't, both boarding passes print, and someone is going to have a very bad day.",
        lessonMarkdown: `
## Race Conditions

A race condition is a **timing-dependent bug** where the outcome of an operation depends on the sequence or timing of events, and two or more operations compete to access or modify the same resource simultaneously.

### 1. What is a Race Condition?

When two users or processes try to do the same thing at the exact same moment, and the system doesn't properly manage the conflict, both can "win" — causing data corruption, double processing, or inconsistent state.

**Classic Example — Double Spending:**

User has £100 in their account.
- Request A: "Transfer £100 to Alice" — reads balance: £100. Checks: sufficient. Preparing to deduct...
- Request B: "Transfer £100 to Bob" — reads balance: £100. Checks: sufficient. Preparing to deduct...
- Request A completes: Balance becomes £0
- Request B completes: Balance becomes -£100

Both transfers succeed because both requests read the balance BEFORE either had deducted it. The database was not "locked" during the transaction.

*💡 Analogy: Two chefs looking in the fridge at the same time. Both see one egg. Both decide to use it. Both reach in. One of them is going to be very confused.*

---

### 2. Classic Race Condition Scenarios to Test

**Double-clicking a payment button:**
Rapidly double-click "Place Order." Does the order get created twice? Does the user get charged twice?

**Simultaneous seat/ticket booking:**
Open two browser windows. Both select seat 14A on a flight. Both click "Book." Does seat 14A get double-booked?

**Concurrent coupon code use:**
A promo code is valid for the "first 100 users." Use a script or two browser tabs to submit the code simultaneously. Does the 101st request through?

**Flash sale inventory:**
100 items in stock. 500 users simultaneously click "Buy." Does the sold count go above 100?

**Real Incident:**

A ride-hailing app allowed users to request a ride and cancel it within 60 seconds for a full refund. A user wrote a script to request a ride and cancel it at the exact millisecond the driver confirmed — exploiting a race condition where the system processed the refund AND the driver's payment simultaneously. The user got a refund AND the driver got paid. The company lost money on every transaction the script ran.

---

### 3. How to Test for Race Conditions

**Manual technique (browser):**
1. Open the action in two browser tabs simultaneously
2. Set both tabs up ready to submit (forms filled, button visible)
3. Click both "Submit" buttons at the same moment (requires two hands or a helper)
4. Check the result — was the operation performed once or twice?

**Advanced technique:**
Use browser developer tools or tools like Postman to fire two identical API requests simultaneously and examine the responses.

**What to check:**
- Are both responses successful? (They should not both be)
- Is the database in a consistent state? (Check record counts)
- Are error messages informative and correct?

*💡 Analogy: Testing a race condition is like two people calling a cinema box office at the same second for the last ticket for the same screening. Only one call should result in a booked ticket. If both succeed, the cinema has oversold. If neither succeeds, revenue is lost. The test is making both calls happen at once.*
        `
      },

      {
        id: 'interrupt-testing',
        title: 'Expert: Interrupt Testing',
        analogy: "Interrupt testing is checking what happens when life rudely barges in. You're mid-sentence and someone calls your name. A robust person remembers what they were saying. A buggy person starts talking about something completely different.",
        lessonMarkdown: `
## Interrupt Testing

Interrupt testing checks how an application behaves when an **external event unexpectedly interrupts the user's session** mid-task. This is most critical in mobile applications but applies to all platforms.

### 1. The Real World is Rude

Users do not operate in a perfectly controlled environment. While they are using your app:

- Phone calls arrive
- Notifications pop up and they tap them
- The battery dies
- They lose internet connection
- They switch to another app and come back
- The device goes to sleep mid-action

A robust application handles every one of these gracefully. A poorly tested application loses data, crashes, or leaves the user in a broken state.

*💡 Analogy: You're writing a cheque and someone taps you on the shoulder. A sensible person holds the pen, handles the interruption, and finishes the cheque. A badly designed cheque would smudge, forget the amount, and post itself to the wrong address.*

---

### 2. Types of Interrupts to Test

**Incoming Phone Call (Mobile):**
- What happens to a payment processing screen when a call comes in?
- Does the app pause? Does the timer reset? Is the session still valid when you return?
- Does the payment go through, not go through, or go through twice?

**Network Loss:**
- Disconnect the device from Wi-Fi/data mid-submission
- Does the app show a helpful "No connection" message?
- When connection restores, does it retry the submission? Does it submit twice?

**App Backgrounding:**
- Start filling in a long form
- Press the Home button (app goes to background)
- Return after 10 minutes
- Is the form data still there? Or did it reset?

**Device Sleep:**
- Start a time-limited action (e.g., a checkout with a 10-minute timer)
- Lock the screen / let the device sleep for 5 minutes
- Unlock and return
- Is the timer still counting? Has it expired? Does the UI reflect reality?

**Battery Death Simulation:**
- Start a file upload or data sync
- Simulate low battery warning
- Kill the app forcefully
- Restart and check: Was the upload completed? Partially? Or does it need to restart?

---

### 3. How to Simulate Interrupts in Testing

| Interrupt Type | How to Test |
|---|---|
| Phone call | Have a second phone call the test device mid-action |
| Network loss | Toggle Airplane Mode at the critical moment |
| App background | Press Home mid-form submission |
| Screen lock | Press Power button mid-action |
| Force kill | Use developer tools to kill the app process |
| Low storage | Fill device storage to trigger storage warnings |

**What to verify after each interrupt:**

1. **Data integrity** — Is the data in the database correct? Not doubled, not lost?
2. **User experience** — Is there a clear message telling the user what happened?
3. **App state** — Is the UI showing the correct, current state?
4. **Recovery** — Can the user retry the action? Are they prompted to?

**Real Bug Found:**

A mobile banking app would process a transfer even when backgrounded mid-transfer (because the API call was already in flight). When the user returned, the app showed the "Enter Transfer Amount" screen — suggesting the transfer hadn't gone through. They transferred again. The money was transferred twice. No error. No notification. Just a confused user and an empty account.

*💡 Analogy: A good restaurant puts your food in a warmer if you step away mid-meal. A bad restaurant throws it in the bin and makes you order again when you return — charging you for both meals.*
        `
      },

      {
        id: 'usability-testing',
        title: 'Expert: Usability & Accessibility Testing',
        analogy: "Usability testing is handing your app to your grandmother and watching silently while she tries to book a flight. Every time she sighs, hesitates, or clicks the wrong thing is a usability bug — even if technically nothing is broken.",
        lessonMarkdown: `
## Usability & Accessibility Testing

A product can be functionally perfect — every button works, every API returns the right data — and still be completely unusable by real humans. Usability and accessibility testing ensures the product works FOR people, not just in theory.

### 1. Usability Testing — Testing for Humans

Usability testing assesses how **easy, efficient, and satisfying** the application is to use for real users in real scenarios.

**Jakob Nielsen's 10 Usability Heuristics (the gold standard):**

| # | Heuristic | What to Check |
|---|---|---|
| 1 | Visibility of system status | Does the user always know what's happening? (loading spinners, progress bars) |
| 2 | Match between system and real world | Does the language make sense to a non-technical user? |
| 3 | User control and freedom | Can users undo actions? Is there a clear "Cancel" or "Back" button? |
| 4 | Consistency and standards | Do buttons look the same across the app? Are patterns consistent? |
| 5 | Error prevention | Does the UI prevent mistakes before they happen? (confirmation dialogs) |
| 6 | Recognition over recall | Do users need to remember information between screens? (They shouldn't) |
| 7 | Flexibility and efficiency | Are there shortcuts for power users without confusing beginners? |
| 8 | Aesthetic and minimal design | Is there unnecessary clutter? Does every element earn its place? |
| 9 | Help recognise, diagnose, and recover | Are error messages human-readable and actionable? |
| 10 | Help and documentation | Is help available without leaving the current task? |

**Real Example — Heuristic 9:**

❌ Bad error message: *"Error 422: Unprocessable entity"*
✅ Good error message: *"Your postcode doesn't look right. UK postcodes should be in the format SW1A 1AA."*

*💡 Analogy: Usability is why Apple Store employees don't hand you a printed manual when you buy an iPhone. The product should be intuitive enough that you can figure out how to call someone without reading a book.*

---

### 2. Accessibility Testing (A11y)

Accessibility ensures that people with disabilities can use your application. This is not just ethical — in many countries it is a **legal requirement** (WCAG 2.1 AA is mandated in the EU and UK public sector).

**Key Accessibility Tests:**

**Keyboard Navigation:**
- Tab through every interactive element without using a mouse
- Every button, link, and form field must be reachable and operable with keyboard only
- Focus must be visible at all times (you should see which element is active)

**Screen Reader Compatibility:**
- Use a screen reader (VoiceOver on iOS, TalkBack on Android, NVDA on Windows)
- Every image must have alt text that describes its content
- Icons used as buttons must have aria-labels
- Form fields must have associated labels

**Colour Contrast:**
- Text must have sufficient contrast against its background
- WCAG AA requires a minimum 4.5:1 contrast ratio for normal text
- Tool: [contrast-ratio.com](https://contrast-ratio.com) or browser DevTools

**Real Bug Found:**

A government benefits portal had a red "Error" banner for form validation. Users who are red-green colour blind saw the banner but had no way to distinguish it from the page content — it was the same grey to them. An icon (⚠️) and the word "Error" in the text fixed the issue.

*💡 Analogy: Accessibility is building a ramp next to the stairs. The stairs work perfectly for most people. The ramp makes the building usable for everyone — and often the ramp is also useful for people with pushchairs, delivery trolleys, and anyone who hurt their knee.*

---

### 3. Common Usability Bugs

| Usability Bug | Example | Impact |
|---|---|---|
| No loading indicator | Button clicked — nothing visible happens for 3 seconds | User clicks again, duplicating the action |
| Confusing error messages | "Invalid input" with no detail | User doesn't know what to fix |
| No confirmation dialog | Delete button with no "Are you sure?" | Accidental permanent data loss |
| Mobile keyboard not triggered | Numeric field opens full keyboard on mobile | Friction for mobile users |
| Form resets on error | Submitting invalid form clears all fields | User must retype everything |
| No autosave | 20-step form lost on back button | Infuriating. Users abandon. |
        `
      },

      {
        id: 'test-metrics',
        title: 'Expert: Test Metrics & Reporting',
        analogy: "Test metrics are your speedometer and fuel gauge for the testing process. Without them, you're driving blind — you don't know if you're going fast enough, running out of time, or about to break down.",
        lessonMarkdown: `
## Test Metrics & Reporting

Test metrics are **quantitative measurements** of the testing process and product quality. They allow QA engineers to communicate objectively with stakeholders, identify trends, and make data-driven decisions about release readiness.

### 1. Why Metrics Matter

"We tested a lot" is not a report. "We executed 847 test cases, found 23 defects (4 Critical, 7 High), have 0 open Critical bugs, and achieved 94% test case pass rate" is a report.

Metrics answer the questions stakeholders actually care about:
- Are we ready to release?
- How many bugs were found and fixed?
- Where are the quality risks?
- Is the testing on schedule?

*💡 Analogy: A weather forecast says "It will be cold tomorrow." A meteorologist says "Temperature will be 3°C with 80% probability of rain between 9am and 2pm and wind at 40km/h from the north." Only one of these helps you decide what to wear.*

---

### 2. Key Metrics Every QA Engineer Should Know

**Test Execution Metrics:**

| Metric | Formula | What It Tells You |
|---|---|---|
| Test Case Pass Rate | (Passed / Total Executed) × 100 | Overall quality signal |
| Test Execution Progress | (Executed / Total Planned) × 100 | Are we on schedule? |
| Blocked Test Rate | (Blocked / Total) × 100 | How much is environment/data blocking us? |

**Defect Metrics:**

| Metric | Formula | What It Tells You |
|---|---|---|
| Defect Density | Defects found / Function points (or features) | Which areas have most bugs? |
| Defect Detection Rate | Bugs found in testing / Total bugs (including production) | How effective is our testing? |
| Defect Leakage | Bugs found in production / Total bugs found | The most important metric — bugs that escaped testing |
| Defect Fix Rate | Fixed defects / Reported defects (per sprint) | Is the team keeping up with fixes? |

**Real Example — Reading the Numbers:**

| Sprint | Tests Run | Pass Rate | Critical Bugs | Defect Leakage |
|---|---|---|---|---|
| Sprint 12 | 450 | 91% | 3 | 2 production bugs |
| Sprint 13 | 510 | 88% | 6 | 5 production bugs |
| Sprint 14 | 490 | 86% | 8 | 7 production bugs |

This table is telling a clear story: quality is getting **worse every sprint**. Pass rate is declining. Critical bugs are increasing. Production bugs are increasing. Something has changed — perhaps the team is moving too fast, test coverage dropped, or a complex new feature was introduced without sufficient QA involvement early.

---

### 3. Presenting Quality to Stakeholders

Non-technical stakeholders (PMs, executives) need dashboards, not spreadsheets.

**Effective Quality Dashboard includes:**

- 🟢🟡🔴 Traffic light for each major feature area
- Total bugs by severity (Critical / High / Medium / Low)
- Open vs Closed trend over time (are we closing bugs faster than we find them?)
- % of planned testing completed
- Top 3 risk areas with clear descriptions
- **Go / No-Go recommendation with justification**

**How to write a No-Go recommendation:**

> *"We recommend NOT releasing this build. 2 Critical P1 defects remain open: (1) Payment processing fails for Visa cards (35% of our user base uses Visa), and (2) Session does not expire correctly, leaving accounts vulnerable. Testing is 92% complete. Both defects are estimated to take 1 day to fix and verify. Recommend deploying on Thursday after verification."*

This is clear, specific, data-backed, and gives the stakeholder everything they need to make an informed decision.

*💡 Analogy: A pilot's pre-flight checklist isn't just "does the plane feel okay?" It is a specific list of 50+ items with pass/fail checks. When a pilot says "cleared for takeoff," they mean every item on that checklist was verified. That is what test metrics give your release decision — a verifiable, documented basis for confidence.*
        `
      }
    ]
  },
  sql: {
    id: 'sql',
    levels: [

      // ─── BEGINNER ───────────────────────────────────────────────────────────

      {
        id: 'sql-what-is-db',
        title: 'Beginner: What is a Database?',
        analogy: "A database is like a magical filing cabinet that never loses a single paper, can find any document in milliseconds, and doesn't set the office on fire when you put two things in the wrong drawer.",
        lessonMarkdown: `
## What is a Database?

Before you write a single line of SQL, you need to understand what you're actually talking to. A database is an **organised collection of structured data stored electronically**. It is not a spreadsheet. It is not a bunch of files in a folder. It is a purpose-built system designed to store, retrieve, and manage data at scale — from 10 rows to 10 billion rows.

---

### 1. Why Not Just Use Excel?

*💡 Analogy: Excel is a notepad on your kitchen counter. A database is a fully automated warehouse with robots, security guards, and a barcode scanner on every item.*

You could technically store user data in an Excel file. But the moment you have:
- **10,000 users** logging in at the same time
- **Multiple apps** trying to read and write simultaneously
- **Relationships** between data (orders linked to users linked to products)
- A need to **not lose data** if the server crashes

...Excel will collapse in a heap and cry. Databases are built for all of this.

**Real Example:** Amazon's database handles over **1.6 million orders per day**. Imagine that in Excel. Your laptop would achieve liftoff.

---

### 2. Tables, Rows, and Columns — The Holy Trinity

*💡 Analogy: A table is a spreadsheet. A column is the header at the top ("Name", "Age", "Email"). A row is one specific person's data filling in those headers.*

Every database is made up of **tables**. Think of a table as a single, focused topic — one table for Users, one for Products, one for Orders.

Each table has:

| Concept | What it means | Real example |
|---|---|---|
| **Table** | A collection of related data | The \`users\` table |
| **Column** | A specific attribute/field | \`first_name\`, \`email\`, \`age\` |
| **Row** | One complete record | One specific user's data |
| **Cell** | One value at the intersection | "Priya" in the \`first_name\` column |

**Example — The \`users\` table:**

\`\`\`
| id | first_name | last_name | email               | age |
|----|------------|-----------|---------------------|-----|
|  1 | Priya      | Sharma    | priya@test.com      |  28 |
|  2 | Marcus     | Webb       | marcus@test.com     |  34 |
|  3 | Ayesha     | Khan       | ayesha@test.com     |  22 |
\`\`\`

That's it. A table is just organised rows and columns — like a spreadsheet — but with superpowers.

---

### 3. The Primary Key — Every Row's Unique ID

*💡 Analogy: Your Aadhaar number / Passport number. There are a billion people in India, some with the same name, same city, same birthday. Your government-issued number is what makes YOU uniquely you.*

Every table has a special column called the **Primary Key**. It is a value that:
- Is **unique** — no two rows can have the same value
- Is **never null** — every row must have one
- Is used to **identify** a specific record precisely

In the table above, \`id\` is the primary key. Even if two users are both named "Priya Sharma", they will have different \`id\` values (1 and 47, for example), so the database can tell them apart with zero confusion.

\`\`\`sql
-- Creating a table with a primary key
CREATE TABLE users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50),
  email      VARCHAR(100)
);
\`\`\`

The \`AUTO_INCREMENT\` part means the database will automatically assign the next available number (1, 2, 3...) so you never have to think about it.

---

### 4. What is a Relational Database?

*💡 Analogy: Imagine a hospital. There's a Patients file, a Doctors file, and an Appointments file. You don't photocopy the patient's full details into the appointments folder — you just write their patient ID. That ID is the link. That's exactly how relational databases work.*

A **Relational Database** stores data in multiple tables that are **linked to each other** using keys. This is important because:

- You don't want to repeat data (storing the full user profile in every single order row)
- You don't want data to go out of sync (if user changes email, you'd have to update it in 1,000 order rows)

Instead, you store the user's data once in the \`users\` table, and in the \`orders\` table you just reference their \`user_id\`.

\`\`\`
users table:          orders table:
id | name             id | user_id | product
---+-------           ---+---------+--------
 1 | Priya             1 |       1 | Laptop
 2 | Marcus            2 |       1 | Mouse
                       3 |       2 | Keyboard
\`\`\`

Priya's name is stored **once**. Both of her orders simply reference \`user_id = 1\`. Clean, efficient, and impossible to get out of sync.

---

### 5. Popular Database Systems You'll Encounter

You don't "install SQL" — SQL is a **language**. The things you install are database management systems (DBMS) that speak SQL:

| Database | Who uses it | Fun fact |
|---|---|---|
| **MySQL** | Most web apps, WordPress | Free, open-source, used by Facebook at one point |
| **PostgreSQL** | Startups, serious applications | Free, extremely powerful, the community's favourite |
| **SQLite** | Mobile apps, testing | So lightweight it runs inside your app file |
| **SQL Server** | Enterprise / Microsoft shops | Comes with a price tag and a sales rep |
| **Oracle** | Banks, airlines, governments | Also comes with a price tag and a lawsuit |

As a QA engineer, you will mostly be writing **SELECT queries** to validate data. You'll use the same syntax across all of them with minor differences.

---

### 6. What is SQL?

*💡 Analogy: SQL is the language you speak to the database. It's like learning to speak to a genie. The genie is incredibly powerful, but also incredibly literal. You must phrase your wish EXACTLY right, or you'll get something completely unexpected.*

**SQL** stands for **Structured Query Language** (pronounced "sequel" or "S-Q-L", both are fine — just don't start a war about it in the office).

It is the **universal language** for talking to relational databases. You use it to:

| Action | SQL Command |
|---|---|
| **Read** data | \`SELECT\` |
| **Add** new data | \`INSERT\` |
| **Change** existing data | \`UPDATE\` |
| **Remove** data | \`DELETE\` |
| **Create** a table | \`CREATE TABLE\` |

As a QA engineer, you will use SQL to:
- **Verify** that after a user signs up, their row is correctly created in the database
- **Check** that a deleted record is actually gone
- **Investigate** bugs by looking directly at the raw data
- **Set up** test data before running automated tests
        `
      },

      {
        id: 'sql-select',
        title: 'Beginner: The SELECT Statement',
        analogy: "SELECT is like placing an order at a restaurant. You're telling the database exactly what you want, from which table, and the database is the kitchen that delivers it.",
        lessonMarkdown: `
## The SELECT Statement — Asking the Database for Data

The \`SELECT\` statement is the **most important SQL command you will ever learn**. It is how you read data from a database. It never modifies, deletes, or creates anything. It is purely a question — and the database answers it.

---

### 1. The Basic Structure

*💡 Analogy: Think of it like ordering food. "I want [the burger] from [the menu]." = "SELECT [column] FROM [table]."*

\`\`\`sql
SELECT column1, column2
FROM table_name;
\`\`\`

**Real example** — Get the first name and email of all users:
\`\`\`sql
SELECT first_name, email
FROM users;
\`\`\`

**Result:**
\`\`\`
| first_name | email           |
|------------|-----------------|
| Priya      | priya@test.com  |
| Marcus     | marcus@test.com |
| Ayesha     | ayesha@test.com |
\`\`\`

The database ignores everything else (age, last name, id) and gives you only what you asked for. Polite and efficient.

---

### 2. SELECT * — The "Give Me Everything" Mode

*💡 Analogy: Walking into a restaurant and saying "Just bring me one of everything." The kitchen panics, your table collapses, and the bill arrives in 40 minutes. Use with caution.*

The asterisk \`*\` is a wildcard that means "all columns":

\`\`\`sql
SELECT *
FROM users;
\`\`\`

**Result:**
\`\`\`
| id | first_name | last_name | email           | age |
|----|------------|-----------|-----------------|-----|
|  1 | Priya      | Sharma    | priya@test.com  |  28 |
|  2 | Marcus     | Webb      | marcus@test.com |  34 |
|  3 | Ayesha     | Khan      | ayesha@test.com |  22 |
\`\`\`

✅ **Use \`SELECT *\`** for quick exploration and debugging.

❌ **Avoid \`SELECT *\`** in production code — it pulls unnecessary data, wastes bandwidth, and if someone adds a new column (like \`password_hash\`), your query suddenly returns sensitive data.

---

### 3. Giving Columns Nicknames with AS (Aliases)

*💡 Analogy: Your name is "Venkataraman Krishnaswamy" but at work everyone calls you "VK". The alias is just a friendlier label for the same thing.*

You can rename columns in your output using \`AS\`:

\`\`\`sql
SELECT
  first_name AS name,
  email      AS contact_email
FROM users;
\`\`\`

**Result:**
\`\`\`
| name   | contact_email   |
|--------|-----------------|
| Priya  | priya@test.com  |
| Marcus | marcus@test.com |
\`\`\`

The database column is still called \`first_name\` — the alias is just cosmetic for the output. Super useful when columns have ugly technical names like \`usr_frst_nm_v2\`.

---

### 4. SELECT with Expressions — Making the Database Do Maths

*💡 Analogy: Instead of asking the waiter for a burger and then calculating the total yourself, you just ask: "What's my total including 18% GST?" The kitchen does the maths.*

You can put expressions and calculations directly in a SELECT:

\`\`\`sql
SELECT
  first_name,
  age,
  age + 10   AS age_in_ten_years,
  age * 2    AS double_age
FROM users;
\`\`\`

**Result:**
\`\`\`
| first_name | age | age_in_ten_years | double_age |
|------------|-----|------------------|------------|
| Priya      |  28 |               38 |         56 |
| Marcus     |  34 |               44 |         68 |
| Ayesha     |  22 |               32 |         44 |
\`\`\`

The database computed those new columns on the fly. No extra storage, just instant maths.

---

### 5. SELECT DISTINCT — Remove Duplicates

*💡 Analogy: You have a guest list where "Priya" appears 3 times because she RSVPed from 3 different email addresses. DISTINCT only lets one "Priya" through the door.*

\`\`\`sql
SELECT DISTINCT city
FROM users;
\`\`\`

Without DISTINCT, if 500 users live in Mumbai, you get "Mumbai" listed 500 times. With DISTINCT, you get it once.

**Practical QA use case:** Check how many unique statuses exist in an \`orders\` table:
\`\`\`sql
SELECT DISTINCT status
FROM orders;
\`\`\`

Result: \`pending\`, \`shipped\`, \`delivered\`, \`cancelled\` — and if you also see \`DELIVERED\` (capital letters), that's a data inconsistency bug worth reporting.

---

### 6. SELECT with String Concatenation

*💡 Analogy: You have a first name box and a last name box. You want a full name. You glue them together.*

\`\`\`sql
-- MySQL / SQLite
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;

-- PostgreSQL
SELECT first_name || ' ' || last_name AS full_name
FROM users;
\`\`\`

**Result:**
\`\`\`
| full_name     |
|---------------|
| Priya Sharma  |
| Marcus Webb   |
| Ayesha Khan   |
\`\`\`

---

### 7. The Golden Rules of SELECT

| Rule | Why it matters |
|---|---|
| Always specify column names in production | Prevents accidental data leaks |
| Use aliases for clarity | Makes output readable for non-technical stakeholders |
| SELECT does not modify data | Safe to run SELECT anytime on production |
| Semicolon ends the statement | Some tools require it, some don't — always include it |
        `
      },

      {
        id: 'sql-where',
        title: 'Beginner: Filtering with WHERE',
        analogy: "WHERE is the bouncer at the club door. Without it, everyone gets in. With it, you set exact rules — 'Only people over 21 wearing blue shoes who work in tech.' The database enforces every rule with robotic precision.",
        lessonMarkdown: `
## The WHERE Clause — Filtering Your Data

If \`SELECT\` decides **which columns** you get, \`WHERE\` decides **which rows** you get. It is the most powerful tool for pinpointing exactly the data you need.

Without \`WHERE\`, a table with 50 million rows returns 50 million rows. Your computer stops speaking to you.

---

### 1. Basic WHERE Syntax

*💡 Analogy: You're looking for your friend Priya at a party with 500 people. "WHERE name = Priya" is you asking the bouncer to bring only Priya to you.*

\`\`\`sql
SELECT first_name, email
FROM users
WHERE age > 25;
\`\`\`

**Result:**
\`\`\`
| first_name | email           |
|------------|-----------------|
| Priya      | priya@test.com  |  -- age 28 ✅
| Marcus     | marcus@test.com |  -- age 34 ✅
                                 -- Ayesha (age 22) is excluded ❌
\`\`\`

---

### 2. Comparison Operators — The Bouncer's Rulebook

*💡 Analogy: The bouncer doesn't just check age. They check shoe type, guest list membership, and whether you're wearing that awful printed shirt. Each rule is an operator.*

| Operator | Meaning | Example |
|---|---|---|
| \`=\` | Equal to | \`WHERE status = 'active'\` |
| \`!=\` or \`<>\` | Not equal | \`WHERE status != 'deleted'\` |
| \`>\` | Greater than | \`WHERE age > 18\` |
| \`<\` | Less than | \`WHERE price < 1000\` |
| \`>=\` | Greater than or equal | \`WHERE score >= 50\` |
| \`<=\` | Less than or equal | \`WHERE age <= 65\` |

**QA Example:** Check if any orders slipped through with a negative price (a classic bug):
\`\`\`sql
SELECT id, product_name, price
FROM orders
WHERE price < 0;
\`\`\`

If this returns ANY rows — that's a bug. File it immediately.

---

### 3. AND / OR — Combining Multiple Conditions

*💡 Analogy: AND is your strict parent: "You can go out IF your homework is done AND IF you're home by 10pm." OR is your cool aunt: "You can have cake if it's your birthday OR if it's a Tuesday."*

**AND — Both conditions must be true:**
\`\`\`sql
SELECT first_name, age, city
FROM users
WHERE age > 18
  AND city = 'Mumbai';
\`\`\`
Only returns users who are **both** over 18 **and** from Mumbai. Marcus, 25, from Delhi? Sorry, not making the cut.

**OR — At least one condition must be true:**
\`\`\`sql
SELECT first_name, status
FROM orders
WHERE status = 'pending'
   OR status = 'failed';
\`\`\`
Returns orders that are either pending **or** failed — useful for finding all "needs attention" orders in one go.

**Combining AND + OR (use brackets!):**
\`\`\`sql
SELECT *
FROM users
WHERE (city = 'Mumbai' OR city = 'Delhi')
  AND age > 21;
\`\`\`

⚠️ **Always use brackets when mixing AND and OR.** Without them, operator precedence can give you completely wrong results — like a maths equation without brackets.

---

### 4. IN — The VIP List

*💡 Analogy: Instead of telling the bouncer "Let in Sarah, OR let in John, OR let in Marcus, OR let in Priya..." you just hand them a VIP list. That's IN.*

\`\`\`sql
-- Without IN (messy):
WHERE city = 'Mumbai' OR city = 'Delhi' OR city = 'Bangalore'

-- With IN (clean):
WHERE city IN ('Mumbai', 'Delhi', 'Bangalore')
\`\`\`

**QA use case** — Check if any user has an invalid role that shouldn't exist:
\`\`\`sql
SELECT id, username, role
FROM users
WHERE role NOT IN ('admin', 'editor', 'viewer', 'guest');
\`\`\`
If this returns rows, someone assigned a role that isn't in the approved list. Data integrity bug!

---

### 5. BETWEEN — A Range Filter

*💡 Analogy: "I want to see all users who signed up between January and March." You don't list every single date — you just give the start and end.*

\`\`\`sql
SELECT first_name, age
FROM users
WHERE age BETWEEN 20 AND 30;
\`\`\`

**Important:** \`BETWEEN\` is **inclusive** — it includes both the start (20) and end (30) values.

\`\`\`sql
-- Works with dates too
SELECT order_id, amount
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
\`\`\`

---

### 6. LIKE — Pattern Matching (The Wildcard Search)

*💡 Analogy: You're looking for a contact in your phone but you only remember their name starts with "Sri". LIKE is the search bar that says "show me everyone whose name begins with Sri%".*

\`\`\`sql
SELECT first_name, email
FROM users
WHERE email LIKE '%@gmail.com';
\`\`\`

**The two wildcards:**

| Wildcard | Means | Example |
|---|---|---|
| \`%\` | Zero or more of any character | \`'%gmail%'\` matches anything containing "gmail" |
| \`_\` | Exactly one character | \`'_iya'\` matches "Riya", "Priya" ❌ (too long), but "Diya" ✅ |

\`\`\`sql
-- Find all users whose name starts with 'A'
WHERE first_name LIKE 'A%'

-- Find emails that don't look like emails (missing @)
WHERE email NOT LIKE '%@%'
\`\`\`

The second example is a great data quality check — if an email doesn't contain "@", it was never a valid email address and the validation is broken.

---

### 7. IS NULL — Finding the Missing Values

*💡 Analogy: NULL is not zero. NULL is not an empty string. NULL is the database equivalent of a sticky note that says "we have no information about this at all." You can't use = to find it — you need IS NULL.*

\`\`\`sql
-- WRONG ❌ — this will NEVER return any rows
WHERE phone_number = NULL

-- CORRECT ✅
WHERE phone_number IS NULL
\`\`\`

**QA check** — Are there any user accounts missing an email address?
\`\`\`sql
SELECT id, first_name
FROM users
WHERE email IS NULL;
\`\`\`

If users can register without an email and your system requires it later, you've found a validation gap.

\`\`\`sql
-- Or find rows that DO have a value
WHERE email IS NOT NULL
\`\`\`

---

### 8. WHERE in Action — A QA Test Scenario

You're testing an e-commerce app. After a checkout test, verify the database:

\`\`\`sql
-- 1. Did the order actually get created?
SELECT *
FROM orders
WHERE user_id = 42
  AND status = 'pending'
  AND created_at >= '2024-11-01';

-- 2. Is the price correct (not negative, not zero)?
SELECT id, amount
FROM orders
WHERE amount <= 0;

-- 3. Are there orphan orders with no matching user?
SELECT o.id, o.user_id
FROM orders o
WHERE o.user_id NOT IN (SELECT id FROM users);
\`\`\`

These three queries would catch: missing order creation, bad price calculation, and referential integrity violations — three completely different categories of bugs, found in seconds.
        `
      },

      {
        id: 'sql-order-limit',
        title: 'Beginner: ORDER BY and LIMIT',
        analogy: "ORDER BY is the database's sorting shelf — tallest to shortest, A to Z, newest to oldest. LIMIT is the velvet rope: even if 10,000 people qualify, only the first 20 get through.",
        lessonMarkdown: `
## ORDER BY and LIMIT — Sorting and Slicing Results

You've learned to ask for data (SELECT) and filter it (WHERE). Now let's learn to **sort** it and **slice** it. These two commands are essential for any real-world query.

---

### 1. ORDER BY — Sorting Your Results

*💡 Analogy: You've found all the trophies in the cabinet. ORDER BY is deciding: do you want them arranged from oldest to newest, or biggest to smallest?*

Without ORDER BY, databases return data in no guaranteed order. The order can change based on internal storage, recent insertions, and the phase of the moon. Never assume data comes back in a specific order unless you explicitly sort it.

\`\`\`sql
SELECT first_name, age
FROM users
ORDER BY age;
\`\`\`

**Result (ascending — smallest first by default):**
\`\`\`
| first_name | age |
|------------|-----|
| Ayesha     |  22 |
| Priya      |  28 |
| Marcus     |  34 |
\`\`\`

---

### 2. ASC and DESC — Which Direction?

*💡 Analogy: ASC is the underdog bracket — the weakest first, strongest last. DESC is the highlight reel — show me the best one first.*

\`\`\`sql
-- Ascending (default — smallest/earliest first)
ORDER BY age ASC

-- Descending (largest/latest first)
ORDER BY age DESC
\`\`\`

**Practical example** — Show the most recently placed orders first:
\`\`\`sql
SELECT id, customer_name, amount, order_date
FROM orders
ORDER BY order_date DESC;
\`\`\`

This is how every admin dashboard "recent orders" list works.

---

### 3. Sorting by Multiple Columns

*💡 Analogy: First sort by surname (A-Z). If two people have the same surname, then sort by first name. You've given the system a tiebreaker.*

\`\`\`sql
SELECT first_name, last_name, city
FROM users
ORDER BY city ASC, last_name ASC;
\`\`\`

**Result:**
\`\`\`
| first_name | last_name | city      |
|------------|-----------|-----------|
| Neha       | Gupta     | Bangalore |
| Rohan      | Kapoor    | Bangalore |
| Priya      | Sharma    | Mumbai    |
| Marcus     | Webb      | Mumbai    |
\`\`\`

Bangalore comes before Mumbai (A < M). Within Bangalore, Gupta comes before Kapoor. Crystal clear hierarchy.

---

### 4. LIMIT — Only Give Me N Rows

*💡 Analogy: You walk into a bookshop and ask for "the 5 most popular books this month." The clerk doesn't hand you every book in the store — they go to the bestseller shelf and bring you exactly 5.*

\`\`\`sql
SELECT first_name, score
FROM users
ORDER BY score DESC
LIMIT 5;
\`\`\`

This returns the **top 5 highest-scoring users**. Without LIMIT, this query on a table with a million users returns a million rows — crashing browsers, exhausting memory, and making your DBA very unhappy.

\`\`\`sql
-- See just the top 10 most expensive orders
SELECT order_id, product, amount
FROM orders
ORDER BY amount DESC
LIMIT 10;
\`\`\`

---

### 5. OFFSET — Skipping Rows (Pagination!)

*💡 Analogy: You're reading search results. Page 1 shows results 1-10. Page 2 shows 11-20. You're not re-searching — you're just skipping the first 10 and showing the next 10. That's OFFSET.*

\`\`\`sql
-- Page 1 — first 10 results
SELECT id, title FROM articles
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- Page 2 — results 11 to 20
SELECT id, title FROM articles
ORDER BY created_at DESC
LIMIT 10 OFFSET 10;

-- Page 3 — results 21 to 30
SELECT id, title FROM articles
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;
\`\`\`

**Formula for any page:** \`OFFSET = (page_number - 1) × rows_per_page\`

Every "Load more" button, every paginated API endpoint, every "Page 2 of 847" you've ever clicked — this is what's running behind it.

---

### 6. QA Testing with ORDER BY and LIMIT

**Test Case 1 — Verify the latest record after an action:**
\`\`\`sql
-- After a user signs up, confirm their row was created correctly
SELECT *
FROM users
ORDER BY created_at DESC
LIMIT 1;
\`\`\`

**Test Case 2 — Find the most expensive order (to verify discount wasn't applied wrong):**
\`\`\`sql
SELECT order_id, user_id, amount, discount_applied
FROM orders
ORDER BY amount DESC
LIMIT 20;
\`\`\`

**Test Case 3 — Find the oldest unresolved bug ticket in a support system:**
\`\`\`sql
SELECT ticket_id, title, created_at
FROM support_tickets
WHERE status = 'open'
ORDER BY created_at ASC
LIMIT 1;
\`\`\`

---

### 7. Common Mistakes

| Mistake | What happens | Fix |
|---|---|---|
| No ORDER BY, assuming fixed order | Results change randomly | Always use ORDER BY for predictable output |
| LIMIT without ORDER BY | You get a random subset | Always sort before limiting |
| OFFSET on huge tables | Very slow on millions of rows | Use cursor-based pagination for large datasets |
| Forgetting DESC | You get the cheapest/oldest, not the most expensive/latest | Double-check sort direction |
        `
      },

      {
        id: 'sql-insert',
        title: 'Beginner: INSERT — Adding Data',
        analogy: "INSERT is filling out a form and clicking Submit. You're telling the database: 'Add this new entry. Here are all the fields. Here are all the values.' The database stamps it with an ID and files it away forever.",
        lessonMarkdown: `
## INSERT INTO — Adding New Data to the Database

You've been reading data with SELECT. Now it's time to **write** data. The \`INSERT INTO\` statement is how you add new rows to a table. This is what runs every time a user creates an account, places an order, or writes a comment.

---

### 1. Basic INSERT Syntax

*💡 Analogy: Filling out a paper form. You specify which fields you're filling in, then write in the values. One form → one row in the database.*

\`\`\`sql
INSERT INTO table_name (column1, column2, column3)
VALUES ('value1', 'value2', 'value3');
\`\`\`

**Real example** — Add a new user:
\`\`\`sql
INSERT INTO users (first_name, last_name, email, age)
VALUES ('Priya', 'Sharma', 'priya@test.com', 28);
\`\`\`

After this runs, a new row appears in the \`users\` table. The \`id\` column auto-increments, so the database assigns it automatically — you don't touch it.

---

### 2. Column Names vs Values — They Must Match

*💡 Analogy: You're addressing a letter. The columns are the envelope fields (To:, From:, Subject:). The values are what you write in each field. Every field must have exactly one matching value, in the same order.*

\`\`\`sql
-- ✅ Correct — 3 columns, 3 matching values
INSERT INTO products (name, price, category)
VALUES ('Wireless Mouse', 599.00, 'Electronics');

-- ❌ Wrong — mismatch will throw an error
INSERT INTO products (name, price, category)
VALUES ('Wireless Mouse', 'Electronics');  -- missing price!
\`\`\`

The column list and the values list must be in **perfect alignment**. The database matches them positionally — first column gets first value, second gets second, and so on.

---

### 3. Inserting Multiple Rows at Once

*💡 Analogy: Instead of filing one form per person, you submit a stack of 5 forms in a single trip to the counter. Same result, much more efficient.*

\`\`\`sql
INSERT INTO users (first_name, email, age)
VALUES
  ('Priya',  'priya@test.com',  28),
  ('Marcus', 'marcus@test.com', 34),
  ('Ayesha', 'ayesha@test.com', 22),
  ('Rohan',  'rohan@test.com',  29);
\`\`\`

One statement, four new rows. Much faster than running four separate INSERT statements — especially useful for setting up test data.

---

### 4. What Happens to Columns You Don't Mention?

*💡 Analogy: You fill in the "Name" and "Email" boxes on a registration form but skip "Phone Number" (it's optional). The form submits successfully — the phone field is just empty (NULL).*

If you don't include a column in your INSERT, the database either:
- Inserts the **default value** (if one is defined) — e.g., status defaults to 'active'
- Inserts **NULL** (if nullable)
- **Throws an error** (if the column is NOT NULL and has no default)

\`\`\`sql
-- Suppose 'status' has a default of 'active'
INSERT INTO users (first_name, email)
VALUES ('Neha', 'neha@test.com');

-- The resulting row:
-- | id | first_name | email          | status | age  |
-- |----|------------|----------------|--------|------|
-- |  4 | Neha       | neha@test.com  | active | NULL |
\`\`\`

---

### 5. Inserting with SELECT (Copy Data)

*💡 Analogy: You have a guest list from last year's conference. You want to invite all VIP guests again. Instead of retyping everyone, you just copy the VIP subset from last year's list into this year's list.*

\`\`\`sql
INSERT INTO premium_users (first_name, email)
SELECT first_name, email
FROM users
WHERE subscription_type = 'premium';
\`\`\`

This copies matching rows from \`users\` directly into \`premium_users\`. No manual typing. No copy-paste errors. SQL handles the loop.

---

### 6. INSERT and Auto-Increment — Where Did My ID Go?

After an INSERT, you often need to know what ID the database assigned to the new row (to use in a follow-up query or verify it was created correctly).

\`\`\`sql
-- MySQL: get the last auto-generated ID
SELECT LAST_INSERT_ID();

-- PostgreSQL: get the ID right from the INSERT
INSERT INTO users (first_name, email)
VALUES ('Rohan', 'rohan@test.com')
RETURNING id;
\`\`\`

**QA tip:** After an INSERT test, always verify with a SELECT:
\`\`\`sql
-- Insert a test order
INSERT INTO orders (user_id, product, amount, status)
VALUES (1, 'Laptop', 75000, 'pending');

-- Immediately verify it's there correctly
SELECT *
FROM orders
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 1;
\`\`\`

---

### 7. Common INSERT Mistakes and Errors

| Error | What caused it | Fix |
|---|---|---|
| \`Duplicate entry '...' for key 'PRIMARY'\` | You tried to insert a row with an ID that already exists | Don't manually specify the ID if it's auto-increment |
| \`Column 'email' cannot be null\` | You skipped a NOT NULL column with no default | Include the column and value in your INSERT |
| \`Data too long for column 'name'\` | Your value exceeds the column's length limit (e.g., VARCHAR(50)) | Shorten the value or increase the column size |
| \`Column count doesn't match value count\` | Mismatch between column list and values list | Count them — they must be equal |

---

### 8. QA Use Case — Setting Up Test Data

One of the most common reasons a QA engineer writes INSERT is to **set up a clean test state**:

\`\`\`sql
-- Create a test user
INSERT INTO users (first_name, last_name, email, role)
VALUES ('Test', 'User', 'testuser_auto@qa.com', 'viewer');

-- Create an order for that user
INSERT INTO orders (user_id, product_name, amount, status)
VALUES (LAST_INSERT_ID(), 'Test Product', 999, 'pending');

-- Verify both were created
SELECT u.first_name, o.product_name, o.status
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.email = 'testuser_auto@qa.com';
\`\`\`

This is test data setup done entirely in SQL — no UI clicking required. Fast, repeatable, and completely predictable.
        `
      },

      {
        id: 'sql-update-delete',
        title: 'Beginner: UPDATE and DELETE',
        analogy: "UPDATE is using correction fluid on a filed document. DELETE is feeding it to the shredder. Both are permanent, both are powerful, and both have caused at least one developer to cry at 2am because they forgot the WHERE clause.",
        lessonMarkdown: `
## UPDATE and DELETE — Modifying and Removing Data

These two commands are the ones that can get you in serious trouble if used carelessly. Unlike SELECT, they **permanently change your database**. There is no Ctrl+Z. Always double-check your WHERE clause before running these.

---

### 1. UPDATE — Changing Existing Data

*💡 Analogy: You're updating a customer's address in their file. You don't throw away the whole file — you just cross out the old address and write the new one in.*

\`\`\`sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
\`\`\`

**Real example** — A user changed their email address:
\`\`\`sql
UPDATE users
SET email = 'priya.new@test.com'
WHERE id = 1;
\`\`\`

Result: Row with \`id = 1\` now has the new email. Everything else about that row is untouched.

---

### 2. The WHERE Clause in UPDATE — The Most Important Thing

*💡 Analogy: Imagine you're updating the salary of "John" in the company database. Without a WHERE clause, EVERY employee in the company gets John's new salary. Hope you work for a generous company.*

\`\`\`sql
-- ✅ Correct — only updates user with id 5
UPDATE users
SET status = 'suspended'
WHERE id = 5;

-- ☠️ CATASTROPHIC — updates EVERY user's status to 'suspended'
UPDATE users
SET status = 'suspended';
\`\`\`

The second query has no WHERE clause. Every single user account in your entire system is now suspended. Production is down. Your phone is ringing. Your manager is typing in all caps.

**Golden Rule:** Before running any UPDATE on production, run the equivalent SELECT first to see exactly which rows you're about to change:
\`\`\`sql
-- Step 1: Check WHAT will be affected
SELECT id, first_name, status
FROM users
WHERE status = 'inactive'
  AND last_login < '2023-01-01';

-- Step 2: If the results look right, run the UPDATE
UPDATE users
SET status = 'archived'
WHERE status = 'inactive'
  AND last_login < '2023-01-01';
\`\`\`

---

### 3. Updating Multiple Columns at Once

\`\`\`sql
UPDATE users
SET
  first_name   = 'Marcus',
  email        = 'marcus.new@test.com',
  updated_at   = NOW()
WHERE id = 2;
\`\`\`

\`NOW()\` is a SQL function that returns the current timestamp. Always update \`updated_at\` when you modify a row — it's how you track when data last changed.

---

### 4. Updating Based on a Calculation

*💡 Analogy: "Give everyone a 10% pay raise." You don't type in each person's new salary — you tell the database to multiply each existing salary by 1.10.*

\`\`\`sql
-- Give all active users +100 bonus points
UPDATE users
SET loyalty_points = loyalty_points + 100
WHERE status = 'active';

-- Apply a 15% discount to all electronics
UPDATE products
SET price = price * 0.85
WHERE category = 'Electronics';
\`\`\`

---

### 5. DELETE — Removing Rows

*💡 Analogy: DELETE is the shredder. Once you put the paper in, it's gone. There's no "undo shred" button. The only way to get the data back is if someone took a photo of it (a database backup).*

\`\`\`sql
DELETE FROM table_name
WHERE condition;
\`\`\`

**Real example** — Remove a test user after testing:
\`\`\`sql
DELETE FROM users
WHERE email = 'testuser_auto@qa.com';
\`\`\`

---

### 6. DELETE Without WHERE — The Horror Show

\`\`\`sql
-- ✅ Deletes one specific user
DELETE FROM users WHERE id = 42;

-- ☠️ Deletes EVERY SINGLE USER in the database
DELETE FROM users;
\`\`\`

This actually happened at a major company. A developer forgot the WHERE clause while trying to clean up test data. The entire production user database was wiped. The company had to restore from a backup that was 6 hours old. Six hours of real user activity — gone. The developer did not come to work the next day.

**Professional habits to prevent this:**
1. Always SELECT first to see what will be affected
2. Use a transaction so you can roll back if something looks wrong
3. Never run DELETE directly on production without a second pair of eyes

---

### 7. TRUNCATE vs DELETE — What's the Difference?

*💡 Analogy: DELETE is removing books from a shelf one by one, checking each title first. TRUNCATE is picking up the entire shelf and throwing it out the window.*

| | \`DELETE\` | \`TRUNCATE\` |
|---|---|---|
| Removes specific rows? | ✅ Yes (with WHERE) | ❌ No — removes ALL |
| Can be rolled back? | ✅ Yes (in a transaction) | ❌ Usually not |
| Speed | Slower (checks each row) | Much faster |
| Resets auto-increment? | ❌ No | ✅ Yes |
| Use case | Cleaning specific data | Resetting a table entirely |

\`\`\`sql
-- Wipe all test data and reset the ID counter
TRUNCATE TABLE test_sessions;
\`\`\`

Use TRUNCATE only when you intentionally want to empty an entire table and are absolutely sure about it.

---

### 8. Soft Delete — The Professional's Delete

*💡 Analogy: When a company "archives" an employee rather than deleting their record. Their badge stops working, they don't show up in the active list, but HR still has all their records for compliance reasons.*

In production systems, you almost **never** actually DELETE rows. Instead, you add a \`deleted_at\` or \`is_deleted\` column and UPDATE it:

\`\`\`sql
-- Soft delete — the row still exists
UPDATE users
SET deleted_at = NOW()
WHERE id = 42;

-- Then all your queries filter out soft-deleted rows
SELECT * FROM users
WHERE deleted_at IS NULL;
\`\`\`

Why? Because:
- You might need to restore the record later
- Regulations (GDPR audit logs) may require keeping records
- Analytics needs historical data
- Foreign key references won't break

**QA implication:** When testing a "Delete Account" feature, always check the database to confirm whether it's a hard delete (row gone) or soft delete (row still there with \`deleted_at\` populated). Both are valid — you just need to test accordingly.

---

### 9. QA Testing UPDATE and DELETE

\`\`\`sql
-- After testing "Update Profile" feature:
SELECT first_name, email, updated_at
FROM users
WHERE id = [test_user_id];
-- Verify: new values are correct, updated_at was refreshed

-- After testing "Cancel Order" feature:
SELECT status, cancelled_at
FROM orders
WHERE id = [test_order_id];
-- Verify: status changed to 'cancelled', cancelled_at was set

-- After testing "Delete Account" feature:
SELECT id, deleted_at
FROM users
WHERE id = [test_user_id];
-- Verify: either row is gone (hard delete) or deleted_at is populated (soft delete)
\`\`\`
        `
      },

      {
        id: 'sql-data-types',
        title: 'Beginner: SQL Data Types',
        analogy: "SQL data types are like labelled storage containers in your kitchen. You don't store soup in a pencil case or keep pencils in a soup pot. Every type of data has a container specifically designed for it — the right shape, the right size, the right material.",
        lessonMarkdown: `
## SQL Data Types — What Kind of Data Are You Storing?

Every column in a database table has a **data type** — a declaration of what kind of information it will hold. This is not optional or cosmetic. The data type determines:
- How much storage space a value takes
- What operations you can do on it (maths, date arithmetic, text search)
- What values are even allowed

Choosing the wrong type causes bugs, wasted storage, and errors that only appear at 2am on a Friday.

---

### 1. Numeric Types

*💡 Analogy: The difference between a ruler (decimals matter, measured to 0.1cm) and a counting jar (you're counting whole marbles — you can't have half a marble).*

| Type | What it stores | Range | Example use |
|---|---|---|---|
| \`INT\` | Whole numbers | -2 billion to +2 billion | User ID, quantity, age |
| \`BIGINT\` | Very large whole numbers | -9 quintillion to +9 quintillion | Order count, timestamps |
| \`SMALLINT\` | Small whole numbers | -32,768 to 32,767 | Rating (1-5), status codes |
| \`DECIMAL(p,s)\` | Exact decimal numbers | Depends on precision | Money, prices, tax rates |
| \`FLOAT\` | Approximate decimals | Large range, imprecise | Scientific measurements |

**The critical rule about money:**

\`\`\`sql
-- ❌ NEVER store money as FLOAT
price FLOAT   -- 19.99 might actually be stored as 19.990000000000002

-- ✅ Always use DECIMAL for money
price DECIMAL(10, 2)  -- Exactly 19.99, always
\`\`\`

Why? Floating-point maths is approximate. When you add up 1,000 orders at FLOAT precision, you might get £8,999.97 instead of £9,000.00. Banks don't appreciate that.

\`\`\`sql
-- Create a products table with proper numeric types
CREATE TABLE products (
  id       INT           PRIMARY KEY AUTO_INCREMENT,
  quantity INT           NOT NULL DEFAULT 0,
  price    DECIMAL(10,2) NOT NULL,
  rating   DECIMAL(3,1)  -- e.g., 4.5
);
\`\`\`

---

### 2. String / Text Types

*💡 Analogy: VARCHAR is a stretchy rubber band — it only uses as much space as the text inside it. CHAR is a rigid box — it's always the same size whether you fill it or not.*

| Type | What it stores | When to use |
|---|---|---|
| \`VARCHAR(n)\` | Variable-length text, up to n chars | Names, emails, titles |
| \`CHAR(n)\` | Fixed-length text, always n chars | Country codes ('IN', 'US'), fixed codes |
| \`TEXT\` | Large text, no fixed limit | Blog posts, descriptions, comments |
| \`ENUM\` | One value from a predefined list | Status fields, categories |

\`\`\`sql
CREATE TABLE users (
  id           INT           PRIMARY KEY AUTO_INCREMENT,
  first_name   VARCHAR(50)   NOT NULL,
  country_code CHAR(2),               -- 'IN', 'US', 'GB' — always 2 chars
  bio          TEXT,                  -- unlimited text
  role         ENUM('admin','editor','viewer') DEFAULT 'viewer'
);
\`\`\`

**ENUM is particularly useful for QA** — if a column is ENUM('pending','shipped','delivered'), the database will literally refuse to accept 'DELIVERED' or 'Pending' or 'shipped!' with a typo. It enforces data integrity at the schema level.

---

### 3. Date and Time Types

*💡 Analogy: There's a huge difference between "the date of your birthday" (just the day, no time), "the exact moment the rocket launched" (date + time + timezone), and "how long the race took" (a duration, not a point in time).*

| Type | Stores | Format | Example |
|---|---|---|---|
| \`DATE\` | Just a date | YYYY-MM-DD | 1998-05-14 |
| \`TIME\` | Just a time | HH:MM:SS | 09:30:00 |
| \`DATETIME\` | Date + time, no timezone | YYYY-MM-DD HH:MM:SS | 2024-11-01 14:30:00 |
| \`TIMESTAMP\` | Date + time, timezone-aware | Same format | 2024-11-01 14:30:00 |

\`\`\`sql
CREATE TABLE orders (
  id           INT       PRIMARY KEY AUTO_INCREMENT,
  order_date   DATE      NOT NULL,        -- '2024-11-01'
  created_at   TIMESTAMP DEFAULT NOW(),   -- auto-set to current date+time
  updated_at   TIMESTAMP DEFAULT NOW() ON UPDATE NOW()  -- auto-updated
);
\`\`\`

**Date arithmetic is very powerful:**
\`\`\`sql
-- Find orders placed in the last 30 days
SELECT * FROM orders
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- How old is each user?
SELECT first_name, DATEDIFF(NOW(), date_of_birth) / 365 AS age_years
FROM users;
\`\`\`

---

### 4. Boolean Type

*💡 Analogy: A light switch. It's either on (TRUE / 1) or off (FALSE / 0). There's no "sort of on" — that's NULL's job.*

\`\`\`sql
-- MySQL uses TINYINT(1) for boolean
is_active  TINYINT(1) DEFAULT 1   -- 1 = true, 0 = false

-- PostgreSQL has a native BOOLEAN type
is_verified BOOLEAN DEFAULT FALSE
\`\`\`

\`\`\`sql
-- Find all active premium users
SELECT first_name FROM users
WHERE is_active = 1
  AND is_premium = 1;
\`\`\`

**Common QA check:** After a "Verify Email" flow, confirm the flag was set:
\`\`\`sql
SELECT email, is_email_verified
FROM users
WHERE email = 'testuser@qa.com';
-- Expected: is_email_verified = 1
\`\`\`

---

### 5. NULL — The Mysterious Absence of Data

*💡 Analogy: NULL is not zero. It's not an empty string. NULL is the database's way of saying "we have absolutely no information about this." It's the difference between a person who owns £0 and a person who has never been asked how much they own.*

\`\`\`sql
SELECT 5 + NULL;    -- Result: NULL (not 5!)
SELECT NULL = NULL; -- Result: NULL (not TRUE!)
SELECT NULL != NULL;-- Result: NULL (not TRUE!)
\`\`\`

NULL is like a black hole — any operation involving NULL returns NULL. This trips up almost every beginner.

\`\`\`sql
-- You can NOT do this:
WHERE phone_number = NULL   -- ❌ Always returns nothing

-- You must do this:
WHERE phone_number IS NULL  -- ✅
WHERE phone_number IS NOT NULL -- ✅
\`\`\`

---

### 6. Choosing the Right Type — A Quick Guide

| You're storing... | Use this |
|---|---|
| User ID, order number | \`INT\` or \`BIGINT\` |
| Price, money | \`DECIMAL(10,2)\` |
| First name, email | \`VARCHAR(100)\` |
| Country code ('IN') | \`CHAR(2)\` |
| Blog post content | \`TEXT\` |
| Status (pending/active) | \`ENUM\` or \`VARCHAR\` |
| Date of birth | \`DATE\` |
| Exact timestamp of action | \`TIMESTAMP\` |
| Yes/No flag | \`BOOLEAN\` or \`TINYINT(1)\` |

---

### 7. QA Implications of Data Types

As a QA engineer, data types tell you **exactly what the system should and shouldn't accept**:

\`\`\`sql
-- If age is INT, what happens when you submit 'twenty-five' in the form?
-- The DB will reject it — but does the app show a nice error?

-- If email is VARCHAR(100), what happens with a 200-character email?
-- Either the DB truncates it (silent data loss!) or throws an error.

-- If price is DECIMAL(8,2), can it store 9999999.99?
-- Yes. Can it store 10000000.00? No — that's 10 digits before the decimal.
\`\`\`

Understanding data types means you can design better boundary value tests directly targeting the database's actual limits.
        `
      },

      {
        id: 'sql-aggregations',
        title: 'Beginner: COUNT, SUM, AVG, MIN, MAX',
        analogy: "Aggregate functions are the database's calculator, accountant, and statistician rolled into one. Instead of giving you every single row, they crunch the numbers and hand you the summary — like an exam that shows your final grade, not every mark from every question.",
        lessonMarkdown: `
## Aggregate Functions — Summarising Data

So far you've been fetching individual rows. Aggregate functions change the game: instead of returning rows, they **summarise** data and return a single calculated value. These are the backbone of every dashboard, report, and analytics page you'll ever test.

---

### 1. COUNT — How Many?

*💡 Analogy: You're a teacher and you want to know how many students submitted their homework. You don't read every homework — you just count the pile.*

\`\`\`sql
-- How many users are in the database?
SELECT COUNT(*) AS total_users
FROM users;
\`\`\`
Result: \`| total_users | 3847 |\`

\`COUNT(*)\` counts every row, including ones with NULL values.
\`COUNT(column)\` counts only rows where that column is NOT NULL.

\`\`\`sql
-- How many users have a phone number? (i.e., phone is not NULL)
SELECT COUNT(phone_number) AS users_with_phone
FROM users;

-- How many users DON'T have a phone number?
SELECT COUNT(*) - COUNT(phone_number) AS users_without_phone
FROM users;
\`\`\`

**QA use case:** After a bulk import of 500 records, verify exactly 500 were created:
\`\`\`sql
SELECT COUNT(*) FROM users
WHERE created_at >= '2024-11-01 09:00:00'
  AND created_at <= '2024-11-01 09:05:00';
-- Expected: 500
\`\`\`

---

### 2. SUM — What's the Total?

*💡 Analogy: At the end of the day, the cashier doesn't count individual coins — they just total the register. SUM is the register total.*

\`\`\`sql
-- Total revenue from all completed orders
SELECT SUM(amount) AS total_revenue
FROM orders
WHERE status = 'delivered';
\`\`\`
Result: \`| total_revenue | 4872659.50 |\`

\`\`\`sql
-- Total items in a specific order
SELECT SUM(quantity) AS total_items
FROM order_items
WHERE order_id = 101;
\`\`\`

**QA use case:** After applying a 10% discount to a cart, verify the maths:
\`\`\`sql
SELECT
  SUM(amount)              AS original_total,
  SUM(amount * 0.90)       AS discounted_total,
  SUM(amount - discounted_amount) AS total_discount_applied
FROM order_items
WHERE order_id = 202;
\`\`\`

---

### 3. AVG — What's the Average?

*💡 Analogy: Your school gives out report cards. AVG is the teacher calculating the class average score so they know whether the exam was too hard or too easy — not reading every student's individual score.*

\`\`\`sql
-- Average order value
SELECT AVG(amount) AS avg_order_value
FROM orders;

-- Average rating of a product
SELECT AVG(rating) AS avg_rating
FROM product_reviews
WHERE product_id = 55;
\`\`\`

⚠️ **AVG ignores NULL values.** If 10 users have ratings (7, 8, 9...) and 5 users have NULL (didn't rate), AVG only divides by 10, not 15. This is usually correct but worth knowing.

\`\`\`sql
-- Average age of active users
SELECT AVG(age) AS avg_age
FROM users
WHERE status = 'active';
\`\`\`

---

### 4. MIN and MAX — Extremes

*💡 Analogy: MIN is finding the shortest student in the class. MAX is finding the tallest. You don't care about the ones in the middle — you want the extremes.*

\`\`\`sql
-- Cheapest and most expensive product
SELECT
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive
FROM products
WHERE is_available = 1;

-- Earliest and latest order dates
SELECT
  MIN(order_date) AS first_order_ever,
  MAX(order_date) AS most_recent_order
FROM orders;
\`\`\`

**QA use case:** Check if any order slipped through with an impossible price:
\`\`\`sql
SELECT MIN(amount), MAX(amount) FROM orders;
-- If MIN is negative or 0 — data integrity bug!
-- If MAX is unrealistically huge — someone entered 999999 by mistake
\`\`\`

---

### 5. GROUP BY — Aggregate Per Category

*💡 Analogy: You have 1000 receipts from different cities. GROUP BY is sorting them into city piles first, then running SUM on each pile separately. You get one total per city, not one total for everything.*

This is where aggregates get truly powerful:

\`\`\`sql
-- How many orders per status?
SELECT status, COUNT(*) AS order_count
FROM orders
GROUP BY status;
\`\`\`

**Result:**
\`\`\`
| status    | order_count |
|-----------|-------------|
| pending   |         142 |
| shipped   |         891 |
| delivered |        3201 |
| cancelled |          87 |
\`\`\`

\`\`\`sql
-- Total revenue per city
SELECT city, SUM(o.amount) AS city_revenue
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY city
ORDER BY city_revenue DESC;
\`\`\`

---

### 6. HAVING — Filter After Grouping

*💡 Analogy: WHERE filters the data BEFORE the calculation. HAVING filters AFTER. It's like checking salaries BEFORE vs AFTER tax — very different results.*

\`\`\`sql
-- WHERE filters individual rows (BEFORE grouping)
-- HAVING filters groups (AFTER grouping)

-- Find cities where total revenue exceeds ₹1,000,000
SELECT city, SUM(amount) AS revenue
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY city
HAVING SUM(amount) > 1000000;
\`\`\`

\`\`\`sql
-- Find products with an average rating below 3 (potential quality issues)
SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
FROM reviews
GROUP BY product_id
HAVING AVG(rating) < 3
   AND COUNT(*) > 10;  -- only flag products with enough reviews to be meaningful
\`\`\`

---

### 7. Combining All Aggregates Together

\`\`\`sql
-- Complete sales report per product category
SELECT
  category,
  COUNT(*)            AS total_orders,
  SUM(amount)         AS total_revenue,
  AVG(amount)         AS avg_order_value,
  MIN(amount)         AS smallest_order,
  MAX(amount)         AS largest_order
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE o.status = 'delivered'
  AND o.order_date >= '2024-01-01'
GROUP BY category
ORDER BY total_revenue DESC;
\`\`\`

This single query generates a complete summary dashboard — per category, for delivered orders, in 2024, sorted by revenue. One query. No spreadsheets. No manual counting.

---

### 8. QA Validation Queries Using Aggregates

\`\`\`sql
-- After an import job: were exactly 1000 records inserted?
SELECT COUNT(*) FROM products WHERE imported_batch = 'NOV2024';

-- After checkout: is the order total correct?
SELECT SUM(unit_price * quantity) AS calculated_total
FROM order_items WHERE order_id = 303;
-- Compare this to orders.total_amount for the same order_id

-- Are any category averages unexpectedly 0?
SELECT category, AVG(price) FROM products GROUP BY category;

-- Find categories with suspiciously high max prices (data entry errors)
SELECT category, MAX(price) FROM products
GROUP BY category
HAVING MAX(price) > 500000;
\`\`\`

These queries take seconds to write and can catch data errors that would take hours to find by clicking through a UI.
        `
      },

      // ─── INTERMEDIATE & EXPERT (kept for continuity) ────────────────────────

      {
        id: 'intermediate',
        title: 'Intermediate: Combining Data with JOINs',
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
