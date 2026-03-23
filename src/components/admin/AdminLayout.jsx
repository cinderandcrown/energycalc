import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, BarChart3, Newspaper, Globe, Settings,
  ChevronLeft, Menu, X, Shield, Users, FileText, Megaphone
} from 'lucide-react';

const adminNav = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { path: '/admin/seo', icon: Search, label: 'SEO Keywords' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/news', icon: Newspaper, label: 'News Feed' },
  { path: '/admin/marketing', icon: Megaphone, label: 'Marketing Content' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const NavItems = () => (
    <>
      {adminNav.map(({ path, icon: Icon, label, exact }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive(path, exact)
              ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          } ${collapsed ? 'justify-center' : ''}`}
        >
          <Icon className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-card/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-4 border-b border-border`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary dark:text-accent" />
              </div>
              <span className="text-sm font-bold text-foreground">Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          <NavItems />
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {!collapsed && 'Back to App'}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-14 left-0 right-0 z-30 bg-card border-b border-border px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary dark:text-accent" />
          <span className="text-sm font-bold text-foreground">Admin Portal</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed top-[6.5rem] right-0 bottom-0 z-20 w-64 bg-card border-l border-border transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="p-3 space-y-0.5">
          <NavItems />
        </nav>
        <div className="p-3 border-t border-border">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to App
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-12">
        <Outlet />
      </main>
    </div>
  );
}