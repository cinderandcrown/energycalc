import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';

export default function SEOPositionChart({ rows }) {
  if (!rows || rows.length === 0) return null;

  const chartData = rows
    .filter(r => r.impressions >= 5)
    .slice(0, 60)
    .map(r => ({
      keyword: r.key.length > 30 ? r.key.slice(0, 28) + '…' : r.key,
      position: parseFloat(r.position.toFixed(1)),
      ctr: parseFloat((r.ctr * 100).toFixed(2)),
      impressions: r.impressions,
      clicks: r.clicks,
    }));

  const getColor = (pos) => {
    if (pos <= 3) return '#2E7D32';
    if (pos <= 10) return '#3b82f6';
    if (pos <= 20) return '#D4A843';
    return '#ef4444';
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">CTR vs Position Map</h3>
      <p className="text-[10px] text-muted-foreground mb-4">Bubble size = impressions · Color = position rank</p>
      <div className="flex gap-3 mb-3 flex-wrap">
        {[{ c: '#2E7D32', l: 'Top 3' }, { c: '#3b82f6', l: 'Page 1' }, { c: '#D4A843', l: 'Page 2' }, { c: '#ef4444', l: 'Page 3+' }].map(i => (
          <span key={i.l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: i.c }} />
            {i.l}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" dataKey="position" name="Position" reversed tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} label={{ value: 'Avg Position', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis type="number" dataKey="ctr" name="CTR" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} />
          <ZAxis type="number" dataKey="impressions" range={[40, 400]} name="Impressions" />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
            formatter={(v, name) => [name === 'CTR' ? `${v}%` : v, name]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.keyword || ''}
          />
          <Scatter data={chartData}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.position)} fillOpacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}