import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Icons
function MailIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l4 4M21 8l-4 4"/></svg>; }
function SendIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function SparklesIcon() { return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/><path d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75z"/></svg>; }
function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }

function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
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
    el.style.height = "56px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const time = getTime();

    setMessages((prev) => [...prev, { role: "user", text, time }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "56px";
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", { message: text, session_id: sessionId });
      const reply = res.data.response?.reply || JSON.stringify(res.data.response);
      setMessages((prev) => [...prev, { role: "bot", text: reply, time: getTime() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Unable to reach the mail server. Please ensure your backend is running on localhost:8000.", time: getTime() }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { height: 100%; width: 100%; overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif; background: #ffffff; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .message-anim { animation: fadeIn 0.4s cubic-bezier(0.1, 0.9, 0.2, 1); }
      `}</style>

      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff"
      }}>
        
        {/* Full-Width Header */}
        <header style={{
          height: "72px",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ 
              width: "42px", height: "42px", borderRadius: "12px", 
              background: "#0f172a", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <MailIcon />
            </div>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>MailAgent Pro</h1>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>System Live</span>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Workspace Desktop</div>
              <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>● ENCRYPTED</div>
            </div>
          </div>
        </header>

        {/* Full-Screen Chat Canvas */}
        <main className="custom-scroll" style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          background: "#fcfcfd"
        }}>
          {/* Constrained Container for readability */}
          <div style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            minHeight: "100%"
          }}>
            {messages.length === 0 && !loading && (
              <div style={{ 
                margin: "auto", textAlign: "center",
                padding: "60px 0"
              }}>
                <div style={{ color: "#0f172a", marginBottom: "24px" }}>
                  <SparklesIcon />
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.04em" }}>
                  What's the mission?
                </h2>
                <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
                  I can help you draft emails, clear your inbox, or schedule follow-ups with precision.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="message-anim" style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                gap: "20px",
                alignItems: "flex-start"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: msg.role === "user" ? "#0f172a" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: msg.role === "user" ? "white" : "#0f172a",
                  border: msg.role === "bot" ? "1px solid #e2e8f0" : "none"
                }}>
                  {msg.role === "user" ? <UserIcon /> : <MailIcon />}
                </div>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%" 
                }}>
                  <div style={{
                    padding: "18px 24px",
                    borderRadius: msg.role === "user" ? "24px 4px 24px 24px" : "4px 24px 24px 24px",
                    background: msg.role === "user" ? "#0f172a" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#1e293b",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    boxShadow: msg.role === "bot" ? "0 4px 20px rgba(0,0,0,0.03)" : "0 10px 25px rgba(0,0,0,0.1)",
                    border: msg.role === "bot" ? "1px solid #e2e8f0" : "none"
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px", fontWeight: 600 }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Docked Full-Width Footer */}
        <footer style={{ 
          padding: "24px 40px 40px",
          background: "#ffffff",
          borderTop: "1px solid #f1f5f9"
        }}>
          <div style={{ 
            maxWidth: "900px", 
            margin: "0 auto",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            background: "#f8fafc",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            padding: "8px"
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Command your email assistant..."
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "16px", fontSize: "16px", outline: "none",
                resize: "none", minHeight: "56px", maxHeight: "200px",
                lineHeight: "1.5", color: "#0f172a", fontFamily: "inherit"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "56px", height: "56px", borderRadius: "14px",
                background: loading || !input.trim() ? "#cbd5e1" : "#0f172a",
                color: "white", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
                marginBottom: "4px", marginRight: "4px"
              }}
            >
              <SendIcon />
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
            Press Enter to send • Shift + Enter for new line
          </div>
        </footer>
      </div>
    </>
  );
}