import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useSubscription from "@/hooks/useSubscription";
import { base44 } from "@/api/base44Client";
import { Shield, Zap, Clock, CheckCircle2, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const PRODUCT_ID = "prod_UC1nAY3emodE1H";

export default function SubscriptionGate() {
  const { loading, hasAccess, isTrialing, trialDaysLeft, status, user } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasAccess) {
    return <Outlet />;
  }

  // Paywall
  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app. Please open the live URL to subscribe.");
      return;
    }
    setCheckoutLoading(true);
    const res = await base44.functions.invoke("stripeCheckout", { productId: PRODUCT_ID });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
    setCheckoutLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="w-16 h-16 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-crude-gold" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {status === "canceled" || status === "inactive" ? "Your subscription has ended" : "Start Your Free Trial"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {status === "canceled" || status === "inactive"
              ? "Resubscribe to regain access to all calculators, AI tools, and market intelligence."
              : "Get full access to every calculator, AI tool, and market feed. Try free for 3 days — cancel anytime before your trial ends."}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-crude-gold/40 bg-card p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-crude-gold" />
            <span className="font-bold text-foreground">EnergyCalc Pro</span>
            <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-xs ml-auto">$10/mo after trial</Badge>
          </div>
          {[
            "All 8 investment calculators",
            "AI PPM Document Analyzer",
            "AI Operator Screener",
            "Live commodity price feeds",
            "Scenario comparison & portfolio tools",
            "Unlimited saved calculations",
          ].map(f => (
            <div key={f} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-drill-green shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full h-12 bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 text-base"
          >
            {checkoutLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                {status === "canceled" || status === "inactive" ? "Resubscribe — $10/mo" : "Start 3-Day Free Trial"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            {status === "canceled" || status === "inactive"
              ? "Payments secured by Stripe. Cancel anytime."
              : "No charge for 3 days. After trial, $10/month. Cancel anytime."}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-center pt-2">
          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">Payments secured by Stripe · Cancel before trial ends to avoid charges</p>
        </div>
      </motion.div>
    </div>
  );
}