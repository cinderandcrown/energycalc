import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import { TAX_BRACKETS, computeAllBrackets } from "./TaxImpactEngine";

const BRACKET_COLORS = ["hsl(var(--crude-gold))", "hsl(var(--drill-green))", "hsl(220, 80%, 55%)", "hsl(270, 60%, 55%)"];

function fmt(v) {
  if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

export default function TaxImpactChart({ params, activeBrackets }) {
  const allBrackets = useMemo(() => computeAllBrackets(params), [params]);

  // Build chart data: one entry per year with net cost for each active bracket
  const chartData = useMemo(() => {
    const years = params.years || 5;
    const data = [];
    for (let y = 0; y < years; y++) {
      const entry = { year: `Year ${y + 1}` };
      entry.invested = allBrackets[0].data[y].cumulativeInvested;
      allBrackets.forEach((b, i) => {
        if (activeBrackets.includes(i)) {
          entry[`netCost_${b.label}`] = b.data[y].cumulativeNetCost;
        }
      });
      data.push(entry);
    }
    return data;
  }, [allBrackets, activeBrackets, params]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold text-foreground mb-1">Cumulative Net Cost After Tax Benefits</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Shows how much you're truly "out of pocket" each year after IDC deductions, depletion, depreciation, and production income.
      </p>

      <div className="h-[300px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
            <Tooltip
              formatter={(value, name) => {
                const label = name.replace("netCost_", "");
                return [fmt(value), `Net Cost @ ${label}`];
              }}
              labelStyle={{ fontSize: 12, fontWeight: 600 }}
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }}
            />
            <Legend
              formatter={(value) => value.replace("netCost_", "@ ")}
              wrapperStyle={{ fontSize: 11 }}
            />

            {/* Reference line: total invested */}
            <Area
              type="monotone"
              dataKey="invested"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="6 3"
              fill="none"
              name="Total Invested"
              strokeWidth={1.5}
            />

            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />

            {allBrackets.map((b, i) =>
              activeBrackets.includes(i) ? (
                <Area
                  key={b.label}
                  type="monotone"
                  dataKey={`netCost_${b.label}`}
                  stroke={BRACKET_COLORS[i]}
                  fill={BRACKET_COLORS[i]}
                  fillOpacity={0.08}
                  strokeWidth={2.5}
                  name={`netCost_${b.label}`}
                  dot={{ r: 3 }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
        {/* Accessible data table for screen readers */}
        <table className="sr-only" aria-label="Chart data: Cumulative Net Cost After Tax Benefits">
          <caption>Cumulative Net Cost After Tax Benefits</caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Total Invested</th>
              {allBrackets.map((b, i) =>
                activeBrackets.includes(i) ? <th key={b.label} scope="col">Net Cost @ {b.label}</th> : null
              )}
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr key={i}>
                <td>{row.year}</td>
                <td>{fmt(row.invested)}</td>
                {allBrackets.map((b, j) =>
                  activeBrackets.includes(j) ? <td key={b.label}>{fmt(row[`netCost_${b.label}`])}</td> : null
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        Negative values mean you've recouped more than you invested (tax savings + income exceed total capital deployed)
      </p>
    </div>
  );
}