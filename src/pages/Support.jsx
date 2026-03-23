import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Loader2, MessageCircle, Plus, ChevronLeft, Trash2 } from "lucide-react";
import SupportMessageBubble from "@/components/support/SupportMessageBubble";
import { Button } from "@/components/ui/button";

const AGENT_NAME = "customer_service";
const GREETING = "Welcome to EnergyCalc Pro! How can I help protect your investments today?";

export default function Support() {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const convos = await base44.agents.listConversations({ agent_name: AGENT_NAME });
    setConversations(convos || []);
    setLoading(false);
  };

  // Subscribe to active conversation
  useEffect(() => {
    if (!activeConvo?.id) return;
    const unsub = base44.agents.subscribeToConversation(activeConvo.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  }, [activeConvo?.id]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const openConversation = async (convo) => {
    const full = await base44.agents.getConversation(convo.id);
    setActiveConvo(full);
    setMessages(full.messages || []);
    setShowList(false);
  };

  const startNewConversation = async () => {
    const convo = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: `Support Chat — ${new Date().toLocaleDateString()}` },
    });
    setActiveConvo(convo);
    setMessages([]);
    setShowList(false);
    await loadConversations();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !activeConvo) return;
    setInput("");
    setSending(true);
    await base44.agents.addMessage(activeConvo, { role: "user", content: text });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Conversation list view
  if (showList || !activeConvo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Support</h1>
            <p className="text-sm text-muted-foreground">Chat with our AI assistant</p>
          </div>
          <Button onClick={startNewConversation} className="gap-1.5 bg-crude-gold text-petroleum hover:bg-crude-gold/90">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-crude-gold" />
            </div>
            <div>
              <p className="font-medium text-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-1">Start a chat to get help with your account, tools, or anything else.</p>
            </div>
            <Button onClick={startNewConversation} className="bg-crude-gold text-petroleum hover:bg-crude-gold/90">
              Start a Conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((convo) => {
              const lastMsg = convo.messages?.[convo.messages.length - 1];
              return (
                <button
                  key={convo.id}
                  onClick={() => openConversation(convo)}
                  className="w-full flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-petroleum flex items-center justify-center shrink-0">
                    <span className="text-crude-gold text-xs font-bold">EC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {convo.metadata?.name || "Support Chat"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {lastMsg?.content?.slice(0, 80) || "No messages yet"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(convo.updated_date || convo.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Active conversation view
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-80px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <button onClick={() => setShowList(true)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">EnergyCalc Support</p>
          <p className="text-[10px] text-muted-foreground">AI-Powered Assistance</p>
        </div>
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
            className="w-10 h-10 rounded-xl bg-crude-gold text-petroleum flex items-center justify-center hover:bg-crude-gold/90 transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}