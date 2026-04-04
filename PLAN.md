# EduX Hackathon Prototype — Implementation Plan

## Context

EduX 是一个 Hackathon 原型项目，目标是搭建一个 Web 平台来改善教师与家长之间的沟通。平台包含家长端和教师端两个门户，各自有 Dashboard 和 AI Chat 功能，基于 CurricuLLM API 提供 RAG 驱动的智能交互。需要用预填充的模拟数据演示完整的反馈闭环流程。

---

## 1. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | **Next.js 14 (App Router)** | 文件路由天然适配角色分区 (`/parent/*`, `/teacher/*`)，API Routes 处理 CRUD |
| UI | **Tailwind CSS + shadcn/ui** | 快速组装专业界面 |
| Backend (AI) | **Python FastAPI** | Python 的 LLM/向量工具链更成熟 (chromadb, httpx)，负责所有 AI 编排 |
| Database | **PostgreSQL + Prisma ORM** | 类型安全，内置 migration 和 seed |
| Vector DB | **ChromaDB (嵌入式/本地)** | 零基础设施，在 FastAPI 进程内运行 |
| GenAI | **CurricuLLM API** (mandatory) / **Anthropic Haiku 4.5** (开发阶段替代) | 通过 Provider 抽象层切换，见下方说明 |
| Auth | **Mock 角色切换** | Header 下拉框切换用户，无需登录页 |
| Streaming | **SSE (Server-Sent Events)** | 比 WebSocket 简单，适合单向 LLM 流式输出 |
| Package Manager | **pnpm** | 快速，monorepo 支持 |
| 部署 | **Docker Compose (本地)** | PostgreSQL + FastAPI + Next.js 一键启动 |

### LLM Provider 抽象层

CurricuLLM API 尚未批准，开发阶段使用 **Anthropic Haiku 4.5** 作为替代。通过 Provider 抽象层实现无缝切换：

```python
# .env 环境变量控制
LLM_PROVIDER=anthropic        # 开发阶段: 使用 Haiku 4.5
# LLM_PROVIDER=curricullm     # API 批准后切换
```

- `services/ai/core/curricullm.py` 封装统一接口 (`chat_completion`, `chat_completion_stream`, `embeddings`)
- 内部根据 `LLM_PROVIDER` 环境变量路由到不同后端 (Anthropic SDK / CurricuLLM HTTP client)
- **CurricuLLM 专属功能**（如 curriculum code 查询教学标准）在开发阶段通过 prompt engineering + mock 数据模拟，API 到位后替换
- 切换时只改 `.env`，上层业务代码无需修改

---

## 2. Project Structure

```
edux/
├── apps/web/                          # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx                 # Root layout + providers
│   │   ├── page.tsx                   # 角色选择 landing page
│   │   ├── parent/
│   │   │   ├── layout.tsx             # 家长端 shell (sidebar, nav)
│   │   │   ├── dashboard/page.tsx
│   │   │   └── chat/page.tsx
│   │   ├── teacher/
│   │   │   ├── layout.tsx             # 教师端 shell
│   │   │   ├── dashboard/page.tsx
│   │   │   └── chat/page.tsx
│   │   └── api/                       # Next.js API Routes (CRUD + AI proxy)
│   │       ├── auth/route.ts
│   │       ├── courses/route.ts
│   │       ├── courses/[id]/weekly-focus/route.ts
│   │       ├── courses/[id]/performance/route.ts
│   │       ├── feedback/route.ts
│   │       ├── feedback/aggregate/route.ts
│   │       ├── insights/route.ts
│   │       ├── students/attention/route.ts
│   │       ├── chat/route.ts          # SSE proxy → FastAPI
│   │       └── messages/route.ts
│   ├── components/
│   │   ├── ui/                        # shadcn/ui 基础组件
│   │   ├── layout/                    # Sidebar, Header, RoleGuard
│   │   ├── parent/                    # CourseCard, PerformanceSummary, WeeklyFocus, FeedbackPrompt
│   │   ├── teacher/                   # InsightCard, FeedbackOverview, AttentionList, KeywordCloud, MessageComposer
│   │   └── chat/                      # ChatWindow, MessageBubble, ChatInput, StreamingMessage
│   ├── lib/                           # api.ts, auth.ts, types.ts, i18n.ts
│   ├── hooks/                         # useChat.ts, useAuth.ts, useFeedback.ts
│   ├── i18n/                          # en.json, zh.json
│   └── prisma/                        # schema.prisma, seed.ts
│
├── services/ai/                       # Python FastAPI 微服务
│   ├── main.py
│   ├── routers/                       # chat.py, rag.py, insights.py, messages.py
│   ├── core/                          # curricullm.py, rag_pipeline.py, feedback_analyzer.py, prompt_templates.py
│   ├── models/schemas.py
│   ├── data/
│   │   ├── seed_vectors.py
│   │   └── documents/                 # 教学大纲 markdown 文件
│   └── requirements.txt
│
├── mock-data/                         # 模拟数据 JSON + syllabus markdown
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

---

## 3. Implementation Phases

### Phase 0: Scaffolding (~2-3h)
- 初始化 pnpm monorepo + Next.js App Router + Tailwind + TypeScript
- 安装 shadcn/ui 组件 (Button, Card, Input, Avatar, Badge, Tabs, Dialog, etc.)
- 配置 Prisma + PostgreSQL schema
- 创建 FastAPI 项目骨架 (fastapi, uvicorn, chromadb, httpx, sse-starlette)
- 编写 `docker-compose.yml` (PostgreSQL:5432, FastAPI:8000, Next.js:3000)
- 实现 mock auth: 硬编码用户 + Header 下拉切换

### Phase 1: Mock Data + DB Seeding (~2-3h)
- 编写 mock data JSON (1 school, 2 teachers, 10 parents, 12 students, 3 courses)
- 编写 3 份澳洲课程 syllabus markdown (Year 5 Maths, Year 5 English, Year 6 Science)
- Prisma seed 脚本批量导入
- `seed_vectors.py`: 切分 syllabus → 嵌入 → 存入 ChromaDB

### Phase 2: Parent Dashboard (~3-4h)
- 家长端 layout (sidebar: 孩子姓名 + Dashboard/Chat 导航)
- `CourseCard`: 课程名、教师、进度条 (week X of Y)
- `SyllabusView`: 按主题/单元的手风琴展开，简化文本
- `PerformanceSummary`: 描述性标签 (如 "Progressing well")
- `WeeklyFocus`: 本周学习重点 + 在家活动建议
- 对应 API routes: courses, weekly-focus, performance

### Phase 3: Parent Chat + RAG (~4-5h)
- 共享 `ChatWindow`, `MessageBubble`, `ChatInput`, `StreamingMessage`
- `useChat` hook: POST → SSE EventSource → 流式渲染
- FastAPI `/chat/parent`: 接收消息 → ChromaDB 检索 top-5 → 构建 RAG prompt → CurricuLLM 流式返回
- `rag_pipeline.py`: 嵌入查询、元数据过滤、排序返回
- `curricullm.py`: 异步客户端封装 (流式 + 重试)
- 多语言: i18n 切换 UI + language 参数传给 CurricuLLM
- `FeedbackPrompt`: 2-3 轮对话后弹出快速反馈

### Phase 4: Teacher Dashboard (~3-4h)
- 教师端 layout + 课程切换 tabs
- `FeedbackOverview`: 完成率进度条、难点话题柱状图
- `InsightCard`: "数据 → 结论 → 建议" 格式 + "Generate parent message" 按钮
- `AttentionList`: 需关注学生列表 (支持性语言)
- `KeywordCloud`: 标签云
- 对应 API routes + FastAPI `/insights/generate`

### Phase 5: Teacher Chat (~3-4h)
- 复用 `ChatWindow`，教师专用 persona ("Data Analysis Assistant")
- 主动建议: 页面加载时检查未处理趋势 → 系统消息提示
- FastAPI `/chat/teacher`: 查询聚合反馈数据 → CurricuLLM
- 聊天内嵌 action buttons ("Generate", "Draft message")

### Phase 6: Feedback Loop (~3-4h)
- `MessageComposer` (Dialog): AI 草稿 → 教师编辑 → 发布
- InsightCard / 聊天建议 → 调用 FastAPI `/messages/draft` → 生成草稿
- 发布后存为新的 WeeklyFocus → 家长端可见
- 端到端验证: 家长反馈 → 教师洞察 → 生成消息 → 发布 → 家长看到

### Phase 7: Polish + Demo Prep (~2-3h)
- Loading skeleton, error boundaries, empty states
- 中文 UI 翻译
- 全流程 demo 脚本测试
- 响应缓存 (demo 可靠性保障)
- 录制备用 demo 视频

**总估时: ~22-30h**

---

## 4. Database Schema (Key Entities)

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| `School` | id, name | 单一学校 |
| `User` | id, name, email, role (TEACHER/PARENT), language | Mock auth |
| `Student` | id, name, parentId | 多对一关联家长 |
| `Course` | id, name, teacherId, syllabusPlain, currentWeek, totalWeeks | syllabusPlain 由 LLM 生成 |
| `Enrollment` | studentId, courseId | 学生-课程关联 |
| `PerformanceNote` | studentId, courseId, label | 描述性标签，无数字分数 |
| `WeeklyFocus` | courseId, weekNumber, topic, activity, source | source: "auto" / "teacher" |
| `Feedback` | parentId, courseId, type, value, tags[], sentiment | tags 为 PostgreSQL text array |
| `ChatSession` / `ChatMessage` | userId, role, content, timestamp | 对话历史 |
| `Insight` | courseId, dataPoint, therefore, suggestion, status | status: new/actioned/dismissed |

---

## 5. API Endpoints

### Next.js API Routes (CRUD + Proxy)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | Mock 登录 |
| GET | `/api/courses` | 当前用户的课程列表 |
| GET | `/api/courses/[id]/weekly-focus` | 本周学习重点 |
| GET | `/api/courses/[id]/performance` | 学生表现 (家长端) |
| POST | `/api/feedback` | 提交反馈 |
| GET | `/api/feedback/aggregate` | 聚合反馈 (教师端) |
| GET | `/api/insights` | 洞察卡片 |
| POST | `/api/insights/[id]/action` | 标记洞察状态 |
| GET | `/api/students/attention` | 需关注学生 |
| POST | `/api/chat` | SSE proxy → FastAPI |
| POST | `/api/messages/publish` | 发布教师消息 |

### FastAPI Endpoints (AI Service, :8000)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/chat/parent` | 家长 RAG 聊天 (SSE stream) |
| POST | `/chat/teacher` | 教师数据分析聊天 (SSE stream) |
| POST | `/rag/query` | RAG 检索调试 |
| POST | `/insights/generate` | 生成洞察卡片 |
| POST | `/messages/draft` | 草拟家长消息 |
| POST | `/feedback/analyze` | 反馈分析 (关键词/情感/标签) |

---

## 6. Mock Data Strategy

- **学校**: Riverside Primary School
- **教师**: Ms. Sarah Chen (Year 5 Maths + English), Mr. James Nguyen (Year 6 Science)
- **家长/学生**: 10 家长, 12 学生, 其中 2-3 个中文偏好家长
- **课程**: Year 5 Maths (分数/小数/统计), Year 5 English (写作/阅读), Year 6 Science (地球与生命科学)
- **反馈数据** (30-40 条): ~42% 家长反馈分数除法困难 (触发标志性 insight card), 英语普遍正面, 科学作业完成率参差
- **Performance Notes**: 多数 "Progressing well", 2-3 人 "May benefit from extra attention"

---

## 7. Verification (Demo Walkthrough)

1. **家长 Dashboard** (0:00-0:30): 以 "Li Wei" 登录 → 课程卡片 → 展开大纲 → 表现标签 → 本周学习重点
2. **家长 Chat** (0:30-1:15): 英文问 "What is my child learning in maths?" → 流式 RAG 回答 → 切中文再问 → 中文回答 → FeedbackPrompt 弹出
3. **教师 Dashboard** (1:30-2:00): 切换 Ms. Chen → 完成率 62% → 分数困难 42% → InsightCard 展示
4. **教师 Chat + 闭环** (2:00-2:30): 主动建议 → "Generate parent message" → 编辑 → 发布 → 切回家长端看到新推送
5. **Fallback**: 响应缓存保障 demo 可靠性 + 备用录屏
