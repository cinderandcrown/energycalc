import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Calculator, Droplets, Flame, TrendingUp, Star,
  ChevronRight, RefreshCw, Zap, Shield, DollarSign,
  BarChart3, ArrowUpRight, BookOpen, ShieldAlert, Search, AlertTriangle,
  Gem, Wheat, Factory, Beef
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import AdBanner from "@/components/ads/AdBanner";
import InContentAd from "@/components/ads/InContentAd";
import PriceAlertWidget from "@/components/alerts/PriceAlertWidget";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

const calcCards = [
  {
    title: "Net Investment",
    description: "Calculate your true after-tax cost with IDC deductions & depletion allowances",
    icon: Calculator,
    path: "/calc/net-investment",
    color: "from-petroleum to-[#1a3a6b]",
    badge: "Tax Benefits",
  },
  {
    title: "Oil (Barrels) to Cash",
    description: "Convert BOPD production into monthly working interest income",
    icon: Droplets,
    path: "/calc/barrels-to-cash",
    color: "from-[#7B3F00] to-[#5c2f00]",
    badge: "Oil Production",
  },
  {
    title: "Natural Gas to Cash",
    description: "Convert MCF/day into net monthly income including NGL revenue",
    icon: Flame,
    path: "/calc/natgas-to-cash",
    color: "from-[#1a3a6b] to-[#0d2b50]",
    badge: "Gas Production",
  },
  {
    title: "Rate of Return",
    description: "Full IRR, payout period, and ROI on your energy investment",
    icon: TrendingUp,
    path: "/calc/rate-of-return",
    color: "from-[#1a4731] to-[#0f2d1f]",
    badge: "ROI Analysis",
  },
  {
    title: "Tax Impact",
    description: "Model cumulative IDC, depletion & depreciation across 5 years of investments",
    icon: Calculator,
    path: "/calc/tax-impact",
    color: "from-[#4a1a6b] to-[#2d0f4a]",
    badge: "Multi-Year Tax",
  },
  {
    title: "Gold Purity",
    description: "Calculate karat purity, troy weight, and spot-price value of gold holdings",
    icon: Gem,
    path: "/calc/gold-purity",
    color: "from-[#6b5a1a] to-[#4a3d0f]",
    badge: "Precious Metals",
  },
  {
    title: "Ag Yield",
    description: "Project crop revenue with acreage, yield, and market price inputs",
    icon: Wheat,
    path: "/calc/ag-yield",
    color: "from-[#3d6b1a] to-[#264a0f]",
    badge: "Agriculture",
  },
  {
    title: "Metal Cost Basis",
    description: "Landed cost, P&L, and break-even pricing for industrial metals",
    icon: Factory,
    path: "/calc/metal-cost",
    color: "from-[#1a4a6b] to-[#0f3550]",
    badge: "Industrial Metals",
  },
  {
    title: "Livestock",
    description: "Profit, break-even, and ROI for cattle and hog operations",
    icon: Beef,
    path: "/calc/livestock",
    color: "from-[#6b3a1a] to-[#4a2810]",
    badge: "Livestock",
  },
];

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
  tax_impact: "Tax Impact",
  gold_purity: "Gold Purity",
  ag_yield: "Ag Yield",
  metal_cost: "Metal Cost",
  livestock: "Livestock",
};

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
  tax_impact: Calculator,
  gold_purity: Gem,
  ag_yield: Wheat,
  metal_cost: Factory,
  livestock: Beef,
};

const typePaths = {
  net_investment: "/calc/net-investment",
  barrels_to_cash: "/calc/barrels-to-cash",
  natgas_to_cash: "/calc/natgas-to-cash",
  rate_of_return: "/calc/rate-of-return",
  tax_impact: "/calc/tax-impact",
  gold_purity: "/calc/gold-purity",
  ag_yield: "/calc/ag-yield",
  metal_cost: "/calc/metal-cost",
  livestock: "/calc/livestock",
};

const ENERGY_SYMBOLS = ["WTI", "BRENT", "NG", "HO"]; // unified data source

function derivePricesFromCommodities(commodities) {
  return ENERGY_SYMBOLS.map(sym => {
    const c = commodities.find(x => x.symbol === sym);
    if (c) return { label: c.name, price: c.price, unit: c.unit, changePct: c.changePct ?? 0 };
    return { label: sym, price: null, unit: "", changePct: 0 };
  });
}

const defaultPriceData = [
  { label: "WTI Crude Oil", price: null, unit: "/bbl", changePct: 0 },
  { label: "Brent Crude Oil", price: null, unit: "/bbl", changePct: 0 },
  { label: "Natural Gas", price: null, unit: "/MMBtu", changePct: 0 },
  { label: "Heating Oil", price: null, unit: "/gal", changePct: 0 },
];

const taxAdvantages = [
  {
    icon: Zap,
    title: "Intangible Drilling Costs (IDC)",
    stat: "Up to 100%",
    desc: "IDCs — labor, fuel, chemicals — can be deducted in the year they're incurred, dramatically reducing your taxable income in Year 1.",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
  },
  {
    icon: Shield,
    title: "Percentage Depletion Allowance",
    stat: "15% Tax-Free",
    desc: "Oil & gas investors receive a 15% depletion deduction on gross income — a benefit unavailable in virtually any other asset class.",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
  },
  {
    icon: DollarSign,
    title: "Tangible Equipment Depreciation",
    stat: "7-Year Schedule",
    desc: "Physical drilling equipment qualifies for MACRS depreciation, providing additional deductions spread over the life of the asset.",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Active Income Treatment",
    stat: "No Passive Limits",
    desc: "Working interest investments in oil & gas are classified as active income — losses can offset W-2 and other ordinary income without passive activity limits.",
    color: "text-[#9b59b6]",
    bg: "bg-[#9b59b6]/10",
  },
];

const whyEnergy = [
  { label: "Avg. IRR on producing assets", value: "25–40%", up: true },
  { label: "Year-1 tax deduction (typical)", value: "~65–80%", up: true },
  { label: "S&P 500 avg. annual return", value: "10.5%", up: false },
  { label: "Commodity inflation hedge", value: "Strong", up: true },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(defaultPriceData);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesRefreshing, setPricesRefreshing] = useState(false);

  const fetchPrices = useCallback(async () => {
    setPricesRefreshing(true);
    try {
      // Use the same fetchAllCommodities data source as Markets & Intelligence pages
      const res = await base44.functions.invoke('fetchAllCommodities', {});
      if (res.data?.commodities?.length) {
        setPriceData(derivePricesFromCommodities(res.data.commodities));
      }
    } catch (e) {
      // keep defaults
    }
    setPricesLoading(false);
    setPricesRefreshing(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [me, calcs] = await Promise.all([
        base44.auth.me(),
        base44.entities.Calculation.list("-created_date", 10),
      ]);
      setUser(me);
      setCalculations(calcs);
      setLoading(false);

      // Auto-trigger Stripe checkout if redirected from landing page
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutProduct = urlParams.get("checkout");
      if (checkoutProduct) {
        // Clean URL
        window.history.replaceState({}, "", "/dashboard");
        const res = await base44.functions.invoke("stripeCheckout", { productId: checkoutProduct });
        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      }
    };
    load();
    fetchPrices();
  }, [fetchPrices]);

  const favorites = calculations.filter((c) => c.is_favorite);
  const recent = calculations.slice(0, 5);

  const toggleFavorite = async (calc) => {
    const newVal = !calc.is_favorite;
    // Optimistic update
    setCalculations((prev) =>
      prev.map((c) => (c.id === calc.id ? { ...c, is_favorite: newVal } : c))
    );
    try {
      await base44.entities.Calculation.update(calc.id, { is_favorite: newVal });
    } catch {
      // Revert on failure
      setCalculations((prev) =>
        prev.map((c) => (c.id === calc.id ? { ...c, is_favorite: calc.is_favorite } : c))
      );
    }
  };

  const handlePullRefresh = useCallback(async () => {
    const [me, calcs] = await Promise.all([
      base44.auth.me(),
      base44.entities.Calculation.list("-created_date", 10),
    ]);
    setUser(me);
    setCalculations(calcs);
    await fetchPrices();
  }, [fetchPrices]);

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

      {/* New user onboarding */}
      <OnboardingModal />

      {/* Fraud Alert Banner */}
      <Link to="/investor-protection">
        <div className="rounded-xl border-2 border-flare-red/40 bg-flare-red/5 dark:bg-flare-red/10 p-4 hover:bg-flare-red/10 dark:hover:bg-flare-red/15 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-flare-red/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-flare-red" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-foreground">Protect Yourself First</p>
                <Badge className="bg-flare-red/10 text-flare-red border-0 text-[10px] font-bold">IMPORTANT</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Oil & gas fraud costs investors <strong className="text-foreground">$10B+ annually</strong>. Before you invest a dollar, vet the operator, analyze the PPM, and know the red flags. Tap here to access our full protection toolkit.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />
          </div>
        </div>
      </Link>

      {/* Quick Protection Tools */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/operator-screener" className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-crude-gold/10 flex items-center justify-center mb-3">
            <Search className="w-4.5 h-4.5 text-crude-gold" />
          </div>
          <p className="text-sm font-semibold text-foreground">Vet an Operator</p>
          <p className="text-xs text-muted-foreground mt-0.5">AI background check on any operator</p>
        </Link>
        <Link to="/investor-protection" className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-flare-red/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-flare-red" />
          </div>
          <p className="text-sm font-semibold text-foreground">Analyze a PPM</p>
          <p className="text-xs text-muted-foreground mt-0.5">Upload PDF or paste text for AI red flag scan</p>
        </Link>
      </div>

      {/* Live Commodity Ticker */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
          <div className={`w-2 h-2 rounded-full ${pricesLoading ? "bg-crude-gold animate-pulse" : "bg-drill-green animate-pulse"}`} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {pricesLoading ? "Fetching live prices..." : "Live Prices"}
          </span>
          <button
            onClick={fetchPrices}
            disabled={pricesRefreshing}
            className="ml-auto p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-1 flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 sm:w-3 sm:h-3 text-muted-foreground ${pricesRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {priceData.map((item) => {
            const up = (item.changePct ?? 0) >= 0;
            return (
              <div key={item.label} className="px-3 py-3 text-center">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide truncate">{item.label}</p>
                <p className="font-mono font-bold text-base text-foreground">
                  {item.price != null ? `$${item.price.toFixed(2)}` : "—"}
                  <span className="text-xs text-muted-foreground">{item.unit}</span>
                </p>
                <p className={`text-xs font-medium ${up ? "text-drill-green" : "text-flare-red"}`}>
                  {up ? "+" : ""}{(item.changePct ?? 0).toFixed(2)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Alert Widget */}
      <PriceAlertWidget />

      {/* Hero Welcome */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          {loading ? "Welcome back" : `Welcome back, ${user?.full_name?.split(" ")[0] ?? "there"} 👋`}
        </motion.h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Know your numbers before you invest. Built for operators, investors, and commodity energy professionals.
        </p>
      </div>

      {/* Why Oil & Gas — Investor Case */}
      <section>
        <div className="rounded-2xl border-2 border-crude-gold/30 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-crude-gold" />
            <h2 className="font-bold text-white text-base">Why Commodity Energy Investing Outperforms</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            Commodity-driven energy investments — oil, gas, solar, wind, uranium — offer <strong className="text-crude-gold">unmatched tax advantages</strong> unavailable in stocks, real estate, or crypto. The U.S. tax code actively incentivizes domestic energy production — giving qualified investors the ability to write off the majority of their investment in <strong className="text-white">Year 1</strong> while generating commodity-backed cash flow.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {whyEnergy.map((item) => (
              <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <ArrowUpRight className={`w-3.5 h-3.5 ${item.up ? "text-crude-gold" : "text-white/50"}`} />
                  <span className="font-mono font-bold text-sm text-crude-gold">{item.value}</span>
                </div>
                <p className="text-white/60 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
            <Link to="/learn">
              <Button size="sm" variant="outline" className="border-crude-gold/50 text-crude-gold hover:bg-crude-gold/10 gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                Learn the Fundamentals
              </Button>
            </Link>
            <Link to="/calc/net-investment">
              <Button size="sm" className="bg-crude-gold text-petroleum font-semibold hover:opacity-90 gap-1.5 text-xs">
                <Calculator className="w-3.5 h-3.5" />
                Run My Numbers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* In-content ad after educational section */}
      <InContentAd slot="DASH_MID_1" />

      {/* Tax Advantage Breakdown */}
      <section>
        <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Tax Advantages at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {taxAdvantages.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <Badge className={`${item.bg} ${item.color} border-0 text-[10px] font-bold`}>{item.stat}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Example:</strong> A $500,000 investment with 75% IDC and a 37% tax rate yields ~$138,750 in IDC deductions + ~$2,643 in Year-1 tangible depreciation = <strong className="text-foreground">~$141,393 in Year-1 tax savings</strong>, reducing your net cost to ~$358,607 before a barrel is produced. Once producing, 15% depletion further reduces your tax burden. Use the <Link to="/calc/net-investment" className="text-primary dark:text-accent underline">Net Investment Calculator</Link> to model your scenario.
          </p>
        </div>
      </section>

      {/* Pinned Favorites */}
      {favorites.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-crude-gold fill-crude-gold" />
            <h2 className="text-sm font-semibold text-foreground">Pinned Favorites</h2>
          </div>
          <div className="space-y-2">
            {favorites.map((calc) => {
              const Icon = typeIcons[calc.calc_type] || Calculator;
              return (
                <Link key={calc.id} to={typePaths[calc.calc_type]} className="flex items-center gap-3 p-3 rounded-xl border border-crude-gold/30 bg-card hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-crude-gold/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-crude-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{calc.name}</p>
                    <p className="text-xs text-muted-foreground">{typeLabels[calc.calc_type]}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* In-content ad before calculators */}
      <InContentAd slot="DASH_MID_2" />

      {/* Calculators */}
      <section>
        <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">{calcCards.length} Professional Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {calcCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={card.path}
                  className={`block rounded-2xl bg-gradient-to-br ${card.color} p-5 hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-[10px]">{card.badge}</Badge>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{card.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed">{card.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recent Calculations */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recent Calculations</h2>
            <Link to="/scenarios" className="text-xs text-primary dark:text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {recent.map((calc) => {
              const Icon = typeIcons[calc.calc_type] || Calculator;
              return (
                <div key={calc.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{calc.name}</p>
                    <p className="text-xs text-muted-foreground">{typeLabels[calc.calc_type]} · {new Date(calc.created_date).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 sm:w-7 sm:h-7 shrink-0"
                    onClick={() => toggleFavorite(calc)}
                  >
                    <Star className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${calc.is_favorite ? "text-crude-gold fill-crude-gold" : "text-muted-foreground"}`} />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {recent.length === 0 && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <Calculator className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No calculations yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Model your first investment and see your real tax-adjusted returns</p>
          <Link to="/calc/net-investment">
            <Button size="sm">Start Calculating</Button>
          </Link>
        </div>
      )}

      {/* Bottom ad */}
      <AdBanner slot="DASH_BOTTOM" format="horizontal" className="rounded-xl" />

      {/* Footer Disclaimer */}
      <div className="pb-4 pt-2 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Commodity Investor+ is for informational and educational purposes only. Covers oil, gas, precious metals, industrial metals, agriculture, livestock, and other commodity sectors. Tax treatment varies by individual circumstances. Always consult a qualified CPA or financial advisor before making investment decisions.
        </p>
      </div>
    </div>
    </PullToRefresh>
  );
}