import { ExternalLink, Database } from "lucide-react";

const DATABASES = [
  { name: "SEC EDGAR", desc: "Federal securities filings & enforcement actions", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=&dateb=&owner=include&count=40&search_text=&action=getcompany" },
  { name: "FINRA BrokerCheck", desc: "Verify broker/dealer registrations & disciplinary history", url: "https://brokercheck.finra.org/" },
  { name: "SEC Enforcement Actions", desc: "Search recent SEC enforcement proceedings", url: "https://www.sec.gov/litigation/litreleases.htm" },
  { name: "TX Railroad Commission", desc: "Texas oil & gas operator lookup", url: "https://www.rrc.texas.gov/oil-and-gas/" },
  { name: "OK Corporation Commission", desc: "Oklahoma operator well search", url: "https://oklahoma.gov/occ/divisions/oil-gas.html" },
  { name: "PACER", desc: "Federal court case lookup", url: "https://pacer.uscourts.gov/" },
  { name: "Better Business Bureau", desc: "BBB business complaints & ratings", url: "https://www.bbb.org/search" },
  { name: "SEC Whistleblower", desc: "Report suspected fraud to SEC", url: "https://www.sec.gov/whistleblower" },
];

export default function RegulatoryLinks({ operatorName, stateResources }) {
  const encodedName = encodeURIComponent(operatorName);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
        <Database className="w-4 h-4 text-primary dark:text-accent" />
        Search Public Databases
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        Cross-reference <strong className="text-foreground">"{operatorName}"</strong> against these regulatory databases. AI can miss things — verify independently.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DATABASES.map((db) => {
          // Append operator name to URL where supported
          let targetUrl = db.url;
          if (db.url.includes("browse-edgar")) {
            targetUrl = `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodedName}&CIK=&type=&dateb=&owner=include&count=40&search_text=&action=getcompany`;
          } else if (db.url.includes("bbb.org")) {
            targetUrl = `https://www.bbb.org/search?find_text=${encodedName}`;
          }

          return (
            <a
              key={db.name}
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/20 dark:hover:border-accent/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary dark:group-hover:text-accent mt-0.5 shrink-0 transition-colors" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">{db.name}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{db.desc}</p>
              </div>
            </a>
          );
        })}

        {/* State-specific regulator if provided */}
        {stateResources?.regulatorName && (
          <a
            href={stateResources.regulatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-crude-gold/30 bg-crude-gold/5 hover:bg-crude-gold/10 transition-all sm:col-span-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-crude-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-crude-gold">{stateResources.regulatorName}</p>
              <p className="text-[10px] text-muted-foreground">State-specific oil & gas regulator</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}