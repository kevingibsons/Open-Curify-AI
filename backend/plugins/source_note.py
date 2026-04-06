from plugins.base import ChatPayload, Plugin


class SourceNotePlugin(Plugin):
    name = "source_note"

    def after_response(self, payload: ChatPayload, text: str) -> str:
        if payload.file_context.strip():
            return f"{text}\n\n_Source: uploaded document context._"
        return text

