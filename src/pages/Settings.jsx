import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Moon, Sun, Shield, LogOut, Zap, ExternalLink, Loader2, CreditCard, CheckCircle2, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import PageHeader from "@/components/mobile/PageHeader";
import AccountDeletion from "@/components/mobile/AccountDeletion";
import PriceAlertManager from "@/components/alerts/PriceAlertManager";

const PRODUCT_ID = import.meta.env.VITE_STRIPE_PRODUCT_ID || "prod_UC1nAY3emodE1H";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();

  const isProActive = user?.subscription_status === "active" || user?.subscription_status === "trialing";

  const handleUpgrade = async () => {
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app. Please open the live URL to subscribe.");
      return;
    }
    setCheckoutLoading(true);
    const res = await base44.functions.invoke("stripeCheckout", { productId: PRODUCT_ID });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      toast({ title: "Unable to start checkout", description: "Please try again.", variant: "destructive" });
    }
    setCheckoutLoading(false);
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    const res = await base44.functions.invoke("stripeBillingPortal", {});
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      toast({ title: "Unable to open billing portal", variant: "destructive" });
    }
    setPortalLoading(false);
  };

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setFullName(u?.full_name || "");
      setCompany(u?.company || "");
    });
    const isDark = localStorage.getItem("energycalc-theme") !== "light";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = (val) => {
    setDarkMode(val);
    localStorage.setItem("energycalc-theme", val ? "dark" : "light");
    document.documentElement.classList.toggle("dark", val);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ company });
      toast({ title: "Profile updated!" });
    } catch (err) {
      toast({ title: "Failed to save", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
        icon={SettingsIcon}
      />

      {/* Subscription */}
      <div className="rounded-2xl border border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-crude-gold" />
              <span className="text-crude-gold text-xs font-semibold uppercase tracking-wide">Current Plan</span>
            </div>
            <h2 className="text-white font-bold text-lg">
              {user?.subscription_status === "active" ? "EnergyCalc Pro" : 
               user?.subscription_status === "trialing" ? "Free Trial" : "No Active Plan"}
            </h2>
            <p className="text-white/60 text-xs mt-1">
              {user?.subscription_status === "active"
                ? "Full access to all tools and calculators."
                : user?.subscription_status === "trialing"
                ? "Free trial active. Your card will be charged after trial ends."
                : "Subscribe to unlock all tools and calculators."}
            </p>
          </div>
          <Badge className={`font-semibold text-xs ${
            user?.subscription_status === "active" ? "bg-drill-green text-white" : 
            user?.subscription_status === "trialing" ? "bg-crude-gold text-petroleum" : 
            "bg-muted text-muted-foreground"
          }`}>
            {user?.subscription_status === "active" ? "PRO" : 
             user?.subscription_status === "trialing" ? "TRIAL" : 
             "INACTIVE"}
          </Badge>
        </div>

        {isProActive ? (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-drill-green" />
              <span className="text-white/80 text-sm font-medium">Your Pro subscription is active</span>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 gap-2"
              onClick={handleManageBilling}
              disabled={portalLoading}
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing & Invoices
            </Button>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-white/80 text-xs font-semibold mb-3">Pro features — $10/month</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {["Unlimited saved calculations", "Scenario comparison", "AI deal analysis", "Live price feed", "Operator screening", "Tax strategy tools"].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-crude-gold/80 flex items-center justify-center">
                    <span className="text-petroleum text-[8px] font-bold">✓</span>
                  </div>
                  <span className="text-white/70 text-xs">{f}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-crude-gold text-petroleum font-semibold hover:opacity-90 gap-2"
              onClick={handleUpgrade}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {checkoutLoading ? "Redirecting..." : "Upgrade to Pro — $10/mo"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <User className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Profile</h2>
        </div>
        <div>
          <Label className="text-sm">Full Name</Label>
          <Input value={fullName} disabled className="mt-1.5 min-h-[48px] text-base bg-muted/50 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-1.5">Name cannot be changed here. Contact support.</p>
        </div>
        <div>
          <Label className="text-sm">Email</Label>
          <Input value={user?.email || ""} disabled className="mt-1.5 min-h-[48px] text-base bg-muted/50 text-muted-foreground" />
        </div>
        <div>
          <Label className="text-sm">Company (optional)</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company name"
            className="mt-1.5 min-h-[48px] text-base"
          />
        </div>
        <Button onClick={saveProfile} disabled={saving} className="min-h-[48px] text-base w-full sm:w-auto">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      {/* Price Alerts */}
      {isProActive && <PriceAlertManager />}

      {/* Appearance */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
          {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
          <h2 className="text-base font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="flex items-center justify-between min-h-[48px]">
          <div>
            <p className="text-base font-medium text-foreground">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Recommended for field environments</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDark} />
        </div>
      </div>

      {/* Legal */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-2">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Legal & Compliance</h2>
        </div>
        <Link to="/legal" className="w-full flex items-center justify-between py-3 text-base text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Privacy Policy
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
        </Link>
        <Link to="/legal" className="w-full flex items-center justify-between py-3 text-base text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Terms of Use
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
        </Link>
        <Link to="/legal" className="w-full flex items-center justify-between py-3 text-base text-foreground hover:text-primary dark:hover:text-accent transition-colors">
          Full Legal Disclosures
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="pt-3 border-t border-border mt-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">EnergyCalc Pro is not a registered broker-dealer, investment advisor, or FINRA member.</strong> All calculations are illustrative estimates only and do not constitute investment advice, tax advice, or a securities solicitation. Oil &amp; gas investments involve substantial risk including loss of principal. Always consult a licensed CPA, securities attorney, or registered investment advisor.
          </p>
        </div>
      </div>

      {/* Logout */}
      <Button variant="outline" className="w-full min-h-[48px] gap-2 text-base text-destructive border-destructive/40 hover:bg-destructive/10" onClick={handleLogout}>
        <LogOut className="w-5 h-5" />
        Sign Out
      </Button>

      {/* Delete Account — Multi-step flow */}
      <AccountDeletion />

      <div className="h-4" />
    </div>
  );
}