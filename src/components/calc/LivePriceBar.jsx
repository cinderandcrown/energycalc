import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LivePriceBar({ items, loading, onRefresh }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 overflow-x-auto">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-2 items-center">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          items.filter(i => i.price).map((item, idx) => {
            const up = (item.change || 0) >= 0;
            return (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
                <span className="font-mono text-xs font-bold text-foreground">${typeof item.price === 'number' ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}</span>
                {item.change != null && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold ${up ? "text-drill-green" : "text-flare-red"}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {up ? "+" : ""}{typeof item.change === 'number' ? item.change.toFixed(2) : item.change}%
                  </span>
                )}
                {idx < items.filter(i => i.price).length - 1 && <span className="text-border mx-1">·</span>}
              </div>
            );
          })
        )}
      </div>
      <Button size="sm" variant="ghost" onClick={onRefresh} className="shrink-0 h-7 w-7 p-0">
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}