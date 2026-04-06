# Plugins

Backend plugins live in `backend/plugins` and use a simple hook model:

- `before_prompt(payload)` can adjust the request before prompt generation
- `after_response(payload, text)` can transform or annotate the final assistant message

