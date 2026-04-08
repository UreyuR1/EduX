/**
 * In-memory store for published teacher messages.
 * Uses globalThis so the Map is shared across all API route modules
 * in the same Node.js process (Next.js dev + prod).
 */

interface PublishedMessage {
  courseId: string;
  topic: string;
  activity: string;
  publishedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __edux_publishedMessages: Map<string, PublishedMessage> | undefined;
}

if (!globalThis.__edux_publishedMessages) {
  globalThis.__edux_publishedMessages = new Map();
}

export const publishedMessages = globalThis.__edux_publishedMessages;
