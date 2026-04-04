/**
 * Mock auth system for hackathon demo.
 * Hardcoded users with role-based switching via dropdown.
 */

export type Role = "TEACHER" | "PARENT";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  language: string;
  childName?: string; // For parent users
}

export const MOCK_USERS: MockUser[] = [
  // Teachers
  {
    id: "teacher-1",
    name: "Ms. Sarah Chen",
    email: "sarah.chen@riverside.edu.au",
    role: "TEACHER",
    language: "en",
  },
  {
    id: "teacher-2",
    name: "Mr. James Nguyen",
    email: "james.nguyen@riverside.edu.au",
    role: "TEACHER",
    language: "en",
  },
  // Parents
  {
    id: "parent-1",
    name: "Li Wei",
    email: "li.wei@example.com",
    role: "PARENT",
    language: "zh",
    childName: "Li Junjie",
  },
  {
    id: "parent-2",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    role: "PARENT",
    language: "en",
    childName: "Oliver Thompson",
  },
  {
    id: "parent-3",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    role: "PARENT",
    language: "en",
    childName: "Arjun Sharma",
  },
];

const STORAGE_KEY = "edux-current-user";

export function getCurrentUser(): MockUser {
  if (typeof window === "undefined") return MOCK_USERS[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const user = MOCK_USERS.find((u) => u.id === stored);
    if (user) return user;
  }
  return MOCK_USERS[0];
}

export function setCurrentUser(userId: string): MockUser | null {
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (user) {
    localStorage.setItem(STORAGE_KEY, userId);
    return user;
  }
  return null;
}

export function getUsersByRole(role: Role): MockUser[] {
  return MOCK_USERS.filter((u) => u.role === role);
}
