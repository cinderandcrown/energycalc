import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, BookOpen, ShieldAlert, Calculator, Menu,
  TrendingUp, Flame, Percent, Gem, Wheat, Factory, Beef, BarChart2
} from "lucide-react";

const TABS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { path: "/markets", icon: BarChart3, label: "Markets" },
  { path: "/energy-literacy", icon: BookOpen, label: "Learn" },
  { path: "/investor-protection", icon: ShieldAlert, label: "Protect" },
];

const CALC_ITEMS = [
  { path: "/calc/net-investment", icon: TrendingUp, label: "Net Investment" },
  { path: "/calc/barrels-to-cash", icon: BarChart2, label: "Barrels to Cash" },
  { path: "/calc/natgas-to-cash", icon: Flame, label: "Nat Gas to Cash" },
  { path: "/calc/rate-of-return", icon: Percent, label: "Rate of Return" },
  { path: "/calc/tax-impact", icon: Calculator, label: "Tax Impact" },
  { path: "/calc/gold-purity", icon: Gem, label: "Gold Purity" },
  { path: "/calc/ag-yield", icon: Wheat, label: "Ag Yield" },
  { path: "/calc/metal-cost", icon: Factory, label: "Metal Cost" },
  { path: "/calc/livestock", icon: Beef, label: "Livestock" },
];

const calcPaths = CALC_ITEMS.map(c => c.path);

export default function BottomTabBar({ onMorePress }) {
  const location = useLocation();
  const [calcOpen, setCalcOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const isCalcActive = calcPaths.some(p => location.pathname === p);

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Calc sub-menu */}
      {calcOpen && (
        <div className="border-b border-border bg-card grid grid-cols-2 gap-px bg-border">
          {CALC_ITEMS.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setCalcOpen(false)}
              className={`flex items-center gap-2 px-3 min-h-[44px] bg-card transition-colors ${
                isActive(path) ? "text-primary dark:text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-6">
        {TABS.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setCalcOpen(false)}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs transition-colors ${
              isActive(path) ? "text-primary dark:text-accent" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}

        {/* Calculators toggle */}
        <button
          onClick={() => { setCalcOpen(!calcOpen); }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs transition-colors ${
            isCalcActive || calcOpen ? "text-primary dark:text-accent" : "text-muted-foreground"
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px]">Calc</span>
        </button>

        {/* More */}
        <button
          onClick={() => { setCalcOpen(false); onMorePress(); }}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>
    </nav>
  );
}

export { CALC_ITEMS };