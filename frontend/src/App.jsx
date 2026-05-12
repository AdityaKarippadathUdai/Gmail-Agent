import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Send,
  Sparkles,
  User,
  Paperclip,
  Settings,
  Plus,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const QUICK_ACTIONS = [
  "Summarize unread emails",
  "Draft a professional follow-up",
  "Send meeting reminder",
  "Find emails from today",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("mail_agent_session");

    if (existing) return existing;

    const newId = crypto.randomUUID();

    localStorage.setItem("mail_agent_session", newId);

    return newId;
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mail_agent_messages");

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Save messages
  useEffect(() => {
    localStorage.setItem(
      "mail_agent_messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Autofocus
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const autoResize = () => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...message,
      },
    ]);
  };

  const sendMessage = async (overrideText) => {
    const text =
      typeof overrideText === "string"
        ? overrideText
        : input.trim();

    if (!text || loading) return;

    addMessage({
      role: "user",
      text,
      time: getTime(),
    });

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: text,
        session_id: sessionId,
      });

      const reply =
        res.data.response?.reply ||
        res.data.response?.output ||
        res.data.output ||
        "Done";

      addMessage({
        role: "bot",
        text: reply,
        time: getTime(),
      });
    } catch (err) {
      console.error(err);

      addMessage({
        role: "bot",
        text:
          err?.response?.data?.detail ||
          "Unable to connect to AI mail agent.",
        time: getTime(),
        isError: true,
      });
    }

    setLoading(false);
  };

  const clearChat = () => {
    localStorage.removeItem("mail_agent_messages");
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="p-4">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="px-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Quick Actions
          </div>

          <div className="space-y-2">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => sendMessage(action)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Mail size={20} />
            </div>

            <div>
              <h1 className="font-bold text-[15px] tracking-tight">
                MailAgent Pro
              </h1>

              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span className="text-[11px] text-slate-500 font-medium">
                  AI online
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Clock size={14} />
            Session active
          </div>
        </header>

        {/* Chat */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-24 text-center"
                >
                  <div className="w-24 h-24 bg-white rounded-[28px] shadow-xl border border-slate-200 flex items-center justify-center mx-auto mb-8">
                    <Sparkles
                      size={42}
                      className="text-blue-600"
                    />
                  </div>

                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
                    Your AI Mail Assistant
                  </h2>

                  <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                    Draft emails, summarize conversations,
                    search inboxes, and automate communication
                    using AI.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {QUICK_ACTIONS.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(action)}
                        className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-10">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${
                        msg.role === "user"
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          msg.role === "user"
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-500"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User size={18} />
                        ) : (
                          <Mail size={18} />
                        )}
                      </div>

                      {/* Message */}
                      <div
                        className={`max-w-[80%] flex flex-col ${
                          msg.role === "user"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                            msg.role === "user"
                              ? "bg-slate-900 text-white rounded-tr-md"
                              : msg.isError
                              ? "bg-red-50 border border-red-100 text-red-700"
                              : "bg-white border border-slate-200 text-slate-800 rounded-tl-md"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <div className="whitespace-pre-wrap">
                              {msg.text}
                            </div>
                          ) : (
                            <div className="prose prose-sm prose-slate max-w-none">
                              <ReactMarkdown>
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          {msg.time} •{" "}
                          {msg.role === "user"
                            ? "You"
                            : "Assistant"}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        <Mail size={18} />
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-2">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0,
                          }}
                          className="w-2 h-2 rounded-full bg-slate-300"
                        />

                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2,
                          }}
                          className="w-2 h-2 rounded-full bg-slate-300"
                        />

                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.4,
                          }}
                          className="w-2 h-2 rounded-full bg-slate-300"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="bg-white border-t border-slate-200 p-5 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Paperclip size={20} />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                disabled={loading}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize();
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask MailAgent to draft, search, or summarize..."
                className="flex-1 bg-transparent resize-none outline-none border-none text-[15px] leading-relaxed max-h-[180px] text-slate-800 placeholder-slate-400"
              />

              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  loading || !input.trim()
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                }`}
              >
                <Send
                  size={18}
                  className={
                    loading ? "animate-pulse" : ""
                  }
                />
              </button>
            </div>

            <div className="flex justify-center mt-3">
              <p className="text-[11px] text-slate-400 font-medium">
                Press Enter to send • Shift + Enter for
                newline
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}