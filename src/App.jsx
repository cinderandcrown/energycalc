import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NetInvestment from './pages/calc/NetInvestment';
import BarrelsToCash from './pages/calc/BarrelsToCash';
import NatGasToCash from './pages/calc/NatGasToCash';
import RateOfReturn from './pages/calc/RateOfReturn';
import Scenarios from './pages/Scenarios';
import Learn from './pages/Learn';
import Settings from './pages/Settings';
import Markets from './pages/Markets';
import InvestorProtection from './pages/InvestorProtection';
import Legal from './pages/Legal';

const AuthenticatedApp = () => {
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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/calc/net-investment" element={<NetInvestment />} />
        <Route path="/calc/barrels-to-cash" element={<BarrelsToCash />} />
        <Route path="/calc/natgas-to-cash" element={<NatGasToCash />} />
        <Route path="/calc/rate-of-return" element={<RateOfReturn />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/investor-protection" element={<InvestorProtection />} />
        <Route path="/legal" element={<Legal />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App