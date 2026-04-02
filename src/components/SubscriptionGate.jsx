import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useSubscription from "@/hooks/useSubscription";
import { base44 } from "@/api/base44Client";
import { Shield, Zap, Clock, CheckCircle2, ArrowRight, Loader2, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MONTHLY_PRODUCT_ID = "prod_UC1nAY3emodE1H";
const ANNUAL_PRODUCT_ID = "prod_annual_99";

export default function SubscriptionGate() {
  const { loading, hasAccess, isTrialing, trialDaysLeft, trialExpired, status, user } = useSubscription();
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

  // Determine headline & copy based on state
  let headline, subtitle, ctaLabel, subtext;
  if (trialExpired) {
    headline = "Your Free Trial Has Ended";
    subtitle = "You had full access for 3 days. Subscribe now to keep using all 9 calculators, AI tools, and live market intelligence.";
    ctaLabel = `Subscribe Now — ${priceLabel}`;
    subtext = `Instant access. ${priceLabel}. Cancel anytime.`;
  } else if (isReturning) {
    headline = "Your Subscription Has Ended";
    subtitle = "Resubscribe to regain access to all calculators, AI tools, and market intelligence.";
    ctaLabel = `Resubscribe — ${priceLabel}`;
    subtext = "Payments secured by Stripe. Cancel anytime.";
  } else {
    headline = "Subscribe to Get Started";
    subtitle = "Get full access to every calculator, AI tool, and market feed. Trusted by serious commodity investors.";
    ctaLabel = `Subscribe — ${priceLabel}`;
    subtext = `${priceLabel}. Cancel anytime. Payments secured by Stripe.`;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="w-16 h-16 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto">
          {trialExpired ? (
            <AlertTriangle className="w-8 h-8 text-flare-red" />
          ) : (
            <Lock className="w-8 h-8 text-crude-gold" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{headline}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">{subtitle}</p>
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
              {billingCycle === "annual" ? "$8.25/mo billed yearly" : "$10/mo"}
            </Badge>
          </div>
          {[
            "All 9 investment calculators",
            "AI PPM Document Analyzer",
            "AI Operator Screener",
            "Live commodity price feeds",
            "Investor fraud protection library",
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
                {ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>

        <div className="flex items-center gap-2 justify-center pt-2">
          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">Payments secured by Stripe · Apple Pay & Google Pay accepted</p>
        </div>
      </motion.div>
    </div>
  );
}
