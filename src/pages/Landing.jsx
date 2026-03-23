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
import LandingOilSplash from "@/components/LandingOilSplash";
import HeroBackground from "@/components/landing/HeroBackground";
import HeroContent from "@/components/landing/HeroContent";

const PLAN = {
  name: "EnergyCalc Pro",
  price: "$10",
  period: "/mo",
  productId: "prod_UC1nAY3emodE1H",
  description: "Full access to every tool, calculator, and AI-powered feature on the platform.",
  features: [
    "All 8 investment calculators",
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
  { icon: ShieldAlert, title: "AI Operator Screener", desc: "Enter any operator's name and get an instant AI background check — red flags, known issues, regulatory actions, and verification steps. Your first line of defense." },
  { icon: Shield, title: "PPM Red Flag Analyzer", desc: "Paste any PPM, JV agreement, or subscription document. Our AI scores risk 1–10, flags predatory clauses, and tells you what's missing." },
  { icon: Calculator, title: "8 Professional Calculators", desc: "Oil, gas, gold purity, 100+ industrial metals, 120+ agricultural crops, rate of return, net investment, and multi-year tax impact — model any commodity deal." },
  { icon: BookOpen, title: "Fraud Pattern Library", desc: "Learn the 6 most common oil & gas fraud schemes — promissory note traps, cost stuffing, ORRI schemes, and more. Based on SEC & FBI enforcement actions." },
  { icon: BarChart3, title: "Live Market Intelligence", desc: "Real-time crude oil, natural gas, metals, and commodity prices with AI market commentary. Track what your commodities are worth today across every sector." },
  { icon: Zap, title: "Tax Optimization Tools", desc: "Model IDC deductions, percentage depletion, and MACRS depreciation. See your true after-tax cost before you sign anything." },
];

const CALCS = [
  { icon: Calculator, label: "Net Investment", desc: "After-tax cost with IDC & depletion" },
  { icon: Droplets, label: "Barrels to Cash", desc: "BOPD → working interest income" },
  { icon: Flame, label: "Nat Gas to Cash", desc: "MCF/day → net monthly income" },
  { icon: Percent, label: "Rate of Return", desc: "IRR, payout period & ROI" },
  { icon: TrendingUp, label: "Tax Impact", desc: "5-year cumulative tax model" },
  { icon: Star, label: "Gold Purity", desc: "Karat, weight & spot valuation" },
  { icon: Search, label: "120+ Crop Yields", desc: "Ag revenue per acre projections" },
  { icon: Lock, label: "100+ Metals", desc: "Full landed cost-basis analysis" },
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

    // Check if user is authenticated first
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      // Redirect to login, then to dashboard with checkout flag
      base44.auth.redirectToLogin(`/dashboard?checkout=${productId}`);
      return;
    }

    const res = await base44.functions.invoke("stripeCheckout", { productId });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Unable to start checkout. Please try again.");
    }
    setCheckoutLoading(null);
  };

  const handleSignIn = () => {
    if (window.self !== window.top) {
      alert("Sign in is only available from the published app. Click 'Publish' in the top right, then open your live URL to sign in.");
      return;
    }
    base44.auth.redirectToLogin("/dashboard");
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Oil splash entrance animation */}
      <LandingOilSplash />

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
            <Button variant="ghost" size="sm" onClick={handleSignIn} className="hidden sm:inline-flex gap-1.5 text-sm">
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
            <button onClick={handleSignIn} className="block text-sm text-crude-gold font-semibold">Sign In →</button>
          </div>
        )}
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        <HeroBackground />
        <HeroContent scrollToPricing={scrollToPricing} handleSignIn={handleSignIn} />
      </section>

      {/* ═══════ TRUST MISSION ═══════ */}
      <section className="border-b border-border bg-flare-red/5 dark:bg-flare-red/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-4 rounded-2xl border-2 border-flare-red/30 bg-card p-6">
            <div className="w-12 h-12 rounded-2xl bg-flare-red/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-flare-red" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg mb-2">Our Mission: Stop Oil & Gas Investment Fraud</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The FBI estimates <strong className="text-foreground">$10 billion+</strong> is lost annually to oil and gas investment fraud. From promissory note schemes to cost-stuffing operators, predatory promoters hide behind complex PPM language, shell companies, and Reg D exemptions. <strong className="text-foreground">We built EnergyCalc Pro to arm investors with the tools to fight back.</strong>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">8 Calculators. Every Commodity. Every Angle.</h2>
            <p className="text-muted-foreground text-sm">Oil, gas, gold, 100+ metals, 120+ crops, rare earth, battery metals — the most comprehensive commodity toolkit anywhere.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Your Complete Investor Protection Arsenal</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">Built to protect you from bad deals, bad operators, and bad math. Every tool an oil & gas investor needs to make informed decisions.</p>
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
              {checkoutLoading === PLAN.productId ? "Redirecting to Checkout..." : "Start 3-Day Free Trial — Then $10/mo"}
              {checkoutLoading !== PLAN.productId && <ArrowRight className="w-4 h-4" />}
            </Button>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">No charge for 3 days. Cancel anytime before trial ends.</p>
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
            onClick={handleSignIn}
          >
            <Lock className="w-4 h-4" />
            Sign In to Dashboard
          </Button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border bg-card/50 py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <p className="text-[10px] text-muted-foreground text-center sm:text-left leading-relaxed max-w-lg">
              © {new Date().getFullYear()} EnergyCalc Pro. Not a registered broker-dealer or investment advisor. All calculations are illustrative only. Covers oil, gas, solar, wind, uranium, and other commodity energy sectors. Not affiliated with FINRA, SEC, or any regulatory body.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Legal &amp; Privacy</Link>
              <Link to="/investor-protection" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Investor Protection</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 w-full justify-center">
            <a href="https://cinderandcrown.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <img src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/177a83ee6_CinderCrown-MuteLogo.png" alt="Cinder & Crown" className="w-5 h-5 object-contain" />
              <span className="text-[10px] text-muted-foreground">Built by <strong className="text-foreground/70">Cinder &amp; Crown</strong></span>
            </a>
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