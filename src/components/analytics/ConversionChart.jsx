import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#D4A843', '#2E7D32', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

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
          <Bar dataKey="Conversion Rate" fill="#2E7D32" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Engagement Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}