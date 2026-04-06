from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["system", "user", "assistant"]
Mode = Literal["balanced", "precise", "creative"]


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(min_length=1)


class FileContext(BaseModel):
    filename: str
    content_type: str
    text: str
    truncated: bool = False


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)
    mode: Mode = "balanced"
    file_context: FileContext | None = None
