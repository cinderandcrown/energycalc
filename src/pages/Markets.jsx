import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3, RefreshCw, Loader2, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommodityTable from "@/components/markets/CommodityTable";
import MarketOverviewCards from "@/components/markets/MarketOverviewCards";
import CommodityModal from "@/components/markets/CommodityModal";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "Energy", label: "Energy" },
  { key: "Precious Metals", label: "Precious" },
  { key: "Industrial Metals", label: "Industrial" },
  { key: "Agriculture", label: "Agriculture" },
  { key: "Livestock", label: "Livestock" },
  { key: "Softs", label: "Softs" },
];

export default function Markets() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cached, setCached] = useState(false);

  const fetchAll = async (forceRefresh = false) => {
    setLoading(true);
    const res = await base44.functions.invoke("fetchAllCommodities", { forceRefresh });
    if (res.data?.commodities?.length) {
      setCommodities(res.data.commodities);
      setFetchedAt(res.data.fetchedAt);
      setCached(res.data.cached || false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    if (category === "all") return commodities;
    return commodities.filter(c => c.category === category);
  }, [commodities, category]);

  const handleSelect = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary dark:text-accent" />
            Commodity Markets
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live prices across energy, metals, agriculture, and more
          </p>
          {fetchedAt && (
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                Updated {new Date(fetchedAt).toLocaleTimeString()}
              </span>
              <Badge variant="secondary" className="text-[10px]">{commodities.length} commodities</Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {cached && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">Cached</Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchAll(true)} disabled={loading} className="gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {cached ? "Refresh Live" : "Refresh"}
          </Button>
        </div>
      </div>

      {loading && commodities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Loading commodity prices...</p>
          <p className="text-[10px] text-muted-foreground">Checking cache first, fetching fresh data if needed</p>
        </div>
      ) : (
        <>
          {/* Top Movers */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-crude-gold" />
              <p className="text-xs font-semibold text-foreground">Top Movers</p>
            </div>
            <MarketOverviewCards commodities={commodities} />
          </div>

          {/* Category Tabs */}
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="w-full flex overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(c => (
                <TabsTrigger key={c.key} value={c.key} className="text-xs whitespace-nowrap">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Table */}
          <CommodityTable items={filtered} onSelect={handleSelect} />

          {/* AI disclaimer */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-drill-green animate-pulse mt-1.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Prices sourced via AI web search from major financial data providers (CME, LME, Kitco, Trading Economics). 
              May have a short delay from real-time. Click any commodity for detailed AI analysis. 
              Not for execution — verify with your broker.
            </p>
          </div>
        </>
      )}

      <CommodityModal commodity={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}