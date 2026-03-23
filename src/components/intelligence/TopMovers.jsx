import { useMemo } from "react";
import { TrendingUp, TrendingDown, Flame, Snowflake } from "lucide-react";
import { motion } from "framer-motion";

export default function TopMovers({ allCommodities = [] }) {
  const { gainers, losers } = useMemo(() => {
    const withChanges = allCommodities.filter(c => c.price != null && c.changePct != null);
    const sorted = [...withChanges].sort((a, b) => (b.changePct || 0) - (a.changePct || 0));
    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    };
  }, [allCommodities]);

  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Gainers */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-drill-green/20 bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-drill-green/5 border-b border-drill-green/10">
          <Flame className="w-4 h-4 text-drill-green" />
          <h3 className="text-xs font-bold text-drill-green uppercase tracking-wider">Top Gainers</h3>
        </div>
        <div className="divide-y divide-border">
          {gainers.map((c, i) => (
            <div key={c.name || i} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">${c.price?.toFixed(2)}{c.unit ? `/${c.unit.replace("/", "")}` : ""}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-drill-green/10 shrink-0">
                <TrendingUp className="w-3 h-3 text-drill-green" />
                <span className="text-xs font-mono font-bold text-drill-green">+{c.changePct?.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Losers */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-flare-red/20 bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-flare-red/5 border-b border-flare-red/10">
          <Snowflake className="w-4 h-4 text-flare-red" />
          <h3 className="text-xs font-bold text-flare-red uppercase tracking-wider">Top Decliners</h3>
        </div>
        <div className="divide-y divide-border">
          {losers.map((c, i) => (
            <div key={c.name || i} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">${c.price?.toFixed(2)}{c.unit ? `/${c.unit.replace("/", "")}` : ""}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-flare-red/10 shrink-0">
                <TrendingDown className="w-3 h-3 text-flare-red" />
                <span className="text-xs font-mono font-bold text-flare-red">{c.changePct?.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}