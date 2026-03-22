import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DisclaimerFooter() {
  return (
    <div className="mt-8 p-4 rounded-xl border border-border bg-muted/50 space-y-2">
      <div className="flex gap-3">
        <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> This calculator is provided for informational and educational purposes only and does not constitute investment advice, tax advice, legal advice, or a recommendation or solicitation to purchase, sell, or hold any security, commodity, or financial instrument. All outputs are hypothetical, illustrative, and based entirely on user-provided inputs and generalized assumptions — they do not reflect actual investment performance or guaranteed future results. Oil and gas investments are speculative and involve a high degree of risk, including total loss of invested capital.
        </p>
      </div>
      <div className="flex gap-3">
        <div className="w-4 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">IRS Circular 230 Notice:</strong> To the extent any tax-related content is provided, it is not intended or written to be used, and cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or (ii) promoting, marketing, or recommending any transaction or matter addressed herein. Always consult a licensed CPA or tax attorney.{" "}
          <Link to="/legal" className="text-primary dark:text-accent underline underline-offset-2 font-medium">
            Full Legal Disclosures →
          </Link>
        </p>
      </div>
    </div>
  );
}