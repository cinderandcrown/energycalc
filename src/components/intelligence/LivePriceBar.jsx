import { TrendingUp, TrendingDown, RefreshCw, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LivePriceBar({ prices, refreshing, onRefresh, lastUpdated }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-drill-green" />
            <span className="absolute w-3 h-3 rounded-full bg-drill-green/30 animate-ping" />
          </div>
          <span className="text-xs font-semibold text-foreground tracking-wide">LIVE ENERGY PRICES</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-muted-foreground font-mono">
            {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}
          </span>
          <Button size="sm" variant="ghost" onClick={onRefresh} disabled={refreshing} className="h-8 w-8 p-0 rounded-lg">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {prices.map((p, i) => {
          const up = (p.changePct ?? 0) >= 0;
          const isLoaded = p.price != null;
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative px-4 py-3.5 border-b border-r border-border last:border-r-0 md:[&:nth-child(n+3)]:border-b-0 [&:nth-child(n+3)]:border-b-0 md:[&:nth-child(n+3)]:border-b-0 group"
            >
              {/* Subtle glow on positive */}
              {isLoaded && up && (
                <div className="absolute inset-0 bg-drill-green/[0.03] pointer-events-none" />
              )}
              {isLoaded && !up && (
                <div className="absolute inset-0 bg-flare-red/[0.03] pointer-events-none" />
              )}

              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">{p.label}</p>

              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-xl text-foreground leading-none">
                    {isLoaded ? `$${p.price.toFixed(2)}` : (
                      <span className="inline-block w-16 h-6 rounded bg-muted animate-pulse" />
                    )}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{p.unit}</p>
                </div>

                {isLoaded && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    up ? "bg-drill-green/10 text-drill-green" : "bg-flare-red/10 text-flare-red"
                  }`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {up ? "+" : ""}{p.changePct?.toFixed(2)}%
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}