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
    // ── BEGINNER ────────────────────────────────────────────────
    {
      level: 'what-is-testing',
      questions: [
        {
          question: 'Your team just shipped a brand-new checkout feature. A developer says "It compiled with zero errors, so it must be working." What is wrong with this reasoning?',
          options: [
            { id: 'a', text: 'Nothing — if code compiles, it works correctly.', isCorrect: false },
            { id: 'b', text: 'Compilation only checks syntax, not whether the feature behaves the way users expect it to.', isCorrect: true },
            { id: 'c', text: 'Developers should never test their own code.', isCorrect: false },
            { id: 'd', text: 'The tester should have compiled it first.', isCorrect: false }
          ],
          explanation: 'A compiler checks grammar — not logic. A car engine that starts does not mean it will reach your destination. Testing checks real-world behavior, not just code structure.'
        },
        {
          question: 'Software testing was famously defined as "executing a program with the intent of finding errors." Who said this?',
          options: [
            { id: 'a', text: 'Bill Gates', isCorrect: false },
            { id: 'b', text: 'Edsger Dijkstra', isCorrect: false },
            { id: 'c', text: 'Glenford Myers', isCorrect: true },
            { id: 'd', text: 'Kent Beck', isCorrect: false }
          ],
          explanation: 'Glenford Myers wrote "The Art of Software Testing" in 1979. His key insight: testing is a destructive activity — your goal is to FIND errors, not to prove the software works.'
        },
        {
          question: 'An e-commerce site shows items in stock, but when a user clicks "Buy Now" the order fails silently with no error message. Which testing principle does this scenario most directly violate?',
          options: [
            { id: 'a', text: 'Testing shows absence of defects.', isCorrect: false },
            { id: 'b', text: 'Exhaustive testing is impossible.', isCorrect: false },
            { id: 'c', text: 'Early testing saves time and money.', isCorrect: false },
            { id: 'd', text: 'Testing shows the presence of defects — silent failures are unfound bugs.', isCorrect: true }
          ],
          explanation: 'Testing can prove defects exist but can never prove 100% correctness. A silent failure is a found defect waiting to be discovered — ideally by testers, not real customers.'
        },
        {
          question: 'Why is it generally NOT possible to test every possible combination of inputs for a web form?',
          options: [
            { id: 'a', text: 'Because the test environment is too slow.', isCorrect: false },
            { id: 'b', text: 'Because the number of possible inputs is practically infinite, making exhaustive testing impossible.', isCorrect: true },
            { id: 'c', text: 'Because only automation can do that.', isCorrect: false },
            { id: 'd', text: 'Because forms only accept 10 inputs.', isCorrect: false }
          ],
          explanation: 'A single text field accepting up to 100 characters has more possible combinations than atoms in the observable universe. This is why techniques like Equivalence Partitioning exist — to test smartly, not exhaustively.'
        },
        {
          question: 'A bug is found in production that costs $50,000 to fix. The same bug was visible in the design document phase. If caught then, it would have cost $500 to fix. What principle does this illustrate?',
          options: [
            { id: 'a', text: 'The Pareto Principle (80/20 rule).', isCorrect: false },
            { id: 'b', text: 'The Pesticide Paradox.', isCorrect: false },
            { id: 'c', text: 'The Rule of Ten — defects cost 10x more to fix at each later stage.', isCorrect: true },
            { id: 'd', text: 'Regression testing failure.', isCorrect: false }
          ],
          explanation: 'This is the "Early Testing Saves Money" principle. Every stage you let a bug pass through multiplies the cost to fix it. Finding it at design: $500. In production: $50,000+.'
        }
      ]
    },
    {
      level: 'types-of-testing',
      questions: [
        {
          question: 'You are testing a login button. You click it and verify the user lands on the dashboard. Which type of testing is this?',
          options: [
            { id: 'a', text: 'Unit Testing', isCorrect: false },
            { id: 'b', text: 'Functional Testing', isCorrect: true },
            { id: 'c', text: 'Performance Testing', isCorrect: false },
            { id: 'd', text: 'Security Testing', isCorrect: false }
          ],
          explanation: 'Functional testing checks what the system does — does it perform the correct function? Clicking login and landing on the dashboard is a functional check.'
        },
        {
          question: 'Your app loads correctly but takes 12 seconds to display a product list. What type of testing should be used to catch this?',
          options: [
            { id: 'a', text: 'Regression Testing', isCorrect: false },
            { id: 'b', text: 'Usability Testing', isCorrect: false },
            { id: 'c', text: 'Performance Testing', isCorrect: true },
            { id: 'd', text: 'Smoke Testing', isCorrect: false }
          ],
          explanation: 'Performance testing measures speed, response times, and scalability. A 12-second load time is a performance defect, not a functional one — the data shows, it just shows slowly.'
        },
        {
          question: 'A developer fixes a bug on the "Forgot Password" page. Before releasing, you run tests on ALL features of the app to make sure nothing else broke. What is this called?',
          options: [
            { id: 'a', text: 'Smoke Testing', isCorrect: false },
            { id: 'b', text: 'Regression Testing', isCorrect: true },
            { id: 'c', text: 'Exploratory Testing', isCorrect: false },
            { id: 'd', text: 'Unit Testing', isCorrect: false }
          ],
          explanation: 'Regression testing re-runs existing tests after a change to ensure nothing else broke. Like checking the whole car after replacing one tyre.'
        },
        {
          question: 'You want a quick check — "Is the build even stable enough to test in detail?" You run 10 critical tests in 5 minutes. What type of testing is this?',
          options: [
            { id: 'a', text: 'Sanity Testing', isCorrect: false },
            { id: 'b', text: 'Smoke Testing', isCorrect: true },
            { id: 'c', text: 'System Testing', isCorrect: false },
            { id: 'd', text: 'Acceptance Testing', isCorrect: false }
          ],
          explanation: 'Smoke testing is a quick broad check — "does the app even turn on?" Like checking if there is smoke coming from an engine before driving it. If smoke tests fail, you reject the build immediately.'
        },
        {
          question: 'The client wants to verify that the delivered software meets their business requirements before signing off. What type of testing is this?',
          options: [
            { id: 'a', text: 'Integration Testing', isCorrect: false },
            { id: 'b', text: 'System Testing', isCorrect: false },
            { id: 'c', text: 'User Acceptance Testing (UAT)', isCorrect: true },
            { id: 'd', text: 'Alpha Testing', isCorrect: false }
          ],
          explanation: 'UAT is done by the actual client or business stakeholders to confirm the software does what they asked for in plain business language — not just technical terms.'
        }
      ]
    },
    {
      level: 'writing-test-cases',
      questions: [
        {
          question: 'Which of the following is the BEST-written test case for a login feature?',
          options: [
            { id: 'a', text: 'Test the login.', isCorrect: false },
            { id: 'b', text: 'Enter valid email and password → Click Login → Verify dashboard page loads with user\'s name displayed.', isCorrect: true },
            { id: 'c', text: 'Login should work.', isCorrect: false },
            { id: 'd', text: 'Check if user can log in and stuff.', isCorrect: false }
          ],
          explanation: 'A good test case has a precise action (Enter X, Click Y) and a measurable expected result (Dashboard loads with username). Vague test cases are worthless — anyone should be able to execute them without asking questions.'
        },
        {
          question: 'A test case has the step: "Enter a valid email." A new tester is confused — what counts as a valid email? This is a problem with which aspect of the test case?',
          options: [
            { id: 'a', text: 'Test priority', isCorrect: false },
            { id: 'b', text: 'Test Data — the test case is missing specific, concrete test data.', isCorrect: true },
            { id: 'c', text: 'Expected result', isCorrect: false },
            { id: 'd', text: 'Module coverage', isCorrect: false }
          ],
          explanation: 'Test data must be explicit. Instead of "valid email," write "user@example.com". This makes tests reproducible by anyone on the team.'
        },
        {
          question: 'You have 500 test cases and only 2 days. Which field in a test case tells you which tests to run first?',
          options: [
            { id: 'a', text: 'Test Case ID', isCorrect: false },
            { id: 'b', text: 'Expected Result', isCorrect: false },
            { id: 'c', text: 'Priority', isCorrect: true },
            { id: 'd', text: 'Author', isCorrect: false }
          ],
          explanation: 'Priority (High/Medium/Low) tells the team which tests must run even under time pressure. A payment checkout is Priority 1; changing a profile avatar is Priority 3.'
        },
        {
          question: 'What is the purpose of a "Precondition" in a test case?',
          options: [
            { id: 'a', text: 'To describe what the test checks.', isCorrect: false },
            { id: 'b', text: 'To list the exact steps of the test.', isCorrect: false },
            { id: 'c', text: 'To describe the state the system must be in BEFORE the test steps begin.', isCorrect: true },
            { id: 'd', text: 'To write the expected result.', isCorrect: false }
          ],
          explanation: 'Example precondition: "User must be registered and logged out." If the precondition is not met, the test result is meaningless. Like needing bread before testing a sandwich recipe.'
        },
        {
          question: 'A test case passes today but fails next week because a developer changed the app. The test steps were fine — no one updated the test. What should you do to prevent this?',
          options: [
            { id: 'a', text: 'Delete the old test case.', isCorrect: false },
            { id: 'b', text: 'Maintain and review test cases after every sprint or release.', isCorrect: true },
            { id: 'c', text: 'Blame the developer.', isCorrect: false },
            { id: 'd', text: 'Mark it as passed anyway.', isCorrect: false }
          ],
          explanation: 'Test cases are living documents. They must be updated when features change. Outdated test cases give false confidence and are worse than no tests at all.'
        }
      ]
    },
    {
      level: 'happy-path',
      questions: [
        {
          question: 'You are testing an online order form. What is the "happy path" scenario?',
          options: [
            { id: 'a', text: 'A user submits the form with an expired credit card.', isCorrect: false },
            { id: 'b', text: 'A user fills in all required fields correctly and successfully places an order.', isCorrect: true },
            { id: 'c', text: 'A user leaves all fields empty and clicks Submit.', isCorrect: false },
            { id: 'd', text: 'A user opens the form on a very slow connection.', isCorrect: false }
          ],
          explanation: 'The happy path is the most common, ideal user flow with valid data and no errors. It is the first thing you test — if this is broken, nothing else matters.'
        },
        {
          question: 'Why should happy path testing be done BEFORE negative or edge-case testing?',
          options: [
            { id: 'a', text: 'Because edge cases are not important.', isCorrect: false },
            { id: 'b', text: 'Because if the main flow is broken, testing edge cases is a waste of time.', isCorrect: true },
            { id: 'c', text: 'Because happy path tests are faster.', isCorrect: false },
            { id: 'd', text: 'Because developers prefer it.', isCorrect: false }
          ],
          explanation: 'Think of it like building a house. You test the walls before testing the windows. If the walls fall, the windows do not matter. Verify the core flow works before poking at edges.'
        },
        {
          question: 'You tested the happy path of a signup form and it works. A colleague asks "Can we skip all other testing now?" What do you say?',
          options: [
            { id: 'a', text: 'Yes — if the happy path works, the rest usually does too.', isCorrect: false },
            { id: 'b', text: 'No — happy path only confirms the best-case scenario. Real users make mistakes, and the app must handle them.', isCorrect: true },
            { id: 'c', text: 'Yes — negative testing is only done in the final sprint.', isCorrect: false },
            { id: 'd', text: 'Only skip integration tests.', isCorrect: false }
          ],
          explanation: 'Happy path = minimum bar. Real bugs often hide in the unusual paths: typos, missing fields, slow internet, browser back buttons, and double-clicks.'
        },
        {
          question: 'Which scenario is NOT a happy path test for a search feature?',
          options: [
            { id: 'a', text: 'Searching for "laptop" and seeing a list of laptops.', isCorrect: false },
            { id: 'b', text: 'Searching for "!!@@##" and seeing a user-friendly error message.', isCorrect: true },
            { id: 'c', text: 'Searching for "phone" and clicking the first result.', isCorrect: false },
            { id: 'd', text: 'Searching for "shoes" and applying a price filter.', isCorrect: false }
          ],
          explanation: '"!!@@##" is special characters — that is a negative/edge test. Happy path uses realistic, valid inputs that a normal user would type.'
        },
        {
          question: 'A tester says "I only test happy paths because I don\'t want to find bugs." What is wrong with this attitude?',
          options: [
            { id: 'a', text: 'Nothing — happy path covers 90% of scenarios.', isCorrect: false },
            { id: 'b', text: 'The purpose of testing IS to find bugs. Avoiding negative tests means real users will find the bugs instead.', isCorrect: true },
            { id: 'c', text: 'Happy path testing is wrong.', isCorrect: false },
            { id: 'd', text: 'Negative tests are the developer\'s job.', isCorrect: false }
          ],
          explanation: 'Glenford Myers said it best: testing is the act of executing software with the INTENT of finding errors. A tester who avoids finding bugs is not testing — they are performing theatre.'
        }
      ]
    },
    {
      level: 'negative-testing',
      questions: [
        {
          question: 'A registration form requires a phone number. What is a correct negative test for this field?',
          options: [
            { id: 'a', text: 'Enter "+1 (555) 123-4567" and verify it is accepted.', isCorrect: false },
            { id: 'b', text: 'Enter "ABCDEFGHIJ" (letters) and verify the system shows a validation error.', isCorrect: true },
            { id: 'c', text: 'Enter "9876543210" and verify it is accepted.', isCorrect: false },
            { id: 'd', text: 'Leave the field blank and verify it is optional.', isCorrect: false }
          ],
          explanation: 'Negative testing means sending INVALID input. Letters in a phone field should trigger a validation error — not crash the app and definitely not silently accept the data.'
        },
        {
          question: 'An app accepts passwords of 8 to 20 characters. Which of the following is a negative test?',
          options: [
            { id: 'a', text: 'Entering "MyPass123" (9 chars).', isCorrect: false },
            { id: 'b', text: 'Entering "Hi" (2 chars) and expecting the app to show an error.', isCorrect: true },
            { id: 'c', text: 'Entering "SecurePassword1" (14 chars).', isCorrect: false },
            { id: 'd', text: 'Entering a 20-character password.', isCorrect: false }
          ],
          explanation: '"Hi" is only 2 characters — below the minimum of 8. The system MUST reject it with a clear message. Accepting it would be a critical security bug.'
        },
        {
          question: 'You enter a negative number (-5) into a "Quantity" field on a shopping cart. The app shows -5 items in the cart and subtracts money from the total. What type of bug is this?',
          options: [
            { id: 'a', text: 'A cosmetic bug.', isCorrect: false },
            { id: 'b', text: 'A critical functional bug found by negative testing.', isCorrect: true },
            { id: 'c', text: 'A performance bug.', isCorrect: false },
            { id: 'd', text: 'Not a bug — this is expected.', isCorrect: false }
          ],
          explanation: 'This is a classic negative test result! The system should validate that quantity must be ≥ 1. Accepting -5 could let users get money from the company. Real bugs, real money lost.'
        },
        {
          question: 'What is the key difference between negative testing and boundary value analysis?',
          options: [
            { id: 'a', text: 'They are the same thing.', isCorrect: false },
            { id: 'b', text: 'Negative testing focuses on invalid/unexpected inputs broadly. BVA specifically targets the edges of valid ranges.', isCorrect: true },
            { id: 'c', text: 'Negative testing is always automated.', isCorrect: false },
            { id: 'd', text: 'BVA only tests text fields.', isCorrect: false }
          ],
          explanation: 'Negative testing is broad: wrong type, empty fields, SQL injection. BVA is precision: testing exactly at the boundaries (e.g., if max is 100, test 100, 101, 99). They complement each other.'
        },
        {
          question: 'Why should negative tests also verify the ERROR MESSAGE, not just that the app rejected the input?',
          options: [
            { id: 'a', text: 'Because error messages are not important.', isCorrect: false },
            { id: 'b', text: 'Because a vague or missing error message leaves users confused and is itself a defect.', isCorrect: true },
            { id: 'c', text: 'Because developers write error messages last.', isCorrect: false },
            { id: 'd', text: 'Error messages should not be tested.', isCorrect: false }
          ],
          explanation: 'An app that rejects input silently is broken. "Something went wrong" is not helpful. A good error message says WHAT is wrong: "Phone number must be 10 digits." Testing this IS testing.'
        }
      ]
    },
    {
      level: 'exploratory-testing',
      questions: [
        {
          question: 'You are handed a brand-new e-commerce app with no test cases written yet. What is the BEST approach for the first session?',
          options: [
            { id: 'a', text: 'Wait until the test cases are written before touching the app.', isCorrect: false },
            { id: 'b', text: 'Run exploratory testing — learn the app by clicking around and note anything suspicious.', isCorrect: true },
            { id: 'c', text: 'Immediately run automated regression tests.', isCorrect: false },
            { id: 'd', text: 'Report that you cannot test without scripts.', isCorrect: false }
          ],
          explanation: 'Exploratory testing shines when little is documented. You simultaneously learn, design, and execute tests. It is structured chaos — guided by your experience and curiosity, not a script.'
        },
        {
          question: 'What is a "Test Charter" in exploratory testing?',
          options: [
            { id: 'a', text: 'A fully scripted test case with step-by-step instructions.', isCorrect: false },
            { id: 'b', text: 'A brief mission statement: "Explore [area] to find [type of issue]" that focuses your session without scripting every step.', isCorrect: true },
            { id: 'c', text: 'A legal document the tester must sign.', isCorrect: false },
            { id: 'd', text: 'A list of all bugs found.', isCorrect: false }
          ],
          explanation: 'Example charter: "Explore the checkout flow to find data loss bugs." It gives focus without killing creativity. You still decide HOW to test within that mission.'
        },
        {
          question: 'A tester says exploratory testing is "just clicking around randomly." Is this accurate?',
          options: [
            { id: 'a', text: 'Yes — it is completely unstructured.', isCorrect: false },
            { id: 'b', text: 'No — it is guided by skill, experience, and a defined charter/session goal.', isCorrect: true },
            { id: 'c', text: 'Yes — but only senior testers can do it.', isCorrect: false },
            { id: 'd', text: 'Yes — and that is why it finds the most bugs.', isCorrect: false }
          ],
          explanation: 'Good exploratory testing is disciplined curiosity, not chaos. A skilled tester uses heuristics, past experience, and risk thinking to guide where they probe. It looks casual — it is not.'
        },
        {
          question: 'Which situation is BEST suited for exploratory testing over scripted testing?',
          options: [
            { id: 'a', text: 'Running 500 regression tests before a major release.', isCorrect: false },
            { id: 'b', text: 'Testing a new feature with no specification and a tight deadline.', isCorrect: true },
            { id: 'c', text: 'Confirming a payment flow works exactly as documented.', isCorrect: false },
            { id: 'd', text: 'Verifying compliance with a 40-page security standard.', isCorrect: false }
          ],
          explanation: 'Exploratory testing is fastest when specs are thin or absent. Where scripted testing requires weeks of planning, exploratory delivers feedback in hours. It is ideal for sprints and new features.'
        },
        {
          question: 'After an exploratory session, a good tester should do what?',
          options: [
            { id: 'a', text: 'Nothing — the bugs are in the system already.', isCorrect: false },
            { id: 'b', text: 'Write session notes: areas covered, bugs found, risks noticed, and areas not explored.', isCorrect: true },
            { id: 'c', text: 'Immediately start the next session.', isCorrect: false },
            { id: 'd', text: 'Delete their notes to stay agile.', isCorrect: false }
          ],
          explanation: 'Exploratory testing is not exempt from documentation. Session notes create a coverage map, turn findings into formal bugs, and let the next tester pick up where you left off.'
        }
      ]
    },
    {
      level: 'bug-life-cycle',
      questions: [
        {
          question: 'A tester logs a new bug. What is the FIRST status the bug should receive?',
          options: [
            { id: 'a', text: 'Open', isCorrect: false },
            { id: 'b', text: 'New', isCorrect: true },
            { id: 'c', text: 'In Progress', isCorrect: false },
            { id: 'd', text: 'Resolved', isCorrect: false }
          ],
          explanation: 'When a bug is first raised, it enters the "New" status. It then gets reviewed — if valid and reproducible, it moves to "Open" (assigned to a developer). New → Open → In Progress → Fixed → Verified → Closed.'
        },
        {
          question: 'A developer fixes a bug and marks it "Resolved." What should the tester do next?',
          options: [
            { id: 'a', text: 'Mark it closed immediately.', isCorrect: false },
            { id: 'b', text: 'Re-test the fix and verify the bug is actually gone, then move it to "Closed."', isCorrect: true },
            { id: 'c', text: 'Assign it to another developer.', isCorrect: false },
            { id: 'd', text: 'Nothing — the developer marked it resolved.', isCorrect: false }
          ],
          explanation: 'Testers always verify fixes before closing bugs. A "Resolved" status from a developer means "I think I fixed it." The tester must confirm. If still broken, it is reopened.'
        },
        {
          question: 'A bug is raised for the login page. The product owner reviews it and says "This is a feature, not a bug — it was designed this way." What status should the bug receive?',
          options: [
            { id: 'a', text: 'Closed', isCorrect: false },
            { id: 'b', text: 'Deferred', isCorrect: false },
            { id: 'c', text: 'Rejected / Not a Bug', isCorrect: true },
            { id: 'd', text: 'Reopened', isCorrect: false }
          ],
          explanation: 'When a "bug" is actually intended behavior, it is rejected or marked "Not a Bug." This is common — testers catch unintended behaviors that the PM then clarifies were intentional design choices.'
        },
        {
          question: 'A major bug is found but the release is in 2 days and there is not enough time to fix it safely. What status is appropriate?',
          options: [
            { id: 'a', text: 'Closed', isCorrect: false },
            { id: 'b', text: 'Deferred — it is acknowledged but postponed to the next release.', isCorrect: true },
            { id: 'c', text: 'Rejected', isCorrect: false },
            { id: 'd', text: 'Duplicate', isCorrect: false }
          ],
          explanation: 'Deferred means: "We know this is a real bug, but we are intentionally postponing the fix." This must be a conscious business decision, not just ignoring the bug.'
        },
        {
          question: 'A tester verifies a bug fix and it seems fixed. But two weeks later, the same bug appears again after a new code change. What should the tester do?',
          options: [
            { id: 'a', text: 'Open a brand new bug ticket.', isCorrect: false },
            { id: 'b', text: 'Reopen the original bug ticket with details about when it regressed.', isCorrect: true },
            { id: 'c', text: 'Mark it as a duplicate.', isCorrect: false },
            { id: 'd', text: 'Ignore it — it was fixed once already.', isCorrect: false }
          ],
          explanation: 'Reopening a bug means the fix broke again (regression). This is a key sign that automated regression tests should cover this scenario so it never slips through again.'
        }
      ]
    },
    {
      level: 'severity-vs-priority',
      questions: [
        {
          question: 'The app\'s logo is missing on the homepage just before a major product launch. The logo itself has no functional impact. How would you classify this?',
          options: [
            { id: 'a', text: 'High Severity, High Priority', isCorrect: false },
            { id: 'b', text: 'Low Severity, High Priority', isCorrect: true },
            { id: 'c', text: 'High Severity, Low Priority', isCorrect: false },
            { id: 'd', text: 'Low Severity, Low Priority', isCorrect: false }
          ],
          explanation: 'The logo not showing does NOT break functionality (Low Severity). But it is embarrassing before a launch, so the business deems it urgent (High Priority). Severity = technical impact. Priority = business urgency.'
        },
        {
          question: 'The payment processing system is completely broken — no one can check out. But the site launches in 6 months. How would you classify this?',
          options: [
            { id: 'a', text: 'Low Severity, High Priority', isCorrect: false },
            { id: 'b', text: 'High Severity, Low Priority', isCorrect: true },
            { id: 'c', text: 'High Severity, High Priority', isCorrect: false },
            { id: 'd', text: 'Low Severity, Low Priority', isCorrect: false }
          ],
          explanation: 'Broken payments = High Severity (critical system failure). But since launch is 6 months away, the business priority to fix it RIGHT NOW is lower. High Severity does NOT always mean High Priority.'
        },
        {
          question: 'Who determines PRIORITY of a bug?',
          options: [
            { id: 'a', text: 'The QA Engineer who found it.', isCorrect: false },
            { id: 'b', text: 'The Product Owner or Business Stakeholder.', isCorrect: true },
            { id: 'c', text: 'The Developer who fixes it.', isCorrect: false },
            { id: 'd', text: 'The automated test suite.', isCorrect: false }
          ],
          explanation: 'Priority is a BUSINESS decision — it is about what to fix first based on business needs. Severity is a TECHNICAL assessment of how badly the bug impacts the system, done by QA.'
        },
        {
          question: 'Who determines SEVERITY of a bug?',
          options: [
            { id: 'a', text: 'The Product Owner.', isCorrect: false },
            { id: 'b', text: 'The QA Tester, based on technical impact on the system.', isCorrect: true },
            { id: 'c', text: 'The end user.', isCorrect: false },
            { id: 'd', text: 'The client.', isCorrect: false }
          ],
          explanation: 'Severity is a technical measure: does it crash the app (Critical), block a major function (Major), cause minor issues (Minor), or just look wrong (Cosmetic)? QA engineers assess this based on system behavior.'
        },
        {
          question: 'A spelling mistake appears in a footnote of the Terms & Conditions page of a banking app. The legal team says this MUST be fixed before release. What is the correct classification?',
          options: [
            { id: 'a', text: 'High Severity, High Priority', isCorrect: false },
            { id: 'b', text: 'Low Severity, High Priority', isCorrect: true },
            { id: 'c', text: 'High Severity, Low Priority', isCorrect: false },
            { id: 'd', text: 'Medium Severity, Medium Priority', isCorrect: false }
          ],
          explanation: 'A typo is cosmetically wrong (Low Severity). But for a banking app with legal obligations, the business says fix it NOW (High Priority). Classic example of business context elevating priority independently of severity.'
        }
      ]
    },

    // ── INTERMEDIATE ─────────────────────────────────────────────
    {
      level: 'bva',
      questions: [
        {
          question: 'A form accepts ages between 18 and 65. Using Boundary Value Analysis, which set of test values is MOST complete?',
          options: [
            { id: 'a', text: '18, 40, 65', isCorrect: false },
            { id: 'b', text: '17, 18, 19, 64, 65, 66', isCorrect: true },
            { id: 'c', text: '0, 18, 65, 100', isCorrect: false },
            { id: 'd', text: '18, 65', isCorrect: false }
          ],
          explanation: 'BVA tests: just below lower bound (17), at lower bound (18), just above lower bound (19), just below upper bound (64), at upper bound (65), just above upper bound (66). Errors almost always happen at the edges, not the middle.'
        },
        {
          question: 'A login attempt limit is set to 3. After 3 failed attempts, the account locks. What boundary values should you test?',
          options: [
            { id: 'a', text: '1, 2, 3', isCorrect: false },
            { id: 'b', text: '2, 3, 4', isCorrect: true },
            { id: 'c', text: '0, 3, 10', isCorrect: false },
            { id: 'd', text: 'Just 3', isCorrect: false }
          ],
          explanation: 'The critical boundary is at 3. Test 2 (should not lock), 3 (should lock), and 4 (confirm it stays locked). The bug is usually "off by one" — locking at 2 or NOT locking at 3.'
        },
        {
          question: 'Why does Boundary Value Analysis focus on the MIN and MAX values, rather than random middle values?',
          options: [
            { id: 'a', text: 'Because middle values are boring to test.', isCorrect: false },
            { id: 'b', text: 'Because developers write boundary-handling code separately and it is historically where "off by one" errors occur.', isCorrect: true },
            { id: 'c', text: 'Because it is faster.', isCorrect: false },
            { id: 'd', text: 'Because only the boundaries matter to users.', isCorrect: false }
          ],
          explanation: 'The infamous "off by one" error (< vs <=) is the most common programming mistake. BVA was invented specifically because boundary conditions are where code logic most often breaks.'
        },
        {
          question: 'A text field accepts 5 to 15 characters. A tester only tests with 10 characters. What is wrong with this approach?',
          options: [
            { id: 'a', text: 'Nothing — 10 is a valid value.', isCorrect: false },
            { id: 'b', text: 'Testing only the middle skips the boundaries where bugs are most likely to be found.', isCorrect: true },
            { id: 'c', text: 'The field should be tested with more values.', isCorrect: false },
            { id: 'd', text: 'A single test is sufficient.', isCorrect: false }
          ],
          explanation: '10 characters is valid but tells you nothing about the edge cases. You MUST test 4, 5, 6, 14, 15, 16 to verify the validation logic around the boundaries.'
        },
        {
          question: 'BVA and Equivalence Partitioning are often used together. What does each technique contribute?',
          options: [
            { id: 'a', text: 'EP divides inputs into groups. BVA then tests the edges of those groups for precision.', isCorrect: true },
            { id: 'b', text: 'BVA divides inputs into groups. EP tests the edges.', isCorrect: false },
            { id: 'c', text: 'They are identical techniques.', isCorrect: false },
            { id: 'd', text: 'EP is for performance. BVA is for security.', isCorrect: false }
          ],
          explanation: 'EP says "valid ages are 18-65, invalid are <18 and >65." BVA then says "test 17, 18, 19 and 64, 65, 66 specifically." Together they give maximum coverage with minimum tests.'
        }
      ]
    },
    {
      level: 'equivalence-partitioning',
      questions: [
        {
          question: 'A ticket-booking app charges different prices: Child (0-12), Teen (13-17), Adult (18-59), Senior (60+). Using EP, how many partitions are there?',
          options: [
            { id: 'a', text: '2 (valid and invalid).', isCorrect: false },
            { id: 'b', text: '4 (one for each age group).', isCorrect: true },
            { id: 'c', text: '100 (one for each age from 0 to 100).', isCorrect: false },
            { id: 'd', text: '3 (child, adult, senior).', isCorrect: false }
          ],
          explanation: 'Each age group is handled differently by the system, so each is a separate equivalence class. Testing one value from each class (e.g., age 5, 15, 30, 70) is sufficient — you do not need to test every age.'
        },
        {
          question: 'Why is it sufficient to test only ONE value from each equivalence partition?',
          options: [
            { id: 'a', text: 'Because it is faster and managers prefer it.', isCorrect: false },
            { id: 'b', text: 'Because all values in a partition are expected to be processed identically by the system.', isCorrect: true },
            { id: 'c', text: 'Because the other values are tested automatically.', isCorrect: false },
            { id: 'd', text: 'Because testers are lazy.', isCorrect: false }
          ],
          explanation: 'If entering age 20, 25, or 35 all result in the "Adult" price, testing all 3 is redundant. Testing one from the group proves the whole group\'s behavior. This is the efficiency of EP.'
        },
        {
          question: 'A form field accepts only uppercase letters (A-Z). A user types "hello123". Which partition does this fall into?',
          options: [
            { id: 'a', text: 'Valid partition', isCorrect: false },
            { id: 'b', text: 'Invalid partition', isCorrect: true },
            { id: 'c', text: 'Boundary partition', isCorrect: false },
            { id: 'd', text: 'Null partition', isCorrect: false }
          ],
          explanation: '"hello123" contains lowercase letters and numbers — both invalid. It belongs in the invalid partition. The system should reject it with an error message.'
        },
        {
          question: 'For an email field, which is an example of a VALID equivalence class?',
          options: [
            { id: 'a', text: 'Strings with no @ symbol.', isCorrect: false },
            { id: 'b', text: 'Strings in the format name@domain.com.', isCorrect: true },
            { id: 'c', text: 'Empty strings.', isCorrect: false },
            { id: 'd', text: 'Strings with two @ symbols.', isCorrect: false }
          ],
          explanation: 'The valid partition for email is "correctly formatted email address." All values in this partition (user@test.com, alice@company.org) should be accepted. Everything else is in invalid partitions.'
        },
        {
          question: 'A tester tests the value 50 for an age field that accepts 18-65. They then also test 30, 40, and 55. What mistake are they making?',
          options: [
            { id: 'a', text: 'No mistake — more values is always better.', isCorrect: false },
            { id: 'b', text: 'Redundant testing within the same valid partition — wasting time that could be spent on boundary or negative tests.', isCorrect: true },
            { id: 'c', text: 'They should test 25 instead.', isCorrect: false },
            { id: 'd', text: 'The age field does not need to be tested.', isCorrect: false }
          ],
          explanation: '30, 40, 50, and 55 are all in the same "valid adult" partition. Testing all of them tells you nothing extra. Use EP to test smart: one from each partition, then use BVA for the edges.'
        }
      ]
    },
    {
      level: 'state-transition',
      questions: [
        {
          question: 'An ATM card starts as "Active." After 3 wrong PINs, it becomes "Blocked." After bank unblocking, it returns to "Active." If you try to withdraw money while "Blocked," what SHOULD happen?',
          options: [
            { id: 'a', text: 'The withdrawal should succeed.', isCorrect: false },
            { id: 'b', text: 'The withdrawal should be rejected with a "Card Blocked" message.', isCorrect: true },
            { id: 'c', text: 'The card should be destroyed.', isCorrect: false },
            { id: 'd', text: 'The ATM should crash.', isCorrect: false }
          ],
          explanation: 'This is state transition testing. A Blocked card must REJECT transactions — that is its only valid behavior in that state. Testing invalid actions from a state reveals missing guard logic.'
        },
        {
          question: 'An order can transition: New → Processing → Shipped → Delivered. What should happen if you try to move an order directly from "New" to "Delivered" skipping steps?',
          options: [
            { id: 'a', text: 'The system should allow it for VIP customers.', isCorrect: false },
            { id: 'b', text: 'The system should reject invalid transitions not in the state diagram.', isCorrect: true },
            { id: 'c', text: 'The system should auto-process all skipped steps.', isCorrect: false },
            { id: 'd', text: 'It should crash.', isCorrect: false }
          ],
          explanation: 'State machines have defined valid transitions. Jumping from New to Delivered skips business-critical steps (payment, shipping). The system must reject this as an invalid state change.'
        },
        {
          question: 'What is a "State Transition Diagram" used for?',
          options: [
            { id: 'a', text: 'Drawing UI wireframes.', isCorrect: false },
            { id: 'b', text: 'Visually mapping all possible states of an object and the valid transitions between them.', isCorrect: true },
            { id: 'c', text: 'Planning database migrations.', isCorrect: false },
            { id: 'd', text: 'Showing how users navigate a website.', isCorrect: false }
          ],
          explanation: 'A state diagram is a visual map of every possible state an object can be in (Active, Blocked, Expired) and every allowed action (Enter PIN, Block, Unblock) that moves it between states.'
        },
        {
          question: 'A user account can be: Unverified → Verified → Suspended → Deleted. Can a Deleted account be Unsuspended?',
          options: [
            { id: 'a', text: 'Yes, any state can transition to any other state.', isCorrect: false },
            { id: 'b', text: 'No — "Deleted" is a terminal state. Testing this invalid transition should result in an error.', isCorrect: true },
            { id: 'c', text: 'Yes, as long as an admin does it.', isCorrect: false },
            { id: 'd', text: 'Only if the account was deleted in the last 30 days.', isCorrect: false }
          ],
          explanation: 'Terminal states have no outgoing transitions. Testing that you CANNOT perform actions on a Deleted account is as important as testing valid actions. This is a "negative transition" test.'
        },
        {
          question: 'How many tests are needed to achieve 100% transition coverage for a system with 3 states and 4 valid transitions?',
          options: [
            { id: 'a', text: '3 tests (one per state).', isCorrect: false },
            { id: 'b', text: '4 tests (one per transition).', isCorrect: true },
            { id: 'c', text: '12 tests (states × transitions).', isCorrect: false },
            { id: 'd', text: '1 test (happy path only).', isCorrect: false }
          ],
          explanation: 'Transition coverage requires one test per valid transition — so 4 tests for 4 transitions. This ensures every valid path between states is exercised at least once.'
        }
      ]
    },
    {
      level: 'test-planning',
      questions: [
        {
          question: 'What is the PRIMARY purpose of a Test Plan?',
          options: [
            { id: 'a', text: 'To list all bugs found in the current sprint.', isCorrect: false },
            { id: 'b', text: 'To document the scope, approach, resources, and schedule for testing activities.', isCorrect: true },
            { id: 'c', text: 'To automate test execution.', isCorrect: false },
            { id: 'd', text: 'To replace test cases.', isCorrect: false }
          ],
          explanation: 'A Test Plan is the strategy document. It answers: WHAT are we testing, HOW will we test it, WHO will test it, WHEN will it be done, and what are the ENTRY/EXIT criteria. It is the roadmap for the entire testing effort.'
        },
        {
          question: 'What is an Entry Criterion in a test plan?',
          options: [
            { id: 'a', text: 'The condition that must be met BEFORE testing can officially begin.', isCorrect: true },
            { id: 'b', text: 'The list of bugs that are acceptable to ship with.', isCorrect: false },
            { id: 'c', text: 'The final sign-off from the client.', isCorrect: false },
            { id: 'd', text: 'The condition that ends testing.', isCorrect: false }
          ],
          explanation: 'Entry criteria prevent wasted effort. Examples: "The build must pass smoke tests," "All critical features must be code-complete." Testing on a broken build wastes everyone\'s time.'
        },
        {
          question: 'The test plan says the exit criterion is "All P1 bugs are fixed and 95% of test cases pass." The team has 94% pass rate but all P1 bugs are fixed. What should happen?',
          options: [
            { id: 'a', text: 'Release immediately — all P1 bugs are gone.', isCorrect: false },
            { id: 'b', text: 'Hold the release — exit criteria are not met until BOTH conditions are satisfied.', isCorrect: true },
            { id: 'c', text: 'Ask the developer to quickly pass the remaining tests.', isCorrect: false },
            { id: 'd', text: 'Ignore the test plan.', isCorrect: false }
          ],
          explanation: 'Exit criteria must ALL be met. The test plan defines "done" — bypassing one criterion because another is met makes the plan meaningless. Raise the risk to the PM for a conscious decision.'
        },
        {
          question: 'A new feature is descoped from the release mid-sprint. What must the QA lead update?',
          options: [
            { id: 'a', text: 'Nothing — the existing test plan covers it.', isCorrect: false },
            { id: 'b', text: 'The test plan scope to reflect the change, and remove related test cases from the execution cycle.', isCorrect: true },
            { id: 'c', text: 'Only the bug tracker.', isCorrect: false },
            { id: 'd', text: 'The developer\'s code.', isCorrect: false }
          ],
          explanation: 'Test plans are living documents. When scope changes, the plan must be updated. Running tests for a descoped feature wastes time and creates false failure metrics.'
        },
        {
          question: 'What is "Test Estimation" in a test plan and why does it matter?',
          options: [
            { id: 'a', text: 'Guessing how many bugs there will be.', isCorrect: false },
            { id: 'b', text: 'Predicting the time, resources, and effort needed for testing, so the project timeline is realistic.', isCorrect: true },
            { id: 'c', text: 'Estimating the cost of the app.', isCorrect: false },
            { id: 'd', text: 'Estimating how many test cases are needed.', isCorrect: false }
          ],
          explanation: 'Without estimation, teams under- or over-allocate QA resources. Techniques like Work Breakdown Structure, historical data, or 3-point estimation help QA leads forecast effort and justify sprint capacity to management.'
        }
      ]
    },
    {
      level: 'defect-reporting',
      questions: [
        {
          question: 'A tester writes: "The login is broken." A developer cannot reproduce it. What is wrong with this defect report?',
          options: [
            { id: 'a', text: 'Nothing — it is clear enough.', isCorrect: false },
            { id: 'b', text: 'It lacks Steps to Reproduce, actual result, expected result, environment, and test data.', isCorrect: true },
            { id: 'c', text: 'The tester should have attached a video.', isCorrect: false },
            { id: 'd', text: 'The developer should try harder.', isCorrect: false }
          ],
          explanation: 'A good defect report has: Title, Steps to Reproduce (numbered), Actual Result, Expected Result, Severity/Priority, Environment (browser, OS, version), and test data used. Reproducible = fixable. Vague = ignored.'
        },
        {
          question: 'Which is the BEST defect title for a bug where clicking "Save" on the profile page shows a blank error?',
          options: [
            { id: 'a', text: 'Save button broken.', isCorrect: false },
            { id: 'b', text: 'Profile page > Save button > Shows blank error message instead of confirmation after valid save.', isCorrect: true },
            { id: 'c', text: 'Bug on profile.', isCorrect: false },
            { id: 'd', text: 'Error appears when saving.', isCorrect: false }
          ],
          explanation: 'A good title = Location + Action + Wrong Result. Specific titles allow developers to find the issue without opening it, prioritise it quickly, and identify duplicates at a glance.'
        },
        {
          question: 'Why is "Steps to Reproduce" the most critical section of a defect report?',
          options: [
            { id: 'a', text: 'Because it tells the developer what technology was used.', isCorrect: false },
            { id: 'b', text: 'Because a bug that cannot be reproduced cannot be fixed — clear steps let the developer see it themselves.', isCorrect: true },
            { id: 'c', text: 'Because it is required by the project manager.', isCorrect: false },
            { id: 'd', text: 'Because it helps the tester remember what they did.', isCorrect: false }
          ],
          explanation: 'If a dev cannot reproduce the bug, it may be closed as "Cannot Reproduce." Precise steps (including test data, user role, and environment) make bugs undeniable and unfixable excuses disappear.'
        },
        {
          question: 'A defect report says: "Actual: User receives a 500 error. Expected: User sees a success toast." What is this comparing?',
          options: [
            { id: 'a', text: 'The test case versus the bug.', isCorrect: false },
            { id: 'b', text: 'What the system DID versus what the requirements say it SHOULD do.', isCorrect: true },
            { id: 'c', text: 'Two different bugs.', isCorrect: false },
            { id: 'd', text: 'Two browser behaviours.', isCorrect: false }
          ],
          explanation: 'Actual vs Expected is the heart of a defect report. Actual = reality. Expected = the requirement or specification. The gap between them IS the bug. This makes defects objective, not opinions.'
        },
        {
          question: 'You find a bug that only occurs in Internet Explorer 11 but not Chrome, Firefox, or Edge. What should you include in the defect report?',
          options: [
            { id: 'a', text: 'Nothing extra — all bugs are the same.', isCorrect: false },
            { id: 'b', text: 'Browser and OS details in the Environment section, and note it is IE11-specific.', isCorrect: true },
            { id: 'c', text: 'Suggest dropping IE11 support.', isCorrect: false },
            { id: 'd', text: 'Log it as a low severity automatically.', isCorrect: false }
          ],
          explanation: 'Environment details (Browser, Version, OS, Device) are essential for browser-specific bugs. The developer needs this to set up the same conditions. Without it, they may not reproduce the bug at all.'
        }
      ]
    },
    {
      level: 'regression-testing',
      questions: [
        {
          question: 'A developer fixes a bug in the "Add to Cart" feature. Before release, what does regression testing verify?',
          options: [
            { id: 'a', text: 'Only that the Add to Cart bug is fixed.', isCorrect: false },
            { id: 'b', text: 'That the fix did not break any other existing features of the application.', isCorrect: true },
            { id: 'c', text: 'That the code is clean.', isCorrect: false },
            { id: 'd', text: 'That the developer wrote unit tests.', isCorrect: false }
          ],
          explanation: 'Regression testing checks that a change — any change — did not introduce new bugs. Like patching a pipe and checking no other pipe is now leaking. The fix is assumed correct; regression verifies the surroundings.'
        },
        {
          question: 'Why is automation especially valuable for regression testing?',
          options: [
            { id: 'a', text: 'Because automated tests are always more thorough than manual ones.', isCorrect: false },
            { id: 'b', text: 'Because regression suites are run repeatedly after every change — automation makes this fast and consistent without exhausting human testers.', isCorrect: true },
            { id: 'c', text: 'Because it is cheaper to set up automation.', isCorrect: false },
            { id: 'd', text: 'Because manual regression is impossible.', isCorrect: false }
          ],
          explanation: 'Running 500 regression tests manually after every sprint would take weeks. Automation runs the same tests in minutes. Consistency, speed, and freedom from human error make automation perfect for regression suites.'
        },
        {
          question: 'What is "Partial Regression" or "Selective Regression"?',
          options: [
            { id: 'a', text: 'Running only the tests for the new feature added.', isCorrect: false },
            { id: 'b', text: 'Running a targeted subset of regression tests related to areas affected by the change.', isCorrect: true },
            { id: 'c', text: 'Skipping regression because the change was minor.', isCorrect: false },
            { id: 'd', text: 'Automating only the regression tests that fail.', isCorrect: false }
          ],
          explanation: 'When only one module was changed, running the full 1,000-test regression suite is overkill. Selective regression targets the impacted areas first, saving time while managing risk smartly.'
        },
        {
          question: 'After a hotfix deployed on Friday evening, the team skips regression testing due to time pressure. On Monday, users report that login is now broken. What went wrong?',
          options: [
            { id: 'a', text: 'The login was already broken before the hotfix.', isCorrect: false },
            { id: 'b', text: 'The hotfix introduced a regression — skipping regression testing missed a change-induced break.', isCorrect: true },
            { id: 'c', text: 'The developers should not deploy on Fridays.', isCorrect: false },
            { id: 'd', text: 'Users were not using the correct login details.', isCorrect: false }
          ],
          explanation: 'This is the classic regression failure story. Every code change carries risk. The "it\'s just a small hotfix" excuse is a trap. A 1-line change can break unrelated systems through hidden dependencies.'
        },
        {
          question: 'What is the key difference between Regression Testing and Re-testing?',
          options: [
            { id: 'a', text: 'They are the same thing.', isCorrect: false },
            { id: 'b', text: 'Re-testing verifies a specific bug fix. Regression testing ensures the fix did not break other things.', isCorrect: true },
            { id: 'c', text: 'Regression testing only applies to UI features.', isCorrect: false },
            { id: 'd', text: 'Re-testing is automated; regression is manual.', isCorrect: false }
          ],
          explanation: 'Re-testing = did we fix THAT specific bug? Regression = did fixing THAT bug break SOMETHING ELSE? Both are always done after a fix — one is focused, one is broad.'
        }
      ]
    },

    // ── EXPERT ───────────────────────────────────────────────────
    {
      level: 'risk-based-testing',
      questions: [
        {
          question: 'You have 3 days left and 200 test cases. The payment system, profile photo upload, and dark mode toggle are all untested. Which do you test first using risk-based testing?',
          options: [
            { id: 'a', text: 'Dark mode toggle — it affects all users visually.', isCorrect: false },
            { id: 'b', text: 'Payment system — highest business impact and likelihood of critical bugs.', isCorrect: true },
            { id: 'c', text: 'Profile photo — users update it frequently.', isCorrect: false },
            { id: 'd', text: 'All three equally.', isCorrect: false }
          ],
          explanation: 'Risk = Likelihood × Impact. A broken payment system = lost revenue and trust (catastrophic impact). A broken dark mode = minor annoyance (low impact). Risk-based testing allocates limited time to the areas that matter most.'
        },
        {
          question: 'How do you calculate the risk level of a feature to decide testing priority?',
          options: [
            { id: 'a', text: 'Risk = Code Complexity + Developer Mood.', isCorrect: false },
            { id: 'b', text: 'Risk = Probability of Failure × Impact of Failure.', isCorrect: true },
            { id: 'c', text: 'Risk = Number of bugs found in the last release.', isCorrect: false },
            { id: 'd', text: 'Risk = Feature size in lines of code.', isCorrect: false }
          ],
          explanation: 'This is the core formula. A feature that rarely fails but causes total system shutdown when it does = High Risk. A feature that fails often but only shows a cosmetic glitch = Low Risk. Multiply probability × impact to rank your risks.'
        },
        {
          question: 'A team is skipping regression tests on the authentication module because "it hasn\'t changed in 6 months." From a risk-based perspective, why is this dangerous?',
          options: [
            { id: 'a', text: 'Because authentication is complex code.', isCorrect: false },
            { id: 'b', text: 'Because authentication failure = complete system lockout, making impact HIGH regardless of likelihood.', isCorrect: true },
            { id: 'c', text: 'Because no code should be untested.', isCorrect: false },
            { id: 'd', text: 'It is not dangerous — old code is stable code.', isCorrect: false }
          ],
          explanation: 'Risk-based testing considers IMPACT even when probability is low. Authentication = the front door. Even a 1% chance of a break is catastrophic. High-impact areas must always be included in risk analysis.'
        },
        {
          question: 'Risk-based testing means you might INTENTIONALLY skip some tests. When is this acceptable?',
          options: [
            { id: 'a', text: 'Never — all tests must be run before release.', isCorrect: false },
            { id: 'b', text: 'When skipping low-risk, low-impact tests is a conscious, documented decision agreed to by stakeholders.', isCorrect: true },
            { id: 'c', text: 'When the team is running behind schedule — just skip anything.', isCorrect: false },
            { id: 'd', text: 'When the developer says it is fine.', isCorrect: false }
          ],
          explanation: 'Skipping tests is NOT lazy testing — it is SMART resource allocation, but only when the decision is deliberate, transparent, and documented. Stakeholders must understand and accept the residual risk.'
        },
        {
          question: 'A newly hired developer just rewrote the user authentication system from scratch. Without risk analysis, which testing approach makes most sense?',
          options: [
            { id: 'a', text: 'Test the newest UI screens — they are freshest in the developer\'s mind.', isCorrect: false },
            { id: 'b', text: 'Focus heavy testing on authentication — new code in critical areas has high defect likelihood AND high impact.', isCorrect: true },
            { id: 'c', text: 'Run only the happy path for authentication.', isCorrect: false },
            { id: 'd', text: 'Trust the developer — they are experienced.', isCorrect: false }
          ],
          explanation: 'New code + critical function = maximum risk. Rewrites often introduce new bugs even in previously stable systems. This is textbook "high probability × high impact" — your risk matrix should light up red here.'
        }
      ]
    },
    {
      level: 'state-dependency',
      questions: [
        {
          question: 'A user adds items to their cart in Tab A. They open Tab B, add different items, and checkout. Tab A still shows the original items. When they checkout from Tab A, what might go wrong?',
          options: [
            { id: 'a', text: 'Nothing — each tab is independent.', isCorrect: false },
            { id: 'b', text: 'Tab A might checkout with stale data, causing a duplicate or incorrect order.', isCorrect: true },
            { id: 'c', text: 'The browser will sync both tabs automatically.', isCorrect: false },
            { id: 'd', text: 'The checkout will fail with an error.', isCorrect: false }
          ],
          explanation: 'This is a classic state dependency bug. Tab A holds a stale snapshot of state. When it submits, the server may process outdated data — leading to duplicate charges, wrong quantities, or phantom inventory updates.'
        },
        {
          question: 'How can a tester reproduce a state dependency bug in a banking app?',
          options: [
            { id: 'a', text: 'Log in and transfer money normally.', isCorrect: false },
            { id: 'b', text: 'Open two browser sessions simultaneously and make conflicting updates to the same account.', isCorrect: true },
            { id: 'c', text: 'Enter an invalid account number.', isCorrect: false },
            { id: 'd', text: 'Refresh the page during a transfer.', isCorrect: false }
          ],
          explanation: 'State dependency bugs require concurrent actions. Open two sessions: change the account balance in one, then initiate a transaction in the other. The system may use the pre-change balance, causing an incorrect result.'
        },
        {
          question: 'What does "stale state" mean in the context of a web application?',
          options: [
            { id: 'a', text: 'The app has not been updated in a long time.', isCorrect: false },
            { id: 'b', text: 'The UI or client is displaying data that is outdated compared to the current server state.', isCorrect: true },
            { id: 'c', text: 'The database has old records.', isCorrect: false },
            { id: 'd', text: 'The session cookie has expired.', isCorrect: false }
          ],
          explanation: 'Stale state = the frontend shows "old news." The server moved on, but the client did not refresh. This is like looking at yesterday\'s stock prices to make today\'s trades.'
        },
        {
          question: 'An admin dashboard shows 100 active users. While viewing it, 20 users log out on their phones. The dashboard still shows 100. What is this called and how should it be handled?',
          options: [
            { id: 'a', text: 'A security breach — lock down the dashboard.', isCorrect: false },
            { id: 'b', text: 'A stale state bug — the dashboard needs real-time updates or a manual refresh mechanism.', isCorrect: true },
            { id: 'c', text: 'Normal behaviour for dashboards.', isCorrect: false },
            { id: 'd', text: 'A network issue on the user\'s devices.', isCorrect: false }
          ],
          explanation: 'This is expected in polling-based UIs, but critical dashboards should use WebSockets or auto-refresh to stay current. From a testing standpoint, verify what happens when the admin acts on stale data (e.g., sends a message to an already-logged-out user).'
        },
        {
          question: 'A tester refreshes a page mid-session and loses all their unsaved form data. Is this a bug?',
          options: [
            { id: 'a', text: 'No — this is expected browser behaviour.', isCorrect: false },
            { id: 'b', text: 'It depends — if UX requires preserving state on refresh, the app should save to localStorage or warn the user before refresh.', isCorrect: true },
            { id: 'c', text: 'Yes — always a critical bug.', isCorrect: false },
            { id: 'd', text: 'No — users should not refresh during forms.', isCorrect: false }
          ],
          explanation: 'State persistence requirements depend on the spec. Multi-step wizards and long forms should typically preserve state across accidental refreshes. If the spec says "auto-save draft," losing data on refresh IS a bug.'
        }
      ]
    },
    {
      level: 'race-conditions',
      questions: [
        {
          question: 'Two users click "Book the last seat" on a concert ticket app at the exact same time. Both get a success message, but only one seat exists. What is this?',
          options: [
            { id: 'a', text: 'A UI bug.', isCorrect: false },
            { id: 'b', text: 'A race condition — two concurrent requests beat the system\'s stock check before it could update.', isCorrect: true },
            { id: 'c', text: 'A network error.', isCorrect: false },
            { id: 'd', text: 'A database backup failure.', isCorrect: false }
          ],
          explanation: 'Race conditions occur when two operations run so close together that they both read the "1 seat available" state before either has a chance to set it to 0. The fix is database-level locking or atomic operations.'
        },
        {
          question: 'How would a QA tester manually attempt to trigger a race condition on a "Claim Promo Code" feature?',
          options: [
            { id: 'a', text: 'Enter an invalid promo code.', isCorrect: false },
            { id: 'b', text: 'Use two browser sessions to click "Claim" simultaneously and verify only one succeeds.', isCorrect: true },
            { id: 'c', text: 'Test on a slow network.', isCorrect: false },
            { id: 'd', text: 'Wait for the code to expire.', isCorrect: false }
          ],
          explanation: 'Manual race condition testing = time your clicks to overlap. Open two incognito windows, navigate to the same promo code, count "3, 2, 1, click!" simultaneously. If both claim success, that\'s a race condition bug.'
        },
        {
          question: 'What technical mechanism do developers use to prevent race conditions in databases?',
          options: [
            { id: 'a', text: 'Faster internet connections.', isCorrect: false },
            { id: 'b', text: 'Database transactions with row-level locking or atomic operations.', isCorrect: true },
            { id: 'c', text: 'Disabling concurrent users.', isCorrect: false },
            { id: 'd', text: 'Adding a CAPTCHA before purchases.', isCorrect: false }
          ],
          explanation: 'Database locks ensure only ONE transaction can read-update-write a resource at a time. "SELECT FOR UPDATE" or pessimistic locking prevents the second request from reading stale data during the first\'s write window.'
        },
        {
          question: 'A tester finds a race condition bug but it is intermittent — it only happens 1 in 10 tries. How should this be reported?',
          options: [
            { id: 'a', text: 'Ignore it — intermittent bugs are not real bugs.', isCorrect: false },
            { id: 'b', text: 'Report it with detailed reproduction steps, frequency of occurrence, and mark it as intermittent.', isCorrect: true },
            { id: 'c', text: 'Only report it when it happens 100% of the time.', isCorrect: false },
            { id: 'd', text: 'Ask the developer to make it happen every time first.', isCorrect: false }
          ],
          explanation: 'Intermittent bugs are the hardest and most dangerous. Note: "Reproducible approximately 1 in 10 attempts by clicking simultaneously in two sessions." Include a screen recording. Intermittent race conditions in production can cause data corruption at scale.'
        },
        {
          question: 'A race condition causes a user\'s account to be debited twice when they double-click the "Pay" button. What severity is this?',
          options: [
            { id: 'a', text: 'Low — just disable the button after one click.', isCorrect: false },
            { id: 'b', text: 'Critical — financial data corruption directly harming users.', isCorrect: true },
            { id: 'c', text: 'Medium — users can contact support for a refund.', isCorrect: false },
            { id: 'd', text: 'Cosmetic — the double click is user error.', isCorrect: false }
          ],
          explanation: 'Double-charging a user is a CRITICAL defect. It causes financial harm, erodes trust, and creates legal liability. The app MUST handle rapid duplicate submissions with idempotency keys or button-disabling on first click.'
        }
      ]
    },
    {
      level: 'interrupt-testing',
      questions: [
        {
          question: 'A user is filling out a 5-step checkout form on a mobile app. They receive a phone call at step 3. After the call ends, they return to the app. What SHOULD happen?',
          options: [
            { id: 'a', text: 'The app should restart from step 1.', isCorrect: false },
            { id: 'b', text: 'The app should resume at step 3 with the data the user entered preserved.', isCorrect: true },
            { id: 'c', text: 'The app should submit the incomplete form.', isCorrect: false },
            { id: 'd', text: 'The app should show the home screen.', isCorrect: false }
          ],
          explanation: 'Interrupt testing checks that apps gracefully pause and resume. A phone call is the most common interrupt. Losing checkout progress = lost sale. The app must preserve state when moved to background.'
        },
        {
          question: 'Which of the following is NOT a type of interrupt you should test on a mobile banking app?',
          options: [
            { id: 'a', text: 'Incoming SMS notification.', isCorrect: false },
            { id: 'b', text: 'Low battery warning.', isCorrect: false },
            { id: 'c', text: 'Screen brightness change.', isCorrect: true },
            { id: 'd', text: 'Network loss mid-transaction.', isCorrect: false }
          ],
          explanation: 'Screen brightness is a display setting, not an app interrupt. Real interrupts are: calls, SMS, push notifications, low battery (may force close app), network drops, and switching apps. These all affect app state.'
        },
        {
          question: 'A user is transferring $5,000 in a banking app. Mid-transfer, their internet drops for 3 seconds. When it reconnects, the transfer shows "Pending." What should the tester verify?',
          options: [
            { id: 'a', text: 'That the app shows a loading spinner.', isCorrect: false },
            { id: 'b', text: 'That the money was not deducted before the transaction confirmed, AND that it eventually completes or clearly fails.', isCorrect: true },
            { id: 'c', text: 'That the app shows a timeout error immediately.', isCorrect: false },
            { id: 'd', text: 'That the app retries automatically 10 times.', isCorrect: false }
          ],
          explanation: 'Network interrupts during transactions are the scariest bugs. The tester must verify: no double deduction, correct final state (completed/failed/pending), and a clear user message. "Pending" forever is itself a defect.'
        },
        {
          question: 'What happens if a user presses the "Home" button mid-video-call in an app? What should interrupt testing verify?',
          options: [
            { id: 'a', text: 'The call should immediately end.', isCorrect: false },
            { id: 'b', text: 'The call should continue in the background with an audio indicator visible in the notification bar.', isCorrect: true },
            { id: 'c', text: 'The app should lock the screen.', isCorrect: false },
            { id: 'd', text: 'Nothing — this behaviour depends on the OS.', isCorrect: false }
          ],
          explanation: 'Modern apps must handle background state gracefully. Video calls use PiP (Picture-in-Picture) or background audio. Interrupt testing verifies the call does not drop, audio continues, and the user can easily return to the app.'
        },
        {
          question: 'How do you test app behaviour when the device battery reaches 5%?',
          options: [
            { id: 'a', text: 'Let the phone die and see what happens.', isCorrect: false },
            { id: 'b', text: 'Use developer tools / battery simulation to trigger low battery while the app is active and observe behaviour.', isCorrect: true },
            { id: 'c', text: 'Test it during an actual power cut.', isCorrect: false },
            { id: 'd', text: 'This is not a valid test scenario.', isCorrect: false }
          ],
          explanation: 'Android and iOS both provide developer tools to simulate battery levels. At 5%, Android OS may kill background processes. The tester verifies: does the app warn the user, save state, and resume correctly after charging?'
        }
      ]
    },
    {
      level: 'usability-testing',
      questions: [
        {
          question: 'A new user says: "I couldn\'t find the logout button — I thought I had to close the browser." This is an example of which type of defect?',
          options: [
            { id: 'a', text: 'A functional defect — the logout button does not work.', isCorrect: false },
            { id: 'b', text: 'A usability defect — the logout button exists but is not discoverable.', isCorrect: true },
            { id: 'c', text: 'A performance defect.', isCorrect: false },
            { id: 'd', text: 'A security defect.', isCorrect: false }
          ],
          explanation: 'Usability defects are about UX friction, not broken functionality. The button works — but users cannot find it. This is discoverability failure. A feature that users cannot find might as well not exist.'
        },
        {
          question: 'During usability testing, a tester is observing a user attempt to complete a task. The user is struggling. What should the tester do?',
          options: [
            { id: 'a', text: 'Immediately help them — they are frustrated.', isCorrect: false },
            { id: 'b', text: 'Stay silent and observe — their struggle is the data. Note what confused them.', isCorrect: true },
            { id: 'c', text: 'End the session early.', isCorrect: false },
            { id: 'd', text: 'Tell them the correct path.', isCorrect: false }
          ],
          explanation: 'Observing where users struggle IS the usability test. Helping them removes the data. The tester\'s job is to be a fly on the wall, noting confusion, hesitation, and wrong clicks — all of which signal UX problems.'
        },
        {
          question: 'Which heuristic from Nielsen\'s 10 Usability Heuristics is violated when an error message says "Error Code: E1045" with no further explanation?',
          options: [
            { id: 'a', text: 'Match between system and the real world.', isCorrect: false },
            { id: 'b', text: 'Help users recognize, diagnose, and recover from errors.', isCorrect: true },
            { id: 'c', text: 'Aesthetic and minimalist design.', isCorrect: false },
            { id: 'd', text: 'Consistency and standards.', isCorrect: false }
          ],
          explanation: 'Error messages should use plain language, identify the problem clearly, and suggest a solution. "E1045" tells the user nothing. "Your session expired. Please log in again." is the usability standard.'
        },
        {
          question: 'What is the key difference between usability testing and functional testing?',
          options: [
            { id: 'a', text: 'Functional testing uses real users; usability testing uses scripts.', isCorrect: false },
            { id: 'b', text: 'Functional testing checks WHAT the system does. Usability testing checks HOW WELL real users can use it.', isCorrect: true },
            { id: 'c', text: 'Usability testing is done by developers.', isCorrect: false },
            { id: 'd', text: 'They are the same thing with different names.', isCorrect: false }
          ],
          explanation: 'Functional: "Does the button submit the form?" Usability: "Can a first-time user find the button, understand it, and successfully submit without confusion?" Usability is about the human, not just the function.'
        },
        {
          question: 'A checkout flow has 7 steps: Cart, Address, Shipping, Payment, Review, Confirm, Receipt. A usability test finds 60% of users abandon at step 4. What should the team do?',
          options: [
            { id: 'a', text: 'Make step 4 load faster.', isCorrect: false },
            { id: 'b', text: 'Investigate what makes step 4 confusing or frustrating — consider reducing steps or redesigning the payment screen.', isCorrect: true },
            { id: 'c', text: 'Remove step 4 entirely.', isCorrect: false },
            { id: 'd', text: 'Add a help tooltip to every field.', isCorrect: false }
          ],
          explanation: 'High abandonment at a specific step is a critical usability signal. Investigate: Is the UI confusing? Are there too many required fields? Does it feel untrustworthy? Then redesign and A/B test the improved version.'
        }
      ]
    },
    {
      level: 'test-metrics',
      questions: [
        {
          question: 'Your team ran 200 test cases and found 40 bugs. What is the Defect Density if the application has 1,000 lines of code?',
          options: [
            { id: 'a', text: '0.02 defects per line.', isCorrect: false },
            { id: 'b', text: '0.04 defects per line of code.', isCorrect: true },
            { id: 'c', text: '40 defects per module.', isCorrect: false },
            { id: 'd', text: '200 defects per build.', isCorrect: false }
          ],
          explanation: 'Defect Density = Number of Defects / Size of software (KLOC or module). 40 / 1,000 = 0.04 defects/LOC. This metric helps identify which modules are buggiest and need more testing attention.'
        },
        {
          question: 'At the end of a sprint, the team has 180 passed, 10 failed, and 10 blocked test cases out of 200 total. What is the Test Pass Rate?',
          options: [
            { id: 'a', text: '90%', isCorrect: true },
            { id: 'b', text: '95%', isCorrect: false },
            { id: 'c', text: '100%', isCorrect: false },
            { id: 'd', text: '80%', isCorrect: false }
          ],
          explanation: 'Test Pass Rate = (Passed / Total Executed) × 100. 180/200 = 90%. Note: blocked tests are still "executed" in this context. A 90% pass rate with 10 failures still means you have 10 open bugs to investigate.'
        },
        {
          question: 'A team boasts "We found 0 bugs this sprint!" Is this always good news from a metrics perspective?',
          options: [
            { id: 'a', text: 'Yes — zero bugs means perfect quality.', isCorrect: false },
            { id: 'b', text: 'No — it could mean testing coverage was too low, the test cases were too shallow, or the team was pressured not to report bugs.', isCorrect: true },
            { id: 'c', text: 'Yes — the developers wrote great code.', isCorrect: false },
            { id: 'd', text: 'No — all apps have bugs by definition.', isCorrect: false }
          ],
          explanation: 'Zero bugs is a red flag as often as it is a celebration. Ask: What was the test coverage? Were negative tests run? Were exploratory sessions done? Metrics must be interpreted with context, not at face value.'
        },
        {
          question: 'What does "Test Coverage" measure?',
          options: [
            { id: 'a', text: 'The number of bugs found per tester.', isCorrect: false },
            { id: 'b', text: 'The percentage of requirements or code paths exercised by test cases.', isCorrect: true },
            { id: 'c', text: 'The total number of test cases written.', isCorrect: false },
            { id: 'd', text: 'The time taken to run all tests.', isCorrect: false }
          ],
          explanation: 'Coverage = what percentage of the system did we actually test? Requirement coverage: are all user stories tested? Code coverage: what percentage of code lines were executed? 100% coverage does not mean 0 bugs, but low coverage means high blind spots.'
        },
        {
          question: 'A QA manager sees the Defect Removal Efficiency (DRE) is 60% for the last release. This means 40% of bugs were found in production. What action should they take?',
          options: [
            { id: 'a', text: 'Nothing — 60% is acceptable for any project.', isCorrect: false },
            { id: 'b', text: 'Investigate gaps in testing — add more negative tests, edge cases, or automation to catch more bugs before release.', isCorrect: true },
            { id: 'c', text: 'Hire more developers to write better code.', isCorrect: false },
            { id: 'd', text: 'Remove the metrics dashboard.', isCorrect: false }
          ],
          explanation: 'DRE = (Bugs found before release / Total bugs) × 100. A DRE of 60% is poor — it means 40% of defects escaped to production where they are 10-100x more expensive to fix. The target should be 90%+. Low DRE demands immediate testing process review.'
        }
      ]
    }
  ],
  sql: [
    // ─── BEGINNER MODULE 1: What is a Database? ───────────────────────────────
    {
      level: 'sql-what-is-db',
      questions: [
        {
          question: 'A QA engineer opens the database after a new user signs up. Which of these represents a single user\'s data in a database table?',
          options: [
            { id: 'a', text: 'A column — it stores one category of information like "email" for all users.', isCorrect: false },
            { id: 'b', text: 'A row — it contains all the information (name, email, age) for one specific user.', isCorrect: true },
            { id: 'c', text: 'A table — it contains the entire user registration system.', isCorrect: false },
            { id: 'd', text: 'A primary key — it stores the password for the user.', isCorrect: false },
          ],
          explanation: 'A row is one complete record. Think of it as one filled-out form. A column is a field on that form (like "email"), and a table is the whole filing cabinet of forms.'
        },
        {
          question: 'Your team has a Users table and an Orders table. Instead of copying the user\'s full name into every order row, you store the user\'s ID. What concept is this?',
          options: [
            { id: 'a', text: 'Indexing — it speeds up data retrieval.', isCorrect: false },
            { id: 'b', text: 'Normalisation — storing data once and referencing it by ID to avoid repetition.', isCorrect: true },
            { id: 'c', text: 'Replication — copying data across servers for backup.', isCorrect: false },
            { id: 'd', text: 'Caching — storing data in memory for faster access.', isCorrect: false },
          ],
          explanation: 'Normalisation is the practice of organising data to reduce redundancy. Instead of writing "Priya Sharma" in every order row, you write user_id = 1, and Priya\'s details live once in the Users table.'
        },
        {
          question: 'A developer says "never store money as a FLOAT." As a QA engineer testing a payment feature, why does this matter?',
          options: [
            { id: 'a', text: 'FLOAT is not supported by most databases.', isCorrect: false },
            { id: 'b', text: 'FLOAT values are approximate — 19.99 might store as 19.990000000000002, causing rounding errors in totals.', isCorrect: true },
            { id: 'c', text: 'FLOAT takes up too much disk space.', isCorrect: false },
            { id: 'd', text: 'FLOAT doesn\'t support negative values needed for refunds.', isCorrect: false },
          ],
          explanation: 'Floating-point numbers are inherently imprecise. Adding 1,000 orders at FLOAT precision can produce totals that are off by a few pence — unacceptable in finance. Always use DECIMAL for money.'
        },
        {
          question: 'You are testing a "Delete Account" feature. After clicking delete, you check the database and the row is still there — but a new column "deleted_at" has a timestamp. What is this pattern called?',
          options: [
            { id: 'a', text: 'A rollback — the database undid the deletion.', isCorrect: false },
            { id: 'b', text: 'A cascade delete — the row was deleted from all related tables.', isCorrect: false },
            { id: 'c', text: 'A soft delete — the record is logically removed but physically retained for safety and compliance.', isCorrect: true },
            { id: 'd', text: 'A transaction failure — the DELETE command did not execute.', isCorrect: false },
          ],
          explanation: 'Soft delete flags a row as deleted (via a timestamp or boolean) without actually removing it. This preserves audit trails, supports account recovery, and maintains foreign key references. It\'s the responsible, production-safe approach.'
        },
        {
          question: 'Two users both named "Priya Sharma" register on an app. How does the database tell them apart without any confusion?',
          options: [
            { id: 'a', text: 'It uses the email column — no two users can have the same email.', isCorrect: false },
            { id: 'b', text: 'It uses the Primary Key — a unique, auto-generated ID assigned to every row.', isCorrect: true },
            { id: 'c', text: 'It uses the created_at timestamp — they registered at different times.', isCorrect: false },
            { id: 'd', text: 'It doesn\'t — the database stores them as one record and merges the data.', isCorrect: false },
          ],
          explanation: 'The Primary Key guarantees uniqueness. Even if two users share every other attribute, their primary key (e.g., id = 1 and id = 4729) is always different. It\'s the database\'s equivalent of an Aadhaar or passport number.'
        },
      ]
    },

    // ─── BEGINNER MODULE 2: SELECT ─────────────────────────────────────────────
    {
      level: 'sql-select',
      questions: [
        {
          question: 'You need to verify that a user\'s profile displays only their name and email — not their password hash or internal ID. Which query is correct?',
          options: [
            { id: 'a', text: 'SELECT * FROM users;', isCorrect: false },
            { id: 'b', text: 'SELECT first_name, email FROM users;', isCorrect: true },
            { id: 'c', text: 'SELECT users FROM first_name, email;', isCorrect: false },
            { id: 'd', text: 'GET first_name, email FROM users;', isCorrect: false },
          ],
          explanation: 'SELECT column1, column2 FROM table is the correct syntax. SELECT * returns everything including sensitive columns you don\'t want to expose. Always specify only what you need.'
        },
        {
          question: 'A QA engineer wants to quickly inspect the full structure and all data in a small test table. Which query is most appropriate for this exploratory check?',
          options: [
            { id: 'a', text: 'SELECT first_name FROM test_users;', isCorrect: false },
            { id: 'b', text: 'SHOW ALL test_users;', isCorrect: false },
            { id: 'c', text: 'SELECT * FROM test_users;', isCorrect: true },
            { id: 'd', text: 'DESCRIBE test_users;', isCorrect: false },
          ],
          explanation: 'SELECT * is fine for quick exploration and debugging on small tables. The caution with SELECT * applies to production queries and large tables, not one-off inspection queries during testing.'
        },
        {
          question: 'Your query returns a column named "usr_frst_nm_v2" which is unreadable. How do you display it as "name" in your results?',
          options: [
            { id: 'a', text: 'SELECT usr_frst_nm_v2 RENAME name FROM users;', isCorrect: false },
            { id: 'b', text: 'SELECT usr_frst_nm_v2 AS name FROM users;', isCorrect: true },
            { id: 'c', text: 'SELECT name = usr_frst_nm_v2 FROM users;', isCorrect: false },
            { id: 'd', text: 'ALIAS usr_frst_nm_v2 AS name IN users;', isCorrect: false },
          ],
          explanation: 'The AS keyword creates an alias — a temporary readable name for a column in your output. It doesn\'t rename the actual database column, just the label shown in the results.'
        },
        {
          question: 'You\'re testing a "Status" column that should only contain the values pending, shipped, or delivered. After a data migration, you run: SELECT DISTINCT status FROM orders; — and you see "DELIVERED" and "Shipped" in the results. What does this indicate?',
          options: [
            { id: 'a', text: 'These are valid alternative formats accepted by the system.', isCorrect: false },
            { id: 'b', text: 'Data inconsistency — the status values are not normalised (mixed case), which can break filters and reports.', isCorrect: true },
            { id: 'c', text: 'SELECT DISTINCT includes every variation as a separate unique value, which is expected.', isCorrect: false },
            { id: 'd', text: 'The DISTINCT keyword is malfunctioning.', isCorrect: false },
          ],
          explanation: 'SELECT DISTINCT removes duplicate identical values — but "delivered" and "DELIVERED" are different strings to a case-sensitive database. Mixed-case status values break WHERE clauses, break reports, and indicate the system lacks proper input normalisation.'
        },
        {
          question: 'You want to display each user\'s full name as one column. Their names are stored in first_name and last_name columns. What is the correct approach?',
          options: [
            { id: 'a', text: 'SELECT first_name + last_name AS full_name FROM users;', isCorrect: false },
            { id: 'b', text: 'SELECT CONCAT(first_name, \' \', last_name) AS full_name FROM users;', isCorrect: true },
            { id: 'c', text: 'SELECT MERGE(first_name, last_name) AS full_name FROM users;', isCorrect: false },
            { id: 'd', text: 'SELECT JOIN(first_name, last_name, \' \') AS full_name FROM users;', isCorrect: false },
          ],
          explanation: 'CONCAT() joins strings together. The \' \' in the middle adds a space between the names. PostgreSQL uses || operator instead: first_name || \' \' || last_name. This is a common QA check for how full names are displayed in the UI.'
        },
      ]
    },

    // ─── BEGINNER MODULE 3: WHERE ──────────────────────────────────────────────
    {
      level: 'sql-where',
      questions: [
        {
          question: 'After releasing a coupon feature, you suspect some orders received a negative discount, making them cheaper than they should be. Which query checks for this?',
          options: [
            { id: 'a', text: 'SELECT * FROM orders WHERE discount = 0;', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM orders WHERE discount IS NULL;', isCorrect: false },
            { id: 'c', text: 'SELECT id, discount FROM orders WHERE discount < 0;', isCorrect: true },
            { id: 'd', text: 'SELECT * FROM orders WHERE discount != positive;', isCorrect: false },
          ],
          explanation: 'WHERE discount < 0 filters for any row where the discount went negative — a clear data integrity bug. If rows are returned, the discount calculation logic has a flaw that could allow users to get paid to shop.'
        },
        {
          question: 'A tester writes: WHERE email = NULL to find users without email addresses. They get zero results, even though some users clearly have no email. What is the mistake?',
          options: [
            { id: 'a', text: 'The query should use WHERE email = \'\' instead.', isCorrect: false },
            { id: 'b', text: 'NULL cannot be compared with = because NULL = NULL evaluates to NULL, not TRUE. Use WHERE email IS NULL.', isCorrect: true },
            { id: 'c', text: 'The email column needs to be wrapped in COALESCE().', isCorrect: false },
            { id: 'd', text: 'The WHERE clause doesn\'t support NULL checks — use a subquery.', isCorrect: false },
          ],
          explanation: 'This is one of the most common SQL mistakes. NULL means "no value" — comparing it with = always yields NULL (which is falsy), never TRUE. You must use IS NULL or IS NOT NULL to check for missing values.'
        },
        {
          question: 'You want to find all users from Mumbai OR Delhi who are also over 21. Which WHERE clause is correct?',
          options: [
            { id: 'a', text: 'WHERE city = \'Mumbai\' OR city = \'Delhi\' AND age > 21', isCorrect: false },
            { id: 'b', text: 'WHERE (city = \'Mumbai\' OR city = \'Delhi\') AND age > 21', isCorrect: true },
            { id: 'c', text: 'WHERE city IN (\'Mumbai\', \'Delhi\') OR age > 21', isCorrect: false },
            { id: 'd', text: 'WHERE city = \'Mumbai, Delhi\' AND age > 21', isCorrect: false },
          ],
          explanation: 'Without brackets, AND has higher precedence than OR — so the unbracketed version would mean: "city = Mumbai OR (city = Delhi AND age > 21)". Brackets make the intent explicit and correct. Always wrap OR conditions in brackets when combining with AND.'
        },
        {
          question: 'You\'re validating a registration form. To check if any submitted emails don\'t contain an "@" symbol (invalid email format), which query works?',
          options: [
            { id: 'a', text: 'SELECT email FROM users WHERE email = \'invalid\';', isCorrect: false },
            { id: 'b', text: 'SELECT email FROM users WHERE email NOT LIKE \'%@%\';', isCorrect: true },
            { id: 'c', text: 'SELECT email FROM users WHERE email CONTAINS NO \'@\';', isCorrect: false },
            { id: 'd', text: 'SELECT email FROM users WHERE email != \'@\';', isCorrect: false },
          ],
          explanation: 'LIKE \'%@%\' matches any string that contains "@" anywhere. NOT LIKE \'%@%\' finds all emails that DON\'T contain "@" — which are definitely invalid. This is a quick data quality validation for broken email validation.'
        },
        {
          question: 'A QA engineer needs to check all orders placed between January 1 and March 31, 2024. Which WHERE clause correctly fetches this range, inclusive of both dates?',
          options: [
            { id: 'a', text: 'WHERE order_date > \'2024-01-01\' AND order_date < \'2024-03-31\'', isCorrect: false },
            { id: 'b', text: 'WHERE order_date BETWEEN \'2024-01-01\' AND \'2024-03-31\'', isCorrect: true },
            { id: 'c', text: 'WHERE order_date FROM \'2024-01-01\' TO \'2024-03-31\'', isCorrect: false },
            { id: 'd', text: 'WHERE order_date IN (\'2024-01-01\', \'2024-03-31\')', isCorrect: false },
          ],
          explanation: 'BETWEEN is inclusive on both ends — it includes Jan 1 and Mar 31. Using > and < would exclude both boundary dates. IN only matches exact listed values, not a range. BETWEEN is the cleanest and most readable option for date ranges.'
        },
      ]
    },

    // ─── BEGINNER MODULE 4: ORDER BY and LIMIT ────────────────────────────────
    {
      level: 'sql-order-limit',
      questions: [
        {
          question: 'After a new user registers, you want to verify their row was correctly created. Which query most reliably retrieves the most recently added user?',
          options: [
            { id: 'a', text: 'SELECT * FROM users WHERE id = MAX(id);', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 1;', isCorrect: true },
            { id: 'c', text: 'SELECT LAST * FROM users;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM users ORDER BY id LIMIT 1;', isCorrect: false },
          ],
          explanation: 'ORDER BY created_at DESC puts the newest rows first. LIMIT 1 takes only the top one. This is the reliable pattern for fetching the most recent record — much safer than ORDER BY id since IDs can occasionally be non-sequential.'
        },
        {
          question: 'A leaderboard shows the top 10 highest-scoring users. The developer wrote: SELECT username, score FROM users LIMIT 10. What is wrong with this query?',
          options: [
            { id: 'a', text: 'LIMIT is not supported for leaderboard queries.', isCorrect: false },
            { id: 'b', text: 'Without ORDER BY, LIMIT returns 10 random rows, not the top 10 highest scores.', isCorrect: true },
            { id: 'c', text: 'The query is missing a WHERE clause for active users.', isCorrect: false },
            { id: 'd', text: 'LIMIT 10 will crash if there are fewer than 10 users.', isCorrect: false },
          ],
          explanation: 'LIMIT without ORDER BY returns an arbitrary subset — the database returns whichever 10 rows it happens to find first. For a correct leaderboard, you need ORDER BY score DESC LIMIT 10 to guarantee you get the highest scores.'
        },
        {
          question: 'An API returns 20 articles per page. To fetch page 3 of articles (articles 41-60), what SQL is correct?',
          options: [
            { id: 'a', text: 'SELECT * FROM articles LIMIT 20 OFFSET 40;', isCorrect: true },
            { id: 'b', text: 'SELECT * FROM articles LIMIT 20 OFFSET 60;', isCorrect: false },
            { id: 'c', text: 'SELECT * FROM articles LIMIT 40 OFFSET 20;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM articles PAGE 3 LIMIT 20;', isCorrect: false },
          ],
          explanation: 'OFFSET = (page - 1) × page_size = (3-1) × 20 = 40. So LIMIT 20 OFFSET 40 skips the first 40 rows (pages 1 and 2) and returns the next 20 (page 3). This is how every paginated API or "Load More" button works.'
        },
        {
          question: 'You want to find the oldest unresolved support ticket (created first, still open). Which ORDER BY direction is correct?',
          options: [
            { id: 'a', text: 'ORDER BY created_at DESC — this gives the oldest first.', isCorrect: false },
            { id: 'b', text: 'ORDER BY created_at ASC — this gives the oldest first, as smaller (earlier) dates come first.', isCorrect: true },
            { id: 'c', text: 'ORDER BY ticket_id — IDs always reflect creation order.', isCorrect: false },
            { id: 'd', text: 'The default order is always oldest-first, so ORDER BY is not needed.', isCorrect: false },
          ],
          explanation: 'ASC (ascending) is oldest-first for dates because earlier dates are "smaller". DESC (descending) is newest-first. The default order in databases is undefined — never assume a specific order without ORDER BY.'
        },
        {
          question: 'You\'re sorting a user list by city first, then by last name within each city. Two users in Mumbai have last names "Sharma" and "Kapoor". After the query runs, which appears first?',
          options: [
            { id: 'a', text: 'Sharma — alphabetically S comes after K, so Sharma is ranked higher.', isCorrect: false },
            { id: 'b', text: 'Kapoor — alphabetically K comes before S, so Kapoor appears first when sorted ASC.', isCorrect: true },
            { id: 'c', text: 'The order within the same city is random unless a third sort column is added.', isCorrect: false },
            { id: 'd', text: 'Whichever row was inserted into the database first.', isCorrect: false },
          ],
          explanation: 'ORDER BY city ASC, last_name ASC sorts by city first, then by last_name alphabetically within each city. K comes before S in the alphabet, so Kapoor appears before Sharma. Multiple ORDER BY columns create a clear, deterministic tiebreaker.'
        },
      ]
    },

    // ─── BEGINNER MODULE 5: INSERT ─────────────────────────────────────────────
    {
      level: 'sql-insert',
      questions: [
        {
          question: 'You are setting up test data before running a test suite. Which INSERT correctly adds a test user?',
          options: [
            { id: 'a', text: 'INSERT users SET first_name=\'Test\', email=\'test@qa.com\';', isCorrect: false },
            { id: 'b', text: 'INSERT INTO users (first_name, email) VALUES (\'Test\', \'test@qa.com\');', isCorrect: true },
            { id: 'c', text: 'ADD INTO users (first_name, email) VALUES (\'Test\', \'test@qa.com\');', isCorrect: false },
            { id: 'd', text: 'INSERT (first_name, email) INTO users VALUES (\'Test\', \'test@qa.com\');', isCorrect: false },
          ],
          explanation: 'The correct syntax is INSERT INTO table_name (columns) VALUES (values). The column list and values list must match in order and count. The keyword is INSERT INTO, not just INSERT or ADD INTO.'
        },
        {
          question: 'You run an INSERT with 4 columns listed but only 3 values in the VALUES clause. What happens?',
          options: [
            { id: 'a', text: 'The database inserts NULL for the missing fourth value.', isCorrect: false },
            { id: 'b', text: 'The database throws an error: column count doesn\'t match value count.', isCorrect: true },
            { id: 'c', text: 'The database inserts 0 for the missing fourth value.', isCorrect: false },
            { id: 'd', text: 'The database inserts the row and ignores the extra column.', isCorrect: false },
          ],
          explanation: 'SQL strictly matches the column list and values list by position. A mismatch in count immediately throws an error. No guessing, no defaults — the counts must be equal.'
        },
        {
          question: 'After inserting a new order for a user in a test, how do you immediately verify it was created with the correct data?',
          options: [
            { id: 'a', text: 'Trust the INSERT — if there was no error, the data is definitely correct.', isCorrect: false },
            { id: 'b', text: 'Run SELECT * FROM orders ORDER BY created_at DESC LIMIT 1 to fetch and inspect the most recent order.', isCorrect: true },
            { id: 'c', text: 'Run VERIFY FROM orders WHERE id = LAST_INSERT();', isCorrect: false },
            { id: 'd', text: 'Check the server logs for confirmation.', isCorrect: false },
          ],
          explanation: 'Always follow an INSERT with a SELECT to verify the data. No error on INSERT only means the syntax was valid — it doesn\'t confirm the values are what you intended. SELECT ORDER BY created_at DESC LIMIT 1 gets the most recent row.'
        },
        {
          question: 'You need to insert 500 test users for a load test. Which approach is most efficient?',
          options: [
            { id: 'a', text: 'Run 500 separate INSERT statements, one per user.', isCorrect: false },
            { id: 'b', text: 'Use a single INSERT INTO table (cols) VALUES (row1), (row2), ..., (row500);', isCorrect: true },
            { id: 'c', text: 'Export a CSV and manually import it through the UI.', isCorrect: false },
            { id: 'd', text: 'Use SELECT to duplicate existing rows automatically.', isCorrect: false },
          ],
          explanation: 'Multi-row INSERT is significantly faster than individual statements because it sends one request to the database instead of 500. The syntax is: INSERT INTO table (cols) VALUES (row1), (row2), (row3)... — comma-separated rows in one statement.'
        },
        {
          question: 'A column "status" has a DEFAULT value of \'pending\' in the table definition. You INSERT a row without specifying the status column. What value does the status column contain?',
          options: [
            { id: 'a', text: 'NULL — because you didn\'t provide a value.', isCorrect: false },
            { id: 'b', text: 'An empty string \'\' — because the column was not mentioned.', isCorrect: false },
            { id: 'c', text: '\'pending\' — the database automatically uses the DEFAULT value.', isCorrect: true },
            { id: 'd', text: 'An error is thrown — all columns must be specified in an INSERT.', isCorrect: false },
          ],
          explanation: 'When a column has a DEFAULT value defined in the schema, omitting it from an INSERT causes the database to automatically use that default. This is how created_at timestamps auto-populate, and how status defaults to \'pending\' for new orders.'
        },
      ]
    },

    // ─── BEGINNER MODULE 6: UPDATE and DELETE ─────────────────────────────────
    {
      level: 'sql-update-delete',
      questions: [
        {
          question: 'A developer runs: UPDATE users SET status = \'suspended\'; — without a WHERE clause. What is the outcome?',
          options: [
            { id: 'a', text: 'Only the most recently created user is suspended.', isCorrect: false },
            { id: 'b', text: 'The query throws an error because WHERE is mandatory for UPDATE.', isCorrect: false },
            { id: 'c', text: 'Every single user account in the database is suspended — a production disaster.', isCorrect: true },
            { id: 'd', text: 'The database asks for confirmation before applying to all rows.', isCorrect: false },
          ],
          explanation: 'Without a WHERE clause, UPDATE modifies every row in the table. This is one of the most catastrophic SQL mistakes possible. Always run SELECT first to confirm which rows will be affected, then run the UPDATE with an identical WHERE clause.'
        },
        {
          question: 'You want to test the "Update Profile" feature. After clicking Save, which SQL query best validates the data was updated correctly?',
          options: [
            { id: 'a', text: 'SELECT COUNT(*) FROM users WHERE id = 42;', isCorrect: false },
            { id: 'b', text: 'SELECT first_name, email, updated_at FROM users WHERE id = 42;', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM update_log WHERE user_id = 42;', isCorrect: false },
            { id: 'd', text: 'UPDATE users SET verified = 1 WHERE id = 42;', isCorrect: false },
          ],
          explanation: 'To verify an UPDATE, SELECT the specific columns that should have changed, filtered by the user\'s ID. Crucially, also check updated_at — it should reflect the current timestamp, confirming the row was actually modified, not just read.'
        },
        {
          question: 'What is the difference between DELETE FROM users and TRUNCATE TABLE users?',
          options: [
            { id: 'a', text: 'They are identical — both delete all rows.', isCorrect: false },
            { id: 'b', text: 'DELETE removes rows one by one and can be rolled back. TRUNCATE removes all rows instantly, resets the auto-increment counter, and usually cannot be rolled back.', isCorrect: true },
            { id: 'c', text: 'DELETE requires a WHERE clause; TRUNCATE does not.', isCorrect: false },
            { id: 'd', text: 'TRUNCATE also drops the table structure; DELETE only removes data.', isCorrect: false },
          ],
          explanation: 'DELETE is row-by-row and transactional (rollback possible). TRUNCATE is a fast table wipe that also resets identity counters. TRUNCATE is appropriate only for clearing test/staging data, never for selectively removing records.'
        },
        {
          question: 'What is the safest procedure before running an UPDATE or DELETE on a production database?',
          options: [
            { id: 'a', text: 'Run it quickly to minimise downtime.', isCorrect: false },
            { id: 'b', text: 'First run a SELECT with the same WHERE clause to see exactly which rows will be affected, confirm the count is right, then run the UPDATE/DELETE.', isCorrect: true },
            { id: 'c', text: 'Ask the developer to do it — QA shouldn\'t touch production databases.', isCorrect: false },
            { id: 'd', text: 'Wrap it in a comment block so it can be undone later.', isCorrect: false },
          ],
          explanation: 'The golden rule: SELECT before you UPDATE or DELETE. Run the equivalent SELECT to preview exactly which rows match your WHERE clause. If the count and data look correct, proceed. If not, adjust the WHERE clause and repeat.'
        },
        {
          question: 'You\'re testing a feature where all products in the "Electronics" category get a 10% price reduction. The developer used: UPDATE products SET price = price * 0.9 WHERE category = \'Electronics\'. How do you verify this worked correctly for a product that was originally priced at ₹10,000?',
          options: [
            { id: 'a', text: 'SELECT price FROM products WHERE category = \'Electronics\'; — if price shows, the update worked.', isCorrect: false },
            { id: 'b', text: 'SELECT id, price FROM products WHERE id = [product_id]; — verify price is now 9000.', isCorrect: true },
            { id: 'c', text: 'SELECT COUNT(*) FROM products WHERE category = \'Electronics\'; — verify the count didn\'t change.', isCorrect: false },
            { id: 'd', text: 'Run the UPDATE again — if no rows are affected, the first one worked.', isCorrect: false },
          ],
          explanation: 'Verify the UPDATE by SELECTing the specific product and checking the new price is exactly 9000 (10000 × 0.9). Also check that updated_at was refreshed. Verifying by row count tells you nothing about whether the values changed correctly.'
        },
      ]
    },

    // ─── BEGINNER MODULE 7: Data Types ─────────────────────────────────────────
    {
      level: 'sql-data-types',
      questions: [
        {
          question: 'A registration form allows users to enter their age. The database column is defined as INT. A user submits the value "twenty-five" (as text). What is the most likely outcome?',
          options: [
            { id: 'a', text: 'The database converts "twenty-five" to 25 automatically.', isCorrect: false },
            { id: 'b', text: 'The database stores "twenty-five" in the INT column as-is.', isCorrect: false },
            { id: 'c', text: 'The database throws a type mismatch error and rejects the value.', isCorrect: true },
            { id: 'd', text: 'The database stores 0 as a fallback for invalid numeric input.', isCorrect: false },
          ],
          explanation: 'INT columns only accept integers. Submitting a text string causes a type error at the database level. As a QA engineer, test this boundary: can the UI submit non-numeric data? If it can, the frontend validation is insufficient and it will hit the database error instead.'
        },
        {
          question: 'Which data type is most appropriate for storing a product\'s price (e.g., ₹1,299.99)?',
          options: [
            { id: 'a', text: 'FLOAT — it handles decimal numbers.', isCorrect: false },
            { id: 'b', text: 'VARCHAR(10) — prices can be stored as formatted text.', isCorrect: false },
            { id: 'c', text: 'DECIMAL(10,2) — it stores exact decimal values, critical for accurate financial calculations.', isCorrect: true },
            { id: 'd', text: 'INT — round prices to the nearest rupee to avoid decimals.', isCorrect: false },
          ],
          explanation: 'FLOAT is approximate and can introduce rounding errors (₹19.99 stored as 19.990000000000002). DECIMAL(10,2) stores exactly 2 decimal places with no floating-point errors. This is the standard for all monetary values in any serious application.'
        },
        {
          question: 'The column "country_code" is defined as CHAR(2). It stores values like \'IN\', \'US\', \'GB\'. Why use CHAR instead of VARCHAR?',
          options: [
            { id: 'a', text: 'CHAR supports special characters that VARCHAR doesn\'t.', isCorrect: false },
            { id: 'b', text: 'Because the value is always exactly 2 characters — fixed-length storage is more efficient and appropriate here.', isCorrect: true },
            { id: 'c', text: 'CHAR is case-insensitive, which is needed for country codes.', isCorrect: false },
            { id: 'd', text: 'VARCHAR(2) doesn\'t work with 2-character strings.', isCorrect: false },
          ],
          explanation: 'CHAR(n) is fixed-length — it always uses exactly n characters of storage. This is perfect for values that are always the same length (country codes, fixed codes, checksums). VARCHAR saves space for variable-length text but has a small overhead per row. For short fixed-length values, CHAR is the clean choice.'
        },
        {
          question: 'You\'re testing an "Email Verification" flow. After clicking the verify link, which database check confirms the feature worked?',
          options: [
            { id: 'a', text: 'SELECT COUNT(*) FROM users WHERE email_verified = \'yes\';', isCorrect: false },
            { id: 'b', text: 'SELECT email, is_email_verified FROM users WHERE email = \'testuser@qa.com\'; — expecting is_email_verified = 1 (or TRUE).', isCorrect: true },
            { id: 'c', text: 'SELECT email FROM verified_emails WHERE email = \'testuser@qa.com\';', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM users ORDER BY is_email_verified DESC LIMIT 1;', isCorrect: false },
          ],
          explanation: 'Boolean flag columns (is_email_verified stored as TINYINT(1) or BOOLEAN) should be checked directly with a targeted SELECT. You\'re looking for the specific user and confirming is_email_verified changed from 0 (false) to 1 (true) after the verification flow.'
        },
        {
          question: 'A column is defined as VARCHAR(100). A QA engineer tests submitting a 150-character email. What should they expect?',
          options: [
            { id: 'a', text: 'The database silently truncates it to 100 characters and stores it.', isCorrect: false },
            { id: 'b', text: 'Either the database throws an error (Data too long) or the application layer rejects it — both should be tested.', isCorrect: true },
            { id: 'c', text: 'VARCHAR auto-expands to fit any length, so 150 characters is stored perfectly.', isCorrect: false },
            { id: 'd', text: 'The database stores the first 100 characters and creates a second row for the remaining 50.', isCorrect: false },
          ],
          explanation: 'VARCHAR(100) enforces a maximum length. Exceeding it either throws a "Data too long" error at the DB level, or should be caught earlier by application validation. Testing with boundary values (100 chars = valid, 101 chars = should fail) is a classic BVA scenario.'
        },
      ]
    },

    // ─── BEGINNER MODULE 8: Aggregations ──────────────────────────────────────
    {
      level: 'sql-aggregations',
      questions: [
        {
          question: 'After a batch import of 500 products, you want to verify all 500 were successfully created today. Which query is correct?',
          options: [
            { id: 'a', text: 'SELECT SUM(*) FROM products WHERE DATE(created_at) = CURDATE();', isCorrect: false },
            { id: 'b', text: 'SELECT COUNT(*) FROM products WHERE DATE(created_at) = CURDATE();', isCorrect: true },
            { id: 'c', text: 'SELECT TOTAL(*) FROM products WHERE created_at = TODAY();', isCorrect: false },
            { id: 'd', text: 'SELECT COUNT(id) = 500 FROM products WHERE DATE(created_at) = CURDATE();', isCorrect: false },
          ],
          explanation: 'COUNT(*) counts every row matching the condition, regardless of NULL values. SUM is for adding numeric values, not for counting rows. The result should be 500 — if it\'s less, some records failed to import.'
        },
        {
          question: 'You\'re testing a cart checkout. A cart has 3 items: ₹500, ₹1200, and ₹300. The UI shows a total of ₹2,100. Which SQL query validates this against the database?',
          options: [
            { id: 'a', text: 'SELECT COUNT(price) FROM cart_items WHERE cart_id = 7;', isCorrect: false },
            { id: 'b', text: 'SELECT SUM(price) AS cart_total FROM cart_items WHERE cart_id = 7;', isCorrect: true },
            { id: 'c', text: 'SELECT AVG(price) FROM cart_items WHERE cart_id = 7;', isCorrect: false },
            { id: 'd', text: 'SELECT MAX(price) FROM cart_items WHERE cart_id = 7;', isCorrect: false },
          ],
          explanation: 'SUM(price) adds up all the price values for that cart. The result (₹2,000 = 500+1200+300) should match what the UI displays as the total. If they differ, there\'s a calculation bug — either in the UI rendering or the backend total computation.'
        },
        {
          question: 'You want to find all product categories where the average review rating has dropped below 3.0 — indicating potential quality issues. Which query achieves this?',
          options: [
            { id: 'a', text: 'SELECT category FROM products WHERE AVG(rating) < 3.0;', isCorrect: false },
            { id: 'b', text: 'SELECT category, AVG(rating) FROM reviews GROUP BY category HAVING AVG(rating) < 3.0;', isCorrect: true },
            { id: 'c', text: 'SELECT category, AVG(rating) FROM reviews WHERE AVG(rating) < 3.0 GROUP BY category;', isCorrect: false },
            { id: 'd', text: 'SELECT category FROM reviews GROUP BY category WHERE rating < 3.0;', isCorrect: false },
          ],
          explanation: 'Aggregate functions like AVG() cannot be used in a WHERE clause — WHERE filters individual rows before grouping. HAVING filters groups after aggregation. So: GROUP BY category HAVING AVG(rating) < 3.0 is the correct pattern.'
        },
        {
          question: 'A dashboard shows the total number of orders per status. Which SQL generates this?',
          options: [
            { id: 'a', text: 'SELECT status, SUM(id) FROM orders GROUP BY status;', isCorrect: false },
            { id: 'b', text: 'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;', isCorrect: true },
            { id: 'c', text: 'SELECT COUNT(status) FROM orders;', isCorrect: false },
            { id: 'd', text: 'SELECT status FROM orders COUNT(*) GROUP BY status;', isCorrect: false },
          ],
          explanation: 'GROUP BY status creates one group per distinct status value. COUNT(*) then counts the rows in each group. This produces one row per status with its count — exactly what a status breakdown dashboard shows. SUM(id) would add up the IDs, which is meaningless.'
        },
        {
          question: 'After running a price update, you suspect some prices may have been set to 0 or negative values by mistake. Which query detects this across all categories?',
          options: [
            { id: 'a', text: 'SELECT category, AVG(price) FROM products GROUP BY category;', isCorrect: false },
            { id: 'b', text: 'SELECT category, MIN(price) AS lowest_price FROM products GROUP BY category HAVING MIN(price) <= 0;', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM products WHERE price IS NULL;', isCorrect: false },
            { id: 'd', text: 'SELECT COUNT(*) FROM products WHERE price > 0;', isCorrect: false },
          ],
          explanation: 'MIN(price) per category finds the lowest price in each group. HAVING MIN(price) <= 0 then filters to only return categories where at least one product has an invalid price (zero or negative). This is a focused data integrity check that targets exactly the problem described.'
        },
      ]
    },

    // ─── INTERMEDIATE ─────────────────────────────────────────────────────────
    {
      level: 'sql-joins',
      questions: [
        {
          question: 'After a test run that creates orders, you want to verify every order is linked to a valid user. Which query detects orphaned orders?',
          options: [
            { id: 'a', text: 'SELECT * FROM orders WHERE user_id = NULL;', isCorrect: false },
            { id: 'b', text: 'SELECT o.id FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL;', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM orders WHERE user_id NOT NULL;', isCorrect: false },
          ],
          explanation: 'A LEFT JOIN returns all orders regardless of whether a user exists. WHERE u.id IS NULL then filters to only the orders with no matching user — exactly the orphaned records you want to catch.'
        },
        {
          question: 'A bug report says "some users show 0 orders in the dashboard even though they have orders." You want to check every user and their order count including those with zero. Which JOIN is correct?',
          options: [
            { id: 'a', text: 'INNER JOIN — only users with at least one order appear.', isCorrect: false },
            { id: 'b', text: 'RIGHT JOIN from users to orders.', isCorrect: false },
            { id: 'c', text: 'LEFT JOIN from users to orders — every user appears, even those with no orders.', isCorrect: true },
            { id: 'd', text: 'CROSS JOIN — gives every combination of user and order.', isCorrect: false },
          ],
          explanation: 'LEFT JOIN keeps ALL rows from the left table (users), filling NULLs where no matching order exists. INNER JOIN would silently omit users with zero orders — hiding exactly the bug you\'re looking for.'
        },
        {
          question: 'You run: SELECT u.name, o.product FROM users u INNER JOIN orders o ON u.id = o.user_id. User "Amit" has never placed an order. What happens?',
          options: [
            { id: 'a', text: 'Amit appears with NULL in the product column.', isCorrect: false },
            { id: 'b', text: 'Amit does not appear in the results at all.', isCorrect: true },
            { id: 'c', text: 'The query throws an error because Amit has no orders.', isCorrect: false },
            { id: 'd', text: 'Amit appears with an empty string in the product column.', isCorrect: false },
          ],
          explanation: 'INNER JOIN only returns rows where a match exists in BOTH tables. Since Amit has no orders, there is no matching row in the orders table, so he is completely excluded from the result.'
        },
        {
          question: 'You are testing a 3-table join: users → orders → payments. An order exists but has no payment record yet. You need to see ALL orders including unpaid ones. Which join should you use between orders and payments?',
          options: [
            { id: 'a', text: 'INNER JOIN — it is the most common and correct choice.', isCorrect: false },
            { id: 'b', text: 'CROSS JOIN — to see all combinations.', isCorrect: false },
            { id: 'c', text: 'LEFT JOIN from orders to payments — keeps all orders, shows NULL for missing payments.', isCorrect: true },
            { id: 'd', text: 'RIGHT JOIN from payments to orders.', isCorrect: false },
          ],
          explanation: 'LEFT JOIN from orders (left) to payments (right) keeps every order row. Where no matching payment exists, payment columns are NULL. This is the correct way to find "orders missing a payment" — a common QA validation query.'
        },
        {
          question: 'After a data migration, you want to verify no orders reference a deleted user. Which query finds this data integrity issue?',
          options: [
            { id: 'a', text: 'SELECT * FROM orders WHERE user_id IS NULL;', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM orders WHERE user_id = 0;', isCorrect: false },
            { id: 'c', text: 'SELECT o.id FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL AND o.user_id IS NOT NULL;', isCorrect: true },
            { id: 'd', text: 'SELECT * FROM orders INNER JOIN users ON orders.id = users.id;', isCorrect: false },
          ],
          explanation: 'A LEFT JOIN combined with WHERE u.id IS NULL finds orders where the JOIN found no matching user — meaning the user_id points to a user that no longer exists. Adding AND o.user_id IS NOT NULL excludes intentionally blank user_ids.'
        },
      ]
    },
    {
      level: 'sql-group-by',
      questions: [
        {
          question: 'You want to find product categories where more than 100 orders were placed this month. Which clause filters the grouped results?',
          options: [
            { id: 'a', text: 'WHERE COUNT(*) > 100', isCorrect: false },
            { id: 'b', text: 'HAVING COUNT(*) > 100', isCorrect: true },
            { id: 'c', text: 'FILTER COUNT(*) > 100', isCorrect: false },
            { id: 'd', text: 'ORDER BY COUNT(*) > 100', isCorrect: false },
          ],
          explanation: 'HAVING filters groups AFTER GROUP BY collapses them. WHERE can only filter individual rows BEFORE grouping. Aggregate functions like COUNT(*) cannot appear in a WHERE clause — they must go in HAVING.'
        },
        {
          question: 'A QA test needs to find duplicate email addresses in the users table. Which query is correct?',
          options: [
            { id: 'a', text: 'SELECT email FROM users WHERE email = email;', isCorrect: false },
            { id: 'b', text: 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;', isCorrect: true },
            { id: 'c', text: 'SELECT DISTINCT email FROM users GROUP BY email;', isCorrect: false },
            { id: 'd', text: 'SELECT email FROM users HAVING COUNT(email) > 1;', isCorrect: false },
          ],
          explanation: 'GROUP BY email collapses all rows with the same email. HAVING COUNT(*) > 1 then keeps only the groups where more than one row shares that email — revealing duplicates. This is a critical data integrity check.'
        },
        {
          question: 'What is the correct SQL execution order for WHERE, GROUP BY, and HAVING?',
          options: [
            { id: 'a', text: 'GROUP BY → WHERE → HAVING', isCorrect: false },
            { id: 'b', text: 'HAVING → WHERE → GROUP BY', isCorrect: false },
            { id: 'c', text: 'WHERE → GROUP BY → HAVING', isCorrect: true },
            { id: 'd', text: 'WHERE → HAVING → GROUP BY', isCorrect: false },
          ],
          explanation: 'SQL processes clauses in this order: FROM → WHERE (filter rows) → GROUP BY (collapse into groups) → HAVING (filter groups) → SELECT → ORDER BY. This is why you cannot use aggregate functions in WHERE — the grouping has not happened yet at that step.'
        },
        {
          question: 'You run a report to count orders by status. The result shows pending: 142, shipped: 87, delivered: 1204. You need this as a SINGLE ROW with separate columns. Which technique achieves this?',
          options: [
            { id: 'a', text: 'Use UNION to combine three separate queries.', isCorrect: false },
            { id: 'b', text: 'Use CASE inside COUNT to pivot the data into columns.', isCorrect: true },
            { id: 'c', text: 'Use a subquery for each status column.', isCorrect: false },
            { id: 'd', text: 'Use GROUP BY status ORDER BY status.', isCorrect: false },
          ],
          explanation: 'COUNT(CASE WHEN status = "pending" THEN 1 END) counts only rows matching that condition, letting you create multiple aggregate columns in a single pass. This is called conditional aggregation or pivoting — a powerful QA reporting pattern.'
        },
        {
          question: 'A QA query uses GROUP BY city. A developer asks: "Can I add the users.email column to the SELECT without adding it to GROUP BY?" What is the correct answer?',
          options: [
            { id: 'a', text: 'Yes, any column can be selected alongside GROUP BY.', isCorrect: false },
            { id: 'b', text: 'No. In strict SQL mode, every non-aggregated column in SELECT must appear in GROUP BY.', isCorrect: true },
            { id: 'c', text: 'Yes, but only if email has an index.', isCorrect: false },
            { id: 'd', text: 'No, unless you add ORDER BY email.', isCorrect: false },
          ],
          explanation: 'SQL requires that every column in SELECT is either in the GROUP BY clause OR wrapped in an aggregate function (COUNT, SUM, etc.). If email is not grouped, the database does not know which email to show for the group — some databases error, others return an arbitrary value.'
        },
      ]
    },
    {
      level: 'sql-subqueries',
      questions: [
        {
          question: 'You want to find all users who have NEVER placed an order. Which query correctly uses a subquery for this?',
          options: [
            { id: 'a', text: 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders WHERE user_id IS NOT NULL);', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM users WHERE orders.user_id IS NULL;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM users NOT JOIN orders ON users.id = orders.user_id;', isCorrect: false },
          ],
          explanation: 'NOT IN with a subquery finds users whose ID does not appear in the orders table. The WHERE user_id IS NOT NULL inside the subquery is critical — a single NULL in a NOT IN list causes the entire query to return zero rows.'
        },
        {
          question: 'A subquery runs inside a WHERE clause. Which part of the query executes FIRST?',
          options: [
            { id: 'a', text: 'The outer query — it determines what data to pass to the subquery.', isCorrect: false },
            { id: 'b', text: 'The inner (sub) query — its result is used by the outer query.', isCorrect: true },
            { id: 'c', text: 'Both run simultaneously in parallel.', isCorrect: false },
            { id: 'd', text: 'The ORDER BY clause at the end.', isCorrect: false },
          ],
          explanation: 'The database always evaluates the inner subquery first, gets a result (a value, a list, or a table), and then uses that result to evaluate the outer query. This is why subqueries are great for "first find X, then find Y based on X" patterns.'
        },
        {
          question: 'You are checking whether EXISTS or IN is better for: "find users who have at least one order over ₹10,000". The orders table has 5 million rows. What is the recommendation?',
          options: [
            { id: 'a', text: 'IN — it is always faster because the list is computed once.', isCorrect: false },
            { id: 'b', text: 'EXISTS — it stops scanning as soon as it finds the first match, which is faster on large tables.', isCorrect: true },
            { id: 'c', text: 'They perform identically in all cases.', isCorrect: false },
            { id: 'd', text: 'Neither — use a LEFT JOIN instead for large tables.', isCorrect: false },
          ],
          explanation: 'EXISTS short-circuits — as soon as it finds ONE matching row for a user, it stops looking and returns TRUE. IN retrieves the entire matching list upfront. For large tables, EXISTS is generally faster because it does not need to load millions of values into memory.'
        },
        {
          question: 'A correlated subquery references a column from the outer query. What is the consequence of this?',
          options: [
            { id: 'a', text: 'The subquery runs only once, making it very fast.', isCorrect: false },
            { id: 'b', text: 'The subquery runs once for EACH ROW in the outer query, which can be slow on large tables.', isCorrect: true },
            { id: 'c', text: 'The subquery cannot be used in WHERE — only in SELECT.', isCorrect: false },
            { id: 'd', text: 'It causes a syntax error in most databases.', isCorrect: false },
          ],
          explanation: 'A correlated subquery re-evaluates for every single row of the outer query because its condition changes based on the current outer row. On a million-row table, this means the inner query runs a million times. This is why correlated subqueries need careful use on large datasets.'
        },
        {
          question: 'You need to find orders whose amount is above that SPECIFIC USER\'s personal average order value. Which approach is correct?',
          options: [
            { id: 'a', text: 'WHERE amount > (SELECT AVG(amount) FROM orders) — global average.', isCorrect: false },
            { id: 'b', text: 'WHERE amount > (SELECT AVG(o2.amount) FROM orders o2 WHERE o2.user_id = o.user_id) — correlated subquery.', isCorrect: true },
            { id: 'c', text: 'HAVING amount > AVG(amount) GROUP BY user_id.', isCorrect: false },
            { id: 'd', text: 'WHERE amount > AVG(amount) OVER (PARTITION BY user_id).', isCorrect: false },
          ],
          explanation: 'The correlated subquery references o.user_id from the outer query, so it calculates each user\'s personal average — not the global one. Option A uses the global average. Option D is actually valid as a window function, but that is expert-level material.'
        },
      ]
    },
    {
      level: 'sql-views',
      questions: [
        {
          question: 'A QA team runs the same complex 4-table JOIN query every day to check order health. What is the BEST way to share this query across the team without copy-pasting?',
          options: [
            { id: 'a', text: 'Save it in a text file and email it to each team member.', isCorrect: false },
            { id: 'b', text: 'Create a VIEW — then anyone can query it with a simple SELECT.', isCorrect: true },
            { id: 'c', text: 'Create a stored procedure that only the DBA can run.', isCorrect: false },
            { id: 'd', text: 'Add an index to every column involved in the JOIN.', isCorrect: false },
          ],
          explanation: 'A VIEW stores the complex query with a name. Any team member can then write SELECT * FROM order_health_view — they get the same accurate, consistent results without needing to understand or copy the 4-table JOIN underneath.'
        },
        {
          question: 'A View called "user_summary" is based on: SELECT id, name, email, COUNT(orders) FROM users JOIN orders GROUP BY id. Can you run UPDATE user_summary SET name = "Priya" WHERE id = 1?',
          options: [
            { id: 'a', text: 'Yes, Views always support UPDATE operations.', isCorrect: false },
            { id: 'b', text: 'No. Views containing GROUP BY, aggregates, or JOINs are read-only.', isCorrect: true },
            { id: 'c', text: 'Yes, but only if you have admin privileges.', isCorrect: false },
            { id: 'd', text: 'Yes, the UPDATE goes to the underlying users table automatically.', isCorrect: false },
          ],
          explanation: 'Views with GROUP BY, aggregate functions (COUNT, SUM), DISTINCT, or multiple base tables are generally read-only — the database cannot determine which underlying row to update. Simple single-table views without aggregates can often be updated.'
        },
        {
          question: 'Does a View store a copy of the data or execute the query each time it is accessed?',
          options: [
            { id: 'a', text: 'It stores a snapshot of data at creation time.', isCorrect: false },
            { id: 'b', text: 'It executes the underlying query fresh each time it is queried.', isCorrect: true },
            { id: 'c', text: 'It caches the result for 1 hour.', isCorrect: false },
            { id: 'd', text: 'It depends on the database — MySQL always caches, PostgreSQL never does.', isCorrect: false },
          ],
          explanation: 'A regular View is just a stored query definition — no data is saved. Every time you SELECT from it, the database runs the underlying SQL fresh. This means results are always up-to-date. Only Materialized Views (PostgreSQL) store data on disk.'
        },
        {
          question: 'You want to let junior QA testers query user data, but the users table contains a password_hash column that must stay hidden. What is the cleanest solution?',
          options: [
            { id: 'a', text: 'Grant them full SELECT permission on the users table and trust them.', isCorrect: false },
            { id: 'b', text: 'Create a View that SELECTs all columns except password_hash, then grant access to the View only.', isCorrect: true },
            { id: 'c', text: 'Rename the column to something confusing so they ignore it.', isCorrect: false },
            { id: 'd', text: 'Delete the password_hash column from the users table.', isCorrect: false },
          ],
          explanation: 'Views are an elegant security layer. CREATE VIEW public_users AS SELECT id, name, email FROM users — the password_hash column is simply not included. Junior testers get everything they need without ever seeing sensitive data.'
        },
        {
          question: 'A View named "active_orders" was created last month. The definition needs a new filter added. Which command updates an existing View without dropping it first?',
          options: [
            { id: 'a', text: 'UPDATE VIEW active_orders SET ...', isCorrect: false },
            { id: 'b', text: 'ALTER VIEW active_orders AS SELECT ...', isCorrect: false },
            { id: 'c', text: 'CREATE OR REPLACE VIEW active_orders AS SELECT ...', isCorrect: true },
            { id: 'd', text: 'MODIFY VIEW active_orders AS SELECT ...', isCorrect: false },
          ],
          explanation: 'CREATE OR REPLACE VIEW replaces the definition in place — no need to DROP and recreate, which would break any permissions granted on the View. ALTER VIEW exists in some databases but CREATE OR REPLACE is more universally supported.'
        },
      ]
    },
    {
      level: 'sql-indexes',
      questions: [
        {
          question: 'A query SELECT * FROM orders WHERE email = "priya@test.com" is taking 8 seconds on a 10-million row table. What is the most likely cause and fix?',
          options: [
            { id: 'a', text: 'The query has a syntax error. Fix the SQL.', isCorrect: false },
            { id: 'b', text: 'No index exists on the email column — the DB scans all 10M rows. Fix: CREATE INDEX on email.', isCorrect: true },
            { id: 'c', text: 'The table has too many columns. Remove unused columns.', isCorrect: false },
            { id: 'd', text: 'The ORDER BY is missing — add ORDER BY email.', isCorrect: false },
          ],
          explanation: 'Without an index, a query with WHERE email = "..." forces a Full Table Scan — checking all 10 million rows one by one. Adding CREATE INDEX idx_email ON orders(email) lets the DB jump directly to the matching rows, typically reducing query time from seconds to milliseconds.'
        },
        {
          question: 'You run EXPLAIN SELECT * FROM orders WHERE status = "pending". The output shows type: ALL and key: NULL. What does this mean?',
          options: [
            { id: 'a', text: 'The query is using an index efficiently — ALL means all conditions matched.', isCorrect: false },
            { id: 'b', text: 'The database is doing a Full Table Scan (no index is being used).', isCorrect: true },
            { id: 'c', text: 'The query returned NULL — no pending orders exist.', isCorrect: false },
            { id: 'd', text: 'The status column has a UNIQUE constraint preventing index use.', isCorrect: false },
          ],
          explanation: 'In EXPLAIN output, type: ALL = Full Table Scan (bad for large tables). key: NULL = no index was used. You want to see type: ref or range and key showing an index name. Fix by adding CREATE INDEX idx_orders_status ON orders(status).'
        },
        {
          question: 'You add 10 indexes to a table to speed up all SELECT queries. A developer complains that INSERT operations are now very slow. Why?',
          options: [
            { id: 'a', text: 'Indexes lock the table during SELECT, blocking INSERTs.', isCorrect: false },
            { id: 'b', text: 'Each INSERT must also update all 10 index structures, adding write overhead per row.', isCorrect: true },
            { id: 'c', text: 'INSERT and indexes are incompatible — you must drop indexes before inserting.', isCorrect: false },
            { id: 'd', text: 'The database ran out of disk space due to all the indexes.', isCorrect: false },
          ],
          explanation: 'Every time a row is inserted, updated, or deleted, the database must also update every index that covers those columns. 10 indexes means 10 extra write operations per INSERT. This is the classic index trade-off: fast reads, slower writes. Index only what you frequently query.'
        },
        {
          question: 'A query filters by both status AND created_at together: WHERE status = "shipped" AND created_at > "2025-01-01". Which index design is BEST?',
          options: [
            { id: 'a', text: 'Two separate indexes: one on status, one on created_at.', isCorrect: false },
            { id: 'b', text: 'A composite index on (status, created_at).', isCorrect: true },
            { id: 'c', text: 'An index on created_at only — date filters are always the bottleneck.', isCorrect: false },
            { id: 'd', text: 'An index on status only — low-cardinality columns should be indexed first.', isCorrect: false },
          ],
          explanation: 'A composite index on (status, created_at) covers both filter conditions in one efficient structure. Two separate indexes may each be scanned and merged, which is less efficient. The order matters: put the equality filter column (status) first, the range filter (created_at) second.'
        },
        {
          question: 'After a production performance complaint, you want to check if a specific query is using an index. What SQL command gives you this information?',
          options: [
            { id: 'a', text: 'DESCRIBE orders;', isCorrect: false },
            { id: 'b', text: 'SHOW COLUMNS FROM orders;', isCorrect: false },
            { id: 'c', text: 'EXPLAIN SELECT ... the query ...;', isCorrect: true },
            { id: 'd', text: 'CHECK TABLE orders;', isCorrect: false },
          ],
          explanation: 'EXPLAIN shows the query execution plan — which indexes the optimizer chose, how many rows it estimates it will scan, and whether it uses a filesort. It is the first tool to reach for when debugging slow queries. EXPLAIN ANALYZE (PostgreSQL) also shows actual execution times.'
        },
      ]
    },
    {
      level: 'sql-transactions',
      questions: [
        {
          question: 'A payment flow runs two queries: (1) debit user wallet, (2) credit merchant account. The server crashes between them. What prevents the wallet being debited without the merchant receiving the money?',
          options: [
            { id: 'a', text: 'A UNIQUE constraint on the payments table.', isCorrect: false },
            { id: 'b', text: 'Wrapping both queries in a transaction — if step 2 fails, ROLLBACK undoes step 1.', isCorrect: true },
            { id: 'c', text: 'Adding an index on the amount column.', isCorrect: false },
            { id: 'd', text: 'Using a LEFT JOIN between the wallet and merchant tables.', isCorrect: false },
          ],
          explanation: 'Transactions guarantee Atomicity — all operations succeed or none do. BEGIN → UPDATE wallet → UPDATE merchant → COMMIT. If anything fails before COMMIT, the ROLLBACK restores the wallet to its original balance, preventing money from disappearing.'
        },
        {
          question: 'Which SQL command permanently saves all changes made inside an open transaction?',
          options: [
            { id: 'a', text: 'SAVE', isCorrect: false },
            { id: 'b', text: 'END TRANSACTION', isCorrect: false },
            { id: 'c', text: 'COMMIT', isCorrect: true },
            { id: 'd', text: 'CONFIRM', isCorrect: false },
          ],
          explanation: 'COMMIT finalises the transaction — all changes become permanent and visible to other users. Before COMMIT, the changes are only visible to the current session. ROLLBACK is the opposite: it discards all changes and reverts the database to its state at the BEGIN.'
        },
        {
          question: 'What does the "A" in ACID stand for, and what does it guarantee?',
          options: [
            { id: 'a', text: 'Authentication — only authorised users can write data.', isCorrect: false },
            { id: 'b', text: 'Atomicity — a transaction is all-or-nothing; partial success is impossible.', isCorrect: true },
            { id: 'c', text: 'Availability — the database is always online.', isCorrect: false },
            { id: 'd', text: 'Asynchronous — transactions run in the background.', isCorrect: false },
          ],
          explanation: 'Atomicity means a transaction is treated as a single indivisible unit. If any statement inside it fails, the entire transaction is rolled back. This is what prevents half-executed business logic — like charging a user without creating their order.'
        },
        {
          question: 'As a QA tester, you want to run a DELETE query on a test database to clean up, but you are nervous about removing the wrong rows. What is the SAFEST approach?',
          options: [
            { id: 'a', text: 'Run the DELETE with a LIMIT 1 first to test.', isCorrect: false },
            { id: 'b', text: 'Wrap the DELETE in a transaction: BEGIN → DELETE → check row count → ROLLBACK (to verify) → then COMMIT if correct.', isCorrect: true },
            { id: 'c', text: 'Duplicate the table first, then delete from the original.', isCorrect: false },
            { id: 'd', text: 'Add a WHERE id > 0 to the DELETE to be safe.', isCorrect: false },
          ],
          explanation: 'Using BEGIN → DELETE → SELECT COUNT(*) to verify → ROLLBACK lets you safely "preview" the deletion. You can see exactly how many rows would be deleted without actually committing the change. Once satisfied, run it again and COMMIT. This is a standard QA database testing technique.'
        },
        {
          question: 'Two transactions run simultaneously. Transaction A reads a row. Transaction B updates that same row and commits. Transaction A reads the row again and gets a different value. What read problem is this?',
          options: [
            { id: 'a', text: 'Dirty Read — reading uncommitted data.', isCorrect: false },
            { id: 'b', text: 'Non-repeatable Read — the same row returns different values within one transaction.', isCorrect: true },
            { id: 'c', text: 'Phantom Read — new rows appeared between two reads.', isCorrect: false },
            { id: 'd', text: 'Deadlock — both transactions are waiting for each other.', isCorrect: false },
          ],
          explanation: 'A Non-repeatable Read happens when you read the same row twice within one transaction and get different results because another committed transaction changed it in between. This differs from a Dirty Read (reading uncommitted data) and a Phantom Read (new rows appearing between identical queries).'
        },
      ]
    },
    {
      level: 'sql-string-date',
      questions: [
        {
          question: 'Users are complaining the search for their email "Priya@Gmail.COM" is not finding their account. The database stores emails as "priya@gmail.com". Which fix makes the search case-insensitive?',
          options: [
            { id: 'a', text: 'WHERE email = "Priya@Gmail.COM"', isCorrect: false },
            { id: 'b', text: 'WHERE LOWER(email) = LOWER("Priya@Gmail.COM")', isCorrect: true },
            { id: 'c', text: 'WHERE TRIM(email) = "Priya@Gmail.COM"', isCorrect: false },
            { id: 'd', text: 'WHERE email LIKE "Priya@Gmail.COM"', isCorrect: false },
          ],
          explanation: 'LOWER() converts both sides to lowercase before comparing, making the match case-insensitive. LIKE without wildcards is still case-sensitive in many databases. TRIM only removes spaces. This is a very common bug in login and search features.'
        },
        {
          question: 'A QA check reveals some user phone numbers have leading/trailing spaces entered during registration. Which query finds these dirty records?',
          options: [
            { id: 'a', text: 'SELECT * FROM users WHERE phone = " ";', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM users WHERE phone != TRIM(phone);', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM users WHERE LENGTH(phone) = 0;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM users WHERE phone IS NULL;', isCorrect: false },
          ],
          explanation: 'TRIM(phone) removes leading and trailing spaces. If TRIM(phone) is different from phone itself, the original value had spaces. This WHERE phone != TRIM(phone) condition catches any phone number with extra whitespace — a classic data quality validation.'
        },
        {
          question: 'You need to find all orders placed in the last 7 days. Today\'s date is dynamic. Which query is correct?',
          options: [
            { id: 'a', text: 'WHERE created_at >= "2025-04-24"', isCorrect: false },
            { id: 'b', text: 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)', isCorrect: true },
            { id: 'c', text: 'WHERE DATEDIFF(created_at, NOW()) = 7', isCorrect: false },
            { id: 'd', text: 'WHERE created_at > LAST_WEEK()', isCorrect: false },
          ],
          explanation: 'DATE_SUB(NOW(), INTERVAL 7 DAY) dynamically calculates 7 days ago from right now. This is the correct pattern for rolling-window queries — hardcoding a date like "2025-04-24" breaks as soon as tomorrow comes. DATEDIFF = 7 would only return exactly 7 days ago, not the last 7 days.'
        },
        {
          question: 'An SLA requires orders to be delivered within 5 days of placement. Which query finds SLA breaches?',
          options: [
            { id: 'a', text: 'SELECT * FROM orders WHERE delivery_date > 5;', isCorrect: false },
            { id: 'b', text: 'SELECT * FROM orders WHERE DATEDIFF(delivered_at, ordered_at) > 5;', isCorrect: true },
            { id: 'c', text: 'SELECT * FROM orders WHERE delivered_at - ordered_at > 5;', isCorrect: false },
            { id: 'd', text: 'SELECT * FROM orders WHERE DATE(delivered_at) > DATE(ordered_at) + 5;', isCorrect: false },
          ],
          explanation: 'DATEDIFF(delivered_at, ordered_at) returns the number of days between the two dates. DATEDIFF > 5 catches every order that took more than 5 days to deliver. Direct subtraction of datetime columns gives seconds in some databases, not days — DATEDIFF is the reliable, readable choice.'
        },
        {
          question: 'Users reported that "search by name" is returning wrong results for names like "jose" when the stored value is "José". Which LIKE pattern finds ALL users whose name STARTS with "P"?',
          options: [
            { id: 'a', text: 'WHERE name = "P%"', isCorrect: false },
            { id: 'b', text: 'WHERE name LIKE "P%"', isCorrect: true },
            { id: 'c', text: 'WHERE name STARTS "P"', isCorrect: false },
            { id: 'd', text: 'WHERE name CONTAINS "P%"', isCorrect: false },
          ],
          explanation: 'LIKE uses wildcards: % matches any sequence of characters, _ matches exactly one character. "P%" means "starts with P, followed by anything". The = operator does an exact match — "P%" would literally look for a name that is the two characters "P%". STARTS and CONTAINS are not valid SQL.'
        },
      ]
    },
    {
      level: 'sql-case-null',
      questions: [
        {
          question: 'A query checks WHERE discount = NULL to find products with no discount. It returns 0 rows even though many products have no discount. Why?',
          options: [
            { id: 'a', text: 'The discount column has a default value of 0, not NULL.', isCorrect: false },
            { id: 'b', text: 'NULL cannot be compared with = in SQL. You must use IS NULL.', isCorrect: true },
            { id: 'c', text: 'The query is missing a GROUP BY clause.', isCorrect: false },
            { id: 'd', text: 'discount is a reserved word and cannot be used in WHERE.', isCorrect: false },
          ],
          explanation: 'NULL represents the absence of a value. In SQL, NULL = NULL evaluates to NULL (not TRUE), so WHERE discount = NULL never matches anything. The correct syntax is WHERE discount IS NULL. This is one of the most common SQL mistakes for beginners.'
        },
        {
          question: 'A user\'s total bill is calculated as: amount + tax + shipping. Some orders have NULL shipping. What does amount + NULL return?',
          options: [
            { id: 'a', text: 'The amount value unchanged — NULL is treated as 0.', isCorrect: false },
            { id: 'b', text: 'NULL — any arithmetic with NULL returns NULL.', isCorrect: true },
            { id: 'c', text: 'An error — you cannot add NULL to a number.', isCorrect: false },
            { id: 'd', text: '0 — NULL is converted to 0 in arithmetic.', isCorrect: false },
          ],
          explanation: 'Any mathematical operation involving NULL produces NULL. 5 + NULL = NULL. This is why order totals silently become NULL when any fee field is missing. The fix is: amount + COALESCE(tax, 0) + COALESCE(shipping, 0) — COALESCE substitutes a default when NULL is encountered.'
        },
        {
          question: 'You want to display an order\'s discount percentage, but show 0 if no discount is set (NULL). Which function handles this?',
          options: [
            { id: 'a', text: 'IFNULL(discount, 0) or COALESCE(discount, 0)', isCorrect: true },
            { id: 'b', text: 'NULLIF(discount, 0)', isCorrect: false },
            { id: 'c', text: 'IS NOT NULL(discount, 0)', isCorrect: false },
            { id: 'd', text: 'DEFAULT(discount, 0)', isCorrect: false },
          ],
          explanation: 'COALESCE(discount, 0) returns the first non-NULL value — discount if it exists, otherwise 0. NULLIF does the opposite: it returns NULL when a value equals a given value (like NULLIF(discount, 0) returns NULL when discount is 0). They solve opposite problems.'
        },
        {
          question: 'A QA report needs to label orders as "High", "Medium", or "Low" based on amount: >50000 = High, >10000 = Medium, else Low. Which SQL feature generates this label column?',
          options: [
            { id: 'a', text: 'GROUP BY amount', isCorrect: false },
            { id: 'b', text: 'A CASE statement in the SELECT clause', isCorrect: true },
            { id: 'c', text: 'A subquery in the WHERE clause', isCorrect: false },
            { id: 'd', text: 'COALESCE(amount, "Low")', isCorrect: false },
          ],
          explanation: 'CASE WHEN amount > 50000 THEN "High" WHEN amount > 10000 THEN "Medium" ELSE "Low" END creates a computed column with conditional logic. This is the SQL equivalent of an if-else chain and is extremely useful for categorising data in reports and QA dashboards.'
        },
        {
          question: 'You need to count how many orders are in each status (pending, shipped, delivered) in a SINGLE ROW with three separate count columns. Which approach achieves this?',
          options: [
            { id: 'a', text: 'Three separate SELECT COUNT queries joined with UNION.', isCorrect: false },
            { id: 'b', text: 'COUNT(CASE WHEN status = "X" THEN 1 END) for each status in one SELECT.', isCorrect: true },
            { id: 'c', text: 'GROUP BY status — it automatically pivots into columns.', isCorrect: false },
            { id: 'd', text: 'SELECT COUNT(*) WHERE status IN ("pending", "shipped", "delivered").', isCorrect: false },
          ],
          explanation: 'Conditional aggregation uses CASE inside COUNT to count only rows matching each condition. COUNT(CASE WHEN status = "pending" THEN 1 END) counts pending rows; NULLs (non-matching rows) are automatically ignored by COUNT. This runs in a single pass — far more efficient than three separate queries.'
        },
      ]
    },

    // ─── EXPERT ──────────────────────────────────────────────────────────────
    {
      level: 'sql-window-functions',
      questions: [
        {
          question: 'Your test report needs to show each build\'s failure count AND its rank among all builds this week. Which SQL feature lets you add a rank column WITHOUT removing any rows from the result?',
          options: [
            { id: 'a', text: 'GROUP BY — collapse rows and show the rank per group.', isCorrect: false },
            { id: 'b', text: 'A Window Function with RANK() OVER (ORDER BY failed_tests DESC).', isCorrect: true },
            { id: 'c', text: 'A subquery that counts rows per build.', isCorrect: false },
            { id: 'd', text: 'DISTINCT — it assigns a unique rank to each row.', isCorrect: false },
          ],
          explanation: 'Window functions like RANK() OVER (...) compute a value across related rows without collapsing them. Every build row stays in the result AND gets its own rank column — exactly what GROUP BY cannot do.'
        },
        {
          question: 'Three builds have failure counts of 15, 12, and 12. Using RANK() OVER (ORDER BY failures DESC), what ranks will the three builds get?',
          options: [
            { id: 'a', text: '1, 2, 3 — RANK always assigns unique sequential numbers.', isCorrect: false },
            { id: 'b', text: '1, 2, 2 — the tied builds share rank 2, and rank 3 is skipped.', isCorrect: true },
            { id: 'c', text: '1, 1, 2 — the top two share rank 1.', isCorrect: false },
            { id: 'd', text: '1, 2, 2 — the tied builds share rank 2, and the next rank is 3 (no skipping).', isCorrect: false },
          ],
          explanation: 'RANK() gives tied rows the same rank and then SKIPS the next rank(s). So 1, 2, 2, 4. If you do not want skipping, use DENSE_RANK() which gives 1, 2, 2, 3.'
        },
        {
          question: 'You need a daily bug report that shows bugs found each day AND a running total so you can see the cumulative bugs at any point in the sprint. Which function produces the running total?',
          options: [
            { id: 'a', text: 'SUM(bugs_found) GROUP BY report_date', isCorrect: false },
            { id: 'b', text: 'COUNT(*) OVER (ORDER BY report_date)', isCorrect: false },
            { id: 'c', text: 'SUM(bugs_found) OVER (ORDER BY report_date)', isCorrect: true },
            { id: 'd', text: 'TOTAL(bugs_found) PARTITION BY report_date', isCorrect: false },
          ],
          explanation: 'SUM() OVER (ORDER BY date) computes a cumulative running total — each row gets the sum of all rows up to and including itself. This is the bank passbook pattern: transaction amount + running balance in the same row.'
        },
        {
          question: 'A bug report says the checkout flow regressed in build v3. You want to compare each build\'s failure count to the PREVIOUS build to confirm. Which window function gives you the previous row\'s value?',
          options: [
            { id: 'a', text: 'LEAD() — it looks at the next row.', isCorrect: false },
            { id: 'b', text: 'LAG() — it looks at the previous row.', isCorrect: true },
            { id: 'c', text: 'RANK() — it shows the relative position.', isCorrect: false },
            { id: 'd', text: 'ROW_NUMBER() — it gives the row above its number.', isCorrect: false },
          ],
          explanation: 'LAG(column, 1) OVER (ORDER BY build_id) retrieves the value from the previous row. LEAD() is its mirror — it peeks at the next row. Combined with the current row\'s value, you can compute change = current_failures - LAG(failures).'
        },
        {
          question: 'You want to rank test cases by execution time, but SEPARATELY for each module (so the slowest test in Module A gets rank 1, and the slowest in Module B also gets rank 1). Which clause achieves this?',
          options: [
            { id: 'a', text: 'GROUP BY module_name, then RANK().', isCorrect: false },
            { id: 'b', text: 'RANK() OVER (ORDER BY execution_ms DESC) — ranking is always global.', isCorrect: false },
            { id: 'c', text: 'RANK() OVER (PARTITION BY module_name ORDER BY execution_ms DESC)', isCorrect: true },
            { id: 'd', text: 'RANK() OVER (FILTER BY module_name ORDER BY execution_ms DESC)', isCorrect: false },
          ],
          explanation: 'PARTITION BY inside the OVER clause creates separate windows per group. The ranking resets to 1 for each partition (module). Think of it as separate leaderboards per module, all computed in one query.'
        },
      ]
    },

    {
      level: 'sql-cte',
      questions: [
        {
          question: 'You have a complex 4-step test data verification query. When you write it as nested subqueries, it becomes unreadable. Which SQL feature lets you name and extract each step so the final query reads like plain English?',
          options: [
            { id: 'a', text: 'A stored procedure — store each step as a separate procedure.', isCorrect: false },
            { id: 'b', text: 'A CTE (WITH clause) — name each sub-result and reference it by name in the final SELECT.', isCorrect: true },
            { id: 'c', text: 'A VIEW — create a permanent view for each step.', isCorrect: false },
            { id: 'd', text: 'UNION ALL — chain all steps sequentially.', isCorrect: false },
          ],
          explanation: 'CTEs (WITH clause) let you name sub-results at the top of your query. The final SELECT just references those names — making multi-step queries readable, maintainable, and easy to explain to colleagues.'
        },
        {
          question: 'A CTE named "active_users" is referenced TWICE in the main query. What happens — does the database compute it twice?',
          options: [
            { id: 'a', text: 'Yes — the CTE runs once for each reference, potentially doubling work.', isCorrect: false },
            { id: 'b', text: 'No — the CTE is always computed exactly once and the result is reused.', isCorrect: false },
            { id: 'c', text: 'It depends on the database — some inline CTEs (compute per reference), others materialise once.', isCorrect: true },
            { id: 'd', text: 'CTEs cannot be referenced more than once — this would be a syntax error.', isCorrect: false },
          ],
          explanation: 'Behaviour varies: PostgreSQL and SQL Server may materialise (compute once and cache), but MySQL often inlines (re-runs per reference). The key benefit is readability — you avoid writing the same subquery twice regardless. For guaranteed single-execution, use a temp table.'
        },
        {
          question: 'You want to find all users who completed an order but never received a confirmation email. Which pattern best solves this with CTEs?',
          options: [
            { id: 'a', text: 'One CTE for ordered_users, another for emailed_users, then SELECT from ordered_users WHERE user_id NOT IN emailed_users.', isCorrect: true },
            { id: 'b', text: 'A GROUP BY on the orders table filtered by email_logs.', isCorrect: false },
            { id: 'c', text: 'A CROSS JOIN between orders and email_logs.', isCorrect: false },
            { id: 'd', text: 'A UNION of orders and email_logs filtered by user_id.', isCorrect: false },
          ],
          explanation: 'Multiple CTEs make this readable: first isolate "users who ordered" and "users who received emails" as separate named steps. Then the final query is just "who is in Step 1 but NOT Step 2" — a clean, self-documenting verification query.'
        },
        {
          question: 'A QA regression check needs to compare test results between build v2.1.0 and v2.2.0 and label each test as REGRESSION, FIXED, or UNCHANGED. What is the cleanest approach?',
          options: [
            { id: 'a', text: 'Run two separate SELECT queries and manually compare in a spreadsheet.', isCorrect: false },
            { id: 'b', text: 'Use CTEs to extract each build\'s results separately, then JOIN them and apply a CASE expression for the verdict.', isCorrect: true },
            { id: 'c', text: 'Use GROUP BY on build_id and HAVING to filter changed tests.', isCorrect: false },
            { id: 'd', text: 'Use a FULL OUTER JOIN directly without CTEs and inline the CASE.', isCorrect: false },
          ],
          explanation: 'CTEs named build_a and build_b let you isolate each build cleanly. The final query JOINs them on test_name and applies CASE to produce the verdict. This is far more readable than embedding both filters in a single complex JOIN condition.'
        },
        {
          question: 'You need to find all employees in an org chart who report to a specific VP — including their reports, their reports\' reports, and so on (unlimited depth). Which SQL feature handles this?',
          options: [
            { id: 'a', text: 'A correlated subquery with CONNECT BY.', isCorrect: false },
            { id: 'b', text: 'Multiple self-joins, one per level.', isCorrect: false },
            { id: 'c', text: 'A RECURSIVE CTE — it starts with the VP row and repeatedly adds direct reports until no more are found.', isCorrect: true },
            { id: 'd', text: 'A window function with PARTITION BY manager_id.', isCorrect: false },
          ],
          explanation: 'A RECURSIVE CTE has two parts: the base case (start with the VP) and the recursive step (join employees to the CTE on manager_id). It repeats until the join returns no new rows. This is the standard pattern for hierarchical data like org charts and permission trees.'
        },
      ]
    },

    {
      level: 'sql-advanced-joins',
      questions: [
        {
          question: 'Your Employees table has columns: id, name, manager_id (which references id in the SAME table). You want to list every employee next to their manager\'s name. Which JOIN type do you use?',
          options: [
            { id: 'a', text: 'CROSS JOIN — to combine every employee with every other employee.', isCorrect: false },
            { id: 'b', text: 'SELF JOIN — joining the Employees table to itself using two aliases.', isCorrect: true },
            { id: 'c', text: 'FULL OUTER JOIN — to include both employees and managers.', isCorrect: false },
            { id: 'd', text: 'A subquery — self-joins are not possible in SQL.', isCorrect: false },
          ],
          explanation: 'A SELF JOIN joins a table to itself by aliasing it twice: "FROM employees e JOIN employees m ON e.manager_id = m.id". You use LEFT JOIN so top-level managers (with NULL manager_id) still appear in the results.'
        },
        {
          question: 'After a user migration, you suspect duplicate accounts exist (same email, different IDs). Which query finds them using a SELF JOIN without showing each pair twice?',
          options: [
            { id: 'a', text: 'SELECT a.id, b.id FROM users a JOIN users b ON a.email = b.email', isCorrect: false },
            { id: 'b', text: 'SELECT a.id, b.id FROM users a JOIN users b ON a.email = b.email AND a.id < b.id', isCorrect: true },
            { id: 'c', text: 'SELECT a.id, b.id FROM users a CROSS JOIN users b WHERE a.email = b.email', isCorrect: false },
            { id: 'd', text: 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1', isCorrect: false },
          ],
          explanation: 'Without "AND a.id < b.id", the pair (1,2) and (2,1) would both appear. The "less than" condition ensures each pair is shown exactly once. Option D finds the emails but doesn\'t identify the duplicate IDs — you can\'t act on it without the SELF JOIN approach.'
        },
        {
          question: 'You want to automatically generate a test compatibility matrix for all browser + OS combinations (3 browsers × 4 OS = 12 rows) without typing them manually. Which JOIN creates all possible combinations?',
          options: [
            { id: 'a', text: 'INNER JOIN with no ON condition.', isCorrect: false },
            { id: 'b', text: 'LEFT JOIN between browsers and operating_systems.', isCorrect: false },
            { id: 'c', text: 'CROSS JOIN between browsers and operating_systems.', isCorrect: true },
            { id: 'd', text: 'FULL OUTER JOIN between browsers and operating_systems.', isCorrect: false },
          ],
          explanation: 'CROSS JOIN produces every possible combination (cartesian product) of two tables. With no ON condition needed, 3 browsers × 4 OS = 12 rows. Perfect for generating test matrices, seating charts, or any "all combinations" scenario.'
        },
        {
          question: 'You are joining 4 tables: orders → users (INNER), orders → payments (LEFT), payments → refunds (LEFT). An order has no payment record yet. What happens to that order row in the result?',
          options: [
            { id: 'a', text: 'It is dropped — INNER JOIN with users already excludes unmatched rows.', isCorrect: false },
            { id: 'b', text: 'It appears in the result with NULL for all payment and refund columns.', isCorrect: true },
            { id: 'c', text: 'The LEFT JOIN to payments causes an error when no match exists.', isCorrect: false },
            { id: 'd', text: 'It is dropped because you cannot chain LEFT JOINs after an INNER JOIN.', isCorrect: false },
          ],
          explanation: 'LEFT JOIN always preserves the left table\'s rows. If no matching payment exists, all payment columns become NULL, and all refund columns (which depend on payment) also become NULL. The order row survives because INNER JOIN with users succeeded.'
        },
        {
          question: 'You have a bug_severity_thresholds table with columns: min_score, max_score, severity_label. You want to label each bug with its severity based on its impact_score falling within a range. Which JOIN handles this?',
          options: [
            { id: 'a', text: 'INNER JOIN ON bugs.impact_score = thresholds.min_score', isCorrect: false },
            { id: 'b', text: 'LEFT JOIN ON bugs.impact_score = thresholds.severity_label', isCorrect: false },
            { id: 'c', text: 'INNER JOIN ON bugs.impact_score BETWEEN thresholds.min_score AND thresholds.max_score', isCorrect: true },
            { id: 'd', text: 'CROSS JOIN with a HAVING clause to filter by score range.', isCorrect: false },
          ],
          explanation: 'This is a non-equi JOIN — the join condition uses BETWEEN instead of equals. It matches each bug to the severity tier whose range contains its score. This pattern is common for grade-letter assignments, tax brackets, and SLA classification.'
        },
      ]
    },

    {
      level: 'sql-stored-procedures',
      questions: [
        {
          question: 'As a QA tester, you need to test the "process_refund" stored procedure. You call it with a valid completed order ID. What THREE things should you verify after the call?',
          options: [
            { id: 'a', text: 'Only the OUT parameter result — if it says SUCCESS, the procedure worked.', isCorrect: false },
            { id: 'b', text: 'The OUT parameter result, the order\'s new status in the orders table, AND a new row in the refunds table.', isCorrect: true },
            { id: 'c', text: 'The procedure\'s source code to confirm the logic is correct.', isCorrect: false },
            { id: 'd', text: 'Only the refunds table — the order status is managed separately.', isCorrect: false },
          ],
          explanation: 'Testing a stored procedure means verifying ALL side effects, not just the return value. A procedure can say "SUCCESS" but still fail to create the refund record. Always check: (1) return/OUT value, (2) all tables that should have changed, (3) tables that should NOT have changed.'
        },
        {
          question: 'A stored procedure is called twice in quick succession with the same order ID. The first call succeeds (refund created). What should the SECOND call return?',
          options: [
            { id: 'a', text: 'SUCCESS — it is idempotent and safe to call multiple times.', isCorrect: false },
            { id: 'b', text: 'An error or "not eligible" message — the order is no longer in "completed" status.', isCorrect: true },
            { id: 'c', text: 'It depends on whether a transaction is used.', isCorrect: false },
            { id: 'd', text: 'A duplicate refund record — the procedure has no duplicate check.', isCorrect: false },
          ],
          explanation: 'After the first call, the order status changes to "refunded". A well-written procedure checks the status before processing, so the second call should detect the order is not "completed" and return an error. If the second call ALSO succeeds, that is a bug — a double-refund vulnerability.'
        },
        {
          question: 'What is the key difference between a stored PROCEDURE and a stored FUNCTION in SQL?',
          options: [
            { id: 'a', text: 'Procedures are faster; functions are slower.', isCorrect: false },
            { id: 'b', text: 'A function always returns ONE value and can be used inside SELECT. A procedure runs a process, can modify data, and is called with CALL.', isCorrect: true },
            { id: 'c', text: 'Functions can modify tables; procedures cannot.', isCorrect: false },
            { id: 'd', text: 'They are exactly the same — "function" and "procedure" are interchangeable.', isCorrect: false },
          ],
          explanation: 'Functions return a single value and plug into queries like a built-in function: SELECT get_discount_pct(5000). Procedures run complex operations (INSERT/UPDATE/loops) and are called separately: CALL process_refund(42, \'damaged\', @result). Functions cannot modify data in most databases.'
        },
        {
          question: 'You want to test a stored procedure but NOT leave test data in the database permanently. What is the cleanest approach?',
          options: [
            { id: 'a', text: 'Delete all inserted rows manually after each test.', isCorrect: false },
            { id: 'b', text: 'Wrap the test in START TRANSACTION ... ROLLBACK so all changes are automatically undone.', isCorrect: true },
            { id: 'c', text: 'Only test procedures in a stored procedure, not in a plain SQL script.', isCorrect: false },
            { id: 'd', text: 'Use a SELECT-only procedure that does not modify any data.', isCorrect: false },
          ],
          explanation: 'START TRANSACTION lets you run the procedure and observe all database changes. Then ROLLBACK undoes everything, leaving the database exactly as before. This is the gold standard for transactional testing — clean, repeatable, and no manual cleanup needed.'
        },
        {
          question: 'A discount function is supposed to return 15% for orders over ₹10,000, 10% for ₹5,000-₹9,999, 5% for ₹1,000-₹4,999, and 0% below. Which amount is the most important boundary value to test?',
          options: [
            { id: 'a', text: '₹500 and ₹15,000 only — test the extremes.', isCorrect: false },
            { id: 'b', text: '₹999, ₹1,000, ₹4,999, ₹5,000, ₹9,999, ₹10,000 — every boundary on both sides.', isCorrect: true },
            { id: 'c', text: '₹1,000, ₹5,000, ₹10,000 only — the exact thresholds are sufficient.', isCorrect: false },
            { id: 'd', text: 'Random values like ₹1,234, ₹6,789, ₹11,111.', isCorrect: false },
          ],
          explanation: 'Boundary Value Analysis (BVA) says test AT the boundary AND one on each side: ₹999 (0%), ₹1,000 (5%), ₹4,999 (5%), ₹5,000 (10%), ₹9,999 (10%), ₹10,000 (15%). The most common bugs are off-by-one errors — using > instead of >=, which only testing the exact boundary catches.'
        },
      ]
    },

    {
      level: 'sql-triggers-constraints',
      questions: [
        {
          question: 'Every time an order status changes, you need a row automatically created in an order_audit_log table. No application code should be responsible. What database feature handles this?',
          options: [
            { id: 'a', text: 'A CHECK constraint — it validates data and logs changes.', isCorrect: false },
            { id: 'b', text: 'An AFTER UPDATE trigger on the orders table that INSERT into the audit log.', isCorrect: true },
            { id: 'c', text: 'A VIEW that mirrors the orders table with timestamps.', isCorrect: false },
            { id: 'd', text: 'A stored procedure that must be called manually after each update.', isCorrect: false },
          ],
          explanation: 'An AFTER UPDATE trigger fires automatically every time an UPDATE happens on the orders table, with no application code needed. Inside the trigger, OLD.status and NEW.status give you the before and after values to write to the audit log.'
        },
        {
          question: 'You are testing an order_audit_log trigger. After running "UPDATE orders SET status = \'shipped\' WHERE id = 42", how do you verify the trigger fired correctly?',
          options: [
            { id: 'a', text: 'Check the application logs — triggers always write to the app log.', isCorrect: false },
            { id: 'b', text: 'Query the order_audit_log table and confirm a new row exists with old_status=\'confirmed\' and new_status=\'shipped\' for order 42.', isCorrect: true },
            { id: 'c', text: 'Run SHOW TRIGGERS to see if the trigger is enabled.', isCorrect: false },
            { id: 'd', text: 'Check the orders table — the trigger result is stored there.', isCorrect: false },
          ],
          explanation: 'Testing a trigger means verifying its SIDE EFFECT — the row it was supposed to create. Always query the target table directly with specific assertions: correct order_id, correct old and new values, and a recent timestamp. Never assume the trigger fired just because the main UPDATE succeeded.'
        },
        {
          question: 'A CHECK constraint is defined as: CHECK (status IN (\'pending\', \'confirmed\', \'shipped\', \'delivered\', \'refunded\')). What happens when you INSERT a row with status = \'processing\'?',
          options: [
            { id: 'a', text: 'The INSERT succeeds — CHECK constraints only work on UPDATE.', isCorrect: false },
            { id: 'b', text: 'The value is auto-corrected to the closest valid status.', isCorrect: false },
            { id: 'c', text: 'The INSERT fails with a constraint violation error — the row is rejected.', isCorrect: true },
            { id: 'd', text: 'The constraint is skipped if no trigger is defined.', isCorrect: false },
          ],
          explanation: 'CHECK constraints are enforced at INSERT and UPDATE time. Any value not in the allowed list causes the operation to fail immediately with an error. The row is never saved. This is database-level validation — it works even if the application sends bad data.'
        },
        {
          question: 'A foreign key is defined with ON DELETE CASCADE between users and orders. A test user (id=9999) has 3 orders. You delete user 9999. How many total rows are deleted?',
          options: [
            { id: 'a', text: '1 — only the user row; orders must be deleted separately.', isCorrect: false },
            { id: 'b', text: '4 — the 1 user row plus the 3 order rows, automatically.', isCorrect: true },
            { id: 'c', text: 'An error is thrown — you cannot delete a user who has orders.', isCorrect: false },
            { id: 'd', text: '3 — only the orders are deleted; the user row needs manual deletion.', isCorrect: false },
          ],
          explanation: 'ON DELETE CASCADE automatically deletes all child rows (orders) when the parent row (user) is deleted. The 1 user + 3 orders = 4 rows disappear in one DELETE statement. Without CASCADE, the database would throw a foreign key constraint error to prevent orphaned order records.'
        },
        {
          question: 'You want to test that a BEFORE INSERT trigger correctly normalises the currency column to uppercase. You INSERT a row with currency = \'usd\'. What should you check?',
          options: [
            { id: 'a', text: 'The trigger logs in the application server should show the conversion happened.', isCorrect: false },
            { id: 'b', text: 'SELECT currency FROM orders WHERE id = <new_id> — it should return \'USD\', not \'usd\'.', isCorrect: true },
            { id: 'c', text: 'Run DESCRIBE orders — the column type will show the normalisation rule.', isCorrect: false },
            { id: 'd', text: 'The INSERT would fail because \'usd\' is invalid.', isCorrect: false },
          ],
          explanation: 'A BEFORE INSERT trigger modifies the data BEFORE it is saved. So querying the saved row should show the transformed value. If you insert \'usd\' and SELECT returns \'usd\' (not \'USD\'), the trigger either did not fire or has a bug in its UPPER() logic.'
        },
      ]
    },

    {
      level: 'sql-query-plan',
      questions: [
        {
          question: 'During performance testing, a feature\'s main query takes 4,200ms with 100,000 rows. Your SLA is 200ms. You run EXPLAIN ANALYZE and see "Seq Scan on orders". What does this mean?',
          options: [
            { id: 'a', text: 'The query is sequential — it runs multiple subqueries one after the other.', isCorrect: false },
            { id: 'b', text: 'The database is reading EVERY row in the orders table from start to finish, with no shortcut.', isCorrect: true },
            { id: 'c', text: 'The query uses a sequence to generate IDs.', isCorrect: false },
            { id: 'd', text: 'Seq Scan is the fastest scan type — this is expected.', isCorrect: false },
          ],
          explanation: 'Seq Scan (Sequential Scan) means the database reads every single row, like a librarian reading an entire book to find one sentence. It is acceptable for small tables but disastrous on large ones. The fix is to add an index so the database can jump directly to matching rows (Index Scan).'
        },
        {
          question: 'After adding an index on orders(user_id), you re-run EXPLAIN and the output changes from "Seq Scan on orders" to "Index Scan using idx_orders_user_id on orders". What does this confirm?',
          options: [
            { id: 'a', text: 'The query now runs faster, and the index is being used as expected.', isCorrect: true },
            { id: 'b', text: 'The database is now reading more rows because the index is larger.', isCorrect: false },
            { id: 'c', text: 'The index was added but the query plan has not been updated yet.', isCorrect: false },
            { id: 'd', text: 'Only SELECT queries benefit — INSERT and UPDATE still do a Seq Scan.', isCorrect: false },
          ],
          explanation: 'An Index Scan means the database uses the index to jump directly to matching rows — like using a book\'s index to find the right page. Seeing this in EXPLAIN confirms your index is actively used. The cost and actual time should also drop significantly — document both before and after for your performance report.'
        },
        {
          question: 'EXPLAIN shows "cost=0.00..3420.50 rows=847". After running EXPLAIN ANALYZE, the actual rows is 24,000. What problem does this indicate?',
          options: [
            { id: 'a', text: 'The query has a bug and is returning too many rows.', isCorrect: false },
            { id: 'b', text: 'The optimizer\'s statistics are stale — it underestimated the row count by ~28×, likely choosing a suboptimal plan.', isCorrect: true },
            { id: 'c', text: 'The index is broken and needs to be rebuilt.', isCorrect: false },
            { id: 'd', text: 'The database is running in slow mode — restart it.', isCorrect: false },
          ],
          explanation: 'When estimated rows differs wildly from actual rows, the optimizer\'s statistics are outdated. It may choose a bad execution plan (like picking a Seq Scan thinking the table is small). The fix is to run ANALYZE on the table to refresh statistics, then re-check the plan.'
        },
        {
          question: 'A WHERE clause uses: WHERE YEAR(created_at) = 2024. EXPLAIN shows a Seq Scan even though created_at has an index. Why is the index not used?',
          options: [
            { id: 'a', text: 'Indexes do not work on DATE columns — only VARCHAR and INT.', isCorrect: false },
            { id: 'b', text: 'Wrapping a column in a function (YEAR()) prevents the database from using the index on that column.', isCorrect: true },
            { id: 'c', text: 'The index needs to be rebuilt after inserting new rows.', isCorrect: false },
            { id: 'd', text: 'YEAR() forces a full table scan by design — it is a known limitation.', isCorrect: false },
          ],
          explanation: 'Applying a function to an indexed column (YEAR(created_at), LOWER(email), etc.) breaks index usage because the index stores raw values, not computed ones. Fix: use a range instead — WHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'. This is a very common performance bug to catch during QA.'
        },
        {
          question: 'Your performance test report should document a query optimisation. Before the index, EXPLAIN ANALYZE shows actual time = 1,240ms. After the index, actual time = 38ms. How should you frame this in the report?',
          options: [
            { id: 'a', text: '"The query is now faster." — brief and accurate.', isCorrect: false },
            { id: 'b', text: '"Query X improved from Seq Scan (1,240ms) to Index Scan (38ms) after adding idx_orders_user_id — a 97% reduction in execution time."', isCorrect: true },
            { id: 'c', text: '"Index added. Performance improved." — short and to the point.', isCorrect: false },
            { id: 'd', text: 'No documentation needed — the index is a developer\'s responsibility, not QA\'s.', isCorrect: false },
          ],
          explanation: 'A strong performance test report includes: the specific query, the scan type before and after, the measurable improvement (ms and percentage), and the exact index used. This gives developers actionable evidence and gives managers business impact context. Vague statements like "it\'s faster" add no value.'
        },
      ]
    },
  ],
  api: [
    // ── BEGINNER ──────────────────────────────────────────────────
    {
      level: 'api-what-is-api',
      questions: [
        {
          question: 'What does API stand for?',
          options: [
            { id: 'a', text: 'Automated Program Instruction', isCorrect: false },
            { id: 'b', text: 'Application Programming Interface', isCorrect: true },
            { id: 'c', text: 'Advanced Protocol Integration', isCorrect: false },
            { id: 'd', text: 'Automated Page Interaction', isCorrect: false },
          ],
          explanation: 'API = Application Programming Interface. It is the middleman that lets two software systems talk to each other.'
        },
        {
          question: 'Which real-world analogy best describes how an API works?',
          options: [
            { id: 'a', text: 'A waiter who takes your order to the kitchen and brings back your food.', isCorrect: true },
            { id: 'b', text: 'A chef who cooks the food themselves.', isCorrect: false },
            { id: 'c', text: 'A refrigerator that stores leftover data.', isCorrect: false },
            { id: 'd', text: 'A customer who eats the food.', isCorrect: false },
          ],
          explanation: 'You (client) tell the waiter (API) what you want. The waiter tells the kitchen (server), and brings the result back — you never go into the kitchen directly.'
        },
        {
          question: 'Which of these is a real-world example of using an API?',
          options: [
            { id: 'a', text: 'Opening Microsoft Word on your laptop.', isCorrect: false },
            { id: 'b', text: 'A travel website fetching live flight data from airline servers.', isCorrect: true },
            { id: 'c', text: 'Typing text into a local Notepad file.', isCorrect: false },
            { id: 'd', text: 'Changing your desktop wallpaper.', isCorrect: false },
          ],
          explanation: 'The travel site uses an API to request data from the airline\'s server and display it to you — classic API consumer pattern.'
        },
        {
          question: 'In API terms, what is the "client"?',
          options: [
            { id: 'a', text: 'The database storing user information.', isCorrect: false },
            { id: 'b', text: 'The company that built the API.', isCorrect: false },
            { id: 'c', text: 'The app or system that sends a request to the API.', isCorrect: true },
            { id: 'd', text: 'The server that processes the request.', isCorrect: false },
          ],
          explanation: 'The client initiates requests. The server responds. As a QA tester, tools like Postman act as your client when you send API requests manually.'
        },
        {
          question: 'Why do companies expose public APIs?',
          options: [
            { id: 'a', text: 'To allow other apps to use their data or services in a controlled way.', isCorrect: true },
            { id: 'b', text: 'To let anyone access their private database directly.', isCorrect: false },
            { id: 'c', text: 'To replace their website entirely.', isCorrect: false },
            { id: 'd', text: 'To slow down competitors.', isCorrect: false },
          ],
          explanation: 'Public APIs let third-party developers build on top of a platform — like apps using Google Maps or the Stripe payment API. Access is controlled via keys and docs.'
        },
      ],
    },
    {
      level: 'api-http-methods',
      questions: [
        {
          question: 'Which HTTP method is used to READ data from a server without changing anything?',
          options: [
            { id: 'a', text: 'POST', isCorrect: false },
            { id: 'b', text: 'PUT', isCorrect: false },
            { id: 'c', text: 'GET', isCorrect: true },
            { id: 'd', text: 'DELETE', isCorrect: false },
          ],
          explanation: 'GET is read-only. It fetches data without modifying it. Think of it as "give me the menu, don\'t cook anything yet."'
        },
        {
          question: 'Which HTTP method is best for CREATING a brand new resource on the server?',
          options: [
            { id: 'a', text: 'GET', isCorrect: false },
            { id: 'b', text: 'PATCH', isCorrect: false },
            { id: 'c', text: 'DELETE', isCorrect: false },
            { id: 'd', text: 'POST', isCorrect: true },
          ],
          explanation: 'POST sends data to the server to create something new. After a successful POST you typically get a 201 Created response.'
        },
        {
          question: 'What is the key difference between PUT and PATCH?',
          options: [
            { id: 'a', text: 'PUT deletes a record; PATCH retrieves it.', isCorrect: false },
            { id: 'b', text: 'PUT replaces the entire resource; PATCH updates only specific fields.', isCorrect: true },
            { id: 'c', text: 'They are identical — just different naming conventions.', isCorrect: false },
            { id: 'd', text: 'PATCH creates new records; PUT reads existing ones.', isCorrect: false },
          ],
          explanation: 'PUT = full replacement (send all fields). PATCH = partial update (send only the fields you want to change). As a tester, check that missing fields in PUT don\'t wipe data.'
        },
        {
          question: 'A QA tester wants to check if a resource URL is valid without downloading the full response body. Which method should they use?',
          options: [
            { id: 'a', text: 'GET', isCorrect: false },
            { id: 'b', text: 'OPTIONS', isCorrect: false },
            { id: 'c', text: 'HEAD', isCorrect: true },
            { id: 'd', text: 'TRACE', isCorrect: false },
          ],
          explanation: 'HEAD returns only the headers (status code, content-type, etc.) without the body — great for checking if a resource exists or checking cache freshness efficiently.'
        },
        {
          question: 'Which HTTP method should return a list of allowed operations for a given URL?',
          options: [
            { id: 'a', text: 'OPTIONS', isCorrect: true },
            { id: 'b', text: 'GET', isCorrect: false },
            { id: 'c', text: 'PUT', isCorrect: false },
            { id: 'd', text: 'POST', isCorrect: false },
          ],
          explanation: 'OPTIONS returns the Allow header listing which methods (GET, POST, PUT, etc.) are permitted on an endpoint. Also used in CORS pre-flight checks.'
        },
      ],
    },
    {
      level: 'api-request-anatomy',
      questions: [
        {
          question: 'What are the four main components of an HTTP request?',
          options: [
            { id: 'a', text: 'Method, URL, Headers, Body', isCorrect: true },
            { id: 'b', text: 'Status Code, Headers, Body, Cookies', isCorrect: false },
            { id: 'c', text: 'URL, Database, Response, Token', isCorrect: false },
            { id: 'd', text: 'Client, Server, Proxy, Gateway', isCorrect: false },
          ],
          explanation: 'Every HTTP request has: a Method (GET/POST/…), a URL (where to go), Headers (metadata), and an optional Body (data to send).'
        },
        {
          question: 'Where do query parameters appear in a URL?',
          options: [
            { id: 'a', text: 'Before the domain name.', isCorrect: false },
            { id: 'b', text: 'After a ? symbol, in key=value pairs joined by &.', isCorrect: true },
            { id: 'c', text: 'Inside the request body.', isCorrect: false },
            { id: 'd', text: 'In the Authorization header.', isCorrect: false },
          ],
          explanation: 'Example: GET /users?role=admin&active=true — the ? starts the query string and & separates parameters. They\'re used for filtering, sorting, and searching.'
        },
        {
          question: 'Where should you put a Bearer token when making an authenticated API request?',
          options: [
            { id: 'a', text: 'In the URL as a query parameter.', isCorrect: false },
            { id: 'b', text: 'In the request body.', isCorrect: false },
            { id: 'c', text: 'In the Authorization header.', isCorrect: true },
            { id: 'd', text: 'In the Content-Type header.', isCorrect: false },
          ],
          explanation: 'The correct format is: Authorization: Bearer <your_token>. Putting tokens in URLs is dangerous — they end up in browser history and server logs.'
        },
        {
          question: 'What is the Base URL of an API?',
          options: [
            { id: 'a', text: 'The unique ID assigned to each API response.', isCorrect: false },
            { id: 'b', text: 'The root address that all endpoint paths are appended to.', isCorrect: true },
            { id: 'c', text: 'The secret key used to authenticate requests.', isCorrect: false },
            { id: 'd', text: 'The database connection string.', isCorrect: false },
          ],
          explanation: 'Example: https://api.example.com/v1 is the Base URL. Individual endpoints like /users or /orders get appended to it.'
        },
        {
          question: 'Which Content-Type header value tells the server you\'re sending JSON data?',
          options: [
            { id: 'a', text: 'text/plain', isCorrect: false },
            { id: 'b', text: 'application/xml', isCorrect: false },
            { id: 'c', text: 'application/json', isCorrect: true },
            { id: 'd', text: 'multipart/form-data', isCorrect: false },
          ],
          explanation: 'Content-Type: application/json tells the server: "my request body is JSON — parse it accordingly." Without this, the server may misread your data.'
        },
      ],
    },
    {
      level: 'api-response-anatomy',
      questions: [
        {
          question: 'What part of an HTTP response immediately tells you if the request succeeded or failed?',
          options: [
            { id: 'a', text: 'The response body.', isCorrect: false },
            { id: 'b', text: 'The status line (status code + reason phrase).', isCorrect: true },
            { id: 'c', text: 'The Content-Type header.', isCorrect: false },
            { id: 'd', text: 'The request URL.', isCorrect: false },
          ],
          explanation: 'The status line like "200 OK" or "404 Not Found" is the first thing you check. It\'s your API\'s emoji: 😊 or 💀.'
        },
        {
          question: 'What does a response body typically contain?',
          options: [
            { id: 'a', text: 'The HTTP method used for the request.', isCorrect: false },
            { id: 'b', text: 'The actual data returned by the server (e.g., JSON, HTML, or an error message).', isCorrect: true },
            { id: 'c', text: 'The server\'s IP address.', isCorrect: false },
            { id: 'd', text: 'The authentication credentials.', isCorrect: false },
          ],
          explanation: 'The body is the payload — the actual content you asked for. For REST APIs this is almost always JSON. For errors, it often contains an error code and message.'
        },
        {
          question: 'Which response header tells you the format of the data in the response body?',
          options: [
            { id: 'a', text: 'Authorization', isCorrect: false },
            { id: 'b', text: 'Content-Type', isCorrect: true },
            { id: 'c', text: 'Accept', isCorrect: false },
            { id: 'd', text: 'X-Request-ID', isCorrect: false },
          ],
          explanation: 'Content-Type: application/json means the body is JSON. Always assert this matches what you expect — a 200 returning HTML instead of JSON is a bug.'
        },
        {
          question: 'A DELETE request returns status 204 with no body. What does this mean?',
          options: [
            { id: 'a', text: 'The server had an error but is hiding it.', isCorrect: false },
            { id: 'b', text: 'The request was successful and there is no content to return.', isCorrect: true },
            { id: 'c', text: 'The resource was not found.', isCorrect: false },
            { id: 'd', text: 'You need to retry the request.', isCorrect: false },
          ],
          explanation: '204 No Content = success, nothing to send back. This is the correct response for DELETE and some PUT operations. Your test should verify the body IS empty.'
        },
        {
          question: 'What does the Location header in a 201 Created response typically contain?',
          options: [
            { id: 'a', text: 'The server\'s country of origin.', isCorrect: false },
            { id: 'b', text: 'The URL of the newly created resource.', isCorrect: true },
            { id: 'c', text: 'The authentication token for future requests.', isCorrect: false },
            { id: 'd', text: 'The next page URL for pagination.', isCorrect: false },
          ],
          explanation: 'After POST creates a new resource, Location: /users/456 tells you exactly where to find it. You should assert this header exists and points to a valid URL.'
        },
      ],
    },
    {
      level: 'api-status-codes',
      questions: [
        {
          question: 'What does the 2xx status code range indicate?',
          options: [
            { id: 'a', text: 'The request was redirected to another URL.', isCorrect: false },
            { id: 'b', text: 'There was a server-side error.', isCorrect: false },
            { id: 'c', text: 'The request was successful.', isCorrect: true },
            { id: 'd', text: 'The client made a bad request.', isCorrect: false },
          ],
          explanation: '2xx = Success family. 200 OK, 201 Created, 204 No Content all mean the server understood and handled your request correctly.'
        },
        {
          question: 'A user tries to view their own profile page but is not logged in. What status code should the API return?',
          options: [
            { id: 'a', text: '403 Forbidden', isCorrect: false },
            { id: 'b', text: '404 Not Found', isCorrect: false },
            { id: 'c', text: '401 Unauthorized', isCorrect: true },
            { id: 'd', text: '500 Internal Server Error', isCorrect: false },
          ],
          explanation: '401 = you haven\'t proven who you are yet. The server is saying "show me your ID first." 403 would be if you\'re logged in but still blocked.'
        },
        {
          question: 'What is the difference between 401 and 403?',
          options: [
            { id: 'a', text: '401 = server error; 403 = client error.', isCorrect: false },
            { id: 'b', text: '401 = not authenticated (no identity); 403 = authenticated but not authorized (no permission).', isCorrect: true },
            { id: 'c', text: 'They mean exactly the same thing.', isCorrect: false },
            { id: 'd', text: '401 = resource not found; 403 = resource deleted.', isCorrect: false },
          ],
          explanation: '401: "Who are you?" (missing/invalid token). 403: "I know who you are, but you\'re not allowed here." Critical distinction for security testing.'
        },
        {
          question: 'Which status code indicates the server crashed due to an unhandled bug?',
          options: [
            { id: 'a', text: '400 Bad Request', isCorrect: false },
            { id: 'b', text: '404 Not Found', isCorrect: false },
            { id: 'c', text: '422 Unprocessable Entity', isCorrect: false },
            { id: 'd', text: '500 Internal Server Error', isCorrect: true },
          ],
          explanation: '5xx = Server\'s fault. The request was fine, but the server blew up. As a tester, a 500 often means you found a bug worth reporting immediately.'
        },
        {
          question: 'You submit a form with a missing required field. The server validates it and rejects it. What is the most appropriate status code?',
          options: [
            { id: 'a', text: '200 OK', isCorrect: false },
            { id: 'b', text: '400 Bad Request', isCorrect: true },
            { id: 'c', text: '500 Internal Server Error', isCorrect: false },
            { id: 'd', text: '204 No Content', isCorrect: false },
          ],
          explanation: '400 = the client sent bad data. It\'s your test\'s job to check that missing/invalid fields return 400 (not 200 or 500). Never trust that the server catches everything.'
        },
      ],
    },
    {
      level: 'api-json-basics',
      questions: [
        {
          question: 'What does JSON stand for?',
          options: [
            { id: 'a', text: 'Java Syntax Object Notation', isCorrect: false },
            { id: 'b', text: 'JavaScript Object Notation', isCorrect: true },
            { id: 'c', text: 'Joint Standard Output Node', isCorrect: false },
            { id: 'd', text: 'JSON Serialized Object Network', isCorrect: false },
          ],
          explanation: 'JSON = JavaScript Object Notation. Despite the name, it\'s language-agnostic and used by virtually every modern API as the standard data format.'
        },
        {
          question: 'How are string values represented in JSON?',
          options: [
            { id: 'a', text: 'With single quotes: \'hello\'', isCorrect: false },
            { id: 'b', text: 'With double quotes: "hello"', isCorrect: true },
            { id: 'c', text: 'Without any quotes: hello', isCorrect: false },
            { id: 'd', text: 'With backticks: `hello`', isCorrect: false },
          ],
          explanation: 'JSON requires double quotes for strings. Single quotes are NOT valid JSON. This trips up many beginners — always use double quotes for keys and string values.'
        },
        {
          question: 'Which of the following is valid JSON?',
          options: [
            { id: 'a', text: '{ name: "Alice", age: 30 }', isCorrect: false },
            { id: 'b', text: '{ \'name\': \'Alice\', \'age\': 30 }', isCorrect: false },
            { id: 'c', text: '{ "name": "Alice", "age": 30 }', isCorrect: true },
            { id: 'd', text: '{ "name": Alice, "age": 30 }', isCorrect: false },
          ],
          explanation: 'Valid JSON: all keys in double quotes, string values in double quotes, numbers without quotes. Option C is the only one that follows all three rules.'
        },
        {
          question: 'In JSON, what data type should you use for an ordered list of items?',
          options: [
            { id: 'a', text: 'An object { }', isCorrect: false },
            { id: 'b', text: 'A string " "', isCorrect: false },
            { id: 'c', text: 'An array [ ]', isCorrect: true },
            { id: 'd', text: 'A boolean true/false', isCorrect: false },
          ],
          explanation: 'Arrays use [ ] and hold ordered lists: ["apple", "banana", "cherry"] or [{"id":1}, {"id":2}]. As a QA tester always check array length and item structure.'
        },
        {
          question: 'How do you represent a null (empty/absent) value in JSON?',
          options: [
            { id: 'a', text: '"null" (the word in quotes)', isCorrect: false },
            { id: 'b', text: 'undefined', isCorrect: false },
            { id: 'c', text: 'null (without quotes)', isCorrect: true },
            { id: 'd', text: 'An empty string ""', isCorrect: false },
          ],
          explanation: 'JSON has the literal value null (lowercase, no quotes). "null" is the string "null". undefined is a JavaScript concept and is NOT valid JSON.'
        },
      ],
    },
    {
      level: 'api-postman-basics',
      questions: [
        {
          question: 'What is Postman primarily used for?',
          options: [
            { id: 'a', text: 'Writing automated unit tests for front-end components.', isCorrect: false },
            { id: 'b', text: 'Designing and visually building databases.', isCorrect: false },
            { id: 'c', text: 'Sending API requests and inspecting responses without writing code.', isCorrect: true },
            { id: 'd', text: 'Monitoring server CPU and memory usage.', isCorrect: false },
          ],
          explanation: 'Postman is the most popular API testing tool. It lets you build requests, inspect responses, write test scripts, and organize everything in Collections — all without coding.'
        },
        {
          question: 'Where in Postman do you choose the HTTP method (GET, POST, etc.) and enter the URL?',
          options: [
            { id: 'a', text: 'The Tests tab.', isCorrect: false },
            { id: 'b', text: 'The request bar at the top of the request panel.', isCorrect: true },
            { id: 'c', text: 'The Collection sidebar.', isCorrect: false },
            { id: 'd', text: 'The Environment manager.', isCorrect: false },
          ],
          explanation: 'The request bar shows a dropdown for the method and a text field for the URL. It\'s the starting point for every request you build.'
        },
        {
          question: 'What is a Postman Collection?',
          options: [
            { id: 'a', text: 'A list of saved environment variables.', isCorrect: false },
            { id: 'b', text: 'A group of related API requests organised in folders that can be shared and run together.', isCorrect: true },
            { id: 'c', text: 'A single API request with its test scripts.', isCorrect: false },
            { id: 'd', text: 'A Postman account with multiple workspaces.', isCorrect: false },
          ],
          explanation: 'Collections organise your requests by feature or workflow (e.g., "User API", "Order API"). You can run an entire collection with the Collection Runner or Newman in CI/CD.'
        },
        {
          question: 'Where in Postman do you add a Bearer token for an authenticated request?',
          options: [
            { id: 'a', text: 'In the Body tab, as a JSON field.', isCorrect: false },
            { id: 'b', text: 'In the Params tab, as a query parameter.', isCorrect: false },
            { id: 'c', text: 'In the Authorization tab, selecting "Bearer Token".', isCorrect: true },
            { id: 'd', text: 'In the Pre-request Script tab.', isCorrect: false },
          ],
          explanation: 'The Auth tab handles auth automatically. Postman will add the correct Authorization: Bearer <token> header for you — no manual header entry needed.'
        },
        {
          question: 'What does clicking "Send" in Postman do?',
          options: [
            { id: 'a', text: 'It saves the request to your Collection.', isCorrect: false },
            { id: 'b', text: 'It sends the configured HTTP request to the server and displays the response below.', isCorrect: true },
            { id: 'c', text: 'It exports the request as a code snippet.', isCorrect: false },
            { id: 'd', text: 'It runs the tests written in the Tests tab without making a real request.', isCorrect: false },
          ],
          explanation: 'Send fires the request. The response panel then shows status code, response time, body, and headers. You can then inspect the results and check if tests pass.'
        },
      ],
    },
    {
      level: 'api-headers-params',
      questions: [
        {
          question: 'What is the difference between a path parameter and a query parameter?',
          options: [
            { id: 'a', text: 'Path parameters are in headers; query parameters are in the body.', isCorrect: false },
            { id: 'b', text: 'Path parameters are part of the URL path (/users/42); query parameters come after ? (/users?role=admin).', isCorrect: true },
            { id: 'c', text: 'Query parameters identify a specific resource; path parameters filter results.', isCorrect: false },
            { id: 'd', text: 'There is no difference — they are interchangeable.', isCorrect: false },
          ],
          explanation: '/users/{id} — the {id} is a path parameter that identifies ONE specific user. /users?role=admin — the role=admin is a query param that filters a LIST.'
        },
        {
          question: 'What does the Content-Type request header tell the server?',
          options: [
            { id: 'a', text: 'What format of response you want back.', isCorrect: false },
            { id: 'b', text: 'What format the data in your request body is in.', isCorrect: true },
            { id: 'c', text: 'Your authentication credentials.', isCorrect: false },
            { id: 'd', text: 'Which API version you are using.', isCorrect: false },
          ],
          explanation: 'Content-Type: application/json tells the server "I\'m sending you JSON — parse it that way." Without it, the server might reject or misread your body.'
        },
        {
          question: 'In the URL https://api.shop.com/orders/99/items, which part is a path parameter?',
          options: [
            { id: 'a', text: 'api.shop.com', isCorrect: false },
            { id: 'b', text: 'orders', isCorrect: false },
            { id: 'c', text: '99', isCorrect: true },
            { id: 'd', text: 'items', isCorrect: false },
          ],
          explanation: '99 is the order ID — a dynamic value embedded in the path that identifies a specific order. The route template would be /orders/{orderId}/items.'
        },
        {
          question: 'What is the Accept header used for?',
          options: [
            { id: 'a', text: 'To tell the server what authentication type you support.', isCorrect: false },
            { id: 'b', text: 'To tell the server what response format you want (e.g., JSON or XML).', isCorrect: true },
            { id: 'c', text: 'To accept cookies from the server.', isCorrect: false },
            { id: 'd', text: 'To indicate which HTTP methods you support.', isCorrect: false },
          ],
          explanation: 'Accept: application/json tells the server "please send me JSON." The server uses this to format its response correctly. Test with wrong Accept values to see how the API handles it.'
        },
        {
          question: 'You want to get a list of users filtered to only those from "London". How should you pass this filter?',
          options: [
            { id: 'a', text: 'As a path parameter: GET /users/London', isCorrect: false },
            { id: 'b', text: 'As a query parameter: GET /users?city=London', isCorrect: true },
            { id: 'c', text: 'In the Authorization header.', isCorrect: false },
            { id: 'd', text: 'In the response body.', isCorrect: false },
          ],
          explanation: 'Filtering, sorting, and searching are done via query parameters. Path parameters identify a specific item. /users?city=London = "give me users, filtered by city London."'
        },
      ],
    },
    // ── INTERMEDIATE ──────────────────────────────────────────────
    {
      level: 'api-auth-types',
      questions: [
        {
          question: 'What is an API Key?',
          options: [
            { id: 'a', text: 'A password stored in the database.', isCorrect: false },
            { id: 'b', text: 'A unique secret string that identifies the calling application, sent with each request.', isCorrect: true },
            { id: 'c', text: 'A cryptographic token issued only after login.', isCorrect: false },
            { id: 'd', text: 'An SSH public key for server access.', isCorrect: false },
          ],
          explanation: 'API keys identify WHO is calling (the application). They\'re simple but should be sent in headers, not URLs. As a tester, try using an invalid key and assert 401/403.'
        },
        {
          question: 'What is the correct format for sending a Bearer token in a request?',
          options: [
            { id: 'a', text: 'Auth: Token <token>', isCorrect: false },
            { id: 'b', text: 'Authorization: Bearer <token>', isCorrect: true },
            { id: 'c', text: 'X-Auth: Bearer <token>', isCorrect: false },
            { id: 'd', text: 'Bearer: <token>', isCorrect: false },
          ],
          explanation: 'The exact format is: Authorization: Bearer eyJhbGci... This is the standard. APIs will reject other formats. Always copy the exact format from the API docs.'
        },
        {
          question: 'What is the main weakness of Basic Authentication?',
          options: [
            { id: 'a', text: 'It requires a separate login step.', isCorrect: false },
            { id: 'b', text: 'It sends credentials (username:password) Base64-encoded — easily decoded if not over HTTPS.', isCorrect: true },
            { id: 'c', text: 'It only works with GET requests.', isCorrect: false },
            { id: 'd', text: 'It expires after 30 minutes automatically.', isCorrect: false },
          ],
          explanation: 'Base64 is NOT encryption — anyone who intercepts the request can decode it instantly. Basic Auth is only safe over HTTPS. As a tester, always verify the API requires HTTPS.'
        },
        {
          question: 'What is OAuth 2.0 primarily designed for?',
          options: [
            { id: 'a', text: 'Encrypting data stored in databases.', isCorrect: false },
            { id: 'b', text: 'Allowing users to grant third-party apps limited access to their data without sharing passwords.', isCorrect: true },
            { id: 'c', text: 'Signing API requests with a private key.', isCorrect: false },
            { id: 'd', text: 'Compressing API response payloads.', isCorrect: false },
          ],
          explanation: 'OAuth 2.0 is the "Login with Google" mechanism. The user grants permission → Google gives a token → the app uses the token. Your password is never shared with the third-party app.'
        },
        {
          question: 'Which authentication method should you test by making a request with an EXPIRED token?',
          options: [
            { id: 'a', text: 'Basic Auth', isCorrect: false },
            { id: 'b', text: 'API Key', isCorrect: false },
            { id: 'c', text: 'JWT (JSON Web Token)', isCorrect: true },
            { id: 'd', text: 'No-auth endpoints', isCorrect: false },
          ],
          explanation: 'JWTs have an expiry (exp claim). A key QA test: use an expired JWT and assert the API returns 401, not 200. If it accepts expired tokens, that\'s a critical security bug.'
        },
      ],
    },
    {
      level: 'api-test-scenarios',
      questions: [
        {
          question: 'What is a "Happy Path" test scenario?',
          options: [
            { id: 'a', text: 'A test that intentionally crashes the server.', isCorrect: false },
            { id: 'b', text: 'Testing the most common, expected flow with valid data — everything works as designed.', isCorrect: true },
            { id: 'c', text: 'A test that checks error messages are user-friendly.', isCorrect: false },
            { id: 'd', text: 'A performance test measuring response speed.', isCorrect: false },
          ],
          explanation: 'Happy Path = the "it works!" scenario. Example for login: valid username + valid password → 200 + token. Always test happy path first, then break it.'
        },
        {
          question: 'Which scenario specifically checks what happens when a REQUIRED field is completely missing from a POST request?',
          options: [
            { id: 'a', text: 'Happy path test.', isCorrect: false },
            { id: 'b', text: 'Performance test.', isCorrect: false },
            { id: 'c', text: 'Negative / validation test.', isCorrect: true },
            { id: 'd', text: 'Authorization test.', isCorrect: false },
          ],
          explanation: 'Negative tests intentionally send bad data. Missing required fields should return 400 Bad Request with a clear error message — not 200, not 500.'
        },
        {
          question: 'What is an authorization test scenario?',
          options: [
            { id: 'a', text: 'Checking that valid users can log in.', isCorrect: false },
            { id: 'b', text: 'Testing that users can only access resources they have permission for.', isCorrect: true },
            { id: 'c', text: 'Verifying the API key format is correct.', isCorrect: false },
            { id: 'd', text: 'Testing response time under load.', isCorrect: false },
          ],
          explanation: 'Authorization tests check permissions: can User A access User B\'s data? Can a regular user call admin-only endpoints? A 200 when 403 was expected = critical bug.'
        },
        {
          question: 'Why should QA testers test API boundary values?',
          options: [
            { id: 'a', text: 'Because boundary values are the most common input from real users.', isCorrect: false },
            { id: 'b', text: 'Because bugs most commonly hide at the edges — just below, at, and just above the limit.', isCorrect: true },
            { id: 'c', text: 'Because boundary values make tests run faster.', isCorrect: false },
            { id: 'd', text: 'Because APIs only validate boundary values automatically.', isCorrect: false },
          ],
          explanation: 'If the max username length is 50: test 49, 50, and 51 characters. APIs often have off-by-one errors at boundaries. 51 chars should fail; 50 should succeed.'
        },
        {
          question: 'What is idempotency, and why is it a key test scenario for HTTP methods?',
          options: [
            { id: 'a', text: 'It means the API responds instantly — test for slow APIs.', isCorrect: false },
            { id: 'b', text: 'Calling the same request multiple times produces the same result — test that GET, PUT, DELETE behave this way.', isCorrect: true },
            { id: 'c', text: 'It means the API returns the same status code for all requests.', isCorrect: false },
            { id: 'd', text: 'It means duplicate POSTs are automatically prevented by the server.', isCorrect: false },
          ],
          explanation: 'GET /users/1 called 10 times = same data each time. DELETE /users/1 called twice = first returns 204, second returns 404. POST is NOT idempotent — it creates a new record each time.'
        },
      ],
    },
    {
      level: 'api-assertions',
      questions: [
        {
          question: 'What is an assertion in API testing?',
          options: [
            { id: 'a', text: 'A statement in your test that declares a complaint about the developer.', isCorrect: false },
            { id: 'b', text: 'A check that verifies the actual response matches what you expected.', isCorrect: true },
            { id: 'c', text: 'The request you send to the API.', isCorrect: false },
            { id: 'd', text: 'A type of API documentation format.', isCorrect: false },
          ],
          explanation: 'An assertion says "I expect status 200" and the test fails if it\'s anything else. Assertions are the heart of automated testing — no assertions = no test, just a script.'
        },
        {
          question: 'Which assertion verifies that the correct data was returned in the response?',
          options: [
            { id: 'a', text: 'Status code assertion.', isCorrect: false },
            { id: 'b', text: 'Response time assertion.', isCorrect: false },
            { id: 'c', text: 'Body/payload assertion.', isCorrect: true },
            { id: 'd', text: 'Header assertion.', isCorrect: false },
          ],
          explanation: 'Body assertions check the actual content: Does the name field match? Is the array non-empty? Does the price equal what you set? Status code alone doesn\'t tell you if the right data came back.'
        },
        {
          question: 'Why should you always assert the response status code even on happy path tests?',
          options: [
            { id: 'a', text: 'Because happy path tests don\'t check the body.', isCorrect: false },
            { id: 'b', text: 'Because a 200 response does not guarantee the body is correct.', isCorrect: false },
            { id: 'c', text: 'Because an API might return 200 when it should return 201, or 200 with an error body.', isCorrect: true },
            { id: 'd', text: 'Because status codes change with every API version.', isCorrect: false },
          ],
          explanation: 'Never assume. Some poorly designed APIs return 200 with { "error": "user not found" } in the body. Asserting the exact status code (201 for creation, 204 for delete) catches these bugs.'
        },
        {
          question: 'What should a response time assertion typically guard against?',
          options: [
            { id: 'a', text: 'Responses that come back too quickly.', isCorrect: false },
            { id: 'b', text: 'Responses that take longer than an acceptable threshold (e.g., > 2000ms).', isCorrect: true },
            { id: 'c', text: 'Responses that return on weekends.', isCorrect: false },
            { id: 'd', text: 'Responses that include too much data.', isCorrect: false },
          ],
          explanation: 'A slow API is a broken API for users. Assert that response time is under your SLA threshold (e.g., < 500ms for reads, < 2000ms for writes). Sudden slowdowns indicate regressions.'
        },
        {
          question: 'Which of the following is NOT a typical API test assertion?',
          options: [
            { id: 'a', text: 'Status code is 200.', isCorrect: false },
            { id: 'b', text: 'Response body contains a user object with an "id" field.', isCorrect: false },
            { id: 'c', text: 'The developer\'s commit message is descriptive.', isCorrect: true },
            { id: 'd', text: 'Content-Type header is application/json.', isCorrect: false },
          ],
          explanation: 'API assertions are about the response. Commit messages are a code review concern, not an API test assertion. Testable assertions: status, body content, headers, response time, schema.'
        },
      ],
    },
    {
      level: 'api-chaining',
      questions: [
        {
          question: 'What is request chaining in API testing?',
          options: [
            { id: 'a', text: 'Sending many identical requests in parallel.', isCorrect: false },
            { id: 'b', text: 'Using the output (e.g., an ID or token) from one request as input for the next.', isCorrect: true },
            { id: 'c', text: 'Linking multiple Postman collections together.', isCorrect: false },
            { id: 'd', text: 'Chaining HTTP methods (GET then POST then DELETE).', isCorrect: false },
          ],
          explanation: 'Classic chain: POST /login → get token → use token in GET /profile. The second request depends on data from the first. This mirrors real user flows.'
        },
        {
          question: 'In a login → get-profile chain, what do you extract from the first request (POST /login)?',
          options: [
            { id: 'a', text: 'The response time.', isCorrect: false },
            { id: 'b', text: 'The status code.', isCorrect: false },
            { id: 'c', text: 'The authentication token (e.g., JWT or session token).', isCorrect: true },
            { id: 'd', text: 'The Content-Type header.', isCorrect: false },
          ],
          explanation: 'After POST /login you get { "token": "eyJ..." }. You extract that token and inject it as "Authorization: Bearer eyJ..." in all subsequent authenticated requests.'
        },
        {
          question: 'Why is request chaining valuable for QA testing end-to-end flows?',
          options: [
            { id: 'a', text: 'Because chained requests are faster than individual ones.', isCorrect: false },
            { id: 'b', text: 'Because it tests realistic user workflows, not just isolated endpoints in isolation.', isCorrect: true },
            { id: 'c', text: 'Because servers require chained requests to function.', isCorrect: false },
            { id: 'd', text: 'Because it reduces the number of tests needed.', isCorrect: false },
          ],
          explanation: 'Real bugs hide between steps. Testing "create order → pay → confirm → check status" as a chain catches bugs that isolated tests miss — like a payment succeeding but the order staying "pending".'
        },
        {
          question: 'What Postman feature is commonly used to pass data between chained requests?',
          options: [
            { id: 'a', text: 'The Body tab.', isCorrect: false },
            { id: 'b', text: 'Collection Runner.', isCorrect: false },
            { id: 'c', text: 'Environment variables (set via pm.environment.set() in the Tests tab).', isCorrect: true },
            { id: 'd', text: 'The Headers tab.', isCorrect: false },
          ],
          explanation: 'In the Tests tab of request 1: pm.environment.set("token", pm.response.json().token). Then in request 2 header: Authorization: Bearer {{token}}. Postman fills it in automatically.'
        },
        {
          question: 'What breaks a request chain and how should your test handle it?',
          options: [
            { id: 'a', text: 'Slow response times — add a sleep between requests.', isCorrect: false },
            { id: 'b', text: 'The first request failing — all subsequent requests should be skipped or marked as failed.', isCorrect: true },
            { id: 'c', text: 'Different HTTP methods — chains only work with GET requests.', isCorrect: false },
            { id: 'd', text: 'Too many requests — limit chains to 3 steps maximum.', isCorrect: false },
          ],
          explanation: 'If POST /login fails, the token is missing and every downstream request will fail with 401. Good test design detects this early and reports "Chain broken at step 1: login failed" rather than 10 confusing failures.'
        },
      ],
    },
    {
      level: 'api-schema-validation',
      questions: [
        {
          question: 'What does API schema validation check?',
          options: [
            { id: 'a', text: 'Whether the server is online.', isCorrect: false },
            { id: 'b', text: 'Whether the response structure, field names, and data types match the agreed contract.', isCorrect: true },
            { id: 'c', text: 'Whether the request took less than 500ms.', isCorrect: false },
            { id: 'd', text: 'Whether the API uses HTTPS.', isCorrect: false },
          ],
          explanation: 'Schema validation catches structural bugs: missing fields, wrong types (string instead of number), extra unexpected fields, or nullable fields returning values when they shouldn\'t.'
        },
        {
          question: 'Which specification format is widely used to define and validate JSON API response schemas?',
          options: [
            { id: 'a', text: 'XML DTD', isCorrect: false },
            { id: 'b', text: 'JSON Schema', isCorrect: true },
            { id: 'c', text: 'Markdown', isCorrect: false },
            { id: 'd', text: 'CSV', isCorrect: false },
          ],
          explanation: 'JSON Schema defines the expected structure: what fields are required, what types they must be, min/max values, allowed string patterns, etc. Tools like Ajv validate responses against it automatically.'
        },
        {
          question: 'A response passes schema validation but the "price" field returns 0 for every product. What kind of test would catch this?',
          options: [
            { id: 'a', text: 'Schema validation.', isCorrect: false },
            { id: 'b', text: 'Response body / value assertion.', isCorrect: true },
            { id: 'c', text: 'Header assertion.', isCorrect: false },
            { id: 'd', text: 'Status code assertion.', isCorrect: false },
          ],
          explanation: 'Schema validation only checks structure (field exists, is a number). It won\'t catch wrong values. Body assertions check actual values: expect(price).toBeGreaterThan(0). Both are needed.'
        },
        {
          question: 'What does a schema validation failure indicate?',
          options: [
            { id: 'a', text: 'The API is too slow.', isCorrect: false },
            { id: 'b', text: 'A mismatch between what the API contract promised and what the API actually returned.', isCorrect: true },
            { id: 'c', text: 'The user\'s internet is slow.', isCorrect: false },
            { id: 'd', text: 'The request headers are missing.', isCorrect: false },
          ],
          explanation: 'Schema failures mean the contract is broken. Maybe a developer renamed a field ("userId" → "user_id") or changed a type (string → number). These silently break frontends and must be caught early.'
        },
        {
          question: 'Which npm library is commonly used to validate JSON responses against a JSON Schema in automated Node.js tests?',
          options: [
            { id: 'a', text: 'Lodash', isCorrect: false },
            { id: 'b', text: 'Ajv (Another JSON Validator)', isCorrect: true },
            { id: 'c', text: 'Moment.js', isCorrect: false },
            { id: 'd', text: 'Chalk', isCorrect: false },
          ],
          explanation: 'Ajv is the fastest JSON Schema validator for JavaScript. In tests: const validate = ajv.compile(schema); expect(validate(response.data)).toBe(true); — one line to enforce the entire structure.'
        },
      ],
    },
    {
      level: 'api-mock-servers',
      questions: [
        {
          question: 'What is a mock server?',
          options: [
            { id: 'a', text: 'A production server that runs slower than usual.', isCorrect: false },
            { id: 'b', text: 'A simulated API that returns predefined responses without connecting to a real backend.', isCorrect: true },
            { id: 'c', text: 'A server that blocks all incoming requests.', isCorrect: false },
            { id: 'd', text: 'A server used only for load testing.', isCorrect: false },
          ],
          explanation: 'A mock server pretends to be the real API. You define what it returns for each request. Great for testing when the real API isn\'t built yet or is too flaky to rely on.'
        },
        {
          question: 'When is a mock server most useful for a QA team?',
          options: [
            { id: 'a', text: 'When running production smoke tests.', isCorrect: false },
            { id: 'b', text: 'When the backend API is still under development or unavailable in the test environment.', isCorrect: true },
            { id: 'c', text: 'When testing how fast the real server responds.', isCorrect: false },
            { id: 'd', text: 'When testing actual data integrity in the database.', isCorrect: false },
          ],
          explanation: 'Mock servers decouple frontend/mobile QA from backend readiness. Test teams can work in parallel — testers validate UI behaviour against mocks while developers build the real API.'
        },
        {
          question: 'What is the term for a predefined response returned by a mock server for a specific request?',
          options: [
            { id: 'a', text: 'A fixture.', isCorrect: false },
            { id: 'b', text: 'A stub.', isCorrect: true },
            { id: 'c', text: 'A snapshot.', isCorrect: false },
            { id: 'd', text: 'A payload.', isCorrect: false },
          ],
          explanation: 'A stub is a canned answer: "when you call GET /users/1, return this exact JSON." Stubs make tests deterministic — no real network, no flakiness, same result every time.'
        },
        {
          question: 'Which tool allows you to create a mock server directly from a Postman Collection?',
          options: [
            { id: 'a', text: 'Newman', isCorrect: false },
            { id: 'b', text: 'WireMock', isCorrect: false },
            { id: 'c', text: 'Postman Mock Server', isCorrect: true },
            { id: 'd', text: 'Swagger UI', isCorrect: false },
          ],
          explanation: 'Postman lets you save example responses on requests, then create a Mock Server from the Collection. The mock URL responds exactly like your saved examples — shareable with the whole team.'
        },
        {
          question: 'What is the key disadvantage of relying ONLY on mock servers for API testing?',
          options: [
            { id: 'a', text: 'Mocks are too slow.', isCorrect: false },
            { id: 'b', text: 'Mocks only work offline.', isCorrect: false },
            { id: 'c', text: 'Mocks cannot break — they always return what you configured, so real backend bugs are missed.', isCorrect: true },
            { id: 'd', text: 'Mocks require a paid subscription.', isCorrect: false },
          ],
          explanation: 'Mocks are great for isolation but they can\'t catch real integration bugs. If the real API changes and you only test against mocks, your tests stay green while production breaks.'
        },
      ],
    },
    // ── EXPERT ────────────────────────────────────────────────────
    {
      level: 'api-automation',
      questions: [
        {
          question: 'Which npm package is most commonly used to make HTTP requests in Node.js automated API tests?',
          options: [
            { id: 'a', text: 'Lodash', isCorrect: false },
            { id: 'b', text: 'Axios', isCorrect: true },
            { id: 'c', text: 'Express', isCorrect: false },
            { id: 'd', text: 'Nodemon', isCorrect: false },
          ],
          explanation: 'Axios is a promise-based HTTP client that works in Node.js and the browser. It\'s clean, auto-parses JSON, and handles errors predictably — perfect for pairing with Jest in automated API tests.'
        },
        {
          question: 'In a Jest test suite for APIs, which hook runs ONCE before all tests and is ideal for logging in and storing a token?',
          options: [
            { id: 'a', text: 'beforeEach()', isCorrect: false },
            { id: 'b', text: 'afterAll()', isCorrect: false },
            { id: 'c', text: 'beforeAll()', isCorrect: true },
            { id: 'd', text: 'afterEach()', isCorrect: false },
          ],
          explanation: 'beforeAll() runs once before the entire suite. Log in here, store the token in a variable, then all tests in the suite reuse it. beforeEach() would re-login before every single test — wasteful.'
        },
        {
          question: 'Where should base URLs, API keys, and credentials be stored in automated test projects?',
          options: [
            { id: 'a', text: 'Hardcoded directly inside test files for reliability.', isCorrect: false },
            { id: 'b', text: 'In environment variables (e.g., .env files not committed to git).', isCorrect: true },
            { id: 'c', text: 'In the README so the team can find them.', isCorrect: false },
            { id: 'd', text: 'In the package.json scripts section.', isCorrect: false },
          ],
          explanation: 'Never hardcode secrets. Use .env + dotenv library. Add .env to .gitignore. In CI/CD, secrets are injected as environment variables. This prevents credentials leaking into version control.'
        },
        {
          question: 'What does this Jest assertion do: expect(response.status).toBe(201)?',
          options: [
            { id: 'a', text: 'It sends a POST request and creates a resource.', isCorrect: false },
            { id: 'b', text: 'It verifies that the response status code is exactly 201 Created, and fails the test if it\'s anything else.', isCorrect: true },
            { id: 'c', text: 'It waits 201 milliseconds before checking the response.', isCorrect: false },
            { id: 'd', text: 'It retries the request 201 times.', isCorrect: false },
          ],
          explanation: 'expect(actual).toBe(expected) is Jest\'s strict equality check. If status is 200 or 400, this assertion fails and the test is marked red — immediately visible in your CI/CD pipeline.'
        },
        {
          question: 'What is the primary benefit of running automated API tests in a CI/CD pipeline?',
          options: [
            { id: 'a', text: 'Tests run slower so developers have time to review changes.', isCorrect: false },
            { id: 'b', text: 'Every code push is automatically validated, catching regressions before they reach production.', isCorrect: true },
            { id: 'c', text: 'Developers no longer need to write unit tests.', isCorrect: false },
            { id: 'd', text: 'API documentation is generated automatically.', isCorrect: false },
          ],
          explanation: 'CI/CD gives you a safety net: every commit triggers the test suite. If a developer\'s change breaks the login API, the pipeline fails and the PR is blocked — the bug never reaches users.'
        },
      ],
    },
    {
      level: 'api-security-testing',
      questions: [
        {
          question: 'What is BOLA (Broken Object Level Authorization), also known as IDOR?',
          options: [
            { id: 'a', text: 'When an API returns data too slowly.', isCorrect: false },
            { id: 'b', text: 'When a user can access or modify another user\'s resource by changing an ID in the request.', isCorrect: true },
            { id: 'c', text: 'When an API key is stored in plain text.', isCorrect: false },
            { id: 'd', text: 'When the API documentation is incomplete.', isCorrect: false },
          ],
          explanation: 'Example: GET /orders/1001 returns YOUR order. Change it to GET /orders/1002 — does it return someone else\'s order? If yes, that\'s BOLA. The #1 API vulnerability per OWASP Top 10.'
        },
        {
          question: 'A GET /users endpoint returns a list including hashed passwords, SSNs, and internal flags. What vulnerability is this?',
          options: [
            { id: 'a', text: 'BOLA (Broken Object Level Authorization)', isCorrect: false },
            { id: 'b', text: 'Excessive Data Exposure', isCorrect: true },
            { id: 'c', text: 'SQL Injection', isCorrect: false },
            { id: 'd', text: 'Rate Limiting bypass', isCorrect: false },
          ],
          explanation: 'Excessive Data Exposure (#3 OWASP) = the API returns too much. Even hashed passwords shouldn\'t reach the client. As a tester, check every response field: does the client actually need this data?'
        },
        {
          question: 'How would a QA tester test for SQL Injection via an API?',
          options: [
            { id: 'a', text: 'Send a very large JSON body.', isCorrect: false },
            { id: 'b', text: 'Send SQL syntax in input fields (e.g., \' OR 1=1--) and check if the server returns unexpected data or errors.', isCorrect: true },
            { id: 'c', text: 'Remove the Authorization header from all requests.', isCorrect: false },
            { id: 'd', text: 'Change the Content-Type header to text/plain.', isCorrect: false },
          ],
          explanation: 'Inject SQL into query params or body: GET /users?name=\' OR 1=1--. A vulnerable API might return ALL users or expose a database error. A safe API sanitises input and returns 400.'
        },
        {
          question: 'What status code should an API return when a user has exceeded their rate limit?',
          options: [
            { id: 'a', text: '400 Bad Request', isCorrect: false },
            { id: 'b', text: '401 Unauthorized', isCorrect: false },
            { id: 'c', text: '429 Too Many Requests', isCorrect: true },
            { id: 'd', text: '503 Service Unavailable', isCorrect: false },
          ],
          explanation: '429 Too Many Requests is the correct status. The response should also include a Retry-After header telling the client when to try again. As a tester, verify rate limiting works and returns 429.'
        },
        {
          question: 'What security test should you perform on JWT-protected endpoints?',
          options: [
            { id: 'a', text: 'Send a request with an empty body.', isCorrect: false },
            { id: 'b', text: 'Test with an expired JWT, a tampered JWT payload, and no token at all — each should return 401.', isCorrect: true },
            { id: 'c', text: 'Send the same JWT in all headers simultaneously.', isCorrect: false },
            { id: 'd', text: 'Replace the JWT with an API key.', isCorrect: false },
          ],
          explanation: 'JWT security tests: (1) no token → 401, (2) expired token → 401, (3) tampered payload (change userId) → 401, (4) invalid signature → 401. If any return 200, it\'s a critical security bug.'
        },
      ],
    },
    {
      level: 'api-contract-testing',
      questions: [
        {
          question: 'What is contract testing?',
          options: [
            { id: 'a', text: 'Testing that an API meets its SLA for response time.', isCorrect: false },
            { id: 'b', text: 'Verifying that an API\'s request/response structure matches what consumers expect, based on a shared agreement (contract).', isCorrect: true },
            { id: 'c', text: 'Testing that legal contracts can be signed via the API.', isCorrect: false },
            { id: 'd', text: 'Integration testing against the production database.', isCorrect: false },
          ],
          explanation: 'A contract is the agreed shape of requests and responses between a consumer (e.g., frontend) and a provider (e.g., backend API). Contract tests ensure both sides honor the agreement independently.'
        },
        {
          question: 'In Pact consumer-driven contract testing, who defines the contract?',
          options: [
            { id: 'a', text: 'The backend team (API provider).', isCorrect: false },
            { id: 'b', text: 'The QA manager.', isCorrect: false },
            { id: 'c', text: 'The consumer (e.g., frontend or mobile app).', isCorrect: true },
            { id: 'd', text: 'The Pact Broker server automatically.', isCorrect: false },
          ],
          explanation: 'Consumer-Driven = the consumer writes tests describing what it expects. These generate a pact file. The provider then verifies it can fulfill those expectations. The consumer drives the contract.'
        },
        {
          question: 'What is a "pact file" in Pact contract testing?',
          options: [
            { id: 'a', text: 'A PDF document signed by both teams.', isCorrect: false },
            { id: 'b', text: 'A JSON file auto-generated from consumer tests, describing the expected interactions.', isCorrect: true },
            { id: 'c', text: 'The CI/CD pipeline configuration.', isCorrect: false },
            { id: 'd', text: 'The API\'s OpenAPI/Swagger specification.', isCorrect: false },
          ],
          explanation: 'The pact file is automatically generated when consumer tests run. It lists: the request (method, path, headers, body) and the expected response (status, headers, body). The provider verifies against this file.'
        },
        {
          question: 'What problem does contract testing solve that traditional end-to-end integration tests cannot?',
          options: [
            { id: 'a', text: 'Contract tests are faster and catch interface mismatches without requiring both systems to run simultaneously.', isCorrect: true },
            { id: 'b', text: 'Contract tests check business logic that integration tests miss.', isCorrect: false },
            { id: 'c', text: 'Contract tests run only in production.', isCorrect: false },
            { id: 'd', text: 'Contract tests replace all other forms of API testing.', isCorrect: false },
          ],
          explanation: 'Integration tests need both systems running, are slow, and break for many reasons. Contract tests isolate the interface: each team tests their side independently, catching breaking changes before deployment.'
        },
        {
          question: 'A developer renames the "userId" field to "user_id" in the API response. Which type of test catches this FIRST?',
          options: [
            { id: 'a', text: 'Manual exploratory testing.', isCorrect: false },
            { id: 'b', text: 'Unit tests on the backend.', isCorrect: false },
            { id: 'c', text: 'Contract tests / schema validation tests.', isCorrect: true },
            { id: 'd', text: 'Performance tests.', isCorrect: false },
          ],
          explanation: 'The consumer\'s contract expects "userId". The provider verification step would fail immediately because the pact file says the response must contain "userId" but the API now returns "user_id".'
        },
      ],
    },
    {
      level: 'api-performance-testing',
      questions: [
        {
          question: 'What does "p95 response time of 450ms" mean?',
          options: [
            { id: 'a', text: '95% of requests failed.', isCorrect: false },
            { id: 'b', text: '95% of requests completed within 450ms — only the slowest 5% took longer.', isCorrect: true },
            { id: 'c', text: 'The average response time was 450ms.', isCorrect: false },
            { id: 'd', text: 'The 95th request in the test took 450ms.', isCorrect: false },
          ],
          explanation: 'Percentiles are more useful than averages. p95 = the "almost-worst-case" experience. If p95 is 450ms, 95% of real users see sub-450ms. The remaining 5% might still be having a bad time — check p99 too.'
        },
        {
          question: 'Which open-source tool is popular for API load and performance testing with a JavaScript scripting API?',
          options: [
            { id: 'a', text: 'JMeter', isCorrect: false },
            { id: 'b', text: 'k6 (by Grafana)', isCorrect: true },
            { id: 'c', text: 'Selenium', isCorrect: false },
            { id: 'd', text: 'Newman', isCorrect: false },
          ],
          explanation: 'k6 uses JavaScript for test scripts, integrates with CI/CD, outputs detailed metrics (p50, p95, p99, error rate, throughput), and has a free CLI. It\'s become the go-to for modern API performance testing.'
        },
        {
          question: 'What is a "spike test" in performance testing?',
          options: [
            { id: 'a', text: 'A test that gradually ramps up load over hours.', isCorrect: false },
            { id: 'b', text: 'A sudden, extreme increase in load to see if the system recovers gracefully.', isCorrect: true },
            { id: 'c', text: 'A test that measures a single request\'s maximum speed.', isCorrect: false },
            { id: 'd', text: 'A test that runs only during off-peak hours.', isCorrect: false },
          ],
          explanation: 'Spike test = flash crowd simulation. 0 → 1000 users in 10 seconds, then back down. Does the server crash? Does it auto-scale? Does it return errors or just slow down? Answers these questions.'
        },
        {
          question: 'Which metric measures how many requests a server successfully handles per second?',
          options: [
            { id: 'a', text: 'Error rate', isCorrect: false },
            { id: 'b', text: 'Response time (ms)', isCorrect: false },
            { id: 'c', text: 'Throughput (RPS — Requests Per Second)', isCorrect: true },
            { id: 'd', text: 'Percentile (p95)', isCorrect: false },
          ],
          explanation: 'Throughput = how much work the system can handle. 500 RPS means 500 successful requests per second. Combined with response time and error rate, it paints the full performance picture.'
        },
        {
          question: 'At what stage of development should performance tests ideally be introduced?',
          options: [
            { id: 'a', text: 'Only after a performance issue is reported by a real user in production.', isCorrect: false },
            { id: 'b', text: 'Early — as part of the CI/CD pipeline — so regressions are caught before they reach production.', isCorrect: true },
            { id: 'c', text: 'During the final UAT phase only.', isCorrect: false },
            { id: 'd', text: 'Never — performance tuning is a DevOps responsibility, not QA.', isCorrect: false },
          ],
          explanation: 'Performance bugs are expensive to fix late. Shift left: add baseline performance tests in CI/CD so any commit that slows an endpoint by 30%+ is caught in the PR — not in production during peak traffic.'
        },
      ],
    },
    {
      level: 'api-ci-cd',
      questions: [
        {
          question: 'What is Newman in the context of API testing?',
          options: [
            { id: 'a', text: 'A browser automation tool.', isCorrect: false },
            { id: 'b', text: 'The command-line runner for Postman Collections that integrates with CI/CD pipelines.', isCorrect: true },
            { id: 'c', text: 'A mock server for Postman.', isCorrect: false },
            { id: 'd', text: 'A JWT decoding library.', isCorrect: false },
          ],
          explanation: 'Newman = "Postman in your terminal." You export a Collection + Environment from Postman, then run: newman run collection.json -e env.json. Exit code 0 = pass, non-zero = fail. CI/CD tools read exit codes.'
        },
        {
          question: 'In a GitHub Actions workflow, what does "on: push: branches: [main]" mean?',
          options: [
            { id: 'a', text: 'The workflow runs manually when you click a button.', isCorrect: false },
            { id: 'b', text: 'The workflow triggers automatically every time code is pushed to the main branch.', isCorrect: true },
            { id: 'c', text: 'The workflow runs only when a PR is merged to main.', isCorrect: false },
            { id: 'd', text: 'The workflow runs on a scheduled timer.', isCorrect: false },
          ],
          explanation: 'The on: trigger defines when the pipeline runs. push to main = runs on every commit to main. You can also add pull_request so tests run on every PR before merging.'
        },
        {
          question: 'Why should API base URLs and secrets be stored as environment secrets in CI/CD (e.g., GitHub Secrets) rather than in the code?',
          options: [
            { id: 'a', text: 'Because CI/CD tools can\'t read files.', isCorrect: false },
            { id: 'b', text: 'To prevent credentials from being exposed in the repository, logs, or to unauthorized contributors.', isCorrect: true },
            { id: 'c', text: 'Because hardcoded values cause syntax errors in YAML.', isCorrect: false },
            { id: 'd', text: 'Because environment secrets are faster to access at runtime.', isCorrect: false },
          ],
          explanation: 'GitHub Secrets are encrypted and only exposed to the workflow at runtime. They don\'t appear in logs, are not visible to fork PRs, and can be rotated without changing code. Never commit secrets to git.'
        },
        {
          question: 'What should happen automatically when an API test fails in a CI/CD pipeline?',
          options: [
            { id: 'a', text: 'The pipeline marks the build as warning and continues to deploy.', isCorrect: false },
            { id: 'b', text: 'The pipeline fails, blocks the merge/deployment, and notifies the team.', isCorrect: true },
            { id: 'c', text: 'The test is retried 10 times before failing.', isCorrect: false },
            { id: 'd', text: 'The test failure is logged but does not affect deployment.', isCorrect: false },
          ],
          explanation: 'The whole point of CI/CD testing is to act as a gate. A failing test MUST block deployment. If failures are silently ignored, the safety net is gone and broken APIs reach production.'
        },
        {
          question: 'Why should lightweight API smoke tests run on every deployment (including to staging)?',
          options: [
            { id: 'a', text: 'To measure performance benchmarks for every release.', isCorrect: false },
            { id: 'b', text: 'To immediately confirm the most critical endpoints are working after a deployment — catching deployment failures fast.', isCorrect: true },
            { id: 'c', text: 'To replace full regression test suites.', isCorrect: false },
            { id: 'd', text: 'To generate API documentation automatically.', isCorrect: false },
          ],
          explanation: 'Smoke tests (5-10 critical checks: can we log in? can we create an order?) run in under 2 minutes post-deploy. If they fail, you know the deployment broke something before any user notices.'
        },
      ],
    },
  ],
  typescript: [
    {
      level: 'ts-intro',
      questions: [
        {
          question: 'TypeScript is best described as which of the following?',
          options: [
            { id: 'a', text: 'A completely different language that replaces JavaScript', isCorrect: false },
            { id: 'b', text: 'A superset of JavaScript that adds a static type system', isCorrect: true },
            { id: 'c', text: 'A runtime that executes .ts files directly in the browser', isCorrect: false },
            { id: 'd', text: 'A JavaScript testing framework', isCorrect: false },
          ],
          explanation: 'TypeScript is a superset of JavaScript  --  every valid JS file is already valid TypeScript. TypeScript adds a type system on top, which is stripped away during compilation, leaving plain JavaScript that runs everywhere JS runs.'
        },
        {
          question: 'When exactly does TypeScript catch type errors?',
          options: [
            { id: 'a', text: 'Only at runtime, when the code executes in the browser', isCorrect: false },
            { id: 'b', text: 'At compile time, before the code ever runs', isCorrect: true },
            { id: 'c', text: 'Only when you run your test suite', isCorrect: false },
            { id: 'd', text: 'Only in production environments', isCorrect: false },
          ],
          explanation: 'TypeScript errors are compile-time errors. The tsc compiler (or your IDE) catches them before execution. The goal is to fail loudly during development, not silently in production.'
        },
        {
          question: 'What does the "strict": true option in tsconfig.json do?',
          options: [
            { id: 'a', text: 'Makes TypeScript run slower but more accurately', isCorrect: false },
            { id: 'b', text: 'Enables all strict type-checking flags including strictNullChecks', isCorrect: true },
            { id: 'c', text: 'Prevents any JavaScript from being written', isCorrect: false },
            { id: 'd', text: 'Forces every variable to have an explicit type annotation', isCorrect: false },
          ],
          explanation: '"strict": true is an umbrella option that enables all strict checks, most importantly strictNullChecks (prevents null/undefined bugs) and strictFunctionTypes. Always use it  --  it catches real bugs.'
        },
        {
          question: 'What happens to TypeScript type annotations when the code is compiled?',
          options: [
            { id: 'a', text: 'They are kept and interpreted by the browser at runtime', isCorrect: false },
            { id: 'b', text: 'They are converted to JavaScript comments', isCorrect: false },
            { id: 'c', text: 'They are completely stripped away  --  only plain JavaScript remains', isCorrect: true },
            { id: 'd', text: 'They are stored in a separate .types file', isCorrect: false },
          ],
          explanation: 'TypeScript types exist only at design time. The tsc compiler erases all type annotations when producing JavaScript. The output .js file has zero type information  --  browsers and Node.js never see them.'
        },
        {
          question: 'Why is TypeScript particularly valuable for QA engineers writing automation?',
          options: [
            { id: 'a', text: 'It makes tests run 10x faster than JavaScript', isCorrect: false },
            { id: 'b', text: 'It eliminates the need for test assertions', isCorrect: false },
            { id: 'c', text: 'It catches selector and property name bugs before the test even runs, and self-documents test code', isCorrect: true },
            { id: 'd', text: 'It automatically generates test cases from the UI', isCorrect: false },
          ],
          explanation: 'For QA, TypeScript\'s biggest wins are: (1) catching undefined variable bugs before running tests, (2) making Page Object Model contracts explicit and enforced, (3) enabling safe refactoring, and (4) providing accurate autocomplete in editors.'
        },
      ]
    },
    {
      level: 'ts-variables',
      questions: [
        {
          question: 'What is the key difference between `const` and `let` in TypeScript?',
          options: [
            { id: 'a', text: '`const` is for strings only; `let` is for numbers only', isCorrect: false },
            { id: 'b', text: '`const` creates a binding that cannot be reassigned; `let` allows reassignment', isCorrect: true },
            { id: 'c', text: '`const` variables are accessible everywhere; `let` variables are block-scoped', isCorrect: false },
            { id: 'd', text: 'They are identical — `const` is just a style preference', isCorrect: false },
          ],
          explanation: '`const` means the variable binding is fixed — the name always points to the same value. `let` allows you to reassign the variable to a new value later. Both are block-scoped. The rule: use `const` by default for everything, and only reach for `let` when you know you need to reassign (e.g., loop counters, accumulating values).'
        },
        {
          question: 'Why should you avoid using `var` in modern TypeScript?',
          options: [
            { id: 'a', text: '`var` is not valid TypeScript syntax', isCorrect: false },
            { id: 'b', text: '`var` is function-scoped (not block-scoped) and is hoisted, causing unpredictable behaviour', isCorrect: true },
            { id: 'c', text: '`var` only works with string types', isCorrect: false },
            { id: 'd', text: '`var` requires an explicit type annotation', isCorrect: false },
          ],
          explanation: '`var` predates modern JavaScript. Its two problems: it is function-scoped (so it leaks out of `if`, `for`, and `while` blocks), and it is hoisted (meaning you can reference it before the line it is declared without an error). Both behaviours cause silent bugs. `let` and `const` are block-scoped and not hoisted in the same way — always use them instead.'
        },
        {
          question: 'Given: `const config = { timeout: 30000, headless: true }`. Which operation is valid?',
          options: [
            { id: 'a', text: 'config = { timeout: 60000, headless: false }', isCorrect: false },
            { id: 'b', text: 'config.timeout = 60000', isCorrect: true },
            { id: 'c', text: 'Both — `const` has no restrictions', isCorrect: false },
            { id: 'd', text: 'Neither — `const` objects are completely immutable', isCorrect: false },
          ],
          explanation: '`const` prevents reassigning the variable itself — you cannot make `config` point to a different object. But the object the variable points to is still mutable: you can modify its properties freely. To make an object deeply immutable, you need `Object.freeze()` or the `Readonly<T>` type (which enforces immutability at the TypeScript type level).'
        },
        {
          question: 'What is "block scope" in the context of `let` and `const`?',
          options: [
            { id: 'a', text: 'Variables can only be declared once per file', isCorrect: false },
            { id: 'b', text: 'Variables declared with `let` or `const` only exist within the `{}` block they are declared in', isCorrect: true },
            { id: 'c', text: 'Variables are shared between all functions in the same block', isCorrect: false },
            { id: 'd', text: 'Variables declared in a block are automatically exported', isCorrect: false },
          ],
          explanation: 'Block scope means the variable lives and dies within the nearest `{}` braces. A variable declared inside a `for` loop body, `if` block, or function body is invisible outside those braces. This is predictable and safe. `var` has function scope instead — it ignores `{}` boundaries and exists throughout the enclosing function, which frequently causes hard-to-find bugs.'
        },
        {
          question: 'When writing test configuration constants in TypeScript, which naming convention is most appropriate?',
          options: [
            { id: 'a', text: 'camelCase — e.g., defaultTimeoutMs', isCorrect: false },
            { id: 'b', text: 'UPPER_SNAKE_CASE — e.g., DEFAULT_TIMEOUT_MS', isCorrect: false },
            { id: 'c', text: 'Either is acceptable, but UPPER_SNAKE_CASE signals "this never changes" while camelCase is used for regular variables', isCorrect: true },
            { id: 'd', text: 'PascalCase — e.g., DefaultTimeoutMs', isCorrect: false },
          ],
          explanation: 'Both conventions work, but UPPER_SNAKE_CASE (e.g., MAX_RETRIES, BASE_URL) is the community convention for module-level constants that truly never change — it signals to readers "this is a fixed configuration value, not a variable that gets updated". camelCase (e.g., retryCount, currentBrowser) is used for regular variables. PascalCase is reserved for classes, interfaces, and types.'
        },
      ]
    },
    {
      level: 'ts-control-flow',
      questions: [
        {
          question: 'In TypeScript, when should you prefer `for...of` over a traditional `for` loop for iterating arrays?',
          options: [
            { id: 'a', text: '`for...of` is only for strings, not arrays', isCorrect: false },
            { id: 'b', text: 'When you need the index position of each element', isCorrect: false },
            { id: 'c', text: 'When you only need the values (not the index), `for...of` is cleaner and less error-prone', isCorrect: true },
            { id: 'd', text: '`for...of` is always slower so it should be avoided', isCorrect: false },
          ],
          explanation: '`for...of` gives you each VALUE directly without managing an index variable — no risk of off-by-one errors (`< length` vs `<= length`). Use `for...of` whenever you only need the values (which is the majority of cases). Use a traditional `for` loop when you genuinely need the index position (e.g., to compare adjacent elements or build a numbered list).'
        },
        {
          question: 'What happens if you forget to add `break` or `return` inside a `switch` case?',
          options: [
            { id: 'a', text: 'TypeScript throws a compile error', isCorrect: false },
            { id: 'b', text: 'Execution "falls through" to the next case and runs that code too', isCorrect: true },
            { id: 'c', text: 'The switch statement exits normally after the matched case', isCorrect: false },
            { id: 'd', text: 'The default case runs instead', isCorrect: false },
          ],
          explanation: 'Fall-through is one of the most common switch bugs. Without `break` or `return`, JavaScript/TypeScript continues executing into the next case\'s code regardless of whether it matches. For example, if the "fail" case has no break, it will also execute the "skip" case. Always end each case with `break`, `return`, or `throw`.'
        },
        {
          question: 'In a QA test suite, you want to run tests across multiple browsers. Which loop is most appropriate for "for each browser in the list, run the test suite"?',
          options: [
            { id: 'a', text: 'while loop', isCorrect: false },
            { id: 'b', text: 'for...in loop', isCorrect: false },
            { id: 'c', text: 'for...of loop', isCorrect: true },
            { id: 'd', text: 'Traditional for loop with index', isCorrect: false },
          ],
          explanation: '`for...of` is the right tool for iterating over an array of values when you need each value (not its position). `const browsers = ["chromium", "firefox", "webkit"]; for (const browser of browsers) { runSuite(browser); }` reads naturally and provides each browser name directly. `for...in` gives property keys (not array values), and `while` is better for unknown iteration counts.'
        },
        {
          question: 'What is the ternary operator and when is it most appropriately used?',
          options: [
            { id: 'a', text: 'A loop that runs three times', isCorrect: false },
            { id: 'b', text: 'A shorthand for if/else that evaluates to a value — best for simple two-outcome conditions', isCorrect: true },
            { id: 'c', text: 'A way to declare three variables at once', isCorrect: false },
            { id: 'd', text: 'A switch statement with three cases', isCorrect: false },
          ],
          explanation: 'The ternary `condition ? valueIfTrue : valueIfFalse` is ideal when you have a simple two-option condition and want to assign a value or embed logic in a template literal: `const label = passed ? "PASS" : "FAIL"`. It should NOT be used for complex conditions or nested decisions — those should use `if/else` chains for readability.'
        },
        {
          question: 'What does `continue` do inside a loop?',
          options: [
            { id: 'a', text: 'Exits the loop entirely and continues with the code after the loop', isCorrect: false },
            { id: 'b', text: 'Pauses the loop for one iteration before resuming', isCorrect: false },
            { id: 'c', text: 'Skips the rest of the current iteration and immediately moves to the next one', isCorrect: true },
            { id: 'd', text: 'Restarts the loop from the beginning', isCorrect: false },
          ],
          explanation: '`continue` says "I am done with this item — move to the next one." It skips any remaining code in the current iteration without exiting the loop. `break` exits the loop entirely. For example, `if (result === "skip") continue;` in a results loop will skip processing for skipped tests but continue processing all remaining results.'
        },
      ]
    },
    {
      level: 'ts-template-destructuring',
      questions: [
        {
          question: 'What syntax is required for a template literal in TypeScript?',
          options: [
            { id: 'a', text: 'Double quotes with + concatenation: "Hello " + name', isCorrect: false },
            { id: 'b', text: 'Backtick strings with ${} for expressions: `Hello ${name}`', isCorrect: true },
            { id: 'c', text: 'Single quotes with %s placeholders: \'Hello %s\'', isCorrect: false },
            { id: 'd', text: 'Any string type supports ${} automatically', isCorrect: false },
          ],
          explanation: 'Template literals use backtick characters (` — the key left of 1) instead of quotes. Expressions are embedded using `${}`. Any valid JavaScript expression goes inside the braces: variables, arithmetic, ternary operators, function calls. Single and double quoted strings do NOT support `${}` interpolation — the `$` is treated as a literal character.'
        },
        {
          question: 'Given `const [first, , third] = ["a", "b", "c"]`, what are the values of `first` and `third`?',
          options: [
            { id: 'a', text: 'first = "a", third = "b"', isCorrect: false },
            { id: 'b', text: 'first = "a", third = "c"', isCorrect: true },
            { id: 'c', text: 'first = "b", third = "c"', isCorrect: false },
            { id: 'd', text: 'A compile error — you cannot skip array positions', isCorrect: false },
          ],
          explanation: 'The double comma `[first, , third]` intentionally skips the second element. Array destructuring is position-based: `first` maps to index 0 ("a"), the empty slot skips index 1 ("b"), and `third` maps to index 2 ("c"). This is valid syntax for when you need some elements but not others.'
        },
        {
          question: 'In object destructuring `const { status: httpStatus } = response`, what does "status: httpStatus" mean?',
          options: [
            { id: 'a', text: 'Checks if status equals httpStatus', isCorrect: false },
            { id: 'b', text: 'Creates a variable called `httpStatus` with the value of the `status` property', isCorrect: true },
            { id: 'c', text: 'Creates two variables: `status` and `httpStatus`, both with the same value', isCorrect: false },
            { id: 'd', text: 'A TypeScript type assertion on the status field', isCorrect: false },
          ],
          explanation: 'In destructuring, `{ propertyName: localName }` means "take the property called `propertyName` from the object and store it in a local variable called `localName`". The original property name (`status`) is not available as a variable — only the renamed version (`httpStatus`) is. This is useful when the property name would conflict with an existing variable, or when you want a more descriptive local name.'
        },
        {
          question: 'What does the spread operator do in `const merged = { ...defaultConfig, ...overrides }`?',
          options: [
            { id: 'a', text: 'Mutates defaultConfig by adding properties from overrides', isCorrect: false },
            { id: 'b', text: 'Creates a new object with all properties from both objects; overrides properties win on key conflicts', isCorrect: true },
            { id: 'c', text: 'Creates a nested object with defaultConfig and overrides as sub-objects', isCorrect: false },
            { id: 'd', text: 'Only copies the first-level keys from defaultConfig', isCorrect: false },
          ],
          explanation: 'Spread creates a NEW object by copying properties from each spread source in order. When the same key appears in both objects (e.g., `timeout`), the LATER spread wins. `{ ...defaultConfig, ...overrides }` means "start with all of defaultConfig\'s properties, then apply overrides — overrides win on conflicts". Neither original object is mutated. This is the standard pattern for building environment-specific configs from a base config.'
        },
        {
          question: 'What is a key limitation of the spread operator when copying objects?',
          options: [
            { id: 'a', text: 'It cannot copy more than 10 properties', isCorrect: false },
            { id: 'b', text: 'It only works with arrays, not objects', isCorrect: false },
            { id: 'c', text: 'It performs a shallow copy — nested objects are still shared by reference', isCorrect: true },
            { id: 'd', text: 'It removes all methods from the original object', isCorrect: false },
          ],
          explanation: 'Spread copies only the top-level properties. If an object has a nested object (e.g., `config.database = { host: "localhost" }`), spreading creates a new outer object but the nested `database` object is the SAME reference in both original and copy. Mutating `copy.database.host` will also change `original.database.host`. For deep copies you need a library (like lodash\'s cloneDeep) or JSON.parse(JSON.stringify(obj)) for simple cases.'
        },
      ]
    },

    {
      level: 'ts-basic-types',
      questions: [
        {
          question: 'What is the key difference between "any" and "unknown" in TypeScript?',
          options: [
            { id: 'a', text: 'They are identical  --  both accept any value without restrictions', isCorrect: false },
            { id: 'b', text: '"any" disables all type checking; "unknown" requires type verification before use', isCorrect: true },
            { id: 'c', text: '"unknown" is only for numbers; "any" is for all types', isCorrect: false },
            { id: 'd', text: '"any" requires type verification; "unknown" disables checking', isCorrect: false },
          ],
          explanation: '"any" is a complete escape hatch  --  TypeScript turns off all checking for that variable. "unknown" is the safe alternative: it accepts any value, but forces you to verify the type (via typeof or instanceof) before calling any methods on it.'
        },
        {
          question: 'Which TypeScript type is used for a function that ALWAYS throws an error and never returns normally?',
          options: [
            { id: 'a', text: 'void', isCorrect: false },
            { id: 'b', text: 'undefined', isCorrect: false },
            { id: 'c', text: 'null', isCorrect: false },
            { id: 'd', text: 'never', isCorrect: true },
          ],
          explanation: '"never" is the type for values that never occur. A function returning "never" either always throws an error or runs an infinite loop  --  it can never complete normally. It\'s also used in exhaustive switch checks to ensure all union cases are handled.'
        },
        {
          question: 'What is "type inference" in TypeScript?',
          options: [
            { id: 'a', text: 'TypeScript converting types at runtime', isCorrect: false },
            { id: 'b', text: 'TypeScript automatically detecting the type from the assigned value without explicit annotation', isCorrect: true },
            { id: 'c', text: 'The programmer manually specifying every type annotation', isCorrect: false },
            { id: 'd', text: 'TypeScript guessing types randomly', isCorrect: false },
          ],
          explanation: 'Type inference means TypeScript reads your code and figures out the type from context. When you write "const name = \"Alice\"", TypeScript infers name as string without you writing ": string". This reduces annotation noise while keeping full type safety.'
        },
        {
          question: 'What is the difference between null and undefined in TypeScript?',
          options: [
            { id: 'a', text: 'They are completely identical and interchangeable', isCorrect: false },
            { id: 'b', text: 'undefined means a variable was declared but never assigned; null is an intentional "no value" assignment', isCorrect: true },
            { id: 'c', text: 'null is for numbers; undefined is for strings', isCorrect: false },
            { id: 'd', text: 'undefined only exists in TypeScript; null is a JavaScript concept', isCorrect: false },
          ],
          explanation: 'undefined: the variable exists but was never given a value (or the value was never returned). null: an explicit, intentional "this value is empty." In practice: null is for "I cleared this on purpose" (e.g., after logout); undefined is for "not yet set."'
        },
        {
          question: 'Which type should you use for a function that performs a side effect (like console.log) and returns nothing?',
          options: [
            { id: 'a', text: 'null', isCorrect: false },
            { id: 'b', text: 'undefined', isCorrect: false },
            { id: 'c', text: 'void', isCorrect: true },
            { id: 'd', text: 'never', isCorrect: false },
          ],
          explanation: '"void" is the correct return type for functions that do not return a meaningful value. It signals to callers "this function is called for its side effects only  --  do not try to use its return value."'
        },
      ]
    },
    {
      level: 'ts-arrays-tuples',
      questions: [
        {
          question: 'What are the two equivalent ways to declare a typed array of strings in TypeScript?',
          options: [
            { id: 'a', text: 'string[] and Array<string>', isCorrect: true },
            { id: 'b', text: 'string[] and StringArray', isCorrect: false },
            { id: 'c', text: 'Array<string> and [string]', isCorrect: false },
            { id: 'd', text: 'string{} and Array[string]', isCorrect: false },
          ],
          explanation: 'Both "string[]" (shorthand) and "Array<string>" (generic syntax) declare the same thing: a typed array where every element must be a string. They are completely interchangeable; most teams prefer "string[]" for readability.'
        },
        {
          question: 'What is a key characteristic of a readonly array in TypeScript?',
          options: [
            { id: 'a', text: 'It can only be read by admin users', isCorrect: false },
            { id: 'b', text: 'push(), pop(), and splice() methods are not available on it', isCorrect: true },
            { id: 'c', text: 'It cannot contain more than 10 elements', isCorrect: false },
            { id: 'd', text: 'It must be initialised with values and cannot be empty', isCorrect: false },
          ],
          explanation: 'A readonly array (e.g., "readonly string[]" or "ReadonlyArray<string>") disables all mutation methods: push, pop, splice, shift, unshift. You can still read elements and iterate  --  you just cannot modify the array. Perfect for immutable test configuration.'
        },
        {
          question: 'How is a tuple fundamentally different from a regular array?',
          options: [
            { id: 'a', text: 'Tuples can only contain numbers; arrays can contain any type', isCorrect: false },
            { id: 'b', text: 'Tuples have a fixed length and a specific type for each position; arrays have variable length and one type for all elements', isCorrect: true },
            { id: 'c', text: 'Tuples are mutable; arrays are immutable', isCorrect: false },
            { id: 'd', text: 'Tuples use {} syntax; arrays use [] syntax', isCorrect: false },
          ],
          explanation: 'A tuple is like a strict database row with a fixed schema. [string, number, boolean] means: position 0 MUST be string, position 1 MUST be number, position 2 MUST be boolean  --  and there are exactly 3 elements. Arrays have variable length and all elements share one type.'
        },
        {
          question: 'You define: const point: [number, number] = [10, 20]. What does TypeScript infer about point[0]?',
          options: [
            { id: 'a', text: 'any', isCorrect: false },
            { id: 'b', text: 'number | string', isCorrect: false },
            { id: 'c', text: 'number', isCorrect: true },
            { id: 'd', text: 'unknown', isCorrect: false },
          ],
          explanation: 'Because the tuple type [number, number] explicitly declares position 0 as number, TypeScript knows point[0] is a number. You can call number-specific methods on it without any type assertions.'
        },
        {
          question: 'In a data-driven test using tuples, what is the main advantage over using a plain any[] array?',
          options: [
            { id: 'a', text: 'Tuples run test faster', isCorrect: false },
            { id: 'b', text: 'TypeScript enforces the correct type and order of each parameter in every test row at compile time', isCorrect: true },
            { id: 'c', text: 'Tuples automatically generate test names', isCorrect: false },
            { id: 'd', text: 'Tuples allow more test cases per file', isCorrect: false },
          ],
          explanation: 'With typed tuples (e.g., [username: string, password: string, shouldPass: boolean]), TypeScript catches it immediately if you accidentally swap a string and boolean, or add an extra element. With any[], all such bugs run silently.'
        },
      ]
    },
    {
      level: 'ts-objects-interfaces',
      questions: [
        {
          question: 'In an interface, what does the "?" after a property name signify?',
          options: [
            { id: 'a', text: 'The property type is unknown', isCorrect: false },
            { id: 'b', text: 'The property is optional and may be omitted when creating an object', isCorrect: true },
            { id: 'c', text: 'The property is readonly', isCorrect: false },
            { id: 'd', text: 'The property is deprecated', isCorrect: false },
          ],
          explanation: '"property?: type" declares an optional property. Objects implementing the interface are valid with or without this property. TypeScript types it as "type | undefined" internally, which means you must handle the undefined case before using it safely.'
        },
        {
          question: 'What happens if you try to reassign a property marked "readonly" in an interface?',
          options: [
            { id: 'a', text: 'It silently ignores the reassignment', isCorrect: false },
            { id: 'b', text: 'It creates a new copy of the object with the new value', isCorrect: false },
            { id: 'c', text: 'TypeScript raises a compile-time error', isCorrect: true },
            { id: 'd', text: 'It only prevents reassignment if the object is also const', isCorrect: false },
          ],
          explanation: '"readonly" is enforced by TypeScript at compile time. Attempting to write "obj.id = newValue" after creation raises: "Cannot assign to \'id\' because it is a read-only property." This is purely a TypeScript guarantee  --  at runtime (plain JS), the property is still technically writable.'
        },
        {
          question: 'Interface B extends Interface A. Which statement is true about objects of type B?',
          options: [
            { id: 'a', text: 'Objects of type B only need the properties defined in B, not A', isCorrect: false },
            { id: 'b', text: 'Objects of type B must have all properties from both A and B', isCorrect: true },
            { id: 'c', text: 'Extending replaces A\'s properties with B\'s properties', isCorrect: false },
            { id: 'd', text: 'B can only be used where A is expected, not vice versa', isCorrect: false },
          ],
          explanation: 'Extending combines shapes. If A has { name: string } and B extends A with { age: number }, then type B requires BOTH name AND age. Any object of type B can also be used where type A is expected (structural subtyping).'
        },
        {
          question: 'What is an "index signature" in a TypeScript interface used for?',
          options: [
            { id: 'a', text: 'Sorting the properties alphabetically', isCorrect: false },
            { id: 'b', text: 'Typing objects where property names are dynamic and not known at design time', isCorrect: true },
            { id: 'c', text: 'Defining the order in which properties must be assigned', isCorrect: false },
            { id: 'd', text: 'Creating numbered arrays inside interfaces', isCorrect: false },
          ],
          explanation: 'An index signature like "[key: string]: number" says: "this object can have any string keys, but all values must be numbers." Useful for things like test result maps where you don\'t know the exact test names upfront but know all values will be pass/fail/skip.'
        },
        {
          question: 'In a Page Object Model, why is defining an ILoginPage interface before writing the LoginPage class considered best practice?',
          options: [
            { id: 'a', text: 'Interfaces make the class compile faster', isCorrect: false },
            { id: 'b', text: 'The interface forces the class to implement every required method, and allows swapping implementations without changing test code', isCorrect: true },
            { id: 'c', text: 'Interfaces add runtime validation to the page object', isCorrect: false },
            { id: 'd', text: 'Without an interface, TypeScript cannot detect the class', isCorrect: false },
          ],
          explanation: 'The interface defines the contract (what the page can do) separately from the implementation (how it does it). Tests depend on the interface, not the class. This means you can swap LoginPage for a MockLoginPage in unit tests without touching any test code.'
        },
      ]
    },
    {
      level: 'ts-functions',
      questions: [
        {
          question: 'An async function in TypeScript always has what return type?',
          options: [
            { id: 'a', text: 'void', isCorrect: false },
            { id: 'b', text: 'Promise<T> where T is the type of the resolved value', isCorrect: true },
            { id: 'c', text: 'unknown', isCorrect: false },
            { id: 'd', text: 'AsyncReturn<T>', isCorrect: false },
          ],
          explanation: 'async functions always return a Promise. If you write "async function getTitle(): Promise<string>", it returns a Promise that resolves to a string. Annotating this explicitly is important  --  without it, TypeScript infers Promise<any> which loses type safety.'
        },
        {
          question: 'What is the rule about positioning optional parameters in a function signature?',
          options: [
            { id: 'a', text: 'Optional parameters must come before all required parameters', isCorrect: false },
            { id: 'b', text: 'Optional parameters must come after all required parameters', isCorrect: true },
            { id: 'c', text: 'Optional parameters can be placed anywhere in the signature', isCorrect: false },
            { id: 'd', text: 'TypeScript does not support optional function parameters', isCorrect: false },
          ],
          explanation: 'Required parameters must come first. Placing an optional parameter before a required one is a syntax error: "function bad(optional?: string, required: number)" will fail to compile. Optional and default parameters always go at the end.'
        },
        {
          question: 'What does "...tags: string[]" as a function parameter mean?',
          options: [
            { id: 'a', text: 'tags is a single string split by "..."', isCorrect: false },
            { id: 'b', text: 'tags is a rest parameter  --  the function accepts any number of string arguments collected into an array called tags', isCorrect: true },
            { id: 'c', text: 'tags is an optional array parameter', isCorrect: false },
            { id: 'd', text: 'The "..." operator spreads the array before the function runs', isCorrect: false },
          ],
          explanation: 'Rest parameters (prefixed with ...) capture all remaining arguments into a typed array. "function tag(name: string, ...tags: string[])" can be called as tag("Test", "smoke", "auth", "critical")  --  the three strings after name are collected into tags: string[].'
        },
        {
          question: 'You have: type Handler = (event: string, data: unknown) => void. What does this define?',
          options: [
            { id: 'a', text: 'An interface with two methods', isCorrect: false },
            { id: 'b', text: 'A type alias describing the signature of a function  --  its parameter types and return type', isCorrect: true },
            { id: 'c', text: 'A class with an event and data property', isCorrect: false },
            { id: 'd', text: 'A generic type that creates functions', isCorrect: false },
          ],
          explanation: 'Type aliases can describe function signatures. "type Handler = (event: string, data: unknown) => void" means: any function that accepts a string and an unknown value, and returns nothing, satisfies the Handler type. This is how you type callbacks and higher-order functions.'
        },
        {
          question: 'What is the difference between a default parameter and an optional parameter?',
          options: [
            { id: 'a', text: 'They are identical  --  both use the ? syntax', isCorrect: false },
            { id: 'b', text: 'A default parameter provides a fallback value when omitted; an optional parameter receives undefined when omitted', isCorrect: true },
            { id: 'c', text: 'Default parameters must always be strings', isCorrect: false },
            { id: 'd', text: 'Optional parameters cannot be the last parameter in a function', isCorrect: false },
          ],
          explanation: 'Optional parameter (timeout?: number): if caller omits it, the value inside the function is undefined. Default parameter (timeout: number = 30000): if caller omits it, the value inside is 30000. Default parameters are generally preferable because they avoid the need for "?? fallback" inside the function body.'
        },
      ]
    },
    {
      level: 'ts-union-intersection',
      questions: [
        {
          question: 'What does the | symbol mean when used between types in TypeScript?',
          options: [
            { id: 'a', text: 'Intersection  --  the value must satisfy both types', isCorrect: false },
            { id: 'b', text: 'Union  --  the value can be any one of the listed types', isCorrect: true },
            { id: 'c', text: 'Pipe  --  the output of one type feeds into the next', isCorrect: false },
            { id: 'd', text: 'Bitwise OR  --  only valid for number types', isCorrect: false },
          ],
          explanation: '"string | number" is a union type meaning the variable can hold a string OR a number  --  either is valid. TypeScript will only allow you to call methods that exist on ALL members of the union (without narrowing).'
        },
        {
          question: 'In a discriminated union, what is the "discriminant"?',
          options: [
            { id: 'a', text: 'The | symbol that joins the union members', isCorrect: false },
            { id: 'b', text: 'A common literal type property (e.g., status: "pass") that uniquely identifies which variant of the union you have', isCorrect: true },
            { id: 'c', text: 'The first property listed in each union member', isCorrect: false },
            { id: 'd', text: 'Any optional property shared between variants', isCorrect: false },
          ],
          explanation: 'The discriminant is a shared property with a unique literal type per variant. When you check result.status === "fail", TypeScript narrows the type to FailResult and unlocks that variant\'s exclusive properties (errorMessage, stackTrace). This is the cornerstone of type-safe state machines.'
        },
        {
          question: 'What does the & symbol mean when used between types in TypeScript?',
          options: [
            { id: 'a', text: 'Union  --  the value can be either type', isCorrect: false },
            { id: 'b', text: 'Intersection  --  the value must satisfy ALL of the combined types simultaneously', isCorrect: true },
            { id: 'c', text: 'Address-of  --  it returns the memory reference of the type', isCorrect: false },
            { id: 'd', text: 'Optional  --  makes all properties in the combined type optional', isCorrect: false },
          ],
          explanation: '"TypeA & TypeB" is an intersection: the resulting type has ALL properties from both TypeA and TypeB. An object must satisfy every property from every member of the intersection. It\'s commonly used to build composite types from smaller, reusable pieces.'
        },
        {
          question: 'What is typeof used for in the context of TypeScript type guards?',
          options: [
            { id: 'a', text: 'It converts a value from one type to another at runtime', isCorrect: false },
            { id: 'b', text: 'It narrows a union type at runtime by checking if the value is "string", "number", "boolean", etc.', isCorrect: true },
            { id: 'c', text: 'It removes a type from a union', isCorrect: false },
            { id: 'd', text: 'It creates a new type based on the shape of an existing variable', isCorrect: false },
          ],
          explanation: 'typeof is a runtime JavaScript operator. In an if-block ("if (typeof x === \'string\')"), TypeScript recognises this as a type guard and narrows x\'s type to string inside that block. This allows safe use of string-only methods like .toUpperCase() without errors.'
        },
        {
          question: 'type Status = "pass" | "fail" | "skip" defines what kind of type?',
          options: [
            { id: 'a', text: 'A string enum', isCorrect: false },
            { id: 'b', text: 'A union of string literal types', isCorrect: true },
            { id: 'c', text: 'An array of strings', isCorrect: false },
            { id: 'd', text: 'A template literal type', isCorrect: false },
          ],
          explanation: 'This is a union of string literal types  --  also called a "string literal union." It\'s different from an enum in that no enum object is created. The variable typed as Status can only hold exactly "pass", "fail", or "skip"  --  any other string is a compile error.'
        },
      ]
    },
    {
      level: 'ts-enums',
      questions: [
        {
          question: 'What is the main advantage of using a string enum over plain string constants?',
          options: [
            { id: 'a', text: 'String enums run faster than string constants', isCorrect: false },
            { id: 'b', text: 'Enum values appear human-readable in logs AND typos in enum member names become compile errors', isCorrect: true },
            { id: 'c', text: 'String enums automatically validate input at runtime', isCorrect: false },
            { id: 'd', text: 'String enums can be used in switch statements; string constants cannot', isCorrect: false },
          ],
          explanation: 'String enums give you two wins: (1) when a value is logged or debugged it shows "staging" not 1, making logs readable; (2) if you mistype TestStatus.Passs, TypeScript catches it immediately. Plain strings don\'t catch typos until runtime.'
        },
        {
          question: 'You have: enum HttpStatus { OK = 200, NotFound = 404 }. What is the value of HttpStatus.OK?',
          options: [
            { id: 'a', text: '"OK"', isCorrect: false },
            { id: 'b', text: '0', isCorrect: false },
            { id: 'c', text: '200', isCorrect: true },
            { id: 'd', text: 'undefined', isCorrect: false },
          ],
          explanation: 'Numeric enums with explicit initializers (= 200) use that exact value. HttpStatus.OK equals the number 200. This makes API test assertions readable: "expect(response.status).toBe(HttpStatus.OK)" rather than a magic number.'
        },
        {
          question: 'What is the key difference between a regular "enum" and a "const enum"?',
          options: [
            { id: 'a', text: 'const enums can only hold string values; regular enums hold numbers', isCorrect: false },
            { id: 'b', text: 'const enums are inlined at compile time and do not create a runtime object; regular enums create an object in the compiled JavaScript', isCorrect: true },
            { id: 'c', text: 'const enums cannot be iterated with Object.values()', isCorrect: false },
            { id: 'd', text: 'There is no difference  --  "const enum" is just a style preference', isCorrect: false },
          ],
          explanation: 'const enums are completely erased during compilation. Every usage is replaced with the literal value. "const enum Status { Pass = \'pass\' }" compiles "Status.Pass" to the literal string "\'pass\'" everywhere it appears  --  no enum object exists at runtime, resulting in smaller bundles.'
        },
        {
          question: 'How do you iterate over all values of a string enum at runtime?',
          options: [
            { id: 'a', text: 'for (const v in MyEnum)', isCorrect: false },
            { id: 'b', text: 'MyEnum.values()', isCorrect: false },
            { id: 'c', text: 'Object.values(MyEnum)', isCorrect: true },
            { id: 'd', text: 'Array.from(MyEnum)', isCorrect: false },
          ],
          explanation: 'For string enums, Object.values(MyEnum) returns an array of the string values (e.g., ["chromium", "firefox", "webkit"]). For numeric enums it\'s trickier due to reverse mappings. Object.values() is the idiomatic way to get enum members for iteration.'
        },
        {
          question: 'When is a literal union type (type Status = "pass" | "fail") generally preferred over an enum?',
          options: [
            { id: 'a', text: 'Always  --  enums are never needed in TypeScript', isCorrect: false },
            { id: 'b', text: 'When you just need a fixed set of string values without needing to iterate programmatically or centralise changes across many files', isCorrect: true },
            { id: 'c', text: 'When you need the values to be numbers', isCorrect: false },
            { id: 'd', text: 'When the type is used in only one file', isCorrect: false },
          ],
          explanation: 'Literal unions are simpler  --  no import, no runtime object, no overhead. Use enums when: (1) you need to iterate with Object.values(), (2) the constants are used across many files and might change, (3) you want the label to differ from the value. For simple cases, literal unions are cleaner.'
        },
      ]
    },
    {
      level: 'ts-type-aliases',
      questions: [
        {
          question: 'Which of the following CANNOT be expressed with "interface" but CAN be expressed with "type"?',
          options: [
            { id: 'a', text: 'An object shape with named properties', isCorrect: false },
            { id: 'b', text: 'A union of string literals like type Status = "pass" | "fail"', isCorrect: true },
            { id: 'c', text: 'An interface that another interface extends', isCorrect: false },
            { id: 'd', text: 'A type that a class implements', isCorrect: false },
          ],
          explanation: 'interface cannot express union types. "interface Status = \'pass\' | \'fail\'" is invalid syntax. Unions must use "type". This is the clearest practical difference: use type for unions, function signatures, and primitive aliases; use interface for object shapes that might be extended.'
        },
        {
          question: 'What is the purpose of giving a primitive type alias like "type Milliseconds = number"?',
          options: [
            { id: 'a', text: 'It creates a new numeric type that is incompatible with regular numbers', isCorrect: false },
            { id: 'b', text: 'It communicates semantic intent  --  readers know this number represents a duration in milliseconds, not just any number', isCorrect: true },
            { id: 'c', text: 'It validates at runtime that the value is a valid millisecond count', isCorrect: false },
            { id: 'd', text: 'It restricts the value to be less than 1000', isCorrect: false },
          ],
          explanation: 'Type aliases for primitives are documentation-as-code. "Milliseconds" and "Percentage" are still just numbers at runtime, but they signal intent clearly. A function signature "function wait(delay: Milliseconds): void" tells callers exactly what unit to use  --  no need for comments.'
        },
        {
          question: 'What does "declaration merging" mean for interfaces, and why does type not support it?',
          options: [
            { id: 'a', text: 'Interfaces can be defined multiple times in the same file and TypeScript merges them into one', isCorrect: true },
            { id: 'b', text: 'Interfaces can merge with classes automatically', isCorrect: false },
            { id: 'c', text: 'TypeScript merges all interface properties into a single flat object at runtime', isCorrect: false },
            { id: 'd', text: 'Declaration merging only applies to enums, not interfaces', isCorrect: false },
          ],
          explanation: 'If you declare "interface Window { myProp: string }" twice in different files, TypeScript merges both declarations into one. This is used by library authors to extend built-in types. "type" aliases cannot be redeclared  --  a second "type Window = ..." is an error.'
        },
        {
          question: 'You write: type EventHandler = (event: string) => void. What does this alias describe?',
          options: [
            { id: 'a', text: 'An object with an event property', isCorrect: false },
            { id: 'b', text: 'The type signature of a function that accepts a string and returns nothing', isCorrect: true },
            { id: 'c', text: 'A string that ends with "Handler"', isCorrect: false },
            { id: 'd', text: 'A generic class for event handling', isCorrect: false },
          ],
          explanation: 'type aliases can describe function signatures. "EventHandler" is the type of any function that takes a string argument and returns void. This is useful for typing callbacks, hooks, and higher-order functions without repeating the signature.'
        },
        {
          question: 'type TestTree = string | { name: string; children: TestTree[] } demonstrates what TypeScript feature?',
          options: [
            { id: 'a', text: 'A circular type reference that causes infinite loops', isCorrect: false },
            { id: 'b', text: 'A recursive type alias  --  the type refers to itself to model arbitrarily nested structures', isCorrect: true },
            { id: 'c', text: 'A union type that can only be used once', isCorrect: false },
            { id: 'd', text: 'A generic type with a default value', isCorrect: false },
          ],
          explanation: 'Recursive type aliases allow types to refer to themselves. TestTree can be a plain string (a leaf test) or an object containing an array of more TestTrees (a branch). This models tree structures like nested test suites or file system paths with full type safety.'
        },
      ]
    },
    {
      level: 'ts-null-safety',
      questions: [
        {
          question: 'What does the optional chaining operator ?. do when the value on its left is null or undefined?',
          options: [
            { id: 'a', text: 'It throws a TypeError', isCorrect: false },
            { id: 'b', text: 'It short-circuits and returns undefined instead of crashing', isCorrect: true },
            { id: 'c', text: 'It converts null to 0 and undefined to an empty string', isCorrect: false },
            { id: 'd', text: 'It logs a warning and continues with the original null value', isCorrect: false },
          ],
          explanation: 'Optional chaining short-circuits safely. "user?.address?.city" returns undefined if user is null/undefined, or if address is null/undefined  --  without throwing. This eliminates an entire class of "Cannot read property of undefined" runtime crashes.'
        },
        {
          question: 'What is the critical difference between ?? (nullish coalescing) and || (logical OR) for fallback values?',
          options: [
            { id: 'a', text: 'They are identical  --  both treat null, undefined, 0, false, and "" as falsy', isCorrect: false },
            { id: 'b', text: '?? only uses the fallback for null/undefined; || uses the fallback for any falsy value including 0, false, and ""', isCorrect: true },
            { id: 'c', text: '?? is only for numbers; || is for booleans', isCorrect: false },
            { id: 'd', text: '|| provides a default; ?? throws an error if null is found', isCorrect: false },
          ],
          explanation: 'Critical distinction: "const timeout = userTimeout ?? 5000"  --  if userTimeout is 0 (a valid timeout), ?? returns 0. But "const timeout = userTimeout || 5000"  --  if userTimeout is 0, || treats it as falsy and returns 5000. For numeric config values, ?? is almost always the correct choice.'
        },
        {
          question: 'When should you use the non-null assertion operator (!) in TypeScript?',
          options: [
            { id: 'a', text: 'Whenever TypeScript shows a "possibly null" error to quickly silence it', isCorrect: false },
            { id: 'b', text: 'Only when you have absolute certainty the value cannot be null/undefined and want to avoid the runtime check overhead', isCorrect: true },
            { id: 'c', text: 'It is the standard way to handle null in TypeScript', isCorrect: false },
            { id: 'd', text: 'It should never be used  --  it causes compilation to fail', isCorrect: false },
          ],
          explanation: '"!" is an escape hatch, not a solution. It tells TypeScript to ignore the null/undefined possibility. If you\'re wrong at runtime, you still get a crash. The best practice is to use if-checks or optional chaining instead. "!" should be extremely rare in well-written TypeScript.'
        },
        {
          question: 'With "strict": true, what must you do to store null in a variable typed as string?',
          options: [
            { id: 'a', text: 'Nothing  --  null is always assignable to any type', isCorrect: false },
            { id: 'b', text: 'Use a type assertion: const x = null as string', isCorrect: false },
            { id: 'c', text: 'Explicitly declare the type as "string | null"', isCorrect: true },
            { id: 'd', text: 'Set "strictNullChecks": false in tsconfig.json', isCorrect: false },
          ],
          explanation: 'With strictNullChecks enabled (part of "strict": true), null and undefined are not assignable to other types unless explicitly included. "let x: string = null" is an error. "let x: string | null = null" is correct  --  and it forces you to handle the null case before using x as a string.'
        },
        {
          question: 'In TypeScript, after writing "if (value !== null) { ... }", what happens to the type of "value" inside the if block?',
          options: [
            { id: 'a', text: 'It remains "string | null"  --  TypeScript doesn\'t track if-checks', isCorrect: false },
            { id: 'b', text: 'It is narrowed to "string"  --  TypeScript removes null from the union', isCorrect: true },
            { id: 'c', text: 'It becomes "unknown"', isCorrect: false },
            { id: 'd', text: 'It becomes "never" because null was ruled out', isCorrect: false },
          ],
          explanation: 'This is called "type narrowing." TypeScript performs control flow analysis  --  it tracks what you\'ve checked and narrows the type accordingly. After "if (value !== null)", TypeScript knows null is impossible inside the block and removes it from the union, giving you full access to string methods.'
        },
      ]
    },
    {
      level: 'ts-type-assertions',
      questions: [
        {
          question: 'What does the "as" keyword do in TypeScript?',
          options: [
            { id: 'a', text: 'It converts the value to a different type at runtime (like casting)', isCorrect: false },
            { id: 'b', text: 'It tells the TypeScript compiler to treat a value as a specific type, without any runtime conversion', isCorrect: true },
            { id: 'c', text: 'It creates a new instance of the specified type', isCorrect: false },
            { id: 'd', text: 'It validates the value matches the type and throws if it doesn\'t', isCorrect: false },
          ],
          explanation: '"as" is a compile-time instruction only. "data as User" does NOT convert data to a User at runtime  --  it just tells TypeScript "trust me, this is a User." If the actual runtime data is null or a different shape, you\'ll still get a crash. Use type guards (typeof, instanceof) for actual runtime safety.'
        },
        {
          question: 'Why is the "as" syntax preferred over the angle-bracket syntax for type assertions in React/TypeScript projects?',
          options: [
            { id: 'a', text: 'The "as" syntax is faster to compile', isCorrect: false },
            { id: 'b', text: 'Angle brackets (<Type>value) conflict with JSX syntax in .tsx files, causing parse errors', isCorrect: true },
            { id: 'c', text: '"as" works with all types; angle brackets only work with primitive types', isCorrect: false },
            { id: 'd', text: 'There is no difference  --  it\'s purely a style preference', isCorrect: false },
          ],
          explanation: 'In .tsx files (TypeScript + JSX), the angle-bracket assertion <MyType>value is ambiguous  --  the parser might interpret it as a JSX element. The "as" keyword was introduced specifically to resolve this. Use "as" universally; it works in both .ts and .tsx files.'
        },
        {
          question: 'A function parameter is typed as "unknown". Which approach safely extracts a string value from it?',
          options: [
            { id: 'a', text: 'const result = (param as string).toUpperCase()', isCorrect: false },
            { id: 'b', text: 'const result = param!.toUpperCase()', isCorrect: false },
            { id: 'c', text: 'if (typeof param === "string") { const result = param.toUpperCase(); }', isCorrect: true },
            { id: 'd', text: 'const result = String(param).toUpperCase()', isCorrect: false },
          ],
          explanation: 'typeof is a type guard that narrows "unknown" to a specific primitive type at runtime. Inside "if (typeof param === \'string\')", TypeScript knows param is definitely a string and allows string methods. The "as string" approach bypasses the check and could crash if param is actually a number or null.'
        },
        {
          question: 'What is a "custom type predicate" function, and what is its return type signature?',
          options: [
            { id: 'a', text: 'A function that converts types, returning the converted value', isCorrect: false },
            { id: 'b', text: 'A function returning "value is Type" that narrows the type inside if-blocks that use it', isCorrect: true },
            { id: 'c', text: 'A function that validates types at compile time', isCorrect: false },
            { id: 'd', text: 'A function returning boolean that automatically narrows types', isCorrect: false },
          ],
          explanation: 'A type predicate has the form "function isUser(val: unknown): val is User". The "val is User" return type is the predicate. When you call "if (isUser(data))", TypeScript narrows data to User inside the if-block. Crucially, the return type must say "val is Type"  --  a plain "boolean" return does NOT narrow the type.'
        },
        {
          question: 'When is the "in" operator used as a type guard?',
          options: [
            { id: 'a', text: 'To check if a value is inside an array', isCorrect: false },
            { id: 'b', text: 'To narrow a union type by checking whether a specific property exists on the object', isCorrect: true },
            { id: 'c', text: 'To check if a number is within a range', isCorrect: false },
            { id: 'd', text: 'To verify an object is inside a Set or Map', isCorrect: false },
          ],
          explanation: '"\'errorMessage\' in result" checks at runtime whether the object has an errorMessage property. TypeScript uses this check to narrow a union. If FailResult has errorMessage and PassResult doesn\'t, then after "if (\'errorMessage\' in result)", TypeScript knows result is FailResult and unlocks its exclusive properties.'
        },
      ]
    },
    {
      level: 'ts-generics',
      questions: [
        {
          question: 'What does the type parameter <T> represent in a generic function?',
          options: [
            { id: 'a', text: 'A reserved keyword for TypeScript templates', isCorrect: false },
            { id: 'b', text: 'A placeholder that is replaced with an actual type when the function is called', isCorrect: true },
            { id: 'c', text: 'The return type of the function', isCorrect: false },
            { id: 'd', text: 'A shorthand for the "any" type', isCorrect: false },
          ],
          explanation: 'T is simply a convention-based placeholder name. When you call getFirst([1,2,3]), TypeScript infers T = number and substitutes it everywhere T appears in the function signature. You could name it anything (U, TData, etc.) — it\'s just a variable at the type level.'
        },
        {
          question: 'Which generic constraint syntax restricts T to types that have a "length" property?',
          options: [
            { id: 'a', text: 'function len<T: { length: number }>(val: T)', isCorrect: false },
            { id: 'b', text: 'function len<T where T.length>(val: T)', isCorrect: false },
            { id: 'c', text: 'function len<T extends { length: number }>(val: T)', isCorrect: true },
            { id: 'd', text: 'function len<T implements { length: number }>(val: T)', isCorrect: false },
          ],
          explanation: 'The "extends" keyword in a generic context means "must be assignable to" (a structural subtype of). <T extends { length: number }> says T can be any type as long as it has a numeric length property — which covers strings, arrays, and custom objects with length.'
        },
        {
          question: 'In a QA context, what is the main benefit of a generic BasePage<TSelectors> class?',
          options: [
            { id: 'a', text: 'It removes the need for selectors entirely', isCorrect: false },
            { id: 'b', text: 'It forces all page objects to use the same selectors', isCorrect: false },
            { id: 'c', text: 'It provides shared methods (goto, waitForLoad) while keeping each page\'s selectors strongly-typed', isCorrect: true },
            { id: 'd', text: 'It automatically generates tests from selectors', isCorrect: false },
          ],
          explanation: 'A generic BasePage<TSelectors> lets you write shared automation logic once (goto, waitForLoad, screenshot) while each subclass passes its own selector shape as TSelectors. TypeScript then enforces that you only access selectors that actually exist on that specific page — catching typos at compile time instead of at runtime.'
        },
        {
          question: 'What does a generic API response wrapper type like ApiResponse<T> = { data: T; status: number } achieve?',
          options: [
            { id: 'a', text: 'It makes every API call return the same hardcoded data shape', isCorrect: false },
            { id: 'b', text: 'It eliminates the need to type API responses at all', isCorrect: false },
            { id: 'c', text: 'It provides a reusable wrapper where the payload type is specified per call-site, preserving full type safety', isCorrect: true },
            { id: 'd', text: 'It validates API responses at runtime automatically', isCorrect: false },
          ],
          explanation: 'ApiResponse<User> and ApiResponse<Order[]> share the same wrapper shape but have strongly-typed data fields. This pattern eliminates repetition while giving you autocomplete and type checking on the payload without casting to any.'
        },
        {
          question: 'Which of the following best describes a keyof T constraint in generics?',
          options: [
            { id: 'a', text: 'It restricts T to only primitive types', isCorrect: false },
            { id: 'b', text: 'K extends keyof T means K must be one of the property names of T', isCorrect: true },
            { id: 'c', text: 'It converts T into a union of its value types', isCorrect: false },
            { id: 'd', text: 'K can be any string when T is an interface', isCorrect: false },
          ],
          explanation: 'function getProperty<T, K extends keyof T>(obj: T, key: K) means K must be a valid key of T. This lets TypeScript infer the exact return type T[K] — if T is User and K is "email", the return type is string. Passing an invalid key ("phonenumber" when it doesn\'t exist) is a compile error.'
        },
      ]
    },
    {
      level: 'ts-utility-types',
      questions: [
        {
          question: 'What does Partial<User> produce when User has { id: number; name: string; email: string }?',
          options: [
            { id: 'a', text: '{ id?: number; name?: string; email?: string }', isCorrect: true },
            { id: 'b', text: '{ id: number | undefined; name: string | undefined }', isCorrect: false },
            { id: 'c', text: 'An empty object type {}', isCorrect: false },
            { id: 'd', text: 'Removes the id field since it is required', isCorrect: false },
          ],
          explanation: 'Partial<T> makes every property optional by adding ? to each key. The resulting type accepts objects where you provide zero or more of the original fields — perfect for PATCH request bodies or test fixture factories where you only want to override specific fields.'
        },
        {
          question: 'Which utility type would you use to create a type containing only "email" and "name" from a larger User interface?',
          options: [
            { id: 'a', text: 'Omit<User, "id" | "role" | "createdAt">', isCorrect: false },
            { id: 'b', text: 'Pick<User, "email" | "name">', isCorrect: true },
            { id: 'c', text: 'Partial<User>', isCorrect: false },
            { id: 'd', text: 'Required<User>', isCorrect: false },
          ],
          explanation: 'Pick<T, K> constructs a type by selecting only the keys listed in K. Both Pick and Omit achieve similar things, but Pick is more explicit when you want only a few fields, while Omit is cleaner when you want all-but-a-few. Use whichever results in a shorter key list.'
        },
        {
          question: 'When is Readonly<T> most useful in a testing context?',
          options: [
            { id: 'a', text: 'When you want to prevent test fixtures from being accidentally mutated', isCorrect: true },
            { id: 'b', text: 'When you want to make all properties required', isCorrect: false },
            { id: 'c', text: 'When building form state that users can edit', isCorrect: false },
            { id: 'd', text: 'When a function needs to return multiple types', isCorrect: false },
          ],
          explanation: 'Readonly<T> prevents reassignment of any property after object creation. In tests, wrapping your fixture data in Readonly ensures that helper functions can\'t accidentally mutate the shared test data between tests — a common source of flaky test suites.'
        },
        {
          question: 'What does Record<string, number> represent?',
          options: [
            { id: 'a', text: 'An array of [string, number] tuples', isCorrect: false },
            { id: 'b', text: 'A function that maps strings to numbers', isCorrect: false },
            { id: 'c', text: 'An object type where all keys are strings and all values are numbers', isCorrect: true },
            { id: 'd', text: 'A Map data structure with string keys', isCorrect: false },
          ],
          explanation: 'Record<K, V> is equivalent to { [key: K]: V }. Record<string, number> is perfect for things like response time maps { "GET /users": 120, "POST /orders": 250 } where you don\'t know the key names in advance but know the value type is always number.'
        },
        {
          question: 'What does ReturnType<typeof createTestUser> give you?',
          options: [
            { id: 'a', text: 'The type of the first parameter of createTestUser', isCorrect: false },
            { id: 'b', text: 'The inferred return type of the createTestUser function', isCorrect: true },
            { id: 'c', text: 'A new function that calls createTestUser', isCorrect: false },
            { id: 'd', text: 'It only works with async functions', isCorrect: false },
          ],
          explanation: 'ReturnType<T> extracts the return type from a function type. Combined with typeof to get the function\'s type, ReturnType<typeof createTestUser> gives you the exact shape that createTestUser returns — without needing to define or import that type separately. Very useful in test helpers.'
        },
      ]
    },
    {
      level: 'ts-keyof-typeof',
      questions: [
        {
          question: 'What does "keyof User" produce when User is { id: number; name: string; email: string }?',
          options: [
            { id: 'a', text: '{ id: number; name: string; email: string }', isCorrect: false },
            { id: 'b', text: 'number | string', isCorrect: false },
            { id: 'c', text: '"id" | "name" | "email"', isCorrect: true },
            { id: 'd', text: 'An array of property names', isCorrect: false },
          ],
          explanation: 'keyof T produces a union of all key names (as string literals) of the type T. For User, that is "id" | "name" | "email". This makes it impossible to reference a property name that doesn\'t exist on the type — you get a compile error instead of a silent undefined at runtime.'
        },
        {
          question: 'When should you use "typeof" at the type level (not the value level)?',
          options: [
            { id: 'a', text: 'To check if a variable is a string at runtime', isCorrect: false },
            { id: 'b', text: 'To extract the type of an existing variable or function without writing the type manually', isCorrect: true },
            { id: 'c', text: 'To convert a value into its string representation', isCorrect: false },
            { id: 'd', text: 'To assert that a variable is a specific type', isCorrect: false },
          ],
          explanation: 'In a type position, typeof myVar asks "what is the TypeScript type of myVar?". This is different from JavaScript\'s runtime typeof. It\'s useful when you have a value (like a complex config object or function) and want to derive a type from it rather than writing the type by hand.'
        },
        {
          question: 'What problem does "as const" solve for object literals?',
          options: [
            { id: 'a', text: 'It makes the object immutable at runtime using Object.freeze', isCorrect: false },
            { id: 'b', text: 'It widens all literal types to their base types (string, number)', isCorrect: false },
            { id: 'c', text: 'It narrows all values to their literal types, preserving exact string/number constants', isCorrect: true },
            { id: 'd', text: 'It makes all properties required', isCorrect: false },
          ],
          explanation: 'Without "as const", TypeScript infers { status: "active" } as { status: string } — losing the literal "active". With "as const", it becomes { readonly status: "active" }. This matters when you use keyof typeof on constants to get a union of the exact string values rather than just "string".'
        },
        {
          question: 'How would you create a type that can only be one of the values in a STATUS_CODES object?',
          options: [
            { id: 'a', text: 'type Status = keyof typeof STATUS_CODES', isCorrect: false },
            { id: 'b', text: 'type Status = typeof STATUS_CODES', isCorrect: false },
            { id: 'c', text: 'type Status = (typeof STATUS_CODES)[keyof typeof STATUS_CODES]', isCorrect: true },
            { id: 'd', text: 'type Status = keyof STATUS_CODES', isCorrect: false },
          ],
          explanation: '(typeof OBJ)[keyof typeof OBJ] is the standard idiom for "a union of all values in this object". keyof typeof gives you the union of keys, and then [keyof typeof] uses indexed access to get the value types at those keys. Combined with "as const" on STATUS_CODES, you get a tight union of the literal values.'
        },
        {
          question: 'In a function "function getField<T, K extends keyof T>(obj: T, key: K): T[K]", what is the return type T[K]?',
          options: [
            { id: 'a', text: 'Always the string type', isCorrect: false },
            { id: 'b', text: 'The type of the property K on object T — inferred automatically per call', isCorrect: true },
            { id: 'c', text: 'A union of all value types in T', isCorrect: false },
            { id: 'd', text: 'The same as keyof T', isCorrect: false },
          ],
          explanation: 'T[K] is an indexed access type — it looks up the value type at key K in type T. If T is User and K is "email", then T[K] is string. If K is "id", then T[K] is number. TypeScript resolves this per call-site, giving you precise return types instead of "any".'
        },
      ]
    },
    {
      level: 'ts-mapped-types',
      questions: [
        {
          question: 'What does the mapped type "{ [K in keyof T]: boolean }" create?',
          options: [
            { id: 'a', text: 'A copy of T with all values replaced by boolean', isCorrect: true },
            { id: 'b', text: 'A type that checks if T has boolean properties', isCorrect: false },
            { id: 'c', text: 'A function that maps T to booleans', isCorrect: false },
            { id: 'd', text: 'Only works when T has boolean properties', isCorrect: false },
          ],
          explanation: '"[K in keyof T]" iterates over every key in T. Setting the value type to "boolean" replaces ALL value types with boolean. This is exactly how Partial<T> and Required<T> are implemented internally — they iterate over keys and modify the optionality of each one.'
        },
        {
          question: 'What does the "-?" modifier do in a mapped type?',
          options: [
            { id: 'a', text: 'Makes all properties optional', isCorrect: false },
            { id: 'b', text: 'Removes the optional modifier, making all properties required', isCorrect: true },
            { id: 'c', text: 'Removes properties from the type', isCorrect: false },
            { id: 'd', text: 'Makes properties nullable', isCorrect: false },
          ],
          explanation: '-? removes the ? (optional) modifier from properties. { [K in keyof T]-?: T[K] } is exactly how Required<T> is implemented. Conversely, +? (or just ?) adds optionality. The + prefix is the default so it\'s usually omitted; the - prefix explicitly removes the modifier.'
        },
        {
          question: 'In a FormField<T> mapped type for a testing form, what would "{ [K in keyof T]: FormField }" be used for?',
          options: [
            { id: 'a', text: 'To validate that all fields in T are strings', isCorrect: false },
            { id: 'b', text: 'To create a parallel structure where each field from the model has a corresponding FormField config', isCorrect: true },
            { id: 'c', text: 'To make the form read-only', isCorrect: false },
            { id: 'd', text: 'To flatten nested objects in the form', isCorrect: false },
          ],
          explanation: 'Mapped types are perfect for creating parallel structures. If your model has { username, email, password }, a mapped type can create { username: FormField, email: FormField, password: FormField } automatically — and TypeScript will enforce that your form config covers every field of the model with no extras or missing entries.'
        },
        {
          question: 'What does "as" do inside a mapped type key clause like "[K in keyof T as \`get${Capitalize<string & K>}\`]"?',
          options: [
            { id: 'a', text: 'It asserts the value type of the property', isCorrect: false },
            { id: 'b', text: 'It renames the output key using a template literal or other transformation', isCorrect: true },
            { id: 'c', text: 'It filters out keys that are not strings', isCorrect: false },
            { id: 'd', text: 'It makes the property read-only', isCorrect: false },
          ],
          explanation: 'Key remapping with "as" in a mapped type lets you transform the output key names. "[K in keyof T as \`get${Capitalize<string & K>}\`]" takes each key K and renames it to a getter method name. This is how libraries auto-generate getter/setter types from model interfaces.'
        },
        {
          question: 'How can you exclude properties from a mapped type iteration?',
          options: [
            { id: 'a', text: 'Use "delete" on the key inside the mapping', isCorrect: false },
            { id: 'b', text: 'Use "never" in the key remapping clause to filter out unwanted keys', isCorrect: true },
            { id: 'c', text: 'Wrap the value type in Exclude<>', isCorrect: false },
            { id: 'd', text: 'You cannot exclude keys from a mapped type', isCorrect: false },
          ],
          explanation: 'When the "as" remapping clause returns "never" for a key, that key is excluded from the output type entirely. For example, "[K in keyof T as T[K] extends Function ? never : K]" keeps only non-function properties. This lets you filter both what keys and what value types appear in your mapped output.'
        },
      ]
    },
    {
      level: 'ts-conditional-types',
      questions: [
        {
          question: 'What does "T extends string ? true : false" evaluate to when T = number?',
          options: [
            { id: 'a', text: 'true', isCorrect: false },
            { id: 'b', text: 'false', isCorrect: true },
            { id: 'c', text: 'never', isCorrect: false },
            { id: 'd', text: 'A compile error', isCorrect: false },
          ],
          explanation: 'T extends string checks whether T is assignable to string. When T = number, number is not assignable to string, so the condition is false and the type evaluates to the "else" branch: false. Conditional types work at the type level exactly like ternary expressions work at the value level.'
        },
        {
          question: 'What is the purpose of "infer" in a conditional type like "T extends Promise<infer U> ? U : T"?',
          options: [
            { id: 'a', text: 'To assert that T is always a Promise', isCorrect: false },
            { id: 'b', text: 'To capture and name a sub-type within the extends clause for use in the result branches', isCorrect: true },
            { id: 'c', text: 'To make TypeScript infer the type automatically without specifying T', isCorrect: false },
            { id: 'd', text: 'It is equivalent to using "any" inside the type', isCorrect: false },
          ],
          explanation: '"infer U" tells TypeScript: "if T matches Promise<something>, name that something U and make it available in the true branch." Without infer, you could check the shape but couldn\'t extract the inner type. Awaited<T> in the standard library uses exactly this pattern to unwrap Promise layers.'
        },
        {
          question: 'What is distributive behavior in conditional types?',
          options: [
            { id: 'a', text: 'When a conditional type distributes operations across all type parameters', isCorrect: false },
            { id: 'b', text: 'When a union type T extends U applies the conditional to each member of the union separately', isCorrect: true },
            { id: 'c', text: 'When TypeScript distributes a type check across multiple files', isCorrect: false },
            { id: 'd', text: 'When infer captures multiple types at once', isCorrect: false },
          ],
          explanation: 'When T is a naked type parameter and you write T extends U ? X : Y, TypeScript distributes over unions: (string | number) extends string becomes (string extends string ? X : Y) | (number extends string ? X : Y) = X | Y. This allows conditional types to act as type-level filters on unions.'
        },
        {
          question: 'Which built-in utility type is implemented using "T extends undefined | null ? never : T"?',
          options: [
            { id: 'a', text: 'Partial<T>', isCorrect: false },
            { id: 'b', text: 'Required<T>', isCorrect: false },
            { id: 'c', text: 'NonNullable<T>', isCorrect: true },
            { id: 'd', text: 'Readonly<T>', isCorrect: false },
          ],
          explanation: 'NonNullable<T> is defined as T extends null | undefined ? never : T. Because of distributive behavior, NonNullable<string | null | undefined> distributes into (string extends null|undefined ? never : string) | (null extends null|undefined ? never : null) | (undefined extends null|undefined ? never : undefined) = string | never | never = string.'
        },
        {
          question: 'In a testing utility, IsAsyncTest<T> = T extends (...args: any[]) => Promise<any> ? true : false — what does this check?',
          options: [
            { id: 'a', text: 'Whether T has a method called "async"', isCorrect: false },
            { id: 'b', text: 'Whether T is a function that returns a Promise (i.e., an async test function)', isCorrect: true },
            { id: 'c', text: 'Whether the test function has already been awaited', isCorrect: false },
            { id: 'd', text: 'Whether T extends the test runner\'s base class', isCorrect: false },
          ],
          explanation: 'T extends (...args: any[]) => Promise<any> checks if T is any function that returns a Promise — the pattern for async functions. This conditional type can be used to build test utilities that behave differently for async vs sync test functions, such as automatically awaiting results only when needed.'
        },
      ]
    },
    {
      level: 'ts-template-literal-types',
      questions: [
        {
          question: 'What is the type of "\`Hello ${string}\`" in TypeScript?',
          options: [
            { id: 'a', text: 'string', isCorrect: false },
            { id: 'b', text: 'A template literal type — matches any string that starts with "Hello "', isCorrect: true },
            { id: 'c', text: 'A compile error because template literals are runtime-only', isCorrect: false },
            { id: 'd', text: 'Equivalent to "Hello" | string', isCorrect: false },
          ],
          explanation: 'Template literal types work at the type level. \`Hello ${string}\` is a type that matches any string starting with "Hello " — like "Hello World" or "Hello TypeScript". This differs from the string type (which is all strings). TypeScript uses it to enforce specific string patterns in function parameters and return types.'
        },
        {
          question: 'Given type Method = "GET" | "POST" | "DELETE", what does \`${Method} /api/${string}\` produce?',
          options: [
            { id: 'a', text: 'A single string type', isCorrect: false },
            { id: 'b', text: 'A union of all possible combinations: "GET /api/${string}" | "POST /api/${string}" | "DELETE /api/${string}"', isCorrect: true },
            { id: 'c', text: 'A compile error because Method is a union', isCorrect: false },
            { id: 'd', text: 'Only "GET /api/${string}" because it takes the first member', isCorrect: false },
          ],
          explanation: 'Template literal types distribute over unions automatically. Each member of Method is combined with the rest of the template, producing a union of all combinations. This is how you can create strongly-typed API route patterns, event names, or CSS class names from a set of known values.'
        },
        {
          question: 'What is "Capitalize<string>" as a template literal intrinsic?',
          options: [
            { id: 'a', text: 'A runtime function that uppercases strings', isCorrect: false },
            { id: 'b', text: 'A type-level utility that transforms the first character of a string literal type to uppercase', isCorrect: true },
            { id: 'c', text: 'Makes all characters uppercase', isCorrect: false },
            { id: 'd', text: 'Only works with union types, not single string literals', isCorrect: false },
          ],
          explanation: 'Capitalize<T>, Uppercase<T>, Lowercase<T>, and Uncapitalize<T> are built-in template literal intrinsics that transform string literal types at the type level. They are commonly used with mapped type key remapping to generate getter names (\`get${Capitalize<string & K>}\`) or event names from model properties.'
        },
        {
          question: 'In testing, what is the main benefit of a type like ApiRoute = \`/api/${string}\`?',
          options: [
            { id: 'a', text: 'It validates the route at runtime before the request is sent', isCorrect: false },
            { id: 'b', text: 'It restricts function parameters to strings that start with /api/, catching typos at compile time', isCorrect: true },
            { id: 'c', text: 'It automatically generates route handlers', isCorrect: false },
            { id: 'd', text: 'It makes routes case-insensitive', isCorrect: false },
          ],
          explanation: 'By typing a fetchApi function parameter as ApiRoute = \`/api/${string}\`, TypeScript will reject any call where the path doesn\'t match the pattern — e.g., "api/users" (missing leading slash) or "/users" (missing /api/ prefix) both become compile errors. This catches an entire category of typo bugs before any test runs.'
        },
        {
          question: 'How does "infer" work inside a template literal conditional type like "T extends \`on${infer Event}\` ? Event : never"?',
          options: [
            { id: 'a', text: 'It checks if T is an event listener function', isCorrect: false },
            { id: 'b', text: 'It extracts the part of the string literal that matched the infer position — here, the part after "on"', isCorrect: true },
            { id: 'c', text: 'It generates all possible strings that start with "on"', isCorrect: false },
            { id: 'd', text: 'It only works when T is a union type', isCorrect: false },
          ],
          explanation: 'infer inside a template literal type captures the portion of the string that matched that position. "T extends \`on${infer Event}\`" asks: "does T start with on? If so, capture whatever follows as Event." Given T = "onClick", Event is captured as "Click". This lets you parse string literal types into their component parts.'
        },
      ]
    },
    {
      level: 'ts-indexed-access',
      questions: [
        {
          question: 'What does "User[\"email\"]" return when User = { id: number; email: string }?',
          options: [
            { id: 'a', text: 'The string "email"', isCorrect: false },
            { id: 'b', text: 'The type string', isCorrect: true },
            { id: 'c', text: 'The value of the email field', isCorrect: false },
            { id: 'd', text: 'A copy of the User type with only the email property', isCorrect: false },
          ],
          explanation: 'User["email"] is an indexed access type — it looks up the type of the "email" property in the User type. The result is the type string, not a value. This is purely at the type level: User["email"] : string means "the type stored at the email key of User is string".'
        },
        {
          question: 'How do you get the type of a single element from an array type T[]?',
          options: [
            { id: 'a', text: 'T[0]', isCorrect: false },
            { id: 'b', text: 'T[number]', isCorrect: true },
            { id: 'c', text: 'ElementOf<T>', isCorrect: false },
            { id: 'd', text: 'T extends Array<infer U> ? U : never', isCorrect: false },
          ],
          explanation: 'T[number] uses indexed access with the number type as the index — since array indices are numbers, this returns the element type. Both T[number] and the infer approach (option d) work, but T[number] is more concise. This is useful when you have a function returning User[] and want to extract the User type from it.'
        },
        {
          question: 'Given type Config = { db: { host: string; port: number } }, what is Config["db"]["port"]?',
          options: [
            { id: 'a', text: 'string', isCorrect: false },
            { id: 'b', text: 'number', isCorrect: true },
            { id: 'c', text: '{ host: string; port: number }', isCorrect: false },
            { id: 'd', text: 'A compile error — nested access is not allowed', isCorrect: false },
          ],
          explanation: 'Indexed access types can be chained. Config["db"] first gives { host: string; port: number }, then ["port"] on that gives number. This allows you to reference deeply nested types without duplicating or importing intermediate type definitions — very useful in large config objects.'
        },
        {
          question: 'In a test API fixture, what does "ApiResponse[\"data\"]" achieve when ApiResponse = { data: User; meta: PaginationMeta }?',
          options: [
            { id: 'a', text: 'It returns the User object value from ApiResponse', isCorrect: false },
            { id: 'b', text: 'It extracts the User type so you can type individual assertions without importing User separately', isCorrect: true },
            { id: 'c', text: 'It makes the data property required', isCorrect: false },
            { id: 'd', text: 'It creates a new type that omits the meta property', isCorrect: false },
          ],
          explanation: 'ApiResponse["data"] is User — the type stored at the data key. This means in your test files you can write: const user: ApiResponse["data"] = response.data without importing User separately. The type flows from the source of truth (the ApiResponse definition) rather than being duplicated.'
        },
        {
          question: 'Given "const routes = [{ path: \"/home\" }, { path: \"/login\" }] as const", how do you get the union type of all path values?',
          options: [
            { id: 'a', text: 'typeof routes["path"]', isCorrect: false },
            { id: 'b', text: '(typeof routes)[number]["path"]', isCorrect: true },
            { id: 'c', text: 'keyof typeof routes', isCorrect: false },
            { id: 'd', text: 'routes extends { path: infer P } ? P : never', isCorrect: false },
          ],
          explanation: '(typeof routes)[number] gets the element type of the routes array (the union of all object shapes), then ["path"] gets the path property from that. With "as const", the paths are preserved as literal types "/home" | "/login" rather than widened to string. This idiom extracts a union of literal values from a const array of objects.'
        },
      ]
    },
    {
      level: 'ts-classes',
      questions: [
        {
          question: 'What does the "private" access modifier guarantee in TypeScript?',
          options: [
            { id: 'a', text: 'The property is hidden at runtime and cannot be accessed from outside the class', isCorrect: false },
            { id: 'b', text: 'The property can only be accessed within the class body — TypeScript enforces this at compile time', isCorrect: true },
            { id: 'c', text: 'The property cannot be read by any code', isCorrect: false },
            { id: 'd', text: 'It is equivalent to JavaScript\'s # private fields', isCorrect: false },
          ],
          explanation: 'TypeScript\'s "private" is a compile-time check only. At runtime, the JavaScript output has no access restrictions. If you need true runtime privacy, use JavaScript\'s # syntax (#field). In test automation, "private" is still very valuable — it prevents test code from accidentally calling internal methods and coupling tests to implementation details.'
        },
        {
          question: 'What is the purpose of an "abstract" class in TypeScript?',
          options: [
            { id: 'a', text: 'A class that can be instantiated but has no methods', isCorrect: false },
            { id: 'b', text: 'A class that cannot be instantiated directly and must be subclassed, optionally with abstract methods that subclasses must implement', isCorrect: true },
            { id: 'c', text: 'A class with only static methods', isCorrect: false },
            { id: 'd', text: 'A class that is automatically generic', isCorrect: false },
          ],
          explanation: 'An abstract class is a template that establishes shared structure and behaviour, but requires a concrete subclass to complete the missing pieces (abstract methods). In a Page Object Model, abstract BasePage might define goto() and waitForLoad() concretely, while declaring abstract getSelectors() as abstract — forcing each page subclass to provide its own selector definitions.'
        },
        {
          question: 'What is the difference between "implements" and "extends" in TypeScript classes?',
          options: [
            { id: 'a', text: '"implements" copies methods from an interface; "extends" creates a subclass', isCorrect: false },
            { id: 'b', text: '"implements" checks that a class satisfies an interface contract (no inheritance); "extends" creates a subclass that inherits behavior', isCorrect: true },
            { id: 'c', text: 'They are interchangeable for interfaces', isCorrect: false },
            { id: 'd', text: '"implements" only works with abstract classes', isCorrect: false },
          ],
          explanation: '"implements Interface" means the class promises to have all the properties and methods the interface requires — but receives nothing from the interface. "extends Class" gives the subclass everything from the parent. A class can implement multiple interfaces but extend only one parent. In testing frameworks, implements is used to ensure service mocks conform to the real service interface.'
        },
        {
          question: 'What is parameter property shorthand syntax in TypeScript constructors?',
          options: [
            { id: 'a', text: 'Using default parameter values in constructors', isCorrect: false },
            { id: 'b', text: 'Declaring access modifier (public/private/protected) on a constructor parameter, which automatically creates and assigns the property', isCorrect: true },
            { id: 'c', text: 'Making constructor parameters optional with ?', isCorrect: false },
            { id: 'd', text: 'Destructuring objects in constructor parameters', isCorrect: false },
          ],
          explanation: 'constructor(private page: Page, public config: Config) automatically creates this.page and this.config and assigns the passed-in values — without needing a separate property declaration and "this.page = page" line. This shorthand is especially concise in Playwright Page Objects and dependency-injected services.'
        },
        {
          question: 'When would you use a "static" method on a class in a testing context?',
          options: [
            { id: 'a', text: 'When the method needs access to "this" (the instance)', isCorrect: false },
            { id: 'b', text: 'For factory methods or utility functions that belong to the class but don\'t need instance state', isCorrect: true },
            { id: 'c', text: 'When the method should be inherited by subclasses', isCorrect: false },
            { id: 'd', text: 'Static methods cannot be used in TypeScript classes', isCorrect: false },
          ],
          explanation: 'Static methods belong to the class itself, not instances. TestDataBuilder.create() is a classic factory method pattern: you call it without first instantiating the class. In testing, static methods are used for shared fixture builders, utility helpers, and configuration that shouldn\'t require creating a full object just to call one function.'
        },
      ]
    },
    {
      level: 'ts-modules-imports',
      questions: [
        {
          question: 'What is the difference between a named export and a default export?',
          options: [
            { id: 'a', text: 'Named exports are faster; default exports are for classes only', isCorrect: false },
            { id: 'b', text: 'Named exports use the exact exported name and can be multiple per file; default export is one per file and can be imported with any name', isCorrect: true },
            { id: 'c', text: 'Default exports cannot be re-exported', isCorrect: false },
            { id: 'd', text: 'Named exports require curly braces at the export site', isCorrect: false },
          ],
          explanation: 'Named exports: export function foo() — imported as import { foo }. Default exports: export default class Page — imported as import AnyNameYouLike. Many style guides prefer named exports because the import name is self-documenting and IDE refactoring tools can rename it across files consistently.'
        },
        {
          question: 'What does "import type { User } from \'./types\'" do differently from "import { User } from \'./types\'"?',
          options: [
            { id: 'a', text: 'It imports a runtime value rather than just a type', isCorrect: false },
            { id: 'b', text: 'It tells TypeScript and bundlers that this import is type-only and can be erased from the JavaScript output', isCorrect: true },
            { id: 'c', text: 'It makes the import available only inside type annotations', isCorrect: false },
            { id: 'd', text: 'There is no difference — it is just a style preference', isCorrect: false },
          ],
          explanation: '"import type" is erased entirely from the compiled JavaScript — no runtime import statement is generated. This prevents accidental circular dependency issues, speeds up bundling, and explicitly signals to the reader that this import is purely for type checking. In large codebases, it also enables "isolatedModules" mode in tsc.'
        },
        {
          question: 'What is a barrel file (index.ts) used for in a module?',
          options: [
            { id: 'a', text: 'The main entry point for the entire application', isCorrect: false },
            { id: 'b', text: 'A file that re-exports multiple modules from a directory, creating a clean public API for the folder', isCorrect: true },
            { id: 'c', text: 'A configuration file for the TypeScript compiler', isCorrect: false },
            { id: 'd', text: 'A file that imports all modules and runs them in order', isCorrect: false },
          ],
          explanation: 'A barrel index.ts re-exports: export { LoginPage } from "./LoginPage"; export { DashboardPage } from "./DashboardPage". Consumers then do import { LoginPage, DashboardPage } from "./pages" instead of having to know the internal file structure. This encapsulates the folder\'s internals and provides a stable public API.'
        },
        {
          question: 'What does "export * from \'./utils\'" in a barrel file do?',
          options: [
            { id: 'a', text: 'Imports everything from utils into the current file\'s scope', isCorrect: false },
            { id: 'b', text: 'Re-exports all named exports from utils, making them available to anyone who imports this barrel', isCorrect: true },
            { id: 'c', text: 'Creates a copy of utils in the current file', isCorrect: false },
            { id: 'd', text: 'It is the same as "import * as utils from \'./utils\'"', isCorrect: false },
          ],
          explanation: '"export * from" is a re-export wildcard. It takes all named exports from the target module and makes them available from the current file. Note it does NOT re-export default exports. When barrel files get large, be aware that "export *" can cause tree-shaking issues in some bundlers — explicit named re-exports are safer.'
        },
        {
          question: 'In a Playwright project, what problem does a shared "export type { TestFixtures } from \'./fixtures\'" solve?',
          options: [
            { id: 'a', text: 'It enables fixtures to run in parallel', isCorrect: false },
            { id: 'b', text: 'It makes the fixture type available to all test files without them importing from deep paths', isCorrect: true },
            { id: 'c', text: 'It automatically registers the fixtures with the test runner', isCorrect: false },
            { id: 'd', text: 'It converts fixture values to read-only', isCorrect: false },
          ],
          explanation: 'Exporting fixture types from a central barrel means all test files can import from one well-known location rather than having brittle relative paths like \'../../../fixtures/auth\'. It also separates the type import from the value import, making it clear which consumers only need the type for type-checking vs those that need the runtime fixture.'
        },
      ]
    },
    {
      level: 'ts-decorators',
      questions: [
        {
          question: 'What is a TypeScript decorator at its most fundamental level?',
          options: [
            { id: 'a', text: 'A comment that documents a class or method', isCorrect: false },
            { id: 'b', text: 'A special function applied to a class, method, or property using @ syntax to add metadata or modify behavior', isCorrect: true },
            { id: 'c', text: 'A TypeScript keyword that makes a class abstract', isCorrect: false },
            { id: 'd', text: 'A way to make properties private automatically', isCorrect: false },
          ],
          explanation: 'A decorator is simply a function that receives the target (class, method, or property) and can inspect or modify it. @Controller("/users") in NestJS is a function call that registers the class as a controller with that route prefix. The @ syntax is just syntactic sugar for Controller("/users")(UserController).'
        },
        {
          question: 'What compiler option must be enabled to use decorators in TypeScript?',
          options: [
            { id: 'a', text: 'strict: true', isCorrect: false },
            { id: 'b', text: 'experimentalDecorators: true in tsconfig.json', isCorrect: true },
            { id: 'c', text: 'useDecorators: true', isCorrect: false },
            { id: 'd', text: 'target: "ES2022" or later', isCorrect: false },
          ],
          explanation: 'Decorators are a Stage 3 TC39 proposal but TypeScript has supported them experimentally for years under the "experimentalDecorators": true flag in tsconfig.json. Most frameworks that use decorators heavily (NestJS, TypeORM, Angular) include this in their default tsconfig. TC39 decorators and TypeScript experimental decorators have some differences — be aware of which version a framework uses.'
        },
        {
          question: 'In NestJS, what does the @Injectable() decorator primarily enable?',
          options: [
            { id: 'a', text: 'It makes the class serializable to JSON', isCorrect: false },
            { id: 'b', text: 'It marks the class as a provider that can be injected into other classes via NestJS\'s dependency injection system', isCorrect: true },
            { id: 'c', text: 'It makes all methods asynchronous', isCorrect: false },
            { id: 'd', text: 'It prevents the class from being extended', isCorrect: false },
          ],
          explanation: '@Injectable() tells NestJS\'s IoC container: "I can manage the lifecycle of this class and inject it wherever it\'s declared as a dependency." In testing with NestJS, you use the Test module to create a testing module that replaces @Injectable() services with mocks, enabling unit testing without spinning up the full application.'
        },
        {
          question: 'What is a method decorator\'s signature in TypeScript?',
          options: [
            { id: 'a', text: '(value: Function) => void', isCorrect: false },
            { id: 'b', text: '(target: Object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor | void', isCorrect: true },
            { id: 'c', text: '(constructor: Function) => void', isCorrect: false },
            { id: 'd', text: '(target: any, key: string) => void', isCorrect: false },
          ],
          explanation: 'A method decorator receives: target (the class prototype), propertyKey (the method name as a string), and descriptor (the PropertyDescriptor containing the method\'s value, writable, enumerable, configurable). You can replace descriptor.value with a wrapper function — which is how logging, timing, retry, and caching decorators work.'
        },
        {
          question: 'In TypeORM, what does "@Column({ type: \'varchar\', length: 100, nullable: false })" do?',
          options: [
            { id: 'a', text: 'Validates that the property is a string at runtime', isCorrect: false },
            { id: 'b', text: 'Attaches metadata to the property so TypeORM knows how to map it to a database column with the specified constraints', isCorrect: true },
            { id: 'c', text: 'Makes the property read-only in TypeScript', isCorrect: false },
            { id: 'd', text: 'Encrypts the column value before storing it', isCorrect: false },
          ],
          explanation: 'TypeORM\'s @Column decorator stores metadata about the property using Reflect.metadata. When TypeORM generates or validates the database schema, it reads this metadata to know the column type, length, and nullability. This is the metadata pattern in action: the class is simultaneously a TypeScript type AND a database schema definition — no duplication needed.'
        },
      ]
    },

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
