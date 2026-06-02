"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Loader2, Trash2 } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const WELCOME_MESSAGE: Message = { id: "welcome", role: "assistant", content: "Assalam-o-Alaikum! Main Sugar Buddy AI hoon, aapka diabetes guide.\n\nAap mujh se apni Sugar, khoraak, warzish, ya diabetes se mutaliq koi bhi sawal pooch sakte hain.\n\nYaad rakhein: Main doctor nahi hoon — sirf aapka maddagaar guide hoon." };

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try { const res = await fetch("/api/copilot/history"); if (res.ok) { const data = await res.json(); if (data.messages?.length > 0) { const dbMessages: Message[] = data.messages.map((m: { id: string; role: string; content: string }, i: number) => ({ id: m.id || `db-${i}`, role: m.role === "USER" ? "user" : "assistant", content: m.content })); setMessages([WELCOME_MESSAGE, ...dbMessages]); } } } catch {} finally { setHistoryLoaded(true); }
    }
    loadHistory();
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim(); if (!trimmed || isLoading) return;
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: trimmed }]); setInput(""); setIsLoading(true);
    try { const response = await fetch("/api/copilot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: trimmed }) }); if (!response.ok) throw new Error(); const data = await response.json(); setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content: data.response || "Maazrat, jawab dene mein masla hua." }]); } catch { setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: "Maazrat, abhi jawab dene mein masla ho raha hai." }]); } finally { setIsLoading(false); inputRef.current?.focus(); }
  }, [input, isLoading]);

  const clearChat = async () => { if (!confirm("Kya aap sari chat delete karna chahte hain?")) return; try { await fetch("/api/copilot/history", { method: "DELETE" }); setMessages([WELCOME_MESSAGE]); } catch {} };

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] md:h-screen overflow-hidden">
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-100 bg-white flex items-center justify-between shrink-0">
        <h1 className="text-base font-bold text-zinc-900 flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /> AI Chat</h1>
        {messages.length > 1 && (<button onClick={clearChat} className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Clear chat"><Trash2 className="w-4 h-4" /></button>)}
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
        {!historyLoaded && <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-zinc-300 animate-spin" /></div>}
        {historyLoaded && messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-primary text-white rounded-br-md" : "bg-zinc-100 text-zinc-800 rounded-bl-md"}`}>{msg.content}</div></div>))}
        {isLoading && (<div className="flex justify-start"><div className="bg-zinc-100 px-4 py-3 rounded-2xl rounded-bl-md"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} /><span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} /></div></div></div>)}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-3 sm:px-6 py-2 sm:py-3 border-t border-zinc-100 bg-white shrink-0">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Sawal likhein..." rows={1} className="flex-1 min-w-0 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none focus:border-primary outline-none transition-colors" style={{ minHeight: "36px", maxHeight: "100px" }} />
          <button onClick={sendMessage} disabled={!input.trim() || isLoading} className="flex-shrink-0 p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors" aria-label="Send"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}
