from core.file_processor import FileProcessor


def test_process_txt_upload():
    processor = FileProcessor()
    payload = processor.process_upload(
        filename="note.txt",
        content_type="text/plain",
        data=b"Hello from Curify",
    )
    assert payload["text"] == "Hello from Curify"
    assert payload["truncated"] is False
