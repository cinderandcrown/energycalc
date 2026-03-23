import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Grid3X3, ArrowUpRight } from "lucide-react";

const SECTORS = [
  { key: "energy_oil", label: "Crude Oil", keywords: ["wti", "brent", "crude"], color: "from-petroleum/80 to-petroleum" },
  { key: "energy_gas", label: "Natural Gas", keywords: ["natural gas", "henry hub"], color: "from-blue-600/80 to-blue-700" },
  { key: "energy_refined", label: "Refined Products", keywords: ["heating oil", "gasoline", "rbob", "jet fuel", "diesel"], color: "from-orange-600/80 to-orange-700" },
  { key: "precious", label: "Precious Metals", keywords: ["gold", "silver", "platinum", "palladium"], color: "from-yellow-600/80 to-yellow-700" },
  { key: "industrial", label: "Industrial Metals", keywords: ["copper", "aluminum", "zinc", "nickel", "tin", "lead", "steel"], color: "from-slate-500/80 to-slate-600" },
  { key: "agriculture", label: "Agriculture", keywords: ["corn", "wheat", "soybean", "cotton", "sugar", "coffee", "cocoa"], color: "from-green-600/80 to-green-700" },
  { key: "nuclear", label: "Nuclear / Uranium", keywords: ["uranium"], color: "from-purple-600/80 to-purple-700" },
  { key: "coal", label: "Coal", keywords: ["coal", "newcastle"], color: "from-gray-600/80 to-gray-700" },
  { key: "ngl", label: "NGL / Propane", keywords: ["propane", "ethane", "butane", "ngl"], color: "from-cyan-600/80 to-cyan-700" },
];

export default function SectorHeatmap({ allCommodities = [] }) {
  const sectorData = useMemo(() => {
    if (!allCommodities.length) return [];

    return SECTORS.map(sector => {
      const matches = allCommodities.filter(c => {
        const name = (c.name || "").toLowerCase();
        return sector.keywords.some(kw => name.includes(kw));
      });

      if (matches.length === 0) return { ...sector, avgChange: null, count: 0 };

      const avgChange = matches.reduce((sum, c) => sum + (c.changePct || 0), 0) / matches.length;
      const topMover = [...matches].sort((a, b) => Math.abs(b.changePct || 0) - Math.abs(a.changePct || 0))[0];

      return { ...sector, avgChange, count: matches.length, topMover };
    }).filter(s => s.count > 0);
  }, [allCommodities]);

  if (sectorData.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-crude-gold" />
          <h3 className="text-sm font-bold text-foreground">Sector Performance</h3>
        </div>
        <Link to="/markets" className="text-[10px] text-primary dark:text-accent font-medium flex items-center gap-1 hover:underline">
          Full Markets <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-border">
        {sectorData.map((sector, i) => {
          const up = (sector.avgChange || 0) >= 0;
          return (
            <motion.div
              key={sector.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="relative bg-card p-4 group hover:bg-muted/30 transition-colors"
            >
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">{sector.label}</p>
              <p className={`font-mono font-bold text-lg leading-none ${up ? "text-drill-green" : "text-flare-red"}`}>
                {up ? "+" : ""}{sector.avgChange.toFixed(2)}%
              </p>
              {sector.topMover && (
                <p className="text-[9px] text-muted-foreground mt-1.5 truncate">
                  Top: <span className="text-foreground font-medium">{sector.topMover.name}</span>{" "}
                  <span className={up ? "text-drill-green" : "text-flare-red"}>
                    {(sector.topMover.changePct || 0) >= 0 ? "+" : ""}{(sector.topMover.changePct || 0).toFixed(2)}%
                  </span>
                </p>
              )}
              {/* Color accent bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${up ? "from-drill-green/50 to-drill-green/10" : "from-flare-red/50 to-flare-red/10"}`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}