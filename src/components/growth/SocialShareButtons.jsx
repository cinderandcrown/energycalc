import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PLATFORMS = [
  {
    name: "Twitter / X",
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    buildUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    buildUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    buildUrl: (url, title) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

/**
 * Social share buttons for blog posts and calculator results.
 * Uses Web Share API on mobile, falls back to platform links.
 */
export default function SocialShareButtons({ url, title, description }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: description, url });
    } catch {
      // User cancelled or not supported — fall through
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share this URL with anyone." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Share", description: url });
    }
  };

  // Mobile: prefer native share sheet
  if (typeof navigator !== "undefined" && navigator.share) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleNativeShare} size="sm" variant="outline" className="gap-1.5 text-xs">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
        <Button onClick={handleCopy} size="sm" variant="ghost" className="gap-1.5 text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-drill-green" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy Link"}
        </Button>
      </div>
    );
  }

  // Desktop: show platform buttons
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PLATFORMS.map((p) => (
        <a
          key={p.name}
          href={p.buildUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          {p.name}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center gap-1.5"
      >
        {copied ? <Check className="w-3 h-3 text-drill-green" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
