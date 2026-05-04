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

      // ─── INTERMEDIATE ────────────────────────────────────────────────────────

      {
        id: 'sql-joins',
        title: 'Intermediate: JOINs — Connecting Tables',
        analogy: "A database is like a company with different departments: HR keeps names, Finance keeps salaries, IT keeps laptops. A JOIN is the all-access badge that lets you walk between departments and pull info from all of them at once.",
        lessonMarkdown: `
### 1. Why Tables Are Separated
*💡 Analogy: Imagine a restaurant where one notebook has customer names and another has their order history. You don't copy the customer's name into every order row — you just write their customer ID. A JOIN reunites them when you need a full picture.*

Databases split data across multiple tables to avoid duplication (called **normalization**). A \`users\` table stores who the person is. An \`orders\` table stores what they bought. When you need both — the customer's name AND their order — you JOIN the tables on their shared key (\`user_id\`).

\`\`\`sql
-- Tables
users:   id | name       | email
orders:  id | user_id    | product     | amount

-- JOIN them
SELECT users.name, orders.product, orders.amount
FROM orders
INNER JOIN users ON orders.user_id = users.id;
\`\`\`

| name       | product    | amount |
|------------|------------|--------|
| Priya      | Laptop     | 85000  |
| Rohan      | Mouse      | 1200   |

---

### 2. INNER JOIN — Only Perfect Matches
*💡 Analogy: A strict bouncer at a club. You must have BOTH a ticket AND an ID. If you only have one, you stay outside. No exceptions.*

\`INNER JOIN\` returns rows only where a match exists in **both** tables. If a user has never placed an order, they won't appear. If an order has an invalid \`user_id\`, it also won't appear.

\`\`\`sql
SELECT users.name, orders.product
FROM users
INNER JOIN orders ON users.id = orders.user_id;
-- User "Amit" who never ordered: NOT included
\`\`\`

**QA Use Case:** After a test creates orders, verify they're all linked to valid users:
\`\`\`sql
-- If this returns 0 rows, every order has a valid user ✅
SELECT o.id FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;
\`\`\`

---

### 3. LEFT JOIN — Keep Everything from the Left
*💡 Analogy: A class attendance sheet. Every student on the register is listed. If a student didn't show up, their row still exists — the "Present" column just says NULL.*

\`LEFT JOIN\` returns ALL rows from the left table (the one after \`FROM\`), even if there's no matching row in the right table. Missing right-side values appear as \`NULL\`.

\`\`\`sql
SELECT users.name, orders.product
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
\`\`\`

| name       | product    |
|------------|------------|
| Priya      | Laptop     |
| Rohan      | Mouse      |
| Amit       | NULL       |  ← never ordered, but still listed

**QA Use Case:** Find users who registered but never placed an order:
\`\`\`sql
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
\`\`\`

---

### 4. RIGHT JOIN and FULL OUTER JOIN
*💡 Analogy: RIGHT JOIN is LEFT JOIN's mirror twin — same logic, opposite direction. FULL OUTER JOIN is the "nobody gets left behind" option.*

- **RIGHT JOIN** keeps all rows from the RIGHT table, even without a match on the left.
- **FULL OUTER JOIN** keeps everything from both sides. Unmatched rows get NULL on the missing side.

\`\`\`sql
-- Find orders with no matching user (orphaned data — a data integrity bug):
SELECT o.id, o.product, u.name
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;
\`\`\`

---

### 5. Joining Multiple Tables
*💡 Analogy: Connecting flight segments. You fly Delhi → Dubai → London. Each leg connects through a shared airport code.*

\`\`\`sql
-- users → orders → products (3-table join)
SELECT u.name, p.name AS product, oi.quantity
FROM users u
INNER JOIN orders o   ON u.id = o.user_id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE u.id = 42;
\`\`\`

---

### 🧪 QA Validation Queries for JOINs
\`\`\`sql
-- 1. Orphaned orders (user_id references a deleted user)
SELECT * FROM orders WHERE user_id NOT IN (SELECT id FROM users);

-- 2. Users with duplicate email after a migration
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- 3. Orders missing a payment record
SELECT o.id FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE p.id IS NULL;
\`\`\`
        `
      },

      {
        id: 'sql-group-by',
        title: 'Intermediate: GROUP BY and HAVING',
        analogy: "GROUP BY is like sorting your laundry into piles — all shirts together, all socks together. HAVING is the filter you apply AFTER sorting: 'show me only the piles with more than 5 items'.",
        lessonMarkdown: `
### 1. Why GROUP BY Exists
*💡 Analogy: You have 10,000 sales receipts scattered on a table. GROUP BY sweeps them into neat piles by city. Then COUNT tells you how many are in each pile.*

Without GROUP BY, aggregate functions like \`COUNT()\`, \`SUM()\`, \`AVG()\` operate on the entire table. GROUP BY lets you split the table into logical groups and apply those functions to each group separately.

\`\`\`sql
-- Total revenue per product category
SELECT category, SUM(price) AS total_revenue
FROM orders
GROUP BY category;
\`\`\`

| category    | total_revenue |
|-------------|---------------|
| Electronics | 240000        |
| Clothing    | 58000         |
| Books       | 12000         |

---

### 2. The SQL Execution Order (Critical!)
*💡 Analogy: You can't frost a cake before baking it. SQL has a strict order of operations — WHERE filters raw ingredients BEFORE they go in the oven (GROUP BY).*

Understanding why you CAN'T use aggregate functions in WHERE:

| Step | Clause | What Happens |
|------|--------|--------------|
| 1 | FROM | Get all rows from tables |
| 2 | WHERE | Filter individual rows |
| 3 | GROUP BY | Collapse rows into groups |
| 4 | HAVING | Filter the groups |
| 5 | SELECT | Pick columns |
| 6 | ORDER BY | Sort results |

\`\`\`sql
-- ❌ WRONG — can't use COUNT() in WHERE
SELECT category, COUNT(*) FROM orders
WHERE COUNT(*) > 10 GROUP BY category;

-- ✅ CORRECT — use HAVING after GROUP BY
SELECT category, COUNT(*) AS total_orders
FROM orders
GROUP BY category
HAVING COUNT(*) > 10;
\`\`\`

---

### 3. HAVING — The WHERE for Groups
*💡 Analogy: WHERE is the security guard at the entrance who checks IDs. HAVING is the manager inside who checks if enough staff showed up for each shift before opening that section.*

\`HAVING\` filters groups **after** they are formed. You can use aggregate functions inside HAVING.

\`\`\`sql
-- Find products ordered more than 50 times this month
SELECT product_id, COUNT(*) AS order_count
FROM order_items
WHERE created_at >= '2025-04-01'
GROUP BY product_id
HAVING COUNT(*) > 50
ORDER BY order_count DESC;
\`\`\`

---

### 4. Combining WHERE and HAVING
*💡 Analogy: WHERE is your pre-filter ("only consider active users"), and HAVING is your post-filter ("of those, show me only the groups that ordered 3+ times").*

\`\`\`sql
SELECT u.city, COUNT(o.id) AS orders_placed
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.is_active = 1          -- pre-filter: only active users
GROUP BY u.city
HAVING COUNT(o.id) >= 5        -- post-filter: only busy cities
ORDER BY orders_placed DESC;
\`\`\`

---

### 5. All Aggregate Functions at a Glance
\`\`\`sql
SELECT
  category,
  COUNT(*)              AS total_rows,
  COUNT(DISTINCT user_id) AS unique_buyers,
  SUM(amount)           AS total_revenue,
  AVG(amount)           AS avg_order_value,
  MIN(amount)           AS cheapest_order,
  MAX(amount)           AS most_expensive
FROM orders
GROUP BY category;
\`\`\`

---

### 🧪 QA Validation Queries Using GROUP BY
\`\`\`sql
-- 1. Find duplicate usernames (should be 0 rows in a healthy DB)
SELECT username, COUNT(*) FROM users
GROUP BY username HAVING COUNT(*) > 1;

-- 2. Products with suspiciously high return rates
SELECT product_id, COUNT(*) AS returns
FROM returns
GROUP BY product_id
HAVING COUNT(*) > 10
ORDER BY returns DESC;

-- 3. Verify each order has exactly 1 payment
SELECT order_id, COUNT(*) AS payment_count
FROM payments
GROUP BY order_id
HAVING COUNT(*) <> 1;
\`\`\`
        `
      },

      {
        id: 'sql-subqueries',
        title: 'Intermediate: Subqueries and Nested Queries',
        analogy: "A subquery is like a research assistant. You ask your assistant to find the average salary first, then you use their answer to ask a bigger question. The assistant's answer lives inside parentheses — the boss query reads it and acts on it.",
        lessonMarkdown: `
### 1. What Is a Subquery?
*💡 Analogy: You ask a friend: "Is this restaurant more expensive than the average Bangalore restaurant?" Before answering, your friend has to calculate the average first. That internal calculation is a subquery.*

A subquery is a SELECT statement **nested inside another query**. The database runs the inner query first, gets a result, and uses that result in the outer query.

\`\`\`sql
-- Find all employees earning above company average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

The inner query \`(SELECT AVG(salary) FROM employees)\` runs first, returns a single number (e.g., 85000), and then the outer query compares each row against it.

---

### 2. Subqueries in the WHERE Clause
*💡 Analogy: "Show me all the restaurants in cities that have a population over 1 million." First you find those cities, then you filter restaurants.*

\`\`\`sql
-- Find users who have placed at least one order
SELECT name, email
FROM users
WHERE id IN (
  SELECT DISTINCT user_id FROM orders
);

-- Find users who have NEVER placed an order
SELECT name, email
FROM users
WHERE id NOT IN (
  SELECT DISTINCT user_id FROM orders WHERE user_id IS NOT NULL
);
\`\`\`

**Important:** Always add \`WHERE user_id IS NOT NULL\` inside NOT IN subqueries — a single NULL in the subquery result makes NOT IN return no rows at all!

---

### 3. EXISTS vs IN
*💡 Analogy: IN checks a full guest list for each person. EXISTS peeks through the door and stops the moment it spots one matching person — much faster for large lists.*

\`\`\`sql
-- IN: gets the full list, then searches it
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 10000);

-- EXISTS: stops as soon as ONE match is found (faster on large tables)
SELECT name FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id AND o.amount > 10000
);
\`\`\`

Use **EXISTS** when the subquery table is very large — it short-circuits and is generally faster.

---

### 4. Correlated Subqueries
*💡 Analogy: For EACH student, calculate their personal average, then compare their latest score to THEIR OWN average. The inner calculation changes for every single student.*

A correlated subquery references a column from the **outer query**. It runs once per row of the outer query.

\`\`\`sql
-- For each order, find if it's above THAT USER's average order value
SELECT o.id, o.user_id, o.amount
FROM orders o
WHERE o.amount > (
  SELECT AVG(o2.amount)
  FROM orders o2
  WHERE o2.user_id = o.user_id  -- ← references outer query's row
);
\`\`\`

---

### 5. Subqueries in the FROM Clause (Derived Tables)
*💡 Analogy: You create a temporary summary sheet first, then work from that sheet rather than the raw 50,000-row data.*

\`\`\`sql
-- Rank cities by their total order revenue
SELECT city, total_revenue
FROM (
  SELECT u.city, SUM(o.amount) AS total_revenue
  FROM users u
  INNER JOIN orders o ON u.id = o.user_id
  GROUP BY u.city
) AS city_revenue
WHERE total_revenue > 100000
ORDER BY total_revenue DESC;
\`\`\`

---

### 🧪 QA Validation Queries Using Subqueries
\`\`\`sql
-- 1. Find orders whose status was never updated after creation
SELECT id, created_at FROM orders
WHERE id NOT IN (
  SELECT DISTINCT order_id FROM order_status_history
);

-- 2. Find products priced below the category average (pricing bug?)
SELECT name, price, category
FROM products p
WHERE price < (
  SELECT AVG(price) FROM products
  WHERE category = p.category
);

-- 3. Detect double-charged payments (same order, multiple payments)
SELECT order_id, COUNT(*) AS charge_count
FROM payments
GROUP BY order_id
HAVING COUNT(*) > 1;
\`\`\`
        `
      },

      {
        id: 'sql-views',
        title: 'Intermediate: Views — Saved Queries with a Name',
        analogy: "A View is like a window in your office building. The data (the city outside) is always live and real. The window (the View) is just a fixed frame that shows you a specific angle of it. You didn't build the city — you just named a useful vantage point.",
        lessonMarkdown: `
### 1. What Is a View?
*💡 Analogy: A TV channel is a View. The broadcast towers, cameras, and cables are the actual tables. You don't need to know how any of that works — you just tune to Channel 5 and it shows you the news.*

A **View** is a saved SELECT query stored in the database with a name. It looks and behaves exactly like a table, but it doesn't store any data itself — it runs the underlying query every time you reference it.

\`\`\`sql
-- Create a view: active users with their order count
CREATE VIEW active_user_summary AS
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS total_orders,
  SUM(o.amount) AS lifetime_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.is_active = 1
GROUP BY u.id, u.name, u.email;
\`\`\`

Now anyone on the team can query it like a simple table:
\`\`\`sql
SELECT * FROM active_user_summary WHERE total_orders > 5;
\`\`\`

---

### 2. Why Views Are Powerful (Especially for QA)
*💡 Analogy: Instead of re-explaining the 15-step recipe every time, you just hand someone the printed recipe card. Views are the recipe cards of SQL.*

**Benefits:**
| Benefit | What It Means |
|---------|---------------|
| **Reusability** | Write the complex JOIN once; query it a hundred times |
| **Simplicity** | Teammates don't need to know the complex underlying JOIN |
| **Security** | Expose only certain columns (hide salary, hide passwords) |
| **Consistency** | Everyone gets the same calculation — no copy-paste errors |

\`\`\`sql
-- Security example: show user info WITHOUT exposing password_hash
CREATE VIEW public_users AS
SELECT id, name, email, created_at
FROM users;  -- password_hash column intentionally excluded
\`\`\`

---

### 3. Querying and Updating Views
*💡 Analogy: Querying a View is like reading a newspaper summary. Updating a simple View is like editing a sticky note on the window — it changes the actual wall behind it.*

\`\`\`sql
-- Query it exactly like a table
SELECT name, lifetime_value
FROM active_user_summary
ORDER BY lifetime_value DESC
LIMIT 10;

-- Views can sometimes be updated (if they're simple, no aggregates)
UPDATE public_users SET name = 'Priya S.' WHERE id = 42;
\`\`\`

**Note:** Views with GROUP BY, HAVING, DISTINCT, or aggregate functions are **read-only** — you can't UPDATE them directly.

---

### 4. Modifying and Dropping Views
\`\`\`sql
-- Replace (update) an existing view
CREATE OR REPLACE VIEW active_user_summary AS
SELECT u.id, u.name, u.email,
       COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.is_active = 1 AND u.created_at >= '2024-01-01'  -- added filter
GROUP BY u.id, u.name, u.email;

-- Delete a view
DROP VIEW IF EXISTS active_user_summary;
\`\`\`

---

### 5. Materialized Views (Bonus: PostgreSQL)
*💡 Analogy: A regular View is a live camera feed. A Materialized View is a recording saved to disk — faster to play back, but you need to refresh it when the source changes.*

\`\`\`sql
-- PostgreSQL only
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS revenue
FROM orders
GROUP BY month;

-- Refresh it when needed
REFRESH MATERIALIZED VIEW monthly_revenue;
\`\`\`

---

### 🧪 QA Validation Queries Using Views
\`\`\`sql
-- Create a reusable QA validation view
CREATE VIEW qa_order_health AS
SELECT
  o.id,
  o.status,
  o.amount,
  u.name AS customer,
  p.id AS payment_id,
  p.status AS payment_status
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN payments p ON o.id = p.order_id;

-- Now run quick checks
SELECT * FROM qa_order_health WHERE payment_id IS NULL;
SELECT * FROM qa_order_health WHERE status = 'delivered' AND payment_status != 'completed';
SELECT * FROM qa_order_health WHERE amount <= 0;
\`\`\`
        `
      },

      {
        id: 'sql-indexes',
        title: 'Intermediate: Indexes and Query Performance',
        analogy: "An index is the table of contents at the front of a 1,000-page textbook. Without it, you flip through every single page to find 'normalization'. With it, you jump directly to page 487. The book still has all the same words — you just have a smarter way to find them.",
        lessonMarkdown: `
### 1. The Problem Indexes Solve
*💡 Analogy: Imagine a library with 2 million books, but no catalog, no Dewey Decimal system, no librarian. Every time you want a book, someone reads every single book title until they find yours. That's a Full Table Scan.*

Without indexes, databases perform a **Full Table Scan** on every query — checking every row one-by-one. On a table with 10 million rows, a query like \`SELECT * FROM users WHERE email = 'priya@gmail.com'\` has to scan all 10 million rows. With an index on \`email\`, it jumps directly to the right row.

\`\`\`sql
-- Creating an index
CREATE INDEX idx_users_email ON users(email);

-- Now this query is FAST (uses the index instead of scanning)
SELECT * FROM users WHERE email = 'priya@gmail.com';
\`\`\`

---

### 2. Types of Indexes
*💡 Analogy: A Primary Key index is like a student roll number — guaranteed unique. A Regular index is like an alphabetical list in a phone book — fast to search, but the same name can appear twice.*

| Index Type | When to Use |
|---|---|
| **PRIMARY KEY** | Auto-created on the \`id\` column. Unique and not null. |
| **UNIQUE INDEX** | Enforce uniqueness (e.g., emails, usernames) |
| **Regular INDEX** | Speed up frequently searched columns (e.g., status, city) |
| **Composite INDEX** | Index on multiple columns together |
| **FULL TEXT INDEX** | For searching inside long text fields |

\`\`\`sql
-- Unique index (prevents duplicate emails)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Composite index (optimises queries filtering by both status AND created_at)
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Full text index (for blog post search)
CREATE FULLTEXT INDEX idx_posts_content ON blog_posts(title, body);
\`\`\`

---

### 3. EXPLAIN — See How the Database Thinks
*💡 Analogy: EXPLAIN is like asking a taxi driver to narrate the route before you get in. You can see if they're taking the highway (index) or the scenic route through 10 million back streets (full scan).*

\`\`\`sql
-- See the query execution plan
EXPLAIN SELECT * FROM orders WHERE status = 'pending';
\`\`\`

**Key things to look for in EXPLAIN output:**

| Column | What to look for |
|--------|-----------------|
| \`type\` | \`ref\` or \`range\` = good (using index) ✅. \`ALL\` = bad (full scan) ❌ |
| \`key\` | The name of the index being used (NULL means no index) |
| \`rows\` | Estimated rows to examine — lower is better |
| \`Extra\` | "Using index" = excellent. "Using filesort" = slow sort |

\`\`\`sql
-- Force MySQL to show you what it would do
EXPLAIN SELECT * FROM orders
WHERE user_id = 42 AND status = 'completed'
ORDER BY created_at DESC;
\`\`\`

---

### 4. The Index Trade-off (Read Fast, Write Slower)
*💡 Analogy: Every time a new book arrives at the indexed library, staff must also update the catalog. More indexes = more catalog updates. For a library that gets 1,000 new books a day, too many catalogs become their own burden.*

- **More indexes** = SELECT queries go faster ✅
- **More indexes** = INSERT, UPDATE, DELETE go slower ❌ (every change must update the index)
- **Guideline:** Index columns you frequently filter, sort, or join on. Don't index every column.

\`\`\`sql
-- BAD: indexing everything
CREATE INDEX idx1 ON orders(id);          -- already the PK!
CREATE INDEX idx2 ON orders(notes);       -- rarely searched
CREATE INDEX idx3 ON orders(is_deleted);  -- low cardinality (only 0/1)

-- GOOD: index high-cardinality, frequently-searched columns
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status_date ON orders(status, created_at);
\`\`\`

---

### 🧪 QA Index Validation Queries
\`\`\`sql
-- 1. Check which indexes exist on a table (MySQL)
SHOW INDEX FROM orders;

-- 2. Find slow queries (check if an index is missing)
EXPLAIN SELECT * FROM orders WHERE status = 'pending' AND created_at > NOW() - INTERVAL 7 DAY;

-- 3. After adding an index, verify query uses it
EXPLAIN SELECT * FROM orders WHERE user_id = 42;
-- Look for key = 'idx_orders_user' in the result ✅

-- 4. Count rows to estimate if an index is worth it
SELECT COUNT(DISTINCT status) AS cardinality FROM orders;
-- If cardinality is very low (like 3), index may not help much
\`\`\`
        `
      },

      {
        id: 'sql-transactions',
        title: 'Intermediate: Transactions and ACID',
        analogy: "A transaction is a pinky promise between you and the database. Either everything in the promise happens — or none of it does. No half-done deals. If the promise breaks halfway, the database rewinds time and pretends it never started.",
        lessonMarkdown: `
### 1. The Problem Without Transactions
*💡 Analogy: You're transferring ₹10,000 from your account to a friend. The bank subtracts ₹10,000 from you. The server crashes. Your friend gets nothing. You're ₹10,000 poorer. This is why transactions exist.*

Imagine this sequence:
\`\`\`sql
UPDATE accounts SET balance = balance - 10000 WHERE id = 1;  -- your account
-- 💥 SERVER CRASHES HERE
UPDATE accounts SET balance = balance + 10000 WHERE id = 2;  -- friend's account
\`\`\`
Without a transaction, the first UPDATE is permanent. The second never runs. ₹10,000 vanishes from the system.

---

### 2. BEGIN, COMMIT, ROLLBACK
*💡 Analogy: BEGIN is picking up a pen. COMMIT is signing the contract. ROLLBACK is crumpling the paper and starting over.*

\`\`\`sql
BEGIN;  -- Start the transaction

UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
UPDATE accounts SET balance = balance + 10000 WHERE id = 2;

-- If everything looks good:
COMMIT;  -- Makes all changes permanent

-- If something went wrong:
ROLLBACK;  -- Undoes everything back to the BEGIN
\`\`\`

In application code, this typically looks like:
\`\`\`sql
BEGIN;

UPDATE accounts SET balance = balance - 10000 WHERE id = 1;

-- Check the balance didn't go negative
SELECT balance FROM accounts WHERE id = 1;  -- app checks this result

-- If balance >= 0:
COMMIT;
-- Else:
ROLLBACK;
\`\`\`

---

### 3. ACID Properties (The Four Guarantees)
*💡 Analogy: ACID is the four-part safety certificate for database operations. Like a four-point seat belt check — all four must pass before the car moves.*

| Property | Meaning | Analogy |
|----------|---------|---------|
| **Atomicity** | All operations succeed, or none do | The whole order ships, or nothing ships |
| **Consistency** | DB stays valid before and after | Account balance can't go negative |
| **Isolation** | Concurrent transactions don't see each other's work-in-progress | Two cashiers at a bank can't open the same drawer at the same time |
| **Durability** | Committed data survives crashes | Once you get a payment receipt, the bank can't "forget" it |

\`\`\`sql
-- Atomicity example: all-or-nothing order placement
BEGIN;
INSERT INTO orders (user_id, total) VALUES (42, 5000);
INSERT INTO order_items (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 7, 2);
UPDATE inventory SET stock = stock - 2 WHERE product_id = 7;
COMMIT;  -- Either all 3 succeed, or none do
\`\`\`

---

### 4. SAVEPOINT — Partial Rollbacks
*💡 Analogy: SAVEPOINT is a checkpoint in a video game. You can roll back to the checkpoint without starting the entire game over.*

\`\`\`sql
BEGIN;

INSERT INTO orders (user_id, total) VALUES (42, 5000);

SAVEPOINT after_order;  -- checkpoint

INSERT INTO payments (order_id, amount) VALUES (LAST_INSERT_ID(), 5000);

-- Payment failed validation:
ROLLBACK TO after_order;  -- undo just the payment insert

-- Try alternate payment method:
INSERT INTO payments (order_id, amount, method) VALUES (LAST_INSERT_ID(), 5000, 'UPI');

COMMIT;
\`\`\`

---

### 5. Isolation Levels (Read Problems)
*💡 Analogy: Should you be able to see a colleague's draft document while they're still typing it? The answer depends on your isolation level.*

| Issue | What Happens |
|-------|-------------|
| **Dirty Read** | You read data that another transaction hasn't committed yet (then they roll back) |
| **Non-repeatable Read** | You read a row twice; another transaction changes it between your reads |
| **Phantom Read** | You run a query twice; new rows appear because another transaction inserted them |

\`\`\`sql
-- Set isolation level (MySQL)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
-- Now you only see committed data, no dirty reads
\`\`\`

---

### 🧪 QA Validation with Transactions
\`\`\`sql
-- 1. Use a transaction to safely test destructive operations
BEGIN;
DELETE FROM test_orders WHERE created_at < '2024-01-01';
SELECT COUNT(*) FROM test_orders;  -- verify count looks right
ROLLBACK;  -- undo it — the DELETE never really happened ✅

-- 2. Verify atomicity: check total balance is unchanged after transfer
SELECT SUM(balance) FROM accounts;  -- should be same before and after

-- 3. Detect uncommitted locks (PostgreSQL)
SELECT pid, state, query FROM pg_stat_activity
WHERE state = 'idle in transaction';
\`\`\`
        `
      },

      {
        id: 'sql-string-date',
        title: 'Intermediate: String and Date Functions',
        analogy: "SQL's built-in functions are like a Swiss Army knife for your data. Instead of pulling data into Excel and reformatting it, you ask the database to chop, slice, combine, and reformat right there — saving you hours of manual work.",
        lessonMarkdown: `
### 1. Essential String Functions
*💡 Analogy: These are the autocorrect and formatting tools built into the database. You ask the DB to clean up messy user-entered text so you never have to do it by hand.*

\`\`\`sql
-- CONCAT: join strings together
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- UPPER / LOWER: force case
SELECT UPPER(email) FROM users;          -- 'PRIYA@GMAIL.COM'
SELECT LOWER(username) FROM users;       -- 'priya_rocks'

-- LENGTH: count characters
SELECT name, LENGTH(name) AS name_len FROM products;

-- TRIM / LTRIM / RTRIM: remove spaces
SELECT TRIM('  hello world  ');           -- 'hello world'

-- SUBSTRING: extract part of a string
SELECT SUBSTRING(phone, 1, 4) AS country_code FROM users;

-- REPLACE: swap out text
SELECT REPLACE(description, 'old feature', 'new feature') FROM products;

-- LIKE with wildcards
SELECT * FROM users WHERE email LIKE '%@gmail.com';    -- ends with @gmail.com
SELECT * FROM users WHERE name LIKE 'P%';              -- starts with P
SELECT * FROM users WHERE phone LIKE '98__';           -- 4 chars starting with 98
\`\`\`

---

### 2. String Functions for QA
*💡 Analogy: User data is like produce from a market — it arrives dirty, oddly shaped, and mixed up. String functions are your washing, trimming, and sorting tools.*

\`\`\`sql
-- Find emails with leading/trailing spaces (data entry bug)
SELECT id, email FROM users WHERE email != TRIM(email);

-- Find users whose phone number length isn't exactly 10 digits
SELECT id, phone FROM users WHERE LENGTH(TRIM(phone)) != 10;

-- Find duplicate emails case-insensitively
SELECT LOWER(email), COUNT(*) FROM users
GROUP BY LOWER(email) HAVING COUNT(*) > 1;

-- Find product names with special characters (encoding bug)
SELECT id, name FROM products
WHERE name REGEXP '[^a-zA-Z0-9 \\-_]';
\`\`\`

---

### 3. Essential Date and Time Functions
*💡 Analogy: Dates in a database are stored as a precise timestamp deep in the machine's brain. Date functions are the translators that turn "1714521600" into "May 1, 2025 — 3 days ago".*

\`\`\`sql
-- NOW() — current date and time
SELECT NOW();                            -- 2025-05-01 14:32:00

-- DATE() — extract just the date part
SELECT DATE(NOW());                      -- 2025-05-01

-- YEAR / MONTH / DAY
SELECT YEAR(created_at), MONTH(created_at) FROM orders;

-- DATE_FORMAT — format for display
SELECT DATE_FORMAT(created_at, '%d %b %Y') FROM orders;  -- "01 May 2025"

-- DATEDIFF — days between two dates
SELECT DATEDIFF(delivered_at, ordered_at) AS days_to_deliver FROM orders;

-- DATE_ADD / DATE_SUB — add or subtract time
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);    -- one week from now
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH); -- one month ago
\`\`\`

---

### 4. Date Filtering (The Most Common QA Pattern)
*💡 Analogy: Filtering by date is like asking "what happened this week?" — you define the window and the database hands you only what falls inside it.*

\`\`\`sql
-- All orders in the last 7 days
SELECT * FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- All orders in April 2025
SELECT * FROM orders
WHERE created_at BETWEEN '2025-04-01' AND '2025-04-30 23:59:59';

-- Orders grouped by week
SELECT
  WEEK(created_at) AS week_number,
  COUNT(*) AS orders,
  SUM(amount) AS revenue
FROM orders
WHERE YEAR(created_at) = 2025
GROUP BY WEEK(created_at);
\`\`\`

---

### 5. Timezone Handling
\`\`\`sql
-- Convert UTC stored time to IST (UTC+5:30)
SELECT
  created_at AS utc_time,
  CONVERT_TZ(created_at, '+00:00', '+05:30') AS ist_time
FROM orders;

-- Find orders created "today" in IST (not UTC)
SELECT * FROM orders
WHERE DATE(CONVERT_TZ(created_at, '+00:00', '+05:30')) = CURDATE();
\`\`\`

---

### 🧪 QA Date & String Validation Queries
\`\`\`sql
-- 1. Orders that took more than 7 days to deliver (SLA breach)
SELECT id, ordered_at, delivered_at,
       DATEDIFF(delivered_at, ordered_at) AS days_taken
FROM orders
WHERE delivered_at IS NOT NULL
  AND DATEDIFF(delivered_at, ordered_at) > 7;

-- 2. Users who registered but never verified email within 24 hours
SELECT id, email, created_at FROM users
WHERE email_verified_at IS NULL
  AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- 3. Find invalid date formats in a text column
SELECT id, birth_date FROM users
WHERE STR_TO_DATE(birth_date, '%Y-%m-%d') IS NULL
  AND birth_date IS NOT NULL;
\`\`\`
        `
      },

      {
        id: 'sql-case-null',
        title: 'Intermediate: CASE Statements and NULL Handling',
        analogy: "CASE is SQL's version of an if-else chain. NULL is the database's way of saying 'this information does not exist' — not zero, not empty string, but a complete philosophical absence of a value. Confusing NULL with zero is like confusing 'I have no money' with 'I have ₹0' — they feel similar but behave completely differently.",
        lessonMarkdown: `
### 1. The CASE Statement
*💡 Analogy: CASE is the traffic light of SQL. Based on the current state, it tells each row which lane to go in: red = 'Critical', yellow = 'Warning', green = 'OK'.*

\`CASE\` lets you create conditional columns inline in a query — no need for separate application-level logic.

**Simple CASE (match a value):**
\`\`\`sql
SELECT name, status,
  CASE status
    WHEN 'pending'   THEN 'Waiting to process'
    WHEN 'shipped'   THEN 'On the way'
    WHEN 'delivered' THEN 'Arrived safely'
    ELSE                  'Unknown status'
  END AS status_label
FROM orders;
\`\`\`

**Searched CASE (evaluate conditions):**
\`\`\`sql
SELECT name, amount,
  CASE
    WHEN amount > 50000 THEN 'Premium'
    WHEN amount > 10000 THEN 'Standard'
    WHEN amount > 1000  THEN 'Basic'
    ELSE                     'Micro'
  END AS order_tier
FROM orders;
\`\`\`

---

### 2. CASE Inside Aggregations
*💡 Analogy: Instead of running 3 separate queries to count pending, shipped, and delivered orders, one CASE inside COUNT does all three in one pass.*

\`\`\`sql
-- Pivot: count orders by status in a single row
SELECT
  COUNT(CASE WHEN status = 'pending'   THEN 1 END) AS pending_count,
  COUNT(CASE WHEN status = 'shipped'   THEN 1 END) AS shipped_count,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_count,
  COUNT(*) AS total_orders
FROM orders
WHERE created_at >= '2025-01-01';
\`\`\`

| pending_count | shipped_count | delivered_count | total_orders |
|---|---|---|---|
| 142 | 87 | 1204 | 1433 |

---

### 3. Understanding NULL
*💡 Analogy: NULL is the empty chair at the dinner table. It's not a plate with nothing on it (empty string ''). It's not a plate with zero food (0). The chair simply has no one sitting there — the concept of food doesn't apply.*

**The Big NULL Rules:**
- \`NULL = NULL\` is **FALSE** (you can't compare nothing to nothing)
- Use \`IS NULL\` or \`IS NOT NULL\` — never \`= NULL\`
- Any math with NULL returns NULL: \`5 + NULL = NULL\`
- Any comparison with NULL returns NULL: \`5 > NULL = NULL\`

\`\`\`sql
-- ❌ WRONG — this never returns any rows
SELECT * FROM users WHERE middle_name = NULL;

-- ✅ CORRECT
SELECT * FROM users WHERE middle_name IS NULL;
SELECT * FROM users WHERE middle_name IS NOT NULL;

-- Trap: NULL in math
SELECT 100 + NULL;  -- returns NULL, not 100!
\`\`\`

---

### 4. COALESCE — Handle NULL with a Default
*💡 Analogy: COALESCE is the substitute teacher. If the regular teacher (first value) is absent (NULL), call the sub. If the sub is also absent, call the emergency backup. Return the first one who shows up.*

\`COALESCE(val1, val2, val3, ...)\` returns the **first non-NULL value** in the list.

\`\`\`sql
-- Display a discount (use 0 if no discount is set)
SELECT name, COALESCE(discount, 0) AS discount FROM products;

-- Show user's preferred name, fall back to username, then email
SELECT COALESCE(display_name, username, email) AS shown_as FROM users;

-- Calculate total with NULL-safe addition
SELECT amount + COALESCE(tax, 0) + COALESCE(shipping, 0) AS total
FROM orders;
\`\`\`

---

### 5. NULLIF — Turn a Value INTO NULL
*💡 Analogy: NULLIF is a trap door. If a value matches a "bad" sentinel value (like 0 or 'N/A'), it falls through the trap door and becomes NULL — preventing divide-by-zero and bad aggregations.*

\`NULLIF(val, bad_val)\` returns NULL if \`val = bad_val\`, otherwise returns \`val\`.

\`\`\`sql
-- Prevent divide-by-zero when calculating average order value
SELECT
  city,
  total_revenue / NULLIF(order_count, 0) AS avg_order_value
FROM city_stats;
-- If order_count = 0, NULLIF returns NULL, so division returns NULL (not error)

-- Clean up sentinel values
SELECT NULLIF(phone, 'N/A') AS phone FROM users;
-- Treats 'N/A' as NULL for proper NULL-aware aggregations
\`\`\`

---

### 🧪 QA Validation Using CASE and NULL
\`\`\`sql
-- 1. Data completeness report: how many rows have NULLs in key fields
SELECT
  COUNT(*) AS total_users,
  COUNT(CASE WHEN phone IS NULL      THEN 1 END) AS missing_phone,
  COUNT(CASE WHEN address IS NULL    THEN 1 END) AS missing_address,
  COUNT(CASE WHEN birth_date IS NULL THEN 1 END) AS missing_dob
FROM users;

-- 2. Find orders with NULL status (should not happen — bug!)
SELECT id, created_at FROM orders WHERE status IS NULL;

-- 3. NULL-safe comparison (find rows where value changed from NULL)
SELECT id FROM audit_log
WHERE old_value IS NULL AND new_value IS NOT NULL
  AND field_name = 'email';
\`\`\`
        `
      },

      // ─── EXPERT ──────────────────────────────────────────────────────────────
      {
        id: 'sql-window-functions',
        title: 'Expert: Window Functions',
        analogy: "GROUP BY is like a trash compactor — 1,000 rows get squashed into 10 group summaries. Window functions are like shining a spotlight on every single row and whispering to it: 'You are number 3 in the ranking, your running total is ₹45,000, and the row before you had ₹8,000.' Nobody gets squashed. Everyone stays on stage.",
        lessonMarkdown: `
### 1. What is a Window Function?

*💡 Analogy: Imagine a classroom exam. With GROUP BY (aggregate), you'd only get the class average — individual scores disappear. With a window function, every student keeps their own score AND also sees their rank, the class average, and how many marks they are behind the topper — all in the same row.*

A **window function** computes a value across a set of rows **related to the current row** — but unlike \`GROUP BY\`, it does NOT collapse those rows. You still get one output row per input row.

Syntax pattern:
\`\`\`sql
FUNCTION_NAME() OVER (
  PARTITION BY column   -- optional: split into groups
  ORDER BY column       -- optional: define row order inside the window
)
\`\`\`

---

### 2. ROW_NUMBER, RANK, DENSE_RANK

*💡 Analogy: Three judges at a baking contest who handle ties differently.*
- **ROW_NUMBER** — assigns a unique number even to ties (like a strict judge who says "I'll give you 2nd and you 3rd, even though you tied").
- **RANK** — ties get the same number, but the next number skips (1, 2, 2, 4).
- **DENSE_RANK** — ties get the same number and the next number does NOT skip (1, 2, 2, 3).

\`\`\`sql
-- QA use case: Rank test runs by failure count to find the worst build
SELECT
  build_id,
  failed_tests,
  ROW_NUMBER()  OVER (ORDER BY failed_tests DESC) AS row_num,
  RANK()        OVER (ORDER BY failed_tests DESC) AS rank,
  DENSE_RANK()  OVER (ORDER BY failed_tests DESC) AS dense_rank
FROM test_runs;
\`\`\`

| build_id | failed_tests | row_num | rank | dense_rank |
|----------|-------------|---------|------|------------|
| B-103    | 15          | 1       | 1    | 1          |
| B-101    | 12          | 2       | 2    | 2          |
| B-102    | 12          | 3       | 2    | 2          |
| B-100    | 5           | 4       | 4    | 3          |

---

### 3. Running Totals with SUM OVER

*💡 Analogy: Your bank passbook. Each row shows the transaction amount AND the cumulative balance up to that day. SUM OVER does exactly this.*

\`\`\`sql
-- QA use case: Track cumulative bugs found each day during a sprint
SELECT
  report_date,
  bugs_found,
  SUM(bugs_found) OVER (ORDER BY report_date) AS cumulative_bugs
FROM daily_bug_report;
\`\`\`

| report_date | bugs_found | cumulative_bugs |
|-------------|-----------|-----------------|
| 2024-01-01  | 4         | 4               |
| 2024-01-02  | 7         | 11              |
| 2024-01-03  | 2         | 13              |
| 2024-01-04  | 9         | 22              |

---

### 4. LAG and LEAD — Look at Neighbouring Rows

*💡 Analogy: LAG is like asking "who was standing in front of me in the queue yesterday?" LEAD is asking "who will be standing after me tomorrow?" You can peek at adjacent rows without doing a JOIN.*

\`\`\`sql
-- QA use case: Compare each build's failure count to the PREVIOUS build
SELECT
  build_id,
  failed_tests,
  LAG(failed_tests,  1) OVER (ORDER BY build_id) AS prev_build_failures,
  LEAD(failed_tests, 1) OVER (ORDER BY build_id) AS next_build_failures,
  failed_tests - LAG(failed_tests, 1) OVER (ORDER BY build_id) AS change
FROM test_runs
ORDER BY build_id;
\`\`\`

If \`change\` is positive, the new build is WORSE. If negative, it improved. Great for regression tracking in your test reports.

---

### 5. PARTITION BY — Windows Within Groups

*💡 Analogy: Instead of one big classroom, you have separate windows per class. PARTITION BY is like creating separate scoreboard spotlights for Class A, Class B, and Class C — the ranking restarts from 1 inside each group.*

\`\`\`sql
-- QA use case: Rank test cases by execution time, WITHIN each module
SELECT
  module_name,
  test_case_name,
  execution_ms,
  RANK() OVER (
    PARTITION BY module_name
    ORDER BY execution_ms DESC
  ) AS slowest_in_module
FROM test_results;
\`\`\`

This tells you which test case is the slowest **per module** — much more actionable than a global ranking.

---

### 🧪 QA Validation Patterns Using Window Functions
\`\`\`sql
-- 1. Find the FIRST failed test in each test suite (detect earliest failure point)
SELECT * FROM (
  SELECT
    suite_name, test_name, status,
    ROW_NUMBER() OVER (PARTITION BY suite_name ORDER BY run_order) AS rn
  FROM test_results
  WHERE status = 'FAIL'
) t WHERE rn = 1;

-- 2. Flag test cases that REGRESSED (passed last run, failed this run)
SELECT test_name, status,
  LAG(status) OVER (PARTITION BY test_name ORDER BY run_date) AS prev_status
FROM test_results
WHERE status = 'FAIL'
  AND LAG(status) OVER (PARTITION BY test_name ORDER BY run_date) = 'PASS';
\`\`\`
        `
      },

      {
        id: 'sql-cte',
        title: 'Expert: CTEs (Common Table Expressions)',
        analogy: "A CTE is like a sticky note pinned on the wall before you start cooking a complex recipe. Instead of describing '3 cups of pre-roasted, salted, roughly chopped cashews' four times in the recipe, you write it once on a sticky note labelled 'roasted cashews' and just say 'see sticky note' every time. Your query becomes clean, readable, and maintainable.",
        lessonMarkdown: `
### 1. What is a CTE?

*💡 Analogy: Before a big cricket match, the coach prepares a separate sheet for "top 5 batsmen by average", another for "bowlers with over 20 wickets", then the main strategy sheet just says "assign top batsmen to positions 1-5". The prep sheets are the CTEs. The strategy sheet is your main SELECT.*

A **CTE** (Common Table Expression) is a temporary named result set you define at the top of your query using the \`WITH\` keyword. It only exists for the duration of that single query — no permanent storage, no side effects.

\`\`\`sql
WITH cte_name AS (
  SELECT ...  -- your sub-query lives here
)
SELECT * FROM cte_name;  -- reference it like a table
\`\`\`

---

### 2. Basic CTE Example

Without CTE (hard to read):
\`\`\`sql
SELECT u.name, sub.total_orders
FROM users u
JOIN (
  SELECT user_id, COUNT(*) AS total_orders
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
) sub ON u.id = sub.user_id
WHERE sub.total_orders > 5;
\`\`\`

With CTE (clean and readable):
\`\`\`sql
WITH completed_orders AS (
  SELECT user_id, COUNT(*) AS total_orders
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
)
SELECT u.name, co.total_orders
FROM users u
JOIN completed_orders co ON u.id = co.user_id
WHERE co.total_orders > 5;
\`\`\`

Same result. The CTE version reads almost like English: "First, get completed order counts per user. Then, join to users and show those with more than 5."

---

### 3. Chaining Multiple CTEs

*💡 Analogy: An assembly line. Station 1 cuts the metal. Station 2 welds it. Station 3 paints it. Each station's output feeds the next. With CTEs, each step feeds the next cleanly.*

\`\`\`sql
-- QA use case: Multi-step test data verification
WITH
-- Step 1: Find all orders from this week's regression test run
regression_orders AS (
  SELECT id, user_id, amount, status
  FROM orders
  WHERE created_at >= '2024-01-15' AND created_at < '2024-01-22'
),

-- Step 2: Among those, find the ones that are still "pending" after 5 days
stuck_orders AS (
  SELECT *
  FROM regression_orders
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '5 days'
),

-- Step 3: Join to users to get contact info for the report
final_report AS (
  SELECT u.name, u.email, so.id AS order_id, so.amount
  FROM stuck_orders so
  JOIN users u ON so.user_id = u.id
)

SELECT * FROM final_report ORDER BY amount DESC;
\`\`\`

Each CTE is a named, documented step. When your manager asks "what does this query do?", you can walk them through it step by step.

---

### 4. CTE vs Subquery — When to Use Which

*💡 Analogy: A subquery is a Post-it hidden inside a folder inside a drawer. A CTE is the same Post-it pinned prominently on your whiteboard with a label.*

| | CTE | Subquery |
|---|-----|---------|
| Readability | High — named at the top | Low — buried mid-query |
| Reuse in same query | YES — reference multiple times | NO — must repeat |
| Performance | Often same, sometimes better | Same |
| When to use | Complex logic, multiple steps | Simple one-off filter |

\`\`\`sql
-- CTE shines when you need to reference the same sub-result TWICE
WITH active_users AS (
  SELECT id FROM users WHERE last_login > NOW() - INTERVAL '30 days'
)
SELECT COUNT(*) AS total_active FROM active_users
UNION ALL
SELECT COUNT(*) FROM orders WHERE user_id IN (SELECT id FROM active_users);
-- ^ same CTE reused in two places — a subquery would require writing it twice
\`\`\`

---

### 5. Recursive CTEs — Hierarchical Data

*💡 Analogy: A family tree. To find all descendants of your great-grandfather, you start with him, then find his children, then their children, and so on — until there are no more. A recursive CTE does exactly this.*

\`\`\`sql
-- Find all employees under a manager (any depth)
WITH RECURSIVE org_chart AS (
  -- Base case: start with the top manager
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive step: find each manager's direct reports
  SELECT e.id, e.name, e.manager_id, oc.depth + 1
  FROM employees e
  INNER JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY depth, name;
\`\`\`

**QA use case:** Testing a hierarchical permission system — verify all users under Admin X inherit the correct permissions, regardless of how many levels deep they sit.

---

### 🧪 QA Patterns with CTEs
\`\`\`sql
-- 1. Find users who placed an order but NEVER received a confirmation email
WITH ordered_users AS (
  SELECT DISTINCT user_id FROM orders WHERE status = 'confirmed'
),
emailed_users AS (
  SELECT DISTINCT user_id FROM email_logs WHERE email_type = 'order_confirmation'
)
SELECT u.name, u.email
FROM ordered_users ou
JOIN users u ON ou.user_id = u.id
WHERE ou.user_id NOT IN (SELECT user_id FROM emailed_users);

-- 2. Compare test results between two builds (regression delta)
WITH build_a AS (
  SELECT test_name, status FROM test_results WHERE build_id = 'v2.1.0'
),
build_b AS (
  SELECT test_name, status FROM test_results WHERE build_id = 'v2.2.0'
)
SELECT a.test_name,
  a.status AS v2_1_status,
  b.status AS v2_2_status,
  CASE WHEN a.status = 'PASS' AND b.status = 'FAIL' THEN 'REGRESSION'
       WHEN a.status = 'FAIL' AND b.status = 'PASS' THEN 'FIXED'
       ELSE 'UNCHANGED' END AS verdict
FROM build_a a
JOIN build_b b ON a.test_name = b.test_name
WHERE a.status <> b.status;
\`\`\`
        `
      },

      {
        id: 'sql-advanced-joins',
        title: 'Expert: Advanced JOINs',
        analogy: "You already know that a JOIN connects two different tables. Advanced JOINs go further: a SELF JOIN connects a table to ITSELF (like an employee-manager relationship on one table). A CROSS JOIN connects EVERY row of table A to EVERY row of table B — creating every possible combination, like a round-robin tournament bracket.",
        lessonMarkdown: `
### 1. SELF JOIN — A Table Joining Itself

*💡 Analogy: Imagine a single Employees table with columns: \`id\`, \`name\`, \`manager_id\`. The manager_id points to another row IN THE SAME TABLE. A SELF JOIN lets you connect "employee" rows to their "manager" rows — even though it's one table.*

\`\`\`sql
-- Show each employee alongside their manager's name
SELECT
  e.name  AS employee,
  m.name  AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

| employee | manager   |
|----------|-----------|
| Priya    | Ravi      |
| Anjali   | Ravi      |
| Ravi     | NULL      |

Ravi has no manager — he's the boss. The LEFT JOIN ensures he still appears (INNER JOIN would drop him).

---

### 2. Finding Duplicates with SELF JOIN

*💡 Analogy: Line up all your test cases and shake hands with every other test case. If two of them have the same name but different IDs, you've found a duplicate.*

\`\`\`sql
-- QA use case: Find duplicate user accounts (same email, different IDs)
SELECT a.id AS id_1, b.id AS id_2, a.email
FROM users a
JOIN users b ON a.email = b.email
            AND a.id < b.id;  -- a.id < b.id prevents (1,2) AND (2,1) both showing
\`\`\`

The trick \`a.id < b.id\` ensures each duplicate pair is only shown once — not twice in both orders.

---

### 3. CROSS JOIN — Every Combination

*💡 Analogy: You have 3 T-shirt sizes (S, M, L) and 4 colours (Red, Blue, Green, Yellow). A CROSS JOIN builds a row for EVERY size-colour combination: 3 × 4 = 12 rows. No conditions needed — it's a full cartesian product.*

\`\`\`sql
-- Generate all possible test environment combinations
SELECT
  browser.name AS browser,
  os.name      AS operating_system
FROM browsers browser
CROSS JOIN operating_systems os;
\`\`\`

| browser | operating_system |
|---------|-----------------|
| Chrome  | Windows         |
| Chrome  | macOS           |
| Chrome  | Linux           |
| Firefox | Windows         |
| Firefox | macOS           |
| Firefox | Linux           |

**QA use case:** Generating a compatibility test matrix automatically. Instead of typing every combination by hand, CROSS JOIN builds it for you.

---

### 4. Chaining Multiple JOINs

*💡 Analogy: A relay race with 4 runners. Runner 1 passes the baton to Runner 2, who passes it to Runner 3. Each JOIN adds another leg to the chain, building up a wider combined row.*

\`\`\`sql
-- QA use case: Full audit trail — what did each user order, which product,
--              from which warehouse, and which courier delivered it?
SELECT
  u.name          AS customer,
  o.created_at    AS order_date,
  p.name          AS product,
  w.city          AS dispatched_from,
  c.name          AS courier
FROM orders o
INNER JOIN users      u  ON o.user_id      = u.id
INNER JOIN order_items oi ON o.id          = oi.order_id
INNER JOIN products   p  ON oi.product_id  = p.id
INNER JOIN warehouses w  ON oi.warehouse_id = w.id
LEFT  JOIN couriers   c  ON o.courier_id   = c.id;  -- LEFT because courier may not be assigned yet
\`\`\`

**Rule:** Use INNER JOIN when both sides MUST exist. Use LEFT JOIN when the right side might be missing (courier not yet assigned, payment not yet recorded, etc.).

---

### 5. Non-Equi JOINs — Joining on Ranges

*💡 Analogy: Matching students to their grade letter based on score ranges. It is not "student.score = grade.score" — it is "student.score BETWEEN grade.min AND grade.max". That's a non-equi join.*

\`\`\`sql
-- Assign a severity label to bugs based on their impact score
SELECT
  b.title,
  b.impact_score,
  s.severity_label
FROM bugs b
JOIN severity_thresholds s
  ON b.impact_score BETWEEN s.min_score AND s.max_score;
\`\`\`

| title               | impact_score | severity_label |
|---------------------|-------------|----------------|
| Login page crash    | 95          | Critical       |
| Button colour wrong | 12          | Low            |
| Checkout error      | 72          | High           |

---

### 🧪 QA Patterns with Advanced JOINs
\`\`\`sql
-- 1. SELF JOIN: find test cases that are exact duplicates (same name AND same module)
SELECT a.id, b.id, a.test_name, a.module
FROM test_cases a
JOIN test_cases b ON a.test_name = b.test_name
                  AND a.module = b.module
                  AND a.id < b.id;

-- 2. CROSS JOIN: build a full regression matrix (all test suites × all environments)
SELECT ts.suite_name, env.environment_name
FROM test_suites ts
CROSS JOIN environments env
ORDER BY ts.suite_name, env.environment_name;

-- 3. Chain: Orders that were refunded but the refund record is missing
SELECT o.id, o.user_id, o.amount, t.status AS transaction_status
FROM orders o
INNER JOIN transactions t ON o.id = t.order_id
LEFT  JOIN refunds r      ON o.id = r.order_id
WHERE t.status = 'refunded' AND r.id IS NULL;
\`\`\`
        `
      },

      {
        id: 'sql-stored-procedures',
        title: 'Expert: Stored Procedures & Functions',
        analogy: "A stored procedure is like a vending machine. You press B3 (call the procedure with parameters). The machine internally spins motors, checks stock, and dispenses the snack — you see none of that. As a QA, your job is to press B3 with all kinds of inputs (valid, invalid, boundary) and verify the machine gives the right snack every time — and doesn't break when you press B99.",
        lessonMarkdown: `
### 1. What is a Stored Procedure?

*💡 Analogy: A recipe card stored in the kitchen. Instead of explaining all the steps every time, the chef just says "make Recipe #7". The recipe is stored, reusable, and runs the same way every time.*

A **stored procedure** is a saved collection of SQL statements in the database that you can call by name. It can accept input parameters, perform complex logic (INSERT, UPDATE, loops, IF statements), and optionally return results.

\`\`\`sql
-- Create a stored procedure that processes an order refund
CREATE PROCEDURE process_refund(
  IN  p_order_id   INT,
  IN  p_reason     VARCHAR(255),
  OUT p_result     VARCHAR(50)
)
BEGIN
  -- Check if order exists and is eligible
  IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id AND status = 'completed') THEN
    SET p_result = 'ERROR: Order not eligible';
  ELSE
    -- Update the order status
    UPDATE orders SET status = 'refunded' WHERE id = p_order_id;
    -- Create a refund record
    INSERT INTO refunds (order_id, reason, created_at)
    VALUES (p_order_id, p_reason, NOW());
    SET p_result = 'SUCCESS';
  END IF;
END;

-- Call it:
CALL process_refund(1042, 'Item arrived damaged', @result);
SELECT @result;  -- shows 'SUCCESS' or error message
\`\`\`

---

### 2. IN, OUT, and INOUT Parameters

*💡 Analogy: IN is the order you give to the vending machine (the button you press). OUT is the snack it gives back. INOUT is a magical slot where you put your order AND receive a modified version back.*

\`\`\`sql
-- IN parameter: input only (most common)
CREATE PROCEDURE get_user_orders(IN p_user_id INT)
BEGIN
  SELECT * FROM orders WHERE user_id = p_user_id;
END;

-- OUT parameter: procedure sets this value, caller reads it
CREATE PROCEDURE count_pending_orders(OUT p_count INT)
BEGIN
  SELECT COUNT(*) INTO p_count
  FROM orders WHERE status = 'pending';
END;

-- Call and read the OUT parameter:
CALL count_pending_orders(@total);
SELECT @total;  -- e.g. 127
\`\`\`

---

### 3. User-Defined Functions (UDFs)

*💡 Analogy: A function is like a calculator button. You feed it numbers, it returns a result. It cannot change any data — it is purely for computation and can be used directly inside a SELECT.*

Key difference vs stored procedure:
- **Function** → always returns ONE value, can be used in SELECT/WHERE, cannot modify data
- **Procedure** → runs a process, can modify data, called with CALL

\`\`\`sql
-- Function: calculate discount percentage for an order
CREATE FUNCTION get_discount_pct(p_amount DECIMAL(10,2))
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
  IF p_amount >= 10000 THEN RETURN 15.00;
  ELSEIF p_amount >= 5000 THEN RETURN 10.00;
  ELSEIF p_amount >= 1000 THEN RETURN 5.00;
  ELSE RETURN 0.00;
  END IF;
END;

-- Use it directly in a SELECT (just like a built-in function):
SELECT
  order_id,
  amount,
  get_discount_pct(amount) AS discount_pct,
  amount * (1 - get_discount_pct(amount) / 100) AS final_price
FROM orders;
\`\`\`

---

### 4. Testing Stored Procedures as a QA Tester

*💡 Analogy: You don't get to see inside the vending machine. But you can test EVERY button, check what comes out, and look at what changed in the stock inventory (database). That's black-box testing of a stored procedure.*

**QA Test Checklist for a Stored Procedure:**

1. **Happy path** — valid input, verify correct output AND correct database change
2. **Invalid input** — non-existent IDs, wrong data types, NULL inputs
3. **Boundary values** — amounts at exactly 1000, 4999, 5000, 9999, 10000
4. **Side effects** — are all related tables updated? (order status AND refund record AND audit log)
5. **Concurrent calls** — two calls at the same time, does data stay consistent?

\`\`\`sql
-- Test setup: Create known test data
INSERT INTO orders (id, user_id, amount, status) VALUES (9999, 1, 5000, 'completed');

-- Test 1: Happy path
CALL process_refund(9999, 'Test reason', @result);
SELECT @result;                                 -- expect: 'SUCCESS'
SELECT status FROM orders WHERE id = 9999;      -- expect: 'refunded'
SELECT COUNT(*) FROM refunds WHERE order_id = 9999; -- expect: 1

-- Test 2: Invalid order (already refunded — second call)
CALL process_refund(9999, 'duplicate', @result);
SELECT @result;  -- expect: 'ERROR: Order not eligible'

-- Cleanup
DELETE FROM refunds WHERE order_id = 9999;
DELETE FROM orders WHERE id = 9999;
\`\`\`

---

### 5. Calling Procedures in Test Scripts

\`\`\`sql
-- Pattern: wrap test in a transaction so no data is permanently changed
START TRANSACTION;

  INSERT INTO orders (id, user_id, amount, status) VALUES (8888, 1, 2500, 'completed');
  CALL process_refund(8888, 'QA test', @r);
  SELECT @r AS result,
         (SELECT status FROM orders WHERE id = 8888) AS order_status,
         (SELECT COUNT(*) FROM refunds WHERE order_id = 8888) AS refund_created;

ROLLBACK;  -- clean up — no permanent changes
\`\`\`

This pattern lets you run the procedure and observe results without leaving test data behind.
        `
      },

      {
        id: 'sql-triggers-constraints',
        title: 'Expert: Triggers & Advanced Constraints',
        analogy: "A trigger is like a motion-sensor light. You didn't flip the switch — walking through the door triggered it automatically. As a QA tester, your job is to walk through doors in weird ways: run backwards, crawl, jump — and make sure the light ALWAYS turns on exactly when it should, and NEVER when it shouldn't.",
        lessonMarkdown: `
### 1. What is a Trigger?

*💡 Analogy: When a new employee joins a company (INSERT into Employees table), HR automatically creates a payroll entry, IT creates an email account, and facilities assigns a desk. Nobody manually calls these steps — they fire automatically when the INSERT happens. That's a trigger.*

A **trigger** is a stored procedure that automatically executes in response to a specific database event: \`INSERT\`, \`UPDATE\`, or \`DELETE\` on a specific table.

\`\`\`sql
-- Trigger: automatically log every time an order status changes
CREATE TRIGGER log_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO order_audit_log (order_id, old_status, new_status, changed_at)
    VALUES (NEW.id, OLD.status, NEW.status, NOW());
  END IF;
END;
\`\`\`

Now whenever you run:
\`\`\`sql
UPDATE orders SET status = 'shipped' WHERE id = 1042;
\`\`\`
The trigger **automatically** fires and inserts a row into \`order_audit_log\`.

---

### 2. BEFORE vs AFTER Triggers

*💡 Analogy: BEFORE is a bouncer checking IDs BEFORE you enter the club. AFTER is a security camera recording you AFTER you've gone in.*

| Trigger Type | When it fires | Common use |
|--------------|--------------|------------|
| BEFORE INSERT | Before the row is saved | Validate/transform input data |
| AFTER INSERT  | After the row is saved | Create related records, send notification |
| BEFORE UPDATE | Before the change | Reject invalid state transitions |
| AFTER UPDATE  | After the change | Write to audit log |
| AFTER DELETE  | After row removed | Archive the deleted row |

\`\`\`sql
-- BEFORE INSERT: auto-set timestamps and default values
CREATE TRIGGER set_order_defaults
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  SET NEW.created_at = NOW();
  SET NEW.status = COALESCE(NEW.status, 'pending');
  SET NEW.currency = UPPER(NEW.currency);  -- normalise to uppercase
END;

-- AFTER DELETE: archive deleted users before removal
CREATE TRIGGER archive_deleted_user
AFTER DELETE ON users
FOR EACH ROW
BEGIN
  INSERT INTO deleted_users_archive (user_id, email, deleted_at)
  VALUES (OLD.id, OLD.email, NOW());
END;
\`\`\`

---

### 3. Advanced Constraints

*💡 Analogy: A car factory has quality checkpoints built INTO the assembly line. If a door doesn't fit, the line stops — the car never moves to the next station. Database constraints are these built-in quality checkpoints.*

Beyond basic NOT NULL and UNIQUE, you can create complex rules:

\`\`\`sql
-- CHECK constraint: amount must always be positive
ALTER TABLE orders
ADD CONSTRAINT chk_positive_amount CHECK (amount > 0);

-- CHECK: only allowed status values
ALTER TABLE orders
ADD CONSTRAINT chk_valid_status
CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'refunded', 'cancelled'));

-- CHECK: end_date must always be after start_date
ALTER TABLE subscriptions
ADD CONSTRAINT chk_date_order CHECK (end_date > start_date);
\`\`\`

What happens when a constraint is violated:
\`\`\`sql
INSERT INTO orders (amount, status) VALUES (-100, 'pending');
-- ERROR 3819 (HY000): Check constraint 'chk_positive_amount' is violated.

INSERT INTO orders (amount, status) VALUES (500, 'flying');
-- ERROR 3819 (HY000): Check constraint 'chk_valid_status' is violated.
\`\`\`

---

### 4. CASCADE DELETE — Cleaning Up Child Records

*💡 Analogy: Deleting a user account is like closing a bank branch. You can't leave all the safe deposit boxes, ATM records, and staff contracts floating in the air — they must all be closed too. CASCADE handles this automatically.*

\`\`\`sql
-- Foreign key with CASCADE: deleting a user auto-deletes their orders
CREATE TABLE orders (
  id      INT PRIMARY KEY,
  user_id INT,
  amount  DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Now this single statement deletes the user AND all their orders:
DELETE FROM users WHERE id = 42;
\`\`\`

Options for \`ON DELETE\`:
| Option | Behaviour |
|--------|-----------|
| CASCADE | Delete child rows automatically |
| SET NULL | Set child's FK column to NULL |
| RESTRICT | Block the delete if children exist |
| NO ACTION | Same as RESTRICT (default) |

---

### 5. Testing Triggers and Constraints as a QA

\`\`\`sql
-- Test 1: Verify AFTER UPDATE trigger fires and creates audit log
UPDATE orders SET status = 'shipped' WHERE id = 1042;
-- Assert: audit log entry exists
SELECT * FROM order_audit_log WHERE order_id = 1042 ORDER BY changed_at DESC LIMIT 1;

-- Test 2: Verify CHECK constraint rejects invalid status
BEGIN;
  INSERT INTO orders (amount, status) VALUES (500, 'invalid_status');
  -- Expect: ERROR — constraint violated
ROLLBACK;

-- Test 3: Verify CASCADE DELETE removes child records
INSERT INTO users (id, email) VALUES (9999, 'test@qa.com');
INSERT INTO orders (id, user_id, amount) VALUES (8888, 9999, 100);
DELETE FROM users WHERE id = 9999;
-- Assert: order 8888 is also gone
SELECT COUNT(*) FROM orders WHERE id = 8888;  -- expect: 0

-- Test 4: Verify BEFORE INSERT trigger sets defaults
INSERT INTO orders (user_id, amount) VALUES (1, 250);
SELECT status, currency, created_at FROM orders ORDER BY id DESC LIMIT 1;
-- Expect: status='pending', currency='USD' (or default), created_at is populated
\`\`\`
        `
      },

      {
        id: 'sql-query-plan',
        title: 'Expert: Reading Query Execution Plans',
        analogy: "An execution plan is like Google Maps showing you EVERY route it considered before picking yours. 'Seq Scan' means it drove down every single street in the city looking for your destination. 'Index Scan' means it jumped straight to the highway and took the direct route. Your job as a QA tester doing performance testing is to check that the database is always taking the highway — not sightseeing through every street.",
        lessonMarkdown: `
### 1. Why Execution Plans Matter for QA

*💡 Analogy: Two restaurants claim they can serve your meal in 10 minutes. One has a professional kitchen with organised stations. The other has one chef searching through a chaotic pantry. Both might succeed today — but under load, only one scales. EXPLAIN shows you which kitchen your query is running in.*

When you do performance testing, you're not just checking "does the feature work?" — you're checking "does it work FAST, even with 100,000 rows in the database?" EXPLAIN is the tool that answers: **why is this query slow?**

\`\`\`sql
-- View the execution plan WITHOUT running the query:
EXPLAIN SELECT * FROM orders WHERE user_id = 42;

-- View the plan AND actually run the query (shows real timings):
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
\`\`\`

---

### 2. The Two Key Scan Types

*💡 Analogy: Finding a name in a phone book. Sequential Scan = reading every single page from page 1. Index Scan = opening the alphabetical index at the back and jumping straight to the right page.*

**Seq Scan (Sequential Scan)**
- Database reads EVERY row in the table
- Acceptable for small tables (< ~10,000 rows)
- Alarm bell for large tables — this is the most common cause of slow queries

**Index Scan**
- Database jumps directly to matching rows using the index
- Fast even on tables with millions of rows

\`\`\`sql
-- Without index — will show Seq Scan:
EXPLAIN SELECT * FROM orders WHERE user_id = 42;
-- Output: Seq Scan on orders (cost=0.00..3420.50 rows=847 width=72)

-- Add an index:
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Re-run — now shows Index Scan:
EXPLAIN SELECT * FROM orders WHERE user_id = 42;
-- Output: Index Scan using idx_orders_user_id on orders (cost=0.43..185.12 rows=847 width=72)
\`\`\`

The cost dropped from **3420** to **185** — that is an **18× improvement**.

---

### 3. Reading EXPLAIN Output

*💡 Analogy: A project cost estimate. "cost=100..500" means: first page cost is 100 (startup cost), total cost is 500 (total work). "rows=50" is the optimizer's guess of how many rows match. "actual rows=847" (EXPLAIN ANALYZE) is what actually happened.*

Key fields to understand:

| Field | Meaning |
|-------|---------|
| \`cost=X..Y\` | X = startup cost, Y = total estimated cost |
| \`rows=N\` | Optimizer's estimated matching rows |
| \`actual rows=N\` | Real rows returned (EXPLAIN ANALYZE only) |
| \`actual time=X..Y\` | Real time in milliseconds |
| \`loops=N\` | How many times this node executed |

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.country = 'India'
GROUP BY u.name;

-- Sample output:
-- HashAggregate  (cost=4820..4920 rows=1000) (actual time=42.3..43.1 rows=847 loops=1)
--   ->  Hash Left Join  (cost=1200..4500 rows=5000) (actual time=8.1..35.6 rows=12400 loops=1)
--         Hash Cond: (o.user_id = u.id)
--         ->  Seq Scan on orders  (cost=0..2100 rows=50000) (actual time=0.1..15.2 rows=50000 loops=1)
--         ->  Hash  (cost=900..900 rows=1000) (actual time=7.8..7.8 rows=1000 loops=1)
--               ->  Seq Scan on users (cost=0..900 rows=1000) actual time=0.1..5.4 rows=1000 loops=1)
--                     Filter: (country = 'India')
\`\`\`

Notice: two Seq Scans. If either table had millions of rows, this would be catastrophically slow.

---

### 4. Common Slow Query Patterns to Catch

*💡 Analogy: A home inspector has a checklist. They always check the same things: roof leaks, foundation cracks, bad wiring. As a performance QA, you have your own checklist of slow query patterns.*

\`\`\`sql
-- ❌ Pattern 1: Function call on a column in WHERE (breaks indexes)
SELECT * FROM orders WHERE YEAR(created_at) = 2024;
-- Fix: use a range instead
SELECT * FROM orders WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Pattern 2: Leading wildcard in LIKE (cannot use index)
SELECT * FROM users WHERE email LIKE '%@gmail.com';
-- (Can't fix easily — consider full-text search for this)

-- ❌ Pattern 3: SELECT * on a wide table (fetches unused columns)
SELECT * FROM orders;
-- Fix: select only what you need
SELECT id, user_id, amount, status FROM orders;

-- ❌ Pattern 4: N+1 pattern — query inside a loop (use JOIN instead)
-- Bad: "for each user, run a separate query to get their orders"
-- Good: one JOIN that fetches everything at once

-- ✅ Check if your index is actually being USED:
EXPLAIN SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';
-- Look for "Index Scan using idx_orders_user_status" in output
-- If you see "Seq Scan" despite having an index → the optimizer chose not to use it
\`\`\`

---

### 5. Performance Testing Workflow for QA

\`\`\`sql
-- Step 1: Seed realistic data volume (not just 10 rows — test with production scale)
-- (Usually done via scripts or tools like Faker)

-- Step 2: Run EXPLAIN ANALYZE on every query the feature uses
EXPLAIN ANALYZE
SELECT p.name, SUM(oi.quantity) AS units_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'delivered'
  AND o.created_at >= '2024-01-01'
GROUP BY p.name
ORDER BY units_sold DESC
LIMIT 20;

-- Step 3: Check thresholds — flag if:
-- • Any Seq Scan on a table > 10,000 rows
-- • Total actual time > your SLA (e.g. 200ms)
-- • estimated rows differs wildly from actual rows (stale statistics → ANALYZE table)

-- Step 4: After index is added, re-run EXPLAIN and confirm:
-- • Seq Scan changed to Index Scan
-- • Cost and actual time both dropped

-- Step 5: Document findings in your performance test report:
-- "Query X: Before index — 1,240ms. After index — 38ms. 97% improvement."
\`\`\`
        `
      }
    ]
  },
  api: {
    id: 'api',
    levels: [

      // ── BEGINNER ─────────────────────────────────────────────

      {
        id: 'api-what-is-api',
        title: 'Beginner: What is an API?',
        analogy: "An API is a restaurant waiter. You (the app) sit at a table. The kitchen (the server) has all the food (data). You never walk into the kitchen yourself — you tell the waiter what you want, the waiter goes to the kitchen, and brings exactly what you ordered back to your table.",
        lessonMarkdown: `
### 🍽️ What is an API?

*💡 Analogy: You are a customer at a restaurant. The kitchen has all the food. You can't walk into the kitchen yourself — that's dangerous and chaotic. The waiter is the middleman: you give your order to the waiter, the waiter goes to the kitchen, and brings the food back to you. The waiter is the API.*

**API** stands for **Application Programming Interface**.

In simple words: an API is a way for two software programs to talk to each other. One program (the **client**) asks for something, and another program (the **server**) responds with data.

---

### 🌍 Why Do We Need APIs?

Every app you use every day relies on APIs:

- **Weather app** on your phone: the app itself doesn't know the weather. It calls a weather API, which talks to weather satellites and sends back today's forecast.
- **Uber**: the app calls Google Maps API to show you the map. It calls a payment API to charge your card. It calls its own backend API to find nearby drivers.
- **"Login with Google"**: that button calls Google's Auth API. Google checks your credentials and tells the app "yes, this is a real Google user."

Without APIs, every app would need to rebuild everything from scratch. APIs let apps share power.

---

### 🔄 How Does an API Work? Step by Step

\`\`\`
1. You open a weather app and tap "Get Today's Forecast"
2. The app sends a REQUEST to the weather API:
   → "Give me the forecast for London, UK"
3. The API server receives the request
4. The server looks up the data in its database
5. The server sends back a RESPONSE:
   → { "city": "London", "temp": "18°C", "condition": "Cloudy" }
6. The app displays "18°C, Cloudy" on your screen
\`\`\`

---

### 🖥️ Client vs Server

| Term | Who They Are | Example |
|---|---|---|
| **Client** | The one who ASKS for data | Your mobile app, web browser, Postman |
| **Server** | The one who HAS the data and responds | The backend that holds the database |
| **API** | The rules and URLs that connect them | The defined endpoints and response format |

---

### 🧪 Real Example: A Public API

Try this URL in your browser right now:

\`\`\`
https://jsonplaceholder.typicode.com/users/1
\`\`\`

Your browser is making an API call. The server responds with:

\`\`\`json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-0860"
}
\`\`\`

That's an API in action — you asked for user #1, the server returned user #1's data.

---

### 🎯 As a Tester, Why Does This Matter?

When you test a web or mobile app, you are testing two things:
1. **The UI** — what you see on screen
2. **The API** — what happens behind the scenes

Most bugs live in the API layer — wrong data, missing fields, broken authentication, incorrect status codes. **API testing lets you find these bugs before the UI is even built.**
        `
      },

      {
        id: 'api-http-methods',
        title: 'Beginner: HTTP Methods',
        analogy: "HTTP methods are like office actions on a document. GET = read it. POST = create a brand new one. PUT = replace the entire document with a new version. PATCH = fix a single typo. DELETE = shred the document permanently.",
        lessonMarkdown: `
### 📋 What Are HTTP Methods?

*💡 Analogy: Think of a filing cabinet at work. GET = open and read a file. POST = create a brand-new file and add it to the cabinet. PUT = take a file out and replace every single page with new pages. PATCH = open the file and correct just one typo. DELETE = remove the file and shred it.*

Every request you send to an API must declare its **intention** using an HTTP Method. The method tells the server what you want to do.

---

### 🟢 GET — Read Data

**Purpose:** Fetch/retrieve data. Never changes anything on the server.

\`\`\`
GET /users          → Returns a list of all users
GET /users/5        → Returns details of user with ID 5
GET /products?category=electronics  → Returns electronics products
\`\`\`

**Real life:** Opening your email inbox. You're just reading — not sending or deleting anything.

**Key rule:** GET requests should NEVER have side effects. Calling GET 100 times gives the same result every time.

---

### 🔵 POST — Create New Data

**Purpose:** Send data to the server to CREATE a new resource.

\`\`\`
POST /users
Body: { "name": "Priya", "email": "priya@test.com" }

→ Server creates a new user and returns:
{ "id": 42, "name": "Priya", "email": "priya@test.com" }
\`\`\`

**Real life:** Filling out a registration form and clicking Submit.

**Key rule:** Every POST creates something NEW. Calling POST 3 times = 3 new users created.

---

### 🟠 PUT — Replace Entire Resource

**Purpose:** COMPLETELY REPLACE an existing resource.

\`\`\`
PUT /users/42
Body: { "name": "Priya Sharma", "email": "priya.sharma@test.com", "role": "admin" }

→ User 42's entire record is overwritten with the new data
\`\`\`

**Real life:** Throwing away an old form and filling out a completely new one from scratch.

**Key rule:** You must send ALL fields. If you forget to include "email", PUT will wipe it out.

---

### 🟡 PATCH — Update Part of a Resource

**Purpose:** Partially update a resource. Only send what changed.

\`\`\`
PATCH /users/42
Body: { "email": "new.email@test.com" }

→ Only the email is updated. Name and role stay the same.
\`\`\`

**Real life:** Opening a form, erasing just your phone number, and writing a new one. Everything else stays untouched.

---

### 🔴 DELETE — Remove a Resource

**Purpose:** Delete a resource permanently.

\`\`\`
DELETE /users/42

→ User 42 is deleted from the database
→ Server returns 204 No Content (empty body, deletion confirmed)
\`\`\`

---

### 📊 Quick Reference Table

| Method | Action | Has Body? | Safe? |
|---|---|---|---|
| GET | Read | No | Yes |
| POST | Create | Yes | No |
| PUT | Replace all | Yes | No |
| PATCH | Update part | Yes | No |
| DELETE | Remove | No | No |

---

### 🧪 Tester's Checklist for Each Method

- **GET**: Does it return the correct data? Does it return 404 for missing IDs?
- **POST**: Does it create exactly one record? What if required fields are missing?
- **PUT**: Does it overwrite ALL fields? What if you send extra/unknown fields?
- **PATCH**: Does it update only the changed field? Are other fields preserved?
- **DELETE**: Is the resource actually deleted? Can you delete the same thing twice?
        `
      },

      {
        id: 'api-request-anatomy',
        title: 'Beginner: Anatomy of a Request',
        analogy: "An API request is like sending a formal letter. The envelope has the address (URL). The stamp type tells the post office what kind of delivery this is (HTTP method). Post-it notes on the outside give handling instructions (headers). The letter inside is your actual message (request body).",
        lessonMarkdown: `
### ✉️ The 4 Parts of Every API Request

*💡 Analogy: Sending a formal letter to a government office. The envelope has: the address (URL) and a stamp showing the delivery type (Method). On the outside are Post-it notes: "Confidential", "Handle with care", "Reply in English" — these are Headers. Inside the envelope is your actual letter — the Body.*

---

### 🌐 1. The URL (Endpoint)

The URL tells the server exactly WHERE to go and WHAT resource you want.

\`\`\`
https://api.myshop.com/v1/users/42/orders
│      │              │  │      │   └─ resource: orders
│      │              │  │      └───── user ID: 42
│      │              │  └──────────── resource: users
│      │              └─────────────── version: v1
│      └────────────────────────────── domain
└───────────────────────────────────── protocol (always https in production)
\`\`\`

---

### 🔑 2. The HTTP Method

GET, POST, PUT, PATCH, or DELETE — declared at the start of the request.

\`\`\`
GET https://api.myshop.com/v1/users/42
\`\`\`

---

### 📝 3. The Headers

Headers are key-value pairs carrying **metadata** about the request.

\`\`\`
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Accept: application/json
\`\`\`

| Header | What It Does |
|---|---|
| \`Content-Type\` | Format of the body you're sending (usually \`application/json\`) |
| \`Authorization\` | Your secret token to prove who you are |
| \`Accept\` | Format you want the response in |

---

### 📦 4. The Body

The actual **data payload** you're sending. Only used with POST, PUT, PATCH.

\`\`\`json
{
  "name": "Priya Sharma",
  "email": "priya@testlab.com",
  "role": "QA Engineer",
  "active": true
}
\`\`\`

GET and DELETE requests have no body — you're just pointing at a resource.

---

### 🧪 Full Example: Creating a New User

\`\`\`
Method:  POST
URL:     https://api.myshop.com/v1/users

Headers:
  Content-Type: application/json
  Authorization: Bearer my-secret-token-123

Body:
{
  "name": "Priya Sharma",
  "email": "priya@testlab.com",
  "role": "QA Engineer"
}
\`\`\`

---

### 🔍 Tester's Eye: What To Check in Requests

1. **Is the URL correct?** Wrong path = 404 Not Found
2. **Is the method right?** Using GET instead of POST = 405 Method Not Allowed
3. **Are headers present?** Missing Content-Type often causes 400 Bad Request
4. **Is the body valid JSON?** A stray comma or missing quote = 400 Bad Request
5. **Is the auth token valid?** Expired/missing token = 401 Unauthorized
        `
      },

      {
        id: 'api-response-anatomy',
        title: 'Beginner: Anatomy of a Response',
        analogy: "An API response is like a reply letter from a company. Before you even open the envelope, a stamp tells you the result — green SUCCESS or red REJECTED (status code). Inside is the actual answer (body). Stickers on the envelope explain how to handle it — expiry date, language, size (response headers).",
        lessonMarkdown: `
### 📬 The 3 Parts of Every API Response

*💡 Analogy: You applied for a job (sent a request). The company replies (response). Before opening the envelope, a big stamp says "ACCEPTED" or "REJECTED" — that's the status code. Inside the envelope is the offer letter or rejection reason — that's the body. On the outside are instructions: "Valid until Dec 2025", "Store in a dry place" — those are response headers.*

---

### 🚦 1. Status Code

A 3-digit number that immediately tells you what happened.

\`\`\`
HTTP/1.1 200 OK
HTTP/1.1 201 Created
HTTP/1.1 400 Bad Request
HTTP/1.1 404 Not Found
HTTP/1.1 500 Internal Server Error
\`\`\`

**The five families:**
- **2xx** = ✅ Success
- **3xx** = ↪️ Redirect
- **4xx** = ❌ Client error (you did something wrong)
- **5xx** = 💥 Server error (server broke, not your fault)

---

### 📋 2. Response Headers

Metadata FROM the server ABOUT the response.

\`\`\`
Content-Type: application/json; charset=utf-8
Content-Length: 248
X-Rate-Limit-Remaining: 87
Cache-Control: no-cache
\`\`\`

| Header | What It Means |
|---|---|
| \`Content-Type\` | Format of the body (should be \`application/json\`) |
| \`X-Rate-Limit-Remaining\` | How many API calls you have left this minute |
| \`Cache-Control\` | Can the client cache this response? |

---

### 📦 3. Response Body

The actual data returned — almost always JSON for modern APIs.

**Successful GET:**
\`\`\`json
{
  "id": 42,
  "name": "Priya Sharma",
  "email": "priya@testlab.com",
  "role": "QA Engineer",
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error response:**
\`\`\`json
{
  "error": "USER_NOT_FOUND",
  "message": "No user exists with ID 999",
  "statusCode": 404
}
\`\`\`

Even error responses must have a helpful body — never a raw crash dump.

---

### 🔄 Full Request → Response Example

**Request:**
\`\`\`
POST /v1/users
Content-Type: application/json
{ "name": "Rahul", "email": "rahul@test.com" }
\`\`\`

**Response:**
\`\`\`
Status: 201 Created
Content-Type: application/json

{
  "id": 99,
  "name": "Rahul",
  "email": "rahul@test.com",
  "createdAt": "2024-05-01T08:00:00Z"
}
\`\`\`

---

### 🧪 Tester's Checklist for Responses

| What to Check | Why It Matters |
|---|---|
| ✅ Status code is correct | 200 vs 201 vs 204 all mean different things |
| ✅ Body has all expected fields | Missing fields break the frontend |
| ✅ Field data types are correct | \`"id": "99"\` (string) vs \`99\` (number) breaks code |
| ✅ Error messages are helpful | "USER_NOT_FOUND" is good. A stack trace is not |
| ✅ Response time is acceptable | Over 2 seconds for a simple GET is a red flag |
| ✅ Sensitive data NOT exposed | Passwords, SSNs must never appear in responses |
        `
      },

      {
        id: 'api-status-codes',
        title: 'Beginner: HTTP Status Codes',
        analogy: "Status codes are like traffic signs. 2xx = Green light, all good. 3xx = Detour sign, go this way instead. 4xx = Stop sign with a note saying YOU made a wrong turn. 5xx = Road closed sign — the highway department broke the road, not your fault.",
        lessonMarkdown: `
### 🚦 HTTP Status Codes — Your Tester's Bible

*💡 Analogy: You send a package via courier. The tracking app shows codes:
200 = Delivered successfully.
201 = Parcel accepted and logged into the system.
301 = Address changed — package redirected.
400 = Wrong address format — courier rejected it.
401 = Signature required — nobody was home to sign.
403 = Building won't accept deliveries — access restricted.
404 = Address doesn't exist.
500 = Courier's truck broke down — not your fault.*

---

### ✅ 2xx — Success

| Code | Name | When You'll See It |
|---|---|---|
| **200** | OK | GET returned data successfully |
| **201** | Created | POST created a new resource |
| **204** | No Content | DELETE succeeded — no body returned |

**Testing tip:** A POST that creates something should return **201**, not 200. If it returns 200, that's a REST convention bug worth logging.

---

### ❌ 4xx — Client Errors (You Did Something Wrong)

| Code | Name | Common Cause | Tester's Action |
|---|---|---|---|
| **400** | Bad Request | Invalid JSON, missing required field | Check the request body and headers |
| **401** | Unauthorized | No token, or expired token | Check the Authorization header |
| **403** | Forbidden | Token is valid but no permission | Test role-based access control |
| **404** | Not Found | Wrong URL or resource doesn't exist | Verify the endpoint and ID |
| **405** | Method Not Allowed | POST to a GET-only endpoint | Check the correct HTTP method |
| **409** | Conflict | Creating a duplicate (same email) | Test uniqueness constraints |
| **422** | Unprocessable Entity | Right format but invalid content (negative age) | Test business rule validations |
| **429** | Too Many Requests | Rate limit hit | Test rate limiting behaviour |

---

### 💥 5xx — Server Errors (Server Broke)

| Code | Name | Tester's Action |
|---|---|---|
| **500** | Internal Server Error | Log a bug immediately — always a code defect |
| **503** | Service Unavailable | Check if it's a known deployment/maintenance |
| **504** | Gateway Timeout | Performance issue — log it |

---

### 🧪 Real Test Scenarios by Status Code

\`\`\`
POST /users with valid data           → Expect 201
POST /users with duplicate email      → Expect 409
POST /users with missing name field   → Expect 400 or 422
GET  /users/99999 (doesn't exist)     → Expect 404
GET  /users with no auth token        → Expect 401
GET  /admin/users as a basic user     → Expect 403
DELETE /users/5 (confirmed)           → Expect 204
Send 200 rapid login requests         → Expect 429 eventually
\`\`\`

---

### 🎯 Golden Rule

**Never accept a 500 as "expected behaviour."** A 500 means the server crashed — always a bug. Good APIs should return proper 4xx errors for bad input, never crash with a 500.
        `
      },

      {
        id: 'api-json-basics',
        title: 'Beginner: JSON — The Language of APIs',
        analogy: "JSON is like a standardised customs declaration form used at every airport worldwide. No matter which country you're in, the form has the same boxes: Name (text), Age (number), Items (list), Carry-on (yes/no). Any customs officer on the planet knows exactly where to look for each piece of information.",
        lessonMarkdown: `
### 📋 What is JSON?

*💡 Analogy: A customs declaration form at an airport has specific boxes: Name (text), Age (number), Items Carried (list), Declaration Required (yes/no). Every country uses the same format — so any customs officer anywhere knows exactly where to look. JSON is that universal declaration form for data on the internet.*

**JSON** = **J**ava**S**cript **O**bject **N**otation

A lightweight text format for storing and sending data. Both humans and machines can read it easily.

---

### 🧱 The 6 Data Types in JSON

\`\`\`json
{
  "name":     "Priya",
  "age":      28,
  "isActive": true,
  "score":    null,
  "skills":   ["Selenium", "Postman", "SQL"],
  "address":  { "city": "Bangalore", "country": "India" }
}
\`\`\`

| Type | Example | Rules |
|---|---|---|
| String | \`"hello"\` | Always in **double** quotes |
| Number | \`42\` or \`3.14\` | No quotes |
| Boolean | \`true\` or \`false\` | Lowercase, no quotes |
| null | \`null\` | Means "no value", lowercase |
| Array | \`["a", "b", "c"]\` | Ordered list in \`[ ]\` |
| Object | \`{ "key": "value" }\` | Nested data in \`{ }\` |

---

### 🪆 Nested Objects — Real-World API Response

\`\`\`json
{
  "order": {
    "id": "ORD-999",
    "items": [
      { "product": "Laptop", "qty": 1, "price": 75000 },
      { "product": "Mouse",  "qty": 2, "price": 1200  }
    ],
    "total": 77400,
    "customer": {
      "id": 42,
      "name": "Rahul Mehta"
    }
  }
}
\`\`\`

---

### ❌ Common JSON Mistakes

\`\`\`json
// ❌ WRONG — single quotes (not allowed in JSON)
{ 'name': 'Priya' }

// ✅ CORRECT — double quotes
{ "name": "Priya" }

// ❌ WRONG — trailing comma after last item
{ "name": "Priya", "age": 28, }

// ✅ CORRECT — no trailing comma
{ "name": "Priya", "age": 28 }

// ❌ WRONG — number as string
{ "age": "28" }

// ✅ CORRECT — number without quotes
{ "age": 28 }

// ❌ WRONG — comments (JSON does NOT support comments)
{ "name": "Priya" // the user }
\`\`\`

---

### 🧪 Tester's JSON Checklist

When you receive a JSON response from an API, check:

1. **Is it valid JSON?** Paste into [jsonlint.com](https://jsonlint.com) to validate
2. **Are all expected fields present?** Missing \`id\` field = bug
3. **Are data types correct?** \`"id": "42"\` (string) instead of \`"id": 42\` (number) = bug
4. **Are arrays populated?** An order with \`"items": []\` might be missing data
5. **Is sensitive data hidden?** Passwords, SSNs must never appear in the response body
        `
      },

      {
        id: 'api-postman-basics',
        title: 'Beginner: Testing APIs with Postman',
        analogy: "Postman is your API laboratory. Without it, testing an API would be like trying to taste soup by reading the recipe. Postman lets you fire real requests at any API and see the real response instantly — like a universal remote control that works with every server in the world.",
        lessonMarkdown: `
### 🧪 What is Postman?

*💡 Analogy: You want to test if a restaurant kitchen is working before real customers arrive. You walk up to the serving window and shout your orders directly — "One burger!", "Show me the menu!" — and check the responses yourself. Postman is that serving window. You test the API directly, without needing a fully built app.*

**Postman** is the #1 free GUI tool for API testing. It lets you:
- Build and send HTTP requests
- See the full response (status code, headers, body)
- Save requests into collections
- Write automated assertions
- Share tests with your team

---

### 🚀 Your First GET Request

Let's test a real public API — **JSONPlaceholder** (a free fake API for learning).

**Step 1:** Open Postman → Click "New" → "HTTP Request"

**Step 2:** Set method to **GET**, enter the URL:
\`\`\`
https://jsonplaceholder.typicode.com/posts/1
\`\`\`

**Step 3:** Click **Send**

**Response you'll see:**
\`\`\`json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident",
  "body": "quia et suscipit..."
}
\`\`\`
Status: **200 OK** ✅

---

### ✍️ Your First POST Request

**Step 1:** Change method to **POST**
**Step 2:** URL: \`https://jsonplaceholder.typicode.com/posts\`
**Step 3:** Click **Body** → select **raw** → choose **JSON** from the dropdown
**Step 4:** Type this body:

\`\`\`json
{
  "title": "My First API Test",
  "body": "I just sent a POST and it worked!",
  "userId": 1
}
\`\`\`

**Step 5:** Click Send

**Response:**
\`\`\`json
{
  "id": 101,
  "title": "My First API Test",
  "body": "I just sent a POST and it worked!",
  "userId": 1
}
\`\`\`
Status: **201 Created** ✅

---

### 📁 Postman Interface — Key Areas

\`\`\`
┌──────────────────────────────────────────────────┐
│  [GET ▼] [URL input                ] [ SEND ]    │ ← Request line
├──────────────────────────────────────────────────┤
│  Params | Auth | Headers | Body | Tests           │ ← Request tabs
├──────────────────────────────────────────────────┤
│  Status: 200 OK   Time: 245ms   Size: 512B        │ ← Response info
│  Body | Cookies | Headers | Test Results          │ ← Response tabs
│  { "id": 1, "name": "Priya" }                    │ ← Response body
└──────────────────────────────────────────────────┘
\`\`\`

---

### 📂 Collections — Save Your Work

Don't lose your requests! Save them in a **Collection**:
1. After sending → Click **Save**
2. Create new Collection: "API Testing Practice"
3. Name the request: "Get Post by ID"
4. Click Save

Collections are like folders for your API tests. You can re-run any test with one click.

---

### 💡 Quick Wins for Testers

- **Check response time** (top right of response panel) — flag anything over 2 seconds
- **Check response size** — unusually large responses may indicate over-fetching
- **Use the Console** (View → Show Postman Console) — see the raw HTTP request for debugging
- **Check the status code colour** — green = 2xx, orange = 4xx, red = 5xx
        `
      },

      {
        id: 'api-headers-params',
        title: 'Beginner: Headers, Query Params & Path Params',
        analogy: "Headers are like labels on a parcel — 'Fragile', 'Urgent', 'Return to sender' — extra instructions that don't change what's inside. Query params are like Amazon search filters — they narrow down a list. Path params are the exact aisle and shelf number in a warehouse — they pinpoint one specific item.",
        lessonMarkdown: `
### 📬 Three Ways to Pass Information in a Request

When making API requests you often need to send extra information. There are 3 places to put it — choosing the wrong one is a very common beginner mistake.

---

### 🔖 1. Headers — Metadata About the Request

*💡 Analogy: Stickers on a package. "Fragile — handle with care." "Store below 5°C." "Reply in English." These don't change what's inside the box — they tell the courier HOW to handle it.*

\`\`\`
Content-Type: application/json     → "The body I'm sending is JSON"
Authorization: Bearer abc123       → "Here's my security badge"
Accept: application/json           → "Please respond in JSON"
Accept-Language: en-US             → "I want an English response"
\`\`\`

**In Postman:** Click the "Headers" tab → add key-value pairs.

---

### 🔍 2. Query Parameters — Filters and Options

*💡 Analogy: Search filters on a shopping website. You're browsing laptops and filter by Price, RAM, and Brand. You're not changing which page you're on — you're narrowing down the results on that page.*

Query params come at the **end of the URL**, after a \`?\`, separated by \`&\`:

\`\`\`
GET /products?category=laptops&maxPrice=80000&page=2&limit=20
\`\`\`

**Common uses:**
- Pagination: \`?page=1&limit=10\`
- Filtering: \`?status=active&role=admin\`
- Searching: \`?q=wireless+mouse\`
- Sorting: \`?sortBy=createdAt&order=desc\`

**In Postman:** Click the "Params" tab → add Key and Value. Postman builds the URL automatically.

---

### 🎯 3. Path Parameters — Identifying One Specific Resource

*💡 Analogy: A warehouse has aisles and shelves. "Aisle 7, Shelf 3, Box B" uniquely identifies ONE item. Path params are the aisle/shelf/box numbers in your API URL.*

Path params are embedded directly inside the URL path:

\`\`\`
GET /users/42           → Get the user with ID 42
GET /users/42/orders    → Get all orders belonging to user 42
GET /posts/5/comments/3 → Get comment #3 on post #5
\`\`\`

In API docs they're written as: \`GET /users/{userId}\`

---

### 🆚 When to Use Which?

| Use case | Where to put it |
|---|---|
| Authentication token | Header (\`Authorization\`) |
| Format of your body | Header (\`Content-Type\`) |
| Identifying ONE specific resource | Path param (\`/users/42\`) |
| Filtering a list | Query param (\`?status=active\`) |
| Pagination | Query param (\`?page=2&limit=10\`) |
| Actual data to create/update | Request Body |

---

### 🧪 Tester Scenarios

\`\`\`
GET /users/0           → 0 is usually invalid → Expect 400 or 404
GET /users/abc         → Non-numeric ID → Expect 400
GET /users/-1          → Negative ID → Expect 400 or 404
GET /posts?limit=0     → Zero results → Expect empty array [], not error
GET /posts?page=-5     → Negative page → Expect 400 or default to page 1
POST without Content-Type header → Expect 400
GET without Authorization header → Expect 401
\`\`\`

---

### 💡 Pro Security Tip

Try injecting values in headers:
\`\`\`
X-Admin-Override: true
X-User-Role: superadmin
\`\`\`

If the server honours these custom headers without proper auth — that's a **critical security bug**.
        `
      },

      // ── INTERMEDIATE ─────────────────────────────────────────────

      {
        id: 'api-auth-types',
        title: 'Intermediate: Authentication Types',
        analogy: "API Key = a physical key to the office — just show it at the door. Bearer Token = a visitor badge that expires after 8 hours. Basic Auth = showing your employee ID and password. JWT = a tamper-proof smart badge containing your photo, role, department, and expiry — the guard reads it without calling HR.",
        lessonMarkdown: `
### 🔐 Why Authentication Matters

*💡 Analogy: Imagine a bank with no security desk. Anyone can walk in, go to any vault, and take any money. Authentication is the security desk — it checks who you are before you can do anything.*

Most real APIs require you to **prove who you are** before giving access. There are several methods, each with different trade-offs.

---

### 🗝️ 1. API Key

The simplest form. The server gives you a secret key — include it in every request.

\`\`\`
GET /weather?city=London
X-API-Key: sk_live_abc123def456
\`\`\`

Or as a query param:
\`\`\`
GET /weather?city=London&apikey=sk_live_abc123def456
\`\`\`

**Pros:** Simple. **Cons:** If it leaks (e.g., committed to GitHub), anyone can use it.

**Test scenarios:**
- Missing API key → Expect 401
- Invalid API key → Expect 401 or 403
- API key in wrong header name → Expect 401

---

### 📛 2. Basic Authentication

Username and password encoded in Base64 in the Authorization header.

\`\`\`
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
\`\`\`

That string is just \`username:password\` in Base64. **NOT encrypted** — only safe over HTTPS.

**In Postman:** Auth tab → Basic Auth → enter username and password.

**Test scenarios:**
- Wrong password → Expect 401
- Empty password → Expect 400 or 401
- SQL injection in username → Expect 401 (never 500!)

---

### 🎫 3. Bearer Token

After login, the server gives you a token. Include it in every subsequent request.

\`\`\`
POST /auth/login
Body: { "email": "priya@test.com", "password": "secret123" }
Response: { "token": "tok_live_xyzabc789", "expiresIn": 3600 }

Then:
GET /users/me
Authorization: Bearer tok_live_xyzabc789
\`\`\`

**Test scenarios:**
- Valid token → Expect 200
- Expired token → Expect 401
- Random/invalid token → Expect 401
- Missing "Bearer " prefix → Expect 401

---

### 🧾 4. JWT (JSON Web Token)

A special bearer token that is **self-contained** — it holds your user info inside.

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiYWRtaW4ifQ.abc123
     HEADER              PAYLOAD (user data)                   SIGNATURE
\`\`\`

Decode the payload at [jwt.io](https://jwt.io):
\`\`\`json
{
  "userId": 42,
  "role": "admin",
  "email": "priya@test.com",
  "exp": 1716552000
}
\`\`\`

**Test scenarios:**
- Modify JWT payload (change role to "superadmin") → Server must reject it → Expect 401/403
- Send JWT with past expiry → Expect 401
- Send JWT signed with wrong secret → Expect 401

---

### 🔑 5. OAuth 2.0 — "Login with Google"

OAuth 2.0 is the protocol behind social login buttons. It lets a user grant your app limited access to another service without giving you their password.

\`\`\`
1. User clicks "Login with Google"
2. App redirects to Google's auth page
3. User logs in to Google and clicks "Allow"
4. Google gives your app an ACCESS TOKEN
5. Your app uses that token to call Google's APIs
\`\`\`

**As a tester:** Verify the redirect works, the token has correct scopes, and expiry/refresh works.
        `
      },

      {
        id: 'api-test-scenarios',
        title: 'Intermediate: Designing API Test Scenarios',
        analogy: "Designing API test scenarios is like being a nightclub bouncer testing your own security. You test: Do real people with valid IDs get in? Are underage people blocked? What if someone shows a fake ID? What happens if 500 people arrive simultaneously? Good API testing asks the same questions about your endpoints.",
        lessonMarkdown: `
### 🎯 What Makes a Good API Test Plan?

*💡 Analogy: You're a safety inspector testing a new bridge. You don't just drive one car across and say "looks good!" You test: maximum weight, two trucks simultaneously, an overweight car, a car driving in reverse, a car at 3am in a storm. API testing is the same — test every dimension of how the endpoint can be used.*

---

### 🟢 Category 1: Happy Path Tests

Confirm the basic functionality works with valid, correct input.

\`\`\`
Endpoint: POST /users

✅ Create user with all required fields → 201 Created
✅ Verify the returned ID is numeric
✅ Verify createdAt timestamp is present
✅ Create user then immediately GET them → data matches what was sent
\`\`\`

---

### 🔴 Category 2: Negative / Sad Path Tests

Test what happens when something goes wrong. This is where most bugs hide.

**Missing required fields:**
\`\`\`
POST /users with no "email"         → Expect 400 or 422
POST /users with no "name"          → Expect 400 or 422
POST /users with empty body {}      → Expect 400
POST /users with no body at all     → Expect 400
\`\`\`

**Wrong data types:**
\`\`\`
POST /users "age": "twenty"        → Expect 400 (must be number)
POST /users "active": "yes"        → Expect 400 (must be boolean)
\`\`\`

**Invalid values:**
\`\`\`
POST /users "email": "not-an-email" → Expect 400 or 422
POST /users "age": -5               → Expect 400 (negative age)
\`\`\`

---

### 🧮 Category 3: Boundary Value Tests

Test the edges of acceptable values:

\`\`\`
Field: name (max 100 characters)
name = 99 chars   → Expect 201 ✅
name = 100 chars  → Expect 201 ✅ (boundary — must work)
name = 101 chars  → Expect 400 ❌ (over limit)
name = 1 char     → Expect 201 ✅
name = ""         → Expect 400 ❌
\`\`\`

---

### 🔒 Category 4: Authentication Tests

\`\`\`
GET /users/me with no token         → 401 Unauthorized
GET /users/me with expired token    → 401 Unauthorized
GET /users/me with invalid token    → 401 Unauthorized
GET /users/me with valid token      → 200 OK ✅
\`\`\`

---

### 🚧 Category 5: Authorization Tests

Even authenticated users shouldn't be able to do everything:

\`\`\`
User A tries to read User B's private data    → Expect 403 Forbidden
Regular user tries to call admin endpoint    → Expect 403 Forbidden
Read-only user tries to POST new data        → Expect 403 Forbidden
\`\`\`

---

### 📝 Test Scenario Template

\`\`\`
Test ID:      TC-API-001
Endpoint:     POST /users
Description:  Create user with missing email field
Precondition: Valid auth token available

Request:
  Headers: Authorization: Bearer {token}
           Content-Type: application/json
  Body: { "name": "Priya" }  ← email intentionally missing

Expected Result:
  Status: 400 or 422
  Body: contains error message mentioning "email" or "required"
  Body: does NOT contain stack trace or internal code

Actual Result: [fill in after testing]
Pass/Fail: [fill in]
\`\`\`
        `
      },

      {
        id: 'api-assertions',
        title: 'Intermediate: Writing Assertions in Postman',
        analogy: "Assertions are your quality checklist. When a pizza is delivered, you don't just accept it — you check: is it the right pizza? Right size? All toppings present? Still hot? If any check fails, you reject it. Assertions are that same checklist for API responses, running automatically every time.",
        lessonMarkdown: `
### ✅ What Are Assertions?

*💡 Analogy: You work in a car factory quality control station. Every car that rolls past gets checked: 4 wheels? Steering wheel? Horn works? Engine starts? You don't just stare and say "looks fine." You tick a checklist. Assertions are your automated checklist for API responses.*

In Postman, the **Tests** tab lets you write JavaScript that runs automatically after each request. Results appear in the "Test Results" tab.

---

### 🚀 The Most Common Assertions

**1. Check the status code**
\`\`\`javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Status code is 201 for creation", function () {
    pm.response.to.have.status(201);
});
\`\`\`

**2. Check response time**
\`\`\`javascript
pm.test("Response time is under 2 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
\`\`\`

**3. Check a field exists**
\`\`\`javascript
const response = pm.response.json();

pm.test("Response has an id field", function () {
    pm.expect(response).to.have.property("id");
});
\`\`\`

**4. Check a field's value**
\`\`\`javascript
const response = pm.response.json();

pm.test("User name matches what we sent", function () {
    pm.expect(response.name).to.equal("Priya Sharma");
});
\`\`\`

**5. Check data types**
\`\`\`javascript
const response = pm.response.json();

pm.test("ID is a number", function () {
    pm.expect(response.id).to.be.a("number");
});

pm.test("Items is an array", function () {
    pm.expect(response.items).to.be.an("array");
});
\`\`\`

**6. Check a field is not empty**
\`\`\`javascript
pm.test("Name is not empty", function () {
    pm.expect(response.name).to.not.be.empty;
});
\`\`\`

**7. Check a header**
\`\`\`javascript
pm.test("Content-Type is JSON", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
\`\`\`

---

### 🏆 Full Test Suite: POST /users

\`\`\`javascript
const response = pm.response.json();

pm.test("Status is 201 Created",    () => pm.response.to.have.status(201));
pm.test("Response under 2s",        () => pm.expect(pm.response.responseTime).to.be.below(2000));
pm.test("Has id field",             () => pm.expect(response.id).to.exist);
pm.test("Has name field",           () => pm.expect(response.name).to.exist);
pm.test("Has email field",          () => pm.expect(response.email).to.exist);
pm.test("ID is a number",           () => pm.expect(response.id).to.be.a("number"));
pm.test("Name matches",             () => pm.expect(response.name).to.equal("Priya Sharma"));
pm.test("Email matches",            () => pm.expect(response.email).to.equal("priya@test.com"));
pm.test("Password not in response", () => pm.expect(response).to.not.have.property("password"));
\`\`\`

---

### 🔴 Assertions for Negative Tests

\`\`\`javascript
// For a POST with missing email field
pm.test("Status is 400",                   () => pm.response.to.have.status(400));
pm.test("Error message mentions email",    () => {
    const r = pm.response.json();
    pm.expect(r.message.toLowerCase()).to.include("email");
});
pm.test("No stack trace in response",      () => {
    pm.expect(pm.response.text()).to.not.include("at Object.");
});
\`\`\`

---

### 💡 Assertion Tips

1. **One assertion = one check.** If it fails, you know exactly what broke.
2. **Name your tests clearly.** "Status is 201" beats "test 1".
3. **Always check sensitive data does NOT appear** — passwords must never leak.
4. **Assert on error responses too** — validate the error format is consistent.
        `
      },

      {
        id: 'api-chaining',
        title: 'Intermediate: Request Chaining & Environment Variables',
        analogy: "Request chaining is like a relay race. Runner 1 (the login request) passes the baton (the auth token) to Runner 2 (get-profile), who passes the user ID to Runner 3 (update profile). Each leg of the race depends on what the previous runner handed over. Environment variables are the baton.",
        lessonMarkdown: `
### 🔗 What is Request Chaining?

*💡 Analogy: A restaurant token system. You get a numbered token at the entrance (login). You show that token at the food counter to get your meal (get data). Then show it again at the billing counter to pay (update). The token flows through the entire process automatically.*

Most real API test flows are a sequence of steps:

\`\`\`
Step 1: POST /auth/login        → Receive auth token
Step 2: GET /users/me           → Use token from Step 1
Step 3: PUT /users/me           → Use token + user ID from Step 2
Step 4: DELETE /sessions/active → Use token from Step 1
\`\`\`

Without chaining, you'd manually copy-paste the token every time. With chaining, Postman does it automatically.

---

### 🌍 Environment Variables

Postman environments let you store and reuse values across requests.

**Create an environment:**
1. Click "Environments" in the left sidebar → "+" → name it "Dev"
2. Add variables:

| Variable | Initial Value |
|---|---|
| baseUrl | https://api.myapp.com |
| authToken | (empty — filled by script) |
| userId | (empty — filled by script) |

**Use a variable in a URL:**
\`\`\`
{{baseUrl}}/users/{{userId}}
\`\`\`

---

### ⚙️ Step 1: Extract Token from Login Response

In your **Login** request → **Tests** tab:

\`\`\`javascript
const response = pm.response.json();

pm.test("Login successful", () => pm.response.to.have.status(200));

// Store the token in the environment
pm.environment.set("authToken", response.token);
pm.environment.set("userId", response.user.id);

console.log("Token saved:", response.token);
\`\`\`

---

### 🔐 Step 2: Use the Token in the Next Request

In your **Get User Profile** request:

**Auth tab:** Type → Bearer Token → Token: \`{{authToken}}\`

Or in Headers manually:
\`\`\`
Authorization: Bearer {{authToken}}
\`\`\`

Postman automatically replaces \`{{authToken}}\` with the saved value.

---

### 🔄 Step 3: Generate Unique Test Data

Use **Pre-request Script** to generate fresh data before each run:

\`\`\`javascript
// Prevents "duplicate email" errors on repeated runs
const timestamp = Date.now();
pm.environment.set("testEmail", \`testuser_\${timestamp}@qa.com\`);
\`\`\`

Then in the body:
\`\`\`json
{ "email": "{{testEmail}}", "name": "QA Test User" }
\`\`\`

---

### 🏃 Collection Runner — Run the Full Flow

1. Click **Runner** → select your collection
2. Select your environment
3. Click **Run**

Postman runs all requests in order, passing variables between them. You get a full pass/fail report.

---

### 💡 Variable Scopes Quick Reference

| Scope | Visible to | Best for |
|---|---|---|
| **Environment** | All requests in the environment | Auth tokens, base URLs |
| **Collection** | All requests in the collection | Shared test data |
| **Local** | Current request only | Temporary calculations |
        `
      },

      {
        id: 'api-schema-validation',
        title: 'Intermediate: Schema Validation',
        analogy: "Schema validation is like a customs declaration form. Every package entering the country must have: Name (text), Weight (number in kg), Country of Origin (text). If a package arrives with Weight listed as 'heavy' (a word instead of a number), customs rejects it. Schema validation rejects API responses that don't match the agreed structure.",
        lessonMarkdown: `
### 📐 What is Schema Validation?

*💡 Analogy: You're hiring through a job portal that only accepts applications in a specific format: Name (text), Years of Experience (number), Skills (list of text). If someone submits Experience as "many years" (text instead of a number), the portal rejects it automatically before it reaches the recruiter. Schema validation does exactly this for API responses.*

A **schema** is a blueprint that defines:
- What fields must be present
- What data type each field must be
- Which fields are required vs optional
- What constraints apply (min/max, allowed values)

---

### 🤔 Why Schema Validation Matters

**Without it:**
- Frontend gets \`"id": "42"\` (string) instead of \`"id": 42\` (number) → JavaScript math breaks
- A previously present field disappears → Frontend crashes with "Cannot read property of undefined"
- A date comes back in a different format → Date parsing fails

**With it:**
- Any structural change to the API response is caught immediately
- Acts as a contract between frontend and backend teams

---

### 🏗️ JSON Schema Basics

\`\`\`json
{
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":     { "type": "integer", "minimum": 1 },
    "name":   { "type": "string", "minLength": 1, "maxLength": 100 },
    "email":  { "type": "string" },
    "role":   { "type": "string", "enum": ["admin", "user", "moderator"] },
    "active": { "type": "boolean" }
  },
  "additionalProperties": false
}
\`\`\`

| Keyword | Meaning |
|---|---|
| \`type\` | Data type: string, integer, boolean, array, object |
| \`required\` | Fields that MUST be present |
| \`enum\` | Only these specific values are allowed |
| \`minimum/maximum\` | Numeric range |
| \`additionalProperties: false\` | No extra fields allowed |

---

### 🧪 Schema Validation in Postman

\`\`\`javascript
const schema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id:     { type: "number" },
        name:   { type: "string" },
        email:  { type: "string" },
        active: { type: "boolean" }
    }
};

const response = pm.response.json();

pm.test("Response matches schema", function () {
    pm.expect(tv4.validate(response, schema)).to.be.true;
});
\`\`\`

---

### 📋 Validating Arrays and Nested Objects

\`\`\`javascript
const orderSchema = {
    type: "object",
    required: ["orderId", "items", "total"],
    properties: {
        orderId: { type: "string" },
        total:   { type: "number", minimum: 0 },
        items: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                required: ["productId", "quantity", "price"],
                properties: {
                    productId: { type: "string" },
                    quantity:  { type: "integer", minimum: 1 },
                    price:     { type: "number", minimum: 0 }
                }
            }
        }
    }
};

pm.test("Order schema is valid", () => {
    pm.expect(tv4.validate(pm.response.json(), orderSchema)).to.be.true;
});
\`\`\`

---

### 💡 Also Validate Error Responses

Good APIs have a consistent error format:
\`\`\`json
{ "error": "string", "message": "string", "statusCode": "number" }
\`\`\`

If your error responses don't follow a consistent structure — log that as a bug. Inconsistent error schemas make debugging a nightmare for both developers and testers.
        `
      },

      {
        id: 'api-mock-servers',
        title: 'Intermediate: Mock Servers & API Stubs',
        analogy: "A mock server is like a stunt double on a movie set. The real actor (the actual API) isn't available yet — maybe still being written. The stunt double (mock server) looks and behaves exactly like the real actor for all the scenes you need to rehearse right now, without the real actor having to show up.",
        lessonMarkdown: `
### 🎭 What is a Mock Server?

*💡 Analogy: You're building a new house and want to test if your furniture fits before the house is finished. You put masking tape on the floor to simulate walls and rooms. The tape isn't the real wall — it's a mock. But it lets you arrange furniture today without waiting months for construction.*

A **mock server** is a fake API server that:
- Returns pre-defined responses to specific requests
- Looks and behaves like the real API
- Requires no real backend code

---

### 🤔 Why Use Mock Servers?

| Situation | Without Mock | With Mock |
|---|---|---|
| Backend not built yet | QA can't test | QA tests immediately |
| Unstable backend | Tests fail randomly | Tests always reliable |
| Third-party API (costs per call) | Expensive to test | Free mock |
| Testing 500 errors | Hard to force | Mock returns 500 instantly |
| Parallel development | Teams block each other | Teams work independently |

---

### 🛠️ Option 1: Postman Mock Server

**Setup:**
1. Right-click your Collection → "Mock Collection"
2. Postman creates a URL: \`https://abc123.mock.pstmn.io\`

**Create example responses:**
1. Open a request → "Examples" → "Add Example"
2. Set status code + response body:
\`\`\`
Request: GET /users/1
Response:
  Status: 200
  Body: { "id": 1, "name": "Priya", "email": "priya@test.com" }
\`\`\`

Now \`GET https://abc123.mock.pstmn.io/users/1\` returns that exact response.

---

### 🛠️ Option 2: JSON Server (Local Mock in 2 minutes)

**Install:**
\`\`\`bash
npm install -g json-server
\`\`\`

**Create db.json:**
\`\`\`json
{
  "users": [
    { "id": 1, "name": "Priya", "email": "priya@test.com" },
    { "id": 2, "name": "Rahul", "email": "rahul@test.com" }
  ]
}
\`\`\`

**Run:**
\`\`\`bash
json-server --watch db.json --port 3000
\`\`\`

**Instantly available — all CRUD works:**
\`\`\`
GET    /users       → all users
GET    /users/1     → user 1
POST   /users       → create user
PUT    /users/1     → replace user 1
DELETE /users/1     → delete user 1
\`\`\`

---

### 🛠️ Option 3: WireMock (Enterprise Grade)

WireMock supports request matching, response templating, and fault injection.

**Simulate a slow response (great for timeout testing):**
\`\`\`json
{
  "request": { "method": "GET", "url": "/slow-endpoint" },
  "response": {
    "status": 200,
    "fixedDelayMilliseconds": 3000,
    "jsonBody": { "data": "slow response" }
  }
}
\`\`\`

**Simulate a server error:**
\`\`\`json
{
  "request": { "method": "POST", "url": "/payments" },
  "response": { "status": 500, "body": "Internal Server Error" }
}
\`\`\`

---

### ⚠️ When NOT to Over-Mock

| Risk | Explanation |
|---|---|
| Stale mocks | Real API changes but mock still returns old data |
| Integration gaps | Mock hides integration problems between services |
| False confidence | All mock tests pass, real API has critical bug |

**Golden rule:** Mocks are for early development and isolated unit tests. Always run tests against the real API before release.
        `
      },

      // ── EXPERT ──────────────────────────────────────────────────

      {
        id: 'api-automation',
        title: 'Expert: API Automation with Code',
        analogy: "Manual Postman testing is like hand-writing individual cheques for each payment. API automation with code is like setting up a direct debit — it runs automatically, every time, without lifting a finger, and sends you a failure report the moment something goes wrong.",
        lessonMarkdown: `
### 🤖 Why Code-Based API Testing?

*💡 Analogy: A factory produces 500 products a day. Would you check each one by hand? Or build an automated inspection robot that checks all 500 in 10 seconds? Manual Postman is hand-checking. Code-based automation is the robot.*

| Manual (Postman) | Automated (Code) |
|---|---|
| Great for exploration | Great for regression |
| One request at a time | Thousands of tests in seconds |
| Manual re-run every time | Runs on every code commit |
| No version control | Test code lives in Git |

---

### ⚙️ Setup: Axios + Jest

\`\`\`bash
npm init -y
npm install axios jest
npm install --save-dev @types/jest ts-jest typescript
\`\`\`

**jest.config.js:**
\`\`\`javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
\`\`\`

---

### 🧪 Basic Test Suite

\`\`\`typescript
// users.test.ts
import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('GET /users', () => {

  it('returns 200 and a list of users', async () => {
    const response = await axios.get(\`\${BASE_URL}/users\`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });

  it('returns user with required fields', async () => {
    const response = await axios.get(\`\${BASE_URL}/users/1\`);
    const user = response.data;
    expect(response.status).toBe(200);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(typeof user.id).toBe('number');
  });

  it('returns 404 for non-existent user', async () => {
    try {
      await axios.get(\`\${BASE_URL}/users/99999\`);
      fail('Expected 404 error');
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });

});
\`\`\`

---

### ✍️ Testing POST Requests

\`\`\`typescript
describe('POST /users', () => {

  it('creates a user and returns 201', async () => {
    const newUser = { name: 'QA Tester', email: 'qa@testlab.com' };

    const response = await axios.post(\`\${BASE_URL}/users\`, newUser, {
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    expect(response.data.name).toBe('QA Tester');
    // Security: password must NOT be returned
    expect(response.data.password).toBeUndefined();
  });

});
\`\`\`

---

### 🎭 Playwright API Testing

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('GET /users returns list', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
});

test('POST creates a user', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/users', {
    data: { name: 'Priya', email: 'priya@test.com' },
  });
  expect(response.status()).toBe(201);
  const user = await response.json();
  expect(user.name).toBe('Priya');
});
\`\`\`

---

### 📁 Recommended Project Structure

\`\`\`
api-tests/
├── tests/
│   ├── users/
│   │   ├── create-user.test.ts
│   │   └── get-user.test.ts
│   └── auth/
│       └── login.test.ts
├── helpers/
│   ├── api-client.ts   ← centralised axios instance
│   └── auth.helper.ts  ← login and token management
└── jest.config.js
\`\`\`

**Centralised API client:**
\`\`\`typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.myapp.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export function setAuthToken(token: string) {
  apiClient.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
}
\`\`\`

Run: \`npx jest --watchAll\`
        `
      },

      {
        id: 'api-security-testing',
        title: 'Expert: API Security Testing',
        analogy: "API security testing is like hiring a professional burglar to break into your own house — on purpose — before the real criminals find the gaps. The professional thinks like an attacker, not like the architect who designed the building.",
        lessonMarkdown: `
### 🔒 Why API Security Testing?

*💡 Analogy: A bank vault has thick walls and a combination lock. But what if the back door is propped open? What if the air vent is wide enough for a person? Security testing means walking around the entire bank and checking every possible entry point — not just the front door.*

APIs are the #1 attack surface in modern applications. OWASP publishes the **API Security Top 10** — the most exploited vulnerabilities.

---

### 🏆 Top API Security Tests Every QA Should Run

---

**1. BOLA — Broken Object Level Authorization (Most Common)**

\`\`\`
Logged in as User A (ID: 42)
Try: GET /users/43/private-data   ← User B's data

Expected: 403 Forbidden
Vulnerability: 200 OK — you can read someone else's data!
\`\`\`

**How to test:**
1. Log in as User A, note your user ID
2. Change the ID in the URL to another user's ID
3. Expected: 403 Forbidden
4. Bug if: 200 OK — IDOR/BOLA vulnerability

---

**2. Broken Authentication**

\`\`\`
Empty password login           → Must return 401, never 200
1000 wrong password attempts   → Must be rate-limited (429) after ~5-10
Expired JWT token              → Must return 401
Tampered JWT payload           → Must return 401
\`\`\`

**JWT tampering test:**
1. Get a valid JWT → go to [jwt.io](https://jwt.io)
2. Change \`"userId": 42\` to \`"userId": 1\` (admin's ID)
3. Set algorithm to "none" or use wrong signature
4. Send modified token → **Must get 401**

---

**3. Excessive Data Exposure**

\`\`\`
GET /users/42

Must return:  id, name, email
Must NOT return: password_hash, ssn, credit_card, internal_notes
\`\`\`

**How to test:** Compare what the UI shows vs what the raw API response contains. Look for: \`passwordHash\`, \`salt\`, \`ssn\`, \`creditCard\`, \`bankAccount\`. If you find any — critical bug.

---

**4. Missing Rate Limiting**

\`\`\`bash
# Send 200 login attempts rapidly
for i in $(seq 1 200); do
  curl -X POST https://api.app.com/auth/login \
    -d '{"email":"test@test.com","password":"wrong"}'
done
\`\`\`

**Expected:** 429 Too Many Requests after ~5-10 attempts
**Vulnerability:** All 200 return 401 (not rate-limited — allows brute force)

---

**5. SQL Injection via API**

\`\`\`
POST /users/search
Body: { "name": "'; DROP TABLE users; --" }
Expected: 400 Bad Request
Vulnerability: 500 Internal Server Error ← SQL was executed!

GET /users?id=1 OR 1=1
Expected: 404 or 400
Vulnerability: Returns ALL users
\`\`\`

---

**6. Function Level Authorization**

\`\`\`
DELETE /admin/users/5    (as a regular user) → Must be 403
POST /admin/promote-user (as a regular user) → Must be 403
\`\`\`

---

### 📋 Security Test Checklist

\`\`\`
□ No auth token            → Must be 401
□ Another user's data      → Must be 403 (not 200)
□ Expired/tampered token   → Must be 401
□ Sensitive fields in body → Must not appear
□ SQL injection in fields  → Must be 400, never 500
□ Rate limiting on login   → Must get 429 eventually
□ Admin endpoints as user  → Must be 403
\`\`\`
        `
      },

      {
        id: 'api-contract-testing',
        title: 'Expert: Contract Testing',
        analogy: "Contract testing is like a legal rental agreement between a tenant and a landlord. The tenant (frontend) says: I need a door, two windows, a kitchen, and Wi-Fi. The contract ensures the landlord (backend) cannot remove the kitchen during renovations without the tenant's agreement. Both sides are bound by the contract.",
        lessonMarkdown: `
### 📄 What is Contract Testing?

*💡 Analogy: A restaurant and a food supplier have a written contract: "You will deliver 100 tomatoes every Monday, each between 80-120g, Grade A." The supplier cannot suddenly switch to Grade B without renegotiating. Contract testing is exactly this — a binding agreement between the API consumer and provider.*

**Contract testing** verifies:
1. The **consumer** (frontend) sends requests correctly
2. The **provider** (backend) handles those requests correctly
3. Both sides match each other's **expectations**

---

### 🤔 The Problem It Solves

\`\`\`
Without contract testing:
Backend team: "We renamed 'firstName' to 'first_name' — more consistent!"
Frontend team: "Why is production broken?! All names show as 'undefined'!"

With contract testing:
Backend tries to rename the field
→ Contract test immediately fails
→ "Consumer expects 'firstName' — coordinate before changing"
→ Both teams change together safely ✅
\`\`\`

---

### 🔄 Consumer vs Provider

| Role | Who | Example |
|---|---|---|
| **Consumer** | Uses the API | React frontend, mobile app |
| **Provider** | Provides the API | Node.js backend, microservice |

---

### 📝 How Pact Works

**Step 1: Consumer writes expectations**

\`\`\`typescript
import { Pact } from '@pact-foundation/pact';
import { like } from '@pact-foundation/pact/src/dsl/matchers';

const provider = new Pact({
  consumer: 'WebApp',
  provider: 'UserService',
  port: 8080
});

it('returns a user when GET /users/:id is called', async () => {
  await provider.addInteraction({
    state: 'user 42 exists',
    uponReceiving: 'a request for user 42',
    withRequest: {
      method: 'GET',
      path: '/users/42',
    },
    willRespondWith: {
      status: 200,
      body: {
        id: like(42),           // any number is ok
        name: like('Priya'),    // any string is ok
        email: like('p@t.com') // any string is ok
      }
    }
  });
});
\`\`\`

**Step 2: Pact generates a contract file (pact.json) automatically**

**Step 3: Provider verifies the contract**

\`\`\`typescript
const { Verifier } = require('@pact-foundation/pact');

it('validates WebApp expectations', () => {
  return new Verifier({
    provider: 'UserService',
    providerBaseUrl: 'http://localhost:3000',
    pactUrls: ['./pacts/WebApp-UserService.json'],
  }).verifyProvider();
});
\`\`\`

If the provider's API no longer matches the contract → **test fails → deployment blocked**.

---

### 🆚 Contract Testing vs Integration Testing

| | Integration Testing | Contract Testing |
|---|---|---|
| Speed | Slow (needs full stack) | Fast (no real network) |
| When runs | Pre-release | Every commit |
| Finds | End-to-end issues | Contract mismatches early |

**Use both.** Contract tests are the safety net. Integration tests are the final check.

---

### 🔑 Key Takeaway for Testers

Contract testing is not just for developers. As a QA engineer, you should:
1. Review the contracts to understand what the consumer expects
2. Verify the provider tests are running in CI
3. Flag any missing contract coverage as a quality risk
        `
      },

      {
        id: 'api-performance-testing',
        title: 'Expert: API Performance Testing',
        analogy: "Performance testing is like a fire drill. You don't wait for an actual fire to find out if the evacuation plan works. You simulate the emergency before it happens — to find bottlenecks before real users are trapped in the burning building.",
        lessonMarkdown: `
### ⚡ What is API Performance Testing?

*💡 Analogy: You open a new restaurant. Day 1 — 5 customers, everything runs perfectly. But what if 500 customers arrive on a Saturday night? Will the kitchen cope? Will the payment system crash? Performance testing is a stress rehearsal before opening weekend.*

---

### 📊 Types of Performance Tests

| Type | What you do | What you discover |
|---|---|---|
| **Load Test** | Gradually increase to expected peak | Normal performance behaviour |
| **Stress Test** | Exceed expected load until it breaks | The breaking point |
| **Soak Test** | Sustained load over hours | Memory leaks, gradual degradation |
| **Spike Test** | Sudden burst of massive traffic | Recovery behaviour |

---

### 📏 Key Metrics

| Metric | Meaning | Good Target |
|---|---|---|
| **p50 response time** | 50% of requests faster than this | < 200ms |
| **p95 response time** | 95% of requests faster than this | < 1s |
| **p99 response time** | 99% of requests faster than this | < 2s |
| **Throughput (RPS)** | Requests per second handled | Depends on SLA |
| **Error Rate** | % of requests that fail | < 1% |

*Why p95/p99? Averages lie. Average = 300ms sounds fine — but if 5% of users wait 10 seconds, that's a terrible experience.*

---

### 🛠️ k6 — Load Testing Tool

\`\`\`bash
brew install k6    # macOS
choco install k6   # Windows
\`\`\`

**Basic load test:**
\`\`\`javascript
// load-test.js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50,           // 50 virtual users
  duration: '30s',   // run for 30 seconds
};

export default function () {
  const response = http.get('https://jsonplaceholder.typicode.com/users');

  check(response, {
    'status is 200':         (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
\`\`\`

\`\`\`bash
k6 run load-test.js
\`\`\`

---

### 📈 Reading k6 Output

\`\`\`
✓ status is 200         100% ✓ 1450
✓ response time < 500ms  96% ✓ 1392 / ✗ 58

http_req_duration: avg=180ms  p(95)=450ms  p(99)=820ms
http_reqs:         1450  (48.33/s)
http_req_failed:   0.00%
\`\`\`

- **p(95)=450ms** → 95% of users got a response in 450ms or less ✅
- **48.33/s** → API handles ~48 requests per second at 50 users
- **0% failed** → No errors ✅

---

### 📈 Ramping Load Test (Gradual Increase)

\`\`\`javascript
export const options = {
  stages: [
    { duration: '1m', target: 10  },   // ramp up
    { duration: '3m', target: 10  },   // hold
    { duration: '1m', target: 100 },   // ramp up more
    { duration: '3m', target: 100 },   // hold
    { duration: '1m', target: 0   },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // 95% under 1 second
    http_req_failed:   ['rate<0.01'],   // error rate under 1%
  },
};
\`\`\`

---

### 🚨 When to Escalate

| Finding | Severity |
|---|---|
| p95 > 3 seconds | High — dev must investigate |
| Error rate > 5% under load | Critical — block release |
| Memory grows during soak test | High — memory leak |
| Crashes at 2x expected load | Medium — scalability risk |
        `
      },

      {
        id: 'api-ci-cd',
        title: 'Expert: API Tests in CI/CD Pipelines',
        analogy: "CI/CD with API tests is like having a quality inspector robot on the factory assembly line. Every time a new part rolls off the line, the robot checks it automatically and instantly. No batch testing at the end of the week. No surprises on release day. Every broken part is caught the moment it's made.",
        lessonMarkdown: `
### 🏭 What is CI/CD for QA?

*💡 Analogy: Old factory quality control: at the end of the week, a human checks 500 finished products. If 200 are defective, a week's work is scrapped. Modern factory: a robot checks each product the instant it rolls off the line. Defect found in 5 seconds, fixed in 5 minutes. CI/CD is the quality control robot for your code.*

---

### 🔄 The CI/CD Flow

\`\`\`
Developer pushes code
        ↓
  Build the app
        ↓
  Run unit tests
        ↓
  Run API tests  ← YOUR RESPONSIBILITY
        ↓
  Deploy to staging
        ↓
  Run smoke tests  ← YOUR RESPONSIBILITY
        ↓
  Deploy to production
\`\`\`

---

### 📦 Newman — Run Postman Collections in CI

**Newman** is Postman's command-line runner.

\`\`\`bash
npm install -g newman newman-reporter-htmlextra
\`\`\`

**Run a collection:**
\`\`\`bash
newman run MyCollection.json \
  --environment Dev.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export report.html
\`\`\`

**Export your collection:** Postman → Collection → "..." → Export → Collection v2.1

---

### 🚀 GitHub Actions Workflow

Create \`.github/workflows/api-tests.yml\`:

\`\`\`yaml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Run API tests
        run: |
          newman run ./postman/MyCollection.json \\
            --environment ./postman/env-staging.json \\
            --reporters cli,htmlextra \\
            --reporter-htmlextra-export ./reports/api-report.html \\
            --bail

      - name: Upload test report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: api-test-report
          path: reports/api-report.html
\`\`\`

The \`--bail\` flag stops the run immediately on the first failure.

---

### ⚡ k6 Performance Tests in CI

\`\`\`yaml
  performance-tests:
    runs-on: ubuntu-latest
    needs: api-tests   # only runs if API tests pass

    steps:
      - uses: actions/checkout@v3
      - name: Install k6
        run: sudo apt-get install k6
      - name: Run load test
        run: k6 run ./performance/load-test.js
\`\`\`

---

### 💡 QA's Responsibilities in the Pipeline

| Responsibility | Action |
|---|---|
| Maintain Postman collection | Keep tests updated as API changes |
| Environment files | Separate configs for dev/staging/prod |
| Define thresholds | p95 < 1s, error rate < 1% |
| Review CI reports | Don't ignore flaky tests |
| Add tests for new features | Test coverage is a QA deliverable |

**Remember:** A CI pipeline is only as good as the tests inside it. Weak tests = false confidence. Strong tests = genuine safety net.
        `
      },

    ]
  },
  typescript: {
    id: 'typescript',
    levels: [
      {
        id: 'ts-intro',
        title: 'What is TypeScript?',
        analogy: "TypeScript is JavaScript wearing a hard hat and a safety harness. JavaScript lets you build anything freely with no rulebook; TypeScript enforces strict safety codes so nothing collapses at runtime.",
        lessonMarkdown: `
### 1. The Big Picture — JavaScript vs TypeScript

*💡 Real-Life Analogy: Imagine two construction crews. The first crew (JavaScript) works fast with no rulebook — they eyeball measurements and figure out problems as walls start cracking. The second crew (TypeScript) reviews blueprints, uses standardised tools, and runs inspections before laying a single brick. The first crew ships faster today; the second crew never has a wall collapse at 3am on a Friday.*

**Deep Explanation:**

TypeScript is NOT a different language. It is a **superset of JavaScript** — meaning every line of valid JavaScript is already valid TypeScript. TypeScript just *adds* a layer on top: a type system.

When you write TypeScript, you are still writing JavaScript, but with extra annotations that describe *what kind of data* each variable, function parameter, and return value is allowed to hold.

**Key insight:** TypeScript only exists during development. Before your code runs in a browser or Node.js, TypeScript is compiled (translated) down to plain JavaScript. The type annotations vanish completely at runtime.

### 2. Why Does a QA Engineer Need TypeScript?

*💡 Analogy: A QA engineer using plain JavaScript for test automation is like a surgeon operating in the dark. They might get lucky. TypeScript turns on the lights.*

**Practical benefits for QA:**

**1. Catch bugs before they run**
If your Playwright test calls \`page.click(undefined)\` because a selector variable was never assigned, TypeScript screams at you in your editor *before* you even run the test.

**2. Self-documenting test code**
A function signature like \`async function login(username: string, password: string): Promise<void>\` tells every team member exactly what it accepts — zero guessing, zero Slack messages asking "what does this parameter mean?"

**3. Refactoring safety**
Rename a property in your Page Object Model and TypeScript instantly highlights every test file that needs updating. In plain JavaScript you'd find out when tests start failing at 2am.

**4. Autocomplete in your editor**
TypeScript knows the exact shape of every object, giving you accurate IntelliSense suggestions. No more guessing property names.

### 3. TypeScript vs JavaScript — Side-by-Side

\`\`\`typescript
// ── JAVASCRIPT (no types — no safety net) ──────────────────────
function calculateTotal(price, quantity) {
  return price * quantity;
}
// Nothing stops this bug from happening:
calculateTotal("10", 5); // Returns "1010101010" — string repetition, not math!
// Bug ships silently to production

// ── TYPESCRIPT (types = compile-time safety) ───────────────────
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
// TypeScript catches this immediately, before code even runs:
calculateTotal("10", 5);
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
\`\`\`

### 4. How TypeScript Compiles

\`\`\`
You write .ts file  →  tsc compiles it  →  .js file produced  →  Browser/Node runs .js
  (type-checked)      (errors caught!)      (types stripped)
\`\`\`

TypeScript errors are **compile-time** errors. Your code will not compile if types do not match. This is the entire point — fail loudly during development, not silently in production.

### 5. Setting Up TypeScript

\`\`\`bash
# Step 1: Install TypeScript globally
npm install -g typescript
tsc --version          # Verify installation

# Step 2: Initialise a project
tsc --init             # Creates tsconfig.json

# Step 3: Compile and run
tsc                    # Compile all .ts files to .js
node dist/index.js     # Run the compiled JavaScript
\`\`\`

**Essential tsconfig.json settings:**
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",        // Which JavaScript version to compile to
    "strict": true,            // Enable ALL strict checks — ALWAYS use this
    "outDir": "./dist",        // Where compiled .js files go
    "rootDir": "./src",        // Where your .ts source files live
    "esModuleInterop": true    // Fixes default import issues
  }
}
\`\`\`

### 6. Your First TypeScript File

\`\`\`typescript
// src/config.ts
const testEnvironment: string = "staging";
const maxRetries: number = 3;
const isHeadless: boolean = true;

console.log(\`Running on \${testEnvironment}, headless: \${isHeadless}, retries: \${maxRetries}\`);
\`\`\`

### 7. Common Beginner Mistakes

**Mistake 1: Using \`any\` to silence every error**
\`\`\`typescript
// ❌ You've defeated the entire purpose of TypeScript
let data: any = fetchFromAPI();

// ✅ Describe what the data actually looks like
let data: { userId: number; email: string } = fetchFromAPI();
\`\`\`

**Mistake 2: Forgetting that TypeScript needs compilation**
\`\`\`typescript
// ❌ Running .ts directly (old Node versions)
node src/hello.ts  // Syntax error — TypeScript not recognised

// ✅ Use ts-node for development (compiles on the fly)
npx ts-node src/hello.ts
\`\`\`

### 8. Structural Typing — TypeScript's Core Philosophy

*💡 Analogy: TypeScript is like a custom suit tailor who only cares about measurements, not your name. If the suit fits your body shape perfectly, you can wear it — the tailor doesn't check your passport. Two completely different people with identical measurements are interchangeable from the tailor's perspective.*

TypeScript uses **structural typing** (also called "duck typing"): it only cares about the **shape** of an object — the names and types of its properties — not what class it came from or what it is named.

\`\`\`typescript
interface HasName {
  name: string;
}

function greet(person: HasName): void {
  console.log(\`Hello, \${person.name}!\`);
}

// ✅ Any object with a 'name: string' property is accepted
greet({ name: "Sagar" });                              // Works
greet({ name: "QA Bot", role: "tester", level: 5 });  // Works — extra fields are fine
\`\`\`

**This matters especially for beginners from Java/C#** where types are *nominal* (based on the class name):

\`\`\`typescript
class Cat {
  name: string = "Whiskers";
  sound(): string { return "meow"; }
}

class Dog {
  name: string = "Rex";
  sound(): string { return "woof"; }
}

function petAnimal(animal: Cat): void {
  console.log(\`\${animal.name} says \${animal.sound()}\`);
}

// ✅ A Dog works here — because it has the same shape as Cat
// In Java this would be a compile error. In TypeScript: fine.
const dog = new Dog();
petAnimal(dog);  // ✅ TypeScript only checks shape, not class name
\`\`\`

**The practical rule:** If you give a function an object that has all the required properties with the right types, TypeScript accepts it — even if you didn't explicitly declare it as that type.
        `
      },
      {
        id: 'ts-variables',
        title: 'Variables & Declarations',
        analogy: "A variable is like a labelled jar on a kitchen shelf. The label says what it holds ('Sugar'), the jar is the storage space, and the contents are the value. With TypeScript, the label also declares what is allowed inside — a Sugar jar can never hold motor oil. `const` seals the jar permanently after first fill; `let` lets you pour it out and refill it later.",
        lessonMarkdown: `
### 1. What is a Variable?

*💡 Analogy: Imagine your test automation needs to remember the URL of the staging server so it can visit it in every test. Instead of typing "https://staging.example.com" forty times across forty test files, you store it once in a labelled container — a variable — and refer to the label everywhere. Change the URL in one place and all forty tests update automatically.*

A variable is a **named storage location** in computer memory. You give it a name, and you can store a value there, read it later, and (depending on how you declared it) change it.

\`\`\`typescript
// Declaring a variable with a name and a value
const baseURL = "https://staging.example.com";

// Now you can use the name everywhere instead of the raw value
console.log(baseURL);  // "https://staging.example.com"
\`\`\`

### 2. const — Use This by Default

*💡 Analogy: \`const\` is like a concrete post hammered into the ground and bolted shut. Once the concrete sets, you cannot pull the post out and move it. It points to that exact spot forever.*

\`const\` declares a variable whose **binding cannot be reassigned**. Once you set it, the name always points to that value.

\`\`\`typescript
const testEnvironment: string = "staging";
const maxRetries: number = 3;
const isHeadless: boolean = true;
const baseURL: string = "https://staging.example.com";

// ❌ Cannot reassign a const
testEnvironment = "production";  // Error: Assignment to constant variable
maxRetries = 5;                  // Error: Assignment to constant variable
\`\`\`

**Important: \`const\` fixes the binding, NOT the contents of objects/arrays:**
\`\`\`typescript
const config = { timeout: 30000, headless: true };

// ❌ Cannot reassign the variable itself
config = { timeout: 60000, headless: false };  // Error!

// ✅ BUT you CAN modify properties of a const object
config.timeout = 60000;   // Fine — the object itself is mutable
config.headless = false;  // Fine
\`\`\`

**Rule: Use \`const\` for everything unless you specifically need to reassign.** Most variables in well-written TypeScript are \`const\`.

### 3. let — When You Need to Reassign

*💡 Analogy: \`let\` is like a whiteboard. You write something on it, then erase and rewrite as needed. The whiteboard stays in the same spot — only its contents change.*

\`let\` declares a variable that **can be reassigned** after its initial declaration.

\`\`\`typescript
let currentTestName: string = "Login Test";
let passCount: number = 0;
let lastError: string | null = null;

// ✅ Reassignment is allowed with let
currentTestName = "Checkout Test";
passCount = passCount + 1;
lastError = "Element not found";
\`\`\`

**Real QA example — a counter that changes during a loop:**
\`\`\`typescript
let failCount: number = 0;

const results = ["pass", "fail", "pass", "fail", "fail"];

for (const result of results) {
  if (result === "fail") {
    failCount = failCount + 1;  // Reassigning — needs let
  }
}

console.log(\`Failed: \${failCount} / \${results.length}\`);  // Failed: 3 / 5
\`\`\`

### 4. var — The Legacy Keyword (Never Use)

*💡 Analogy: \`var\` is like a contractor who ignores the floor plan and puts furniture wherever they feel like it. Technically it works, but the results are unpredictable and everyone else is confused.*

\`var\` is the original JavaScript variable declaration — it predates \`let\` and \`const\`. It has two serious problems:

**Problem 1: Function-scoped, not block-scoped**
\`\`\`typescript
// ❌ var leaks out of if/for/while blocks
if (true) {
  var leaked = "I escaped the block!";
}
console.log(leaked);  // "I escaped the block!" — var ignored the {} boundary

// ✅ let stays inside its block
if (true) {
  let contained = "I stay here";
}
console.log(contained);  // ❌ ReferenceError — let respects the block
\`\`\`

**Problem 2: Hoisting causes silent bugs**
\`\`\`typescript
// ❌ var is "hoisted" to the top of its function — allows use before declaration
console.log(myVar);  // undefined (not an error!) — confusing and dangerous
var myVar = "hello";

// ✅ let/const are NOT hoisted
console.log(myLet);  // ❌ ReferenceError — clear and honest
let myLet = "hello";
\`\`\`

**Rule: Never use \`var\` in TypeScript. Use \`const\` or \`let\` exclusively.**

### 5. Block Scope — Where Variables Live

*💡 Analogy: Scope is like an office building with rooms. A variable declared inside a meeting room only exists in that room — people in the hallway cannot see it. But a variable declared in the hallway is visible from every room that opens onto it.*

\`let\` and \`const\` are **block-scoped** — they only exist within the nearest enclosing \`{}\` braces.

\`\`\`typescript
const testSuites = ["auth", "checkout", "profile"];

for (const suite of testSuites) {
  const logLine = \`Running suite: \${suite}\`;  // Only exists inside the loop body
  console.log(logLine);  // ✅ Accessible here
}

console.log(logLine);  // ❌ Error: 'logLine' is not defined — it's out of scope
console.log(suite);    // ❌ Error: 'suite' is not defined — also out of scope

// ✅ Variables declared before the loop are visible inside it
const prefix = "SUITE";
for (const suite of testSuites) {
  console.log(\`\${prefix}: \${suite}\`);  // ✅ prefix is from outer scope
}
\`\`\`

### 6. Declaration vs Initialisation

You can declare a variable with \`let\` without giving it a value immediately. TypeScript infers the type as \`undefined\` until assigned.

\`\`\`typescript
// Declared but NOT yet initialised
let loginResult: string;

// ... some code runs ...
loginResult = "success";  // Now initialised

// TypeScript will warn if you try to use it before assignment (with strict mode)
console.log(loginResult);  // OK only after the assignment above
\`\`\`

**With \`const\` you MUST initialise at declaration — no value means no const:**
\`\`\`typescript
const timeout: number;  // ❌ Error: 'const' declarations must be initialised
const timeout: number = 30000;  // ✅ Must assign immediately
\`\`\`

### 7. Type Annotations on Variables

TypeScript can **infer** the type from the assigned value, or you can be **explicit** with an annotation.

\`\`\`typescript
// Inferred — TypeScript reads the value and decides the type
const siteName  = "QA Quest";   // TypeScript infers: string
const retries   = 3;             // TypeScript infers: number
const headless  = true;          // TypeScript infers: boolean

// Explicit annotation — you declare the type yourself
const siteName: string  = "QA Quest";
const retries: number   = 3;
const headless: boolean = true;

// When to use explicit annotations:
// ✅ When the variable starts as null/undefined
let currentUser: string | null = null;

// ✅ When inference would be too broad (any)
let responseData: { id: number; email: string };

// ✅ When you want to document intent for complex types
const config: TestConfig = loadConfig();
\`\`\`

### 8. Naming Conventions

\`\`\`typescript
// camelCase for variables and functions — standard TypeScript convention
const testSuiteName = "Authentication Suite";
let currentRetryCount = 0;
const isTestPassing = true;

// UPPER_SNAKE_CASE for true constants that never change
const MAX_RETRIES = 3;
const BASE_URL = "https://staging.example.com";
const DEFAULT_TIMEOUT_MS = 30000;

// PascalCase for classes, interfaces, types, enums
interface TestResult { ... }
class LoginPage { ... }
type BrowserName = 'chromium' | 'firefox';

// Descriptive names over short names — code is read far more than written
const x = 30000;              // ❌ What is x?
const defaultTimeoutMs = 30000;  // ✅ Crystal clear
\`\`\`

### 9. Common Mistakes

**Mistake 1: Using \`let\` when \`const\` is appropriate**
\`\`\`typescript
// ❌ This never changes — should be const
let baseURL = "https://staging.example.com";

// ✅ Signals clearly that this value is fixed
const baseURL = "https://staging.example.com";
\`\`\`

**Mistake 2: Forgetting block scope**
\`\`\`typescript
// ❌ Trying to use a loop variable after the loop
for (let i = 0; i < 3; i++) {
  const message = \`Attempt \${i + 1}\`;
}
console.log(message);  // ❌ ReferenceError — message only lives inside the loop
\`\`\`

**Mistake 3: Confusing const for objects**
\`\`\`typescript
const user = { name: "Sagar", role: "QA" };
user = { name: "Someone else" };  // ❌ Cannot reassign the variable
user.name = "Sagar Nayak";        // ✅ Modifying the object is fine
\`\`\`
        `
      },
      {
        id: 'ts-control-flow',
        title: 'Control Flow',
        analogy: "Control flow is the traffic management system of your code. Without it, every instruction executes in the exact same order every single time — like a road with no traffic lights, no roundabouts, and no exits. `if/else` adds traffic lights (take this road only if the condition is green), loops add roundabouts (keep going around until the exit condition is met), and `switch` adds motorway junctions (choose the exit matching your destination).",
        lessonMarkdown: `
### 1. if / else — Conditional Execution

*💡 Analogy: An \`if\` statement is exactly like a quality gate in a factory: "If this part passes inspection, send it to packaging. Else, send it to rework." The factory only does ONE of those two things for each part — never both.*

\`\`\`typescript
const httpStatus: number = 404;

if (httpStatus === 200) {
  console.log("✅ Request succeeded");
} else if (httpStatus === 404) {
  console.log("❌ Resource not found");
} else if (httpStatus >= 500) {
  console.log("💥 Server error — retry");
} else {
  console.log(\`⚠️ Unexpected status: \${httpStatus}\`);
}
\`\`\`

**Real QA example — login verification:**
\`\`\`typescript
async function verifyLogin(
  username: string,
  password: string
): Promise<string> {
  if (!username || !password) {
    return "error: credentials required";
  }

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 200) {
    return "success";
  } else if (response.status === 401) {
    return "error: invalid credentials";
  } else {
    return \`error: unexpected status \${response.status}\`;
  }
}
\`\`\`

### 2. Ternary Operator — Inline if/else

*💡 Analogy: The ternary is the express checkout lane. You have one simple condition with two possible outcomes — it doesn't need a full \`if/else\` structure, just a quick inline decision.*

**Syntax: \`condition ? valueIfTrue : valueIfFalse\`**

\`\`\`typescript
const passed = true;

// Instead of:
let status: string;
if (passed) {
  status = "PASS";
} else {
  status = "FAIL";
}

// Write this:
const status = passed ? "PASS" : "FAIL";

// Real QA examples
const icon     = passed    ? "✅" : "❌";
const logLevel = hasFailed ? "error" : "info";
const retries  = isFlaky   ? 3      : 0;

// In template literals
console.log(\`Test \${testName}: \${passed ? "PASSED" : "FAILED"} in \${durationMs}ms\`);
\`\`\`

**⚠️ Don't nest ternaries — they become unreadable:**
\`\`\`typescript
// ❌ Nested ternary — impossible to read
const label = a ? "A" : b ? "B" : c ? "C" : "D";

// ✅ Use if/else chains for 3+ conditions
let label: string;
if (a)      label = "A";
else if (b) label = "B";
else if (c) label = "C";
else        label = "D";
\`\`\`

### 3. switch / case — Multiple Exact Matches

*💡 Analogy: A \`switch\` statement is like a hotel reception routing guests. When a guest gives their booking type, the receptionist directs them without checking every possibility one by one: "Business? → Floor 5. Standard? → Floor 3. Suite? → Floor 8. Anything else? → Check with manager."*

\`\`\`typescript
type TestStatus = 'pass' | 'fail' | 'skip' | 'running';

function describeStatus(status: TestStatus): string {
  switch (status) {
    case 'pass':
      return "✅ Test passed";
    case 'fail':
      return "❌ Test failed";
    case 'skip':
      return "⏭️ Test skipped";
    case 'running':
      return "⏳ Test in progress";
    default:
      return \`Unknown status: \${status}\`;
  }
}

console.log(describeStatus('pass'));   // "✅ Test passed"
console.log(describeStatus('fail'));   // "❌ Test failed"
\`\`\`

**⚠️ Always include \`break\` or \`return\` — without it, execution "falls through" to the next case:**
\`\`\`typescript
switch (status) {
  case 'fail':
    console.log("Logging failure...");
    // ❌ No break! Falls through into 'skip' case too
  case 'skip':
    console.log("This runs for both fail AND skip");
    break;
}
\`\`\`

### 4. for...of — Iterate Array Values (Most Common in QA)

*💡 Analogy: \`for...of\` is like a conveyor belt. Each item comes to you one at a time — you process it, then the next one arrives. You never deal with position numbers; you just process each item in order.*

\`\`\`typescript
const browsers: string[] = ["chromium", "firefox", "webkit"];

// for...of gives you each VALUE directly
for (const browser of browsers) {
  console.log(\`Running tests in: \${browser}\`);
}
// Running tests in: chromium
// Running tests in: firefox
// Running tests in: webkit

// Works with any iterable — strings, Sets, Maps
for (const char of "QA") {
  console.log(char);  // Q, then A
}
\`\`\`

**Real QA example — data-driven tests:**
\`\`\`typescript
const testCases = [
  { username: "admin@test.com",  password: "Secure123!", shouldPass: true  },
  { username: "user@test.com",   password: "WrongPass",  shouldPass: false },
  { username: "",                password: "Secure123!", shouldPass: false },
];

for (const tc of testCases) {
  const result = await attemptLogin(tc.username, tc.password);
  const outcome = result.success === tc.shouldPass ? "✅ PASS" : "❌ FAIL";
  console.log(\`\${outcome} | user: \${tc.username || "(empty)"}\`);
}
\`\`\`

### 5. for — Traditional Index-Based Loop

*💡 Analogy: A traditional \`for\` loop is like a production line worker counting pieces manually: "I've done piece 1, piece 2, piece 3... stop when I reach 100." You always know exactly which position you're at.*

\`\`\`typescript
// Syntax: for (initialise; condition; increment)
for (let i = 0; i < 5; i++) {
  console.log(\`Retry attempt \${i + 1}\`);
}
// Retry attempt 1
// Retry attempt 2
// ...
// Retry attempt 5

// Counting down
for (let i = 3; i >= 1; i--) {
  console.log(\`Retrying in \${i}...\`);
}

// Iterating with index (when you need the position)
const results = ["pass", "fail", "pass"];
for (let i = 0; i < results.length; i++) {
  console.log(\`Test \${i + 1}: \${results[i]}\`);
}
\`\`\`

### 6. while — Repeat Until Condition Changes

*💡 Analogy: A \`while\` loop is like a waiter checking if your food is ready: keep checking, keep checking, keep checking — stop the moment it's done. You don't know how many times you'll check; you just keep going until the condition is false.*

\`\`\`typescript
let attempts = 0;
const maxAttempts = 5;
let success = false;

while (!success && attempts < maxAttempts) {
  attempts++;
  console.log(\`Attempt \${attempts}...\`);
  success = await tryLogin();  // Imagine this returns true eventually
}

if (success) {
  console.log("Login succeeded!");
} else {
  console.log(\`Login failed after \${maxAttempts} attempts\`);
}
\`\`\`

### 7. for...in — Iterate Object Keys

*💡 Analogy: \`for...in\` is like reading the table of contents of a book — you're getting the chapter TITLES (keys), not the chapter content (values).*

\`\`\`typescript
const testConfig = {
  baseURL:  "https://staging.example.com",
  timeout:  30000,
  headless: true,
};

// for...in gives you each KEY (property name)
for (const key in testConfig) {
  console.log(\`\${key}: \${testConfig[key as keyof typeof testConfig]}\`);
}
// baseURL: https://staging.example.com
// timeout: 30000
// headless: true
\`\`\`

**Note: For arrays, always prefer \`for...of\` over \`for...in\`. \`for...in\` on arrays gives you index strings ("0", "1", "2"), not values.**

### 8. break and continue

\`\`\`typescript
const testResults = ["pass", "pass", "fail", "pass", "pass"];

// break — exit the loop immediately
for (const result of testResults) {
  if (result === "fail") {
    console.log("🛑 Stopping on first failure");
    break;  // No more iterations
  }
  console.log(\`✅ \${result}\`);
}
// ✅ pass
// ✅ pass
// 🛑 Stopping on first failure

// continue — skip THIS iteration, continue to the next
for (const result of testResults) {
  if (result === "fail") {
    console.log("⏭️ Skipping failure");
    continue;  // Jump to next iteration
  }
  console.log(\`✅ \${result}\`);
}
// ✅ pass
// ✅ pass
// ⏭️ Skipping failure
// ✅ pass
// ✅ pass
\`\`\`

### 9. Common Mistakes

**Mistake 1: Off-by-one errors in traditional for loops**
\`\`\`typescript
const items = ["a", "b", "c"];  // Length: 3, valid indices: 0, 1, 2

// ❌ <= instead of < — accesses items[3] which is undefined
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);  // Last iteration: undefined
}

// ✅ Always use < items.length
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}
\`\`\`

**Mistake 2: Forgetting to update the while condition**
\`\`\`typescript
// ❌ Infinite loop — attempts never increases
let attempts = 0;
while (attempts < 5) {
  console.log("Trying...");
  // Forgot: attempts++
}

// ✅ Always ensure the condition changes
while (attempts < 5) {
  attempts++;
  console.log(\`Trying... attempt \${attempts}\`);
}
\`\`\`
        `
      },
      {
        id: 'ts-template-destructuring',
        title: 'Template Literals, Destructuring & Spread',
        analogy: "Template literals are a mail-merge system — you write the letter once with blank slots, and names/values are poured in at print time. Destructuring is like unpacking a moving box by label — instead of pulling everything out one item at a time, you tell the unpacking crew exactly which items go where by name. Spread is like tipping a box of building blocks onto an existing pile — the contents merge together.",
        lessonMarkdown: `
### 1. Template Literals — Dynamic Strings

*💡 Analogy: Old-style string concatenation is like cutting words from a magazine and gluing them together one letter at a time. Template literals are a modern mail merge: you write the template once, and variables are poured into the blank slots automatically.*

**Old way (string concatenation):**
\`\`\`typescript
const testName = "Login Test";
const duration = 1250;
const passed   = true;

// ❌ Messy, error-prone, hard to read
const log = "[" + (passed ? "PASS" : "FAIL") + "] " + testName + " completed in " + duration + "ms";
\`\`\`

**Template literal (backtick strings):**
\`\`\`typescript
// ✅ Clean, readable, exactly what you see is what you get
const log = \`[\${passed ? "PASS" : "FAIL"}] \${testName} completed in \${duration}ms\`;
// [PASS] Login Test completed in 1250ms
\`\`\`

**Syntax rules:**
\`\`\`typescript
// Use BACKTICKS (the key to the left of 1), not quotes
const greeting = \`Hello, \${username}!\`;

// Any JavaScript expression goes inside \${}
const summary = \`Tests: \${passed} passed, \${failed} failed, \${Math.round((passed / total) * 100)}% pass rate\`;

// Multi-line strings — no \n needed
const htmlReport = \`
<div class="test-result">
  <h2>\${testName}</h2>
  <p>Status: \${status}</p>
  <p>Duration: \${durationMs}ms</p>
</div>
\`;
\`\`\`

### 2. Multi-line Strings

\`\`\`typescript
// ❌ Old way — \n escape sequences are ugly
const sqlQuery = "SELECT users.email, orders.total\n" +
                 "FROM users\n" +
                 "JOIN orders ON users.id = orders.user_id\n" +
                 "WHERE users.active = true";

// ✅ Template literal — multi-line naturally
const sqlQuery = \`
  SELECT users.email, orders.total
  FROM users
  JOIN orders ON users.id = orders.user_id
  WHERE users.active = true
\`;

// QA: building dynamic SQL for test data validation
const findUser = \`
  SELECT id, email, status
  FROM users
  WHERE email = '\${testEmail}'
    AND created_at > '\${startDate}'
\`;
\`\`\`

### 3. Array Destructuring — Unpack by Position

*💡 Analogy: Array destructuring is like a conveyor belt with labelled collection boxes. The first box on the left catches whatever comes first, the second catches the second item. You give each box a name and it automatically receives the matching item.*

\`\`\`typescript
const testResult: [string, number, boolean] = ["Login Test", 1250, true];

// ❌ Old way — verbose index access
const name      = testResult[0];
const duration  = testResult[1];
const passed    = testResult[2];

// ✅ Array destructuring — unpack in one line
const [name, duration, passed] = testResult;
console.log(name);     // "Login Test"
console.log(duration); // 1250
console.log(passed);   // true
\`\`\`

**Skipping elements — use a comma with no name:**
\`\`\`typescript
const scores = [85, 92, 78, 95, 88];

// Only care about first and third — skip second
const [first, , third] = scores;
console.log(first);  // 85
console.log(third);  // 78
\`\`\`

**Default values — used when the element is undefined:**
\`\`\`typescript
const partial = ["Login Test"];

const [testName, timeout = 30000] = partial;
console.log(testName);  // "Login Test"
console.log(timeout);   // 30000 — default used because index 1 is undefined
\`\`\`

**Rest in array destructuring:**
\`\`\`typescript
const allBrowsers = ["chromium", "firefox", "webkit", "edge"];

const [primary, ...remainingBrowsers] = allBrowsers;
console.log(primary);            // "chromium"
console.log(remainingBrowsers);  // ["firefox", "webkit", "edge"]
\`\`\`

### 4. Object Destructuring — Unpack by Name

*💡 Analogy: Object destructuring is like a smart baggage claim where bags are labelled by owner name. Instead of lifting every bag off the belt and checking the tag manually, you call your name and only your bags come to you — directly into your hands, already labelled.*

\`\`\`typescript
const testConfig = {
  baseURL:  "https://staging.example.com",
  timeout:  30000,
  headless: true,
  retries:  3,
};

// ❌ Old way — repetitive
const baseURL  = testConfig.baseURL;
const timeout  = testConfig.timeout;
const headless = testConfig.headless;

// ✅ Object destructuring — grab by property name
const { baseURL, timeout, headless } = testConfig;
console.log(baseURL);   // "https://staging.example.com"
console.log(timeout);   // 30000
console.log(headless);  // true
\`\`\`

**Renaming while destructuring:**
\`\`\`typescript
const apiResponse = { status: 200, data: { userId: 42, email: "qa@test.com" } };

// Property is called 'status' but you want to call it 'httpStatus' locally
const { status: httpStatus, data: responseBody } = apiResponse;
console.log(httpStatus);    // 200
console.log(responseBody);  // { userId: 42, email: "qa@test.com" }
\`\`\`

**Default values in object destructuring:**
\`\`\`typescript
function runTest({ testName, timeout = 30000, retries = 0 }: {
  testName: string;
  timeout?: number;
  retries?: number;
}): void {
  console.log(\`Running "\${testName}" | timeout: \${timeout}ms | retries: \${retries}\`);
}

runTest({ testName: "Login Flow" });                   // timeout: 30000, retries: 0
runTest({ testName: "Checkout", timeout: 60000 });     // timeout: 60000, retries: 0
runTest({ testName: "Smoke", timeout: 10000, retries: 2 }); // all explicit
\`\`\`

**Nested destructuring:**
\`\`\`typescript
const user = {
  id: 1,
  profile: {
    name: "Sagar",
    email: "sagar@qa.com",
  },
};

// Destructure nested object in one step
const { id, profile: { name, email } } = user;
console.log(id);     // 1
console.log(name);   // "Sagar"
console.log(email);  // "sagar@qa.com"
// Note: 'profile' is NOT a variable here — it's just the path
\`\`\`

### 5. Spread Operator — Copy and Merge

*💡 Analogy: The spread operator \`...\` is like an "explode" button. It takes a container and pours all its contents out individually into the surrounding context — into a new array, a new object, or a function call's argument list.*

**Spread with arrays — combine or copy:**
\`\`\`typescript
const smokeTests   = ["Login", "Logout", "Dashboard"];
const regressionTests = ["Checkout", "Payment", "Profile"];

// Merge two arrays into a new one
const allTests = [...smokeTests, ...regressionTests];
console.log(allTests);
// ["Login", "Logout", "Dashboard", "Checkout", "Payment", "Profile"]

// Copy an array (safe — modifications don't affect the original)
const originalResults = [true, false, true];
const resultsCopy = [...originalResults];
resultsCopy.push(true);
console.log(originalResults);  // [true, false, true] — unchanged
console.log(resultsCopy);      // [true, false, true, true]

// Add an element without mutating the original
const moreTests = [...smokeTests, "Register"];
\`\`\`

**Spread with objects — merge configurations:**
\`\`\`typescript
const defaultConfig = {
  timeout:  30000,
  headless: true,
  retries:  0,
};

const ciOverrides = {
  headless: true,
  retries:  3,
};

// Merge: later properties override earlier ones for same keys
const ciConfig = { ...defaultConfig, ...ciOverrides };
console.log(ciConfig);
// { timeout: 30000, headless: true, retries: 3 }
// timeout comes from defaultConfig; headless and retries from ciOverrides
\`\`\`

**Spread to pass array as individual function arguments:**
\`\`\`typescript
const numbers = [10, 25, 3, 98, 47];

const max = Math.max(...numbers);  // Equivalent to Math.max(10, 25, 3, 98, 47)
console.log(max);  // 98
\`\`\`

### 6. Real QA Patterns Combining All Three

\`\`\`typescript
// Pattern: Merge test fixture with overrides
const baseUser = { email: "base@test.com", role: "user", verified: true };

function createTestUser(overrides: Partial<typeof baseUser> = {}) {
  return { ...baseUser, ...overrides };
}

const adminUser   = createTestUser({ role: "admin" });
const unverified  = createTestUser({ email: "new@test.com", verified: false });

// Pattern: Destructure API response and log with template literal
async function logAPIResult(endpoint: string) {
  const response = await fetch(endpoint);
  const { status, statusText } = response;
  const data = await response.json();
  const { id, email } = data;
  console.log(\`[\${status} \${statusText}] User #\${id}: \${email}\`);
}
\`\`\`

### 7. Common Mistakes

**Mistake 1: Forgetting \${} in template literals**
\`\`\`typescript
const name = "Sagar";

// ❌ Forgot the curly braces — prints the literal text "$name"
console.log(\`Hello, $name!\`);     // "Hello, $name!" — wrong!

// ✅ Must use \${} for interpolation
console.log(\`Hello, \${name}!\`);   // "Hello, Sagar!" — correct
\`\`\`

**Mistake 2: Destructuring a property that doesn't exist**
\`\`\`typescript
const response = { status: 200 };

const { status, data } = response;
console.log(data);  // undefined — no error from TypeScript without strict mode
                    // With strict mode this would be caught at compile time
\`\`\`

**Mistake 3: Spread does a SHALLOW copy**
\`\`\`typescript
const original = { name: "Test", config: { timeout: 30000 } };
const copy = { ...original };

copy.config.timeout = 99999;  // ⚠️ Also modifies original.config.timeout!
// Spread only copies the top level — nested objects are still shared references
console.log(original.config.timeout);  // 99999 — mutated!
\`\`\`
        `
      },

      {
        id: 'ts-basic-types',
        title: 'Core Types',
        analogy: "TypeScript's types are like labelled containers in a chemistry lab. A beaker labelled 'Acid' cannot have water poured into it without triggering an alarm — the label enforces exactly what goes in, preventing catastrophic mix-ups.",
        lessonMarkdown: `
### 1. The Core Types — Overview

*💡 Analogy: Think of types like different sections in a specialist hardware store. The 'Bolts' aisle only stocks bolts. The 'Paint' aisle only stocks paint. TypeScript assigns every variable to its own section and refuses to mix inventory.*

TypeScript has eight core types you'll use constantly. Understanding each one properly is the foundation of everything else.

### 2. string — For All Text Data

\`\`\`typescript
const testSuiteName: string = "Checkout Flow Tests";
const baseURL: string       = "https://staging.example.com";
const cssSelector: string   = "#submit-button";
const apiKey: string        = "Bearer eyJhbGciOiJIUzI1NiJ9";

// Template literals are also strings
const logLine: string = \`Suite: \${testSuiteName} | URL: \${baseURL}\`;
\`\`\`

**QA use cases:** Test descriptions, CSS selectors, URLs, expected page text, API endpoints.

### 3. number — For All Numeric Values

*💡 Analogy: Unlike Java or C#, TypeScript has ONE numeric type for both whole numbers and decimals. It's a single 'Numbers' drawer — 42 and 42.5 live side by side.*

\`\`\`typescript
const timeout: number    = 30000;     // milliseconds (integer)
const retryCount: number = 3;         // whole number
const successRate: number = 98.5;     // decimal percentage
const httpStatusOK: number = 200;     // HTTP status code

const timeoutInSeconds: number = timeout / 1000;  // Arithmetic: 30
\`\`\`

### 4. boolean — For True/False Logic

\`\`\`typescript
const isLoggedIn: boolean  = false;
const isHeadless: boolean  = true;
const skipSlowTests: boolean = process.env.CI === 'true';

// Computed boolean — result of a comparison
const testPassed: boolean = actualTitle === expectedTitle;

if (!testPassed) {
  throw new Error(\`Title mismatch: expected "\${expectedTitle}", got "\${actualTitle}"\`);
}
\`\`\`

### 5. null and undefined — The "Nothing" Types

*💡 Analogy: \`undefined\` is a mailbox that was never set up — the address exists in the system but no box was ever installed. \`null\` is a mailbox that was deliberately emptied and sealed with a sign saying "Nothing here by design."*

\`\`\`typescript
// undefined: declared but not yet assigned a value
let currentUser: string | undefined;
console.log(currentUser);  // undefined

// null: explicitly set to "intentionally empty"
let sessionToken: string | null = null;
// After logout, we deliberately clear it:
sessionToken = null;
\`\`\`

**With \`"strict": true\` in tsconfig:** You cannot accidentally assign \`null\` to a plain \`string\` variable. You must explicitly declare \`string | null\` to allow it — forcing you to handle the absent case.

### 6. any — The Escape Hatch (Avoid It!)

*💡 Analogy: \`any\` is a master key that opens every door in the building. Yes, it works — but it means anyone can go anywhere. You have turned off all the security cameras and unplugged the burglar alarm.*

\`\`\`typescript
// ❌ any disables ALL type checking on this variable
let apiResponse: any = await fetch("/api/data");
apiResponse.nonExistentProperty.deeperNested; // TypeScript says nothing — bug ships silently

// ✅ Prefer unknown — forces you to validate before using
let apiResponse: unknown = await fetch("/api/data");
// apiResponse.someProperty; // ❌ Error! Must narrow the type first — you're forced to be safe
\`\`\`

**Rule:** If you're typing \`: any\`, pause. Every \`any\` is a TypeScript-free bug corridor.

### 7. unknown — The Safe Version of any

*💡 Analogy: \`any\` is a mystery box you open blindly and grab from without looking. \`unknown\` is a mystery box you must X-ray and verify before your hand goes in.*

\`\`\`typescript
function processAPIResponse(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();  // ✅ Safe — confirmed it's a string
  }
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String((data as { message: string }).message);
  }
  return "Unrecognised response format";
}
\`\`\`

### 8. never — The Impossible Type

*💡 Analogy: \`never\` is a door labelled "This door can never open." If execution somehow reaches it, the universe has made a mistake.*

\`\`\`typescript
// A function that ALWAYS throws — it never returns normally
function failTest(reason: string): never {
  throw new Error(\`TEST FAILED: \${reason}\`);
}

// Exhaustive switch — ensures all union cases are handled
type TestStatus = 'pass' | 'fail' | 'skip';

function describe(status: TestStatus): string {
  switch (status) {
    case 'pass': return '✅ Passed';
    case 'fail': return '❌ Failed';
    case 'skip': return '⏭️ Skipped';
    default:
      // If you add a new status and forget to handle it, TypeScript errors HERE
      const _unreachable: never = status;
      return _unreachable;
  }
}
\`\`\`

### 9. void — For Functions That Return Nothing

\`\`\`typescript
// Logs to console — no value returned
function logResult(testName: string, passed: boolean): void {
  console.log(\`[\${passed ? 'PASS' : 'FAIL'}] \${testName}\`);
  // Implicit return — no return statement needed
}
\`\`\`

### 10. Type Inference — TypeScript Reads Your Mind

*💡 Analogy: A sharp assistant who says "You handed me a book — I don't need you to say 'this is a book.' I can see that."*

\`\`\`typescript
// TypeScript INFERS the type from the assigned value — no annotation needed
const siteName  = "QA Quest";   // inferred: string
const maxRetries = 3;           // inferred: number
const isActive   = true;        // inferred: boolean

// When to annotate explicitly:
// ✅ Function parameters (TypeScript cannot infer these)
// ✅ Function return types (makes intent explicit)
// ✅ When the inferred type would be too broad (e.g., any)
\`\`\`
        `
      },
      {
        id: 'ts-arrays-tuples',
        title: 'Arrays & Tuples',
        analogy: "An array is a bag of fruit where every piece must be the same type — a bag of apples, only apples, as many as you like. A tuple is a precise meal-kit box: slot 1 MUST be the protein, slot 2 MUST be the vegetable, slot 3 MUST be the sauce — position and type are both locked.",
        lessonMarkdown: `
### 1. Typed Arrays — Lists Where Every Element Has the Same Type

*💡 Analogy: A typed array is like a professional test report spreadsheet where every row must follow the exact same column structure. You cannot mix test result rows with screenshot attachments and raw HTML — each array holds one declared type of thing.*

**Two equivalent syntaxes:**
\`\`\`typescript
// Syntax 1: TypeName[] — most common, easier to read
const testNames: string[]   = ["Login Test", "Checkout Test", "Logout Test"];
const statusCodes: number[] = [200, 201, 404, 500];
const results: boolean[]    = [true, true, false, true];

// Syntax 2: Array<TypeName> — more explicit, identical result
const selectors: Array<string> = ["#username", "#password", "#submit"];
const timeouts: Array<number>  = [5000, 10000, 30000];
\`\`\`

**TypeScript enforces the element type:**
\`\`\`typescript
const urls: string[] = ["https://staging.com", "https://prod.com"];
urls.push(42);              // ❌ Error: Argument of type 'number' not assignable to 'string'
urls.push("https://dev.com"); // ✅ Fine
\`\`\`

### 2. Arrays of Objects — The Most Common Pattern in QA

\`\`\`typescript
// A typed array of test case objects
const testCases: { name: string; url: string; expectedStatus: number }[] = [
  { name: "Home page",    url: "/",        expectedStatus: 200 },
  { name: "Login page",   url: "/login",   expectedStatus: 200 },
  { name: "Missing page", url: "/missing", expectedStatus: 404 },
];

for (const tc of testCases) {
  // TypeScript knows tc.name is string, tc.expectedStatus is number
  console.log(\`Testing \${tc.name}: expect \${tc.expectedStatus}\`);
}
\`\`\`

### 3. Array Methods — TypeScript Tracks Return Types

\`\`\`typescript
const scores: number[] = [85, 92, 78, 95, 88];

const passing  = scores.filter(s => s >= 80);         // TypeScript knows: number[]
const grades   = scores.map(s => s >= 80 ? 'P' : 'F'); // TypeScript knows: string[]
const total    = scores.reduce((sum, s) => sum + s, 0); // TypeScript knows: number
const topScore = Math.max(...scores);                    // TypeScript knows: number

// Destructuring — TypeScript infers each element type
const [first, second, ...rest] = scores;
// first: number, second: number, rest: number[]
\`\`\`

### 4. Readonly Arrays — Immutable Test Data

*💡 Analogy: A \`readonly\` array is a laminated reference card. You can read every item on it, but you cannot write on it, add to it, or remove anything. It's a permanent record.*

\`\`\`typescript
const VALID_ENVIRONMENTS: readonly string[] = ["dev", "staging", "production"];
// Also written as: ReadonlyArray<string>

VALID_ENVIRONMENTS.push("local");    // ❌ Error: Property 'push' does not exist on readonly array
VALID_ENVIRONMENTS[0] = "test";      // ❌ Error: Index signature is read-only
console.log(VALID_ENVIRONMENTS[1]);  // ✅ Reading is fine — "staging"
\`\`\`

### 5. Tuples — Fixed-Length, Positionally-Typed Arrays

*💡 Analogy: A tuple is like a table row in a database with a strict schema. Column 1 is ALWAYS a DATE, column 2 is ALWAYS a VARCHAR test name, column 3 is ALWAYS a BOOLEAN result. Mixing up the order is a schema violation.*

\`\`\`typescript
// A tuple: the type AND position of each element is fixed
const testResult: [string, number, boolean] = ["Login Flow", 1250, true];

// TypeScript knows the exact type at each index:
const name: string  = testResult[0];  // ✅ string
const ms: number    = testResult[1];  // ✅ number
const pass: boolean = testResult[2];  // ✅ boolean

// TypeScript catches wrong order immediately:
const bad: [string, number, boolean] = [true, "Login", 1250];
// ❌ Error: Type 'boolean' is not assignable to type 'string' at position 0
\`\`\`

### 6. Named Tuples — Self-Documenting Data Structures

\`\`\`typescript
// Naming each position makes the intent obvious
type TestOutcome = [
  testName: string,
  durationMs: number,
  passed: boolean,
  errorMessage?: string   // Optional last element
];

const outcome1: TestOutcome = ["Login Test", 850, true];
const outcome2: TestOutcome = ["Checkout Test", 2400, false, "Submit button not found"];
\`\`\`

### 7. Real QA Example — Data-Driven Testing with Typed Tuples

\`\`\`typescript
type LoginTestCase = [
  username: string,
  password: string,
  shouldSucceed: boolean,
  expectedError?: string
];

const loginTests: LoginTestCase[] = [
  ["admin@test.com",  "SecurePass123!", true],
  ["user@test.com",   "WrongPassword",  false, "Invalid credentials"],
  ["",                "SomePassword",   false, "Email is required"],
  ["notanemail",      "Password123",    false, "Invalid email format"],
];

for (const [username, password, shouldSucceed, expectedError] of loginTests) {
  console.log(\`Testing \${username} — expects \${shouldSucceed ? 'success' : 'failure'}\`);
  if (!shouldSucceed && expectedError) {
    console.log(\`  Expected error: \${expectedError}\`);
  }
}
\`\`\`

### 8. Tuples vs Arrays — Decision Guide

| Scenario | Use Array | Use Tuple |
|----------|-----------|-----------|
| List of test names (variable length) | ✅ | |
| Function returning [value, error] | | ✅ |
| CSV row with fixed columns | | ✅ |
| Collection of identical objects | ✅ | |
| [x, y] coordinates | | ✅ |
| Test data table rows | | ✅ |
        `
      },
      {
        id: 'ts-objects-interfaces',
        title: 'Objects & Interfaces',
        analogy: "An interface is like a formal job description. It lists exactly what skills, qualifications, and responsibilities a candidate MUST have. Any person (object) who meets every item on the list qualifies — TypeScript doesn't care who they are, only that they match the specification.",
        lessonMarkdown: `
### 1. Typing Objects Inline

*💡 Analogy: An inline object type is like writing your shopping checklist directly on the receipt: 'This bag must contain: 1x milk, 1x bread, 2x eggs.' Any bag matching this exactly gets accepted.*

\`\`\`typescript
// Describing the shape of an object directly in the annotation
const testConfig: {
  baseURL: string;
  timeout: number;
  headless: boolean;
} = {
  baseURL:  "https://staging.example.com",
  timeout:  30000,
  headless: true,
};
\`\`\`

This works for one-off objects, but it's verbose and hard to reuse. For anything used in more than one place, use an **Interface**.

### 2. Interfaces — Reusable Object Shape Contracts

\`\`\`typescript
// Define the shape once
interface TestConfig {
  baseURL: string;
  timeout: number;
  headless: boolean;
}

// Reuse everywhere
const stagingConfig: TestConfig = {
  baseURL:  "https://staging.example.com",
  timeout:  30000,
  headless: true,
};

const prodConfig: TestConfig = {
  baseURL:  "https://www.example.com",
  timeout:  10000,
  headless: false,
};

// Any function that accepts TestConfig works with any matching object
function printConfig(config: TestConfig): void {
  console.log(\`[\${config.headless ? 'headless' : 'headed'}] \${config.baseURL} @ \${config.timeout}ms\`);
}
\`\`\`

**TypeScript enforces the contract:**
\`\`\`typescript
const badConfig: TestConfig = {
  baseURL: "https://staging.example.com",
  timeout: "thirty seconds",  // ❌ Error: string not assignable to number
  // headless is missing      // ❌ Error: Property 'headless' is missing
};
\`\`\`

### 3. Optional Properties — The ? Modifier

*💡 Analogy: Optional properties are like the 'Special Requests' field on a hotel check-in form. Name and check-in date are mandatory. Special requests are welcome but the form is valid without them.*

\`\`\`typescript
interface UserProfile {
  email: string;         // Required — must always be present
  displayName: string;   // Required
  avatarUrl?: string;    // Optional — may be present or absent
  bio?: string;          // Optional
  lastLoginAt?: Date;    // Optional
}

// Valid with only required fields
const user1: UserProfile = {
  email: "qa@example.com",
  displayName: "QA Ninja",
};

// Valid with some optional fields included
const user2: UserProfile = {
  email: "dev@example.com",
  displayName: "Dev Hero",
  avatarUrl: "https://cdn.example.com/avatar.png",
  bio: "Breaking things professionally since 2015",
};
\`\`\`

### 4. Readonly Properties — Immutable After Creation

\`\`\`typescript
interface TestEnvironment {
  readonly id: string;       // Cannot be changed after object creation
  readonly createdAt: Date;
  name: string;              // Can be changed
  isActive: boolean;         // Can be changed
}

const env: TestEnvironment = {
  id: "env-staging-01",
  createdAt: new Date(),
  name: "Staging",
  isActive: true,
};

env.name = "Staging-v2";   // ✅ Fine — not readonly
env.isActive = false;       // ✅ Fine
env.id = "env-staging-02"; // ❌ Error: Cannot assign to 'id' because it is read-only
\`\`\`

### 5. Extending Interfaces — Building Richer Shapes

*💡 Analogy: Extending is like a company's employment contract system. Every employee has a base contract (name, email, start date). A senior engineer's contract EXTENDS the base with additional clauses (tech stack, review responsibilities). The senior contract doesn't rewrite the base — it adds to it.*

\`\`\`typescript
interface Person {
  firstName: string;
  lastName: string;
  email: string;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
  startDate: Date;
}

interface QAEngineer extends Employee {
  testFrameworks: string[];
  canReviewCode: boolean;
  certifications?: string[];
}

const lead: QAEngineer = {
  firstName: "Sagar",
  lastName:  "Nayak",
  email:     "sagar@qa.com",
  employeeId: "EMP-042",
  department: "Quality Assurance",
  startDate:  new Date("2022-01-15"),
  testFrameworks: ["Playwright", "Jest"],
  canReviewCode: true,
  certifications: ["ISTQB Foundation"],
};
\`\`\`

### 6. Page Object Model — Interfaces in Real QA Projects

*💡 This is exactly how professional QA engineers use TypeScript interfaces in production automation frameworks.*

\`\`\`typescript
// Define the contract — what a login page MUST be able to do
interface ILoginPage {
  navigate(): Promise<void>;
  enterUsername(value: string): Promise<void>;
  enterPassword(value: string): Promise<void>;
  clickSubmit(): Promise<void>;
  getErrorMessage(): Promise<string | null>;
}

// The implementation must satisfy the interface
class LoginPage implements ILoginPage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto("/login");
  }
  async enterUsername(value: string): Promise<void> {
    await this.page.fill('[data-testid="username"]', value);
  }
  async enterPassword(value: string): Promise<void> {
    await this.page.fill('[data-testid="password"]', value);
  }
  async clickSubmit(): Promise<void> {
    await this.page.click('[data-testid="submit"]');
  }
  async getErrorMessage(): Promise<string | null> {
    const el = this.page.locator('.error-message');
    if (await el.isVisible()) return el.textContent();
    return null;
  }
}
\`\`\`

### 7. Index Signatures — Objects with Dynamic Keys

\`\`\`typescript
// When property names are unknown at design time
interface TestResultMap {
  [testName: string]: 'pass' | 'fail' | 'skip';
}

const results: TestResultMap = {
  "Login with valid credentials": "pass",
  "Login with wrong password":    "fail",
  "Register with existing email": "skip",
};

// Add results dynamically
results["Password reset flow"] = "pass";

// All values are correctly typed
const loginResult = results["Login with valid credentials"]; // 'pass' | 'fail' | 'skip'
\`\`\`

### 8. object vs {} vs Record — Clearing Up the Confusion

*💡 Analogy: \`object\` is like being told "there's a parcel in the warehouse" — you know it exists but cannot open it or see what's inside. \`{}\` is a nearly empty label that matches almost everything. \`Record<string, unknown>\` is a properly labelled shelf where you know what kind of items live there, even if you don't know the specific names.*

This trips up almost every beginner — three seemingly similar things that behave very differently:

\`\`\`typescript
// ── object (lowercase) ──────────────────────────────────────────
// Accepts any non-primitive value (objects, arrays, functions)
// BUT gives you no access to any properties

let x: object = { id: 1, name: "Sagar" };
x.id;    // ❌ Error: Property 'id' does not exist on type 'object'
x.name;  // ❌ Error — object type has NO accessible properties

// ── {} (empty object type) ───────────────────────────────────────
// Matches anything that is NOT null or undefined
// Even primitives! Very rarely what you actually want.

let y: {} = "hello";   // ✅ String is accepted — probably not what you meant
let z: {} = 42;        // ✅ Number is accepted — almost certainly wrong
let w: {} = null;      // ❌ null is rejected (with strictNullChecks)

// ── Record<string, unknown> ─────────────────────────────────────
// The correct type for "an object with unknown string keys"
// Gives you access to properties (as unknown, requiring narrowing)

let config: Record<string, unknown> = { timeout: 30000, headless: true };
const timeout = config["timeout"];  // ✅ type is unknown — you must narrow it before use

// ── Use a specific interface whenever you know the shape ─────────
// This is always the best option when the shape is known
interface TestConfig {
  timeout: number;
  headless: boolean;
}
const cfg: TestConfig = { timeout: 30000, headless: true };
cfg.timeout;  // ✅ number — fully typed
\`\`\`

**Quick decision guide:**
| If you want... | Use... |
|---|---|
| An object with a known fixed shape | \`interface\` or \`type\` |
| An object with unknown string keys | \`Record<string, unknown>\` |
| To pass any non-primitive | \`object\` (rare) |
| Almost never | \`{}\` |
        `
      },
      {
        id: 'ts-functions',
        title: 'Functions with TypeScript',
        analogy: "A typed function is like a vending machine with labelled slots: insert a coin (number) in slot A and a product code (string) in slot B, and receive a specific Snack (Snack object). The machine physically cannot accept a banana leaf in the coin slot — the shape simply doesn't fit.",
        lessonMarkdown: `
### 1. Parameter Type Annotations

*💡 Analogy: Function parameters with type annotations are like labelled input ports on professional equipment. The USB-C port accepts USB-C only. The HDMI port accepts HDMI only. Wrong cable, wrong shape — it physically cannot connect.*

\`\`\`typescript
// Without types — anything can sneak in silently
function retryTest(testFn, count) {
  // Is testFn a function? A string? A number? Unknown!
  // Is count a string "3" or a number 3? Who knows?
}

// With types — the contract is explicit and enforced
function retryTest(
  testFn: () => Promise<void>,
  count: number
): Promise<void> {
  // testFn is definitively a function returning a Promise
  // count is definitively a number
}
\`\`\`

### 2. Return Type Annotations

\`\`\`typescript
// Returning a string
function getBaseURL(environment: string): string {
  if (environment === "staging")    return "https://staging.example.com";
  if (environment === "production") return "https://www.example.com";
  return "https://dev.example.com";
}

// Returning nothing (side effects only)
function logResult(testName: string, passed: boolean): void {
  console.log(\`[\${passed ? '✅ PASS' : '❌ FAIL'}] \${testName}\`);
}

// Returning a Promise — standard for async Playwright tests
async function getPageTitle(url: string): Promise<string> {
  const response = await fetch(url);
  return response.statusText;
}
\`\`\`

### 3. Optional Parameters — The ? Modifier

*💡 Analogy: An optional parameter is like the 'notes' field on a delivery form. The delivery is valid and complete with or without notes — the customer decides whether to fill it in.*

\`\`\`typescript
function runTest(
  testName: string,
  timeout: number,
  retries?: number      // Optional — callers can omit this
): void {
  const maxRetries = retries ?? 0;  // Default to 0 if not provided
  console.log(\`Running: \${testName} | timeout: \${timeout}ms | retries: \${maxRetries}\`);
}

runTest("Login Test", 30000);        // ✅ retries not provided — that's fine
runTest("Checkout Test", 30000, 3);  // ✅ retries = 3

// ⚠️ Rule: optional parameters MUST come AFTER all required ones
function invalid(optional?: string, required: number): void {}  // ❌ Syntax error
\`\`\`

### 4. Default Parameters

\`\`\`typescript
function launchBrowser(
  browserType: string  = "chromium",
  headless: boolean    = true,
  timeout: number      = 30000
): void {
  console.log(\`Launching \${browserType} | headless: \${headless} | timeout: \${timeout}ms\`);
}

launchBrowser();                            // chromium, true, 30000
launchBrowser("firefox");                   // firefox, true, 30000
launchBrowser("webkit", false);             // webkit, false, 30000
launchBrowser("chromium", false, 60000);    // chromium, false, 60000
\`\`\`

### 5. Rest Parameters — Variable Number of Arguments

\`\`\`typescript
// Accept any number of tag strings
function tagTest(testName: string, ...tags: string[]): void {
  console.log(\`[\${tags.join(', ')}] \${testName}\`);
}

tagTest("Login Test", "smoke", "auth");
tagTest("Checkout", "regression", "payment", "slow", "critical");

// Rest parameters are always typed as an array
function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
\`\`\`

### 6. Function Type Annotations — Functions as Values

\`\`\`typescript
// Describing the TYPE signature of a function
type TestCallback    = (testName: string, duration: number) => void;
type AsyncTestFn     = () => Promise<void>;
type ValidatorFn<T>  = (value: T) => boolean;

// Using function types as parameters
function withRetry(
  fn: AsyncTestFn,
  maxAttempts: number
): AsyncTestFn {
  return async () => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await fn();
        return;  // Success — exit loop
      } catch (err) {
        if (attempt === maxAttempts) throw err;
        console.log(\`Attempt \${attempt} failed. Retrying...\`);
      }
    }
  };
}
\`\`\`

### 7. Arrow Functions with Types

\`\`\`typescript
// Full type annotation on an arrow function
const multiply = (a: number, b: number): number => a * b;

const isValidEmail = (email: string): boolean =>
  /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

// Async arrow function — very common in test helpers
const fetchTestData = async (
  endpoint: string
): Promise<{ id: number; name: string }[]> => {
  const res = await fetch(endpoint);
  return res.json();
};
\`\`\`

### 8. Common Mistakes

**Mistake 1: Forgetting return type on async functions**
\`\`\`typescript
// ❌ TypeScript infers Promise<any> — unsafe
async function getUser(id: number) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();  // any — type safety lost
}

// ✅ Explicit return type catches shape mismatches at compile time
async function getUser(id: number): Promise<{ id: number; email: string }> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}
\`\`\`

**Mistake 2: Mixing up void and undefined**
\`\`\`typescript
// void means "this function doesn't return a meaningful value"
// undefined is an actual value
function logMessage(msg: string): void {
  console.log(msg);
  // return undefined; — this is fine, but redundant
  // return "done";    — ❌ Error: Type 'string' not assignable to 'void'
}
\`\`\`
        `
      },
      {
        id: 'ts-union-intersection',
        title: 'Union & Intersection Types',
        analogy: "A union type is an OR gate — this variable can hold type A OR type B. An intersection type is an AND gate — this object must satisfy BOTH type A AND type B simultaneously. Union gives flexibility; intersection demands completeness.",
        lessonMarkdown: `
### 1. Union Types — Accepting Multiple Types

*💡 Analogy: A union type is like an international travel adapter. The socket accepts a US plug OR a UK plug OR a EU plug. You declare upfront which shapes are acceptable — anything else is rejected.*

\`\`\`typescript
// A variable that accepts string OR number
let testId: string | number;
testId = "TC-001";   // ✅ string
testId = 42;         // ✅ number
testId = true;       // ❌ Error: boolean is not in the union

// Function accepting string OR string array
function runTests(tests: string | string[]): void {
  if (typeof tests === 'string') {
    console.log(\`Running: \${tests}\`);
  } else {
    console.log(\`Running \${tests.length} tests: \${tests.join(', ')}\`);
  }
}

runTests("Login Test");
runTests(["Login Test", "Checkout Test", "Logout Test"]);
\`\`\`

### 2. Literal Union Types — Controlled Vocabularies

*💡 Analogy: Literal unions are like a dropdown menu on a form. You cannot free-type — you MUST choose from the predefined options. This eliminates entire classes of typo bugs.*

\`\`\`typescript
type TestStatus  = 'pass' | 'fail' | 'skip' | 'running';
type Environment = 'dev' | 'staging' | 'production';
type BrowserType = 'chromium' | 'firefox' | 'webkit';
type HttpMethod  = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

function scheduleTest(
  name: string,
  env: Environment,
  browser: BrowserType
): void {
  console.log(\`[\${browser}] Scheduling "\${name}" on \${env}\`);
}

scheduleTest("Login Test", "staging", "chromium");  // ✅
scheduleTest("Login Test", "local",   "chrome");    // ❌ 'local' and 'chrome' not in unions
\`\`\`

### 3. Discriminated Unions — TypeScript's Most Powerful Pattern

*💡 Analogy: Think of customer support tickets. A 'billing' ticket has account number and charge amount. A 'technical' ticket has error code and browser version. A 'general' ticket just has a message. The \`type\` field on each ticket is the discriminant — it tells you which variant you have and unlocks the fields specific to that variant.*

\`\`\`typescript
type PassResult = {
  status: 'pass';            // The discriminant
  durationMs: number;
  screenshotPath?: string;
};

type FailResult = {
  status: 'fail';            // The discriminant
  durationMs: number;
  errorMessage: string;      // Only on failures
  stackTrace: string;        // Only on failures
};

type SkipResult = {
  status: 'skip';            // The discriminant
  reason: string;            // Only on skips
};

type TestResult = PassResult | FailResult | SkipResult;

function report(result: TestResult): string {
  switch (result.status) {
    case 'pass':
      return \`✅ Passed in \${result.durationMs}ms\`;
    case 'fail':
      // TypeScript KNOWS result has errorMessage and stackTrace here
      return \`❌ Failed: \${result.errorMessage}\`;
    case 'skip':
      // TypeScript KNOWS result has reason here
      return \`⏭️ Skipped: \${result.reason}\`;
  }
}
\`\`\`

### 4. Intersection Types — Combining Multiple Shapes

*💡 Analogy: An intersection is like a job requiring someone who is BOTH a software developer AND a test engineer AND speaks Spanish. The candidate must fully satisfy ALL three requirements — no partial credit.*

\`\`\`typescript
interface HasId {
  id: string;
}

interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface TestCase {
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: string[];
}

// Intersection: MUST have all properties from all three types
type FullTestCase = TestCase & HasId & HasTimestamps;

const tc: FullTestCase = {
  id: "TC-001",
  name: "Login with valid credentials",
  priority: "high",
  steps: ["Navigate to /login", "Enter credentials", "Click submit", "Verify dashboard"],
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-03-15"),
};
\`\`\`

### 5. typeof Type Guards — Narrowing at Runtime

\`\`\`typescript
// TypeScript narrows the type inside each branch
function formatId(id: string | number): string {
  if (typeof id === 'number') {
    // TypeScript KNOWS: id is number in this block
    return \`TC-\${id.toString().padStart(4, '0')}\`;  // TC-0042
  }
  // TypeScript KNOWS: id is string here
  return id.startsWith('TC-') ? id : \`TC-\${id}\`;
}

console.log(formatId(42));       // "TC-0042"
console.log(formatId("007"));    // "TC-007"
console.log(formatId("TC-001")); // "TC-001"
\`\`\`

### 6. Common Mistakes

**Mistake: Accessing type-specific methods without narrowing**
\`\`\`typescript
function shout(value: string | number): void {
  // ❌ Error: 'toUpperCase' doesn't exist on type 'number'
  console.log(value.toUpperCase());

  // ✅ Narrow the type first
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toLocaleString());
  }
}
\`\`\`
        `
      },
      {
        id: 'ts-enums',
        title: 'Enums',
        analogy: "An enum is like a set of official traffic signals. You don't say 'the light is emitting red wavelengths at 700nm' — you say RED. Enums give memorable, readable names to a fixed set of related constants, making code self-explanatory and typo-proof.",
        lessonMarkdown: `
### 1. The Problem Enums Solve

*💡 Analogy: Imagine your test code is full of magic numbers like \`200\`, \`404\`, \`503\`. Six months later, a new team member reads \`if (status === 503)\` and has to look up what 503 means. With an enum, it reads \`if (status === HttpStatus.ServiceUnavailable)\` — the intent is self-documenting.*

**Without enums — fragile magic strings:**
\`\`\`typescript
// ❌ Typos become silent bugs
function handleResult(status: string): void {
  if (status === "pass") { /* ... */ }
  if (status === "PASS") { /* ... */ }  // Typo — silently does nothing
  if (status === "passe") { /* ... */ } // Typo — silently does nothing
}
\`\`\`

**With enums — compile-time safety:**
\`\`\`typescript
// ✅ Typos become compile errors — caught before running
enum TestStatus {
  Pass = "pass",
  Fail = "fail",
  Skip = "skip",
}

function handleResult(status: TestStatus): void {
  if (status === TestStatus.Pass) { /* ... */ }
}

handleResult(TestStatus.Pass);  // ✅
handleResult("passs");          // ❌ Error: string not assignable to TestStatus
\`\`\`

### 2. String Enums — The Recommended Choice for QA

\`\`\`typescript
enum Environment {
  Dev        = "dev",
  Staging    = "staging",
  Production = "production",
}

enum Browser {
  Chromium = "chromium",
  Firefox  = "firefox",
  WebKit   = "webkit",
}

enum Priority {
  Low      = "low",
  Medium   = "medium",
  High     = "high",
  Critical = "critical",
}

// Benefits of string enums:
// 1. Values are human-readable in logs and reports
// 2. JSON serialisation looks clean: "staging" not 1
// 3. Debugger shows "staging" not an opaque number
\`\`\`

### 3. Numeric Enums — Auto-Incrementing Numbers

\`\`\`typescript
enum HttpStatus {
  OK           = 200,
  Created      = 201,
  NoContent    = 204,
  BadRequest   = 400,
  Unauthorized = 401,
  Forbidden    = 403,
  NotFound     = 404,
  ServerError  = 500,
  ServiceUnavailable = 503,
}

// Very natural for API test assertions
async function verifyEndpoint(
  url: string,
  expectedStatus: HttpStatus
): Promise<void> {
  const response = await fetch(url);
  if (response.status !== expectedStatus) {
    throw new Error(\`Expected \${expectedStatus}, got \${response.status}\`);
  }
}

await verifyEndpoint("/api/users",   HttpStatus.OK);
await verifyEndpoint("/api/missing", HttpStatus.NotFound);
\`\`\`

### 4. Using Enums in Interfaces

\`\`\`typescript
interface TestRun {
  id: string;
  environment: Environment;
  browser: Browser;
  status: TestStatus;
  priority: Priority;
  startedAt: Date;
}

const latestRun: TestRun = {
  id: "run-42",
  environment: Environment.Staging,
  browser: Browser.Chromium,
  status: TestStatus.Pass,
  priority: Priority.High,
  startedAt: new Date(),
};
\`\`\`

### 5. Iterating Over Enum Values

\`\`\`typescript
enum Browser {
  Chromium = "chromium",
  Firefox  = "firefox",
  WebKit   = "webkit",
}

// Run the same test across all browsers
const allBrowsers = Object.values(Browser) as Browser[];

for (const browser of allBrowsers) {
  console.log(\`Queuing run: \${browser}\`);
}
// Output:
// Queuing run: chromium
// Queuing run: firefox
// Queuing run: webkit
\`\`\`

### 6. Const Enums — Zero Runtime Cost

\`\`\`typescript
// const enums are inlined at compile time — the enum object doesn't exist at runtime
const enum Direction {
  Up    = "UP",
  Down  = "DOWN",
  Left  = "LEFT",
  Right = "RIGHT",
}

const move = Direction.Up;
// Compiles to: const move = "UP";
// No Direction object is created — smaller, faster bundle
\`\`\`

### 7. Enums vs Literal Unions — When to Choose Which

\`\`\`typescript
// Literal union — simpler, no import needed
type Status = 'pass' | 'fail' | 'skip';

// Enum — better when:
// ✅ You need to iterate over all values programmatically
// ✅ The enum is used across many files
// ✅ The values might change (change in one place)
// ✅ You want the label to differ from the value

// For simple cases, literal unions are usually enough
\`\`\`
        `
      },
      {
        id: 'ts-type-aliases',
        title: 'Type Aliases',
        analogy: "A type alias is like giving a nickname to a complex description. Instead of writing 'the function that accepts a test name string and a duration in milliseconds and returns a formatted string report line' every time, you call it ReportFormatter. The alias doesn't create anything new — it's just a short, memorable label for an existing shape.",
        lessonMarkdown: `
### 1. The type Keyword

*💡 Analogy: \`interface\` is like a formal legal contract template in a law firm — structured, official, extendable. \`type\` is like a flexible shorthand notation — it can describe anything: objects, primitives, functions, unions, intersections — not just objects.*

\`\`\`typescript
// type alias for primitives — gives semantic meaning to raw types
type URL         = string;
type Email       = string;
type Milliseconds = number;
type Percentage  = number;
type TestName    = string;

const baseURL: URL         = "https://staging.example.com";
const userEmail: Email     = "qa@example.com";
const timeout: Milliseconds = 30000;
const passRate: Percentage = 98.5;
\`\`\`

Even though these are all just \`string\` or \`number\` underneath, the aliases communicate **intent** clearly to every reader of the code.

### 2. Type Aliases for Object Shapes

\`\`\`typescript
type Credentials = {
  username: string;
  password: string;
};

type TestConfig = {
  baseURL: URL;
  timeout: Milliseconds;
  headless: boolean;
  retries?: number;
};

// Usage
const stagingCreds: Credentials = {
  username: "qa-user@example.com",
  password: "SecurePass123!",
};
\`\`\`

### 3. Type Aliases for Unions — The Killer Use Case

\`\`\`typescript
// Define once — reuse everywhere
type TestStatus  = 'pass' | 'fail' | 'skip' | 'running' | 'queued';
type BrowserName = 'chromium' | 'firefox' | 'webkit';
type HttpMethod  = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type LogLevel    = 'debug' | 'info' | 'warn' | 'error';
type Priority    = 'low' | 'medium' | 'high' | 'critical';

// Change in ONE place — propagates everywhere the alias is used
function setTestStatus(id: string, status: TestStatus): void { /* ... */ }
function launchBrowser(browser: BrowserName): void { /* ... */ }
function logMessage(level: LogLevel, msg: string): void { /* ... */ }
\`\`\`

### 4. Type Aliases for Function Signatures

\`\`\`typescript
// Give complex function signatures a readable name
type AsyncTestFn       = () => Promise<void>;
type BeforeHook        = (testName: string) => Promise<void>;
type AfterHook         = (testName: string, passed: boolean) => Promise<void>;
type ValidatorFn<T>    = (actual: T, expected: T) => boolean;
type TransformerFn<T>  = (input: T) => T;

// Much more readable than repeating the full signature every time
interface TestSuite {
  name: string;
  beforeAll?:  () => Promise<void>;
  beforeEach?: BeforeHook;
  afterEach?:  AfterHook;
  tests: AsyncTestFn[];
}
\`\`\`

### 5. Type Aliases for Intersections

\`\`\`typescript
type WithId         = { id: string };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type WithAuthor     = { createdBy: string };

// Build composite types using intersections
type AuditedRecord  = WithId & WithTimestamps & WithAuthor;

type TestCase = AuditedRecord & {
  name: string;
  priority: Priority;
  steps: string[];
};
\`\`\`

### 6. type vs interface — The Definitive Guide

*💡 Analogy: \`interface\` is a club membership form that can be amended and extended over time (declaration merging). \`type\` is a stamped, sealed certificate — once issued, no one can add extra clauses to it from outside.*

| Feature | \`type\` | \`interface\` |
|---------|------|-----------|
| Object shapes | ✅ | ✅ |
| Primitive aliases | ✅ | ❌ |
| Union types | ✅ | ❌ |
| Intersection / extending | \`&\` operator | \`extends\` keyword |
| Declaration merging | ❌ | ✅ |
| Implementing in a class | ✅ | ✅ |
| Recursive self-reference | ✅ | ✅ |

**Practical rule for QA engineers:**
- Use \`interface\` for Page Objects, domain entities (User, TestCase, APIResponse)
- Use \`type\` for unions, primitives, function signatures, and complex combinations

### 7. Recursive Type Aliases

\`\`\`typescript
// A test suite tree — can nest indefinitely
type TestTree =
  | string                                        // Leaf: single test name
  | { suiteName: string; children: TestTree[] };  // Branch: nested suite

const structure: TestTree = {
  suiteName: "Authentication",
  children: [
    "Login with valid credentials",
    {
      suiteName: "OAuth",
      children: ["Google OAuth", "GitHub OAuth", "Microsoft SSO"],
    },
    "Logout",
    "Session timeout",
  ],
};
\`\`\`

### 8. as const — Preserving Literal Types

*💡 Analogy: Without \`as const\`, TypeScript sees a string value and thinks "this could change to any string later." With \`as const\`, you're stamping the value with a permanent seal: "This is specifically and only \`"staging"\` — not just any string."*

By default, TypeScript **widens** literal values to their base type:

\`\`\`typescript
const env = "staging";
// TypeScript infers: string  ← widened, loses the "staging" literal
// This means env could theoretically be "anything" in TypeScript's view

// TypeScript also widens object values:
const config = { env: "staging", timeout: 30000 };
// TypeScript infers: { env: string; timeout: number }
// The "staging" literal is lost
\`\`\`

**\`as const\` narrows all values to their exact literal types:**

\`\`\`typescript
const env = "staging" as const;
// TypeScript infers: "staging"  ← exact literal preserved

const config = { env: "staging", timeout: 30000 } as const;
// TypeScript infers: { readonly env: "staging"; readonly timeout: 30000 }
// All values are literal types AND all properties become readonly
\`\`\`

**Why this matters in QA — creating valid union members from config objects:**

\`\`\`typescript
// Without as const — TypeScript just sees strings
const BROWSERS = { chrome: "chromium", ff: "firefox", wk: "webkit" };
type BrowserValue = typeof BROWSERS[keyof typeof BROWSERS];
// BrowserValue = string  ← not useful

// With as const — TypeScript preserves the literal values
const BROWSERS = { chrome: "chromium", ff: "firefox", wk: "webkit" } as const;
type BrowserValue = typeof BROWSERS[keyof typeof BROWSERS];
// BrowserValue = "chromium" | "firefox" | "webkit"  ← exactly right!

function launchBrowser(browser: BrowserValue): void { /* ... */ }
launchBrowser("chromium");  // ✅
launchBrowser("safari");    // ❌ Error — not in the union
\`\`\`

**Rule: Use \`as const\` on config objects and lookup tables where the literal values matter.**
        `
      },
      {
        id: 'ts-null-safety',
        title: 'Null & Undefined Safety',
        analogy: "Null safety is like a package delivery system with mandatory signature confirmation. Without it, packages get silently left at the door and anyone can walk off with them. With TypeScript strict mode, the recipient must be present — no silent deliveries to empty houses, no surprises.",
        lessonMarkdown: `
### 1. Why Null Safety Matters

*💡 Analogy: A null reference error is like reaching for your car keys on the hook by the door and grabbing thin air. You assumed the keys would be there — they weren't. TypeScript's \`strictNullChecks\` forces you to check whether the keys are actually on the hook before you try to grab them.*

**The most common runtime error in JavaScript:**
\`\`\`
TypeError: Cannot read properties of null (reading 'click')
TypeError: Cannot read properties of undefined (reading 'textContent')
\`\`\`

These happen because code assumes a value exists when it might be \`null\` or \`undefined\`. TypeScript with \`strictNullChecks\` forces you to handle these cases at compile time.

### 2. strictNullChecks — The Safety Switch

In \`tsconfig.json\`, setting \`"strict": true\` enables \`strictNullChecks\` automatically:

\`\`\`typescript
// ❌ Without strictNullChecks — null sneaks in silently (old default)
let element: HTMLElement = null;  // No error — dangerous

// ✅ With strictNullChecks — you MUST explicitly allow null
let element: HTMLElement | null = null;  // Forces you to handle the null case
\`\`\`

### 3. Optional Chaining — The ?. Operator

*💡 Analogy: Optional chaining is like a GPS that quietly stops and returns "no route" when a road doesn't exist, instead of driving you off a cliff. Each \`?.\` is a safe step that returns \`undefined\` rather than throwing an error.*

\`\`\`typescript
interface User {
  name: string;
  address?: {
    city?: string;
    postcode?: string;
  };
}

const user: User = { name: "Sagar" };

// ❌ Without optional chaining — runtime crash if address is undefined
const city = user.address.city;
// TypeError: Cannot read properties of undefined (reading 'city')

// ✅ With optional chaining — returns undefined safely at any missing step
const city = user?.address?.city;
console.log(city ?? "City unknown");  // "City unknown"
\`\`\`

**Optional chaining in test automation:**
\`\`\`typescript
interface TestRun {
  result?: {
    error?: {
      message: string;
      stack?: string;
    };
  };
}

const run: TestRun = {};

// Safe deep access — no crash even if every level is absent
const errorMsg = run.result?.error?.message;  // undefined
const stack    = run.result?.error?.stack;    // undefined

console.log(\`Error: \${errorMsg ?? "None"}\`);  // "Error: None"
\`\`\`

### 4. Nullish Coalescing — The ?? Operator

*💡 Analogy: \`??\` is a smart fallback rule: "Use the main value, BUT if it is specifically \`null\` or \`undefined\` (not just falsy), switch to the backup." It ignores perfectly valid falsy values like \`0\`, \`false\`, or \`""\`.*

\`\`\`typescript
// ?? only triggers for null or undefined — never for 0, false, ""
const retries: number | null = null;
const maxRetries = retries ?? 3;           // 3 — retries is null

const timeout: number | undefined = 0;
const effectiveTimeout = timeout ?? 5000;  // 0 — 0 is NOT null/undefined
// Compare: 0 || 5000 = 5000  ← Wrong! || treats 0 as falsy

// Chaining fallbacks elegantly
const delay = userConfig?.delay ?? envConfig?.delay ?? 1000;
\`\`\`

### 5. Optional Properties vs Explicit undefined

\`\`\`typescript
interface SearchOptions {
  query: string;
  maxResults?: number;   // Optional: omitting is fine
  offset?: number;       // Optional: omitting is fine
}

function search(options: SearchOptions): void {
  const max    = options.maxResults ?? 10;
  const offset = options.offset ?? 0;
  console.log(\`Searching "\${options.query}" (max: \${max}, from: \${offset})\`);
}

search({ query: "Playwright tutorial" });                     // max:10, offset:0
search({ query: "TypeScript", maxResults: 5 });               // max:5, offset:0
search({ query: "API testing", maxResults: 20, offset: 40 }); // max:20, offset:40
\`\`\`

### 6. Non-Null Assertion Operator — ! (Use Very Sparingly)

*💡 Analogy: The \`!\` operator is telling your GPS "I KNOW this road exists — stop asking me to confirm." If you're wrong, you drive into the ocean. Use it only when you have absolute certainty.*

\`\`\`typescript
// ! tells TypeScript "I guarantee this is not null/undefined"
const submitBtn = document.getElementById("submit")!;
submitBtn.click();  // TypeScript trusts you — no error
// BUT if the element doesn't exist at runtime: crash

// ✅ Much safer: check explicitly
const submitBtn = document.getElementById("submit");
if (submitBtn !== null) {
  submitBtn.click();  // TypeScript now KNOWS it's not null
}

// ✅ In Playwright — the locator API handles nulls gracefully
await page.locator("#submit").click();  // Throws a proper Playwright error if missing
\`\`\`

### 7. Narrowing null with if Checks

\`\`\`typescript
function describeDuration(result: { durationMs: number | null }): string {
  if (result.durationMs === null) {
    return "Test did not complete — no duration recorded";
  }
  // TypeScript now KNOWS durationMs is number — null is ruled out
  return \`Completed in \${result.durationMs.toLocaleString()}ms\`;
}
\`\`\`

### 8. Common Mistakes

**Mistake: Using ! to silence "possibly null" errors without understanding why**
\`\`\`typescript
// ❌ Silences the error but creates a time bomb
const element = document.querySelector(".loading-spinner")!;
element.remove();  // Crashes at runtime if spinner doesn't exist

// ✅ Handle the null case properly
const element = document.querySelector(".loading-spinner");
if (element) {
  element.remove();
}
\`\`\`
        `
      },
      {
        id: 'ts-type-assertions',
        title: 'Type Assertions & Guards',
        analogy: "A type assertion is a security badge override — you tell the system 'I know this person has clearance, just let them through.' A type guard is the proper ID check — you actually verify their identity with evidence before granting access. Both achieve the goal; only one is truly safe.",
        lessonMarkdown: `
### 1. Type Assertions — Telling TypeScript What You Know

*💡 Analogy: You receive an unmarked box. You open it and clearly see it's full of oranges, but the box has no label. A type assertion is you writing "ORANGES" on the box so the rest of your team treats it correctly. You are not changing the contents — you are providing the label TypeScript cannot figure out on its own.*

\`\`\`typescript
// TypeScript treats API response JSON as 'unknown'
const response = await fetch("/api/users/1");
const data: unknown = await response.json();

// Assert the shape you know it has
const user = data as { id: number; email: string; name: string };
console.log(user.email);  // TypeScript now accepts this

// ⚠️ Type assertions don't validate at runtime
// If data is actually null, your code still crashes
\`\`\`

### 2. The as Keyword — Preferred Syntax

\`\`\`typescript
const rawElement = document.getElementById("username");

// ✅ Modern as syntax (works everywhere, including JSX)
const inputElement = rawElement as HTMLInputElement;
inputElement.value = "testuser@example.com";

// ❌ Angle-bracket syntax (avoid in .tsx files — conflicts with JSX)
const inputElement = <HTMLInputElement>rawElement;
\`\`\`

### 3. typeof Type Guards — Runtime Verification

*💡 Analogy: A \`typeof\` guard is like a sorting conveyor belt at a warehouse. Each item goes through a sensor: "Is this a letter or a parcel?" — and gets routed to the correct section based on what it actually is.*

\`\`\`typescript
type Input = string | number | boolean;

function describe(value: Input): string {
  if (typeof value === 'string') {
    // TypeScript KNOWS: value is string in this block
    return \`Text (\${value.length} chars): \${value.toUpperCase()}\`;
  } else if (typeof value === 'number') {
    // TypeScript KNOWS: value is number here
    return \`Number: \${value.toFixed(2)}\`;
  } else {
    // TypeScript KNOWS: value is boolean here
    return \`Flag: \${value ? 'enabled' : 'disabled'}\`;
  }
}

// Works with null check too
function safeLength(value: string | null): number {
  if (typeof value === 'string') return value.length;
  return 0;
}
\`\`\`

### 4. instanceof Type Guards — For Classes and Error Handling

\`\`\`typescript
class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Robust error handling — exactly what QA automation needs
function handleTestError(error: unknown): void {
  if (error instanceof NetworkError) {
    // TypeScript KNOWS: error has statusCode
    console.error(\`Network error (\${error.statusCode}): \${error.message}\`);
    if (error.statusCode >= 500) console.log("Retrying after server error...");
  } else if (error instanceof ValidationError) {
    // TypeScript KNOWS: error has field
    console.error(\`Validation failed on '\${error.field}': \${error.message}\`);
  } else if (error instanceof Error) {
    console.error(\`Unexpected error: \${error.message}\`);
  } else {
    console.error("Non-Error thrown:", error);
  }
}
\`\`\`

### 5. in Operator Type Guard — Check Property Existence

\`\`\`typescript
interface PassResult { status: 'pass'; durationMs: number }
interface FailResult { status: 'fail'; errorMessage: string; screenshotPath?: string }

type TestResult = PassResult | FailResult;

function summarise(result: TestResult): string {
  if ('errorMessage' in result) {
    // TypeScript KNOWS: result is FailResult
    return \`❌ FAILED: \${result.errorMessage}\`;
  }
  // TypeScript KNOWS: result is PassResult
  return \`✅ PASSED in \${result.durationMs}ms\`;
}
\`\`\`

### 6. Custom Type Predicates — The is Keyword

*💡 Analogy: A type predicate function is like a certified inspector who issues official clearance. When they say "yes, this package is hazardous material," everyone trusts the certification and acts accordingly. The \`is\` keyword makes a function an official TypeScript type certifier.*

\`\`\`typescript
interface TestCase {
  name: string;
  steps: string[];
  priority: 'low' | 'medium' | 'high';
}

// Return type "value is TestCase" is the type predicate
function isTestCase(value: unknown): value is TestCase {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'steps' in value &&
    'priority' in value &&
    typeof (value as TestCase).name === 'string' &&
    Array.isArray((value as TestCase).steps)
  );
}

// Usage — parsing untrusted external data
const rawData: unknown = JSON.parse(await readFile("test-cases.json", "utf-8"));

if (Array.isArray(rawData)) {
  const validCases = rawData.filter(isTestCase);  // TestCase[] — type safe!
  validCases.forEach(tc => {
    console.log(\`Loaded: \${tc.name} (\${tc.steps.length} steps)\`);
  });
}
\`\`\`

### 7. Common Mistakes

**Mistake: Using as to silence legitimate TypeScript errors**
\`\`\`typescript
// ❌ Bypassing type safety — the error was telling you something important
function getUser(): User | null { return null; }
const user = getUser() as User;
user.email;  // TypeScript is silent — but crashes at runtime

// ✅ Handle the null case properly
const user = getUser();
if (user !== null) {
  user.email;  // TypeScript knows it's safe here
}
\`\`\`

**Mistake: Using double assertion (as unknown as X) without understanding why**
\`\`\`typescript
// ❌ Double assertion = complete bypass of type system
const value = "hello" as unknown as number;
// This is a red flag — if you need this, re-examine your design

// ✅ Usually means you need a proper union type or runtime validation
\`\`\`
        `
      }
      ,
      {
        id: 'ts-generics',
        title: 'Generics',
        analogy: "A generic is like a one-size-fits-all box that adapts to whatever you put in it. The box itself works the same way — open, close, label — but the *contents* type is decided fresh each time you use it. You write the box once, but it works for shoes, books, or test results.",
        lessonMarkdown: `
### 1. The Problem Generics Solve

*💡 Analogy: Imagine writing a function called \`getFirst\` that returns the first item of an array. Without generics, you'd write \`getFirstString\`, \`getFirstNumber\`, \`getFirstUser\` — copy-pasted versions of the same logic. Generics let you write it ONCE and let TypeScript figure out the type each time it's used.*

**Without generics — repetitive and lossy:**
\`\`\`typescript
// ❌ Loses type information
function getFirst(arr: any[]): any {
  return arr[0];
}
const first = getFirst([1, 2, 3]);  // any — type info lost!
first.toUpperCase();  // No error from TypeScript, but crashes at runtime
\`\`\`

**With generics — type information preserved:**
\`\`\`typescript
// ✅ T is a placeholder — TypeScript fills it in based on the argument
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
const first = getFirst([1, 2, 3]);   // T = number, returns number
const name  = getFirst(["a", "b"]);  // T = string, returns string
\`\`\`

### 2. Generic Functions — Type Parameters

*💡 Analogy: A generic function is like a customisable rubber stamp. The stamp shape (the function logic) is fixed, but the colour of ink (the type \`T\`) is chosen at the moment of use.*

\`\`\`typescript
// Single type parameter
function identity<T>(value: T): T {
  return value;
}

const num  = identity<number>(42);     // explicit: T = number
const str  = identity("hello");        // inferred: T = string
const bool = identity(true);           // inferred: T = boolean

// Multiple type parameters
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair("Login Test", 1250);  // [string, number]
\`\`\`

### 3. Generic Constraints — \`extends\` Keyword

*💡 Analogy: Constraints are like requirements on the rubber stamp. "This stamp accepts any colour, BUT only liquid inks — no glitter, no powder." We restrict \`T\` to types that have certain properties.*

\`\`\`typescript
// T must be something that has a .length property
function logLength<T extends { length: number }>(item: T): T {
  console.log(\\\`Length: \\\${item.length}\\\`);
  return item;
}

logLength("hello");          // ✅ string has length
logLength([1, 2, 3]);        // ✅ array has length
logLength({ length: 10 });   // ✅ matches the constraint
logLength(42);               // ❌ Error: number has no length property
\`\`\`

### 4. Generic Interfaces

\`\`\`typescript
// A reusable API response wrapper
interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface TestRun {
  runId: string;
  passed: boolean;
}

// Same wrapper, different payload types
const userResponse: APIResponse<User> = {
  data: { id: 1, email: "qa@test.com", name: "Sagar" },
  status: 200,
  message: "OK",
  timestamp: new Date(),
};

const runResponse: APIResponse<TestRun> = {
  data: { runId: "run-42", passed: true },
  status: 200,
  message: "OK",
  timestamp: new Date(),
};

// Even works with arrays
const usersResponse: APIResponse<User[]> = {
  data: [{ id: 1, email: "a@a.com", name: "Alice" }],
  status: 200,
  message: "OK",
  timestamp: new Date(),
};
\`\`\`

### 5. Generic Page Object Model — Real QA Pattern

*This is exactly how senior QA engineers build reusable test infrastructure.*

\`\`\`typescript
// A generic base class for ALL Page Objects
abstract class BasePage<TLocators extends Record<string, string>> {
  constructor(
    protected page: Page,
    protected locators: TLocators
  ) {}

  async clickByKey(key: keyof TLocators): Promise<void> {
    const selector = this.locators[key];
    await this.page.click(selector);
  }

  async fillByKey(key: keyof TLocators, value: string): Promise<void> {
    const selector = this.locators[key];
    await this.page.fill(selector, value);
  }
}

// Each page provides its own typed locators
class LoginPage extends BasePage<{
  username: string;
  password: string;
  submitBtn: string;
}> {
  constructor(page: Page) {
    super(page, {
      username:  '#username',
      password:  '#password',
      submitBtn: '[data-testid="submit"]',
    });
  }
}

const login = new LoginPage(page);
await login.fillByKey('username', 'qa@test.com');  // ✅ TypeScript knows valid keys
await login.fillByKey('userrname', 'qa@test.com'); // ❌ Typo caught at compile time!
\`\`\`

### 6. Default Type Parameters

\`\`\`typescript
// If T isn't specified, default to string
interface TestData<T = string> {
  name: T;
  value: T;
}

const stringData: TestData = { name: "env", value: "staging" };  // T defaults to string
const numberData: TestData<number> = { name: 0, value: 42 };     // explicit override
\`\`\`

### 7. Generic Classes — Reusable Typed Containers

*💡 Analogy: A generic class is like a universal filing cabinet. You specify the type of document it stores when you buy it — a Cabinet<Contract> only stores contracts, a Cabinet<Receipt> only stores receipts. The cabinet itself (its methods: add, find, remove) works identically regardless of what you store in it.*

\`\`\`typescript
// A type-safe in-memory store — the T must have an id field
class Store<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  remove(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}

// TypeScript infers T from the first call
interface TestCase { id: number; name: string; priority: string; }
interface User      { id: number; email: string; role: string;   }

const testCaseStore = new Store<TestCase>();
const userStore     = new Store<User>();

testCaseStore.add({ id: 1, name: "Login Test", priority: "high" });
const tc = testCaseStore.findById(1);  // TypeScript knows: TestCase | undefined
tc?.name;     // ✅ string
tc?.priority; // ✅ string
tc?.email;    // ❌ Error — TestCase has no email
\`\`\`

**Real QA Pattern — Generic Page Object Factory:**
\`\`\`typescript
// A factory that constructs any Page Object with a typed config
class PageFactory<TPage, TConfig> {
  constructor(
    private readonly page: Page,
    private readonly PageClass: new (page: Page, config: TConfig) => TPage,
  ) {}

  create(config: TConfig): TPage {
    return new this.PageClass(this.page, config);
  }
}

// Usage
class LoginPage {
  constructor(
    private page: Page,
    private config: { baseURL: string; timeout: number }
  ) {}
  async navigate() { await this.page.goto(this.config.baseURL + '/login'); }
}

const factory = new PageFactory(page, LoginPage);
const loginPage = factory.create({ baseURL: 'https://staging.test.com', timeout: 30000 });
\`\`\`

**Generic class with multiple type parameters:**
\`\`\`typescript
// A typed cache: maps keys of type K to values of type V
class Cache<K, V> {
  private map = new Map<K, V>();

  set(key: K, value: V): void    { this.map.set(key, value); }
  get(key: K): V | undefined      { return this.map.get(key); }
  has(key: K): boolean            { return this.map.has(key); }
  clear(): void                   { this.map.clear(); }
}

const apiCache = new Cache<string, { data: unknown; cachedAt: Date }>();
apiCache.set('/api/users', { data: [...], cachedAt: new Date() });
apiCache.get('/api/users');  // { data: unknown; cachedAt: Date } | undefined
\`\`\`

### 8. Common Mistakes

**Mistake: Using \`any\` instead of a generic**
\`\`\`typescript
// ❌ any — type information lost
function firstItem(arr: any[]): any { return arr[0]; }

// ✅ generic — type information preserved
function firstItem<T>(arr: T[]): T { return arr[0]; }
\`\`\`
        `
      },
      {
        id: 'ts-utility-types',
        title: 'Built-in Utility Types',
        analogy: "Utility types are pre-built type transformers, like attachments for a power drill. The drill (your base type) stays the same; you snap on different bits (Partial, Pick, Omit, Readonly) to get different behaviours from the same source.",
        lessonMarkdown: `
### 1. Why Utility Types Matter

*💡 Analogy: Imagine you have a master blueprint for a house (your base interface). To create the floorplan for an empty house, you don't redraw it — you stamp "OPTIONAL" on every room (\`Partial\`). For a security review, you stamp "READ-ONLY" on every door (\`Readonly\`). To send to the kitchen contractor, you keep only kitchen-related rooms (\`Pick\`). Same blueprint, many derivations — without rewriting.*

TypeScript ships with built-in utility types that transform existing types. Master these eight and you'll handle 90% of real-world type transformations.

### 2. \`Partial<T>\` — Make All Properties Optional

\`\`\`typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// All properties become optional
type UserUpdate = Partial<User>;
// Equivalent to: { id?: number; email?: string; name?: string; role?: string }

// Perfect for partial updates / PATCH requests
function updateUser(id: number, changes: Partial<User>): void {
  console.log(\\\`Updating user \\\${id} with\\\`, changes);
}

updateUser(42, { email: "new@example.com" });             // ✅ only email
updateUser(42, { name: "New Name", role: "admin" });      // ✅ name + role
updateUser(42, {});                                       // ✅ even empty is valid
\`\`\`

### 3. \`Required<T>\` — Make All Properties Required

\`\`\`typescript
interface TestConfig {
  baseURL?: string;
  timeout?: number;
  headless?: boolean;
}

// All properties become required
type StrictConfig = Required<TestConfig>;
// Equivalent to: { baseURL: string; timeout: number; headless: boolean }

// Use when you've validated and filled in all defaults
const validatedConfig: StrictConfig = {
  baseURL:  "https://staging.example.com",
  timeout:  30000,
  headless: true,
};
\`\`\`

### 4. \`Readonly<T>\` — Make All Properties Immutable

\`\`\`typescript
interface ServerConfig {
  host: string;
  port: number;
  apiKey: string;
}

// Locked — no property can be reassigned
type FrozenConfig = Readonly<ServerConfig>;

const config: FrozenConfig = {
  host: "api.example.com",
  port: 443,
  apiKey: "secret-token",
};

config.host = "evil.com";  // ❌ Error: Cannot assign to 'host' (read-only)
\`\`\`

### 5. \`Pick<T, K>\` — Select Specific Properties

*💡 Analogy: \`Pick\` is a cookie cutter. From a big sheet of dough (the full type), you stamp out a specific shape, keeping only the properties you named.*

\`\`\`typescript
interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
}

// Only the fields safe to send to the frontend
type PublicUser = Pick<User, 'id' | 'email' | 'name'>;
// { id: number; email: string; name: string }

// Useful for API response shapes
function getPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name };
}
\`\`\`

### 6. \`Omit<T, K>\` — Exclude Specific Properties

*💡 Analogy: \`Omit\` is the opposite cookie cutter — it stamps a hole and removes only the named properties, keeping everything else.*

\`\`\`typescript
// Same User interface above

// User without sensitive fields
type SafeUser = Omit<User, 'password' | 'role'>;
// Keeps: id, email, name, createdAt

// User as input for creation (no DB-generated fields)
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

function createUser(input: CreateUserInput): User {
  return {
    ...input,
    id: Math.random(),
    createdAt: new Date(),
  };
}
\`\`\`

### 7. \`Record<K, V>\` — Object with Typed Keys and Values

\`\`\`typescript
type TestStatus = 'pass' | 'fail' | 'skip';

// Map every status to a count
type StatusCounts = Record<TestStatus, number>;
// Equivalent to: { pass: number; fail: number; skip: number }

const counts: StatusCounts = {
  pass: 142,
  fail: 8,
  skip: 3,
};

// Common pattern: keyed test result map
type TestResults = Record<string, { passed: boolean; durationMs: number }>;

const results: TestResults = {
  "Login Test":    { passed: true,  durationMs: 850 },
  "Checkout Test": { passed: false, durationMs: 1200 },
};
\`\`\`

### 8. \`ReturnType<T>\` and \`Parameters<T>\`

\`\`\`typescript
// Extract a function's return type
function fetchTestRun(id: string) {
  return { id, status: 'pass' as const, durationMs: 1500 };
}

type TestRun = ReturnType<typeof fetchTestRun>;
// { id: string; status: "pass"; durationMs: number }

// Extract a function's parameter types
function login(username: string, password: string, rememberMe?: boolean) {}

type LoginParams = Parameters<typeof login>;
// [username: string, password: string, rememberMe?: boolean | undefined]
\`\`\`

### 9. Combining Utility Types — Real QA Example

\`\`\`typescript
interface TestCase {
  id: string;
  name: string;
  steps: string[];
  expected: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

// For creating new test cases — no DB-managed fields, all required
type CreateTestCase = Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>;

// For PATCH updates — only some fields, no metadata
type UpdateTestCase = Partial<Omit<TestCase, 'id' | 'createdAt' | 'authorId'>>;

// For listing in a UI grid — minimal info
type TestCaseListItem = Pick<TestCase, 'id' | 'name' | 'priority'>;
\`\`\`
        `
      },
      {
        id: 'ts-keyof-typeof',
        title: 'keyof and typeof Operators',
        analogy: "\`keyof\` is a master key ring that contains every key for a building — you can ask it for valid door names. \`typeof\` is a mould of an existing object — it captures the exact shape of something you already have so you can use that shape elsewhere.",
        lessonMarkdown: `
### 1. The \`keyof\` Operator — Extract Keys as a Union Type

*💡 Analogy: Think of \`keyof\` as taking a roll-call of every property name in an interface and combining them into a controlled vocabulary union.*

\`\`\`typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// keyof extracts all property names as a union of string literal types
type UserKey = keyof User;
// Equivalent to: 'id' | 'email' | 'name' | 'role'

// Now use it to constrain other code
function getUserField(user: User, field: UserKey): unknown {
  return user[field];
}

getUserField(user, 'email');     // ✅
getUserField(user, 'password');  // ❌ Error: 'password' is not a key of User
\`\`\`

### 2. Type-Safe Property Access with \`keyof\`

\`\`\`typescript
// A type-safe property getter — works for any object and any of its keys
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, email: "qa@test.com", role: "admin" } as const;

const id    = getProperty(user, 'id');    // type: 1
const email = getProperty(user, 'email'); // type: "qa@test.com"
const bad   = getProperty(user, 'phone'); // ❌ Error — 'phone' not in user

// Real QA use: type-safe Page Object element access
class LoginPage {
  private locators = {
    username: '#username',
    password: '#password',
    submit:   '#submit',
  };

  async fill<K extends keyof typeof this.locators>(
    key: K,
    value: string
  ): Promise<void> {
    await page.fill(this.locators[key], value);
  }
}
\`\`\`

### 3. The \`typeof\` Type Operator

*💡 Analogy: Imagine you have an existing object (a config, a constants object) and want to use its exact shape elsewhere. \`typeof\` reads the shape directly from the value — no need to manually write the type definition.*

\`\`\`typescript
// You already have this concrete config object
const TEST_CONFIG = {
  baseURL: "https://staging.example.com",
  timeout: 30000,
  retries: 3,
  headless: true,
};

// Get the type FROM the value — no separate interface needed
type TestConfig = typeof TEST_CONFIG;
// { baseURL: string; timeout: number; retries: number; headless: boolean }

// Use the derived type in functions
function applyConfig(config: TestConfig): void {
  console.log(\\\`Using \\\${config.baseURL} with timeout \\\${config.timeout}\\\`);
}

applyConfig(TEST_CONFIG);  // ✅
\`\`\`

### 4. Combining \`keyof typeof\` — A Powerful Pattern

\`\`\`typescript
// A constants object — common in QA frameworks
const TEST_ENVIRONMENTS = {
  dev:        "https://dev.example.com",
  staging:    "https://staging.example.com",
  production: "https://www.example.com",
} as const;

// Extract just the keys as a union type
type Environment = keyof typeof TEST_ENVIRONMENTS;
// 'dev' | 'staging' | 'production'

function runTestOn(env: Environment): void {
  const url = TEST_ENVIRONMENTS[env];
  console.log(\\\`Running tests on \\\${url}\\\`);
}

runTestOn('staging');  // ✅
runTestOn('local');    // ❌ Error: 'local' not in environments
\`\`\`

### 5. \`as const\` — Locks Object Values to Exact Literals

\`\`\`typescript
// WITHOUT as const — values widened to general types
const STATUSES = {
  pass: 'pass',
  fail: 'fail',
  skip: 'skip',
};
// type: { pass: string; fail: string; skip: string }
type S = (typeof STATUSES)['pass'];  // string  ← too broad

// WITH as const — values narrowed to exact literals
const STATUSES2 = {
  pass: 'pass',
  fail: 'fail',
  skip: 'skip',
} as const;
// type: { readonly pass: 'pass'; readonly fail: 'fail'; readonly skip: 'skip' }
type S2 = (typeof STATUSES2)['pass'];  // 'pass'  ← precise literal
\`\`\`

### 6. Real QA Pattern — Type-Safe Test Data

\`\`\`typescript
// Define test data once
const TEST_USERS = {
  admin:   { email: "admin@test.com",   role: "admin"  },
  manager: { email: "manager@test.com", role: "manager" },
  reader:  { email: "reader@test.com",  role: "reader"  },
} as const;

// Derive types automatically
type UserRole  = keyof typeof TEST_USERS;     // 'admin' | 'manager' | 'reader'
type TestUser  = typeof TEST_USERS[UserRole]; // { email: string; role: string }

// Type-safe getter
function loginAs(role: UserRole): TestUser {
  return TEST_USERS[role];
}

const adminUser = loginAs('admin');  // ✅
const wrongRole = loginAs('hacker'); // ❌ Error caught at compile time
\`\`\`
        `
      },
      {
        id: 'ts-mapped-types',
        title: 'Mapped Types',
        analogy: "A mapped type is a factory production line for types. You feed in an existing type, and the line transforms every property — making them all optional, all readonly, all string-typed, etc. The factory pattern is described once and applies uniformly to every property.",
        lessonMarkdown: `
### 1. Anatomy of a Mapped Type

*💡 Analogy: A mapped type is like a typewriter that accepts a stack of property names and types one at a time, and prints each one onto a new sheet with a transformation applied (capitalised, optional, readonly, etc.).*

The basic syntax:
\`\`\`typescript
type Mapped<T> = {
  [K in keyof T]: TransformedType;
};
\`\`\`

This iterates every key \`K\` of \`T\` and produces a new property with some transformation.

### 2. Building Your Own \`Partial<T>\`

The built-in \`Partial<T>\` is itself a mapped type. Here's how it's defined internally:

\`\`\`typescript
// TypeScript's actual definition of Partial
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

interface User {
  id: number;
  email: string;
  name: string;
}

type OptionalUser = MyPartial<User>;
// { id?: number; email?: string; name?: string }
\`\`\`

### 3. Property Modifiers — Adding and Removing

\`\`\`typescript
// Add readonly to every property
type ReadonlyAll<T> = {
  readonly [K in keyof T]: T[K];
};

// Add optional (?) to every property
type OptionalAll<T> = {
  [K in keyof T]?: T[K];
};

// Remove readonly with -readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Remove optional with -?
type Concrete<T> = {
  [K in keyof T]-?: T[K];
};

interface FrozenConfig {
  readonly host?: string;
  readonly port?: number;
}

type EditableConcreteConfig = Concrete<Mutable<FrozenConfig>>;
// { host: string; port: number }  — both readonly AND optional removed
\`\`\`

### 4. Transforming Property Types

\`\`\`typescript
interface User {
  id: number;
  email: string;
  isActive: boolean;
}

// Convert every property type to a string
type Stringified<T> = {
  [K in keyof T]: string;
};

type StringifiedUser = Stringified<User>;
// { id: string; email: string; isActive: string }

// Wrap every property in a Promise (e.g., for async APIs)
type AsyncProps<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type AsyncUser = AsyncProps<User>;
// { id: Promise<number>; email: Promise<string>; isActive: Promise<boolean> }
\`\`\`

### 5. Key Remapping with \`as\` Clauses (TS 4.1+)

*💡 Analogy: Key remapping is like a typewriter that not only transforms the value but also relabels the property name as it goes — turning "name" into "getName", for instance.*

\`\`\`typescript
// Generate getter method names from property names
type Getters<T> = {
  [K in keyof T as \\\`get\\\${Capitalize<string & K>}\\\`]: () => T[K];
};

interface User {
  id: number;
  email: string;
  name: string;
}

type UserGetters = Getters<User>;
// {
//   getId: () => number;
//   getEmail: () => string;
//   getName: () => string;
// }
\`\`\`

### 6. Filtering Out Properties

\`\`\`typescript
// Remove all properties whose value type is a function
type DataOnly<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

interface UserService {
  id: number;
  name: string;
  fetchUser: () => Promise<void>;
  saveUser:  () => Promise<void>;
}

type UserData = DataOnly<UserService>;
// { id: number; name: string }  — methods filtered out
\`\`\`

### 7. Real QA Example — Mock Factory Type

\`\`\`typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// A factory shape that returns each property — useful for mocking
type Factory<T> = {
  [K in keyof T]: () => T[K];
};

const userFactory: Factory<User> = {
  id:    () => Math.floor(Math.random() * 1000),
  email: () => \\\`test-\\\${Date.now()}@example.com\\\`,
  name:  () => "Test User",
  role:  () => "user",
};

function buildMock<T>(factory: Factory<T>): T {
  const result = {} as T;
  for (const key in factory) {
    result[key] = factory[key]();
  }
  return result;
}

const mockUser = buildMock(userFactory);  // Fully typed User
\`\`\`
        `
      },
      {
        id: 'ts-conditional-types',
        title: 'Conditional Types',
        analogy: "Conditional types are if/else statements that operate on TYPES instead of values. Just like a function returns one of two values based on a runtime condition, a conditional type produces one of two types based on a compile-time check.",
        lessonMarkdown: `
### 1. The Basic Syntax — \`T extends U ? X : Y\`

*💡 Analogy: Read \`T extends U ? X : Y\` as a question: "Is type T assignable to U? If yes, the result is X. If no, the result is Y." It's a type-level ternary expression.*

\`\`\`typescript
// "If T is a string, the result is 'text'. Otherwise, it's 'other'."
type IsString<T> = T extends string ? 'text' : 'other';

type A = IsString<"hello">;   // 'text'
type B = IsString<42>;        // 'other'
type C = IsString<boolean>;   // 'other'
\`\`\`

### 2. Practical Example — Returning Different Types

\`\`\`typescript
// If the input is an array, the result is the element type. Otherwise, it's never.
type ElementType<T> = T extends (infer E)[] ? E : never;

type T1 = ElementType<string[]>;          // string
type T2 = ElementType<number[]>;          // number
type T3 = ElementType<{ id: number }[]>;  // { id: number }
type T4 = ElementType<string>;            // never  (not an array)
\`\`\`

### 3. The \`infer\` Keyword — Extract Type Parts

*💡 Analogy: \`infer\` is like a fishing hook that pulls a type out of a larger structure. "Inside this Promise<X>, hook out the X."*

\`\`\`typescript
// Extract the resolved type from a Promise
type Awaited<T> = T extends Promise<infer R> ? R : T;

type R1 = Awaited<Promise<string>>;          // string
type R2 = Awaited<Promise<{ id: number }>>;  // { id: number }
type R3 = Awaited<number>;                   // number  (not a Promise — returns input)

// Extract the return type of a function
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchUser() {
  return { id: 1, email: "qa@test.com" };
}

type User = GetReturn<typeof fetchUser>;  // { id: number; email: string }
\`\`\`

### 4. Distributive Conditional Types

When the input type is a union, conditional types distribute over each member:

\`\`\`typescript
// "For each member of T, keep it only if it's a string."
type StringOnly<T> = T extends string ? T : never;

type Mixed = StringOnly<string | number | boolean>;
// = (string extends string ? string : never)
// | (number extends string ? number : never)
// | (boolean extends string ? boolean : never)
// = string | never | never
// = string

// Excluding members from a union
type Without<T, U> = T extends U ? never : T;

type Result = Without<'pass' | 'fail' | 'skip' | 'pending', 'pending'>;
// 'pass' | 'fail' | 'skip'
\`\`\`

### 5. Real QA Example — Async vs Sync Function Types

\`\`\`typescript
// Determine whether a test function is async or sync
type TestFnKind<T> = T extends () => Promise<unknown> ? 'async' : 'sync';

const syncTest  = () => true;
const asyncTest = async () => true;

type K1 = TestFnKind<typeof syncTest>;   // 'sync'
type K2 = TestFnKind<typeof asyncTest>;  // 'async'
\`\`\`

### 6. Built-in Conditional Utility Types

TypeScript ships with many conditional utilities built on this pattern:

\`\`\`typescript
// Exclude<T, U> — remove members of T that are assignable to U
type T1 = Exclude<'a' | 'b' | 'c', 'a'>;  // 'b' | 'c'

// Extract<T, U> — keep only members of T assignable to U
type T2 = Extract<'a' | 'b' | 1 | 2, string>;  // 'a' | 'b'

// NonNullable<T> — remove null and undefined
type T3 = NonNullable<string | null | undefined>;  // string

// Awaited<T> — unwrap Promise types
type T4 = Awaited<Promise<Promise<string>>>;  // string  (recursively unwraps)
\`\`\`

### 7. Common Mistakes

**Mistake: Forgetting that \`extends\` here means "assignable to," not class inheritance**
\`\`\`typescript
// "extends" in conditional types is structural compatibility check
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>;    // true
type B = IsArray<readonly string[]>; // false  ← because readonly arrays don't extend mutable ones
\`\`\`
        `
      },
      {
        id: 'ts-template-literal-types',
        title: 'Template Literal Types',
        analogy: "Template literal types are like a copy machine that uses placeholder masks. You provide a template (\\\`event-\\\${string}\\\`) and the machine generates a controlled vocabulary of strings that match the pattern. Useful for event names, API paths, CSS class names, and more.",
        lessonMarkdown: `
### 1. Basic Template Literal Types

*💡 Analogy: At the value level, you write \\\`Hello, \\\${name}\\\` and JavaScript inserts the variable. At the TYPE level, you write \\\`Hello, \\\${T}\\\` and TypeScript generates the union of all possible string types matching that template.*

\`\`\`typescript
// Combining literal types into new literals
type Greeting = \\\`Hello, \\\${string}\\\`;

const g1: Greeting = "Hello, World";    // ✅
const g2: Greeting = "Hello, QA Team";  // ✅
const g3: Greeting = "Hi, World";       // ❌ doesn't match the template

// Generating combinations from unions
type Direction = 'top' | 'bottom' | 'left' | 'right';
type Position = \\\`\\\${Direction}-edge\\\`;
// 'top-edge' | 'bottom-edge' | 'left-edge' | 'right-edge'
\`\`\`

### 2. Building Event Names

\`\`\`typescript
type EventName = 'click' | 'hover' | 'focus' | 'blur';
type Element   = 'button' | 'input' | 'link';

// All combinations
type EventHandler = \\\`on\\\${Capitalize<Element>}\\\${Capitalize<EventName>}\\\`;
// 'onButtonClick' | 'onButtonHover' | 'onButtonFocus' | ...
// 'onInputClick'  | 'onInputHover'  | ...
// (12 total combinations)

// Type-safe event handler registration
const handlers: Partial<Record<EventHandler, () => void>> = {
  onButtonClick: () => console.log('Button clicked'),
  onInputBlur:   () => console.log('Input blurred'),
};
\`\`\`

### 3. Built-in String Manipulation Types

\`\`\`typescript
type T1 = Uppercase<'hello'>;    // 'HELLO'
type T2 = Lowercase<'HELLO'>;    // 'hello'
type T3 = Capitalize<'hello'>;   // 'Hello'
type T4 = Uncapitalize<'Hello'>; // 'hello'

// Combine for property name generation
type Setter<K extends string> = \\\`set\\\${Capitalize<K>}\\\`;

type T5 = Setter<'name'>;  // 'setName'
type T6 = Setter<'email'>; // 'setEmail'
\`\`\`

### 4. Real QA Example — Type-Safe API Path Builder

\`\`\`typescript
type Resource = 'users' | 'orders' | 'products' | 'tests';
type APIPath  = \\\`/api/\\\${Resource}\\\` | \\\`/api/\\\${Resource}/\\\${string}\\\`;

async function get(path: APIPath): Promise<unknown> {
  const response = await fetch(path);
  return response.json();
}

await get('/api/users');           // ✅
await get('/api/users/42');        // ✅
await get('/api/orders/abc123');   // ✅
await get('/api/unknown');         // ❌ Error: 'unknown' not a valid resource
await get('/users');               // ❌ Error: doesn't start with /api/
\`\`\`

### 5. Real QA Example — Type-Safe Test ID Generator

\`\`\`typescript
type Page    = 'login' | 'dashboard' | 'profile' | 'checkout';
type Element = 'button' | 'input' | 'link' | 'modal';

// Enforces a naming convention: data-testid="<page>-<element>-<name>"
type TestId = \\\`\\\${Page}-\\\${Element}-\\\${string}\\\`;

function selectByTestId(id: TestId): string {
  return \\\`[data-testid="\\\${id}"]\\\`;
}

selectByTestId('login-button-submit');     // ✅
selectByTestId('dashboard-modal-confirm'); // ✅
selectByTestId('home-button-cta');         // ❌ 'home' not a valid Page
\`\`\`

### 6. Pattern Matching with \`infer\`

\`\`\`typescript
// Extract the resource name from an API path
type ExtractResource<T> = T extends \\\`/api/\\\${infer R}\\\` ? R : never;

type R1 = ExtractResource<'/api/users'>;     // 'users'
type R2 = ExtractResource<'/api/orders/42'>; // 'orders/42'
type R3 = ExtractResource<'/users'>;         // never (no match)
\`\`\`
        `
      },
      {
        id: 'ts-indexed-access',
        title: 'Indexed Access Types',
        analogy: "Indexed access types are like dictionary lookups for types. Just as \`obj[key]\` retrieves a value from an object at runtime, \`T[K]\` retrieves a TYPE from another type at compile time. It's a lookup table operating purely in the type system.",
        lessonMarkdown: `
### 1. The Basic Syntax — \`T[K]\`

*💡 Analogy: If \`T\` is a filing cabinet of types and \`K\` is a drawer label, then \`T[K]\` opens that drawer and pulls out the type stored inside.*

\`\`\`typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Access the type of a single property
type UserId    = User['id'];     // number
type UserEmail = User['email'];  // string
type UserRole  = User['role'];   // 'admin' | 'user'

// Access multiple properties as a union
type Identifier = User['id' | 'email'];  // number | string
\`\`\`

### 2. Combining \`keyof\` with Indexed Access

\`\`\`typescript
interface Config {
  host: string;
  port: number;
  ssl: boolean;
}

// Get a union of ALL value types in Config
type ConfigValue = Config[keyof Config];
// = Config['host'] | Config['port'] | Config['ssl']
// = string | number | boolean
\`\`\`

### 3. Looking Into Nested Types

\`\`\`typescript
interface APIResponse {
  data: {
    user: {
      id: number;
      profile: {
        avatar: string;
        bio: string;
      };
    };
  };
  meta: {
    timestamp: Date;
    version: string;
  };
}

// Deep lookup
type Profile = APIResponse['data']['user']['profile'];
// { avatar: string; bio: string }

type Avatar = APIResponse['data']['user']['profile']['avatar'];
// string
\`\`\`

### 4. Array Element Type Lookup

\`\`\`typescript
const TEST_RESULTS = [
  { name: "Login Test",    passed: true,  durationMs: 850 },
  { name: "Checkout Test", passed: false, durationMs: 1200 },
] as const;

// Get the element type of the array
type TestResult = (typeof TEST_RESULTS)[number];
// { readonly name: string; readonly passed: boolean; readonly durationMs: number }

function summarise(result: TestResult): void {
  console.log(\\\`\\\${result.name}: \\\${result.passed ? 'PASS' : 'FAIL'}\\\`);
}
\`\`\`

### 5. Real QA Example — Function Parameter Types

\`\`\`typescript
class APIClient {
  async login(credentials: { email: string; password: string }): Promise<{ token: string }> {
    // ...
    return { token: "" };
  }
  async createOrder(payload: { userId: number; items: string[] }): Promise<{ orderId: number }> {
    // ...
    return { orderId: 0 };
  }
}

// Extract the parameter type WITHOUT redeclaring it
type LoginCredentials = Parameters<APIClient['login']>[0];
// { email: string; password: string }

type OrderPayload = Parameters<APIClient['createOrder']>[0];
// { userId: number; items: string[] }

// Now define test data using the extracted types
const validCredentials: LoginCredentials = {
  email: "qa@test.com",
  password: "Pass123!",
};
\`\`\`

### 6. Indexed Access in Generic Functions

\`\`\`typescript
// Type-safe property setter
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const user: User = { id: 1, email: "qa@test.com", name: "Sagar", role: "admin" };

setProperty(user, 'email', "new@test.com");  // ✅
setProperty(user, 'role',  "user");          // ✅
setProperty(user, 'role',  "guest");         // ❌ Error — not in 'admin' | 'user'
setProperty(user, 'id',    "abc");           // ❌ Error — id must be number
\`\`\`

### 7. Pulling Out Nested Result Types

\`\`\`typescript
// Suppose you have a deeply nested API response type from an SDK
type SDKResponse = {
  result: {
    data: {
      items: Array<{
        id: string;
        attributes: {
          name: string;
          status: 'active' | 'archived';
        };
      }>;
    };
  };
};

// Extract just the item type for use in tests/assertions
type Item = SDKResponse['result']['data']['items'][number];
// { id: string; attributes: { name: string; status: 'active' | 'archived' } }

type ItemStatus = Item['attributes']['status'];  // 'active' | 'archived'
\`\`\`
        `
      },
      {
        id: 'ts-classes',
        title: 'Classes with TypeScript',
        analogy: "TypeScript classes are like blueprints with strict access control. Public rooms are open to visitors, private rooms have keypad locks (only the building owner enters), protected rooms are accessible to family members (subclasses). Abstract blueprints define the layout but cannot be built directly — you must create a concrete variant first.",
        lessonMarkdown: `
### 1. Class Basics with Type Annotations

\`\`\`typescript
class TestRunner {
  // Property declarations with types
  name: string;
  timeout: number;
  retries: number;

  // Constructor with typed parameters
  constructor(name: string, timeout: number = 30000, retries: number = 0) {
    this.name = name;
    this.timeout = timeout;
    this.retries = retries;
  }

  // Methods with typed parameters and return types
  async run(): Promise<boolean> {
    console.log(\\\`Running \\\${this.name}\\\`);
    return true;
  }
}

const runner = new TestRunner("Login Tests", 30000, 3);
await runner.run();
\`\`\`

### 2. Parameter Properties — Constructor Shorthand

*💡 Analogy: Parameter properties are like a self-assembling chair — the moment you receive the parts, the chair assembles itself. The constructor parameter declaration also creates and assigns the property in one step.*

\`\`\`typescript
class TestRunner {
  // Shorthand: declare AND assign properties from constructor parameters
  constructor(
    public name: string,
    public timeout: number = 30000,
    public retries: number = 0
  ) {}
  // No need for explicit "this.name = name" — TypeScript does it automatically
}

// Equivalent to the longer version above
\`\`\`

### 3. Access Modifiers — public, private, protected

\`\`\`typescript
class APIClient {
  public  baseURL: string;          // Accessible everywhere (default)
  private apiKey: string;            // Only inside this class
  protected sessionToken: string;    // This class + subclasses

  constructor(baseURL: string, apiKey: string) {
    this.baseURL      = baseURL;
    this.apiKey       = apiKey;
    this.sessionToken = "";
  }

  // private method — internal implementation detail
  private buildHeaders(): Record<string, string> {
    return { Authorization: \\\`Bearer \\\${this.apiKey}\\\` };
  }

  // public method — part of the API
  public async get(path: string): Promise<unknown> {
    const headers = this.buildHeaders();
    const res = await fetch(\\\`\\\${this.baseURL}\\\${path}\\\`, { headers });
    return res.json();
  }
}

const client = new APIClient("https://api.test.com", "secret");
client.baseURL;     // ✅ public
client.apiKey;      // ❌ Error: private
client.buildHeaders(); // ❌ Error: private
\`\`\`

### 4. Readonly Properties

\`\`\`typescript
class TestEnvironment {
  constructor(
    public readonly id: string,           // Cannot be reassigned after construction
    public readonly createdAt: Date,
    public name: string,                   // Mutable
    public isActive: boolean
  ) {}
}

const env = new TestEnvironment("env-001", new Date(), "Staging", true);
env.name = "Staging-v2";       // ✅ Fine
env.isActive = false;          // ✅ Fine
env.id = "env-002";            // ❌ Error: readonly
\`\`\`

### 5. Implementing Interfaces

\`\`\`typescript
interface ILoginPage {
  navigate(): Promise<void>;
  enterCredentials(email: string, password: string): Promise<void>;
  submit(): Promise<void>;
  getErrorMessage(): Promise<string | null>;
}

class LoginPage implements ILoginPage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto("/login");
  }

  async enterCredentials(email: string, password: string): Promise<void> {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
  }

  async submit(): Promise<void> {
    await this.page.click('[data-testid="submit"]');
  }

  async getErrorMessage(): Promise<string | null> {
    const el = this.page.locator('.error-message');
    if (await el.isVisible()) return el.textContent();
    return null;
  }
}
\`\`\`

### 6. Abstract Classes — Templates That Cannot Be Instantiated

*💡 Analogy: An abstract class is like a partial blueprint — it defines the building structure but with some rooms left empty. You cannot build a house from it directly; you must inherit and fill in the missing pieces first.*

\`\`\`typescript
abstract class BasePage {
  constructor(protected page: Page) {}

  // Concrete method — shared by all pages
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Abstract method — every subclass MUST implement this
  abstract navigate(): Promise<void>;
  abstract assertLoaded(): Promise<void>;
}

class HomePage extends BasePage {
  async navigate(): Promise<void> {
    await this.page.goto("/");
  }

  async assertLoaded(): Promise<void> {
    await this.page.waitForSelector('[data-testid="hero-banner"]');
  }
}

const home = new HomePage(page);  // ✅
const base = new BasePage(page);  // ❌ Error: cannot instantiate abstract class
\`\`\`

### 7. Static Members — Class-Level Properties

\`\`\`typescript
class TestData {
  static readonly DEFAULT_TIMEOUT = 30000;
  static readonly MAX_RETRIES     = 3;

  static randomEmail(): string {
    return \\\`test-\\\${Date.now()}@example.com\\\`;
  }
}

// No instance needed — accessed on the class itself
const timeout = TestData.DEFAULT_TIMEOUT;
const email   = TestData.randomEmail();
\`\`\`

### 8. Getters & Setters — Controlled Property Access

*💡 Analogy: A getter is like a tinted glass window — people outside can see a processed view of what's inside (formatted, computed, cached), but they don't see the raw storage. A setter is like a mail slot with a bouncer — it decides what gets in, rejecting packages that don't meet the requirements before anything reaches the inside.*

\`\`\`typescript
class TestEnvironment {
  private _baseURL: string;
  private _timeout: number;

  constructor(baseURL: string, timeout: number) {
    this._baseURL = baseURL;
    this._timeout = timeout;
  }

  // Getter — computed/formatted value, accessed like a property (no parentheses)
  get baseURL(): string {
    return this._baseURL;
  }

  // Setter — validates before storing
  set baseURL(value: string) {
    if (!value.startsWith('http')) {
      throw new Error(\\\`Invalid URL: must start with http/https\\\`);
    }
    this._baseURL = value;
  }

  // Read-only getter — no setter means property is effectively immutable from outside
  get timeoutInSeconds(): number {
    return this._timeout / 1000;  // Derived value — computed on demand
  }
}

const env = new TestEnvironment('https://staging.test.com', 30000);

console.log(env.baseURL);           // 'https://staging.test.com' — calls getter
console.log(env.timeoutInSeconds);  // 30 — computed from ms

env.baseURL = 'https://prod.test.com';  // ✅ calls setter, validates first
env.baseURL = 'ftp://wrong.com';        // ❌ Throws: Invalid URL
env.timeoutInSeconds = 60;              // ❌ Error: no setter — read-only
\`\`\`

**Real QA Pattern — Lazy-Loaded Locators in Page Objects:**
\`\`\`typescript
class DashboardPage {
  constructor(private page: Page) {}

  // Getter returns a locator — computed fresh each time it's accessed
  // No need to store the locator in a constructor — it's created on demand
  get welcomeBanner()  { return this.page.locator('[data-testid="welcome"]'); }
  get userMenu()       { return this.page.locator('[data-testid="user-menu"]'); }
  get notifBadge()     { return this.page.locator('.notification-badge'); }

  async assertWelcomeVisible(): Promise<void> {
    await this.welcomeBanner.waitFor({ state: 'visible' });  // clean, no this.#locator
  }
}

// In test code — reads naturally, no method call noise
const dashboard = new DashboardPage(page);
await expect(dashboard.welcomeBanner).toBeVisible();  // direct, readable
await dashboard.userMenu.click();
\`\`\`

**Getter for computed/cached values:**
\`\`\`typescript
class TestReport {
  constructor(
    private readonly results: Array<{ passed: boolean; durationMs: number }>
  ) {}

  get passCount():    number { return this.results.filter(r => r.passed).length; }
  get failCount():    number { return this.results.filter(r => !r.passed).length; }
  get totalCount():   number { return this.results.length; }
  get passRate():     number { return Math.round((this.passCount / this.totalCount) * 100); }
  get avgDuration():  number {
    const total = this.results.reduce((sum, r) => sum + r.durationMs, 0);
    return Math.round(total / this.totalCount);
  }

  get summary(): string {
    return \\\`\\\${this.passCount}/\\\${this.totalCount} passed (\\\${this.passRate}%) avg \\\${this.avgDuration}ms\\\`;
  }
}

const report = new TestReport([
  { passed: true,  durationMs: 850  },
  { passed: false, durationMs: 1200 },
  { passed: true,  durationMs: 950  },
]);

console.log(report.passRate);  // 67
console.log(report.summary);  // "2/3 passed (67%) avg 1000ms"
\`\`\`

### 9. Class Inheritance — extends, super, override

*💡 Analogy: Inheritance is like a family recipe book. The grandmother's base recipe defines the core method: dough, filling, bake. Each grandchild EXTENDS the recipe — they inherit the base method but can override specific steps (add extra spices, change the filling). They must still call the grandmother's steps first (\`super()\`) before adding their own twist.*

**The \`extends\` keyword — inheriting from a parent class:**
\`\`\`typescript
// Parent class — the reusable foundation
class BasePage {
  constructor(protected page: Page, protected baseURL: string) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(\\\`\\\${this.baseURL}\\\${path}\\\`);
    await this.page.waitForLoadState('networkidle');
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: \\\`screenshots/\\\${name}.png\\\` });
  }
}

// Child class — inherits everything from BasePage and adds its own behaviour
class LoginPage extends BasePage {
  // Child constructor MUST call super() first — passes args to the parent
  constructor(page: Page, baseURL: string) {
    super(page, baseURL);   // ← calls BasePage constructor
  }

  // LoginPage's own methods — in addition to inherited navigate/screenshot
  async enterEmail(email: string): Promise<void> {
    await this.page.fill('[data-testid="email"]', email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.fill('[data-testid="password"]', password);
  }

  async submit(): Promise<void> {
    await this.page.click('[data-testid="submit"]');
  }

  // Full login flow — uses inherited navigate() + its own methods
  async login(email: string, password: string): Promise<void> {
    await this.navigate('/login');  // ✅ inherited from BasePage
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
  }
}

const loginPage = new LoginPage(page, 'https://staging.test.com');
await loginPage.login('qa@test.com', 'Secret123!');
await loginPage.screenshot('after-login');  // ✅ still inherited from BasePage
\`\`\`

**Calling \`super.method()\` — extending parent behaviour:**
\`\`\`typescript
class AuthenticatedPage extends BasePage {
  constructor(page: Page, baseURL: string, private authToken: string) {
    super(page, baseURL);
  }

  // Override navigate — call parent's version THEN add auth step
  override async navigate(path: string): Promise<void> {
    await super.navigate(path);          // Run the parent's navigate first
    await this.page.evaluate(            // Then inject the auth token
      (token) => localStorage.setItem('auth_token', token),
      this.authToken
    );
  }
}
\`\`\`

**The \`override\` keyword — TypeScript 4.3+, your safety net:**
\`\`\`typescript
class DashboardPage extends BasePage {
  // ✅ 'override' tells TypeScript this must exist in the parent
  // If you rename/remove it in BasePage, TypeScript errors HERE — not at runtime
  override async navigate(path: string): Promise<void> {
    await super.navigate(path);
    await this.page.waitForSelector('[data-testid="dashboard-loaded"]');
  }

  // ❌ Without 'override': silently creates a new method if parent spelling differs
  // navigatte(path: string) {}  — typo goes unnoticed without 'override'
}

// Enable in tsconfig: "noImplicitOverride": true  — forces override on all overrides
\`\`\`

**Multi-level inheritance — realistic POM structure:**
\`\`\`typescript
// Level 1: core page infrastructure
abstract class BasePage {
  constructor(protected page: Page) {}
  abstract navigate(): Promise<void>;
  async waitForLoad() { await this.page.waitForLoadState('networkidle'); }
}

// Level 2: adds authentication awareness
abstract class AuthenticatedPage extends BasePage {
  async assertLoggedIn(): Promise<void> {
    await this.page.waitForSelector('[data-testid="user-avatar"]');
  }
}

// Level 3: concrete page with full implementation
class OrdersPage extends AuthenticatedPage {
  override async navigate(): Promise<void> {
    await this.page.goto('/orders');
    await this.waitForLoad();  // inherited from BasePage
  }

  async getOrderCount(): Promise<number> {
    return this.page.locator('.order-row').count();
  }
}

const orders = new OrdersPage(page);
await orders.navigate();
await orders.assertLoggedIn();  // from AuthenticatedPage
const count = await orders.getOrderCount();
\`\`\`

**Key rules for inheritance:**

| Rule | Explanation |
|------|-------------|
| \`super()\` in constructor | Must be FIRST line — parent must initialise before child |
| \`super.method()\` | Calls the parent's version of the method |
| \`override\` keyword | Explicitly marks intentional overrides — prevents silent bugs |
| \`protected\` | Parent properties accessible in child but not outside |
| Only one \`extends\` | TypeScript (like Java) supports single inheritance only |
        `
      },
      {
        id: 'ts-oop-principles',
        title: 'OOP Principles',
        analogy: "Object-Oriented Programming is like running a professional kitchen. The Head Chef (Abstraction) writes the recipe cards without the line cooks needing to know where the ingredients were sourced. Each station (Encapsulation) keeps its own tools locked away — the grill station doesn't let the pastry station touch their knives. New chefs (Inheritance) are trained on the base recipes and can adapt them for specials without rewriting the whole menu. Any trained chef can step in and execute the same recipe differently based on their section (Polymorphism) — the restaurant manager just calls 'prepare dish 4' and each station handles it their way.",
        lessonMarkdown: `
### 1. Why OOP Exists — The Problem It Solves

*💡 Analogy: Early programs were like writing instructions on a single enormous scroll. Everything was in one place, order mattered absolutely, and changing one line could unravel everything below it. OOP invented the idea of cutting the scroll into separate, self-contained chapters — each responsible for its own data and behaviour.*

Before OOP, code was **procedural** — a long sequence of instructions. As programs grew, this became unmanageable: functions reached into global variables unpredictably, the same logic was copy-pasted everywhere, and changing one thing broke ten others.

OOP solves this by organising code around **objects** — bundles of data (properties) and behaviour (methods) that work together. TypeScript implements OOP using classes, interfaces, inheritance, and access modifiers.

The four pillars of OOP are not just features — they are four **strategies** for managing complexity:

| Pillar | Strategy | One-line definition |
|--------|----------|---------------------|
| **Encapsulation** | Hide complexity | Bundle data + behaviour, restrict direct access |
| **Abstraction** | Simplify interfaces | Expose WHAT, hide HOW |
| **Inheritance** | Reuse structure | Child classes extend parent behaviour |
| **Polymorphism** | Flexible substitution | Same call, different behaviour based on type |

### 2. Encapsulation — Protect Your State

*💡 Analogy: A bank account is the textbook example. The balance is private — you cannot reach into the bank's database and type in a new number. Instead you interact through controlled methods: deposit() and withdraw(), which enforce rules (can't withdraw more than balance, can't deposit negative amounts). The WHAT (your balance) is accessible; the HOW it's stored is hidden.*

Encapsulation means **bundling data with the methods that operate on it, and restricting direct access** to the data from outside.

\`\`\`typescript
class TestSession {
  private _results: Array<{ name: string; passed: boolean }> = [];
  private _startedAt: Date = new Date();
  private _isActive: boolean = true;

  // Controlled write — only through add(), never direct array access
  addResult(name: string, passed: boolean): void {
    if (!this._isActive) throw new Error('Session is closed');
    this._results.push({ name, passed });
  }

  // Controlled read — computed view, not raw data
  get passRate(): number {
    if (this._results.length === 0) return 0;
    return (this._results.filter(r => r.passed).length / this._results.length) * 100;
  }

  get duration(): number {
    return Date.now() - this._startedAt.getTime();
  }

  close(): void {
    this._isActive = false;
  }
}

const session = new TestSession();
session.addResult('Login Test', true);
session.addResult('Checkout Test', false);

console.log(session.passRate);   // 50 — read through controlled getter
// session._results = [];        // ❌ TypeScript blocks this — private
// session._isActive = false;    // ❌ Blocked — must use close()
session.close();
\`\`\`

**Why encapsulation matters in QA:**
- Test fixtures can't be accidentally corrupted between tests
- Page Objects hide Playwright implementation details — tests work with readable methods
- Data models enforce invariants (a TestRun can't be both pass and fail)

### 3. Abstraction — Simplify What You Expose

*💡 Analogy: When you press the accelerator pedal in a car, you don't interact with fuel injection, combustion timing, or throttle valve angles. The car's interface (pedals, wheel, gear lever) is an abstraction — it hides the hundreds of mechanical steps behind a simple, consistent interface. You only need to know WHAT to do, not HOW it works.*

Abstraction means **exposing a clean, minimal interface while hiding the implementation details**. In TypeScript, this is achieved with interfaces and abstract classes.

\`\`\`typescript
// The abstraction — this is ALL the caller needs to know
interface IAPIClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

// The implementation — complex details hidden from the caller
class APIClient implements IAPIClient {
  private baseURL: string;
  private token: string;
  private retries: number = 3;
  private timeout: number = 30000;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(\\\`\\\${this.baseURL}\\\${path}\\\`, {
      headers: { Authorization: \\\`Bearer \\\${this.token}\\\` },
      signal: AbortSignal.timeout(this.timeout),
    });
    if (!response.ok) throw new Error(\\\`GET \\\${path} failed: \\\${response.status}\\\`);
    return response.json() as T;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    // ... full retry logic, error handling, logging
    return {} as T;
  }

  async delete(path: string): Promise<void> {
    // ... implementation details
  }
}

// Test code only cares about the abstraction — not how it works internally
async function runTest(client: IAPIClient): Promise<void> {
  const users = await client.get<User[]>('/api/users');
  console.log(\\\`Found \\\${users.length} users\\\`);
}

// Swap the real client for a mock in tests — same interface, different implementation
class MockAPIClient implements IAPIClient {
  async get<T>(_path: string): Promise<T> { return [] as T; }
  async post<T>(_path: string, _body: unknown): Promise<T> { return {} as T; }
  async delete(_path: string): Promise<void> {}
}

await runTest(new APIClient('https://staging.test.com', 'token'));   // real
await runTest(new MockAPIClient());                                    // mock — same call!
\`\`\`

### 4. Inheritance — Reuse and Extend

*💡 Analogy: Think of a car model lineup. The base model has engine, steering, seats, and safety features. The Sport edition EXTENDS the base — it inherits everything but adds a turbo engine and sport suspension. The Luxury edition extends the base differently — same foundation, different upgrades. Nobody rebuilt the engine from scratch for each model.*

You've already seen \`extends\`, \`super()\`, and \`override\` in the classes module. The OOP-level principle is: **use inheritance when a child IS-A specialised version of the parent, and shares most of its structure and behaviour.**

\`\`\`typescript
abstract class BasePage {
  constructor(protected page: Page) {}
  async waitForLoad() { await this.page.waitForLoadState('networkidle'); }
  abstract navigate(): Promise<void>;
}

class LoginPage extends BasePage {           // LoginPage IS-A BasePage ✅
  override async navigate() {
    await this.page.goto('/login');
    await this.waitForLoad();  // inherited
  }
  async login(email: string, pass: string) { /* ... */ }
}

class DashboardPage extends BasePage {       // DashboardPage IS-A BasePage ✅
  override async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForLoad();  // inherited
  }
  async getWelcomeText() { /* ... */ }
}
\`\`\`

**The IS-A test:** Before using inheritance, ask "Is a DashboardPage a BasePage?" If yes, inheritance fits. If the answer feels forced ("Is a Logger a TestRunner?"), use composition instead.

### 5. Polymorphism — Same Call, Different Behaviour

*💡 Analogy: A universal TV remote has a single POWER button. Press it in front of a Samsung and a Samsung turns on. Press it in front of a Sony and a Sony turns on. The remote doesn't know or care what brand is in front of it — it sends the same signal and each TV responds in its own way. That is polymorphism: one interface, many implementations.*

Polymorphism is the most powerful OOP pillar — and the most often missed by beginners. It means **code can work with objects of different types through a shared interface, without knowing the specific type**.

**The core pattern — treating different objects uniformly through their shared type:**
\`\`\`typescript
abstract class BasePage {
  constructor(protected page: Page) {}
  abstract navigate(): Promise<void>;
  abstract assertLoaded(): Promise<void>;
}

class LoginPage extends BasePage {
  override async navigate() { await this.page.goto('/login'); }
  override async assertLoaded() {
    await this.page.waitForSelector('[data-testid="login-form"]');
  }
}

class DashboardPage extends BasePage {
  override async navigate() { await this.page.goto('/dashboard'); }
  override async assertLoaded() {
    await this.page.waitForSelector('[data-testid="dashboard-header"]');
  }
}

class CheckoutPage extends BasePage {
  override async navigate() { await this.page.goto('/checkout'); }
  override async assertLoaded() {
    await this.page.waitForSelector('[data-testid="cart-summary"]');
  }
}

// ✨ Polymorphism in action — this function works for ANY page
// It doesn't know or care which page it receives
async function verifyPageLoads(page: BasePage): Promise<void> {
  await page.navigate();    // calls whichever navigate() the object has
  await page.assertLoaded(); // calls whichever assertLoaded() the object has
}

// Run the same test logic across all pages — polymorphically
const pages: BasePage[] = [
  new LoginPage(page),
  new DashboardPage(page),
  new CheckoutPage(page),
];

for (const p of pages) {
  await verifyPageLoads(p);   // same call — three different behaviours
}
\`\`\`

**Polymorphism through interfaces — even more flexible:**
\`\`\`typescript
// Any class can implement this — no shared ancestor required
interface Reportable {
  generateReport(): string;
}

class TestRun implements Reportable {
  constructor(private name: string, private passed: boolean) {}
  generateReport(): string {
    return \\\`[\\\${this.passed ? 'PASS' : 'FAIL'}] \\\${this.name}\\\`;
  }
}

class APICheckResult implements Reportable {
  constructor(private endpoint: string, private status: number) {}
  generateReport(): string {
    return \\\`API \\\${this.endpoint} → \\\${this.status}\\\`;
  }
}

class DatabaseCheck implements Reportable {
  constructor(private query: string, private rowCount: number) {}
  generateReport(): string {
    return \\\`DB: \\\${this.query} returned \\\${this.rowCount} rows\\\`;
  }
}

// One function, three completely unrelated classes — unified by the interface
function printAllReports(reportables: Reportable[]): void {
  for (const r of reportables) {
    console.log(r.generateReport());  // polymorphic call
  }
}

printAllReports([
  new TestRun('Login', true),
  new APICheckResult('/api/users', 200),
  new DatabaseCheck('SELECT * FROM users', 42),
]);
// [PASS] Login
// API /api/users → 200
// DB: SELECT * FROM users returned 42 rows
\`\`\`

**Why polymorphism is the cornerstone of scalable test frameworks:**
\`\`\`typescript
// You can add a new page type WITHOUT touching verifyPageLoads
class ProfilePage extends BasePage {
  override async navigate() { await this.page.goto('/profile'); }
  override async assertLoaded() {
    await this.page.waitForSelector('[data-testid="profile-header"]');
  }
}

// Just add it to the array — existing code unchanged
pages.push(new ProfilePage(page));
// The loop still works — it calls the right methods automatically
\`\`\`

### 6. Composition vs Inheritance — The Critical Design Choice

*💡 Analogy: Inheritance is like genetic traits — you get them from your parents automatically, whether you want all of them or not. Composition is like building with LEGO — you pick exactly the bricks you want and assemble them. LEGO is almost always more flexible than DNA.*

**The golden rule: "Favour composition over inheritance"** — use inheritance only when a true IS-A relationship exists.

**When inheritance is right — IS-A relationship:**
\`\`\`typescript
// ✅ LoginPage IS-A BasePage — same core structure, specialised behaviour
class LoginPage extends BasePage { ... }

// ✅ AdminUser IS-A User — same user type with extra capabilities
class AdminUser extends User { ... }
\`\`\`

**When composition is right — HAS-A relationship:**
\`\`\`typescript
// ❌ Inheritance misuse — a TestReporter is NOT a TestRunner
class LoggingTestRunner extends TestRunner {
  override async run() {
    console.log('Starting...');
    await super.run();
    console.log('Done.');
  }
}

// ✅ Composition — TestRunner HAS-A logger, injected from outside
class Logger {
  log(message: string): void { console.log(\\\`[\\\${new Date().toISOString()}] \\\${message}\\\`); }
}

class TestRunner {
  constructor(
    private name: string,
    private logger: Logger   // composed in — not inherited
  ) {}

  async run(): Promise<void> {
    this.logger.log(\\\`Starting: \\\${this.name}\\\`);
    // ... run tests
    this.logger.log(\\\`Finished: \\\${this.name}\\\`);
  }
}

// Swap the logger without touching TestRunner
const runner1 = new TestRunner('Suite A', new Logger());             // console logger
const runner2 = new TestRunner('Suite B', new FileLogger('log.txt')); // file logger
const runner3 = new TestRunner('Suite C', new SilentLogger());        // no output
\`\`\`

**Composition advantages:**
\`\`\`typescript
// Real QA example — composing a Page Object from capability objects
class ReportGenerator { generatePDF(): string { return '...'; } }
class Screenshotter  { async capture(): Promise<string> { return '...'; } }
class NetworkLogger  { startRecording(): void { } stopRecording(): Request[] { return []; } }

class CheckoutPage {
  // Each capability is a separate, testable, swappable object
  constructor(
    private page: Page,
    private reporter: ReportGenerator,    // HAS-A reporter
    private screenshot: Screenshotter,    // HAS-A screenshotter
    private networkLog: NetworkLogger,    // HAS-A network logger
  ) {}

  async placeOrder(): Promise<void> {
    this.networkLog.startRecording();
    await this.page.click('[data-testid="place-order"]');
    const requests = this.networkLog.stopRecording();
    const shot = await this.screenshot.capture();
    // Each collaborator does its own job — CheckoutPage orchestrates
  }
}
\`\`\`

### 7. All Four Pillars Together — A Complete QA Example

\`\`\`typescript
// ABSTRACTION — the interface that callers depend on
interface ITestReporter {
  report(name: string, passed: boolean, durationMs: number): void;
  summary(): string;
}

// ENCAPSULATION — data is private, only exposed through controlled methods
class ConsoleReporter implements ITestReporter {
  private results: Array<{ name: string; passed: boolean; ms: number }> = [];

  report(name: string, passed: boolean, ms: number): void {
    this.results.push({ name, passed, ms });
    console.log(\\\`[\\\${passed ? '✅' : '❌'}] \\\${name} (\\\${ms}ms)\\\`);
  }

  get passRate() {
    return Math.round((this.results.filter(r => r.passed).length / this.results.length) * 100);
  }

  summary(): string {
    return \\\`\\\${this.results.length} tests | \\\${this.passRate}% pass rate\\\`;
  }
}

// INHERITANCE — SlackReporter extends and specialises ConsoleReporter
class SlackReporter extends ConsoleReporter {
  constructor(private webhookURL: string) {
    super();
  }

  // POLYMORPHISM — overrides report() but is still usable as ITestReporter
  override report(name: string, passed: boolean, ms: number): void {
    super.report(name, passed, ms);   // keep console output too
    fetch(this.webhookURL, {          // add Slack notification
      method: 'POST',
      body: JSON.stringify({ text: \\\`[\\\${passed ? 'PASS' : 'FAIL'}] \\\${name}\\\` }),
    });
  }
}

// POLYMORPHISM — this function accepts ANY ITestReporter
async function runTests(reporter: ITestReporter): Promise<void> {
  reporter.report('Login Test',    true,  850);
  reporter.report('Checkout Test', false, 1200);
  reporter.report('Logout Test',   true,  320);
  console.log(reporter.summary());
}

// Same function call — different reporter behaviour
await runTests(new ConsoleReporter());              // console only
await runTests(new SlackReporter('https://...'));   // console + Slack
\`\`\`
        `
      },
      {
        id: 'ts-modules-imports',
        title: 'Modules, Imports & Exports',
        analogy: "Modules are like rooms in a building, each with its own door. Public files (named exports) are doors with name labels — visitors must use the exact name to enter. The default export is the building's main entrance — visitors can call it whatever they like once inside. Type-only imports are blueprint copies — they describe shape but bring no actual content with them.",
        lessonMarkdown: `
### 1. Named Exports — Multiple Things from One File

\`\`\`typescript
// src/test-helpers.ts

export const DEFAULT_TIMEOUT = 30000;
export const MAX_RETRIES = 3;

export function randomEmail(): string {
  return \\\`test-\\\${Date.now()}@example.com\\\`;
}

export class TestUser {
  constructor(public email: string, public role: string) {}
}

export interface TestConfig {
  baseURL: string;
  timeout: number;
}
\`\`\`

\`\`\`typescript
// src/login.test.ts

// Named imports — must use the exact exported name
import { DEFAULT_TIMEOUT, randomEmail, TestUser } from './test-helpers';

const user = new TestUser(randomEmail(), 'admin');
console.log(\\\`Timeout: \\\${DEFAULT_TIMEOUT}\\\`);
\`\`\`

### 2. Default Exports — One Main Thing per File

\`\`\`typescript
// src/login-page.ts

export default class LoginPage {
  async navigate() { /* ... */ }
  async login(email: string, password: string) { /* ... */ }
}
\`\`\`

\`\`\`typescript
// src/login.test.ts

// Default import — you can name it anything
import LoginPage from './login-page';
import LoginPg   from './login-page';   // ✅ Same thing, different local name

const page = new LoginPage();
\`\`\`

### 3. Mixing Default and Named Exports

\`\`\`typescript
// src/api-client.ts

export default class APIClient {
  // Main export
}

export const DEFAULT_TIMEOUT = 5000;
export const MAX_RETRIES = 3;

export interface RequestConfig {
  timeout?: number;
  retries?: number;
}
\`\`\`

\`\`\`typescript
// Importing both kinds in one statement
import APIClient, { DEFAULT_TIMEOUT, RequestConfig } from './api-client';
\`\`\`

### 4. Renaming on Import — \`as\`

\`\`\`typescript
import { TestUser as User, DEFAULT_TIMEOUT as TIMEOUT } from './test-helpers';

const u = new User("qa@test.com", "admin");
console.log(TIMEOUT);
\`\`\`

### 5. Type-Only Imports (TS 3.8+)

*💡 Analogy: A regular import is like ordering a real product. A type-only import is like ordering just the product's spec sheet — you get the description but no physical item, and the bundle stays smaller because the import is erased entirely after compilation.*

\`\`\`typescript
// Importing types — these are stripped at compile time, zero runtime cost
import type { User, TestConfig } from './types';

// Importing both values and types in one statement
import { runTest, type TestRunner } from './test-runner';

function login(user: User): void {
  // 'user' parameter type comes from import — but no runtime import is generated
}
\`\`\`

**Why type-only imports matter for QA:**
- Smaller bundles — types are erased, not bundled
- Avoids circular dependency issues — types-only references don't create runtime cycles
- Clearer intent — readers see immediately that an import is type-only

### 6. Re-Exports — Building a Public API

\`\`\`typescript
// src/pages/index.ts — barrel file

export { default as LoginPage }     from './login-page';
export { default as DashboardPage } from './dashboard-page';
export { default as CheckoutPage }  from './checkout-page';

// Re-export types from another file
export type { TestConfig, TestUser } from '../types';

// Re-export everything from another file
export * from './page-helpers';
\`\`\`

\`\`\`typescript
// Now a single import gets everything
import { LoginPage, DashboardPage, TestConfig } from './pages';
\`\`\`

### 7. Module Organisation for QA Projects

\`\`\`
src/
├── pages/
│   ├── login-page.ts        — export default LoginPage
│   ├── dashboard-page.ts    — export default DashboardPage
│   └── index.ts             — barrel: re-exports all pages
├── fixtures/
│   ├── users.ts             — export const TEST_USERS
│   └── test-data.ts         — export functions for generating data
├── helpers/
│   ├── api-client.ts        — export default APIClient
│   └── retry.ts             — export named utility functions
├── types/
│   └── index.ts             — export type/interface declarations only
└── tests/
    └── login.spec.ts        — imports from above
\`\`\`

### 8. Common Mistakes

**Mistake 1: Mixing default-export style with named-export style inconsistently**
\`\`\`typescript
// ❌ Confusing — sometimes default, sometimes named, no convention
export default class LoginPage {}     // file 1
export class DashboardPage {}         // file 2

// ✅ Pick one style and apply it across the project
\`\`\`

**Mistake 2: Forgetting \`type\` when importing only types in environments that strip imports**
\`\`\`typescript
// Without 'type' — bundlers might generate runtime imports for types
import { User } from './types';

// ✅ Type-only import — guarantees zero runtime cost
import type { User } from './types';
\`\`\`
        `
      },
      {
        id: 'ts-decorators',
        title: 'Decorators',
        analogy: "Decorators are like stickers you slap on classes and methods to attach extra behaviour without modifying the original code. Add an \\\`@retry\\\` sticker to a test method, and it automatically retries on failure. Add an \\\`@logged\\\` sticker, and it auto-logs every call. The class itself stays simple; the stickers handle the cross-cutting concerns.",
        lessonMarkdown: `
### 1. What Are Decorators?

*💡 Analogy: A decorator is a function that "wraps" a class, method, or property to add behaviour. Imagine wrapping a present — the present (your class) is unchanged, but the wrapping paper (the decorator) adds a layer of presentation, logging, validation, or metadata.*

Decorators are heavily used by frameworks: **NestJS**, **Angular**, **TypeORM**, **Inversify**. Understanding them lets you read and write modern TypeScript code in real projects.

**Important note:** As of TypeScript 5+, "Stage 3 decorators" are the standard. Older "experimental" decorators (\`experimentalDecorators: true\` in tsconfig) are still common in NestJS/Angular projects but the syntax is similar.

### 2. Class Decorators

\`\`\`typescript
// A simple class decorator — adds a property to the class
function Logged<T extends new (...args: any[]) => any>(constructor: T) {
  return class extends constructor {
    isLogged = true;
    constructor(...args: any[]) {
      super(...args);
      console.log(\\\`Created instance of \\\${constructor.name}\\\`);
    }
  };
}

@Logged
class TestRunner {
  constructor(public name: string) {}
}

const runner = new TestRunner("Login Tests");
// Logs: "Created instance of TestRunner"
\`\`\`

### 3. Method Decorators — The Most Common QA Use Case

\`\`\`typescript
// Auto-retry decorator — perfect for flaky test steps
function Retry(maxAttempts: number) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let lastError: unknown;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await original.apply(this, args);
        } catch (err) {
          lastError = err;
          console.log(\\\`Attempt \\\${attempt} of \\\${propertyKey} failed. Retrying...\\\`);
        }
      }
      throw lastError;
    };
  };
}

class CheckoutTests {
  @Retry(3)
  async addToCart(): Promise<void> {
    // If this throws, it'll automatically retry up to 3 times
    await page.click('[data-testid="add-to-cart"]');
  }

  @Retry(5)
  async submitPayment(): Promise<void> {
    await page.click('[data-testid="submit-payment"]');
  }
}
\`\`\`

### 4. Method Decorators — Logging Example

\`\`\`typescript
// Log every method invocation with arguments and result
function Logged(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(\\\`▶ \\\${propertyKey}(\\\${JSON.stringify(args)})\\\`);
    const result = await original.apply(this, args);
    console.log(\\\`◀ \\\${propertyKey} returned\\\`, result);
    return result;
  };
}

class APIClient {
  @Logged
  async login(email: string, password: string): Promise<{ token: string }> {
    // Your real implementation
    return { token: "abc123" };
  }
}

const client = new APIClient();
await client.login("qa@test.com", "secret");
// ▶ login(["qa@test.com","secret"])
// ◀ login returned { token: "abc123" }
\`\`\`

### 5. Real-World Examples — Framework Decorators

These are decorators you'll see in real codebases:

\`\`\`typescript
// NestJS controller (server-side TypeScript framework)
@Controller('users')
class UserController {
  @Get(':id')
  async getUser(@Param('id') id: string) { /* ... */ }

  @Post()
  async createUser(@Body() dto: CreateUserDto) { /* ... */ }
}

// TypeORM entity (database ORM)
@Entity()
class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) email!: string;
  @Column() name!: string;
}

// Angular service
@Injectable({ providedIn: 'root' })
class TestDataService {
  constructor(private http: HttpClient) {}
}
\`\`\`

### 6. Property Decorators

\`\`\`typescript
// Mark a property for validation
function MinLength(min: number) {
  return function (target: any, propertyKey: string) {
    let value: string;
    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (newValue: string) => {
        if (newValue.length < min) {
          throw new Error(\\\`\\\${propertyKey} must be at least \\\${min} chars\\\`);
        }
        value = newValue;
      },
    });
  };
}

class TestUser {
  @MinLength(8)
  password!: string;
}

const u = new TestUser();
u.password = "abc";          // ❌ Throws: must be at least 8 chars
u.password = "SecurePass1!"; // ✅ Fine
\`\`\`

### 7. Enabling Decorators in Your Project

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,        // For older-style decorators (NestJS, Angular)
    "emitDecoratorMetadata": true          // Allows runtime type info via reflect-metadata
  }
}
\`\`\`

For TS 5+ stage 3 decorators (modern), no special flag is needed.

### 8. When NOT to Use Decorators

- **Simple cases** — if a regular function call is clearer, use that
- **One-off behaviour** — decorators shine for repeated, declarative patterns
- **Performance-critical paths** — decorators add a function-call layer per invocation
        `
      },
      {
        id: 'ts-advanced-conditional-types',
        title: 'Advanced Conditional Types',
        analogy: "A conditional type is like a smart customs officer at an airport. A junior officer asks 'Is this a liquid?' and stamps YES or NO. An expert officer (advanced conditional types) can ask: 'If this is a container, what's inside it?', then open it and inspect the contents (infer), apply the same logic to every item in a group (distributive), and recursively inspect nested containers. The expert officer handles cases the junior officer can't even conceive of.",
        lessonMarkdown: `
### 1. Quick Recap — Why Conditional Types Exist

*💡 Analogy: A conditional type is a compile-time if/else. Instead of choosing a value at runtime, TypeScript chooses a TYPE based on what another type looks like. "If T is an array, give me the element type; otherwise give me T unchanged."*

Conditional types let you write types that **depend on other types** — the type system makes decisions at compile time rather than you hardcoding every variant.

\`\`\`typescript
// Basic form: T extends U ? X : Y
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;   // 'yes'
type B = IsString<number>;   // 'no'
type C = IsString<'hello'>;  // 'yes' — literal string extends string
\`\`\`

The power comes from combining this with **unions**, **infer**, and **recursion**.

---

### 2. Distributive Conditional Types — The Most Important Concept

*💡 Analogy: You're a teacher grading exams. You could grade each student individually (one by one), or you could say "anyone who passed gets an A, anyone who failed gets a B" and apply that rule to the whole class at once. Distributive conditional types apply a rule to every member of a union automatically.*

When \`T\` is a **naked type parameter** (not wrapped), a conditional type **distributes over unions** — it runs separately for each member:

\`\`\`typescript
type IsString<T> = T extends string ? 'yes' : 'no';

// T is naked — distributes over the union:
type Result = IsString<string | number | boolean>;
// Same as: IsString<string> | IsString<number> | IsString<boolean>
// Same as: 'yes'            | 'no'             | 'no'
// Result: 'yes' | 'no'
\`\`\`

**A practical use — extracting only the string members of a union:**
\`\`\`typescript
type StringsOnly<T> = T extends string ? T : never;

type Mixed = string | number | boolean | null;
type OnlyStrings = StringsOnly<Mixed>;
// Distributes: string | never | never | never
// never is filtered out automatically
// Result: string ✅
\`\`\`

**More powerful — extracting specific shapes from a union:**
\`\`\`typescript
// Extract types that are objects (not primitives)
type ObjectsOnly<T> = T extends object ? T : never;

type ApiResponse = string | number | { data: unknown } | null;
type JustObjects = ObjectsOnly<ApiResponse>;
// Result: { data: unknown } ✅
\`\`\`

---

### 3. Preventing Distribution — Wrap With Square Brackets

*💡 Analogy: Normally the rule applies to each student individually. Wrapping in brackets is like putting all the students in a bus — now the rule applies to the WHOLE BUS, not each person. "Is this bus full of students?" treats them as a collective.*

Sometimes you DON'T want distribution — you want to treat the union as a single unit:

\`\`\`typescript
// ❌ Distributed — runs on each union member
type IsNever_Distributed<T> = T extends never ? true : false;
type A = IsNever_Distributed<never>;  // never (distributes over empty union)

// ✅ Non-distributed — wrap T and never in []
type IsNever<T> = [T] extends [never] ? true : false;
type B = IsNever<never>;  // true ✅
type C = IsNever<string>; // false ✅
\`\`\`

**When does this matter in practice?**
\`\`\`typescript
// Checking if a type is exactly 'any'
type IsAny<T> = 0 extends (1 & T) ? true : false;

// Checking if two types are equal (not just compatible)
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

type E1 = Equal<string, string>;        // true
type E2 = Equal<string, string | number>; // false ✅ (without [], E2 would be true for string case)
\`\`\`

---

### 4. The \`infer\` Keyword — Extracting Types From Inside Other Types

*💡 Analogy: A detective examining a crime scene doesn't just say "there was a person here." They infer specifics: "A left-handed person who is 6 feet tall was here, based on the evidence." \`infer\` is TypeScript's detective — it extracts a type from inside a larger type based on its structure.*

\`infer\` appears INSIDE a conditional type's extends clause and lets you **name and capture a type** you don't know in advance:

\`\`\`typescript
// Extract the return type of any function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = ReturnType<() => string>;           // string
type B = ReturnType<(x: number) => boolean>; // boolean
type C = ReturnType<string>;                 // never (not a function)

// This is exactly how TypeScript's built-in ReturnType<T> works!
\`\`\`

**Extracting from different positions:**
\`\`\`typescript
// Extract parameter types
type Params<T> = T extends (...args: infer P) => any ? P : never;
type P = Params<(a: string, b: number) => void>; // [string, number]

// Extract the first argument only
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;
type F = FirstParam<(id: string, options: object) => void>; // string

// Extract the element type from an array
type Unwrap<T> = T extends Array<infer E> ? E : T;
type U1 = Unwrap<string[]>;   // string
type U2 = Unwrap<number>;     // number (not an array — returns as-is)

// Extract the resolved type from a Promise
type Awaited_<T> = T extends Promise<infer R> ? R : T;
type AW = Awaited_<Promise<string>>;  // string
// TypeScript has built-in Awaited<T> that does this (and handles nested Promises)
\`\`\`

**QA example — typing API response helpers:**
\`\`\`typescript
// Automatically extract the data type from an API wrapper
type ApiData<T> = T extends { data: infer D } ? D : never;

type UserResponse = { data: { id: string; name: string }; status: number };
type User = ApiData<UserResponse>;
// User = { id: string; name: string } ✅
// Now you can type your test assertions without duplicating the shape

function assertUser(response: UserResponse): User {
  return response.data;  // TypeScript knows the exact type ✅
}
\`\`\`

---

### 5. Recursive Conditional Types — Types That Repeat Themselves

*💡 Analogy: Russian nesting dolls. You open the outer doll and look inside — if there's another doll, you open that too. You keep going until you reach the innermost one. Recursive conditional types do the same: they apply a transformation, and if the result still matches the condition, they apply it again.*

TypeScript supports types that reference themselves, enabling deep transformations:

\`\`\`typescript
// DeepReadonly — makes every nested property readonly
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type Config = {
  server: {
    host: string;
    port: number;
    ssl: { enabled: boolean; cert: string };
  };
  retries: number;
};

type FrozenConfig = DeepReadonly<Config>;
// FrozenConfig.server.ssl.enabled is readonly ✅
// FrozenConfig.server.ssl.cert    is readonly ✅

// ❌ Cannot reassign anything in a FrozenConfig at any depth
\`\`\`

**Flatten nested arrays:**
\`\`\`typescript
// Flatten<T[][]> → T
type Flatten<T> = T extends Array<infer E> ? Flatten<E> : T;

type F1 = Flatten<string[]>;            // string
type F2 = Flatten<string[][]>;          // string
type F3 = Flatten<string[][][]>;        // string
type F4 = Flatten<string>;              // string (not an array — returns as-is)
\`\`\`

**Deep required (remove all optional markers):**
\`\`\`typescript
type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }  // -? removes optional
  : T;

type PartialConfig = { timeout?: number; headers?: { auth?: string } };
type FullConfig = DeepRequired<PartialConfig>;
// FullConfig.headers.auth is required — no more optional ✅
\`\`\`

---

### 6. Using \`never\` to Filter — The Expert's Swiss Army Knife

*💡 Analogy: \`never\` is the recycling bin of the type system. When a conditional type evaluates to \`never\`, TypeScript silently removes it from unions — like items disappearing into the bin without a trace.*

\`never\` in a union is automatically removed. This makes it perfect for filtering:

\`\`\`typescript
// Remove null and undefined from all properties of an object type
type NonNullableProperties<T> = {
  [K in keyof T]: NonNullable<T[K]>
};

// Extract only function keys from a type
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

type MyClass = {
  name: string;
  run(): void;
  id: number;
  validate(): boolean;
};

type Methods = FunctionKeys<MyClass>;  // 'run' | 'validate' ✅
type NonMethods = Exclude<keyof MyClass, Methods>; // 'name' | 'id' ✅
\`\`\`

**QA example — extracting only async methods:**
\`\`\`typescript
type AsyncMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof T];

class PageObject {
  title = 'Login';
  async navigate(): Promise<void> {}
  async fillForm(data: object): Promise<void> {}
  getTitle(): string { return this.title; }
}

type CanAwait = AsyncMethods<PageObject>;
// 'navigate' | 'fillForm' ✅  (getTitle is excluded — returns string, not Promise)
\`\`\`

---

### 7. All Together — A Complete QA Type Utility

\`\`\`typescript
// Takes any function type and returns a version that adds logging
// Uses: infer (extract param types and return type), conditional (check it's a function)
type Logged<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;

// Extract only the 'test' methods (methods matching a naming pattern is not possible,
// but we CAN extract methods by return type or param signature)

// Deep NonNullable for test fixture types
type DeepNonNullable<T> = T extends null | undefined
  ? never
  : T extends object
    ? { [K in keyof T]: DeepNonNullable<T[K]> }
    : T;

type RawFixture = {
  user: { id: string | null; email: string | undefined };
  token: string | null;
};

type CleanFixture = DeepNonNullable<RawFixture>;
// CleanFixture.user.id    = string ✅  (null removed)
// CleanFixture.user.email = string ✅  (undefined removed)
// CleanFixture.token      = string ✅
\`\`\`
        `
      },

      {
        id: 'ts-advanced-mapped-types',
        title: 'Advanced Mapped Types',
        analogy: "A basic mapped type is a photocopier — it copies every key and transforms the value. An advanced mapped type is a professional editor: it can rename pages while copying, tear out chapters that don't belong, combine two documents into one, and even decide what to copy based on the content of each page. The advanced editor has full creative control over what the final document looks like.",
        lessonMarkdown: `
### 1. Quick Recap — Mapped Types Basics

*💡 Analogy: A mapped type iterates over the keys of a type and does something with each one — like a for-loop for types. The basic form copies every key and transforms the value.*

\`\`\`typescript
// Basic form: { [K in keyof T]: transformation }
type Readonly_<T> = { readonly [K in keyof T]: T[K] };
type Partial_<T> = { [K in keyof T]?: T[K] };
type Stringify<T> = { [K in keyof T]: string };

type User = { id: number; name: string; active: boolean };
type PartialUser = Partial_<User>;
// { id?: number; name?: string; active?: boolean }
\`\`\`

These built-in utilities are all mapped types under the hood. This module goes further.

---

### 2. Key Remapping With \`as\` — Rename Keys While Mapping

*💡 Analogy: You're translating a form from English to French. You don't just change the content of each field — you also rename the labels. \`as\` lets you transform key names at the same time as transforming values.*

The \`as\` clause lets you produce a new key name for each mapping:

\`\`\`typescript
// Rename every key to its getter equivalent
type Getters<T> = {
  [K in keyof T as \\\`get\\\${Capitalize<string & K>}\\\`]: () => T[K]
};

type User = { id: number; name: string; active: boolean };
type UserGetters = Getters<User>;
// {
//   getId:     () => number;
//   getName:   () => string;
//   getActive: () => boolean;
// }
\`\`\`

**Building event handler types automatically:**
\`\`\`typescript
type EventHandlers<T> = {
  [K in keyof T as \\\`on\\\${Capitalize<string & K>}Change\\\`]: (value: T[K]) => void
};

type FormFields = { username: string; password: string; rememberMe: boolean };
type FormEvents = EventHandlers<FormFields>;
// {
//   onUsernameChange:   (value: string) => void;
//   onPasswordChange:   (value: string) => void;
//   onRememberMeChange: (value: boolean) => void;
// }
\`\`\`

---

### 3. Filtering Keys With \`never\` — Remove Keys From a Mapped Type

*💡 Analogy: When copying a document you use a black marker on the pages you don't want. Producing \`never\` in the \`as\` clause acts as that marker — those keys disappear completely from the output type.*

Mapping a key to \`never\` in the \`as\` clause removes it:

\`\`\`typescript
// Keep only keys whose values are strings
type PickStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
};

type Mixed = { id: number; name: string; active: boolean; email: string };
type StringFields = PickStrings<Mixed>;
// { name: string; email: string } ✅

// Keep only optional keys
type OptionalKeys<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K]
};
\`\`\`

**The general PickByValue utility type:**
\`\`\`typescript
// Pick all keys whose value extends a given type
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
};

// The inverse — omit all keys matching a value type
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K]
};

type ApiConfig = {
  baseUrl: string;
  timeout: number;
  retries: number;
  debug: boolean;
  apiKey: string;
};

type NumericConfig  = PickByValue<ApiConfig, number>;  // { timeout: number; retries: number }
type StringConfig   = PickByValue<ApiConfig, string>;  // { baseUrl: string; apiKey: string }
type NonBoolConfig  = OmitByValue<ApiConfig, boolean>; // all except debug ✅
\`\`\`

---

### 4. Combining Mapped + Conditional — The Real Power Move

*💡 Analogy: A mapped type iterates over keys like a train stopping at each station. A conditional type at each stop decides what happens: "At this station, transform the cargo one way; at that station, transform it another way." Together they produce types that would take dozens of overloads to express manually.*

\`\`\`typescript
// Make every property required IF it's a string, optional if it's a number
type StringRequired<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : T[K] | undefined
};

// Deeply transform all function properties to return void instead
type VoidMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => any
    ? (...args: P) => void
    : T[K]
};

class ReportService {
  title = 'My Report';
  generate(): string { return 'report data'; }
  save(path: string): boolean { return true; }
}

type VoidReportService = VoidMethods<ReportService>;
// {
//   title: string;
//   generate: () => void;     (return type changed to void)
//   save: (path: string) => void; (return type changed to void)
// }
\`\`\`

**Building a Spy type for test mocking:**
\`\`\`typescript
// Replace every method with a spy that records calls
type SpyOf<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? {
        (...args: P): R;
        calls: P[];
        returnValue: R;
      }
    : T[K]
};
\`\`\`

---

### 5. Modifier Control — Adding and Removing readonly and ?

*💡 Analogy: Modifiers are like locks on a door. You can add a lock (+), remove a lock (-), or leave it as-is. TypeScript lets you control these locks on every key of a mapped type.*

\`\`\`typescript
// +? adds optional, -? removes optional (makes required)
// +readonly adds readonly, -readonly removes readonly

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]  // remove all readonly
};

type Required_<T> = {
  [K in keyof T]-?: T[K]  // remove all optional
};

type FullyLocked<T> = {
  +readonly [K in keyof T]+?: T[K]  // add readonly AND optional
};

// Frozen test fixture — all fields readonly and optional
type TestFixture<T> = { readonly [K in keyof T]?: T[K] };

type UserFixture = TestFixture<{ id: string; name: string; email: string }>;
// { readonly id?: string; readonly name?: string; readonly email?: string }
\`\`\`

---

### 6. Building DeepReadonly, DeepPartial, DeepMutable

\`\`\`typescript
// DeepReadonly — recursively makes all nested properties readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]                        // don't recurse into functions
      : DeepReadonly<T[K]>          // recurse into nested objects
    : T[K];
};

// DeepPartial — recursively makes all nested properties optional
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

// Usage in QA — partial test overrides
type TestOverrides<T> = DeepPartial<T>;

type AppConfig = {
  server: { host: string; port: number };
  auth: { secret: string; expiry: number };
};

function withOverrides(base: AppConfig, overrides: TestOverrides<AppConfig>): AppConfig {
  return { ...base, ...overrides,
    server: { ...base.server, ...overrides.server },
    auth:   { ...base.auth,   ...overrides.auth   },
  };
}

// In tests — only specify what differs from the base config
const testConfig = withOverrides(defaultConfig, { server: { port: 4000 } });
\`\`\`

---

### 7. Real-World QA Example — Auto-Typed Test Data Builder

\`\`\`typescript
// Generate a builder type from any model — every field becomes a setter method
type Builder<T> = {
  [K in keyof T as \\\`set\\\${Capitalize<string & K>}\\\`]: (value: T[K]) => Builder<T>
} & {
  build(): T;
};

// The TypeScript type system generates the entire builder API automatically!
type User = { id: string; name: string; email: string; role: 'admin' | 'user' };
type UserBuilder = Builder<User>;
// UserBuilder has:
//   setId(value: string): UserBuilder
//   setName(value: string): UserBuilder
//   setEmail(value: string): UserBuilder
//   setRole(value: 'admin' | 'user'): UserBuilder
//   build(): User

// Any new field added to User automatically appears in UserBuilder ✅
// No manual builder maintenance needed ✅
\`\`\`
        `
      },

      {
        id: 'ts-variadic-tuples',
        title: 'Variadic Tuple Types',
        analogy: "A fixed tuple is a crate with labelled compartments — slot 1 holds a spanner, slot 2 holds a hammer. A variadic tuple is a professional tool belt: you can attach any number of pouches, each typed to hold a specific tool, and the belt remembers the exact type in every pouch no matter how many you attach. You can spread one tool belt into another and the types stay precise throughout.",
        lessonMarkdown: `
### 1. What Are Tuple Types (Recap)?

*💡 Analogy: A tuple is an array where the position matters — slot 0 is always a string (name), slot 1 is always a number (age). TypeScript tracks the exact type at every index, unlike a plain array where all elements share one type.*

\`\`\`typescript
// Array: all elements share one type
const arr: string[] = ['a', 'b', 'c'];

// Tuple: each position has its own type
const user: [string, number, boolean] = ['Alice', 30, true];
const name: string  = user[0];  // ✅ TypeScript knows index 0 is string
const age:  number  = user[1];  // ✅ TypeScript knows index 1 is number

// Named tuples — even more readable
type HttpResult = [status: number, body: string, ok: boolean];
\`\`\`

---

### 2. Variadic Tuple Syntax — \`...T extends any[]\`

*💡 Analogy: A variadic tuple is a tuple with an expandable section. Think of a train: you have a fixed engine car at the front (first element), any number of passenger cars in the middle (the variadic part \`...T\`), and a fixed caboose at the end (last element). The types of all cars are tracked precisely.*

The \`...\` spread operator inside a tuple type captures a variable-length typed section:

\`\`\`typescript
// A function that prepends a label to any tuple
type Prepend<T extends unknown[], Label> = [Label, ...T];

type Labeled = Prepend<[number, boolean], string>;
// [string, number, boolean]

// A function that appends a timestamp to any tuple
type WithTimestamp<T extends unknown[]> = [...T, Date];

type Event = WithTimestamp<[string, number]>;
// [string, number, Date]
\`\`\`

**The key insight** — TypeScript tracks the full expanded type:
\`\`\`typescript
type First = Event[0];  // string
type Second = Event[1]; // number
type Third = Event[2];  // Date — TypeScript knows this precisely!
\`\`\`

---

### 3. Spreading Tuples in Function Parameters

*💡 Analogy: Previously, if you wanted a function that accepted "any number of typed arguments in a specific order", you needed to write separate overloads for each length. Variadic tuples let you write ONE generic function that handles all lengths, with full type safety.*

Before variadic tuples, multiple overloads were needed:
\`\`\`typescript
// ❌ Old way — overloads for each arity
function concat(a: string): string;
function concat(a: string, b: string): string;
function concat(a: string, b: string, c: string): string;
// ... this doesn't scale
\`\`\`

With variadic tuples, one signature handles everything:
\`\`\`typescript
// ✅ New way — one generic signature
function concat<T extends string[]>(...parts: T): string {
  return parts.join('');
}

// Works for any number of string arguments
concat('a');              // ✅
concat('a', 'b');         // ✅
concat('a', 'b', 'c');    // ✅
concat('a', 1);           // ❌ TypeScript error — 1 is not a string
\`\`\`

**Forwarding arguments with full type preservation:**
\`\`\`typescript
// Wrap a function — preserve its exact parameter and return types
function logged<A extends unknown[], R>(
  fn: (...args: A) => R,
  label: string
): (...args: A) => R {
  return (...args: A): R => {
    console.log(\\\`[\\\${label}] called\\\`);
    const result = fn(...args);
    console.log(\\\`[\\\${label}] returned\\\`, result);
    return result;
  };
}

function add(a: number, b: number): number { return a + b; }
const loggedAdd = logged(add, 'add');
loggedAdd(1, 2);       // ✅ TypeScript knows (number, number) => number
loggedAdd('a', 'b');   // ❌ TypeScript error — wrong argument types
\`\`\`

---

### 4. Tuple Manipulation Types — Head, Tail, Last

*💡 Analogy: These are your tuple toolkit. Head grabs the first item off the production line. Tail removes the first item and gives you everything else. Last grabs the final item. Together they let you decompose and reconstruct typed tuples.*

\`\`\`typescript
// Extract the first element type
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;

// Extract everything except the first element
type Tail<T extends unknown[]> = T extends [unknown, ...infer T_] ? T_ : never;

// Extract the last element type
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

// Extract everything except the last element
type Init<T extends unknown[]> = T extends [...infer I, unknown] ? I : never;

// Testing them:
type T = [string, number, boolean, Date];

type H = Head<T>;  // string
type Ta = Tail<T>; // [number, boolean, Date]
type L = Last<T>;  // Date
type I = Init<T>;  // [string, number, boolean]
\`\`\`

**Concatenating two tuples at the type level:**
\`\`\`typescript
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];

type C = Concat<[string, number], [boolean, Date]>;
// [string, number, boolean, Date] ✅
\`\`\`

---

### 5. Type-Safe Pipe Function — The Classic Variadic Use Case

*💡 Analogy: A pipe function takes a value and passes it through a series of transformations, like water flowing through pipes. Each pipe section changes the water somehow. With variadic tuples, TypeScript tracks the exact type of the water at every pipe junction.*

\`\`\`typescript
// Two-function pipe with full type inference
function pipe<A, B, C>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C
): C {
  return fn2(fn1(value));
}

const result = pipe(
  '42',
  (s) => parseInt(s),    // string -> number
  (n) => n * 2           // number -> number
);
// TypeScript infers: result is number ✅

// ❌ TypeScript catches mismatched pipe connections:
pipe(
  '42',
  (s) => parseInt(s),
  (s) => s.toUpperCase() // ❌ Error: number doesn't have toUpperCase (string method)
);
\`\`\`

---

### 6. Real-World QA Example — Typed Test Step Pipeline

\`\`\`typescript
// A typed test step runner that chains steps with type safety
type Step<Input, Output> = {
  name: string;
  run: (input: Input) => Promise<Output>;
};

// Two-step typed pipeline
async function runSteps<A, B, C>(
  input: A,
  step1: Step<A, B>,
  step2: Step<B, C>
): Promise<C> {
  console.log(\\\`Running: \\\${step1.name}\\\`);
  const mid = await step1.run(input);
  console.log(\\\`Running: \\\${step2.name}\\\`);
  return step2.run(mid);
}

// Usage — TypeScript validates each step's output matches the next step's input
const loginStep: Step<{ email: string; password: string }, { token: string }> = {
  name: 'Login',
  run: async (creds) => ({ token: 'abc123' }),
};

const fetchProfileStep: Step<{ token: string }, { name: string; role: string }> = {
  name: 'Fetch Profile',
  run: async ({ token }) => ({ name: 'Alice', role: 'admin' }),
};

const profile = await runSteps(
  { email: 'alice@test.com', password: 'pass' },
  loginStep,
  fetchProfileStep
);
// profile: { name: string; role: string } — TypeScript knows the exact type ✅

// ❌ Swapping steps causes a compile error — types don't align:
// runSteps({ email: '...', password: '...' }, fetchProfileStep, loginStep);
\`\`\`

---

### 7. Zip — Pairing Two Tuples Element-by-Element

\`\`\`typescript
// Zip two tuples together: [A, B, C] + [D, E, F] => [[A,D], [B,E], [C,F]]
type Zip<T extends unknown[], U extends unknown[]> =
  T extends [infer TH, ...infer TT]
    ? U extends [infer UH, ...infer UT]
      ? [[TH, UH], ...Zip<TT, UT>]
      : []
    : [];

type Fields  = ['id', 'name', 'email'];
type Types   = [number, string, string];
type Schema  = Zip<Fields, Types>;
// [['id', number], ['name', string], ['email', string]]

// Useful for building typed column-to-type mappings in database test helpers
\`\`\`
        `
      },

      {
        id: 'ts-branded-nominal-types',
        title: 'Branded & Nominal Types',
        analogy: "TypeScript's structural typing is like a costume party where anyone wearing the right outfit gets in — a string is a string, regardless of whether it's a UserId or an OrderId. Branded types are like VIP backstage passes with holograms: the string still looks like a string, but it carries an invisible stamp that only a real UserId has, and the type system checks that hologram at every door.",
        lessonMarkdown: `
### 1. The Problem — Structural Typing's Footgun

*💡 Analogy: Two identical-looking vials in a lab — one is saline, one is acid. Both are clear liquids. Without a label system, you can swap them accidentally with no warning. In TypeScript, a \`UserId\` and an \`OrderId\` are both strings. Nothing stops you from passing one where the other is expected.*

TypeScript uses **structural typing**: a type is compatible if it has the right shape, regardless of what you named it.

\`\`\`typescript
type UserId  = string;
type OrderId = string;

function cancelOrder(orderId: OrderId): void { /* ... */ }

const userId: UserId = 'user-abc-123';
cancelOrder(userId);  // ✅ TypeScript is FINE with this — both are just string
// 🔥 Runtime bug: cancelled the wrong thing!
\`\`\`

This is a silent, hard-to-catch bug. TypeScript's structural system sees two identical string types and allows the substitution. Branded types add a **distinguishing mark** that prevents this.

---

### 2. The Branding Technique — Adding an Invisible Mark

*💡 Analogy: You brand cattle by burning a small mark into the hide. The cattle still look like cattle, but each ranch's cattle have a unique brand that can't be faked. Branding a TypeScript primitive adds a unique "mark" to the type that the compiler checks — the runtime value is still just a string.*

\`\`\`typescript
// The brand is a phantom property — it exists only at the type level
type UserId  = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function cancelOrder(orderId: OrderId): void { /* ... */ }

const userId  = 'user-abc-123' as UserId;
const orderId = 'order-xyz-456' as OrderId;

cancelOrder(orderId);  // ✅ Correct type — works
cancelOrder(userId);   // ❌ TypeScript error: 'UserId' is not assignable to 'OrderId'
cancelOrder('plain-string'); // ❌ TypeScript error: plain string is not branded
\`\`\`

The \`__brand\` property never exists at runtime — it's a phantom type trick. The actual value is still a plain string. You're paying zero runtime cost for compile-time safety.

---

### 3. Smart Constructors — The Professional Pattern

*💡 Analogy: A casino doesn't accept raw cash at the tables — you exchange it for chips at the cage. The cage validates your cash and hands you chips that are only valid inside the casino. Smart constructors are the cage: you pass in a raw value, they validate it, and return a branded type that's accepted everywhere the brand is expected.*

Casting with \`as\` bypasses validation. Smart constructors validate BEFORE branding:

\`\`\`typescript
// Define the brand type
type EmailAddress = string & { readonly __brand: 'EmailAddress' };
type PositiveInt  = number & { readonly __brand: 'PositiveInt' };

// Smart constructors — validate THEN brand
function toEmail(raw: string): EmailAddress {
  if (!raw.includes('@') || !raw.includes('.')) {
    throw new Error(\\\`Invalid email: \\\${raw}\\\`);
  }
  return raw as EmailAddress;
}

function toPositiveInt(raw: number): PositiveInt {
  if (!Number.isInteger(raw) || raw <= 0) {
    throw new Error(\\\`Expected positive integer, got \\\${raw}\\\`);
  }
  return raw as PositiveInt;
}

// Now usage is safe AND validated
const email    = toEmail('alice@example.com');  // EmailAddress ✅
const badEmail = toEmail('not-an-email');        // ❌ throws at runtime
const timeout  = toPositiveInt(5000);            // PositiveInt ✅
const badTime  = toPositiveInt(-1);              // ❌ throws at runtime

function sendEmail(to: EmailAddress, subject: string): void { /* ... */ }
sendEmail(email, 'Hello');          // ✅
sendEmail('raw@string.com', 'Hi');  // ❌ TypeScript error — not branded
\`\`\`

---

### 4. A Complete Branding Library for QA

\`\`\`typescript
// A reusable brand utility
type Brand<T, B extends string> = T & { readonly __brand: B };

// QA-specific branded types
type TestUserId  = Brand<string, 'TestUserId'>;
type TestOrderId = Brand<string, 'TestOrderId'>;
type TestRunId   = Brand<string, 'TestRunId'>;
type Milliseconds = Brand<number, 'Milliseconds'>;
type Percentage  = Brand<number, 'Percentage'>;

// Smart constructors
const TestUserId  = (id: string)   => id  as TestUserId;
const TestOrderId = (id: string)   => id  as TestOrderId;
const TestRunId   = (id: string)   => id  as TestRunId;
const Milliseconds = (ms: number)  => {
  if (ms < 0) throw new Error('Milliseconds cannot be negative');
  return ms as Milliseconds;
};
const Percentage = (pct: number)  => {
  if (pct < 0 || pct > 100) throw new Error(\\\`Invalid percentage: \\\${pct}\\\`);
  return pct as Percentage;
};

// Test helper functions are now type-safe
function createTestOrder(userId: TestUserId, orderId: TestOrderId): void {
  console.log(\\\`Creating order \\\${orderId} for user \\\${userId}\\\`);
}

const uid = TestUserId('user-123');
const oid = TestOrderId('order-456');

createTestOrder(uid, oid);   // ✅
createTestOrder(oid, uid);   // ❌ TypeScript error: arguments in wrong positions!

// Test timing helpers
function waitFor(timeout: Milliseconds): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

await waitFor(Milliseconds(5000));  // ✅
await waitFor(5000);                // ❌ TypeScript error — plain number not accepted
\`\`\`

---

### 5. Branded Types in Fixtures — Preventing Fixture Mistakes

*💡 Analogy: In a manufacturing plant, parts for different machines are kept in differently shaped bins. Even if the parts look the same, you can't accidentally put a car door part into the airplane parts bin — the shapes don't fit. Branded types create differently-shaped bins for your test data.*

\`\`\`typescript
type TestUser = {
  id: TestUserId;
  email: EmailAddress;
  sessionToken: Brand<string, 'SessionToken'>;
};

function createUserFixture(overrides?: Partial<TestUser>): TestUser {
  return {
    id:           TestUserId('user-default-001'),
    email:        toEmail('fixture@test.com'),
    sessionToken: 'token-abc' as Brand<string, 'SessionToken'>,
    ...overrides,
  };
}

// API that only accepts a real TestUser
function loginAs(user: TestUser): void { /* set auth state */ }

const fixture = createUserFixture({ id: TestUserId('user-admin-001') });
loginAs(fixture);  // ✅

// ❌ Can't pass a raw object — it's not branded correctly:
loginAs({ id: 'user-admin-001', email: 'a@b.com', sessionToken: 'tok' });
// Error: Type 'string' is not assignable to type 'TestUserId'
\`\`\`

---

### 6. Opaque Types — The Alternative Approach

\`\`\`typescript
// Alternative: declare brand as a unique symbol for maximum uniqueness
declare const __brand: unique symbol;
type Brand2<T, B> = T & { readonly [__brand]: B };

// This is slightly more strict — two Brand2<string, X> with different X values
// are NEVER compatible even if X happens to be the same string by coincidence
type SafeUserId  = Brand2<string, { readonly userId:  true }>;
type SafeOrderId = Brand2<string, { readonly orderId: true }>;

// Most real-world projects use the string-brand approach:
// type Brand<T, B extends string> = T & { readonly __brand: B }
// because it's simpler and readable — the brand name appears in error messages
\`\`\`

---

### 7. When NOT to Use Branded Types

Branded types add overhead (smart constructors, type assertions at boundaries). Use them when:
- ✅ The same primitive type is used for multiple distinct concepts (UserId vs OrderId)
- ✅ Incorrect substitution has real consequences (security, data corruption)
- ✅ The codebase is large enough that mistakes are plausible

Skip them when:
- ❌ A type is only used in one place — the name alone is enough context
- ❌ You'd brand literally every string — that's over-engineering
- ❌ The codebase is small and the team is disciplined about naming
        `
      },

      {
        id: 'ts-error-handling-patterns',
        title: 'Type-Safe Error Handling',
        analogy: "Traditional error handling with try/catch is like sending packages with no return address — if something goes wrong, the package disappears into the void and you get a vague 'delivery failed' note. The Result pattern is like tracked shipping with two explicit states: Delivered (contains the package) or Failed (contains the exact reason, address, and timestamp). The type system ensures you always check the delivery status before opening the box.",
        lessonMarkdown: `
### 1. The Problem With try/catch

*💡 Analogy: \`throw\` is like yelling "fire!" in a building. Everyone hears it, but nobody knows what kind of fire, where it is, or how serious. The type of the error is lost — TypeScript can't help you handle different fire types differently.*

\`\`\`typescript
async function getUser(id: string): Promise<User> {
  const response = await fetch(\\\`/api/users/\\\${id}\\\`);
  if (!response.ok) throw new Error('Failed');  // type: Error — very vague
  return response.json();
}

// The caller gets NO type information about what can go wrong
try {
  const user = await getUser('123');
} catch (error) {
  // TypeScript 4.0+: error is 'unknown' — you can't access properties safely
  console.log(error.message);     // ❌ TypeScript error: 'unknown' has no .message
  if (error instanceof Error) {
    console.log(error.message);   // ✅ but you had to narrow it yourself
  }
  // What if it's a NetworkError? An AuthError? A ValidationError? No type hints.
}
\`\`\`

The problems:
- **Errors are \`unknown\`** — you must narrow every time
- **No declaration** — callers don't know what can throw
- **No exhaustive checking** — the compiler can't tell you if you missed a case

---

### 2. The Result Type — Two Explicit States

*💡 Analogy: A vending machine has two explicit outcomes: "Here's your item" (success with the product) or "Transaction failed: insufficient funds / item out of stock" (failure with the specific reason). You ALWAYS know which state you're in, and you ALWAYS know exactly what went wrong.*

\`\`\`typescript
// The Result type — two discriminated union members
type Ok<T>  = { readonly ok: true;  readonly data:  T };
type Err<E> = { readonly ok: false; readonly error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

// Helper constructors
const ok  = <T>(data: T):  Ok<T>  => ({ ok: true,  data  });
const err = <E>(error: E): Err<E> => ({ ok: false, error });

// Now functions declare EXACTLY what can go wrong
async function getUser(id: string): Promise<Result<User, 'NOT_FOUND' | 'NETWORK_ERROR'>> {
  try {
    const response = await fetch(\\\`/api/users/\\\${id}\\\`);
    if (response.status === 404) return err('NOT_FOUND');
    if (!response.ok)            return err('NETWORK_ERROR');
    const user = await response.json() as User;
    return ok(user);
  } catch {
    return err('NETWORK_ERROR');
  }
}

// The caller MUST handle both cases — TypeScript enforces this
const result = await getUser('123');
if (result.ok) {
  console.log(result.data.name);   // ✅ TypeScript knows data is User
} else {
  console.log(result.error);       // ✅ TypeScript knows error is 'NOT_FOUND' | 'NETWORK_ERROR'
}
\`\`\`

---

### 3. Exhaustive Checking With \`never\` — The Compiler Tells You What You Missed

*💡 Analogy: A quality control checklist that lists every possible defect. If you miss checking one defect type, the checklist blocks you from signing off. TypeScript's \`never\` check is that mandatory sign-off: if you haven't handled every error case, the compiler refuses to compile.*

\`\`\`typescript
// A typed error hierarchy for test failures
type TestError =
  | { kind: 'TIMEOUT';    durationMs: number }
  | { kind: 'ASSERTION';  expected: unknown; actual: unknown }
  | { kind: 'NOT_FOUND';  selector: string }
  | { kind: 'NETWORK';    statusCode: number };

function describeError(error: TestError): string {
  switch (error.kind) {
    case 'TIMEOUT':
      return \\\`Timed out after \\\${error.durationMs}ms\\\`;
    case 'ASSERTION':
      return \\\`Expected \\\${error.expected}, got \\\${error.actual}\\\`;
    case 'NOT_FOUND':
      return \\\`Element not found: \\\${error.selector}\\\`;
    case 'NETWORK':
      return \\\`Network error: status \\\${error.statusCode}\\\`;
    default:
      // The never check — this line is UNREACHABLE if all cases are handled
      const _exhaustive: never = error;
      // If you add a new TestError variant and forget to handle it,
      // TypeScript shows an error HERE — the compiler caught your omission ✅
      return _exhaustive;
  }
}
\`\`\`

**Adding a new error variant — TypeScript immediately flags the gap:**
\`\`\`typescript
type TestError =
  | { kind: 'TIMEOUT';    durationMs: number }
  | { kind: 'ASSERTION';  expected: unknown; actual: unknown }
  | { kind: 'NOT_FOUND';  selector: string }
  | { kind: 'NETWORK';    statusCode: number }
  | { kind: 'AUTH';       reason: string };  // NEW — added to the union

// ❌ TypeScript now errors on the 'default: never' line in describeError
// because 'AUTH' is not handled — the compiler tells you EXACTLY what to fix
\`\`\`

---

### 4. Chaining Results — Railway-Oriented Programming

*💡 Analogy: Railway-Oriented Programming puts your logic on two tracks. The happy track carries successful values from step to step. As soon as any step fails, the data is switched to the failure track — subsequent steps are skipped automatically. You only get back on the happy track at the very end if everything succeeded.*

\`\`\`typescript
// A map helper — transform the success value, pass errors through
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  return result.ok ? ok(fn(result.data)) : result;
}

// A flatMap helper — chain Result-returning functions
function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.data) : result;
}

// A complete QA login flow using chained Results
type LoginError = 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'NETWORK_ERROR';

async function login(email: string, password: string): Promise<Result<string, LoginError>> {
  // Returns Result<{ token: string }, LoginError>
  const authResult = await authenticate(email, password);
  if (!authResult.ok) return authResult;

  // Returns Result<string, LoginError> (validates and extracts token)
  return mapResult(authResult, (auth) => auth.token);
}

const loginResult = await login('alice@test.com', 'pass');
if (loginResult.ok) {
  // ✅ token is string — TypeScript knows
  await setSessionToken(loginResult.data);
} else {
  // ✅ error is 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'NETWORK_ERROR'
  switch (loginResult.error) {
    case 'INVALID_CREDENTIALS': showError('Wrong email or password'); break;
    case 'ACCOUNT_LOCKED':      showError('Account locked'); break;
    case 'NETWORK_ERROR':       retry(); break;
  }
}
\`\`\`

---

### 5. The Option Type — Typed Nullable Values

*💡 Analogy: A parcel tracking system that has two explicit states: "Item found at location X" (Some) or "Item not in system" (None). Unlike returning \`null\` (which callers can forget to check), the Option type forces you to handle both states before the compiler lets you proceed.*

\`\`\`typescript
type Some<T> = { readonly isSome: true;  readonly value: T };
type None    = { readonly isSome: false };
type Option<T> = Some<T> | None;

const some = <T>(value: T): Some<T> => ({ isSome: true, value });
const none: None = { isSome: false };

function findUser(id: string): Option<User> {
  const user = users.find(u => u.id === id);
  return user ? some(user) : none;
}

const result = findUser('123');
if (result.isSome) {
  console.log(result.value.name);  // ✅ TypeScript knows value is User
} else {
  console.log('User not found');   // handled explicitly
}

// ❌ Can't access .value without checking isSome first — compiler enforces it
console.log(findUser('999').value);  // Error: 'None' has no 'value'
\`\`\`

---

### 6. Complete QA Example — Type-Safe Test Runner Results

\`\`\`typescript
type TestResult<T = void> = Result<T, TestError>;

type TestCase = {
  name: string;
  run: () => Promise<TestResult>;
};

async function runTestSuite(tests: TestCase[]): Promise<void> {
  let passed = 0, failed = 0;

  for (const test of tests) {
    const result = await test.run();

    if (result.ok) {
      console.log(\\\`✅ \\\${test.name}\\\`);
      passed++;
    } else {
      console.log(\\\`❌ \\\${test.name}: \\\${describeError(result.error)}\\\`);
      failed++;
    }
  }

  console.log(\\\`\\\${passed} passed, \\\${failed} failed\\\`);
}

// Test authors return typed results — no throw, no try/catch
const loginTest: TestCase = {
  name: 'Login redirects to dashboard',
  run: async () => {
    const loginResult = await login('alice@test.com', 'pass');
    if (!loginResult.ok) return loginResult;  // pass error through

    const current = await page.url();
    if (!current.includes('/dashboard')) {
      return err({ kind: 'ASSERTION', expected: '/dashboard', actual: current });
    }
    return ok();
  },
};
\`\`\`
        `
      },

      {
        id: 'ts-type-safe-builders',
        title: 'Type-Safe Builder & Factory Patterns',
        analogy: "A regular builder is like filling out a paper form — you can hand in the form with required fields blank and only find out at the processing desk that it's incomplete. A type-safe builder is a digital form that greys out the Submit button until every required field is filled. The compiler acts as the form validation, refusing to compile if required fields are missing — before you even run the code.",
        lessonMarkdown: `
### 1. The Basic Builder Pattern

*💡 Analogy: A burger builder at a restaurant — you specify patty, bun, and toppings one by one. A basic builder lets you chain method calls and returns the final object. But it has a flaw: you can call \`.build()\` before adding the required patty.*

\`\`\`typescript
// ❌ Basic builder — no compile-time safety
class UserBuilder {
  private data: Partial<User> = {};

  setId(id: string):     this { this.data.id    = id;    return this; }
  setName(name: string): this { this.data.name  = name;  return this; }
  setEmail(email: string): this { this.data.email = email; return this; }

  build(): User {
    // Runtime check — too late!
    if (!this.data.id || !this.data.name) throw new Error('Missing required fields');
    return this.data as User;
  }
}

// TypeScript is happy — but this throws at RUNTIME:
const user = new UserBuilder().setEmail('a@b.com').build(); // ❌ runtime error
\`\`\`

---

### 2. The Phantom Type Trick — Compile-Time Required Field Enforcement

*💡 Analogy: Think of a safe that requires two keys. The safe doesn't open until both keys are inserted. Phantom types encode which keys have been inserted into the TYPE itself — the compiler refuses to let you call \`.build()\` until all required keys are present in the type.*

Phantom types are type parameters that exist only at compile time (they don't appear in the runtime value):

\`\`\`typescript
// The phantom type tracks which required fields have been set
type BuilderState = {
  hasId:    boolean;
  hasName:  boolean;
  hasEmail: boolean;
};

class UserBuilder<State extends BuilderState = { hasId: false; hasName: false; hasEmail: false }> {
  private data: Partial<User> = {};

  // After setId, the State type changes: hasId becomes true
  setId(id: string): UserBuilder<State & { hasId: true }> {
    this.data.id = id;
    return this as any;
  }

  setName(name: string): UserBuilder<State & { hasName: true }> {
    this.data.name = name;
    return this as any;
  }

  setEmail(email: string): UserBuilder<State & { hasEmail: true }> {
    this.data.email = email;
    return this as any;
  }

  // build() only exists when ALL required fields are set
  // Uses a conditional type: only callable when State has all true values
  build(
    this: UserBuilder<{ hasId: true; hasName: true; hasEmail: true }>
  ): User {
    return this.data as User;
  }
}

// ✅ This compiles:
const user = new UserBuilder()
  .setId('123')
  .setName('Alice')
  .setEmail('alice@test.com')
  .build();

// ❌ This fails at COMPILE TIME — missing setId and setName:
const incomplete = new UserBuilder()
  .setEmail('alice@test.com')
  .build();  // ❌ TypeScript error: 'build' does not exist on this builder state
\`\`\`

---

### 3. The Record-Based Phantom State — Cleaner Syntax

\`\`\`typescript
// A cleaner approach using a record of required fields
type Required = 'id' | 'name' | 'email';

class TestUserBuilder<Done extends string = never> {
  private data: Record<string, unknown> = {};

  setId(id: string):       TestUserBuilder<Done | 'id'>    { this.data.id    = id;    return this as any; }
  setName(name: string):   TestUserBuilder<Done | 'name'>  { this.data.name  = name;  return this as any; }
  setEmail(email: string): TestUserBuilder<Done | 'email'> { this.data.email = email; return this as any; }
  setRole(role: string):   this                            { this.data.role  = role;  return this; }

  // build() only exists when Done includes all of Required
  build(this: TestUserBuilder<Required>): User {
    return this.data as unknown as User;
  }
}

// ✅ All required fields set — compiles
const u1 = new TestUserBuilder()
  .setId('u1')
  .setName('Bob')
  .setEmail('bob@test.com')
  .setRole('admin')  // optional — doesn't affect build eligibility
  .build();

// ❌ Missing .setName() — TypeScript error at .build()
const u2 = new TestUserBuilder()
  .setId('u2')
  .setEmail('c@d.com')
  .build();  // ❌ Argument of type 'TestUserBuilder<"id" | "email">' is not assignable
\`\`\`

---

### 4. Factory Functions — Type-Safe Creation With Overloads

*💡 Analogy: A factory floor with different production lines — each line produces a different product variant. Factory functions with overloads let TypeScript know: "if you call me with \`type: 'admin'\`, I return an AdminUser; with \`type: 'guest'\`, I return a GuestUser." The return type depends on the input.*

\`\`\`typescript
type AdminUser = { role: 'admin'; permissions: string[] };
type GuestUser = { role: 'guest'; expiresAt: Date };
type AnyUser   = AdminUser | GuestUser;

// Overloads — TypeScript picks the right return type based on input
function createUser(role: 'admin'): AdminUser;
function createUser(role: 'guest'): GuestUser;
function createUser(role: 'admin' | 'guest'): AnyUser {
  if (role === 'admin') return { role: 'admin', permissions: ['read', 'write'] };
  return { role: 'guest', expiresAt: new Date(Date.now() + 3600000) };
}

const admin = createUser('admin');  // TypeScript knows: AdminUser
const guest = createUser('guest');  // TypeScript knows: GuestUser

admin.permissions;  // ✅ TypeScript knows this exists
guest.expiresAt;    // ✅ TypeScript knows this exists
admin.expiresAt;    // ❌ TypeScript error: AdminUser has no expiresAt
\`\`\`

---

### 5. Discriminated Union State Machines — States Encoded in Types

*💡 Analogy: A traffic light has three states: Red, Yellow, Green. Each state has different allowed transitions (Red → Green, Green → Yellow, Yellow → Red). A type state machine encodes these rules in the type system — you literally cannot call \`turnGreen()\` on a Green light because that method doesn't exist on the Green state.*

\`\`\`typescript
// States as separate types
type Idle    = { status: 'idle' };
type Loading = { status: 'loading'; startedAt: Date };
type Success<T> = { status: 'success'; data: T; completedAt: Date };
type Failure = { status: 'failure'; error: string; failedAt: Date };

type RequestState<T> = Idle | Loading | Success<T> | Failure;

// Transition functions only accept valid source states
function startLoading(state: Idle): Loading {
  return { status: 'loading', startedAt: new Date() };
}

function succeed<T>(state: Loading, data: T): Success<T> {
  return { status: 'success', data, completedAt: new Date() };
}

function fail(state: Loading, error: string): Failure {
  return { status: 'failure', error, failedAt: new Date() };
}

// You cannot call succeed() on an Idle state — TypeScript prevents it:
const idle: Idle = { status: 'idle' };
succeed(idle, { name: 'Alice' });  // ❌ TypeScript error: Idle is not Loading

const loading = startLoading(idle);
const success = succeed(loading, { name: 'Alice' });  // ✅
\`\`\`

---

### 6. Real-World QA Example — Type-Safe Test Data Factory

\`\`\`typescript
// A test data factory with required and optional fields, phantom-type enforced
type TestOrder = {
  id: string;
  userId: string;
  items: { sku: string; qty: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
};

type Required = 'id' | 'userId' | 'items';

class OrderFixture<Done extends string = never> {
  private data: Partial<TestOrder> = { status: 'pending', total: 0 };

  withId(id: string):       OrderFixture<Done | 'id'>     { this.data.id     = id;    return this as any; }
  withUser(id: string):     OrderFixture<Done | 'userId'> { this.data.userId = id;    return this as any; }
  withItems(items: TestOrder['items']): OrderFixture<Done | 'items'> {
    this.data.items = items;
    this.data.total = items.reduce((sum, i) => sum + i.qty, 0);
    return this as any;
  }
  withStatus(s: TestOrder['status']): this { this.data.status = s; return this; }

  build(this: OrderFixture<Required>): TestOrder { return this.data as TestOrder; }
}

// Usage in tests — compile-time enforcement:
const order = new OrderFixture()
  .withId('order-001')
  .withUser('user-001')
  .withItems([{ sku: 'SKU-A', qty: 2 }])
  .withStatus('shipped')
  .build();  // ✅

// ❌ Missing withUser — TypeScript error at .build():
new OrderFixture()
  .withId('order-002')
  .withItems([{ sku: 'SKU-B', qty: 1 }])
  .build();  // Error: 'userId' is missing from Done
\`\`\`
        `
      },

      {
        id: 'ts-declaration-merging',
        title: 'Declaration Merging & Module Augmentation',
        analogy: "Imagine a government building with multiple departments, all adding floors to the same building. Department A builds floors 1-5, Department B adds floors 6-10, Department C adds a rooftop. Visitors enter through one front door and can access all floors. Declaration merging lets different parts of your code — or third-party libraries — add to the same type definition, which TypeScript then combines into one complete building.",
        lessonMarkdown: `
### 1. What Is Declaration Merging?

*💡 Analogy: In English, the word "bank" can mean a riverbank, a financial bank, or to bank a turn. The dictionary doesn't have three separate entries — they're merged under one word, and context tells you which meaning applies. TypeScript merges multiple declarations of the same name into one combined type.*

TypeScript allows the same name to be declared multiple times in certain cases — the declarations are **merged** into one:

\`\`\`typescript
// Interfaces can be declared multiple times — they merge
interface UserProfile {
  id: string;
  name: string;
}

interface UserProfile {
  email: string;
  role: 'admin' | 'user';
}

// The merged result is as if you wrote one interface with all four properties:
const profile: UserProfile = {
  id: '123',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
};  // ✅ TypeScript requires ALL four fields

// Classes and type aliases CANNOT be merged — only interfaces
type UserProfile = { id: string };  // ❌ Error: duplicate identifier
class UserProfile {}                // ❌ Error: duplicate identifier
\`\`\`

---

### 2. Extending Third-Party Interfaces — The Primary Use Case

*💡 Analogy: You move into a furnished apartment (the library). The furniture is already there (existing types). You want to add your own bookshelf (extend the type). You don't tear out the existing furniture — you add to the room using the same naming convention so visitors see one complete apartment.*

The most common real-world use: adding custom properties to framework types.

**Extending Express's Request type:**
\`\`\`typescript
// In your type definitions file (e.g., src/types/express.d.ts):
import 'express';

declare module 'express' {
  interface Request {
    user?: { id: string; role: 'admin' | 'user' };
    requestId: string;
    startTime: number;
  }
}

// Now everywhere in your app:
import { Request, Response } from 'express';

function authMiddleware(req: Request, res: Response, next: Function): void {
  req.user = { id: 'user-123', role: 'admin' };  // ✅ TypeScript knows this exists
  req.requestId = generateId();                    // ✅ TypeScript knows this exists
  next();
}

function protectedRoute(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  console.log(req.user.role);  // ✅ TypeScript knows user has id and role
}
\`\`\`

---

### 3. Extending Jest Matchers — Adding Custom Assertions

*💡 Analogy: You're adding a new tool to the mechanic's toolbox (Jest). The toolbox already has wrenches and screwdrivers (existing matchers). You're adding a custom torque gauge (custom matcher). You tell the toolbox catalog (TypeScript) about the new tool so intellisense knows it exists.*

\`\`\`typescript
// In src/types/jest-extended.d.ts
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(min: number, max: number): R;
      toBeValidEmail(): R;
      toHaveBeenCalledWithUserId(userId: string): R;
    }
  }
}

// The implementation (in a setup file):
expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    return {
      pass,
      message: () =>
        pass
          ? \\\`Expected \\\${received} NOT to be within [\\\${min}, \\\${max}]\\\`
          : \\\`Expected \\\${received} to be within [\\\${min}, \\\${max}]\\\`,
    };
  },
  toBeValidEmail(received: string) {
    const pass = /^[^@]+@[^@]+\.[^@]+$/.test(received);
    return { pass, message: () => \\\`Expected "\\\${received}" to be a valid email\\\` };
  },
});

// Now in any test file — with full IntelliSense and type safety:
expect(responseTimeMs).toBeWithinRange(0, 2000);  // ✅
expect(user.email).toBeValidEmail();               // ✅
expect(404).toBeWithinRange(400, 499);             // ✅
\`\`\`

---

### 4. Extending Playwright's Types — Custom Fixtures and TestInfo

\`\`\`typescript
// In playwright.d.ts
import { TestInfo } from '@playwright/test';

declare module '@playwright/test' {
  interface TestInfo {
    customReporter: { log(msg: string): void };
    environment: 'staging' | 'production' | 'local';
    testRunId: string;
  }
}

// Now in Playwright tests:
import { test } from '@playwright/test';

test('login flow', async ({ page }, testInfo) => {
  testInfo.customReporter.log('Starting login test');  // ✅ TypeScript knows this exists
  console.log(\\\`Running on: \\\${testInfo.environment}\\\`);   // ✅ typed
  console.log(\\\`Test run ID: \\\${testInfo.testRunId}\\\`);    // ✅ typed
});
\`\`\`

---

### 5. Global Augmentation — Extending the Global Scope

*💡 Analogy: Global augmentation is like adding a new word to the shared office dictionary — it's available to everyone in the building, not just one department. You're extending what TypeScript considers globally available.*

\`\`\`typescript
// Extend the Window object (browser globals)
declare global {
  interface Window {
    testHelpers: {
      resetDB(): Promise<void>;
      seedData(fixture: string): Promise<void>;
    };
    __TEST_ENV__: boolean;
  }
}

// Now in test files:
window.testHelpers.resetDB();          // ✅ TypeScript knows this exists
window.testHelpers.seedData('users');  // ✅
window.__TEST_ENV__;                   // ✅ typed as boolean

// Extend process.env for typed environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL:  string;
      API_BASE_URL:  string;
      AUTH_SECRET:   string;
      NODE_ENV:      'development' | 'test' | 'production';
    }
  }
}

// Now process.env is typed:
const dbUrl = process.env.DATABASE_URL;  // string (not string | undefined) ✅
const env   = process.env.NODE_ENV;      // 'development' | 'test' | 'production' ✅
\`\`\`

---

### 6. Namespace Merging — Adding to a Namespace

\`\`\`typescript
// Namespaces can also be merged — useful for adding utilities to a library's namespace
namespace Validation {
  export function isEmail(value: string): boolean {
    return /^[^@]+@[^@]+\.[^@]+$/.test(value);
  }
}

// In another file — merges with the existing Validation namespace
namespace Validation {
  export function isPhone(value: string): boolean {
    return /^\+?[\d\s\-()]{10,}$/.test(value);
  }
}

// The consumer sees one unified namespace:
Validation.isEmail('a@b.com');  // ✅
Validation.isPhone('+1 555 1234'); // ✅
\`\`\`

---

### 7. When to Use Each Technique

| Technique | When to use |
|-----------|-------------|
| **Interface merging** | Extend framework types (Express, Jest, Playwright) |
| **Module augmentation** | Add to a library's existing types from outside |
| **Global augmentation** | Extend Window, process.env, NodeJS globals |
| **Namespace merging** | Split large namespaces across files or add to lib namespaces |

**Important rules:**
\`\`\`typescript
// ✅ Module augmentation MUST import the module (even if unused)
import 'express';  // This makes it a module augmentation, not a global declaration
declare module 'express' { interface Request { user?: User } }

// ❌ Without the import, it's a global declaration (different file scope)
declare module 'express' { interface Request { user?: User } }  // wrong scope
\`\`\`

**File organisation best practice:**
\`\`\`typescript
// src/types/
//   index.d.ts      — re-exports all augmentations
//   express.d.ts    — express augmentations
//   jest.d.ts       — jest matcher augmentations
//   playwright.d.ts — playwright augmentations
//   global.d.ts     — global and NodeJS augmentations

// tsconfig.json — make sure TypeScript finds your declarations:
// { "include": ["src/**/*.ts", "src/**/*.d.ts"] }
\`\`\`
        `
      },

      {
        id: 'ts-performance-compiler',
        title: 'TypeScript Compiler, tsconfig & Type Performance',
        analogy: "The TypeScript compiler is like a building inspector. \`tsconfig.json\` is your list of inspection rules — you can tell the inspector to be strict (check everything), lenient (only check essentials), or focused (only inspect certain floors). \`strict: true\` is the inspector carrying a full code book. Each individual flag is a specific section of that code book. Knowing which rules are in force helps you understand exactly why the inspector is refusing to sign off on your build.",
        lessonMarkdown: `
### 1. How \`tsconfig.json\` Works

*💡 Analogy: \`tsconfig.json\` is the control panel for the TypeScript compiler. It decides which files to include, which JavaScript version to target, how strictly to check your code, and how to resolve imports. Every setting has a default — knowing the defaults means you know what you're getting even when you don't specify.*

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",          // What JS version to output
    "module": "ESNext",          // How modules are compiled
    "lib": ["ES2022", "DOM"],    // Which built-in types are available
    "strict": true,              // Enables ALL strict checks (recommended)
    "outDir": "./dist",          // Where compiled JS goes
    "rootDir": "./src",          // Where your TS source lives
    "declaration": true,         // Emit .d.ts files alongside JS
    "sourceMap": true,           // Generate source maps for debugging
    "esModuleInterop": true,     // Better CommonJS/ESModule interop
    "moduleResolution": "bundler" // How imports are resolved (Vite/esbuild)
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

---

### 2. The \`strict\` Flag — What It Actually Enables

*💡 Analogy: \`strict: true\` is a shorthand for enabling seven safety features at once. It's like setting your security system to "Maximum" mode — it enables motion detection, door sensors, window sensors, and glass-break detection all at once. Each can also be toggled individually.*

\`strict: true\` enables these flags (you can also set each individually):

\`\`\`typescript
// 1. strictNullChecks — the most important one
//    Without it, null/undefined are assignable to every type
function greet(name: string): string {
  return \\\`Hello \\\${name}\\\`;
}
greet(null);  // ❌ Error with strictNullChecks — ✅ allowed without it!

// 2. noImplicitAny — no silent 'any' types
function process(x) { return x; }        // ❌ x implicitly has 'any' type
function process(x: unknown) { return x; } // ✅

// 3. strictFunctionTypes — contravariance for function parameters
type Handler = (event: MouseEvent) => void;
const handle: Handler = (event: Event) => {};    // ✅ Event is wider than MouseEvent
const broken: Handler = (event: UIEvent) => {};  // ❌ UIEvent is not a MouseEvent

// 4. strictPropertyInitialization — all class properties must be set in constructor
class Service {
  name: string;  // ❌ Error: not set in constructor
  constructor() {}
}

class Service2 {
  name: string;
  constructor() { this.name = 'default'; }  // ✅
}

// 5. noImplicitThis — 'this' in functions must be typed
function clickHandler(this: HTMLButtonElement): void {
  console.log(this.disabled);  // ✅ TypeScript knows 'this' is HTMLButtonElement
}
\`\`\`

---

### 3. Path Aliases — Eliminating Relative Import Hell

*💡 Analogy: Imagine navigating a large city using only directions like "turn left, go 3 blocks, turn right, go 2 blocks." Path aliases are like naming landmarks: "go to Central Park" instead of "go to 59th and 5th." Imports become readable no matter how deep the file is.*

\`\`\`typescript
// ❌ Without path aliases — this is fragile and unreadable
import { LoginPage } from '../../../pages/auth/LoginPage';
import { createUser } from '../../../../fixtures/users';
import { apiClient } from '../../helpers/api';

// ✅ With path aliases — clean and location-independent
import { LoginPage } from '@pages/auth/LoginPage';
import { createUser } from '@fixtures/users';
import { apiClient } from '@helpers/api';
\`\`\`

**Setting up path aliases in \`tsconfig.json\`:**
\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*":    ["src/pages/*"],
      "@fixtures/*": ["src/fixtures/*"],
      "@helpers/*":  ["src/helpers/*"],
      "@types/*":    ["src/types/*"],
      "@utils/*":    ["src/utils/*"]
    }
  }
}
\`\`\`

**For Vite — you must also configure aliases in \`vite.config.ts\`:**
\`\`\`typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@pages':    resolve(__dirname, 'src/pages'),
      '@fixtures': resolve(__dirname, 'src/fixtures'),
      '@helpers':  resolve(__dirname, 'src/helpers'),
    },
  },
});
\`\`\`

---

### 4. \`isolatedModules\` — Why Vite and esbuild Require It

\`\`\`typescript
// isolatedModules: true means each file must be compilable in isolation
// This is required by tools like Vite, esbuild, and Babel

// ❌ Not allowed with isolatedModules: const enum (requires full program context)
const enum Direction { Up, Down, Left, Right }

// ✅ Use regular enum instead:
enum Direction { Up, Down, Left, Right }

// ❌ Not allowed: re-exporting a type without 'type' keyword
export { User } from './types';  // TypeScript doesn't know if User is a type or value

// ✅ Use 'export type' for type-only re-exports:
export type { User } from './types';  // Clear to the compiler: type-only export
import type { User } from './types';  // Same for imports
\`\`\`

---

### 5. Type Performance — Why Some Types Are Slow

*💡 Analogy: Asking "is this number prime?" is fast for small numbers but slow for huge ones. Some TypeScript types are like checking a small number (fast), while others — especially deeply recursive types — are like factoring a 500-digit number (slow). Understanding what makes types expensive helps you write types the compiler can handle.*

**What makes types slow:**
\`\`\`typescript
// ❌ Deep recursive types — TypeScript has a recursion limit (and is slow approaching it)
type DeepNested<T, Depth extends number = 0> = Depth extends 10
  ? T
  : { value: T; nested: DeepNested<T, [0,1,2,3,4,5,6,7,8,9][Depth]> };

// ❌ Large conditional type unions — each member is evaluated
type BigUnion = 'a' | 'b' | 'c' | /* ... 50 more */ 'z';
type Check<T> = T extends BigUnion ? true : false;  // slow for large unions

// ✅ Prefer interface over type for object shapes (interfaces are cached)
type UserType = { id: string; name: string };    // slower
interface UserInterface { id: string; name: string }  // faster — cached after first use

// ✅ Use unknown instead of any for parameters you'll narrow
function handle(data: unknown): void {  // ✅ forces proper narrowing
  if (typeof data === 'string') data.toUpperCase();
}
\`\`\`

**Diagnosing with \`--extendedDiagnostics\`:**
\`\`\`bash
npx tsc --extendedDiagnostics 2>&1 | head -30
# Shows: Check time, Bind time, Total time
# Shows which files take the most type-check time
# High "Check time" → complex types, too many generics, deep recursion
\`\`\`

---

### 6. \`@ts-expect-error\` vs \`@ts-ignore\`

\`\`\`typescript
// ❌ @ts-ignore — silences any error on the next line, including ones that don't exist
// @ts-ignore
const x: string = 42;  // suppressed — no warning if the error goes away later

// ✅ @ts-expect-error — suppresses the error AND fails if there's no error
// This means if a future TypeScript version fixes the issue, you'll be told:
// @ts-expect-error — Remove when TS supports this pattern
const x: string = 42;  // ✅ suppressed now; ❌ error when 42 stops being invalid

// Use @ts-expect-error in tests to verify something IS an error:
// @ts-expect-error
processId(orderId);  // This line SHOULD fail — @ts-expect-error confirms it does
\`\`\`

---

### 7. Project References — For Large Monorepos

\`\`\`typescript
// Project references let TypeScript compile sub-projects separately
// and cache the results — dramatically faster incremental builds

// packages/shared/tsconfig.json
// { "compilerOptions": { "composite": true }, ... }

// packages/api/tsconfig.json
// { "references": [{ "path": "../shared" }], ... }

// packages/tests/tsconfig.json
// { "references": [{ "path": "../api" }, { "path": "../shared" }], ... }

// tsc --build (or tsc -b) compiles only what changed
// Without project references: TypeScript recompiles everything every time
// With project references: TypeScript caches shared/ output and reuses it
\`\`\`

---

### 8. Practical tsconfig for a Playwright + Vite Project

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*":    ["src/pages/*"],
      "@fixtures/*": ["src/fixtures/*"],
      "@helpers/*":  ["src/helpers/*"]
    },
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

**Key flags explained:**
- \`noUnusedLocals / noUnusedParameters\` — catches dead code before PR review
- \`noFallthroughCasesInSwitch\` — catches missing \`break\` in switch statements
- \`exactOptionalPropertyTypes\` — \`{ x?: string }\` means absent OR string, NOT undefined
- \`skipLibCheck\` — skip type-checking \`.d.ts\` files in \`node_modules\` (speeds up build)
        `
      },

    ]
  },
  playwright: {
    id: 'playwright',
    levels: [
      {
        id: 'pw-what-is-playwright',
        title: 'What is Playwright & Why End-to-End Testing?',
        analogy: "Think of a software application like a restaurant. Unit tests check that the chef's knife is sharp. Integration tests verify the kitchen prepares a dish correctly. End-to-End testing is the health inspector who walks in through the front door, sits at a table, orders a full meal, and verifies that the host greets correctly, the waiter takes the order, the kitchen cooks it, and the dish arrives at the table — every part of the experience working together from the customer's perspective. Playwright is the health inspector's clipboard.",
        lessonMarkdown: `
### 1. The Testing Pyramid — Where Playwright Fits

*💡 Analogy: Inspecting a car. You check individual parts (unit test), run systems together — engine with transmission, brakes with ABS (integration test), then take it on a real road test drive (E2E test). Each level catches different problems. The road test is slowest but gives the most realistic confidence.*

Software testing exists on a spectrum:

| Test Level | What It Tests | Speed | Confidence |
|------------|--------------|-------|------------|
| **Unit Test** | One function in isolation | Milliseconds | Low |
| **Integration Test** | Multiple components together | Seconds | Medium |
| **End-to-End (E2E)** | Whole application via real browser | Seconds-Minutes | **Highest** |

**Why E2E matters for QA:** Unit tests are written by developers. Integration tests verify services connect. But neither answers: *"Does the actual website work when a real user clicks through it?"* That's E2E — and Playwright is the modern tool that automates it.

A Playwright test literally:
1. Opens a real Chrome, Firefox, or Safari browser
2. Navigates to your website's URL
3. Clicks, types, scrolls — exactly like a human
4. Verifies that the right things appeared
5. Closes the browser

This is the most powerful form of automated testing a QA engineer owns.

---

### 2. What Playwright Actually Is

*💡 Analogy: Playwright is a puppet master for web browsers. The browser is the puppet — opening pages, clicking buttons. Playwright is the puppeteer — controlling every movement through invisible strings. The strings are instructions sent over the browser's internal communication protocol.*

Playwright is a **free, open-source test automation framework** built by **Microsoft**, released in January 2020. It was created by the same engineers who originally built Puppeteer at Google.

**How it talks to the browser — the technical edge:**

| Old way (Selenium) | Playwright |
|--------------------|------------|
| WebDriver protocol — HTTP requests for every command | Chrome DevTools Protocol (CDP) — persistent WebSocket |
| Slow, request-response cycle | Always-open channel, instant commands |
| Race conditions, flaky tests | Browser state perfectly synced |

CDP is the same protocol that Chrome's own Developer Tools use. By speaking this language directly, Playwright is faster, more reliable, and unlocks features WebDriver-based tools simply cannot do.

**Quick facts:**
- Creator: Microsoft (MIT licence)
- Languages: JavaScript / TypeScript (primary), Python, Java, C#
- Browsers: Chromium, Firefox, WebKit (Safari engine)
- Update cadence: weekly releases

---

### 3. Playwright vs Selenium vs Cypress

*💡 Analogy: Selenium is an old reliable postal service — works everywhere but slow with paperwork. Cypress is a fast city courier — same-origin only, no Safari, no multi-tab. Playwright is a modern delivery drone — fast, anywhere, multiple packages at once.*

| Feature | Selenium | Cypress | **Playwright** |
|---------|----------|---------|---------------|
| **Browsers** | All (incl. legacy) | Chromium + Firefox | Chromium, Firefox, **WebKit/Safari** |
| **Multiple tabs** | Difficult | ❌ Not supported | ✅ Yes |
| **Iframes** | Difficult | Limited | ✅ Yes |
| **Auto-waiting** | ❌ Manual sleeps | ✅ Yes | ✅ Yes |
| **Network mocking** | Not built-in | ✅ Yes | ✅ Yes |
| **API testing** | ❌ No | Limited | ✅ Built-in |
| **File downloads** | Workarounds | Workarounds | ✅ Built-in |
| **Mobile emulation** | Via Appium | Limited | ✅ Built-in |

**Why most new QA teams choose Playwright:**
- Real products have **Safari users** — Cypress can't test Safari, Playwright can
- Multi-tab flows (payment redirects, OAuth) are common — only Playwright handles them
- One framework covers UI + API + visual + accessibility testing
- TypeScript-first design = excellent IDE support and type safety

---

### 4. What Playwright Can Test — Beyond Just Clicking

*💡 Analogy: Most QA engineers first see Playwright as a "click-through-the-UI" tool. That's like seeing a Swiss Army knife as just a knife. The blade is there — but so are the saw, screwdriver, magnifying glass, and corkscrew.*

**UI / Functional Testing:**
\`\`\`typescript
await page.goto('/checkout');
await page.getByLabel('Email').fill('test@example.com');
await page.getByRole('button', { name: 'Place Order' }).click();
await expect(page.getByText('Order confirmed!')).toBeVisible();
\`\`\`

**API Testing — built directly into Playwright:**
\`\`\`typescript
const response = await request.post('/api/users', {
  data: { name: 'Alice', email: 'alice@test.com' }
});
expect(response.status()).toBe(201);
\`\`\`

**Network Mocking — simulate API failures:**
\`\`\`typescript
// Return fake 500 error to test error UI without backend changes
await page.route('/api/orders', route => route.fulfill({
  status: 500,
  body: JSON.stringify({ error: 'Service unavailable' })
}));
\`\`\`

**Visual Regression:**
\`\`\`typescript
await expect(page).toHaveScreenshot('checkout-page.png');
\`\`\`

**Mobile emulation:**
\`\`\`typescript
// In playwright.config.ts
use: { ...devices['iPhone 14'] }
\`\`\`

For QA, this means **one framework** covers almost your entire testing portfolio.

---

### 5. When to Use Playwright — and When Not

*💡 Analogy: You wouldn't deploy a helicopter to deliver a letter. Playwright is powerful and expensive — deploy it where it earns its cost.*

**Use Playwright for:**
- Critical user journeys: login → add to cart → checkout
- Cross-browser verification ("Does this work in Safari?")
- Workflows spanning multiple pages or tabs
- Testing how UI handles API errors or slow networks
- Visual regression checks before releases
- File upload/download scenarios
- Accessibility audits

**Do NOT use Playwright for:**
- Pure JavaScript utility functions → use **Jest** or **Vitest**
- React component prop testing → use **React Testing Library**
- Database query verification → integration tests
- Class method return values → unit tests

**The QA Rule of Thumb:**
> "If a real user would see it in a browser, Playwright can test it. If it never touches a browser, use a lighter tool."

E2E tests are the most expensive to write and maintain. Invest them in flows where a bug would directly cost your business money, users, or reputation.
        `
      },

      {
        id: 'pw-installation-setup',
        title: 'Installing Playwright & Project Structure',
        analogy: "Setting up a Playwright project is like setting up a new kitchen. First you need the building (Node.js — the platform). Then you bring in the cookware (the Playwright package). Then you stock the pantry (the browser binaries Playwright needs to actually drive Chrome, Firefox, Safari). Skip any step and you'll find yourself missing something mid-test, with the timer running.",
        lessonMarkdown: `
### 1. Prerequisites — What You Need Before You Install Playwright

*💡 Analogy: Before installing a new appliance, you check your kitchen has the right power outlet. Node.js is the power outlet that all JavaScript-based tools plug into.*

**Node.js** is a JavaScript runtime — it lets you run JavaScript code outside a browser, on your computer or a server. Playwright is built in JavaScript/TypeScript, so it runs on Node.js.

**npm** (Node Package Manager) ships with Node.js. It's how you install JavaScript libraries (like Playwright).

**Minimum requirements:**

| Tool | Minimum Version | How to Check |
|------|----------------|--------------|
| Node.js | 18.0+ (LTS recommended) | \`node --version\` |
| npm | 9.0+ | \`npm --version\` |
| Operating System | Windows 10+, macOS 12+, Linux | — |
| Disk space | ~500 MB (for browser binaries) | — |

**Installing Node.js:** Download the **LTS** ("Long Term Support") version from [nodejs.org](https://nodejs.org). LTS means stable and supported — exactly what production QA work needs.

After installation, open a terminal and verify:

\`\`\`bash
node --version
# v20.10.0

npm --version
# 10.2.3
\`\`\`

If both commands print versions, you're ready.

---

### 2. Installing Playwright — The Magic Command

*💡 Analogy: Most software installations are like buying flat-pack furniture — you assemble it yourself. \`npm init playwright@latest\` is like having IKEA deliver pre-assembled furniture, set it up in your room, and hand you the manual.*

The official command:

\`\`\`bash
npm init playwright@latest
\`\`\`

This command does **everything** for you. It downloads Playwright, sets up the project structure, downloads browser binaries, and creates example tests.

**What it asks you (and what to answer):**

| Prompt | Recommended Answer | Why |
|--------|-------------------|-----|
| TypeScript or JavaScript? | **TypeScript** | Type safety catches bugs at compile time, IDE autocomplete is far better |
| Where to put tests? | **tests** (default) | Standard convention everyone recognises |
| Add a GitHub Actions workflow? | **Yes** if you'll use CI | Auto-creates \`.github/workflows/playwright.yml\` for you |
| Install Playwright browsers? | **Yes** | Without this, your tests cannot run |

**The whole thing takes about 60 seconds.** When complete, your project is fully runnable.

---

### 3. The Generated Folder Structure

*💡 Analogy: When you move into a new flat, you look at every room to know what goes where. Playwright creates a small set of files — knowing what each does means you'll never get lost.*

After running the init command, your project looks like:

\`\`\`
my-tests/
├── tests/
│   └── example.spec.ts          ← Your test files go here
├── tests-examples/
│   └── demo-todo-app.spec.ts    ← Reference example to study
├── playwright.config.ts         ← THE MOST IMPORTANT FILE
├── package.json                 ← Project dependencies
├── package-lock.json            ← Locked versions
├── .gitignore                   ← Prevents committing node_modules
└── node_modules/                ← Installed dependencies (don't edit)
\`\`\`

**File-by-file meaning:**

- **\`tests/\`** — Where you write your real test files. Naming convention: \`*.spec.ts\` (e.g. \`login.spec.ts\`).
- **\`tests-examples/\`** — Reference tests. Read these to learn patterns. Delete when you no longer need them.
- **\`playwright.config.ts\`** — Configures everything: which browsers to test, timeouts, retries, base URL. We'll cover this in depth in Module 7.
- **\`package.json\`** — Lists Playwright as a dependency. Defines scripts like \`npm test\`.
- **\`node_modules/\`** — The actual library code. Never edit, never commit.

---

### 4. The Browser Binaries — What \`npx playwright install\` Does

*💡 Analogy: Installing the Playwright npm package is like buying a remote control. But the remote needs actual TVs to control. \`npx playwright install\` downloads the TVs (the browsers).*

When you install Playwright, the npm package alone is small (~10 MB). But **Playwright needs actual browser installations** — Chromium, Firefox, WebKit — to drive.

\`npx playwright install\` downloads:

\`\`\`
~/.cache/ms-playwright/
├── chromium-XXXX/        ← ~150 MB
├── firefox-XXXX/         ← ~80 MB
└── webkit-XXXX/          ← ~70 MB
\`\`\`

**Important notes:**

- These are **separate from** any Chrome/Firefox you already have installed. Playwright downloads its own consistent versions to ensure tests are reproducible.
- Total download: roughly **300 MB**.
- Stored centrally per user — multiple Playwright projects share the same binaries.
- To install only one browser: \`npx playwright install chromium\`
- To install only browsers you haven't installed yet, with system dependencies: \`npx playwright install --with-deps\`

**Run this any time you upgrade Playwright** to download the matching browser versions.

---

### 5. Verifying Your Setup — Running the Example Test

*💡 Analogy: After hanging a new TV, you turn it on to make sure it works before you start the football match. Always run the example test to verify your install before writing your own tests.*

The init command creates an example file in \`tests/example.spec.ts\`. Open it — you'll see two simple tests that hit playwright.dev.

**Run all tests:**

\`\`\`bash
npx playwright test
\`\`\`

**Expected output:**

\`\`\`
Running 6 tests using 5 workers
  6 passed (8.3s)

To open last HTML report run:
  npx playwright show-report
\`\`\`

If you see this, **Playwright is fully installed and working.** If you see errors, the most common causes:

| Error | Fix |
|-------|-----|
| \`browserType.launch: Executable doesn't exist\` | Run \`npx playwright install\` |
| \`Error: getaddrinfo ENOTFOUND playwright.dev\` | No internet connection — example needs to load a real site |
| \`Cannot find module '@playwright/test'\` | Run \`npm install\` |

**Open the HTML report:**

\`\`\`bash
npx playwright show-report
\`\`\`

This launches a browser with a beautiful dashboard showing every test, screenshots on failure, and timing. This is the report your team and managers will look at.

---

### 6. The Three Files You'll Touch Daily

After setup, only three things matter day-to-day:

| File | What you do with it |
|------|---------------------|
| \`tests/*.spec.ts\` | Write your tests here |
| \`playwright.config.ts\` | Tweak browsers, timeouts, base URL |
| Terminal | Run \`npx playwright test\` and \`npx playwright show-report\` |

Everything else (node_modules, lock files, browser binaries) is plumbing that just works. Your QA productivity comes from mastering the three above.
        `
      },

      {
        id: 'pw-first-test-anatomy',
        title: 'Anatomy of a Playwright Test',
        analogy: "Reading a Playwright test for the first time is like reading sheet music when you've never studied music. The symbols look random until someone shows you what each one means. Once you know that the staff is the page, the notes are actions, and the time signature is async/await, every test you read becomes a song you can hum.",
        lessonMarkdown: `
### 1. The Import Statement — What You're Bringing In

*💡 Analogy: Before you cook, you bring the ingredients to the counter. The import statement is your shopping list — Playwright needs you to declare exactly which functions you'll use, so it can wire them up.*

Every Playwright test file starts with:

\`\`\`typescript
import { test, expect } from '@playwright/test';
\`\`\`

**What you're importing:**

| Symbol | What it is | What you'll do with it |
|--------|-----------|------------------------|
| \`test\` | A function that defines one test case | Wrap every test scenario in \`test('name', async () => {...})\` |
| \`expect\` | The assertion library | Verify outcomes: \`await expect(locator).toBeVisible()\` |

**Why \`@playwright/test\`** (with the \`@\`)? — \`@playwright\` is the npm "scope" — the official Microsoft Playwright organisation. \`/test\` is the test runner package. Other Playwright packages exist (\`@playwright/experimental-ct-react\` for component testing) but \`@playwright/test\` is your daily driver.

You'll never write \`require\` in modern Playwright projects — TypeScript uses \`import\` syntax exclusively.

---

### 2. The \`test()\` Function — Every Part Dissected

*💡 Analogy: A \`test()\` call is like a sealed envelope. You write the test name on the outside (anyone can read it), and inside you place the actual instructions. The envelope's seal is the function — Playwright opens it, runs what's inside, then seals it back up so it doesn't affect other envelopes.*

Here's a complete minimal test:

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('user can see the homepage heading', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
\`\`\`

**Breaking it down piece by piece:**

\`\`\`typescript
test(
  'user can see the homepage heading',  // ← The test NAME — what you'll see in reports
  async                                  // ← This function uses \`await\`, so it's async
  ({ page })                             // ← Destructured fixture — Playwright gives you a fresh \`page\` object
  =>                                     // ← Arrow function syntax
  {                                      // ← Test body starts
    await page.goto('https://example.com');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }                                      // ← Test body ends
);
\`\`\`

**Key terms QA engineers must know:**

- **Test name** — A clear English sentence describing what the test verifies. Bad: \`'test1'\`. Good: \`'logged-in user can update their profile email'\`.
- **Fixture** — A pre-prepared object Playwright hands you. \`page\` is the most important fixture: it represents one browser tab.
- **\`page\`** — Each test gets its own brand new \`page\` (a fresh browser tab). Tests can't accidentally share state.
- **Arrow function** — \`async ({ page }) => {...}\` — modern JavaScript syntax for an anonymous function.

---

### 3. async / await — Why Playwright Tests Cannot Be Synchronous

*💡 Analogy: Talking to a browser is like talking to someone on the moon. Light takes 1.3 seconds to reach the moon, so you say something then wait for the response. \`await\` is the verbal equivalent of "...over" on a radio — "I sent the command, now I'm waiting for the response, don't move on yet."*

JavaScript code normally runs **synchronously** — line by line, top to bottom. But browser actions take time:

| Action | Time it takes |
|--------|--------------|
| Navigate to a URL | 100–3000 ms (network) |
| Click a button | 50–200 ms |
| Wait for an animation | 200–1000 ms |
| Make an API call | 100–2000 ms |

If your test ran synchronously, it would race ahead of the browser:

\`\`\`typescript
// ❌ Without await — DISASTER
test('broken example', ({ page }) => {
  page.goto('/login');                      // Browser starts navigating
  page.getByLabel('Email').fill('a@b.com'); // Email field doesn't exist yet — page hasn't loaded!
  page.getByRole('button').click();          // Button doesn't exist yet — fails silently!
});
\`\`\`

The fix is **\`async\` / \`await\`**:

\`\`\`typescript
// ✅ With await — correct
test('correct example', async ({ page }) => {
  await page.goto('/login');                            // Wait for navigation to finish
  await page.getByLabel('Email').fill('a@b.com');       // Now the field exists
  await page.getByRole('button', { name: 'Login' }).click();  // Now the button exists
});
\`\`\`

**The rule: every Playwright action returns a Promise. Every action must be awaited.**

If you forget \`await\` on even one line, the test will look like it passes (because the failure happens after the test ends) but produce confusing flakiness. **TypeScript and ESLint will warn you** when you forget — listen to those warnings.

---

### 4. \`test.describe()\` — Grouping Related Tests

*💡 Analogy: A book has chapters. Inside each chapter are sections. \`test.describe()\` is the chapter heading — it groups related tests together so reports are organised, not a flat list of 200 unrelated test names.*

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('redirects to dashboard on success', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Password').fill('correctpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
\`\`\`

**Why \`describe\` is useful for QA:**

- Test reports show grouped results: "Login Page > shows error for invalid credentials"
- You can run only one group: \`npx playwright test --grep "Login Page"\`
- You can apply hooks (\`beforeEach\`) to one group only — without affecting other tests
- It mirrors how features are organised in your application

**Nested describes are allowed:**

\`\`\`typescript
test.describe('Checkout Flow', () => {
  test.describe('Empty Cart', () => {
    test('shows empty state message', async ({ page }) => { /* ... */ });
  });

  test.describe('With Items', () => {
    test('shows order summary', async ({ page }) => { /* ... */ });
    test('allows quantity changes', async ({ page }) => { /* ... */ });
  });
});
\`\`\`

---

### 5. \`beforeEach\` and \`afterEach\` — Setup and Teardown

*💡 Analogy: Before every chemistry experiment, you clean the test tubes. After every experiment, you dispose of waste. \`beforeEach\` and \`afterEach\` are your lab's standard procedure — automatic prep and cleanup that runs around every test.*

\`\`\`typescript
test.describe('Authenticated Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Runs BEFORE every test in this describe
    await page.goto('/login');
    await page.getByLabel('Email').fill('alice@test.com');
    await page.getByLabel('Password').fill('TestPass123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test.afterEach(async ({ page }) => {
    // Runs AFTER every test (even if test failed)
    // Useful for cleanup, screenshots on failure, etc.
    await page.getByRole('button', { name: 'Logout' }).click();
  });

  test('user can view profile', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  });

  test('user can update settings', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});
\`\`\`

**The execution order:**

\`\`\`
beforeEach → test 1 → afterEach
beforeEach → test 2 → afterEach
\`\`\`

**Why this matters:**

- Eliminates **duplicate code** — no more copying login steps into every test
- Tests stay **independent** — each test starts from the same clean state
- Failures in cleanup don't mask test failures

**Important:** \`beforeEach\` runs once for **every test** — not once for the whole describe. If you want code that runs once for the whole file, use \`beforeAll\` (rarely needed for E2E because tests should be independent).

---

### 6. A Complete, Real Test File — Everything Put Together

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {

  test.beforeEach(async ({ page }) => {
    // Set up: log in and navigate to product page
    await page.goto('/login');
    await page.getByLabel('Email').fill('alice@test.com');
    await page.getByLabel('Password').fill('TestPass123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.goto('/products');
  });

  test('user can add a product to the cart', async ({ page }) => {
    // Find the product and click Add to Cart
    const product = page.getByRole('article').filter({ hasText: 'Wireless Mouse' });
    await product.getByRole('button', { name: 'Add to Cart' }).click();

    // Verify cart icon shows count of 1
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    // Verify success toast appears
    await expect(page.getByText('Added to cart')).toBeVisible();
  });

  test('user can remove a product from the cart', async ({ page }) => {
    // Add a product first
    await page.getByRole('article').first()
      .getByRole('button', { name: 'Add to Cart' }).click();

    // Open the cart
    await page.getByRole('link', { name: 'Cart' }).click();

    // Remove the item
    await page.getByRole('button', { name: 'Remove' }).click();

    // Verify cart is now empty
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

});
\`\`\`

Read this file top to bottom. Every concept from Modules 1–3 is here:
- Imports (line 1)
- \`describe\` grouping (line 3)
- \`beforeEach\` setup (line 5)
- Two independent tests (lines 14, 27)
- \`async\` / \`await\` on every action (everywhere)
- \`expect\` assertions verifying outcomes

This is what production Playwright tests look like.
        `
      },

      {
        id: 'pw-locators',
        title: 'Locators — Finding Elements on the Page',
        analogy: "A locator is a description of how to find a specific element on a webpage, the same way you'd describe a friend in a crowded train station. Bad description: 'wearing a blue shirt' — what if they change shirts tomorrow? Good description: 'my friend Sarah, who's the conference organiser' — that identity stays stable forever. Locators are how Playwright tells the browser which element you mean. The QUALITY of your locators determines whether your tests survive minor UI changes or break every Tuesday.",
        lessonMarkdown: `
### 1. The DOM and Why Finding Elements Is Hard

*💡 Analogy: A webpage is a tree. The root is the page itself. Branches are sections (header, main, footer). Leaves are individual elements (buttons, inputs, paragraphs). The DOM (Document Object Model) is what we call this tree. To click a button, you must point to the exact leaf — among potentially thousands.*

When you visit a webpage, the HTML is parsed by the browser into a tree structure called the **DOM**. Your test must point to a specific node in that tree.

\`\`\`html
<body>
  <header>
    <nav>
      <button>Login</button>     ← Which one?
    </nav>
  </header>
  <main>
    <form>
      <button>Login</button>     ← Or this one?
    </form>
  </main>
</body>
\`\`\`

There might be **multiple buttons with the same text**. Or the button might be inside a complex nested structure. Or the button's text might come from a database (so it changes per language). All of these create the central challenge: **how do we describe an element so Playwright finds the right one — and only that one?**

**The answer is locators.** Playwright provides multiple locator strategies, ranked by how robust they are.

---

### 2. \`getByRole\` — The Gold Standard

*💡 Analogy: \`getByRole\` is like asking for someone by their job title rather than their outfit. "The cashier" is stable; "the woman in the red sweater" might be different tomorrow. Roles describe what an element IS, not what it looks like.*

ARIA roles are part of the web accessibility standard. Every interactive HTML element has a default role:

| HTML | Role |
|------|------|
| \`<button>\` | \`button\` |
| \`<a href>\` | \`link\` |
| \`<input type="text">\` | \`textbox\` |
| \`<input type="checkbox">\` | \`checkbox\` |
| \`<input type="radio">\` | \`radio\` |
| \`<select>\` | \`combobox\` |
| \`<h1>...<h6>\` | \`heading\` |
| \`<nav>\` | \`navigation\` |
| \`<main>\` | \`main\` |
| \`<form>\` | \`form\` |

**Basic syntax:**

\`\`\`typescript
// Find ANY button
page.getByRole('button');

// Find a button with specific text
page.getByRole('button', { name: 'Submit' });

// Find a heading at level 1 (the H1)
page.getByRole('heading', { level: 1 });

// Find a link by its visible text
page.getByRole('link', { name: 'Pricing' });

// Find a textbox by its accessible name (label, placeholder, aria-label)
page.getByRole('textbox', { name: 'Email' });
\`\`\`

**Why this is the gold standard:**

1. **Mirrors how users find elements** — users see "the Submit button", not "the button with class .btn-primary-xl"
2. **Stable across redesigns** — designers change colours, classes, and structure all the time. They rarely change a button into a div.
3. **Forces accessibility** — if your test uses \`getByRole\`, the element must have proper semantic HTML. This benefits real users with screen readers.
4. **Self-documenting** — \`getByRole('button', { name: 'Add to Cart' })\` reads like English.

**The rule for QA:** Use \`getByRole\` first. Only fall back to other locators when \`getByRole\` cannot uniquely identify the element.

---

### 3. \`getByText\`, \`getByLabel\`, \`getByPlaceholder\` — User-Facing Locators

*💡 Analogy: These are the locators that find elements the same way a user would describe them. "The button that says 'Submit'", "the field labelled 'Email'", "the search box that says 'Search products...'" — each is a real way humans navigate UIs.*

**\`getByText\` — Find by visible text content:**

\`\`\`typescript
// Exact match (default behaviour)
page.getByText('Welcome back, Alice');

// Substring match
page.getByText('Welcome', { exact: false });

// Regex match
page.getByText(/Welcome.*Alice/);
\`\`\`

Use \`getByText\` for **paragraphs, success messages, error messages, headings** — anything where the text itself identifies the element.

**\`getByLabel\` — Find form inputs by their associated label:**

\`\`\`html
<label for="email-input">Email Address</label>
<input id="email-input" type="email" />
\`\`\`

\`\`\`typescript
// Finds the input above by its label text
await page.getByLabel('Email Address').fill('alice@test.com');
\`\`\`

This is the **best way to find form fields** — labels are visible to users and rarely change. A test using \`getByLabel\` is robust to changes in the input's HTML structure, classes, or position.

**\`getByPlaceholder\` — Find inputs by their placeholder text:**

\`\`\`html
<input type="search" placeholder="Search products..." />
\`\`\`

\`\`\`typescript
await page.getByPlaceholder('Search products...').fill('laptop');
\`\`\`

Useful when an input has a placeholder but no proper \`<label>\`. Note that placeholders are sometimes localized — be careful with placeholder-based locators in multi-language apps.

---

### 4. \`getByTestId\` — Partnering With Developers

*💡 Analogy: \`getByTestId\` is like attaching a small invisible tag to an element with the test name on it. The element can change colour, position, or wording — the tag stays. But this only works if developers attach the tag in the first place.*

\`\`\`html
<button data-testid="checkout-submit">Place Order</button>
\`\`\`

\`\`\`typescript
await page.getByTestId('checkout-submit').click();
\`\`\`

**When to use \`getByTestId\`:**
- The button text changes based on context ("Place Order" vs "Confirm Purchase")
- Multiple buttons could match \`getByRole\` and you cannot easily disambiguate
- You're testing a custom component with no clear semantic role

**The golden rule:** \`getByTestId\` **requires developer cooperation**. Talk to your dev team. Add \`data-testid\` to:

| Element | When |
|---------|------|
| Critical action buttons | When text might change |
| Form submission buttons | Always |
| Toast / banner notifications | Always (text often varies) |
| Item lists | On the wrapper, so you can find a specific row |

**Don't use \`data-testid\` everywhere** — it's a fallback when semantic locators don't work. Overusing it ties tests to internal naming, defeating the purpose of user-facing locators.

---

### 5. CSS Selectors — Use Sparingly, And Only When Necessary

*💡 Analogy: A CSS selector is like finding someone by what they're wearing today. Works right now. Not stable.*

\`\`\`typescript
// CSS selector — uses the same syntax as CSS rules
await page.locator('.btn-primary').click();
await page.locator('#login-form').isVisible();
await page.locator('div.product-card > h2').textContent();
\`\`\`

**Why CSS selectors are fragile:**

- Class names exist for **styling**, not testing. Designers change them constantly.
- IDs are theoretically stable, but in modern frameworks (React, Vue) they're often auto-generated and change between deploys.
- Structural selectors (\`div > span:nth-child(3)\`) break when developers reorganise HTML.

**When CSS is actually OK:**
- Genuinely unique IDs: \`page.locator('#main-navigation')\`
- Targeting attributes that exist for testing: \`page.locator('[data-cy="..."]')\`
- Quick exploratory tests where stability isn't yet a concern

**Don't use XPath** unless absolutely no other strategy works. XPath is even more fragile than CSS, harder to read, and rarely necessary in Playwright. \`page.locator('//div/button[@class="submit"]')\` is a code smell.

---

### 6. Chaining Locators — Narrowing the Scope

*💡 Analogy: When searching a library, you don't scan every shelf. You go to the History section first, then narrow to "Roman Empire", then find the specific book. Chained locators do the same — start broad, narrow down.*

\`\`\`typescript
// Find the row in a user table where the name is "Alice", then click its Delete button
await page.getByRole('row', { name: 'Alice' })
          .getByRole('button', { name: 'Delete' })
          .click();
\`\`\`

**Why this is powerful:**

- The page might have **many** "Delete" buttons (one per row)
- You don't want to click the wrong one
- Chaining scopes the second search **inside** the first match

**Common patterns:**

\`\`\`typescript
// In a list of products, find the one with text "Wireless Mouse" and add to cart
await page.getByRole('listitem')
          .filter({ hasText: 'Wireless Mouse' })
          .getByRole('button', { name: 'Add to Cart' })
          .click();

// In a modal dialog, click the Confirm button
await page.getByRole('dialog')
          .getByRole('button', { name: 'Confirm' })
          .click();

// In the navigation, click the Profile link
await page.getByRole('navigation')
          .getByRole('link', { name: 'Profile' })
          .click();
\`\`\`

**\`.filter()\` — Narrowing by content:**

\`\`\`typescript
// All product cards
const allCards = page.getByRole('article');

// Only the card containing the text "On Sale"
const saleCard = allCards.filter({ hasText: 'On Sale' });

// Only the card NOT containing the text "Out of Stock"
const inStockCard = allCards.filter({ hasNotText: 'Out of Stock' });
\`\`\`

---

### 7. Locator Priority — The QA Decision Tree

*💡 Analogy: When you make a sandwich, there's an order of operations: bread, butter, fillings, top slice. Locators have an order of preference too. Following it produces tests that survive UI changes.*

**Use this priority order, top to bottom:**

| Priority | Locator | Use For |
|----------|---------|---------|
| 1 | \`getByRole\` | Buttons, links, headings, form fields |
| 2 | \`getByLabel\` | Form inputs with proper labels |
| 3 | \`getByPlaceholder\` | Inputs without labels but with placeholders |
| 4 | \`getByText\` | Static text content, error messages |
| 5 | \`getByTestId\` | When semantic locators won't disambiguate |
| 6 | \`page.locator(css)\` | Last resort — only for genuinely unique IDs |
| ❌ | XPath | Almost never |

**A real test, applying the priority:**

\`\`\`typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/checkout');

  // 1. getByLabel for form inputs
  await page.getByLabel('Card Number').fill('4242 4242 4242 4242');
  await page.getByLabel('Expiry').fill('12/25');
  await page.getByLabel('CVV').fill('123');

  // 2. getByRole for buttons
  await page.getByRole('button', { name: 'Pay Now' }).click();

  // 3. getByText for confirmation message
  await expect(page.getByText('Payment successful')).toBeVisible();
});
\`\`\`

Every locator in this test uses what a real user would describe. If the developer changes button styles, adds wrappers, or restructures the form — this test still passes.

**Test the test:** A good locator survives a frontend redesign. A bad locator breaks every sprint. The priority above is your shield against fragility.
        `
      },

      {
        id: 'pw-actions',
        title: 'Actions — Interacting With the Browser',
        analogy: "If locators are the eyes of your test, actions are the hands. Once Playwright has spotted a button, the action tells it what to do — click it, type into it, drag it. Modern Playwright actions are smart hands: they wait for the element to be ready (visible, stable, enabled) before acting, so you don't have to manually wait. This single feature eliminates 90% of the flakiness that plagued older automation tools.",
        lessonMarkdown: `
### 1. Navigation — Going to Pages

*💡 Analogy: \`page.goto()\` is like giving a taxi driver an address. The driver (the browser) gets you there, and you don't move on to the next instruction until you've actually arrived.*

\`\`\`typescript
// Basic navigation
await page.goto('https://example.com');

// Relative URL — uses the baseURL from playwright.config.ts
await page.goto('/login');

// Wait for a specific load event
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// Reload current page
await page.reload();

// Browser back / forward
await page.goBack();
await page.goForward();
\`\`\`

**The \`waitUntil\` option — what Playwright considers "loaded":**

| Value | Meaning |
|-------|---------|
| \`'load'\` (default) | The \`load\` event has fired (all resources loaded) |
| \`'domcontentloaded'\` | HTML parsed, but images/styles may not be ready |
| \`'networkidle'\` | No network requests for 500ms (good for SPAs) |
| \`'commit'\` | Just the response received — fastest, least safe |

For most pages, the default is correct. For Single Page Applications (React, Vue, Angular) where data fetches happen after page load, \`'networkidle'\` is often more reliable.

---

### 2. Clicking — The Most Common Action

*💡 Analogy: A click in Playwright is not "press a coordinate at x=400, y=200". It's "click this specific element, but only after verifying it's actually clickable". Auto-waiting handles a list of conditions you'd otherwise need to check manually.*

\`\`\`typescript
// Basic click
await page.getByRole('button', { name: 'Submit' }).click();

// Double-click
await page.getByRole('cell', { name: 'Edit me' }).dblclick();

// Right-click (opens context menu)
await page.getByText('File 1').click({ button: 'right' });

// Click while holding modifier keys
await page.getByText('File 1').click({ modifiers: ['Control'] });

// Click without auto-waiting (rarely needed)
await page.getByRole('button').click({ force: true });
\`\`\`

**What auto-waiting checks BEFORE every click:**

1. ✅ The element is **attached** to the DOM
2. ✅ The element is **visible** (not display:none, not hidden)
3. ✅ The element is **stable** (not moving / animating)
4. ✅ The element is **enabled** (not disabled)
5. ✅ The element is **not covered** by another element (like a modal)
6. ✅ The element receives **pointer events** (z-index, pointer-events:none)

If any check fails, Playwright **retries** for up to 30 seconds before failing the test. This single feature replaces dozens of manual sleeps and waitFor calls.

**\`force: true\`** — bypasses these checks. Use only when you genuinely need to click something covered, animating, or disabled. **It's almost always a code smell.**

---

### 3. Typing — \`fill\` vs \`type\`

*💡 Analogy: \`fill\` is like dictating to a stenographer — the whole text appears at once. \`type\` is like watching someone hunt-and-peck — character by character, with delays. For tests, fill is faster and more reliable. Use type only when simulating real user behaviour matters.*

**\`fill\` — Set the value of an input:**

\`\`\`typescript
await page.getByLabel('Email').fill('alice@test.com');
await page.getByLabel('Password').fill('Secret123!');
await page.getByLabel('Bio').fill('Multi\\\\nLine\\\\nText');
\`\`\`

\`fill\` clears the field first, then sets the new value in one operation. **This is what you should use 99% of the time.**

**\`type\` — Type character by character (slower):**

\`\`\`typescript
// Types each character with a 100ms delay
await page.getByLabel('Search').type('laptop', { delay: 100 });
\`\`\`

Use \`type\` only when you need to:
- Test autocomplete behaviour (suggestions appearing as you type)
- Test debounced input handlers
- Reproduce specific timing-sensitive bugs

**Clearing and pressing keys:**

\`\`\`typescript
// Clear an input
await page.getByLabel('Search').clear();

// Press a single key
await page.getByLabel('Email').press('Tab');
await page.getByRole('textbox').press('Enter');

// Keyboard shortcut
await page.keyboard.press('Control+A');
await page.keyboard.press('Escape');
\`\`\`

---

### 4. Form Controls — Checkboxes, Radios, Dropdowns

*💡 Analogy: Different form controls behave differently in real browsers. Playwright provides specific actions for each — \`check\` for checkboxes (always sets to checked), \`selectOption\` for dropdowns (selects by value or text), so you don't have to manually click and verify.*

**Checkboxes:**

\`\`\`typescript
// Check a checkbox (does nothing if already checked)
await page.getByLabel('Subscribe to newsletter').check();

// Uncheck
await page.getByLabel('Remember me').uncheck();

// Verify checked state
await expect(page.getByLabel('Subscribe')).toBeChecked();
\`\`\`

**Radio buttons:**

\`\`\`typescript
// Selecting a radio is the same as checking
await page.getByLabel('Standard shipping').check();
\`\`\`

**Dropdowns (\`<select>\` elements):**

\`\`\`typescript
// Select by visible label text
await page.getByLabel('Country').selectOption('United Kingdom');

// Select by value attribute
await page.getByLabel('Country').selectOption({ value: 'gb' });

// Select by index (0-based)
await page.getByLabel('Country').selectOption({ index: 5 });

// Multi-select dropdown — pass an array
await page.getByLabel('Tags').selectOption(['javascript', 'testing']);
\`\`\`

**Custom dropdowns (not real \`<select>\` — built with divs):**

Many modern UIs build their own dropdowns using divs and JavaScript (Material UI, Ant Design, custom React components). For these, you click to open then click an option:

\`\`\`typescript
// Open the custom dropdown
await page.getByRole('combobox', { name: 'Country' }).click();

// Click the desired option
await page.getByRole('option', { name: 'United Kingdom' }).click();
\`\`\`

---

### 5. Hover, Focus, and Keyboard

*💡 Analogy: Some UI features only reveal themselves on hover (tooltips, dropdown menus). Others activate on focus (input highlight). These actions simulate the in-between states between "doing nothing" and "clicking".*

\`\`\`typescript
// Hover — reveals tooltips and hover-only menus
await page.getByRole('link', { name: 'Help' }).hover();
await expect(page.getByText('Contact support')).toBeVisible();

// Focus an element (without clicking)
await page.getByLabel('Email').focus();

// Combined: focus then keyboard input
await page.getByLabel('Search').focus();
await page.keyboard.type('laptops');
await page.keyboard.press('Enter');

// Tab through elements
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');
\`\`\`

---

### 6. File Uploads and Downloads

*💡 Analogy: Uploading a file in a real browser opens a system dialog you can't automate. Playwright bypasses this by directly attaching the file to the input — no dialog needed.*

**Uploading a file:**

\`\`\`typescript
// Single file
await page.getByLabel('Upload Avatar').setInputFiles('./fixtures/avatar.png');

// Multiple files
await page.getByLabel('Upload Photos').setInputFiles([
  './fixtures/photo1.jpg',
  './fixtures/photo2.jpg',
]);

// Upload from buffer (in-memory file)
await page.getByLabel('Upload').setInputFiles({
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('hello world'),
});

// Clear the file input
await page.getByLabel('Upload').setInputFiles([]);
\`\`\`

**Downloading a file:**

\`\`\`typescript
// Wait for the download to start, capture it, save it
const downloadPromise = page.waitForEvent('download');
await page.getByRole('link', { name: 'Download Report' }).click();
const download = await downloadPromise;

// Save it to a known location
await download.saveAs('./downloads/report.pdf');

// Or get its temp path to verify content
console.log(await download.path());
\`\`\`

---

### 7. A Complete Real Login Flow

*Putting all actions together:*

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('user completes full registration and first purchase', async ({ page }) => {
  // 1. Navigate
  await page.goto('/register');

  // 2. Fill the registration form
  await page.getByLabel('Full Name').fill('Alice Tester');
  await page.getByLabel('Email').fill('alice+' + Date.now() + '@test.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByLabel('Confirm Password').fill('SecurePass123!');

  // 3. Select country (real <select> element)
  await page.getByLabel('Country').selectOption('United Kingdom');

  // 4. Agree to terms
  await page.getByLabel('I agree to the Terms').check();

  // 5. Submit
  await page.getByRole('button', { name: 'Create Account' }).click();

  // 6. Verify we landed on the dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Welcome, Alice' })).toBeVisible();

  // 7. Navigate to products
  await page.getByRole('link', { name: 'Shop' }).click();

  // 8. Search for a product
  await page.getByPlaceholder('Search products...').fill('wireless mouse');
  await page.keyboard.press('Enter');

  // 9. Add the first matching product to cart
  await page.getByRole('article').first()
    .getByRole('button', { name: 'Add to Cart' }).click();

  // 10. Open cart and verify
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByText('Wireless Mouse')).toBeVisible();
});
\`\`\`

This 30-line test exercises navigation, form filling, dropdown selection, checkboxes, button clicks, search input, and verification — every action you'll use in 90% of Playwright tests.
        `
      },

      {
        id: 'pw-assertions',
        title: 'Assertions — Verifying What the Browser Shows',
        analogy: "An assertion is the difference between a robot that types randomly on your keyboard and a QA engineer doing real testing. Without assertions, your test just clicks things — and a click that triggers a 500 error still 'succeeds' from the test's view. Assertions are the verification layer: they prove the application actually did what it was supposed to. Every test must end with at least one assertion. A test without assertions is not a test — it's a smoke check at best.",
        lessonMarkdown: `
### 1. Why Assertions Are the Heart of a Test

*💡 Analogy: A test without assertions is like a security camera that records but never plays back. You captured something happened — but did anyone verify what was captured was correct? Assertions are the playback that compares "what was supposed to happen" with "what actually happened".*

Look at this test that has **no assertions**:

\`\`\`typescript
// ❌ This 'test' tests nothing
test('user can place an order', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByLabel('Card Number').fill('4242424242424242');
  await page.getByRole('button', { name: 'Pay' }).click();
});
\`\`\`

**Problems:**
- Did the payment actually succeed? Unknown.
- Did the page show an error? We'd never know — the test passes either way.
- Was the order created in the database? Unknown.

**The same test, with assertions:**

\`\`\`typescript
// ✅ This test actually verifies behaviour
test('user can place an order', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByLabel('Card Number').fill('4242424242424242');
  await page.getByRole('button', { name: 'Pay' }).click();

  // ASSERTION: success message appears
  await expect(page.getByText('Order confirmed!')).toBeVisible();

  // ASSERTION: URL changed to confirmation page
  await expect(page).toHaveURL(/\\\\/orders\\\\/[a-z0-9]+/);

  // ASSERTION: order number is displayed
  await expect(page.getByTestId('order-number')).toContainText('Order #');
});
\`\`\`

**Every Playwright assertion starts with \`expect()\`** and is awaited:

\`\`\`typescript
await expect(<thing-to-check>).<matcher>(<expected-value>);
\`\`\`

---

### 2. Visibility Assertions — \`toBeVisible\` and \`toBeHidden\`

*💡 Analogy: These are the most common assertions because the most common QA question is "did this thing show up?". They handle CSS \`display:none\`, \`visibility:hidden\`, off-screen positioning, and zero opacity — all the ways an element can be technically present but not actually visible to a user.*

\`\`\`typescript
// Element is visible to the user
await expect(page.getByText('Welcome back')).toBeVisible();

// Element is hidden (not visible OR not in DOM)
await expect(page.getByRole('alert')).toBeHidden();

// Verifying a modal appeared
await page.getByRole('button', { name: 'Delete' }).click();
await expect(page.getByRole('dialog')).toBeVisible();
await expect(page.getByText('Are you sure?')).toBeVisible();

// Verifying the modal closed
await page.getByRole('button', { name: 'Cancel' }).click();
await expect(page.getByRole('dialog')).toBeHidden();
\`\`\`

**\`toBeVisible\` is smart:** it waits up to the configured timeout for the element to become visible. You don't need a manual wait — the assertion polls for you.

---

### 3. Content Assertions — \`toHaveText\`, \`toContainText\`, \`toHaveValue\`

*💡 Analogy: Sometimes you need to check exactly what an element says. \`toHaveText\` is a strict match — every character must be exactly right. \`toContainText\` is a fuzzy match — "does this text appear somewhere inside?" Use the strict version when content is fully predictable, the fuzzy version when it's dynamic.*

**\`toHaveText\` — Exact match:**

\`\`\`typescript
// Element's text must be EXACTLY this
await expect(page.getByTestId('cart-count')).toHaveText('3');
await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome back, Alice');

// Match against a regex
await expect(page.getByTestId('order-number')).toHaveText(/^Order #\\\\d+$/);
\`\`\`

**\`toContainText\` — Substring match:**

\`\`\`typescript
// Element's text contains this substring
await expect(page.getByRole('alert')).toContainText('Invalid email');

// Useful for messages that include dynamic data
await expect(page.getByTestId('confirmation')).toContainText('Order placed');
// (Even if the actual text is "Order placed successfully on 2026-01-15")
\`\`\`

**\`toHaveValue\` — For input field current value:**

\`\`\`typescript
// Verify the input field currently contains this value
await page.getByLabel('Email').fill('alice@test.com');
await expect(page.getByLabel('Email')).toHaveValue('alice@test.com');

// After form reset, value should be empty
await page.getByRole('button', { name: 'Reset' }).click();
await expect(page.getByLabel('Email')).toHaveValue('');
\`\`\`

**Important difference:** \`toHaveText\` reads what's RENDERED in the DOM. \`toHaveValue\` reads the current state of an \`<input>\`, \`<textarea>\`, or \`<select>\`.

---

### 4. State Assertions — Enabled, Disabled, Checked, Editable

*💡 Analogy: These check the "metadata" of an element — not what it shows, but what state it's in. A submit button that LOOKS clickable but is actually disabled would be a critical bug in a real product.*

\`\`\`typescript
// Element is enabled (not disabled)
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// Element is disabled
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();

// Checkbox / radio is checked
await expect(page.getByLabel('Subscribe to newsletter')).toBeChecked();

// Checkbox is NOT checked
await expect(page.getByLabel('Subscribe')).not.toBeChecked();

// Input field is editable (not readonly)
await expect(page.getByLabel('Email')).toBeEditable();

// Input has focus
await expect(page.getByLabel('Email')).toBeFocused();

// Element is empty (no children, no text)
await expect(page.getByTestId('empty-cart')).toBeEmpty();
\`\`\`

**The \`.not.\` modifier — negating any assertion:**

\`\`\`typescript
// All assertions can be negated
await expect(page.getByText('Error')).not.toBeVisible();
await expect(page.getByLabel('Email')).not.toHaveValue('');
await expect(page.getByRole('button')).not.toBeDisabled();
\`\`\`

---

### 5. Page-Level Assertions — URL and Title

*💡 Analogy: Sometimes the most important assertion is "did navigation succeed?" After clicking Login, the URL should change. After clicking a product, the page title should change. These are page-level, not element-level checks.*

\`\`\`typescript
// Exact URL match
await expect(page).toHaveURL('https://example.com/dashboard');

// Relative path match (uses baseURL)
await expect(page).toHaveURL('/dashboard');

// Regex pattern match (for dynamic URLs)
await expect(page).toHaveURL(/\\\\/orders\\\\/\\\\d+/);

// Page <title> tag content
await expect(page).toHaveTitle('Dashboard - MyApp');
await expect(page).toHaveTitle(/Dashboard/);
\`\`\`

**Real-world login verification:**

\`\`\`typescript
test('successful login redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('alice@test.com');
  await page.getByLabel('Password').fill('correctpass');
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify navigation succeeded
  await expect(page).toHaveURL('/dashboard');
  await expect(page).toHaveTitle('Dashboard - MyApp');
});
\`\`\`

---

### 6. Count Assertions — Counting Matched Elements

*💡 Analogy: When testing a list page, the question is often "how many results came back?" \`toHaveCount\` answers that — useful for search results, table rows, and dynamic lists.*

\`\`\`typescript
// Search returns exactly 5 results
await page.getByPlaceholder('Search').fill('laptop');
await page.keyboard.press('Enter');
await expect(page.getByRole('article')).toHaveCount(5);

// Cart should have 3 items
await expect(page.getByTestId('cart-item')).toHaveCount(3);

// No errors should be displayed
await expect(page.getByRole('alert')).toHaveCount(0);
\`\`\`

---

### 7. Soft Assertions — Continuing After Failure

*💡 Analogy: A normal assertion is like a fire alarm — when it triggers, everything stops immediately. A soft assertion is like a warning light — it records the failure but lets the test keep running, so you discover all problems in one run instead of fixing them one at a time.*

**Hard assertion (default) — stops on first failure:**

\`\`\`typescript
test('order summary is correct', async ({ page }) => {
  await page.goto('/order/123');

  // If this fails, the test stops here. The next 3 lines never run.
  await expect(page.getByText('Order #123')).toBeVisible();
  await expect(page.getByText('Total: $99.99')).toBeVisible();
  await expect(page.getByText('Shipping: $5.00')).toBeVisible();
});
\`\`\`

**Soft assertion — records failure, continues:**

\`\`\`typescript
test('order summary is correct', async ({ page }) => {
  await page.goto('/order/123');

  // All four assertions run, even if some fail
  await expect.soft(page.getByText('Order #123')).toBeVisible();
  await expect.soft(page.getByText('Total: $99.99')).toBeVisible();
  await expect.soft(page.getByText('Shipping: $5.00')).toBeVisible();

  // The test fails at the end if ANY soft assertion failed
  // But you see all 3 results in the report, not just the first failure
});
\`\`\`

**When to use soft assertions:**
- Verifying multiple independent fields on a page (order details, profile fields)
- You want to see ALL problems, not just the first
- The assertions don't depend on each other

**When NOT to use soft assertions:**
- Steps that depend on previous steps (no point checking text on page B if you couldn't navigate there)
- Critical preconditions (no point continuing if login failed)

---

### 8. The Built-in Retry Mechanism

*💡 Analogy: Network requests, animations, and async UI updates take time. Without retry, you'd need to manually wait for everything. Playwright's assertions automatically retry every ~50ms until they pass or hit the timeout — like a polite delivery driver who rings the doorbell every few seconds for 30 seconds before giving up.*

By default, Playwright assertions **automatically retry for up to 5 seconds**.

\`\`\`typescript
// This assertion will keep checking for up to 5 seconds
// Useful when an element appears asynchronously (after an API call)
await expect(page.getByText('Order placed')).toBeVisible();
\`\`\`

**Customising the timeout:**

\`\`\`typescript
// Wait up to 10 seconds for this specific assertion
await expect(page.getByText('Slow async result')).toBeVisible({ timeout: 10_000 });

// Or set a global default in playwright.config.ts:
expect: { timeout: 10_000 }
\`\`\`

**This is the magic that makes Playwright tests stable.** No \`waitForTimeout\`, no manual sleeps. The assertion itself waits as long as needed (within the timeout) for the condition to become true.

**\`waitFor\` for non-assertion waiting:**

\`\`\`typescript
// Wait for an element to be visible (without asserting)
await page.getByRole('alert').waitFor({ state: 'visible' });

// Wait for it to disappear
await page.getByRole('progressbar').waitFor({ state: 'hidden' });
\`\`\`

---

### 9. Putting It All Together — A Real Verification

\`\`\`typescript
test('checkout shows correct order summary', async ({ page }) => {
  // Setup: add a product and go to checkout
  await page.goto('/products');
  await page.getByRole('article').first()
    .getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();

  // VERIFY the page loaded
  await expect(page).toHaveURL('/checkout');
  await expect(page).toHaveTitle('Checkout - MyApp');

  // VERIFY the order summary displays
  const summary = page.getByTestId('order-summary');
  await expect(summary).toBeVisible();

  // Use soft assertions to see all problems at once
  await expect.soft(summary.getByText('Subtotal:')).toBeVisible();
  await expect.soft(summary.getByText('Shipping:')).toBeVisible();
  await expect.soft(summary.getByText('Total:')).toBeVisible();

  // VERIFY the submit button is initially disabled
  const submitButton = page.getByRole('button', { name: 'Place Order' });
  await expect(submitButton).toBeDisabled();

  // Fill required fields
  await page.getByLabel('Card Number').fill('4242424242424242');
  await page.getByLabel('Expiry').fill('12/25');
  await page.getByLabel('CVV').fill('123');

  // VERIFY the button is now enabled
  await expect(submitButton).toBeEnabled();

  // VERIFY the field values are correct
  await expect(page.getByLabel('Card Number')).toHaveValue('4242 4242 4242 4242');
});
\`\`\`

Eight different assertions, each verifying a specific real-world expectation. This is what production E2E test code looks like.
        `
      },

      {
        id: 'pw-config',
        title: 'playwright.config.ts — Configuring Your Test Suite',
        analogy: "Your tests are the play. The config is the stage manager — deciding which theatres (browsers) the play runs in, how long each act can be (timeouts), what to do if an actor forgets their line (retries), and what photos to take during the performance (screenshots, videos, traces). Without a stage manager, every show is chaos. With one, the production runs the same way every night, on every stage.",
        lessonMarkdown: `
### 1. Why a Config File Exists

*💡 Analogy: If every test had to declare which browser to use, what URL to start at, what timeout to apply — your test files would be 90% setup and 10% actual testing. The config file moves all that "how to run" knowledge to one place, so test files only describe "what to test".*

Without a config, every test would look like this:

\`\`\`typescript
// ❌ Without config — repetitive infrastructure noise
test('login works', async ({ page }) => {
  await page.goto('https://staging.myapp.com/login');  // hardcoded URL
  // ... test code ...
}, { timeout: 30000, retries: 2, browsers: ['chromium', 'firefox'] });
\`\`\`

With a config, the test focuses purely on what it tests:

\`\`\`typescript
// ✅ With config — test reads cleanly
test('login works', async ({ page }) => {
  await page.goto('/login');  // baseURL applied automatically
  // ... test code ...
});
\`\`\`

The config solves three problems:
1. **DRY (Don't Repeat Yourself)** — settings shared across all tests
2. **Environment switching** — different config for staging vs production
3. **Cross-browser execution** — run the same tests in Chrome AND Firefox AND Safari with one command

---

### 2. The Minimal Config — Required Fields Explained

*💡 Analogy: Like a rental car form, you can fill out 50 fields, but only a few are required to get on the road. Most teams need fewer than 10 lines of config to start running tests.*

\`\`\`typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',                    // Where your test files live
  timeout: 30_000,                       // 30 seconds per test
  retries: 0,                            // No automatic retry on failure
  use: {
    baseURL: 'http://localhost:3000',    // Prepended to relative URLs
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
\`\`\`

**Field-by-field meaning:**

| Field | What it does |
|-------|-------------|
| \`testDir\` | Folder Playwright searches for \`*.spec.ts\` files |
| \`timeout\` | Maximum milliseconds per test before forced failure |
| \`retries\` | How many times to retry a failed test before reporting failure |
| \`use\` | Defaults applied to every test in every project |
| \`use.baseURL\` | If you call \`page.goto('/foo')\`, it becomes \`baseURL + '/foo'\` |
| \`projects\` | One or more named test runs (typically: one per browser) |

---

### 3. \`baseURL\` — The Single Most Important Setting

*💡 Analogy: Hardcoded URLs in tests are like writing "123 Main Street, London" inside every email you send. If you move office, you rewrite every email. Use \`baseURL\` and you only update one line — every test follows.*

**Without baseURL:**

\`\`\`typescript
// ❌ Every test has the URL hardcoded
test('a', async ({ page }) => { await page.goto('https://staging.myapp.com/login'); });
test('b', async ({ page }) => { await page.goto('https://staging.myapp.com/users'); });
test('c', async ({ page }) => { await page.goto('https://staging.myapp.com/admin'); });

// To switch to production: edit every test file
\`\`\`

**With baseURL:**

\`\`\`typescript
// playwright.config.ts
use: { baseURL: 'https://staging.myapp.com' }

// Tests use relative paths
test('a', async ({ page }) => { await page.goto('/login'); });
test('b', async ({ page }) => { await page.goto('/users'); });
test('c', async ({ page }) => { await page.goto('/admin'); });

// To switch to production: change ONE line in config
\`\`\`

**Combining with environment variables:**

\`\`\`typescript
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
}

// Now run against any environment from the command line:
// BASE_URL=https://staging.myapp.com npx playwright test
// BASE_URL=https://prod.myapp.com npx playwright test
\`\`\`

---

### 4. Capturing Evidence — Screenshots, Videos, Traces

*💡 Analogy: When a flight crashes, the black box explains what happened in the final seconds. Playwright's trace files are the black box for your tests — capturing every action, every DOM snapshot, every network call. When a test fails on CI at 3 AM, the trace is your only evidence of what went wrong.*

\`\`\`typescript
use: {
  // Screenshot capture
  screenshot: 'only-on-failure',  // Only when test fails (recommended)

  // Video recording
  video: 'retain-on-failure',     // Record but discard if test passed

  // Trace recording (most powerful debugging tool)
  trace: 'on-first-retry',        // Record only when retrying after failure
}
\`\`\`

**Recommended values for each setting:**

| Setting | Value | Why |
|---------|-------|-----|
| \`screenshot\` | \`'only-on-failure'\` | Cheap to capture, invaluable for debugging |
| \`video\` | \`'retain-on-failure'\` | Records always but only saves on failure (cheap on success) |
| \`trace\` | \`'on-first-retry'\` | Heaviest to record — capture only when needed |

**The trace file is magic.** Open it with \`npx playwright show-trace trace.zip\` and you get:
- Timeline of every action (click, fill, navigation)
- DOM snapshot at each step
- Network requests with response bodies
- Console messages
- Screenshots before/after each action

This single file lets you debug a flaky test from a CI machine you've never seen.

---

### 5. \`projects\` — Running Across Multiple Browsers

*💡 Analogy: Imagine you wrote a play, and you wanted to perform it in three different theatres on three different nights. Each performance uses the same script (your tests) but different theatre (browser). \`projects\` is the schedule that books all three theatres at once.*

\`\`\`typescript
import { devices } from '@playwright/test';

projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'mobile-iphone',
    use: { ...devices['iPhone 14'] },
  },
  {
    name: 'mobile-android',
    use: { ...devices['Pixel 7'] },
  },
],
\`\`\`

**One command runs all five:**

\`\`\`bash
npx playwright test
# Runs every test 5 times — once per project
\`\`\`

**Run only one project:**

\`\`\`bash
npx playwright test --project=firefox
# Runs only the Firefox project
\`\`\`

**The \`devices\` import is gold.** Playwright ships with predefined device emulation: iPhone, iPad, Galaxy, Desktop variants. No need to manually specify viewport sizes, user agents, or touch capabilities — they're all baked in.

---

### 6. \`reporter\` — How Test Results Are Displayed

*💡 Analogy: After a football match, different audiences want different reports. The fans want a colour commentary. The coach wants stats. The TV station wants a summary clip. Playwright's reporters give different audiences the format they need — all from the same test run.*

\`\`\`typescript
reporter: [
  ['html'],            // HTML dashboard (the QA favourite)
  ['list'],            // Console-friendly progress (per-test status)
  ['junit', { outputFile: 'results.xml' }],  // For CI systems
],
\`\`\`

| Reporter | Best For |
|----------|----------|
| \`html\` | Local development — beautiful interactive dashboard |
| \`list\` | Watching tests run in the terminal — colourful progress |
| \`dot\` | Quick status — a dot per test, fits in narrow CI logs |
| \`json\` | Programmatic processing — pipe to other tools |
| \`junit\` | Jenkins, GitHub Actions, GitLab — XML format CI systems understand |
| \`github\` | GitHub Actions — adds annotations directly on PRs |

You can use **multiple reporters at once** (as shown above) — typical setup is HTML for humans + JUnit for CI.

---

### 7. A Complete, Annotated Production Config

\`\`\`typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ─── Test discovery ───
  testDir: './tests',
  testMatch: /.*\\\\.spec\\\\.ts$/,           // Only files ending in .spec.ts

  // ─── Timeouts ───
  timeout: 30_000,                       // 30s per test
  expect: { timeout: 5_000 },            // 5s for individual assertions

  // ─── Parallelism ───
  fullyParallel: true,                   // Run tests within files in parallel
  workers: process.env.CI ? 2 : undefined,  // Limit on CI to avoid overwhelming the server

  // ─── Retries ───
  retries: process.env.CI ? 2 : 0,       // Retry on CI only — local should fail fast
  forbidOnly: !!process.env.CI,          // Fail CI build if anyone left .only() in code

  // ─── Reporting ───
  reporter: [
    ['html', { open: 'never' }],         // Don't auto-open in CI
    ['junit', { outputFile: 'results.xml' }],
    ['list'],
  ],

  // ─── Defaults applied to every test ───
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,               // 10s per action (click, fill, etc.)
    navigationTimeout: 15_000,           // 15s for page.goto()
  },

  // ─── Browsers / projects ───
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // ─── Auto-start dev server ───
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
\`\`\`

This is what a **production-grade config** looks like. Every line solves a real problem QA engineers hit:

- \`process.env.CI\` checks adapt behaviour for CI vs local
- \`forbidOnly\` catches accidentally-committed \`.only()\` calls
- \`webServer\` auto-starts your app — no manual "remember to run npm start"
- \`actionTimeout\` per-action limit, separate from per-test timeout
- Three browsers cover 95% of real-world traffic

When you start a new Playwright project, copy this config, change the \`baseURL\`, and you're ready.
        `
      },

      {
        id: 'pw-running-tests',
        title: 'Running Tests & Reading the HTML Report',
        analogy: "Writing tests is half the job. Running them — and being able to read what happened when they failed — is the other half. Imagine cooking a beautiful meal but not knowing how to plate it for the customer. The CLI commands and the HTML report are how you serve your test results to your team, your manager, and (most importantly) your future self trying to debug a 3 AM failure.",
        lessonMarkdown: `
### 1. The Basic Run Command

*💡 Analogy: \`npx playwright test\` is the equivalent of "press play" on your test suite. It's the one command you'll run thousands of times in your QA career. Knowing its variations is like knowing keyboard shortcuts — they save hours.*

**Run all tests:**

\`\`\`bash
npx playwright test
\`\`\`

This runs every \`*.spec.ts\` file in your \`testDir\`, across every project (browser) defined in config, in parallel, in headless mode.

**What you see:**

\`\`\`
Running 24 tests using 5 workers
  ✓  [chromium] › tests/login.spec.ts:5:5 › successful login (1.2s)
  ✓  [chromium] › tests/login.spec.ts:15:5 › invalid password shows error (0.9s)
  ✗  [chromium] › tests/checkout.spec.ts:8:5 › can place order (5.1s)
  ✓  [firefox]  › tests/login.spec.ts:5:5 › successful login (1.5s)
  ...

  23 passed, 1 failed (12.4s)

To open last HTML report run:
  npx playwright show-report
\`\`\`

The colours, ticks, and crosses make scanning easy. Failed tests are also listed at the bottom with their error messages.

---

### 2. Filtering Tests — Running Just What You Need

*💡 Analogy: When fixing a specific bug, running the entire 200-test suite wastes time. Filtering is like a search-within-the-document feature — Ctrl+F for tests.*

**Run a single file:**

\`\`\`bash
npx playwright test tests/login.spec.ts
\`\`\`

**Run a single test by name (grep pattern):**

\`\`\`bash
npx playwright test -g "successful login"
# Runs only tests whose name matches "successful login"
\`\`\`

**Run by line number (run only the test starting at line 15):**

\`\`\`bash
npx playwright test tests/login.spec.ts:15
\`\`\`

**Run only one project (browser):**

\`\`\`bash
npx playwright test --project=chromium
# Skips firefox and webkit
\`\`\`

**Combine filters:**

\`\`\`bash
npx playwright test tests/login.spec.ts --project=chromium -g "invalid"
# One file, one browser, one matching test
\`\`\`

**Skipping flaky tests temporarily:**

In your code, use \`test.skip()\` or \`test.fixme()\`:

\`\`\`typescript
test.skip('flaky test', async ({ page }) => { /* ... */ });
test.fixme('known broken — will fix in TICKET-123', async ({ page }) => { /* ... */ });
\`\`\`

\`fixme\` is preferred over \`skip\` because it includes a reason that shows up in reports, reminding the team to fix it.

---

### 3. Headed Mode — Watching Tests Run

*💡 Analogy: Headless tests run invisibly, like a chef working in a closed kitchen. Headed mode opens the door and lets you watch the cooking happen. Slower, but invaluable when something looks wrong.*

\`\`\`bash
# Watch the tests run in a real visible browser window
npx playwright test --headed

# Watch ONE specific test run
npx playwright test tests/login.spec.ts -g "successful" --headed
\`\`\`

**When to use headed mode:**
- When a test fails and you can't tell why from the error message
- When developing a new test and verifying it does what you expect
- When demonstrating tests to a teammate or manager

**Don't run headed mode on CI** — there's no display attached, and it slows tests significantly.

**Slow motion — see each step pause:**

\`\`\`bash
npx playwright test --headed --slow-mo=500
# Each action waits 500ms — easy to follow visually
\`\`\`

---

### 4. Debug Mode — The Playwright Inspector

*💡 Analogy: Debug mode is like a movie director's edit suite. You can pause at any frame, step through one frame at a time, and inspect every detail. It opens a special UI alongside the browser where you can see exactly what Playwright is about to do.*

\`\`\`bash
npx playwright test --debug

# Or debug a single test:
npx playwright test tests/login.spec.ts -g "successful login" --debug
\`\`\`

**What \`--debug\` does:**

1. Opens the test in a real browser (always headed)
2. Launches the Playwright Inspector — a separate window
3. Pauses at the first action
4. Lets you step through actions one at a time
5. Shows the locator highlights on the page in real time
6. Lets you re-run any action

**The Inspector window has:**
- ▶️ **Resume** — continue running until next breakpoint
- ⏭️ **Step over** — execute the next action and pause
- ❌ **Cancel** — stop the test
- 🔍 **Pick locator** — click any element on the page to see what locator finds it

This is the **single most powerful tool** for diagnosing tricky failures. The first time you use it, you'll wonder how you ever debugged tests without it.

**Inserting a manual breakpoint:**

\`\`\`typescript
test('debug me', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('alice@test.com');

  await page.pause();  // Test pauses here when run with --debug

  await page.getByLabel('Password').fill('pass');
});
\`\`\`

---

### 5. The HTML Report — Your Manager's Dashboard

*💡 Analogy: The HTML report is to QA what a flight recorder review is to aviation accident investigation. After a test run completes, the HTML report has the complete history — every test, every screenshot, every trace, every error message — in a beautiful interactive format.*

**Open the report:**

\`\`\`bash
npx playwright show-report
\`\`\`

This opens a local web server (default port 9323) and launches your default browser at the dashboard.

**What the report shows:**

| Section | Content |
|---------|---------|
| **Summary bar** | X passed, Y failed, Z flaky |
| **Test list** | Every test with status, duration, and project |
| **Filters** | Show only failures, only flaky, by project |
| **Per-test detail** | Steps timeline, console logs, screenshots, video, trace |

**Clicking a failed test reveals:**

1. The exact error message and stack trace
2. The line of code that failed
3. A screenshot at the moment of failure
4. The video (if enabled)
5. A button to open the **trace viewer**

**The Trace Viewer — the killer feature:**

Click "Open Trace" and you get a full timeline. Hover over any action to see:
- The DOM snapshot before and after
- The locator that was used
- Network requests that fired during that action
- Console messages logged during that action
- Source code line number

If a test fails on CI, send your developer the \`trace.zip\` file — they can debug from their own laptop without re-running the test.

---

### 6. \`codegen\` — Recording Tests by Clicking

*💡 Analogy: Imagine recording a macro in Excel by demonstrating the steps once. \`codegen\` is exactly that for browser tests — you click around the actual website, and Playwright writes the test code for you in real time.*

\`\`\`bash
npx playwright codegen https://playwright.dev
# Or with your own site:
npx playwright codegen http://localhost:3000
\`\`\`

**What happens:**

1. A browser window opens at the URL
2. The Playwright Inspector opens alongside it
3. Every click, type, or assertion you make in the browser generates Playwright code
4. The code appears live in the Inspector — copy/paste it into your test file

**Why this is huge for QA productivity:**

- **No memorising syntax** for new APIs — record it, then refine
- **Best locators automatically** — codegen prefers \`getByRole\`, \`getByLabel\` (the priority we covered in Module 4)
- **Onboarding new QA engineers** — they can produce working tests on day one

**The workflow:**

\`\`\`bash
# 1. Record the happy path by clicking
npx playwright codegen http://localhost:3000

# 2. Copy the generated code into a new file
# 3. Refine: rename test, add assertions, parameterise data

# 4. Run it to verify
npx playwright test tests/new-test.spec.ts --headed
\`\`\`

**Important:** \`codegen\` is a **starting point**, not a finished product. Generated tests need refinement — adding assertions, using fixtures, removing redundant waits. Treat it as a draft that saves typing time.

---

### 7. Your Daily QA Workflow

A real day in the life of a Playwright user:

\`\`\`bash
# Morning: pull latest changes, run the full suite
git pull
npx playwright test

# Test failed — investigate
npx playwright show-report                # See which tests failed
# Click into the failed test, view the trace, identify the cause

# Reproduce locally with debug mode
npx playwright test tests/checkout.spec.ts -g "place order" --debug

# Find the bug, fix the test (or report a real bug to dev)
# Re-run just the affected file
npx playwright test tests/checkout.spec.ts

# Once green, run the full suite again to make sure nothing else broke
npx playwright test

# Commit and push
git add tests/
git commit -m "fix: update checkout test for new API response shape"
git push
\`\`\`

This is the loop. Master these commands and the HTML report, and you've mastered the operational side of Playwright. The actual test writing — Modules 1–7 — combined with this running and debugging workflow is what makes a productive QA automation engineer.
        `
      },

      {
        id: 'pw-auto-waiting',
        title: 'Auto-Waiting Deep Dive & Flakiness Prevention',
        analogy: "Think of Playwright's auto-waiting like an experienced surgeon scrubbing in before an operation. They don't just walk in and start cutting — they check that the patient is properly anaesthetised, positioned, and stable before making the first incision. Playwright checks the same checklist on every element before acting: is it in the DOM? Is it visible? Has it stopped moving? Only then does it act. Junior automation engineers who skip this understanding spend weeks fighting mysterious test failures that only happen 'sometimes'.",
        lessonMarkdown: `
## Auto-Waiting Deep Dive & Flakiness Prevention

Flaky tests are the number-one destroyer of trust in automation suites. A test that passes 8 times and fails twice is worse than a test that always fails — because it lies to you. The root cause of flakiness is almost always a **timing problem**, and Playwright's auto-waiting system is the solution. But only if you understand it deeply.

---

### 1. The Actionability Checklist — What Playwright Checks Before Every Action

*💡 Analogy: A pilot doesn't just push the throttle and hope for the best. Before takeoff, they run through a checklist: engines spinning, flaps set, clearance received, runway clear. Playwright runs the same systematic checklist on every element before it dares touch it.*

Playwright does NOT blindly click/fill/type on a locator the moment you call an action. It first runs through an **actionability check** — a series of conditions that must ALL be true before the action proceeds.

| Check | Description | Why it matters |
|-------|-------------|----------------|
| **Attached** | Element exists in the DOM | Can't click what doesn't exist |
| **Visible** | Element has a bounding box > 0, opacity > 0, not \`display:none\` | Can't click invisible elements |
| **Stable** | Element's position hasn't changed in 2 animation frames | Prevents clicking mid-animation |
| **Enabled** | Not \`disabled\` attribute on buttons/inputs | Can't interact with disabled controls |
| **Editable** | No \`readonly\`, not a \`<select>\` (for \`fill()\`) | \`fill()\` needs a writable field |
| **Receives events** | No overlay obscuring the element | Another element isn't stealing clicks |

**Which checks apply to which actions:**

| Action | Attached | Visible | Stable | Enabled | Editable | Receives Events |
|--------|----------|---------|--------|---------|----------|-----------------|
| \`click()\` | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| \`fill()\` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| \`check()\` | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| \`selectOption()\` | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| \`hover()\` | ✅ | ✅ | ✅ | — | — | — |
| \`focus()\` | ✅ | — | — | — | — | — |
| \`textContent()\` | ✅ | — | — | — | — | — |

**Practical example — the modal overlay trap:**
\`\`\`typescript
// ❌ This can fail if a loading spinner overlay is still visible
await page.getByRole('button', { name: 'Submit' }).click();

// Playwright waits automatically — but if the overlay never disappears,
// you get: "element is not visible because it is obscured by another element"
// That error is Playwright CORRECTLY telling you the UX is broken.
\`\`\`

> **QA Tip:** When you see "element is obscured" errors, don't work around them with force clicks. Investigate the overlay — it may be a real UX bug. \`{ force: true }\` skips actionability checks and should be a last resort.

---

### 2. waitForLoadState — 'load' vs 'domcontentloaded' vs 'networkidle'

*💡 Analogy: A restaurant opening has three stages. 'domcontentloaded' = the tables and chairs are set up. 'load' = the menus have been printed and placed. 'networkidle' = all the food deliveries have arrived, the kitchen is stocked, and no more trucks are pulling in. The right time to seat customers depends on which stage you actually need.*

After navigation, Playwright needs to know when the page is "ready enough" for your next action. There are three states:

**\`'domcontentloaded'\` — Fastest, riskiest**
- Fires when the HTML is parsed and the DOM is built
- CSS, images, scripts may still be loading
- \`<script defer>\` code hasn't run yet
- Use for: Very fast sanity checks on server-rendered pages where you only need DOM presence

\`\`\`typescript
await page.goto('/fast-page');
await page.waitForLoadState('domcontentloaded');
// DOM is ready, but JS framework may not have hydrated yet
\`\`\`

**\`'load'\` — The default, usually correct**
- Fires when the page plus all synchronous resources are loaded (images, CSS)
- The browser's native \`window.onload\` event
- Most actions are safe after this
- Use for: Most server-rendered pages, static sites, forms that don't use heavy JS

\`\`\`typescript
// 'load' is the default for page.goto() — this is equivalent:
await page.goto('/checkout');
await page.waitForLoadState('load'); // usually redundant but explicit
\`\`\`

**\`'networkidle'\` — Slowest, most thorough**
- Fires when there have been 0 network connections for 500ms
- Waits for background API calls, lazy-loaded content, analytics pings
- Use for: SPAs that load data via XHR/fetch on mount, dashboards with multiple API calls

\`\`\`typescript
// SPA example — the React component mounts and immediately fetches dashboard data
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
// Now the API responses have arrived and the charts have rendered
\`\`\`

**SPA vs Server-Rendered decision guide:**

| App Type | After Navigation | Recommended |
|----------|-----------------|-------------|
| Server-rendered (Rails, Django) | Page is fully rendered in HTML | \`'load'\` |
| SPA (React, Vue) with fetch-on-mount | JS runs, then fetches data | \`'networkidle'\` |
| SPA with aggressive lazy loading | Many async chunks loading | \`'networkidle'\` |
| Static site (Gatsby, Next.js SSG) | HTML complete, no API calls | \`'load'\` |

> **QA Tip:** \`'networkidle'\` can cause false timeouts on apps with polling (WebSockets, SSE, or setInterval API calls). In those cases, wait for a specific element instead.

---

### 3. waitForSelector vs Auto-wait — When Auto-wait Isn't Enough

*💡 Analogy: Auto-wait is like a patient dog sitting at the door waiting for you to come home. It waits the right amount of time and stops when you arrive. But if you want it to wait specifically until the pizza is delivered AND you're both home, you need to give it more specific instructions.*

Playwright's built-in auto-wait covers the common case perfectly. But there are scenarios where you need explicit control:

**When auto-wait IS enough (95% of cases):**
\`\`\`typescript
// Playwright waits for the button to be visible + enabled before clicking
await page.getByRole('button', { name: 'Load More' }).click();

// Playwright waits for the element to appear before asserting
await expect(page.getByText('Results loaded')).toBeVisible();
\`\`\`

**When you need explicit waitForSelector:**
\`\`\`typescript
// 1. Waiting for an element to DISAPPEAR (loading spinner)
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// 2. Waiting for an element that appears OUTSIDE the default timeout
await page.waitForSelector('[data-testid="report-generated"]', {
  state: 'visible',
  timeout: 60_000 // report generation takes up to 60 seconds
});

// 3. Waiting for a dynamic element when you need the handle for further work
const handle = await page.waitForSelector('.dynamic-row');
const text = await handle.textContent();
\`\`\`

**State options for waitForSelector:**

| State | Meaning |
|-------|---------|
| \`'attached'\` | Element is in the DOM (default) |
| \`'detached'\` | Element is NOT in the DOM |
| \`'visible'\` | Attached + visible |
| \`'hidden'\` | Either not in DOM or not visible |

\`\`\`typescript
// Wait for confirmation toast to appear, then disappear
await page.waitForSelector('.toast-success', { state: 'visible' });
await page.waitForSelector('.toast-success', { state: 'hidden' });
// Now safe to proceed — toast lifecycle is complete
\`\`\`

---

### 4. waitForFunction — Custom JS Conditions

*💡 Analogy: waitForFunction is like hiring a security guard who runs a custom check. Instead of checking the door (is the element visible?), you can tell them: "Check that the number on the scoreboard is above 1000 before letting anyone in." It evaluates your own JavaScript in the browser context.*

\`waitForFunction\` polls a JavaScript expression inside the browser until it returns a truthy value. This is the escape hatch for anything Playwright can't natively detect.

**Basic usage:**
\`\`\`typescript
// Wait until a global JavaScript variable is set (common in SPAs)
await page.waitForFunction(() => window.appReady === true);
\`\`\`

**Waiting for animation completion:**
\`\`\`typescript
// Wait until an element's CSS transform is finished (no 'translate' in style)
await page.waitForFunction(() => {
  const el = document.querySelector('.animated-panel');
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return !style.transform || style.transform === 'none' || style.transform === 'matrix(1, 0, 0, 1, 0, 0)';
});
\`\`\`

**Waiting for a specific DOM count:**
\`\`\`typescript
// Wait until exactly 10 rows appear in the table
await page.waitForFunction(() => {
  return document.querySelectorAll('table tbody tr').length === 10;
});
\`\`\`

**Passing arguments into the browser context:**
\`\`\`typescript
const expectedCount = 10;
await page.waitForFunction(
  (count) => document.querySelectorAll('table tbody tr').length === count,
  expectedCount // passed as the second argument
);
\`\`\`

**With timeout and polling options:**
\`\`\`typescript
await page.waitForFunction(
  () => window.dataLayer?.some(e => e.event === 'purchase'),
  undefined,
  { timeout: 10_000, polling: 500 } // check every 500ms, fail after 10s
);
\`\`\`

> **QA Tip:** Use \`waitForFunction\` when third-party scripts (analytics, tag managers) need to fire. \`window.dataLayer\` checks are a classic use case.

---

### 5. The waitForTimeout Anti-Pattern

*💡 Analogy: Using \`waitForTimeout\` is like setting your alarm for 3 hours before your flight "just to be safe." Sometimes you're early, sometimes the flight is delayed and you still miss it. It's a guess, not a guarantee. Real travellers track the flight status.*

\`await page.waitForTimeout(3000)\` is the most common mistake in automation. Here's why it's dangerous:

**Why it's a code smell:**
1. **It's brittle** — 3 seconds is fine on your laptop, too short on a loaded CI server
2. **It's wasteful** — on a fast day, you're waiting 3 seconds for something that was ready in 0.5 seconds
3. **It hides real bugs** — if the element takes 10 seconds, your test "passes" but is silently broken
4. **It scales badly** — 100 tests with one \`waitForTimeout(2000)\` = 200+ seconds of pure sleeping

**The wrong way vs the right way:**
\`\`\`typescript
// ❌ ANTI-PATTERN — hoping 2 seconds is enough
await page.click('#submit-btn');
await page.waitForTimeout(2000);
await expect(page.getByText('Success')).toBeVisible();

// ✅ CORRECT — wait for the condition you actually care about
await page.click('#submit-btn');
await expect(page.getByText('Success')).toBeVisible();
// Playwright waits up to the configured timeout, succeeds the moment it appears
\`\`\`

**Other replacements:**

| Instead of... | Use... |
|---------------|--------|
| Wait for page to load | \`waitForLoadState('networkidle')\` |
| Wait for element to appear | \`expect(locator).toBeVisible()\` |
| Wait for spinner to go | \`waitForSelector('.spinner', { state: 'hidden' })\` |
| Wait for API response | \`waitForResponse('/api/data')\` |
| Wait for URL change | \`waitForURL('/dashboard')\` |

**The one acceptable use — demo/presentation mode:**
\`\`\`typescript
// Intentionally slowing down for a screen recording / demo
test('demo mode checkout flow', async ({ page }) => {
  await page.goto('/shop');
  await page.waitForTimeout(1000); // Let audience see the page
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.waitForTimeout(500); // Pause for visual effect
});
\`\`\`

> **Team Rule:** If you see \`waitForTimeout\` in a PR review, ask "what are we actually waiting for?" — then replace it with the correct wait.

---

### 6. Diagnosing Flaky Tests — Trace Viewer & Retry Analysis

*💡 Analogy: A flight data recorder captures everything that happened before a crash. Playwright's trace viewer is that black box — every action, every network request, every screenshot, every console log, all timestamped and ready for post-mortem analysis.*

**Enabling traces in playwright.config.ts:**
\`\`\`typescript
export default defineConfig({
  use: {
    trace: 'on-first-retry', // capture trace only when test fails and retries
    // Options: 'off' | 'on' | 'on-first-retry' | 'retain-on-failure'
  },
  retries: 2, // retry failed tests up to 2 times
});
\`\`\`

**Viewing the trace:**
\`\`\`bash
npx playwright show-trace test-results/my-test/trace.zip
\`\`\`

**What to look for in the trace viewer:**

| Red flag | What it means |
|----------|---------------|
| Action happens before element is stable | Race condition — add explicit wait |
| Long gap between action and network call | JS was still booting — use \`networkidle\` |
| Element visible but action fails | Overlay or CSS \`pointer-events:none\` |
| Multiple retries with same timeout error | Timeout too short for this environment |
| Intermittent 401 responses in network tab | Auth state not properly set up in \`beforeEach\` |

**The retry pattern for flaky tests:**
\`\`\`typescript
// In playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // retry on CI, fail fast locally
});
\`\`\`

> **QA Tip:** Retries are a safety net, not a cure. If a test retries successfully more than 5% of the time, it has a real timing bug that needs fixing.

---

### 7. Practical Patterns — Combining Multiple Waits

*💡 Analogy: Landing a plane requires multiple confirmations simultaneously — cleared by ATC, runway lights on, gear down confirmed, airspeed correct. You don't check one and ignore the others. Professional automation does the same: wait for multiple conditions in parallel when they need to happen together.*

**waitForResponse after form submit:**
\`\`\`typescript
// The wrong way: click then wait
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForResponse('/api/profile'); // ❌ might miss it if API was instant

// The RIGHT way: set up the listener BEFORE the action
const responsePromise = page.waitForResponse('/api/profile');
await page.getByRole('button', { name: 'Save' }).click();
const response = await responsePromise; // ✅ guaranteed to catch it
expect(response.status()).toBe(200);
\`\`\`

**waitForURL after navigation:**
\`\`\`typescript
await page.getByRole('button', { name: 'Sign In' }).click();
// Wait for redirect to dashboard — handles slow SPA routing
await page.waitForURL('/dashboard', { timeout: 10_000 });
await expect(page.getByText('Welcome back')).toBeVisible();
\`\`\`

**Promise.all for parallel waits:**
\`\`\`typescript
// Simultaneously wait for both a network request AND a URL change
await Promise.all([
  page.waitForURL('/order-confirmation'),
  page.waitForResponse(resp => resp.url().includes('/api/orders') && resp.status() === 201),
  page.getByRole('button', { name: 'Place Order' }).click(),
]);
// Both conditions satisfied — now safe to assert
await expect(page.getByText('Order #')).toBeVisible();
\`\`\`

**Waiting for route to finish before asserting count:**
\`\`\`typescript
test('search returns correct count', async ({ page }) => {
  await page.goto('/search');

  // Set up response interceptor before typing
  const searchResponsePromise = page.waitForResponse(
    resp => resp.url().includes('/api/search') && resp.request().method() === 'GET'
  );

  await page.getByRole('searchbox').fill('playwright');
  await searchResponsePromise; // wait for the search API to complete

  // NOW the results are rendered — safe to count
  await expect(page.getByTestId('result-item')).toHaveCount(5);
});
\`\`\`

> **QA Rule:** For any test involving a form submit, navigation, or data fetch — set up the response/URL waiter BEFORE the triggering action. This is the single most impactful fix for flaky tests.
        `
      },

      {
        id: 'pw-fixtures-lifecycle',
        title: 'Test Fixtures & Lifecycle Hooks',
        analogy: "Fixtures are the mise en place of professional cooking — the prep work done before service starts. A Michelin-star kitchen doesn't chop the same onion fresh for every dish during service. The onion was prepped at 9am, portioned, and placed exactly where each chef needs it. beforeAll chops the onions once. beforeEach plates the mise en place for each dish. afterEach clears the pass after each plate. afterAll cleans the kitchen at end of service.",
        lessonMarkdown: `
## Test Fixtures & Lifecycle Hooks

Fixtures and lifecycle hooks are the scaffolding of a professional test suite. Without them, every test reinvents the wheel — logging in, seeding data, navigating to the right page — and every test file becomes a copy-paste nightmare. Master these patterns and your suite becomes elegant, maintainable, and fast.

---

### 1. The Four Lifecycle Hooks

*💡 Analogy: A theatre production has four types of crew calls. beforeAll = the stage crew who builds the set before opening night. beforeEach = the stagehands who reset the props before each performance. afterEach = the crew who clear the stage after every show. afterAll = the team that strikes the entire set when the run ends.*

Playwright's lifecycle hooks from \`@playwright/test\` control setup and teardown at different granularities:

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.beforeAll(async ({ browser }) => {
  // Runs ONCE before all tests in this file/describe block
  // Use for: creating shared browser contexts, seeding a test database,
  //          starting a local server, generating auth tokens
  console.log('Suite starting — running once');
});

test.beforeEach(async ({ page }) => {
  // Runs before EACH individual test
  // Use for: navigating to a known starting URL, clearing cookies,
  //          resetting application state
  await page.goto('/');
});

test.afterEach(async ({ page }, testInfo) => {
  // Runs after EACH individual test, even if the test failed
  // Use for: taking failure screenshots, clearing localStorage,
  //          logging test duration
  if (testInfo.status !== 'passed') {
    await page.screenshot({ path: \`failure-\${testInfo.title}.png\` });
  }
});

test.afterAll(async () => {
  // Runs ONCE after all tests in this file/describe block
  // Use for: closing database connections, stopping servers,
  //          cleaning up temporary files
  console.log('Suite complete — cleaning up');
});
\`\`\`

**Execution order with 2 tests:**
\`\`\`
beforeAll          ← runs once
  beforeEach       ← runs for test 1
    test 1
  afterEach        ← runs for test 1
  beforeEach       ← runs for test 2
    test 2
  afterEach        ← runs for test 2
afterAll           ← runs once
\`\`\`

> **QA Rule:** \`afterEach\` is your safety net — always clean up state there, because if you rely on \`beforeEach\` to clean up from the previous test, a test crash will leave dirty state that corrupts the next test.

---

### 2. test.describe() — Grouping Tests

*💡 Analogy: A test file is a chapter in a book. \`test.describe()\` is a section heading within that chapter. Sections help organise related content, and section-level hooks apply only to their subsection — just like a section's footnotes don't apply to the whole chapter.*

\`test.describe()\` groups related tests and allows scoped hooks:

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // only runs for tests in this describe
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('redirects to dashboard on success', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correctpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('/dashboard');
  });

  // NESTED describe — more specific scenario
  test.describe('with locked account', () => {
    test.beforeEach(async ({ page }) => {
      // Additional setup for this sub-group
      // (runs after the parent describe's beforeEach)
    });

    test('shows account locked message', async ({ page }) => {
      await page.getByLabel('Email').fill('locked@example.com');
      await page.getByLabel('Password').fill('anypassword');
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page.getByText('Account locked')).toBeVisible();
    });
  });
});
\`\`\`

**Nested hook execution order:**
\`\`\`
describe('Login page')
  beforeEach: goto('/login')
  describe('with locked account')
    beforeEach: [parent] goto('/login'), [child] additional setup
    test: 'shows account locked message'
\`\`\`

**Naming conventions:**
- Use noun phrases for describe: \`'Login page'\`, \`'Checkout flow'\`, \`'User profile'\`
- Use "should" or present-tense for tests: \`'redirects to dashboard'\`, \`'shows error message'\`

---

### 3. Built-in Playwright Fixtures

*💡 Analogy: Playwright's built-in fixtures are like a fully-equipped rental van. You don't build the van — you just request it, use it for your job, and return it. Playwright handles the engine start, fuel, and garage return.*

Playwright provides several fixtures automatically. You receive them as function parameters:

\`\`\`typescript
test('demonstrates built-in fixtures', async ({
  page,          // a fresh Page — use this 95% of the time
  browser,       // the Browser instance — for advanced multi-context tests
  browserContext,// the BrowserContext — for cookies, permissions, storage state
  request,       // APIRequestContext — for API-only tests without a browser page
}) => { ... });
\`\`\`

**When to use each:**

| Fixture | What it gives you | When to use |
|---------|-------------------|-------------|
| \`page\` | Single browser tab, fresh per test | Default for all UI tests |
| \`browserContext\` | Isolated session (cookies, localStorage) | Multi-tab tests, custom permissions |
| \`browser\` | The Browser object | Create multiple contexts in one test |
| \`request\` | HTTP client (no browser window) | Pure API tests, health checks |

\`\`\`typescript
// Using 'request' for a pure API test
test('creates user via API', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Alice', email: 'alice@test.com' }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toBeDefined();
});

// Using 'browserContext' to set up cookies before the page loads
test('skips onboarding for returning user', async ({ browserContext, page }) => {
  await browserContext.addCookies([{
    name: 'onboarding_complete',
    value: 'true',
    domain: 'localhost',
    path: '/',
  }]);
  await page.goto('/home');
  await expect(page.getByText('Welcome back!')).toBeVisible();
});
\`\`\`

---

### 4. Creating Custom Fixtures with test.extend()

*💡 Analogy: Built-in fixtures are the standard tools in a rented workshop — drill, saw, sandpaper. Custom fixtures are the specialised jigs and templates YOU build for your specific project. Once built, every team member can use them without knowing how they work internally.*

\`test.extend()\` is how you create your own reusable fixtures:

\`\`\`typescript
// fixtures/base.ts
import { test as base, expect } from '@playwright/test';

// Define the shape of your custom fixtures
type MyFixtures = {
  loginPage: Page; // a page already navigated to /login
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    // SETUP: runs before the test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Hand the fixture to the test
    await use(page);

    // TEARDOWN: runs after the test (even if it failed)
    // (any cleanup here)
  },
});

export { expect };
\`\`\`

\`\`\`typescript
// tests/login.spec.ts
import { test, expect } from '../fixtures/base';

test('shows login form', async ({ loginPage }) => {
  // loginPage is already at /login — no goto needed in the test
  await expect(loginPage.getByLabel('Email')).toBeVisible();
  await expect(loginPage.getByLabel('Password')).toBeVisible();
});
\`\`\`

**The \`use\` function is the boundary:** everything before \`use()\` is setup, everything after is teardown. This is how Playwright guarantees cleanup even on test failure.

---

### 5. Fixture Scoping: test vs worker

*💡 Analogy: 'test' scope is a disposable coffee cup — fresh for each person, thrown away after. 'worker' scope is the office coffee machine — set up once at the start of the day, shared by everyone who walks in, cleaned once at the end.*

Fixtures have two scopes that determine their lifecycle:

\`\`\`typescript
export const test = base.extend<{}, WorkerFixtures>({
  // 'test' scope (default): created fresh for every test
  authenticatedPage: async ({ page }, use) => {
    await loginViaUI(page); // runs before each test
    await use(page);
    // automatically cleaned up after each test
  },

  // 'worker' scope: created once per worker process, shared across tests
  dbConnection: [async ({}, use) => {
    const db = await Database.connect(process.env.TEST_DB_URL!);
    await use(db);
    await db.disconnect(); // called once when worker shuts down
  }, { scope: 'worker' }],
});
\`\`\`

**When to use each scope:**

| Scope | Lifecycle | Use for |
|-------|-----------|---------|
| \`'test'\` (default) | Per test | \`page\`, authenticated sessions, any mutable state |
| \`'worker'\` | Per worker process | Database connections, expensive server setup, read-only shared resources |

> **QA Tip:** Never put mutable state (like a logged-in page that tests write data to) in worker scope. Tests will pollute each other. Worker scope is only safe for read-only or connection-type resources.

---

### 6. Fixture Composition — One Fixture Depending on Another

*💡 Analogy: A fixture is like a recipe that can call other recipes. 'Beef Wellington' depends on the 'puff pastry' recipe. You don't make puff pastry inside the Wellington recipe — you declare it as a dependency and let the kitchen (Playwright) figure out the order.*

Fixtures can depend on other fixtures simply by requesting them as parameters:

\`\`\`typescript
// fixtures/auth.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  baseURL: string;
  authToken: string;
  loggedInPage: Page;
};

export const test = base.extend<AuthFixtures>({
  baseURL: async ({}, use) => {
    await use(process.env.BASE_URL || 'http://localhost:3000');
  },

  authToken: async ({ request, baseURL }, use) => {
    // Depends on 'baseURL' fixture — Playwright resolves order automatically
    const response = await request.post(\`\${baseURL}/api/auth/token\`, {
      data: { email: 'test@example.com', password: 'testpass' }
    });
    const { token } = await response.json();
    await use(token);
  },

  loggedInPage: async ({ page, baseURL, authToken }, use) => {
    // Depends on BOTH 'baseURL' and 'authToken'
    await page.goto(baseURL);
    await page.evaluate((token) => {
      localStorage.setItem('auth_token', token);
    }, authToken);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});
\`\`\`

\`\`\`typescript
// tests/dashboard.spec.ts
import { test, expect } from '../fixtures/auth';

test('shows user dashboard', async ({ loggedInPage }) => {
  // loggedInPage: Playwright automatically ran baseURL → authToken → loggedInPage
  await expect(loggedInPage.getByText('My Dashboard')).toBeVisible();
});
\`\`\`

---

### 7. Real-World Example — authFixture Used by Multiple Tests

*💡 Analogy: A master key that multiple team members use. You cut the key once, put it on a hook in reception, and every person who needs access grabs it before heading up. You don't re-cut the key for every person.*

Here is a complete, production-grade auth fixture pattern used across an entire test suite:

\`\`\`typescript
// fixtures/auth.ts — the complete implementation
import { test as base, expect, Page } from '@playwright/test';

interface AuthFixtures {
  loggedInPage: Page;
  adminPage: Page;
}

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page, request }, use) => {
    // Use the API for login — faster than UI, doesn't test the login form
    const response = await request.post('/api/auth/login', {
      data: { email: 'qa.user@company.com', password: process.env.QA_PASSWORD! }
    });
    expect(response.status()).toBe(200);
    const { token, userId } = await response.json();

    // Inject the session cookie so the browser is authenticated
    await page.context().addCookies([{
      name: 'session_token',
      value: token,
      domain: new URL(process.env.BASE_URL!).hostname,
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Verify authentication worked before handing to the test
    await expect(page.getByTestId('user-avatar')).toBeVisible({ timeout: 5000 });

    await use(page);

    // Teardown: clear the session
    await page.context().clearCookies();
  },

  adminPage: async ({ page, request }, use) => {
    // Separate fixture for admin-level access
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@company.com', password: process.env.ADMIN_PASSWORD! }
    });
    const { token } = await response.json();
    await page.context().addCookies([{
      name: 'session_token', value: token,
      domain: new URL(process.env.BASE_URL!).hostname, path: '/',
    }]);
    await page.goto('/admin');
    await use(page);
    await page.context().clearCookies();
  },
});

export { expect };
\`\`\`

\`\`\`typescript
// tests/profile.spec.ts — Test 1 uses loggedInPage
import { test, expect } from '../fixtures/auth';

test('can update display name', async ({ loggedInPage }) => {
  await loggedInPage.goto('/settings/profile');
  await loggedInPage.getByLabel('Display Name').fill('New Name');
  await loggedInPage.getByRole('button', { name: 'Save' }).click();
  await expect(loggedInPage.getByText('Profile updated')).toBeVisible();
});

// tests/orders.spec.ts — Test 2 also uses loggedInPage
import { test, expect } from '../fixtures/auth';

test('shows order history', async ({ loggedInPage }) => {
  await loggedInPage.goto('/orders');
  await expect(loggedInPage.getByTestId('order-row')).not.toHaveCount(0);
});

// tests/admin.spec.ts — Test 3 uses adminPage
import { test, expect } from '../fixtures/auth';

test('admin can delete a user', async ({ adminPage }) => {
  await adminPage.getByTestId('user-row').first().getByRole('button', { name: 'Delete' }).click();
  await expect(adminPage.getByText('User deleted')).toBeVisible();
});
\`\`\`

The auth logic lives in ONE place. If the login endpoint changes, you update the fixture — all three tests are fixed instantly.

> **QA Tip:** Store \`storageState\` (serialised auth) in a file using \`page.context().storageState()\` for even faster auth — Playwright restores the full authenticated browser state without any API calls.
        `
      },

      {
        id: 'pw-page-object-model',
        title: 'Page Object Model (POM)',
        analogy: "Imagine you run a nationwide restaurant chain with 50 locations. Every location has the same menu. Now suppose you want to rename 'Caesar Salad' to 'Classic Caesar'. Without a central system, you'd have to visit all 50 locations and update each menu individually. With a central menu management system, you update one record and all 50 locations reflect the change instantly. The Page Object Model is that central system for your test locators. When the 'Login' button changes its label, you update one line in LoginPage.ts — and all 50 tests that use it are instantly fixed.",
        lessonMarkdown: `
## Page Object Model (POM)

The Page Object Model is the most important design pattern in UI test automation. Without it, test suites rot the moment the application changes. With it, your tests stay maintainable as the app evolves. Every professional Playwright test suite uses POM.

---

### 1. The Maintenance Nightmare Without POM

*💡 Analogy: Imagine a plumber who hard-codes the pipe diameter into every junction in a building. When the building's specifications change, they have to re-cut every single junction. A professional uses standardised fittings — change the spec once, re-use the part everywhere.*

Here's what "no POM" looks like in practice. Your app has a login form tested across 5 different test files:

\`\`\`typescript
// tests/checkout.spec.ts
test('authenticated checkout', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill('user@test.com');
  await page.locator('input[name="password"]').fill('pass123');
  await page.locator('button[type="submit"]').click();
  // ... rest of test
});

// tests/profile.spec.ts
test('update profile', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill('user@test.com');
  await page.locator('input[name="password"]').fill('pass123');
  await page.locator('button[type="submit"]').click();
  // ... rest of test
});

// tests/orders.spec.ts, admin.spec.ts, settings.spec.ts ... same thing 3 more times
\`\`\`

Now the developer changes the submit button from \`type="submit"\` to \`data-testid="login-btn"\`. Result: **5 files to update, 5 potential errors**. In a real suite with 50 tests, this is 50 files to hunt down.

**With POM — the same scenario:**
\`\`\`typescript
// pages/LoginPage.ts — ONE place to update
get submitButton() { return this.page.getByTestId('login-btn'); } // ← fix here only
\`\`\`

All 50 tests that use \`LoginPage\` are fixed automatically. Zero hunting.

---

### 2. Anatomy of a Page Class

*💡 Analogy: A page object is like a TV remote control. The remote has named buttons (volume up, channel down) — you don't care which exact infrared code they transmit. The test says 'volumeUp()' and trusts the remote to do the right thing. Internal implementation details are hidden.*

A page object has four components:

\`\`\`typescript
import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  // 1. The page reference — injected via constructor
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 2. Locators as GETTERS — evaluated lazily each time they're called
  //    Never store locators as class fields initialised in the constructor —
  //    that would evaluate them before the page has even navigated.
  get emailInput(): Locator {
    return this.page.getByLabel('Email address');
  }

  get cardNumberInput(): Locator {
    return this.page.getByLabel('Card number');
  }

  get placeOrderButton(): Locator {
    return this.page.getByRole('button', { name: 'Place Order' });
  }

  get orderConfirmation(): Locator {
    return this.page.getByTestId('order-confirmation');
  }

  // 3. Action methods — higher-level operations composed of locator interactions
  async fillBillingDetails(email: string, cardNumber: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.cardNumberInput.fill(cardNumber);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  // 4. Navigation method — URL the page lives at
  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }
}
\`\`\`

\`\`\`typescript
// The test reads like business logic, not CSS selectors
test('completes checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.goto();
  await checkout.fillBillingDetails('user@test.com', '4111111111111111');
  await checkout.placeOrder();
  await expect(checkout.orderConfirmation).toBeVisible();
});
\`\`\`

---

### 3. Full Worked Example — LoginPage

*💡 Analogy: The LoginPage class is a doorman who knows the building inside and out. You tell the doorman 'let Alice in' and he handles the buzzer code, the lift access, the floor. The test doesn't know (or care) about those details.*

\`\`\`typescript
// pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get emailInput(): Locator {
    return this.page.getByLabel('Email');
  }

  get passwordInput(): Locator {
    return this.page.getByLabel('Password');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign In' });
  }

  get errorMessage(): Locator {
    return this.page.getByTestId('auth-error');
  }

  get forgotPasswordLink(): Locator {
    return this.page.getByRole('link', { name: 'Forgot your password?' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginExpectingError(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.errorMessage.waitFor({ state: 'visible' });
  }
}
\`\`\`

\`\`\`typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('logs in successfully', async ({ page }) => {
    await loginPage.login('user@example.com', 'correct-password');
    await page.waitForURL('/dashboard');
  });

  test('shows error for wrong credentials', async () => {
    await loginPage.loginExpectingError('user@example.com', 'wrong');
    await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
  });

  test('shows error message for empty email', async () => {
    await loginPage.loginExpectingError('', 'anypassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
\`\`\`

The test reads like a specification. No CSS selectors, no raw locators — just intent.

---

### 4. DashboardPage and Navigation Between Pages

*💡 Analogy: In a role-playing game, when you walk through a door you arrive in a new room with its own set of interactions. A page object can return another page object — login opens a door, and that door leads you to the DashboardPage room.*

A common pattern is for action methods to return the next page object they navigate to:

\`\`\`typescript
// pages/LoginPage.ts — modified to return DashboardPage
import { DashboardPage } from './DashboardPage';

export class LoginPage {
  // ... (locators as above)

  async loginAndProceed(email: string, password: string): Promise<DashboardPage> {
    await this.login(email, password);
    await this.page.waitForURL('/dashboard');
    return new DashboardPage(this.page);
  }
}
\`\`\`

\`\`\`typescript
// pages/DashboardPage.ts
import { type Page, type Locator } from '@playwright/test';
import { SettingsPage } from './SettingsPage';

export class DashboardPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get welcomeMessage(): Locator {
    return this.page.getByTestId('welcome-message');
  }

  get settingsLink(): Locator {
    return this.page.getByRole('link', { name: 'Settings' });
  }

  async goToSettings(): Promise<SettingsPage> {
    await this.settingsLink.click();
    await this.page.waitForURL('/settings');
    return new SettingsPage(this.page);
  }
}
\`\`\`

\`\`\`typescript
// Now the test reads like a user journey
test('navigates login → dashboard → settings', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const dashboard = await loginPage.loginAndProceed('user@example.com', 'pass');
  await expect(dashboard.welcomeMessage).toBeVisible();

  const settings = await dashboard.goToSettings();
  await expect(settings.profileSection).toBeVisible();
});
\`\`\`

This technique is called a **Fluent Page Object** — each action returns the next logical page.

---

### 5. Wiring POM into Fixtures

*💡 Analogy: Once you've built your page objects, wiring them into fixtures is like installing apps on a company phone. Every employee gets a phone with the right apps pre-installed. Nobody has to go to the App Store and install them manually.*

The professional pattern combines POM with Playwright fixtures for zero-boilerplate tests:

\`\`\`typescript
// fixtures/pages.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage; // pre-authenticated dashboard
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    // Log in via API (fast), then return DashboardPage
    const response = await page.request.post('/api/auth/login', {
      data: { email: 'user@example.com', password: process.env.TEST_PASSWORD! }
    });
    const { token } = await response.json();
    await page.context().addCookies([{
      name: 'session', value: token,
      domain: 'localhost', path: '/'
    }]);
    await page.goto('/dashboard');
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
\`\`\`

\`\`\`typescript
// tests/dashboard.spec.ts — zero boilerplate
import { test, expect } from '../fixtures/pages';

test('dashboard shows username', async ({ dashboardPage }) => {
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});

test('dashboard navigates to settings', async ({ dashboardPage }) => {
  const settings = await dashboardPage.goToSettings();
  await expect(settings.profileSection).toBeVisible();
});
\`\`\`

---

### 6. What Belongs in a Page Object vs the Test

*💡 Analogy: A cookbook (page object) contains techniques — how to chop an onion, how to make a roux. It does not say "serve at the chef's table on Tuesday". That's the menu (the test). Responsibilities must stay separate.*

| Concern | Belongs in Page Object? | Why |
|---------|------------------------|-----|
| Locators (how to find elements) | ✅ Yes | Changes to selectors stay in one place |
| Navigation methods (goto, click link) | ✅ Yes | Page knows its own URL |
| High-level action methods (login, addToCart) | ✅ Yes | Reusable across tests |
| Assertions (\`expect(locator).toBeVisible()\`) | ⚠️ Debated | Some teams add \`assertVisible()\` helpers |
| Test data (email addresses, passwords) | ❌ No | Data belongs in fixtures or test files |
| Hard-coded CSS selectors | ❌ No | Use \`getByRole\`, \`getByLabel\`, \`getByTestId\` |
| Test flow logic (\`if/else\` branching) | ❌ No | Tests should be linear and deterministic |

**The assertion debate:** Some teams put assertion helpers in page objects (\`async assertErrorVisible(): Promise<void>\`). The benefit: tests read more fluently. The risk: hiding assertion details makes failures harder to debug. Favour explicit \`expect()\` calls in tests.

---

### 7. Common Anti-Patterns

*💡 Analogy: Anti-patterns are the "just wing it" shortcuts that feel productive at first but create problems at scale — like using gaffer tape instead of welding a structural joint. It works until it doesn't.*

**Anti-pattern 1: The God Page Object**
\`\`\`typescript
// ❌ One page object for the ENTIRE application
class AppPage {
  loginEmailInput() { ... }
  dashboardWelcome() { ... }
  checkoutCardNumber() { ... }
  settingsDisplayName() { ... }
  // 200 methods...
}
// Fix: One page class per page/component
\`\`\`

**Anti-pattern 2: Assertions inside page objects**
\`\`\`typescript
// ❌ Test logic leaking into the page object
async login(email: string, password: string): Promise<void> {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  // This assertion belongs in the TEST, not here:
  await expect(this.page).toHaveURL('/dashboard');
}
// Fix: return from login(), let the test assert
\`\`\`

**Anti-pattern 3: Static locators (class fields, not getters)**
\`\`\`typescript
// ❌ Locator evaluated at construction time — before the page has loaded
export class LoginPage {
  // This locator is created when new LoginPage(page) is called
  // If the page hasn't navigated yet, this may reference stale DOM
  public emailInput = this.page.getByLabel('Email');

  constructor(private page: Page) {}
}

// ✅ Getter — locator evaluated fresh each time it's accessed
export class LoginPage {
  constructor(private page: Page) {}

  get emailInput() { return this.page.getByLabel('Email'); }
}
\`\`\`

**Anti-pattern 4: Hardcoded CSS selectors in page objects**
\`\`\`typescript
// ❌ Brittle — breaks when CSS class names change
get submitButton() { return this.page.locator('.btn-primary.submit-action'); }

// ✅ Semantic — survives CSS refactors
get submitButton() { return this.page.getByRole('button', { name: 'Sign In' }); }
// or
get submitButton() { return this.page.getByTestId('login-submit'); }
\`\`\`

> **QA Rule:** If a page object method starts with "click", "type", or "fill" — it's probably too low level. Page objects should expose business actions, not UI mechanics.
        `
      },

      {
        id: 'pw-network-interception',
        title: 'Network Interception & API Mocking',
        analogy: "Network interception is like being a postman with a photocopier. The app sends a letter (HTTP request) to the server, but you intercept it before it arrives. You can: read it and let it pass (spy), replace the reply with a fake letter (mock), or shred it before it arrives (abort). This gives you total control over what the frontend 'believes' the backend is saying — without touching the real backend at all. Testing a 500 error on production is dangerous; intercepting a request and returning a fake 500 is risk-free.",
        lessonMarkdown: `
## Network Interception & API Mocking

Network interception is one of Playwright's most powerful and underused features. It lets you test your frontend in conditions that are impossible or dangerous to create in a real environment — server errors, slow connections, offline mode, specific edge-case API responses — all without touching production data or infrastructure.

---

### 1. page.route() Fundamentals

*💡 Analogy: \`page.route()\` is a traffic warden standing at a road junction. Every vehicle (HTTP request) passes through. You define the junction's rules: wave everything through, divert lorries, stop specific vehicles entirely. The pattern you provide is the junction address.*

\`page.route()\` registers an interception handler. Any request matching the pattern will be handed to your callback instead of going to the real server.

**URL Pattern Types:**

\`\`\`typescript
// 1. Exact string match
await page.route('https://api.example.com/users', handler);

// 2. Glob pattern — ** matches any path segment
await page.route('**/api/users', handler);           // any domain, /api/users path
await page.route('**/api/**', handler);              // any domain, any /api/* path
await page.route('https://api.example.com/**', handler); // all requests to this domain

// 3. Regular expression — maximum power
await page.route(/\/api\/users\/\d+/, handler);     // /api/users/123, /api/users/456
await page.route(/\.(png|jpg|gif|svg)$/, handler);  // all image requests
\`\`\`

**The route handler callback — the route object methods:**

\`\`\`typescript
await page.route('**/api/products', async (route) => {
  const request = route.request();

  // Inspect the incoming request
  console.log('Method:', request.method());       // 'GET', 'POST', etc.
  console.log('URL:', request.url());             // full URL
  console.log('Headers:', request.headers());    // request headers object
  console.log('Body:', request.postData());       // request body (POST/PUT)

  // Then decide what to do:
  await route.fulfill({ ... });   // return a fake response
  await route.abort();            // simulate network failure
  await route.continue();         // let the request through (with optional modifications)
  await route.fallback();         // fall through to the next matching route handler
});
\`\`\`

**Removing a route handler (important in tests):**
\`\`\`typescript
// Routes persist for the lifetime of the page — unroute to clean up
await page.unroute('**/api/products');

// Or use a named handler function for selective removal
const handler = async (route) => { await route.fulfill({ status: 500 }); };
await page.route('**/api/products', handler);
// ... test ...
await page.unroute('**/api/products', handler); // remove only this handler
\`\`\`

> **QA Tip:** Always unroute or scope your routes to specific tests. Routes registered in \`beforeEach\` without cleanup in \`afterEach\` will affect subsequent tests unexpectedly.

---

### 2. fulfill() — Returning Fake Responses

*💡 Analogy: \`fulfill()\` is a forger who intercepts your letter and writes a convincing fake reply before you even knock on the real door. The application receives the reply and has no idea it never reached the real server. It looks and smells exactly like the real thing.*

\`route.fulfill()\` lets you return any response you want — status code, headers, body — all fabricated locally.

**Basic mock response:**
\`\`\`typescript
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Widget A', price: 9.99 },
      { id: 2, name: 'Widget B', price: 19.99 },
    ]),
  });
});
\`\`\`

**Using fixture files for complex mock data:**
\`\`\`typescript
// fixtures/products.json
// { "items": [...], "total": 42, "page": 1 }

import productsFixture from '../fixtures/products.json';

await page.route('**/api/products*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(productsFixture),
  });
});
\`\`\`

**Mocking with specific headers:**
\`\`\`typescript
await page.route('**/api/user/profile', async (route) => {
  await route.fulfill({
    status: 200,
    headers: {
      'content-type': 'application/json',
      'x-ratelimit-remaining': '0',      // test rate limit UI
      'cache-control': 'no-cache',
    },
    body: JSON.stringify({ id: 'user-123', name: 'Test User' }),
  });
});
\`\`\`

**Mocking from real response then modifying it:**
\`\`\`typescript
await page.route('**/api/products', async (route) => {
  // Let the real request go through first
  const response = await route.fetch();
  const body = await response.json();

  // Modify just one field
  body.items[0].price = 0.01; // test "free item" edge case

  await route.fulfill({
    response,         // inherit all original headers/status
    body: JSON.stringify(body),
  });
});
\`\`\`

---

### 3. abort() — Simulating Network Failures

*💡 Analogy: \`abort()\` is a saboteur who cuts the telephone line before your call connects. The app picks up the phone, dials, and hears nothing but silence — or a busy signal. This tests whether your application handles the absence of a network gracefully.*

\`route.abort()\` simulates network-level failures. This is essential for testing error handling — the UI responses to "the server is unreachable".

\`\`\`typescript
// Simulate complete network failure
await page.route('**/api/**', async (route) => {
  await route.abort(); // default error: 'failed'
});

await page.goto('/dashboard');
await expect(page.getByText('Unable to load data')).toBeVisible();
\`\`\`

**Error types for abort():**

| Error Type | Simulates |
|------------|-----------|
| \`'aborted'\` | Request was aborted client-side |
| \`'connectionrefused'\` | Server actively refused connection |
| \`'connectionreset'\` | Connection dropped mid-transfer |
| \`'internetdisconnected'\` | No network interface |
| \`'namenotresolved'\` | DNS lookup failure |
| \`'timedout'\` | Request timed out |
| \`'failed'\` | Generic failure (default) |

\`\`\`typescript
// Test DNS failure UI
await page.route('**/api/search', async (route) => {
  await route.abort('namenotresolved');
});
test('shows DNS error message', async ({ page }) => {
  await page.route('**/api/health', async (route) => {
    await route.abort('timedout');
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Connection timed out');
});
\`\`\`

**Selective abort — only abort specific requests:**
\`\`\`typescript
// Abort image requests to test performance degradation UX
await page.route(/\.(png|jpg|jpeg|gif|webp|svg)$/, async (route) => {
  await route.abort();
});
// Now test that alt text / placeholders render correctly
\`\`\`

---

### 4. continue() — Modifying Real Requests

*💡 Analogy: \`continue()\` is an interceptor who opens the letter, adds a PS, reseals it perfectly, and then delivers it to the real address. The recipient receives the real letter plus your modification. Neither sender nor receiver knows you touched it.*

\`route.continue()\` forwards the request to the real server, but lets you modify it first — changing headers, body, or URL.

**Adding an auth header to all API requests:**
\`\`\`typescript
await page.route('**/api/**', async (route) => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'Authorization': \`Bearer \${process.env.TEST_API_TOKEN}\`,
    },
  });
});
\`\`\`

**Logging all POST requests:**
\`\`\`typescript
await page.route('**/api/**', async (route) => {
  const request = route.request();
  if (request.method() === 'POST') {
    console.log(\`POST \${request.url()}\`);
    console.log('Payload:', request.postData());
  }
  await route.continue(); // pass through unchanged
});
\`\`\`

**Modifying the request body:**
\`\`\`typescript
await page.route('**/api/orders', async (route) => {
  if (route.request().method() === 'POST') {
    const originalBody = JSON.parse(route.request().postData() || '{}');
    // Inject a coupon code for testing
    const modifiedBody = { ...originalBody, couponCode: 'TEST_DISCOUNT_50' };
    await route.continue({
      postData: JSON.stringify(modifiedBody),
    });
  } else {
    await route.continue();
  }
});
\`\`\`

**Changing the request URL (redirect a request):**
\`\`\`typescript
// Point API calls at a staging environment instead of production
await page.route('https://api.production.com/**', async (route) => {
  const stagingUrl = route.request().url().replace(
    'api.production.com',
    'api.staging.com'
  );
  await route.continue({ url: stagingUrl });
});
\`\`\`

---

### 5. Testing Error States — Step-by-Step

*💡 Analogy: A fire drill doesn't start a real fire. Network interception is the fire drill for your application's error handling — you create the exact conditions of a disaster in total safety and verify the team responds correctly.*

**Testing a 500 Internal Server Error:**
\`\`\`typescript
test('shows error banner on server failure', async ({ page }) => {
  // Step 1: Mock the failing endpoint BEFORE navigation
  await page.route('**/api/dashboard/data', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  // Step 2: Navigate (the route mock is already active)
  await page.goto('/dashboard');

  // Step 3: Assert the error UI appears
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Something went wrong');

  // Step 4: Assert data is NOT displayed (no partial state)
  await expect(page.getByTestId('dashboard-chart')).not.toBeVisible();
});
\`\`\`

**Testing a 401 Unauthorised → redirect to login:**
\`\`\`typescript
test('redirects to login on 401', async ({ page }) => {
  await page.route('**/api/user/profile', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Unauthorised' }),
    });
  });

  await page.goto('/profile');

  // The frontend should detect the 401 and redirect
  await page.waitForURL('/login');
  await expect(page.getByText('Your session has expired')).toBeVisible();
});
\`\`\`

**Testing a 429 Rate Limit response:**
\`\`\`typescript
test('shows rate limit message after too many requests', async ({ page }) => {
  await page.route('**/api/search', async (route) => {
    await route.fulfill({
      status: 429,
      headers: { 'retry-after': '60' },
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Too many requests' }),
    });
  });

  await page.goto('/search');
  await page.getByRole('searchbox').fill('test query');
  await page.keyboard.press('Enter');

  await expect(page.getByText('Too many requests')).toBeVisible();
  await expect(page.getByText('Please wait 60 seconds')).toBeVisible();
});
\`\`\`

---

### 6. waitForRequest / waitForResponse — Asserting API Calls

*💡 Analogy: Rather than just testing the result, you put a sensor at the post box to confirm a specific letter was sent. \`waitForRequest\` is the post box sensor — it tells you exactly what was sent, to whom, and with what contents.*

Sometimes you need to verify that a network call was made with the correct payload — not just that the UI updated.

**waitForResponse — assert the right response was received:**
\`\`\`typescript
test('search sends correct query parameter', async ({ page }) => {
  await page.goto('/search');

  // Set up the waiter BEFORE the action that triggers the request
  const searchResponse = page.waitForResponse(
    response => response.url().includes('/api/search') && response.status() === 200
  );

  await page.getByRole('searchbox').fill('playwright testing');
  await page.keyboard.press('Enter');

  const response = await searchResponse;
  const url = new URL(response.url());
  expect(url.searchParams.get('q')).toBe('playwright testing');
});
\`\`\`

**waitForRequest — assert the right payload was sent:**
\`\`\`typescript
test('checkout sends correct order payload', async ({ page }) => {
  await page.goto('/checkout');

  // Listen for the POST request
  const orderRequest = page.waitForRequest(
    request => request.url().includes('/api/orders') && request.method() === 'POST'
  );

  await page.getByRole('button', { name: 'Place Order' }).click();

  const request = await orderRequest;
  const payload = JSON.parse(request.postData() || '{}');

  expect(payload).toMatchObject({
    items: expect.arrayContaining([
      expect.objectContaining({ productId: 'WIDGET-A', quantity: 2 })
    ]),
    shippingAddress: expect.objectContaining({ postcode: expect.any(String) })
  });
});
\`\`\`

**Promise.all — click + wait simultaneously:**
\`\`\`typescript
test('form submit triggers correct API and shows success', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Message').fill('Hello from Playwright');

  // Capture request and response simultaneously with the click
  const [request, response] = await Promise.all([
    page.waitForRequest('**/api/contact'),
    page.waitForResponse('**/api/contact'),
    page.getByRole('button', { name: 'Send Message' }).click(),
  ]);

  expect(response.status()).toBe(201);
  expect(JSON.parse(request.postData() || '{}')).toMatchObject({
    name: 'Test User',
    message: 'Hello from Playwright',
  });
  await expect(page.getByText('Message sent!')).toBeVisible();
});
\`\`\`

---

### 7. HAR Files — Recording & Replaying Real Traffic

*💡 Analogy: A HAR file is a flight data recorder for your browser's network activity. Every request and response is captured verbatim — status codes, headers, timing, bodies. You can then replay this recording in any future test, perfectly reproducing what the real server said.*

HAR (HTTP Archive) files capture real network traffic. This is invaluable for complex scenarios with many API calls — record once against real data, replay in tests forever.

**Recording a HAR file:**
\`\`\`bash
# Option 1: Use Playwright's built-in recorder
npx playwright open --save-har=fixtures/dashboard.har https://your-app.com/dashboard

# Option 2: Record during a test run
\`\`\`

\`\`\`typescript
// Option 2: Record programmatically in a test
test.only('record dashboard HAR', async ({ page, context }) => {
  await context.routeFromHAR('fixtures/dashboard.har', { update: true });
  await page.goto('/dashboard');
  // Interact normally — all real network traffic is recorded
  await page.waitForLoadState('networkidle');
  // HAR is saved when context closes
});
\`\`\`

**Replaying a HAR file in tests:**
\`\`\`typescript
test('dashboard loads correctly', async ({ page, context }) => {
  // Replay recorded traffic — no real server needed
  await context.routeFromHAR('fixtures/dashboard.har', {
    notFound: 'fallback', // let unmatched requests go to real network
  });

  await page.goto('/dashboard');
  await expect(page.getByTestId('revenue-chart')).toBeVisible();
  await expect(page.getByTestId('user-count')).toHaveText('1,247');
});
\`\`\`

**HAR routing options:**

| Option | Value | Behaviour |
|--------|-------|-----------|
| \`notFound\` | \`'abort'\` | Abort requests not in HAR (default) |
| \`notFound\` | \`'fallback'\` | Forward unmatched requests to real network |
| \`update\` | \`true\` | Re-record all matching requests to update HAR |
| \`url\` | glob/regex | Only route URLs matching this pattern from HAR |

**HAR for complex mocking scenarios:**
\`\`\`typescript
test('order history with paginated data', async ({ page, context }) => {
  // HAR recorded from a real session with 5 pages of orders
  await context.routeFromHAR('fixtures/order-history-paginated.har');
  await page.goto('/orders');

  // Navigate through all 5 pages — each API call served from the HAR
  for (let i = 1; i <= 5; i++) {
    await expect(page.getByTestId('order-row')).toHaveCount(20);
    if (i < 5) {
      await page.getByRole('button', { name: 'Next page' }).click();
      await page.waitForResponse('**/api/orders*');
    }
  }
});
\`\`\`

> **QA Tip:** HAR files are excellent for CI environments where the real backend is unavailable or unstable. Record the HAR once in a stable environment, commit it to your repository, and your CI pipeline never needs external API access to run the tests.

**Complete network interception strategy:**

| Scenario | Best tool |
|----------|-----------|
| Mock specific endpoint with simple data | \`route.fulfill()\` |
| Test error states (4xx, 5xx) | \`route.fulfill()\` with error status |
| Test network failure | \`route.abort()\` |
| Add auth headers globally | \`route.continue()\` |
| Assert correct payload was sent | \`waitForRequest()\` |
| Assert response triggered correct UI | \`waitForResponse()\` |
| Replay complex multi-request flows | HAR file replay |
| Spy on requests without changing them | \`route.continue()\` + log |
        `
      },

      {
        id: 'pw-advanced-locators',
        title: 'Advanced Locators & Filtering',
        analogy: "Finding an element on a complex web page is like finding one specific person in a stadium. Shouting a name works if there's only one person with that name. But what if there are 50 people named 'John'? You need to combine filters: 'the John wearing a red hat, sitting in section B, in the front row'. Playwright's advanced locator API is exactly that — chaining, filtering, and scoping until you've isolated the one element you mean, no matter how many look-alikes are around it.",
        lessonMarkdown: `
## Advanced Locators & Filtering

Basic locators work for simple pages. Real-world applications have tables, lists, cards, nested components, and dozens of similar-looking elements. Advanced locator techniques are what separate brittle automation from professional-grade test suites that survive redesigns.

---

### 1. .filter() — Narrow by Text or Child Element

*💡 Analogy: \`.filter()\` is like a bouncer with a checklist. The first locator lets in everyone matching the door policy ("all table rows"). \`.filter()\` then checks each person's ID against a second rule. Only those who pass both rules get through.*

\`.filter()\` narrows an existing locator by text content or by the presence of a child element. It is the right tool when you have many similar elements and need the one that matches specific criteria.

**Filter by visible text:**
\`\`\`typescript
// Many list items — get only the one containing "Playwright"
const playwrightItem = page.getByRole('listitem').filter({ hasText: 'Playwright' });
await playwrightItem.click();

// Case-insensitive with regex
const errorItem = page.getByRole('listitem').filter({ hasText: /error/i });
await expect(errorItem).toBeVisible();
\`\`\`

**Filter by child element using \`{ has: }\`:**
\`\`\`typescript
// Find the card that contains a "Sold Out" badge
const soldOutCard = page.getByTestId('product-card').filter({
  has: page.getByText('Sold Out'),
});
await expect(soldOutCard).toHaveCount(3);

// Find the table row that contains a specific status chip
const pendingRow = page.getByRole('row').filter({
  has: page.getByRole('status').filter({ hasText: 'Pending' }),
});
await pendingRow.getByRole('button', { name: 'Cancel' }).click();
\`\`\`

**Combining text + has filters:**
\`\`\`typescript
// Find the product card for "Widget Pro" that also has a "New" badge
const newWidgetPro = page.getByTestId('product-card')
  .filter({ hasText: 'Widget Pro' })
  .filter({ has: page.getByText('New') });

await expect(newWidgetPro).toBeVisible();
await newWidgetPro.getByRole('button', { name: 'Add to Cart' }).click();
\`\`\`

**\`hasNot\` — exclude by child:**
\`\`\`typescript
// All product cards that do NOT have a "Sold Out" badge
const availableCards = page.getByTestId('product-card').filter({
  hasNot: page.getByText('Sold Out'),
});
await expect(availableCards).toHaveCount(7);
\`\`\`

> **QA Tip:** \`.filter()\` does not throw if zero elements match — the resulting locator just has count 0. Always pair a filter with an assertion if you need to confirm something was found.

---

### 2. .nth(), .first(), .last() — Picking from Lists

*💡 Analogy: \`.nth()\` is the usher at a concert who says "you're in row 3, seat 4". The usher doesn't care who you are — just your position. This works perfectly for a stable seating chart. But in a dynamic app where rows reorder, indexing the third item today might select the wrong one tomorrow.*

**Basic usage:**
\`\`\`typescript
// First, last, by index
await page.getByRole('listitem').first().click();
await page.getByRole('listitem').last().click();
await page.getByRole('listitem').nth(2).click(); // 0-indexed: third item

// Count then access
const rows = page.getByRole('row');
const rowCount = await rows.count();
console.log(\`Found \${rowCount} rows\`);
\`\`\`

**Safe usage pattern in a product grid:**
\`\`\`typescript
test('add second product to cart', async ({ page }) => {
  await page.goto('/shop');

  // ✅ Safe: the second product card (0-indexed = index 1)
  const secondCard = page.getByTestId('product-card').nth(1);
  const productName = await secondCard.getByRole('heading').textContent();

  await secondCard.getByRole('button', { name: 'Add to Cart' }).click();

  // Verify cart shows the same product we clicked
  await expect(page.getByTestId('cart-item')).toContainText(productName!);
});
\`\`\`

**Why indexing is a last resort:**
\`\`\`typescript
// ❌ Brittle — if a promotional banner gets inserted above the list,
//    index 0 is now the banner, not the first product
await page.getByRole('listitem').first().click();

// ✅ Better — filter by what makes this item unique
await page.getByRole('listitem').filter({ hasText: 'Featured Product' }).click();
\`\`\`

> **QA Rule:** Prefer \`.filter()\` over \`.nth()\` whenever the element has distinguishing content. Use \`.nth()\` only when position itself is what you're testing (e.g., "the most recently added item appears at the top").

---

### 3. Scoped Locators — locator.locator()

*💡 Analogy: Scoping a locator is like narrowing a search from "find a 'Delete' button anywhere in the building" to "find a 'Delete' button specifically in office 3B". The building search might return 20 results. The scoped search returns exactly the one you mean.*

\`locator.locator()\` searches for elements within the bounds of an already-found element. This is the correct way to interact with repeated UI patterns like tables, cards, and form sections.

**Interacting with a specific table row:**
\`\`\`typescript
// Find the row for user "Alice", then click her Edit button
const aliceRow = page.getByRole('row', { name: /Alice/ });
await aliceRow.getByRole('button', { name: 'Edit' }).click();

// Verify the modal shows Alice's data
await expect(page.getByRole('dialog')).toContainText('Alice');
\`\`\`

**Working inside a card component:**
\`\`\`typescript
// A product listing with multiple cards — each has its own price and Add to Cart button
const card = page.getByTestId('product-card').filter({ hasText: 'Noise-Cancelling Headphones' });

// All lookups are scoped to THIS card
const price = await card.getByTestId('price').textContent();
const rating = await card.getByRole('img', { name: /stars/ }).getAttribute('aria-label');
await card.getByRole('button', { name: 'Add to Cart' }).click();
\`\`\`

**Form section scoping:**
\`\`\`typescript
// A complex form with a "Billing Address" and a "Shipping Address" section
const billingSection = page.getByRole('group', { name: 'Billing Address' });
const shippingSection = page.getByRole('group', { name: 'Shipping Address' });

// Fill billing independently from shipping — no ambiguity
await billingSection.getByLabel('Street').fill('10 Downing Street');
await billingSection.getByLabel('City').fill('London');

await shippingSection.getByLabel('Street').fill('221B Baker Street');
await shippingSection.getByLabel('City').fill('London');
\`\`\`

**Why this beats CSS descendant selectors:**
\`\`\`typescript
// ❌ Fragile CSS descendant — hard to read, breaks with DOM changes
await page.locator('.product-card:has-text("Headphones") .btn-add-to-cart').click();

// ✅ Scoped locators — readable, semantic, resilient
const card = page.getByTestId('product-card').filter({ hasText: 'Headphones' });
await card.getByRole('button', { name: 'Add to Cart' }).click();
\`\`\`

---

### 4. getByRole() with Options — Complete Reference

*💡 Analogy: \`getByRole()\` is like the front desk of a hotel. You don't ask "where is the rectangular piece of wood with a metal handle" — you ask "where is the door to room 204?". Role names describe purpose, not appearance. This is exactly how assistive technologies (screen readers) navigate, which means good roles = accessible + testable.*

**The \`name\` option — matching accessible name:**
\`\`\`typescript
// Buttons — matches text, aria-label, or aria-labelledby
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('button', { name: /save/i }).click();          // regex, case-insensitive
await page.getByRole('button', { name: 'Close dialog' }).click();   // aria-label

// Links
await page.getByRole('link', { name: 'Learn more about pricing' }).click();

// Headings
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
\`\`\`

**The \`level\` option — for headings:**
\`\`\`typescript
// Specifically an h1, not any heading
await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();

// h2 for section headings
const sectionHeadings = page.getByRole('heading', { level: 2 });
await expect(sectionHeadings).toHaveCount(4);
\`\`\`

**The \`checked\`, \`pressed\`, \`expanded\` options:**
\`\`\`typescript
// Find a checked checkbox
const checkedBoxes = page.getByRole('checkbox', { checked: true });
await expect(checkedBoxes).toHaveCount(2);

// Find an expanded accordion section
const openSection = page.getByRole('button', { expanded: true });
await expect(openSection).toContainText('Delivery Options');

// Find a pressed toggle button
const activeFilter = page.getByRole('button', { pressed: true });
await expect(activeFilter).toHaveText('Price: Low to High');
\`\`\`

**Full reference table:**

| Option | Type | Matches |
|--------|------|---------|
| \`name\` | string / regex | Accessible name (text, aria-label, aria-labelledby) |
| \`level\` | number | Heading level (1–6) |
| \`checked\` | boolean | Checkbox/radio checked state |
| \`pressed\` | boolean | Toggle button pressed state |
| \`expanded\` | boolean | Accordion/menu expanded state |
| \`disabled\` | boolean | Whether element is disabled |
| \`selected\` | boolean | Whether option is selected |
| \`exact\` | boolean | Exact name match (default: false = substring) |

---

### 5. Chaining Multiple Filters

*💡 Analogy: Chaining filters is like GPS routing with waypoints. Each filter narrows you down one step closer to your destination. "In London" → "In Westminster" → "On Baker Street" → "Number 221B". Each step is clear, each is independently debuggable.*

**Building a query step by step — readable style:**
\`\`\`typescript
// Readable: each step on its own line, clearly commented
const orderRows = page.getByRole('row');                        // all table rows
const pendingOrders = orderRows.filter({ hasText: 'Pending' }); // only Pending rows
const highValuePending = pendingOrders.filter({                 // only > £500
  has: page.getByTestId('order-value').filter({ hasText: /£[5-9]\d{2}|£[1-9]\d{3}/ })
});

await expect(highValuePending).toHaveCount(2);
\`\`\`

**Compact style for simple cases:**
\`\`\`typescript
// Compact: one expression, still readable
await page.getByRole('listitem')
  .filter({ hasText: /In Progress/ })
  .filter({ has: page.getByRole('button', { name: 'Assign' }) })
  .first()
  .getByRole('button', { name: 'Assign' })
  .click();
\`\`\`

**Debugging chained locators — count at each step:**
\`\`\`typescript
// When a chained locator returns 0 or more than expected, debug step by step
const allCards = page.getByTestId('product-card');
console.log('All cards:', await allCards.count());

const saleCards = allCards.filter({ hasText: 'Sale' });
console.log('Sale cards:', await saleCards.count());

const saleInStock = saleCards.filter({ hasNot: page.getByText('Out of Stock') });
console.log('Sale + in stock:', await saleInStock.count());
// Find where the count goes wrong, then investigate that filter
\`\`\`

---

### 6. Shadow DOM Piercing

*💡 Analogy: Shadow DOM is like a government building with its own internal security system. The public entrance (main DOM) is accessible to everyone. But inside, departments have their own locked corridors (shadow roots). A visitor (your locator) who tries to walk through a locked door gets stopped — unless they know the right override.*

Modern web components (e.g., custom elements built with Lit, Stencil, or native web components) use Shadow DOM to encapsulate their internals. Regular locators cannot see inside.

**What fails with Shadow DOM:**
\`\`\`typescript
// ❌ Fails — the input is inside a shadow root, invisible to regular DOM queries
await page.locator('my-custom-input input').fill('test');
// Error: locator is not attached to DOM
\`\`\`

**Playwright's native Shadow DOM piercing:**
\`\`\`typescript
// ✅ Playwright's getBy* locators pierce shadow DOM automatically in most cases
await page.getByLabel('Email').fill('user@test.com');
await page.getByRole('button', { name: 'Submit' }).click();
\`\`\`

**CSS >>> (deprecated) vs locator piercing:**
\`\`\`typescript
// Old approach (still works but avoid in new code)
await page.locator('my-input >>> input').fill('test');

// Modern approach — CSS :host() and descendant combinators
await page.locator('my-custom-form').locator('input[type="email"]').fill('test');
\`\`\`

**Using frameLocator for embedded web components:**
\`\`\`typescript
// If the shadow component renders in its own frame context
const componentFrame = page.frameLocator('my-widget-frame');
await componentFrame.getByRole('button', { name: 'Submit' }).click();
\`\`\`

> **QA Tip:** When facing Shadow DOM issues, check the accessibility tree first (\`npx playwright codegen\` shows accessible names even through shadow roots). If \`getByRole\` and \`getByLabel\` don't work, the component has broken accessibility — that's a bug worth reporting, not a locator problem to work around.

---

### 7. ElementHandle vs Locator

*💡 Analogy: An ElementHandle is like taking a photograph of someone in a crowd. The photo is frozen in time — if the person moves, your photo still shows the old position. A Locator is like following a GPS tracker attached to the person — it always knows where they are right now, even after they've moved.*

Playwright has two ways to reference elements: the modern \`Locator\` API and the legacy \`ElementHandle\` API. Always prefer Locator.

**Why Locators are superior:**
\`\`\`typescript
// ElementHandle — snapshot in time, can go stale
const handle = await page.$('. product-card'); // returns ElementHandle or null
await page.reload(); // DOM is re-rendered
await handle!.click(); // ❌ Might fail: "element is detached from document"

// Locator — re-queries the DOM on every action
const card = page.locator('.product-card'); // returns Locator immediately
await page.reload(); // DOM is re-rendered
await card.click(); // ✅ Re-queries DOM fresh, finds the new element
\`\`\`

**The re-querying advantage in detail:**
\`\`\`typescript
// Locator waits, retries, and re-queries automatically
const submitBtn = page.getByRole('button', { name: 'Submit' });

// Even if the button is temporarily hidden during a loading state,
// Locator will keep polling until it becomes clickable (up to timeout)
await submitBtn.click(); // auto-waits for visibility + enabled
\`\`\`

**When ElementHandle is forced on you:**
\`\`\`typescript
// Legacy browser automation APIs sometimes return ElementHandles
// Convert to Locator where possible
const handles = await page.$$('.legacy-item'); // returns ElementHandle[]
for (const handle of handles) {
  // Must use handle methods — Locator methods not available here
  const text = await handle.textContent();
  console.log(text);
}

// Modern equivalent — always prefer this
const items = page.locator('.legacy-item');
const count = await items.count();
for (let i = 0; i < count; i++) {
  const text = await items.nth(i).textContent();
  console.log(text);
}
\`\`\`

**Summary comparison:**

| Feature | Locator | ElementHandle |
|---------|---------|---------------|
| Re-queries DOM on each action | ✅ Yes | ❌ No (stale) |
| Built-in auto-waiting | ✅ Yes | ❌ No |
| Works with \`expect()\` | ✅ Yes | ❌ Limited |
| Chainable | ✅ Yes | ❌ No |
| Recommended | ✅ Always | ⚠️ Legacy only |

> **QA Rule:** Never use \`page.$\` or \`page.$$\` in new test code. If you see them in a codebase, migrate to the Locator API. The improvement in reliability is immediate and significant.
        `
      },

      {
        id: 'pw-ui-interactions',
        title: 'Real-World UI Interactions',
        analogy: "Testing real-world UI elements is like being a driving examiner. A learner who only practises in an empty car park can go forward and backward — but put them in a city with roundabouts, traffic lights, pedestrian crossings, parallel parking and a manual gearbox and they freeze. Most QA engineers learn to click and type. This module is city driving: every control on the dashboard, every road sign, every real-world scenario you will encounter testing enterprise apps.",
        lessonMarkdown: `
## Real-World UI Interactions

Playwright gives you a toolkit that mirrors how a real user interacts with a browser. But enterprise apps are full of controls that go far beyond simple clicks and fills — custom dropdowns, drag-and-drop kanban boards, rich text editors, range sliders. This module covers every major UI control you will encounter and the exact Playwright API to tame each one.

---

### 1. Checkboxes — Check, Uncheck & Verify State

*💡 Analogy: A checkbox is like a light switch — but some switches are wired to dimmers that have a third "partially on" state. Knowing which type of switch you're dealing with determines how you flip it.*

#### The three methods

\`\`\`typescript
// check() — ensures it is checked (idempotent: safe to call even if already checked)
await page.getByLabel('Accept terms and conditions').check();

// uncheck() — ensures it is unchecked (idempotent)
await page.getByLabel('Receive marketing emails').uncheck();

// setChecked(bool) — explicit intent: the cleanest option when state varies
await page.getByLabel('Enable 2FA').setChecked(true);
await page.getByLabel('Remember this device').setChecked(false);
\`\`\`

**Use \`check()\` / \`uncheck()\` when you know the desired final state.**
**Use \`click()\` only when you explicitly need to toggle — e.g., verifying that clicking twice restores original state.**

#### Asserting checked state

\`\`\`typescript
await expect(page.getByLabel('Accept terms and conditions')).toBeChecked();
await expect(page.getByLabel('Receive marketing emails')).not.toBeChecked();
\`\`\`

#### Indeterminate state (select-all with partial children)

The "Select All" checkbox in a table that shows a dash (−) when only some rows are selected is in an **indeterminate** state. Playwright has no built-in assertion for this, so use \`evaluate()\`:

\`\`\`typescript
const isIndeterminate = await page.getByLabel('Select all rows').evaluate(
  (el: HTMLInputElement) => el.indeterminate
);
expect(isIndeterminate).toBe(true);
\`\`\`

#### Custom styled checkboxes

Many design systems hide the native \`<input type="checkbox">\` and style a \`<div>\` instead. Playwright's \`check()\` works through the accessibility tree, so it will still find and trigger the hidden native input — as long as the custom element has the correct \`role="checkbox"\` and \`aria-checked\` attribute.

If the custom checkbox has no ARIA attributes, \`check()\` will fail with "element is not a checkbox." Use \`{ force: true }\` to click the visible element directly:

\`\`\`typescript
// Last resort — only when no ARIA attributes and locator is the visible styled element
await page.locator('.custom-checkbox[data-id="gdpr"]').click({ force: true });
\`\`\`

#### Full example: cookie consent banner

\`\`\`typescript
test('cookie consent — accept analytics, reject marketing', async ({ page }) => {
  await page.goto('https://example.com');

  // Wait for consent banner to appear
  const banner = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(banner).toBeVisible();

  // Verify defaults
  await expect(banner.getByLabel('Strictly necessary')).toBeChecked();
  await expect(banner.getByLabel('Analytics cookies')).not.toBeChecked();
  await expect(banner.getByLabel('Marketing cookies')).not.toBeChecked();

  // Set preferences
  await banner.getByLabel('Analytics cookies').check();
  await banner.getByLabel('Marketing cookies').uncheck(); // already unchecked — safe

  // Save preferences
  await banner.getByRole('button', { name: 'Save preferences' }).click();

  // Verify banner is gone
  await expect(banner).toBeHidden();
});
\`\`\`

> **QA Tip:** Always verify the default state of checkboxes before interacting. A regression where a consent checkbox is pre-ticked is a GDPR violation — catch it in your test.

---

### 2. Radio Buttons — Selecting and Verifying

*💡 Analogy: Radio buttons are like a hotel key card machine — you can only have one room activated at a time. Insert a new card, the old one is deactivated automatically. You never "toggle" a hotel key; you issue a new one.*

#### Selecting a radio

\`\`\`typescript
// Preferred: getByRole with name matches the label
await page.getByRole('radio', { name: 'Express (2-3 days)' }).check();
\`\`\`

#### Why check() not click()

\`click()\` toggles — for a radio button that is already selected, \`click()\` technically deselects it in some browser implementations. \`check()\` is **idempotent** — it checks the element if unchecked and does nothing if already checked. Always use \`check()\` on radio buttons.

#### Asserting the selected radio

\`\`\`typescript
await expect(page.getByRole('radio', { name: 'Express (2-3 days)' })).toBeChecked();
await expect(page.getByRole('radio', { name: 'Standard (5-7 days)' })).not.toBeChecked();
\`\`\`

#### Full example: shipping method selector

\`\`\`typescript
test('shipping method — selecting Express updates order summary', async ({ page }) => {
  await page.goto('/checkout/shipping');

  const shippingGroup = page.getByRole('group', { name: 'Shipping method' });

  // Verify Standard is selected by default
  await expect(shippingGroup.getByRole('radio', { name: /Standard/ })).toBeChecked();

  // Select Express
  await shippingGroup.getByRole('radio', { name: /Express/ }).check();

  // Verify only Express is now checked
  await expect(shippingGroup.getByRole('radio', { name: /Standard/ })).not.toBeChecked();
  await expect(shippingGroup.getByRole('radio', { name: /Express/ })).toBeChecked();
  await expect(shippingGroup.getByRole('radio', { name: /Overnight/ })).not.toBeChecked();

  // Verify price summary updated
  await expect(page.getByTestId('shipping-cost')).toHaveText('£9.99');
});
\`\`\`

#### Verifying only one radio is checked at a time

\`\`\`typescript
// Get all radios in the group and assert exactly one is checked
const radios = await page.getByRole('group', { name: 'Shipping method' })
  .getByRole('radio').all();

const checkedCount = (
  await Promise.all(radios.map(r => r.isChecked()))
).filter(Boolean).length;

expect(checkedCount).toBe(1);
\`\`\`

---

### 3. Native \`<select>\` Dropdowns

*💡 Analogy: A native select is like a vending machine. You press a button (option value/label/index) and it dispenses exactly what you asked for. Custom dropdowns are like a human barista — you still need to ask, but the interaction is more conversational.*

#### selectOption() — all three forms

\`\`\`typescript
// By value (the HTML value="" attribute)
await page.getByLabel('Country').selectOption('GB');

// By label (the visible text)
await page.getByLabel('Country').selectOption({ label: 'United Kingdom' });

// By index (0-based)
await page.getByLabel('Country').selectOption({ index: 0 });
\`\`\`

#### Multi-select

\`\`\`typescript
// Select multiple at once (replaces entire selection)
await page.getByLabel('Permissions').selectOption(['read', 'write', 'admin']);

// Clear all selections
await page.getByLabel('Permissions').selectOption([]);
\`\`\`

#### Asserting the value

\`\`\`typescript
// Single select
await expect(page.getByLabel('Country')).toHaveValue('GB');

// Multi-select
await expect(page.getByLabel('Permissions')).toHaveValues(['read', 'write']);
\`\`\`

#### Full example: country + timezone chained selects

\`\`\`typescript
test('user profile — country and timezone update correctly', async ({ page }) => {
  await page.goto('/settings/profile');

  // Set country first
  await page.getByLabel('Country').selectOption({ label: 'Japan' });
  await expect(page.getByLabel('Country')).toHaveValue('JP');

  // Timezone options should now be filtered for Japan — wait for DOM update
  await expect(page.getByLabel('Timezone').getByRole('option', { name: /Tokyo/ })).toBeVisible();

  await page.getByLabel('Timezone').selectOption({ label: 'Asia/Tokyo (UTC+9)' });
  await expect(page.getByLabel('Timezone')).toHaveValue('Asia/Tokyo');

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Profile updated')).toBeVisible();
});
\`\`\`

> **QA Tip:** When two selects are chained (country → timezone), always wait for the second select's options to update after changing the first. Use \`await expect(select.getByRole('option', { name: /.../ })).toBeVisible()\` before selecting.

---

### 4. Custom Dropdowns & Multi-Select

*💡 Analogy: A custom dropdown is like a fancy restaurant with no printed menu. You have to ask the waiter to open the menu, read it, make your selection, then wait for the waiter to close it. The food is the same — the ceremony is different.*

#### The open → select → close pattern

\`\`\`typescript
// Step 1: Open the dropdown
await page.getByRole('combobox', { name: 'Assign to' }).click();

// Step 2: Wait for the listbox to appear, then select
await page.getByRole('option', { name: 'Alice Johnson' }).click();

// Step 3: Custom dropdowns usually close on selection — verify
await expect(page.getByRole('combobox', { name: 'Assign to' })).toHaveText('Alice Johnson');
\`\`\`

#### Searchable dropdown: type to filter, then click

\`\`\`typescript
const dropdown = page.getByRole('combobox', { name: 'Framework' });
await dropdown.click();
await dropdown.type('Play'); // filter the list

// Wait for filtered option to appear, then click
await page.getByRole('option', { name: 'Playwright' }).click();
await expect(dropdown).toContainText('Playwright');
\`\`\`

#### React Select isMulti — chip-based multi-select

React Select renders a \`<div>\` with \`role="combobox"\` and selected values as chip elements. The pattern:

\`\`\`typescript
const multiSelect = page.locator('.react-select__control');

// Click to open
await multiSelect.click();

// Select options from the menu
await page.getByRole('option', { name: 'JavaScript' }).click();
await page.getByRole('option', { name: 'TypeScript' }).click();
await page.getByRole('option', { name: 'Python' }).click();

// Close by pressing Escape
await page.keyboard.press('Escape');

// Verify chips are shown (React Select renders chips as .react-select__multi-value__label)
await expect(page.locator('.react-select__multi-value__label')).toHaveCount(3);
\`\`\`

#### Removing a chip

\`\`\`typescript
// Find the chip for "Python" and click its × button
const pythonChip = page.locator('.react-select__multi-value', { hasText: 'Python' });
await pythonChip.getByRole('button', { name: 'Remove Python' }).click();

await expect(page.locator('.react-select__multi-value__label')).toHaveCount(2);
\`\`\`

#### Verifying selected count badge

\`\`\`typescript
// Some multi-selects show "3 selected" as a badge
await expect(page.getByTestId('multiselect-badge')).toHaveText('3 selected');
\`\`\`

---

### 5. Tables — Finding Cells, Sorting & Pagination

*💡 Analogy: A data table is like a spreadsheet inside a browser. To find a specific cell, you first look down column A to find the right row, then move across to your target column. Playwright's scoped locators let you do exactly that programmatically.*

#### Finding a specific cell by row text + column position

\`\`\`typescript
// Locate the row that contains "Alice Johnson", then get its 3rd cell (Status column)
const aliceRow = page.getByRole('row', { name: /Alice Johnson/ });
const statusCell = aliceRow.getByRole('cell').nth(2);
await expect(statusCell).toHaveText('Active');
\`\`\`

#### Sorting by column header

\`\`\`typescript
// Click the "Date" column header to sort ascending
await page.getByRole('columnheader', { name: 'Date' }).click();

// Click again to sort descending
await page.getByRole('columnheader', { name: 'Date' }).click();

// Assert first row has the latest date (descending sort)
const firstCell = page.getByRole('row').nth(1).getByRole('cell').nth(0);
await expect(firstCell).toHaveText('2024-12-31');
\`\`\`

#### Row selection via checkbox

\`\`\`typescript
// Select the row for order #1042
const targetRow = page.getByRole('row', { name: /1042/ });
await targetRow.getByRole('checkbox').check();

// Verify the row has the selected highlight class
await expect(targetRow).toHaveClass(/row-selected/);

// Verify bulk action button is now enabled
await expect(page.getByRole('button', { name: 'Delete selected' })).toBeEnabled();
\`\`\`

#### Pagination

\`\`\`typescript
// Assert current page indicator
await expect(page.getByLabel('Current page')).toHaveText('1');
await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();

// Go to next page
await page.getByRole('button', { name: 'Next page' }).click();
await expect(page.getByLabel('Current page')).toHaveText('2');

// Jump to last page
await page.getByRole('button', { name: 'Last page' }).click();
await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
\`\`\`

#### Asserting total row count vs displayed rows

\`\`\`typescript
// "Showing 10 of 243 results"
await expect(page.getByTestId('pagination-summary'))
  .toHaveText('Showing 10 of 243 results');

// Count rendered rows (excluding header)
const rows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
await expect(rows).toHaveCount(10);
\`\`\`

---

### 6. Drag and Drop

*💡 Analogy: Drag and drop in a browser is like moving sticky notes on a whiteboard — you grab one, drag it to a new column, and let go. The challenge is that some whiteboards use magnets (native HTML5 drag events) and others use velcro (JavaScript mouse event listeners). The grabbing technique is the same; what happens underneath differs.*

#### dragTo() — simple element-to-element

\`\`\`typescript
// Move a kanban card from "To Do" to "In Progress"
const card = page.getByTestId('task-card-42');
const inProgressColumn = page.getByTestId('column-in-progress');

await card.dragTo(inProgressColumn);

// Verify card is now in the target column
await expect(inProgressColumn.getByTestId('task-card-42')).toBeVisible();
\`\`\`

#### dragTo() with source and target positions

\`\`\`typescript
// Use positions when the drop target needs a specific location within the element
await card.dragTo(inProgressColumn, {
  sourcePosition: { x: 10, y: 10 },  // grab from near top-left of card
  targetPosition: { x: 50, y: 100 }, // drop near top of the column
});
\`\`\`

#### Sortable list — reordering items

\`\`\`typescript
// Reorder priority list: drag item 3 above item 1
const item3 = page.getByTestId('priority-item-3');
const item1 = page.getByTestId('priority-item-1');

await item3.dragTo(item1);

// Assert new order
const items = page.getByTestId(/priority-item-/);
await expect(items.nth(0)).toHaveText('Item 3');
await expect(items.nth(1)).toHaveText('Item 1');
await expect(items.nth(2)).toHaveText('Item 2');
\`\`\`

#### HTML5 DataTransfer drag — when dragTo() doesn't work

Some React libraries (react-beautiful-dnd, dnd-kit) listen to HTML5 drag events (\`dragstart\`, \`dragover\`, \`drop\`). Playwright's \`dragTo()\` dispatches mouse events, which these libraries may not respond to. The workaround is to dispatch DataTransfer events directly:

\`\`\`typescript
const source = page.getByTestId('task-card-42');
const target = page.getByTestId('column-in-progress');

// Simulate HTML5 drag-and-drop with DataTransfer
await source.dispatchEvent('dragstart', { dataTransfer: new DataTransfer() });
await target.dispatchEvent('dragover',  { dataTransfer: new DataTransfer() });
await target.dispatchEvent('drop',      { dataTransfer: new DataTransfer() });
await source.dispatchEvent('dragend',   { dataTransfer: new DataTransfer() });

await expect(target.getByTestId('task-card-42')).toBeVisible();
\`\`\`

> **QA Tip:** Always verify the drop happened functionally, not just visually. Check the underlying data: assert the card appears in the new column AND that the backend recorded the move (via API call assertion or page reload).

---

### 7. Keyboard Navigation

*💡 Analogy: Keyboard navigation is like navigating a city entirely using the underground map — you move between stops (focusable elements) in a defined order, press Enter to "exit the station" (activate the control), and Escape to go back to the surface (dismiss overlays). Screen reader users live on this map.*

#### Tab and Shift+Tab

\`\`\`typescript
// Move forward through focusable elements
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');

// Move backward
await page.keyboard.press('Shift+Tab');
\`\`\`

#### Arrow keys in a listbox or custom dropdown

\`\`\`typescript
await page.getByRole('combobox', { name: 'Priority' }).click();
await page.keyboard.press('ArrowDown'); // highlight first option
await page.keyboard.press('ArrowDown'); // highlight second option
await page.keyboard.press('Enter');     // select highlighted option
\`\`\`

#### Enter to submit, Escape to close

\`\`\`typescript
// Submit a form with Enter (without clicking the button)
await page.getByLabel('Search').fill('playwright');
await page.keyboard.press('Enter');
await expect(page).toHaveURL(/search\?q=playwright/);

// Close a modal with Escape
await page.getByRole('button', { name: 'Open settings' }).click();
await expect(page.getByRole('dialog')).toBeVisible();
await page.keyboard.press('Escape');
await expect(page.getByRole('dialog')).toBeHidden();
\`\`\`

#### Keyboard shortcuts

\`\`\`typescript
// Select all text in a field
await page.getByRole('textbox', { name: 'Notes' }).click();
await page.keyboard.press('Control+a'); // Windows/Linux
// await page.keyboard.press('Meta+a'); // Mac

// Command palette (VS Code / Linear / Notion style)
await page.keyboard.press('Meta+k');
await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
await page.keyboard.type('Create task');
await page.keyboard.press('Enter');
\`\`\`

#### Asserting focus

\`\`\`typescript
// Assert an element has focus via toHaveClass (if the app adds a CSS class on focus)
await expect(page.getByRole('button', { name: 'Save' })).toHaveClass(/focused/);

// Assert focus via evaluate() — the authoritative approach
const isFocused = await page.getByRole('button', { name: 'Save' }).evaluate(
  el => el === document.activeElement
);
expect(isFocused).toBe(true);
\`\`\`

> **QA Tip:** Keyboard navigability is an accessibility requirement (WCAG 2.1 SC 2.1.1). Always test that critical flows (login, checkout, form submission) are fully operable by keyboard alone.

---

### 8. Range Sliders

*💡 Analogy: A range slider is like a physical dial on an amplifier. You can turn it to a precise position (fill with a value), nudge it one step at a time (arrow keys), or grip and drag it to a new position (coordinate-based dragTo). The display showing the current volume level should update in sync — if it doesn't, that's a bug.*

#### fill() on a native \`<input type="range">\`

\`\`\`typescript
// Set slider to value 75 (must be a string for fill())
await page.getByLabel('Volume').fill('75');
await expect(page.getByLabel('Volume')).toHaveValue('75');
\`\`\`

#### Arrow key increment/decrement

\`\`\`typescript
// Click first to focus, then use arrow keys
await page.getByLabel('Volume').click();
await page.keyboard.press('ArrowRight'); // +1 step
await page.keyboard.press('ArrowRight'); // +1 step
await page.keyboard.press('ArrowLeft');  // -1 step
\`\`\`

#### Asserting the displayed value label updates

\`\`\`typescript
await page.getByLabel('Volume').fill('80');
// The label next to the slider should reflect the new value
await expect(page.getByTestId('volume-display')).toHaveText('80%');
\`\`\`

#### Custom JavaScript sliders — dragTo() with coordinates

When the slider is not a native \`<input type="range">\` (common in charting libraries), calculate the pixel position and drag:

\`\`\`typescript
const sliderTrack = page.getByTestId('custom-slider-track');
const handle      = page.getByTestId('custom-slider-handle');

const trackBox = await sliderTrack.boundingBox();
if (!trackBox) throw new Error('Track not found');

// Drag handle to 60% along the track
const targetX = trackBox.x + (trackBox.width * 0.6);
const targetY = trackBox.y + (trackBox.height / 2);

await handle.dragTo(sliderTrack, {
  targetPosition: { x: targetX - trackBox.x, y: trackBox.height / 2 },
});
\`\`\`

#### Price range double-handle slider

\`\`\`typescript
const minHandle = page.getByTestId('price-min-handle');
const maxHandle = page.getByTestId('price-max-handle');
const track     = page.getByTestId('price-range-track');
const box       = await track.boundingBox();
if (!box) throw new Error('Track not found');

// Move min handle to 20% (£200 on a £0–£1000 range)
await minHandle.dragTo(track, {
  targetPosition: { x: box.width * 0.2, y: box.height / 2 },
});

// Move max handle to 70% (£700)
await maxHandle.dragTo(track, {
  targetPosition: { x: box.width * 0.7, y: box.height / 2 },
});

await expect(page.getByTestId('price-min-label')).toHaveText('£200');
await expect(page.getByTestId('price-max-label')).toHaveText('£700');
\`\`\`

---

### 9. Rich Text Editors (TinyMCE, Quill, ProseMirror)

*💡 Analogy: A rich text editor is like a document inside a locked room inside a building. \`fill()\` can only enter the building. To type in the document, you need to unlock the room (find the iframe or contenteditable), walk inside, and then type. Each editor brand uses a different key.*

#### Why fill() silently fails

Rich text editors replace the native \`<textarea>\` with a \`contenteditable\` element or an \`<iframe>\`. Playwright's \`fill()\` targets \`<input>\` and \`<textarea>\` elements — it silently does nothing on a \`contenteditable\` \`<div>\`.

#### TinyMCE — iframe-based editor

\`\`\`typescript
// TinyMCE renders inside an <iframe id="tinymce_ifr">
// Step 1: Get a frame locator for the iframe
const editorFrame = page.frameLocator('#tinymce_ifr');

// Step 2: Target the body inside the iframe
const editorBody = editorFrame.locator('body[contenteditable="true"]');

// Step 3: Click to focus, then type
await editorBody.click();
await editorBody.fill('This is my rich text content.');

// Or clear first then type:
await editorBody.click();
await page.keyboard.press('Control+a');
await page.keyboard.type('Replaced content.');
\`\`\`

#### Quill / ProseMirror — contenteditable div

\`\`\`typescript
// Quill uses a div with contenteditable="true" and class "ql-editor"
const quillEditor = page.locator('.ql-editor[contenteditable="true"]');
await quillEditor.click();
await quillEditor.fill('Hello from Playwright!');

// ProseMirror uses div.ProseMirror[contenteditable="true"]
const proseMirrorEditor = page.locator('.ProseMirror[contenteditable="true"]');
await proseMirrorEditor.click();
await proseMirrorEditor.fill('Hello from Playwright!');
\`\`\`

#### Clearing and replacing content

\`\`\`typescript
// Select all existing content, then type the replacement
await quillEditor.click();
await page.keyboard.press('Control+a');
await page.keyboard.type('Brand new content replacing everything.');
\`\`\`

#### Asserting editor content

\`\`\`typescript
// Read innerHTML for rich content (preserves bold, italic tags)
const html = await quillEditor.evaluate(el => el.innerHTML);
expect(html).toContain('<strong>important</strong>');

// Read innerText for plain text assertions
const text = await quillEditor.evaluate(el => el.innerText);
expect(text).toContain('Brand new content');
\`\`\`

> **QA Tip:** After typing in a rich text editor, always wait for any auto-save indicators or character counts to update before asserting. Many editors debounce their state updates by 300–500ms.

---

### 10. Tab Panels, Accordions & Modals

*💡 Analogy: Tab panels are like a filing cabinet — only one drawer (panel) is open at a time, the others are physically pushed in. Accordions are like a vertical blind — you pull one slat down, it expands; you push it back, it collapses. Modals are like a pop-up shop that temporarily blocks the rest of the street — you need to close it before you can walk past.*

#### Tab panel — click, assert visible, assert others hidden

\`\`\`typescript
// Click the "Reviews" tab
await page.getByRole('tab', { name: 'Reviews' }).click();

// Assert the Reviews panel is now shown
await expect(page.getByRole('tabpanel', { name: 'Reviews' })).toBeVisible();

// Assert other panels are hidden
await expect(page.getByRole('tabpanel', { name: 'Details' })).toBeHidden();
await expect(page.getByRole('tabpanel', { name: 'Shipping' })).toBeHidden();
\`\`\`

#### Accordion — expand, assert visible, collapse, assert hidden

\`\`\`typescript
// Click the "Billing address" accordion header to expand it
const billingHeader = page.getByRole('button', { name: 'Billing address' });
await billingHeader.click();

// Assert the content is now visible
const billingContent = page.getByTestId('accordion-billing-content');
await expect(billingContent).toBeVisible();

// Collapse it
await billingHeader.click();
await expect(billingContent).toBeHidden();
\`\`\`

#### Modal — open, interact, close via button

\`\`\`typescript
// Open the modal
await page.getByRole('button', { name: 'Edit profile' }).click();

const modal = page.getByRole('dialog', { name: 'Edit profile' });
await expect(modal).toBeVisible();

// Interact with form inside the modal
await modal.getByLabel('Display name').fill('Alice Johnson');
await modal.getByLabel('Bio').fill('QA Engineer at Acme Corp');

// Save and close
await modal.getByRole('button', { name: 'Save changes' }).click();
await expect(modal).toBeHidden();

// Verify the update was reflected
await expect(page.getByTestId('profile-display-name')).toHaveText('Alice Johnson');
\`\`\`

#### Close modal with Escape key

\`\`\`typescript
await page.getByRole('button', { name: 'View details' }).click();
await expect(page.getByRole('dialog')).toBeVisible();

await page.keyboard.press('Escape');
await expect(page.getByRole('dialog')).toBeHidden();
\`\`\`

#### Stacked modals — confirmation dialog inside a modal

\`\`\`typescript
// Open the main modal
await page.getByRole('button', { name: 'Edit user' }).click();
const editModal = page.getByRole('dialog', { name: 'Edit user' });
await expect(editModal).toBeVisible();

// Trigger a destructive action that opens a confirmation dialog
await editModal.getByRole('button', { name: 'Delete account' }).click();

// A second (stacked) dialog appears
const confirmDialog = page.getByRole('dialog', { name: 'Confirm deletion' });
await expect(confirmDialog).toBeVisible();
await expect(editModal).toBeVisible(); // first modal still open behind

// Confirm deletion
await confirmDialog.getByRole('button', { name: 'Yes, delete' }).click();

// Both dialogs should now be gone
await expect(confirmDialog).toBeHidden();
await expect(editModal).toBeHidden();
\`\`\`

> **QA Tip:** For stacked modals, always scope your locators to the specific dialog. Using \`page.getByRole('button', { name: 'Cancel' })\` when both modals have a Cancel button will cause Playwright to throw a "strict mode violation" — multiple elements matched. Use \`confirmDialog.getByRole('button', { name: 'Cancel' })\` to scope correctly.
        `
      },

      {
        id: 'pw-dialogs-popups-iframes',
        title: 'Dialogs, Popups, iFrames & File Handling',
        analogy: "Handling dialogs, popups, and iframes in automation is like being an air traffic controller managing multiple runways simultaneously. Each new browser window is a new aircraft approaching. Each dialog is a priority alert that needs immediate acknowledgment. Each iframe is a plane from a different airline (different origin) that uses different radio frequencies. If you try to communicate on the wrong frequency, you get silence. The controller (your test) must switch channels deliberately for each.",
        lessonMarkdown: `
## Dialogs, Popups, iFrames & File Handling

Every real application has interactions that go beyond the main page: confirmation dialogs, new-tab flows, embedded third-party widgets, file uploads and downloads. These are the areas where inexperienced automation breaks down. Master them and you can test virtually any web application.

---

### 1. Browser Dialogs — alert, confirm, prompt

*💡 Analogy: A browser dialog is like an emergency intercom that interrupts everything. If you ignore it, the whole application freezes waiting for your response. In automation, you must have your listener ready BEFORE the door opens — not after you hear the buzzer.*

Native browser dialogs (\`alert\`, \`confirm\`, \`prompt\`) pause all JavaScript execution until dismissed. Playwright handles them through the \`dialog\` event.

**The critical timing rule — register BEFORE the triggering action:**
\`\`\`typescript
// ✅ CORRECT — listener registered before the action that triggers the dialog
page.on('dialog', async (dialog) => {
  console.log('Dialog type:', dialog.type());    // 'alert', 'confirm', or 'prompt'
  console.log('Dialog message:', dialog.message());
  await dialog.accept();
});

await page.getByRole('button', { name: 'Delete Account' }).click();
// The click triggers the alert — our listener catches it immediately
\`\`\`

\`\`\`typescript
// ❌ WRONG — listener registered AFTER the action
await page.getByRole('button', { name: 'Delete Account' }).click();
// ← dialog fires here, no listener exists yet, test hangs or auto-dismisses
page.on('dialog', async (dialog) => { await dialog.accept(); });
\`\`\`

**dialog.accept() vs dialog.dismiss() vs dialog.fill():**
\`\`\`typescript
// alert() — only accept() makes sense (no choice)
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toContain('Operation completed');
  await dialog.accept();
});

// confirm() — accept = OK, dismiss = Cancel
page.on('dialog', async (dialog) => {
  if (dialog.type() === 'confirm') {
    await dialog.dismiss(); // click Cancel — test the "cancel" path
  }
});

// prompt() — fill in the text before accepting
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('prompt');
  expect(dialog.defaultValue()).toBe('Enter your name');
  await dialog.fill('Test Automation User');
  await dialog.accept();
});
\`\`\`

**One-shot handler for a specific test:**
\`\`\`typescript
test('confirms deletion on dialog accept', async ({ page }) => {
  await page.goto('/admin/users');

  // Register once — fires for the next dialog only, then is removed
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete User' }).click();

  await expect(page.getByText('User deleted successfully')).toBeVisible();
});
\`\`\`

> **QA Tip:** \`page.once('dialog', ...)\` is safer than \`page.on('dialog', ...)\` when you only expect one dialog per test. \`page.on\` stays active for the lifetime of the page and can accidentally catch subsequent dialogs in later tests if you forget to remove it.

---

### 2. New Tab & Popup Windows

*💡 Analogy: A popup window is like a courier arriving at your door while you're already on a phone call. If you don't expect them, the door goes unanswered. In automation, you must be watching for the knock BEFORE you trigger the action that sends the courier.*

When a click opens a new tab or window, Playwright gives you access to the new \`Page\` object through a \`page\` event on the context.

**The Promise.all pattern — the only correct approach:**
\`\`\`typescript
test('clicking terms link opens new tab with correct content', async ({ page, context }) => {
  await page.goto('/register');

  // ✅ Start listening BEFORE the click, resolve after both happen
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),                              // waits for new tab to open
    page.getByRole('link', { name: 'Terms of Service' }).click(), // triggers the new tab
  ]);

  // newPage is fully usable — act on it just like any other page
  await newPage.waitForLoadState('domcontentloaded');
  await expect(newPage).toHaveURL(/terms/);
  await expect(newPage.getByRole('heading', { level: 1 })).toHaveText('Terms of Service');

  await newPage.close(); // clean up
});
\`\`\`

**Accessing the new page and interacting:**
\`\`\`typescript
test('OAuth popup authentication flow', async ({ page, context }) => {
  await page.goto('/login');

  // Trigger the OAuth popup
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: 'Sign in with Google' }).click(),
  ]);

  // Interact with the popup — fill in credentials
  await popup.getByLabel('Email').fill('test@gmail.com');
  await popup.getByRole('button', { name: 'Next' }).click();
  await popup.getByLabel('Password').fill('test-password');
  await popup.getByRole('button', { name: 'Sign in' }).click();

  // Popup closes after auth — back to main page
  await popup.waitForEvent('close');

  // Main page should now be logged in
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, Test User')).toBeVisible();
});
\`\`\`

**Closing popups and handling multiple windows:**
\`\`\`typescript
// Get all pages in the context
const pages = context.pages();
console.log(\`Open tabs: \${pages.length}\`);

// Close all pages except the first (main page)
for (const p of pages.slice(1)) {
  await p.close();
}
\`\`\`

---

### 3. iFrames with frameLocator()

*💡 Analogy: An iframe is like a TV-within-a-TV. The outer TV (your main page) is tuned to your own channel. The inner TV (the iframe) is receiving a completely different broadcast — maybe from a different broadcaster entirely. Your remote (locator) only works on the TV you're currently controlling. To change the channel on the inner TV, you must pick up a different remote (frameLocator).*

iFrames embed a completely separate document inside a page. Locators on \`page\` cannot find elements inside iframes — you must use \`frameLocator()\`.

**Basic frameLocator syntax:**
\`\`\`typescript
// The iframe element's selector
const iframe = page.frameLocator('iframe[name="payment-form"]');
// Or by src pattern
const iframe2 = page.frameLocator('iframe[src*="stripe.com"]');

// Now locate elements INSIDE the iframe
await iframe.getByLabel('Card Number').fill('4242 4242 4242 4242');
await iframe.getByLabel('Expiry Date').fill('12/26');
await iframe.getByLabel('CVC').fill('123');
\`\`\`

**Stripe payment form — a real-world example:**
\`\`\`typescript
test('completes checkout with Stripe payment', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();

  // Stripe renders in an iframe
  const stripeFrame = page.frameLocator('iframe[title="Secure card payment input frame"]');

  await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242');
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/26');
  await stripeFrame.getByPlaceholder('CVC').fill('123');
  await stripeFrame.getByPlaceholder('ZIP').fill('10001');

  // Click Pay button outside the iframe
  await page.getByRole('button', { name: 'Pay Now' }).click();
  await expect(page.getByText('Payment successful')).toBeVisible();
});
\`\`\`

**Nested iframes:**
\`\`\`typescript
// Outer iframe → inner iframe → element
const outerFrame = page.frameLocator('#outer-frame');
const innerFrame = outerFrame.frameLocator('#inner-frame');
await innerFrame.getByRole('button', { name: 'Submit' }).click();
\`\`\`

**What makes iframes different:**
- They have their own separate DOM tree
- Cookies and localStorage are scoped to the iframe's origin
- JavaScript in the iframe cannot access the parent page's JS (cross-origin)
- Playwright auto-waits for iframe content to load before querying inside

---

### 4. File Uploads

*💡 Analogy: \`setInputFiles()\` is like handing documents directly to the official on the other side of the counter — bypassing the queue system entirely. The OS file picker dialog (the queue) is skipped. You place the file directly into the input's hands.*

**Single file upload:**
\`\`\`typescript
// setInputFiles() works on <input type="file"> elements
await page.getByLabel('Upload Document').setInputFiles('./tests/fixtures/contract.pdf');

// With role-based locator
await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./avatar.png');
// Note: if the visible element is a button (not the input), locate the input directly
await page.locator('input[type="file"]').setInputFiles('./avatar.png');
\`\`\`

**Multiple files:**
\`\`\`typescript
await page.locator('input[type="file"][multiple]').setInputFiles([
  './tests/fixtures/invoice-jan.pdf',
  './tests/fixtures/invoice-feb.pdf',
  './tests/fixtures/invoice-mar.pdf',
]);
await expect(page.getByText('3 files selected')).toBeVisible();
\`\`\`

**In-memory file buffer — no file on disk needed:**
\`\`\`typescript
// Generate file content in memory — useful for unique test data
await page.locator('input[type="file"]').setInputFiles({
  name: 'test-upload.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('This is the content of my test file'),
});

// CSV upload test with generated data
const csvContent = 'name,email\nAlice,alice@test.com\nBob,bob@test.com';
await page.locator('input[type="file"]').setInputFiles({
  name: 'users.csv',
  mimeType: 'text/csv',
  buffer: Buffer.from(csvContent),
});
\`\`\`

**Clearing a file input:**
\`\`\`typescript
// Remove selected files
await page.locator('input[type="file"]').setInputFiles([]);
await expect(page.getByText('No file chosen')).toBeVisible();
\`\`\`

---

### 5. File Downloads

*💡 Analogy: \`waitForEvent('download')\` is like a customs officer posted at the airport's baggage carousel before the flight lands. If you arrive at the carousel after the bags have been taken away, you miss them. The officer is there waiting before the plane even touches down.*

**Basic download handling:**
\`\`\`typescript
test('downloads invoice PDF', async ({ page }) => {
  await page.goto('/invoices');

  // Set up the download listener BEFORE clicking
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download Invoice' }).click(),
  ]);

  // The download object gives you info about the file
  console.log('Filename:', download.suggestedFilename()); // "invoice-2026-01.pdf"

  // Save to a specific location for inspection
  await download.saveAs('./test-results/downloads/' + download.suggestedFilename());
});
\`\`\`

**Verifying download content:**
\`\`\`typescript
import * as fs from 'fs';
import * as path from 'path';

test('downloaded CSV contains correct data', async ({ page }) => {
  await page.goto('/reports');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export to CSV' }).click(),
  ]);

  // Save and read the file
  const downloadPath = path.join('test-results', download.suggestedFilename());
  await download.saveAs(downloadPath);

  const content = fs.readFileSync(downloadPath, 'utf-8');
  expect(content).toContain('Order ID,Date,Amount');
  expect(content.split('\n').length).toBeGreaterThan(5); // at least 5 data rows
});
\`\`\`

**Checking for download failure:**
\`\`\`typescript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download Report' }).click(),
]);

const failure = await download.failure();
if (failure) {
  throw new Error(\`Download failed: \${failure}\`);
}
\`\`\`

---

### 6. Hover Menus & Tooltips

*💡 Analogy: Hover interactions are like motion-sensor lights — they only switch on when you're physically present. If you test for the light being on without first walking under the sensor, the test always fails. You must trigger the condition first, then assert the result.*

**Hover then wait for menu:**
\`\`\`typescript
test('hover shows dropdown navigation', async ({ page }) => {
  await page.goto('/');

  // Hover the trigger element
  await page.getByRole('button', { name: 'Products' }).hover();

  // The dropdown menu should now be visible
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Accessories' }).click();

  await expect(page).toHaveURL('/products/accessories');
});
\`\`\`

**Combining hover with waitForSelector:**
\`\`\`typescript
// Some menus have CSS transitions — wait for the animation to complete
await page.getByRole('navigation').getByText('Services').hover();
await page.waitForSelector('.dropdown-menu', { state: 'visible' });
// Now the menu is fully visible and clickable
await page.getByRole('link', { name: 'Consulting' }).click();
\`\`\`

**Tooltip verification:**
\`\`\`typescript
test('info icon shows tooltip on hover', async ({ page }) => {
  await page.goto('/settings');

  await page.getByRole('img', { name: 'Info' }).hover();

  // Tooltip typically has a specific role or test ID
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText('This setting affects all users');
});
\`\`\`

**The animation timing problem:**
\`\`\`typescript
// If hover menus use CSS transitions, the element may be in the DOM but still animating
// Playwright's stability check handles most cases, but for tricky animations:
await page.getByText('Account').hover();
await page.waitForFunction(() => {
  const menu = document.querySelector('.account-dropdown');
  if (!menu) return false;
  return parseFloat(window.getComputedStyle(menu).opacity) === 1;
});
\`\`\`

---

### 7. Date Pickers & Custom Dropdowns

*💡 Analogy: A custom date picker is like a vending machine that speaks a different language than a regular shop counter. The regular till (native \`<select>\` or \`<input type="date">\`) understands direct commands. The custom vending machine has its own button sequence, its own display, its own rules. You need to learn that machine's interface specifically.*

**Filling a native date input:**
\`\`\`typescript
// <input type="date"> — fill directly with ISO format
await page.getByLabel('Start Date').fill('2026-06-15');
await expect(page.getByLabel('Start Date')).toHaveValue('2026-06-15');
\`\`\`

**Calendar widget date picker:**
\`\`\`typescript
test('selects date from calendar widget', async ({ page }) => {
  await page.goto('/booking');

  // Click the date input to open the calendar
  await page.getByLabel('Check-in Date').click();
  await expect(page.getByRole('dialog', { name: /calendar/i })).toBeVisible();

  // Navigate to the correct month
  const currentMonth = await page.getByTestId('calendar-month-year').textContent();
  if (!currentMonth?.includes('June 2026')) {
    await page.getByRole('button', { name: 'Next month' }).click();
  }

  // Click the specific day
  await page.getByRole('gridcell', { name: '15' }).click();

  // Verify the input was updated
  await expect(page.getByLabel('Check-in Date')).toHaveValue(/june.*15|15.*june/i);
});
\`\`\`

**Custom dropdown (not a native \`<select>\`):**
\`\`\`typescript
test('selects from custom styled dropdown', async ({ page }) => {
  await page.goto('/settings');

  // Step 1: Click the trigger to open the listbox
  await page.getByRole('combobox', { name: 'Country' }).click();

  // Step 2: Wait for the options to appear
  await expect(page.getByRole('listbox')).toBeVisible();

  // Step 3: Select the specific option
  await page.getByRole('option', { name: 'United Kingdom' }).click();

  // Step 4: Verify the selection
  await expect(page.getByRole('combobox', { name: 'Country' })).toHaveText('United Kingdom');
});
\`\`\`

**Searchable dropdown (type to filter):**
\`\`\`typescript
// Some custom dropdowns have a search input inside the listbox
await page.getByRole('combobox', { name: 'Time Zone' }).click();
await page.getByRole('combobox', { name: 'Time Zone' }).fill('London');

// The filtered options appear
await page.getByRole('option', { name: 'Europe/London' }).click();
await expect(page.getByRole('combobox', { name: 'Time Zone' })).toHaveText('Europe/London');
\`\`\`

**React Select / similar libraries:**
\`\`\`typescript
// React Select uses a specific DOM pattern — input inside a container
const countrySelect = page.locator('.react-select__control').filter({
  has: page.locator('.react-select__placeholder', { hasText: 'Select country' })
});
await countrySelect.click();
await page.getByRole('option', { name: 'Germany' }).click();
\`\`\`

> **QA Tip:** Always check whether a dropdown is a native \`<select>\` or a custom component. Native selects: use \`selectOption()\`. Custom components: use the open → filter → click pattern. The fastest way to tell: inspect the element — if it's \`<select>\`, use \`selectOption()\`.
        `
      },

      {
        id: 'pw-test-organisation',
        title: 'Test Organisation, Tagging & Parallelism',
        analogy: "Organising a test suite is like running an airport with hundreds of flights. Without a system, it's chaos — planes queuing on the wrong runways, crews not knowing their gates, no priority system for emergency landings. With structure: gates are numbered (describe blocks), priority flights get dedicated runways (serial vs parallel), ground crew know exactly which flights need special handling (tags and grep). The bigger the fleet, the more the structure pays off.",
        lessonMarkdown: `
## Test Organisation, Tagging & Parallelism

A well-organised test suite is as important as well-written tests. Structure determines how fast your CI pipeline runs, how quickly engineers find failing tests, and how reliably the suite scales from 20 tests to 2,000. This module covers the organisational tools professional Playwright teams use.

---

### 1. test.describe() Nesting

*💡 Analogy: \`test.describe()\` is like a filing cabinet with labelled drawers. The drawer labelled "Authentication" contains sub-folders: "Login", "Logout", "Password Reset". Each sub-folder contains the actual documents (tests). Without this structure, every document is thrown in a pile and finding anything is a nightmare.*

**Basic grouping by feature:**
\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('adds item to empty cart', async ({ page }) => { /* ... */ });
  test('removes item from cart', async ({ page }) => { /* ... */ });
  test('updates item quantity', async ({ page }) => { /* ... */ });
  test('calculates total correctly', async ({ page }) => { /* ... */ });
});
\`\`\`

**Nested describes — by page, then by scenario:**
\`\`\`typescript
test.describe('Checkout Flow', () => {
  test.describe('Guest Checkout', () => {
    test('completes purchase without account', async ({ page }) => { /* ... */ });
    test('shows email confirmation prompt', async ({ page }) => { /* ... */ });
  });

  test.describe('Authenticated Checkout', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      // ... login steps
    });

    test('pre-fills saved address', async ({ page }) => { /* ... */ });
    test('shows order history after purchase', async ({ page }) => { /* ... */ });
  });
});
\`\`\`

**Hook scoping — beforeEach inside describe only applies within it:**
\`\`\`typescript
test.describe('Admin Panel', () => {
  // This beforeEach ONLY runs for tests inside this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Password').fill('admin-pass');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });

  test('views user list', async ({ page }) => { /* ... */ });
  test('deletes user', async ({ page }) => { /* ... */ });
});

// This test does NOT run the admin beforeEach
test('homepage loads for guest', async ({ page }) => { /* ... */ });
\`\`\`

**Naming conventions:**
\`\`\`typescript
// By feature area
test.describe('User Authentication', () => { /* ... */ });
test.describe('Product Catalogue', () => { /* ... */ });
test.describe('Order Management', () => { /* ... */ });

// By user role
test.describe('As a Guest User', () => { /* ... */ });
test.describe('As an Admin User', () => { /* ... */ });

// By page
test.describe('Login Page', () => { /* ... */ });
test.describe('Dashboard Page', () => { /* ... */ });
\`\`\`

---

### 2. test.only(), test.skip(), test.fixme(), test.slow()

*💡 Analogy: These modifiers are the coloured flags in a harbour. Green flag: normal operation. Yellow flag: caution, skip this berth. Red flag: known problem, don't attempt docking. Orange flag: this ship is slow — give it extra time. Each flag sends a clear signal to the crew without confusion.*

**test.only() — run only this test (or this describe):**
\`\`\`typescript
test.only('the one test I am working on right now', async ({ page }) => {
  // All other tests in the file are skipped
  // ⚠️ NEVER commit test.only() to main/production branch
});

test.describe.only('Login feature', () => {
  // Only tests in this block run — skips all other describes
});
\`\`\`

**The CI danger of .only():**
\`\`\`typescript
// In playwright.config.ts — IMPORTANT for any shared codebase
export default defineConfig({
  forbidOnly: !!process.env.CI, // fails the run if .only() is found in CI
});
// This means accidental .only() commits fail loudly on CI instead of silently
// running only one test and falsely "passing" the suite
\`\`\`

**test.skip() — skip with a reason:**
\`\`\`typescript
test.skip('payment with expired card', async ({ page }) => {
  // Skipped — no reason given (avoid this style in shared code)
});

test('feature flag dependent test', async ({ page }) => {
  test.skip(process.env.FEATURE_NEW_CHECKOUT !== 'true', 'Only runs when new checkout is enabled');
  // Test body runs only when the env var is set
});

// Skip an entire describe block
test.describe('Legacy API Tests', () => {
  test.skip(); // skips all tests in this describe
  test('...', async () => { /* ... */ });
});
\`\`\`

**test.fixme() — known broken test, mark for later:**
\`\`\`typescript
test.fixme('discount code applies to subscription', async ({ page }) => {
  // This test fails due to a known bug — JIRA-4521
  // Marked fixme so CI skips it but it's visible in the report
  // Different from skip: fixme signals "this SHOULD work but currently doesn't"
});

test.fixme('...', async ({ page }) => {
  test.fixme(process.env.BROWSER === 'firefox', 'Firefox drag-drop bug — ticket JIRA-5033');
  // Only marked fixme in Firefox
});
\`\`\`

**test.slow() — extend the timeout for slow scenarios:**
\`\`\`typescript
test('full end-to-end onboarding flow', async ({ page }) => {
  test.slow(); // triples the default timeout for this test only

  // This 15-step flow needs more time than the default 30s
  await page.goto('/signup');
  // ... 15 steps ...
  await expect(page.getByText('Setup complete')).toBeVisible();
});
\`\`\`

---

### 3. Tagging Tests

*💡 Analogy: Tags are like boarding zones at an airport. Zone A (smoke tests) boards first — fast, essential, runs on every commit. Zone B (regression) boards next — thorough but slower. Zone C (nightly) boards last — exhaustive tests that run overnight. The same passengers (tests) belong to different zones for different journeys.*

**Adding tags in test names:**
\`\`\`typescript
// Tags are @-prefixed strings inside the test name
test('login with valid credentials @smoke @critical', async ({ page }) => { /* ... */ });
test('register new user @smoke @regression', async ({ page }) => { /* ... */ });
test('admin bulk delete users @regression @destructive', async ({ page }) => { /* ... */ });
test('export report to Excel @slow @regression', async ({ page }) => { /* ... */ });
\`\`\`

**Filtering by tag on the command line:**
\`\`\`bash
# Run only smoke tests
npx playwright test --grep "@smoke"

# Run only critical regression tests
npx playwright test --grep "@critical"

# Run tests tagged with BOTH smoke AND critical (AND logic with regex)
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"

# Run tests tagged with smoke OR regression (OR logic)
npx playwright test --grep "@smoke|@regression"

# Exclude slow tests (run everything EXCEPT @slow)
npx playwright test --grep-invert "@slow"
\`\`\`

**Playwright v1.42+ first-class tags API:**
\`\`\`typescript
// Modern syntax — tags as a separate property (cleaner than name embedding)
test('login with valid credentials', {
  tag: ['@smoke', '@critical'],
}, async ({ page }) => { /* ... */ });

test.describe('Checkout Flow', {
  tag: ['@regression'],
}, () => {
  test('guest checkout', async ({ page }) => { /* ... */ });
  test('authenticated checkout', async ({ page }) => { /* ... */ });
  // Both inherit @regression from the describe
});
\`\`\`

**Practical tagging strategy:**

| Tag | Purpose | Runs when |
|-----|---------|-----------|
| \`@smoke\` | Critical happy paths, ~10 tests | Every commit, every PR |
| \`@regression\` | Full feature coverage | Nightly, before release |
| \`@critical\` | Business-critical flows (payments, auth) | Every deployment |
| \`@slow\` | Tests that take >30s | Nightly only |
| \`@flaky\` | Known occasional failures | Excluded from main CI |
| \`@wip\` | Work in progress | Local development only |

---

### 4. test.describe.parallel() vs serial()

*💡 Analogy: Parallel tests are like multiple checkout lanes in a supermarket — each shopper moves independently, in no particular order, and they don't interact. Serial tests are like a relay race — the baton must be passed in exact order, and if one runner falls, the race stops. Choose the model that matches the actual dependency between your tests.*

**test.describe.parallel() — tests run in any order, concurrently:**
\`\`\`typescript
test.describe.parallel('Product Catalogue', () => {
  // These 4 tests run at the same time, in no guaranteed order
  test('filter by category', async ({ page }) => { /* ... */ });
  test('sort by price', async ({ page }) => { /* ... */ });
  test('search by keyword', async ({ page }) => { /* ... */ });
  test('pagination works', async ({ page }) => { /* ... */ });
});
// Total time ≈ time of slowest single test (not sum of all 4)
\`\`\`

**test.describe.serial() — tests run in strict sequence:**
\`\`\`typescript
test.describe.serial('Order Lifecycle', () => {
  // These tests DEPEND on each other — they share state through the context
  test('creates draft order', async ({ page }) => {
    await page.goto('/orders/new');
    await page.getByRole('button', { name: 'Save Draft' }).click();
    // Order ID is now in the database
  });

  test('submits draft order', async ({ page }) => {
    await page.goto('/orders/drafts');
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('verifies order in history', async ({ page }) => {
    await page.goto('/orders/history');
    await expect(page.getByTestId('order-row')).toHaveCount(1);
  });
  // If 'creates draft order' fails, the next two are skipped automatically
});
\`\`\`

**The performance tradeoff:**

| Mode | Order | Speed | When to use |
|------|-------|-------|-------------|
| Default (parallel workers) | Random | Fastest | Most tests — independent, no shared state |
| \`describe.parallel()\` | Random | Fast | Independent tests in same file |
| \`describe.serial()\` | Strict sequential | Slowest | Tests that share state or follow a workflow |

**Worker configuration in playwright.config.ts:**
\`\`\`typescript
export default defineConfig({
  // Number of parallel workers — adjust based on your machine/CI
  workers: process.env.CI ? 4 : 2,

  // Run all tests in the same file serially (file isolation, not parallel within files)
  fullyParallel: false, // default: tests in same file run serially
  // fullyParallel: true  — all tests everywhere run in parallel (fastest, needs independence)
});
\`\`\`

---

### 5. expect.soft() — Soft Assertions

*💡 Analogy: Soft assertions are like a quality inspector filling out a checklist on a production line. They mark each defect on the clipboard and keep inspecting — they don't stop the line at the first defect. At the end of the inspection, the full report shows every problem found. A hard assertion stops the line at the first problem, missing everything downstream.*

**Basic soft assertion usage:**
\`\`\`typescript
test('order confirmation page shows all details', async ({ page }) => {
  await page.goto('/order-confirmation/12345');

  // Hard assertions (normal) would stop at the first failure
  // Soft assertions continue and collect ALL failures
  await expect.soft(page.getByTestId('order-id')).toHaveText('Order #12345');
  await expect.soft(page.getByTestId('order-status')).toHaveText('Confirmed');
  await expect.soft(page.getByTestId('delivery-date')).toBeVisible();
  await expect.soft(page.getByTestId('customer-name')).toContainText('Test User');
  await expect.soft(page.getByTestId('order-total')).toHaveText('£49.99');

  // Test FAILS at the end if ANY soft assertion failed
  // The report shows ALL failures, not just the first one
});
\`\`\`

**Mixing soft and hard assertions:**
\`\`\`typescript
test('product details page', async ({ page }) => {
  await page.goto('/product/headphones-pro');

  // Hard assertion first — if the page didn't load, all soft checks below are meaningless
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Soft assertions for all the details we want to verify
  await expect.soft(page.getByTestId('price')).toHaveText('£199.99');
  await expect.soft(page.getByTestId('in-stock')).toHaveText('In Stock');
  await expect.soft(page.getByTestId('rating')).toContainText('4.8');
  await expect.soft(page.getByRole('img', { name: /product photo/i })).toBeVisible();
  await expect.soft(page.getByTestId('sku')).toHaveText('SKU: HPX-2026');
});
\`\`\`

**When to use soft vs hard:**

| Scenario | Use |
|----------|-----|
| Multiple independent fields on a confirmation page | \`expect.soft()\` |
| Step that other steps depend on (login must succeed before dashboard test) | Hard \`expect()\` |
| Verifying a whole form submitted correctly | \`expect.soft()\` for each field |
| Verifying the correct page loaded | Hard \`expect()\` (everything else depends on this) |

---

### 6. Folder & File Structure

*💡 Analogy: File structure is the map of your testing city. Feature-based organisation is like organising a city by district (Shopping District, Government District). Page-based is like organising by building (Town Hall, Shopping Centre, Library). Flow-based is like organising by journey type (morning commute, tourist sightseeing). Choose the map that best reflects how YOUR team navigates.*

**Feature-based structure (recommended for most teams):**
\`\`\`
tests/
  auth/
    login.spec.ts
    register.spec.ts
    password-reset.spec.ts
  checkout/
    guest-checkout.spec.ts
    payment.spec.ts
    order-confirmation.spec.ts
  products/
    catalogue.spec.ts
    product-detail.spec.ts
    search.spec.ts
  admin/
    user-management.spec.ts
    reports.spec.ts
pages/            # Page Object Model classes
  LoginPage.ts
  CheckoutPage.ts
  ProductPage.ts
fixtures/         # Test data and shared fixtures
  users.ts
  products.json
utils/            # Shared helper functions
  dates.ts
  api-helpers.ts
\`\`\`

**Page-based structure:**
\`\`\`
tests/
  homepage.spec.ts
  login-page.spec.ts
  dashboard.spec.ts
  profile-page.spec.ts
  checkout-page.spec.ts
\`\`\`

**Flow-based structure:**
\`\`\`
tests/
  flows/
    new-user-onboarding.spec.ts
    purchase-flow.spec.ts
    admin-setup-flow.spec.ts
  components/
    navigation.spec.ts
    search-bar.spec.ts
\`\`\`

**The spec file decision:**
\`\`\`typescript
// One spec per feature (recommended) — login.spec.ts covers all login scenarios
test.describe('Login', () => {
  test('valid credentials', ...);
  test('invalid password', ...);
  test('locked account', ...);
  test('forgot password link', ...);
  test('remember me checkbox', ...);
});

// One spec per scenario (too granular) — hard to navigate, too many files
// valid-login.spec.ts, invalid-login.spec.ts, locked-account.spec.ts...
\`\`\`

---

### 7. Worker-Scoped Fixtures for Expensive Setup

*💡 Analogy: Worker-scoped fixtures are like a hotel concierge who sets up a master key card once per shift, then all guests on that shift use it. Without this, each guest would have to wait for the concierge to programme a new card from scratch — multiplying setup time by the number of guests. The card is set up once; many guests benefit.*

**Scope comparison:**

| Scope | Created | Destroyed | Use for |
|-------|---------|-----------|---------|
| \`'test'\` (default) | Before each test | After each test | Page, browser context |
| \`'worker'\` | Once per worker | When worker exits | Database seed, auth state, expensive API calls |

**Worker-scoped fixture for database seeding:**
\`\`\`typescript
// fixtures/worker-fixtures.ts
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  seededDb: { userId: string; orderId: string };
};

export const test = base.extend<{}, WorkerFixtures>({
  seededDb: [async ({}, use) => {
    // Runs ONCE per worker — not once per test
    console.log('Seeding database for worker...');
    const userId = await seedTestUser();
    const orderId = await seedTestOrder(userId);

    await use({ userId, orderId });

    // Cleanup runs once per worker at the end
    await cleanupTestData(userId);
  }, { scope: 'worker' }],
});
\`\`\`

**Worker-scoped auth state (the most common use case):**
\`\`\`typescript
// fixtures/auth-fixtures.ts
import { test as base, BrowserContext } from '@playwright/test';

type WorkerFixtures = {
  authenticatedContext: BrowserContext;
};

export const test = base.extend<{}, WorkerFixtures>({
  authenticatedContext: [async ({ browser }, use) => {
    // Log in ONCE per worker — saves auth cookies to storage state
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/login');
    await page.getByLabel('Email').fill('testuser@example.com');
    await page.getByLabel('Password').fill('test-password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('/dashboard');
    await page.close();

    // All tests in this worker share the authenticated context
    await use(context);
    await context.close();
  }, { scope: 'worker' }],
});
\`\`\`

**The isolation tradeoff:**
\`\`\`typescript
// Worker-scoped fixtures save time but reduce isolation
// If test A modifies shared state and test B reads it:

// ✅ Safe pattern — each test reads but never modifies worker-scoped data
test('views seeded order', async ({ page, seededDb }) => {
  await page.goto(\`/orders/\${seededDb.orderId}\`);
  await expect(page.getByTestId('order-status')).toHaveText('Pending');
  // Does NOT change the order status — safe for other tests in the worker
});

// ❌ Risky pattern — test modifies shared worker state
test('cancels order', async ({ page, seededDb }) => {
  await page.goto(\`/orders/\${seededDb.orderId}\`);
  await page.getByRole('button', { name: 'Cancel Order' }).click();
  // Now the order is cancelled — other tests expecting 'Pending' will fail
});
// Solution: use test-scoped fixtures for data that gets modified
\`\`\`

> **QA Principle:** Use worker-scoped fixtures for read-only setup (auth state, reference data). Use test-scoped fixtures for anything that gets created, modified, or deleted during a test. This maximises speed without compromising isolation.
        `
      },

      {
        id: 'pw-api-testing',
        title: 'API Testing & Hybrid UI+API Tests',
        analogy: "Pure UI testing is like judging a restaurant only by eating the food. You get great consumer confidence but it's slow — you wait for the full meal every time. API testing is like inspecting the kitchen directly — fast, precise, catches problems before they ever reach the plate. The hybrid approach — inspect the kitchen (API) to set up the ingredients, then eat the dish (UI) to verify the experience — gives you the speed of API testing with the confidence of UI testing. It's how professional QA engineers achieve both speed and coverage.",
        lessonMarkdown: `
## API Testing & Hybrid UI+API Tests

Playwright is not just a browser automation tool — it has a first-class HTTP client built in. Combining API and UI testing in a single framework eliminates context-switching, lets you share authentication, and unlocks hybrid patterns that are faster, more stable, and more powerful than pure UI testing alone.

---

### 1. The request Fixture

*💡 Analogy: The \`request\` fixture is like having a direct phone line to the backend kitchen. Instead of ordering through the restaurant's front of house (the UI), you're calling the head chef directly. Faster, more precise, no waiting for waiters.*

The \`request\` fixture is a built-in Playwright fixture that gives you an HTTP client — no extra libraries needed.

**Basic GET request:**
\`\`\`typescript
import { test, expect } from '@playwright/test';

test('GET /api/products returns 200 with product list', async ({ request }) => {
  const response = await request.get('https://api.example.com/products');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBe(true); // true for 200-299

  const body = await response.json();
  expect(body).toHaveProperty('products');
  expect(body.products.length).toBeGreaterThan(0);
});
\`\`\`

**POST with JSON body:**
\`\`\`typescript
test('POST /api/users creates a new user', async ({ request }) => {
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'Test User',
      email: 'test.user@example.com',
      role: 'viewer',
    },
  });

  expect(response.status()).toBe(201);
  const created = await response.json();
  expect(created.id).toBeDefined();
  expect(created.email).toBe('test.user@example.com');
});
\`\`\`

**With authentication headers:**
\`\`\`typescript
test('authenticated API call returns user profile', async ({ request }) => {
  const response = await request.get('https://api.example.com/user/profile', {
    headers: {
      'Authorization': \`Bearer \${process.env.TEST_API_TOKEN}\`,
      'Accept': 'application/json',
    },
  });

  expect(response.status()).toBe(200);
  const profile = await response.json();
  expect(profile.email).toBe('test@example.com');
});
\`\`\`

**Using baseURL from config:**
\`\`\`typescript
// In playwright.config.ts:
// use: { baseURL: 'https://api.example.com' }

test('uses base URL from config', async ({ request }) => {
  // No need to repeat the full base URL
  const response = await request.get('/products');
  expect(response.status()).toBe(200);
});
\`\`\`

---

### 2. request.newContext() — Isolated API Sessions

*💡 Analogy: \`request.newContext()\` is like opening a private browsing window for your API calls. It has its own cookie jar, its own headers, its own state. Two contexts running in parallel are completely unaware of each other — perfect for testing concurrent scenarios or different user sessions simultaneously.*

**Creating an isolated API context:**
\`\`\`typescript
test('two concurrent API sessions stay independent', async ({ playwright }) => {
  // Create two completely separate API contexts
  const adminContext = await playwright.request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: {
      'Authorization': 'Bearer admin-token-here',
    },
  });

  const viewerContext = await playwright.request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: {
      'Authorization': 'Bearer viewer-token-here',
    },
  });

  // Admin can access admin endpoint
  const adminResponse = await adminContext.get('/admin/users');
  expect(adminResponse.status()).toBe(200);

  // Viewer cannot access admin endpoint
  const viewerResponse = await viewerContext.get('/admin/users');
  expect(viewerResponse.status()).toBe(403);

  // Always dispose contexts when done
  await adminContext.dispose();
  await viewerContext.dispose();
});
\`\`\`

**Custom base URL per context:**
\`\`\`typescript
test('tests against staging API', async ({ playwright }) => {
  const stagingApi = await playwright.request.newContext({
    baseURL: 'https://api.staging.example.com',
    ignoreHTTPSErrors: true, // staging may have self-signed certs
  });

  const response = await stagingApi.get('/health');
  expect(response.status()).toBe(200);
  await stagingApi.dispose();
});
\`\`\`

---

### 3. Asserting API Responses

*💡 Analogy: Asserting an API response is like inspecting a parcel delivery: you check the status (was it delivered?), the label (correct address?), the contents (right items?), the packaging (correct box type?). Each aspect of the response is independently verifiable.*

**The full response inspection toolkit:**
\`\`\`typescript
test('full response inspection', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { productId: 'WIDGET-A', quantity: 2 },
  });

  // Status code
  expect(response.status()).toBe(201);

  // ok() — shorthand for status 200-299
  expect(response.ok()).toBe(true);

  // Status text
  expect(response.statusText()).toBe('Created');

  // Headers
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');
  expect(headers['location']).toMatch(/\/api\/orders\/\d+/);

  // JSON body
  const body = await response.json();
  expect(body.id).toBeDefined();
  expect(body.status).toBe('pending');
  expect(body.total).toBe(19.98);

  // Text body (for non-JSON responses)
  // const text = await response.text();

  // Raw buffer (for binary responses like file downloads)
  // const buffer = await response.body();
});
\`\`\`

**Asserting nested objects with toMatchObject:**
\`\`\`typescript
test('order response has correct structure', async ({ request }) => {
  const response = await request.get('/api/orders/12345');
  const order = await response.json();

  expect(order).toMatchObject({
    id: '12345',
    status: expect.stringMatching(/pending|processing|shipped/),
    customer: expect.objectContaining({
      email: expect.any(String),
    }),
    items: expect.arrayContaining([
      expect.objectContaining({
        productId: expect.any(String),
        quantity: expect.any(Number),
      }),
    ]),
  });
});
\`\`\`

**Asserting array responses:**
\`\`\`typescript
test('products list response validation', async ({ request }) => {
  const response = await request.get('/api/products?category=electronics');
  const data = await response.json();

  // Count
  expect(data.products).toHaveLength(10);

  // Every item has required fields
  for (const product of data.products) {
    expect(product.id).toBeDefined();
    expect(product.name).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
    expect(product.category).toBe('electronics');
  }

  // Pagination
  expect(data.total).toBeGreaterThanOrEqual(10);
  expect(data.page).toBe(1);
});
\`\`\`

---

### 4. The Hybrid Pattern: API Setup + UI Verify

*💡 Analogy: Instead of setting up a dinner party by cooking everything from scratch during the test (slow, fragile), you order the food pre-prepared via the catering API (fast, reliable), then use the UI to check the table looks correct. The setup is instant; the verification is real.*

This is the most impactful hybrid pattern for professional test suites. Use the API to create test data, then verify the UI renders it correctly.

**Create user via API → verify in UI:**
\`\`\`typescript
test('newly created user appears in admin panel', async ({ request, page }) => {
  // Step 1: Create a user via API — fast and reliable
  const createResponse = await request.post('/api/users', {
    headers: { 'Authorization': 'Bearer admin-token' },
    data: {
      name: 'New Test User',
      email: 'new.test.user@example.com',
      role: 'viewer',
    },
  });
  expect(createResponse.status()).toBe(201);
  const { id: userId } = await createResponse.json();

  // Step 2: Navigate to the admin panel and verify the user appears in the UI
  await page.goto('/admin/users');
  await expect(page.getByText('new.test.user@example.com')).toBeVisible();
  await expect(page.getByRole('row', { name: /New Test User/ })
    .getByRole('badge')).toHaveText('Viewer');

  // Cleanup via API — equally fast
  await request.delete(\`/api/users/\${userId}\`, {
    headers: { 'Authorization': 'Bearer admin-token' },
  });
});
\`\`\`

**Login via API → verify UI dashboard:**
\`\`\`typescript
test('logged-in user sees personalised dashboard', async ({ request, page, context }) => {
  // Step 1: Get auth token via API login
  const loginResponse = await request.post('/api/auth/login', {
    data: { email: 'user@test.com', password: 'password123' },
  });
  const { token } = await loginResponse.json();

  // Step 2: Inject the token into browser cookies/localStorage
  await context.addCookies([{
    name: 'auth-token',
    value: token,
    domain: 'localhost',
    path: '/',
  }]);

  // Step 3: Navigate directly to the protected page — no login form needed
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome back, Test User')).toBeVisible();
  await expect(page.getByTestId('recent-orders')).toBeVisible();
});
\`\`\`

---

### 5. The Hybrid Pattern: UI Action + API Assert

*💡 Analogy: After eating at the restaurant (UI action), you call the kitchen directly (API) to confirm the order was written down correctly — not just that the waiter seemed to understand you. This verifies the full stack: UI sent the right data, API received it, and it was stored correctly.*

**Submit form in UI → verify API stored it correctly:**
\`\`\`typescript
test('contact form submission persists to database', async ({ page, request }) => {
  await page.goto('/contact');

  // Step 1: Fill and submit the form via UI
  await page.getByLabel('Name').fill('Alice Smith');
  await page.getByLabel('Email').fill('alice@test.com');
  await page.getByLabel('Message').fill('I need help with my order');
  await page.getByRole('button', { name: 'Send Message' }).click();

  // Step 2: Assert the success message in UI
  await expect(page.getByRole('alert')).toContainText('Message sent');

  // Step 3: Verify the data was actually saved via API
  const response = await request.get('/api/contact-submissions', {
    headers: { 'Authorization': 'Bearer admin-token' },
  });
  const submissions = await response.json();
  const ourSubmission = submissions.find(
    (s: any) => s.email === 'alice@test.com'
  );

  expect(ourSubmission).toBeDefined();
  expect(ourSubmission.name).toBe('Alice Smith');
  expect(ourSubmission.message).toContain('help with my order');
});
\`\`\`

**UI delete → API verify gone:**
\`\`\`typescript
test('deleting a product removes it from the API', async ({ page, request }) => {
  // Create via API first
  const createRes = await request.post('/api/products', {
    headers: { 'Authorization': 'Bearer admin-token' },
    data: { name: 'Delete Me', price: 9.99, sku: 'DEL-001' },
  });
  const { id } = await createRes.json();

  // Delete via UI
  await page.goto('/admin/products');
  await page.getByRole('row', { name: /Delete Me/ })
    .getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Confirm Delete' }).click();
  await expect(page.getByText('Product deleted')).toBeVisible();

  // Verify it's gone via API
  const getRes = await request.get(\`/api/products/\${id}\`);
  expect(getRes.status()).toBe(404);
});
\`\`\`

---

### 6. Auth via API — Skip the Login UI

*💡 Analogy: You're a backstage crew member at a concert. Audience members queue for hours to get in through the front door (UI login). You have a staff entrance code (API auth) that gets you straight backstage in seconds. The QA engineer who skips the UI login for 200 tests saves hours per day.*

This technique — getting a JWT or session token via API and injecting it — is the single biggest speed optimisation in most test suites.

**Get JWT via POST → inject into localStorage:**
\`\`\`typescript
// fixtures/authenticated.ts — reusable auth setup
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, request }, use) => {
    // Get token via API
    const response = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'test-password' },
    });
    const { accessToken } = await response.json();

    // Inject into localStorage before navigating
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, accessToken);

    await use(page);
  },
});
\`\`\`

**Using storageState — Playwright's recommended auth approach:**
\`\`\`typescript
// global-setup.ts — runs once before the entire test suite
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://example.com/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('test-password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/dashboard');

  // Save auth state (cookies + localStorage) to a file
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}

export default globalSetup;
\`\`\`

\`\`\`typescript
// playwright.config.ts — use the saved auth state
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  projects: [
    {
      name: 'authenticated',
      use: {
        storageState: 'playwright/.auth/user.json', // all tests start logged in
      },
    },
  ],
});
\`\`\`

**The speed gain:**
\`\`\`typescript
// ❌ Without auth shortcut — 200 tests × 3s login each = 600s of pure UI logins
test('dashboard shows correct data', async ({ page }) => {
  await page.goto('/login');           // navigation
  await page.getByLabel('Email').fill('...');  // interaction
  await page.getByLabel('Password').fill('...'); // interaction
  await page.getByRole('button').click(); // click + wait for redirect
  // ≈ 3-5 seconds of setup before the actual test begins
});

// ✅ With storageState — auth is injected instantly, test starts immediately
test('dashboard shows correct data', async ({ page }) => {
  await page.goto('/dashboard'); // already logged in from storageState
  // ≈ 0.5 seconds — just one navigation
});
// 200 tests × 2.5s saved = 500 seconds (8+ minutes) saved per run
\`\`\`

---

### 7. Playwright API vs Postman/Newman

*💡 Analogy: Playwright's API client is like a Swiss Army knife that happens to include a screwdriver. Postman is a professional precision screwdriver set. For most tasks the Swiss Army knife is enough and convenient. For tasks requiring a full suite of precision screwdrivers, Postman is the right tool. A senior QA engineer carries both.*

**Side-by-side comparison:**

| Feature | Playwright request | Postman / Newman |
|---------|--------------------|------------------|
| UI + API in one test | ✅ Native | ❌ Not possible |
| Shared browser context/cookies | ✅ Yes | ❌ No |
| Language-aware assertions | ✅ Jest-style expect | ⚠️ Limited (test scripts) |
| API-only testing | ✅ Works well | ✅ Excellent |
| Collections & documentation | ❌ No | ✅ First-class |
| Contract testing (schemas) | ⚠️ Manual | ✅ With Postman/Pact |
| Team sharing & collaboration | ⚠️ Via git | ✅ Postman cloud |
| CI integration | ✅ Via npx playwright | ✅ Via newman CLI |
| Learning curve for non-devs | ❌ Requires TypeScript | ✅ GUI is accessible |

**When to use Playwright API testing:**
\`\`\`typescript
// ✅ Use Playwright when: the API test is part of a UI flow
test('checkout flow — UI form + API verification', async ({ page, request }) => {
  // UI part: fill checkout form
  await page.goto('/checkout');
  await page.getByLabel('Card Number').fill('4242424242424242');
  await page.getByRole('button', { name: 'Pay' }).click();

  // API part: verify the order was created correctly
  const response = await request.get('/api/orders/latest', {
    headers: { 'Authorization': \`Bearer \${process.env.TEST_TOKEN}\` },
  });
  const order = await response.json();
  expect(order.status).toBe('payment_complete');
});

// ✅ Use Playwright when: you need API calls for test data setup/teardown
// ✅ Use Playwright when: you want one CI pipeline for both UI and API tests
// ✅ Use Playwright when: your team already knows TypeScript
\`\`\`

**When to use Postman/Newman:**
\`\`\`
✅ Use Postman when: you need a shared, documented API collection for the team
✅ Use Postman when: non-technical stakeholders need to run/view API tests
✅ Use Postman when: you need contract testing (schema validation)
✅ Use Postman when: you have a large existing Postman collection
✅ Use Postman when: API testing is a separate workstream from UI testing
\`\`\`

**The pragmatic strategy:**
\`\`\`
Most professional QA teams use BOTH:
  • Postman/Newman: dedicated API contract testing, living API documentation
  • Playwright: hybrid tests where API and UI interact, data setup/teardown
The key insight: use each tool for what it does best.
Do NOT try to replace a complete Postman collection with Playwright just because
you're using Playwright for UI tests.
\`\`\`

> **QA Principle:** The best test suite is the one your whole team can maintain. If half your team uses Postman daily and finds it effective, keep it. Add Playwright API calls where the UI+API hybrid pattern saves meaningful time and improves reliability — don't migrate for migration's sake.
        `
      },

      {
        id: 'pw-auth-at-scale',
        title: 'Authentication at Scale',
        analogy: "Amateur QA engineers log into the app before every test — like a hotel guest who checks in, goes to their room, comes back to the lobby, checks in again, goes to their room, comes back, checks in again — for every single thing they need to do. Expert QA engineers check in once, get a key card, clone the key card, and hand a copy to every room. storageState is the key card cloner. You authenticate once, save the serialised browser session, and every test starts already logged in — instantly, with zero network round-trips.",
        lessonMarkdown: `
## Authentication at Scale

Managing authentication efficiently is one of the clearest dividing lines between beginner and expert Playwright engineers. This module covers every technique you need — from basic session saving to multi-role parallel testing and mocking OAuth flows.

---

### 1. storageState — Serialise & Restore Auth Sessions

💡 **Analogy:** A hotel key card encodes your room access. \`storageState\` is a USB copier that duplicates that card so every test worker starts with a valid copy — no front-desk queue.

\`storageState\` captures the full browser session:

| What it captures | Where it lives in the browser |
|---|---|
| Cookies | Document cookies + HttpOnly cookies |
| localStorage | Per-origin key/value store |
| sessionStorage | Per-tab key/value store |

**Saving state after a real login:**

\`\`\`typescript
// scripts/save-auth.ts
import { chromium } from '@playwright/test';

async function saveAuth() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://app.example.com/login');
  await page.getByLabel('Email').fill('testuser@example.com');
  await page.getByLabel('Password').fill('SuperSecret123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');

  // Serialise cookies + localStorage + sessionStorage to disk
  await page.context().storageState({ path: 'auth/user.json' });
  await browser.close();
  console.log('Auth state saved to auth/user.json');
}

saveAuth();
\`\`\`

**Restoring state in every test:**

\`\`\`typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    storageState: 'auth/user.json',   // every test starts logged in
    baseURL: 'https://app.example.com',
  },
});
\`\`\`

**Or per test file:**

\`\`\`typescript
import { test } from '@playwright/test';

test.use({ storageState: 'auth/user.json' });

test('dashboard loads', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  // Already logged in — no login steps needed
});
\`\`\`

**The performance win:**

\`\`\`
200 tests × 2s login per test = 400 seconds wasted per run
With storageState:           = ~0 seconds for auth setup
Net saving per CI run:       = ~6.5 minutes
\`\`\`

> **QA Tip:** Commit \`auth/*.json\` files to \`.gitignore\` — they contain real session tokens. Generate them fresh in CI via \`globalSetup\`.

---

### 2. globalSetup — Authenticate Once for the Entire Suite

💡 **Analogy:** A bakery's head chef preps all the dough at 5 AM so every baker arriving at 6 AM finds everything ready. \`globalSetup\` is that 5 AM prep run — it executes once before any worker starts.

**playwright.config.ts:**

\`\`\`typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  use: {
    baseURL: 'https://app.example.com',
  },
  projects: [
    {
      name: 'chromium',
      use: { storageState: 'auth/user.json' },
    },
    {
      name: 'admin',
      use: { storageState: 'auth/admin.json' },
    },
  ],
});
\`\`\`

**global-setup.ts — save state for every role:**

\`\`\`typescript
import { chromium, FullConfig } from '@playwright/test';

async function loginAs(
  email: string,
  password: string,
  savePath: string
): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://app.example.com/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');

  await context.storageState({ path: savePath });
  await browser.close();
}

async function globalSetup(config: FullConfig): Promise<void> {
  await Promise.all([
    loginAs('user@example.com',  'pass123', 'auth/user.json'),
    loginAs('admin@example.com', 'admin456', 'auth/admin.json'),
    loginAs('guest@example.com', 'guest789', 'auth/guest.json'),
  ]);
  console.log('All auth states ready');
}

export default globalSetup;
\`\`\`

**global-teardown.ts:**

\`\`\`typescript
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';

async function globalTeardown(config: FullConfig): Promise<void> {
  // Optional: delete auth files after the suite finishes
  ['auth/user.json', 'auth/admin.json', 'auth/guest.json'].forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

export default globalTeardown;
\`\`\`

**How workers share the state file:**

All parallel workers read the same JSON file from disk — it is purely a read operation, so there is no race condition. Workers never write to the file during the test run.

> **QA Tip:** Run \`globalSetup\` in the same Docker image as your CI workers so the session tokens are issued from the same IP and user-agent.

---

### 3. Multi-Role Testing — Multiple Users in One Test

💡 **Analogy:** A security audit needs two investigators in the same building at the same time — one with a master key, one with a visitor badge — to verify the doors behave correctly for each. Multiple browser contexts let you do exactly this within one test.

**Why you need multi-role tests:**

- Admin creates a resource; user should see it but not edit it
- Two users send messages to each other in real time
- Auditor can view billing; regular user gets a 403

**Pattern: one test, two contexts:**

\`\`\`typescript
import { test, expect, Browser } from '@playwright/test';

test('admin can delete record; user sees it disappear', async ({ browser }) => {
  // Context 1 — Admin
  const adminContext = await browser.newContext({
    storageState: 'auth/admin.json',
  });
  const adminPage = await adminContext.newPage();

  // Context 2 — Regular user
  const userContext = await browser.newContext({
    storageState: 'auth/user.json',
  });
  const userPage = await userContext.newPage();

  // Admin navigates to records list
  await adminPage.goto('/records');
  await expect(adminPage.getByText('Record #42')).toBeVisible();

  // User also sees the record
  await userPage.goto('/records');
  await expect(userPage.getByText('Record #42')).toBeVisible();

  // Admin deletes the record
  await adminPage.getByTestId('record-42-delete').click();
  await adminPage.getByRole('button', { name: 'Confirm Delete' }).click();
  await expect(adminPage.getByText('Record #42')).not.toBeVisible();

  // User refreshes — record is gone
  await userPage.reload();
  await expect(userPage.getByText('Record #42')).not.toBeVisible();

  // User has no delete button at all
  await userPage.goto('/records');
  await expect(userPage.getByTestId('record-42-delete')).not.toBeVisible({ timeout: 2000 });

  await adminContext.close();
  await userContext.close();
});
\`\`\`

> **QA Tip:** Always \`close()\` contexts you created manually — Playwright does not auto-close them in \`afterEach\` the way the default \`{ context }\` fixture is managed.

---

### 4. OAuth / SSO Flows

💡 **Analogy:** Testing OAuth is like testing a hotel that outsources key card printing to a third-party vendor. You can't walk into the vendor's factory during the test — so either you mock a fake vendor in your test environment, or you stand up a real vendor account that is safe to abuse in staging.

**Strategy 1 — Mock the OAuth endpoint (fast, isolated):**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('login via mocked OAuth', async ({ page, context }) => {
  // Intercept the OAuth callback and inject a fake code
  await page.route('**/oauth/callback**', async route => {
    // Simulate a successful OAuth redirect back to our app
    await route.fulfill({
      status: 302,
      headers: {
        Location: 'https://app.example.com/dashboard?token=fake-jwt-token',
      },
    });
  });

  // Mock the token exchange endpoint
  await page.route('**/api/auth/token', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake-jwt-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }),
    });
  });

  await page.goto('/login');
  await page.getByRole('button', { name: 'Login with Google' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
\`\`\`

**Strategy 2 — Real OAuth flow with a test application:**

\`\`\`typescript
test('real Google OAuth login (staging test app)', async ({ page }) => {
  await page.goto('/login');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Login with Google' }).click();
  const popup = await popupPromise;

  // Interact with Google's real login page
  await popup.getByLabel('Email or phone').fill(process.env.GOOGLE_TEST_EMAIL!);
  await popup.getByRole('button', { name: 'Next' }).click();
  await popup.getByLabel('Enter your password').fill(process.env.GOOGLE_TEST_PASS!);
  await popup.getByRole('button', { name: 'Next' }).click();

  // Popup closes after successful auth
  await popup.waitForEvent('close');

  // Main page should now be on the dashboard
  await expect(page).toHaveURL(/dashboard/);
});
\`\`\`

**Handling token refresh — mock an expired token:**

\`\`\`typescript
test('expired token triggers refresh flow', async ({ page, context }) => {
  // Set an expired access token in localStorage
  await context.addInitScript(() => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'valid-refresh-token');
    localStorage.setItem('token_expiry', String(Date.now() - 1000)); // expired
  });

  // Mock the refresh endpoint
  await page.route('**/api/auth/refresh', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ access_token: 'new-fresh-token', expires_in: 3600 }),
    });
  });

  await page.goto('/dashboard');
  // App should have silently refreshed and loaded normally
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
\`\`\`

---

### 5. API-Seeded Authentication

💡 **Analogy:** Instead of walking through the hotel lobby to get a key card, you call the concierge on the phone, get them to email you a digital key, and let yourself in via the app. API auth bypasses the UI entirely for maximum speed.

**POST to /auth/login and inject the JWT:**

\`\`\`typescript
import { test, expect, request } from '@playwright/test';

test('API-seeded auth — fastest possible setup', async ({ page, context }) => {
  // Step 1: Get a JWT via API (no browser UI involved)
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post('https://api.example.com/auth/login', {
    data: {
      email: 'testuser@example.com',
      password: 'Secret123',
    },
  });
  const { token } = await loginResponse.json();

  // Step 2: Inject the token before the page loads
  await context.addInitScript((jwtToken: string) => {
    localStorage.setItem('auth_token', jwtToken);
    localStorage.setItem('user_email', 'testuser@example.com');
  }, token);

  // Step 3: Set the token as a default header for all API calls the page makes
  await context.setExtraHTTPHeaders({
    'Authorization': \`Bearer \${token}\`,
  });

  // Step 4: Navigate — app picks up the token from localStorage
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await apiContext.dispose();
});
\`\`\`

**Combining API auth with storageState for the fastest possible setup:**

\`\`\`typescript
// global-setup.ts — API-based version
import { request } from '@playwright/test';
import * as fs from 'fs';

export default async function globalSetup() {
  const apiContext = await request.newContext({
    baseURL: 'https://api.example.com',
  });

  const response = await apiContext.post('/auth/login', {
    data: { email: 'user@example.com', password: 'pass123' },
  });
  const { token } = await response.json();

  // Build a minimal storageState manually — no browser required
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: 'https://app.example.com',
        localStorage: [
          { name: 'auth_token', value: token },
          { name: 'user_role', value: 'viewer' },
        ],
      },
    ],
  };

  fs.mkdirSync('auth', { recursive: true });
  fs.writeFileSync('auth/user.json', JSON.stringify(storageState, null, 2));

  await apiContext.dispose();
}
\`\`\`

| Auth Method | Browser started? | Speed | Best for |
|---|---|---|---|
| UI login every test | Yes | Slowest | Legacy apps with no API |
| storageState restore | No (load from file) | Fast | Most apps |
| globalSetup + storageState | Once total | Fastest | Large suites |
| API-seeded JWT | No | Fastest | Token-based SPAs |

---

### 6. Cookie Manipulation

💡 **Analogy:** Cookies are like wristbands at a festival. The server issues them, and the browser presents them on every request. Being able to forge, read, and revoke wristbands in tests lets you simulate any access scenario instantly.

**Adding cookies manually:**

\`\`\`typescript
test('cookie manipulation', async ({ context, page }) => {
  // Add a session cookie manually — no login flow needed
  await context.addCookies([
    {
      name: 'session_id',
      value: 'abc123xyz',
      domain: 'app.example.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    },
    {
      name: 'user_role',
      value: 'admin',
      domain: 'app.example.com',
      path: '/',
    },
  ]);

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
});
\`\`\`

**Reading cookies for assertions:**

\`\`\`typescript
test('assert cookie is set after login', async ({ page, context }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('pass123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  const cookies = await context.cookies();
  const sessionCookie = cookies.find(c => c.name === 'session_id');

  expect(sessionCookie).toBeDefined();
  expect(sessionCookie!.httpOnly).toBe(true);
  expect(sessionCookie!.secure).toBe(true);
  expect(sessionCookie!.value).toHaveLength(32); // assert token format
});
\`\`\`

**Testing session expiry:**

\`\`\`typescript
test('expired session redirects to login', async ({ context, page }) => {
  // Set a cookie that expired in the past
  await context.addCookies([
    {
      name: 'session_id',
      value: 'expiredtoken',
      domain: 'app.example.com',
      path: '/',
      expires: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    },
  ]);

  await page.goto('/dashboard');
  // App should detect the expired session and redirect
  await expect(page).toHaveURL(/login/);
  await expect(page.getByText('Your session has expired')).toBeVisible();
});
\`\`\`

**Clearing cookies to test logged-out state mid-test:**

\`\`\`typescript
test('logged-out state shows correct UI', async ({ context, page }) => {
  // Start logged in
  await context.addCookies([{ name: 'session_id', value: 'valid', domain: 'app.example.com', path: '/' }]);
  await page.goto('/dashboard');
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  // Clear all cookies — simulates logout or cookie deletion
  await context.clearCookies();
  await page.reload();
  await expect(page).toHaveURL(/login/);
});
\`\`\`

---

### 7. Testing Role-Based Access Control (RBAC)

💡 **Analogy:** RBAC testing is like giving a skeleton key to a security consultant and asking them to try every door in the building with every badge type. Playwright's parameterised role pattern automates that audit.

**Pattern: same test body, different storageState per role:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

const roles = [
  { name: 'admin',   storageState: 'auth/admin.json',   canEdit: true,  canDelete: true  },
  { name: 'editor',  storageState: 'auth/editor.json',  canEdit: true,  canDelete: false },
  { name: 'viewer',  storageState: 'auth/viewer.json',  canEdit: false, canDelete: false },
];

for (const role of roles) {
  test.describe(\`RBAC: \${role.name}\`, () => {
    test.use({ storageState: role.storageState });

    test('edit button visibility', async ({ page }) => {
      await page.goto('/records/42');

      if (role.canEdit) {
        await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
      } else {
        await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible();
      }
    });

    test('delete button visibility', async ({ page }) => {
      await page.goto('/records/42');

      if (role.canDelete) {
        await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
      } else {
        await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
      }
    });

    test('API returns correct status', async ({ page, request }) => {
      // Attempt to hit a protected API endpoint directly
      const response = await page.request.put('/api/records/42', {
        data: { title: 'Changed' },
      });

      if (role.canEdit) {
        expect(response.status()).toBe(200);
      } else {
        expect(response.status()).toBe(403);
      }
    });
  });
}
\`\`\`

**Monitoring 403 responses via page.route():**

\`\`\`typescript
test('viewer gets 403 on admin API', async ({ page }) => {
  test.use({ storageState: 'auth/viewer.json' });

  const blockedRequests: string[] = [];

  await page.route('**/api/admin/**', async route => {
    blockedRequests.push(route.request().url());
    await route.continue();
  });

  await page.goto('/admin');

  // After page load, assert the admin API was attempted and blocked
  const responses = await Promise.all(
    blockedRequests.map(url => page.request.get(url))
  );
  responses.forEach(r => expect(r.status()).toBe(403));
});
\`\`\`

**RBAC test matrix — what the 3-role × 4-page pattern produces:**

| Role | /dashboard | /records | /admin | /billing |
|---|---|---|---|---|
| admin | 200 | 200 | 200 | 200 |
| editor | 200 | 200 | 403 | 403 |
| viewer | 200 | 200 | 403 | 403 |

> **QA Tip:** Store storageState files per role and regenerate them in \`globalSetup\` on every CI run. Never commit real passwords — use environment variables (\`process.env.ADMIN_PASSWORD\`) in your setup scripts.
        `
      },

      {
        id: 'pw-visual-regression',
        title: 'Visual Regression Testing',
        analogy: "Visual regression testing is like a meticulous art restorer who photographs a painting at the start of every day. At the end of the day they overlay the new photo on the baseline. Any change — even a single brushstroke — shows up as a highlighted diff. Without this system, gradual drift goes unnoticed until the painting looks nothing like the original. With it, the moment any pixel changes unexpectedly, the alarm sounds. toHaveScreenshot() is that daily photograph — automated, pixel-perfect, relentless.",
        lessonMarkdown: `
## Visual Regression Testing

Visual regression testing catches UI changes that functional tests miss entirely. A button can be "clickable" and still be the wrong colour, have the wrong font, or be half-hidden behind another element. This module teaches you to build a pixel-perfect visual safety net around your UI.

---

### 1. How toHaveScreenshot() Works

💡 **Analogy:** \`toHaveScreenshot()\` is a photocopier that takes a reference print on the first run, then compares every future print against it using a light table — any deviation shows as a coloured highlight.

**The lifecycle:**

\`\`\`
First run (no baseline exists)
  → Playwright takes screenshot
  → Saves it as the baseline PNG in __snapshots__/
  → Test is marked "failed" (this is expected — you must review and commit the baseline)

Subsequent runs (baseline exists)
  → Playwright takes screenshot
  → Compares pixel-by-pixel against baseline
  → Passes if within tolerance, fails with a diff image if not
\`\`\`

**Where baselines live:**

\`\`\`
tests/
  login.spec.ts
  login.spec.ts-snapshots/
    login-page-chromium-linux.png      ← baseline
    login-page-firefox-linux.png       ← per-browser baselines
    login-page-webkit-linux.png
\`\`\`

**The diff output on failure:**

When a visual test fails, Playwright writes three files next to the spec:
- \`login-page-actual.png\` — what the test saw
- \`login-page-expected.png\` — the baseline
- \`login-page-diff.png\` — pink highlights showing changed pixels

| File | Purpose |
|---|---|
| \`-actual.png\` | What your app looks like right now |
| \`-expected.png\` | The committed baseline |
| \`-diff.png\` | Magenta pixels = changed areas |

---

### 2. Taking Your First Visual Snapshot

💡 **Analogy:** The first time you scan your passport, the machine has nothing to compare — it just saves your photo. Every scan after that checks "does this face match the one we have on file?"

**Full-page screenshot:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('login page visual', async ({ page }) => {
  await page.goto('/login');
  // Wait for any loading spinners to finish
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('login-page.png', {
    fullPage: true,
  });
});
\`\`\`

**Element-level screenshot:**

\`\`\`typescript
test('primary button visual', async ({ page }) => {
  await page.goto('/components');

  const button = page.getByRole('button', { name: 'Get Started' });
  await expect(button).toHaveScreenshot('primary-button.png');
});
\`\`\`

**Different page states:**

\`\`\`typescript
test('modal visual states', async ({ page }) => {
  await page.goto('/dashboard');

  // Baseline: modal closed
  await expect(page).toHaveScreenshot('dashboard-no-modal.png');

  // Baseline: modal open
  await page.getByRole('button', { name: 'Open Settings' }).click();
  await page.getByRole('dialog').waitFor();
  await expect(page).toHaveScreenshot('dashboard-modal-open.png');
});
\`\`\`

**Updating baselines when an intentional change is made:**

\`\`\`bash
npx playwright test --update-snapshots
\`\`\`

> **QA Tip:** Always run \`--update-snapshots\` on the exact OS and browser you use in CI. Baselines generated on macOS will fail on Linux CI due to font rendering differences.

---

### 3. Masking Dynamic Content

💡 **Analogy:** A portrait photographer uses a background cloth to mask the messy studio behind the subject — the photo is of the person, not the clutter. Masking tells Playwright "ignore this region; only compare the parts that matter."

**The problem — dynamic content breaks visual tests:**

\`\`\`
❌ Timestamp: "Last seen 3 minutes ago"  → changes every test run
❌ User avatar: fetched from Gravatar    → may change
❌ Advertisement banner: random content → always different
❌ Chart with live data: values shift    → never stable
\`\`\`

**Masking specific locators:**

\`\`\`typescript
test('dashboard visual — masked dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.getByTestId('last-seen-timestamp'),
      page.getByRole('img', { name: 'user avatar' }),
      page.getByTestId('ad-banner'),
      page.locator('.live-chart'),
    ],
    maskColor: '#FF00FF',  // magenta fill in the masked region
    fullPage: true,
  });
});
\`\`\`

**Clipping to a stable region:**

\`\`\`typescript
test('navigation bar visual only', async ({ page }) => {
  await page.goto('/dashboard');

  // Only screenshot the top navigation — ignore the dynamic content below
  await expect(page).toHaveScreenshot('navbar.png', {
    clip: { x: 0, y: 0, width: 1280, height: 64 },
  });
});
\`\`\`

**Disabling CSS animations before screenshotting:**

\`\`\`typescript
test('no animation flicker in screenshot', async ({ page }) => {
  await page.goto('/dashboard');

  // Freeze all CSS animations and transitions
  await page.addStyleTag({
    content: \`
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    \`,
  });

  await expect(page).toHaveScreenshot('dashboard-no-animation.png');
});
\`\`\`

**Or via \`evaluate\`:**

\`\`\`typescript
await page.evaluate(() => {
  document.querySelectorAll('*').forEach(el => {
    (el as HTMLElement).style.animationDuration = '0s';
    (el as HTMLElement).style.transitionDuration = '0s';
  });
});
\`\`\`

> **QA Tip:** Create a helper function \`freezeAnimations(page)\` and call it in a \`beforeEach\` hook across all visual spec files.

---

### 4. Threshold & Pixel Tolerance

💡 **Analogy:** A print shop's quality control doesn't reject a flyer because one pixel is 1% darker than the proof — that's within tolerance. But a 5% colour shift on the logo? That gets flagged. Thresholds let you define "close enough" for your context.

**The three tolerance options:**

| Option | Type | What it controls |
|---|---|---|
| \`maxDiffPixels\` | absolute integer | Max number of pixels that can differ |
| \`maxDiffPixelRatio\` | float 0–1 | Max fraction of pixels that can differ |
| \`threshold\` | float 0–1 | Per-pixel colour difference tolerance |

**\`maxDiffPixels\` — good for small components:**

\`\`\`typescript
test('button allows 5 pixel tolerance', async ({ page }) => {
  await page.goto('/components');
  await expect(page.getByRole('button', { name: 'Submit' })).toHaveScreenshot(
    'submit-button.png',
    { maxDiffPixels: 5 }
  );
});
\`\`\`

**\`maxDiffPixelRatio\` — good for full-page screenshots:**

\`\`\`typescript
test('full page allows 0.5% pixel diff', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard-full.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.005,  // 0.5% of total pixels
  });
});
\`\`\`

**\`threshold\` — per-pixel colour sensitivity:**

\`\`\`typescript
test('colour-sensitive component', async ({ page }) => {
  await page.goto('/brand-colours');
  await expect(page.getByTestId('brand-logo')).toHaveScreenshot('logo.png', {
    threshold: 0.1,  // 10% colour difference per pixel is acceptable
  });
});
\`\`\`

**Why you always need some tolerance — anti-aliasing:**

Different operating systems and browsers render sub-pixel anti-aliasing slightly differently. A font edge that is 40% grey on Linux may be 42% grey on macOS. Without any tolerance, cross-platform tests will always fail. A threshold of \`0.1\` to \`0.2\` handles this gracefully.

\`\`\`typescript
// playwright.config.ts — set global defaults
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      threshold: 0.2,           // colour tolerance per pixel
      maxDiffPixelRatio: 0.01,  // up to 1% of pixels can differ
    },
  },
});
\`\`\`

---

### 5. Cross-Browser & Cross-OS Baselines

💡 **Analogy:** A recipe that uses "a pinch of salt" is interpreted differently by a French chef and a Japanese chef. Font rendering is the same — each OS/browser combination has its own interpretation of "render this glyph." You need one set of baselines per platform.

**Why baselines differ:**

| Factor | Effect |
|---|---|
| macOS font smoothing | Darker, heavier sub-pixel rendering |
| Windows ClearType | Different hinting algorithm |
| Linux (CI) | Minimal font hinting, slightly different spacing |
| Chromium vs Firefox | Different text rendering engines |
| Device pixel ratio | Retina vs 1x screens |

**The solution: generate baselines in CI, compare in CI:**

\`\`\`typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  snapshotPathTemplate:
    '{testDir}/__snapshots__/{testFilePath}/{arg}-{projectName}-linux{ext}',

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
\`\`\`

**This produces separate baseline folders:**

\`\`\`
__snapshots__/
  login.spec.ts/
    login-page-chromium-linux.png
    login-page-firefox-linux.png
    login-page-webkit-linux.png
\`\`\`

**Snapshot path configuration:**

\`\`\`typescript
export default defineConfig({
  // Keep snapshots next to spec files for easy discoverability
  snapshotDir: './visual-baselines',

  // Or use the default: {spec-file}-snapshots/ folder
});
\`\`\`

> **QA Tip:** Add \`visual-baselines/\` to git so baselines are version-controlled. Use \`.gitattributes\` to tell git these are binary files: \`*.png binary\`. For suites with 1000+ screenshots, consider Git LFS.

---

### 6. CI Workflow for Visual Tests

💡 **Analogy:** Visual regression in CI is like a magazine's final proof review — every page is compared against the approved layout before printing. If a designer accidentally shifted a margin, the proof-reader catches it before 100,000 copies are printed.

**GitHub Actions — upload diff images as artifacts on failure:**

\`\`\`yaml
# .github/workflows/visual.yml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run visual tests
        run: npx playwright test tests/visual/
        continue-on-error: true  # so we still upload artifacts even on failure

      - name: Upload diff images on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs-\${{ github.run_id }}
          path: |
            test-results/
            **/*-diff.png
            **/*-actual.png
          retention-days: 30
\`\`\`

**Updating baselines via workflow_dispatch:**

\`\`\`yaml
name: Update Visual Baselines

on:
  workflow_dispatch:
    inputs:
      test_filter:
        description: 'Test file pattern to update (leave blank for all)'
        required: false

jobs:
  update-baselines:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Update snapshots
        run: npx playwright test \${{ inputs.test_filter }} --update-snapshots

      - name: Commit updated baselines
        run: |
          git config user.name "playwright-bot"
          git config user.email "bot@example.com"
          git add '**/*.png'
          git commit -m "chore: update visual baselines [skip ci]"
          git push
\`\`\`

> **QA Tip:** The "approve visual changes" workflow: run the update job on a branch, open a PR showing before/after screenshot diffs, have a human review and merge. This makes intentional visual changes as auditable as code changes.

---

### 7. toMatchSnapshot() Beyond Screenshots

💡 **Analogy:** Snapshot testing for non-visual data is like a notary who takes a certified copy of a document. Any future version of the document can be compared against the notarised copy to detect unauthorised changes.

**JSON API response snapshots:**

\`\`\`typescript
test('API response shape is stable', async ({ request }) => {
  const response = await request.get('/api/users/1');
  const body = await response.json();

  // Strip volatile fields before snapshotting
  delete body.created_at;
  delete body.updated_at;
  delete body.last_login;

  expect(body).toMatchSnapshot('user-api-response.json');
});
\`\`\`

**HTML structure snapshots — catch unexpected DOM changes:**

\`\`\`typescript
test('navigation DOM structure is stable', async ({ page }) => {
  await page.goto('/');
  const navHTML = await page.locator('nav').innerHTML();

  // Normalise whitespace before snapshotting
  const normalised = navHTML.replace(/\s+/g, ' ').trim();
  expect(normalised).toMatchSnapshot('navigation-html.txt');
});
\`\`\`

**Console output snapshots:**

\`\`\`typescript
test('page logs expected analytics events', async ({ page }) => {
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'log') consoleLogs.push(msg.text());
  });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Complete Purchase' }).click();

  expect(consoleLogs.filter(l => l.startsWith('[analytics]'))).toMatchSnapshot(
    'checkout-analytics-events.json'
  );
});
\`\`\`

**When snapshot testing beats \`expect().toEqual()\`:**

| Situation | Best tool |
|---|---|
| Large nested object (100+ fields) | \`toMatchSnapshot()\` — easy to review diffs |
| API response that rarely changes | \`toMatchSnapshot()\` — detect unintended changes |
| Small object with known fields | \`toEqual()\` — explicit, self-documenting |
| Object that changes every run | Neither — assert structure only (\`toHaveProperty\`) |
| DOM structure audit | \`toMatchSnapshot()\` — HTML is too verbose for \`toEqual\` |

> **QA Tip:** For JSON snapshots, pipe the output through a stable sort before snapping — object key order is not guaranteed in JavaScript and can cause spurious failures.
        `
      },

      {
        id: 'pw-ci-cd-sharding',
        title: 'CI/CD Integration & Test Sharding',
        analogy: "Running a full test suite on a single CI machine is like serving a 500-person wedding banquet with one chef. Every dish is perfect — but guests are still waiting for dessert at midnight. Sharding is hiring 10 chefs, dividing the menu equally between them, and running all 10 kitchens simultaneously. The banquet finishes on time. Playwright's --shard flag is the headwaiter who divides the menu and coordinates the kitchens — each CI agent gets its slice, they all run in parallel, and the reports are merged at the end.",
        lessonMarkdown: `
## CI/CD Integration & Test Sharding

Playwright's speed advantage is only realised when your CI pipeline is properly configured. This module covers everything from a production-ready GitHub Actions workflow to advanced sharding strategies and flaky test management.

---

### 1. GitHub Actions — Complete Working Workflow

💡 **Analogy:** A CI workflow is an assembly line — each station (step) has one job, passes its output to the next station, and the whole line runs automatically when a new car (commit) arrives.

**Complete annotated \`.github/workflows/playwright.yml\`:**

\`\`\`yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  BASE_URL: https://staging.example.com
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      # 1. Checkout the code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Node.js with npm caching
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      # 3. Install project dependencies
      - name: Install dependencies
        run: npm ci

      # 4. Cache Playwright browsers — keyed to the Playwright version
      - name: Cache Playwright browsers
        id: playwright-cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-\${{ hashFiles('package-lock.json') }}

      # 5. Install browsers only if cache missed
      - name: Install Playwright browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps

      # 6. Run the tests
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: \${{ env.BASE_URL }}
          TEST_USER_EMAIL: \${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASS: \${{ secrets.TEST_USER_PASS }}
          ADMIN_EMAIL: \${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASS: \${{ secrets.ADMIN_PASS }}

      # 7. Upload HTML report, traces, and screenshots on failure
      - name: Upload test artifacts
        if: always()  # upload even if tests failed
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-\${{ github.run_id }}
          path: |
            playwright-report/
            test-results/
          retention-days: 30
\`\`\`

**playwright.config.ts — CI-aware configuration:**

\`\`\`typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,    // fail if test.only() is committed
  retries: process.env.CI ? 2 : 0, // retry flaky tests only in CI
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html'], ['junit', { outputFile: 'results.xml' }]]
    : [['html', { open: 'on-failure' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',   // capture trace on first retry
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
\`\`\`

---

### 2. Test Sharding — Running in Parallel Across Agents

💡 **Analogy:** Sharding is like splitting a deck of cards between dealers at a casino — each dealer gets their share, runs their table independently, and the house gets all the results at the end. No dealer waits for another.

**How the \`--shard\` flag works:**

\`\`\`bash
# Run shard 1 of 4 (first 25% of tests)
npx playwright test --shard=1/4

# Run shard 2 of 4
npx playwright test --shard=2/4

# Each shard is independent — they can run simultaneously on separate machines
\`\`\`

**How Playwright distributes tests across shards:**

\`\`\`
All test files sorted alphabetically:
  account.spec.ts    → shard 1
  auth.spec.ts       → shard 1
  billing.spec.ts    → shard 2
  checkout.spec.ts   → shard 2
  dashboard.spec.ts  → shard 3
  profile.spec.ts    → shard 3
  settings.spec.ts   → shard 4
  users.spec.ts      → shard 4
\`\`\`

**GitHub Actions matrix — 4 shards in parallel:**

\`\`\`yaml
name: Playwright Tests (Sharded)

on: [push, pull_request]

jobs:
  test:
    name: Shard \${{ matrix.shard }}/\${{ matrix.total }}
    runs-on: ubuntu-latest
    timeout-minutes: 30

    strategy:
      fail-fast: false  # run all shards even if one fails
      matrix:
        shard: [1, 2, 3, 4]
        total: [4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Run shard \${{ matrix.shard }}/\${{ matrix.total }}
        run: npx playwright test --shard=\${{ matrix.shard }}/\${{ matrix.total }}
        env:
          BASE_URL: \${{ vars.BASE_URL }}

      - name: Upload blob report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-\${{ matrix.shard }}
          path: blob-report/
          retention-days: 1
\`\`\`

**Calculating the right number of shards:**

\`\`\`
Formula: shards = ceil(suite_duration / target_shard_duration)

Example:
  Total suite:    40 minutes
  Target per PR:  10 minutes
  Shards needed:  ceil(40 / 10) = 4 shards

Rule of thumb:
  < 5 min suite:    no sharding needed
  5–20 min suite:   2–4 shards
  20–60 min suite:  4–8 shards
  > 60 min suite:   8–16 shards (also consider parallelism within shards)
\`\`\`

---

### 3. Merging Shard Reports

💡 **Analogy:** Four sub-contractors each complete their section of a building inspection. Before the owner gets the report, an project manager collects all four sub-reports, merges them into one document, and hands over a unified finding. \`playwright merge-reports\` is that project manager.

**Step 1 — Configure blob reporter on each shard:**

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  reporter: process.env.CI
    ? [
        ['blob'],              // writes to blob-report/ — merging input
        ['github'],            // inline annotations in GitHub PR
      ]
    : [['html', { open: 'on-failure' }]],
});
\`\`\`

**Step 2 — Merge job after all shards complete:**

\`\`\`yaml
  merge-reports:
    name: Merge & Publish Report
    runs-on: ubuntu-latest
    needs: [test]    # wait for all shard jobs to finish
    if: always()

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci

      # Download all 4 blob reports
      - name: Download blob reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports/
          pattern: blob-report-*
          merge-multiple: true

      # Merge into a single HTML report
      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      # Publish the unified report as a GitHub Pages artifact
      - name: Upload merged HTML report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-full-report-\${{ github.run_id }}
          path: playwright-report/
          retention-days: 30
\`\`\`

**What the merged report gives you:**

| Feature | Available in merged report |
|---|---|
| All tests from all shards | Yes |
| Retry information | Yes |
| Attached traces | Yes |
| Screenshots on failure | Yes |
| Video recordings | Yes |
| Shard breakdown filter | Yes |

---

### 4. Docker — Reproducible Test Environments

💡 **Analogy:** Docker is a shipping container for your test environment. The container has the same contents whether it ships from Shanghai, Rotterdam, or Houston — fonts, OS libraries, timezone settings, screen resolution are all identical everywhere it runs.

**Why tests pass locally but fail in CI:**

| Difference | Effect on tests |
|---|---|
| Font rendering | Visual snapshots differ |
| System timezone | Date/time assertions fail |
| Locale | Number/currency formatting |
| Screen resolution | Viewport-dependent layout |
| Missing system fonts | Text overflow, truncation |
| Browser version | Rendering differences |

**Using the official Playwright Docker image:**

\`\`\`bash
# Run tests in the official image (includes all browsers + deps)
docker run --rm \
  -v $(pwd):/work \
  -w /work \
  -e BASE_URL=https://staging.example.com \
  mcr.microsoft.com/playwright:v1.44.0-jammy \
  npx playwright test
\`\`\`

**Custom Dockerfile:**

\`\`\`dockerfile
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Default command — can be overridden
CMD ["npx", "playwright", "test"]
\`\`\`

**Docker Compose for testing against a local app:**

\`\`\`yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgres://test:test@db:5432/testdb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U test']
      interval: 5s
      timeout: 5s
      retries: 5

  playwright:
    image: mcr.microsoft.com/playwright:v1.44.0-jammy
    volumes:
      - .:/work
    working_dir: /work
    depends_on:
      app:
        condition: service_started
    environment:
      - BASE_URL=http://app:3000
    command: npx playwright test
\`\`\`

\`\`\`bash
# Run the full stack test
docker compose -f docker-compose.test.yml up --exit-code-from playwright
\`\`\`

---

### 5. Azure DevOps Pipeline

💡 **Analogy:** Azure DevOps is the same assembly line as GitHub Actions, just manufactured in a different factory — the conveyor belts work slightly differently, but the production goal is identical.

**Complete \`azure-pipelines.yml\`:**

\`\`\`yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: ubuntu-latest

variables:
  NODE_VERSION: '20.x'
  BASE_URL: 'https://staging.example.com'

stages:
  - stage: Test
    jobs:
      - job: PlaywrightTests
        strategy:
          parallel: 4  # 4 parallel agents
        timeoutInMinutes: 30

        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: 'Install Node.js'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npx playwright install --with-deps chromium
            displayName: 'Install Playwright browsers'

          - script: |
              TOTAL_AGENTS=4
              AGENT_NUMBER=$((System.JobPositionInPhase))
              npx playwright test \
                --shard=$AGENT_NUMBER/$TOTAL_AGENTS \
                --reporter=junit,blob
            displayName: 'Run Playwright tests (shard $(System.JobPositionInPhase)/4)'
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER_EMAIL: $(TEST_USER_EMAIL)
              TEST_USER_PASS: $(TEST_USER_PASS)

          - task: PublishTestResults@2
            condition: always()
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/results-*.xml'
              testRunTitle: 'Playwright Tests — Shard $(System.JobPositionInPhase)'
            displayName: 'Publish JUnit results'

          - task: PublishBuildArtifacts@1
            condition: always()
            inputs:
              pathToPublish: 'blob-report'
              artifactName: 'blob-report-$(System.JobPositionInPhase)'
            displayName: 'Upload blob report'

  - stage: MergeReports
    dependsOn: Test
    condition: always()
    jobs:
      - job: MergeAndPublish
        steps:
          - task: DownloadBuildArtifacts@1
            inputs:
              artifactName: 'blob-report-*'
              downloadPath: 'all-blob-reports'

          - script: npx playwright merge-reports --reporter html ./all-blob-reports
            displayName: 'Merge shard reports'

          - task: PublishBuildArtifacts@1
            inputs:
              pathToPublish: 'playwright-report'
              artifactName: 'playwright-full-report'
\`\`\`

---

### 6. Flaky Test Management in CI

💡 **Analogy:** A flaky test is like a smoke detector that goes off when you make toast. The alarm works — it's just too sensitive. You need to tune it, not rip it out. The quarantine pattern is a dedicated room for over-sensitive detectors while you fix them.

**\`forbidOnly\` — prevent committed \`.only()\` from silently hiding tests:**

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  forbidOnly: !!process.env.CI,
  // In CI, any test.only() causes the entire run to fail immediately
  // This catches the common mistake of committing a focused test
});
\`\`\`

**\`retries\` — retry on CI, fail fast locally:**

\`\`\`typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  // Locally: see failures immediately without waiting for retries
  // CI: give flaky tests two more chances before failing the build
});
\`\`\`

**The quarantine pattern — tag and exclude known flaky tests:**

\`\`\`typescript
// Mark a flaky test for quarantine
test('known flaky: realtime notification @flaky', async ({ page }) => {
  // ... test body
});
\`\`\`

\`\`\`bash
# Main CI run — exclude @flaky tests
npx playwright test --grep-invert "@flaky"

# Separate nightly quarantine run — only @flaky tests
npx playwright test --grep "@flaky"
\`\`\`

**Tracking flakiness rates with the JSON reporter:**

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['json', { outputFile: 'test-results/results.json' }],
    ['html'],
  ],
});
\`\`\`

\`\`\`typescript
// scripts/analyze-flakiness.ts
import results from '../test-results/results.json';

interface TestResult {
  title: string;
  status: string;
  retry: number;
}

const flaky = (results.suites as any[])
  .flatMap(s => s.specs)
  .filter((spec: TestResult) => spec.retry > 0 && spec.status === 'passed');

console.table(
  flaky.map(f => ({ test: f.title, retries: f.retry }))
);
\`\`\`

**Decision framework — fix vs quarantine:**

| Situation | Action |
|---|---|
| Flaky < 5% of runs, easy to fix | Fix immediately |
| Flaky > 20% of runs | Quarantine + assign owner |
| Intermittently flaky across all environments | Investigate race condition |
| Flaky only on CI, passes locally | Likely timing or environment issue |
| Flaky for > 2 sprints with no fix | Consider deleting the test |

---

### 7. Artifact Management & Quality Gates

💡 **Analogy:** Artifacts are the evidence locker from each CI run — traces, videos, and screenshots that let you reconstruct exactly what happened without re-running the test. Quality gates are the security guard who checks your ID before you merge — failing the merge if the pass rate drops below the standard.

**Artifact upload with retention policy:**

\`\`\`yaml
- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results-\${{ github.run_id }}-\${{ github.run_attempt }}
    path: |
      playwright-report/
      test-results/
      **/*.png
      **/*.webm
      **/*.zip    # Playwright traces
    retention-days: 30
\`\`\`

**Slack notification on pipeline failure:**

\`\`\`yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": ":x: Playwright tests failed on \`\${{ github.ref_name }}\`",
        "attachments": [
          {
            "color": "danger",
            "fields": [
              { "title": "Branch", "value": "\${{ github.ref_name }}", "short": true },
              { "title": "Commit", "value": "\${{ github.sha }}", "short": true },
              { "title": "Run", "value": "\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}" }
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
\`\`\`

**Quality gate — fail the PR if pass rate drops below threshold:**

\`\`\`typescript
// scripts/quality-gate.ts
import * as fs from 'fs';

const results = JSON.parse(fs.readFileSync('test-results/results.json', 'utf8'));

const total = results.stats.expected + results.stats.unexpected;
const passed = results.stats.expected;
const passRate = passed / total;
const threshold = 0.95; // 95% pass rate required

console.log(\`Pass rate: \${(passRate * 100).toFixed(1)}% (\${passed}/\${total})\`);

if (passRate < threshold) {
  console.error(\`QUALITY GATE FAILED: \${(passRate * 100).toFixed(1)}% < \${threshold * 100}% required\`);
  process.exit(1);
}

console.log('Quality gate passed.');
\`\`\`

\`\`\`yaml
# In your workflow, run the gate after tests
- name: Quality gate check
  run: npx ts-node scripts/quality-gate.ts
\`\`\`

**Test result trending — track suite health over time:**

| Metric to track | How to collect it | Alert threshold |
|---|---|---|
| Pass rate | JSON reporter | < 95% |
| Flaky test count | Retry > 0 in JSON | > 5 tests |
| Suite duration | \`results.stats.duration\` | > 20 min |
| Skipped tests | \`results.stats.skipped\` | Increasing trend |
| Test count | \`results.stats.expected\` | Unexpected drop |

> **QA Tip:** Store the JSON report as a CI artifact and feed it into a dashboard tool (Grafana, DataDog, or a simple Google Sheet via API) to build a week-over-week flakiness trend. Flakiness that slowly increases over months is the hardest to spot without trending data.
        `
      },

      {
        id: 'pw-debugging-cdp',
        title: 'Advanced Debugging & Chrome DevTools Protocol',
        analogy: "The Chrome DevTools Protocol is the secret radio channel that Chrome uses to talk to its own developer tools. When you open DevTools in Chrome and see network requests, performance timelines, JavaScript profiling — all of that data flows over CDP. Playwright gives you a direct line into this same channel from your test code. It is like being given a backstage pass at a concert: you can watch the soundboard, monitor every speaker, adjust the levels, and hear things the audience never hears — all while the show is running.",
        lessonMarkdown: `
## Advanced Debugging & Chrome DevTools Protocol

This module unlocks the professional-grade debugging and instrumentation capabilities that separate expert Playwright engineers from everyone else. CDP gives you direct programmatic access to Chrome's internals — network throttling, performance metrics, JavaScript coverage, and more.

---

### 1. Chrome DevTools Protocol (CDP) — What It Is and Why It Matters

💡 **Analogy:** CDP is the electrical wiring behind the walls of your house. Everything you see in the rooms (DevTools UI) is just a plug socket — CDP is the actual wiring that carries the current. Playwright lets you wire directly into the mains.

**What CDP is:**
CDP is a WebSocket protocol exposed by Chromium-based browsers. Every panel in Chrome DevTools — Elements, Network, Performance, Application, Sources — retrieves its data by sending CDP commands and listening to CDP events over this WebSocket.

**The CDP domain categories:**

| Domain | What it controls |
|---|---|
| \`Network\` | Request interception, throttling, cookies, cache |
| \`Performance\` | Timing metrics, layout counts, heap size |
| \`Emulation\` | Device metrics, geolocation, CPU throttling, timezone |
| \`Runtime\` | JavaScript execution, heap snapshots |
| \`Page\` | Navigation, dialogs, screenshot, lifecycle events |
| \`Profiler\` | CPU profiling, sampling |
| \`CSS\` | Coverage, stylesheet inspection |

**Opening a CDP session in Playwright:**

\`\`\`typescript
import { test, expect, CDPSession } from '@playwright/test';

test('CDP session basics', async ({ page, context }) => {
  // Open a CDP session to the current page
  const client: CDPSession = await context.newCDPSession(page);

  // Send a CDP command — returns a Promise with the result
  const { frameTree } = await client.send('Page.getFrameTree');
  console.log('Main frame URL:', frameTree.frame.url);

  // Listen to a CDP event
  client.on('Network.requestWillBeSent', event => {
    console.log('Request sent:', event.request.url);
  });

  // Enable the Network domain to start receiving events
  await client.send('Network.enable');

  await page.goto('/dashboard');

  // Detach when done
  await client.detach();
});
\`\`\`

**Sending commands vs listening to events:**

\`\`\`typescript
// Sending a command (request/response pattern)
const result = await client.send('Performance.getMetrics');
// result is typed to the CDP response shape

// Listening to events (subscribe pattern)
client.on('Page.loadEventFired', () => {
  console.log('Load event fired at:', Date.now());
});
\`\`\`

> **QA Tip:** CDP sessions only work with Chromium-based browsers. For cross-browser tests, wrap CDP code in \`test.skip(!browserName.includes('chrom'), 'CDP: Chromium only')\`.

---

### 2. Network Throttling & Offline Mode

💡 **Analogy:** Network throttling is a garden hose with a clamp on it. Full speed = fully open. 3G = 80% clamped. Offline = blocked entirely. CDP lets you adjust the clamp from your test code without touching the physical hose.

**Emulating network conditions via CDP:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('app loads acceptably on slow 3G', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 750 * 1024 / 8,  // 750 Kbps in bytes/sec
    uploadThroughput: 250 * 1024 / 8,    // 250 Kbps in bytes/sec
    latency: 100,                         // 100ms round-trip latency
  });

  const start = Date.now();
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - start;

  console.log(\`Load time on Slow 3G: \${loadTime}ms\`);
  expect(loadTime).toBeLessThan(15000); // must load within 15s on slow 3G

  await client.detach();
});
\`\`\`

**Built-in network preset values:**

| Preset | Download (bytes/s) | Upload (bytes/s) | Latency (ms) |
|---|---|---|---|
| Slow 3G | 500 * 1024 / 8 = 64,000 | 500 * 1024 / 8 = 64,000 | 400 |
| Regular 3G | 750 * 1024 / 8 = 96,000 | 250 * 1024 / 8 = 32,000 | 100 |
| Fast 3G | 1.5 * 1024 * 1024 / 8 | 750 * 1024 / 8 | 40 |
| 4G | 4 * 1024 * 1024 / 8 | 3 * 1024 * 1024 / 8 | 20 |
| WiFi | 30 * 1024 * 1024 / 8 | 15 * 1024 * 1024 / 8 | 2 |

**Emulating offline mode and testing service worker behaviour:**

\`\`\`typescript
test('offline banner appears when connection drops', async ({ page, context }) => {
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');

  // Load the page while online
  await page.goto('/dashboard');
  await expect(page.getByTestId('offline-banner')).not.toBeVisible();

  // Simulate going offline
  await client.send('Network.emulateNetworkConditions', {
    offline: true,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  });

  // Trigger a navigation or action that requires network
  await page.getByRole('button', { name: 'Refresh Data' }).click();

  // App should show the offline banner
  await expect(page.getByTestId('offline-banner')).toBeVisible();
  await expect(page.getByText('You are offline')).toBeVisible();

  await client.detach();
});
\`\`\`

**Simpler approach — Playwright native offline:**

\`\`\`typescript
// No CDP needed for basic offline simulation
test('offline via context.setOffline()', async ({ page, context }) => {
  await page.goto('/dashboard');

  // Go offline
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Load More' }).click();
  await expect(page.getByText('Network error')).toBeVisible();

  // Come back online
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Network error')).not.toBeVisible();
});
\`\`\`

---

### 3. Geolocation & Timezone Mocking

💡 **Analogy:** Mocking geolocation is like giving your app a fake passport — it believes you are in Tokyo even though the test server is in Frankfurt. Your location-aware features respond as if you were really there.

**Mocking GPS location:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('store finder shows Tokyo stores', async ({ page, context }) => {
  // Grant the geolocation permission first
  await context.grantPermissions(['geolocation']);

  // Set location to Tokyo, Japan
  await context.setGeolocation({
    latitude: 35.6762,
    longitude: 139.6503,
    accuracy: 100,
  });

  await page.goto('/store-finder');
  await page.getByRole('button', { name: 'Find Nearby Stores' }).click();

  // App should show Japanese stores
  await expect(page.getByText('Shinjuku Store')).toBeVisible();
  await expect(page.getByText('Shibuya Store')).toBeVisible();
  // No stores from other countries
  await expect(page.getByText('London Store')).not.toBeVisible();
});
\`\`\`

**Testing location permission denied:**

\`\`\`typescript
test('handles geolocation permission denied gracefully', async ({ page, context }) => {
  // Explicitly deny geolocation permission
  await context.grantPermissions([]);  // empty array = no permissions

  await page.goto('/store-finder');
  await page.getByRole('button', { name: 'Find Nearby Stores' }).click();

  // App should fall back to manual search
  await expect(page.getByText('Location access denied')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your city or postcode')).toBeVisible();
});
\`\`\`

**Timezone mocking via CDP:**

\`\`\`typescript
test('Tokyo user sees Tokyo business hours', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  // Override the timezone for this session
  await client.send('Emulation.setTimezoneOverride', {
    timezoneId: 'Asia/Tokyo',
  });

  await page.goto('/support');

  // App should show hours relative to Tokyo time (UTC+9)
  const hours = await page.getByTestId('support-hours').textContent();
  expect(hours).toContain('JST');  // or whatever the app displays

  await client.detach();
});
\`\`\`

**Full example — geo + timezone combined:**

\`\`\`typescript
test('user in Sydney sees AEST times and AU delivery options', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: -33.8688, longitude: 151.2093, accuracy: 50 });
  await client.send('Emulation.setTimezoneOverride', { timezoneId: 'Australia/Sydney' });

  await page.goto('/checkout');

  await expect(page.getByTestId('delivery-region')).toContainText('Australia');
  await expect(page.getByTestId('estimated-delivery')).toContainText('AEST');

  await client.detach();
});
\`\`\`

---

### 4. Console & Error Monitoring

💡 **Analogy:** Monitoring the browser console from your test is like having a mic in the engine room while running the ship. The passengers (users) never hear it — but you know the moment a bearing starts grinding.

**Capturing all console messages:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('no console errors during checkout flow', async ({ page }) => {
  const consoleMessages: { type: string; text: string }[] = [];

  // Subscribe BEFORE navigating — events fire immediately
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();

  // Filter to only error-level messages
  const errors = consoleMessages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    console.log('Console errors found:');
    errors.forEach(e => console.log(' -', e.text));
  }

  expect(errors).toHaveLength(0);
});
\`\`\`

**Catching unhandled JavaScript exceptions:**

\`\`\`typescript
test('no unhandled exceptions on page load', async ({ page }) => {
  const uncaughtErrors: Error[] = [];

  // pageerror fires for uncaught exceptions (not caught by try/catch)
  page.on('pageerror', err => {
    uncaughtErrors.push(err);
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  if (uncaughtErrors.length > 0) {
    console.log('Uncaught JS errors:');
    uncaughtErrors.forEach(e => console.log(' -', e.message));
  }

  expect(uncaughtErrors).toHaveLength(0);
});
\`\`\`

**Building a reusable console monitor fixture:**

\`\`\`typescript
// fixtures/console-monitor.ts
import { test as base, expect } from '@playwright/test';

type ConsoleMonitorFixture = {
  consoleErrors: string[];
};

export const test = base.extend<ConsoleMonitorFixture>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter known third-party noise
        const text = msg.text();
        if (text.includes('Failed to load resource: net::ERR_AD_BLOCKED')) return;
        if (text.includes('third-party-analytics.js')) return;
        errors.push(text);
      }
    });

    page.on('pageerror', err => errors.push(\`[UNCAUGHT] \${err.message}\`));

    await use(errors);

    // Assert no errors at the end of every test automatically
    expect(errors, \`Console errors: \${errors.join(', ')}\`).toHaveLength(0);
  },
});
\`\`\`

\`\`\`typescript
// tests/dashboard.spec.ts — use the custom fixture
import { test } from '../fixtures/console-monitor';

test('dashboard loads without errors', async ({ page, consoleErrors }) => {
  await page.goto('/dashboard');
  // consoleErrors is automatically asserted in afterEach via the fixture
});
\`\`\`

---

### 5. Performance Metrics via CDP

💡 **Analogy:** CDP performance metrics are the diagnostic readout from a car's OBD port. Any mechanic (or your test) can plug in and read engine RPM, fuel consumption, and error codes in real time — the car doesn't even need to be stopped.

**Collecting performance metrics:**

\`\`\`typescript
test('page performance metrics', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  // Enable the Performance domain
  await client.send('Performance.enable');

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Collect metrics
  const { metrics } = await client.send('Performance.getMetrics');

  // Convert array to a readable object
  const m = Object.fromEntries(metrics.map(item => [item.name, item.value]));

  console.table({
    'JS Heap Used':       \`\${(m.JSHeapUsedSize / 1024 / 1024).toFixed(1)} MB\`,
    'JS Heap Total':      \`\${(m.JSHeapTotalSize / 1024 / 1024).toFixed(1)} MB\`,
    'Layout Count':       m.LayoutCount,
    'Style Recalcs':      m.RecalcStyleCount,
    'Script Duration':    \`\${m.ScriptDuration.toFixed(3)}s\`,
    'Task Duration':      \`\${m.TaskDuration.toFixed(3)}s\`,
    'DOM Nodes':          m.Nodes,
    'Documents':          m.Documents,
  });

  // Assert memory budget
  const heapMB = m.JSHeapUsedSize / 1024 / 1024;
  expect(heapMB, \`JS Heap too large: \${heapMB.toFixed(1)}MB\`).toBeLessThan(50);

  await client.detach();
});
\`\`\`

**Core Web Vitals via PerformanceObserver injection:**

\`\`\`typescript
test('Core Web Vitals within budget', async ({ page }) => {
  // Inject observer before navigation
  await page.addInitScript(() => {
    window.__cwv = { lcp: 0, fid: 0, cls: 0 };

    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          (window as any).__cwv.lcp = entry.startTime;
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        (window as any).__cwv.cls += (entry as any).value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Small wait for observers to flush
  await page.waitForTimeout(500);

  const cwv = await page.evaluate(() => (window as any).__cwv);

  console.log(\`LCP: \${cwv.lcp.toFixed(0)}ms, CLS: \${cwv.cls.toFixed(4)}\`);

  // Assert against Web Vitals budgets
  expect(cwv.lcp, \`LCP \${cwv.lcp.toFixed(0)}ms exceeds 2500ms budget\`).toBeLessThan(2500);
  expect(cwv.cls, \`CLS \${cwv.cls.toFixed(4)} exceeds 0.1 budget\`).toBeLessThan(0.1);
});
\`\`\`

**Core Web Vitals thresholds for reference:**

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2,500ms | 2,500–4,000ms | > 4,000ms |
| FID (First Input Delay) | < 100ms | 100–300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| INP (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |

---

### 6. JavaScript Coverage Collection

💡 **Analogy:** JS coverage is an X-ray that shows which bones (lines of code) you actually exercised during a test. Lines that show up dark on the X-ray were never touched — they are either dead code or untested paths.

**Starting and stopping coverage collection:**

\`\`\`typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('collect JS coverage for checkout flow', async ({ page }) => {
  // Start coverage BEFORE navigating
  await page.coverage.startJSCoverage();

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Add Item' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Stop and retrieve coverage data
  const coverage = await page.coverage.stopJSCoverage();

  let totalBytes = 0;
  let usedBytes = 0;

  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start;
    }
  }

  const coveragePercent = (usedBytes / totalBytes * 100).toFixed(1);
  console.log(\`JS Coverage: \${coveragePercent}% (\${usedBytes.toLocaleString()} / \${totalBytes.toLocaleString()} bytes)\`);

  // Optional: fail if coverage drops below 60%
  expect(Number(coveragePercent)).toBeGreaterThan(60);
});
\`\`\`

**CSS coverage — find unused stylesheets:**

\`\`\`typescript
test('find unused CSS rules', async ({ page }) => {
  await page.coverage.startCSSCoverage();

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  const cssCoverage = await page.coverage.stopCSSCoverage();

  // Report unused CSS per stylesheet
  for (const entry of cssCoverage) {
    const totalLength = entry.text.length;
    const usedLength = entry.ranges.reduce((sum, r) => sum + r.end - r.start, 0);
    const unusedPercent = ((1 - usedLength / totalLength) * 100).toFixed(0);

    if (Number(unusedPercent) > 50) {
      console.warn(\`High unused CSS (\${unusedPercent}%): \${entry.url}\`);
    }
  }
});
\`\`\`

**Combining coverage across all tests for a full suite report:**

\`\`\`typescript
// Use a global results array — combine in globalTeardown
// Each worker writes a JSON file; teardown merges them

// In your test file:
test.afterEach(async ({ page }, testInfo) => {
  const coverage = await page.coverage.stopJSCoverage();
  const coverageFile = \`coverage-\${testInfo.workerIndex}-\${testInfo.testId}.json\`;
  fs.writeFileSync(\`coverage-data/\${coverageFile}\`, JSON.stringify(coverage));
});
\`\`\`

> **QA Tip:** Use Istanbul/NYC to process the raw coverage data into an HTML report: \`nyc report --reporter=html\`. Playwright's coverage output is compatible with the V8 coverage format that Istanbul understands.

---

### 7. CPU Throttling & Device Emulation Deep Dive

💡 **Analogy:** CPU throttling is like making your racing driver wear oven mitts — they are in the same car, on the same track, but their reactions are slower. The test can now verify the app is still driveable when the hardware is impaired.

**CPU throttling via CDP:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('app is usable on 4x CPU slowdown', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  // 4x slowdown simulates a mid-range Android device
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const start = Date.now();
  await page.goto('/dashboard');
  await page.waitForSelector('[data-testid="main-content"]');
  const tti = Date.now() - start;  // Time to Interactive approximation

  console.log(\`TTI on 4x CPU throttle: \${tti}ms\`);
  expect(tti).toBeLessThan(8000); // 8 second budget on slow CPU

  await client.detach();
});
\`\`\`

**Combining CPU + network throttling for low-end mobile simulation:**

\`\`\`typescript
test('low-end mobile: 6x CPU + Slow 3G', async ({ page, context }) => {
  const client = await context.newCDPSession(page);

  // Simulate cheap Android phone on poor mobile signal
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,  // 500 Kbps
    uploadThroughput: 200 * 1024 / 8,
    latency: 400,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });

  const start = Date.now();
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const fcp = Date.now() - start;

  console.log(\`FCP on low-end mobile: \${fcp}ms\`);
  expect(fcp).toBeLessThan(12000); // 12s budget for worst-case conditions

  await client.detach();
});
\`\`\`

**Built-in device emulation — what \`devices['iPhone 14 Pro']\` sets:**

\`\`\`typescript
import { devices } from '@playwright/test';

// What the devices registry actually configures:
console.log(devices['iPhone 14 Pro']);
// {
//   userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...',
//   viewport: { width: 393, height: 852 },
//   deviceScaleFactor: 3,
//   isMobile: true,
//   hasTouch: true,
//   defaultBrowserType: 'webkit',
// }
\`\`\`

| Property | What it controls in the test |
|---|---|
| \`viewport\` | CSS viewport width/height |
| \`deviceScaleFactor\` | \`window.devicePixelRatio\` — affects retina rendering |
| \`isMobile\` | \`navigator.userAgentData.mobile\` |
| \`hasTouch\` | Touch event APIs enabled vs pointer events |
| \`userAgent\` | \`navigator.userAgent\` string sent to server |

**Custom device profile for your internal device:**

\`\`\`typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const customDevices = {
  'Company Internal Tablet': {
    userAgent: 'Mozilla/5.0 (Linux; Android 11; InternalTablet Build/RI1A) ...',
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium' as const,
  },
};

export default defineConfig({
  projects: [
    { name: 'Internal Tablet', use: { ...customDevices['Company Internal Tablet'] } },
    { name: 'iPhone 14 Pro',   use: { ...devices['iPhone 14 Pro'] } },
    { name: 'Pixel 7',         use: { ...devices['Pixel 7'] } },
  ],
});
\`\`\`

**Testing touch events vs mouse events:**

\`\`\`typescript
test('swipe gesture works on touch device', async ({ page }) => {
  // This test project must have hasTouch: true
  await page.goto('/carousel');

  const carousel = page.getByTestId('image-carousel');

  // Touch swipe — only works when hasTouch is true
  await carousel.dispatchEvent('touchstart', {
    touches: [{ clientX: 300, clientY: 200 }],
  });
  await carousel.dispatchEvent('touchmove', {
    touches: [{ clientX: 100, clientY: 200 }],  // swipe left
  });
  await carousel.dispatchEvent('touchend', {
    changedTouches: [{ clientX: 100, clientY: 200 }],
  });

  // Carousel should have advanced to slide 2
  await expect(page.getByTestId('slide-indicator-2')).toHaveAttribute('aria-current', 'true');
});
\`\`\`

**The \`hasTouch\` flag and its effect:**

\`\`\`
hasTouch: false (desktop)
  → Touch events are not dispatched
  → Click = mouse event (mousedown, mouseup, click)
  → Hover states work normally
  → CSS :hover pseudo-class is active

hasTouch: true (mobile)
  → Touch events are dispatched (touchstart, touchend)
  → Click = synthesised from touch events
  → CSS @media (hover: none) is active
  → CSS :hover pseudo-class is inactive on many browsers
\`\`\`

> **QA Tip:** Always test your touch-only UI (swipe, pinch-zoom, long-press) in a project with \`hasTouch: true\`. These interactions behave completely differently from mouse events and are invisible in a standard desktop project.
        `
      },

      {
        id: 'pw-test-data-management',
        title: 'Test Data Management',
        analogy: "Test data is the fuel that powers your test suite. A car running on unpredictable fuel — sometimes petrol, sometimes diesel, sometimes water — will behave erratically and break down. Tests running on unpredictable data do the same. The Factory pattern is a petrol station that always dispenses exactly the right grade of fuel on demand: clean, fresh, predictable data every single time. No leftover data from last week's run. No conflicts between parallel tests. No 'it works on my machine' because the database had a lucky pre-existing record.",
        lessonMarkdown: `
## Test Data Management

Mastering test data is one of the highest-leverage skills in QA engineering. Flaky tests are usually data problems in disguise. This module covers every technique from simple factory functions to database-direct seeding, parallel conflict elimination, and snapshot-based data contract testing.

---

### 1. The Test Data Problem

💡 **Analogy:** A chemistry experiment where someone keeps adding unknown chemicals to your beaker between runs will never produce reproducible results. Shared, mutable test data is exactly that unknown chemist — and the solution is giving every experiment its own sealed beaker.

**The three sins of test data:**

| Sin | Example | Symptom |
|---|---|---|
| Shared mutable state | All tests read/write the same user record | Tests pass in isolation, fail in parallel |
| Hardcoded references | \`userId: 42\` | Passes in dev, fails in CI where ID 42 doesn't exist |
| No cleanup | Each run leaves records behind | Suite passes on first run, fails on second |

**Shared mutable state — the most dangerous sin:**

\`\`\`typescript
// ❌ BROKEN: both tests reference the same email
test('user can log in', async ({ page }) => {
  await page.getByLabel('Email').fill('test@example.com'); // shared!
});

test('user can reset password', async ({ page }) => {
  await page.getByLabel('Email').fill('test@example.com'); // same record!
  // If parallel worker already changed this account's password, this test fails
});
\`\`\`

**The test-order dependency trap:**

\`\`\`typescript
// ❌ BROKEN: test B depends on test A having run first
test('A: create product', async ({ page }) => {
  await page.goto('/products/new');
  await page.getByLabel('Name').fill('Widget');
  await page.getByRole('button', { name: 'Save' }).click();
  // Product ID 99 now exists in the database
});

test('B: edit product', async ({ page }) => {
  await page.goto('/products/99/edit'); // hardcoded! Fails if A didn't run first
});

// ✅ CORRECT: B creates its own data
test('B: edit product', async ({ page, apiContext }) => {
  const product = await apiContext.post('/api/products', {
    data: { name: 'Widget' },
  });
  const { id } = await product.json();
  await page.goto(\`/products/\${id}/edit\`);
});
\`\`\`

**Why "just use the dev database" fails at scale:**

\`\`\`
Dev database problems at 10+ test workers:
├── Worker 1 creates user "alice@test.com"
├── Worker 2 also tries to create "alice@test.com" → UNIQUE CONSTRAINT ERROR
├── Worker 3 deletes product ID 5 — which Worker 4 is currently editing
├── Worker 5 reads a record Worker 6 is in the middle of updating → stale data
└── Monday morning: dev database has 3,000 orphaned test records
\`\`\`

> **QA Tip:** The rule is simple — every test must own all the data it needs and must clean up after itself. No exceptions.

---

### 2. The Factory Pattern

💡 **Analogy:** A factory is a machine that stamps out identical, perfectly-formed parts on demand. You specify only what needs to vary — everything else comes from the mould. \`createUser({ role: 'admin' })\` stamps out a complete, valid user with sensible defaults, with only the role customised.

**Simple factory function:**

\`\`\`typescript
// factories/user.factory.ts
import { faker } from '@faker-js/faker';

interface UserData {
  name?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
  verified?: boolean;
  plan?: 'free' | 'pro' | 'enterprise';
}

export function createUserData(overrides: UserData = {}): Required<UserData> {
  return {
    name:     overrides.name     ?? faker.person.fullName(),
    email:    overrides.email    ?? faker.internet.email(),
    role:     overrides.role     ?? 'viewer',
    verified: overrides.verified ?? true,
    plan:     overrides.plan     ?? 'free',
  };
}
\`\`\`

**Usage — only specify what the test cares about:**

\`\`\`typescript
test('admin can access billing page', async ({ page, apiContext }) => {
  // Only the role matters — everything else is randomised
  const adminData = createUserData({ role: 'admin', plan: 'enterprise' });

  const response = await apiContext.post('/api/users', { data: adminData });
  const { id } = await response.json();

  await page.goto(\`/users/\${id}\`);
  await expect(page.getByTestId('billing-tab')).toBeVisible();
});
\`\`\`

**Factory for complex nested objects:**

\`\`\`typescript
// factories/order.factory.ts
import { faker } from '@faker-js/faker';
import { createUserData } from './user.factory';
import { createProductData } from './product.factory';

interface OrderData {
  customer?: ReturnType<typeof createUserData>;
  items?:    ReturnType<typeof createProductData>[];
  status?:   'pending' | 'paid' | 'shipped' | 'cancelled';
  total?:    number;
}

export function createOrderData(overrides: OrderData = {}): Required<OrderData> {
  const items = overrides.items ?? [
    createProductData({ price: 29.99 }),
    createProductData({ price: 9.99 }),
  ];
  return {
    customer: overrides.customer ?? createUserData(),
    items,
    status:   overrides.status ?? 'pending',
    total:    overrides.total  ?? items.reduce((sum, p) => sum + p.price, 0),
  };
}
\`\`\`

**Using faker.js for realistic, varied data:**

\`\`\`typescript
import { faker } from '@faker-js/faker';

// Realistic data that exercises real validation paths
const realisticUser = {
  name:     faker.person.fullName(),          // "Jonathan Fairweather"
  email:    faker.internet.email(),            // "j.fairweather@gmail.com"
  phone:    faker.phone.number(),              // "+44 7700 900123"
  address: {
    street: faker.location.streetAddress(),   // "14 Acacia Avenue"
    city:   faker.location.city(),             // "Manchester"
    zip:    faker.location.zipCode(),          // "M1 1AE"
  },
  dob:      faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  avatar:   faker.image.avatar(),
};
\`\`\`

> **QA Tip:** Set \`faker.seed(42)\` at the top of your test file to make randomised data fully reproducible. The same seed always produces the same sequence of values.

---

### 3. API-Seeded Test Data

💡 **Analogy:** Seeding data via API is like placing a real order through the front door of a restaurant rather than sneaking into the kitchen and putting food directly on the plate. The API exercises real business logic, validation, and side effects — exactly what a real user would trigger.

**Create in beforeEach, clean up in afterEach:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

let createdUserId: string;

test.beforeEach(async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      name:  'Test User',
      email: \`test-\${Date.now()}@example.com\`,  // unique per test
      role:  'editor',
    },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  createdUserId = body.id;
});

test.afterEach(async ({ request }) => {
  if (createdUserId) {
    await request.delete(\`/api/users/\${createdUserId}\`);
    createdUserId = '';
  }
});

test('editor can create a post', async ({ page }) => {
  await page.goto(\`/users/\${createdUserId}/posts/new\`);
  await page.getByLabel('Title').fill('My First Post');
  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(page.getByText('Post published')).toBeVisible();
});
\`\`\`

**The cleanup problem — afterEach doesn't run if beforeEach throws:**

\`\`\`typescript
// ❌ PROBLEM: if beforeEach setup throws after creating the user,
// afterEach still runs but createdUserId may be set — OR setup may partially complete
// and leave orphaned data. Solution: try/finally in the fixture.

// ✅ CORRECT: use a fixture for guaranteed cleanup
// fixtures/seeded-user.ts
import { test as base } from '@playwright/test';

type SeededUserFixture = { seededUser: { id: string; email: string } };

export const test = base.extend<SeededUserFixture>({
  seededUser: async ({ request }, use) => {
    const email = \`test-\${Date.now()}@example.com\`;
    const response = await request.post('/api/users', {
      data: { name: 'Seeded User', email, role: 'editor' },
    });
    const { id } = await response.json();

    await use({ id, email }); // test runs here

    // Teardown — guaranteed to run even if test throws
    await request.delete(\`/api/users/\${id}\`);
  },
});
\`\`\`

**Worker-scoped data — create once per worker:**

\`\`\`typescript
// fixtures/worker-user.ts
import { test as base } from '@playwright/test';

type WorkerUserFixture = { workerUser: { id: string; storageState: string } };

export const test = base.extend<{}, WorkerUserFixture>({
  workerUser: [async ({ request }, use, workerInfo) => {
    const email = \`worker-\${workerInfo.workerIndex}@example.com\`;

    // Create user once for this worker
    const createResp = await request.post('/api/users', {
      data: { name: \`Worker \${workerInfo.workerIndex}\`, email, role: 'admin' },
    });
    const { id } = await createResp.json();

    await use({ id, storageState: \`auth/worker-\${workerInfo.workerIndex}.json\` });

    // Clean up when the worker is done with all its tests
    await request.delete(\`/api/users/\${id}\`);
  }, { scope: 'worker' }],
});
\`\`\`

**Idempotent setup — check-or-create for global reference data:**

\`\`\`typescript
// global-setup.ts
export default async function globalSetup() {
  const apiContext = await request.newContext({ baseURL: 'https://api.example.com' });

  // Check if the reference country list exists, create only if missing
  const existing = await apiContext.get('/api/countries');
  if ((await existing.json()).length === 0) {
    await apiContext.post('/api/countries/seed');
    console.log('Reference countries seeded');
  } else {
    console.log('Reference countries already present — skipping seed');
  }

  await apiContext.dispose();
}
\`\`\`

> **QA Tip:** Never rely on \`afterEach\` alone for critical cleanup. Always use the fixture \`await use()\` pattern — the teardown after \`use()\` is guaranteed to run whether the test passes, fails, or times out.

---

### 4. Unique Test Data — Eliminating Conflicts

💡 **Analogy:** If four builders all try to register the same street address at the Land Registry at the same time, all four applications will be rejected. Test workers are those builders — and unique data is giving each one a genuinely different address so they can all register simultaneously without blocking each other.

**The parallel test problem:**

\`\`\`typescript
// ❌ BROKEN: 4 workers all try to create the same email
test('register new account', async ({ page }) => {
  await page.getByLabel('Email').fill('test@example.com'); // CONFLICT!
});
// Worker 1: creates test@example.com → 201 Created ✓
// Worker 2: creates test@example.com → 409 Conflict ✗
// Worker 3: creates test@example.com → 409 Conflict ✗
// Worker 4: creates test@example.com → 409 Conflict ✗
\`\`\`

**Solution 1 — Date.now() suffix:**

\`\`\`typescript
// ✅ Simple and effective for low parallelism
const email = \`test-\${Date.now()}@example.com\`;
// "test-1714735200123@example.com"
\`\`\`

**Solution 2 — crypto.randomUUID() (best for high parallelism):**

\`\`\`typescript
import crypto from 'crypto';

// ✅ Guaranteed unique across all workers, all runs
const email = \`test-\${crypto.randomUUID()}@example.com\`;
// "test-a3f7c2d1-88b4-4e6a-b5d3-1c2e9f0a7b6e@example.com"
\`\`\`

**Solution 3 — workerIndex prefix (stable and readable):**

\`\`\`typescript
import { test } from '@playwright/test';

test('create account', async ({ page }, testInfo) => {
  const email = \`worker\${testInfo.workerIndex}-\${testInfo.testId}@example.com\`;
  // "worker2-abc123@example.com"
  // Each worker gets a namespace — no cross-worker conflicts
});
\`\`\`

**Naming convention for easy cleanup:**

\`\`\`typescript
// All test-generated data is tagged with a prefix
const TEST_PREFIX = 'autotest';

const email    = \`\${TEST_PREFIX}-\${crypto.randomUUID()}@example.com\`;
const username = \`\${TEST_PREFIX}-\${faker.internet.userName()}\`;
const orgName  = \`\${TEST_PREFIX}-org-\${Date.now()}\`;

// Cleanup script: DELETE FROM users WHERE email LIKE 'autotest-%'
// Can be run safely in any environment without touching real data
\`\`\`

**Environment-isolated test accounts:**

\`\`\`typescript
// playwright.config.ts
const testAccounts = {
  staging: {
    admin:  process.env.STAGING_ADMIN_EMAIL!,
    viewer: process.env.STAGING_VIEWER_EMAIL!,
  },
  production: {
    // Production tests use read-only accounts — no destructive operations
    readonly: process.env.PROD_READONLY_EMAIL!,
  },
};

export const TEST_ACCOUNT = testAccounts[process.env.TEST_ENV as keyof typeof testAccounts];
\`\`\`

> **QA Tip:** Build a nightly cleanup job that deletes all records where name or email starts with your test prefix and is older than 24 hours. This keeps your database clean even when tests crash mid-cleanup.

---

### 5. Database Direct Seeding

💡 **Analogy:** API seeding goes through the restaurant's ordering system — correct, but each dish takes time to prepare. Database direct seeding is the chef walking into the cold store and placing pre-prepared portions directly on the shelf. Faster to set up a table for 200 guests, but you bypass the kitchen's quality checks.

**When to use database direct seeding:**

| Scenario | Use API seeding | Use DB seeding |
|---|---|---|
| Creating 1–10 records per test | ✅ | |
| Creating 1,000+ records for a performance test | | ✅ |
| Need to test business logic side effects | ✅ | |
| Need raw speed: smoke test bootstrap | | ✅ |
| Testing a data migration | | ✅ |

**Direct seeding with Prisma in globalSetup:**

\`\`\`typescript
// global-setup.ts
import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const prisma = new PrismaClient();

  try {
    // Seed reference data once before all tests
    await prisma.category.createMany({
      data: [
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Clothing',    slug: 'clothing'    },
        { id: 3, name: 'Books',       slug: 'books'       },
      ],
      skipDuplicates: true,
    });
    console.log('Reference categories seeded');
  } finally {
    await prisma.$disconnect();
  }
}
\`\`\`

**Transaction-wrapped tests — rollback everything:**

\`\`\`typescript
// fixtures/db-transaction.ts
import { test as base } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

type DbFixture = { db: PrismaClient };

export const test = base.extend<DbFixture>({
  db: async ({}, use) => {
    const prisma = new PrismaClient();

    // Start a transaction — everything inside can be rolled back
    await prisma.$executeRaw\`BEGIN\`;

    await use(prisma);

    // Rollback unconditionally — leaves the DB in its original state
    await prisma.$executeRaw\`ROLLBACK\`;
    await prisma.$disconnect();
  },
});
\`\`\`

\`\`\`typescript
// tests/product.spec.ts
import { test } from '../fixtures/db-transaction';
import { expect } from '@playwright/test';

test('product creation inserts correct DB record', async ({ db, page }) => {
  // Seed a product directly via transaction
  const product = await db.product.create({
    data: { name: 'Test Widget', price: 49.99, stock: 100 },
  });

  await page.goto(\`/products/\${product.id}\`);
  await expect(page.getByRole('heading', { name: 'Test Widget' })).toBeVisible();

  // Transaction rolled back in teardown — product never persists
});
\`\`\`

**Using raw SQL for maximum speed in performance test setup:**

\`\`\`typescript
// global-setup.ts — seed 10,000 products in one batch insert
import { Pool } from 'pg';

export default async function globalSetup() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const values = Array.from({ length: 10_000 }, (_, i) =>
    \`('Product \${i}', \${(Math.random() * 100).toFixed(2)}, \${Math.floor(Math.random() * 1000)})\`
  ).join(',\n  ');

  await pool.query(\`
    INSERT INTO products (name, price, stock)
    VALUES
      \${values}
    ON CONFLICT DO NOTHING
  \`);

  console.log('10,000 products seeded for performance tests');
  await pool.end();
}
\`\`\`

> **QA Tip:** Never run database direct seeding against a shared staging environment unless you are inside a transaction. Raw DB writes bypass application validation — a mistyped field can corrupt data that other teams depend on.

---

### 6. Environment Isolation

💡 **Analogy:** A demolition company uses different machinery in a controlled demolition site than on a live city block. The environment determines what actions are safe. Running destructive test data operations in production is like parking the wrecking ball next to an occupied building.

**Environment guard — never run destructive tests in production:**

\`\`\`typescript
// playwright.config.ts
const TEST_ENV = process.env.TEST_ENV ?? 'staging';

if (TEST_ENV === 'production') {
  // Allow only read-only tests in production
  const allowedProjects = ['smoke-readonly'];
  console.warn('WARNING: Running in PRODUCTION — only smoke tests permitted');
}

export default defineConfig({
  use: {
    baseURL: {
      staging:    'https://staging.example.com',
      production: 'https://example.com',
      local:      'http://localhost:3000',
    }[TEST_ENV],
  },
});
\`\`\`

**Hard guard that throws before any test runs:**

\`\`\`typescript
// fixtures/env-guard.ts
export function assertNotProduction(operation: string): void {
  if (process.env.TEST_ENV === 'production') {
    throw new Error(
      \`SAFETY: Refusing to run "\${operation}" in production. \\n\` +
      \`Set TEST_ENV=staging or TEST_ENV=local to run this test.\`
    );
  }
}
\`\`\`

\`\`\`typescript
test.beforeAll(() => {
  assertNotProduction('user creation with cleanup');
});
\`\`\`

**Per-environment storageState — different credentials per environment:**

\`\`\`typescript
// global-setup.ts
const ENV = process.env.TEST_ENV ?? 'staging';

const credentials = {
  staging: {
    admin:  { email: process.env.STAGING_ADMIN_EMAIL!,  password: process.env.STAGING_ADMIN_PASS!  },
    viewer: { email: process.env.STAGING_VIEWER_EMAIL!, password: process.env.STAGING_VIEWER_PASS! },
  },
  local: {
    admin:  { email: 'admin@localhost.com',  password: 'localpass' },
    viewer: { email: 'viewer@localhost.com', password: 'localpass' },
  },
}[ENV];

// Auth files are namespaced by environment
await loginAndSave(credentials.admin,  \`auth/\${ENV}-admin.json\`);
await loginAndSave(credentials.viewer, \`auth/\${ENV}-viewer.json\`);
\`\`\`

**Feature flags in test data:**

\`\`\`typescript
// Create a user with a specific feature flag enabled
const userWithBetaFlag = await apiContext.post('/api/users', {
  data: {
    ...createUserData(),
    featureFlags: {
      newCheckoutFlow: true,   // exercises the new checkout path
      darkMode:        false,
    },
  },
});
\`\`\`

> **QA Tip:** Store your \`auth/*.json\` files in a directory that is gitignored. In CI, generate them fresh in \`globalSetup\` using environment variables for credentials — never commit real session tokens or passwords.

---

### 7. Snapshot Testing for Data Contracts

💡 **Analogy:** A snapshot test for an API response is like photographing the contents of a shipping container before it leaves port. If someone adds, removes, or swaps cargo, the photograph at the destination won't match — and you know immediately what changed. Without the photograph, you only find out when the customer unpacks.

**The problem — silent schema changes:**

\`\`\`typescript
// ❌ This test passes even if the API drops the 'price' field from the response
test('product API returns correct data', async ({ request }) => {
  const response = await request.get('/api/products/1');
  const body = await response.json();
  expect(response.status()).toBe(200);
  // We only checked the status — not the shape!
});
\`\`\`

**toMatchSnapshot() on API responses:**

\`\`\`typescript
// ✅ First run: creates the snapshot file
// Subsequent runs: compares against it — any field change fails the test
test('product API response shape is stable', async ({ request }) => {
  const response = await request.get('/api/products/1');
  const body = await response.json();

  // Remove dynamic fields before snapshotting
  const stableBody = {
    ...body,
    id:        '[ID]',
    createdAt: '[DATE]',
    updatedAt: '[DATE]',
  };

  expect(stableBody).toMatchSnapshot('product-api-response.json');
});
\`\`\`

**Snapshot content (first run generates this file):**

\`\`\`json
{
  "id": "[ID]",
  "name": "Widget Pro",
  "price": 49.99,
  "currency": "GBP",
  "stock": 100,
  "category": { "id": 1, "name": "Electronics" },
  "createdAt": "[DATE]",
  "updatedAt": "[DATE]"
}
\`\`\`

**Deliberate vs accidental snapshot update:**

\`\`\`typescript
// Updating snapshots intentionally:
// npx playwright test --update-snapshots

// Snapshot update workflow:
// 1. API team deploys new response shape
// 2. Test fails with diff showing exactly which fields changed
// 3. QA engineer reviews diff: "price is now priceInPence — intentional change"
// 4. Run --update-snapshots to accept the new shape
// 5. Commit the updated snapshot file alongside the API change
\`\`\`

**Combining TypeScript types with snapshots:**

\`\`\`typescript
// types/product.ts — TypeScript guards the structure at compile time
interface ProductResponse {
  id:       string;
  name:     string;
  price:    number;     // ← If API renames this, TypeScript catches it
  currency: string;
  stock:    number;
  category: { id: number; name: string };
}

test('product API matches TypeScript type and snapshot', async ({ request }) => {
  const response = await request.get('/api/products/1');
  const body = await response.json() as ProductResponse;

  // TypeScript compile-time check + runtime snapshot check
  expect(typeof body.price).toBe('number');
  expect(body).toMatchSnapshot('product-api-response.json');
});
\`\`\`

**Snapshot diff output — what you see on failure:**

\`\`\`
  Snapshot name: product-api-response.json
  Expected:
  - "price": 49.99,
  + "priceInPence": 4999,
  - "currency": "GBP",

  Received:
  + "priceInPence": 4999,

  1 snapshot(s) failed.
\`\`\`

> **QA Tip:** Always strip dynamic fields (IDs, timestamps, tokens) from API responses before snapshotting. A snapshot that contains a timestamp will fail on every run. Normalise these to placeholder strings like \`"[DATE]"\` or \`"[UUID]"\` before calling \`toMatchSnapshot()\`.
        `
      },

      {
        id: 'pw-component-testing',
        title: 'Playwright Component Testing',
        analogy: "End-to-end tests are like testing a car by driving it on a full road trip. You get maximum confidence — but it takes 4 hours, costs fuel, and if the headlights fail you have to search through 400 miles of road to find where the problem started. Component testing is testing each car part on a workbench in the garage: headlight assembly, braking system, gearbox — each in isolation. Ten seconds per component, instant feedback, exact failure location. Expert QA engineers run both: workbench tests to catch regressions fast, road trips to confirm everything works together.",
        lessonMarkdown: `
## Playwright Component Testing

Playwright's experimental component testing brings the same browser-powered reliability of E2E testing down to the individual component level. This module covers everything from setup to advanced mocking, helping you decide when CT beats E2E and how to run both in CI.

---

### 1. What Playwright Component Testing Is

💡 **Analogy:** A full E2E test boots your entire application — server, database, routing, auth — just to verify one button changes colour on hover. CT mounts only that button in a minimal browser shell. Same real Chromium. Fraction of the setup cost.

**What \`@playwright/experimental-ct-react\` gives you:**

| Feature | CT | Jest + RTL | Cypress CT |
|---|---|---|---|
| Real browser engine | ✅ Chromium/Firefox/WebKit | ❌ jsdom | ✅ Chromium only |
| Visual snapshots | ✅ | ❌ | ✅ |
| Network interception | ✅ \`page.route()\` | ❌ | Limited |
| Playwright locator API | ✅ | ❌ | ❌ |
| No server required | ✅ | ✅ | ✅ |

**How CT differs from E2E:**

\`\`\`
E2E test:
  Browser → full app (React + Router + Auth + API server + DB)
  Setup time: 5–30 seconds per test
  Failure scope: anywhere in the stack

Component test:
  Browser → single component (React component only, minimal HTML shell)
  Setup time: 0.1–0.5 seconds per test
  Failure scope: this component and its direct dependencies
\`\`\`

**Installation:**

\`\`\`bash
# Install the CT package for your framework
npm init playwright@latest -- --ct

# Or manually:
npm install -D @playwright/experimental-ct-react
npx playwright install
\`\`\`

> **QA Tip:** CT currently supports React, Vue 3, Svelte, and Solid. The \`experimental\` label means the API may change between minor versions — pin to a specific version in \`package.json\` and test upgrades in a branch.

---

### 2. Setting Up Component Testing Alongside E2E

💡 **Analogy:** CT and E2E are two different workbenches in the same workshop. They share the same toolbox (Playwright) but work at different scales. The trick is giving each workbench its own configuration file so they don't get in each other's way.

**\`playwright-ct.config.ts\` — the separate CT config:**

\`\`\`typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.ct.spec.tsx',
  snapshotDir: './__snapshots__',
  timeout: 10_000,   // CT tests are fast — keep timeout tight

  use: {
    ctPort: 3100,    // port for the component test server
    ctViteConfig: {
      plugins: [react()],
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
});
\`\`\`

**\`playwright.config.ts\` — keep E2E separate:**

\`\`\`typescript
// playwright.config.ts — unchanged, points to e2e tests
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  // ... your E2E config
});
\`\`\`

**The index.html template for component mounting:**

\`\`\`html
<!-- playwright/index.html — the shell that CT injects components into -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Playwright CT</title>
    <link rel="stylesheet" href="../src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
\`\`\`

**File naming convention — component beside its test:**

\`\`\`
src/
  components/
    Button/
      Button.tsx         ← the component
      Button.ct.spec.tsx ← its component test
      Button.stories.tsx ← optional Storybook story
    Modal/
      Modal.tsx
      Modal.ct.spec.tsx
\`\`\`

**Running CT tests:**

\`\`\`bash
# Run component tests only
npx playwright test --config playwright-ct.config.ts

# Run E2E tests only
npx playwright test --config playwright.config.ts

# Run both (add to package.json scripts)
# "test:ct":  "playwright test --config playwright-ct.config.ts"
# "test:e2e": "playwright test --config playwright.config.ts"
# "test":     "npm run test:ct && npm run test:e2e"
\`\`\`

> **QA Tip:** The CT config's \`ctViteConfig\` must match your application's Vite config precisely — same plugins, aliases, and environment variables. A mismatch means CT tests pass but the real app fails.

---

### 3. The mount() API — Rendering Components

💡 **Analogy:** \`mount()\` is a lab technician placing a specimen under a microscope slide. The specimen (component) is isolated, illuminated, and ready to be examined with the full power of Playwright's lens (locator API, assertions, network tools) — without needing the rest of the organism attached.

**Basic mount and assertion:**

\`\`\`typescript
// Button.ct.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('renders with correct label', async ({ mount }) => {
  const component = await mount(<Button label="Save Changes" />);

  // Full Playwright locator API is available on the mounted component
  await expect(component).toContainText('Save Changes');
  await expect(component).toBeVisible();
});
\`\`\`

**Querying inside a mounted component:**

\`\`\`typescript
test('button has correct accessible role', async ({ mount, page }) => {
  await mount(<Button label="Submit" variant="primary" />);

  // Use page.getByRole — works exactly as in E2E tests
  const btn = page.getByRole('button', { name: 'Submit' });
  await expect(btn).toBeVisible();
  await expect(btn).toHaveAttribute('type', 'submit');
});
\`\`\`

**Mounting a form component and asserting labels:**

\`\`\`typescript
// LoginForm.ct.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { LoginForm } from './LoginForm';

test('login form renders all required fields', async ({ mount, page }) => {
  await mount(<LoginForm onSubmit={() => {}} />);

  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  await expect(page.getByText('Forgot password?')).toBeVisible();
});

test('login form shows validation errors on empty submit', async ({ mount, page }) => {
  await mount(<LoginForm onSubmit={() => {}} />);

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
});
\`\`\`

**Unmounting and remounting:**

\`\`\`typescript
test('component cleans up on unmount', async ({ mount }) => {
  const component = await mount(<WebSocketComponent url="ws://localhost" />);

  await expect(component).toContainText('Connected');

  // Unmount triggers useEffect cleanup — WebSocket should close
  await component.unmount();

  // No assertion possible after unmount — DOM is gone
  // Use console monitoring to assert cleanup side effects
});
\`\`\`

> **QA Tip:** The \`mount()\` function returns a \`Locator\` pointing to the root element of your component. You can use all standard Playwright assertions on it directly, or call \`page.getBy*()\` to find children.

---

### 4. Testing Props, Events & Callbacks

💡 **Analogy:** Testing props is checking that the control panel inputs produce the right outputs on the instrument display. Testing callbacks is checking that pressing the ejector seat button actually fires the signal — even if you have swapped the seat for a dummy during the test.

**Testing prop variations — a full state matrix:**

\`\`\`typescript
// StatusBadge.ct.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { StatusBadge } from './StatusBadge';

const states = [
  { status: 'active',   expectedColor: 'green',  expectedText: 'Active'   },
  { status: 'inactive', expectedColor: 'grey',   expectedText: 'Inactive' },
  { status: 'pending',  expectedColor: 'orange', expectedText: 'Pending'  },
  { status: 'error',    expectedColor: 'red',    expectedText: 'Error'    },
] as const;

for (const { status, expectedText } of states) {
  test(\`renders \${status} state correctly\`, async ({ mount, page }) => {
    await mount(<StatusBadge status={status} />);

    const badge = page.getByTestId('status-badge');
    await expect(badge).toContainText(expectedText);
    await expect(badge).toHaveAttribute('data-status', status);
  });
}

test('disabled button cannot be clicked', async ({ mount, page }) => {
  await mount(<Button label="Submit" disabled={true} />);

  const btn = page.getByRole('button', { name: 'Submit' });
  await expect(btn).toBeDisabled();
});
\`\`\`

**Testing event callbacks with a Promise spy:**

\`\`\`typescript
// SearchInput.ct.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { SearchInput } from './SearchInput';

test('calls onSearch with typed value after debounce', async ({ mount, page }) => {
  let capturedSearchTerm = '';

  const component = await mount(
    <SearchInput
      onSearch={(term: string) => { capturedSearchTerm = term; }}
      debounceMs={0}  // disable debounce in tests for determinism
    />
  );

  await page.getByRole('searchbox').fill('playwright');
  await page.getByRole('searchbox').press('Enter');

  expect(capturedSearchTerm).toBe('playwright');
});

test('calls onClose when modal close button is clicked', async ({ mount, page }) => {
  // Use a Promise that resolves when the callback fires
  const onCloseFired = new Promise<void>(resolve => {
    mount(
      <Modal
        isOpen={true}
        title="Confirm Delete"
        onClose={resolve}   // resolves the promise
      />
    );
  });

  await page.getByRole('button', { name: 'Close' }).click();

  // If onClose wasn't called within 5s, this will time out and fail
  await onCloseFired;
});
\`\`\`

**Testing a controlled form submission:**

\`\`\`typescript
test('form calls onSubmit with form data', async ({ mount, page }) => {
  let submittedData: Record<string, string> = {};

  await mount(
    <ContactForm
      onSubmit={(data: Record<string, string>) => { submittedData = data; }}
    />
  );

  await page.getByLabel('Name').fill('Alice Brown');
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Message').fill('Hello from CT tests');
  await page.getByRole('button', { name: 'Send' }).click();

  expect(submittedData).toEqual({
    name:    'Alice Brown',
    email:   'alice@example.com',
    message: 'Hello from CT tests',
  });
});
\`\`\`

> **QA Tip:** For debounced callbacks, either set \`debounceMs={0}\` in test mode, or use \`page.waitForFunction(() => capturedValue !== '')\` to wait for the debounce to fire rather than using a fixed \`waitForTimeout\`.

---

### 5. Mocking Context Providers & Dependencies

💡 **Analogy:** A component that reads from a React Context is like a device that needs to be plugged into a power socket to function. In CT, you bring your own power socket — a mock provider — rather than wiring up the entire electrical grid of the application.

**Wrapping a component in its required providers:**

\`\`\`typescript
// UserProfile.ct.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { UserProfile } from './UserProfile';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthContext } from '../contexts/AuthContext';

test('shows admin badge for admin user', async ({ mount, page }) => {
  const mockAuth = {
    user: { name: 'Admin User', role: 'admin', email: 'admin@example.com' },
    isAuthenticated: true,
    logout: () => {},
  };

  await mount(
    <ThemeProvider theme="light">
      <AuthContext.Provider value={mockAuth}>
        <UserProfile />
      </AuthContext.Provider>
    </ThemeProvider>
  );

  await expect(page.getByTestId('admin-badge')).toBeVisible();
  await expect(page.getByText('Admin User')).toBeVisible();
});

test('shows viewer UI for viewer role', async ({ mount, page }) => {
  const mockAuth = {
    user: { name: 'Jane Viewer', role: 'viewer', email: 'jane@example.com' },
    isAuthenticated: true,
    logout: () => {},
  };

  await mount(
    <AuthContext.Provider value={mockAuth}>
      <UserProfile />
    </AuthContext.Provider>
  );

  await expect(page.getByTestId('admin-badge')).not.toBeVisible();
  await expect(page.getByText('Jane Viewer')).toBeVisible();
});
\`\`\`

**Mocking an API call the component makes internally via page.route():**

\`\`\`typescript
// ProductCard.ct.spec.tsx — component fetches its own data
test('shows product details after fetch', async ({ mount, page }) => {
  // Intercept the fetch the component will make
  await page.route('**/api/products/42', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 42, name: 'Widget Pro', price: 49.99, inStock: true }),
    })
  );

  await mount(<ProductCard productId={42} />);

  await expect(page.getByRole('heading', { name: 'Widget Pro' })).toBeVisible();
  await expect(page.getByText('£49.99')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
});

test('shows error state when fetch fails', async ({ mount, page }) => {
  await page.route('**/api/products/42', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error' })
  );

  await mount(<ProductCard productId={42} />);

  await expect(page.getByText('Failed to load product')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
\`\`\`

> **QA Tip:** \`page.route()\` works inside CT tests exactly as in E2E tests. This is one of CT's biggest advantages over Jest/RTL — you can test real \`fetch()\` calls in a real browser with real network interception, without any module mocking.

---

### 6. When Component Testing Wins vs E2E

💡 **Analogy:** You wouldn't road-test a car to check the headlight bulb wattage — that's a workbench job. But you wouldn't certify the car safe to drive by testing each part in isolation either — that requires a real road. Expert QA engineers know which bench each test belongs on.

**Decision table:**

| Test scenario | Use CT | Use E2E |
|---|---|---|
| UI states hard to reach (empty, error, skeleton, loading) | ✅ | ❌ Setup cost too high |
| Component renders correctly for each prop variant | ✅ | ❌ Overkill |
| Callback fires with correct arguments | ✅ | ❌ Hard to inspect |
| Visual regression per component state | ✅ | Sometimes |
| Multi-page flow (login → checkout → confirmation) | ❌ | ✅ |
| Real authentication and session handling | ❌ | ✅ |
| Third-party integrations (Stripe, Auth0) | ❌ | ✅ |
| Real routing and URL changes | ❌ | ✅ |
| Database state verified end-to-end | ❌ | ✅ |

**The testing trophy for frontend-heavy apps (Kent C. Dodds):**

\`\`\`
         /\
        /  \   ← E2E (10%): critical user journeys only
       /────\
      / Intg \  ← Integration / CT (60%): components + API integration
     /────────\
    /  Static  \ ← Static analysis: TypeScript + ESLint (always on)
   /────────────\
\`\`\`

**Migrating existing E2E tests to CT — good candidates:**

\`\`\`typescript
// ❌ This E2E test is a CT candidate — it only tests one component's states
test('E2E: dropdown shows correct options for admin', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'admin@example.com');
  await page.fill('#password', 'pass');
  await page.click('[data-testid=login-btn]');
  await page.waitForURL('/dashboard');
  await page.click('[data-testid=user-menu]');
  // All of this setup just to test the dropdown component!
  await expect(page.getByText('Admin Panel')).toBeVisible();
});

// ✅ CT version — 10x faster, tests the same thing
test('CT: dropdown shows admin options when role=admin', async ({ mount, page }) => {
  await mount(<UserMenuDropdown isOpen={true} role="admin" />);
  await expect(page.getByText('Admin Panel')).toBeVisible();
});
\`\`\`

> **QA Tip:** The golden ratio for a mature codebase is roughly 70% unit/CT, 20% integration, 10% E2E. If your E2E suite takes more than 10 minutes to run, look for tests that are really unit/CT tests wearing an E2E costume and move them down the stack.

---

### 7. Running CT in CI

💡 **Analogy:** CT tests in CI are like a quality control checkpoint at a factory: fast, automated, runs every shift. E2E tests are the full product inspection: thorough, slower, runs on release candidates. Both are essential. Neither replaces the other.

**GitHub Actions — separate CT and E2E jobs:**

\`\`\`yaml
# .github/workflows/test.yml
jobs:
  component-tests:
    name: Component Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --config playwright-ct.config.ts
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: ct-report
          path: playwright-report/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: component-tests   # only run E2E if CT passes
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --config playwright.config.ts
\`\`\`

**Visual snapshots in CT — identical API to E2E:**

\`\`\`typescript
test('Button visual snapshot — primary variant', async ({ mount, page }) => {
  await mount(<Button label="Save" variant="primary" size="large" />);

  // toHaveScreenshot() works identically in CT and E2E
  await expect(page).toHaveScreenshot('button-primary-large.png', {
    threshold: 0.02,
  });
});

test('Button visual snapshot — all variants', async ({ mount, page }) => {
  await mount(
    <div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
      <Button label="Primary"   variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Danger"    variant="danger" />
      <Button label="Disabled"  variant="primary" disabled />
    </div>
  );

  await expect(page).toHaveScreenshot('button-all-variants.png');
});
\`\`\`

**Merging CT and E2E HTML reports:**

\`\`\`bash
# After both test runs, merge reports into one dashboard
npx playwright merge-reports --reporter html \\
  ct-blob-report e2e-blob-report \\
  --output merged-report

# Open the unified report
npx playwright show-report merged-report
\`\`\`

\`\`\`yaml
# In CI: upload blob reports from both jobs, merge in a third job
- run: npx playwright test --config playwright-ct.config.ts --reporter=blob --output=ct-blob-report
- run: npx playwright test --config playwright.config.ts    --reporter=blob --output=e2e-blob-report
\`\`\`

> **QA Tip:** CT tests are fast enough that sharding is rarely needed. A typical suite of 200 CT tests finishes in under 30 seconds on a single CI worker. Reserve sharding for your E2E suite where it makes a real impact on total pipeline time.
        `
      },

      {
        id: 'pw-custom-reporters',
        title: 'Custom Reporters & Integrations',
        analogy: "Test results that only live in a terminal are like a ship's navigation log that only the captain can read. The ship's owner, the port authority, the cargo clients — everyone with a stake in the voyage — gets nothing. A custom reporter is the translation layer: it takes the raw navigation data and publishes it in the right format for every stakeholder. The HTML report for QA engineers. The JUnit XML for the CI system. The Slack message for the dev team. The JIRA ticket for the project manager. One voyage, many audiences, each report tailored.",
        lessonMarkdown: `
## Custom Reporters & Integrations

Getting test results out of Playwright and into the hands of every stakeholder — developers, managers, CI systems, issue trackers — is what separates a test suite from a testing programme. This module covers the full reporter ecosystem from scratch implementations to Allure, Slack, and JIRA integrations.

---

### 1. Anatomy of a Playwright Reporter

💡 **Analogy:** A Playwright reporter is like a court stenographer who is handed a transcript of the proceedings (Suite, TestCase, TestResult) and asked to produce different outputs — official court record, press summary, lawyer's brief — each from the same raw material.

**The Reporter interface — every hook explained:**

\`\`\`typescript
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  TestStep,
  FullResult,
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  // Called once before any test runs — receives the root Suite
  onBegin(config: FullConfig, suite: Suite): void {}

  // Called when each test starts
  onTestBegin(test: TestCase, result: TestResult): void {}

  // Called when each step inside a test starts (e.g., page.goto, expect)
  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {}

  // Called when a step completes
  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {}

  // Called when a test completes — result.status is 'passed', 'failed', 'timedOut', 'skipped'
  onTestEnd(test: TestCase, result: TestResult): void {}

  // Called once after all tests — receives the final summary
  onEnd(result: FullResult): Promise<void> | void {}

  // Called when a stdout/stderr message is emitted
  onStdOut(chunk: string, test?: TestCase, result?: TestResult): void {}
  onStdErr(chunk: string, test?: TestCase, result?: TestResult): void {}
}
\`\`\`

**Registering your reporter in \`playwright.config.ts\`:**

\`\`\`typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],                                         // built-in HTML report
    ['json', { outputFile: 'results/results.json' }], // built-in JSON
    ['./reporters/my-reporter.ts'],                   // custom reporter
    ['./reporters/slack-reporter.ts', {               // custom with options
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
    }],
  ],
});
\`\`\`

**Minimal reporter — prints one line per test:**

\`\`\`typescript
// reporters/minimal-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class MinimalReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult): void {
    const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '○' : '✗';
    const ms   = result.duration;
    console.log(\`\${icon} \${test.title} (\${ms}ms)\`);
  }
}

export default MinimalReporter;
\`\`\`

> **QA Tip:** Multiple reporters run simultaneously from the same test run — you don't have to choose between HTML and JSON. Stack them in the \`reporter\` array and each one receives the same event stream.

---

### 2. Writing a Custom Reporter From Scratch

💡 **Analogy:** Writing a custom reporter is like programming a scoreboard. You receive every event as it happens — goal scored, foul called, time elapsed — and you decide what to display, what to store, and what to broadcast. The game doesn't change; only your scoreboard does.

**A practical JSON summary reporter:**

\`\`\`typescript
// reporters/json-summary.ts
import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestSummaryEntry {
  title:    string;
  file:     string;
  status:   string;
  duration: number;
  error?:   string;
}

class JsonSummaryReporter implements Reporter {
  private results: TestSummaryEntry[] = [];
  private startTime = Date.now();

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    console.log(\`Running \${suite.allTests().length} tests...\`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      title:    test.title,
      file:     test.location.file.replace(process.cwd(), ''),
      status:   result.status,
      duration: result.duration,
      error:    result.error?.message?.split('\\n')[0], // first line only
    });
  }

  onEnd(result: FullResult): void {
    const passed  = this.results.filter(r => r.status === 'passed').length;
    const failed  = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const slow    = this.results
      .filter(r => r.duration > 10_000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    const summary = {
      runAt:        new Date().toISOString(),
      totalMs:      Date.now() - this.startTime,
      status:       result.status,
      counts:       { passed, failed, skipped, total: this.results.length },
      slowestTests: slow,
      failures:     this.results.filter(r => r.status === 'failed'),
    };

    fs.mkdirSync('results', { recursive: true });
    fs.writeFileSync('results/summary.json', JSON.stringify(summary, null, 2));
    console.log(\`\\nSummary: \${passed} passed, \${failed} failed, \${skipped} skipped\`);
  }
}

export default JsonSummaryReporter;
\`\`\`

**Accessing attachments — screenshots, traces, videos:**

\`\`\`typescript
onTestEnd(test: TestCase, result: TestResult): void {
  if (result.status === 'failed') {
    const screenshot = result.attachments.find(a => a.name === 'screenshot');
    const trace      = result.attachments.find(a => a.name === 'trace');
    const video      = result.attachments.find(a => a.name === 'video');

    if (screenshot?.path) {
      console.log(\`  Screenshot: \${screenshot.path}\`);
    }
    if (trace?.path) {
      console.log(\`  Trace:      \${trace.path}\`);
      console.log(\`  View trace: npx playwright show-trace \${trace.path}\`);
    }
  }
}
\`\`\`

> **QA Tip:** The \`result.attachments\` array contains every file Playwright attached during the test run — screenshots on failure, HAR files, custom \`testInfo.attach()\` calls. Your reporter can copy these files to S3, embed them in reports, or post them to Slack.

---

### 3. Allure Reporter — Rich Interactive Reports

💡 **Analogy:** The built-in HTML report is a single newspaper edition. Allure is a subscription news service — interactive, searchable, with historical archives, trend analysis, and ownership tracking. Same stories, but you can filter by author, search by keyword, and see how the crime rate changed over 30 days.

**Installation:**

\`\`\`bash
npm install -D allure-playwright allure-commandline
\`\`\`

**Configuration:**

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['allure-playwright', {
      detail: true,               // include step details in the report
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
  ],
});
\`\`\`

**Allure annotations inside tests:**

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('user can complete checkout', async ({ page }) => {
  // Metadata annotations
  allure.label('severity', 'critical');
  allure.label('owner', 'team-checkout');
  allure.feature('Checkout');
  allure.story('Happy Path');
  allure.description('Verifies that a logged-in user can complete a full purchase.');

  // Link to requirements
  allure.link('https://jira.example.com/PROJ-456', 'JIRA Ticket', 'jira');

  await allure.step('Navigate to product page', async () => {
    await page.goto('/products/widget-pro');
  });

  await allure.step('Add product to cart', async () => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });

  await allure.step('Complete checkout', async () => {
    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page).toHaveURL(/order-confirmation/);
  });
});
\`\`\`

**Generating and serving the report:**

\`\`\`bash
# After running tests:
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
\`\`\`

**GitHub Actions — upload results, generate in pipeline:**

\`\`\`yaml
- name: Run Playwright Tests
  run: npx playwright test

- name: Generate Allure Report
  if: always()
  run: npx allure generate allure-results --clean -o allure-report

- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report/
    retention-days: 30
\`\`\`

> **QA Tip:** Allure's history feature requires the \`allure-results\` directory to contain a \`history/\` folder from the previous run. In CI, download the previous \`allure-report/history\` artifact and copy it into \`allure-results/history\` before each run to maintain trend graphs.

---

### 4. Slack Integration — Failure Notifications

💡 **Analogy:** A Slack failure notification is the fire alarm panel in the lobby — it tells everyone in the building that something is wrong, exactly which room it is in, and the severity level. Without it, only the person standing in the smoke-filled room knows there is a fire.

**Slack webhook reporter:**

\`\`\`typescript
// reporters/slack-reporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface SlackReporterOptions {
  webhookUrl: string;
  channel?:   string;
  onlyOnFailure?: boolean;
}

class SlackReporter implements Reporter {
  private failures: { title: string; error: string; file: string }[] = [];
  private passed = 0;
  private options: SlackReporterOptions;

  constructor(options: SlackReporterOptions) {
    this.options = options;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.failures.push({
        title: test.title,
        error: result.error?.message?.split('\\n')[0] ?? 'Unknown error',
        file:  test.location.file.replace(process.cwd(), ''),
      });
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    // Only notify in CI
    if (!process.env.CI) return;

    // Only notify on failure if configured
    if (this.options.onlyOnFailure && result.status === 'passed') return;

    const total  = this.passed + this.failures.length;
    const colour = this.failures.length > 0 ? '#FF0000' : '#36A64F';
    const icon   = this.failures.length > 0 ? ':red_circle:' : ':white_check_mark:';

    const failureBlocks = this.failures.slice(0, 5).map(f => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: \`*\${f.title}*\\n\\\`\${f.file}\\\`\\n> \${f.error}\`,
      },
    }));

    const payload = {
      channel: this.options.channel,
      attachments: [{
        color: colour,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: \`\${icon} Test Run: \${result.status.toUpperCase()}\` },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: \`*Passed:* \${this.passed}\` },
              { type: 'mrkdwn', text: \`*Failed:* \${this.failures.length}\` },
              { type: 'mrkdwn', text: \`*Total:*  \${total}\` },
              { type: 'mrkdwn', text: \`*CI Run:* <\${process.env.CI_RUN_URL ?? '#'}|View Artifacts>\` },
            ],
          },
          ...failureBlocks,
        ],
      }],
    };

    await fetch(this.options.webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  }
}

export default SlackReporter;
\`\`\`

**Registering with options:**

\`\`\`typescript
// playwright.config.ts
reporter: [
  ['./reporters/slack-reporter.ts', {
    webhookUrl:    process.env.SLACK_WEBHOOK_URL!,
    channel:       '#qa-alerts',
    onlyOnFailure: true,
  }],
],
\`\`\`

> **QA Tip:** Always guard Slack (and all external notification) reporters behind \`if (!process.env.CI) return\`. Local test runs should never spam team channels, and developers should never have to worry that running tests locally will send notifications.

---

### 5. JIRA / Xray Integration

💡 **Analogy:** Auto-creating JIRA tickets is like a quality control line that prints a defect report every time a faulty item falls off the conveyor belt — automatically, consistently, with the right metadata. No manual logging, no forgotten defects, no duplicate tickets for the same fault.

**Annotating tests with JIRA ticket references:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('checkout flow completes successfully', async ({ page }) => {
  // Link this test to a JIRA ticket
  test.info().annotations.push({
    type:        'jira',
    description: 'PROJ-456',
  });

  // Link to multiple tickets if needed
  test.info().annotations.push({
    type:        'jira',
    description: 'PROJ-789',
  });

  await page.goto('/checkout');
  // ... test body
});
\`\`\`

**Auto-creating JIRA tickets for newly-failing tests:**

\`\`\`typescript
// reporters/jira-reporter.ts
class JiraReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    if (result.status !== 'failed') return;
    if (!process.env.CI) return;

    // Check if this test already has a JIRA annotation
    const existingTicket = test.annotations.find(a => a.type === 'jira');
    if (existingTicket) {
      // Update the existing ticket status instead of creating a new one
      await this.updateTicketStatus(existingTicket.description!, 'Reopened');
      return;
    }

    // Create a new JIRA ticket for this failure
    await this.createJiraTicket({
      summary:     \`[AUTO] Test failure: \${test.title}\`,
      description: [
        \`*Test file:* \${test.location.file}\`,
        \`*Error:* {noformat}\${result.error?.message ?? 'No error message'}{noformat}\`,
        \`*CI Run:* \${process.env.CI_RUN_URL ?? 'unknown'}\`,
      ].join('\\n'),
      priority:  'High',
      labels:    ['automated-test', 'regression'],
    });
  }

  private async createJiraTicket(fields: Record<string, unknown>): Promise<void> {
    await fetch(\`\${process.env.JIRA_BASE_URL}/rest/api/2/issue\`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': \`Basic \${Buffer.from(\`\${process.env.JIRA_EMAIL}:\${process.env.JIRA_TOKEN}\`).toString('base64')}\`,
      },
      body: JSON.stringify({
        fields: {
          project:     { key: process.env.JIRA_PROJECT_KEY },
          issuetype:   { name: 'Bug' },
          ...fields,
        },
      }),
    });
  }

  private async updateTicketStatus(ticketId: string, status: string): Promise<void> {
    // Transition the ticket to the target status using JIRA transitions API
    console.log(\`Updating \${ticketId} to \${status}\`);
  }
}
\`\`\`

> **QA Tip:** De-duplication is critical for JIRA auto-creation. Without it, a test that fails on every run will create a new ticket on every run, flooding your board. Always check for an existing open ticket with the test's title before creating a new one.

---

### 6. Test Metadata & Custom Annotations

💡 **Analogy:** \`test.info()\` is the test's passport — it holds all the identifying information that any reporter, integration, or observer might need. You can stamp extra visas into it at any point during the test run, and any reporter can read every stamp.

**\`test.info().annotations\` — arbitrary key-value metadata:**

\`\`\`typescript
test('payment processing', async ({ page }) => {
  const info = test.info();

  // Add ownership
  info.annotations.push({ type: 'owner', description: 'team-payments' });

  // Add severity
  info.annotations.push({ type: 'severity', description: 'critical' });

  // Link to documentation
  info.annotations.push({
    type:        'docs',
    description: 'https://docs.example.com/payment-flow',
  });

  // Tag the environment
  info.annotations.push({ type: 'environment', description: process.env.TEST_ENV! });
});
\`\`\`

**\`test.info().attachments\` — attaching files programmatically:**

\`\`\`typescript
test('API response audit', async ({ request, page }) => {
  const response = await request.get('/api/users');
  const body = await response.text();

  // Attach the raw API response to the test result
  await test.info().attach('api-response.json', {
    body:        Buffer.from(body),
    contentType: 'application/json',
  });

  // Attach a custom log file
  await test.info().attach('test-run.log', {
    path:        '/tmp/test-run.log',
    contentType: 'text/plain',
  });
});
\`\`\`

**Building a team ownership routing system:**

\`\`\`typescript
// fixtures/ownership.ts — auto-annotate every test with team ownership
import { test as base } from '@playwright/test';

// Convention: test file path contains the team name
// e.g., tests/checkout/cart.spec.ts → team-checkout
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const fileSegments = testInfo.file.split('/');
    const teamFolder   = fileSegments[fileSegments.indexOf('tests') + 1] ?? 'unknown';
    testInfo.annotations.push({ type: 'team', description: \`team-\${teamFolder}\` });
    await use(page);
  },
});
\`\`\`

**\`test.info().setTimeout()\` — dynamic timeout extension:**

\`\`\`typescript
test('slow data migration test', async ({ page }) => {
  // This test is known to be slow — extend timeout dynamically
  test.info().setTimeout(120_000);  // 2 minutes for this test only

  await page.goto('/admin/migrate');
  await page.getByRole('button', { name: 'Run Migration' }).click();
  await expect(page.getByText('Migration complete')).toBeVisible({ timeout: 90_000 });
});
\`\`\`

> **QA Tip:** Annotations are available in the \`onTestEnd\` hook of every reporter via \`test.annotations\`. Use them to route Slack alerts by team, populate Allure metadata, filter results in your dashboard, or feed your JIRA integration with ticket IDs.

---

### 7. Building a Results Dashboard

💡 **Analogy:** The JSON results file is raw ore. A dashboard is the smelting process — it refines the ore into actionable intelligence: pass rates, trend lines, slowest tests, most-flaky tests. The ore is useless until processed; the dashboard makes it valuable.

**The JSON reporter output structure:**

\`\`\`typescript
// playwright.config.ts
reporter: [['json', { outputFile: 'results/results.json' }]],

// results.json shape (simplified):
// {
//   "config": { "rootDir": "...", "workers": 4 },
//   "suites": [{
//     "title": "auth.spec.ts",
//     "specs": [{
//       "title": "user can log in",
//       "tests": [{
//         "status": "passed",
//         "results": [{
//           "workerIndex": 0,
//           "duration": 1234,
//           "status": "passed",
//           "attachments": [],
//           "errors": []
//         }]
//       }]
//     }]
//   }]
// }
\`\`\`

**Reading results.json to extract metrics:**

\`\`\`typescript
// scripts/parse-results.ts
import * as fs from 'fs';

const raw = JSON.parse(fs.readFileSync('results/results.json', 'utf-8'));

const allTests = raw.suites.flatMap((suite: any) =>
  suite.specs.flatMap((spec: any) =>
    spec.tests.flatMap((test: any) =>
      test.results.map((result: any) => ({
        title:    spec.title,
        file:     suite.title,
        status:   result.status,
        duration: result.duration,
      }))
    )
  )
);

const passed  = allTests.filter((t: any) => t.status === 'passed').length;
const failed  = allTests.filter((t: any) => t.status === 'failed').length;
const slowest = allTests
  .sort((a: any, b: any) => b.duration - a.duration)
  .slice(0, 10);

console.log(\`Pass rate: \${((passed / allTests.length) * 100).toFixed(1)}%\`);
console.table(slowest);
\`\`\`

**Storing historical results for trend analysis:**

\`\`\`typescript
// scripts/archive-results.ts — append each run to a history file
import * as fs from 'fs';

const history  = JSON.parse(fs.readFileSync('results/history.json', 'utf-8').catch(() => '[]'));
const current  = JSON.parse(fs.readFileSync('results/results.json', 'utf-8'));

const runEntry = {
  runAt:     new Date().toISOString(),
  gitSha:    process.env.GITHUB_SHA ?? 'local',
  branch:    process.env.GITHUB_REF_NAME ?? 'local',
  passed:    current.stats?.expected  ?? 0,
  failed:    current.stats?.unexpected ?? 0,
  durationMs: current.stats?.duration  ?? 0,
};

history.push(runEntry);

// Keep last 90 runs
const trimmed = history.slice(-90);
fs.writeFileSync('results/history.json', JSON.stringify(trimmed, null, 2));
\`\`\`

**Flakiness detection — tests that fail then pass on retry:**

\`\`\`typescript
// A test is flaky if it has multiple results and not all have the same status
const flaky = allTests.filter((t: any) => {
  const statuses = t.results?.map((r: any) => r.status) ?? [];
  return statuses.includes('passed') && statuses.includes('failed');
});

console.log(\`Flaky tests: \${flaky.length}\`);
flaky.forEach((t: any) => console.log(\`  - \${t.title}\`));
\`\`\`

> **QA Tip:** Commit your \`results/history.json\` file (or store it in a CI artifact cache) so trend graphs survive across CI runs. A pass rate graph over 30 days is one of the most compelling artefacts you can show to engineering leadership to justify investing in test quality.
        `
      },

      {
        id: 'pw-advanced-architecture',
        title: 'Advanced Test Architecture',
        analogy: "A small town needs no urban planning — a few houses, a shop, a road. But a city of a million people needs deliberate architecture: zoning laws, transport networks, utility infrastructure, building codes. A 50-test suite needs no architecture — just organised files. A 1,000-test suite without architecture becomes a city that grew without planning: traffic jams (slow suite), buildings blocking each other (test coupling), no-one knows where anything is (no naming conventions), the whole thing at risk of collapse when one thing changes. Expert QA engineers are the urban planners — they design the infrastructure before the population arrives.",
        lessonMarkdown: `
## Advanced Test Architecture

This module covers the structural decisions that determine whether a large test suite remains maintainable at 1,000+ tests. From the Screenplay Pattern to fixture dependency graphs, monorepo strategies, and ROI measurement — this is the engineering discipline of QA at scale.

---

### 1. Beyond POM — The Screenplay Pattern

💡 **Analogy:** The Page Object Model casts each page as a character and gives that character all the actions. The Screenplay Pattern casts each user as an Actor and describes what they attempt to do in the application — regardless of which pages are involved. When a checkout flow touches five pages, Screenplay describes it as one Task, not five POM method calls.

**The Screenplay building blocks:**

| Concept | Role | Example |
|---|---|---|
| Actor | Represents a user persona | \`adminActor\`, \`customerActor\` |
| Ability | What the actor can do | \`BrowseTheWeb\`, \`CallAnAPI\` |
| Task | A high-level business action | \`PlaceOrder\`, \`CancelSubscription\` |
| Action | A low-level browser step | \`Click\`, \`Fill\`, \`Navigate\` |
| Question | A query about system state | \`TheOrderStatus\`, \`TheCartTotal\` |

**Implementing an Actor:**

\`\`\`typescript
// screenplay/actor.ts
import { Page } from '@playwright/test';

export class Actor {
  constructor(
    private readonly name: string,
    private readonly page: Page,
  ) {}

  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.performAs(this, this.page);
    }
  }

  async asks<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this, this.page);
  }

  toString(): string { return this.name; }
}
\`\`\`

**Implementing a Task:**

\`\`\`typescript
// screenplay/tasks/place-order.ts
import { Page } from '@playwright/test';
import type { Actor } from '../actor';

export class PlaceOrder {
  constructor(private readonly productName: string) {}

  static forProduct(name: string): PlaceOrder {
    return new PlaceOrder(name);
  }

  async performAs(actor: Actor, page: Page): Promise<void> {
    // A Task composes multiple Actions — none of which reference specific pages
    await page.goto('/products');
    await page.getByRole('link', { name: this.productName }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForURL(/order-confirmation/);
  }
}
\`\`\`

**Implementing a Question:**

\`\`\`typescript
// screenplay/questions/the-order-status.ts
import { Page } from '@playwright/test';
import type { Actor } from '../actor';

export class TheOrderStatus {
  async answeredBy(actor: Actor, page: Page): Promise<string> {
    return page.getByTestId('order-status').innerText();
  }
}
\`\`\`

**A Screenplay test — readable, role-focused:**

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/actor';
import { PlaceOrder } from '../screenplay/tasks/place-order';
import { TheOrderStatus } from '../screenplay/questions/the-order-status';

test('customer can place an order for Widget Pro', async ({ page }) => {
  const customer = new Actor('Sam Customer', page);

  await customer.attemptsTo(
    PlaceOrder.forProduct('Widget Pro'),
  );

  const status = await customer.asks(new TheOrderStatus());
  expect(status).toBe('Order Confirmed');
});
\`\`\`

> **QA Tip:** Screenplay is powerful but has overhead. Introduce it when your POM classes exceed 300 lines or when the same multi-page action is duplicated across more than 10 tests. For smaller suites, a well-factored POM is simpler and equally effective.

---

### 2. The Builder Pattern for Test Data

💡 **Analogy:** A factory stamp produces one fixed shape. A builder is an adjustable mould — you configure it step by step, then press the button. Each configuration step is self-documenting, and the result is only produced when every required part is assembled.

**Fluent builder with TypeScript:**

\`\`\`typescript
// builders/user.builder.ts
import { faker } from '@faker-js/faker';

interface User {
  id:         string;
  name:       string;
  email:      string;
  role:       'admin' | 'editor' | 'viewer';
  verified:   boolean;
  plan:       'free' | 'pro' | 'enterprise';
  twoFactor:  boolean;
}

export class UserBuilder {
  private data: User = {
    id:        faker.string.uuid(),
    name:      faker.person.fullName(),
    email:     faker.internet.email(),
    role:      'viewer',
    verified:  true,
    plan:      'free',
    twoFactor: false,
  };

  withRole(role: User['role']): this {
    this.data.role = role;
    return this;
  }

  withVerifiedEmail(verified = true): this {
    this.data.verified = verified;
    return this;
  }

  withSubscription(plan: User['plan']): this {
    this.data.plan = plan;
    return this;
  }

  withTwoFactor(enabled = true): this {
    this.data.twoFactor = enabled;
    return this;
  }

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  build(): User {
    // Validate required relationships before returning
    if (this.data.twoFactor && this.data.plan === 'free') {
      throw new Error('Two-factor authentication requires a paid plan');
    }
    return { ...this.data }; // return a copy — builder is reusable
  }
}
\`\`\`

**Using the builder — test reads like a specification:**

\`\`\`typescript
test('enterprise admin with 2FA sees security dashboard', async ({ request, page }) => {
  const user = new UserBuilder()
    .withRole('admin')
    .withVerifiedEmail()
    .withSubscription('enterprise')
    .withTwoFactor()
    .build();

  // Seed via API using the built data
  const created = await request.post('/api/users', { data: user });
  const { id }  = await created.json();

  await page.goto(\`/users/\${id}/security\`);
  await expect(page.getByTestId('2fa-enabled-badge')).toBeVisible();
});
\`\`\`

**Nested builders — OrderBuilder composing UserBuilder and ProductBuilder:**

\`\`\`typescript
// builders/order.builder.ts
export class OrderBuilder {
  private customer = new UserBuilder().build();
  private items:    ReturnType<ProductBuilder['build']>[] = [];
  private status:   'pending' | 'paid' | 'shipped' = 'pending';

  withCustomer(user: ReturnType<UserBuilder['build']>): this {
    this.customer = user;
    return this;
  }

  withItem(product: ReturnType<ProductBuilder['build']>): this {
    this.items.push(product);
    return this;
  }

  withStatus(status: 'pending' | 'paid' | 'shipped'): this {
    this.status = status;
    return this;
  }

  build() {
    if (this.items.length === 0) throw new Error('Order must have at least one item');
    return {
      customer: this.customer,
      items:    this.items,
      status:   this.status,
      total:    this.items.reduce((sum, p) => sum + p.price, 0),
    };
  }
}
\`\`\`

> **QA Tip:** Builder instances should be stateless — always return \`{ ...this.data }\` (a copy) from \`build()\`. This allows the same builder to produce multiple different objects without re-instantiation, which is useful in parameterised tests.

---

### 3. Fixture Dependency Graphs

💡 **Analogy:** Playwright resolves fixture dependencies like a project manager resolves task dependencies — topological sort, deepest dependencies set up first. You just declare what each fixture needs, and Playwright figures out the construction order automatically.

**How Playwright resolves the dependency graph:**

\`\`\`typescript
// fixtures/index.ts
import { test as base } from '@playwright/test';

type Fixtures = {
  authToken:    string;
  loggedInPage: Page;
  adminPage:    Page;
};

export const test = base.extend<Fixtures>({
  // authToken depends on nothing
  authToken: async ({ request }, use) => {
    const resp  = await request.post('/api/auth/login', {
      data: { email: 'user@example.com', password: 'pass' },
    });
    const { token } = await resp.json();
    await use(token);
  },

  // loggedInPage depends on authToken
  loggedInPage: async ({ page, authToken }, use) => {
    await page.addInitScript((t: string) => {
      localStorage.setItem('auth_token', t);
    }, authToken);
    await page.goto('/dashboard');
    await use(page);
  },

  // adminPage depends on loggedInPage
  adminPage: async ({ loggedInPage }, use) => {
    await loggedInPage.goto('/admin');
    await use(loggedInPage);
  },
});
\`\`\`

**Resolution order for a test that uses \`adminPage\`:**

\`\`\`
1. browser        (built-in, worker scope)
2. context        (built-in, test scope)
3. page           (built-in, test scope)
4. request        (built-in, test scope)
5. authToken      (custom, test scope — depends on: request)
6. loggedInPage   (custom, test scope — depends on: page, authToken)
7. adminPage      (custom, test scope — depends on: loggedInPage)

Teardown runs in reverse: adminPage → loggedInPage → authToken → page → context → browser
\`\`\`

**Avoiding circular dependencies:**

\`\`\`typescript
// ❌ CIRCULAR: A depends on B, B depends on A
const test = base.extend({
  fixtureA: async ({ fixtureB }, use) => { await use('a'); }, // needs B
  fixtureB: async ({ fixtureA }, use) => { await use('b'); }, // needs A — CIRCULAR
});

// ✅ CORRECT: extract the shared concern into a third fixture
const test = base.extend({
  sharedSetup: async ({ request }, use) => { await use('shared data'); },
  fixtureA:    async ({ sharedSetup }, use) => { await use('a'); },
  fixtureB:    async ({ sharedSetup }, use) => { await use('b'); },
});
\`\`\`

**Worker-scoped and test-scoped fixtures in the same chain:**

\`\`\`typescript
const test = base.extend<
  { loggedInPage: Page },         // test-scoped
  { workerAuthToken: string }     // worker-scoped (second generic)
>({
  workerAuthToken: [async ({ request }, use, workerInfo) => {
    // Created once per worker — expensive operation done once
    const resp = await request.post('/api/auth/login', {
      data: { email: \`worker\${workerInfo.workerIndex}@example.com\`, password: 'pass' },
    });
    const { token } = await resp.json();
    await use(token);
    // cleanup...
  }, { scope: 'worker' }],

  loggedInPage: async ({ page, workerAuthToken }, use) => {
    // Created per test — uses the worker-scoped token
    await page.addInitScript((t: string) => localStorage.setItem('auth_token', t), workerAuthToken);
    await use(page);
  },
});
\`\`\`

> **QA Tip:** Debugging fixture failures: run with \`DEBUG=pw:fixture\` to see exactly which fixture in the chain threw and at what point in its setup/teardown lifecycle. This is invaluable when a fixture is failing silently.

---

### 4. Monorepo Test Strategies

💡 **Analogy:** A monorepo without shared test infrastructure is like every restaurant in a chain writing its own food safety manual from scratch. A shared \`@company/pw-fixtures\` package is the head office publishing one manual that all branches follow — with local variations allowed per branch.

**Shared fixtures as an internal TypeScript package:**

\`\`\`
packages/
  pw-fixtures/        ← @company/pw-fixtures
    src/
      auth.ts
      api.ts
      database.ts
    index.ts
    package.json

  pw-pages/           ← @company/pw-pages
    src/
      LoginPage.ts
      DashboardPage.ts
    index.ts
    package.json

apps/
  web/                ← uses @company/pw-fixtures + @company/pw-pages
    e2e/
      checkout.spec.ts
  mobile-web/
    e2e/
      checkout.spec.ts
\`\`\`

**Shared playwright.config.ts base:**

\`\`\`typescript
// packages/pw-config/base.config.ts
import { defineConfig, PlaywrightTestConfig } from '@playwright/test';

export function createBaseConfig(overrides: Partial<PlaywrightTestConfig> = {}) {
  return defineConfig({
    timeout: 30_000,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 2,
    reporter: [
      ['html'],
      ['./reporters/shared-slack-reporter.ts'],
    ],
    use: {
      screenshot: 'only-on-failure',
      video:      'retain-on-failure',
      trace:      'on-first-retry',
    },
    ...overrides,
  });
}
\`\`\`

\`\`\`typescript
// apps/web/playwright.config.ts
import { createBaseConfig } from '@company/pw-config';

export default createBaseConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.WEB_BASE_URL ?? 'http://localhost:3000',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
\`\`\`

**Running tests for affected packages only (Turborepo):**

\`\`\`json
// turbo.json
{
  "pipeline": {
    "test:e2e": {
      "dependsOn": ["^build"],
      "outputs": ["playwright-report/**"]
    }
  }
}
\`\`\`

\`\`\`bash
# Run E2E tests only for packages affected by changes on this branch
npx turbo run test:e2e --filter=[origin/main]
\`\`\`

> **QA Tip:** Version your shared fixture packages with semver and write a CHANGELOG. A breaking change to \`@company/pw-fixtures\` that affects 20 apps is a major version bump. Communicate it in advance — unexplained fixture failures across multiple apps are deeply disorienting.

---

### 5. Tagging Taxonomy for Large Suites

💡 **Analogy:** Tags are the Dewey Decimal System of your test suite. Without them, finding the 5 tests that constitute a deployment smoke check in a 1,000-test library requires searching every shelf. With them, you type \`@smoke\` and the right shelf appears instantly.

**The tag hierarchy:**

\`\`\`typescript
// The standard tag tiers — each is a superset of the one above it
// @smoke    → 5 min — critical path only, runs on every deploy
// @sanity   → 15 min — key user journeys, runs every hour
// @regression → 30 min — full feature coverage, runs nightly
// @full     → 2+ hours — every edge case, runs weekly

test('@smoke: user can log in and see dashboard', async ({ page }) => {
  test.info().annotations.push({ type: 'tag', description: '@smoke' });
  // ...
});

// Or use Playwright's native test.tag() (v1.42+):
test('user can log in', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
  // ...
});
\`\`\`

**Running by tag:**

\`\`\`bash
# Only smoke tests
npx playwright test --grep "@smoke"

# Regression but NOT flaky tests
npx playwright test --grep "@regression" --grep-invert "@flaky"

# Team checkout's stable regression tests
npx playwright test --grep "@regression" --grep "@team-checkout" --grep-invert "@flaky"
\`\`\`

**Full tagging taxonomy for a mature suite:**

\`\`\`typescript
// tier tags: @smoke, @sanity, @regression, @full
// team tags: @team-checkout, @team-auth, @team-payments, @team-search
// stability: @stable, @flaky, @wip (work in progress — skipped in CI)
// environment: @staging-only, @prod-safe, @local-only
// type: @visual, @api, @accessibility, @performance

test('checkout with 3DS card', {
  tag: ['@regression', '@team-checkout', '@staging-only'],
}, async ({ page }) => {
  // 3DS cannot be tested in production — tagged staging-only
});
\`\`\`

**Enforcing team tags with a custom reporter:**

\`\`\`typescript
// reporters/tag-enforcer.ts
class TagEnforcerReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult): void {
    const tags = test.annotations.filter(a => a.type === 'tag').map(a => a.description);
    const hasTeamTag = tags?.some(t => t?.startsWith('@team-'));

    if (!hasTeamTag) {
      console.error(\`MISSING TEAM TAG: \${test.title} in \${test.location.file}\`);
      // In strict mode, fail the test
    }
  }
}
\`\`\`

> **QA Tip:** Introduce a linting rule (enforced via a custom reporter) that every test must have at least one tier tag and one team tag. Untagged tests in a 1,000-test suite are like unlabelled files in a filing cabinet — they get lost and are never cleaned up.

---

### 6. Measuring QA Automation ROI

💡 **Analogy:** A QA automation programme with no metrics is like a factory with no output measurement. The machines are running, the engineers are working, but leadership has no way to know if the line is profitable. ROI metrics are the production figures that justify the investment.

**Suite runtime trend — track average run time per commit:**

\`\`\`typescript
// scripts/record-metrics.ts
import * as fs from 'fs';

const results = JSON.parse(fs.readFileSync('results/results.json', 'utf-8'));

const metricsEntry = {
  date:          new Date().toISOString().split('T')[0],
  commit:        process.env.GITHUB_SHA?.slice(0, 7) ?? 'local',
  branch:        process.env.GITHUB_REF_NAME ?? 'local',
  durationMs:    results.stats.duration,
  passed:        results.stats.expected,
  failed:        results.stats.unexpected,
  flaky:         results.stats.flaky ?? 0,
  totalTests:    results.stats.total,
  passRate:      (results.stats.expected / results.stats.total * 100).toFixed(1),
};

const history = JSON.parse(
  fs.existsSync('metrics/history.json')
    ? fs.readFileSync('metrics/history.json', 'utf-8')
    : '[]'
);

history.push(metricsEntry);
fs.mkdirSync('metrics', { recursive: true });
fs.writeFileSync('metrics/history.json', JSON.stringify(history.slice(-180), null, 2));
\`\`\`

**Flakiness rate calculation:**

\`\`\`typescript
// A test is flaky if result.status is 'flaky' — meaning it failed then passed on retry
const flakiness = (results.stats.flaky / results.stats.total * 100).toFixed(2);
console.log(\`Flakiness rate: \${flakiness}%\`);

// Industry benchmark: < 1% is good, > 5% needs urgent attention
// > 10% means your suite is unreliable — developers stop trusting it
\`\`\`

**The ROI calculation:**

\`\`\`
ROI = (bugs_caught_in_CI × avg_cost_of_prod_bug) - annual_automation_cost

Example:
  Bugs caught in CI per year:      240
  Average cost of prod bug:        $2,500 (engineering time + incident)
  Automation value:                $600,000/year

  Engineer cost (1 FTE):           $120,000/year
  CI infrastructure:               $12,000/year
  Total automation cost:           $132,000/year

  ROI = $600,000 - $132,000 = $468,000/year
  ROI percentage = 355%
\`\`\`

**The one-page leadership dashboard metrics:**

\`\`\`
Key QA Metrics — Q2 2025
─────────────────────────────────────────────────────
Suite Size:          1,247 tests  (+87 this quarter)
Avg Run Time:        8m 42s       (-1m 12s vs Q1)
Pass Rate (CI):      97.3%        (+0.8% vs Q1)
Flakiness Rate:      0.9%         (-0.4% vs Q1)
Bugs Caught Pre-Prod: 187          (+23 vs Q1)
Est. Value Delivered: $467,500     (based on $2,500/bug)
─────────────────────────────────────────────────────
\`\`\`

> **QA Tip:** Track the "time-to-first-failure" metric — how long into the CI run the first failing test appears. If it is always near the end, consider reordering your suite to run the highest-risk tests first (smoke tests, recently changed test files) for faster developer feedback.

---

### 7. The Test Pyramid Revisited at Scale

💡 **Analogy:** The original pyramid was designed for server-rendered applications where the UI was thin. Modern frontend-heavy SPAs are 80% UI — the pyramid needs to reflect where the complexity actually lives. The testing trophy is the updated architectural blueprint for the modern web.

**The original pyramid vs the modern trophy:**

\`\`\`
Original Pyramid (2009):       Modern Trophy (2021+):
        /\                            /\
       /E2E\     few              /      \
      /──────\                   / E2E    \   ← 10%
     / Intgr  \  some           /──────────\
    /──────────\               / Integration \  ← 50%
   /   Unit     \  many       /──────────────\
  /______________\           /    Static       \  ← always on
                            /__________________\
\`\`\`

**Where Playwright fits in the trophy:**

\`\`\`
Integration layer (50%):
  → Playwright Component Tests (CT)
  → API integration tests (page.request)
  → Feature-level tests with mocked backends

E2E layer (10%):
  → Full user journeys: login → purchase → confirmation
  → Cross-service flows: your app + third-party OAuth
  → Production smoke tests: critical paths on real data
\`\`\`

**The 10-minute rule for E2E suites:**

\`\`\`typescript
// If your E2E suite takes > 10 minutes, developers start ignoring failures.
// The fix is not more sharding — it is moving tests down the stack.

// Candidates for CT migration from E2E:
const migrationCandidates = [
  'Tests that only verify one component\'s rendering',
  'Tests that mock all network calls anyway',
  'Tests that never navigate between pages',
  'Tests that test error states that are hard to reproduce via full flow',
  'Tests of loading/skeleton states',
];

// Tests that MUST stay in E2E:
const mustBeE2E = [
  'Authentication flows (real session handling)',
  'Payment flows (real or sandbox third-party)',
  'Cross-browser rendering issues',
  'Service worker / offline behaviour',
  'Real-time features (WebSockets, SSE)',
];
\`\`\`

**Designing for speed — the shard/serial/CT decision:**

\`\`\`typescript
// playwright.config.ts — tiered execution strategy
export default defineConfig({
  projects: [
    // Tier 1: Fast CT tests — always run first, no sharding needed
    {
      name: 'component-tests',
      testMatch: '**/*.ct.spec.tsx',
    },

    // Tier 2: API integration tests — fast, can run in parallel
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.ts',
    },

    // Tier 3: E2E — sharded across 4 CI workers
    {
      name: 'e2e-chrome',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Tier 4: Cross-browser — only on main branch, not on every PR
    ...(process.env.FULL_SUITE ? [
      { name: 'e2e-firefox',  testMatch: '**/e2e/**/*.spec.ts', use: { ...devices['Desktop Firefox'] } },
      { name: 'e2e-safari',   testMatch: '**/e2e/**/*.spec.ts', use: { ...devices['Desktop Safari'] } },
    ] : []),
  ],
});
\`\`\`

> **QA Tip:** The right metric for test pyramid health is not test count — it is cost per defect caught. If your E2E suite costs \$5 per defect caught and your CT suite costs \$0.10, invest in more CT and fewer E2E. Measure both suites on their cost-effectiveness, not their size.
        `
      },

    ]
  },
  'ai-qa': {
    id: 'ai-qa',
    levels: [
      {
        id: 'ai-what-is-ai',
        title: 'Module 1: What Even IS Artificial Intelligence?',
        analogy: "AI is like a very well-read intern. They've read millions of books, articles, and code files. They can answer questions, write things for you, and help you think — but they haven't actually done your job before. They know about it from reading, not from experience.",
        lessonMarkdown: `
### What is AI?

*💡 Analogy: AI is like a very well-read intern. They've read millions of books and code files. They can help you think and write — but they've never actually done your job. They know about it from reading, not from experience.*

**AI (Artificial Intelligence)** is software that can understand language, generate text, write code, and answer questions — almost like a human would.

The type of AI you use for testing (ChatGPT, Claude, Copilot) is called an **LLM — Large Language Model**.

---

### The 3 Things AI is Really Good At

| Skill | Example |
|-------|---------|
| **Writing** | "Write 10 test cases for a login page" |
| **Summarising** | "Explain this 500-line codebase in 5 bullet points" |
| **Generating** | "Generate 50 fake user profiles as JSON" |

---

### The 3 Things AI is Bad At

| Weakness | Why it matters to you |
|----------|-----------------------|
| **Facts** | AI can state wrong facts confidently |
| **Maths** | AI sometimes calculates incorrectly |
| **Knowing what it doesn't know** | It won't say "I'm not sure" — it guesses |

---

### Why AI Suddenly Got So Good (2022–2023)

Before 2022, AI could do simple tasks. Then **ChatGPT** launched in November 2022 and everything changed.

The reason: training on **massive amounts of text** (billions of web pages, books, code repos) combined with a new technique called **RLHF** (Reinforcement Learning from Human Feedback) — humans rated AI answers as good or bad, and the AI learned from that feedback.

---

### Real Example — The Hallucination Problem

> You ask AI: *"What is the capital of Australia?"*
>
> AI answers: *"Sydney"* ← **WRONG** (it's Canberra)

This is called a **hallucination** — AI gives a confident, wrong answer.

**The golden rule: AI is your first draft, not your final answer. Always verify.**
        `,
      },
      {
        id: 'ai-how-it-thinks',
        title: 'Module 2: How AI Actually Understands You',
        analogy: "Imagine sending a letter to a brilliant friend, but the envelope has a size limit — only 10 pages. Everything you want them to know must fit in those 10 pages — your question AND their answer. That size limit is called the context window.",
        lessonMarkdown: `
### Tokens — The Unit of AI Thinking

*💡 Analogy: Tokens are like LEGO bricks. Every word, punctuation mark, or space is roughly one brick. AI thinks in bricks, not full sentences.*

AI doesn't read words like you do. It breaks everything into small pieces called **tokens**.

- 1 token ≈ 1 word (roughly)
- "Hello world" = 2 tokens
- "Playwright" = 1 token
- A full test script = hundreds of tokens

**Why it matters:** AI has a limit on how many tokens it can process at once. This is called the **context window**.

---

### The Context Window

*💡 Analogy: Sending a letter to a brilliant friend with a 10-page limit. Everything — your question AND their answer — must fit in those 10 pages.*

The **context window** is how much information AI can "hold in its head" at once.

| Model | Approx. Context Window |
|-------|----------------------|
| GPT-3.5 | ~4,000 tokens (~3,000 words) |
| GPT-4 | ~128,000 tokens (~96,000 words) |
| Claude | ~200,000 tokens (~150,000 words) |

**Why it matters:**
- If you paste a huge file, AI may "forget" the start by the time it reaches the end
- Each new chat starts fresh — AI has no memory of your last conversation

---

### Why AI "Forgets" Previous Conversations

When you start a new chat, AI has **zero memory** of what you talked about before. It only knows what's in the current conversation window.

This is why experienced users:
- Paste relevant context at the start of each session
- Keep system prompts that describe their project

---

### Practical Tip: Context = Better Answers

\`\`\`
❌ Bad: "Write a test"

✅ Good: "Write a Playwright TypeScript test for a login page.
URL: /login. Email field: #email. Password field: #password.
On success, it redirects to /dashboard."
\`\`\`

More context you give → much better output you get.

---

### System Prompt vs User Prompt

When you open ChatGPT or Claude, there are actually two types of input:

| Type | What it is | Example |
|------|-----------|---------|
| **System Prompt** | Background instructions set before the conversation starts — defines AI's role and rules | "You are a QA engineer assistant. Always format answers as bullet points." |
| **User Prompt** | What you type each message | "Write test cases for a login page" |

**Where you'll see this:**
- **ChatGPT:** Settings → "Custom Instructions" — this becomes your permanent system prompt for every chat
- **Claude:** "System Prompt" field in Projects
- **API usage:** Developers set this in code before calling the AI

**Practical tip for testers:** Set a Custom Instruction like:
\`\`\`
I am a QA engineer. Always:
- Use professional QA terminology
- Format test cases as numbered lists with Expected Result
- Flag security risks in any code I share
\`\`\`
This applies to every conversation automatically — you don't need to repeat it.
        `,
      },
      {
        id: 'ai-your-first-prompt',
        title: 'Module 3: Your First AI Prompt for Testing',
        analogy: "Talking to AI is like ordering at a restaurant. If you say 'give me food', you'll get something random. If you say 'give me a medium-rare steak with chips and a side salad', you'll get exactly what you want. Be specific.",
        lessonMarkdown: `
### The Anatomy of a Good Prompt

*💡 Analogy: Ordering at a restaurant. "Give me food" = random result. "Medium-rare steak, chips, side salad, no onions" = exactly what you want.*

Every great AI prompt has 4 parts:

| Part | What it means | Example |
|------|---------------|---------|
| **Role** | Who should AI act as? | "Act as a senior QA engineer" |
| **Task** | What should it do? | "Write 10 test cases for a login page" |
| **Context** | What is the situation? | "The login uses email + password, redirects to /dashboard" |
| **Format** | How should the answer look? | "Format as a Gherkin table" |

---

### Your First 5 Prompts — Try These Today

**Prompt 1 — Test Cases from scratch:**
\`\`\`
Act as a senior QA engineer.
List 10 test cases for a login page with email and password fields.
Include happy path, negative cases, and edge cases.
\`\`\`

**Prompt 2 — Professional bug report:**
\`\`\`
I found a bug. Convert my notes into a professional bug report
with: Title, Steps to Reproduce, Expected Result, Actual Result, Severity.

My notes: "login broken on safari, works on chrome,
clicking login does nothing, console shows CORS error"
\`\`\`

**Prompt 3 — Edge cases from a user story:**
\`\`\`
User story: "As a user, I want to reset my password via email."
What edge cases should I test that a developer might have missed?
\`\`\`

**Prompt 4 — Generate test data:**
\`\`\`
Generate 20 realistic test data entries for a user registration form.
Fields: name, email, phone, date of birth.
Include a mix of valid and invalid values.
\`\`\`

**Prompt 5 — Explain code:**
\`\`\`
Explain what this function does in simple English.
Identify any potential bugs.
List test cases I should write for it.

[paste your function here]
\`\`\`

---

### The Key Insight

The difference between a bad AI response and a great one is almost always **the quality of your prompt**, not the AI itself.

Think of yourself as the director and AI as the actor. Give clear direction → great performance.
        `,
      },
      {
        id: 'ai-prompt-craft',
        title: 'Module 4: The CRAFT Method — Prompts That Actually Work',
        analogy: "A prompt is like a job description you post on LinkedIn. A vague one ('we need someone good') gets terrible applicants. A detailed one ('Senior QA Engineer, 5 years Playwright, fintech domain, London') gets exactly who you need.",
        lessonMarkdown: `
### The CRAFT Framework

*💡 Analogy: A prompt is like a LinkedIn job description. A vague one gets terrible applicants. A detailed one gets exactly the right person.*

**CRAFT** is a simple method to write prompts that consistently get great results.

| Letter | Stands For | Question to Ask Yourself |
|--------|-----------|--------------------------|
| **C** | Context | What is the background situation? |
| **R** | Role | Who should the AI pretend to be? |
| **A** | Action | What exactly do you want done? |
| **F** | Format | How should the answer be structured? |
| **T** | Tone | Technical? Simple? Formal? |

---

### CRAFT in Action

**❌ Weak prompt:**
\`\`\`
Write test cases for checkout
\`\`\`

**✅ CRAFT prompt:**
\`\`\`
You are a senior QA engineer with 10 years of e-commerce testing experience. (Role)

I am testing the checkout flow of an online store that sells electronics.
The cart has quantity controls, a promo code field, and Stripe payment. (Context)

Write 15 test cases covering: happy path, edge cases, and error scenarios. (Action)

Format as a table: Test ID | Description | Steps | Expected Result. (Format)

Use professional QA language. (Tone)
\`\`\`

---

### How to Iterate When the First Answer Isn't Good Enough

AI is not a one-shot machine. You're supposed to refine:

1. **Ask it to improve:** *"This is good but add 5 more edge cases around payment failures."*
2. **Ask it to change format:** *"Re-format this as Gherkin scenarios."*
3. **Ask it to self-critique:** *"Review your own answer. What test cases are missing?"*
4. **Ask it to go deeper:** *"Expand test case #7 with step-by-step detail."*

---

### Quick Reference — CRAFT Starters

\`\`\`
"You are a [role] with [X] years of experience in [domain]."
"I am working on [context]."
"Please [specific action]."
"Format the output as [table/list/JSON/Gherkin]."
"Use [formal/simple/technical] language."
\`\`\`
        `,
      },
      {
        id: 'ai-test-cases',
        title: 'Module 5: Using AI to Write Test Cases 10x Faster',
        analogy: "Writing test cases manually is like painting a wall with a tiny brush. AI is the paint roller — it covers the same area in a fraction of the time. You still need to check the quality, but the heavy lifting is done.",
        lessonMarkdown: `
### Why AI is Perfect for Test Cases

*💡 Analogy: Writing test cases manually is like painting a wall with a tiny brush. AI is the paint roller — covers more ground faster. You still need to check the quality, but AI does the heavy lifting.*

Test case generation is one of the best uses of AI in QA because:
- It's repetitive and structured (AI loves this)
- You know what good output looks like (you can review it)
- AI catches edge cases humans often miss

---

### Converting a User Story to a Full Test Suite

**User story:**
> "As a user, I want to reset my password by entering my email and receiving a reset link."

**Prompt:**
\`\`\`
Act as a QA engineer. Based on this user story, write test cases for:
1. Happy path
2. Invalid email formats
3. Email not registered in the system
4. Rate limiting (too many requests)
5. Expired reset link
6. Security concerns (token reuse, etc.)

Format as Gherkin (Given/When/Then).
\`\`\`

**Example AI output:**
\`\`\`gherkin
Scenario: Successful password reset request
  Given I am on the forgot password page
  When I enter a valid registered email "user@example.com"
  And I click "Send Reset Link"
  Then I should see "Check your inbox" message
  And a reset email should be sent within 60 seconds

Scenario: Email not registered
  Given I am on the forgot password page
  When I enter an unregistered email "unknown@example.com"
  And I click "Send Reset Link"
  Then I should see "If this email exists, a reset link has been sent"
\`\`\`

---

### Asking AI to Think About Negative Cases

Most testers write happy path first and run out of energy before negative cases. Use this prompt:

\`\`\`
I've already written happy path tests.
Now focus ONLY on: negative tests, boundary values, security edge cases,
and scenarios that a developer might have forgotten to handle.
\`\`\`

---

### Asking AI to Prioritise by Risk

\`\`\`
Here are 30 test cases for our payment flow.
Rank them from highest to lowest risk, assuming we only have time
to run 10 before the release. Explain your reasoning.
\`\`\`

---

### How to Review AI-Generated Test Cases

AI test cases are a starting point, not a final answer. Always check:
- ✅ Are steps specific enough to follow?
- ✅ Is the expected result clearly defined?
- ✅ Are there domain-specific cases AI wouldn't know about?
- ✅ Does anything assume wrong system behaviour?

---

### Getting AI Output Into Your Team's Tools

AI generates great test cases — but they're useless if they're stuck in a chat window. Tell AI exactly what format your team uses:

**For Jira (as a user story acceptance criteria):**
\`\`\`
Format each test case as a Jira acceptance criterion:
"Given [precondition], When [action], Then [expected result]"
\`\`\`

**For Gherkin / Cucumber / SpecFlow:**
\`\`\`
Format all test cases as Gherkin scenarios using Given/When/Then.
Group related scenarios under a Feature block.
\`\`\`

**For TestRail / Zephyr (table format):**
\`\`\`
Format as a table with columns:
Test Case ID | Title | Precondition | Steps | Expected Result | Priority
\`\`\`

**For a plain Excel/CSV export:**
\`\`\`
Format as CSV with headers:
ID,Title,Steps,Expected Result,Actual Result,Pass/Fail
\`\`\`

Once AI generates in your format, you can paste directly into your tool with minimal cleanup.
        `,
      },
      {
        id: 'ai-bug-reports',
        title: 'Module 6: Writing Perfect Bug Reports with AI',
        analogy: "A bad bug report is like calling a plumber and saying 'my house is wet'. A good one is 'the cold water pipe under the kitchen sink is leaking from the joint, dripping every 3 seconds'. AI helps you write the second kind every time.",
        lessonMarkdown: `
### Why Bug Reports Matter

*💡 Analogy: A bad bug report is like calling a plumber and saying "my house is wet." A good one says "the cold water pipe under the kitchen sink is leaking from the joint, started 2 hours ago, drips every 3 seconds." AI turns your messy notes into the second kind.*

A good bug report means:
- The developer can reproduce it immediately
- No back-and-forth asking "what did you do?"
- It gets fixed faster

---

### The Standard Bug Report Template

| Field | What goes here |
|-------|---------------|
| **Title** | Short, specific, actionable |
| **Environment** | Browser, OS, version, URL |
| **Steps to Reproduce** | Numbered list, exact steps |
| **Expected Result** | What should have happened |
| **Actual Result** | What actually happened |
| **Severity** | Critical / High / Medium / Low |
| **Attachments** | Screenshot, video, logs |

---

### Converting Messy Notes into a Professional Report

**Your messy notes:**
\`\`\`
login broken on safari, works on chrome, when i click login button
nothing happens, checked console there's a CORS error, only happens
on prod not staging
\`\`\`

**The prompt:**
\`\`\`
Convert these QA notes into a professional bug report with:
Title, Environment, Steps to Reproduce, Expected Result,
Actual Result, Severity, and Possible Root Cause.

Notes: [paste your notes here]
\`\`\`

**AI output:**
\`\`\`
Title: Login button unresponsive on Safari (Production only) — CORS error

Environment: Safari 17, macOS 14, Production (https://app.example.com)

Steps to Reproduce:
1. Open https://app.example.com/login in Safari
2. Enter valid credentials
3. Click the "Login" button

Expected Result: User is authenticated and redirected to /dashboard

Actual Result: Nothing happens. Browser console shows:
"Access to fetch at 'https://api.example.com/auth' from origin
'https://app.example.com' has been blocked by CORS policy"

Severity: Critical — blocks all Safari users from logging in

Possible Root Cause: The production API server is missing the
Access-Control-Allow-Origin header for the app domain.
This works on staging, suggesting a deployment configuration mismatch.
\`\`\`

---

### Asking AI to Suggest Severity

\`\`\`
Based on this bug description, suggest the appropriate severity (Critical/High/Medium/Low)
and explain why. Consider: user impact, frequency, workaround availability.
\`\`\`
        `,
      },
      {
        id: 'ai-test-data',
        title: 'Module 7: Generating Test Data with AI',
        analogy: "Using 'test@test.com' for all your tests is like testing a restaurant by only ordering water. You're not testing the real thing. AI generates thousands of realistic, varied test entries in seconds.",
        lessonMarkdown: `
### Why Good Test Data Matters

*💡 Analogy: Using "test@test.com" and "Password123" for everything is like testing a restaurant by only ordering water. You're not testing the real experience. AI can generate thousands of realistic, varied entries in seconds.*

Bad test data causes real bugs to slip through:
- Names with apostrophes (O'Brien) crash poorly coded forms
- Very long names overflow UI elements
- Special characters break SQL queries
- Unicode characters expose encoding issues

---

### Basic Test Data Generation

**Simple request:**
\`\`\`
Generate 10 realistic test users for a UK e-commerce site.
Each user needs: full name, email, UK phone number, UK address,
date of birth (mix of ages 18–80).
Output as a JSON array.
\`\`\`

---

### Edge Case Data — The Real Value

\`\`\`
Generate 10 edge case email addresses that are technically valid but unusual.
Examples: emails with + signs, dots, very long local parts, unicode.
\`\`\`

\`\`\`
Generate 10 test names that include edge cases:
apostrophes (O'Brien), hyphens (Mary-Jane), accents (José),
very long names (50+ characters), single character names.
\`\`\`

---

### Generating SQL Test Data

\`\`\`
Generate SQL INSERT statements for 20 test users in this table:
CREATE TABLE users (id INT, name VARCHAR(100), email VARCHAR(255),
created_at TIMESTAMP, is_active BOOLEAN);

Mix of: active/inactive users, various dates, edge case names.
\`\`\`

---

### Generating API Payloads

\`\`\`
Generate 5 JSON request bodies for POST /api/users endpoint.
Fields: name, email, phone, role (admin/user/guest), age.
Include: 2 valid requests, 1 with missing required field,
1 with invalid email format, 1 with age below 18.
\`\`\`

---

### What NOT to Ask AI For

⚠️ Never paste real customer data into AI tools — it's a privacy violation.

Use AI to **generate fake** data, not to process real data.

| ✅ Safe | ❌ Never do this |
|---------|-----------------|
| Generate 50 fake user profiles | Paste real customer emails |
| Create mock payment data | Share real card numbers |
| Generate test addresses | Use real employee data |
        `,
      },
      {
        id: 'ai-tools-overview',
        title: 'Module 8: The AI Toolkit — Which Tool Does What?',
        analogy: "AI tools are like vehicles. A bicycle (ChatGPT free), a car (ChatGPT Plus/Claude), a van (Copilot in your IDE), a truck (AI in CI/CD). Pick the right vehicle for the journey.",
        lessonMarkdown: `
### Not All AI Tools Are the Same

*💡 Analogy: AI tools are like vehicles. A bicycle gets you somewhere slowly. A car is faster. A van carries more. A truck handles heavy loads. Pick the right vehicle for the journey.*

Different tools are built for different jobs. Using the wrong one is like driving a bicycle on a motorway.

---

### The Main AI Tools for QA Engineers

**ChatGPT (OpenAI)**
- Great for: test cases, bug reports, explanations, general QA tasks
- Free version: GPT-3.5 (good but older)
- Paid version: GPT-4o (much better, worth it)
- Best for: everyday QA writing tasks

**Claude (Anthropic)**
- Great for: reading large documents, codebases, nuanced writing
- Handles very long context (200k tokens — entire test suites)
- Best for: understanding large codebases, long documentation

**GitHub Copilot**
- Lives inside your IDE (VS Code, JetBrains)
- Autocompletes code as you type
- Best for: writing Playwright/TypeScript test code faster

**Cursor**
- AI-powered code editor
- Can edit multiple files at once based on your instructions
- Best for: refactoring test frameworks, adding new pages to POM

---

### Choose the Right Tool

| Task | Best Tool |
|------|-----------|
| Writing test cases from user stories | ChatGPT / Claude |
| Autocompleting Playwright scripts | GitHub Copilot |
| Understanding a large codebase | Claude |
| Generating test data | ChatGPT |
| Writing tests from a screenshot | GPT-4o / Claude |
| Refactoring a test framework | Cursor |

---

### The Free Tier Strategy

You don't need to pay for everything on day one:

1. **Start free:** ChatGPT free tier covers most basic tasks
2. **Upgrade one tool:** GitHub Copilot ($10/month) gives the biggest daily ROI for automation engineers
3. **Add Claude free:** Great for reading long documents and understanding code
4. **Go premium when you're ready:** ChatGPT Plus ($20/month) for complex tasks

---

### The Most Important Lesson

The tool matters less than **the skill of the person using it**.

A great prompt on the free tier often beats a lazy prompt on the paid tier.

---

### Adding Gemini to Your Toolkit

**Gemini (Google)**
- Built into Google Workspace (Docs, Gmail, Sheets) — if your company uses Google, you already have access
- Great for: summarising long documents, drafting in Google Docs, analysing data in Sheets
- Gemini Advanced (paid): comparable to GPT-4o for general tasks

| Task | Best Tool |
|------|-----------|
| Writing test cases from user stories | ChatGPT / Claude |
| Autocompleting Playwright scripts (inline) | GitHub Copilot |
| Asking questions about your codebase | GitHub Copilot Chat |
| Understanding a large codebase | Claude |
| Drafting test plans in Google Docs | Gemini |
| Generating test data | ChatGPT |

---

### Copilot Chat vs Copilot Inline — What's the Difference?

Many beginners install Copilot and only use one mode without realising there are two:

**Copilot Inline (autocomplete)**
- Appears as grey "ghost text" as you type
- Press Tab to accept, Escape to dismiss
- Best for: completing repetitive test steps, selector patterns, assertion lines

**Copilot Chat (conversation)**
- A chat panel inside VS Code (Ctrl+Shift+I)
- You ask questions, explain what you need, paste errors
- Best for: "Explain this function", "Fix this failing test", "Add POM structure to this script"

Use **both** — inline for speed while coding, Chat for understanding and refactoring.
        `,
      },
      {
        id: 'ai-reading-code',
        title: 'Module 9: Using AI to Understand Code You\'ve Never Seen',
        analogy: "Joining a new project with an existing codebase is like being handed a 500-page instruction manual in a foreign language. AI is the translator that reads it for you and explains what actually matters.",
        lessonMarkdown: `
### The Problem Every QA Engineer Faces

*💡 Analogy: Joining a new project is like being handed a 500-page instruction manual in a foreign language. AI is the translator — it reads it for you and explains what matters in plain English.*

As a QA engineer, you constantly encounter code written by others:
- Complex functions you need to test but don't fully understand
- New projects with thousands of lines of code
- Pull request diffs before a release
- Backend logic that determines what to test

AI turns code comprehension from hours into minutes.

---

### Prompt 1 — Explain this function in plain English

\`\`\`
Here is a JavaScript function from our codebase.
Please explain:
1. What it does in simple English (no jargon)
2. What inputs it expects and what it returns
3. Any potential bugs or edge cases you can see
4. What test cases I should write to test it properly

[paste the function here]
\`\`\`

---

### Prompt 2 — What could go wrong?

\`\`\`
Look at this code and answer: "What could break in production?"
Focus on: null/undefined errors, race conditions, incorrect assumptions,
missing error handling, and security issues.

[paste code here]
\`\`\`

---

### Prompt 3 — Find what to test in a PR diff

\`\`\`
Here is a git diff from a pull request.
List the test cases I should write or update based on these changes.
Flag anything that looks risky from a QA perspective.

[paste the diff here]
\`\`\`

---

### Prompt 4 — Make legacy code readable

\`\`\`
This is legacy code with no comments. Please:
1. Add inline comments explaining what each section does
2. Rename any unclear variable names to something readable
3. Flag any parts that look dangerous or outdated
\`\`\`

---

### Real Scenario

A developer says: *"The payment calculation function changed in this PR."*

You paste the diff into Claude and ask: *"What changed and what should I retest?"*

In 10 seconds you have:
- A plain English explanation of what changed
- A list of affected test scenarios
- Any risky patterns spotted

That's an hour of reading condensed into 10 seconds.
        `,
      },
      {
        id: 'ai-limitations',
        title: 'Module 10: When NOT to Trust AI — Hallucinations & Blind Spots',
        analogy: "AI is like a brilliant colleague who sometimes makes things up and says them with complete confidence. You'd never submit their work without checking it first. Same rule applies to AI output — always verify before you ship.",
        lessonMarkdown: `
### The Golden Rule

*💡 Analogy: AI is like a brilliant colleague who sometimes makes things up and states them with total confidence. You'd never submit their work without checking it. Same rule: AI is your first draft, not your final answer.*

---

### The 5 Types of AI Mistakes

**1. Hallucinated APIs**

AI invents function names, library methods, or npm packages that don't exist.

> *Example: AI writes* \`playwright.waitForNetworkIdle()\` *which doesn't exist in that form in modern Playwright.*

**Fix:** Always run AI-generated code before trusting it. Check the official docs.

---

**2. Outdated Information**

AI has a **training cutoff date**. It doesn't know about:
- Features released after its training
- Security patches
- Framework version changes

> *Example: AI might suggest Playwright v1.20 syntax when you're using v1.45.*

**Fix:** Always check the version number. Ask AI: *"Is this still correct in [version]?"*

---

**3. Confident Wrongness**

AI doesn't say "I'm not sure." It answers with the same confident tone whether it's right or wrong.

**Fix:** Verify any specific fact, number, or claim that matters.

---

**4. Missing Edge Cases**

AI tends to give you happy path tests unless you explicitly ask for edge cases.

**Fix:** Always follow up with: *"What edge cases and failure scenarios are missing from this list?"*

---

**5. Context Blindness**

AI doesn't know your specific system, your internal APIs, your company rules, or your production quirks.

> *Example: AI generates a test that checks for an error message your app doesn't actually show.*

**Fix:** Give AI your specific context. Paste real field names, real URLs, real error messages.

---

### When NOT to Paste Things into AI

⚠️ **Never paste:**
- Real customer data (PII — names, emails, addresses)
- Production passwords or API keys
- Internal confidential business information
- GDPR-regulated data

Some AI tools (ChatGPT, Claude web) may use your input to improve their models. Always use the **API mode** or **enterprise version** for sensitive work.

---

### The Checklist Before Trusting AI Output

- [ ] Did I run the code and check it works?
- [ ] Did I verify against the official documentation?
- [ ] Did I check the version is still current?
- [ ] Did I add domain-specific context AI wouldn't know?
- [ ] Did I follow up asking for edge cases?

If you tick all five — you're using AI properly.

---

### Safe vs Unsafe — The Full Checklist

Print this and keep it at your desk. When in doubt, check it.

**✅ SAFE to paste into public AI tools:**
- User stories and requirements (with no internal code names / pricing)
- Sample code with no real credentials
- Playwright / test scripts using mock data
- Generic bug descriptions (no customer names)
- Public API documentation
- Anonymised log files

**⚠️ THINK BEFORE YOU PASTE:**
- Internal architecture diagrams
- Unreleased product features
- Internal pricing or business strategy
- Employee details

**❌ NEVER paste into public AI tools:**
- Real customer names, emails, addresses, phone numbers (PII)
- Passwords, API keys, tokens, secrets
- Database connection strings
- Medical or financial records
- Confidential legal or HR documents
- Production data of any kind

**The safe alternative:**
If you need AI help with something sensitive — replace real values with placeholders before pasting:
\`\`\`
// Instead of pasting: user.email = "john.smith@realcompany.com"
// Paste this:        user.email = "testuser@example.com"
\`\`\`
Same problem, zero risk.
        `,
      },
      {
        id: 'ai-test-planning',
        title: 'Module 11: AI for Test Planning — PRD to Test Plan in Minutes',
        analogy: "Writing a test plan from a PRD used to be like building a house from an architect's sketches — hours of translating someone else's vision into your own structure. AI is like a contractor who reads the sketches and hands you a ready-to-review build plan in 5 minutes.",
        lessonMarkdown: `
### What is a Test Plan?

*💡 Analogy: A test plan is like a travel itinerary. Before a big trip, you don't just show up at the airport — you plan destinations, routes, budget, and what to do if things go wrong. A test plan does the same for a release.*

A **test plan** typically covers:
- What features are in scope
- What types of testing will be done
- What environments and tools will be used
- Entry and exit criteria
- Risks and mitigation

Writing one from scratch takes hours. With AI, it takes minutes.

---

### Prompt: PRD → Test Plan

\`\`\`
You are a senior QA lead. I am going to paste a Product Requirements Document (PRD).
Based on it, create a test plan that includes:

1. Scope (what features are in/out of scope for testing)
2. Test types needed (functional, regression, performance, security, etc.)
3. Key risk areas and what could go wrong
4. Test environments required
5. Entry criteria (what must be true before testing starts)
6. Exit criteria (what must be true before testing ends)
7. A priority-ordered list of the top 10 test scenarios to cover first

Keep it concise — a working document, not an essay.

PRD: [paste your PRD here]
\`\`\`

---

### Prompt: User Story → Mini Test Plan

When you don't have a full PRD — just a sprint ticket:

\`\`\`
Here is a user story from our sprint:
[paste ticket]

Create a mini test plan with:
- Test objectives (what are we trying to prove?)
- In-scope and out-of-scope scenarios
- Test data requirements
- Dependencies or blockers to test this
- The 5 highest-risk test cases to run first
\`\`\`

---

### Prompt: Risk-Based Test Planning

When time is short and you can't test everything:

\`\`\`
Here are the features being released this sprint:
[list features]

We have 4 hours of testing time before release.
Using risk-based testing principles, tell me:
1. Which features carry the highest risk if broken?
2. What are the 15 most critical test cases to run in 4 hours?
3. What can safely be deferred to post-release testing?
\`\`\`

---

### How to Review an AI-Generated Test Plan

AI test plans are excellent first drafts. Before using one, check:

- ✅ Does it match the actual scope of the sprint?
- ✅ Are the risk areas relevant to your domain?
- ✅ Are entry/exit criteria realistic for your team?
- ✅ Has AI missed any known legacy issues?
- ✅ Is the priority order reasonable?

Add your domain knowledge on top — that's what makes it yours.
        `,
      },
      {
        id: 'ai-verify-output',
        title: 'Module 12: How to Verify AI Output — Never Trust Blindly',
        analogy: "A junior colleague hands you their work and says 'it's done.' You wouldn't submit it without reading it. AI is the same — confident, capable, and occasionally completely wrong. Verification is not optional.",
        lessonMarkdown: `
### Why Verification is a Skill

*💡 Analogy: A junior colleague hands you work and says "it's done." You don't submit it without reading it. AI is that junior colleague — capable, fast, and occasionally confident about something completely wrong.*

Knowing how to verify AI output is just as important as knowing how to prompt it. This module gives you a systematic approach.

---

### Verifying AI-Generated Code

AI writes code that *looks* correct but may have subtle bugs. Here is the verification workflow:

**Step 1 — Read it first**
Before running anything, read the code. Does it make logical sense? Are there function names you don't recognise?

**Step 2 — Check function names against official docs**
AI frequently invents plausible-sounding method names. If you see a function you haven't used before, look it up.
\`\`\`
// AI generated this — does waitForNetworkIdle() actually exist?
await page.waitForNetworkIdle();
// → Check: https://playwright.dev/docs/api/class-page
\`\`\`

**Step 3 — Run it in isolation first**
Don't add AI code straight into your main test suite. Run it standalone first. A small, isolated test reveals issues fast.

**Step 4 — Check the version**
\`\`\`
// Ask AI: "Is this syntax still correct in Playwright v1.45?"
// Or check: what version does my package.json say?
\`\`\`

---

### Verifying AI-Generated Test Cases

Test cases can look thorough but have hidden gaps:

| Check | What to look for |
|-------|-----------------|
| **Specificity** | Are steps generic ("click login") or precise ("click button with id='submit'")? |
| **Expected results** | Is each expected result clearly defined, or vague ("works correctly")? |
| **Domain knowledge** | Does AI know your system's specific error messages and behaviour? |
| **Edge cases** | Did AI only cover happy path? Ask: "What's missing?" |
| **Duplicates** | AI sometimes generates the same test case twice with slightly different wording |

---

### Verifying AI-Generated Facts

If AI states a fact (a number, a date, a specification):

1. **Don't trust it** if it's critical
2. Ask AI: *"How confident are you in this? When was this information last accurate?"*
3. Verify against the primary source (official docs, changelog, spec)

---

### The 2-Minute Verification Checklist

Before using any AI output:

- [ ] Read it — does it make logical sense?
- [ ] Run code in isolation before adding to the suite
- [ ] Verify any method/function names against official docs
- [ ] Check version compatibility
- [ ] Confirm domain-specific details are correct for YOUR system
- [ ] Ask "What's missing?" for test cases
- [ ] No real data or secrets were included in what you're about to use

This takes 2 minutes. Skipping it can cost you hours of debugging.
        `,
      },
      {
        id: 'ai-iterative-prompting',
        title: 'Module 13: Iterative Prompting — Getting Better Answers in the Same Chat',
        analogy: "Using AI is like sculpting. You don't carve the final statue in one strike. You start with a rough block, then refine — chip away here, smooth there, add detail. Each message in a chat is a chisel stroke that brings the output closer to perfect.",
        lessonMarkdown: `
### The Biggest Mistake Beginners Make

*💡 Analogy: Sculpting a statue. You don't carve the final version in one strike. You start rough, then refine. Each follow-up message is a chisel stroke closer to perfect.*

Most beginners send one prompt, get an OK answer, and stop. Then they switch to a new chat for the next task — losing all context.

**The better approach:** Stay in the same conversation and refine iteratively.

---

### The 4 Refinement Moves

**Move 1 — Ask for more**
\`\`\`
That's good. Now add 5 more edge cases specifically around
network timeouts and session expiry.
\`\`\`

**Move 2 — Ask to change format**
\`\`\`
Reformat the test cases as a Gherkin feature file.
Keep all the same scenarios.
\`\`\`

**Move 3 — Ask AI to self-critique**
\`\`\`
Review your own answer. What important scenarios are missing?
What assumptions did you make that might be wrong?
\`\`\`

**Move 4 — Ask to go deeper on one item**
\`\`\`
Expand test case #7 into a full step-by-step test script
with exact locators and assertions.
\`\`\`

---

### When to Start a New Chat vs Continue

| Situation | Action |
|-----------|--------|
| Refining the same output | Stay in the same chat — AI has full context |
| Adding detail to existing work | Stay in the same chat |
| Completely new topic / new feature | Start a new chat — cleaner context |
| Previous chat has become very long | Start fresh and paste only the relevant context |
| AI seems "confused" or off-track | Start fresh — long chats can cause AI to drift |

---

### The "Improve Your Own Answer" Technique

This is one of the most powerful prompts in a QA toolkit:

\`\`\`
Look at the test cases you just wrote.
Act as a critical QA reviewer.
Identify: 3 scenarios that are too vague, 3 that are missing,
and 2 that are duplicates. Then rewrite the improved version.
\`\`\`

AI is genuinely good at critiquing its own output when asked directly. This technique consistently produces better results than re-prompting from scratch.

---

### Building a Reusable Context Block

For daily use, keep a short "context block" that you paste at the start of any new chat:

\`\`\`
Context for all my prompts:
- I am a QA engineer testing a React + Node.js e-commerce platform
- We use Playwright + TypeScript for automation
- Our test cases are stored in Jira (Gherkin format)
- Our API uses REST with JWT authentication
- Always format test cases as Gherkin unless I ask otherwise
\`\`\`

Paste this once at the start → AI stays in the right context for the entire session.
        `,
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
