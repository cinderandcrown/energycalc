import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, BookOpen, FolderOpen, Settings, BarChart3, ShieldAlert, ChevronDown, TrendingUp, Flame, BarChart2, Percent, Search, Landmark, PieChart, Blocks } from 'lucide-react';
import SiteDisclaimer from './SiteDisclaimer';
import OilPourTransition from './OilPourTransition';

const calcItems = [
  { path: '/calc/net-investment', icon: TrendingUp, label: 'Net Investment', desc: 'Tax savings & IDC' },
  { path: '/calc/barrels-to-cash', icon: BarChart2, label: 'Barrels to Cash', desc: 'Oil production revenue' },
  { path: '/calc/natgas-to-cash', icon: Flame, label: 'Nat Gas to Cash', desc: 'Gas & NGL income' },
  { path: '/calc/rate-of-return', icon: Percent, label: 'Rate of Return', desc: 'IRR & payout analysis' },
];

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/markets', icon: BarChart3, label: 'Markets' },
  { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { path: '/investor-protection', icon: ShieldAlert, label: 'Protect' },
  { path: '/operator-screener', icon: Search, label: 'Vet' },
  { path: '/tax-strategies', icon: Landmark, label: 'Tax' },
  { path: '/scenarios', icon: FolderOpen, label: 'Scenarios' },
  { path: '/web3', icon: Blocks, label: 'Web3' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const calcPaths = calcItems.map(c => c.path);

function CalcDropdown({ isCalcActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          isCalcActive
            ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Calculator className="w-4 h-4" />
        Calculators
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {calcItems.map(({ path, icon: Icon, label, desc }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-3 py-2.5 hover:bg-crude-gold/5 dark:hover:bg-crude-gold/10 transition-all duration-200 group"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center mt-0.5 shrink-0 group-hover:bg-crude-gold/20 transition-colors">
                <Icon className="w-3.5 h-3.5 text-primary dark:text-accent group-hover:text-crude-gold transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('energycalc-theme');
    const isDark = saved ? saved === 'dark' : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isCalcActive = calcPaths.some(p => location.pathname === p);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Site-wide Legal Disclaimer Banner */}
      <SiteDisclaimer />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md oil-shimmer">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png" alt="EnergyCalc Pro" className="w-8 h-8 rounded-lg shrink-0 object-contain" />
            <div className="leading-none">
              <span className="font-bold text-sm tracking-tight">
                <span className="text-primary dark:text-accent">Energy</span><span className="text-foreground">Calc</span>
              </span>
              <span className="block text-[9px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">Pro · Commodity Energy Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/markets"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/markets')
                  ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Markets
            </Link>

            <CalcDropdown isCalcActive={isCalcActive} />

            {navItems.slice(2).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <OilPourTransition>
          <Outlet />
        </OilPourTransition>
      </main>

      {/* Desktop Legal Footer */}
      <footer className="hidden md:block border-t border-border bg-card/50 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} EnergyCalc Pro. Not a registered broker-dealer or investment advisor. All calculations are illustrative only. Covers oil, gas, solar, wind, uranium &amp; other commodity energy sectors. Not affiliated with FINRA, SEC, or any regulatory body.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Legal & Privacy</Link>
            <Link to="/investor-protection" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Investor Protection</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        {/* Mobile Calc Sub-menu */}
        {mobileCalcOpen && (
          <div className="border-b border-border bg-card grid grid-cols-2 gap-px bg-border">
            {calcItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileCalcOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 bg-card transition-colors ${
                  isActive(path) ? 'text-primary dark:text-accent' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-10">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${isActive('/dashboard') ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          {/* Markets */}
          <Link
            to="/markets"
            className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${isActive('/markets') ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">Markets</span>
          </Link>
          {/* Calculators toggle */}
          <button
            onClick={() => setMobileCalcOpen(!mobileCalcOpen)}
            className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${isCalcActive || mobileCalcOpen ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px]">Calc</span>
          </button>
          {/* Rest */}
          {navItems.slice(2).map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-all duration-200 ${isActive(path) ? 'text-primary dark:text-accent scale-105' : 'text-muted-foreground active:scale-95'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}