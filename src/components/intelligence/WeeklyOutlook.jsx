import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Telescope, Loader2, Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const sentimentIcon = {
  bullish: TrendingUp,
  bearish: TrendingDown,
  neutral: Minus,
  cautious: AlertTriangle,
};

const sentimentStyle = {
  bullish: "bg-drill-green/10 text-drill-green border-drill-green/30",
  bearish: "bg-flare-red/10 text-flare-red border-flare-red/30",
  neutral: "bg-muted text-muted-foreground border-border",
  cautious: "bg-crude-gold/10 text-crude-gold border-crude-gold/30",
};

export default function WeeklyOutlook({ allCommodities = [] }) {
  const [outlook, setOutlook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const loaded = allCommodities.filter(c => c.price != null);

  const generate = async () => {
    setLoading(true);
    const priceContext = loaded.slice(0, 20).map(c =>
      `${c.name}: $${c.price.toFixed(2)} (${(c.changePct ?? 0) >= 0 ? "+" : ""}${(c.changePct ?? 0).toFixed(2)}%)`
    ).join("\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior commodity strategist writing a weekly market outlook for sophisticated energy investors. Today's commodity prices:\n\n${priceContext}\n\nWrite a comprehensive weekly outlook covering:\n1. MACRO OVERVIEW: 2-3 sentences on the big picture across energy, metals, and agriculture\n2. SECTOR OUTLOOKS: For each sector (Oil & Gas, Natural Gas, Precious Metals, Industrial Metals, Agriculture), provide a 1-2 sentence outlook with specific price levels\n3. KEY RISKS: 2-3 specific risk events to watch this week\n4. ACTIONABLE IDEA: One specific, data-driven trade idea or portfolio action\n\nBe authoritative, use specific numbers, and avoid generic filler. Write for an audience that manages real commodity exposure.`,
      response_json_schema: {
        type: "object",
        properties: {
          macro_overview: { type: "string" },
          sectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                outlook: { type: "string", enum: ["bullish", "bearish", "neutral", "cautious"] },
                commentary: { type: "string" }
              }
            }
          },
          key_risks: { type: "array", items: { type: "string" } },
          actionable_idea: { type: "string" },
          overall_sentiment: { type: "string", enum: ["bullish", "bearish", "neutral", "cautious"] }
        },
        required: ["macro_overview", "sectors", "key_risks", "actionable_idea", "overall_sentiment"]
      }
    });

    setOutlook(result);
    setGenerated(true);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-petroleum/5 to-crude-gold/5 dark:from-petroleum/20 dark:to-crude-gold/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Telescope className="w-4 h-4 text-crude-gold" />
          <h3 className="text-sm font-bold text-foreground">AI Weekly Outlook</h3>
        </div>
        {generated && (
          <Button variant="ghost" size="sm" onClick={generate} disabled={loading} className="h-7 gap-1 text-xs">
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!generated && !loading && (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroleum/10 to-crude-gold/10 flex items-center justify-center mx-auto mb-4">
                <Telescope className="w-7 h-7 text-crude-gold" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Weekly Market Intelligence Report</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                AI-generated sector-by-sector analysis, risk assessment, and actionable trade ideas based on {loaded.length} live commodity prices.
              </p>
              <Button onClick={generate} disabled={loaded.length === 0} className="gap-2 bg-gradient-to-r from-petroleum to-[#1a3a6b] text-white hover:opacity-90 dark:from-accent dark:to-crude-gold dark:text-petroleum">
                <Sparkles className="w-4 h-4" />
                Generate Weekly Outlook
              </Button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-10">
              <div className="relative">
                <Loader2 className="w-7 h-7 text-crude-gold animate-spin" />
                <span className="absolute inset-0 rounded-full bg-crude-gold/10 animate-ping" />
              </div>
              <p className="text-xs text-muted-foreground animate-pulse">Analyzing {loaded.length} commodities across all sectors...</p>
            </motion.div>
          )}

          {generated && outlook && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Overall sentiment */}
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const Icon = sentimentIcon[outlook.overall_sentiment] || Minus;
                  const style = sentimentStyle[outlook.overall_sentiment] || sentimentStyle.neutral;
                  return (
                    <Badge className={`${style} border text-[10px] font-bold uppercase tracking-wider gap-1`}>
                      <Icon className="w-3 h-3" />
                      {outlook.overall_sentiment} outlook
                    </Badge>
                  );
                })()}
                <span className="text-[10px] text-muted-foreground">Based on {loaded.length} live prices</span>
              </div>

              {/* Macro overview */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Macro Overview</p>
                <p className="text-sm text-foreground leading-relaxed">{outlook.macro_overview}</p>
              </div>

              {/* Sector grid */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Sector Outlooks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {outlook.sectors?.map((sector, i) => {
                    const Icon = sentimentIcon[sector.outlook] || Minus;
                    const style = sentimentStyle[sector.outlook] || sentimentStyle.neutral;
                    return (
                      <motion.div
                        key={sector.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-border p-3.5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-xs font-bold text-foreground flex-1">{sector.name}</p>
                          <Badge className={`${style} border text-[9px] font-bold gap-0.5`}>
                            <Icon className="w-2.5 h-2.5" />
                            {sector.outlook}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{sector.commentary}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Key risks */}
              {outlook.key_risks?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-crude-gold" />
                    Key Risks This Week
                  </p>
                  <div className="space-y-1.5">
                    {outlook.key_risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-crude-gold/5 border border-crude-gold/10">
                        <span className="text-crude-gold font-bold text-xs mt-0.5">{i + 1}.</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable idea */}
              <div className="rounded-xl border-2 border-crude-gold/30 bg-crude-gold/5 p-4">
                <p className="text-[10px] font-bold text-crude-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  AI-Generated Perspective
                </p>
                <p className="text-sm text-foreground leading-relaxed">{outlook.actionable_idea}</p>
                <p className="text-[9px] text-muted-foreground mt-2 italic">This is an AI-generated observation, not a trade recommendation. Always do your own research and consult a licensed professional.</p>
              </div>

              <p className="text-[9px] text-muted-foreground italic">
                AI-generated analysis based on current market data. May contain errors or hallucinations. This is not investment advice, a trade recommendation, or a solicitation. Always verify independently and consult a licensed professional before acting.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}