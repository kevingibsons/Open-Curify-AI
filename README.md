# Open Curify AI

Open Curify AI is a fully local multilingual chatbot built with FastAPI, Next.js 14, Tailwind CSS, and a GGUF Qwen 3 1.7B model served through `llama-cpp-python`. It supports English, Tamil, and Hindi chat, document-aware Q&A for PDF/DOCX/TXT files, SSE streaming, a pluggable orchestration layer, and simple conversation memory for the latest 10 turns.

## Architecture Overview

- `backend/`: FastAPI API, chat orchestration engine, model routing, memory trimming, plugin system, file extraction, and health endpoints
- `frontend/`: Next.js 14 App Router UI with streaming chat, markdown rendering, theme toggle, mode selector, and file upload UX
- `models/`: model config manifest used by the backend
- `plugins/`: project-level plugin examples and extension points
- `configs/`: shared container and runtime configuration
- `docs/`: API and architecture notes

## Features

- Local inference with Qwen 3 1.7B GGUF via `llama-cpp-python`
- Multilingual replies in English, Tamil, or Hindi using offline language detection
- File upload and Q&A for PDF, DOCX, and TXT documents
- Streaming token responses over Server-Sent Events
- Conversation memory capped to the most recent 10 turns
- Chat mode selector with balanced, precise, and creative routing presets
- Plugin hooks for request preprocessing and response postprocessing
- Responsive chat UI with markdown rendering, syntax highlighting, copy actions, and dark/light themes

## Prerequisites

- Python 3.11+
- Node.js 18.17+
- The Qwen GGUF model already available at:
  `C:\Users\kevin\Desktop\CRSYNK OS\models\qwen3-1.7b.gguf`

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements.inference.txt
copy .env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing and Validation

```bash
cd backend
pytest

cd ../frontend
npm run typecheck
```

## Docker

```bash
docker compose -f configs/docker-compose.yml up --build
```

## Notes for Local Inference

- The API will start in mock mode if `llama-cpp-python` is not installed.
- For real Qwen inference on Windows, Python 3.11 is the safest target and `llama-cpp-python` may require Visual Studio Build Tools if a prebuilt wheel is unavailable.
- The included Docker backend installs build tooling automatically for the inference dependency.
