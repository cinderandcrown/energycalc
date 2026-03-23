import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag, Eye, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import AdBanner from "@/components/ads/AdBanner";
import AffiliatesSidebar from "@/components/ads/AffiliatesSidebar";

const categoryLabels = {
  oil_gas: "Oil & Gas", precious_metals: "Precious Metals", industrial_metals: "Industrial Metals",
  agriculture: "Agriculture", investor_protection: "Investor Protection", tax_strategy: "Tax Strategy",
  market_analysis: "Market Analysis", energy_transition: "Energy Transition", rare_earth: "Rare Earth",
  how_to_guide: "How-To Guide",
};

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split("/blog/")[1];

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      // Try to find by slug first, fallback to id
      const posts = await base44.entities.BlogPost.filter({ slug, status: "published" });
      if (posts.length > 0) {
        setPost(posts[0]);
        // Increment view count silently
        base44.entities.BlogPost.update(posts[0].id, { view_count: (posts[0].view_count || 0) + 1 }).catch(() => {});
      } else {
        // Try by ID
        const byId = await base44.entities.BlogPost.filter({ status: "published" });
        const found = byId.find(p => p.id === slug || p.slug === slug);
        if (found) {
          setPost(found);
          base44.entities.BlogPost.update(found.id, { view_count: (found.view_count || 0) + 1 }).catch(() => {});
        }
      }
      setLoading(false);
    };
    if (slug) loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">Article Not Found</h1>
        <p className="text-sm text-muted-foreground mb-4">This article may have been removed or the URL is incorrect.</p>
        <Link to="/blog">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <article className="max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all articles
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent border-0 text-[10px]">
              {categoryLabels[post.category] || post.category}
            </Badge>
            {post.publish_date && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(post.publish_date), "MMMM d, yyyy")}
              </span>
            )}
            {post.view_count > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Eye className="w-3 h-3" />
                {post.view_count} views
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>

          {post.featured_image_url && (
            <img src={post.featured_image_url} alt={post.title} className="w-full rounded-2xl mb-6 aspect-[16/9] object-cover" />
          )}

          {/* Top ad */}
          <AdBanner slot="ARTICLE_TOP" format="horizontal" className="mb-6 rounded-xl" />

          {/* Article body */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Bottom ad */}
          <AdBanner slot="ARTICLE_BOTTOM" format="horizontal" className="mt-8 rounded-xl" />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-6">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {post.tags.map(t => (
                <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">LinkedIn</a>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 mt-6">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute investment, tax, or legal advice. Consult a licensed professional before making any investment decision.
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 hidden lg:block">
          <AffiliatesSidebar />
          <AdBanner slot="ARTICLE_SIDEBAR" format="auto" />
        </aside>
      </div>
    </div>
  );
}