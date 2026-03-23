import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function SEOTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'MMM d'),
    ctrPct: (d.ctr * 100).toFixed(2),
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Search Performance Trend</h3>
      <p className="text-[10px] text-muted-foreground mb-4">Daily clicks & impressions over time</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend iconType="circle" iconSize={8} />
          <Area yAxisId="right" type="monotone" dataKey="impressions" stroke="#a855f7" fill="url(#impressionsGrad)" strokeWidth={2} name="Impressions" />
          <Area yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#clicksGrad)" strokeWidth={2} name="Clicks" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}