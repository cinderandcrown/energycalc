import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Brain, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

/**
 * AI-powered one-paragraph market brief using live prices as context.
 * Generates on-demand with a single click.
 */
export default function MarketBrief({ prices }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const loaded = prices.filter(p => p.price != null);
  if (loaded.length === 0) return null;

  const generateBrief = async () => {
    setLoading(true);
    const priceContext = loaded.map(p =>
      `${p.label}: $${p.price.toFixed(2)}${p.unit} (${(p.changePct ?? 0) >= 0 ? "+" : ""}${(p.changePct ?? 0).toFixed(2)}%)`
    ).join(", ");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a concise commodity market analyst. Given today's energy prices: ${priceContext}

Write a 3-4 sentence market brief for an energy investor audience. Cover:
1. What's driving today's moves (be specific about supply/demand dynamics)
2. How this environment affects upstream oil & gas investment returns
3. One actionable insight or watch-item for the week ahead

Be authoritative but measured. Use specific price references. No generic filler.`,
      response_json_schema: {
        type: "object",
        properties: {
          brief: { type: "string", description: "The 3-4 sentence market brief" },
          outlook: { type: "string", enum: ["bullish", "bearish", "neutral", "cautious"], description: "One-word outlook" },
          key_driver: { type: "string", description: "Single most important factor today, 5-8 words" }
        },
        required: ["brief", "outlook", "key_driver"]
      }
    });

    setBrief(result);
    setGenerated(true);
    setLoading(false);
  };

  const outlookColors = {
    bullish: "bg-drill-green/10 text-drill-green border-drill-green/30",
    bearish: "bg-flare-red/10 text-flare-red border-flare-red/30",
    neutral: "bg-muted text-muted-foreground border-border",
    cautious: "bg-crude-gold/10 text-crude-gold border-crude-gold/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-petroleum/5 to-crude-gold/5 dark:from-petroleum/20 dark:to-crude-gold/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-crude-gold" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">AI Market Brief</span>
        </div>
        {generated && (
          <Button variant="ghost" size="sm" onClick={generateBrief} disabled={loading} className="h-7 gap-1 text-xs">
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!generated && !loading && (
            <motion.div
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Get an AI-generated market brief based on today's live commodity prices
              </p>
              <Button onClick={generateBrief} className="gap-2 bg-gradient-to-r from-petroleum to-[#1a3a6b] text-white hover:opacity-90 dark:from-accent dark:to-crude-gold dark:text-petroleum">
                <Sparkles className="w-4 h-4" />
                Generate Market Brief
              </Button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-6"
            >
              <div className="relative">
                <Loader2 className="w-6 h-6 text-crude-gold animate-spin" />
                <span className="absolute inset-0 rounded-full bg-crude-gold/10 animate-ping" />
              </div>
              <p className="text-xs text-muted-foreground animate-pulse">Analyzing market conditions...</p>
            </motion.div>
          )}

          {generated && brief && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${outlookColors[brief.outlook] || outlookColors.neutral}`}>
                  {brief.outlook} outlook
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                  {brief.key_driver}
                </span>
              </div>

              {/* Brief text */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed">
                <ReactMarkdown>{brief.brief}</ReactMarkdown>
              </div>

              <p className="text-[9px] text-muted-foreground italic">
                AI-generated analysis. May contain errors or hallucinations. This is not investment advice or a trade recommendation. Verify independently and consult a licensed professional.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}