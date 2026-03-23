import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const categoryLabels = {
  oil_gas: "Oil & Gas",
  precious_metals: "Precious Metals",
  industrial_metals: "Industrial Metals",
  agriculture: "Agriculture",
  investor_protection: "Investor Protection",
  tax_strategy: "Tax Strategy",
  market_analysis: "Market Analysis",
  energy_transition: "Energy Transition",
  rare_earth: "Rare Earth",
  how_to_guide: "How-To Guide",
};

const categoryColors = {
  oil_gas: "bg-petroleum/10 text-petroleum dark:bg-accent/10 dark:text-accent",
  precious_metals: "bg-crude-gold/10 text-crude-gold",
  industrial_metals: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  agriculture: "bg-drill-green/10 text-drill-green",
  investor_protection: "bg-flare-red/10 text-flare-red",
  tax_strategy: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  market_analysis: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  energy_transition: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rare_earth: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  how_to_guide: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

const categoryGradients = {
  oil_gas: "from-petroleum via-[#0e2f55] to-[#1a3a6b]",
  precious_metals: "from-yellow-700 via-yellow-600 to-amber-500",
  industrial_metals: "from-slate-600 via-slate-500 to-blue-600",
  agriculture: "from-green-800 via-green-700 to-emerald-600",
  investor_protection: "from-red-800 via-red-700 to-rose-600",
  tax_strategy: "from-purple-800 via-purple-700 to-violet-600",
  market_analysis: "from-cyan-800 via-cyan-700 to-teal-600",
  energy_transition: "from-emerald-800 via-emerald-700 to-green-500",
  rare_earth: "from-orange-800 via-orange-700 to-amber-600",
  how_to_guide: "from-indigo-800 via-indigo-700 to-blue-600",
};

export default function BlogCard({ post, featured = false }) {
  const slug = post.slug || post.id;
  const imageUrl = post.featured_image_url;
  const gradientFallback = categoryGradients[post.category] || "from-petroleum via-[#0e2f55] to-[#1a3a6b]";
  const catColor = categoryColors[post.category] || "bg-primary/10 text-primary";

  if (featured) {
    return (
      <Link
        to={`/blog/${slug}`}
        className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:shadow-2xl transition-all duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradientFallback} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
                <span className="text-white/20 text-6xl font-bold uppercase tracking-widest select-none">
                  {(categoryLabels[post.category] || "Blog").slice(0, 3)}
                </span>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${catColor} border-0 text-[10px] font-bold uppercase tracking-wider`}>
                {categoryLabels[post.category] || post.category}
              </Badge>
              <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-[10px] font-bold">Featured</Badge>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-crude-gold transition-colors duration-300">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
              {post.excerpt || post.meta_description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {post.publish_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.publish_date), "MMM d, yyyy")}
                </span>
              )}
              {post.view_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.view_count} views
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-crude-gold group-hover:gap-2.5 transition-all">
              Read article <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-crude-gold/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientFallback} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
            <span className="text-white/15 text-5xl font-bold uppercase tracking-widest select-none">
              {(categoryLabels[post.category] || "Blog").slice(0, 3)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Badge className={`absolute top-3 left-3 ${catColor} border-0 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}>
          {categoryLabels[post.category] || post.category}
        </Badge>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-crude-gold transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {post.excerpt || post.meta_description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            {post.publish_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(post.publish_date), "MMM d")}
              </span>
            )}
            {post.view_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.view_count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-crude-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Read <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export { categoryLabels, categoryColors };