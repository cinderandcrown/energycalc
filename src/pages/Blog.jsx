import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import AffiliatesSidebar from "@/components/ads/AffiliatesSidebar";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "oil_gas", label: "Oil & Gas" },
  { key: "precious_metals", label: "Metals" },
  { key: "agriculture", label: "Agriculture" },
  { key: "investor_protection", label: "Protection" },
  { key: "market_analysis", label: "Analysis" },
  { key: "how_to_guide", label: "How-To" },
];

export default function Blog() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => base44.entities.BlogPost.filter({ status: "published" }, "-publish_date", 50),
  });

  const filtered = posts.filter((p) => {
    const catMatch = category === "all" || p.category === category;
    const searchMatch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary dark:text-accent" />
          <h1 className="text-2xl font-bold text-foreground">EnergyCalc Pro Insights</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Expert analysis on commodity markets, investor protection, tax strategies, and energy transition — published daily.
        </p>
      </div>

      {/* Top Ad */}
      <AdBanner slot="BLOG_TOP" format="horizontal" className="mb-6 rounded-xl" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.key} value={c.key} className="text-xs whitespace-nowrap">{c.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Posts */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-border bg-card">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No articles found</p>
              <p className="text-xs text-muted-foreground">New content is published daily. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.slice(0, 4).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Mid-content Ad */}
              {filtered.length > 4 && (
                <AdBanner slot="BLOG_MID" format="horizontal" className="my-6 rounded-xl" />
              )}

              {filtered.length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.slice(4).map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 hidden lg:block">
          <AffiliatesSidebar />
          <AdBanner slot="BLOG_SIDEBAR" format="auto" />
        </aside>
      </div>

      {/* Bottom Ad */}
      <AdBanner slot="BLOG_BOTTOM" format="horizontal" className="mt-8 rounded-xl" />

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 mt-6">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> Content is for informational purposes only and does not constitute investment advice. Past performance does not guarantee future results. Always consult a licensed financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}