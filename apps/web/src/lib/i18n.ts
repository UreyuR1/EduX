/**
 * Simple i18n for English and Mandarin.
 */

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.chat": "Chat",
    "nav.switchUser": "Switch User",
    "parent.courses": "Courses",
    "parent.performance": "Performance",
    "parent.weeklyFocus": "This Week's Learning Focus",
    "parent.chat.placeholder": "Ask about your child's learning...",
    "parent.feedback.completion": "Did your child complete this week's learning activity?",
    "parent.feedback.done": "Done",
    "parent.feedback.notYet": "Not yet",
    "parent.feedback.partially": "Partially",
    "parent.feedback.difficulty": "What did your child find most challenging?",
    "teacher.courses": "My Courses",
    "teacher.feedbackOverview": "Parent Feedback Overview",
    "teacher.insights": "Insights",
    "teacher.attention": "Students Needing Attention",
    "teacher.keywords": "Feedback Keywords",
    "teacher.chat.placeholder": "Ask about feedback trends...",
    "teacher.generateMessage": "Generate Parent Message",
    "teacher.publish": "Publish to Parents",
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.send": "Send",
  },
  zh: {
    "nav.dashboard": "仪表盘",
    "nav.chat": "聊天",
    "nav.switchUser": "切换用户",
    "parent.courses": "课程",
    "parent.performance": "学习表现",
    "parent.weeklyFocus": "本周学习重点",
    "parent.chat.placeholder": "询问有关孩子学习的问题...",
    "parent.feedback.completion": "您的孩子是否完成了本周的学习活动？",
    "parent.feedback.done": "已完成",
    "parent.feedback.notYet": "尚未完成",
    "parent.feedback.partially": "部分完成",
    "parent.feedback.difficulty": "您的孩子觉得什么最有挑战性？",
    "teacher.courses": "我的课程",
    "teacher.feedbackOverview": "家长反馈概览",
    "teacher.insights": "洞察",
    "teacher.attention": "需要关注的学生",
    "teacher.keywords": "反馈关键词",
    "teacher.chat.placeholder": "询问反馈趋势...",
    "teacher.generateMessage": "生成家长消息",
    "teacher.publish": "发布给家长",
    "common.loading": "加载中...",
    "common.noData": "暂无数据",
    "common.send": "发送",
  },
};

export function t(key: string, language: string = "en"): string {
  return translations[language]?.[key] || translations["en"]?.[key] || key;
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];
