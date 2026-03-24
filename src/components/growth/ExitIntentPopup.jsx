import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";
import useExitIntent from "@/hooks/useExitIntent";
import EmailCaptureForm from "./EmailCaptureForm";

/**
 * Exit-intent popup that shows when user moves mouse to leave the page.
 * Offers a lead magnet (free commodity due diligence checklist) gated behind email.
 */
export default function ExitIntentPopup() {
  const { showPopup, dismiss } = useExitIntent();

  return (
    <Dialog open={showPopup} onOpenChange={(open) => { if (!open) dismiss(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-crude-gold/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-crude-gold" aria-hidden="true" />
            </div>
            <DialogTitle className="text-lg">Before you go...</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Free Commodity Due Diligence Checklist
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The same checklist used by experienced commodity investors to vet operators, analyze PPM documents, and avoid common fraud schemes. 23 critical items across oil & gas, precious metals, and agriculture.
            </p>
          </div>

          <div className="rounded-xl bg-muted/30 border border-border p-4 space-y-2">
            <p className="text-xs font-medium text-foreground">What you'll get:</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-crude-gold mt-0.5">-</span>
                <span>23-point operator vetting checklist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crude-gold mt-0.5">-</span>
                <span>PPM red flag reference guide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crude-gold mt-0.5">-</span>
                <span>Daily commodity market briefing (free forever)</span>
              </li>
            </ul>
          </div>

          <EmailCaptureForm variant="inline" source="exit_intent" />

          <p className="text-[10px] text-muted-foreground text-center">
            Free forever. Unsubscribe anytime. No spam.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
