/**
 * Shared TypeScript types for the EduX frontend.
 */

export interface Course {
  id: string;
  name: string;
  yearLevel: string;
  subject: string;
  syllabusPlain: string;
  currentWeek: number;
  totalWeeks: number;
  teacherId: string;
  teacherName?: string;
}

export interface PerformanceNote {
  id: string;
  label: string;
  details?: string;
  studentId: string;
  courseId: string;
}

export interface WeeklyFocus {
  id: string;
  weekNumber: number;
  topic: string;
  activity: string;
  source: "auto" | "teacher";
  courseId: string;
}

export interface Feedback {
  id: string;
  type: "completion" | "difficulty" | "open";
  value: string;
  tags: string[];
  sentiment?: string;
  parentId: string;
  courseId: string;
  createdAt: string;
}

export interface Insight {
  id: string;
  dataPoint: string;
  therefore: string;
  suggestion: string;
  status: "NEW" | "ACTIONED" | "DISMISSED";
  courseId: string;
}

export interface FeedbackAggregate {
  courseId: string;
  completionRate: number;
  topTags: { tag: string; count: number }[];
  sentimentDistribution: { positive: number; neutral: number; negative: number };
}

export interface StudentAttention {
  id: string;
  name: string;
  flags: string[];
  concerns: string[]; // actual feedback values behind "Multiple parent concerns"
  courseId: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
}
