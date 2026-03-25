import { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, AlertTriangle, Zap, BarChart3, Target, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LivePriceBar from "../components/intelligence/LivePriceBar";
import MarketSentimentGauge from "../components/intelligence/MarketSentimentGauge";
import MarketBrief from "../components/intelligence/MarketBrief";
import CalcSelector from "../components/intelligence/CalcSelector";
import BreakEvenAnalysis from "../components/intelligence/BreakEvenAnalysis";
import IRRImpactWidget from "../components/intelligence/IRRImpactWidget";
import SectorHeatmap from "../components/intelligence/SectorHeatmap";
import TopMovers from "../components/intelligence/TopMovers";
import WeeklyOutlook from "../components/intelligence/WeeklyOutlook";
import LatestNews from "../components/intelligence/LatestNews";
import DisclaimerFooter from "../components/DisclaimerFooter";
import PullToRefresh from "@/components/mobile/PullToRefresh";

const ENERGY_SYMBOLS = ["WTI", "BRENT", "NG", "HO"];

const defaultPrices = [
  { label: "WTI Crude Oil", price: null, change: 0, changePct: 0, unit: "/bbl" },
  { label: "Brent Crude Oil", price: null, change: 0, changePct: 0, unit: "/bbl" },
  { label: "Natural Gas", price: null, change: 0, changePct: 0, unit: "/MMBtu" },
  { label: "Heating Oil", price: null, change: 0, changePct: 0, unit: "/gal" },
];

export default function MarketIntelligence() {
  const [allCommodities, setAllCommodities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCalcId, setSelectedCalcId] = useState(null);

  const { data: calculations = [], isLoading } = useQuery({
    queryKey: ["calculations"],
    queryFn: () => base44.entities.Calculation.list("-created_date", 50),
  });

  // Derive the 4 energy prices from the unified allCommodities dataset
  const prices = useMemo(() => {
    if (allCommodities.length === 0) return defaultPrices;
    return ENERGY_SYMBOLS.map(sym => {
      const c = allCommodities.find(x => x.symbol === sym);
      if (c) return { label: c.name, price: c.price, change: c.change ?? 0, changePct: c.changePct ?? 0, unit: c.unit };
      return defaultPrices.find(d => d.label.includes(sym === "WTI" ? "WTI" : sym === "BRENT" ? "Brent" : sym === "NG" ? "Natural Gas" : "Heating")) || defaultPrices[0];
    });
  }, [allCommodities]);

  const fetchPrices = async () => {
    setRefreshing(true);
    try {
      const res = await base44.functions.invoke("fetchAllCommodities", {});
      if (res.data?.commodities?.length) {
        setAllCommodities(res.data.commodities);
        setLastUpdated(new Date());
      }
    } catch (e) { /* keep defaults */ }
    setRefreshing(false);
  };

  const queryClient = useQueryClient();

  const handlePullRefresh = useCallback(async () => {
    await Promise.all([
      fetchPrices(),
      queryClient.invalidateQueries({ queryKey: ["calculations"] }),
    ]);
  }, [queryClient]);

  useEffect(() => { fetchPrices(); }, []);

  // Auto-select first eligible calc
  useEffect(() => {
    if (!selectedCalcId && calculations.length > 0) {
      const first = calculations.find(c => ["barrels_to_cash", "natgas_to_cash", "rate_of_return"].includes(c.calc_type));
      if (first) setSelectedCalcId(first.id);
    }
  }, [calculations, selectedCalcId]);

  const selectedCalc = calculations.find(c => c.id === selectedCalcId);

  const liveOilPrice = prices.find(p => p.label?.includes("WTI"))?.price ?? null;
  const liveGasPrice = prices.find(p => p.label?.includes("Natural Gas"))?.price ?? null;

  const enrichedCalc = selectedCalc ? {
    ...selectedCalc,
    _savedOilPrice: selectedCalc.inputs?.oilPrice || 70,
    _savedGasPrice: selectedCalc.inputs?.gasPrice || 3.5,
  } : null;

  const loadedCount = allCommodities.filter(c => c.price != null).length || prices.filter(p => p.price != null).length;

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-petroleum via-[#0e2f55] to-[#1a3a6b]" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 20% 80%, rgba(212,168,67,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46,125,50,0.2) 0%, transparent 50%)"
          }} />

          <div className="relative px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-crude-gold" />
                  <span className="text-crude-gold/80 text-[10px] font-bold uppercase tracking-[0.2em]">Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Market Intelligence
                </h1>
                <p className="text-white/60 text-sm mt-1.5 max-w-lg leading-relaxed">
                  Live commodity prices, AI-powered analysis, sector performance, and real-time impact on your investment models — all in one place.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0 mt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Zap className="w-3 h-3 text-crude-gold" />
                  <span className="text-[10px] text-white/80 font-semibold">
                    {loadedCount} feeds active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Live Price Ticker ── */}
        <LivePriceBar prices={prices} refreshing={refreshing} onRefresh={fetchPrices} lastUpdated={lastUpdated} />

        {/* ── Tabs: Overview / Analysis / Portfolio ── */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="text-xs py-2.5 gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Market Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs py-2.5 gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs py-2.5 gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Portfolio Impact
            </TabsTrigger>
          </TabsList>

          {/* ═══ TAB 1: Market Overview ═══ */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* Sentiment + AI Brief */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MarketSentimentGauge prices={prices} />
              <MarketBrief prices={prices} />
            </div>

            {/* Sector Heatmap */}
            <SectorHeatmap allCommodities={allCommodities} />

            {/* Top Movers */}
            <TopMovers allCommodities={allCommodities} />

            {/* Latest News */}
            <LatestNews />
          </TabsContent>

          {/* ═══ TAB 2: AI Analysis ═══ */}
          <TabsContent value="analysis" className="space-y-6 mt-0">
            {/* Weekly Outlook */}
            <WeeklyOutlook allCommodities={allCommodities} />

            {/* Market context callout */}
            {liveOilPrice && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="rounded-xl border border-crude-gold/20 bg-gradient-to-r from-crude-gold/5 to-transparent p-4 flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-crude-gold/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-crude-gold" />
                </div>
                <div>
                  <p className="text-xs text-foreground font-bold">Live Market Context</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    WTI is at <strong className="text-foreground font-mono">${liveOilPrice.toFixed(2)}/bbl</strong>
                    {liveGasPrice && <> and Henry Hub at <strong className="text-foreground font-mono">${liveGasPrice.toFixed(2)}/MMBtu</strong></>}.
                    Generate the AI Weekly Outlook above for sector-by-sector analysis, risk assessment, and actionable trade ideas.
                  </p>
                </div>
              </motion.div>
            )}

            {/* AI Brief (duplicate here for convenience) */}
            <MarketBrief prices={prices} />
          </TabsContent>

          {/* ═══ TAB 3: Portfolio Impact ═══ */}
          <TabsContent value="portfolio" className="space-y-6 mt-0">
            {/* Market context */}
            {liveOilPrice && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-crude-gold/20 bg-gradient-to-r from-crude-gold/5 to-transparent p-4 flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-crude-gold/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-crude-gold" />
                </div>
                <div>
                  <p className="text-xs text-foreground font-bold">Live Portfolio Impact</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    WTI is at <strong className="text-foreground font-mono">${liveOilPrice.toFixed(2)}/bbl</strong>
                    {liveGasPrice && <> and Henry Hub at <strong className="text-foreground font-mono">${liveGasPrice.toFixed(2)}/MMBtu</strong></>}.
                    Select a saved model below to see how these prices impact your break-even, net income, and projected IRR.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Saved Models Selector */}
            {isLoading ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-muted border-t-crude-gold rounded-full animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">Loading your saved models...</p>
              </div>
            ) : (
              <CalcSelector calculations={calculations} selectedId={selectedCalcId} onSelect={setSelectedCalcId} />
            )}

            {/* Analysis Widgets */}
            {enrichedCalc && (enrichedCalc.calc_type === "barrels_to_cash" || enrichedCalc.calc_type === "natgas_to_cash") && (
              <BreakEvenAnalysis calc={enrichedCalc} liveOilPrice={liveOilPrice} liveGasPrice={liveGasPrice} />
            )}

            {enrichedCalc && enrichedCalc.calc_type === "rate_of_return" && (
              <IRRImpactWidget calc={enrichedCalc} liveOilPrice={liveOilPrice} liveGasPrice={liveGasPrice} />
            )}

            {!enrichedCalc && calculations.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-border p-10 text-center"
              >
                <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">Select a saved model above to see live market impact analysis</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <DisclaimerFooter />
      </div>
    </PullToRefresh>
  );
}