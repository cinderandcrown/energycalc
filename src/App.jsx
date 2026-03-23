import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import CookieConsent from '@/components/CookieConsent';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Lazy-loaded page imports
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Markets = lazy(() => import('@/pages/Markets.jsx'));
const MarketIntelligence = lazy(() => import('@/pages/MarketIntelligence'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const InvestorProtection = lazy(() => import('@/pages/InvestorProtection'));
const RegDGuide = lazy(() => import('@/pages/RegDGuide'));
const HonestGuide = lazy(() => import('@/pages/HonestGuide'));
const OperatorScreener = lazy(() => import('@/pages/OperatorScreener'));
const TaxStrategies = lazy(() => import('@/pages/TaxStrategies'));
const Scenarios = lazy(() => import('@/pages/Scenarios'));
const Web3Energy = lazy(() => import('@/pages/Web3Energy'));
const Learn = lazy(() => import('@/pages/Learn'));
const EnergyLiteracy = lazy(() => import('@/pages/EnergyLiteracy'));
const Settings = lazy(() => import('@/pages/Settings'));
const Legal = lazy(() => import('@/pages/Legal'));
const Compare = lazy(() => import('@/pages/Compare'));
const NetInvestment = lazy(() => import('@/pages/calc/NetInvestment'));
const BarrelsToCash = lazy(() => import('@/pages/calc/BarrelsToCash'));
const NatGasToCash = lazy(() => import('@/pages/calc/NatGasToCash'));
const RateOfReturn = lazy(() => import('@/pages/calc/RateOfReturn'));
const TaxImpact = lazy(() => import('@/pages/calc/TaxImpact'));
const GoldPurityCalc = lazy(() => import('@/pages/calc/GoldPurityCalc'));
const AgYieldCalc = lazy(() => import('@/pages/calc/AgYieldCalc'));
const MetalCostBasis = lazy(() => import('@/pages/calc/MetalCostBasis'));
const LivestockCalc = lazy(() => import('@/pages/calc/LivestockCalc'));
const MyAccount = lazy(() => import('@/pages/MyAccount'));
const NewsFeedPage = lazy(() => import('@/pages/NewsFeed.jsx'));
const SEODashboard = lazy(() => import('@/pages/SEODashboard.jsx'));
const AnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard.jsx'));
const Blog = lazy(() => import('@/pages/Blog.jsx'));
const BlogPostPage = lazy(() => import('@/pages/BlogPost.jsx'));
const BigQueryExplorer = lazy(() => import('@/pages/BigQueryExplorer.jsx'));
const Support = lazy(() => import('@/pages/Support.jsx'));

// Admin (lazy)
const AdminGuard = lazy(() => import('@/components/admin/AdminGuard'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminMarketing = lazy(() => import('@/pages/admin/AdminMarketing'));

// Layout (not lazy — wraps all authenticated routes)
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

  // Suspense fallback for lazy-loaded pages
  const PageSpinner = (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );

  // Render the main app
  return (
    <Suspense fallback={PageSpinner}>
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

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
          <Route path="/energy-literacy" element={<EnergyLiteracy />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/news" element={<NewsFeedPage />} />
          <Route path="/bigquery" element={<BigQueryExplorer />} />
          <Route path="/support" element={<Support />} />

          {/* Calculators */}
          <Route path="/calc/net-investment" element={<NetInvestment />} />
          <Route path="/calc/barrels-to-cash" element={<BarrelsToCash />} />
          <Route path="/calc/natgas-to-cash" element={<NatGasToCash />} />
          <Route path="/calc/rate-of-return" element={<RateOfReturn />} />
          <Route path="/calc/tax-impact" element={<TaxImpact />} />
          <Route path="/calc/gold-purity" element={<GoldPurityCalc />} />
          <Route path="/calc/ag-yield" element={<AgYieldCalc />} />
          <Route path="/calc/metal-cost" element={<MetalCostBasis />} />
          <Route path="/calc/livestock" element={<LivestockCalc />} />
        </Route>
      </Route>

      {/* Admin Portal */}
      <Route element={<Layout />}>
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/seo" element={<SEODashboard />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/news" element={<NewsFeedPage />} />
            <Route path="/admin/marketing" element={<AdminMarketing />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <CookieConsent />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App