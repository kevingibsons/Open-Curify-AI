# Open Curify AI Architecture

## Layers

1. Frontend sends chat and upload requests to FastAPI.
2. Backend detects language, trims memory, applies plugins, builds prompts, and routes the request to an inference profile.
3. The inference layer streams tokens from a local GGUF model through `llama-cpp-python`.
4. File text is extracted and injected directly into the system prompt for lightweight document Q&A.

