# SyncEdu — Teacher-Parent Communication Platform

Hackathon prototype bridging teachers and parents at EduX Primary School via AI-powered dashboards, multilingual support, and curriculum-aligned chat.

Built for the **CurricuLLM Hackathon** · Australian Curriculum v9.0 (ACARA)

---

## Quick Start (macOS / Linux)

### 1. Install Node.js 20 (LTS)

```bash
# Via nvm (recommended)
nvm install 20
nvm use 20

# Or via Homebrew
brew install node@20
```

### 2. Install pnpm

```bash
npm install -g pnpm
```

### 3. Clone and install dependencies

```bash
git clone https://github.com/UreyuR1/EduX.git
cd EduX
pnpm install
```

### 4. Set up environment variables

```bash
cp apps/web/.env.example apps/web/.env
```

Then open `apps/web/.env` and fill in your API key:

```env
LLM_API_KEY=your-curricullm-api-key-here   # required — ask a teammate
LLM_BASE_URL=https://api.curricullm.com     # default, keep as-is
LLM_MODEL=CurricuLLM-AU                     # default, keep as-is
```

> The other variables (`AI_SERVICE_URL`, `DATABASE_URL`) can be left at their defaults for local development — the app runs entirely on mock JSON data without any database or external microservice.

### 5. Run the dev server

```bash
# From the repo root:
pnpm dev

# Or directly from the web app:
cd apps/web && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** `package.json` contains `db:*` scripts (Prisma) — these are **not needed** for local development or demo. The app uses pre-loaded JSON mock data in `mock-data/`.

---

## Demo Users

| User | Role | Language | Courses |
|------|------|----------|---------|
| Li Wei | Parent | 中文 | Year 5 Maths, Year 5 English |
| Emma Thompson | Parent | English | Year 5 Maths, Year 5 English |
| Priya Sharma | Parent | हिन्दी | Year 5 Maths, Year 5 English, Year 6 Science |
| Ms. Sarah Chen | Teacher | English | Year 5 Maths, Year 5 English |
| Mr. James Nguyen | Teacher | English | Year 6 Science |

Switch users at any time via the dropdown in the top-right corner.

---

## Demo Walkthrough

### Loop 1 — Parent sees curriculum-aligned learning focus

| Step | User | What to show |
|------|------|--------------|
| 1 | Li Wei (Parent) | Switch language to 中文 → entire UI translates (course names stay in English) |
| 2 | Li Wei (Parent) | Weekly Focus card shows ACARA code (AC9M5N04) + Chinese activity text |
| 3 | Li Wei (Parent) | Click course card → full syllabus in Chinese with ACARA codes per week |
| 4 | Li Wei (Parent) | Pre-seeded chat: Li Wei already chatted about fraction difficulty |

### Loop 2 — Parent concern surfaces to teacher

| Step | User | What to show |
|------|------|--------------|
| 5 | Ms. Sarah Chen (Teacher) | Feedback Overview → "fraction-difficulty" is the top tag |
| 6 | Teacher Dashboard | Attention List shows students whose parents raised concerns |
| 7 | Teacher Dashboard | Insights panel → click "Draft Message" → AI generates parent message |
| 8 | Teacher Dashboard | Publish the message |
| 9 | Li Wei (Parent) | Refresh → teacher's published message appears under "This Week's Focus" |

### Loop 3 — Multilingual AI chat

| Step | User | What to show |
|------|------|--------------|
| 10 | Priya Sharma (Parent) | UI auto-displays in Hindi |
| 11 | Priya Sharma (Parent) | Type any question → AI responds in Hindi automatically |
| 12 | Emma Thompson (Parent) | Switch between Maths / English tabs → separate chat histories per course |

---

## Key Features

- **Multilingual UI** — English, 中文, हिन्दी; AI chat auto-matches parent's language
- **ACARA Curriculum Codes** — displayed on course cards, weekly focus, and syllabus week headings
- **Weekly Learning Focus** — translated activity suggestions for parents to try at home
- **Pre-seeded Demo Chats** — realistic parent conversations that feed the teacher feedback loop
- **Teacher Insights** — aggregated feedback → AI-generated action items → one-click parent message drafts
- **Resizable Chat Panel** — drag to resize the AI assistant panel on both portals

---

## Project Structure

```
apps/web/               Next.js frontend + API routes
  src/app/              Pages (parent dashboard, teacher dashboard, API)
  src/components/       UI components (CourseCard, WeeklyFocus, ChatWindow, …)
  src/hooks/            useChat (localStorage persistence, streaming)
  src/lib/              i18n, mock-data loader, auth, demo-chat-history
mock-data/              Pre-seeded JSON (courses, feedback, insights, users)
  syllabus/             Markdown syllabi — English + 中文 + हिन्दी variants
services/ai/            Python FastAPI AI microservice (optional)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| UI | Tailwind CSS v4, shadcn/ui |
| AI | CurricuLLM API (OpenAI-compatible, streams SSE) |
| i18n | Custom `t(key, language)` with en / zh / hi |
| Auth | Mock role switcher — no login required |
| Data | JSON mock files, in-memory stores, localStorage chat |

---

## Environment Variables

```env
# Required
LLM_API_KEY=                    # CurricuLLM API key
LLM_BASE_URL=                   # Default: https://api.curricullm.com
LLM_MODEL=                      # Default: CurricuLLM-AU

# Optional (not needed for local dev / demo)
AI_SERVICE_URL=                 # Python FastAPI microservice
NEXT_PUBLIC_AI_SERVICE_URL=     # Client-side AI service URL
DATABASE_URL=                   # PostgreSQL (app uses mock JSON by default)
```
