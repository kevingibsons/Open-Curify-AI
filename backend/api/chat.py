import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.chat import ChatRequest
from services.container import app_container

router = APIRouter(tags=["chat"])


def sse_event(event: str, data: dict) -> bytes:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode("utf-8")


@router.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    app_container.initialize()
    orchestrator = app_container.chat_orchestrator

    async def event_stream():
        async for event in orchestrator.stream_chat(request):
            yield sse_event(event["event"], event["data"])

    return StreamingResponse(event_stream(), media_type="text/event-stream")
