import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LivePriceBar({ prices, refreshing, onRefresh, lastUpdated }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">Live Prices · OilPrice.com</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
          </span>
          <Button size="sm" variant="ghost" onClick={onRefresh} disabled={refreshing} className="h-7 w-7 p-0">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prices.map((p) => {
          const up = (p.changePct ?? 0) >= 0;
          return (
            <div key={p.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{p.label}</p>
              <p className="font-mono font-bold text-lg text-foreground leading-none">
                {p.price != null ? `$${p.price.toFixed(2)}` : "—"}
              </p>
              {p.price != null && (
                <div className={`flex items-center gap-1 mt-1 ${up ? "text-drill-green" : "text-flare-red"}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="font-mono text-[11px] font-semibold">
                    {up ? "+" : ""}{p.changePct?.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}