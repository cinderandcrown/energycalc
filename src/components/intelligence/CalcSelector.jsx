import { Droplets, Flame, Percent, Calculator, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const typeConfig = {
  barrels_to_cash: { icon: Droplets, label: "Oil Income Model", color: "text-crude-gold", bg: "bg-crude-gold/10", ring: "ring-crude-gold/30" },
  natgas_to_cash: { icon: Flame, label: "Gas Income Model", color: "text-primary dark:text-accent", bg: "bg-primary/10 dark:bg-accent/10", ring: "ring-primary/30 dark:ring-accent/30" },
  rate_of_return: { icon: Percent, label: "Rate of Return", color: "text-drill-green", bg: "bg-drill-green/10", ring: "ring-drill-green/30" },
  net_investment: { icon: Calculator, label: "Net Investment", color: "text-foreground", bg: "bg-muted", ring: "ring-border" },
};

function getHeroValue(calc) {
  if (!calc.results) return null;
  const r = calc.results;
  if (calc.calc_type === "barrels_to_cash") return { label: "Net/mo", value: `$${(r.netMonthly || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}` };
  if (calc.calc_type === "natgas_to_cash") return { label: "Net/mo", value: `$${(r.netMonthly || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}` };
  if (calc.calc_type === "rate_of_return") return { label: "IRR", value: `${(r.annualIRR || 0).toFixed(1)}%` };
  return null;
}

export default function CalcSelector({ calculations, selectedId, onSelect }) {
  const eligible = calculations.filter(c => ["barrels_to_cash", "natgas_to_cash", "rate_of_return"].includes(c.calc_type));

  if (eligible.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-2xl border-2 border-dashed border-border p-8 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">No saved models yet</p>
        <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
          Save a calculation from any calculator to see live market impact analysis and price sensitivity here.
        </p>
        <Link to="/calc/barrels-to-cash">
          <Button size="sm" className="gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            Start a Calculation
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Saved Models</p>
        <Link to="/scenarios" className="text-xs text-primary dark:text-accent hover:underline underline-offset-2">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {eligible.map((calc, i) => {
          const config = typeConfig[calc.calc_type] || typeConfig.net_investment;
          const Icon = config.icon;
          const selected = selectedId === calc.id;
          const hero = getHeroValue(calc);

          return (
            <motion.button
              key={calc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
              onClick={() => onSelect(calc.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 group ${
                selected
                  ? `border-crude-gold/50 bg-crude-gold/5 ring-2 ${config.ring} shadow-sm`
                  : "border-border bg-card hover:bg-muted/40 hover:border-muted-foreground/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{calc.name}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  {config.label}
                  {calc.is_favorite && <Star className="w-2.5 h-2.5 text-crude-gold fill-crude-gold" />}
                </p>
              </div>
              {hero && (
                <div className="text-right shrink-0 pr-1">
                  <p className="font-mono font-bold text-sm text-foreground">{hero.value}</p>
                  <p className="text-[9px] text-muted-foreground">{hero.label}</p>
                </div>
              )}
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${selected ? "text-crude-gold" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}