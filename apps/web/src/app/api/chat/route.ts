import { NextRequest } from "next/server";
import { getCourses, getWeeklyFocus } from "@/lib/mock-data";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, course_id, student_id, language, history } = body;
  const chatType = body.chat_type || "parent";

  try {
    // Try FastAPI service first
    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat/${chatType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, course_id, student_id, language, history }),
    });

    if (aiResponse.ok && aiResponse.body) {
      return new Response(aiResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
    throw new Error("AI service unavailable");
  } catch {
    // Fallback: call LLM directly via OpenAI-compatible API
    return handleDirectLLM(message, course_id, language, history, chatType);
  }
}

async function handleDirectLLM(
  message: string,
  courseId: string | null,
  language: string,
  history: Array<{ role: string; content: string }>,
  chatType: string
) {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || "https://sz.uyilink.com";
  const model = process.env.LLM_MODEL || "gpt-5.4-mini";

  if (!apiKey) {
    return sseError("I'm currently unavailable. Please check the API configuration.");
  }

  // Build context from mock data
  let context = "";
  console.error("[CHAT DEBUG] courseId =", JSON.stringify(courseId));
  if (courseId) {
    try {
      const course = getCourses().find((c) => c.id === courseId);
      const focus = getWeeklyFocus(courseId);
      if (course) {
        context = `Course: ${course.name} (${course.yearLevel})\nTeacher: ${course.teacherName}\nWeek ${course.currentWeek} of ${course.totalWeeks}\n\nSyllabus:\n${course.syllabusPlain.slice(0, 3000)}`;
        if (focus) {
          context += `\n\nThis week's focus: ${focus.topic}\nActivity: ${focus.activity}`;
        }
      }
    } catch (err) {
      console.error("Failed to load course context:", err);
    }
  }
  console.error("[CHAT DEBUG] context length =", context.length);

  const systemPrompt =
    chatType === "teacher"
      ? `You are a Data Analysis Assistant for teachers. Be concise, professional, and action-oriented. Present information in "data → therefore → suggestion" format. Never expose individual parent conversations verbatim. Use supportive language.`
      : `You are a friendly Learning Advisor for parents at Riverside Primary School. You have FULL ACCESS to the child's course syllabus and weekly learning plan below. Use this information to answer the parent's questions accurately.

IMPORTANT RULES:
- Answer ONLY based on the COURSE DATA provided below. You HAVE this data — use it confidently.
- Be warm, encouraging, and specific. Reference the actual topics and activities from the syllabus.
- If the parent asks about something not covered in the syllabus data, say: "I don't have information on that yet. You may want to ask ${context ? "the teacher" : "your child's teacher"} directly."
- Never fabricate grades, assessments, or teacher comments
- Explain curriculum concepts in plain, jargon-free language
- Suggest specific at-home learning activities when relevant
- Keep responses concise (2-3 short paragraphs max)
- Respond in ${language === "zh" ? "Chinese (Simplified)" : "English"}

COURSE DATA:
${context || "No course data is currently available. Let the parent know you don't have access to their child's course information yet."}`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Inject context as a separate user→assistant exchange so models treat it as established facts
  if (context) {
    messages.push(
      { role: "user", content: "[System: The following is the child's course data. Use it to answer all questions.]" },
      { role: "assistant", content: `I have the following course data:\n\n${context}\n\nI'll use this information to answer your questions about your child's learning.` }
    );
  }

  messages.push(
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  );

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        messages,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text().catch(() => "Unknown error");
      console.error("LLM API error:", response.status, errText);
      return sseError(`Sorry, I encountered an error (${response.status}). Please try again.`);
    }

    // Transform OpenAI SSE stream to our simple SSE format
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";
          let insideThink = false; // track <think>...</think> reasoning blocks
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  let delta: string = parsed.choices?.[0]?.delta?.content ?? "";
                  if (!delta) continue;

                  // Strip <think>...</think> reasoning blocks (may span chunks)
                  let output = "";
                  let i = 0;
                  while (i < delta.length) {
                    if (!insideThink) {
                      const start = delta.indexOf("<think>", i);
                      if (start === -1) {
                        output += delta.slice(i);
                        break;
                      }
                      output += delta.slice(i, start);
                      insideThink = true;
                      i = start + 7;
                    } else {
                      const end = delta.indexOf("</think>", i);
                      if (end === -1) {
                        i = delta.length; // still inside, consume rest
                        break;
                      }
                      insideThink = false;
                      i = end + 8;
                    }
                  }

                  if (output) {
                    // JSON-encode so spaces and newlines are preserved correctly
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(output)}\n\n`));
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("LLM fetch error:", err);
    return sseError("Sorry, I couldn't connect to the AI service. Please try again.");
  }
}

function sseError(message: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
