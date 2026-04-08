/**
 * Pre-seeded demo chat histories for hackathon presentation.
 *
 * Demonstrates: parent concern in chat -> keyword extracted -> teacher dashboard
 *
 * Coverage:
 *   parent-1 (Li Wei, zh):    course-1 Math (zh), course-2 English (cleared)
 *   parent-2 (Emma, en):      course-1 Math (en), course-2 English (en)
 *   parent-3 (Priya, hi):     course-1 Math (hi), course-2 English (hi), course-3 Science (hi)
 */

import type { ChatMessage } from "@/lib/types";

interface SeedEntry {
  userId: string;
  chatType: string;
  courseId: string;
  messages: ChatMessage[];
}

function makeKey(userId: string, chatType: string, courseId: string) {
  return `edux-chat:${userId}:${chatType}:${courseId}`;
}

// ---------------------------------------------------------------------------
// Helper: all Chinese / Hindi strings use Unicode escapes to avoid
// encoding issues with curly quotes or multi-byte characters in source files.
// ---------------------------------------------------------------------------

const DEMO_HISTORIES: SeedEntry[] = [

  // ── parent-1 (Li Wei, zh) + course-1 (Year 5 Mathematics) ─────────────────
  {
    userId: "parent-1",
    chatType: "parent",
    courseId: "course-1",
    messages: [
      {
        id: "demo-p1-c1-1",
        role: "user",
        content: "\u6211\u7684\u5b69\u5b50\u8fd9\u5468\u5728\u5b66\u4ec0\u4e48\u6570\u5b66\u5185\u5bb9\uff1f",
      },
      {
        id: "demo-p1-c1-2",
        role: "assistant",
        content: "\u672c\u5468 Year 5 Mathematics (MA3-WM) \u7684\u5b66\u4e60\u91cd\u70b9\u662f**\u5206\u6570\u9664\u6cd5**\uff08\u7b2c 6 \u5468\uff0c\u516b 10 \u5468\uff09\u3002\u5b69\u5b50\u4eec\u6b63\u5728\u5b66\u4e60\u5982\u4f55\u7528\u300c\u4e58\u4ee5\u5012\u6570\u300d\u7684\u65b9\u6cd5\u8ba1\u7b97\u5206\u6570\u9664\u6cd5\uff0c\u4f8b\u5982 1/2 \u00f7 1/4 = 1/2 \u00d7 4 = 2\u3002\n\n\u672c\u5468\u7684\u8bfe\u5916\u6d3b\u52a8\u662f\u7528\u300c\u5206\u62ab\u8428\u300d\u7684\u65b9\u5f0f\u5e2e\u52a9\u7406\u89e3\uff1a\u628a\u4e00\u4e2a\u62ab\u8428\u5e73\u5747\u5206\u6210\u51e0\u4efd\uff0c\u518d\u8ba8\u8bba\u6bcf\u4efd\u662f\u6574\u4e2a\u7684\u51e0\u5206\u4e4b\u51e0\u3002",
      },
      {
        id: "demo-p1-c1-3",
        role: "user",
        content: "\u4ed6\u89c9\u5f97\u5206\u6570\u9664\u6cd5\u5f88\u96be\uff0c\u7279\u522b\u662f\u4e0d\u7406\u89e3\u4e3a\u4ec0\u4e48\u8981\u4e58\u4ee5\u5012\u6570\uff0c\u6709\u4ec0\u4e48\u5efa\u8bae\u5417\uff1f",
      },
      {
        id: "demo-p1-c1-4",
        role: "assistant",
        content: "\u8fd9\u662f\u975e\u5e38\u5e38\u89c1\u7684\u56f0\u60d1\uff01\u5f88\u591a\u540c\u5b66\u90fd\u89c9\u5f97\u300c\u4e3a\u4ec0\u4e48\u8981\u4e58\u4ee5\u5012\u6570\u300d\u4e0d\u76f4\u89c2\u3002\n\n**\u7528\u751f\u6d3b\u4f8b\u5b50\u89e3\u91ca\uff1a**\n\u60f3\u8c61\u4f60\u6709\u534a\u4e2a\u62ab\u8428\uff0c\u60f3\u628a\u5b83\u5206\u6210\u6bcf\u4efd\u56db\u5206\u4e4b\u4e00\u5927\u5c0f\u2014\u2014\u4f60\u80fd\u5206\u51e0\u4efd\uff1f\u7b54\u6848\u662f 2 \u4efd\u3002\u8fd9\u5c31\u662f 1/2 \u00f7 1/4 = 2\uff0c\u300c\u4e58\u4ee5\u5012\u6570\u300d\u53ea\u662f\u8fd9\u4e2a\u8fc7\u7a0b\u7684\u6570\u5b66\u5feb\u6377\u65b9\u5f0f\u3002\n\n**\u5177\u4f53\u5efa\u8bae\uff1a**\n- \u5148\u7528\u753b\u56fe\u6cd5\uff0c\u753b\u51fa\u5206\u6570\u518d\u624b\u52a8\u5206\u5272\n- \u7528\u5b9e\u7269\uff08\u997c\u5e72\u3001\u7eb8\u7247\uff09\u4eb2\u624b\u64cd\u4f5c\n- \u6bcf\u5929\u7ec3\u4e60 2\u20133 \u9053\u5206\u6570\u9664\u6cd5\u9898\uff0c\u91cd\u590d\u5de9\u56fa",
      },
      {
        id: "demo-p1-c1-5",
        role: "user",
        content: "\u8c22\u8c22\uff01\u90a3\u4e2a\u5206\u62ab\u8428\u7684\u4f8b\u5b50\u5f88\u597d\uff0c\u6211\u4f1a\u8bd5\u8bd5\u3002",
      },
      {
        id: "demo-p1-c1-6",
        role: "assistant",
        content: "\u5f88\u9ad8\u5174\u80fd\u5e2e\u5230\u60a8\uff01\u7528\u751f\u6d3b\u4e2d\u7684\u4f8b\u5b50\u5e2e\u52a9\u5b69\u5b50\u7406\u89e3\u6570\u5b66\u6982\u5ff5\u975e\u5e38\u6709\u6548\u3002\u795d\u5b69\u5b50\u5b66\u4e60\u987a\u5229\uff01",
      },
    ],
  },

  // ── parent-1 (Li Wei, zh) + course-2 (Year 5 English) ─────────────────────
  {
    userId: "parent-1",
    chatType: "parent",
    courseId: "course-2",
    messages: [
      {
        id: "demo-p1-c2-1",
        role: "user",
        // 本周英语课学的是什么？
        content: "\u672c\u5468\u82f1\u8bed\u8bfe\u5b66\u7684\u662f\u4ec0\u4e48\uff1f",
      },
      {
        id: "demo-p1-c2-2",
        role: "assistant",
        // 本周 Year 5 English 的学习重点是**说服性写作**（第 6 周）。孩子们正在学习如何用有力的论据、情感性语言和证据来说服读者。本周的课堂作业是写一篇说服老师改变学校某条规定的文章。
        content: "\u672c\u5468 Year 5 English \u7684\u5b66\u4e60\u91cd\u70b9\u662f**\u8bf4\u670d\u6027\u5199\u4f5c**\uff08\u7b2c 6 \u5468\uff09\u3002\u5b69\u5b50\u4eec\u6b63\u5728\u5b66\u4e60\u5982\u4f55\u7528\u6709\u529b\u7684\u8bba\u636e\u3001\u60c5\u611f\u6027\u8bed\u8a00\u548c\u8bc1\u636e\u6765\u8bf4\u670d\u8bfb\u8005\u3002\u672c\u5468\u7684\u8bfe\u5802\u4f5c\u4e1a\u662f\u5199\u4e00\u7bc7\u8bf4\u670d\u8001\u5e08\u6539\u53d8\u5b66\u6821\u67d0\u6761\u89c4\u5b9a\u7684\u6587\u7ae0\u3002",
      },
      {
        id: "demo-p1-c2-3",
        role: "user",
        // 他写作文时总是想不出有力的论点，有什么方法可以帮他提高吗？
        content: "\u4ed6\u5199\u4f5c\u6587\u65f6\u603b\u662f\u60f3\u4e0d\u51fa\u6709\u529b\u7684\u8bba\u70b9\uff0c\u6709\u4ec0\u4e48\u65b9\u6cd5\u53ef\u4ee5\u5e2e\u4ed6\u63d0\u9ad8\u5417\uff1f",
      },
      {
        id: "demo-p1-c2-4",
        role: "assistant",
        // 这是很多同学的共同困惑！可以试试 PEEL 写作框架：
        // Point（观点）→ Explain（解释）→ Evidence（举例）→ Link（总结）
        // 比如让孩子选一个他真正在意的话题，从自己的立场出发，先说"我认为……因为……"，这样论点会更自然有力。在家可以做个小练习：让他说服你今晚吃什么，练习给出至少 3 个理由。
        content: "\u8fd9\u662f\u5f88\u591a\u540c\u5b66\u7684\u5171\u540c\u56f0\u60d1\uff01\u53ef\u4ee5\u8bd5\u8bd5 PEEL \u5199\u4f5c\u6846\u67b6\uff1a\n\n**Point**\uff08\u89c2\u70b9\uff09\u2192 **Explain**\uff08\u89e3\u91ca\uff09\u2192 **Evidence**\uff08\u4e3e\u4f8b\uff09\u2192 **Link**\uff08\u603b\u7ed3\uff09\n\n\u6bd4\u5982\u8ba9\u5b69\u5b50\u9009\u4e00\u4e2a\u4ed6\u771f\u6b63\u5728\u610f\u7684\u8bdd\u9898\uff0c\u5148\u8bf4\u300c\u6211\u8ba4\u4e3a\u2026\u2026\u56e0\u4e3a\u2026\u2026\u300d\uff0c\u8bba\u70b9\u4f1a\u66f4\u81ea\u7136\u6709\u529b\u3002\n\n\u5728\u5bb6\u53ef\u4ee5\u505a\u4e2a\u5c0f\u7ec3\u4e60\uff1a\u8ba9\u4ed6\u8bf4\u670d\u4f60\u4eca\u665a\u5403\u4ec0\u4e48\uff0c\u7ec3\u4e60\u7ed9\u51fa\u81f3\u5c11 3 \u4e2a\u7406\u7531\u3002\u8fd9\u548c\u8001\u5e08\u5e03\u7f6e\u7684\u5bb6\u5e8f\u4f5c\u4e1a\u5185\u5bb9\u6b63\u597d\u5bf9\u5e94\uff01",
      },
      {
        id: "demo-p1-c2-5",
        role: "user",
        // 谢谢！PEEL 框架听起来很实用，我们今晚就试试。
        content: "\u8c22\u8c22\uff01PEEL \u6846\u67b6\u542c\u8d77\u6765\u5f88\u5b9e\u7528\uff0c\u6211\u4eec\u4eca\u665a\u5c31\u8bd5\u8bd5\u3002",
      },
      {
        id: "demo-p1-c2-6",
        role: "assistant",
        // 太棒了！用生活中的例子练习写作思维是非常有效的方法。相信他很快就能写出有说服力的文章！祝学习顺利 🎉
        content: "\u592a\u68d2\u4e86\uff01\u7528\u751f\u6d3b\u4e2d\u7684\u4f8b\u5b50\u7ec3\u4e60\u5199\u4f5c\u601d\u7ef4\u662f\u975e\u5e38\u6709\u6548\u7684\u65b9\u6cd5\u3002\u76f8\u4fe1\u4ed6\u5f88\u5feb\u5c31\u80fd\u5199\u51fa\u6709\u8bf4\u670d\u529b\u7684\u6587\u7ae0\uff01\u795d\u5b66\u4e60\u987a\u5229 \ud83c\udf89",
      },
    ],
  },

  // ── parent-2 (Emma Thompson, en) + course-1 (Year 5 Mathematics) ───────────
  {
    userId: "parent-2",
    chatType: "parent",
    courseId: "course-1",
    messages: [
      {
        id: "demo-p2-c1-1",
        role: "user",
        content: "What is my child learning in maths this week?",
      },
      {
        id: "demo-p2-c1-2",
        role: "assistant",
        content: "This week in **Year 5 Mathematics (MA3-WM)** (Week 6 of 10), the focus is on **fraction division**. Students are learning how to divide fractions using the 'multiply by the reciprocal' method — for example, 1/2 \u00f7 1/4 = 1/2 \u00d7 4 = 2.\n\nThe at-home activity this week involves using everyday objects (like cutting a pizza or folding paper) to visualise fraction division before working through the abstract calculation.",
      },
      {
        id: "demo-p2-c1-3",
        role: "user",
        content: "She's really struggling with fraction division. The concept of multiplying by the reciprocal just doesn't click for her.",
      },
      {
        id: "demo-p2-c1-4",
        role: "assistant",
        content: "That's a very common challenge — the 'flip and multiply' rule can feel like a magic trick with no explanation!\n\n**A helpful way to explain it:**\nAsk: 'If you have half a pizza and want to share it into quarter-sized pieces, how many pieces do you get?' The answer is 2 — and that's exactly 1/2 \u00f7 1/4 = 2. The reciprocal trick is simply a shortcut for that real-world action.\n\n**Practical tips:**\n- Draw fraction bars on paper together and physically divide them\n- Use food or LEGO bricks for hands-on practice\n- Work through 2-3 problems together before she works independently",
      },
      {
        id: "demo-p2-c1-5",
        role: "user",
        content: "That pizza explanation is really good, I'll try that tonight. Thank you!",
      },
      {
        id: "demo-p2-c1-6",
        role: "assistant",
        content: "You're welcome! Hands-on examples make a huge difference at this age. Feel free to come back any time if you have more questions.",
      },
    ],
  },

  // ── parent-2 (Emma Thompson, en) + course-2 (Year 5 English) ───────────────
  {
    userId: "parent-2",
    chatType: "parent",
    courseId: "course-2",
    messages: [
      {
        id: "demo-p2-c2-1",
        role: "user",
        content: "What is my child working on in English this week?",
      },
      {
        id: "demo-p2-c2-2",
        role: "assistant",
        content: "This week in **Year 5 English (EN3-UARL)** (Week 6 of 10), the focus is on **persuasive writing**. Students are practising how to build a clear argument, use evidence to support their point of view, and write with purpose for a specific audience.\n\nThe class activity involves writing a persuasive letter on a topic they care about — choosing their own subject makes it much more engaging!",
      },
      {
        id: "demo-p2-c2-3",
        role: "user",
        content: "Sophie has really been enjoying this — she wrote a letter trying to convince us to get a pet! She was very determined.",
      },
      {
        id: "demo-p2-c2-4",
        role: "assistant",
        content: "That's fantastic — and exactly what the unit is designed to spark! When students write about something they genuinely care about, the persuasive techniques come naturally.\n\n**To keep the momentum going at home:**\n- Ask her to explain *why* she chose each argument — this builds metacognitive awareness\n- Read her letter together and ask: 'What's the strongest point? What could be even more convincing?'\n- Encourage her to look at newspaper opinion pieces or ads and spot the persuasive language used\n\nHer enthusiasm for the topic is a great sign — she's developing exactly the kind of authorial confidence the syllabus aims for.",
      },
      {
        id: "demo-p2-c2-5",
        role: "user",
        content: "That's great advice, thank you! We'll make it into a bit of a family debate.",
      },
      {
        id: "demo-p2-c2-6",
        role: "assistant",
        content: "A family debate is perfect — it gives her a real audience to persuade, which is the whole point of the unit. Enjoy it!",
      },
    ],
  },

  // ── parent-3 (Priya Sharma, hi) + course-1 (Year 5 Mathematics) ─────────────
  {
    userId: "parent-3",
    chatType: "parent",
    courseId: "course-1",
    messages: [
      {
        id: "demo-p3-c1-1",
        role: "user",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 \u092e\u0947\u0930\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u0940 \u0917\u0923\u093f\u0924 \u092e\u0947\u0902 \u0915\u094d\u092f\u093e \u092a\u0922\u093c\u093e\u0908 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948?",
      },
      {
        id: "demo-p3-c1-2",
        role: "assistant",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 **Year 5 Mathematics (MA3-WM)** (\u0938\u092a\u094d\u0924\u093e\u0939 6/10) \u092e\u0947\u0902 **\u092d\u093f\u0928\u094d\u0928 \u0935\u093f\u092d\u093e\u091c\u0928** (Fraction Division) \u0915\u093e \u0905\u0927\u094d\u092f\u092f\u0928 \u0939\u094b \u0930\u0939\u093e \u0939\u0948\u0964 \u092c\u091a\u094d\u091a\u0947 \u0938\u0940\u0916 \u0930\u0939\u0947 \u0939\u0948\u0902 \u0915\u093f \u092d\u093f\u0928\u094d\u0928\u094b\u0902 \u0915\u094b \u0915\u0948\u0938\u0947 \u0935\u093f\u092d\u093e\u091c\u093f\u0924 \u0915\u093f\u092f\u093e \u091c\u093e\u0924\u093e \u0939\u0948 \u2014 \u0909\u0926\u093e\u0939\u0930\u0923: 1/2 \u00f7 1/4 = 1/2 \u00d7 4 = 2\u0964\n\n\u0918\u0930\u0947\u0932\u0942 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u092e\u0947\u0902 \u092a\u093f\u091c\u093c\u094d\u091c\u093e \u092f\u093e \u0915\u093e\u0917\u091c\u093c \u0915\u0947 \u091f\u0941\u0915\u095c\u094b\u0902 \u0938\u0947 \u092d\u093f\u0928\u094d\u0928 \u0935\u093f\u092d\u093e\u091c\u0928 \u0915\u094b \u0938\u092e\u091d\u0928\u093e \u0936\u093e\u092e\u093f\u0932 \u0939\u0948\u0964",
      },
      {
        id: "demo-p3-c1-3",
        role: "user",
        content: "\u092e\u0947\u0930\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u094b \u092d\u093f\u0928\u094d\u0928 \u0935\u093f\u092d\u093e\u091c\u0928 \u092c\u0939\u0941\u0924 \u0915\u0920\u093f\u0928 \u0932\u0917 \u0930\u0939\u093e \u0939\u0948\u0964 \u0935\u0939 \u0938\u092e\u091d \u0928\u0939\u0940\u0902 \u092a\u093e \u0930\u0939\u093e \u0915\u093f \u0935\u093f\u092a\u0930\u0940\u0924 \u092d\u093f\u0928\u094d\u0928 \u0938\u0947 \u0917\u0941\u0923\u093e \u0915\u094d\u092f\u094b\u0902 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
      },
      {
        id: "demo-p3-c1-4",
        role: "assistant",
        content: "\u092f\u0939 \u092c\u0939\u0941\u0924 \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0915\u0920\u093f\u0928\u093e\u0908 \u0939\u0948!\n\n**\u090f\u0915 \u0938\u0930\u0932 \u0909\u0926\u093e\u0939\u0930\u0923:**\n\u0938\u094b\u091a\u093f\u090f \u0906\u092a\u0915\u0947 \u092a\u093e\u0938 \u0906\u0927\u093e \u092a\u093f\u091c\u093c\u094d\u091c\u093e \u0939\u0948 \u0914\u0930 \u0906\u092a \u0907\u0938\u0947 \u091a\u094c\u0925\u093e\u0908-\u091a\u094c\u0925\u093e\u0908 \u091f\u0941\u0915\u095c\u094b\u0902 \u092e\u0947\u0902 \u092c\u093e\u0902\u091f\u0928\u093e \u091a\u093e\u0939\u0924\u0947 \u0939\u0948\u0902 \u2014 \u0915\u093f\u0924\u0928\u0947 \u091f\u0941\u0915\u095c\u0947 \u092e\u093f\u0932\u0947\u0902\u0917\u0947? \u091c\u0935\u093e\u092c \u0939\u0948 2\u0964 \u092f\u0939\u0940 \u0939\u0948 1/2 \u00f7 1/4 = 2!\n\n**\u0938\u0941\u091d\u093e\u0935:**\n- \u0915\u093e\u0917\u095c\u093c \u0915\u0947 \u091f\u0941\u0915\u095c\u094b\u0902 \u0938\u0947 \u0939\u093e\u0925\u094b\u0902 \u0938\u0947 \u0905\u092d\u094d\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\n- \u0930\u094b\u091c\u093c 2\u20133 \u0938\u0935\u093e\u0932 \u092e\u093f\u0932\u0915\u0930 \u0939\u0932 \u0915\u0930\u0947\u0902",
      },
      {
        id: "demo-p3-c1-5",
        role: "user",
        content: "\u092a\u093f\u091c\u093c\u094d\u091c\u093e \u0915\u093e \u0909\u0926\u093e\u0939\u0930\u0923 \u092c\u0939\u0941\u0924 \u0905\u091a\u094d\u091b\u093e \u0939\u0948! \u0906\u091c \u0936\u093e\u092e \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0942\u0901\u0917\u0940\u0964",
      },
      {
        id: "demo-p3-c1-6",
        role: "assistant",
        content: "\u092c\u0939\u0941\u0924 \u0905\u091a\u094d\u091b\u093e! \u0907\u0938 \u0909\u092e\u094d\u0930 \u0915\u0947 \u092c\u091a\u094d\u091a\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0935\u094d\u092f\u093e\u0935\u0939\u093e\u0930\u093f\u0915 \u0909\u0926\u093e\u0939\u0930\u0923 \u092c\u0939\u0941\u0924 \u0915\u093e\u0930\u0917\u0930 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964 \u0906\u092a\u0915\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u0940 \u092a\u095c\u093e\u0908 \u0905\u091a\u094d\u091b\u0940 \u0939\u094b!",
      },
    ],
  },

  // ── parent-3 (Priya Sharma, hi) + course-2 (Year 5 English) ─────────────────
  {
    userId: "parent-3",
    chatType: "parent",
    courseId: "course-2",
    messages: [
      {
        id: "demo-p3-c2-1",
        role: "user",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 \u0905\u0902\u0917\u094d\u0930\u0947\u091c\u093c\u0940 \u092e\u0947\u0902 \u0915\u094d\u092f\u093e \u092a\u095d\u093e\u092f\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948?",
      },
      {
        id: "demo-p3-c2-2",
        role: "assistant",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 **Year 5 English (EN3-UARL)** (\u0938\u092a\u094d\u0924\u093e\u0939 6/10) \u092e\u0947\u0902 **\u0924\u0930\u094d\u0915\u092a\u0942\u0930\u094d\u0923 \u0932\u0947\u0916\u0928** (Persuasive Writing) \u0914\u0930 **\u092a\u093e\u0920 \u092c\u094b\u0927** (Reading Comprehension) \u0915\u093e \u0905\u092d\u094d\u092f\u093e\u0938 \u0939\u094b \u0930\u0939\u093e \u0939\u0948\u0964 \u092c\u091a\u094d\u091a\u0947 \u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u092a\u093e\u0920\u094d\u092f\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u092a\u095d\u0915\u0930 \u092e\u0941\u0916\u094d\u092f \u0935\u093f\u091a\u093e\u0930\u094b\u0902 \u0915\u094b \u0938\u092e\u091d\u0928\u093e \u0938\u0940\u0916 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964",
      },
      {
        id: "demo-p3-c2-3",
        role: "user",
        content: "\u092e\u0947\u0930\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u094b \u092a\u093e\u0920 \u092c\u094b\u0927 \u092e\u0947\u0902 \u092c\u0939\u0941\u0924 \u0915\u0920\u093f\u0928\u093e\u0908 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964 \u0935\u0939 \u092a\u0942\u091b\u0947 \u0917\u090f \u0938\u0935\u093e\u0932\u094b\u0902 \u0915\u0947 \u091c\u0935\u093e\u092c \u0928\u0939\u0940\u0902 \u0922\u0942\u0902\u0922 \u092a\u093e\u0924\u093e\u0964",
      },
      {
        id: "demo-p3-c2-4",
        role: "assistant",
        content: "\u092a\u093e\u0920 \u092c\u094b\u0927 \u0905\u0915\u094d\u0938\u0930 \u091a\u0941\u0928\u094c\u0924\u0940\u092a\u0942\u0930\u094d\u0923 \u0939\u094b\u0924\u093e \u0939\u0948\u0964\n\n**\u0918\u0930 \u092a\u0930 \u0905\u092d\u094d\u092f\u093e\u0938 \u0915\u0947 \u0938\u0941\u091d\u093e\u0935:**\n- \u092a\u0922\u093c\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0936\u0940\u0930\u094d\u0937\u0915 \u0926\u0947\u0916\u0947\u0902 \u0914\u0930 \u0905\u0928\u0941\u092e\u093e\u0928 \u0932\u0917\u093e\u090f\u0902 \u0915\u093f \u0935\u093f\u0937\u092f \u0915\u094d\u092f\u093e \u0939\u094b\u0917\u093e\n- \u092e\u0941\u0916\u094d\u092f \u0936\u092c\u094d\u0926\u094b\u0902 \u0915\u094b \u0930\u0947\u0916\u093e\u0902\u0915\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0941\u090f \u092a\u0922\u093c\u0947\u0902\n- \u092a\u0922\u093c\u0928\u0947 \u0915\u0947 \u092c\u093e\u0926 \u0905\u092a\u0928\u0947 \u0936\u092c\u094d\u0926\u094b\u0902 \u092e\u0947\u0902 \u0938\u093e\u0930\u093e\u0902\u0936 \u092c\u0924\u093e\u0928\u0947 \u0915\u094b \u0915\u0939\u0947\u0902\n- \u0939\u0930 \u0930\u094b\u091c\u093c 10-15 \u092e\u093f\u0928\u091f \u0905\u0902\u0917\u094d\u0930\u0947\u091c\u093c\u0940 \u092a\u0922\u093c\u0928\u0947 \u0915\u0940 \u0906\u0926\u0924 \u092c\u0928\u093e\u090f\u0902\n\n\u0928\u093f\u092f\u092e\u093f\u0924 \u0905\u092d\u094d\u092f\u093e\u0938 \u0938\u0947 \u092f\u0939 \u0915\u093c\u094c\u0936\u0932 \u091c\u0932\u094d\u0926 \u0938\u0941\u0927\u0930\u0947\u0917\u093e\u0964",
      },
      {
        id: "demo-p3-c2-5",
        role: "user",
        content: "\u0927\u0928\u094d\u092f\u0935\u093e\u0926! \u0939\u092e \u0918\u0930 \u092a\u0930 \u0907\u0938\u0947 \u0906\u091c\u093c\u092e\u093e\u090f\u0902\u0917\u0947\u0964",
      },
      {
        id: "demo-p3-c2-6",
        role: "assistant",
        content: "\u0905\u0935\u0936\u094d\u092f! \u0918\u0930 \u092a\u0930 \u0905\u092d\u094d\u092f\u093e\u0938 \u0938\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u093e \u0906\u0924\u094d\u092e\u0935\u093f\u0936\u094d\u0935\u093e\u0938 \u092c\u095d\u0924\u093e \u0939\u0948\u0964 \u0936\u0941\u092d\u0915\u093e\u092e\u0928\u093e\u090f\u0902!",
      },
    ],
  },

  // ── parent-3 (Priya Sharma, hi) + course-3 (Year 6 Science) ─────────────────
  {
    userId: "parent-3",
    chatType: "parent",
    courseId: "course-3",
    messages: [
      {
        id: "demo-p3-c3-1",
        role: "user",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 \u0935\u093f\u091c\u094d\u091e\u093e\u0928 \u092e\u0947\u0902 \u0915\u094d\u092f\u093e \u092a\u095d\u093e\u092f\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948?",
      },
      {
        id: "demo-p3-c3-2",
        role: "assistant",
        content: "\u0907\u0938 \u0938\u092a\u094d\u0924\u093e\u0939 **Year 6 Science (ST3-LW-ST)** (\u0938\u092a\u094d\u0924\u093e\u0939 6/10) \u092e\u0947\u0902 \u092c\u091a\u094d\u091a\u0947 **\u091c\u0940\u0935\u0928 \u0914\u0930 \u0935\u093e\u0924\u093e\u0935\u0930\u0923** (Living World) \u0935\u093f\u0937\u092f \u092a\u0930 \u0915\u093e\u092e \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 \u0907\u0938\u092e\u0947\u0902 \u0935\u0948\u091c\u094d\u091e\u093e\u0928\u093f\u0915 \u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0932\u093f\u0916\u0928\u093e \u092d\u0940 \u0936\u093e\u092e\u093f\u0932 \u0939\u0948 \u2014 \u0905\u0935\u0932\u094b\u0915\u0928, \u0921\u0947\u091f\u093e \u0930\u093f\u0915\u0949\u0930\u094d\u0921\u093f\u0902\u0917 \u0914\u0930 \u0928\u093f\u0937\u094d\u0915\u0930\u094d\u0937 \u0928\u093f\u0915\u093e\u0932\u0928\u093e\u0964",
      },
      {
        id: "demo-p3-c3-3",
        role: "user",
        content: "\u092e\u0947\u0930\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u094b \u0935\u0948\u091c\u094d\u091e\u093e\u0928\u093f\u0915 \u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0932\u093f\u0916\u0928\u093e \u092c\u0939\u0941\u0924 \u0915\u0920\u093f\u0928 \u0932\u0917\u0924\u093e \u0939\u0948\u0964 \u0935\u0939 \u0928\u0939\u0940\u0902 \u091c\u093e\u0928\u0924\u093e \u0915\u093f \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u094b \u0938\u0939\u0940 \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u0915\u0948\u0938\u0947 \u0932\u093f\u0916\u093e \u091c\u093e\u090f\u0964",
      },
      {
        id: "demo-p3-c3-4",
        role: "assistant",
        content: "\u0935\u0948\u091c\u094d\u091e\u093e\u0928\u093f\u0915 \u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0915\u0940 \u0938\u0902\u0930\u091a\u0928\u093e \u0938\u0940\u0916\u0928\u0947 \u092e\u0947\u0902 \u0938\u092e\u092f \u0932\u0917\u0924\u093e \u0939\u0948\u0964\n\n**\u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0915\u0940 \u0938\u0930\u0932 \u0938\u0902\u0930\u091a\u0928\u093e:**\n1. **\u092a\u094d\u0930\u0936\u094d\u0928** \u2014 \u0939\u092e \u0915\u094d\u092f\u093e \u091c\u093e\u0928\u0928\u093e \u091a\u093e\u0939\u0924\u0947 \u0939\u0948\u0902?\n2. **\u0935\u093f\u0927\u093f** \u2014 \u0939\u092e\u0928\u0947 \u0915\u094d\u092f\u093e \u0915\u093f\u092f\u093e?\n3. **\u092a\u0930\u093f\u0923\u093e\u092e** \u2014 \u0939\u092e\u0928\u0947 \u0915\u094d\u092f\u093e \u092a\u093e\u092f\u093e?\n4. **\u0928\u093f\u0937\u094d\u0915\u0930\u094d\u0937** \u2014 \u0907\u0938\u0915\u093e \u0915\u094d\u092f\u093e \u092e\u0924\u0932\u092c \u0939\u0948?\n\n**\u0918\u0930 \u092a\u0930 \u0905\u092d\u094d\u092f\u093e\u0938:**\n- \u0915\u093f\u0938\u0940 \u0938\u0930\u0932 \u092a\u094d\u0930\u092f\u094b\u0917 (\u091c\u0948\u0938\u0947 \u092a\u094c\u0927\u094b\u0902 \u0915\u093e \u0905\u0928\u0941\u0938\u0930\u0923) \u0915\u0947 \u0921\u0947\u091f\u093e \u0915\u094b \u0924\u093e\u0932\u093f\u0915\u093e \u092e\u0947\u0902 \u0932\u093f\u0916\u0947\u0902\n- \u092b\u093f\u0930 \u0909\u0938\u0947 \u0910\u0938\u0947 \u0935\u093e\u0915\u094d\u092f\u094b\u0902 \u092e\u0947\u0902 \u092c\u0926\u0932\u0947\u0902 \u091c\u0948\u0938\u0947 \u0935\u0948\u091c\u094d\u091e\u093e\u0928\u093f\u0915 \u0932\u093f\u0916\u0924\u0947 \u0939\u0948\u0902",
      },
      {
        id: "demo-p3-c3-5",
        role: "user",
        content: "\u0927\u0928\u094d\u092f\u0935\u093e\u0926! \u0939\u092e \u092f\u0939 \u0918\u0930 \u092a\u0930 \u0906\u091c\u093c\u092e\u093e\u090f\u0902\u0917\u0947\u0964",
      },
      {
        id: "demo-p3-c3-6",
        role: "assistant",
        content: "\u092c\u0939\u0941\u0924 \u0905\u091a\u094d\u091b\u093e! \u0918\u0930 \u092a\u0930 \u0905\u092d\u094d\u092f\u093e\u0938 \u0938\u0947 \u0935\u0948\u091c\u094d\u091e\u093e\u0928\u093f\u0915 \u0938\u094b\u091a \u0935\u093f\u0915\u0938\u093f\u0924 \u0939\u094b\u0924\u0940 \u0939\u0948\u0964 \u0906\u092a\u0915\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u0940 \u092a\u095d\u093e\u0908 \u0905\u091a\u094d\u091b\u0940 \u0939\u094b!",
      },
    ],
  },
];

const DEMO_SEED_VERSION = "v3";
const DEMO_SEED_KEY = "edux-demo-seeded";

/**
 * Seeds demo chat histories into localStorage.
 * Re-seeds whenever DEMO_SEED_VERSION changes, clearing stale test data.
 */
export function seedDemoChatHistory(): void {
  if (typeof window === "undefined") return;

  const alreadySeeded = localStorage.getItem(DEMO_SEED_KEY) === DEMO_SEED_VERSION;
  if (alreadySeeded) return;

  for (const entry of DEMO_HISTORIES) {
    const key = makeKey(entry.userId, entry.chatType, entry.courseId);
    try {
      if (entry.messages.length === 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(entry.messages));
      }
    } catch {
      // localStorage unavailable or full — silently ignore
    }
  }

  localStorage.setItem(DEMO_SEED_KEY, DEMO_SEED_VERSION);
}
