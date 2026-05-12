# AI Gmail Agent — n8n Setup

![n8n](https://img.shields.io/badge/n8n-AI%20Automation-orange?style=for-the-badge&logo=n8n)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge&logo=google)
![Gmail](https://img.shields.io/badge/Gmail-Integration-red?style=for-the-badge&logo=gmail)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)

---

# 📧 AI Gmail Agent — n8n Workflow

This folder contains the **n8n workflow configuration** for the **AI Gmail Agent** project.

The workflow powers an AI-driven Gmail assistant capable of sending emails using natural language prompts. It integrates **Google Gemini**, **Gmail**, and **memory-enabled AI orchestration** through n8n.

## 🏗️ System Architecture

```text
React Frontend
      ↓
FastAPI Backend
      ↓
n8n Webhook
      ↓
AI Agent + Gemini + Gmail
```

---

# ✨ Features

- 🤖 AI-powered Gmail assistant
- ✉️ Send emails using natural language
- 🧠 AI Agent workflow orchestration
- 💾 Memory support with Simple Memory
- 🔗 Google Gemini integration
- 📬 Gmail integration
- 🌐 Webhook-based communication
- ⚡ FastAPI to n8n connectivity
- 🐳 Docker-friendly setup
- 🔒 Secure credential handling

---

# 📁 Folder Structure

```text
n8n/
├── workflows/
│   └── ai-mail-agent.json
└── README.md
```

---

# ⚙️ Requirements

Before running the workflow, ensure you have the following installed/configured:

| Requirement | Description |
|---|---|
| n8n | Workflow automation platform |
| Docker (Optional) | Recommended way to run n8n |
| Gemini API Key | Required for AI agent |
| Gmail OAuth Credentials | Required for sending emails |
| Node.js (Optional) | For local n8n installation |

---

# 🚀 How to Run n8n

## Option 1 — Run with Docker (Recommended)

```bash
docker run -it --rm \
-p 5678:5678 \
-v ~/.n8n:/home/node/.n8n \
n8nio/n8n
```

After starting:

- Open your browser
- Visit:

```text
http://localhost:5678
```

---

## Option 2 — Local Installation

Install n8n globally:

```bash
npm install n8n -g
```

Start n8n:

```bash
n8n
```

Open:

```text
http://localhost:5678
```

---

# 📥 Importing the Workflow

## Step-by-Step

1. Open n8n dashboard
2. Click **Import**
3. Select:

```text
workflows/ai-mail-agent.json
```

4. Save the workflow
5. Configure credentials
6. Activate the workflow

---

# 🧠 Workflow Architecture

The workflow is composed of multiple interconnected nodes.

## 1. Webhook Trigger

### Purpose

Receives requests from the FastAPI backend.

### Responsibilities

- Accept incoming HTTP requests
- Receive user prompts
- Start the AI workflow

Example:

```http
POST /webhook/ai-mail-agent
```

---

## 2. Edit Fields

### Purpose

Formats and structures incoming data before passing it to the AI Agent.

### Responsibilities

- Clean incoming payload
- Extract prompt/message
- Prepare workflow variables

---

## 3. AI Agent

### Purpose

Core orchestration node that controls the AI workflow logic.

### Responsibilities

- Interpret user intent
- Decide actions
- Coordinate Gemini + Gmail tools
- Manage responses

---

## 4. Gemini Chat Model

### Purpose

Provides natural language intelligence using Google's Gemini API.

### Responsibilities

- Generate email content
- Understand prompts
- Produce conversational responses

Example prompt:

```text
Send an email to John saying the meeting is postponed until tomorrow.
```

---

## 5. Simple Memory

### Purpose

Stores temporary conversational context.

### Responsibilities

- Maintain session context
- Improve multi-turn conversations
- Remember previous instructions

---

## 6. Gmail Tool

### Purpose

Handles Gmail operations.

### Responsibilities

- Send emails
- Connect to Gmail account
- Execute email actions securely

---

# 🌐 Webhook Configuration

Example webhook endpoint:

```text
http://localhost:5678/webhook/ai-mail-agent
```

## FastAPI Integration Flow

```text
Frontend → FastAPI → n8n Webhook → AI Workflow
```

### Example FastAPI Request

```python
import requests

payload = {
    "prompt": "Send an email to Alex about the project update."
}

response = requests.post(
    "http://localhost:5678/webhook/ai-mail-agent",
    json=payload
)

print(response.json())
```

---

# 🤖 Gemini API Setup

## Step 1 — Create Gemini API Key

Go to:

```text
https://aistudio.google.com/app/apikey
```

Generate a new API key.

---

## Step 2 — Add Credentials in n8n

Inside n8n:

1. Go to **Credentials**
2. Create new **Google Gemini API**
3. Paste your API key

---

## Step 3 — Use Environment Variables

Recommended approach:

```text
{{$env.GEMINI_API_KEY}}
```

This avoids hardcoding secrets in workflows.

---

# 📬 Gmail OAuth Setup

## Step 1 — Create Google Cloud Project

Visit:

```text
https://console.cloud.google.com/
```

Create a new project.

---

## Step 2 — Enable Gmail API

Enable:

```text
Gmail API
```

---

## Step 3 — Configure OAuth Consent Screen

- Configure app name
- Add scopes
- Add test users if required

---

## Step 4 — Create OAuth Credentials

Create:

```text
OAuth 2.0 Client ID
```

Set redirect URI from n8n.

Example:

```text
http://localhost:5678/rest/oauth2-credential/callback
```

---

## Step 5 — Connect Gmail in n8n

Inside n8n:

1. Open Credentials
2. Add Gmail OAuth2 API
3. Paste Client ID and Secret
4. Authenticate with Google

---

# 🔐 Environment Variables

Example `.env` file:

```env
GEMINI_API_KEY=your_key_here
N8N_ENCRYPTION_KEY=your_secret_key
```

Optional variables:

```env
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678
```

---

# 🐳 Docker Compose Example

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - ~/.n8n:/home/node/.n8n
```

Start container:

```bash
docker compose up -d
```

Stop container:

```bash
docker compose down
```

---

# 🔒 Security Notes

## Important Recommendations

### ❌ Never Upload

- `.env`
- `.n8n/`
- `database.sqlite`
- OAuth secrets
- API keys

### ✅ Safe to Upload

- Workflow JSON files
- README documentation
- Docker Compose files (without secrets)

---

# 📦 GitHub Best Practices

## Recommended Repository Structure

```text
project-root/
├── frontend/
├── backend/
├── n8n/
│   ├── workflows/
│   └── README.md
├── .gitignore
└── docker-compose.yml
```

---

## Example `.gitignore`

```gitignore
.env
.n8n/
database.sqlite
node_modules/
__pycache__/
```

---

# 🛠️ Troubleshooting

## 1. Webhook Not Responding

### Possible Causes

- Workflow not activated
- Wrong webhook URL
- n8n not running

### Solution

- Activate workflow
- Verify endpoint URL
- Restart n8n

---

## 2. Session ID Errors

### Cause

Memory node expects a session identifier.

### Solution

Pass a session ID in the payload:

```json
{
  "sessionId": "user-123",
  "prompt": "Send an email to Sarah."
}
```

---

## 3. No Prompt Specified

### Cause

Prompt field missing in request body.

### Solution

Ensure payload contains:

```json
{
  "prompt": "Your message here"
}
```

---

## 4. Gmail Authentication Issues

### Common Problems

- Invalid OAuth credentials
- Redirect URI mismatch
- Gmail API disabled

### Solution

- Verify OAuth setup
- Check redirect URL
- Reconnect Gmail credentials

---

## 5. Gemini Authentication Issues

### Cause

Invalid or missing API key.

### Solution

Verify:

```env
GEMINI_API_KEY=your_valid_key
```

Restart n8n after updating environment variables.

---

# 🚀 Future Improvements

Potential enhancements for the AI Gmail Agent:

- 🔎 RAG-powered email search
- 📎 Attachment support
- 👥 Multi-user authentication
- ⚡ Streaming AI responses
- 🖥️ Desktop application integration
- 📅 Calendar integration
- 🧵 Email threading support
- 📊 Analytics dashboard

---

# 📄 Example Workflow Request

Example API payload:

```json
{
  "sessionId": "user-001",
  "prompt": "Send an email to mike@example.com saying the demo is scheduled for Friday."
}
```

---

# 🧪 Example Response

```json
{
  "success": true,
  "message": "Email sent successfully."
}
```

---

# 🏁 Conclusion

The **AI Gmail Agent n8n workflow** provides a scalable and modular architecture for building AI-powered email automation systems.

Using:

- React frontend
- FastAPI backend
- n8n automation
- Google Gemini AI
- Gmail integration

You can create a powerful natural-language email assistant with minimal infrastructure complexity.

---

# 📜 License

This project is licensed under the MIT License.