import { Link } from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";

/**
 * Global iOS-style header with safe-area-inset-top support.
 * Shows a native-feeling back button when canGoBack is true.
 * Uses consistent SF-style typography and spacing.
 */
export default function NavigationHeader({ onMenuToggle, menuOpen, desktopNav, canGoBack, onGoBack }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border/80 bg-card/80 backdrop-blur-xl backdrop-saturate-150"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-[50px] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* Mobile back button — iOS style with chevron */}
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="sm:hidden flex items-center gap-0.5 -ml-2 px-1.5 min-h-[44px] min-w-[44px] active:opacity-60 transition-opacity"
              aria-label="Go back"
            >
              <ArrowLeft className="w-[22px] h-[22px] text-primary dark:text-accent" strokeWidth={2.2} />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png"
              alt="Commodity Investor+"
              className="w-8 h-8 rounded-lg shrink-0 object-contain"
            />
            <div className="leading-none">
              <span className="font-semibold text-[15px] tracking-tight">
                <span className="text-primary dark:text-accent">Commodity</span>
                <span className="text-foreground"> Investor</span><span className="text-crude-gold">+</span>
              </span>
              <span className="hidden sm:block text-[9px] text-muted-foreground font-medium uppercase tracking-[0.08em] -mt-0.5">
              Commodity Market Intelligence
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