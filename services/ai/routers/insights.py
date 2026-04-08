from fastapi import APIRouter
from pydantic import BaseModel

from core.curricullm import get_llm_client
from core.prompt_templates import INSIGHT_GENERATION_PROMPT

router = APIRouter()


class FeedbackSummary(BaseModel):
    course_id: str
    course_name: str
    completion_rate: float
    top_tags: list[str]
    sentiment_distribution: dict[str, int]
    sample_comments: list[str] = []


class InsightItem(BaseModel):
    data_point: str
    therefore: str
    suggestion: str


class InsightResponse(BaseModel):
    insights: list[InsightItem]


@router.post("/generate", response_model=InsightResponse)
async def generate_insights(summary: FeedbackSummary):
    client = get_llm_client()

    prompt = INSIGHT_GENERATION_PROMPT.format(
        course_name=summary.course_name,
        completion_rate=summary.completion_rate,
        top_tags=", ".join(summary.top_tags),
        sentiment=str(summary.sentiment_distribution),
        comments="\n".join(summary.sample_comments),
    )

    response = await client.chat(
        system="You are an educational data analyst. Generate actionable insights for teachers.",
        messages=[{"role": "user", "content": prompt}],
    )

    # Parse response into structured insights
    # For MVP, return the raw response as a single insight
    return InsightResponse(insights=[
        InsightItem(
            data_point=f"{summary.completion_rate:.0%} completion rate. Top concerns: {', '.join(summary.top_tags)}",
            therefore="Students may need reinforcement on these topics.",
            suggestion=response,
        )
    ])
