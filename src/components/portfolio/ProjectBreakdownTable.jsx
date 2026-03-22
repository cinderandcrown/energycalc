import { Calculator, Droplets, Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
};

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

const typeColors = {
  net_investment: "bg-petroleum/10 text-petroleum dark:bg-primary/20 dark:text-primary",
  barrels_to_cash: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  natgas_to_cash: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  rate_of_return: "bg-drill-green/10 text-drill-green",
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function getKeyMetric(calc) {
  if (!calc.results) return { label: "—", value: "—" };
  const r = calc.results;
  switch (calc.calc_type) {
    case "net_investment":
      return { label: "Net Investment", value: `$${fmt(r.netInvestment || 0)}` };
    case "barrels_to_cash":
      return { label: "Monthly Net", value: `$${fmt(r.netMonthly || 0)}` };
    case "natgas_to_cash":
      return { label: "Monthly Net", value: `$${fmt(r.netMonthly || 0)}` };
    case "rate_of_return":
      return { label: "ROI", value: `${(r.simpleROI || 0).toFixed(1)}%` };
    default:
      return { label: "—", value: "—" };
  }
}

export default function ProjectBreakdownTable({ calculations }) {
  if (calculations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-foreground mb-4">All Saved Projects</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground pb-2">Project</th>
            <th className="text-left text-xs font-medium text-muted-foreground pb-2">Type</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-2">Key Metric</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc) => {
            const Icon = typeIcons[calc.calc_type] || Calculator;
            const metric = getKeyMetric(calc);
            return (
              <tr key={calc.id} className="border-b border-border/50">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeColors[calc.calc_type]}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-foreground font-medium truncate max-w-[180px]">{calc.name}</span>
                  </div>
                </td>
                <td className="py-2.5">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                    {typeLabels[calc.calc_type]}
                  </Badge>
                </td>
                <td className="py-2.5 text-right">
                  <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                  <p className="font-mono font-semibold text-foreground">{metric.value}</p>
                </td>
                <td className="py-2.5 text-right text-xs text-muted-foreground">
                  {new Date(calc.created_date).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}