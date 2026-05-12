# 🚀 AI Gmail Agent

<div align="center">

# AI Gmail Agent

### ✨ AI-powered Gmail assistant built with React, FastAPI, n8n & Gemini API

An intelligent Gmail automation platform that allows users to send emails, draft responses, summarize inbox messages, and automate workflows using natural language conversations.

<br/>

![App Preview](./assets/preview.png)

<br/>

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![Gemini](https://img.shields.io/badge/Gemini-AI--Powered-4285F4?style=for-the-badge&logo=google-gemini)
![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

</div>

---

# 📌 Overview

AI Gmail Agent is a production-grade AI email assistant that combines the power of:

- ⚛️ React + Vite frontend
- ⚡ FastAPI backend
- 🤖 Gemini integration
- 🔄 n8n workflow automation
- 📧 Gmail API integration
- 🧠 Session-based AI memory
- 🐳 Docker deployment

The platform allows users to interact with Gmail using natural language in a modern conversational interface.

---

# 📸 Screenshots


## 💬 Chat Interface

![Chat UI](/assets/chat-ui.png)

---


## 🔄 n8n Workflow

![Workflow](/assets/workflow.png)


---

# ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Email Drafting | Generate professional emails using AI |
| 📧 Gmail Sending | Send emails directly through Gmail |
| 🧠 Conversational AI | Natural language email assistant |
| 💾 Session Memory | Persistent chat context support |
| ⚡ FastAPI Backend | High-performance backend APIs |
| 🔄 n8n Automation | Visual workflow automation |
| 🐳 Docker Support | Fully containerized deployment |
| 🎨 Modern React UI | Beautiful responsive frontend |
| 📝 Markdown Rendering | Rich AI responses |
| 🔐 Session Handling | Secure conversation management |
| 🔗 API-Based Architecture | Clean frontend/backend separation |

---

# 🛠 Tech Stack

## 🎨 Frontend

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Fast development bundler |
| TailwindCSS | Styling |
| Axios | API communication |
| Framer Motion | UI animations |

---

## ⚡ Backend

| Technology | Purpose |
|---|---|
| FastAPI | REST API backend |
| Uvicorn | ASGI server |
| httpx | Async HTTP requests |
| Pydantic | Data validation |

---

## 🤖 Automation & AI

| Technology | Purpose |
|---|---|
| n8n | Workflow automation |
| Gemini | AI capabilities |
| Gmail API | Email integration |

---

## 🐳 DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

# 🏗 System Architecture

```text
                ┌───────────────┐
                │     User      │
                └──────┬────────┘
                       │
                       ▼
            ┌────────────────────┐
            │  React Frontend    │
            │   Chat Interface   │
            └────────┬───────────┘
                     │ API Calls
                     ▼
            ┌────────────────────┐
            │  FastAPI Backend   │
            │ Session Management │
            └────────┬───────────┘
                     │ Webhook
                     ▼
            ┌────────────────────┐
            │    n8n Workflow    │
            │ AI Automation Hub  │
            └────────┬───────────┘
                     │
         ┌───────────┴────────────┐
         ▼                        ▼
┌────────────────┐      ┌────────────────┐
│    Gemini      │      │   Gmail API    │
│ AI Processing  │      │ Email Actions  │
└────────────────┘      └────────────────┘
```

---

## 🔍 Data Flow

1. User sends a message through the React frontend.
2. FastAPI receives and processes the request.
3. Backend forwards the request to n8n webhook.
4. n8n orchestrates AI and Gmail actions.
5. Gemini generates intelligent responses.
6. Gmail API performs email operations.
7. Final response returns to the frontend chat UI.

---

# 📁 Directory Structure

```bash
Gmail Agent/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── run.py
│   └── __pycache__/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── n8n/
│   ├── workflows/
│   │   └── ai-mail-agent.json
│   └── README.md
│
└── README.MD
```

---

## 📂 Folder Explanation

| Folder/File | Description |
|---|---|
| `frontend/` | React + Vite frontend application |
| `frontend/src/` | Main frontend source code |
| `frontend/src/assets/` | Images, icons, and UI assets |
| `frontend/public/` | Static public assets |
| `backend/` | FastAPI backend server |
| `backend/main.py` | Main FastAPI application |
| `backend/run.py` | Backend server runner |
| `backend/requirements.txt` | Python dependencies |
| `n8n/` | n8n workflow automation setup |
| `n8n/workflows/` | Exported AI workflow JSON files |
| `README.MD` | Main project documentation |

---

---

# 🚀 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/AI-Gmail-Agent.git

cd AI-Gmail-Agent
```

---

# 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚡ Backend Setup

```bash
cd backend

pip install -r requirements.txt

python run.py
```

Backend runs on:

```bash
http://localhost:8000
```

---

# 🔄 n8n Setup

## Run n8n

```bash
docker run -it --rm \
-p 5678:5678 \
-v ~/.n8n:/home/node/.n8n \
n8nio/n8n
```

n8n dashboard:

```bash
http://localhost:5678
```

---

# 🔐 Environment Variables

Create `.env` files inside frontend and backend.

---

## Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## Backend `.env`

```env
Gemini_API_KEY=Gemini_api_key
N8N_WEBHOOK=http://localhost:5678/webhook/chat
N8N_ENCRYPTION_KEY=your_secret_key
```

---

# 🐳 Docker Setup

## Start Entire Stack

```bash
docker compose up --build
```

---

## Stop Containers

```bash
docker compose down
```

---

# 🐳 Example docker-compose.yml

```yaml
version: "3.9"

services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"

  backend:
    build: ./backend
    ports:
      - "8000:8000"

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ./n8n_data:/home/node/.n8n
```

---

# 🌍 Environment Variables

| Variable | Description |
|---|---|
| Gemini_API_KEY | GEMINI API key |
| N8N_WEBHOOK | n8n webhook endpoint |
| N8N_ENCRYPTION_KEY | Encryption secret |
| VITE_API_URL | Frontend API URL |

---

# 🔄 n8n Workflow Setup

## Import Workflow

1. Open n8n dashboard
2. Click **Import Workflow**
3. Select:

```bash
n8n/workflows/ai-mail-agent.json
```

---

## Configure Gemini API

Add Gemini credentials inside n8n.

---

## Configure Gmail OAuth

1. Create Google Cloud project
2. Enable Gmail API
3. Configure OAuth consent screen
4. Add OAuth credentials to n8n

---

## Activate Workflow

Enable the workflow toggle inside n8n.

---

## Webhook URL

Example:

```bash
http://localhost:5678/webhook/chat
```

---

# 📡 API Documentation

## POST `/chat`

### Request

```json
{
  "message": "Send email to john@gmail.com",
  "session_id": "abc123"
}
```

---

### Response

```json
{
  "response": "Email sent successfully"
}
```

---

# 🔐 Security Best Practices

- ❌ Never upload `.env`
- ❌ Never upload `n8n_data`
- ❌ Never hardcode API keys
- ✅ Use environment variables
- ✅ Secure Gmail OAuth credentials
- ✅ Rotate API keys regularly
- ✅ Use HTTPS in production

---

# 🚀 Deployment

## 🐳 Docker Deployment

Recommended for production.

```bash
docker compose up -d
```

---

## ☁️ VPS Deployment

Deploy on:

- Ubuntu Server
- DigitalOcean
- AWS EC2
- Hetzner

---

## ⚡ Render

Deploy backend easily on Render.

---

## 🚄 Railway

Perfect for rapid deployment.

---

## 🌊 DigitalOcean

Use Docker droplets for scalable deployment.

---

# 🛣 Roadmap

- [ ] Attachments support
- [ ] Voice assistant
- [ ] RAG inbox search
- [ ] Multi-user authentication
- [ ] Desktop application
- [ ] Mobile application
- [ ] Streaming AI responses
- [ ] Gmail label automation
- [ ] AI meeting scheduling

---

# 🛠 Troubleshooting

<details>
<summary>❌ n8n webhook not responding</summary>

- Ensure n8n container is running
- Verify webhook URL
- Check Docker networking

</details>

---

<details>
<summary>❌ CORS Issues</summary>

Enable CORS middleware in FastAPI.

```python
from fastapi.middleware.cors import CORSMiddleware
```

</details>

---

<details>
<summary>❌ Session ID issues</summary>

Ensure unique session IDs per conversation.

</details>

---

<details>
<summary>❌ Gemini Authentication Errors</summary>

Verify:

```env
GEMINI_API_KEY
```

</details>

---

<details>
<summary>❌ Gmail OAuth Problems</summary>

- Enable Gmail API
- Verify redirect URI
- Reconnect OAuth credentials

</details>

---

<details>
<summary>❌ Docker Networking Issues</summary>

Restart containers:

```bash
docker compose down
docker compose up --build
```

</details>

---

# 🤝 Contributing

We welcome contributions from the community.

## Steps

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

```text
MIT License © 2026 AI Gmail Agent
```

---

# 🌟 Support

If you like this project:

⭐ Star the repository  
🍴 Fork the project  
🐛 Report issues  
🚀 Contribute features



## 👤 Author

**Aditya Karippadath Udai**
- GitHub: [@AdityaKarippadathUdai](https://github.com/AdityaKarippadathUdai)
- LinkedIn: [Aditya Karippadath Udai](https://www.linkedin.com/in/aditya-udai-a580a232a/)

---

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
