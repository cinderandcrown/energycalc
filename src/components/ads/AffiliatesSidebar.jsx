import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AFFILIATES = [
  {
    name: "Interactive Brokers",
    desc: "Trade commodities, futures & options with low commissions.",
    category: "Broker",
    url: "https://www.interactivebrokers.com/",
    badge: "Top Rated",
  },
  {
    name: "TD Ameritrade / Schwab",
    desc: "Futures trading + thinkorswim platform for energy traders.",
    category: "Broker",
    url: "https://www.schwab.com/futures",
    badge: "Popular",
  },
  {
    name: "Kitco",
    desc: "Buy, sell & store physical gold, silver, platinum & palladium.",
    category: "Precious Metals",
    url: "https://www.kitco.com/",
    badge: "Trusted",
  },
  {
    name: "TurboTax Business",
    desc: "Self-employed & investor tax filing with IDC deduction support.",
    category: "Tax Software",
    url: "https://turbotax.intuit.com/",
    badge: "Tax Season",
  },
  {
    name: "LegalZoom",
    desc: "Form your LLC or LP for oil & gas investments.",
    category: "Legal",
    url: "https://www.legalzoom.com/",
    badge: "",
  },
];

export default function AffiliatesSidebar({ compact = false }) {
  return (
    <div className={`rounded-2xl border border-border bg-card ${compact ? "p-3" : "p-4"}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">
        Partner Tools & Services
      </p>
      <div className="space-y-2.5">
        {AFFILIATES.map((a) => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border hover:border-crude-gold/30 hover:bg-crude-gold/5 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-crude-gold transition-colors">{a.name}</p>
                {a.badge && (
                  <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-[9px] font-bold shrink-0">{a.badge}</Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{a.desc}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">{a.category}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
      <p className="text-[8px] text-muted-foreground/50 mt-2 leading-relaxed">
        Affiliate Disclosure: We may earn a commission from partner links. This does not affect our editorial content or recommendations. See <a href="/legal" className="underline">Legal</a>.
      </p>
    </div>
  );
}