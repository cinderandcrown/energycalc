import { DollarSign, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const players = [
  {
    role: "The Operator / General Partner",
    makeMoney: true,
    how: "The operator ALWAYS makes money — whether the well produces or not. They collect management fees (1–3% annually), drilling supervision fees (10–15% of well cost), acquisition fees (3–5%), and overhead charges. In LP structures, the GP also takes a back-end carry (15–50% of distributions after 'payout'). In JV turnkey deals, the operator embeds a markup in the turnkey price. The operator's economic incentive is to DRILL AND SELL DEALS — not necessarily to produce oil profitably for investors.",
    riskLevel: "LOW",
    riskExplanation: "The operator risks their reputation and potentially their license. Financially, they're typically playing with investor money after fees. Their downside is limited; their upside is unlimited."
  },
  {
    role: "The Landman / Lease Broker",
    makeMoney: true,
    how: "Acquires mineral leases from landowners at market rates (or below), then flips them to operators or investors at a markup. In legitimate deals, landmen provide real value by assembling acreage positions. In abusive deals, the markup can be 5–20x the acquisition cost — and investors never know because the original lease cost isn't disclosed.",
    riskLevel: "LOW",
    riskExplanation: "Landmen profit on the transaction itself. They have no ongoing exposure to well performance."
  },
  {
    role: "The Promoter / Deal Marketer",
    makeMoney: true,
    how: "Earns 5–15% commission on every dollar of investor capital raised. A $5M raise at 10% puts $500K in the promoter's pocket before a single hole is drilled. The promoter's incentive is purely to SELL — they have no interest in well performance. Many promoters are not registered broker-dealers, which itself may be a securities violation.",
    riskLevel: "NONE",
    riskExplanation: "Promoters take zero financial risk. They get paid on capital raised, period. Their only risk is regulatory enforcement (rare)."
  },
  {
    role: "The Service Companies",
    makeMoney: true,
    how: "Drilling contractors, frac crews, casing companies, mud engineers, trucking, saltwater disposal — all get paid whether the well produces or not. In operator-controlled deals, the operator often owns affiliated service companies and bills them to the joint account at above-market rates. This is legal if disclosed; fraud if hidden.",
    riskLevel: "NONE",
    riskExplanation: "Service companies are paid for work performed. Well outcome is irrelevant to their revenue."
  },
  {
    role: "The Geologist / Engineer (Hired by Operator)",
    makeMoney: true,
    how: "Paid a consulting fee to produce the geological report and reserve estimates in the offering. Their report may be objective — or may be tailored to support the operator's marketing claims. An 'independent' geologist paid by the operator has an inherent conflict of interest.",
    riskLevel: "LOW",
    riskExplanation: "Professional liability exists if the report is fraudulent, but most geologists carry E&O insurance and hedge their language with qualifiers."
  },
  {
    role: "The Securities Attorney",
    makeMoney: true,
    how: "Drafts the PPM, LP agreement, JOA, and subscription documents. Earns $25K–$100K+ per offering. The attorney structures the deal to be legally compliant while maximizing operator flexibility. Their client is the operator, not the investor.",
    riskLevel: "LOW",
    riskExplanation: "Attorneys face malpractice risk only if they knowingly participate in fraud. Competent ones draft documents that protect the operator from investor claims."
  },
  {
    role: "YOU — The Working Interest Investor",
    makeMoney: null,
    how: "You provide 100% of the capital. You bear 100% of the geological risk, operational risk, commodity price risk, and environmental liability. You receive revenue only AFTER royalties, overrides, severance taxes, operating expenses, and operator fees are deducted. Your return depends entirely on: (1) the well actually producing, (2) commodity prices staying high enough, (3) the operator managing costs honestly, and (4) the decline curve not being worse than projected.",
    riskLevel: "HIGHEST",
    riskExplanation: "You are at the bottom of the economic stack. Everyone above you gets paid first — whether the well works or not. Your upside is genuine if everything goes right. Your downside is total loss of capital."
  },
];

export default function WhoMakesMoney() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border-2 border-crude-gold/30 bg-crude-gold/5">
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-crude-gold mt-0.5 shrink-0" />
          <p className="text-xs text-foreground leading-relaxed font-medium">
            <strong>The fundamental question every investor should ask:</strong> "Who gets paid regardless of whether this well produces oil?" If the answer is "everyone except me" — which it often is — you need to understand exactly how much of your capital goes to guaranteed fees vs. actual drilling.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((p, i) => {
          const isInvestor = p.role.includes("YOU");
          return (
            <div key={i} className={`rounded-xl border p-4 ${isInvestor ? "border-2 border-crude-gold/40 bg-crude-gold/5" : "border-border bg-card"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isInvestor ? "bg-crude-gold/20" : "bg-muted"}`}>
                  {isInvestor ? <Users className="w-4 h-4 text-crude-gold" /> : <DollarSign className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className={`text-sm font-bold ${isInvestor ? "text-crude-gold" : "text-foreground"}`}>{p.role}</p>
                    <Badge className={`text-[10px] font-bold border-0 ${
                      p.riskLevel === "HIGHEST" ? "bg-flare-red/10 text-flare-red" :
                      p.riskLevel === "NONE" ? "bg-drill-green/10 text-drill-green" :
                      "bg-crude-gold/10 text-crude-gold"
                    }`}>
                      Risk: {p.riskLevel}
                    </Badge>
                    {p.makeMoney === true && (
                      <Badge className="bg-drill-green/10 text-drill-green border-0 text-[10px]">Gets paid regardless</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{p.how}</p>
                  <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/30">
                    {p.riskLevel === "HIGHEST"
                      ? <AlertTriangle className="w-3 h-3 text-flare-red mt-0.5 shrink-0" />
                      : <CheckCircle2 className="w-3 h-3 text-drill-green mt-0.5 shrink-0" />
                    }
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{p.riskExplanation}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">The takeaway:</strong> In a typical oil & gas deal, the operator, promoter, landman, service companies, attorney, and geologist ALL get paid before you see a dollar of return. This doesn't mean every deal is bad — but it means you need to calculate the total fee load and ask: "After everyone else takes their cut, how much production does this well need to generate for me to get my money back?" Use the <a href="/calc/rate-of-return" className="text-primary dark:text-accent underline">Rate of Return calculator</a> to model this.
        </p>
      </div>
    </div>
  );
}