import { TrendingUp, TrendingDown } from "lucide-react";

export default function CommodityTable({ items, onSelect }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">No commodities in this category</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 bg-muted/40 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Commodity</span>
        <span className="text-right">Price</span>
        <span className="text-right">Change</span>
        <span className="text-right hidden sm:block">% Chg</span>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => {
          const up = (item.changePct || 0) >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelect(item)}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.symbol} · {item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-foreground">
                  ${item.price?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-muted-foreground">{item.unit}</p>
              </div>
              <div className={`flex items-center gap-1 justify-end ${up ? "text-drill-green" : "text-flare-red"}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="font-mono text-xs font-semibold">
                  {up ? "+" : ""}{item.change?.toFixed(2)}
                </span>
              </div>
              <div className={`text-right hidden sm:block font-mono text-xs font-bold px-2 py-0.5 rounded ${up ? "bg-drill-green/10 text-drill-green" : "bg-flare-red/10 text-flare-red"}`}>
                {up ? "+" : ""}{item.changePct?.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}