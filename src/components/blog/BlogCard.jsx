import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
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

export default function BlogCard({ post }) {
  const slug = post.slug || post.id;
  return (
    <Link
      to={`/blog/${slug}`}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-crude-gold/30 hover:shadow-lg transition-all"
    >
      {post.featured_image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent border-0 text-[10px] font-semibold">
            {categoryLabels[post.category] || post.category}
          </Badge>
          {post.publish_date && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(post.publish_date), "MMM d, yyyy")}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5 group-hover:text-crude-gold transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {post.excerpt || post.meta_description}
        </p>
        {post.view_count > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Eye className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{post.view_count} views</span>
          </div>
        )}
      </div>
    </Link>
  );
}