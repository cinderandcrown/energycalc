import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink, Loader2, AlertTriangle, Zap } from "lucide-react";

function getTradingViewSymbol(symbol) {
  const map = {
    WTI: "USOIL", BRENT: "UKOIL", NG: "NATGAS", HO: "HO1!",
    RB: "RB1!", XAU: "GOLD", XAG: "SILVER", XPT: "PLATINUM",
    XPD: "PALLADIUM", HG: "COPPER", ZC: "CORN", ZW: "WHEAT",
    ZS: "SOYBEAN", KC: "COFFEE", CT: "COTTON", SB: "SUGAR",
    CC: "COCOA", LE: "CATTLE", HE: "LEANHOGS", LBS: "LUMBER",
    ALI: "ALUMINUM", NI: "NICKEL", ZN: "ZINC",
  };
  return map[symbol] || symbol;
}

export default function CommodityModal({ commodity, open, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && commodity) {
      fetchAnalysis();
    }
    return () => setAnalysis(null);
  }, [open, commodity?.symbol]);

  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a commodity market analyst. Provide a brief market analysis for ${commodity.name} (${commodity.symbol}) priced at $${commodity.price} ${commodity.unit} as of today (${new Date().toDateString()}).

Search for the latest real data on this commodity.

Return JSON with:
1. "stats": { "high52w": number (52-week high price), "low52w": number (52-week low price), "avgPrice": number (recent avg), "volatility": string ("Low"|"Medium"|"High"), "volume": string (approximate daily volume with units) }
2. "analysis": 3-4 sentence expert analysis of current price action, key supply/demand drivers, and near-term outlook. Reference specific real factors.
3. "keyFactors": array of 3-4 strings, each a brief bullet about a key price driver.

CRITICAL: Only use data you can verify. If unsure, say "approx." Do not fabricate.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          stats: {
            type: "object",
            properties: {
              high52w: { type: "number" },
              low52w: { type: "number" },
              avgPrice: { type: "number" },
              volatility: { type: "string" },
              volume: { type: "string" }
            }
          },
          analysis: { type: "string" },
          keyFactors: { type: "array", items: { type: "string" } }
        }
      }
    });

    if (result) setAnalysis(result);
    setLoading(false);
  };

  if (!commodity) return null;

  const up = (commodity.changePct || 0) >= 0;
  const tvSymbol = getTradingViewSymbol(commodity.symbol);

  const formatPrice = (p) => {
    if (p == null) return "N/A";
    return `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                {commodity.name}
                <Badge variant="secondary" className="text-[10px]">{commodity.symbol}</Badge>
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{commodity.category} · {commodity.unit}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-2xl text-foreground">{formatPrice(commodity.price)}</p>
              <div className={`flex items-center gap-1 justify-end text-sm font-semibold ${up ? "text-drill-green" : "text-flare-red"}`}>
                {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{up ? "+" : ""}{commodity.change?.toFixed(2)} ({up ? "+" : ""}{commodity.changePct?.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Live marker */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-drill-green animate-pulse mt-1.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Live price</strong> sourced via AI web search from major financial data providers. May have a short delay from real-time.
            </p>
          </div>

          {/* Charts CTA */}
          <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Historical Price Charts</p>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              For tick-by-tick historical charts, use a dedicated financial data provider.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href={`https://www.tradingview.com/symbols/${tvSymbol}/`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <ExternalLink className="w-3 h-3" /> TradingView
                </Button>
              </a>
              <a href={`https://tradingeconomics.com/commodity/${commodity.name?.toLowerCase().replace(/\s+/g, "-")}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <ExternalLink className="w-3 h-3" /> Trading Economics
                </Button>
              </a>
              {commodity.category === "Precious Metals" && (
                <a href="https://www.kitco.com/charts/" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <ExternalLink className="w-3 h-3" /> Kitco
                  </Button>
                </a>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading market analysis...</span>
            </div>
          ) : analysis ? (
            <>
              {analysis.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <StatCard label="52W High" value={formatPrice(analysis.stats.high52w)} />
                  <StatCard label="52W Low" value={formatPrice(analysis.stats.low52w)} />
                  <StatCard label="Avg Price" value={formatPrice(analysis.stats.avgPrice)} />
                  <StatCard label="Volatility" value={analysis.stats.volatility} />
                  <StatCard label="Volume" value={analysis.stats.volume} />
                </div>
              )}

              {analysis.keyFactors?.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Key Price Drivers</p>
                  <ul className="space-y-1.5">
                    {analysis.keyFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-crude-gold mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.analysis && (
                <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5 text-crude-gold" />
                    <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide">AI Market Analysis</p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{analysis.analysis}</p>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Stats and analysis are AI-generated via web search and may contain approximations. Verify with CME Group, LME, Kitco, or your broker before making investment decisions.
                </p>
              </div>
            </>
          ) : null}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground">AI-sourced pricing · Analysis by AI</p>
            <a href="https://tradingeconomics.com/commodities" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3 h-3" /> Trading Economics
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-center">
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="font-mono font-bold text-sm text-foreground mt-0.5">{value}</p>
    </div>
  );
}