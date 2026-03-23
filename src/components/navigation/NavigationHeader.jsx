import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";
import useRouteDepth from "@/hooks/useRouteDepth";

/**
 * Global header with back button logic based on route depth.
 * Shows back arrow on sub-pages (depth >= 2 or non-root tabs).
 */
export default function NavigationHeader({ onMenuToggle, menuOpen, desktopNav }) {
  const navigate = useNavigate();
  const { showBack } = useRouteDepth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md oil-shimmer">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile back button — only when on a sub-page */}
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center -ml-1 active:scale-95 transition-transform text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png"
              alt="EnergyCalc Pro"
              className="w-8 h-8 rounded-lg shrink-0 object-contain"
            />
            <div className="leading-none">
              <span className="font-bold text-sm tracking-tight">
                <span className="text-primary dark:text-accent">Energy</span>
                <span className="text-foreground">Calc</span>
              </span>
              <span className="hidden sm:block text-[9px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">
                Pro · Commodity Energy Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav (passed in) */}
        {desktopNav}

        {/* Tablet hamburger (sm to lg) */}
        <button
          onClick={onMenuToggle}
          className="hidden sm:flex lg:hidden items-center justify-center w-11 h-11 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}