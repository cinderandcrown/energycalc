import { XCircle, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const dealBreakers = [
  "The operator won't provide an itemized AFE (Authorization for Expenditure)",
  "No independent third-party engineering report is available",
  "The offering is not filed as Form D with the SEC — or the operator can't provide the filing number",
  "The promoter cold-called you or found you through social media advertising (likely 506(b) violation)",
  "Returns are described as 'guaranteed,' 'risk-free,' or 'proven'",
  "The operator refuses to let you verify well status on the state oil & gas board website",
  "You cannot identify any currently producing wells operated by this company",
  "The offering uses a promissory note structure instead of working interest equity",
  "The operator's physical office address doesn't exist or is a UPS Store / virtual office",
  "You're being pressured with a deadline: 'This deal closes Friday' or 'Only 2 units left'",
  "The GP/operator fee stack exceeds 25% of total invested capital (LP deals)",
  "The turnkey price exceeds the AFE by more than 20% (JV deals)",
  "No audit rights are provided in the JOA or LPA",
  "The operator uses affiliated service companies with no disclosure or market-rate caps",
  "You can't find the operator's name on any state oil & gas board as an active operator",
];

const greenLights = [
  "The operator has 10+ years of continuous operations with verifiable production history",
  "An independent, third-party petroleum engineer has prepared a reserve report for YOUR specific wells",
  "The offering has a valid Form D filing that you've verified on SEC EDGAR",
  "You were introduced through a pre-existing relationship (not cold-contacted)",
  "Full AFE with line-item costs is provided and is consistent with industry benchmarks for the basin",
  "Monthly production and revenue reporting is contractually guaranteed",
  "Audit rights are clearly stated in the JOA or LPA",
  "The operator's existing well production matches state regulatory records (you've verified)",
  "All affiliated-party transactions are disclosed with market-rate justification",
  "An independent oil & gas attorney (YOUR attorney, not theirs) has reviewed the agreement",
  "The economics work BEFORE tax benefits — taxes are a bonus, not the reason to invest",
  "The operator has put their own capital at risk alongside investors (meaningful skin in the game)",
];

export default function WhenToWalkAway() {
  return (
    <div className="space-y-6">
      {/* Deal Breakers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-flare-red" />
          <h3 className="text-sm font-bold text-flare-red uppercase tracking-wide">Absolute Deal Breakers — Walk Away</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          If ANY ONE of these applies, do not invest. Not 'proceed with caution' — walk away completely. These are not judgment calls; they are binary indicators that something is fundamentally wrong.
        </p>
        <div className="space-y-2">
          {dealBreakers.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-flare-red/20 bg-flare-red/5">
              <XCircle className="w-3.5 h-3.5 text-flare-red mt-0.5 shrink-0" />
              <p className="text-xs text-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Green Lights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-drill-green" />
          <h3 className="text-sm font-bold text-drill-green uppercase tracking-wide">Green Lights — Signs of a Legitimate Deal</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          No deal will check every box. But the more of these that are present, the more likely you're dealing with a legitimate operator. Aim for 8+ of these before committing capital.
        </p>
        <div className="space-y-2">
          {greenLights.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-drill-green/20 bg-drill-green/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-drill-green mt-0.5 shrink-0" />
              <p className="text-xs text-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
        <p className="text-xs text-foreground leading-relaxed font-medium mb-3">
          <strong>Ready to evaluate a specific deal?</strong> Use these tools to dig deeper:
        </p>
        <div className="flex gap-2 flex-wrap">
          <Link to="/investor-protection" className="inline-flex items-center gap-1.5 text-xs font-semibold text-crude-gold hover:underline">
            <ArrowRight className="w-3 h-3" /> AI Deal Analyzer
          </Link>
          <Link to="/operator-screener" className="inline-flex items-center gap-1.5 text-xs font-semibold text-crude-gold hover:underline">
            <ArrowRight className="w-3 h-3" /> Operator Screener
          </Link>
          <Link to="/calc/rate-of-return" className="inline-flex items-center gap-1.5 text-xs font-semibold text-crude-gold hover:underline">
            <ArrowRight className="w-3 h-3" /> Rate of Return Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}