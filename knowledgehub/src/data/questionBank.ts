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
