import { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3, RefreshCw, Loader2, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommodityTable from "@/components/markets/CommodityTable";
import MarketOverviewCards from "@/components/markets/MarketOverviewCards";
import CommodityModal from "@/components/markets/CommodityModal";
import PageHeader from "@/components/mobile/PageHeader";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import MobileSelect from "@/components/mobile/MobileSelect";

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (forceRefresh = false) => {
    if (forceRefresh || commodities.length > 0) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    const res = await base44.functions.invoke("fetchAllCommodities", { forceRefresh });
    if (res.data?.commodities?.length) {
      setCommodities(res.data.commodities);
      setFetchedAt(res.data.fetchedAt);
      setCached(res.data.cached || false);
    }
    setLoading(false);
    setRefreshing(false);
  }, [commodities.length]);

  const handlePullRefresh = useCallback(() => fetchAll(true), [fetchAll]);

  useEffect(() => {
    // Step 1: Load cache instantly (even stale)
    const loadCacheThenRefresh = async () => {
      setLoading(true);
      const cacheRes = await base44.functions.invoke("fetchAllCommodities", { cacheOnly: true });
      if (cacheRes.data?.commodities?.length) {
        setCommodities(cacheRes.data.commodities);
        setFetchedAt(cacheRes.data.fetchedAt);
        setCached(true);
        setLoading(false);
        // Step 2: If cache is stale, refresh in background
        if (cacheRes.data.stale) {
          setRefreshing(true);
          try {
            const freshRes = await base44.functions.invoke("fetchAllCommodities", { forceRefresh: true });
            if (freshRes.data?.commodities?.length) {
              setCommodities(freshRes.data.commodities);
              setFetchedAt(freshRes.data.fetchedAt);
              setCached(false);
            }
          } catch (e) {
            console.warn("Background refresh failed, using cached data", e.message);
          }
          setRefreshing(false);
        }
      } else {
        // No cache at all — full load
        const freshRes = await base44.functions.invoke("fetchAllCommodities", {});
        if (freshRes.data?.commodities?.length) {
          setCommodities(freshRes.data.commodities);
          setFetchedAt(freshRes.data.fetchedAt);
          setCached(freshRes.data.cached || false);
        }
        setLoading(false);
      }
    };
    loadCacheThenRefresh();
  }, []);

  const filtered = useMemo(() => {
    if (category === "all") return commodities;
    return commodities.filter(c => c.category === category);
  }, [commodities, category]);

  const handleSelect = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  const categoryOptions = CATEGORIES.map(c => ({ value: c.key, label: c.label }));

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Commodity Markets"
          subtitle="Live prices across energy, metals, agriculture, and more"
          icon={BarChart3}
        >
          {fetchedAt && (
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Updated {new Date(fetchedAt).toLocaleTimeString()}
              </span>
              <Badge variant="secondary" className="text-xs">{commodities.length} commodities</Badge>
            </div>
          )}
        </PageHeader>
        <div className="flex items-center gap-2">
          {refreshing && (
            <Badge variant="outline" className="text-xs text-crude-gold border-crude-gold/30 animate-pulse">Updating...</Badge>
          )}
          {cached && !refreshing && (
            <Badge variant="outline" className="text-xs text-muted-foreground">Cached</Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchAll(true)} disabled={loading || refreshing} className="gap-1.5 min-h-[44px]">
            <RefreshCw className={`w-4 h-4 ${loading || refreshing ? "animate-spin" : ""}`} />
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

          {/* Category Filter — mobile bottom sheet / desktop inline */}
          <div className="sm:hidden">
            <MobileSelect
              value={category}
              onValueChange={setCategory}
              options={categoryOptions}
              label="Filter by Category"
              placeholder="All Categories"
            />
          </div>
          <div className="hidden sm:flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === c.key
                    ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

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
    </PullToRefresh>
  );
}