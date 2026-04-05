"""
LLM Client abstraction layer.
Supports switching between Anthropic (Haiku 4.5) and CurricuLLM API
via the LLM_PROVIDER environment variable.
"""

import os
from abc import ABC, abstractmethod

import anthropic


class LLMClient(ABC):
    @abstractmethod
    async def chat(self, system: str, messages: list[dict]) -> str:
        """Single-turn chat completion, returns full response text."""
        ...

    @abstractmethod
    async def stream_chat(self, system: str, messages: list[dict]):
        """Streaming chat completion, yields tokens as async generator."""
        ...


class AnthropicClient(LLMClient):
    def __init__(self):
        base_url = os.getenv("ANTHROPIC_BASE_URL")
        kwargs: dict = {"api_key": os.getenv("ANTHROPIC_API_KEY")}
        if base_url:
            kwargs["base_url"] = base_url
        self.client = anthropic.AsyncAnthropic(**kwargs)
        self.model = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20250401")

    async def chat(self, system: str, messages: list[dict]) -> str:
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            system=system,
            messages=messages,
        )
        return response.content[0].text

    async def stream_chat(self, system: str, messages: list[dict]):
        async with self.client.messages.stream(
            model=self.model,
            max_tokens=2048,
            system=system,
            messages=messages,
        ) as stream:
            async for text in stream.text_stream:
                yield text


class CurricuLLMClient(LLMClient):
    """
    Placeholder for CurricuLLM API integration.
    Replace with actual API calls once access is granted.
    """

    def __init__(self):
        self.api_key = os.getenv("CURRICULLM_API_KEY")
        self.base_url = os.getenv("CURRICULLM_BASE_URL", "https://api.curricullm.com")

    async def chat(self, system: str, messages: list[dict]) -> str:
        # TODO: Implement actual CurricuLLM API call
        raise NotImplementedError("CurricuLLM API not yet available")

    async def stream_chat(self, system: str, messages: list[dict]):
        # TODO: Implement actual CurricuLLM streaming
        raise NotImplementedError("CurricuLLM API not yet available")


_client: LLMClient | None = None


def get_llm_client() -> LLMClient:
    global _client
    if _client is None:
        provider = os.getenv("LLM_PROVIDER", "anthropic")
        if provider == "curricullm":
            _client = CurricuLLMClient()
        else:
            _client = AnthropicClient()
    return _client
