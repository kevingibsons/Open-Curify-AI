from schemas.chat import ChatMessage


class ConversationMemory:
    def __init__(self, max_turns: int) -> None:
        self.max_turns = max_turns

    def trim(self, history: list[ChatMessage]) -> list[dict]:
        max_messages = self.max_turns * 2
        trimmed = history[-max_messages:]
        return [message.model_dump() for message in trimmed if message.role in {"user", "assistant"}]

