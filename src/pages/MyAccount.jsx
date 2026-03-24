import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  User, CreditCard, Calculator, Star, Clock, Zap, CheckCircle2,
  ArrowRight, Loader2, ChevronRight, Settings, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useSubscription from "@/hooks/useSubscription";
import DocumentVault from "@/components/vault/DocumentVault";
import ReferralWidget from "@/components/growth/ReferralWidget";

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
  tax_impact: "Tax Impact",
  gold_purity: "Gold Purity",
  ag_yield: "Ag Yield",
  metal_cost: "Metal Cost",
};

export default function MyAccount() {
  const { user, isTrialing, isActive, trialDaysLeft, trialEndsAt, status } = useSubscription();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    base44.entities.Calculation.list("-created_date", 50).then(calcs => {
      setCalculations(calcs);
      setLoading(false);
    });
  }, []);

  const favorites = calculations.filter(c => c.is_favorite);
  const totalCalcs = calculations.length;

  const handleManageBilling = async () => {
    if (window.self !== window.top) {
      alert("Billing portal is only available from the published app.");
      return;
    }
    setPortalLoading(true);
    const res = await base44.functions.invoke("stripeBillingPortal", {});
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
    setPortalLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your subscription, saved work, and account details</p>
      </div>

      {/* Subscription Status Card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] dark:from-card dark:to-card/80 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-crude-gold" />
              <span className="text-crude-gold text-xs font-semibold uppercase tracking-wide">Subscription</span>
            </div>
            <h2 className="text-white dark:text-foreground font-bold text-lg">
              {isActive ? "Commodity Investor+" : isTrialing ? "Free Trial" : "No Active Plan"}
            </h2>
          </div>
          <Badge className={`font-semibold text-xs ${
            isActive ? "bg-drill-green text-white" :
            isTrialing ? "bg-crude-gold text-petroleum" :
            "bg-muted text-muted-foreground"
          }`}>
            {isActive ? "ACTIVE" : isTrialing ? "TRIAL" : status?.toUpperCase() || "NONE"}
          </Badge>
        </div>

        {isTrialing && (
          <div className="rounded-xl bg-white/10 dark:bg-muted/30 p-3 mb-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-crude-gold shrink-0" />
            <div>
              <p className="text-white dark:text-foreground text-sm font-semibold">
                {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
              </p>
              <p className="text-white/60 dark:text-muted-foreground text-xs">
                Trial ends {trialEndsAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. 
                Your card will be charged $10/mo automatically unless you cancel.
              </p>
            </div>
          </div>
        )}

        {isActive && (
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-drill-green" />
            <span className="text-white/80 dark:text-foreground text-sm">Full access to all tools — $10/month</span>
          </div>
        )}

        {(isActive || isTrialing) && (
          <Button
            variant="outline"
            className="w-full border-white/20 dark:border-border text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-muted gap-2"
            onClick={handleManageBilling}
            disabled={portalLoading}
          >
            {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Manage Billing & Cancel
          </Button>
        )}

        {!isActive && !isTrialing && (
          <div className="space-y-3">
            <p className="text-white/60 dark:text-muted-foreground text-xs">
              {status === "canceled" || status === "inactive"
                ? "Your subscription has ended. Resubscribe to regain access."
                : "Subscribe to unlock all calculators and AI tools."}
            </p>
            <Link to="/dashboard">
              <Button className="w-full bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-2">
                <Zap className="w-4 h-4" />
                {status === "canceled" || status === "inactive" ? "Resubscribe" : "Start Free Trial"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-foreground">{totalCalcs}</p>
          <p className="text-xs text-muted-foreground">Saved Calcs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-crude-gold">{favorites.length}</p>
          <p className="text-xs text-muted-foreground">Favorites</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-foreground">
            {user?.created_date ? Math.ceil((new Date() - new Date(user.created_date)) / (1000 * 60 * 60 * 24)) : 0}
          </p>
          <p className="text-xs text-muted-foreground">Days Active</p>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          </div>
          <Link to="/settings" className="text-xs text-primary dark:text-accent hover:underline flex items-center gap-1">
            <Settings className="w-3 h-3" /> Edit
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{user?.full_name || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{user?.email || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Company</span>
            <span className="font-medium text-foreground">{user?.company || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium text-foreground">
              {user?.created_date ? new Date(user.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Referral Program */}
      <ReferralWidget userId={user?.id} />

      {/* Deal Document Vault */}
      <DocumentVault />

      {/* Recent Calculations */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Recent Calculations</h2>
          </div>
          <Link to="/scenarios" className="text-xs text-primary dark:text-accent hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : calculations.length === 0 ? (
          <div className="text-center py-6">
            <Calculator className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No calculations yet</p>
            <Link to="/calc/net-investment">
              <Button size="sm" className="mt-3 gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" /> Start Calculating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {calculations.slice(0, 8).map(calc => (
              <div key={calc.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {calc.is_favorite 
                    ? <Star className="w-3.5 h-3.5 text-crude-gold fill-crude-gold" /> 
                    : <Calculator className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{calc.name}</p>
                  <p className="text-xs text-muted-foreground">{typeLabels[calc.calc_type] || calc.calc_type} · {new Date(calc.created_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}