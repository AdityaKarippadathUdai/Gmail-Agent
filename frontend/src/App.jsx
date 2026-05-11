import { useState, useRef, useEffect } from "react";
import axios from "axios";

function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/>
      <rect x="3" y="6" width="18" height="13" rx="2"/>
      <path d="M3 8l4 4M21 8l-4 4"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/>
      <polyline points="5 12 12 5 19 12"/>
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/>
      <path d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75z"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "inline-flex", gap: "4px", alignItems: "center", height: "18px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#93b4dd",
            animation: `blink 1.2s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const time = getTime();

    setMessages((prev) => [...prev, { role: "user", text, time }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "40px";
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: text,
        session_id: sessionId,
      });
      const reply = res.data.response?.reply || JSON.stringify(res.data.response);
      setMessages((prev) => [...prev, { role: "bot", text: reply, time: getTime() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to AI agent. Please try again.", time: getTime() },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-appear { animation: fadeSlideUp 0.22s ease forwards; }
        .shell-scroll::-webkit-scrollbar { width: 4px; }
        .shell-scroll::-webkit-scrollbar-track { background: transparent; }
        .shell-scroll::-webkit-scrollbar-thumb { background: #c5d4ea; border-radius: 4px; }
        .send-btn:hover { background: #0a3a8a !important; }
        .send-btn:active { transform: scale(0.95); }
        .attach-btn:hover { color: #0c44a0 !important; }
        .textarea-el:focus { border-color: #0c44a0 !important; background: #ffffff !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#eef3fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem 0 2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e0e8f4",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: "580px",
          maxHeight: "700px",
          boxShadow: "0 2px 24px rgba(24,95,165,0.10)",
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#0c44a0",
          }}>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}>
              <MailIcon />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>
                AI Mail Agent
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 0 2px rgba(74,222,128,0.25)",
              }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Connected</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="shell-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#f4f7fc",
            }}
          >
            {messages.length === 0 && !loading && (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                flex: 1, gap: "8px", padding: "2rem",
                animation: "fadeSlideUp 0.3s ease forwards",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: "#dce8f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "6px", color: "#0c44a0",
                }}>
                  <SparklesIcon />
                </div>
                <strong style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  Your mail assistant is ready
                </strong>
                <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginTop: "4px", lineHeight: 1.6 }}>
                  Describe what you want to send and I'll draft and deliver it via Gmail.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className="msg-appear"
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-end",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: msg.role === "bot" ? "#0c44a0" : "#1a1a2e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "#fff",
                }}>
                  {msg.role === "bot" ? <MailIcon /> : <UserIcon />}
                </div>

                {/* Bubble + time */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    background: msg.role === "user" ? "#0c44a0" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#0f172a",
                    border: msg.role === "bot" ? "1px solid #dce8f7" : "none",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "4px",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                className="msg-appear"
                style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "#0c44a0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "#fff",
                }}>
                  <MailIcon />
                </div>
                <div style={{
                  padding: "10px 14px",
                  background: "#ffffff",
                  border: "1px solid #dce8f7",
                  borderRadius: "16px 16px 16px 4px",
                  color: "#94a3b8",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Compose */}
          <div style={{
            padding: "12px 14px",
            borderTop: "1px solid #e0e8f4",
            display: "flex", gap: "8px", alignItems: "flex-end",
            background: "#ffffff",
          }}>
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                ref={textareaRef}
                className="textarea-el"
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder="Ask me to send, draft, or schedule an email…"
                rows={1}
                style={{
                  width: "100%",
                  background: "#f4f7fc",
                  border: "1px solid #d0e0f3",
                  borderRadius: "14px",
                  padding: "9px 40px 9px 13px",
                  fontSize: "13.5px",
                  color: "#0f172a",
                  fontFamily: "'DM Sans', sans-serif",
                  resize: "none",
                  minHeight: "40px",
                  maxHeight: "100px",
                  lineHeight: 1.5,
                  outline: "none",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              />
              <button
                className="attach-btn"
                title="Attach file"
                aria-label="Attach file"
                style={{
                  position: "absolute", right: "10px", bottom: "10px",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", padding: "2px",
                  display: "flex", alignItems: "center",
                  transition: "color 0.15s",
                }}
              >
                <PaperclipIcon />
              </button>
            </div>

            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading}
              aria-label="Send"
              style={{
                width: "38px", height: "38px", borderRadius: "12px",
                background: loading ? "#6b8fc7" : "#0c44a0",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s, transform 0.1s",
                color: "#fff",
              }}
            >
              <SendIcon />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}