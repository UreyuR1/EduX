from fastapi import APIRouter
from pydantic import BaseModel

from core.rag_pipeline import query_documents

router = APIRouter()


class RAGQueryRequest(BaseModel):
    query: str
    course_id: str | None = None


class RAGQueryResponse(BaseModel):
    chunks: list[str]


@router.post("/query", response_model=RAGQueryResponse)
async def rag_query(req: RAGQueryRequest):
    chunks = query_documents(req.query, course_id=req.course_id)
    return RAGQueryResponse(chunks=chunks)
