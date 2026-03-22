import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DisclaimerFooter() {
  return (
    <div className="mt-8 p-4 rounded-xl border border-border bg-muted/50 space-y-2">
      <div className="flex gap-3">
        <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Informational only — not investment, tax, or legal advice. All outputs are hypothetical, based on user inputs and generalized assumptions. Oil &amp; gas investments are speculative and carry risk of total loss.
        </p>
      </div>
      <div className="flex gap-3">
        <div className="w-4 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">IRS Circular 230:</strong> Tax content cannot be used to avoid IRS penalties. Consult a licensed CPA or tax attorney.{" "}
          <Link to="/legal" className="text-primary dark:text-accent underline underline-offset-2 font-medium">
            Full Legal Disclosures →
          </Link>
        </p>
      </div>
    </div>
  );
}