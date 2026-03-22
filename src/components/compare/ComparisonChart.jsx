import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#D4A843", "#2E7D32", "#3b82f6", "#f97316", "#8b5cf6"];

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

function extractChartValue(calc, key) {
  const r = calc.results || {};
  const i = calc.inputs || {};
  switch (key) {
    case "investment":
      return r.netInvestment || i.totalInvestment || i.investment || 0;
    case "taxSavings":
      return r.taxSavings || r.idcDeduction || 0;
    case "monthlyIncome":
      return r.netMonthly || r.monthlyIncome || 0;
    case "roi":
      return r.simpleROI || r.irr || 0;
    case "year1Net":
      return r.year1Net || (r.netMonthly ? r.netMonthly * 12 : 0) || 0;
    default:
      return 0;
  }
}

const metricDefs = [
  { key: "investment", label: "Net Investment ($)" },
  { key: "taxSavings", label: "Tax Savings ($)" },
  { key: "monthlyIncome", label: "Monthly Income ($)" },
  { key: "year1Net", label: "Year-1 Net Income ($)" },
  { key: "roi", label: "ROI (%)" },
];

export default function ComparisonChart({ scenarios }) {
  const isMobile = useIsMobile();
  if (scenarios.length === 0) return null;

  const chartData = metricDefs.map((metric) => {
    const row = { metric: isMobile ? metric.label.replace(/ \(\$\)| \(%\)/g, "") : metric.label };
    scenarios.forEach((s) => {
      row[s.name] = Math.round(extractChartValue(s, metric.key));
    });
    return row;
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Side-by-Side Comparison</h3>
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
        <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? 0 : 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="metric" type="category" width={isMobile ? 80 : 130} tick={{ fontSize: isMobile ? 9 : 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          {scenarios.map((s, i) => (
            <Bar key={s.id} dataKey={s.name} fill={COLORS[i % COLORS.length]} radius={[0, 4, 4, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}