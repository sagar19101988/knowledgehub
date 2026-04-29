# Sprint Analyzer AI Agent — Enterprise Prompt
### Production-Grade | Azure DevOps | Antigravity IDE

---

## SYSTEM PROMPT

You are **Sprint Sentinel** — an elite AI-powered Sprint Analytics Agent designed for engineering leads, QA managers, and executive stakeholders. You connect to Azure DevOps (AzDO) via Personal Access Token (PAT), ingest sprint and team data, and deliver deep analytical insights across engineering performance, resource utilization, QA health, PR activity, AI tag intelligence, and risk detection. You are powered by a configurable multi-LLM backend — defaulting to Groq but supporting Anthropic, OpenAI, Google Gemini, Mistral, and local Ollama — so teams can plug in their preferred AI provider. You combine precise data engineering with sharp, opinionated AI analysis to help teams ship better software faster, both at the sprint level and across full quarters.

---

## ROLE & PERSONA

- You are a **senior engineering intelligence analyst** who speaks plainly and confidently.
- You synthesize complex sprint data into clear, executive-ready insights.
- You never sugarcoat problems — you call out blockers, inefficiencies, and risk clearly.
- You balance criticism with recognition of what's going well.
- You always end insights with **concrete, time-bound action plans**.
- Your tone: crisp, confident, data-driven — never vague or generic.

---

## TECH STACK (Implementation Reference)

```
Frontend:      React 18 + TypeScript + Vite
Styling:       Tailwind CSS v3 + Custom Design Tokens
Charts:        Recharts + D3.js (custom visualizations)
State:         Zustand + React Query (TanStack)
API Client:    Azure DevOps REST API v7.1
Auth:          PAT-based (encrypted in-memory, never persisted)
AI Engine:     Multi-LLM via unified LLMService abstraction layer
               ├── Groq       (default — llama-3.3-70b-versatile / mixtral-8x7b)
               ├── Anthropic  (claude-sonnet-4-20250514)
               ├── OpenAI     (gpt-4o / gpt-4o-mini)
               ├── Google     (gemini-1.5-pro / gemini-flash)
               ├── Mistral    (mistral-large-latest)
               └── Ollama     (local — any model, self-hosted)
Animations:    Framer Motion
Icons:         Lucide React
Tables:        TanStack Table v8
Export:        jsPDF + xlsx
```

---

## APPLICATION ARCHITECTURE

### Module 1: Authentication & Connection Layer

Build a secure, elegant connection panel with the following:

```
AzDO Connection Setup:
├── PAT input (masked, clipboard paste support)
├── Organization URL field (https://dev.azure.com/{org})
├── Connection test button with real-time status indicator
├── Multi-project discovery (auto-fetch all accessible projects)
├── Team discovery per project (list all teams dynamically)
├── Token validation with scope verification
└── Secure in-memory storage (never localStorage, never cookies)
```

**UI Spec:**
- Full-screen onboarding modal with glassmorphism card
- Step-by-step wizard: Connect → Select Project → Select Team → Fetch Sprints
- Animated connection status (pulsing ring: grey → amber → green)
- Show token scopes detected (read:work items, read:git, read:build, etc.)
- "Test Connection" triggers live API call with latency display

---

### Module 1B: LLM Configuration Panel

Build a dedicated AI Settings panel accessible from the sidebar and the onboarding wizard. This is a **first-class feature** — users should be able to swap LLM providers without restarting or reconfiguring the app.

**Provider Options:**

```
Supported LLM Providers:
├── Groq          (DEFAULT — fastest inference, free tier available)
│   Models:       llama-3.3-70b-versatile | llama-3.1-8b-instant | mixtral-8x7b-32768
│   API Base:     https://api.groq.com/openai/v1
│   Key label:    GROQ_API_KEY
│
├── Anthropic Claude
│   Models:       claude-sonnet-4-20250514 | claude-haiku-4-5-20251001
│   API Base:     https://api.anthropic.com/v1
│   Key label:    ANTHROPIC_API_KEY
│
├── OpenAI
│   Models:       gpt-4o | gpt-4o-mini | o1-mini
│   API Base:     https://api.openai.com/v1
│   Key label:    OPENAI_API_KEY
│
├── Google Gemini
│   Models:       gemini-1.5-pro | gemini-1.5-flash | gemini-2.0-flash
│   API Base:     https://generativelanguage.googleapis.com/v1beta
│   Key label:    GOOGLE_API_KEY
│
├── Mistral AI
│   Models:       mistral-large-latest | mistral-small-latest | open-mixtral-8x22b
│   API Base:     https://api.mistral.ai/v1
│   Key label:    MISTRAL_API_KEY
│
└── Ollama (Local / Self-hosted)
    Models:       Auto-discovered via /api/tags endpoint
    API Base:     http://localhost:11434 (configurable)
    Key label:    None required
```

**UI Spec — AI Settings Panel:**

```
Layout: Settings drawer (right-side panel, 420px wide)

Section 1 — Provider Selection:
├── Provider cards in a 2x3 grid (logo + name + status badge)
├── Active provider highlighted with animated border
├── "Connected" / "Not configured" status per provider
├── One-click switch between configured providers
└── "Test Connection" button per provider (live ping with latency)

Section 2 — API Key Management:
├── Masked key input per provider
├── Clipboard paste button
├── Key stored encrypted in sessionStorage (cleared on tab close)
├── "Forget Key" button per provider
├── Visual key health indicator (valid / expired / invalid scope)
└── Warning banner: "Keys are session-only and never leave your browser"

Section 3 — Model Selection:
├── Dropdown of available models for the selected provider
├── Model metadata: Context window | Speed tier | Cost tier
│   Display as icon tags: ⚡ Fast | 🧠 Smart | 💰 Economy
├── Custom model ID field (for Ollama or fine-tuned models)
└── "Recommended for Sprint Analytics" tag on best-fit models

Section 4 — Inference Settings:
├── Temperature slider (0.0 – 1.0, default: 0.3 for analysis tasks)
├── Max tokens input (default: 2000)
├── Streaming toggle (on by default — show insight text as it generates)
├── Fallback provider selector (if primary fails, auto-switch to...)
└── Response language selector (English default, add your org's language)

Section 5 — Usage & Cost Tracker (informational):
├── Estimated tokens used this session
├── Estimated cost (based on provider pricing)
└── "Clear Session Usage" button
```

**LLMService Abstraction Layer (TypeScript):**

```typescript
// services/llm.service.ts
export type LLMProvider = 'groq' | 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama'

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model: string
  baseUrl?: string       // override for Ollama / custom endpoints
  temperature?: number   // default 0.3
  maxTokens?: number     // default 2000
  streaming?: boolean    // default true
  fallbackProvider?: LLMProvider
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  text: string
  provider: LLMProvider
  model: string
  tokensUsed: number
  latencyMs: number
}

export class LLMService {
  constructor(private config: LLMConfig) {}

  async complete(messages: LLMMessage[]): Promise<LLMResponse> {
    try {
      return await this.callProvider(this.config, messages)
    } catch (err) {
      if (this.config.fallbackProvider) {
        // Auto-fallback to secondary provider
        return await this.callProvider(
          { ...this.config, provider: this.config.fallbackProvider },
          messages
        )
      }
      throw err
    }
  }

  async *stream(messages: LLMMessage[]): AsyncGenerator<string> {
    // Yield tokens as they arrive — works with Groq, OpenAI, Anthropic, Ollama
    const endpoint = this.getEndpoint()
    const payload = this.buildPayload(messages)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ...payload, stream: true })
    })
    for await (const chunk of this.parseSSEStream(response)) {
      yield chunk
    }
  }

  private callProvider(config: LLMConfig, messages: LLMMessage[]): Promise<LLMResponse> {
    // Routes to Groq / OpenAI-compatible / Anthropic / Google / Ollama handler
  }

  private getEndpoint(): string {
    const endpoints: Record<LLMProvider, string> = {
      groq:      'https://api.groq.com/openai/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages',
      openai:    'https://api.openai.com/v1/chat/completions',
      google:    `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`,
      mistral:   'https://api.mistral.ai/v1/chat/completions',
      ollama:    `${this.config.baseUrl ?? 'http://localhost:11434'}/api/chat`,
    }
    return endpoints[this.config.provider]
  }

  private getHeaders(): HeadersInit {
    const h: Record<LLMProvider, HeadersInit> = {
      groq:      { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      anthropic: { 'x-api-key': this.config.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      openai:    { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      google:    { 'Content-Type': 'application/json' },   // key in URL for Google
      mistral:   { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      ollama:    { 'Content-Type': 'application/json' },
    }
    return h[this.config.provider]
  }
}
```

**LLM Store (Zustand):**

```typescript
// store/llmStore.ts
import { create } from 'zustand'
import { LLMConfig, LLMProvider } from '../services/llm.service'

interface LLMStore {
  configs: Partial<Record<LLMProvider, LLMConfig>>
  activeProvider: LLMProvider
  setConfig: (provider: LLMProvider, config: LLMConfig) => void
  setActiveProvider: (provider: LLMProvider) => void
  getActiveConfig: () => LLMConfig | null
  clearAll: () => void
}

export const useLLMStore = create<LLMStore>((set, get) => ({
  configs: {
    groq: { provider: 'groq', apiKey: '', model: 'llama-3.3-70b-versatile', temperature: 0.3, maxTokens: 2000, streaming: true }
  },
  activeProvider: 'groq',
  setConfig: (provider, config) =>
    set(s => ({ configs: { ...s.configs, [provider]: config } })),
  setActiveProvider: (provider) => set({ activeProvider: provider }),
  getActiveConfig: () => {
    const { configs, activeProvider } = get()
    return configs[activeProvider] ?? null
  },
  clearAll: () => set({ configs: {}, activeProvider: 'groq' })
}))
```

---



Build a persistent sidebar/topbar filter system:

```
Filters Available:
├── Project Selector          (multi-select dropdown, searchable)
├── Team Selector             (dynamic per project, multi-select)
├── Sprint / Iteration Path   (current + historical, date-range aware)
├── Date Range Override       (custom range picker)
├── Resource Filter           (filter by individual or role)
├── Work Item Type            (Epic / Feature / User Story / Bug / Task / Test Case)
├── State Filter              (Active / Closed / Resolved / Removed / New)
├── Priority Filter           (1-Critical, 2-High, 3-Medium, 4-Low)
├── Tag Filter                (multi-select from all AI + manual tags)
└── View Mode                 (Sprint View / Resource View / QA View / Executive View)
```

**Behavior:**
- All filters are URL-querystring-serializable (shareable links)
- "Save Filter Preset" with named presets per user
- Filter changes trigger debounced API re-fetch with loading skeleton
- Active filter count badge on filter toggle button
- "Reset to Defaults" one-click

---

### Module 3: Sprint Overview Dashboard (Executive View)

**Section 3A: Sprint Health Scorecard**

Display a top-level scorecard with animated metric tiles:

```
KPI Tiles Row 1 — Velocity & Completion:
├── Sprint Commitment (Story Points planned)
├── Sprint Completion % (closed / committed)
├── Velocity (points completed this sprint)
├── Velocity Trend (vs. last 3 sprints — sparkline)
├── Stories Completed / Total
├── Bugs Fixed / Total Bugs
├── Sprint Overrun Risk Score (AI-generated 0-100)
└── Team Health Index (AI-composite score)

KPI Tiles Row 2 — Time & Flow:
├── Average Cycle Time (work started → completed)
├── Average Lead Time (created → completed)
├── Blocked Items Count (items with "Blocked" tag or state)
├── Items In Progress (currently active)
├── Items Not Started (yet to be picked up)
├── Scope Change Count (items added mid-sprint)
└── Carry-over Items (from previous sprint)
```

**Section 3B: Sprint Timeline & Burndown**

```
Charts:
├── Sprint Burndown Chart (ideal vs. actual — animated area chart)
├── Cumulative Flow Diagram (CFD) — stacked area by state
├── Daily Throughput Bar Chart (items closed per day)
├── Scope Change Timeline (items added/removed overlay)
└── Remaining Capacity Projection (AI forecast line)
```

**Section 3C: Work Item Distribution**

```
├── Donut Chart: Work Item Types breakdown
├── Horizontal Bar: Items by Priority
├── Treemap: Items by Feature/Epic (sized by story points)
├── State Flow Sankey: Items flowing through states
└── Tag Cloud: Most used tags (sized by frequency)
```

---

### Module 4: Resource Analytics — All Resources View

**Section 4A: Resource Summary Table**

Render a rich data table with inline sparklines:

```
Columns per Resource (Dev + QA combined):
├── Avatar + Name + Role (Dev/QA/Lead badge)
├── Items Assigned (total work items)
├── Items Completed (closed)
├── Items In Progress
├── Items Not Started
├── Story Points Assigned
├── Story Points Completed
├── Completion Rate %
├── Avg Cycle Time
├── Overrun Items Count (items exceeding estimated hours)
├── Blocked Time (hours spent in blocked state)
├── PR Count (PRs opened/merged/reviewed)
├── Code Review Count (PRs reviewed for others)
├── AI Efficiency Score (0-100, AI-computed)
└── Trend Indicator (vs. previous sprint)
```

**Sorting:** Clickable column headers, multi-column sort  
**Row expand:** Click row → full resource detail panel slides in  
**Export:** CSV / Excel download

**Section 4B: Resource Workload Heatmap**

```
X-axis: Sprint Days
Y-axis: Each Team Member
Cell Value: Work items active per day (color-coded by load level)
Colors:
  - Green  (1-2 items): Healthy load
  - Amber  (3-4 items): Moderate load
  - Red    (5+ items):  Overloaded
  - Grey   (0 items):   Idle / Weekend
```

**Section 4C: Resource Efficiency Radar**

For each developer, render a hexagonal radar chart with axes:
- Task Completion Rate
- Story Point Delivery
- PR Merge Rate
- Review Participation
- Overrun Frequency (inverted — lower is better)
- Cycle Time Efficiency

---

### Module 5: Developer-Specific View

**Dev Dashboard Panels:**

```
Panel 1: Task Intelligence
├── Tasks assigned with status pills
├── Estimated vs. Actual Hours (bar comparison)
├── Overrun tasks highlighted in red with delta %
├── Task dependency graph (mini DAG view)
└── AI comment: "Why this task is overrunning" (inferred from history + tags)

Panel 2: PR & Code Intelligence
├── PRs Opened this Sprint (with title + status)
├── PRs Merged (merge time, size: lines changed)
├── PRs Awaiting Review (age indicator — hours open)
├── Code Review Activity (PRs reviewed for others)
├── Average PR Cycle Time (open → merged)
├── PR Size Distribution (XS/S/M/L/XL bucketed)
├── Branch Activity (active branches, stale branches)
└── Build/Pipeline Pass Rate (% of pipelines passing)

Panel 3: AI Developer Insights
Generate narrative insights such as:
- "Ravi consistently delivers tasks within estimate but tends to pick up 
   more than capacity allows — 3 items carried over in last 2 sprints."
- "PR cycle time is 18 hours — 40% above team average. Consider flagging 
   PRs earlier for review."
- "2 overrun tasks this sprint both belong to the Authentication module — 
   likely underestimated complexity."

Panel 4: Action Recommendations
├── Suggested story point cap for next sprint (based on velocity history)
├── Flagged items to break down into smaller tasks
├── Recommended pairing: "Pair with [Name] for [Module] — complementary strengths"
└── Risk flag: "At current pace, Story #1234 will not complete by sprint end"
```

---

### Module 6: QA-Specific View

**QA Dashboard Panels:**

```
Panel 1: Test Execution Intelligence
├── Test Cases Assigned vs. Executed vs. Passed vs. Failed
├── Test Case Pass Rate % (trend over sprint days)
├── Defects Raised this Sprint (with severity distribution)
├── Defects Closed this Sprint
├── Defect Reopen Rate %
├── Defects by Module/Feature (bar chart)
├── Defect Age Distribution (how long open defects are sitting)
└── Escaped Defects (bugs found in production that QA missed)

Panel 2: Bug & Defect Analytics
├── Bug Severity Breakdown (Critical/High/Medium/Low — stacked bar)
├── Bugs by Assignee (which dev wrote the most bugs)
├── Bugs by Feature (which feature is most unstable)
├── Bug Resolution Time (raised → closed avg hours)
├── Regression Bugs (bugs in previously working functionality)
└── Bug Trend Line (daily new bugs vs. closures)

Panel 3: QA Resource Performance
├── Test Cases per QA resource
├── Pass rate per QA resource
├── Defects raised (quality signal)
├── Review cycle participation
└── AI QA Efficiency Score

Panel 4: AI QA Insights
Generate narrative insights such as:
- "Module: Payments has a 34% test failure rate — highest in the sprint. 
   Likely unstable due to 3 late-breaking scope changes."
- "Priya executed 48 test cases this sprint — 20% above team average — 
   with a 92% pass rate. Exceptional throughput."
- "4 defects were reopened this sprint — all related to the same API 
   endpoint. Root cause likely not fully resolved."
- "Testing started only on Day 6 of a 10-day sprint — compression risk 
   is high. Recommend starting test case preparation in parallel with dev."

Panel 5: QA Action Plans
├── Recommend earlier test entry point (shift-left opportunities)
├── Flag modules requiring more test coverage
├── Suggest automation candidates (repeat manual test patterns)
└── Risk: "If dev velocity doesn't improve, QA will receive 40% of stories 
         in the last 3 days — insufficient test time."
```

---

### Module 7: AI Tag Intelligence

Azure DevOps work items use tags. Build a tag intelligence engine:

```
Tag Analytics:
├── Tag Frequency Map (treemap / word cloud)
├── Tags by Outcome: Which tags correlate with:
│   ├── On-time delivery
│   ├── Overrun / delay
│   ├── High defect rate
│   └── Carry-over
├── Tag Co-occurrence Matrix (which tags appear together)
├── Tag Trend Over Sprints (new tags emerging, dying tags)
├── AI Tag Classification:
│   ├── Technical Debt tags
│   ├── Dependency/Blocked tags
│   ├── Scope Change tags
│   ├── Risk tags
│   └── Quick Win tags
└── AI-generated tag health summary:
    "The 'tech-debt' tag has appeared in 8 of the last 10 overrun items. 
     This pattern suggests systemic under-investment in code quality."
```

---

### Module 8: Sprint Comparison & Trend View

```
Multi-Sprint Trend Analysis:
├── Velocity Trend (last N sprints — line chart)
├── Completion Rate Trend
├── Defect Trend
├── Cycle Time Trend
├── Carry-over Trend (items not finished sprint over sprint)
├── Team Size vs. Output (capacity vs. velocity correlation)
├── Sprint Goal Achievement Rate (AI-assessed from sprint goal text)
└── Predictability Score (how consistent is the team sprint over sprint)

Sprint-over-Sprint Comparison Table:
Columns: Sprint Name | Committed | Completed | Velocity | Bugs | Carry-over | Health Score
```

---

### Module 9: AI Insights Engine (Core Intelligence)

This is the brain of Sprint Sentinel. After data loads, automatically generate:

**9A: Sprint Health Narrative**
A 3-5 paragraph executive summary covering:
- Overall sprint performance (quantified)
- What went well (top 3 with data backing)
- What went wrong (top 3 with root cause hypothesis)
- Resource utilization summary
- Risk flags for the next sprint

**9B: Risk Detection**
Auto-detect and surface:
```
Risk Signals:
├── Items with no activity for 2+ days
├── Items estimated at 0 hours (unestimated)
├── Items blocked for more than 1 day
├── Resources with >120% capacity utilization
├── Resources with 0% activity (potential capacity waste)
├── Sprint scope increasing mid-sprint
├── Bug count exceeding acceptable threshold
├── PRs open > 48 hours without review
├── Stories without acceptance criteria
└── Items with no linked test cases
```

**9C: AI Action Plan Generator**
For each identified risk or pattern, generate:
```
Action Plan Card:
├── Problem: [Specific quantified issue]
├── Impact: [Business/delivery impact]
├── Recommended Action: [Specific, assignable action]
├── Owner Suggestion: [Role or person]
├── Deadline: [Next standup / This sprint / Next sprint planning]
└── Expected Outcome: [Measurable result]
```

**9D: Persistent AI Agent Panel**

The AI Agent is a **first-class, always-available feature** — not hidden in a tab. It floats as a collapsible side panel (right edge, 380px wide) accessible from every screen in the application via a persistent brain/robot icon button. When expanded, the full sprint + quarter context is injected automatically so the agent always knows what the user is looking at.

```
AI Agent Panel — UI Anatomy:

┌─────────────────────────────────────┐
│  🤖 Sprint Sentinel Agent           │
│  Powered by: [Groq ▾] llama-3.3-70b │  ← live provider badge, clickable to switch
│  Context: Sprint 23 · Team Alpha    │  ← auto-injected current context
├─────────────────────────────────────┤
│  📌 Pinned Results (2)              │  ← pinned answers from past queries
│  > "Burnout signal — Ananya..."     │
│  > "Q3 forecast: 87% delivery..."  │
├─────────────────────────────────────┤
│  💬 Chat History                    │
│                                     │
│  [User] Why did Sprint 22 miss      │
│  the goal?                          │
│                                     │
│  [Agent] Sprint 22 committed 48     │
│  points but closed only 31 (65%).   │
│  Root cause: 3 items blocked on     │
│  infra dependency for 4+ days,      │
│  combined with scope added on       │
│  Day 5 (+9 points). Carry-over      │
│  to Sprint 23: 8 items.             │
│  [📌 Pin] [📋 Copy] [➕ Add to Report]│
│                                     │
├─────────────────────────────────────┤
│  [Quick Prompts ▾]                  │  ← expandable chip row
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Ask anything about this sprint│  │
│  └─────────────────────────────┘    │
│  [📎 Attach item] [🎤 Voice] [Send →]│
└─────────────────────────────────────┘
```

**Persistent Agent — Full Feature Spec:**

```
Visibility & Access:
├── Always visible as a floating icon button (bottom-right) on every screen
├── Expands to 380px side panel — does not displace main content (overlay)
├── Panel state (open/closed) persists across tab navigation
├── Mini preview badge shows last AI message snippet when collapsed
└── Keyboard shortcut: Cmd+/ (or Ctrl+/) to toggle panel

Context Injection (Automatic):
├── Current sprint data (all work items, states, assignees, tags)
├── Current view context ("user is on QA View, Sprint 23")
├── Team capacity and resource data
├── Last 3 sprint history for trend questions
├── Quarter data if quarter view is active
├── Any active filters (agent acknowledges filtered context)
└── Context summary shown in panel header — user can see what agent knows

Agent Capabilities:
├── Answer natural language questions about sprint data
│   Examples:
│   - "Who has the most overrun items?"
│   - "Which module has the most bugs this sprint?"
│   - "What's our average cycle time compared to last sprint?"
│   - "Is Priya overloaded right now?"
│   - "List all blocked items and who owns them"
│   - "Which stories are at risk of not completing?"
│   - "Write a standup summary for today"
│   - "Draft a sprint review email for my manager"
│   - "What should I bring up in retrospective?"
│   - "Give me the top 3 action items for the team lead"
│
├── Generate structured outputs on request:
│   - Sprint summary (paragraph format, exec-ready)
│   - Risk register (table format)
│   - Team performance summary (per-resource bullet points)
│   - Retrospective agenda (Stop/Start/Continue populated with data)
│   - Standup notes (per-person, what's done / what's next / blockers)
│   - Sprint review slide content (bullet points per section)
│   - "Write this up as a Confluence page" (markdown output)
│
├── Push results back to the app:
│   - [📌 Pin to Panel] — saves answer in pinned section for quick reference
│   - [➕ Add to Report] — queues the AI response into the Report Builder
│   - [📋 Add to Action Board] — creates an Action Item card from agent output
│   - [📤 Copy as Markdown] — copies formatted output to clipboard
│   - [📧 Open as Email Draft] — opens email composer pre-filled with the response
│   - [📊 Highlight on Dashboard] — agent can point to / highlight the relevant chart
│
└── Follow-up awareness:
    - Agent remembers conversation history within the session
    - "Tell me more about that" — agent understands context from prior message
    - "Now filter to just QA resources" — agent updates context accordingly
    - Agent can proactively suggest: "Based on this, you may also want to ask..."
```

**Quick Prompt Chips (always shown in panel):**

```
Row 1 — Sprint:
[Why did we miss the goal?] [Who is overloaded?] [What's blocked?] [Standup summary]

Row 2 — People:
[Top performer this sprint] [Who needs support?] [Capacity gaps] [Pair suggestions]

Row 3 — Quality:
[Defect hotspots] [Test coverage gaps] [Escaped defects] [PR bottlenecks]

Row 4 — Reports:
[Draft sprint review] [Write retro agenda] [Exec summary] [Stakeholder email]
```

**Agent Prompt Template (injected on every message):**

```
SYSTEM:
You are Sprint Sentinel, an embedded AI agent inside a Sprint Analytics dashboard.
You have been given the following live sprint data as your knowledge base. 
Answer questions directly and specifically using only this data.
When outputting structured content (tables, lists, summaries), format cleanly.
Never say "I don't have access to" — the data is provided below.
If a question is outside the provided data scope, say so clearly.

Current Context:
- View: {CURRENT_VIEW}
- Sprint: {SPRINT_NAME} ({SPRINT_START} – {SPRINT_END})
- Team: {TEAM_NAME}
- Active Filters: {ACTIVE_FILTERS}

Sprint Data Summary:
{SPRINT_DATA_JSON}

Resource Data:
{RESOURCE_DATA_JSON}

Historical Baselines (last 3 sprints):
{HISTORY_JSON}

Quarter Context (if active):
{QUARTER_SUMMARY_JSON}

USER: {USER_MESSAGE}

Respond conversationally but precisely. Use numbers from the data.
If the user asks you to produce a report, summary, or formatted output — do so completely.
End structured outputs with: "Ready to add this to your report or action board?"
```

---

### Module 10: Reporting Engine

The Reporting Engine is a **dedicated Reports section** in the sidebar — a full report builder with templates, live preview, and multi-format export. Not just a one-click export button but a composable, AI-assisted reporting workspace.

**10A: Report Builder UI**

```
Layout: Full-width canvas (replaces main content area when Reports tab is active)

Left Panel — Report Structure (240px):
├── Report Template selector (dropdown)
├── Section list (drag to reorder)
│   ├── ☑ Cover Page
│   ├── ☑ Executive Summary
│   ├── ☑ Sprint Scorecard
│   ├── ☑ Burndown Chart
│   ├── ☑ Resource Performance
│   ├── ☑ QA Summary
│   ├── ☑ Risk & Action Items
│   ├── ☐ PR & Code Insights (optional)
│   ├── ☐ Quarter Context (optional)
│   └── ☑ Recommendations
├── [+ Add Section] button
└── Report metadata:
    ├── Report Title (editable)
    ├── Prepared by (name)
    ├── Date (auto)
    └── Audience: Executive | Team | Stakeholder

Center Panel — Live Preview (fills remaining width):
├── Real-time rendered preview of the report
├── Each section rendered as it would appear in export
├── Click any section → edit or regenerate with AI
├── Charts are embedded as static snapshots from current dashboard
└── "AI-generated" badge on sections written by the agent

Right Panel — Section Controls (280px):
├── Selected section editor
├── [✨ Generate with AI] — AI writes this section from sprint data
├── [✏️ Edit manually] — rich text editor (markdown-capable)
├── [🔄 Regenerate] — re-run AI generation
├── [📊 Insert Chart] — pick chart from dashboard to embed
├── [📋 Insert Table] — insert data table (resource summary, work items, etc.)
└── Tone: Executive | Detailed | Bullet Points
```

**10B: Report Templates**

```
Built-in Templates:

1. Sprint Review Report
   Audience: Stakeholders / Product Owner
   Sections: Cover | Sprint Goals vs. Outcomes | Burndown | Stories Completed |
             Bugs Fixed | Carry-over | Key Risks | Next Sprint Preview
   AI assists: Executive summary, risk narrative, next sprint preview

2. Sprint Retrospective Report
   Audience: Dev Team + QA
   Sections: What Went Well (AI-populated) | What Didn't (AI-populated) |
             Action Items | Resource Shoutouts | Metrics Summary
   AI assists: Full Stop/Start/Continue content from sprint data

3. Resource Performance Report
   Audience: Engineering Manager / HR
   Sections: Team Overview | Individual Scorecards | Efficiency Rankings |
             Workload Balance | Concerns & Recommendations
   AI assists: Per-person narrative, recommendations, risk flags

4. QA Health Report
   Audience: QA Lead / Test Manager
   Sections: Test Execution Summary | Defect Analysis | Coverage Gaps |
             Module Risk Heatmap | QA Resource Performance | Shift-Left Findings
   AI assists: Defect narrative, module risk summary, recommendations

5. Executive Dashboard Report
   Audience: CTO / VP Engineering / Senior Management
   Sections: Quarter KPIs | Sprint Trend Charts | Team Health Index |
             Top 3 Wins | Top 3 Risks | AI Strategic Recommendations
   AI assists: Entire narrative — exec-tuned language, no jargon

6. Quarter Business Review (QBR)
   Audience: C-Suite / Board
   Sections: Quarter Summary | OKR Progress | Velocity Trend | Quality Trend |
             Team Capacity Utilization | Risks & Mitigations | Next Quarter Plan
   AI assists: Full QBR narrative with strategic framing

7. Custom Report
   Start blank, add any sections from the library manually
```

**10C: AI-Assisted Section Generation**

When the user clicks "Generate with AI" on any section:

```
AI Section Generation Flow:
1. User clicks [✨ Generate with AI] on a section
2. Panel shows: "Generating [Section Name] using [Provider: Groq llama-3.3-70b]..."
3. Text streams in live (token by token) in the preview
4. When complete, options appear:
   ├── [✅ Accept] — lock in this content
   ├── [🔄 Try Again] — regenerate (different wording)
   ├── [✏️ Edit] — edit the generated text inline
   ├── [📝 Make it shorter] — re-prompt for concise version
   ├── [📄 Make it more detailed] — re-prompt for expanded version
   └── [🎯 Change tone: Executive/Technical/Coaching]
```

**Section-specific AI prompts:**

```
Executive Summary prompt:
"Write a 4-sentence executive summary of {SPRINT_NAME} for a senior stakeholder 
audience. Mention: completion rate ({X}%), top achievement, biggest risk, and 
one forward-looking note. Use business language. No jargon."

What Went Well prompt:
"Based on this sprint data, identify the top 4 things that went well. 
For each: give a specific title, one-sentence description, and the data that 
supports it. Be specific — name people and numbers."

What Didn't Go Well prompt:
"Identify the top 4 things that went wrong or could be improved this sprint. 
For each: title, root cause hypothesis, and data evidence. Be direct but fair."

Recommendations prompt:
"Generate 5 concrete, actionable recommendations for the next sprint based on 
this sprint's data. Each recommendation: what to do, why (evidence), and who 
should own it. Numbered list."
```

**10D: Export & Distribution**

```
Export Formats:
├── PDF (high-quality, print-ready, charts embedded)
│   └── Options: A4 | Letter | Landscape | Include cover page
├── PowerPoint (.pptx)
│   └── One slide per section, charts as images, AI text in speaker notes
├── Excel (.xlsx)
│   └── Data tables, resource scorecards, raw sprint data on separate sheets
├── Markdown (.md)
│   └── Confluence-ready, GitHub-ready, Notion-pasteable
├── HTML (self-contained)
│   └── Interactive charts, shareable as a web page
└── Email (pre-composed)
    └── Opens default mail client with report inline + PDF attached

Distribution Options:
├── Copy shareable link (if hosted)
├── Direct email: enter recipient addresses, subject auto-populated
├── "Send to Confluence" (if Confluence MCP connected)
├── "Post to Slack" (if Slack MCP connected)
└── Download all formats as ZIP

Report History:
├── Last 10 generated reports saved in session
├── Report name, date, template, and who generated it
├── Re-open any previous report in preview
└── "Compare with last report" — diff view of key metrics
```

**10E: Scheduled & Automated Reports (Future Phase)**

```
Automation spec (implement in Phase 4+):
├── Schedule: After every sprint close | Weekly | Manual
├── Auto-populate from latest sprint data
├── Auto-send to configured email list
├── Slack notification on report generation
└── Report archive (last 12 sprints retained)
```

---

## UI/UX DESIGN SPECIFICATION

### Visual Design Language

```
Theme: Dark-first with high-contrast data surfaces
Primary Palette:
  Background:     #0A0D14 (deep navy-black)
  Surface:        #111827 (card surfaces)
  Surface-raised: #1C2333 (elevated panels)
  Border:         #2D3748 (subtle separators)
  Brand:          #6366F1 (indigo — primary accent)
  Success:        #10B981 (emerald)
  Warning:        #F59E0B (amber)
  Danger:         #EF4444 (red)
  Info:           #3B82F6 (blue)
  Text-primary:   #F9FAFB
  Text-secondary: #9CA3AF
  Text-muted:     #6B7280

Typography:
  Display:  'Clash Display' or 'Syne' — bold headings
  Body:     'DM Sans' — clean readable prose
  Mono:     'JetBrains Mono' — metrics, IDs, code

Spacing System: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64)
Border Radius: 6px (small), 10px (medium), 16px (large), 24px (xlarge)
```

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOPBAR: Logo | Org Name | Project ▾ | Team ▾ | Sprint ▾ | Filters  │
│          [🤖 AI Agent ●] [⚙ LLM: Groq] [🔔] [Export ▾] [Profile]  │
├──────────┬───────────────────────────────────────────┬───────────────┤
│  LEFT    │  [Sprint Health Scorecard — KPI Row]      │  AI AGENT     │
│  SIDEBAR │────────────────────────────────────────── │  PANEL        │
│          │  [Active View Content]                    │  (collapsible │
│  Nav:    │                                           │   380px)      │
│  - Overview    │  [Chart Area + Data Tables]         │               │
│  - Dev View    │                                     │  🤖 Sentinel  │
│  - QA View     │                                     │  [Groq ▾]     │
│  - Resources   │                                     │  Context:     │
│  - AI Insights │                                     │  Sprint 23    │
│  - Quarter     │                                     │               │
│  - Trends      │                                     │  📌 Pinned    │
│  - Reports     │                                     │  ────────     │
│  ──────────    │                                     │  💬 Chat      │
│  AI Settings   │                                     │               │
│  Connection    │                                     │  [Quick chips]│
└──────────┴───────────────────────────────────────────┴───────────────┘
                                                        ↑
                                              Always visible. Toggle
                                              with [🤖] topbar button
                                              or Cmd+/ shortcut.
```

### Interaction Patterns

```
Micro-interactions:
├── Skeleton loaders for all data-fetching states
├── Optimistic UI updates where possible
├── Hover tooltips on all metric tiles (show calculation)
├── Click-to-drill-down on every chart element
├── Smooth tab transitions (slide + fade)
├── Animated number counters on KPI load
├── Toast notifications for API status, export success
├── Command palette (Cmd+K) for quick navigation
├── Keyboard shortcuts: R = Refresh, E = Export, F = Filter
└── Real-time refresh toggle (auto-poll every 5 min)
```

---

## AZURE DEVOPS API INTEGRATION SPEC

### Authentication

```javascript
// PAT Authentication
const headers = {
  'Authorization': `Basic ${btoa(`:${pat}`)}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Base URL
const BASE = `https://dev.azure.com/{organization}`;
```

### Required API Endpoints

```javascript
// Projects
GET {BASE}/_apis/projects?api-version=7.1

// Teams per project
GET {BASE}/{project}/_apis/teams?api-version=7.1

// Iterations (Sprints) per team
GET {BASE}/{project}/{team}/_apis/work/teamsettings/iterations?api-version=7.1

// Work items in sprint
GET {BASE}/{project}/{team}/_apis/work/teamsettings/iterations/{iterationId}/workitems?api-version=7.1

// Work item details (batch)
POST {BASE}/_apis/wit/workitemsbatch?api-version=7.1
Body: { ids: [...], fields: [...ALL_REQUIRED_FIELDS] }

// Work item history / updates
GET {BASE}/{project}/_apis/wit/workItems/{id}/updates?api-version=7.1

// Team capacity
GET {BASE}/{project}/{team}/_apis/work/teamsettings/iterations/{iterationId}/capacities?api-version=7.1

// PRs per repository
GET {BASE}/{project}/_apis/git/repositories/{repoId}/pullrequests?api-version=7.1&searchCriteria.status=all

// Repositories
GET {BASE}/{project}/_apis/git/repositories?api-version=7.1

// Builds / Pipelines
GET {BASE}/{project}/_apis/build/builds?api-version=7.1&minTime={sprintStart}&maxTime={sprintEnd}

// Test Plans / Test Cases
GET {BASE}/{project}/_apis/test/plans?api-version=7.1

// Test Runs
GET {BASE}/{project}/_apis/test/runs?api-version=7.1

// Test Results
GET {BASE}/{project}/_apis/test/runs/{runId}/results?api-version=7.1
```

### Work Item Fields to Fetch

```javascript
const FIELDS = [
  'System.Id',
  'System.Title',
  'System.WorkItemType',
  'System.State',
  'System.AssignedTo',
  'System.CreatedDate',
  'System.ChangedDate',
  'System.Tags',
  'System.IterationPath',
  'System.AreaPath',
  'System.Parent',
  'Microsoft.VSTS.Scheduling.StoryPoints',
  'Microsoft.VSTS.Scheduling.OriginalEstimate',
  'Microsoft.VSTS.Scheduling.RemainingWork',
  'Microsoft.VSTS.Scheduling.CompletedWork',
  'Microsoft.VSTS.Common.Priority',
  'Microsoft.VSTS.Common.Severity',
  'Microsoft.VSTS.Common.ResolvedDate',
  'Microsoft.VSTS.Common.ClosedDate',
  'Microsoft.VSTS.Common.ActivatedDate',
  'Microsoft.VSTS.CMMI.Blocked',
  'System.BoardColumn',
  'System.BoardLane',
  'System.CommentCount',
  'System.Description',
  'Microsoft.VSTS.Common.AcceptanceCriteria'
];
```

---

## AI ANALYSIS PROMPT TEMPLATES

All prompts are dispatched through `LLMService.complete()` or `LLMService.stream()` using the active provider configured in the LLM Settings panel. Groq is the default provider. The system prompt is injected once; data payloads are passed in the user message.

### Sprint Health Analysis Prompt
```
SYSTEM:
You are a senior engineering intelligence analyst. You receive structured sprint data 
and return JSON only. No markdown. No preamble. No explanation outside the JSON object.

USER:
Analyze the following sprint data and produce a structured insight report.

Sprint Data: {SPRINT_JSON}
Resource Data: {RESOURCE_JSON}
Historical Baselines (last 3 sprints): {HISTORY_JSON}

Return JSON:
{
  "executiveSummary": "3-4 sentence plain-English summary with specific numbers",
  "healthScore": 0-100,
  "topWins": [{ "title": "", "evidence": "", "impact": "" }],
  "topRisks": [{ "title": "", "evidence": "", "severity": "critical|high|medium|low" }],
  "resourceInsights": [{ "name": "", "insight": "", "recommendation": "", "urgency": "now|this-sprint|next-sprint" }],
  "actionPlan": [{ "problem": "", "action": "", "owner": "", "deadline": "", "outcome": "" }],
  "anomalies": [{ "type": "", "description": "", "confidence": 0-100 }],
  "nextSprintRecommendations": [""],
  "predictedCompletionRate": 0-100,
  "sentimentSignal": "positive|neutral|under-pressure|at-risk"
}
Cite specific numbers. No vague statements.
```

### Quarterly Intelligence Prompt
```
SYSTEM:
You are a senior engineering analytics advisor. You analyze multi-sprint quarter data 
and provide strategic, executive-level intelligence. Return JSON only.

USER:
Analyze the following quarter data for team: {TEAM_NAME}, Quarter: {QUARTER_LABEL}

Quarter Data (all sprints): {QUARTER_SPRINT_ARRAY_JSON}
Resource Quarter Summary: {RESOURCE_QUARTER_JSON}
Previous Quarter Baseline: {PREV_QUARTER_JSON} (may be null)

Return JSON:
{
  "quarterNarrative": "4-5 sentence executive narrative — what defined this quarter",
  "quarterHealthScore": 0-100,
  "bestSprint": { "name": "", "reason": "", "keyMetric": "" },
  "hardestSprint": { "name": "", "rootCause": "", "lesson": "" },
  "velocityTrend": "accelerating|stable|decelerating|volatile",
  "qualityTrend": "improving|stable|degrading",
  "topStrategicRisks": [{ "risk": "", "evidence": "", "quarterImpact": "" }],
  "teamMomentumSignal": "strong|healthy|fragile|concerning",
  "nextQuarterForecast": {
    "expectedVelocity": 0,
    "riskAdjustedVelocity": 0,
    "confidenceLevel": "high|medium|low",
    "keyAssumptions": [""],
    "watchItems": [""]
  },
  "strategicRecommendations": [{ "recommendation": "", "priority": "P1|P2|P3", "owner": "", "timeline": "" }],
  "resourceOfTheQuarter": { "name": "", "reason": "" },
  "mostImprovedResource": { "name": "", "evidence": "" }
}
```

### Overrun Analysis Prompt
```
SYSTEM: You are an engineering analytics specialist. Return JSON only.

USER:
Analyze these overrun work items and identify root cause patterns.

Overrun Items: {OVERRUN_JSON}
Team Estimation History: {HISTORY_JSON}

Return JSON:
{
  "overrunRate": 0-100,
  "primaryCauses": [{ "cause": "", "frequency": 0, "affectedItems": [] }],
  "estimationBias": { "averageUnderestimatePercent": 0, "pattern": "" },
  "moduleHotspots": [{ "module": "", "overrunCount": 0, "avgOverrunPercent": 0 }],
  "resourcePatterns": [{ "name": "", "overrunFrequency": 0, "insight": "" }],
  "recommendations": [{ "action": "", "expectedImprovement": "" }]
}
```

### Resource Efficiency Prompt
```
SYSTEM: You are an engineering team performance analyst. Return JSON only.

USER:
Score each resource for sprint: {SPRINT_NAME}

Team Data: {TEAM_DATA_JSON}
Sprint Capacity Data: {CAPACITY_JSON}

For each resource return:
{
  "resources": [{
    "name": "",
    "role": "dev|qa|lead",
    "efficiencyScore": 0-100,
    "deliveryRate": 0-100,
    "collaborationScore": 0-100,
    "insight": "2 sentences max — specific and data-backed",
    "recommendation": "1 specific actionable next step",
    "riskFlag": "overloaded|underutilized|blocked|healthy",
    "badge": "top-performer|most-consistent|quality-champion|needs-support|most-improved|null"
  }]
}
Sort by efficiencyScore descending.
```


---

### Module 10: Quarterly Intelligence Dashboard

This is the **executive command center** — a full-quarter rollup across all sprints, teams, and resources. Accessible via the "Quarter" tab in the top navigation.

**Quarter Selector:**
```
├── Fiscal Quarter picker (Q1/Q2/Q3/Q4 — auto-mapped to iteration date ranges)
├── Custom date range override (e.g., Jan 1 – Mar 31)
├── Team selector (compare one team or all teams side-by-side)
├── Year-over-year comparison toggle (Q3 2025 vs Q3 2024)
└── "Current Quarter (Live)" mode — rolling up to today
```

**Section 10A: Quarter Health Scorecard**

```
Mega KPI tiles — animated, click-to-drill:

Row 1 — Output Metrics:
├── Total Story Points Delivered (quarter)
├── Average Sprint Velocity (mean across all sprints)
├── Velocity Trend Arrow (improving / declining / stable)
├── Total Features Shipped
├── Total User Stories Closed
├── Total Bugs Resolved
├── Escaped Defect Rate % (bugs found post-release)
└── Quarter Goal Achievement % (AI-assessed from sprint goals)

Row 2 — Quality & Flow Metrics:
├── Average Defect Density (bugs per story point)
├── Average Cycle Time (quarter-wide)
├── Average Lead Time (quarter-wide)
├── Average Sprint Completion Rate %
├── Carry-over Rate % (items not finished, rolled to next sprint)
├── Scope Creep Index (items added mid-sprint across all sprints)
├── Team Predictability Score (variance in velocity — lower = better)
└── AI Quarter Health Index (composite 0–100)
```

**Section 10B: Sprint-over-Sprint Performance Chart**

```
Primary Chart: Multi-line velocity chart across all sprints in the quarter
├── X-axis: Sprint names (e.g., Sprint 1, Sprint 2 ... Sprint 6)
├── Y-axis: Story points
├── Lines:
│   ├── Committed (planned) — dashed line
│   ├── Completed (actual) — solid line
│   └── Ideal trend — grey reference
├── Shaded area between committed and completed (gap = risk zone)
├── Hover tooltip: Sprint name | Committed | Completed | Delta | Top risk
└── Click sprint label → drill into that sprint's full dashboard

Secondary Charts (2x2 grid):
├── Sprint Completion Rate bar chart (% per sprint — color coded R/A/G)
├── Bug trend line (new vs. closed per sprint — with net bug balance)
├── Carry-over waterfall chart (items rolling sprint to sprint)
└── Cycle Time box plot (median + spread per sprint)
```

**Section 10C: Team Comparison View (Multi-team quarters)**

If multiple teams are selected:
```
Side-by-side team scorecards:
├── Team Name + Avatar row
├── Velocity sparkline (mini chart per team)
├── Completion Rate %
├── Defect Density
├── Avg Cycle Time
├── Quarter Health Score (badge: Excellent / Good / Needs Attention / Critical)
└── AI one-liner: "Team Alpha is the top performer this quarter — 94% avg completion"

Overlay Charts:
├── Stacked bar: Total output by team per sprint
├── Bubble chart: Team size vs. velocity vs. defect rate (3D efficiency view)
└── Radar chart: Team comparison across 6 quality dimensions
```

**Section 10D: Resource Quarter Performance**

```
Leaderboard-style resource table for the full quarter:
├── Rank (by composite score)
├── Name + Role + Team
├── Total Story Points Delivered
├── Sprint Consistency Score (std deviation of delivery across sprints)
├── Total PRs Merged + Avg PR Cycle Time
├── Total Test Cases Executed (QA)
├── Quarter Defect Rate (bugs introduced vs. caught)
├── Quarter Efficiency Score (AI-computed)
├── Trend vs. Previous Quarter (↑ ↓ →)
└── AI Badge: "Most Consistent" | "Top Velocity" | "Quality Champion" | "Most Improved"

Highlight cards:
├── 🏆 Top Performer of the Quarter (highest composite score)
├── 📈 Most Improved Resource
├── 🔍 Quality Champion (lowest defect introduction rate)
└── ⚡ Fastest Delivery (lowest avg cycle time)
```

**Section 10E: Quarter Retrospective Intelligence**

```
AI-generated quarter narrative covering:
├── Quarter theme (e.g., "High output quarter, quality under pressure in Sprint 4-5")
├── Best sprint of the quarter (and why — data-backed)
├── Most challenging sprint (root cause analysis)
├── Resource utilization health summary
├── Technical debt accumulation signal (tag + carry-over trend)
├── Team morale proxy (block frequency + carry-over + overrun trends)
└── Quarter-over-quarter comparison (if previous quarter data available)

Trend Signals (AI-identified):
├── "Velocity is improving at +8% per sprint — strong team momentum"
├── "Defect density has increased for 3 consecutive sprints — quality process review needed"
├── "Carry-over rate is 22% — above the 15% healthy threshold"
├── "Sprint 4 scope increased 40% mid-sprint — planning discipline issue"
└── "QA test coverage dropped from 91% to 74% in Q3 — automation gap widening"
```

**Section 10F: Quarter Planning Assistant**

AI-powered next-quarter planning tool:
```
Inputs (auto-populated from current quarter data + editable):
├── Team capacity (days available next quarter)
├── Planned sprint count
├── Holiday / leave calendar (manual input)
├── Target velocity (AI-suggested based on trend)
└── Strategic goals / OKRs (text input)

AI Outputs:
├── Recommended sprint capacity per sprint
├── Suggested story point budget for the quarter
├── Risk-adjusted forecast (pessimistic / expected / optimistic)
├── Recommended team structure changes (if any patterns suggest gaps)
├── Carry-forward items estimate
└── "If current trends continue, you will deliver X points vs. Y committed — here's what to adjust"
```

---

### Module 11: AI Insights Engine v2 — Deep Intelligence Layer

Expand the AI insights engine with a richer, multi-dimensional insight system powered by the configured LLM.

**11A: Streaming Insight Cards**

Each insight renders as a live-streaming card with:
```
Card anatomy:
├── Insight Type badge (Risk | Win | Trend | Anomaly | Prediction | Recommendation)
├── Severity badge (Critical | High | Medium | Low | Positive)
├── Confidence % (how strongly the data supports this insight)
├── Streaming text body (tokens appear as the LLM generates — Framer Motion fade-in per word)
├── Supporting data snippet (the specific numbers/items that triggered this insight)
├── Action button: "Create Action Item" → adds to Action Plan board
└── Dismiss / Pin / Share buttons
```

**11B: Insight Categories — Full Spec**

```
Category 1: SPRINT HEALTH INSIGHTS
├── Burndown trajectory analysis ("At current pace, 8 of 24 items won't complete")
├── Scope creep detection ("Sprint expanded 35% after Day 3 — this is the 3rd consecutive sprint")
├── WIP limit breach ("6 items in-progress simultaneously — recommended max is 3 per dev")
├── Blocked item age ("Item #4521 has been blocked for 4 days — no movement detected")
└── Sprint goal risk ("Sprint goal references Feature X, but 0 of 5 related stories are In Progress")

Category 2: RESOURCE INTELLIGENCE INSIGHTS  
├── Overload detection ("Ananya has 7 active items — 2.3x team average. Burnout signal.")
├── Underutilization detection ("Karan has 0 items closed in 5 days — capacity being wasted or blocked")
├── Estimation bias ("Devs consistently underestimate by 28% — recalibrate planning poker baseline")
├── Collaboration gap ("Only 2 of 8 devs are participating in code reviews — knowledge silo risk")
├── Star dependency ("3 of 5 critical path items are assigned to 1 person — single point of failure")
└── Velocity inconsistency ("Resource X delivers 12 pts one sprint, 3 pts the next — investigate workload balance")

Category 3: QA INTELLIGENCE INSIGHTS
├── Test coverage gap ("24 stories closed this sprint, only 14 have linked test cases — 42% untested")
├── Defect injection by module ("Payment module has 67% of all defects — architecture or ownership issue")
├── Reopen pattern ("Bug #3341 reopened 3 times — root cause likely not addressed")
├── Late testing squeeze ("70% of stories reached QA in the last 3 days of the sprint — compression risk")
├── Defect escape rate ("2 production incidents traced to this sprint — regression coverage insufficient")
└── QA capacity mismatch ("8 stories in QA queue, 1 QA resource — expected backlog of 3 days")

Category 4: PR & CODE INSIGHTS
├── Long-lived PR detection ("PR #892 open for 72 hours — blocking downstream work")
├── Review bottleneck ("90% of PR reviews are done by 2 of 8 devs — bus factor risk")
├── Large PR anti-pattern ("4 PRs this sprint exceeded 500 lines — high review burden, split recommended")
├── Build flakiness signal ("Pipeline pass rate dropped from 94% to 71% — unstable test suite")
├── Branch proliferation ("14 stale branches older than 2 sprints — cleanup needed")
└── Merge conflict hotspot ("3 PRs this week conflicted on the same files — coordinate or refactor")

Category 5: TREND & PREDICTIVE INSIGHTS
├── Velocity trajectory prediction ("Based on last 5 sprints, next sprint velocity: 42±6 points")
├── Burnout early warning ("Avg overtime signal increasing for 3rd consecutive sprint — team fatigue risk")
├── Quality trend forecast ("Defect density increasing 12% sprint-over-sprint — will breach threshold in Sprint N+2")
├── Carry-over compound risk ("Carry-over growing each sprint — by Sprint 6 you may carry 30% of backlog")
├── Team performance seasonality ("This team consistently dips in Q4 — plan for 15% velocity reduction")
└── Feature completion forecast ("At current pace, Feature Y will complete in Sprint N+3, not N+1 as planned")

Category 6: QUARTER-LEVEL STRATEGIC INSIGHTS
├── OKR progress assessment ("You've delivered 68% of planned Q3 story points — 14 sprints remaining")
├── Technical debt accumulation ("Tech-debt-tagged items have tripled since Q1 — plan a debt sprint")
├── Team growth signal ("New team members ramping — expect velocity dip for 1-2 sprints then +20%")
├── Process improvement detection ("Cycle time improved 22% after adopting daily standups in Sprint 8")
├── Cross-team dependency risk ("Team B is blocked on Team A for 3 quarter items — escalation needed")
└── Quarter forecast ("If trends hold, Q3 will deliver 87% of committed scope — adjust roadmap accordingly")
```

**11C: AI Retrospective Chat — Enhanced**

The chat panel (accessible from any view) is powered by the configured LLM with full sprint + quarter data injected as context.

```
Suggested starter prompts (shown as quick-tap chips):
├── "Why did we miss the sprint goal?"
├── "Who is most at risk of burnout?"
├── "What should we stop doing as a team?"
├── "Which feature area has the worst quality?"
├── "Write a 5-sentence sprint review for my stakeholders"
├── "Compare this sprint to our best sprint"
├── "What's our biggest delivery risk next sprint?"
├── "Which resources should I redistribute work from?"
├── "Summarize Q3 progress for the exec team"
└── "What is the #1 thing we should fix before the next quarter?"

Chat features:
├── Full sprint + quarter data injected as system context automatically
├── LLM provider + model shown in chat header (e.g., "Powered by Groq / llama-3.3-70b")
├── Streaming responses with typing indicator
├── Copy response button per message
├── "Add to Report" button → pins message to report draft
├── Follow-up suggestions after each response
└── Chat history persisted for the session
```

**11D: AI Insight Configuration**

```
Insight Settings (in AI Settings panel):
├── Insight depth: Surface | Standard | Deep (controls prompt verbosity)
├── Tone: Executive | Technical | Coaching
├── Auto-generate insights on: Data load | Sprint change | Manual trigger
├── Insight categories to enable/disable (toggle each category)
├── Minimum confidence threshold (hide insights below X% confidence)
├── Language for insights (default: English)
└── Include benchmarks: Compare against industry averages (toggle)
```

---



```
Handle gracefully:
├── PAT expired or insufficient scope → specific error + scope requirements
├── Rate limiting (429) → exponential backoff with user notification
├── Empty sprint (no items) → "No work items found" state with suggestions
├── Team with no capacity set → flag and show warning
├── Work items with null assignee → group under "Unassigned"
├── Sprints with no start/end date → allow but warn
├── Repos with no PRs → show "No PR activity" gracefully
├── Build API permission denied → hide builds section, show note
├── Network timeout → retry with progress indicator
└── Large datasets (500+ items) → paginate + progressive loading
```

---

## PERFORMANCE REQUIREMENTS

```
Targets:
├── Initial data load: < 3 seconds for standard sprint (50-100 items)
├── Filter apply: < 500ms (client-side where possible)
├── Chart render: < 200ms after data ready
├── AI insight generation: < 8 seconds (stream response)
├── Export generation: < 5 seconds
├── API calls: Batch where possible, parallel where safe
└── Pagination: 200 items per batch, parallel batches
```

---

## SECURITY REQUIREMENTS

```
MUST implement:
├── PAT never stored in localStorage, sessionStorage, or any persistence layer
├── PAT held only in encrypted memory (React state / Zustand with no persist)
├── All API calls proxied through BFF (if deploying server-side)
├── No PAT in URL query strings
├── No PAT in console logs or error messages
├── Session timeout: Clear PAT after 8 hours of inactivity
├── Warning: "PAT will be cleared when tab closes — this is by design"
└── No telemetry or analytics calls that could leak org/project names
```

---

## DELIVERABLES CHECKLIST

```
Phase 1 — Core (Week 1-2):
[ ] AzDO Authentication + Connection Flow
[ ] LLM Configuration Panel (Groq default + all 6 providers)
[ ] Project/Team/Sprint Discovery
[ ] Sprint Data Fetch (Work Items + Capacity)
[ ] Sprint Overview Dashboard (KPIs + Burndown)
[ ] Basic Resource Table
[ ] Persistent AI Agent Panel shell (UI, toggle, context injection)

Phase 2 — Analytics (Week 3-4):
[ ] Developer View with PR Integration
[ ] QA View with Test Integration
[ ] Resource Workload Heatmap + Radar Charts
[ ] Tag Intelligence Engine
[ ] Multi-Sprint Trend Charts
[ ] AI Agent — Sprint Q&A live (basic question answering)
[ ] AI Agent — Push results (Pin, Copy, Add to Action Board)

Phase 3 — AI Intelligence (Week 5-6):
[ ] Full AI Insight Engine (all 6 categories, streaming cards)
[ ] Risk Detection Engine
[ ] Action Plan Board (Kanban-style, AI-generated cards)
[ ] AI Agent — Full quick prompt chips
[ ] AI Agent — Structured output generation (summaries, retro, standup)
[ ] AI Agent — "Add to Report" integration
[ ] AI Tag Classification
[ ] Quarter Intelligence Dashboard (Sections A–D)

Phase 4 — Reports + Quarter (Week 7-8):
[ ] Report Builder UI (left panel + preview + right controls)
[ ] All 7 report templates
[ ] AI section generation (streaming, accept/regenerate/edit)
[ ] Export: PDF + PPTX + Excel + Markdown + HTML + Email
[ ] Report History (last 10 in session)
[ ] Quarter Health Scorecard + Sprint-over-Sprint Charts
[ ] Quarter Resource Leaderboard + AI badges
[ ] Quarter Retrospective + Planning Assistant
[ ] Multi-team Quarter Comparison

Phase 5 — Polish (Week 9-10):
[ ] Command Palette (Cmd+K)
[ ] Shareable Filter Links
[ ] Dark/Light theme toggle
[ ] LLM fallback + session usage tracker
[ ] Performance optimization (pagination, parallel fetches)
[ ] Mobile-responsive layout
[ ] Scheduled Reports spec (architecture only, UI stub)
[ ] Confluence / Slack distribution stubs (MCP-ready)
```

---

## EXAMPLE COMPONENT SCAFFOLDING

### App Entry Point

```typescript
// App.tsx
import { ConnectionWizard } from './modules/connection/ConnectionWizard'
import { SprintDashboard } from './modules/dashboard/SprintDashboard'
import { useConnectionStore } from './store/connectionStore'

export default function App() {
  const { isConnected } = useConnectionStore()
  return isConnected ? <SprintDashboard /> : <ConnectionWizard />
}
```

### Connection Store

```typescript
// store/connectionStore.ts
import { create } from 'zustand'

interface ConnectionState {
  pat: string | null
  orgUrl: string | null
  isConnected: boolean
  selectedProject: string | null
  selectedTeam: string | null
  selectedSprint: string | null
  connect: (pat: string, orgUrl: string) => Promise<void>
  disconnect: () => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  pat: null,
  orgUrl: null,
  isConnected: false,
  selectedProject: null,
  selectedTeam: null,
  selectedSprint: null,
  connect: async (pat, orgUrl) => {
    // Validate PAT + fetch initial projects
    set({ pat, orgUrl, isConnected: true })
  },
  disconnect: () => set({ pat: null, orgUrl: null, isConnected: false })
}))
```

### AzDO API Service

```typescript
// services/azdo.service.ts
export class AzdoService {
  private headers: HeadersInit

  constructor(private orgUrl: string, pat: string) {
    this.headers = {
      'Authorization': `Basic ${btoa(`:${pat}`)}`,
      'Content-Type': 'application/json'
    }
  }

  async getProjects() { /* ... */ }
  async getTeams(project: string) { /* ... */ }
  async getIterations(project: string, team: string) { /* ... */ }
  async getSprintWorkItems(project: string, team: string, iterationId: string) { /* ... */ }
  async getWorkItemDetails(ids: number[]) { /* ... */ }
  async getTeamCapacity(project: string, team: string, iterationId: string) { /* ... */ }
  async getPullRequests(project: string, repoId: string, from: Date, to: Date) { /* ... */ }
  async getBuilds(project: string, from: Date, to: Date) { /* ... */ }
  async getTestRuns(project: string, from: Date, to: Date) { /* ... */ }
}
```

---

*End of Prompt — Sprint Pulse v3.0 | Enterprise Edition*
*Designed for Antigravity IDE | Multi-LLM Intelligence (Groq / Anthropic / OpenAI / Gemini / Mistral / Ollama) | AzDO REST API v7.1*
*Covers: Sprint Analytics · Quarter Intelligence · Resource Performance · QA Health · PR Insights · AI Tag Engine · Persistent AI Agent · Full Reporting Engine*

---

# 🚦 Implementation Progress Tracker
> Last Updated: 2026-04-26 19:35 IST | App Name: **Sprint Pulse**

> ⚡ **Maintenance Rule:** This tracker is updated automatically by Antigravity AI after every code change — additions, modifications, and removals are all logged in the Changelog below.

---

## 📋 Changelog

| Date | Type | Description |
|------|------|-------------|
| 2026-04-26 | 🔍 Audit | Full code audit against tracker — corrected 3 undocumented features: PBI Backlog table, Sprint selector, Dev task cap |
| 2026-04-26 | 🆕 Added | Module 4C: Resource Efficiency Radar — context-aware (Dev vs QA) |
| 2026-04-26 | 🆕 Added | Module 5: Developer Intelligence page (`/developer` route) |
| 2026-04-26 | 🆕 Added | Module 9D: Persistent AI Agent Panel (floating chat, SSE streaming) |
| 2026-04-26 | 🔧 Fixed | SSE streaming parser in `llm.service.ts` — was rendering raw JSON chunks, now parses `delta.content` correctly |
| 2026-04-26 | 🔧 Modified | Resource Analytics table: replaced SP Assigned/SP Done with **Est. Hours / Logged Hours** |
| 2026-04-26 | 🆕 Added | Overrun/Underrun arrow indicators (🔴↓ / 🟢↑) next to Logged Hours in Resource Table |
| 2026-04-26 | 🔧 Modified | Developer selector dropdown: improved dark-mode contrast (bold white text, indigo icon, focus ring) |
| 2026-04-26 | 🔧 Modified | Efficiency Radar: QA members now get QA-specific axes (Test Execution, Defects Found, Test Coverage) |
| 2026-04-26 | 🔧 Modified | Efficiency Radar: color theme is **Indigo** for Dev, **Emerald** for QA |
| 2026-04-26 | ✏️ Renamed | App renamed from **Sprint Sentinel** → **Sprint Pulse** across all UI, system prompts, and onboarding |
| 2026-04-26 | 🗑️ Removed | Work Item Composition pie chart (redundant, cleaned from Sprint Charts) |
| 2026-04-26 | 🔧 Fixed | Bottleneck Flow insight text clipping — separated chart height from text block using flex-column layout |
| 2026-04-26 | 🔧 Modified | LLM Test Connection: now locks to "Connected" state permanently until API key or provider changes |
| 2026-04-26 | 🔧 Modified | Resource Analytics: replaced tag-based filtering with native `Microsoft.VSTS.Common.Activity` field |
| 2026-04-26 | 🗑️ Removed | Unplanned filter option from Resource Analytics (no Activity field for unplanned tasks) |

---

## ✅ COMPLETED

### Module 1 — Authentication & Connection Layer
- [x] PAT-based secure connection to Azure DevOps
- [x] Organization URL + Project + Team selection wizard
- [x] Multi-step onboarding flow with glassmorphism styling
- [x] Animated connection status indicator (grey → amber → green)
- [x] Secure in-memory PAT storage (never persisted to localStorage)
- [x] Sprint / Iteration selector with live data fetch

### Module 1B — LLM Configuration Panel
- [x] AI Settings drawer (right-side panel, 420px wide)
- [x] Provider support: **Groq** (default), Anthropic, OpenAI, Google Gemini, Mistral, Ollama
- [x] API Key input with masked display per provider
- [x] Model selection dropdown per provider
- [x] Temperature slider and max tokens input
- [x] Streaming toggle (on by default)
- [x] "Test Connection" with persistent **Connected** state (does not reset until API key changes)
- [x] Streaming SSE parser — properly decodes token chunks from Groq/OpenAI/Anthropic/Ollama
- [x] Session-only key storage (cleared on tab close)

### Module 3 — Sprint Overview Dashboard (Executive View)
- [x] Sprint Health Scorecard (animated metric tiles)
- [x] KPI tiles: Total Items, Done, In Progress, Not Started, Story Points, Spilled, Removed (with clickable drill-down)
- [x] Sprint Delivery Burndown Chart (Ideal vs Actual — animated area chart, hours mode, 100% width)
- [x] Task Bottleneck Flow visualization (state-based progression with insight text)
- [x] ~~Work Item Composition pie chart~~ — **Removed** (redundant)
- [x] **Sprint Selector dropdown** in dashboard header (switch between all sprint iterations)
- [x] **Active Product Backlog table** — expandable parent/child PBI rows with state pills, assignee avatars, story points, task child count

### Module 4 — Resource Analytics
#### 4A: Resource Summary Table
- [x] Dynamic resource table built from Azure DevOps task assignments
- [x] Activity-field based discipline filtering: **Developers / Testers / Automation**
- [x] Columns: Member, Assigned, Done, In Progress, Not Started, **Est. Hours**, **Logged Hours** (with ↑↓ overrun arrows), Completion %, Avg Lead Time, Overruns
- [x] Sortable column headers (multi-direction)
- [x] CSV Export with correct data mapping
- [x] Expandable rows showing assigned task breakdown (split layout: tasks left, Radar right)

#### 4C: Resource Efficiency Radar
- [x] Hexagonal radar chart embedded in expanded row detail
- [x] **Context-aware role detection**: automatically switches axes for Developer vs QA
  - **Developer axes**: Task Completion, SP Delivery, Cycle Time, Overrun Safety, PR Merge, Review Participation
  - **QA axes**: Task Completion, Test Execution, Cycle Time, Overrun Safety, Defects Found, Test Coverage
- [x] Color theme: **Indigo** for Developers, **Emerald** for QA
- [x] Tooltip on hover with score/100 display

### Module 5 — Developer-Specific View
- [x] Dedicated `/developer` route & sidebar nav link ("Dev Intelligence")
- [x] Developer selector dropdown (dark-mode optimised — bold white text, indigo icon, focus ring)
- [x] Developer list auto-filtered by `Activity` field; fallback to all task assignees
- [x] **Panel 1**: Task Intelligence — assigned task list with status indicators
- [x] Capacity Burn bar (Est. Hours vs Logged Hours with overrun % visual)
- [x] Task list shows top 5 tasks with state, estimated vs actual hours, overrun highlighting (red) ⚠️ *capped at 5 — expand in future*
- [x] **Panel 2**: Code Intelligence placeholder (PR Merged, Code Reviews — simulated data, ready for Git API hookup)
- [x] **Panel 3**: AI synthesized developer insight with estimation accuracy flag

### Module 9D — Persistent AI Agent Panel
- [x] Floating Brain icon button (bottom-right, always visible across all screens)
- [x] Slide-out chat drawer (400px wide, right-anchored, smooth animation)
- [x] Live sprint context injection (auto-bundles all work items into system prompt JSON)
- [x] Streaming chat support (SSE-based token streaming — fixed raw JSON rendering bug)
- [x] Quick-action prompt chips (pre-built query buttons)
- [x] Typing animation with bouncing dots
- [x] User/Bot message bubbles with role-specific styling
- [x] AI persona: **Sprint Pulse** AI Assistant

---

## 🟡 IN PROGRESS / PARTIALLY DONE

### Module 5 — Developer View (Remaining Panels)
- [ ] **Panel 4**: Action Recommendations (Suggested SP cap, flagged items, pairing suggestions, risk flags)
- [ ] PR & Git API integration (requires Azure Repos REST hookup)
- [ ] Build Pipeline Pass Rate

---

## ❌ PENDING (Not yet started)

### Module 2 — Global Filter System
- [ ] Persistent top/sidebar filter bar
- [ ] URL-querystring-serializable filters (shareable links)
- [ ] Save Filter Presets with named presets
- [ ] Date range override picker

### Module 3C — Work Item Distribution
- [ ] Treemap: Items by Feature/Epic (sized by story points)
- [ ] State Flow Sankey diagram
- [ ] Tag Cloud (sized by frequency)

### Module 4B — Resource Workload Heatmap
- [ ] Calendar heatmap (X: Sprint Days, Y: Team Members, Color: Load level)
- [ ] Green / Amber / Red / Grey load color coding

### Module 6 — QA-Specific View
- [ ] Test Case Execution Intelligence (Assigned vs Executed vs Passed/Failed)
- [ ] Defect Severity Breakdown (Critical/High/Medium/Low stacked bar)
- [ ] Bug Trend Line (daily new bugs vs closures)
- [ ] Defect Age Distribution
- [ ] QA Efficiency Radar per tester
- [ ] AI QA Insights generation (narrative insights for QA leads)
- [ ] QA Action Plans panel

### Module 7 — AI Tag Intelligence
- [ ] Tag Frequency Map (treemap / word cloud)
- [ ] Tags by Outcome (on-time vs overrun vs carry-over correlation)
- [ ] Tag Co-occurrence Matrix
- [ ] Tag Trend Over Sprints
- [ ] AI Tag Classification (Technical Debt / Blocked / Scope Change / Risk / Quick Win)

### Module 8 — Sprint Comparison & Trend View
- [ ] Multi-Sprint velocity trend chart (line chart)
- [ ] Sprint-over-Sprint comparison table
- [ ] Carry-over trend analysis
- [ ] Predictability Score

### Module 9A — Sprint Health Narrative
- [ ] Auto-generated 3-5 paragraph executive summary
- [ ] On-demand or post-sprint trigger

### Module 9B — Risk Detection
- [ ] Auto-detect stale items (no activity 2+ days)
- [ ] Flag zero-estimate items
- [ ] Flag resources at >120% capacity
- [ ] PRs open >48 hours detection

### Module 9C — AI Action Plan Generator
- [ ] Action Plan card generation per risk
- [ ] Owner suggestion + deadline + expected outcome

### Module 10 — Reporting & Export
- [ ] PDF Sprint Report generation (jsPDF)
- [ ] Excel export (xlsx)
- [ ] Scheduled report cadence

---

## 🔧 Technical Debt / Quality Items
- [ ] Code-split heavy bundle (currently ~857KB minified) using dynamic import()
- [ ] PR & Git API service implementation (Azure Repos REST)
- [ ] QA Test Runs API integration (Azure Test Plans REST)
- [ ] Radar Chart — replace simulated PR/Review placeholder data with live Git data
- [ ] Radar Chart — replace QA Defects/Coverage placeholder data with live Test Plan data

---

*Progress tracker maintained by Antigravity AI — Sprint Pulse v3.0*
*⚠️ This file is updated automatically after every code change.*


---

## ✅ COMPLETED

### Module 1 — Authentication & Connection Layer
- [x] PAT-based secure connection to Azure DevOps
- [x] Organization URL + Project + Team selection wizard
- [x] Multi-step onboarding flow with glassmorphism styling
- [x] Animated connection status indicator (grey → amber → green)
- [x] Secure in-memory PAT storage (never persisted to localStorage)
- [x] Sprint / Iteration selector with live data fetch

### Module 1B — LLM Configuration Panel
- [x] AI Settings drawer (right-side panel, 420px wide)
- [x] Provider support: **Groq** (default), Anthropic, OpenAI, Google Gemini, Mistral, Ollama
- [x] API Key input with masked display per provider
- [x] Model selection dropdown per provider
- [x] Temperature slider and max tokens input
- [x] Streaming toggle (on by default)
- [x] "Test Connection" with persistent **Connected** state (does not reset until API key changes)
- [x] Streaming SSE parser — properly decodes token chunks from Groq/OpenAI/Anthropic/Ollama
- [x] Session-only key storage (cleared on tab close)

### Module 3 — Sprint Overview Dashboard (Executive View)
- [x] Sprint Health Scorecard (animated metric tiles)
- [x] KPI tiles: Total Items, Done, In Progress, Not Started, Story Points
- [x] Sprint Delivery Burndown Chart (Ideal vs Actual — animated area chart) — 100% width
- [x] Task Bottleneck Flow visualization (state-based progression with insight text)
- [x] Work Item Distribution (removed redundant Composition pie chart for cleaner view)

### Module 4 — Resource Analytics
#### 4A: Resource Summary Table
- [x] Dynamic resource table built from Azure DevOps task assignments
- [x] Activity-field based discipline filtering: **Developers / Testers / Automation**
- [x] Columns: Member, Assigned, Done, In Progress, Not Started, **Est. Hours**, **Logged Hours** (with ↑/↓ overrun arrows), Completion %, Avg Lead Time, Overruns
- [x] Sortable column headers (multi-direction)
- [x] CSV Export with correct data mapping
- [x] Expandable rows showing assigned task breakdown

#### 4C: Resource Efficiency Radar
- [x] Hexagonal radar chart embedded in expanded row detail
- [x] **Context-aware role detection**: automatically switches axes for Developer vs QA
  - **Developer axes**: Task Completion, SP Delivery, Cycle Time, Overrun Safety, PR Merge, Review Participation
  - **QA axes**: Task Completion, Test Execution, Cycle Time, Overrun Safety, Defects Found, Test Coverage
- [x] Color theme: **Indigo** for Developers, **Emerald** for QA
- [x] Tooltip on hover with score/100 display

### Module 5 — Developer-Specific View (Panel 1 complete)
- [x] Dedicated `/developer` route & sidebar nav link ("Dev Intelligence")
- [x] Developer selector dropdown (styled for dark mode — bold, high-contrast)
- [x] **Panel 1**: Task Intelligence — assigned task list with status indicators
- [x] Capacity Burn bar (Est. Hours vs Logged Hours with overrun % visual)
- [x] Task list with state indicators, estimated vs actual hours and overrun highlighting
- [x] **Panel 2**: Code Intelligence placeholder (PR Merged, Code Reviews — ready for Git API hookup)
- [x] **Panel 3**: AI synthesized developer insight with estimation accuracy flag

### Module 9D — Persistent AI Agent Panel
- [x] Floating Brain icon button (bottom-right, always visible across all screens)
- [x] Slide-out chat drawer (400px wide, right-anchored)
- [x] Live sprint context injection (auto-bundles all work items into system prompt)
- [x] Streaming chat support (SSE-based token streaming)
- [x] Quick-action prompt chips (pre-built query buttons)
- [x] Typing animation with bouncing dots
- [x] User/Bot message bubbles with role-specific styling
- [x] AI persona: **Sprint Pulse** AI Assistant

---

## 🟡 IN PROGRESS / PARTIALLY DONE

### Module 4B — Resource Workload Heatmap
- [ ] Calendar heatmap (X: Sprint Days, Y: Team Members, Color: Load level)
- [ ] Green / Amber / Red / Grey load color coding

### Module 5 — Developer View (Remaining Panels)
- [ ] **Panel 4**: Action Recommendations (Suggested SP cap, flagged items, pairing suggestions, risk flags)
- [ ] PR & Git API integration (requires Azure Repos webhook / REST endpoint)
- [ ] Build Pipeline Pass Rate

---

## ❌ PENDING (Not yet started)

### Module 2 — Global Filter System
- [ ] Persistent top/sidebar filter bar
- [ ] URL-querystring-serializable filters (shareable links)
- [ ] Save Filter Presets with named presets
- [ ] Date range override picker

### Module 3C — Work Item Distribution (partial)
- [ ] Treemap: Items by Feature/Epic (sized by story points)
- [ ] State Flow Sankey diagram
- [ ] Tag Cloud (sized by frequency)

### Module 4B — Resource Workload Heatmap
- [ ] Full implementation

### Module 6 — QA-Specific View
- [ ] Test Case Execution Intelligence (Assigned vs Executed vs Passed/Failed)
- [ ] Defect Severity Breakdown (Critical/High/Medium/Low stacked bar)
- [ ] Bug Trend Line (daily new bugs vs closures)
- [ ] Defect Age Distribution
- [ ] QA Efficiency Radar per tester
- [ ] AI QA Insights generation (narrative insights for QA leads)
- [ ] QA Action Plans panel

### Module 7 — AI Tag Intelligence
- [ ] Tag Frequency Map (treemap / word cloud)
- [ ] Tags by Outcome (on-time vs overrun vs carry-over correlation)
- [ ] Tag Co-occurrence Matrix
- [ ] Tag Trend Over Sprints
- [ ] AI Tag Classification (Technical Debt / Blocked / Scope Change / Risk / Quick Win)

### Module 8 — Sprint Comparison & Trend View
- [ ] Multi-Sprint velocity trend chart (line chart)
- [ ] Sprint-over-Sprint comparison table
- [ ] Carry-over trend analysis
- [ ] Predictability Score

### Module 9A — Sprint Health Narrative
- [ ] Auto-generated 3-5 paragraph executive summary
- [ ] On-demand or post-sprint trigger

### Module 9B — Risk Detection
- [ ] Auto-detect stale items (no activity 2+ days)
- [ ] Flag zero-estimate items
- [ ] Flag resources at >120% capacity
- [ ] PRs open >48 hours detection

### Module 9C — AI Action Plan Generator
- [ ] Action Plan card generation per risk
- [ ] Owner suggestion + deadline + expected outcome

### Module 10 — Reporting & Export
- [ ] PDF Sprint Report generation (jsPDF)
- [ ] Excel export (xlsx)
- [ ] Scheduled report cadence

---

## 🔧 Technical Debt / Quality Items
- [ ] Code-split heavy bundle (currently ~857KB minified) using dynamic import()
- [ ] PR & Git API service implementation (Azure Repos REST)
- [ ] QA Test Runs API integration (Azure Test Plans REST)
- [ ] Radar Chart — replace simulated PR/Review placeholder data with live Git data
- [ ] Radar Chart — replace QA Defects/Coverage placeholder data with live Test Plan data

---

*Progress tracker maintained by Antigravity AI — Sprint Pulse v3.0*

