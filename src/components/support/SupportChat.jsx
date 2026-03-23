import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2 } from "lucide-react";
import SupportMessageBubble from "./SupportMessageBubble";

const AGENT_NAME = "customer_service";
const GREETING = "Welcome to Commodity Investor+! How can I help protect your investments today?";

export default function SupportChat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load or create conversation
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("energycalc_support_convo");
      if (stored) {
        const existing = await base44.agents.getConversation(stored);
        if (existing?.id) {
          setConversation(existing);
          setMessages(existing.messages || []);
          setLoading(false);
          return;
        }
      }
      // Create new conversation
      const convo = await base44.agents.createConversation({
        agent_name: AGENT_NAME,
        metadata: { name: "Support Chat" },
      });
      localStorage.setItem("energycalc_support_convo", convo.id);
      setConversation(convo);
      setMessages([]);
      setLoading(false);
    };
    init();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  }, [conversation?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

  const handleNewChat = async () => {
    setLoading(true);
    const convo = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: "Support Chat" },
    });
    localStorage.setItem("energycalc_support_convo", convo.id);
    setConversation(convo);
    setMessages([]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {/* Greeting */}
        <SupportMessageBubble message={{ role: "assistant", content: GREETING }} />

        {messages.map((msg, i) => (
          <SupportMessageBubble key={i} message={msg} />
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs pl-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-3 shrink-0 bg-card">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleNewChat}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            New conversation
          </button>
        </div>
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
            className="w-10 h-10 rounded-xl bg-crude-gold text-petroleum flex items-center justify-center hover:bg-crude-gold/90 transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}