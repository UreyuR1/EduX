"""
LLM Client abstraction layer.
Supports switching between Anthropic (Haiku 4.5), OpenAI-compatible APIs,
and CurricuLLM via the LLM_PROVIDER environment variable.

Supported providers (LLM_PROVIDER):
  anthropic   — Anthropic Claude (default, dev)
  openai      — OpenAI or any OpenAI-compatible API (OpenAI, Together, Groq, DeepSeek, etc.)
  curricullm  — CurricuLLM (production, placeholder)
"""

import json
import os
from abc import ABC, abstractmethod

import anthropic
import httpx


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


class OpenAICompatibleClient(LLMClient):
    """
    Client for any OpenAI-compatible API.
    Works with OpenAI, Together AI, Groq, DeepSeek, Mistral, Ollama, and more.

    Environment variables:
      OPENAI_API_KEY   — API key (required)
      OPENAI_BASE_URL  — Base URL (default: https://api.openai.com/v1)
      OPENAI_MODEL     — Model name (default: gpt-4o-mini)
    """

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.http = httpx.AsyncClient(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=60.0,
        )

    async def chat(self, system: str, messages: list[dict]) -> str:
        payload = {
            "model": self.model,
            "max_tokens": 2048,
            "messages": [{"role": "system", "content": system}, *messages],
        }
        response = await self.http.post("/chat/completions", json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    async def stream_chat(self, system: str, messages: list[dict]):
        payload = {
            "model": self.model,
            "max_tokens": 2048,
            "messages": [{"role": "system", "content": system}, *messages],
            "stream": True,
        }
        async with self.http.stream("POST", "/chat/completions", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:].strip()
                if data == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                    content = chunk["choices"][0]["delta"].get("content", "")
                    if content:
                        yield content
                except (json.JSONDecodeError, KeyError):
                    continue


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
        elif provider == "openai":
            _client = OpenAICompatibleClient()
        else:
            _client = AnthropicClient()
    return _client
