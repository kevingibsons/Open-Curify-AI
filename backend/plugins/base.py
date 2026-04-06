from dataclasses import dataclass


@dataclass
class ChatPayload:
    message: str
    language: str
    mode: str
    history: list[dict]
    file_context: str


class Plugin:
    name = "base"

    def before_prompt(self, payload: ChatPayload) -> ChatPayload:
        return payload

    def after_response(self, payload: ChatPayload, text: str) -> str:
        return text

