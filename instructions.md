# Local Development Setup Guide

## API Usage Examples

### cURL Examples

curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project", "description": "Test Description"}'

curl -X GET http://localhost:8000/api/v1/projects

curl -X POST http://localhost:8000/api/v1/projects/1/files \
  -F "files=@/path/to/file.pdf" \
  -F "files=@/path/to/another.docx"

curl -X GET http://localhost:8000/api/v1/projects/1/files

curl -X POST http://localhost:8000/api/v1/projects/1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": [
      {
        "title": "Extract Date",
        "data_type": "string",
        "description": "Find the document date"
      }
    ]
  }'

curl -X POST http://localhost:8000/api/v1/projects/1/chat-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Chat",
    "file_ids": [1, 2],
    "session_type": "document"
  }'

curl -X GET http://localhost:8000/api/v1/projects/1/chat-sessions

curl -X POST http://localhost:8000/api/v1/chat-sessions/1/update \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Chat Name"}'

curl -X POST http://localhost:8000/api/v1/chat-sessions/1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What does the document say about X?",
    "additional_data": null
  }'

curl -X GET http://localhost:8000/api/v1/chat-sessions/1/messages
```