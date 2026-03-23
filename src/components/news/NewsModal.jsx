import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink, Shield, Zap, Clock, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const CATEGORY_LABELS = {
  oil_gas: "Oil & Gas",
  precious_metals: "Precious Metals",
  industrial_metals: "Industrial Metals",
  agriculture: "Agriculture",
  energy_transition: "Energy Transition",
  regulation: "Regulation",
  fraud_alert: "Fraud Alert",
  market_analysis: "Market Analysis",
};

const CATEGORY_COLORS = {
  oil_gas: "bg-petroleum text-white",
  precious_metals: "bg-crude-gold text-petroleum",
  industrial_metals: "bg-blue-500 text-white",
  agriculture: "bg-drill-green text-white",
  energy_transition: "bg-emerald-500 text-white",
  regulation: "bg-purple-500 text-white",
  fraud_alert: "bg-flare-red text-white",
  market_analysis: "bg-muted text-foreground",
};

const SENTIMENT_CONFIG = {
  bullish: { icon: TrendingUp, label: "Bullish", color: "text-drill-green", bg: "bg-drill-green/10" },
  bearish: { icon: TrendingDown, label: "Bearish", color: "text-flare-red", bg: "bg-flare-red/10" },
  neutral: { icon: Minus, label: "Neutral", color: "text-muted-foreground", bg: "bg-muted" },
  warning: { icon: AlertTriangle, label: "Caution", color: "text-crude-gold", bg: "bg-crude-gold/10" },
};

const IMPACT_COLORS = {
  high: "bg-flare-red/10 text-flare-red",
  medium: "bg-crude-gold/10 text-crude-gold",
  low: "bg-muted text-muted-foreground",
};

export default function NewsModal({ article, open, onClose }) {
  if (!article) return null;

  const isFraud = article.fraud_relevance || article.category === "fraud_alert";
  const sentiment = SENTIMENT_CONFIG[article.sentiment];
  const SentimentIcon = sentiment?.icon || Minus;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge className={`text-[10px] ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.market_analysis}`}>
              {isFraud && <Shield className="w-2.5 h-2.5 mr-1" />}
              {CATEGORY_LABELS[article.category] || article.category}
            </Badge>
            {article.impact_level && (
              <Badge className={`text-[10px] border-0 ${IMPACT_COLORS[article.impact_level] || IMPACT_COLORS.low}`}>
                <BarChart3 className="w-2.5 h-2.5 mr-1" />
                {article.impact_level.charAt(0).toUpperCase() + article.impact_level.slice(1)} Impact
              </Badge>
            )}
            {sentiment && (
              <Badge className={`text-[10px] border-0 ${sentiment.bg} ${sentiment.color}`}>
                <SentimentIcon className="w-2.5 h-2.5 mr-1" />
                {sentiment.label}
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg leading-snug pr-6">
            {article.headline}
          </DialogTitle>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
            {article.source && <span className="font-medium">{article.source}</span>}
            {article.published_date && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(article.published_date), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Summary */}
        <div className="mt-4">
          <p className="text-sm text-foreground leading-relaxed">{article.summary}</p>
        </div>

        {/* AI Analysis */}
        {article.ai_analysis && (
          <div className="rounded-xl bg-crude-gold/5 border border-crude-gold/20 p-4 mt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-4 h-4 text-crude-gold" />
              <span className="text-xs font-bold text-crude-gold uppercase tracking-wide">Investor Implication</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{article.ai_analysis}</p>
          </div>
        )}

        {/* Commodities mentioned */}
        {article.commodities_mentioned?.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Commodities Mentioned</p>
            <div className="flex flex-wrap gap-1.5">
              {article.commodities_mentioned.map(c => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source link */}
        {article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:border-foreground/20 hover:bg-muted/50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Read Original Source</span>
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}