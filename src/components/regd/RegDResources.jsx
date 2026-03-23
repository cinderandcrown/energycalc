import { ExternalLink } from "lucide-react";

const resources = [
  {
    title: "SEC EDGAR — Search Form D Filings",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=D&dateb=&owner=include&count=40&search_text=&action=getcompany",
    desc: "Search for any company's Form D filing to verify that a Reg D offering has been properly filed with the SEC.",
  },
  {
    title: "SEC Regulation D — Full Text",
    url: "https://www.ecfr.gov/current/title-17/chapter-II/part-230/subject-group-ECFR6e12ede35753bab",
    desc: "The complete text of Regulation D (Rules 500–508) in the Electronic Code of Federal Regulations.",
  },
  {
    title: "SEC Investor Bulletin: Private Placements",
    url: "https://www.sec.gov/education/investor-alerts-bulletins/ib-privateplacements",
    desc: "SEC's plain-language guide for investors considering private placements under Regulation D.",
  },
  {
    title: "FINRA BrokerCheck",
    url: "https://brokercheck.finra.org/",
    desc: "Verify the registration and disciplinary history of any broker, adviser, or firm involved in selling the offering.",
  },
  {
    title: "SEC Enforcement Actions Database",
    url: "https://www.sec.gov/litigations/sec-action-look-up",
    desc: "Search for SEC enforcement actions against companies or individuals. Critical for vetting operators and promoters.",
  },
  {
    title: "NASAA — State Securities Regulators",
    url: "https://www.nasaa.org/contact-your-regulator/",
    desc: "Find your state securities regulator to verify registrations, file complaints, or check for state-level enforcement actions.",
  },
  {
    title: "SEC Accredited Investor Definition (Rule 501)",
    url: "https://www.ecfr.gov/current/title-17/section-230.501",
    desc: "The full legal definition of 'accredited investor' under SEC Rule 501(a), including the 2020 amendments.",
  },
  {
    title: "SEC Tips, Complaints, and Referrals (TCR)",
    url: "https://www.sec.gov/whistleblower/submit-a-tip",
    desc: "Report potential securities fraud directly to the SEC. Whistleblowers may be eligible for financial awards of 10–30% of sanctions collected.",
  },
];

export default function RegDResources() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 dark:border-accent/30 pl-3">
        Use these official government and regulatory resources to independently verify any Reg D offering, check the backgrounds of operators and promoters, and report suspected fraud.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors block"
          >
            <div className="flex items-start gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary dark:text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">{r.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-lg bg-muted/30 border border-border p-3">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Links are provided for informational purposes and direct to official U.S. government or regulatory websites. 
          Commodity Investor+ is not affiliated with the SEC, FINRA, NASAA, or any regulatory body. Always consult a qualified securities attorney for legal advice specific to your situation.
        </p>
      </div>
    </div>
  );
}