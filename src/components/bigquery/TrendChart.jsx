import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0B2545", "#D4A843", "#2E7D32", "#C62828", "#7B1FA2", "#00838F", "#E65100", "#1565C0"];

export default function TrendChart({ results }) {
  const chartData = useMemo(() => {
    if (!results?.rows?.length || !results?.fields?.length) return null;

    // Try to detect a date/time field and numeric fields
    const fields = results.fields;
    const rows = results.rows;

    // Heuristic: first field that looks like a date
    const dateField = fields.find(f => {
      const sample = rows[0]?.[f];
      return sample && (/^\d{4}-\d{2}/.test(sample) || /date|year|month|quarter|period|time/i.test(f));
    });

    if (!dateField) return null;

    // Numeric fields for the lines
    const numericFields = fields.filter(f => {
      if (f === dateField) return false;
      const sample = rows[0]?.[f];
      return sample !== null && sample !== undefined && !isNaN(Number(sample));
    });

    if (!numericFields.length) return null;

    const data = rows.map(row => {
      const point = { date: row[dateField] };
      numericFields.forEach(f => {
        point[f] = Number(row[f]) || 0;
      });
      return point;
    });

    return { data, dateField, numericFields };
  }, [results]);

  if (!chartData) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
        <p className="text-xs text-muted-foreground">
          No chartable data detected. Ensure your query returns a date column and at least one numeric column.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Trend Visualization
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={v => {
            if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
            if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
            if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
            return `$${v}`;
          }} />
          <Tooltip formatter={v => `$${Number(v).toLocaleString()}`} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {chartData.numericFields.map((f, i) => (
            <Line
              key={f}
              type="monotone"
              dataKey={f}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}