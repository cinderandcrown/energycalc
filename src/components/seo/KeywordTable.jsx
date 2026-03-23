import { useState } from 'react';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const DIMENSION_LABELS = {
  query: 'Keyword',
  page: 'Page URL',
  country: 'Country',
  device: 'Device',
};

export default function KeywordTable({ rows, dimension }) {
  const [sortKey, setSortKey] = useState('clicks');
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
    .filter(r => r.key.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'desc' ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />;
  };

  const positionBadge = (pos) => {
    if (pos <= 3) return 'bg-drill-green/15 text-drill-green';
    if (pos <= 10) return 'bg-blue-500/15 text-blue-500';
    if (pos <= 20) return 'bg-crude-gold/15 text-crude-gold';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {DIMENSION_LABELS[dimension] || 'Results'} Performance ({filtered.length})
        </h3>
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground w-8">#</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{DIMENSION_LABELS[dimension]}</th>
              {[
                { key: 'clicks', label: 'Clicks' },
                { key: 'impressions', label: 'Impressions' },
                { key: 'ctr', label: 'CTR' },
                { key: 'position', label: 'Position' },
              ].map(col => (
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
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No data found</td>
              </tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.key} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-foreground max-w-xs truncate">
                  {dimension === 'page' ? (
                    <a href={row.key} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary dark:text-accent">
                      {row.key.replace(/^https?:\/\/[^/]+/, '')}
                    </a>
                  ) : row.key}
                </td>
                <td className="text-right px-4 py-2.5 font-mono font-semibold text-foreground">{row.clicks.toLocaleString()}</td>
                <td className="text-right px-4 py-2.5 font-mono text-muted-foreground">{row.impressions.toLocaleString()}</td>
                <td className="text-right px-4 py-2.5 font-mono text-muted-foreground">{(row.ctr * 100).toFixed(1)}%</td>
                <td className="text-right px-4 py-2.5">
                  <Badge className={`${positionBadge(row.position)} border-0 font-mono text-xs`}>
                    {row.position.toFixed(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}