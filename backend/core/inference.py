from __future__ import annotations

import asyncio
import os
from typing import AsyncGenerator

from config import settings

try:
    from llama_cpp import Llama
except ImportError:  # pragma: no cover
    Llama = None


class InferenceBackend:
    async def stream_chat(self, messages: list[dict], parameters: dict) -> AsyncGenerator[str, None]:
        raise NotImplementedError

    def health(self) -> dict:
        raise NotImplementedError


class LlamaCppBackend(InferenceBackend):
    def __init__(self) -> None:
        self._llm = None

    def load(self) -> None:
        if self._llm is not None or Llama is None:
            return

        threads = settings.model_threads if settings.model_threads > 0 else max(1, (os.cpu_count() or 2) - 1)
        self._llm = Llama(
            model_path=settings.model_path,
            n_ctx=settings.model_context_length,
            n_batch=settings.model_batch_size,
            n_threads=threads,
            use_mmap=settings.model_use_mmap,
            chat_format="chatml",
            verbose=False,
        )

    async def stream_chat(self, messages: list[dict], parameters: dict) -> AsyncGenerator[str, None]:
        self.load()
        if self._llm is None:
            raise RuntimeError("llama-cpp-python is not installed.")

        queue: asyncio.Queue[str | None] = asyncio.Queue()
        loop = asyncio.get_running_loop()

        def worker() -> None:
            stream = self._llm.create_chat_completion(
                messages=messages,
                stream=True,
                max_tokens=parameters.get("max_tokens", 512),
                temperature=parameters.get("temperature", 0.7),
                top_p=parameters.get("top_p", 0.9),
                repeat_penalty=parameters.get("repeat_penalty", 1.05),
            )
            for item in stream:
                delta = item["choices"][0]["delta"].get("content", "")
                if delta:
                    asyncio.run_coroutine_threadsafe(queue.put(delta), loop).result()
            asyncio.run_coroutine_threadsafe(queue.put(None), loop).result()

        producer = asyncio.create_task(asyncio.to_thread(worker))
        while True:
            token = await queue.get()
            if token is None:
                break
            yield token
        await producer

    def health(self) -> dict:
        return {
            "provider": "llama_cpp",
            "model_path": settings.model_path,
            "loaded": self._llm is not None,
            "context_length": settings.model_context_length,
        }


class MockInferenceBackend(InferenceBackend):
    async def stream_chat(self, messages: list[dict], parameters: dict) -> AsyncGenerator[str, None]:
        response = (
            "Mock backend active. Install llama-cpp-python and provide the GGUF model to get real local inference."
        )
        for token in response.split(" "):
            yield f"{token} "
            await asyncio.sleep(0)

    def health(self) -> dict:
        return {"provider": "mock", "loaded": True, "context_length": settings.model_context_length}
