import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Shield, Search, BarChart3, Newspaper, Users, Megaphone,
  TrendingUp, Eye, FileText, Activity
} from 'lucide-react';

const quickLinks = [
  { path: '/admin/seo', icon: Search, label: 'SEO Keywords', desc: 'Search Console rankings & opportunities', color: 'from-blue-500 to-purple-600' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', desc: 'Google Analytics conversion tracking', color: 'from-green-500 to-emerald-600' },
  { path: '/admin/news', icon: Newspaper, label: 'News Feed', desc: 'Curate commodity news & alerts', color: 'from-orange-500 to-red-500' },
  { path: '/admin/marketing', icon: Megaphone, label: 'Marketing', desc: 'AI-generated marketing content', color: 'from-pink-500 to-rose-600' },
  { path: '/admin/users', icon: Users, label: 'Users', desc: 'Manage app users & roles', color: 'from-cyan-500 to-blue-600' },
];

export default function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, news: 0, marketing: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.User.list('-created_date', 1).then(r => r.length),
      base44.entities.CommodityNews.list('-created_date', 1).then(r => r.length),
      base44.entities.MarketingContent.list('-created_date', 1).then(r => r.length),
    ]).then(([users, news, marketing]) => {
      setStats({ users, news, marketing });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Manage SEO, analytics, content, and users</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Users', value: stats.users, icon: Users, color: 'text-blue-500' },
          { label: 'News Articles', value: stats.news, icon: Newspaper, color: 'text-orange-500' },
          { label: 'Marketing Items', value: stats.marketing, icon: Megaphone, color: 'text-pink-500' },
          { label: 'Status', value: 'Active', icon: Activity, color: 'text-drill-green' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{loading ? '—' : s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(({ path, icon: Icon, label, desc, color }) => (
            <Link
              key={path}
              to={path}
              className="group rounded-xl border border-border bg-card p-4 hover:border-crude-gold/40 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">{label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-[10px] text-muted-foreground text-center">
          Admin portal is only accessible to users with the <strong>admin</strong> role. All actions are logged.
        </p>
      </div>
    </div>
  );
}