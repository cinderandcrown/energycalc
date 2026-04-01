import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useSubscription from "@/hooks/useSubscription";
import { base44 } from "@/api/base44Client";
import { Shield, Zap, Clock, CheckCircle2, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MONTHLY_PRODUCT_ID = "prod_UC1nAY3emodE1H";
const ANNUAL_PRODUCT_ID = "prod_annual_99";

export default function SubscriptionGate() {
  const { loading, hasAccess, isTrialing, trialDaysLeft, status, user } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("annual");

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
  const handleCheckout = async (productId) => {
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app. Please open the live URL to subscribe.");
      return;
    }
    setCheckoutLoading(true);
    const res = await base44.functions.invoke("stripeCheckout", { productId });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
    setCheckoutLoading(false);
  };

  const isReturning = status === "canceled" || status === "inactive";
  const selectedProductId = billingCycle === "annual" ? ANNUAL_PRODUCT_ID : MONTHLY_PRODUCT_ID;
  const priceLabel = billingCycle === "annual" ? "$99/yr" : "$10/mo";

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="w-16 h-16 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-crude-gold" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isReturning ? "Your subscription has ended" : "Start Your Free Trial"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {isReturning
              ? "Resubscribe to regain access to all calculators, AI tools, and market intelligence."
              : "Get full access to every calculator, AI tool, and market feed. Try free for 3 days — cancel anytime before your trial ends."}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${billingCycle === "monthly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${billingCycle === "annual" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >
            Annual
            <span className="text-[9px] font-bold bg-drill-green text-white px-1.5 py-0.5 rounded-full">SAVE 17%</span>
          </button>
        </div>

        <div className="rounded-2xl border-2 border-crude-gold/40 bg-card p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-crude-gold" />
            <span className="font-bold text-foreground">Commodity Investor+</span>
            <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-xs ml-auto">
              {billingCycle === "annual" ? "$8.25/mo billed yearly" : "$10/mo after trial"}
            </Badge>
          </div>
          {[
            "All 9 investment calculators",
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
            onClick={() => handleCheckout(selectedProductId)}
            disabled={checkoutLoading}
            className="w-full h-12 bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 text-base"
          >
            {checkoutLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                {isReturning ? `Resubscribe — ${priceLabel}` : "Start 3-Day Free Trial"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            {isReturning
              ? "Payments secured by Stripe. Cancel anytime."
              : `No charge for 3 days. After trial, ${priceLabel}. Cancel anytime.`}
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