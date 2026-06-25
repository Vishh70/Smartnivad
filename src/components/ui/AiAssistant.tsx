"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Best Laptop Under ₹50,000",
  "Best Earbuds Under ₹2,000",
  "Today's Biggest Discount",
  "Gaming Deals",
];

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(
    () => `sess_${Math.random().toString(36).slice(2)}`,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), sessionId }),
        });

        const data = await res.json();

        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `⏳ ${data.message}` },
          ]);
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `❌ ${data.message}` },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.response },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-6 z-[90] w-14 h-14 rounded-full gradient-btn shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          aria-label="Open AI Assistant"
        >
          <Sparkles
            size={24}
            className="text-white group-hover:rotate-12 transition-transform"
          />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-20 lg:bottom-6 right-6 z-[90] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100dvh-8rem)] flex flex-col bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  TechDeals AI
                </h3>
                <p className="text-[10px] text-gray-500 font-medium">
                  Your shopping assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={28} className="text-blue-600" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  How can I help?
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Ask me about deals, products, or recommendations
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-sm text-gray-700 hover:text-blue-700 font-medium transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md shadow-md"
                      : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-100 bg-gray-50/50"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about deals..."
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 rounded-xl gradient-btn text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
