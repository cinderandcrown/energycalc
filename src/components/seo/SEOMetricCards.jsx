import { MousePointer, Eye, TrendingUp, ArrowUpDown } from 'lucide-react';

export default function SEOMetricCards({ rows, startDate, endDate }) {
  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgPosition = rows.length > 0 ? rows.reduce((sum, r) => sum + r.position, 0) / rows.length : 0;

  const cards = [
    { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Avg CTR', value: avgCTR.toFixed(2) + '%', icon: TrendingUp, color: 'text-drill-green', bg: 'bg-drill-green/10' },
    { label: 'Avg Position', value: avgPosition.toFixed(1), icon: ArrowUpDown, color: 'text-crude-gold', bg: 'bg-crude-gold/10' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
              <p className="text-xl font-bold font-mono text-foreground">{c.value}</p>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-right">{startDate} — {endDate}</p>
    </div>
  );
}