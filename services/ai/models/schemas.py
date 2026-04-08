"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel


class FeedbackAnalysis(BaseModel):
    keywords: list[str]
    sentiment: str
    tags: list[str]


class HealthResponse(BaseModel):
    status: str
