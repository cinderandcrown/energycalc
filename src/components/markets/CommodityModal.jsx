import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TIMEFRAMES = ["1W", "1M", "3M", "6M", "1Y"];

export default function CommodityModal({ commodity, open, onClose }) {
  const [timeframe, setTimeframe] = useState("3M");
  const [chartData, setChartData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && commodity) {
      fetchCommodityDetail();
    }
    return () => { setChartData(null); setAnalysis(null); };
  }, [open, commodity?.symbol, timeframe]);

  const fetchCommodityDetail = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an energy commodity data analyst. Provide historical price data and analysis for ${commodity.label} (${commodity.symbol}) as of today (${new Date().toDateString()}).

Source data from oilprice.com and current market knowledge.

Timeframe requested: ${timeframe}

Return JSON with:
1. "history": array of price data points over the ${timeframe} timeframe. Each point: { "date": "YYYY-MM-DD" or "MMM DD" format, "price": number, "high": number, "low": number }
   - For 1W: ~7 daily points
   - For 1M: ~20 daily points  
   - For 3M: ~12 weekly points
   - For 6M: ~24 weekly points
   - For 1Y: ~12 monthly points
   Use realistic price movements based on actual market trends for ${commodity.label}.

2. "stats": { "high52w": number, "low52w": number, "avgPrice": number, "volatility": string (like "Low", "Medium", "High"), "volume": string (like "1.2M bbl/day") }

3. "analysis": short 2-3 sentence expert analysis of current ${commodity.label} price action and near-term outlook. Reference specific supply/demand factors.

Be accurate with price ranges based on real recent market data from oilprice.com.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                price: { type: "number" },
                high: { type: "number" },
                low: { type: "number" }
              }
            }
          },
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
          analysis: { type: "string" }
        }
      }
    });

    if (result?.history) setChartData(result.history);
    if (result?.analysis) setAnalysis({ text: result.analysis, stats: result.stats });
    setLoading(false);
  };

  if (!commodity) return null;

  const up = commodity.changePct >= 0;
  const chartColor = up ? "#2E7D32" : "#C62828";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                {commodity.label}
                <Badge variant="secondary" className="text-[10px]">{commodity.symbol}</Badge>
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{commodity.category} · {commodity.unit}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-2xl text-foreground">${commodity.price?.toFixed(2)}</p>
              <div className={`flex items-center gap-1 justify-end text-sm font-semibold ${up ? "text-drill-green" : "text-flare-red"}`}>
                {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{up ? "+" : ""}{commodity.change?.toFixed(3)} ({up ? "+" : ""}{commodity.changePct?.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-1 w-fit">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  timeframe === tf
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-card p-4">
            {loading ? (
              <div className="flex items-center justify-center h-56 gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading {timeframe} chart data...</span>
              </div>
            ) : chartData ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip unit={commodity.unit} />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{ r: 4, stroke: chartColor, strokeWidth: 2, fill: "hsl(var(--card))" }}
                  />
                  <Area type="monotone" dataKey="high" stroke="none" fill="none" />
                  <Area type="monotone" dataKey="low" stroke="none" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
                No chart data available
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {analysis?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <StatCard label="52W High" value={`$${analysis.stats.high52w?.toFixed(2)}`} />
              <StatCard label="52W Low" value={`$${analysis.stats.low52w?.toFixed(2)}`} />
              <StatCard label="Avg Price" value={`$${analysis.stats.avgPrice?.toFixed(2)}`} />
              <StatCard label="Volatility" value={analysis.stats.volatility} />
              <StatCard label="Volume" value={analysis.stats.volume} />
            </div>
          )}

          {/* AI Analysis */}
          {analysis?.text && (
            <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
              <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide mb-2">AI Market Analysis</p>
              <p className="text-sm text-foreground leading-relaxed">{analysis.text}</p>
            </div>
          )}

          {/* OilPrice Link */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground">Data sourced from OilPrice.com</p>
            <a
              href={`https://oilprice.com/commodity-price/${commodity.label.toLowerCase().replace(/\s+/g, '-')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3 h-3" /> View on OilPrice.com
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

function CustomTooltip({ active, payload, unit }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card shadow-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground font-medium mb-1">{d.date}</p>
      <p className="font-mono font-bold text-foreground">
        ${d.price?.toFixed(2)} <span className="text-muted-foreground font-normal">{unit}</span>
      </p>
      {d.high && d.low && (
        <p className="text-muted-foreground mt-0.5">
          H: ${d.high?.toFixed(2)} · L: ${d.low?.toFixed(2)}
        </p>
      )}
    </div>
  );
}