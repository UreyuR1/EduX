"""
Feedback analysis: keyword extraction, sentiment classification, tagging.
"""

from core.curricullm import get_llm_client

ANALYSIS_PROMPT = """Analyze the following parent feedback about their child's learning.
Extract:
1. keywords: list of key topic words
2. sentiment: "positive", "neutral", or "negative"
3. tags: relevant category tags (e.g., "reading-difficulty", "homework-confusion", "positive-feedback")

Feedback: "{feedback}"

Respond in JSON format:
{{"keywords": [...], "sentiment": "...", "tags": [...]}}
"""


async def analyze_feedback(feedback_text: str) -> dict:
    client = get_llm_client()

    response = await client.chat(
        system="You are an educational feedback analyst. Respond only with valid JSON.",
        messages=[{"role": "user", "content": ANALYSIS_PROMPT.format(feedback=feedback_text)}],
    )

    import json
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {
            "keywords": [],
            "sentiment": "neutral",
            "tags": [],
        }
