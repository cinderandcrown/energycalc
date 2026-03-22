import { AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const risks = [
  {
    title: "Regulatory Uncertainty",
    severity: "high",
    description: "The SEC has not issued definitive guidance on tokenized energy assets. Are fractional working interest tokens securities? Almost certainly yes (Howey Test). But the regulatory framework for trading, custody, and reporting is still evolving. Operators launching STOs today must navigate a patchwork of federal and state securities laws.",
    takeaway: "Only invest in tokenized energy assets through SEC-compliant STOs (Reg D 506(c) or Reg A+). Demand the Form D filing number. If the token offering isn't registered or exempt, it's illegal.",
  },
  {
    title: "Smart Contract Risk",
    severity: "high",
    description: "Smart contracts are code — and code has bugs. A flaw in a revenue distribution contract could send funds to the wrong address, lock investor capital, or enable exploits. The DeFi space has lost billions to smart contract vulnerabilities. Energy-specific contracts handling real money need professional audits.",
    takeaway: "Demand proof of third-party smart contract audits (CertiK, Trail of Bits, OpenZeppelin) before investing in any tokenized energy product. Unaudited contracts are unacceptable for real asset investments.",
  },
  {
    title: "Liquidity Illusion",
    severity: "medium",
    description: "Tokenization promises liquidity, but liquidity requires active buyers and sellers. Many security token exchanges have thin order books. You may be able to tokenize your working interest but still struggle to find a buyer at a fair price — especially for interests in marginal or stripper wells.",
    takeaway: "Don't assume tokenization automatically means you can sell anytime. Check the actual trading volume on the relevant exchange before counting on liquidity as an exit strategy.",
  },
  {
    title: "Oracle Manipulation",
    severity: "medium",
    description: "On-chain production data is only as reliable as the oracle providing it. If the oracle pulls from operator-reported data (the same data that can be faked in traditional structures), blockchain doesn't solve the trust problem — it just moves it. Oracles need to pull from independent sources (state regulatory APIs, SCADA systems).",
    takeaway: "Verify what data source the oracle uses. State regulatory databases (TX RRC, OK OCC) are reliable. Operator self-reported data fed into an oracle provides no additional security over traditional reporting.",
  },
  {
    title: "Tax Treatment Ambiguity",
    severity: "medium",
    description: "The IRS has not issued specific guidance on the tax treatment of tokenized working interests. Are IDC deductions available to token holders? Is percentage depletion applicable? The answer likely depends on whether the token structure preserves direct working interest ownership vs. creating a securities wrapper.",
    takeaway: "Consult a CPA experienced in both oil & gas taxation AND digital assets before investing. The tax advantages that make energy investing attractive may or may not survive tokenization depending on the legal structure.",
  },
  {
    title: "Custody & Key Management",
    severity: "high",
    description: "If you lose your private keys, you lose your investment — permanently. Unlike traditional brokerage accounts with SIPC protection, self-custodied blockchain assets have no recovery mechanism. Institutional custody solutions (Fireblocks, Anchorage) exist but add cost and complexity.",
    takeaway: "Use institutional-grade custody or regulated custodians for tokenized energy assets. Never store significant value in a hot wallet. Hardware wallets (Ledger, Trezor) are the minimum for self-custody.",
  },
];

const severityColors = {
  high: "bg-flare-red/10 text-flare-red",
  medium: "bg-crude-gold/10 text-crude-gold",
};

export default function Web3Risks() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-flare-red/30 bg-flare-red/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-flare-red mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Investor Warning:</strong> Web3 and blockchain technology offer genuine innovations for the energy sector, but they also introduce new risk vectors. The same due diligence principles that apply to traditional oil & gas — verify the operator, audit the books, demand transparency — apply equally to tokenized offerings. <strong className="text-foreground">Technology does not eliminate fraud. It can make fraud harder — or easier — depending on the implementation.</strong>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {risks.map((risk, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <XCircle className="w-3.5 h-3.5 text-flare-red shrink-0" />
              <p className="text-sm font-semibold text-foreground">{risk.title}</p>
              <Badge className={`${severityColors[risk.severity]} border-0 text-[9px] font-bold uppercase`}>{risk.severity} risk</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{risk.description}</p>
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border p-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary dark:text-accent mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Investor Takeaway:</strong> {risk.takeaway}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}