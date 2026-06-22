import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { INTERVIEW_BANK } from '../src/data/interviewBank.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/zones');
mkdirSync(OUT_DIR, { recursive: true });

const ZONES: { key: string; slug: string; title: string; description: string; color: string; keywords: string }[] = [
  {
    key: 'manual',
    slug: 'manual-testing',
    title: 'Manual Testing',
    description: 'Master manual testing fundamentals, test case design, bug reporting, exploratory testing and QA processes. Prepare for manual testing interviews with real-world Q&As used in actual company interviews.',
    color: '#ef4444',
    keywords: 'manual testing interview questions, QA manual testing, test case design, bug reporting, exploratory testing, software testing fundamentals, manual QA engineer interview',
  },
  {
    key: 'sql',
    slug: 'sql-sorcery',
    title: 'SQL Sorcery',
    description: 'Master SQL for software testers and QA engineers. Learn query writing, joins, aggregations, stored procedures and database testing techniques. Includes real SQL interview questions for QA roles.',
    color: '#3b82f6',
    keywords: 'SQL interview questions for QA, SQL for testers, database testing interview, SQL query writing, joins aggregations, SQL for software testing, QA SQL interview prep',
  },
  {
    key: 'api',
    slug: 'api-testing',
    title: 'API Testing',
    description: 'Master API testing with REST, HTTP methods, status codes, authentication, and test automation. Prepare for API testing interviews with real Q&As covering Postman, REST Assured and API validation techniques.',
    color: '#a855f7',
    keywords: 'API testing interview questions, REST API testing, HTTP methods status codes, API test automation, Postman interview questions, REST API QA engineer, API testing for beginners',
  },
  {
    key: 'typescript',
    slug: 'typescript',
    title: 'TypeScript for QA',
    description: 'Master TypeScript for test automation and QA engineering. Learn types, interfaces, generics, OOP principles and advanced patterns used in modern test frameworks. Real TypeScript interview questions for QA roles.',
    color: '#06b6d4',
    keywords: 'TypeScript interview questions QA, TypeScript for testers, TypeScript tutorial QA engineer, TypeScript test automation, SDET TypeScript interview, TypeScript types interfaces generics',
  },
  {
    key: 'playwright',
    slug: 'playwright',
    title: 'Playwright Automation',
    description: 'Master Playwright end-to-end test automation. Learn locators, fixtures, page objects, API testing, visual testing and CI/CD integration. Real Playwright interview questions for automation engineers.',
    color: '#22c55e',
    keywords: 'Playwright interview questions, Playwright automation tutorial, learn Playwright testing, Playwright for beginners, Playwright page object model, Playwright CI/CD, automation engineer interview',
  },
  {
    key: 'ai-qa',
    slug: 'ai-for-qa',
    title: 'AI for QA',
    description: 'Master AI tools and techniques for QA engineering. Learn prompt engineering for testing, AI-assisted test generation, LLM testing strategies and the future of quality assurance with AI.',
    color: '#f59e0b',
    keywords: 'AI for QA interview questions, AI testing tools, AI test automation, prompt engineering for QA, LLM testing, AI quality assurance, artificial intelligence software testing',
  },
];

const LEVEL_LABELS: Record<string, string> = {
  junior: 'Junior (0–2 years)',
  mid: 'Mid-Level (2–5 years)',
  senior: 'Senior (5+ years)',
};

const INTERCEPT_EVERY = 15;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTeaserAnswer(answer: string): string {
  // Remove fenced code blocks entirely
  let clean = answer.replace(/```[\s\S]*?```/g, '').trim();

  // For 6-part format: cut before the first section heading
  const headingIdx = clean.search(/\*\*Why|\*\*Walked|\*\*Real|\*\*Rule/);
  if (headingIdx > 0) {
    clean = clean.slice(0, headingIdx).trim();
  }

  // Strip markdown bold and inline code
  clean = clean
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

  // Take only the first non-empty line (stops before bullet lists)
  const firstLine = clean.split('\n').map(l => l.trim()).find(l => l.length > 0 && !l.startsWith('-')) ?? '';

  // Replace trailing colon (intro-to-list pattern) with a period
  const sentence = firstLine.replace(/:$/, '.').trim();

  if (!sentence) {
    // All lines are bullets — strip dash and use the first bullet's content
    const firstBullet = clean.split('\n').map(l => l.trim()).find(l => l.startsWith('-')) ?? '';
    const stripped = firstBullet.replace(/^-\s*/, '').replace(/:$/, '.').trim();
    if (stripped) {
      const words = stripped.split(' ').filter(w => w.length > 0);
      return words.slice(0, 25).join(' ') + (words.length > 25 ? '…' : '');
    }
    const fallback = answer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').split('\n')[0].trim();
    const words = fallback.split(' ').filter(w => w.length > 0);
    return words.slice(0, 25).join(' ') + (words.length > 25 ? '…' : '');
  }

  // Cap at 35 words
  const words = sentence.split(' ').filter(w => w.length > 0);
  if (words.length <= 35) return sentence;
  return words.slice(0, 35).join(' ') + '…';
}

function escapeJson(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

function generateCourseSchema(zone: typeof ZONES[0], questions: typeof INTERVIEW_BANK[string]): string {
  const juniorCount = questions.filter(q => q.level === 'junior').length;
  const midCount    = questions.filter(q => q.level === 'mid').length;
  const seniorCount = questions.filter(q => q.level === 'senior').length;

  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["Course", "LearningResource"],
    "name": "${escapeJson(zone.title)} for QA Engineers",
    "description": "${escapeJson(zone.description)}",
    "provider": {
      "@type": "Organization",
      "name": "QAVeda",
      "sameAs": "https://qaveda.com"
    },
    "url": "https://qaveda.com",
    "isAccessibleForFree": true,
    "inLanguage": "en-US",
    "educationalLevel": "Beginner to Expert",
    "teaches": "${escapeJson(zone.title)} skills for QA and software testing engineers",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseSchedule": {
        "@type": "Schedule",
        "repeatFrequency": "P1D"
      }
    },
    "hasPart": [
      {
        "@type": "CourseChapter",
        "name": "Junior Level (0–2 years)",
        "description": "${juniorCount} interview questions covering ${escapeJson(zone.title)} fundamentals"
      },
      {
        "@type": "CourseChapter",
        "name": "Mid Level (2–5 years)",
        "description": "${midCount} interview questions covering ${escapeJson(zone.title)} intermediate topics"
      },
      {
        "@type": "CourseChapter",
        "name": "Senior Level (5+ years)",
        "description": "${seniorCount} interview questions covering ${escapeJson(zone.title)} advanced concepts"
      }
    ]
  }
  </script>`;
}

function generateWebsiteSchema(): string {
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "QAVeda",
    "alternateName": "QA Veda",
    "url": "https://qaveda.com",
    "description": "Gamified QA learning platform for software testers. Master Manual Testing, SQL, API Testing, TypeScript, Playwright and AI for QA.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://qaveda.com",
      "query-input": "required name=search_term_string"
    }
  }
  </script>`;
}

function generatePage(zone: typeof ZONES[0]): string {
  const questions = INTERVIEW_BANK[zone.key] ?? [];
  const juniors  = questions.filter(q => q.level === 'junior');
  const mids     = questions.filter(q => q.level === 'mid');
  const seniors  = questions.filter(q => q.level === 'senior');

  const interceptCard = `
    <div class="intercept-card">
      <div class="intercept-icon">🔓</div>
      <div class="intercept-text">
        <strong>You're reading previews.</strong><br>
        Full answers with walked-through examples, real-world QA scenarios and rules of thumb are free on QAVeda.
      </div>
      <a href="https://qaveda.com" class="intercept-btn">Open QAVeda — it's free →</a>
    </div>`;

  const renderSection = (level: string, items: typeof questions) => {
    if (items.length === 0) return '';
    const cards = items.map((qa, i) => {
      const teaser = getTeaserAnswer(qa.answer);
      const card = `
        <article class="qa-card">
          <div class="qa-number">${i + 1}</div>
          <div class="qa-body">
            ${qa.topic ? `<span class="qa-topic">${escapeHtml(qa.topic)}</span>` : ''}
            <h3 class="qa-question">${escapeHtml(qa.question)}</h3>
            <p class="qa-teaser">${escapeHtml(teaser)}</p>
            <p class="qa-hint">↳ Includes walked-through example, real-world QA scenario &amp; rule of thumb</p>
            <a href="https://qaveda.com" class="qa-cta-link">Get the full answer on QAVeda →</a>
          </div>
        </article>`;
      // Inject intercept card after every INTERCEPT_EVERY questions (but not after the last one)
      if ((i + 1) % INTERCEPT_EVERY === 0 && i + 1 < items.length) {
        return card + interceptCard;
      }
      return card;
    });

    return `
    <section class="level-section">
      <h2 class="level-heading">${LEVEL_LABELS[level]}</h2>
      <div class="qa-list">
        ${cards.join('')}
      </div>
    </section>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${zone.title} Interview Questions & Answers — QAVeda</title>
  <meta name="description" content="${zone.description}" />
  <meta name="keywords" content="${zone.keywords}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://qaveda.com/zones/${zone.slug}.html" />
  <meta property="og:title" content="${zone.title} Interview Questions — QAVeda" />
  <meta property="og:description" content="${zone.description}" />
  <meta property="og:url" content="https://qaveda.com/zones/${zone.slug}.html" />
  <meta property="og:image" content="https://qaveda.com/og-image.png" />
${generateWebsiteSchema()}
${generateCourseSchema(zone, questions)}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding-bottom: 72px;
    }
    a { color: inherit; text-decoration: none; }

    /* Header */
    .header {
      background: #07050f;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .header-brand {
      font-size: 20px;
      font-weight: 900;
      color: white;
      letter-spacing: -0.5px;
    }
    .header-brand span { color: ${zone.color}; }
    .header-cta {
      background: ${zone.color};
      color: white;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 8px;
      transition: opacity 0.2s;
    }
    .header-cta:hover { opacity: 0.85; }

    /* Hero */
    .hero {
      background: #07050f;
      padding: 60px 24px 48px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .hero-badge {
      display: inline-block;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: clamp(32px, 6vw, 56px);
      font-weight: 900;
      color: white;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }
    .hero-title span { color: ${zone.color}; }
    .hero-subtitle {
      font-size: 17px;
      color: rgba(255,255,255,0.5);
      max-width: 600px;
      margin: 0 auto 28px;
    }
    .hero-cta-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-bottom: 36px;
    }
    .hero-cta-btn {
      display: inline-block;
      background: ${zone.color};
      color: white;
      font-size: 16px;
      font-weight: 800;
      padding: 14px 36px;
      border-radius: 10px;
      letter-spacing: -0.3px;
      transition: opacity 0.2s;
    }
    .hero-cta-btn:hover { opacity: 0.85; }
    .hero-cta-note {
      font-size: 13px;
      color: rgba(255,255,255,0.35);
    }
    .hero-stats {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero-stat { text-align: center; }
    .hero-stat-num {
      font-size: 28px;
      font-weight: 900;
      color: ${zone.color};
    }
    .hero-stat-label {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* Main content */
    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    /* Level section */
    .level-section { margin-bottom: 56px; }
    .level-heading {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 24px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${zone.color}33;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .level-heading::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 22px;
      background: ${zone.color};
      border-radius: 2px;
    }

    /* Q&A card */
    .qa-list { display: flex; flex-direction: column; gap: 16px; }
    .qa-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .qa-number {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${zone.color}18;
      color: ${zone.color};
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }
    .qa-body { flex: 1; min-width: 0; }
    .qa-topic {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${zone.color};
      background: ${zone.color}15;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .qa-question {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .qa-teaser {
      font-size: 14px;
      color: #475569;
      line-height: 1.65;
      margin-bottom: 6px;
    }
    .qa-hint {
      font-size: 12px;
      color: #94a3b8;
      font-style: italic;
      margin-bottom: 12px;
    }
    .qa-cta-link {
      display: inline-block;
      font-size: 13px;
      font-weight: 700;
      color: ${zone.color};
      border: 1px solid ${zone.color}40;
      background: ${zone.color}08;
      padding: 6px 14px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .qa-cta-link:hover { background: ${zone.color}18; }

    /* Intercept card */
    .intercept-card {
      background: #07050f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 28px 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin: 8px 0;
      flex-wrap: wrap;
    }
    .intercept-icon { font-size: 28px; flex-shrink: 0; }
    .intercept-text {
      flex: 1;
      min-width: 200px;
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      line-height: 1.6;
    }
    .intercept-text strong { color: white; }
    .intercept-btn {
      flex-shrink: 0;
      background: ${zone.color};
      color: white;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 8px;
      white-space: nowrap;
      transition: opacity 0.2s;
    }
    .intercept-btn:hover { opacity: 0.85; }

    /* CTA banner */
    .cta-banner {
      background: #07050f;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 48px 32px;
      text-align: center;
      margin-top: 48px;
    }
    .cta-title {
      font-size: 26px;
      font-weight: 900;
      color: white;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    .cta-sub {
      font-size: 15px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 28px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-btn {
      display: inline-block;
      background: ${zone.color};
      color: white;
      font-size: 16px;
      font-weight: 800;
      padding: 14px 36px;
      border-radius: 10px;
      transition: opacity 0.2s;
    }
    .cta-btn:hover { opacity: 0.85; }
    .cta-note {
      margin-top: 14px;
      font-size: 13px;
      color: rgba(255,255,255,0.3);
    }

    /* Sticky bottom bar */
    .sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #07050f;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 200;
      flex-wrap: wrap;
    }
    .sticky-bar-text {
      font-size: 14px;
      color: rgba(255,255,255,0.65);
    }
    .sticky-bar-text strong { color: white; }
    .sticky-bar-btn {
      background: ${zone.color};
      color: white;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 8px;
      white-space: nowrap;
      transition: opacity 0.2s;
    }
    .sticky-bar-btn:hover { opacity: 0.85; }

    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 13px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
    .footer a { color: ${zone.color}; }

    @media (max-width: 600px) {
      .qa-card { flex-direction: column; }
      .hero { padding: 40px 16px 32px; }
      .intercept-card { flex-direction: column; text-align: center; }
      .sticky-bar { flex-direction: column; gap: 8px; padding: 10px 16px; }
    }
  </style>
</head>
<body>

  <header class="header">
    <a href="https://qaveda.com" class="header-brand">QA<span>Veda</span></a>
    <a href="https://qaveda.com" class="header-cta">Start Learning Free →</a>
  </header>

  <section class="hero">
    <div class="hero-badge">Interview Prep · ${zone.title}</div>
    <h1 class="hero-title">${zone.title}<br><span>Interview Questions</span></h1>
    <p class="hero-subtitle">Real questions asked in actual QA interviews — ${questions.length} Q&amp;As across Junior, Mid and Senior levels. Full answers, examples &amp; real scenarios on QAVeda.</p>
    <div class="hero-cta-wrap">
      <a href="https://qaveda.com" class="hero-cta-btn">Practice Full Answers on QAVeda →</a>
      <span class="hero-cta-note">Free · No credit card · 200+ lessons + quizzes included</span>
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">${questions.length}</div>
        <div class="hero-stat-label">Questions</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">3</div>
        <div class="hero-stat-label">Levels</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">Free</div>
        <div class="hero-stat-label">On QAVeda</div>
      </div>
    </div>
  </section>

  <main class="container">
    ${renderSection('junior', juniors)}
    ${renderSection('mid', mids)}
    ${renderSection('senior', seniors)}

    <div class="cta-banner">
      <div class="cta-title">Don't just read. Practice.</div>
      <div class="cta-sub">QAVeda has full answers with walked-through examples, 200+ structured lessons, Mastery Trial quizzes and certificates — all gamified with XP, badges and ranks.</div>
      <a href="https://qaveda.com" class="cta-btn">Start for Free on QAVeda →</a>
      <div class="cta-note">Free · No credit card required</div>
    </div>
  </main>

  <footer class="footer">
    © 2026 <a href="https://qaveda.com">QAVeda</a> · Gamified QA Learning Platform · <a href="https://qaveda.com">qaveda.com</a>
  </footer>

  <div class="sticky-bar">
    <span class="sticky-bar-text"><strong>Want the full answer?</strong> Lessons, examples &amp; real scenarios are free on QAVeda.</span>
    <a href="https://qaveda.com" class="sticky-bar-btn">Go to QAVeda →</a>
  </div>

</body>
</html>`;
}

function generateWarRoomPage(): string {
  const ACCENT = '#e11d48';
  const allQuestions = Object.values(INTERVIEW_BANK).flat();
  const totalCount = allQuestions.length;

  // 2 sample questions per zone (1 junior, 1 mid) for preview content
  const samples: { zone: typeof ZONES[0]; q: (typeof allQuestions)[0] }[] = [];
  for (const zone of ZONES) {
    const zoneQs = INTERVIEW_BANK[zone.key] ?? [];
    const junior = zoneQs.find(q => q.level === 'junior');
    const mid    = zoneQs.find(q => q.level === 'mid');
    if (junior) samples.push({ zone, q: junior });
    if (mid)    samples.push({ zone, q: mid });
  }

  const sampleCards = samples.slice(0, 12).map(({ zone, q }, i) => {
    const teaser = getTeaserAnswer(q.answer);
    const levelLabel = q.level === 'junior' ? 'Junior' : q.level === 'mid' ? 'Mid-Level' : 'Senior';
    return `
        <article class="qa-card">
          <div class="qa-number">${i + 1}</div>
          <div class="qa-body">
            <div class="qa-meta">
              <span class="qa-zone" style="color:${zone.color};background:${zone.color}15">${escapeHtml(zone.title)}</span>
              <span class="qa-level">${levelLabel}</span>
            </div>
            <h3 class="qa-question">${escapeHtml(q.question)}</h3>
            <p class="qa-teaser">${escapeHtml(teaser)}</p>
            <p class="qa-hint">↳ Includes walked-through example, real-world QA scenario &amp; rule of thumb</p>
            <a href="https://qaveda.com" class="qa-cta-link">Get the full answer on QAVeda →</a>
          </div>
        </article>`;
  }).join('');

  const schema = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "QA Interview Questions — The War Room",
    "description": "${totalCount}+ real interview questions asked at top tech companies. Covers Manual Testing, SQL, API Testing, TypeScript, Playwright and AI for QA. Junior, Mid and Senior levels with full explanations.",
    "provider": {
      "@type": "Organization",
      "name": "QAVeda",
      "sameAs": "https://qaveda.com"
    },
    "url": "https://qaveda.com",
    "isAccessibleForFree": true,
    "inLanguage": "en-US",
    "educationalLevel": ["Beginner", "Intermediate", "Expert"],
    "learningResourceType": "Practice Problem",
    "educationalUse": "preparation",
    "teaches": "QA and software testing interview preparation across Manual Testing, SQL, API Testing, TypeScript, Playwright and AI for QA"
  }
  </script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QA Interview Questions — The War Room · QAVeda</title>
  <meta name="description" content="${totalCount}+ real QA interview questions across Manual Testing, SQL, API Testing, TypeScript, Playwright and AI for QA. Junior, Mid and Senior levels with full walked-through answers." />
  <meta name="keywords" content="QA interview questions, software testing interview prep, manual testing interview, API testing interview, SQL for QA interview, Playwright interview questions, TypeScript QA interview, SDET interview questions, software tester interview" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://qaveda.com/war-room.html" />
  <meta property="og:title" content="QA Interview Questions — The War Room · QAVeda" />
  <meta property="og:description" content="${totalCount}+ real QA interview questions. Junior, Mid and Senior levels. Free on QAVeda." />
  <meta property="og:url" content="https://qaveda.com/war-room.html" />
  <meta property="og:image" content="https://qaveda.com/og-image.png" />
${generateWebsiteSchema()}
${schema}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; padding-bottom: 72px; }
    a { color: inherit; text-decoration: none; }
    .header { background: #07050f; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .header-brand { font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.5px; }
    .header-brand span { color: ${ACCENT}; }
    .header-cta { background: ${ACCENT}; color: white; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 8px; transition: opacity 0.2s; }
    .header-cta:hover { opacity: 0.85; }
    .hero { background: #07050f; padding: 60px 24px 48px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; margin-bottom: 20px; }
    .hero-title { font-size: clamp(32px, 6vw, 56px); font-weight: 900; color: white; letter-spacing: -1px; margin-bottom: 12px; }
    .hero-title span { color: ${ACCENT}; }
    .hero-subtitle { font-size: 17px; color: rgba(255,255,255,0.5); max-width: 620px; margin: 0 auto 28px; }
    .hero-cta-btn { display: inline-block; background: ${ACCENT}; color: white; font-size: 16px; font-weight: 800; padding: 14px 36px; border-radius: 10px; transition: opacity 0.2s; margin-bottom: 10px; }
    .hero-cta-btn:hover { opacity: 0.85; }
    .hero-cta-note { font-size: 13px; color: rgba(255,255,255,0.35); display: block; margin-bottom: 36px; }
    .hero-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; }
    .hero-stat { text-align: center; }
    .hero-stat-num { font-size: 28px; font-weight: 900; color: ${ACCENT}; }
    .hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }
    .zones-strip { background: #0f0d1a; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .zone-chip { font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 999px; border: 1px solid; }
    .container { max-width: 860px; margin: 0 auto; padding: 48px 24px 80px; }
    .section-heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 2px solid ${ACCENT}33; display: flex; align-items: center; gap: 10px; }
    .section-heading::before { content: ''; display: inline-block; width: 4px; height: 22px; background: ${ACCENT}; border-radius: 2px; }
    .qa-list { display: flex; flex-direction: column; gap: 16px; }
    .qa-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; display: flex; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .qa-number { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: ${ACCENT}18; color: ${ACCENT}; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
    .qa-body { flex: 1; min-width: 0; }
    .qa-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
    .qa-zone { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 4px; }
    .qa-level { font-size: 11px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
    .qa-question { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px; line-height: 1.4; }
    .qa-teaser { font-size: 14px; color: #475569; line-height: 1.65; margin-bottom: 6px; }
    .qa-hint { font-size: 12px; color: #94a3b8; font-style: italic; margin-bottom: 12px; }
    .qa-cta-link { display: inline-block; font-size: 13px; font-weight: 700; color: ${ACCENT}; border: 1px solid ${ACCENT}40; background: ${ACCENT}08; padding: 6px 14px; border-radius: 6px; transition: background 0.15s; }
    .qa-cta-link:hover { background: ${ACCENT}18; }
    .cta-banner { background: #07050f; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 48px 32px; text-align: center; margin-top: 48px; }
    .cta-title { font-size: 26px; font-weight: 900; color: white; margin-bottom: 10px; }
    .cta-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 28px; max-width: 500px; margin-left: auto; margin-right: auto; }
    .cta-btn { display: inline-block; background: ${ACCENT}; color: white; font-size: 16px; font-weight: 800; padding: 14px 36px; border-radius: 10px; transition: opacity 0.2s; }
    .cta-btn:hover { opacity: 0.85; }
    .cta-note { margin-top: 14px; font-size: 13px; color: rgba(255,255,255,0.3); }
    .sticky-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #07050f; border-top: 1px solid rgba(255,255,255,0.1); padding: 12px 24px; display: flex; align-items: center; justify-content: center; gap: 16px; z-index: 200; flex-wrap: wrap; }
    .sticky-bar-text { font-size: 14px; color: rgba(255,255,255,0.65); }
    .sticky-bar-text strong { color: white; }
    .sticky-bar-btn { background: ${ACCENT}; color: white; font-size: 13px; font-weight: 700; padding: 8px 20px; border-radius: 8px; white-space: nowrap; }
    .footer { text-align: center; padding: 24px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: ${ACCENT}; }
    @media (max-width: 600px) { .qa-card { flex-direction: column; } .hero { padding: 40px 16px 32px; } .sticky-bar { flex-direction: column; gap: 8px; padding: 10px 16px; } }
  </style>
</head>
<body>
  <header class="header">
    <a href="https://qaveda.com" class="header-brand">QA<span>Veda</span></a>
    <a href="https://qaveda.com" class="header-cta">Practice Free on QAVeda →</a>
  </header>

  <section class="hero">
    <div class="hero-badge">Interview Prep · The War Room</div>
    <h1 class="hero-title">QA <span>Interview Questions</span></h1>
    <p class="hero-subtitle">Real questions asked in actual QA, SDET and automation engineer interviews — ${totalCount}+ Q&amp;As across 6 topics and 3 experience levels. Full answers on QAVeda.</p>
    <a href="https://qaveda.com" class="hero-cta-btn">Practice Full Answers Free →</a>
    <span class="hero-cta-note">Free · No credit card · Full explanations + examples included</span>
    <div class="hero-stats">
      <div class="hero-stat"><div class="hero-stat-num">${totalCount}+</div><div class="hero-stat-label">Questions</div></div>
      <div class="hero-stat"><div class="hero-stat-num">6</div><div class="hero-stat-label">Topics</div></div>
      <div class="hero-stat"><div class="hero-stat-num">3</div><div class="hero-stat-label">Levels</div></div>
    </div>
  </section>

  <div class="zones-strip">
    ${ZONES.map(z => `<span class="zone-chip" style="color:${z.color};border-color:${z.color}40;background:${z.color}10">${escapeHtml(z.title)}</span>`).join('')}
  </div>

  <main class="container">
    <h2 class="section-heading">Sample Questions — Preview</h2>
    <div class="qa-list">
      ${sampleCards}
    </div>

    <div class="cta-banner">
      <div class="cta-title">Stop guessing. Start knowing.</div>
      <div class="cta-sub">QAVeda has ${totalCount}+ full interview answers with walked-through examples, real-world QA scenarios and rules of thumb — across all 6 topics and 3 experience levels.</div>
      <a href="https://qaveda.com" class="cta-btn">Open The War Room Free →</a>
      <div class="cta-note">Free · No credit card required</div>
    </div>
  </main>

  <footer class="footer">
    © 2026 <a href="https://qaveda.com">QAVeda</a> · Gamified QA Learning Platform · <a href="https://qaveda.com">qaveda.com</a>
  </footer>

  <div class="sticky-bar">
    <span class="sticky-bar-text"><strong>Want the full answer?</strong> ${totalCount}+ real interview Q&amp;As are free on QAVeda.</span>
    <a href="https://qaveda.com" class="sticky-bar-btn">Go to QAVeda →</a>
  </div>
</body>
</html>`;
}

function generateMasteryTrialPage(): string {
  const ACCENT = '#f59e0b';
  const zoneNames = ZONES.map(z => z.title);

  const schema = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "QA Mastery Trial — Test Your Knowledge",
    "description": "30-question mastery quiz per zone. Score 80% or above to earn your QA Certificate of Mastery. Covers all 6 QA learning zones: ${zoneNames.join(', ')}.",
    "provider": {
      "@type": "Organization",
      "name": "QAVeda",
      "sameAs": "https://qaveda.com"
    },
    "url": "https://qaveda.com",
    "isAccessibleForFree": true,
    "inLanguage": "en-US",
    "educationalLevel": ["Beginner", "Intermediate", "Expert"],
    "about": {
      "@type": "Thing",
      "name": "Software Quality Assurance",
      "description": "QA engineering skills including ${zoneNames.join(', ')}"
    },
    "educationalUse": "assessment"
  }
  </script>`;

  const zoneCards = ZONES.map(z => `
        <div class="zone-card">
          <div class="zone-dot" style="background:${z.color}"></div>
          <div class="zone-info">
            <div class="zone-name">${escapeHtml(z.title)}</div>
            <div class="zone-sub">30 questions · 80% to pass · Certificate on completion</div>
          </div>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QA Mastery Trial — Practice Test &amp; Certificate · QAVeda</title>
  <meta name="description" content="Test your QA knowledge with the Mastery Trial — 30 questions per zone, no hints, timed. Score 80%+ to earn your QA Certificate of Mastery. Free on QAVeda." />
  <meta name="keywords" content="QA practice test, software testing quiz, QA certification quiz, QA knowledge test, manual testing quiz, API testing quiz, Playwright quiz, TypeScript QA quiz, SDET practice exam, software tester assessment" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://qaveda.com/mastery-trial.html" />
  <meta property="og:title" content="QA Mastery Trial — Practice Test &amp; Certificate · QAVeda" />
  <meta property="og:description" content="30 questions. No hints. Score 80%+ to earn your QA Certificate of Mastery. Free on QAVeda." />
  <meta property="og:url" content="https://qaveda.com/mastery-trial.html" />
  <meta property="og:image" content="https://qaveda.com/og-image.png" />
${generateWebsiteSchema()}
${schema}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; padding-bottom: 72px; }
    a { color: inherit; text-decoration: none; }
    .header { background: #07050f; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .header-brand { font-size: 20px; font-weight: 900; color: white; }
    .header-brand span { color: ${ACCENT}; }
    .header-cta { background: ${ACCENT}; color: white; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 8px; }
    .hero { background: #07050f; padding: 60px 24px 48px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; margin-bottom: 20px; }
    .hero-title { font-size: clamp(32px, 6vw, 56px); font-weight: 900; color: white; letter-spacing: -1px; margin-bottom: 12px; }
    .hero-title span { color: ${ACCENT}; }
    .hero-subtitle { font-size: 17px; color: rgba(255,255,255,0.5); max-width: 600px; margin: 0 auto 28px; }
    .rules { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px; }
    .rule { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px 24px; text-align: center; min-width: 140px; }
    .rule-val { font-size: 24px; font-weight: 900; color: ${ACCENT}; }
    .rule-label { font-size: 12px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
    .hero-cta-btn { display: inline-block; background: ${ACCENT}; color: white; font-size: 16px; font-weight: 800; padding: 14px 36px; border-radius: 10px; transition: opacity 0.2s; margin-bottom: 10px; }
    .hero-cta-btn:hover { opacity: 0.85; }
    .hero-cta-note { font-size: 13px; color: rgba(255,255,255,0.35); display: block; }
    .container { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
    .section-heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 2px solid ${ACCENT}33; display: flex; align-items: center; gap: 10px; }
    .section-heading::before { content: ''; display: inline-block; width: 4px; height: 22px; background: ${ACCENT}; border-radius: 2px; }
    .zone-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 48px; }
    .zone-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .zone-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .zone-name { font-size: 15px; font-weight: 700; color: #0f172a; }
    .zone-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
    .how-it-works { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; margin-bottom: 40px; }
    .how-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
    .steps { display: flex; flex-direction: column; gap: 14px; }
    .step { display: flex; gap: 14px; align-items: flex-start; }
    .step-num { width: 28px; height: 28px; border-radius: 50%; background: ${ACCENT}18; color: ${ACCENT}; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-text { font-size: 14px; color: #475569; padding-top: 4px; }
    .step-text strong { color: #0f172a; }
    .cta-banner { background: #07050f; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 48px 32px; text-align: center; }
    .cta-title { font-size: 26px; font-weight: 900; color: white; margin-bottom: 10px; }
    .cta-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 28px; max-width: 480px; margin-left: auto; margin-right: auto; }
    .cta-btn { display: inline-block; background: ${ACCENT}; color: white; font-size: 16px; font-weight: 800; padding: 14px 36px; border-radius: 10px; }
    .cta-note { margin-top: 14px; font-size: 13px; color: rgba(255,255,255,0.3); }
    .sticky-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #07050f; border-top: 1px solid rgba(255,255,255,0.1); padding: 12px 24px; display: flex; align-items: center; justify-content: center; gap: 16px; z-index: 200; flex-wrap: wrap; }
    .sticky-bar-text { font-size: 14px; color: rgba(255,255,255,0.65); }
    .sticky-bar-text strong { color: white; }
    .sticky-bar-btn { background: ${ACCENT}; color: white; font-size: 13px; font-weight: 700; padding: 8px 20px; border-radius: 8px; white-space: nowrap; }
    .footer { text-align: center; padding: 24px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: ${ACCENT}; }
    @media (max-width: 600px) { .rules { flex-direction: column; align-items: center; } .hero { padding: 40px 16px 32px; } .sticky-bar { flex-direction: column; gap: 8px; padding: 10px 16px; } }
  </style>
</head>
<body>
  <header class="header">
    <a href="https://qaveda.com" class="header-brand">QA<span>Veda</span></a>
    <a href="https://qaveda.com" class="header-cta">Take the Trial Free →</a>
  </header>

  <section class="hero">
    <div class="hero-badge">Assessment · Mastery Trial</div>
    <h1 class="hero-title">QA <span>Mastery Trial</span></h1>
    <p class="hero-subtitle">30 questions. No hints. Timed. Score 80% or above to earn your QA Certificate of Mastery — and prove you know your zone.</p>
    <div class="rules">
      <div class="rule"><div class="rule-val">30</div><div class="rule-label">Questions</div></div>
      <div class="rule"><div class="rule-val">80%</div><div class="rule-label">Pass Score</div></div>
      <div class="rule"><div class="rule-val">6</div><div class="rule-label">Zones</div></div>
      <div class="rule"><div class="rule-val">Free</div><div class="rule-label">On QAVeda</div></div>
    </div>
    <a href="https://qaveda.com" class="hero-cta-btn">Start Your Trial Free →</a>
    <span class="hero-cta-note">Retry anytime · No credit card required</span>
  </section>

  <main class="container">
    <h2 class="section-heading">Available Zones</h2>
    <div class="zone-list">
      ${zoneCards}
    </div>

    <div class="how-it-works">
      <div class="how-title">How the Mastery Trial works</div>
      <div class="steps">
        <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Choose a zone</strong> — Manual Testing, SQL, API Testing, TypeScript, Playwright or AI for QA.</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Answer 30 questions</strong> — multiple choice, drawn from across Beginner, Intermediate and Expert tiers. No hints.</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Score 80% or above</strong> — pass the trial and earn your QA Certificate of Mastery for that zone.</div></div>
        <div class="step"><div class="step-num">4</div><div class="step-text"><strong>Retry anytime</strong> — no lock-outs. Review your weak spots in the lessons and come back stronger.</div></div>
      </div>
    </div>

    <div class="cta-banner">
      <div class="cta-title">Are you ready to be tested?</div>
      <div class="cta-sub">The Mastery Trial is free on QAVeda. Study the lessons, then prove what you know. Certificates downloadable as PDF.</div>
      <a href="https://qaveda.com" class="cta-btn">Take the Mastery Trial Free →</a>
      <div class="cta-note">Free · No credit card required · All 6 zones available</div>
    </div>
  </main>

  <footer class="footer">
    © 2026 <a href="https://qaveda.com">QAVeda</a> · Gamified QA Learning Platform · <a href="https://qaveda.com">qaveda.com</a>
  </footer>

  <div class="sticky-bar">
    <span class="sticky-bar-text"><strong>Ready to test yourself?</strong> The Mastery Trial is free on QAVeda.</span>
    <a href="https://qaveda.com" class="sticky-bar-btn">Start the Trial →</a>
  </div>
</body>
</html>`;
}

let generated = 0;
for (const zone of ZONES) {
  const html = generatePage(zone);
  const outPath = join(OUT_DIR, `${zone.slug}.html`);
  writeFileSync(outPath, html, 'utf-8');
  const count = (INTERVIEW_BANK[zone.key] ?? []).length;
  console.log(`✅ ${zone.slug}.html — ${count} Q&As`);
  generated++;
}

// Generate standalone feature pages
const PUBLIC_DIR = join(__dirname, '../public');
writeFileSync(join(PUBLIC_DIR, 'war-room.html'), generateWarRoomPage(), 'utf-8');
console.log('✅ war-room.html');
writeFileSync(join(PUBLIC_DIR, 'mastery-trial.html'), generateMasteryTrialPage(), 'utf-8');
console.log('✅ mastery-trial.html');

console.log(`\n🎉 Generated ${generated} zone pages + 2 feature pages`);
