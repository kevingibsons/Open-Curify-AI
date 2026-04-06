import io
from pathlib import Path

from docx import Document
from pypdf import PdfReader

from config import settings


class FileProcessor:
    allowed_extensions = {".pdf", ".docx", ".txt"}
    allowed_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/octet-stream",
    }

    def process_upload(self, filename: str, content_type: str, data: bytes) -> dict:
        if len(data) > settings.max_file_size_mb * 1024 * 1024:
            raise ValueError(f"File exceeds {settings.max_file_size_mb} MB limit.")

        extension = Path(filename).suffix.lower()
        if extension not in self.allowed_extensions:
            raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")

        if content_type and content_type not in self.allowed_types:
            raise ValueError("Unsupported content type for uploaded file.")

        text = self.extract_text(data, extension)
        normalized = " ".join(text.split())
        if not normalized:
            raise ValueError("No readable text could be extracted from the file.")

        truncated_text = normalized[: settings.max_file_characters]
        return {
            "filename": filename,
            "content_type": content_type or self._guess_type(extension),
            "text": truncated_text,
            "truncated": len(normalized) > settings.max_file_characters,
            "characters": len(normalized),
        }

    def extract_text(self, data: bytes, extension: str) -> str:
        if extension == ".pdf":
            return self._from_pdf(data)
        if extension == ".docx":
            return self._from_docx(data)
        if extension == ".txt":
            return data.decode("utf-8", errors="replace")
        raise ValueError("Unsupported file type.")

    @staticmethod
    def _from_pdf(data: bytes) -> str:
        reader = PdfReader(io.BytesIO(data))
        parts: list[str] = []
        for page in reader.pages:
            text = page.extract_text()
            if text and text.strip():
                parts.append(text.strip())
        return "\n\n".join(parts)

    @staticmethod
    def _from_docx(data: bytes) -> str:
        document = Document(io.BytesIO(data))
        return "\n\n".join(paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip())

    @staticmethod
    def _guess_type(extension: str) -> str:
        if extension == ".pdf":
            return "application/pdf"
        if extension == ".docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        return "text/plain"
