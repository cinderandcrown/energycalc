import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import { computeAllBrackets } from "./TaxImpactEngine";

const BRACKET_COLORS = ["#D4A843", "#2E7D32", "#1976D2", "#9C27B0"];

export default function TaxImpactROIChart({ params, activeBrackets }) {
  const allBrackets = useMemo(() => computeAllBrackets(params), [params]);

  const chartData = useMemo(() => {
    const years = params.years || 5;
    const data = [];
    for (let y = 0; y < years; y++) {
      const entry = { year: `Year ${y + 1}` };
      allBrackets.forEach((b, i) => {
        if (activeBrackets.includes(i)) {
          entry[`roi_${b.label}`] = b.data[y].effectiveROI;
        }
      });
      data.push(entry);
    }
    return data;
  }, [allBrackets, activeBrackets, params]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-1">Effective ROI by Tax Bracket</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Total return (tax savings + net income) as a percentage of total capital invested — higher brackets amplify the benefit.
      </p>

      <div className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} width={45} />
            <Tooltip
              formatter={(value, name) => {
                const label = name.replace("roi_", "");
                return [`${value}%`, `ROI @ ${label}`];
              }}
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }}
            />
            <Legend
              formatter={(value) => value.replace("roi_", "@ ")}
              wrapperStyle={{ fontSize: 11 }}
            />
            <ReferenceLine y={100} stroke="#2E7D32" strokeDasharray="4 4" label={{ value: "100% ROI", fontSize: 10, fill: "#2E7D32" }} />

            {allBrackets.map((b, i) =>
              activeBrackets.includes(i) ? (
                <Line
                  key={b.label}
                  type="monotone"
                  dataKey={`roi_${b.label}`}
                  stroke={BRACKET_COLORS[i]}
                  strokeWidth={2.5}
                  name={`roi_${b.label}`}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}