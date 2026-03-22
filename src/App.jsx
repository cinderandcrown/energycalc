import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';

// Public pages (no auth required)
import Landing from './pages/Landing';
import Legal from './pages/Legal';

// Protected pages
import Dashboard from './pages/Dashboard';
import NetInvestment from './pages/calc/NetInvestment';
import BarrelsToCash from './pages/calc/BarrelsToCash';
import NatGasToCash from './pages/calc/NatGasToCash';
import RateOfReturn from './pages/calc/RateOfReturn';
import Scenarios from './pages/Scenarios';
import Compare from './pages/Compare';
import Learn from './pages/Learn';
import Settings from './pages/Settings';
import Markets from './pages/Markets';
import InvestorProtection from './pages/InvestorProtection';

const ProtectedRoutes = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-muted border-t-primary dark:border-t-accent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-medium">Loading EnergyCalc Pro...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Layout />
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* Public routes - no auth needed */}
            <Route path="/" element={<Landing />} />
            <Route path="/legal" element={<Legal />} />

            {/* Protected routes - wrapped in auth + layout */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/calc/net-investment" element={<NetInvestment />} />
              <Route path="/calc/barrels-to-cash" element={<BarrelsToCash />} />
              <Route path="/calc/natgas-to-cash" element={<NatGasToCash />} />
              <Route path="/calc/rate-of-return" element={<RateOfReturn />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/investor-protection" element={<InvestorProtection />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App