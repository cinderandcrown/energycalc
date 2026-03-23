import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag, Eye, Share2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import AdBanner from "@/components/ads/AdBanner";
import AffiliatesSidebar from "@/components/ads/AffiliatesSidebar";
import { categoryLabels, categoryColors } from "@/components/blog/BlogCard";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=600&fit=crop&q=80",
];

function getPlaceholder(id) {
  const hash = (id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

function estimateReadTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const slug = window.location.pathname.split("/blog/")[1];

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const posts = await base44.entities.BlogPost.filter({ slug, status: "published" });
      if (posts.length > 0) {
        setPost(posts[0]);
        base44.entities.BlogPost.update(posts[0].id, { view_count: (posts[0].view_count || 0) + 1 }).catch(() => {});
      } else {
        const byId = await base44.entities.BlogPost.filter({ status: "published" });
        const found = byId.find((p) => p.id === slug || p.slug === slug);
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
        <div className="w-8 h-8 border-4 border-muted border-t-crude-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">Article Not Found</h1>
        <p className="text-sm text-muted-foreground mb-4">This article may have been removed or the URL is incorrect.</p>
        <Link to="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const imageUrl = post.featured_image_url || getPlaceholder(post.id);
  const shareUrl = window.location.href;
  const readTime = estimateReadTime(post.content);
  const catColor = categoryColors[post.category] || "bg-primary/10 text-primary";

  return (
    <div>
      {/* Hero image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all articles
          </Link>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`${catColor} border-0 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}>
              {categoryLabels[post.category] || post.category}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/60">
            {post.publish_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(post.publish_date), "MMMM d, yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
            {post.view_count > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {post.view_count} views
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Main content */}
          <article className="max-w-3xl">
            {/* Top ad */}
            <AdBanner slot="ARTICLE_TOP" format="horizontal" className="mb-8 rounded-xl" />

            {/* Article body */}
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-crude-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-crude-gold/40 prose-blockquote:text-muted-foreground prose-img:rounded-xl">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Bottom ad */}
            <AdBanner slot="ARTICLE_BOTTOM" format="horizontal" className="mt-8 rounded-xl" />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-8 pt-6 border-t border-border">
                <Tag className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                {post.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px] font-medium">
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Share2 className="w-4 h-4" />
                Share:
              </span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                LinkedIn
              </a>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 mt-8">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Disclaimer:</strong> This article is for informational purposes only and does not constitute investment, tax, or legal advice. Consult a licensed professional before making any investment decision.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-5">
              <AffiliatesSidebar />
              <AdBanner slot="ARTICLE_SIDEBAR" format="auto" className="rounded-xl" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}