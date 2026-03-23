import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2, MessageCircle, RotateCcw } from "lucide-react";
import SupportMessageBubble from "@/components/support/SupportMessageBubble";

const AGENT_NAME = "customer_service";
const GREETING = "Welcome to Commodity Investor+ Support! How can I help you today?";
const STORAGE_KEY = "ci_support_convo_v2";

export default function Support() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load or create a single persistent conversation
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const existing = await base44.agents.getConversation(stored);
        if (existing?.id) {
          setConversation(existing);
          setMessages(existing.messages || []);
          setLoading(false);
          return;
        }
      }
      await createConversation();
    };
    init();
  }, []);

  const createConversation = async () => {
    const convo = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: "Support" },
    });
    localStorage.setItem(STORAGE_KEY, convo.id);
    setConversation(convo);
    setMessages([]);
    setLoading(false);
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  }, [conversation?.id]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !conversation) return;
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = async () => {
    setLoading(true);
    await createConversation();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-80px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className="w-9 h-9 rounded-full bg-petroleum flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4 text-crude-gold" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Customer Support</p>
          <p className="text-xs text-muted-foreground">AI-Powered Assistance</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Start fresh conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <SupportMessageBubble message={{ role: "assistant", content: GREETING }} />
        {messages.map((msg, i) => (
          <SupportMessageBubble key={i} message={msg} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs pl-10">
            <Loader2 className="w-3 h-3 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 shrink-0 bg-card">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm min-h-[44px] max-h-[120px] focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ fontSize: "16px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-xl bg-crude-gold text-petroleum flex items-center justify-center hover:bg-crude-gold/90 transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}