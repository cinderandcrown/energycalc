import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Newspaper, ArrowUpRight, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: "text-drill-green", bg: "bg-drill-green/10" },
  bearish: { icon: TrendingDown, color: "text-flare-red", bg: "bg-flare-red/10" },
  neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
  warning: { icon: AlertTriangle, color: "text-crude-gold", bg: "bg-crude-gold/10" },
};

const impactColors = {
  high: "bg-flare-red/10 text-flare-red border-0",
  medium: "bg-crude-gold/10 text-crude-gold border-0",
  low: "bg-muted text-muted-foreground border-0",
};

export default function LatestNews() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["intelligence-news"],
    queryFn: () => base44.entities.CommodityNews.list("-created_date", 6),
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-muted border-t-crude-gold rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-crude-gold" />
          <h3 className="text-sm font-bold text-foreground">Latest Intelligence</h3>
        </div>
        <Link to="/news" className="text-[10px] text-primary dark:text-accent font-medium flex items-center gap-1 hover:underline">
          All News <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {news.map((item, i) => {
          const sent = sentimentConfig[item.sentiment] || sentimentConfig.neutral;
          const SentIcon = sent.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${sent.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <SentIcon className={`w-4 h-4 ${sent.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {item.impact_level && (
                      <Badge className={`${impactColors[item.impact_level] || impactColors.low} text-[8px] font-bold uppercase`}>
                        {item.impact_level} impact
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-[8px]">{item.category.replace("_", " ")}</Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug mb-1">{item.headline}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {item.source && (
                      <span className="text-[9px] text-muted-foreground">{item.source}</span>
                    )}
                    {item.published_date && (
                      <span className="text-[9px] text-muted-foreground">
                        {format(new Date(item.published_date), "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}