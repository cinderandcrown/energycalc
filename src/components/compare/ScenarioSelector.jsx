import { Calculator, Droplets, Flame, TrendingUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
};

const typeColors = {
  net_investment: "bg-petroleum/10 dark:bg-primary/20",
  barrels_to_cash: "bg-orange-500/10",
  natgas_to_cash: "bg-blue-500/10",
  rate_of_return: "bg-drill-green/10",
};

export default function ScenarioSelector({ calculations, selected, onToggle }) {
  return (
    <div className="space-y-2">
      {calculations.map((calc) => {
        const Icon = typeIcons[calc.calc_type] || Calculator;
        const isSelected = selected.includes(calc.id);
        return (
          <button
            key={calc.id}
            onClick={() => onToggle(calc.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isSelected
                ? "border-primary dark:border-accent bg-primary/5 dark:bg-accent/5"
                : "border-border bg-card hover:bg-muted/30"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[calc.calc_type]}`}>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{calc.name}</p>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 mt-0.5">
                {typeLabels[calc.calc_type]}
              </Badge>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-primary dark:text-accent shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}