import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Newspaper, RefreshCw, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import PageHeader from "@/components/mobile/PageHeader";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import MobileSelect from "@/components/mobile/MobileSelect";

const FILTERS = [
  { key: "all", label: "All News" },
  { key: "fraud", label: "Fraud Alerts" },
  { key: "oil_gas", label: "Oil & Gas" },
  { key: "precious_metals", label: "Metals" },
  { key: "agriculture", label: "Agriculture" },
  { key: "regulation", label: "Regulation" },
  { key: "high_impact", label: "High Impact" },
];

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const loadNews = async () => {
    const news = await base44.entities.CommodityNews.list("-created_date", 100);
    setArticles(news);
    setLoading(false);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await base44.functions.invoke("curateNews", {});
    await loadNews();
    setRefreshing(false);
  }, []);

  const handlePullRefresh = useCallback(async () => {
    await loadNews();
  }, []);

  useEffect(() => { loadNews(); }, []);

  const filtered = articles.filter(a => {
    if (filter === "all") return true;
    if (filter === "fraud") return a.fraud_relevance || a.category === "fraud_alert";
    if (filter === "high_impact") return a.impact_level === "high";
    return a.category === filter;
  });

  const fraudCount = articles.filter(a => a.fraud_relevance || a.category === "fraud_alert").length;

  const filterOptions = FILTERS.map(f => ({ value: f.key, label: f.label }));

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title="Commodity News Feed"
          subtitle="AI-curated market intelligence · Updated every 4 hours"
          icon={Newspaper}
        >
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className="text-xs">{articles.length} stories</Badge>
            {fraudCount > 0 && (
              <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                {fraudCount} fraud alert{fraudCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </PageHeader>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5 min-h-[44px]">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Curating..." : "Refresh Feed"}
        </Button>
      </div>

      {/* Filters — mobile bottom sheet / desktop inline */}
      <div className="sm:hidden">
        <MobileSelect
          value={filter}
          onValueChange={setFilter}
          options={filterOptions}
          label="Filter News"
          placeholder="All News"
        />
      </div>
      <div className="hidden sm:flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            {articles.length === 0 ? "No news articles yet" : "No articles match this filter"}
          </p>
          {articles.length === 0 && (
            <Button size="sm" onClick={handleRefresh} disabled={refreshing} className="mt-3 gap-1.5">
              {refreshing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Fetch Latest News
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article, i) => (
            <motion.div key={article.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <NewsCard article={article} onClick={setSelectedArticle} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-muted/30 p-3.5 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          News curated by AI from public sources. Fraud alerts sourced from SEC, CFTC, FBI, and state regulators. 
          Verify all information independently before making investment decisions. Not financial advice.
        </p>
      </div>
    </div>
      <NewsModal
        article={selectedArticle}
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </PullToRefresh>
  );
}