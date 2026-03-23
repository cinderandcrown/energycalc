import { Users, MousePointer, Target, TrendingUp } from 'lucide-react';

export default function ConversionMetricCards({ rows, startDate, endDate }) {
  const totalSessions = rows.reduce((s, r) => s + r.sessions, 0);
  const totalConversions = rows.reduce((s, r) => s + r.conversions, 0);
  const totalUsers = rows.reduce((s, r) => s + r.totalUsers, 0);
  const overallCR = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

  const cards = [
    { label: 'Total Sessions', value: totalSessions.toLocaleString(), icon: MousePointer, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Conversions', value: totalConversions.toLocaleString(), icon: Target, color: 'text-drill-green', bg: 'bg-drill-green/10' },
    { label: 'Overall Conv. Rate', value: overallCR.toFixed(2) + '%', icon: TrendingUp, color: 'text-crude-gold', bg: 'bg-crude-gold/10' },
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