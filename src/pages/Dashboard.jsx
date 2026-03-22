import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Calculator, Droplets, Flame, TrendingUp, Star, ChevronRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const calcCards = [
  {
    title: "Net Investment",
    description: "Calculate after-tax out-of-pocket cost with IDC deductions",
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
    description: "Convert MCF/day production into net monthly income",
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
    badge: "ROI",
  },
];

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
};

const typePaths = {
  net_investment: "/calc/net-investment",
  barrels_to_cash: "/calc/barrels-to-cash",
  natgas_to_cash: "/calc/natgas-to-cash",
  rate_of_return: "/calc/rate-of-return",
};

const priceData = [
  { label: "WTI Crude", price: "70.14", unit: "/bbl", change: "+0.83%", up: true },
  { label: "Brent Crude", price: "74.28", unit: "/bbl", change: "+0.61%", up: true },
  { label: "Henry Hub Gas", price: "3.42", unit: "/MMBtu", change: "-1.24%", up: false },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [me, calcs] = await Promise.all([
        base44.auth.me(),
        base44.entities.Calculation.list("-created_date", 10),
      ]);
      setUser(me);
      setCalculations(calcs);
      setLoading(false);
    };
    load();
  }, []);

  const favorites = calculations.filter((c) => c.is_favorite);
  const recent = calculations.slice(0, 5);

  const toggleFavorite = async (calc) => {
    await base44.entities.Calculation.update(calc.id, { is_favorite: !calc.is_favorite });
    setCalculations((prev) =>
      prev.map((c) => (c.id === calc.id ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Price Ticker */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
          <div className="w-2 h-2 rounded-full bg-drill-green animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Live Commodity Prices</span>
          <RefreshCw className="w-3 h-3 text-muted-foreground ml-auto" />
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          {priceData.map((item) => (
            <div key={item.label} className="px-4 py-3 text-center">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
              <p className="font-mono font-bold text-base text-foreground">${item.price}<span className="text-xs text-muted-foreground">{item.unit}</span></p>
              <p className={`text-xs font-medium ${item.up ? "text-drill-green" : "text-flare-red"}`}>{item.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {loading ? "Welcome back" : `Welcome back, ${user?.full_name?.split(" ")[0] ?? "there"} 👋`}
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-1">Know Your Numbers Before You Drill.</p>
      </div>

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

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Calculators</h2>
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
                    className="w-7 h-7 shrink-0"
                    onClick={() => toggleFavorite(calc)}
                  >
                    <Star className={`w-3.5 h-3.5 ${calc.is_favorite ? "text-crude-gold fill-crude-gold" : "text-muted-foreground"}`} />
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
          <p className="text-xs text-muted-foreground mt-1 mb-4">Run your first calculation to get started</p>
          <Link to="/calc/net-investment">
            <Button size="sm">Start Calculating</Button>
          </Link>
        </div>
      )}
    </div>
  );
}