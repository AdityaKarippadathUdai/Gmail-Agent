from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uuid

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

N8N_WEBHOOK = "http://localhost:5678/webhook/ai-mail-agent"


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


@app.post("/chat")
async def chat(req: ChatRequest):

    session_id = req.session_id or str(uuid.uuid4())

    payload = {
        "sessionId": session_id,
        "message": req.message
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            N8N_WEBHOOK,
            json=payload
        )

    try:
        data = response.json()
    except:
        data = {"reply": response.text}

    return {
        "session_id": session_id,
        "response": data
    }