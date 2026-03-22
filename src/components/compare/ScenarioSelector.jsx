import { Calculator, Droplets, Flame, TrendingUp, CheckCircle2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
  tax_impact: "Tax Impact",
};

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
  tax_impact: DollarSign,
};

const typeColors = {
  net_investment: "bg-petroleum/10 dark:bg-primary/20",
  barrels_to_cash: "bg-orange-500/10",
  natgas_to_cash: "bg-blue-500/10",
  rate_of_return: "bg-drill-green/10",
  tax_impact: "bg-purple-500/10",
};

const MAX_SELECTIONS = 3;

export default function ScenarioSelector({ calculations, selected, onToggle }) {
  const atMax = selected.length >= MAX_SELECTIONS;

  return (
    <div className="space-y-2">
      {atMax && (
        <p className="text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 text-center">
          Max {MAX_SELECTIONS} scenarios selected. Deselect one to add another.
        </p>
      )}
      {calculations.map((calc) => {
        const Icon = typeIcons[calc.calc_type] || Calculator;
        const isSelected = selected.includes(calc.id);
        const isDisabled = atMax && !isSelected;
        return (
          <button
            key={calc.id}
            onClick={() => !isDisabled && onToggle(calc.id)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isSelected
                ? "border-primary dark:border-accent bg-primary/5 dark:bg-accent/5"
                : isDisabled
                ? "border-border bg-card opacity-40 cursor-not-allowed"
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