import { useState } from "react";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(
    crypto.randomUUID()
  );
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/chat",
        {
          message: currentInput,
          session_id: sessionId,
        }
      );

      const botMessage = {
        role: "bot",
        text:
          res.data.response.reply ||
          JSON.stringify(res.data.response),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Error connecting to AI agent",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-[450px] h-[700px] bg-slate-900 rounded-3xl border border-slate-700 flex flex-col">

        <div className="p-5 border-b border-slate-700 text-xl font-bold">
          AI Mail Agent
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-slate-700"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-slate-700 px-4 py-3 rounded-2xl w-fit">
              Thinking...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex gap-2">
          <input
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to send email..."
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 px-5 rounded-xl font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}