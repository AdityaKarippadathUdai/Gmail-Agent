import React, { useState, useRef, useEffect } from "react";
import { 
  Mail, 
  Send, 
  Sparkles, 
  User, 
  Paperclip, 
  ChevronRight, 
  Search, 
  History, 
  Settings,
  MoreVertical,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

function getTime() {
  return new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

const QUICK_ACTIONS = [
  "Summarize unread",
  "Find meeting times",
  "Draft follow-up"
];

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
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const sendMessage = async (textOverride) => {
    const text = typeof textOverride === 'string' ? textOverride : input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      // Calling the backend endpoint as requested
      // We'll use the URL from the user's original snippet
      const res = await axios.post("http://localhost:8000/chat", { 
        message: text, 
        session_id: sessionId 
      });
      
      const reply = res.data.response?.reply || res.data.text || JSON.stringify(res.data.response || res.data);
      setMessages((prev) => [...prev, { role: "bot", text: reply, time: getTime() }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev, 
        { 
          role: "bot", 
          text: "I'm having trouble connecting to the mail server. Is the backend running on port 8000?", 
          time: getTime(),
          isError: true
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 transition-all">
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95 group">
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            New Mail Task
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Intelligence</p>
          
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 cursor-pointer border border-blue-100 group">
            <Mail size={16} className="text-blue-500" />
            <span className="text-sm font-medium truncate">Project Apollo Brief</span>
          </div>
          
          <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
            <History size={16} className="text-slate-400" />
            <span className="text-sm font-medium">Weekly Performance Summaries</span>
          </div>
          
          <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
            <User size={16} className="text-slate-400" />
            <span className="text-sm font-medium">Sarah Jones Follow-up</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-blue-500" size={14} />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Storage Usage</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                className="bg-blue-500 h-full" 
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">9.7GB of 15GB remaining</p>
          </div>
          
          <div className="mt-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">
              <Settings size={16} /> <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        
        {/* Header */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Mail size={20} />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none mb-1">
                MailAgent <span className="text-blue-600">Pro</span>
              </h1>
              <div className="flex items-center gap-1.5 leading-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Engine v2.0.4 Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 shadow-inner-sm">
              <Clock size={14} className="text-slate-400" />
              Last synced: 2m ago
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden hover:border-slate-400 transition-colors">
              <User size={18} className="text-slate-600" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="max-w-4xl mx-auto px-8 py-10">
            
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-20 text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto mb-10 shadow-xl border border-slate-100 rotate-3">
                    <Sparkles className="text-blue-600" size={40} />
                  </div>
                  <h2 className="text-[40px] font-display font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                    How can I help with<br/>your mail today?
                  </h2>
                  <p className="text-slate-500 text-[17px] mb-12 max-w-md mx-auto leading-relaxed">
                    I can draft replies, summarize complex threads, or find information across your inbox.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
                    {QUICK_ACTIONS.map((action, i) => (
                      <button 
                        key={i}
                        onClick={() => sendMessage(action)}
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-10">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}>
                        {msg.role === 'user' ? <User size={18} /> : <Mail size={18} />}
                      </div>
                      
                      <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className={`text-[15px] leading-relaxed relative overflow-hidden ${
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none shadow-lg'
                            : msg.isError 
                              ? 'bg-red-50 text-red-700 border border-red-100 p-4 rounded-2xl'
                              : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm'
                        }`}>
                          {msg.role === 'user' ? (
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                          ) : (
                            <>
                              {/* Actionable Card Header if it looks like a draft */}
                              {msg.text.toLowerCase().includes("subject:") || msg.text.toLowerCase().includes("dear") ? (
                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center -mt-4 -mx-4 mb-4">
                                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Proposed Draft</span>
                                  <span className="text-[11px] text-blue-600 font-bold cursor-pointer hover:underline">Edit Draft</span>
                                </div>
                              ) : null}
                              
                              <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                              </div>

                              {/* Actionable Card Footer if it looks like a draft */}
                              {(msg.text.toLowerCase().includes("subject:") || msg.text.toLowerCase().includes("dear")) && (
                                <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 -mb-4 -mx-4 mt-4">
                                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors">Send Now</button>
                                  <button className="px-4 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Schedule</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {msg.time} • {msg.role === 'user' ? 'You' : 'Assistant'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        <Mail size={18} />
                      </div>
                      <div className="px-5 py-4 bg-white rounded-2xl border border-slate-100 message-shadow flex gap-1.5 items-center">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </main>

        {/* Input Dock */}
        <footer className="p-6 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            {messages.length > 0 && (
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {QUICK_ACTIONS.map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => sendMessage(action)}
                    className="shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            <div className="relative group">
              <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 p-2 input-glow-inner input-glow-focus transition-all shadow-inner">
                <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask MailAgent to draft, search, or summarize..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] py-2 px-2 resize-none max-h-48 custom-scrollbar leading-relaxed text-slate-800 placeholder-slate-400"
                />
                
                <button 
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ml-2 ${
                    loading || !input.trim() 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 text-white shadow-md active:scale-95 hover:bg-slate-800'
                  }`}
                >
                  <Send size={18} className={loading ? "animate-pulse" : ""} />
                </button>
              </div>
              <div className="flex justify-center mt-3">
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  Cmd + Enter to send instantly
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
