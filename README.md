# EduX — Teacher-Parent Communication Platform

Hackathon prototype bridging teachers and parents at Riverside Primary School via AI-powered dashboards and chat.

## Quick Start

**Requirements:** Node.js 18+, pnpm

```bash
# 1. Clone
git clone https://github.com/UreyuR1/EduX.git
cd EduX

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env and fill in LLM_API_KEY (ask a teammate)

# 4. Run
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

> No database or Docker required — all data is pre-loaded from mock JSON files.

## Demo Walkthrough

Switch users via the dropdown in the top-right corner.

| Step | User | Path | What to show |
|------|------|------|--------------|
| 1 | Li Wei (Parent) | `/parent/dashboard` | Course cards, weekly focus, performance labels |
| 2 | Li Wei (Parent) | `/parent/chat` | Ask "What is my child learning in maths?" → streaming AI answer → switch to Chinese |
| 3 | Ms. Sarah Chen (Teacher) | `/teacher/dashboard` | Feedback completion rate, fraction difficulty insight, attention list |
| 4 | Ms. Sarah Chen (Teacher) | `/teacher/chat` | Proactive insight greeting → ask to draft parent message |
| 5 | Ms. Sarah Chen (Teacher) | `/teacher/dashboard` | Click "Draft parent message" on InsightCard → edit → Publish |
| 6 | Li Wei (Parent) | `/parent/dashboard` | Refresh → see teacher's published message under "This Week" |

## Project Structure

```
apps/web/          # Next.js 14 frontend + API routes
services/ai/       # Python FastAPI AI microservice (optional for demo)
mock-data/         # Pre-seeded JSON data (courses, feedback, insights)
```

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui (Base UI)
- **AI:** OpenAI-compatible API (CurricuLLM-AU when available)
- **Auth:** Mock role switcher (no login required)
- **Data:** JSON mock data, in-memory stores
