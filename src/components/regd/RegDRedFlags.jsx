import { XCircle, AlertTriangle } from "lucide-react";

const redFlags = [
  {
    flag: "No Form D filed with the SEC",
    detail: "Search SEC EDGAR for the company name. If there's no Form D filing, the offering may not be properly registered or exempt. This is the single easiest check you can do.",
  },
  {
    flag: "Unsolicited contact for a 506(b) offering",
    detail: "Rule 506(b) prohibits general solicitation. If you received a cold call, email blast, or social media message about a 506(b) deal from someone you don't know, the offering is being sold illegally.",
  },
  {
    flag: "506(c) without accredited investor verification",
    detail: "If the deal is advertised publicly (which requires 506(c)) but the operator only asks you to check a box confirming you're accredited — that's insufficient. They must review your financials or get a third-party letter.",
  },
  {
    flag: "Sales commissions exceeding 10%",
    detail: "Check the Form D for 'Sales Commissions & Finder's Fees Expenses.' Industry standard is 5–8%. Above 10% means a significant chunk of your money pays the salesperson, not the drill bit. Above 15% is predatory.",
  },
  {
    flag: "Promoter or 'Related Person' with SEC/FINRA history",
    detail: "Search every name listed on the Form D in FINRA BrokerCheck, SEC EDGAR Enforcement Actions, and your state securities regulator. Prior fraud charges, censures, or bars are disqualifying.",
  },
  {
    flag: "Entity formed very recently (within 30–90 days of offering)",
    detail: "Check the state business registry for the LLC or LP formation date. If the entity was created just weeks before the offering, the operator may be a serial 'deal creator' with no operational track record.",
  },
  {
    flag: "Multiple Form D/A (amendment) filings in short succession",
    detail: "Frequent amendments can indicate the deal is changing terms, struggling to raise capital, or extending its offering period repeatedly. Not always bad, but warrants investigation.",
  },
  {
    flag: "Non-accredited investors in a deal lacking proper disclosures",
    detail: "If a 506(b) offering includes non-accredited investors, the issuer is required to provide disclosure documents similar to a registered offering. If you're non-accredited and only received a glossy brochure, the deal is non-compliant.",
  },
  {
    flag: "Pressure to invest immediately or 'the deal closes today'",
    detail: "Legitimate Reg D offerings don't close overnight. High-pressure sales tactics are a hallmark of boiler room operations. Any operator who won't give you time to consult your CPA and attorney is not someone you want managing your money.",
  },
  {
    flag: "Guaranteed returns or 'no risk' language",
    detail: "Private placements are inherently risky and illiquid. The SEC requires risk disclosures. Any operator promising guaranteed returns, 'safe' investments, or 'can't lose' outcomes is violating securities law — and likely committing fraud.",
  },
];

export default function RegDRedFlags() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-flare-red/30 pl-3">
        The following red flags should prompt you to pause, consult a securities attorney, or walk away entirely. Any single one of these is cause for concern. Two or more together is a pattern — protect yourself.
      </p>

      <div className="space-y-2">
        {redFlags.map((r, i) => (
          <div key={i} className="rounded-lg border border-border/50 bg-card p-3 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-flare-red shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground mb-0.5">{r.flag}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-flare-red/5 border border-flare-red/20 p-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Remember:</strong> Regulation D exempts issuers from SEC registration — it does NOT exempt them from anti-fraud provisions. 
          Federal securities law (Section 10(b) of the Securities Exchange Act, Rule 10b-5) still applies to every private placement. 
          If you've been defrauded, you can file complaints with the SEC, FINRA, and your state securities regulator, and you may have a private right of action.
        </p>
      </div>
    </div>
  );
}