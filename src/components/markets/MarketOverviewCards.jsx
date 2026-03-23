import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketOverviewCards({ commodities }) {
  // Show top movers — biggest gains and losses
  if (!commodities.length) return null;

  const sorted = [...commodities].sort((a, b) => Math.abs(b.changePct || 0) - Math.abs(a.changePct || 0));
  const topMovers = sorted.slice(0, 6);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {topMovers.map(item => {
        const up = (item.changePct || 0) >= 0;
        return (
          <div key={item.symbol} className="rounded-xl border border-border bg-card p-3 hover:border-foreground/20 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-muted-foreground font-medium truncate">{item.symbol}</p>
              <div className={`flex items-center gap-0.5 ${up ? "text-drill-green" : "text-flare-red"}`}>
                {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                <span className="font-mono text-[10px] font-bold">{up ? "+" : ""}{item.changePct?.toFixed(1)}%</span>
              </div>
            </div>
            <p className="font-mono font-bold text-sm text-foreground">
              ${item.price?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{item.name}</p>
          </div>
        );
      })}
    </div>
  );
}