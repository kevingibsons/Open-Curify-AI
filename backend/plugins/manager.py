from plugins.base import ChatPayload, Plugin
from plugins.source_note import SourceNotePlugin


class PluginManager:
    def __init__(self) -> None:
        self.plugins: list[Plugin] = [SourceNotePlugin()]

    def before_prompt(self, payload: ChatPayload) -> ChatPayload:
        current = payload
        for plugin in self.plugins:
            current = plugin.before_prompt(current)
        return current

    def after_response(self, payload: ChatPayload, text: str) -> str:
        current = text
        for plugin in self.plugins:
            current = plugin.after_response(payload, current)
        return current
