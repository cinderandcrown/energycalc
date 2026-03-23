import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, RefreshCw, Globe, BarChart3, Sparkles, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordTable from '@/components/seo/KeywordTable';
import SEOMetricCards from '@/components/seo/SEOMetricCards';
import SEOTrendChart from '@/components/seo/SEOTrendChart';
import SEOPositionChart from '@/components/seo/SEOPositionChart';
import SEOOpportunities from '@/components/seo/SEOOpportunities';

export default function SEODashboard() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [days, setDays] = useState(28);
  const [dimension, setDimension] = useState('query');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [oppsData, setOppsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingSites(true);
    base44.functions.invoke('fetchSearchConsole', {}).then(res => {
      const siteList = res.data?.sites || [];
      setSites(siteList);
      if (siteList.length > 0) setSelectedSite(siteList[0].siteUrl);
      setLoadingSites(false);
    }).catch(() => setLoadingSites(false));
  }, []);

  useEffect(() => {
    if (!selectedSite) return;
    fetchAllData();
  }, [selectedSite, days]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      base44.functions.invoke('fetchSearchConsole', { siteUrl: selectedSite, days, rowLimit: 200, dimension: 'query' }),
      base44.functions.invoke('fetchSearchConsole', { siteUrl: selectedSite, days, action: 'trend' }),
      base44.functions.invoke('fetchSearchConsole', { siteUrl: selectedSite, days, action: 'opportunities' }),
    ]);
    if (results[0].status === 'fulfilled') setData(results[0].value.data);
    else setError('Unable to fetch keyword data. Make sure this site is verified in Google Search Console.');
    if (results[1].status === 'fulfilled') setTrendData(results[1].value.data);
    if (results[2].status === 'fulfilled') setOppsData(results[2].value.data);
    setLoading(false);
  };

  const fetchDimensionData = async (dim) => {
    setDimension(dim);
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('fetchSearchConsole', { siteUrl: selectedSite, days, rowLimit: 200, dimension: dim });
      setData(res.data);
    } catch {
      setError('Unable to fetch data. Check site verification in Google Search Console.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Search className="w-4.5 h-4.5 text-white" />
            </div>
            SEO Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Google Search Console · Keywords, trends, opportunities & rankings intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] gap-1">
            <Sparkles className="w-3 h-3" />
            {data?.rows?.length || 0} keywords tracked
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading || !selectedSite} className="gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center rounded-xl border border-border bg-card/50 p-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedSite} onValueChange={setSelectedSite} disabled={loadingSites}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder={loadingSites ? 'Loading sites...' : 'Select site'} />
            </SelectTrigger>
            <SelectContent>
              {sites.map(s => (
                <SelectItem key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={String(days)} onValueChange={v => setDays(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="28">Last 28 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview" className="text-xs gap-1"><BarChart3 className="w-3 h-3" />Overview</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-xs gap-1"><Target className="w-3 h-3" />Opportunities</TabsTrigger>
              <TabsTrigger value="explorer" className="text-xs gap-1"><Search className="w-3 h-3" />Explorer</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Fetching search intelligence...</p>
          </div>
        </div>
      )}

      {/* No sites */}
      {!loadingSites && sites.length === 0 && !loading && (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No Sites Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No verified sites in your Google Search Console. Make sure your site is verified and you have access.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-xl border border-flare-red/30 bg-flare-red/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-flare-red shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Permission Error</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-accent underline">Google Search Console</a> and verify this site with the connected Google account.
            </p>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && data && !loading && (
        <>
          <SEOMetricCards rows={data.rows || []} startDate={data.startDate} endDate={data.endDate} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SEOTrendChart data={trendData?.rows} />
            <SEOPositionChart rows={data.rows || []} />
          </div>
          <KeywordTable rows={data.rows || []} dimension="query" />
        </>
      )}

      {/* OPPORTUNITIES TAB */}
      {activeTab === 'opportunities' && oppsData && !loading && (
        <>
          <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-crude-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">SEO Growth Opportunities</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Keywords where you already rank but could rank higher. <strong>Quick Wins</strong> are positions 4–15 with high impressions — a content refresh could push you to the top.
                <strong> Untapped Opportunities</strong> are page 2+ keywords with massive impression volume waiting to be unlocked.
              </p>
            </div>
          </div>
          <SEOOpportunities
            opportunities={oppsData.opportunities || []}
            quickWins={oppsData.quickWins || []}
            topPerformers={oppsData.topPerformers || []}
          />
        </>
      )}

      {/* EXPLORER TAB */}
      {activeTab === 'explorer' && !loading && (
        <>
          <div className="flex gap-2 flex-wrap">
            {['query', 'page', 'country', 'device'].map(d => (
              <Button
                key={d}
                variant={dimension === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => fetchDimensionData(d)}
                className="text-xs capitalize"
              >
                {d === 'query' ? 'Keywords' : d === 'page' ? 'Pages' : d === 'country' ? 'Countries' : 'Devices'}
              </Button>
            ))}
          </div>
          {data && <KeywordTable rows={data.rows || []} dimension={dimension} />}
        </>
      )}

      {/* Footer */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2.5">
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Data from Google Search Console. Positions are averages — actual rankings vary by location, device, and personalization. 
          Use opportunities to prioritize content optimization. Data may have a 2–3 day delay.
        </p>
      </div>
    </div>
  );
}