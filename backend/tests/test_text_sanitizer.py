from core.text_sanitizer import StreamingTextSanitizer


def test_streaming_text_sanitizer_removes_think_blocks():
    sanitizer = StreamingTextSanitizer()
    output = []
    for chunk in ["<thi", "nk>hidden", "</think>", "Visible"]:
        output.append(sanitizer.process(chunk))
    output.append(sanitizer.flush())
    assert "".join(output) == "Visible"
