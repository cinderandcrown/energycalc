import { AlertTriangle } from "lucide-react";

export default function DisclaimerFooter() {
  return (
    <div className="mt-8 p-4 rounded-xl border border-border bg-muted/50 flex gap-3">
      <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Disclaimer:</strong> This calculator is for informational and educational purposes only. 
        It does not constitute tax, legal, or investment advice. Consult a qualified CPA or financial advisor before making investment decisions.
      </p>
    </div>
  );
}