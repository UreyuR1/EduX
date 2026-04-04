# EduX Hackathon 2026 — Prototype Specification

## Challenge: More Accessible and Actionable Communication between Teachers and Parents

### Challenge Setter: CurricuLLM (Dan Hart)

---

## 1. Product Overview

Build a web-based platform that bridges the communication gap between teachers and parents. The platform has two user-facing portals (Teacher / Parent), each featuring a **dashboard** (passive information browsing) and a **chat window** (active AI-powered interaction). The AI layer is powered by the **CurricuLLM API** (mandatory requirement).

### Core Design Principles

- **Accessible**: Multi-language support, plain language, low barrier to entry
- **Actionable**: Every piece of information leads to a concrete action, not just data delivery
- **Lightweight for teachers**: Teachers should do *less* work, not more — data is imported from LMS, not manually entered
- **RAG-based grounding**: AI responses are strictly grounded in uploaded/imported data; if no relevant data exists, the system says so rather than hallucinating

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Web App)                │
│  ┌──────────────────┐    ┌────────────────────────┐ │
│  │  Teacher Portal   │    │    Parent Portal        │ │
│  │  - Dashboard      │    │    - Dashboard          │ │
│  │  - Chat Window    │    │    - Chat Window        │ │
│  └──────────────────┘    └────────────────────────┘ │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                   Backend / API Layer                │
│  - Auth & User Management                           │
│  - Data Ingestion (LMS import / file upload)        │
│  - RAG Pipeline (vector store + retrieval)          │
│  - Feedback Aggregation Engine                      │
│  - Weekly Push Generation                           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              CurricuLLM API (GenAI Layer)            │
│  - Curriculum translation (jargon → plain language) │
│  - RAG-based Q&A                                    │
│  - Chat summarisation & keyword extraction          │
│  - Feedback tag generation & sentiment analysis     │
│  - Actionable insight generation (data → insight)   │
│  - Proactive suggestions to teachers                │
└─────────────────────────────────────────────────────┘
```

---

## 3. Parent Portal

### 3.1 Dashboard

| Component | Description |
|-----------|-------------|
| **Course Overview** | List of child's current courses this semester |
| **Course Detail Card** | For each course: simplified syllabus (LLM-translated into plain language), teacher contact info, current week/total weeks progress indicator |
| **Performance Summary** | Per-course status displayed as descriptive labels (e.g. "Progressing well", "Needs extra attention: fractions"), NOT raw scores or rankings |
| **Weekly Learning Focus** (push) | Auto-generated each week: what the class is learning + 1-2 specific at-home activities parents can do (e.g. "This week: persuasive writing. Try asking your child to convince you why they should have pizza for dinner — in writing!") |

### 3.2 Chat Window

- **Role**: "Learning Advisor" — warm, encouraging, specific, multilingual
- **Powered by**: CurricuLLM API + RAG retrieval over teacher-uploaded data
- **Capabilities**:
  - Answer questions about child's course content, progress, and upcoming assessments
  - Explain curriculum concepts in plain language
  - Suggest specific at-home learning activities aligned with current teaching
  - Auto-detect language or allow parent to set language preference
- **Guardrails**:
  - Strictly RAG-grounded: only respond based on available data
  - If no relevant data exists, respond with: "I don't have information on that yet. You may want to ask [Teacher Name] directly."
  - Never fabricate grades, assessments, or teacher comments

### 3.3 Feedback Mechanism (embedded in chat flow)

- **Not** a separate push notification; appears naturally during/after chat interactions
- Quick-tap structured questions (2-3 max per session), e.g.:
  - "Did your child complete this week's learning activity?" → Done / Not yet / Partially
  - "What did your child find most challenging?" → [Topic A] / [Topic B] / [Topic C] / Other
- Optional voice input for open-ended feedback (especially for non-English-speaking parents)
- Frequency: appears when parent opens chat, **not** pushed daily — avoids fatigue

---

## 4. Teacher Portal

### 4.1 Dashboard

| Component | Description |
|-----------|-------------|
| **Course List** | All courses currently teaching |
| **Class Feedback Overview** | Aggregated parent feedback metrics: completion rates, high-frequency difficulty topics, sentiment trend |
| **Insight Cards** | AI-generated actionable insights in "data → therefore → suggestion" format. Example: *"42% of parents reported their child struggled with fraction division this week. Consider revisiting equivalent fractions before moving on — the pizza-slicing analogy worked well last term."* |
| **Students Needing Attention** | List of students where multiple feedback signals suggest difficulty (label: "may need extra support", NOT "at-risk") |
| **Parent Feedback Keywords** | Word cloud or tag summary extracted from parent chat conversations (anonymised) |

### 4.2 Chat Window

- **Role**: "Data Analysis Assistant" — concise, professional, action-oriented
- **Powered by**: CurricuLLM API + aggregated feedback data
- **Capabilities**:
  - Answer questions about parent feedback trends: "What were the most common keywords in parent chats this week?"
  - Suggest pedagogical actions: "Based on parent feedback about fractions, here are 3 approaches you could try next week..."
  - **Proactive prompting (key differentiator)**: The system can initiate conversation with the teacher, e.g.: "3 parents mentioned difficulty with reading comprehension this week. Would you like me to generate a parent-facing tip sheet on supporting reading at home?"
  - Teacher confirms or adjusts → system generates and pushes content to parents
- **Guardrails**:
  - Never expose individual parent conversations verbatim
  - Present aggregated, anonymised trends unless parent opts in to share specific feedback

### 4.3 Closing the Loop (Teacher → System → Parent)

1. Teacher sees insight on dashboard
2. Teacher clicks "Generate parent message" or chatbot proactively suggests one
3. System drafts a parent-facing message based on teacher's input + curriculum context
4. Teacher reviews/edits (optional) → confirms
5. Message pushed to parent portal as next week's learning focus

---

## 5. Feedback Intelligence System

### Layer 1: Structured Input (from parents)

- Quick-tap completion/difficulty indicators embedded in chat
- Optional voice input → transcribed → fed to LLM

### Layer 2: AI Insight Layer (core differentiator)

- **Per-conversation analysis**: Extract keywords, sentiment, pain points from each parent chat session
- **Cross-parent aggregation**: Identify common themes (e.g. "40% struggling with Topic X")
- **Tag generation**: Auto-label each parent's concerns (e.g. "reading-difficulty", "homework-confusion", "positive-feedback")
- **Output format**: Always "data → therefore → actionable suggestion", never raw data alone

### Layer 3: Teacher Dashboard (consumption layer)

- Completion rates, difficulty heatmaps, keyword summaries
- Individual student flags (aggregated from their parent's feedback signals)
- AI-generated teaching suggestions tied to real feedback data

### Privacy & Transparency

- Parents must be informed that chat content is analysed and aggregated (shown during onboarding)
- Teacher dashboard shows **anonymised aggregates** by default
- Individual parent feedback only visible if parent explicitly opts in
- No "risk" labeling of students — use supportive language ("may benefit from extra attention")

---

## 6. Data Flow

```
Teacher uploads / LMS imports:
  syllabus, curriculum docs, grade data, assessment schedules
        │
        ▼
  Data Ingestion → Vector Store (for RAG)
        │
        ▼
  CurricuLLM API processes:
    - Translate curriculum → plain language
    - Generate weekly learning focus + activities
        │
        ▼
  Parent Portal: Dashboard + Chat (RAG-grounded Q&A)
        │
        ▼
  Parent interacts: asks questions, provides feedback
        │
        ▼
  Feedback Engine:
    - Keyword extraction, sentiment, tagging
    - Aggregate across parents per class
        │
        ▼
  Teacher Portal: Dashboard (insights) + Chat (analysis assistant)
        │
        ▼
  Teacher confirms/adjusts → System generates next push to parents
        │
        ▼
  (Loop back to Parent Portal)
```

---

## 7. Tech Stack (Suggested)

| Layer | Technology |
|-------|-----------|
| Frontend | React (or Next.js) — single app with role-based routing |
| UI Components | Tailwind CSS + shadcn/ui |
| Backend | Node.js / Python (FastAPI) |
| Database | PostgreSQL (user data, grades) + Vector DB (e.g. Pinecone, ChromaDB) for RAG |
| GenAI | CurricuLLM API (mandatory) — all LLM calls go through this |
| Auth | Simple role-based (teacher/parent) — can be mocked for prototype |
| Real-time chat | WebSocket or SSE for streaming LLM responses |
| Deployment | Vercel / Railway / local demo |

---

## 8. Prototype Scope (Hackathon MVP)

### Must Have (Demo Day)

1. **Parent Dashboard**: Show course list, simplified syllabus, performance summary, weekly learning focus
2. **Parent Chat**: RAG-grounded Q&A with CurricuLLM API, multi-language support (at least English + one other language e.g. Mandarin)
3. **Teacher Dashboard**: Course list, aggregated feedback overview, 2-3 insight cards in "data → suggestion" format, students needing attention list
4. **Teacher Chat**: Query feedback trends, receive proactive suggestions from system
5. **Feedback loop demo**: Show the flow from parent feedback → AI analysis → teacher insight → generated parent message

### Nice to Have

- Voice input for parent feedback
- LMS integration demo (mock data import from Google Classroom)
- Animated data visualisations on teacher dashboard
- Parent onboarding flow with language selection

### Use Mock Data

- Pre-populated: 1 school, 2-3 classes, 10-15 students, syllabus for each class
- Pre-populated parent feedback data to demonstrate aggregation and insights
- This avoids cold-start issues during demo

---

## 9. Key Pitch Points

1. **"Actionable insights, not just data"** — every screen answers "so what should I do?"
2. **The proactive loop**: System asks teacher → teacher confirms → parents receive guidance. Minimum teacher effort, maximum parent value.
3. **Curriculum translated to human language** — powered by CurricuLLM API's curriculum-aware intelligence
4. **Privacy by design** — anonymised aggregation, opt-in visibility, supportive (not punitive) language
5. **Designed for diverse families** — multilingual chat, voice input, low-literacy-friendly UI

---

## 10. Deliverables Checklist

- [ ] Working prototype (web app)
- [ ] 2-3 minute demo video
- [ ] Pitch deck (slides)
- [ ] CurricuLLM API integration demonstrated in prototype

All four are mandatory.
