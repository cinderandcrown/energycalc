import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle } from "lucide-react";
import LivePriceBar from "../components/intelligence/LivePriceBar";
import CalcSelector from "../components/intelligence/CalcSelector";
import BreakEvenAnalysis from "../components/intelligence/BreakEvenAnalysis";
import IRRImpactWidget from "../components/intelligence/IRRImpactWidget";
import DisclaimerFooter from "../components/DisclaimerFooter";

const defaultPrices = [
  { label: "WTI Crude", price: null, change: 0, changePct: 0, unit: "/bbl" },
  { label: "Brent Crude", price: null, change: 0, changePct: 0, unit: "/bbl" },
  { label: "Natural Gas", price: null, change: 0, changePct: 0, unit: "/MMBtu" },
  { label: "Heating Oil", price: null, change: 0, changePct: 0, unit: "/gal" },
];

export default function MarketIntelligence() {
  const [prices, setPrices] = useState(defaultPrices);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCalcId, setSelectedCalcId] = useState(null);

  const { data: calculations = [], isLoading } = useQuery({
    queryKey: ["calculations"],
    queryFn: () => base44.entities.Calculation.list("-created_date", 50),
  });

  const fetchPrices = async () => {
    setRefreshing(true);
    try {
      const res = await base44.functions.invoke("fetchPrices", {});
      if (res.data?.prices?.length) {
        setPrices(res.data.prices);
        setLastUpdated(new Date());
      }
    } catch (e) { /* keep defaults */ }
    setRefreshing(false);
  };

  useEffect(() => { fetchPrices(); }, []);

  // Auto-select first eligible calc
  useEffect(() => {
    if (!selectedCalcId && calculations.length > 0) {
      const first = calculations.find(c => ["barrels_to_cash", "natgas_to_cash", "rate_of_return"].includes(c.calc_type));
      if (first) setSelectedCalcId(first.id);
    }
  }, [calculations, selectedCalcId]);

  const selectedCalc = calculations.find(c => c.id === selectedCalcId);

  // Extract live WTI and NG prices
  const liveOilPrice = prices.find(p => p.label === "WTI Crude")?.price ?? null;
  const liveGasPrice = prices.find(p => p.label === "Natural Gas")?.price ?? null;

  // Enrich rate_of_return calcs with saved prices for scaling
  const enrichedCalc = selectedCalc ? {
    ...selectedCalc,
    _savedOilPrice: selectedCalc.inputs?.oilPrice || 70,
    _savedGasPrice: selectedCalc.inputs?.gasPrice || 3.5,
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-crude-gold" />
          Market Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Live commodity prices overlaid on your saved models — see how the market shifts your returns in real time
        </p>
      </div>

      {/* Live prices */}
      <LivePriceBar prices={prices} refreshing={refreshing} onRefresh={fetchPrices} lastUpdated={lastUpdated} />

      {/* Margin safety callout */}
      {liveOilPrice && (
        <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-crude-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-foreground font-semibold">Live Market Context</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              WTI is at <strong className="text-foreground">${liveOilPrice.toFixed(2)}/bbl</strong>
              {liveGasPrice && <> and Henry Hub at <strong className="text-foreground">${liveGasPrice.toFixed(2)}/MMBtu</strong></>}.
              Select a saved calculation below to see how these prices impact your break-even, net income, and projected IRR compared to the assumptions in your original model.
            </p>
          </div>
        </div>
      )}

      {/* Calc selector */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading saved calculations...</p>
        </div>
      ) : (
        <CalcSelector calculations={calculations} selectedId={selectedCalcId} onSelect={setSelectedCalcId} />
      )}

      {/* Analysis widgets */}
      {enrichedCalc && (enrichedCalc.calc_type === "barrels_to_cash" || enrichedCalc.calc_type === "natgas_to_cash") && (
        <BreakEvenAnalysis calc={enrichedCalc} liveOilPrice={liveOilPrice} liveGasPrice={liveGasPrice} />
      )}

      {enrichedCalc && enrichedCalc.calc_type === "rate_of_return" && (
        <IRRImpactWidget calc={enrichedCalc} liveOilPrice={liveOilPrice} liveGasPrice={liveGasPrice} />
      )}

      {/* No selection hint */}
      {!enrichedCalc && calculations.length > 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Select a saved calculation above to see live market impact analysis.</p>
        </div>
      )}

      <DisclaimerFooter />
    </div>
  );
}