from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from core.curricullm import get_llm_client
from core.rag_pipeline import query_documents
from core.prompt_templates import PARENT_SYSTEM_PROMPT, TEACHER_SYSTEM_PROMPT

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    course_id: str | None = None
    student_id: str | None = None
    language: str = "en"
    history: list[dict] = []


@router.post("/parent")
async def parent_chat(req: ChatRequest):
    context_chunks = []
    if req.course_id:
        context_chunks = query_documents(req.message, course_id=req.course_id)

    context_text = "\n---\n".join(context_chunks) if context_chunks else "No relevant context found."

    system_prompt = PARENT_SYSTEM_PROMPT.format(
        language=req.language,
        context=context_text,
    )

    messages = [{"role": "user", "content": m["content"]} if m["role"] == "user"
                else {"role": "assistant", "content": m["content"]}
                for m in req.history]
    messages.append({"role": "user", "content": req.message})

    client = get_llm_client()

    async def event_generator():
        async for token in client.stream_chat(system_prompt, messages):
            yield {"data": token}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())


@router.post("/teacher")
async def teacher_chat(req: ChatRequest):
    system_prompt = TEACHER_SYSTEM_PROMPT

    messages = [{"role": "user", "content": m["content"]} if m["role"] == "user"
                else {"role": "assistant", "content": m["content"]}
                for m in req.history]
    messages.append({"role": "user", "content": req.message})

    client = get_llm_client()

    async def event_generator():
        async for token in client.stream_chat(system_prompt, messages):
            yield {"data": token}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
