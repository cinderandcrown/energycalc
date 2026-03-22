import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, BookOpen, FolderOpen, Settings, BarChart3, ShieldAlert } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/markets', icon: BarChart3, label: 'Markets' },
  { path: '/calc/net-investment', icon: Calculator, label: 'Calculators' },
  { path: '/investor-protection', icon: ShieldAlert, label: 'Protect' },
  { path: '/scenarios', icon: FolderOpen, label: 'Scenarios' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const calcPaths = ['/calc/net-investment', '/calc/barrels-to-cash', '/calc/natgas-to-cash', '/calc/rate-of-return'];

export default function Layout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('energycalc-theme');
    const isDark = saved ? saved === 'dark' : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const isActive = (path) => {
    if (path === '/calc/net-investment') {
      return calcPaths.some(p => location.pathname === p);
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-[#1a3a6b] border border-crude-gold/30 flex items-center justify-center shrink-0">
              <span className="text-crude-gold text-sm font-bold leading-none">⚡</span>
            </div>
            <div className="leading-none">
              <span className="font-bold text-sm tracking-tight">
                <span className="text-primary dark:text-accent">Energy</span><span className="text-foreground">Calc</span>
              </span>
              <span className="block text-[9px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">Pro · Oil &amp; Gas Intelligence</span>
            </div>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
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
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="grid grid-cols-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive(path)
                  ? 'text-primary dark:text-accent'
                  : 'text-muted-foreground'
              }`}
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