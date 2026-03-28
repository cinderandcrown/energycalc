import { useState } from "react";
import { Clock, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import useSubscription from "@/hooks/useSubscription";

const PRODUCT_ID = import.meta.env.VITE_STRIPE_PRODUCT_ID || "prod_UC1nAY3emodE1H";

export default function TrialBanner() {
  const { isTrialing, trialDaysLeft } = useSubscription();
  const [loading, setLoading] = useState(false);

  if (!isTrialing) return null;

  const handleUpgrade = async () => {
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app.");
      return;
    }
    setLoading(true);
    const res = await base44.functions.invoke("stripeCheckout", { productId: PRODUCT_ID });
    if (res.data?.url) window.location.href = res.data.url;
    setLoading(false);
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
      trialDaysLeft <= 1
        ? "bg-flare-red/5 border-flare-red/30"
        : "bg-crude-gold/5 border-crude-gold/30"
    }`} role="status" aria-live="polite">
      <Clock className={`w-4 h-4 shrink-0 ${trialDaysLeft <= 1 ? "text-flare-red" : "text-crude-gold"}`} aria-hidden="true" />
      <p className="text-xs text-foreground flex-1">
        <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> left in your free trial.
        {trialDaysLeft <= 1 && " Subscribe now to keep access."}
      </p>
      <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs h-7" onClick={handleUpgrade} disabled={loading}>
        {loading ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <Zap className="w-3 h-3" aria-hidden="true" />}
        Subscribe
      </Button>
    </div>
  );
}