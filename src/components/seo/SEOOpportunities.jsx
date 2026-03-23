import { Rocket, Zap, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function OpportunitySection({ icon: Icon, title, subtitle, color, bgColor, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b border-border ${bgColor}`}>
        <Icon className={`w-4 h-4 ${color}`} />
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="ml-auto text-[10px]">{items.length}</Badge>
      </div>
      <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">
        {items.map((r, i) => (
          <div key={r.key} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
            <span className="text-[10px] text-muted-foreground font-mono w-5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{r.key}</p>
              <div className="flex gap-3 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{r.impressions.toLocaleString()} imp</span>
                <span className="text-[10px] text-muted-foreground">{r.clicks} clicks</span>
                <span className="text-[10px] text-muted-foreground">{(r.ctr * 100).toFixed(1)}% CTR</span>
              </div>
            </div>
            <Badge className={`border-0 font-mono text-[10px] ${
              r.position <= 3 ? 'bg-drill-green/15 text-drill-green' :
              r.position <= 10 ? 'bg-blue-500/15 text-blue-500' :
              r.position <= 20 ? 'bg-crude-gold/15 text-crude-gold' :
              'bg-muted text-muted-foreground'
            }`}>
              #{r.position.toFixed(1)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SEOOpportunities({ opportunities, quickWins, topPerformers }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <OpportunitySection
        icon={Trophy}
        title="Top Performers"
        subtitle="Your best ranking keywords with clicks"
        color="text-drill-green"
        bgColor="bg-drill-green/5"
        items={topPerformers}
      />
      <OpportunitySection
        icon={Zap}
        title="Quick Wins"
        subtitle="Positions 4–15 with good impressions — push to page 1"
        color="text-blue-500"
        bgColor="bg-blue-500/5"
        items={quickWins}
      />
      <OpportunitySection
        icon={Rocket}
        title="Untapped Opportunities"
        subtitle="High impressions but buried on page 2+ — massive potential"
        color="text-crude-gold"
        bgColor="bg-crude-gold/5"
        items={opportunities}
      />
    </div>
  );
}