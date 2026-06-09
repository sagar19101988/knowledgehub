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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAnswer(answer: string): string {
  // Convert markdown bold **text** to <strong>
  let html = escapeHtml(answer);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert backtick code to <code>
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Convert newlines to <br>
  html = html.replace(/\n/g, '<br>');
  return html;
}

function generatePage(zone: typeof ZONES[0]): string {
  const questions = INTERVIEW_BANK[zone.key] ?? [];
  const juniors  = questions.filter(q => q.level === 'junior');
  const mids     = questions.filter(q => q.level === 'mid');
  const seniors  = questions.filter(q => q.level === 'senior');

  const renderSection = (level: string, items: typeof questions) => {
    if (items.length === 0) return '';
    return `
    <section class="level-section">
      <h2 class="level-heading">${LEVEL_LABELS[level]}</h2>
      <div class="qa-list">
        ${items.map((qa, i) => `
        <article class="qa-card">
          <div class="qa-number">${i + 1}</div>
          <div class="qa-body">
            ${qa.topic ? `<span class="qa-topic">${escapeHtml(qa.topic)}</span>` : ''}
            <h3 class="qa-question">${escapeHtml(qa.question)}</h3>
            ${qa.code ? `<pre class="qa-code"><code>${escapeHtml(qa.code)}</code></pre>` : ''}
            <div class="qa-answer">${renderAnswer(qa.answer)}</div>
            ${qa.analogy ? `<div class="qa-analogy"><span class="analogy-label">💡 Plain English:</span> ${escapeHtml(qa.analogy)}</div>` : ''}
          </div>
        </article>`).join('')}
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
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
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
      z-index: 10;
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
    .hero-stats {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero-stat {
      text-align: center;
    }
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
    .qa-list { display: flex; flex-direction: column; gap: 20px; }
    .qa-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
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
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    .qa-code {
      background: #1e293b;
      color: #94a3b8;
      font-size: 13px;
      padding: 14px 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 12px;
      font-family: 'Consolas', 'Monaco', monospace;
      line-height: 1.5;
    }
    .qa-answer {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
    }
    .qa-answer strong { color: #1e293b; font-weight: 700; }
    .qa-answer code {
      background: #f1f5f9;
      color: #7c3aed;
      padding: 1px 5px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
    }
    .qa-analogy {
      margin-top: 12px;
      padding: 12px 14px;
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
      color: #78350f;
      line-height: 1.6;
    }
    .analogy-label {
      font-weight: 700;
      margin-right: 4px;
    }

    /* CTA banner */
    .cta-banner {
      background: #07050f;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
      margin-top: 48px;
    }
    .cta-title {
      font-size: 24px;
      font-weight: 900;
      color: white;
      margin-bottom: 8px;
    }
    .cta-sub {
      font-size: 15px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 24px;
    }
    .cta-btn {
      display: inline-block;
      background: ${zone.color};
      color: white;
      font-size: 15px;
      font-weight: 700;
      padding: 12px 32px;
      border-radius: 10px;
    }
    .cta-btn:hover { opacity: 0.85; }

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
    <p class="hero-subtitle">${zone.description}</p>
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
        <div class="hero-stat-num">Real</div>
        <div class="hero-stat-label">Company Asked</div>
      </div>
    </div>
  </section>

  <main class="container">
    ${renderSection('junior', juniors)}
    ${renderSection('mid', mids)}
    ${renderSection('senior', seniors)}

    <div class="cta-banner">
      <div class="cta-title">Want to master ${zone.title}?</div>
      <div class="cta-sub">QAVeda has 200+ structured lessons, practice tests, skill assessments and certificates — all gamified with XP, badges and ranks.</div>
      <a href="https://qaveda.com" class="cta-btn">Start Learning on QAVeda →</a>
    </div>
  </main>

  <footer class="footer">
    © 2026 <a href="https://qaveda.com">QAVeda</a> · Gamified QA Learning Platform · <a href="https://qaveda.com">qaveda.com</a>
  </footer>

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

console.log(`\n🎉 Generated ${generated} zone pages in public/zones/`);
