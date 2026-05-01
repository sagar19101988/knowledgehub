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

    // ─── EXPERT (placeholder) ─────────────────────────────────────────────────
    {
      level: 'expert',
      questions: [
        {
          question: 'What does a JOIN do?',
          options: [
            { id: 'a', text: 'It combines rows from two or more tables based on a related column.', isCorrect: true },
            { id: 'b', text: 'It adds a new user to the database.', isCorrect: false },
            { id: 'c', text: 'It merges two databases into one.', isCorrect: false },
            { id: 'd', text: 'It removes duplicate rows from a result.', isCorrect: false },
          ],
          explanation: 'JOIN acts like a bridge, connecting tables (like Users and Orders) using a common ID.'
        },
        {
          question: 'What is a Subquery?',
          options: [
            { id: 'a', text: 'A query nested inside another query.', isCorrect: true },
            { id: 'b', text: 'A query that runs very slowly.', isCorrect: false },
            { id: 'c', text: 'A query that deletes a subset of data.', isCorrect: false },
            { id: 'd', text: 'A backup query stored in the database.', isCorrect: false },
          ],
          explanation: 'A subquery is a query inside a query. It calculates a value first, which the main query then uses.'
        },
        {
          question: 'What does an INDEX do in a database?',
          options: [
            { id: 'a', text: 'It makes reading data (SELECT) much faster, like an index in a book.', isCorrect: true },
            { id: 'b', text: 'It automatically fixes broken queries.', isCorrect: false },
            { id: 'c', text: 'It deletes old data automatically.', isCorrect: false },
            { id: 'd', text: 'It enforces unique values across a table.', isCorrect: false },
          ],
          explanation: 'An index creates a quick lookup map, so the database does not have to scan every single row.'
        },
        {
          question: 'What is a Transaction in SQL?',
          options: [
            { id: 'a', text: 'Buying a license for the SQL server.', isCorrect: false },
            { id: 'b', text: 'A block of SQL commands that must ALL succeed, or ALL fail together (like transferring money).', isCorrect: true },
            { id: 'c', text: 'A table that records user clicks.', isCorrect: false },
            { id: 'd', text: 'A scheduled job that runs SQL at a set time.', isCorrect: false },
          ],
          explanation: 'Transactions ensure data is not left halfway changed. If an error happens, it rolls back to how it was.'
        },
        {
          question: 'Adding an index to a table makes SELECT faster. What is the trade-off?',
          options: [
            { id: 'a', text: 'Indexes make all operations slower.', isCorrect: false },
            { id: 'b', text: 'Indexes slow down INSERT, UPDATE, and DELETE because the index must be updated on every write.', isCorrect: true },
            { id: 'c', text: 'Indexes only work on VARCHAR columns.', isCorrect: false },
            { id: 'd', text: 'There is no trade-off — indexes always improve performance.', isCorrect: false },
          ],
          explanation: 'Indexes are a double-edged sword. Read performance improves dramatically, but every write operation must also update the index structure.'
        },
      ]
    }
  ],
            { id: 'a', text: '0 — the default integer value.', isCorrect: false },
            { id: 'b', text: 'NULL — no matching row exists in the Orders table.', isCorrect: true },
            { id: 'c', text: 'The user\'s own ID is used as a fallback.', isCorrect: false },
            { id: 'd', text: 'The row is excluded — LEFT JOIN doesn\'t include unmatched rows.', isCorrect: false },
          ],
          explanation: 'LEFT JOIN returns all rows from the left table. For rows with no match in the right table, all right-table columns show NULL. This is how you find users with zero orders: WHERE orders.id IS NULL in a LEFT JOIN query.'
        },
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
            { id: 'c', text: 'A query that deletes a subset of data.', isCorrect: false },
            { id: 'd', text: 'A backup query stored in the database.', isCorrect: false },
          ],
          explanation: 'A subquery is a query inside a query. It calculates a value first, which the main query then uses.'
        },
        {
          question: 'What does an INDEX do in a database?',
          options: [
            { id: 'a', text: 'It makes reading data (SELECT) much faster, like an index in a book.', isCorrect: true },
            { id: 'b', text: 'It automatically fixes broken queries.', isCorrect: false },
            { id: 'c', text: 'It deletes old data automatically.', isCorrect: false },
            { id: 'd', text: 'It enforces unique values across a table.', isCorrect: false },
          ],
          explanation: 'An index creates a quick lookup map, so the database does not have to scan every single row.'
        },
        {
          question: 'What is a Transaction in SQL?',
          options: [
            { id: 'a', text: 'Buying a license for the SQL server.', isCorrect: false },
            { id: 'b', text: 'A block of SQL commands that must ALL succeed, or ALL fail together (like transferring money).', isCorrect: true },
            { id: 'c', text: 'A table that records user clicks.', isCorrect: false },
            { id: 'd', text: 'A scheduled job that runs SQL at a set time.', isCorrect: false },
          ],
          explanation: 'Transactions ensure data is not left halfway changed. If an error happens, it rolls back to how it was.'
        },
        {
          question: 'Adding an index to a table makes SELECT faster. What is the trade-off?',
          options: [
            { id: 'a', text: 'Indexes make all operations slower.', isCorrect: false },
            { id: 'b', text: 'Indexes slow down INSERT, UPDATE, and DELETE because the index must be updated on every write.', isCorrect: true },
            { id: 'c', text: 'Indexes only work on VARCHAR columns.', isCorrect: false },
            { id: 'd', text: 'There is no trade-off — indexes always improve performance.', isCorrect: false },
          ],
          explanation: 'Indexes are a double-edged sword. Read performance improves dramatically, but every write operation must also update the index structure, adding overhead. Over-indexing a write-heavy table is a common performance mistake.'
        },
        {
          question: 'In a banking app, money is being transferred from Account A to Account B. The server crashes after debiting A but before crediting B. What prevents the money from disappearing?',
          options: [
            { id: 'a', text: 'Foreign key constraints — they ensure the amounts match.', isCorrect: false },
            { id: 'b', text: 'A database transaction with ROLLBACK — if the credit fails, the debit is reversed.', isCorrect: true },
            { id: 'c', text: 'An index on the amount column — it catches inconsistencies.', isCorrect: false },
            { id: 'd', text: 'The database automatically retries the failed operation.', isCorrect: false },
          ],
          explanation: 'Transactions group multiple SQL commands into an all-or-nothing unit. If any step fails, ROLLBACK undoes every previous step in the transaction. This guarantees the data is never left in an inconsistent half-changed state.'
        },
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
    },
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
