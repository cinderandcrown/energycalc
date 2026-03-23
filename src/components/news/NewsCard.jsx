import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink, Shield, Zap } from "lucide-react";

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

const SENTIMENT_ICONS = {
  bullish: <TrendingUp className="w-3.5 h-3.5 text-drill-green" />,
  bearish: <TrendingDown className="w-3.5 h-3.5 text-flare-red" />,
  neutral: <Minus className="w-3.5 h-3.5 text-muted-foreground" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-crude-gold" />,
};

export default function NewsCard({ article, onClick }) {
  const isFraud = article.fraud_relevance || article.category === "fraud_alert";

  return (
    <div
      onClick={() => onClick?.(article)}
      className={`rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 cursor-pointer ${
        isFraud ? "border-flare-red/40 bg-flare-red/5" : "border-border"
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <Badge className={`text-[10px] ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.market_analysis}`}>
          {isFraud && <Shield className="w-2.5 h-2.5 mr-1" />}
          {CATEGORY_LABELS[article.category] || article.category}
        </Badge>
        {article.impact_level === "high" && (
          <Badge className="bg-flare-red/10 text-flare-red border-0 text-[10px]">High Impact</Badge>
        )}
        {SENTIMENT_ICONS[article.sentiment]}
      </div>

      {/* Headline */}
      <h3 className="font-semibold text-sm text-foreground leading-snug mb-1.5">{article.headline}</h3>

      {/* Summary */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{article.summary}</p>

      {/* AI Analysis */}
      {article.ai_analysis && (
        <div className="rounded-lg bg-crude-gold/5 border border-crude-gold/20 p-2.5 mb-3">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-crude-gold" />
            <span className="text-[10px] font-semibold text-crude-gold uppercase tracking-wide">Investor Implication</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">{article.ai_analysis}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {article.commodities_mentioned?.slice(0, 4).map(c => (
            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{article.source}</span>
          {article.source_url && (
            <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}