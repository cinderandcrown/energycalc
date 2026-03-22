import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function TaxSavingsBreakdown({ calculations }) {
  const netInvCalcs = calculations.filter((c) => c.calc_type === "net_investment" && c.results);

  if (netInvCalcs.length === 0) return null;

  const totals = netInvCalcs.reduce(
    (acc, c) => ({
      totalInvestment: acc.totalInvestment + (c.inputs?.totalInvestment || 0),
      idcTaxSavings: acc.idcTaxSavings + (c.results?.idcTaxSavings || 0),
      tangibleTaxSavings: acc.tangibleTaxSavings + (c.results?.tangibleTaxSavings || 0),
      netOutOfPocket: acc.netOutOfPocket + (c.results?.netInvestment || 0),
    }),
    { totalInvestment: 0, idcTaxSavings: 0, tangibleTaxSavings: 0, netOutOfPocket: 0 }
  );

  const pieData = [
    { name: "IDC Tax Savings", value: totals.idcTaxSavings, color: "#D4A843" },
    { name: "Tangible Depreciation Savings", value: totals.tangibleTaxSavings, color: "#0B2545" },
    { name: "Net Out-of-Pocket", value: totals.netOutOfPocket, color: "#2E7D32" },
  ];

  const effectiveRate = totals.totalInvestment > 0
    ? ((totals.netOutOfPocket / totals.totalInvestment) * 100).toFixed(1)
    : "0";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Tax Savings Summary</h3>
          <p className="text-xs text-muted-foreground">Across {netInvCalcs.length} net investment calculation{netInvCalcs.length !== 1 ? "s" : ""}</p>
        </div>
        <Badge className="bg-drill-green/10 text-drill-green border-0 font-mono font-bold text-xs">
          {effectiveRate}¢ effective cost per $1
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`$${fmt(v)}`, ""]} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[10px] text-foreground">{v}</span>} />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-3 flex flex-col justify-center">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Invested</p>
            <p className="font-mono font-bold text-foreground">${fmt(totals.totalInvestment)}</p>
          </div>
          <div className="rounded-xl bg-drill-green/5 border border-drill-green/20 p-3">
            <p className="text-[10px] text-drill-green uppercase tracking-wide">Total Year-1 Tax Savings</p>
            <p className="font-mono font-bold text-drill-green">${fmt(totals.idcTaxSavings + totals.tangibleTaxSavings)}</p>
          </div>
          <div className="rounded-xl bg-crude-gold/5 border border-crude-gold/20 p-3">
            <p className="text-[10px] text-crude-gold uppercase tracking-wide">Net Out-of-Pocket</p>
            <p className="font-mono font-bold text-foreground">${fmt(totals.netOutOfPocket)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}