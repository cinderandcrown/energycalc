import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  TrendingUp, TrendingDown, RefreshCw, Newspaper,
  Zap, Globe, Clock, ExternalLink, BarChart3, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommodityModal from "../components/markets/CommodityModal";

// Static commodity baseline — updated by LLM fetch
const defaultPrices = [
  { label: "WTI Crude", symbol: "WTI", price: 70.14, change: +0.58, changePct: +0.83, unit: "/bbl", category: "Oil" },
  { label: "Brent Crude", symbol: "BRENT", price: 74.28, change: +0.45, changePct: +0.61, unit: "/bbl", category: "Oil" },
  { label: "Natural Gas", symbol: "NG", price: 3.42, change: -0.043, changePct: -1.24, unit: "/MMBtu", category: "Gas" },
  { label: "Henry Hub Gas", symbol: "HH", price: 3.42, change: -0.043, changePct: -1.24, unit: "/MMBtu", category: "Gas" },
  { label: "Uranium (U3O8)", symbol: "U3O8", price: 85.00, change: +1.25, changePct: +1.49, unit: "/lb", category: "Nuclear" },
  { label: "Gasoline RBOB", symbol: "RBOB", price: 2.21, change: +0.018, changePct: +0.82, unit: "/gal", category: "Refined" },
  { label: "Heating Oil", symbol: "HO", price: 2.48, change: +0.031, changePct: +1.27, unit: "/gal", category: "Refined" },
  { label: "Solar Index", symbol: "SOLAR", price: 52.40, change: +0.72, changePct: +1.39, unit: "index", category: "Renewables" },
  { label: "Lithium Carbonate", symbol: "LITH", price: 11250, change: -125, changePct: -1.10, unit: "/t", category: "Renewables" },
  { label: "Eagle Ford", symbol: "EF", price: 68.90, change: -0.18, changePct: -0.26, unit: "/bbl", category: "US Blend" },
  { label: "WTI Midland", symbol: "WTI-M", price: 70.82, change: +0.61, changePct: +0.87, unit: "/bbl", category: "US Blend" },
];

const categories = ["All", "Oil", "Gas", "Nuclear", "Renewables", "Refined", "US Blend"];

export default function Markets() {
  const [prices, setPrices] = useState(defaultPrices);
  const [news, setNews] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState(null);

  const fetchRealPrices = async () => {
    try {
      const res = await base44.functions.invoke('fetchPrices', {});
      if (res.data?.prices?.length) {
        // Map real scraped prices into our display format with categories
        const symbolMap = {
          "WTI Crude": { symbol: "WTI", category: "Oil" },
          "Brent Crude": { symbol: "BRENT", category: "Oil" },
          "Natural Gas": { symbol: "NG", category: "Gas" },
          "Heating Oil": { symbol: "HO", category: "Refined" },
        };
        const mapped = res.data.prices.map(p => ({
          ...p,
          symbol: symbolMap[p.label]?.symbol || p.label,
          category: symbolMap[p.label]?.category || "Other",
        }));
        setPrices(mapped);
        setLastUpdated(new Date());
      }
    } catch (e) {
      // keep defaults
    }
  };

  const fetchNewsAndSummary = async () => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an energy market analyst. Search for the latest energy market news from oilprice.com and other major energy news sources as of today (${new Date().toDateString()}).

Return a JSON object with:
1. "news": array of 6 recent REAL energy market headlines. Only include headlines you can verify from actual recent news articles. Fields: headline (string, max 90 chars), summary (string, max 160 chars), age (string like "2h ago" or "1 day ago"), category ("Oil"|"Gas"|"Geopolitics"|"Markets"|"Policy"), sentiment ("bullish"|"bearish"|"neutral")
2. "summary": object with fields: marketMood ("bullish"|"bearish"|"volatile"|"stable"), opecStance (string, 1 sentence), keyDriver (string, 1 sentence about the main price driver today), outlook (string, 1 sentence)

CRITICAL: Only include news headlines that are from REAL published articles you can find via web search. Do NOT fabricate or guess headlines. If you cannot verify a headline, do not include it.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  summary: { type: "string" },
                  age: { type: "string" },
                  category: { type: "string" },
                  sentiment: { type: "string" }
                }
              }
            },
            summary: {
              type: "object",
              properties: {
                marketMood: { type: "string" },
                opecStance: { type: "string" },
                keyDriver: { type: "string" },
                outlook: { type: "string" }
              }
            }
          }
        }
      });

      if (result?.news?.length) setNews(result.news);
      if (result?.summary) setMarketSummary(result.summary);
    } catch (e) {
      // no news available
    }
  };

  const fetchMarketData = async () => {
    setRefreshing(true);
    setLoadingNews(true);
    // Fetch real scraped prices and AI news in parallel
    await Promise.all([fetchRealPrices(), fetchNewsAndSummary()]);
    setRefreshing(false);
    setLoadingNews(false);
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const filtered = activeCategory === "All" ? prices : prices.filter(p => p.category === activeCategory);

  const moodColors = {
    bullish: "text-drill-green bg-drill-green/10 border-drill-green/30",
    bearish: "text-flare-red bg-flare-red/10 border-flare-red/30",
    volatile: "text-crude-gold bg-crude-gold/10 border-crude-gold/30",
    stable: "text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 border-primary/30",
  };

  const sentimentDot = {
    bullish: "bg-drill-green",
    bearish: "bg-flare-red",
    neutral: "bg-muted-foreground",
  };

  const catColor = {
    Oil: "bg-[#7B3F00]/20 text-[#c27a30]",
    Gas: "bg-primary/10 text-primary dark:text-accent",
    Nuclear: "bg-[#9b59b6]/10 text-[#9b59b6]",
    Renewables: "bg-drill-green/10 text-drill-green",
    Geopolitics: "bg-flare-red/10 text-flare-red",
    Markets: "bg-crude-gold/10 text-crude-gold",
    Policy: "bg-[#9b59b6]/10 text-[#9b59b6]",
    Refined: "bg-muted text-muted-foreground",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-crude-gold" />
            Energy Markets
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            <span className="text-border">·</span>
            Sourced from OilPrice.com
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchMarketData}
          disabled={refreshing}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Fetching..." : "Refresh"}
        </Button>
      </div>

      {/* Market Mood Banner */}
      {marketSummary && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-4 ${moodColors[marketSummary.marketMood] || moodColors.stable}`}
        >
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold uppercase tracking-wide">Market Mood: {marketSummary.marketMood}</span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed"><strong>Key Driver:</strong> {marketSummary.keyDriver}</p>
              <p className="text-xs opacity-80 leading-relaxed"><strong>OPEC:</strong> {marketSummary.opecStance}</p>
              <p className="text-xs opacity-80 leading-relaxed"><strong>Outlook:</strong> {marketSummary.outlook}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Commodity Prices */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-crude-gold" />
            Commodity Prices
          </h2>
          <div className="flex gap-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground border-transparent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 bg-muted/40 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Commodity</span>
            <span className="text-right">Price</span>
            <span className="text-right">Change</span>
            <span className="text-right hidden sm:block">% Chg</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filtered.map((item, i) => {
              const up = item.changePct >= 0;
              return (
                <motion.div
                  key={item.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedCommodity(item)}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.symbol} · {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-foreground">${item.price?.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">{item.unit}</p>
                  </div>
                  <div className={`flex items-center gap-1 justify-end ${up ? "text-drill-green" : "text-flare-red"}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-mono text-xs font-semibold">
                      {up ? "+" : ""}{item.change?.toFixed(3)}
                    </span>
                  </div>
                  <div className={`text-right hidden sm:block font-mono text-xs font-bold px-2 py-0.5 rounded ${up ? "bg-drill-green/10 text-drill-green" : "bg-flare-red/10 text-flare-red"}`}>
                    {up ? "+" : ""}{item.changePct?.toFixed(2)}%
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Breaking News */}
      <section>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-crude-gold" />
          Breaking Energy News
        </h2>

        {loadingNews ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                <div className="h-2.5 bg-muted rounded w-full mb-1.5" />
                <div className="h-2.5 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click Refresh to load the latest headlines</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${sentimentDot[item.sentiment] || "bg-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={`${catColor[item.category] || "bg-muted text-muted-foreground"} border-0 text-[10px] font-semibold`}>
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{item.age}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-1">{item.headline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border">
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            For comprehensive real-time coverage, visit{" "}
            <a href="https://oilprice.com" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline font-medium">
              OilPrice.com
            </a>{" "}
            — the #1 source for oil & energy news.
          </p>
        </div>
      </section>

      {/* Investor CTA */}
      <section className="rounded-2xl border border-crude-gold/30 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-5">
        <p className="text-crude-gold text-xs font-semibold uppercase tracking-widest mb-1">Put Prices to Work</p>
        <h3 className="text-white font-bold text-base mb-1">Turn Today's Prices Into Investment Returns</h3>
        <p className="text-white/70 text-xs mb-4 leading-relaxed">
          Use commodity prices above directly in your cash flow models. Model your working interest income based on live market conditions across oil, gas, and emerging energy sectors.
        </p>
        <div className="flex gap-2 flex-wrap">
          <a href="/calc/barrels-to-cash" className="inline-flex items-center gap-1.5 bg-crude-gold text-petroleum text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <TrendingUp className="w-3.5 h-3.5" /> Oil Income Calculator
          </a>
          <a href="/calc/natgas-to-cash" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            <Zap className="w-3.5 h-3.5" /> Gas Income Calculator
          </a>
        </div>
      </section>

      {/* Commodity Detail Modal */}
      <CommodityModal
        commodity={selectedCommodity}
        open={!!selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />
    </div>
  );
}