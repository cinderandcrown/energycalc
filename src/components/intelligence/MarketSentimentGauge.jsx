import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Gauge } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Visual gauge that calculates an aggregate sentiment score from live price changes.
 * Renders a coloured arc gauge with contextual messaging.
 */
export default function MarketSentimentGauge({ prices }) {
  const sentiment = useMemo(() => {
    const loaded = prices.filter(p => p.price != null);
    if (loaded.length === 0) return null;

    const avgChange = loaded.reduce((s, p) => s + (p.changePct ?? 0), 0) / loaded.length;

    let label, color, bgColor, icon, description;
    if (avgChange >= 1.5) {
      label = "Strong Bullish"; color = "text-drill-green"; bgColor = "bg-drill-green/10 border-drill-green/30";
      icon = TrendingUp; description = "Energy commodities are showing strong upward momentum. Production-heavy portfolios benefit from current conditions.";
    } else if (avgChange >= 0.3) {
      label = "Mildly Bullish"; color = "text-drill-green"; bgColor = "bg-drill-green/5 border-drill-green/20";
      icon = TrendingUp; description = "Markets trending slightly positive. A good environment for existing producing assets.";
    } else if (avgChange >= -0.3) {
      label = "Neutral"; color = "text-crude-gold"; bgColor = "bg-crude-gold/5 border-crude-gold/20";
      icon = Minus; description = "Markets are range-bound with no strong directional bias. A stable environment for model assumptions.";
    } else if (avgChange >= -1.5) {
      label = "Mildly Bearish"; color = "text-flare-red"; bgColor = "bg-flare-red/5 border-flare-red/20";
      icon = TrendingDown; description = "Slight downward pressure on energy prices. Review break-even assumptions on saved models.";
    } else {
      label = "Strong Bearish"; color = "text-flare-red"; bgColor = "bg-flare-red/10 border-flare-red/30";
      icon = TrendingDown; description = "Significant selling pressure across energy markets. Stress-test your scenarios at lower price assumptions.";
    }

    // Gauge position: map avgChange from -3..+3 to 0..100
    const position = Math.max(0, Math.min(100, ((avgChange + 3) / 6) * 100));

    return { label, color, bgColor, icon, description, avgChange, position };
  }, [prices]);

  if (!sentiment) return null;

  const Icon = sentiment.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={`rounded-2xl border p-5 ${sentiment.bgColor}`}
    >
      <div className="flex items-start gap-4">
        {/* Gauge visual */}
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 100 60" className="w-full">
            {/* Background arc */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Coloured arc */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="currentColor"
              className={sentiment.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${sentiment.position * 1.33} 200`}
            />
            {/* Needle dot */}
            <circle
              cx={10 + (sentiment.position / 100) * 80}
              cy={55 - Math.sin((sentiment.position / 100) * Math.PI) * 40}
              r="5"
              fill="currentColor"
              className={sentiment.color}
            />
          </svg>
          <div className="absolute bottom-0 inset-x-0 text-center">
            <span className={`text-[10px] font-bold ${sentiment.color}`}>
              {sentiment.avgChange >= 0 ? "+" : ""}{sentiment.avgChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className={`w-4 h-4 ${sentiment.color}`} />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Sentiment</span>
          </div>
          <p className={`text-base font-bold ${sentiment.color} flex items-center gap-1.5`}>
            <Icon className="w-4 h-4" />
            {sentiment.label}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{sentiment.description}</p>
        </div>
      </div>
    </motion.div>
  );
}