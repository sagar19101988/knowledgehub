# SprintLens Enterprise

Dynamic LLM Architecture for Azure DevOps sprint analysis. This platform lets you plug in your AzDO organization, select from 7+ LLM providers (OpenAI, Anthropic, Google, Mistral, Ollama, etc.), and instantly analyze team velocity, bottlenecks, and generate executive reports.

## Features

- **Unified LLM Gateway:** Swap models on the fly.
- **Deep Analyzer:** Find root causes for sprint delays and generate plain-English narratives.
- **AI Agent Chat:** Chat directly with your sprint data.
- **Auto Reports:** Generate branded QBRs and sprint retros.

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, Tailwind CSS v4, shadcn/ui.
- **State & Data Fetching:** Zustand, TanStack Query, React Hook Form + Zod.
- **Charts:** Recharts + D3.js.
- **AI:** Vercel AI SDK v4 (supported providers: Anthropic, OpenAI, Google, Mistral, Ollama, Groq).
- **Backend:** Next.js API Routes.
- **Storage/Auth:** Supabase, NextAuth.js.

## Local Setup

1. **Clone and Install:**
   ```bash
   git clone ...
   cd sprintlens
   npm install
   ```

2. **Environment Variables:**
   Rename `.env.example` to `.env.local` and add your keys:
   ```env
   # Database & Auth
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   NEXTAUTH_SECRET=...

   # LLM Providers (Add what you need)
   GROQ_API_KEY=...
   OPENAI_API_KEY=...
   ANTHROPIC_API_KEY=...
   GOOGLE_GENAI_API_KEY=...
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel + GitHub Actions)

SprintLens Enterprise is optimized for Vercel. 
1. Push your repository to GitHub.
2. Connect the repository in Vercel.
3. Configure the Production Environment Variables in Vercel Settings.
4. Auto-deployments will trigger on merges to the `main` branch.
