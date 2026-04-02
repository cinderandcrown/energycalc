import { useState } from "react";
import { Clock, Zap, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import useSubscription from "@/hooks/useSubscription";

const MONTHLY_PRODUCT_ID = "prod_UC1nAY3emodE1H";

export default function TrialBanner() {
  const { isTrialing, trialDaysLeft, trialExpired } = useSubscription();
  const [loading, setLoading] = useState(false);

  if (!isTrialing) return null;

  const handleUpgrade = async () => {
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app.");
      return;
    }
    setLoading(true);
    const res = await base44.functions.invoke("stripeCheckout", { productId: MONTHLY_PRODUCT_ID });
    if (res.data?.url) window.location.href = res.data.url;
    setLoading(false);
  };

  const isUrgent = trialDaysLeft <= 1;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
      isUrgent
        ? "bg-flare-red/5 border-flare-red/30"
        : "bg-crude-gold/5 border-crude-gold/30"
    }`}>
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 shrink-0 text-flare-red" />
      ) : (
        <Clock className="w-4 h-4 shrink-0 text-crude-gold" />
      )}
      <p className="text-xs text-foreground flex-1">
        {isUrgent ? (
          <><strong>Last day!</strong> Your free trial ends today. Subscribe now to keep full access.</>
        ) : (
          <><strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> left in your free trial. Subscribe to keep access after it ends.</>
        )}
      </p>
      <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs h-7" onClick={handleUpgrade} disabled={loading}>
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
        Subscribe Now
      </Button>
    </div>
  );
}
