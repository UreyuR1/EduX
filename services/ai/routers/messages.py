from fastapi import APIRouter
from pydantic import BaseModel

from core.curricullm import get_llm_client
from core.prompt_templates import MESSAGE_DRAFT_PROMPT

router = APIRouter()


class DraftRequest(BaseModel):
    insight_context: str
    teacher_notes: str = ""
    course_name: str
    language: str = "en"


class DraftResponse(BaseModel):
    draft: str


@router.post("/draft", response_model=DraftResponse)
async def draft_message(req: DraftRequest):
    client = get_llm_client()

    prompt = MESSAGE_DRAFT_PROMPT.format(
        insight=req.insight_context,
        teacher_notes=req.teacher_notes,
        course_name=req.course_name,
        language=req.language,
    )

    response = await client.chat(
        system="You are a helpful assistant that drafts warm, encouraging messages from teachers to parents about their children's learning.",
        messages=[{"role": "user", "content": prompt}],
    )

    return DraftResponse(draft=response)
