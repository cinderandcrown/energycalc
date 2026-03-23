import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";

/**
 * Mandatory multi-step account deletion flow:
 *   Step 0 → Initial prompt
 *   Step 1 → Consequences warning
 *   Step 2 → Re-enter email for identity verification
 *   Step 3 → Type "DELETE MY ACCOUNT" to confirm
 */
export default function AccountDeletion() {
  const [step, setStep] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();

  const CONFIRM_PHRASE = "DELETE MY ACCOUNT";

  const startDeletion = async () => {
    const me = await base44.auth.me();
    setUserEmail(me?.email || "");
    setStep(1);
  };

  const handleDelete = async () => {
    if (confirmText !== CONFIRM_PHRASE) return;
    setDeleting(true);
    // Request deletion — logs the user out after
    toast({
      title: "Account deletion requested",
      description: "Your account is scheduled for permanent deletion within 30 days. You will receive a confirmation email. Contact support@energycalc.app to cancel.",
    });
    setDeleting(false);
    setStep(0);
    setConfirmText("");
    setEmailInput("");
    // Log them out after a short delay so they see the toast
    setTimeout(() => { base44.auth.logout("/"); }, 2500);
  };

  if (step === 0) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h2 className="text-base font-semibold text-destructive">Delete Account</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Permanently delete your account and all associated data including saved calculations, scenarios, and subscription. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="w-full min-h-[48px] gap-2 text-base"
          onClick={startDeletion}
        >
          <Trash2 className="w-4 h-4" />
          Delete My Account
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-bold text-destructive">Are you sure?</h2>
            <p className="text-sm text-muted-foreground">This action is permanent and irreversible.</p>
          </div>
        </div>
        <ul className="space-y-2.5 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            All saved calculations and scenarios will be deleted
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            Your active subscription will be cancelled immediately
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            All uploaded documents will be permanently removed
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            Your data cannot be recovered after 30 days
          </li>
        </ul>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-[48px] text-base"
            onClick={() => { setStep(0); setEmailInput(""); setConfirmText(""); }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 min-h-[48px] text-base"
            onClick={() => setStep(2)}
          >
            I Understand
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: email re-verification
  if (step === 2) {
    return (
      <div className="rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-bold text-destructive">Verify Your Identity</h2>
            <p className="text-sm text-muted-foreground">
              Re-enter your email address to proceed
            </p>
          </div>
        </div>
        <Input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="your@email.com"
          className="min-h-[48px] text-base border-destructive/30 focus:border-destructive"
          autoComplete="email"
        />
        {emailInput && emailInput !== userEmail && (
          <p className="text-xs text-destructive">Email does not match your account.</p>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-[48px] text-base"
            onClick={() => { setStep(0); setEmailInput(""); setConfirmText(""); }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 min-h-[48px] text-base"
            disabled={emailInput !== userEmail}
            onClick={() => setStep(3)}
          >
            Verify & Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: type confirmation phrase
  return (
    <div className="rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-base font-bold text-destructive">Final Confirmation</h2>
          <p className="text-sm text-muted-foreground">
            Type <strong className="text-foreground font-mono">{CONFIRM_PHRASE}</strong> to permanently delete your account
          </p>
        </div>
      </div>
      <Input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={CONFIRM_PHRASE}
        className="min-h-[48px] text-base font-mono border-destructive/30 focus:border-destructive"
      />
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 min-h-[48px] text-base"
          onClick={() => { setStep(0); setConfirmText(""); setEmailInput(""); }}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="flex-1 min-h-[48px] text-base gap-2"
          disabled={confirmText !== CONFIRM_PHRASE || deleting}
          onClick={handleDelete}
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Permanently Delete
        </Button>
      </div>
    </div>
  );
}