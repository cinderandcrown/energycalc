import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Gift, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SocialShareButtons from "./SocialShareButtons";

/**
 * Referral widget shown in account/settings pages.
 * Displays unique referral link, copy button, and share options.
 */
export default function ReferralWidget({ userId, referralCount = 0 }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate a simple referral code from userId
  const referralCode = useMemo(() => {
    if (!userId) return "";
    // Use last 8 chars of userId as referral code
    return String(userId).slice(-8).toUpperCase();
  }, [userId]);

  const referralUrl = referralCode
    ? `${window.location.origin}/?ref=${referralCode}`
    : "";

  const handleCopy = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast({ title: "Referral link copied!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Referral link", description: referralUrl });
    }
  };

  if (!userId) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-crude-gold/10 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-crude-gold" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-sm">Refer a Friend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Give a friend 1 week free. Get 1 month free for each signup.
          </p>
        </div>
      </div>

      {/* Referral link */}
      <div className="flex gap-2">
        <Input
          readOnly
          value={referralUrl}
          className="text-xs font-mono bg-muted/30"
          aria-label="Your referral link"
        />
        <Button onClick={handleCopy} size="sm" variant="outline" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-4 h-4 text-drill-green" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* Share buttons */}
      <SocialShareButtons
        url={referralUrl}
        title="Check out Commodity Investor+ — commodity market intelligence"
        description="9 commodity calculators, AI deal analysis, live prices, and investor protection tools. Try it free."
      />

      {/* Stats */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Users className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground">{referralCount}</strong> successful referral{referralCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
