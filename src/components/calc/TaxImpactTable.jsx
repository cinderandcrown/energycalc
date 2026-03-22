import { useMemo } from "react";
import { computeMultiYearModel } from "./TaxImpactEngine";

function fmt(v) {
  if (v === undefined || v === null) return "—";
  const neg = v < 0;
  const abs = Math.abs(v);
  const str = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}K` : `$${abs.toLocaleString()}`;
  return neg ? `(${str})` : str;
}

export default function TaxImpactTable({ params, taxRate, bracketLabel }) {
  const data = useMemo(() => computeMultiYearModel(params, taxRate), [params, taxRate]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">Year-by-Year Breakdown — {bracketLabel} Bracket</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Year</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Invested</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Gross Income</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">IDC Deduction</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Depletion</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Depreciation</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Tax Savings</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Cum. Net Cost</th>
              <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Eff. ROI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.year} className="border-t border-border hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-semibold text-foreground">Year {row.year}</td>
                <td className="text-right px-3 py-2 font-mono text-foreground">{fmt(row.investment)}</td>
                <td className="text-right px-3 py-2 font-mono text-foreground">{fmt(row.grossIncome)}</td>
                <td className="text-right px-3 py-2 font-mono text-drill-green">{fmt(row.idcDeduction)}</td>
                <td className="text-right px-3 py-2 font-mono text-drill-green">{fmt(row.depletionDeduction)}</td>
                <td className="text-right px-3 py-2 font-mono text-drill-green">{fmt(row.tangibleDepreciation)}</td>
                <td className="text-right px-3 py-2 font-mono font-semibold text-drill-green">{fmt(row.taxSavings)}</td>
                <td className={`text-right px-3 py-2 font-mono font-semibold ${row.cumulativeNetCost <= 0 ? "text-drill-green" : "text-foreground"}`}>
                  {fmt(row.cumulativeNetCost)}
                </td>
                <td className={`text-right px-3 py-2 font-mono font-semibold ${row.effectiveROI >= 100 ? "text-drill-green" : "text-crude-gold"}`}>
                  {row.effectiveROI}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}