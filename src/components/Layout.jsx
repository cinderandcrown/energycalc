import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calculator, BookOpen, FolderOpen, Settings, BarChart3, ShieldAlert, ChevronDown, TrendingUp, Flame, BarChart2, Percent, Search, Landmark, PieChart, Blocks, Menu, X, Scale, Activity, FileText, Gem, Wheat, Factory, UserCircle, Newspaper, Globe, Shield, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SiteDisclaimer from './SiteDisclaimer';
import OilPourTransition from './OilPourTransition';
import TrialBanner from './TrialBanner';
import DashboardAdSidebar from './ads/DashboardAdSidebar';

const calcItems = [
  { path: '/calc/net-investment', icon: TrendingUp, label: 'Net Investment', desc: 'Tax savings & IDC' },
  { path: '/calc/barrels-to-cash', icon: BarChart2, label: 'Barrels to Cash', desc: 'Oil production revenue' },
  { path: '/calc/natgas-to-cash', icon: Flame, label: 'Nat Gas to Cash', desc: 'Gas & NGL income' },
  { path: '/calc/rate-of-return', icon: Percent, label: 'Rate of Return', desc: 'IRR & payout analysis' },
  { path: '/calc/tax-impact', icon: Calculator, label: 'Tax Impact', desc: '5-year multi-investment tax model' },
  { path: '/calc/gold-purity', icon: Gem, label: 'Gold Purity', desc: 'Karat, weight & spot value' },
  { path: '/calc/ag-yield', icon: Wheat, label: 'Ag Yield', desc: 'Crop revenue projections' },
  { path: '/calc/metal-cost', icon: Factory, label: 'Metal Cost', desc: 'Industrial metal cost-basis' },
];

const primaryNav = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/markets', icon: BarChart3, label: 'Markets' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/energy-literacy', icon: BookOpen, label: 'Literacy' },
  { path: '/intelligence', icon: Activity, label: 'Intelligence' },
  { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { path: '/investor-protection', icon: ShieldAlert, label: 'Protect' },
];

const moreNav = [
  { path: '/blog', icon: Globe, label: 'Blog' },
  { path: '/reg-d', icon: FileText, label: 'Reg D Guide' },
  { path: '/honest-guide', icon: Scale, label: 'Honest Guide' },
  { path: '/operator-screener', icon: Search, label: 'Vet Operator' },
  { path: '/tax-strategies', icon: Landmark, label: 'Tax Strategies' },
  { path: '/scenarios', icon: FolderOpen, label: 'Scenarios' },
  { path: '/web3', icon: Blocks, label: 'Web3' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/account', icon: UserCircle, label: 'My Account' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const navItems = [...primaryNav, ...moreNav];

const calcPaths = calcItems.map(c => c.path);

function MoreDropdown({ isMoreActive, location }) {
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
          isMoreActive
            ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <Menu className="w-4 h-4" />
        More
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-52 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 py-1">
          {moreNav.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                location.pathname === path
                  ? 'text-primary dark:text-accent font-medium bg-primary/5 dark:bg-accent/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCalcOpen, setDrawerCalcOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Show back button on mobile for sub-pages
  const isSubPage = location.pathname !== '/dashboard';

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('energycalc-theme');
    const isDark = saved ? saved === 'dark' : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setMobileCalcOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isCalcActive = calcPaths.some(p => location.pathname === p);

  // Primary mobile tabs (5 most important for small screens)
  const mobileTabItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/markets', icon: BarChart3, label: 'Markets' },
    { path: '/energy-literacy', icon: BookOpen, label: 'Learn' },
    { path: '/investor-protection', icon: ShieldAlert, label: 'Protect' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Site-wide Legal Disclaimer Banner */}
      <SiteDisclaimer />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md oil-shimmer">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile back button */}
            {isSubPage && (
              <button
                onClick={() => navigate(-1)}
                className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center -ml-1 active:scale-95 transition-transform text-foreground"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/718e5ab07_EnergyCalc2.png" alt="EnergyCalc Pro" className="w-8 h-8 rounded-lg shrink-0 object-contain" />
              <div className="leading-none">
                <span className="font-bold text-sm tracking-tight">
                  <span className="text-primary dark:text-accent">Energy</span><span className="text-foreground">Calc</span>
                </span>
                <span className="hidden sm:block text-[9px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">Pro · Commodity Energy Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav (lg and up) */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNav.map(({ path, icon: Icon, label }) => (
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

            <CalcDropdown isCalcActive={isCalcActive} />

            <MoreDropdown
              isMoreActive={moreNav.some(n => location.pathname === n.path)}
              location={location}
            />

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Tablet hamburger (sm to lg) */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="hidden sm:flex lg:hidden items-center justify-center w-11 h-11 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Tablet Drawer Overlay */}
      {drawerOpen && (
        <div className="hidden sm:block lg:hidden fixed inset-0 z-40" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Tablet Slide-out Drawer */}
      <div className={`hidden sm:flex lg:hidden fixed top-14 right-0 bottom-0 z-40 w-72 flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Main nav items */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Dashboard
          </Link>
          <Link
            to="/markets"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/markets')
                ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <BarChart3 className="w-4.5 h-4.5" />
            Markets
          </Link>

          {/* Calculators expandable */}
          <div>
            <button
              onClick={() => setDrawerCalcOpen(!drawerCalcOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isCalcActive
                  ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Calculator className="w-4.5 h-4.5" />
              <span className="flex-1 text-left">Calculators</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${drawerCalcOpen ? 'rotate-180' : ''}`} />
            </button>
            {drawerCalcOpen && (
              <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                {calcItems.map(({ path, icon: Icon, label, desc }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(path)
                        ? 'text-primary dark:text-accent font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-sm leading-tight">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Remaining nav */}
          {navItems.slice(2).map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="border-t border-border px-4 py-3 space-y-1">
          <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 block">Legal & Privacy</Link>
          <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} EnergyCalc Pro</p>
        </div>
      </div>

      {/* Trial Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-2">
        <TrialBanner />
      </div>

      {/* Main Content + Ad Sidebar */}
      <main className="flex-1 sm:pb-0" style={{ overscrollBehavior: 'none', paddingBottom: 'calc(70px + env(safe-area-inset-bottom, 0px))' }}>
        {/* On sm+ the bottom nav is hidden, so override the padding */}
        <style>{`@media (min-width: 640px) { main { padding-bottom: 0 !important; } }`}</style>
        <div className="flex">
          <div className="flex-1 min-w-0">
            <OilPourTransition>
              <Outlet />
            </OilPourTransition>
          </div>
          {/* Ad sidebar — visible on xl screens only */}
          <aside className="hidden xl:block w-[280px] shrink-0 p-4 border-l border-border">
            <div className="sticky top-20">
              <DashboardAdSidebar />
            </div>
          </aside>
        </div>
      </main>

      {/* Desktop/Tablet Legal Footer */}
      <footer className="hidden sm:block border-t border-border bg-card/50 py-2 px-4" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} EnergyCalc Pro. Not a registered broker-dealer or investment advisor. All calculations are illustrative only. Covers oil, gas, solar, wind, uranium &amp; other commodity energy sectors. Not affiliated with FINRA, SEC, or any regulatory body.
            </p>
            <div className="flex items-center gap-3">
              <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Legal & Privacy</Link>
              <Link to="/investor-protection" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2">Investor Protection</Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <a href="https://cinderandcrown.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
              <img src="https://media.base44.com/images/public/69bf62b5c080418b742197f7/177a83ee6_CinderCrown-MuteLogo.png" alt="Cinder & Crown" className="w-4 h-4 object-contain" />
              <span className="text-[9px] text-muted-foreground">Built by <strong className="text-foreground/60">Cinder &amp; Crown</strong></span>
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav (phones only, < sm/640px) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {/* Mobile Calc Sub-menu */}
        {mobileCalcOpen && (
          <div className="border-b border-border bg-card grid grid-cols-2 gap-px bg-border">
            {calcItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileCalcOpen(false)}
                className={`flex items-center gap-2 px-3 min-h-[44px] bg-card transition-colors ${
                  isActive(path) ? 'text-primary dark:text-accent' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-6">
          {/* Primary tabs */}
          {mobileTabItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs transition-colors ${isActive(path) ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          ))}
          {/* Calculators toggle */}
          <button
            onClick={() => setMobileCalcOpen(!mobileCalcOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs transition-colors ${isCalcActive || mobileCalcOpen ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px]">Calc</span>
          </button>
          {/* More menu - opens drawer on phone */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] text-xs transition-colors ${drawerOpen ? 'text-primary dark:text-accent' : 'text-muted-foreground'}`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      {/* Phone drawer (reuse same drawer for "More" on phones) */}
      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-40" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}
      <div className={`sm:hidden fixed top-0 right-0 bottom-0 z-40 w-72 flex flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <span className="font-bold text-sm text-foreground">Menu</span>
          <button onClick={() => setDrawerOpen(false)} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" style={{ overscrollBehavior: 'contain' }}>
          {[{ path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }, { path: '/markets', icon: BarChart3, label: 'Markets' }, ...navItems.slice(2)].map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </Link>
          ))}
          {/* Admin */}
          {isAdmin && (
            <div className="pt-2 border-t border-border mt-2">
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Shield className="w-4.5 h-4.5" />
                Admin Portal
              </Link>
            </div>
          )}

          {/* Calculators */}
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold px-3 mb-1">Calculators</p>
            {calcItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm transition-colors ${
                  isActive(path) ? 'text-primary dark:text-accent font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-border px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
          <Link to="/legal" className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 block">Legal & Privacy</Link>
        </div>
      </div>
    </div>
  );
}