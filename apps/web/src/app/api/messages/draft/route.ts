import { NextRequest, NextResponse } from "next/server";
import type { Insight } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { insight, courseName }: { insight: Insight; courseName: string } = body;

  const apiKey = process.env.LLM_API_KEY;
  const provider = process.env.LLM_PROVIDER || "curricullm";
  const baseUrl = process.env.LLM_BASE_URL || "https://api.curricullm.com";
  const model = process.env.LLM_MODEL || "CurricuLLM-AU";

  if (!apiKey) {
    return NextResponse.json(
      { draft: buildFallbackDraft(insight, courseName) },
    );
  }

  const prompt = `You are a teacher at EduX Primary School. Write a warm, professional message to parents about the following class insight.

Course: ${courseName}
Data: ${insight.dataPoint}
Therefore: ${insight.therefore}
Suggestion: ${insight.suggestion}

Write a concise parent message (under 120 words) that:
- Starts with a friendly greeting
- Briefly explains what you noticed without alarm
- Gives 1-2 specific things parents can do at home
- Ends with an encouraging note
- Does NOT mention individual students by name
- Sounds like a real teacher, not a robot

Return ONLY the message text, no subject line or sign-off needed.`;

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        // CurricuLLM-specific: helps model align tone to Australian primary school context
        // Only sent when using the CurricuLLM provider; omitted for standard OpenAI-compatible APIs
        ...(provider === "curricullm" ? {
          curriculum: {
            stage: "Stage 3",
            subject: courseName.toLowerCase().includes("math") ? "Mathematics"
              : courseName.toLowerCase().includes("english") ? "English"
              : courseName.toLowerCase().includes("science") ? "Science"
              : "General",
          },
        } : {}),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ draft: buildFallbackDraft(insight, courseName) });
    }

    const data = await response.json();
    // Strip any <think>...</think> blocks
    let draft: string = data.choices?.[0]?.message?.content ?? "";
    draft = draft.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return NextResponse.json({ draft: draft || buildFallbackDraft(insight, courseName) });
  } catch {
    return NextResponse.json({ draft: buildFallbackDraft(insight, courseName) });
  }
}

function buildFallbackDraft(insight: Insight, courseName: string): string {
  return `Dear families,

I wanted to share a quick update from our ${courseName} class. ${insight.therefore}

${insight.suggestion}

If you have any questions or would like to chat further, please don't hesitate to get in touch. Thank you for your continued support — it makes a real difference!

Warm regards`;
}
