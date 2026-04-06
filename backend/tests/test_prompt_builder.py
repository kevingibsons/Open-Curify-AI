from core.prompt_builder import build_messages


def test_build_messages_includes_document_context():
    messages = build_messages(
        user_message="Summarize this file",
        history=[{"role": "user", "content": "Hi"}],
        language="en",
        file_context="Document body",
    )
    assert messages[0]["role"] == "system"
    assert "Document body" in messages[0]["content"]
    assert messages[-1]["content"] == "Summarize this file"

