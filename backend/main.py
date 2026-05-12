from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import uuid
import os

# =========================================================
# Load Environment Variables
# =========================================================

load_dotenv()

# =========================================================
# FastAPI App
# =========================================================

app = FastAPI(
    title="AI Mail Agent Backend",
    version="1.0.0"
)

# =========================================================
# CORS Configuration
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Environment Variables
# =========================================================

N8N_WEBHOOK = os.getenv(
    "N8N_WEBHOOK",
    "http://localhost:5678/webhook/ai-mail-agent"
)

# =========================================================
# Request Models
# =========================================================

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


# =========================================================
# Root Route
# =========================================================

@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "AI Mail Agent Backend"
    }


# =========================================================
# Health Check
# =========================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


# =========================================================
# Chat Endpoint
# =========================================================

@app.post("/chat")
async def chat(req: ChatRequest):

    try:

        # ---------------------------------------------
        # Session ID
        # ---------------------------------------------

        session_id = req.session_id or str(uuid.uuid4())

        # ---------------------------------------------
        # Payload for n8n
        # ---------------------------------------------

        payload = {
            "sessionId": session_id,
            "message": req.message
        }

        # ---------------------------------------------
        # Send Request to n8n
        # ---------------------------------------------

        async with httpx.AsyncClient(
            timeout=120.0
        ) as client:

            response = await client.post(
                N8N_WEBHOOK,
                json=payload
            )

        # ---------------------------------------------
        # Handle n8n Errors
        # ---------------------------------------------

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"n8n returned status {response.status_code}"
            )

        # ---------------------------------------------
        # Parse Response
        # ---------------------------------------------

        try:
            data = response.json()

        except Exception:
            data = {
                "reply": response.text
            }

        # ---------------------------------------------
        # Extract AI Response
        # ---------------------------------------------

        reply = None

        if isinstance(data, dict):

            reply = (
                data.get("reply")
                or data.get("output")
                or data.get("message")
                or data.get("text")
            )

        # If still nothing
        if not reply:
            reply = str(data)

        # ---------------------------------------------
        # Return to Frontend
        # ---------------------------------------------

        return {
            "success": True,
            "session_id": session_id,
            "response": {
                "reply": reply
            }
        }

    except httpx.ConnectError:

        raise HTTPException(
            status_code=500,
            detail="Could not connect to n8n server"
        )

    except httpx.TimeoutException:

        raise HTTPException(
            status_code=500,
            detail="n8n request timed out"
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )