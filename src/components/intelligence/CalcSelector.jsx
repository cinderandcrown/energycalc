import { Droplets, Flame, Percent, Calculator } from "lucide-react";

const typeConfig = {
  barrels_to_cash: { icon: Droplets, label: "Oil Income", color: "text-crude-gold", bg: "bg-crude-gold/10" },
  natgas_to_cash: { icon: Flame, label: "Gas Income", color: "text-primary dark:text-accent", bg: "bg-primary/10 dark:bg-accent/10" },
  rate_of_return: { icon: Percent, label: "Rate of Return", color: "text-drill-green", bg: "bg-drill-green/10" },
  net_investment: { icon: Calculator, label: "Net Investment", color: "text-foreground", bg: "bg-muted" },
};

export default function CalcSelector({ calculations, selectedId, onSelect }) {
  // Only show calc types that have price sensitivity
  const eligible = calculations.filter(c => ["barrels_to_cash", "natgas_to_cash", "rate_of_return"].includes(c.calc_type));

  if (eligible.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <Calculator className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">No saved calculations yet</p>
        <p className="text-xs text-muted-foreground mt-1">Save a calculation from any calculator to see live market impact analysis here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Select a saved calculation to analyze:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {eligible.map((calc) => {
          const config = typeConfig[calc.calc_type] || typeConfig.net_investment;
          const Icon = config.icon;
          const selected = selectedId === calc.id;
          return (
            <button
              key={calc.id}
              onClick={() => onSelect(calc.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                selected
                  ? "border-crude-gold/50 bg-crude-gold/5 ring-1 ring-crude-gold/20"
                  : "border-border bg-card hover:bg-muted/30"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{calc.name}</p>
                <p className="text-[10px] text-muted-foreground">{config.label}</p>
              </div>
              {selected && (
                <div className="w-2 h-2 rounded-full bg-crude-gold shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}