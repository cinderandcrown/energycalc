import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function CashFlowChart({ calculations }) {
  // Build per-project bar data from production calcs
  const productionCalcs = calculations.filter(
    (c) => c.calc_type === "barrels_to_cash" || c.calc_type === "natgas_to_cash"
  );

  if (productionCalcs.length === 0) return null;

  const colors = ["#D4A843", "#2E7D32", "#0B2545", "#7B3F00", "#9b59b6", "#e74c3c"];

  const data = productionCalcs.map((c, i) => ({
    name: c.name.length > 18 ? c.name.slice(0, 16) + "…" : c.name,
    monthly: c.results?.netMonthly || 0,
    annual: c.results?.netAnnual || 0,
    color: colors[i % colors.length],
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Projected Cash Flow by Project</h3>
      <p className="text-xs text-muted-foreground mb-4">Monthly & annual net income from production calculators</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${fmt(v)}`} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [`$${fmt(v)}`, name === "monthly" ? "Monthly Net" : "Annual Net"]}
          />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs">{v === "monthly" ? "Monthly Net" : "Annual Net"}</span>} />
          <Bar dataKey="monthly" name="monthly" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.7} />
            ))}
          </Bar>
          <Bar dataKey="annual" name="annual" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}