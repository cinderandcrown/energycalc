import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Markets from '@/pages/Markets.jsx';
import MarketIntelligence from '@/pages/MarketIntelligence';
import Portfolio from '@/pages/Portfolio';
import InvestorProtection from '@/pages/InvestorProtection';
import RegDGuide from '@/pages/RegDGuide';
import HonestGuide from '@/pages/HonestGuide';
import OperatorScreener from '@/pages/OperatorScreener';
import TaxStrategies from '@/pages/TaxStrategies';
import Scenarios from '@/pages/Scenarios';
import Web3Energy from '@/pages/Web3Energy';
import Learn from '@/pages/Learn';
import Settings from '@/pages/Settings';
import Legal from '@/pages/Legal';
import Compare from '@/pages/Compare';
import NetInvestment from '@/pages/calc/NetInvestment';
import BarrelsToCash from '@/pages/calc/BarrelsToCash';
import NatGasToCash from '@/pages/calc/NatGasToCash';
import RateOfReturn from '@/pages/calc/RateOfReturn';
import TaxImpact from '@/pages/calc/TaxImpact';
import GoldPurityCalc from '@/pages/calc/GoldPurityCalc';
import AgYieldCalc from '@/pages/calc/AgYieldCalc';
import MetalCostBasis from '@/pages/calc/MetalCostBasis';
import MyAccount from '@/pages/MyAccount';
import NewsFeedPage from '@/pages/NewsFeed.jsx';
import SEODashboard from '@/pages/SEODashboard.jsx';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard.jsx';

// Layout
import Layout from '@/components/Layout';
import SubscriptionGate from '@/components/SubscriptionGate';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Landing />} />
      <Route path="/legal" element={<Legal />} />

      {/* Authenticated pages with Layout */}
      <Route element={<Layout />}>
        {/* Settings & Account — always accessible when logged in */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<MyAccount />} />

        {/* Subscription-gated pages */}
        <Route element={<SubscriptionGate />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/intelligence" element={<MarketIntelligence />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/investor-protection" element={<InvestorProtection />} />
          <Route path="/reg-d" element={<RegDGuide />} />
          <Route path="/honest-guide" element={<HonestGuide />} />
          <Route path="/operator-screener" element={<OperatorScreener />} />
          <Route path="/tax-strategies" element={<TaxStrategies />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/web3" element={<Web3Energy />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/news" element={<NewsFeedPage />} />
          <Route path="/seo" element={<SEODashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />

          {/* Calculators */}
          <Route path="/calc/net-investment" element={<NetInvestment />} />
          <Route path="/calc/barrels-to-cash" element={<BarrelsToCash />} />
          <Route path="/calc/natgas-to-cash" element={<NatGasToCash />} />
          <Route path="/calc/rate-of-return" element={<RateOfReturn />} />
          <Route path="/calc/tax-impact" element={<TaxImpact />} />
          <Route path="/calc/gold-purity" element={<GoldPurityCalc />} />
          <Route path="/calc/ag-yield" element={<AgYieldCalc />} />
          <Route path="/calc/metal-cost" element={<MetalCostBasis />} />
        </Route>
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