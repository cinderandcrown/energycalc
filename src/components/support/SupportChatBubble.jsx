import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import SupportChat from "./SupportChat";

export default function SupportChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 sm:bottom-6 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(75vh,600px)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-petroleum text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-crude-gold/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-crude-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold">EnergyCalc Support</p>
                <p className="text-[10px] text-white/60">AI-Powered Assistance</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat body */}
          <SupportChat />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 sm:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-crude-gold text-petroleum shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        style={{
          display: open ? "none" : "flex",
          marginBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}