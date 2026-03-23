import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  TrendingUp, TrendingDown, RefreshCw, Newspaper,
  Zap, Globe, Clock, ExternalLink, BarChart3, AlertCircle,
  Flame, Gem, Factory, Wheat, Ham, Trees
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommodityTable from "../components/markets/CommodityTable";
import MarketOverviewCards from "../components/markets/MarketOverviewCards";
import CommodityModal from "../components/markets/CommodityModal";

const CATEGORIES = [
  { key: "All", label: "All", icon: Globe },
  { key: "Energy", label: "Energy", icon: Flame },
  { key: "Precious Metals", label: "Precious", icon: Gem },
  { key: "Industrial Metals", label: "Industrial", icon: Factory },
  { key: "Agriculture", label: "Agriculture", icon: Wheat },
  { key: "Livestock", label: "Livestock", icon: Ham },
  { key: "Softs", label: "Softs", icon: Trees },
];

export default function Markets() {
  const [commodities, setCommodities] = useState([]);
  const [news, setNews] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCommodity, setSelectedCommodity] = useState(null);

  const fetchPrices = async () => {
    setLoadingPrices(true);
    const res = await base44.functions.invoke("fetchAllCommodities", {});
    if (res.data?.commodities?.length) {
      setCommodities(res.data.commodities);
      setLastUpdated(new Date(res.data.fetchedAt));
    }
    setLoadingPrices(false);
  };

  const fetchNews = async () => {
    setLoadingNews(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a commodity market analyst. Search for the latest commodity market news as of today (${new Date().toDateString()}).

Return a JSON object with:
1. "news": array of 8 recent REAL commodity market headlines covering energy, metals, agriculture, and general markets. Only include headlines from actual published articles. Fields: headline (string, max 90 chars), summary (string, max 160 chars), age (string like "2h ago"), category ("Energy"|"Metals"|"Agriculture"|"Markets"|"Geopolitics"|"Policy"), sentiment ("bullish"|"bearish"|"neutral")
2. "summary": object with fields: marketMood ("bullish"|"bearish"|"volatile"|"stable"), energyOutlook (string, 1 sentence), metalsOutlook (string, 1 sentence), agOutlook (string, 1 sentence), keyDriver (string, 1 sentence about main cross-market driver)

CRITICAL: Only include news from REAL published articles. Do NOT fabricate headlines.`,
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
              energyOutlook: { type: "string" },
              metalsOutlook: { type: "string" },
              agOutlook: { type: "string" },
              keyDriver: { type: "string" }
            }
          }
        }
      }
    });

    if (result?.news?.length) setNews(result.news);
    if (result?.summary) setMarketSummary(result.summary);
    setLoadingNews(false);
  };

  useEffect(() => {
    fetchPrices();
    fetchNews();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([fetchPrices(), fetchNews()]);
  };

  const filtered = useMemo(() => {
    if (activeCategory === "All") return commodities;
    return commodities.filter(c => c.category === activeCategory);
  }, [commodities, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { All: commodities.length };
    commodities.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [commodities]);

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
    Energy: "bg-[#c27a30]/15 text-[#c27a30]",
    Metals: "bg-primary/10 text-primary dark:text-accent",
    Agriculture: "bg-drill-green/10 text-drill-green",
    Markets: "bg-crude-gold/10 text-crude-gold",
    Geopolitics: "bg-flare-red/10 text-flare-red",
    Policy: "bg-[#9b59b6]/10 text-[#9b59b6]",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-crude-gold" />
            Commodity Markets
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Loading..."}
            <span className="text-border">·</span>
            {commodities.length} commodities · AI-sourced from live markets
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loadingPrices}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingPrices ? "animate-spin" : ""}`} />
          {loadingPrices ? "Fetching..." : "Refresh All"}
        </Button>
      </div>

      {/* Top Movers */}
      {!loadingPrices && commodities.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-crude-gold" /> Top Movers
          </h2>
          <MarketOverviewCards commodities={commodities} />
        </section>
      )}

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
                <Badge className="bg-muted text-muted-foreground border-0 text-[9px]">AI Commentary</Badge>
              </div>
              <p className="text-xs opacity-90 leading-relaxed"><strong>Key Driver:</strong> {marketSummary.keyDriver}</p>
              <p className="text-xs opacity-80 leading-relaxed"><strong>Energy:</strong> {marketSummary.energyOutlook}</p>
              <p className="text-xs opacity-80 leading-relaxed"><strong>Metals:</strong> {marketSummary.metalsOutlook}</p>
              <p className="text-xs opacity-80 leading-relaxed"><strong>Agriculture:</strong> {marketSummary.agOutlook}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs + Commodity Table */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-crude-gold" />
            Commodity Prices
          </h2>
        </div>

        <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                activeCategory === key
                  ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground border-transparent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {categoryCounts[key] > 0 && (
                <span className="text-[10px] opacity-70">({categoryCounts[key]})</span>
              )}
            </button>
          ))}
        </div>

        {loadingPrices ? (
          <div className="space-y-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3.5 border-b border-border last:border-0 animate-pulse">
                  <div>
                    <div className="h-3.5 bg-muted rounded w-32 mb-1.5" />
                    <div className="h-2.5 bg-muted rounded w-20" />
                  </div>
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-14" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CommodityTable items={filtered} onSelect={setSelectedCommodity} />
        )}
      </section>

      {/* News Section */}
      <section>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-crude-gold" />
            Commodity News
          </h2>
          <Badge className="bg-muted text-muted-foreground border-0 text-[9px]">AI-Sourced · Verify Independently</Badge>
        </div>

        {loadingNews ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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
            <p className="text-sm text-muted-foreground">News loading failed. Click Refresh to try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {news.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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
            For real-time coverage:{" "}
            <a href="https://oilprice.com" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline font-medium">OilPrice.com</a>{" · "}
            <a href="https://www.kitco.com" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline font-medium">Kitco</a>{" · "}
            <a href="https://tradingeconomics.com/commodities" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline font-medium">Trading Economics</a>
          </p>
        </div>
      </section>

      {/* Investor CTA */}
      <section className="rounded-2xl border border-crude-gold/30 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-5">
        <p className="text-crude-gold text-xs font-semibold uppercase tracking-widest mb-1">Put Prices to Work</p>
        <h3 className="text-white font-bold text-base mb-1">Turn Today's Prices Into Investment Returns</h3>
        <p className="text-white/70 text-xs mb-4 leading-relaxed">
          Use live commodity prices directly in your calculators. Model oil income, metal cost-basis, ag yield projections, and gold valuations with real market data.
        </p>
        <div className="flex gap-2 flex-wrap">
          <a href="/calc/barrels-to-cash" className="inline-flex items-center gap-1.5 bg-crude-gold text-petroleum text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <TrendingUp className="w-3.5 h-3.5" /> Oil Calculator
          </a>
          <a href="/calc/metal-cost" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            <Factory className="w-3.5 h-3.5" /> Metal Cost-Basis
          </a>
          <a href="/calc/ag-yield" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            <Wheat className="w-3.5 h-3.5" /> Ag Yield
          </a>
          <a href="/calc/gold-purity" className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            <Gem className="w-3.5 h-3.5" /> Gold Purity
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