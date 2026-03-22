import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const rules = [
  {
    rule: "Rule 504",
    title: "Limited Offerings (Up to $10M)",
    maxRaise: "$10 million in a 12-month period",
    accreditedOnly: false,
    generalSolicitation: "Allowed in some states with registration or under certain conditions",
    secReview: false,
    keyPoints: [
      "Can sell to non-accredited investors",
      "No specific disclosure requirements under federal law (state rules may apply)",
      "Cannot be used by SEC reporting companies, investment companies, or blank check companies",
      "State securities (Blue Sky) laws still apply — must register or qualify in each state",
      "Resale restrictions apply unless the offering is registered at the state level",
    ],
    investorWarning: "Less common in oil & gas. If an operator uses Rule 504, verify state-level registration. The lack of federal disclosure requirements means you must do extra due diligence.",
  },
  {
    rule: "Rule 506(b)",
    title: "Most Common Exemption in Oil & Gas",
    maxRaise: "Unlimited",
    accreditedOnly: false,
    generalSolicitation: "NOT allowed — issuer cannot publicly advertise or solicit investors",
    secReview: false,
    keyPoints: [
      "Up to 35 non-accredited investors allowed (but must be 'sophisticated' — meaning they have financial knowledge to evaluate the investment)",
      "Unlimited accredited investors",
      "If ANY non-accredited investors participate, the issuer MUST provide detailed disclosure documents similar to what's required in a registered offering",
      "No SEC or state review of the offering materials",
      "Investors must have a pre-existing relationship with the issuer or its broker-dealer",
      "Securities are 'restricted' — cannot be freely resold for at least 6-12 months (Rule 144)",
    ],
    investorWarning: "This is how most oil & gas deals are sold. The 'pre-existing relationship' requirement means the operator or promoter should know you BEFORE pitching the deal. Cold calls and unsolicited emails offering 506(b) investments are illegal.",
  },
  {
    rule: "Rule 506(c)",
    title: "Publicly Advertised Offerings",
    maxRaise: "Unlimited",
    accreditedOnly: true,
    generalSolicitation: "ALLOWED — issuer can publicly advertise and solicit",
    secReview: false,
    keyPoints: [
      "ALL investors must be accredited — no exceptions",
      "Issuer must take 'reasonable steps' to VERIFY accredited status (self-certification is NOT sufficient)",
      "Acceptable verification: review tax returns, bank statements, W-2s; or get a letter from a CPA, attorney, broker-dealer, or investment adviser",
      "General solicitation (ads, emails, social media, seminars) is permitted",
      "Securities are still restricted — resale limitations apply",
      "Form D must be filed with the SEC within 15 days of the first sale",
    ],
    investorWarning: "If you see an oil & gas deal advertised on social media, at a seminar, or via email blast, it MUST be a 506(c) offering. If they don't verify your accredited status with documentation, they are violating the law. Walk away.",
  },
];

export default function RegDRules() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 dark:border-accent/30 pl-3">
        Regulation D (Reg D) provides three exemptions from SEC registration for private offerings. Understanding which rule applies to a deal helps you know your rights, the issuer's obligations, and what protections you do — and don't — have.
      </p>

      {rules.map((r) => (
        <div key={r.rule} className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent border-0 font-bold">{r.rule}</Badge>
            <h3 className="text-sm font-bold text-foreground">{r.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-card border border-border p-2">
              <p className="text-muted-foreground font-medium">Max Raise</p>
              <p className="text-foreground font-semibold">{r.maxRaise}</p>
            </div>
            <div className="rounded-lg bg-card border border-border p-2">
              <p className="text-muted-foreground font-medium">Accredited Only?</p>
              <p className="text-foreground font-semibold flex items-center gap-1">
                {r.accreditedOnly ? (
                  <><CheckCircle2 className="w-3 h-3 text-drill-green" /> Yes</>
                ) : (
                  <><XCircle className="w-3 h-3 text-muted-foreground" /> No</>
                )}
              </p>
            </div>
          </div>

          <div className="text-xs">
            <p className="text-muted-foreground font-medium mb-0.5">General Solicitation / Advertising:</p>
            <p className="text-foreground font-medium">{r.generalSolicitation}</p>
          </div>

          <ul className="space-y-1.5">
            {r.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-drill-green shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-lg bg-crude-gold/5 border border-crude-gold/20 p-2.5 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-crude-gold shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Investor Note:</strong> {r.investorWarning}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}