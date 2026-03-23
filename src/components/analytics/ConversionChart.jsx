import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const COLORS = ['hsl(220, 80%, 55%)', 'hsl(270, 60%, 55%)', 'hsl(var(--crude-gold))', 'hsl(var(--drill-green))', 'hsl(var(--flare-red))', 'hsl(190, 80%, 45%)', 'hsl(25, 90%, 55%)', 'hsl(330, 80%, 55%)', 'hsl(240, 60%, 60%)', 'hsl(170, 70%, 45%)'];

export default function ConversionChart({ rows }) {
  const chartData = rows.slice(0, 10).map(r => ({
    source: r.source.length > 18 ? r.source.slice(0, 16) + '…' : r.source,
    'Conversion Rate': parseFloat(r.conversionRate.toFixed(2)),
    'Engagement Rate': parseFloat(r.engagementRate.toFixed(1)),
    sessions: r.sessions,
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Conversion & Engagement Rate by Channel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="source" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} angle={-25} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [`${v}%`, name]}
          />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="Conversion Rate" fill="hsl(var(--drill-green))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Engagement Rate" fill="hsl(220, 80%, 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}