import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldAlert } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function AdminGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Access Restricted</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          This area is for administrators only. If you believe you should have access, contact your account administrator.
        </p>
      </div>
    );
  }

  return <Outlet />;
}