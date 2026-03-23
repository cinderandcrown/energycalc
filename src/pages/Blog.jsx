import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Flame, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/blog/BlogCard";
import AdBanner from "@/components/ads/AdBanner";
import AffiliatesSidebar from "@/components/ads/AffiliatesSidebar";

const CATEGORIES = [
  { key: "all", label: "All Posts", icon: null },
  { key: "oil_gas", label: "Oil & Gas" },
  { key: "precious_metals", label: "Metals" },
  { key: "agriculture", label: "Agriculture" },
  { key: "investor_protection", label: "Protection" },
  { key: "market_analysis", label: "Analysis" },
  { key: "how_to_guide", label: "How-To" },
  { key: "tax_strategy", label: "Tax" },
  { key: "energy_transition", label: "Energy" },
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
    const searchMatch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const featuredPost = filtered[0];
  const remainingPosts = filtered.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-petroleum via-petroleum/95 to-petroleum/80 dark:from-card dark:via-card dark:to-card">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-crude-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-drill-green rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Flame className="w-4 h-4 text-petroleum" />
              </div>
              <Badge className="bg-crude-gold/20 text-crude-gold border-0 text-[10px] font-bold uppercase tracking-widest">
                Insights & Analysis
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Commodity Intelligence<br />
              <span className="text-crude-gold">You Can Act On</span>
            </h1>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
              Expert analysis on commodity markets, investor protection, tax strategies, and the energy transition — published for serious investors.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 w-full sm:w-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === c.key
                    ? "bg-crude-gold text-petroleum shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-crude-gold rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-border bg-card">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">No articles found</p>
            <p className="text-sm text-muted-foreground">Try a different filter or check back soon for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Main column */}
            <div className="space-y-8">
              {/* Featured post */}
              {featuredPost && <BlogCard post={featuredPost} featured />}

              {/* Stats bar */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-crude-gold" />
                  <strong className="text-foreground">{filtered.length}</strong> articles
                </span>
                {category !== "all" && (
                  <span>
                    in <Badge variant="outline" className="text-[10px] ml-1">{CATEGORIES.find(c => c.key === category)?.label}</Badge>
                  </span>
                )}
              </div>

              {/* Top ad */}
              <AdBanner slot="BLOG_TOP" format="horizontal" className="rounded-xl" />

              {/* Grid of remaining posts */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {remainingPosts.slice(0, 4).map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}

              {/* Mid ad */}
              {remainingPosts.length > 4 && (
                <AdBanner slot="BLOG_MID" format="horizontal" className="rounded-xl" />
              )}

              {remainingPosts.length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {remainingPosts.slice(4).map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}

              {/* Bottom ad */}
              <AdBanner slot="BLOG_BOTTOM" format="horizontal" className="rounded-xl" />
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 hidden lg:block">
              <div className="sticky top-20 space-y-5">
                <AffiliatesSidebar />
                <AdBanner slot="BLOG_SIDEBAR" format="auto" className="rounded-xl" />
              </div>
            </aside>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 mt-10">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> Content is for informational purposes only and does not constitute investment advice. Past performance does not guarantee future results. Always consult a licensed financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}