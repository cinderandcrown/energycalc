import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart3, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConversionMetricCards from '@/components/analytics/ConversionMetricCards';
import ConversionChart from '@/components/analytics/ConversionChart';
import ConversionTable from '@/components/analytics/ConversionTable';

export default function AnalyticsDashboard() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProps, setLoadingProps] = useState(true);

  // Fetch GA4 properties on mount
  useEffect(() => {
    setLoadingProps(true);
    base44.functions.invoke('fetchAnalytics', { action: 'listProperties' }).then(res => {
      const props = res.data?.properties || [];
      setProperties(props);
      if (props.length > 0) setSelectedProperty(props[0].propertyId);
      setLoadingProps(false);
    }).catch(() => setLoadingProps(false));
  }, []);

  // Fetch data when property or days change
  useEffect(() => {
    if (!selectedProperty) return;
    fetchData();
  }, [selectedProperty, days]);

  const fetchData = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('fetchAnalytics', {
      action: 'conversionsBySource',
      propertyId: selectedProperty,
      days
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
            Conversion Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Google Analytics · Subscription conversions by traffic source</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading || !selectedProperty} className="gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedProperty} onValueChange={setSelectedProperty} disabled={loadingProps}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder={loadingProps ? 'Loading properties...' : 'Select property'} />
            </SelectTrigger>
            <SelectContent>
              {properties.map(p => (
                <SelectItem key={p.propertyId} value={p.propertyId}>
                  {p.displayName} ({p.accountName})
                </SelectItem>
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
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* No properties */}
      {!loadingProps && properties.length === 0 && !loading && (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No GA4 Properties Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No Google Analytics 4 properties were found in your account. Make sure GA4 is set up and your account has access.
          </p>
        </div>
      )}

      {/* Data */}
      {data && !loading && (
        <>
          <ConversionMetricCards rows={data.rows || []} startDate={data.startDate} endDate={data.endDate} />
          <ConversionChart rows={data.rows || []} />
          <ConversionTable rows={data.rows || []} />
        </>
      )}
    </div>
  );
}