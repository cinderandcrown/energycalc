import { MousePointer, Eye, TrendingUp, ArrowUpDown, Target, Sparkles } from 'lucide-react';

export default function SEOMetricCards({ rows, startDate, endDate }) {
  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgPosition = rows.length > 0 ? rows.reduce((sum, r) => sum + r.position, 0) / rows.length : 0;
  const page1Keywords = rows.filter(r => r.position <= 10).length;
  const top3Keywords = rows.filter(r => r.position <= 3).length;

  const cards = [
    { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: `${(totalClicks / (rows.length || 1)).toFixed(1)} avg/keyword` },
    { label: 'Total Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: `${(totalImpressions / (rows.length || 1)).toFixed(0)} avg/keyword` },
    { label: 'Avg CTR', value: avgCTR.toFixed(2) + '%', icon: TrendingUp, color: 'text-drill-green', bg: 'bg-drill-green/10', sub: avgCTR > 5 ? 'Excellent' : avgCTR > 2 ? 'Good' : 'Needs work' },
    { label: 'Avg Position', value: avgPosition.toFixed(1), icon: ArrowUpDown, color: 'text-crude-gold', bg: 'bg-crude-gold/10', sub: avgPosition <= 10 ? 'Page 1 avg' : avgPosition <= 20 ? 'Page 2 avg' : 'Deep pages' },
    { label: 'Page 1 Keywords', value: page1Keywords.toLocaleString(), icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-500/10', sub: `${rows.length > 0 ? ((page1Keywords / rows.length) * 100).toFixed(0) : 0}% of tracked` },
    { label: 'Top 3 Rankings', value: top3Keywords.toLocaleString(), icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: top3Keywords > 0 ? 'Prime positions' : 'Room to grow' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4 hover:border-crude-gold/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold font-mono text-foreground">{c.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.label}</p>
              <p className="text-[9px] text-muted-foreground/70 mt-0.5">{c.sub}</p>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-right">{startDate} — {endDate}</p>
    </div>
  );
}