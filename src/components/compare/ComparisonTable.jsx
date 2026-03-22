import { Badge } from "@/components/ui/badge";

const fmt = (v, prefix = "$", suffix = "") => {
  if (v == null || isNaN(v)) return "—";
  if (prefix === "$") return `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return `${Number(v).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`;
};

function getMetrics(calc) {
  const i = calc.inputs || {};
  const r = calc.results || {};

  switch (calc.calc_type) {
    case "net_investment":
      return [
        { label: "Total Investment", value: fmt(i.totalInvestment || i.investment) },
        { label: "IDC %", value: fmt(i.idcPercent || i.idcPercentage, "", "%") },
        { label: "Tax Bracket", value: fmt(i.taxRate || i.taxBracket, "", "%") },
        { label: "IDC Deduction", value: fmt(r.idcDeduction) },
        { label: "Tax Savings", value: fmt(r.taxSavings), highlight: true },
        { label: "Net Investment", value: fmt(r.netInvestment), highlight: true },
        { label: "Effective Cost", value: fmt(r.effectiveRate, "", "%") },
        { label: "Depletion Savings", value: fmt(r.depletionSavings) },
      ];
    case "barrels_to_cash":
      return [
        { label: "BOPD", value: fmt(i.bopd, "", " bbl") },
        { label: "Oil Price", value: fmt(i.oilPrice) },
        { label: "Working Interest", value: fmt(i.workingInterest, "", "%") },
        { label: "NRI", value: fmt(i.nri, "", "%") },
        { label: "Gross Monthly", value: fmt(r.grossMonthly) },
        { label: "LOE", value: fmt(r.loe || r.totalLOE) },
        { label: "Net Monthly", value: fmt(r.netMonthly), highlight: true },
        { label: "Year-1 Net", value: fmt(r.year1Net || (r.netMonthly ? r.netMonthly * 12 : null)) },
      ];
    case "natgas_to_cash":
      return [
        { label: "MCF/Day", value: fmt(i.mcfPerDay, "", " mcf") },
        { label: "Gas Price", value: fmt(i.gasPrice) },
        { label: "Working Interest", value: fmt(i.workingInterest, "", "%") },
        { label: "NRI", value: fmt(i.nri, "", "%") },
        { label: "Gross Monthly", value: fmt(r.grossMonthly) },
        { label: "NGL Revenue", value: fmt(r.nglRevenue) },
        { label: "Net Monthly", value: fmt(r.netMonthly), highlight: true },
        { label: "Year-1 Net", value: fmt(r.year1Net || (r.netMonthly ? r.netMonthly * 12 : null)) },
      ];
    case "rate_of_return":
      return [
        { label: "Investment", value: fmt(i.totalInvestment || i.investment) },
        { label: "Monthly Income", value: fmt(i.monthlyIncome || r.monthlyIncome) },
        { label: "Simple ROI", value: fmt(r.simpleROI, "", "%"), highlight: true },
        { label: "IRR", value: fmt(r.irr, "", "%"), highlight: true },
        { label: "Payout (months)", value: fmt(r.payoutMonths, "", " mo") },
        { label: "Total Revenue (5yr)", value: fmt(r.totalRevenue5yr || r.totalRevenue) },
        { label: "Net Profit", value: fmt(r.netProfit) },
        { label: "Cash-on-Cash", value: fmt(r.cashOnCash, "", "%") },
      ];
    case "tax_impact":
      return [
        { label: "Total Investment", value: fmt(r.totalInvested || i.totalInvestment) },
        { label: "Tax Bracket", value: fmt(i.taxRate || i.taxBracket, "", "%") },
        { label: "Total IDC Deductions", value: fmt(r.totalIDC || r.cumulativeIDC) },
        { label: "Total Depletion", value: fmt(r.totalDepletion || r.cumulativeDepletion) },
        { label: "Total Depreciation", value: fmt(r.totalDepreciation || r.cumulativeDepreciation) },
        { label: "Total Tax Savings", value: fmt(r.totalTaxSavings || r.cumulativeTaxSavings), highlight: true },
        { label: "Net After-Tax Cost", value: fmt(r.netAfterTaxCost), highlight: true },
        { label: "Effective Tax Rate", value: fmt(r.effectiveTaxRate, "", "%") },
      ];
    default:
      return [];
  }
}

export default function ComparisonTable({ scenarios }) {
  if (scenarios.length === 0) return null;

  // Gather all unique metric labels across selected scenarios
  const allMetricSets = scenarios.map(getMetrics);
  const allLabels = [...new Set(allMetricSets.flat().map((m) => m.label))];

  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4 sticky left-0 bg-muted/30 z-10 min-w-[140px]">Metric</th>
            {scenarios.map((s) => (
              <th key={s.id} className="text-right text-xs font-semibold text-foreground py-3 px-4 min-w-[130px]">
                <span className="truncate block max-w-[130px] ml-auto">{s.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allLabels.map((label) => (
            <tr key={label} className="border-b border-border/50 last:border-0">
              <td className="text-xs text-muted-foreground py-2.5 px-4 sticky left-0 bg-card z-10">{label}</td>
              {scenarios.map((s, idx) => {
                const metrics = allMetricSets[idx];
                const metric = metrics.find((m) => m.label === label);
                return (
                  <td key={s.id} className="text-right py-2.5 px-4">
                    <span className={`font-mono text-xs ${metric?.highlight ? "font-bold text-primary dark:text-accent" : "text-foreground"}`}>
                      {metric?.value || "—"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}