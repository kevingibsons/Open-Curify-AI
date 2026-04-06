from __future__ import annotations

import asyncio
from typing import AsyncGenerator

from core.faq import match_faq_response
from core.language import detect_language
from core.memory import ConversationMemory
from core.model_router import ModelRouter
from core.prompt_builder import build_messages
from core.text_sanitizer import StreamingTextSanitizer
from plugins.base import ChatPayload
from plugins.manager import PluginManager
from schemas.chat import ChatRequest


class ChatOrchestrator:
    def __init__(
        self,
        memory: ConversationMemory,
        router: ModelRouter,
        inference_backend,
        plugin_manager: PluginManager,
    ) -> None:
        self.memory = memory
        self.router = router
        self.inference_backend = inference_backend
        self.plugin_manager = plugin_manager

    async def stream_chat(self, request: ChatRequest) -> AsyncGenerator[dict, None]:
        faq_response = match_faq_response(request.message)
        if faq_response is not None:
            language = detect_language(request.message)
            yield {
                "event": "meta",
                "data": {
                    "language": language,
                    "mode": request.mode,
                    "model": "identity-faq",
                },
            }
            for token in faq_response.split(" "):
                yield {"event": "token", "data": {"token": f"{token} "}}
                await asyncio.sleep(0)
            yield {"event": "done", "data": {"text": faq_response}}
            return

        language = detect_language(request.message)
        history = self.memory.trim(request.history)
        file_context = request.file_context.text if request.file_context else ""

        payload = ChatPayload(
            message=request.message,
            language=language,
            mode=request.mode,
            history=history,
            file_context=file_context,
        )
        payload = self.plugin_manager.before_prompt(payload)

        selection = self.router.select(payload.mode)
        messages = build_messages(
            user_message=payload.message,
            history=payload.history,
            language=payload.language,
            file_context=payload.file_context,
        )

        yield {
            "event": "meta",
            "data": {
                "language": payload.language,
                "mode": selection.profile,
                "model": selection.model_name,
            },
        }

        sanitizer = StreamingTextSanitizer()
        visible_parts: list[str] = []
        async for token in self.inference_backend.stream_chat(messages, selection.parameters):
            visible = sanitizer.process(token)
            if visible:
                visible_parts.append(visible)
                yield {"event": "token", "data": {"token": visible}}

        flushed = sanitizer.flush()
        if flushed:
            visible_parts.append(flushed)
            yield {"event": "token", "data": {"token": flushed}}

        text = self.plugin_manager.after_response(payload, "".join(visible_parts).strip())
        yield {"event": "done", "data": {"text": text}}
