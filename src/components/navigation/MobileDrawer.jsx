import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, Newspaper, BookOpen, Activity, PieChart,
  ShieldAlert, Globe, FileText, Scale, Search, Landmark, FolderOpen,
  Blocks, UserCircle, Settings, Shield, Calculator, X
} from "lucide-react";
import { CALC_ITEMS } from "./BottomTabBar";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/markets", icon: BarChart3, label: "Markets" },
  { path: "/news", icon: Newspaper, label: "News" },
  { path: "/energy-literacy", icon: BookOpen, label: "Literacy" },
  { path: "/intelligence", icon: Activity, label: "Intelligence" },
  { path: "/portfolio", icon: PieChart, label: "Portfolio" },
  { path: "/investor-protection", icon: ShieldAlert, label: "Protect" },
  { path: "/blog", icon: Globe, label: "Blog" },
  { path: "/reg-d", icon: FileText, label: "Reg D Guide" },
  { path: "/honest-guide", icon: Scale, label: "Honest Guide" },
  { path: "/operator-screener", icon: Search, label: "Vet Operator" },
  { path: "/tax-strategies", icon: Landmark, label: "Tax Strategies" },
  { path: "/scenarios", icon: FolderOpen, label: "Scenarios" },
  { path: "/web3", icon: Blocks, label: "Web3" },
  { path: "/learn", icon: BookOpen, label: "Learn" },
  { path: "/account", icon: UserCircle, label: "My Account" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function MobileDrawer({ open, onClose, isAdmin }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={onClose}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 w-72 flex flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <span className="font-bold text-sm text-foreground">Menu</span>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <div
          className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5"
          style={{ overscrollBehavior: "contain" }}
        >
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? "bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {/* Admin */}
          {isAdmin && (
            <div className="pt-2 border-t border-border mt-2">
              <Link
                to="/admin"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            </div>
          )}

          {/* Calculators */}
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold px-3 mb-1">
              Calculators
            </p>
            {CALC_ITEMS.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm transition-colors ${
                  isActive(path)
                    ? "text-primary dark:text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-border px-4 py-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <Link
            to="/legal"
            onClick={onClose}
            className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 block"
          >
            Legal & Privacy
          </Link>
        </div>
      </div>
    </>
  );
}