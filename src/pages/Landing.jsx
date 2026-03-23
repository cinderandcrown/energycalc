import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Calculator, TrendingUp, Shield, BookOpen, BarChart3, Zap,
  ChevronRight, CheckCircle2, ArrowRight, Flame, Droplets,
  ShieldAlert, Star, Lock, Percent, Menu, X, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdUnit from "@/components/AdUnit";

const PLAN = {
  name: "EnergyCalc Pro",
  price: "$10",
  period: "/mo",
  productId: "prod_UC1nAY3emodE1H",
  description: "Full access to every tool, calculator, and AI-powered feature on the platform.",
  features: [
    "All 4 investment calculators",
    "Unlimited saved calculations",
    "AI PPM Document Analyzer",
    "AI Operator Screener",
    "Live commodity price feed",
    "Investor Protection Center",
    "Scenario comparison tools",
    "Geological due diligence guides",
    "Glossary & FAQ library",
  ],
};



const FEATURES = [
  { icon: ShieldAlert, title: "AI Operator Screener", desc: "AI background check on any operator — red flags, regulatory actions, and verification steps." },
  { icon: Shield, title: "PPM Red Flag Analyzer", desc: "Paste any PPM or JV agreement. AI scores risk 1–10 and flags predatory clauses." },
  { icon: Calculator, title: "4 Deal Calculators", desc: "Net Investment, Barrels-to-Cash, Nat Gas-to-Cash, and Rate of Return." },
  { icon: BookOpen, title: "Fraud Pattern Library", desc: "6 common oil & gas fraud schemes based on SEC & FBI enforcement actions." },
  { icon: BarChart3, title: "Live Market Intelligence", desc: "Real-time commodity prices with AI market commentary." },
  { icon: Zap, title: "Tax Optimization Tools", desc: "Model IDC, percentage depletion, and MACRS depreciation." },
];

const CALCS = [
  { icon: Calculator, label: "Net Investment", desc: "After-tax cost with IDC & depletion" },
  { icon: Droplets, label: "Barrels to Cash", desc: "BOPD → working interest income" },
  { icon: Flame, label: "Nat Gas to Cash", desc: "MCF/day → net monthly income" },
  { icon: Percent, label: "Rate of Return", desc: "IRR, payout period & ROI" },
];

export default function Landing() {
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleCheckout = async (productId) => {
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

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Oil pour entrance animation */}
      <motion.div
        className="fixed inset-0 z-[200] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#1a0f00] via-[#2a1800]/90 to-transparent"
          initial={{ height: "100vh" }}
          animate={{ height: "0vh" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-crude-gold/60 to-transparent"
          initial={{ top: "100%", opacity: 1 }}
          animate={{ top: "-5%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.div>

      {/* ═══════ NAVIGATION ═══════ */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png" alt="EnergyCalc Pro" className="w-9 h-9 rounded-xl object-contain" />
            <div className="leading-none">
              <span className="font-bold text-base tracking-tight">
                <span className="text-primary dark:text-accent">Energy</span><span className="text-foreground">Calc</span>
              </span>
              <span className="hidden sm:block text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Pro · Commodity Energy Intelligence</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <button onClick={scrollToPricing} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
            <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Legal</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => base44.auth.redirectToLogin("/dashboard")} className="hidden sm:inline-flex gap-1.5 text-sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5" onClick={scrollToPricing}>
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden ml-1 p-1.5 text-muted-foreground">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            <button onClick={() => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block text-sm text-foreground">Features</button>
            <button onClick={scrollToPricing} className="block text-sm text-foreground">Pricing</button>
            <Link to="/legal" className="block text-sm text-foreground" onClick={() => setMobileMenuOpen(false)}>Legal</Link>
            <button onClick={() => base44.auth.redirectToLogin("/dashboard")} className="block text-sm text-crude-gold font-semibold">Sign In →</button>
          </div>
        )}
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-petroleum via-[#0d2d5a] to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,67,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,168,67,0.06),transparent_50%)]" />

        {/* Animated oil bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: "10%", delay: "0s", size: "6px", duration: "3s" },
            { left: "25%", delay: "0.8s", size: "4px", duration: "2.5s" },
            { left: "45%", delay: "1.5s", size: "8px", duration: "3.5s" },
            { left: "65%", delay: "0.3s", size: "5px", duration: "2.8s" },
            { left: "80%", delay: "2s", size: "3px", duration: "3.2s" },
            { left: "90%", delay: "1.2s", size: "6px", duration: "2.6s" },
          ].map((b, i) => (
            <div
              key={i}
              className="absolute bottom-0 rounded-full bg-crude-gold/30"
              style={{
                left: b.left,
                width: b.size,
                height: b.size,
                animation: `bubble-rise ${b.duration} ease-out infinite`,
                animationDelay: b.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
            <Badge className="bg-crude-gold/15 text-crude-gold border-crude-gold/25 mb-6 text-xs font-semibold px-4 py-1.5">
              Built for Commodity Energy Investors
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5"
          >
            Know Your Numbers.{" "}
            <span className="text-crude-gold">Protect Your Capital.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-center text-white/65 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Vet operators. Analyze PPMs. Model tax-adjusted returns. Spot fraud before you invest. Built by investors, for investors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" className="bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 px-8 h-12 text-base" onClick={scrollToPricing}>
              <Zap className="w-5 h-5" />
              View Plans &amp; Pricing
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2 h-12 text-base" onClick={() => base44.auth.redirectToLogin("/dashboard")}>
              <Lock className="w-4 h-4" />
              Sign In
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { value: "$10B+", label: "Annual energy investment fraud (FBI)" },
              { value: "65–80%", label: "Year-1 tax deduction (typical WI)" },
              { value: "25–40%", label: "Avg IRR on producing assets" },
              { value: "6+", label: "Commodity sectors covered" },
            ].map((s) => (
              <div key={s.label} className="text-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-4">
                <p className="font-mono font-bold text-xl text-crude-gold">{s.value}</p>
                <p className="text-[11px] text-white/50 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ TRUST MISSION ═══════ */}
      <section className="border-b border-border bg-flare-red/5 dark:bg-flare-red/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-4 rounded-2xl border-2 border-flare-red/30 bg-card p-6">
            <div className="w-12 h-12 rounded-2xl bg-flare-red/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-flare-red" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg mb-2">Oil & Gas Investment Fraud: $10B+ Lost Annually</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Promissory note schemes, cost-stuffing operators, predatory PPM language, shell companies, Reg D exemptions. EnergyCalc Pro gives you the tools to vet deals before you commit capital.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs font-semibold">AI Operator Vetting</Badge>
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs font-semibold">PPM Red Flag Scanner</Badge>
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs font-semibold">Fraud Pattern Library</Badge>
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs font-semibold">Due Diligence Checklists</Badge>
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-xs font-semibold">SEC/FINRA Reporting Guide</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CALCULATORS ═══════ */}
      <section className="border-b border-border bg-card/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">4 Calculators. Every Deal Angle.</h2>
            <p className="text-muted-foreground text-sm">Built around how commodity energy deals actually work — oil, gas, and beyond.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CALCS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-5 text-center hover:border-crude-gold/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-primary dark:text-accent" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{c.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Investor Protection & Analysis Tools</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">Everything you need to vet a deal before committing capital.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-crude-gold/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary dark:text-accent" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════ AD ═══════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <AdUnit variant="horizontal" />
      </div>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" className="border-y border-border bg-card/30 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">One plan. Full access. Cancel anytime. Payments processed securely via Stripe.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border-2 border-crude-gold/50 bg-card shadow-lg shadow-crude-gold/5 ring-1 ring-crude-gold/20 p-8 max-w-md mx-auto"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-crude-gold text-petroleum text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">Full Access</span>
            </div>

            <div className="text-center mb-6">
              <h3 className="font-bold text-foreground text-xl">{PLAN.name}</h3>
              <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">{PLAN.description}</p>
            </div>

            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="font-mono font-bold text-5xl text-foreground">{PLAN.price}</span>
              <span className="text-muted-foreground text-lg">{PLAN.period}</span>
            </div>

            <ul className="space-y-2.5 mb-8">
              {PLAN.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-drill-green shrink-0 mt-0.5" />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleCheckout(PLAN.productId)}
              disabled={!!checkoutLoading}
              className="w-full gap-2 font-semibold h-12 text-base bg-crude-gold text-petroleum hover:bg-crude-gold/90"
            >
              {checkoutLoading === PLAN.productId ? "Redirecting to Checkout..." : "Get Started — $10/mo"}
              {checkoutLoading !== PLAN.productId && <ArrowRight className="w-4 h-4" />}
            </Button>
          </motion.div>
        </div>
      </section>



      {/* ═══════ CTA ═══════ */}
      <section className="border-t border-border bg-gradient-to-b from-petroleum to-[#071a33]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Star className="w-8 h-8 text-crude-gold mx-auto mb-5" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Already a member?</h2>
          <p className="text-white/55 text-sm mb-7 max-w-md mx-auto">Sign in to access your dashboard, saved calculations, and live market intelligence.</p>
          <Button
            size="lg"
            className="bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 px-10 h-12"
            onClick={() => base44.auth.redirectToLogin("/dashboard")}
          >
            <Lock className="w-4 h-4" />
            Sign In to Dashboard
          </Button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border bg-card/50 py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground text-center sm:text-left leading-relaxed max-w-lg">
            © {new Date().getFullYear()} EnergyCalc Pro. Not a broker-dealer or investment adviser. Calculations are illustrative only. Not affiliated with FINRA, SEC, or any regulatory body.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Legal &amp; Privacy</Link>
            <Link to="/investor-protection" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Investor Protection</Link>
          </div>
        </div>
      </footer>

      {/* ═══════ TRUST BAR ═══════ */}
      <div className="border-t border-border bg-background py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
          <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[10px] text-muted-foreground text-center">
            Payments secured by Stripe · Apple Pay &amp; Google Pay accepted · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}