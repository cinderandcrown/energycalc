import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, TrendingUp, MousePointer, Eye, ArrowUpDown, RefreshCw, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KeywordTable from '@/components/seo/KeywordTable';
import SEOMetricCards from '@/components/seo/SEOMetricCards';

export default function SEODashboard() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [days, setDays] = useState(28);
  const [dimension, setDimension] = useState('query');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);

  // Fetch available sites on mount
  useEffect(() => {
    setLoadingSites(true);
    base44.functions.invoke('fetchSearchConsole', {}).then(res => {
      const siteList = res.data?.sites || [];
      setSites(siteList);
      if (siteList.length > 0) {
        setSelectedSite(siteList[0].siteUrl);
      }
      setLoadingSites(false);
    }).catch(() => setLoadingSites(false));
  }, []);

  // Fetch data when site/days/dimension changes
  useEffect(() => {
    if (!selectedSite) return;
    fetchData();
  }, [selectedSite, days, dimension]);

  const fetchData = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('fetchSearchConsole', {
      siteUrl: selectedSite,
      days,
      rowLimit: 100,
      dimension
    });
    setData(res.data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary dark:text-accent" />
            SEO & Keyword Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Google Search Console · Top performing keywords for commodity market insights</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading || !selectedSite} className="gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
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

        <Select value={dimension} onValueChange={setDimension}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Keywords</SelectItem>
            <SelectItem value="page">Pages</SelectItem>
            <SelectItem value="country">Countries</SelectItem>
            <SelectItem value="device">Devices</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* No sites */}
      {!loadingSites && sites.length === 0 && !loading && (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No Sites Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No verified sites were found in your Google Search Console account. Make sure your site is verified and you have access.
          </p>
        </div>
      )}

      {/* Data display */}
      {data && !loading && (
        <>
          <SEOMetricCards rows={data.rows || []} startDate={data.startDate} endDate={data.endDate} />
          <KeywordTable rows={data.rows || []} dimension={dimension} />
        </>
      )}
    </div>
  );
}