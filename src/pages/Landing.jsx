import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Calculator, TrendingUp, Shield, BookOpen, BarChart3, Zap,
  ChevronRight, CheckCircle2, ArrowRight, Flame, Droplets,
  ShieldAlert, Star, Lock, ExternalLink, Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  {
    name: "Phoenix Alliance Partner",
    price: "$2,500",
    period: "/month",
    priceId: "prod_T51IJwjgs6O3pR",
    badge: "Starter",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    highlight: false,
    description: "Perfect for individual investors getting started in oil & gas analysis.",
    features: [
      "All 4 investment calculators",
      "Unlimited saved calculations",
      "AI PPM Document Analyzer",
      "Live commodity price feed",
      "Investor Protection Center",
      "Glossary & FAQ library",
    ],
  },
  {
    name: "Cinder Alliance Partner",
    price: "$3,750",
    period: "/month",
    priceId: "prod_T51M08shED7Vrs",
    badge: "Most Popular",
    badgeColor: "bg-crude-gold/10 text-crude-gold border-crude-gold/20",
    highlight: true,
    description: "For active investors managing multiple deals and scenarios.",
    features: [
      "Everything in Phoenix",
      "Scenario comparison tools",
      "Priority AI analysis",
      "PDF export & reporting",
      "Advanced decline modeling",
      "Email support (24h SLA)",
    ],
  },
  {
    name: "Crown Alliance Partner",
    price: "$5,400",
    period: "/month",
    priceId: "prod_T51OYAvARzNNGo",
    badge: "Pro",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    highlight: false,
    description: "For operators, fund managers, and institutional energy investors.",
    features: [
      "Everything in Cinder",
      "Multi-user team access",
      "White-label PDF reports",
      "Custom deal modeling",
      "Dedicated account manager",
      "Phone support",
    ],
  },
];

const FEATURES = [
  { icon: Calculator, title: "4 Specialized Calculators", desc: "Net Investment, Barrels-to-Cash, Nat Gas-to-Cash, and Rate of Return — built specifically for oil & gas deal structures.", color: "text-primary dark:text-accent", bg: "bg-primary/10 dark:bg-accent/10" },
  { icon: ShieldAlert, title: "Investor Protection Center", desc: "AI-powered PPM analyzer, red flag checklists, fraud pattern library, and due diligence tools.", color: "text-flare-red", bg: "bg-flare-red/10" },
  { icon: BarChart3, title: "Live Market Intelligence", desc: "Real-time WTI, Brent, and Henry Hub pricing with AI-generated market commentary and sentiment.", color: "text-drill-green", bg: "bg-drill-green/10" },
  { icon: BookOpen, title: "Complete Knowledge Base", desc: "57 defined industry terms, 26 FAQs across 5 categories — everything from IDCs to basin geology.", color: "text-crude-gold", bg: "bg-crude-gold/10" },
  { icon: TrendingUp, title: "Scenario Management", desc: "Save, compare, and favorite your calculations. Model best-case, base-case, and downside scenarios.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Zap, title: "Tax Optimization Tools", desc: "Instantly calculate your true after-tax cost with IDC deductions, depletion allowances, and MACRS depreciation.", color: "text-purple-500", bg: "bg-purple-500/10" },
];

const STATS = [
  { value: "$10B+", label: "Annual oil & gas fraud (FBI est.)" },
  { value: "65–80%", label: "Year-1 tax deduction (typical WI)" },
  { value: "25–40%", label: "Avg IRR on producing wells" },
  { value: "57", label: "Industry terms defined" },
];

function PricingCard({ plan, onCheckout, loading }) {
  const isLoading = loading === plan.priceId;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
        plan.highlight
          ? "border-crude-gold/50 bg-gradient-to-b from-[#1a140a] to-card shadow-xl shadow-crude-gold/10"
          : "border-border bg-card"
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-crude-gold text-petroleum text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>
        </div>
      )}
      <div>
        <Badge className={`border text-xs font-semibold mb-3 ${plan.badgeColor}`}>{plan.badge}</Badge>
        <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{plan.description}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="font-mono font-bold text-3xl text-foreground">{plan.price}</span>
        <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
      </div>
      <ul className="space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="w-4 h-4 text-drill-green shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => onCheckout(plan.priceId)}
        disabled={isLoading}
        className={`w-full gap-2 font-semibold ${
          plan.highlight
            ? "bg-crude-gold text-petroleum hover:opacity-90"
            : "bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground hover:opacity-90"
        }`}
      >
        {isLoading ? "Redirecting..." : "Get Started"}
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}

export default function Landing() {
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleCheckout = async (productId) => {
    // Block checkout in iframe (preview mode)
    if (window.self !== window.top) {
      alert("Checkout is only available from the published app. Please open the live URL to subscribe.");
      return;
    }
    setCheckoutLoading(productId);
    const res = await base44.functions.invoke("stripeCheckout", { productId });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Unable to start checkout. Please try again.");
    }
    setCheckoutLoading(null);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-[#1a3a6b] border border-crude-gold/30 flex items-center justify-center">
              <span className="text-crude-gold text-sm font-bold">⚡</span>
            </div>
            <div className="leading-none">
              <span className="font-bold text-sm tracking-tight">
                <span className="text-primary dark:text-accent">Energy</span><span className="text-foreground">Calc</span>
              </span>
              <span className="block text-[9px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">Pro · Oil &amp; Gas Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => base44.auth.redirectToLogin("/dashboard")} className="gap-1.5 text-sm">
              <Lock className="w-3.5 h-3.5" />
              Sign In
            </Button>
            <Button size="sm" className="bg-crude-gold text-petroleum font-semibold hover:opacity-90 gap-1.5" onClick={() => document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })}>
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-background opacity-90 dark:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,67,0.15),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Badge className="bg-crude-gold/10 text-crude-gold border-crude-gold/30 mb-5 text-xs font-semibold px-3 py-1">
              ⚡ Built for Oil & Gas Investors
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Know Your Numbers<br />
            <span className="text-crude-gold">Before You Drill.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
          >
            The professional-grade investment intelligence platform for oil & gas operators, working interest investors, and energy fund managers. Model tax benefits, analyze deals, and protect your capital.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="bg-crude-gold text-petroleum font-bold hover:opacity-90 gap-2 px-8"
              onClick={() => document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })}
            >
              <Zap className="w-4 h-4" />
              View Plans & Pricing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 gap-2"
              onClick={() => base44.auth.redirectToLogin("/dashboard")}
            >
              <Lock className="w-4 h-4" />
              Sign In to Dashboard
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/60">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }} className="text-center">
              <p className="font-mono font-bold text-xl text-primary dark:text-accent">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Everything You Need to Invest Smarter</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">A full intelligence suite purpose-built for the complexity of oil & gas private placements.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border bg-card p-5">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Calculators Preview */}
      <section className="bg-card/50 border-y border-border py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">4 Calculators. Every Deal Angle Covered.</h2>
            <p className="text-muted-foreground text-sm">Built around how oil & gas deals actually work.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Calculator, label: "Net Investment", desc: "After-tax cost with IDC & depletion", color: "from-petroleum to-[#1a3a6b]" },
              { icon: Droplets, label: "Barrels to Cash", desc: "BOPD → working interest income", color: "from-[#7B3F00] to-[#5c2f00]" },
              { icon: Flame, label: "Nat Gas to Cash", desc: "MCF/day → net monthly income", color: "from-[#1a3a6b] to-[#0d2b50]" },
              { icon: Percent, label: "Rate of Return", desc: "IRR, payout period & ROI", color: "from-[#1a4731] to-[#0f2d1f]" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className={`rounded-2xl bg-gradient-to-br ${c.color} p-4`}>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{c.label}</p>
                  <p className="text-white/60 text-xs leading-tight">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Alliance Partner Plans</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">Choose the tier that matches your investment activity. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <PricingCard key={plan.priceId} plan={plan} onCheckout={handleCheckout} loading={checkoutLoading} />
          ))}
        </div>
        <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3 max-w-2xl mx-auto">
          <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Payments are processed securely via Stripe. EnergyCalc Pro is not a registered broker-dealer or investment advisor. All tools are for informational and educational purposes only. <strong className="text-foreground">Not affiliated with FINRA, SEC, or any regulatory body.</strong>
          </p>
        </div>
      </section>

      {/* Sign In CTA */}
      <section className="border-t border-border bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Star className="w-8 h-8 text-crude-gold mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Already a member?</h2>
          <p className="text-white/60 text-sm mb-6">Sign in to access your dashboard, saved calculations, and market intelligence.</p>
          <Button
            size="lg"
            className="bg-crude-gold text-petroleum font-bold hover:opacity-90 gap-2 px-10"
            onClick={() => base44.auth.redirectToLogin("/dashboard")}
          >
            <Lock className="w-4 h-4" />
            Sign In to EnergyCalc Pro
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} EnergyCalc Pro. Not a registered broker-dealer or investment advisor. All calculations are illustrative only.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Legal & Privacy</Link>
            <Link to="/investor-protection" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Investor Protection</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}