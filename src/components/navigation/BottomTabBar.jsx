import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, BookOpen, ShieldAlert, Calculator, Menu,
  TrendingUp, Flame, Percent, Gem, Wheat, Factory, Beef, BarChart2
} from "lucide-react";

const TABS = [
  { key: "home", path: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { key: "markets", path: "/markets", icon: BarChart3, label: "Markets" },
  { key: "learn", path: "/energy-literacy", icon: BookOpen, label: "Learn" },
  { key: "protect", path: "/investor-protection", icon: ShieldAlert, label: "Protect" },
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

export default function BottomTabBar({ onMorePress, onTabPress, activeTab }) {
  const location = useLocation();
  const [calcOpen, setCalcOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const isCalcActive = calcPaths.some(p => location.pathname === p);

  const handleTabPress = (tab) => {
    setCalcOpen(false);
    if (onTabPress) onTabPress(tab.key);
  };

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border"
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
              className={`flex items-center gap-2.5 px-3.5 min-h-[48px] bg-card transition-colors active:bg-muted ${
                isActive(path) ? "text-primary dark:text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[13px] font-medium">{label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabPress(tab)}
              className={`flex flex-col items-center justify-center gap-[3px] min-h-[50px] transition-colors active:scale-95 ${
                active ? "text-primary dark:text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Calculators toggle */}
        <button
          onClick={() => setCalcOpen(!calcOpen)}
          className={`flex flex-col items-center justify-center gap-[3px] min-h-[50px] transition-colors active:scale-95 ${
            isCalcActive || calcOpen ? "text-primary dark:text-accent" : "text-muted-foreground"
          }`}
        >
          <Calculator className="w-[22px] h-[22px]" strokeWidth={isCalcActive ? 2.2 : 1.8} />
          <span className={`text-[10px] leading-none ${isCalcActive ? "font-semibold" : "font-medium"}`}>Calc</span>
        </button>

        {/* More */}
        <button
          onClick={() => { setCalcOpen(false); onMorePress(); }}
          className="flex flex-col items-center justify-center gap-[3px] min-h-[50px] text-muted-foreground transition-colors active:scale-95"
        >
          <Menu className="w-[22px] h-[22px]" strokeWidth={1.8} />
          <span className="text-[10px] leading-none font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}

export { CALC_ITEMS };