import { useState } from 'react';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ConversionTable({ rows }) {
  const [sortKey, setSortKey] = useState('sessions');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = rows
    .filter(r => r.source.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'desc' ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />;
  };

  const crBadge = (cr) => {
    if (cr >= 5) return 'bg-drill-green/15 text-drill-green';
    if (cr >= 2) return 'bg-blue-500/15 text-blue-500';
    if (cr >= 0.5) return 'bg-crude-gold/15 text-crude-gold';
    return 'bg-muted text-muted-foreground';
  };

  const columns = [
    { key: 'sessions', label: 'Sessions' },
    { key: 'totalUsers', label: 'Users' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversionRate', label: 'Conv. Rate' },
    { key: 'engagementRate', label: 'Engagement' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Channel Performance ({filtered.length})</h3>
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Filter channels..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground w-8">#</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Channel</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No data found</td></tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.source} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">{row.source}</td>
                <td className="text-right px-4 py-2.5 font-mono text-foreground">{row.sessions.toLocaleString()}</td>
                <td className="text-right px-4 py-2.5 font-mono text-muted-foreground">{row.totalUsers.toLocaleString()}</td>
                <td className="text-right px-4 py-2.5 font-mono font-semibold text-foreground">{row.conversions.toLocaleString()}</td>
                <td className="text-right px-4 py-2.5">
                  <Badge className={`${crBadge(row.conversionRate)} border-0 font-mono text-xs`}>
                    {row.conversionRate.toFixed(2)}%
                  </Badge>
                </td>
                <td className="text-right px-4 py-2.5 font-mono text-muted-foreground">{row.engagementRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}