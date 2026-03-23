import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { siteUrl, days = 28, rowLimit = 100, dimension = 'query', action = 'query' } = await req.json();
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
    const BASE = 'https://www.googleapis.com/webmasters/v3';

    // List available sites
    if (!siteUrl) {
      const sitesRes = await fetch(`${BASE}/sites`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
      const sitesData = await sitesRes.json();
      console.log('Available sites:', JSON.stringify(sitesData));
      return Response.json({ sites: sitesData.siteEntry || [] });
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const siteEncoded = encodeURIComponent(siteUrl);

    // Daily trend data (clicks/impressions over time)
    if (action === 'trend') {
      const res = await fetch(`${BASE}/sites/${siteEncoded}/searchAnalytics/query`, {
        method: 'POST', headers,
        body: JSON.stringify({ startDate, endDate, dimensions: ['date'], rowLimit: 500, dataState: 'final' })
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Trend API error:', res.status, err);
        return Response.json({ error: `API error: ${res.status}` }, { status: res.status });
      }
      const data = await res.json();
      const rows = (data.rows || []).map(r => ({
        date: r.keys[0], clicks: r.clicks, impressions: r.impressions,
        ctr: r.ctr, position: r.position
      })).sort((a, b) => a.date.localeCompare(b.date));
      console.log(`Trend: ${rows.length} days for ${siteUrl}`);
      return Response.json({ rows, startDate, endDate });
    }

    // Multi-dimension query (query+page combined for opportunity analysis)
    if (action === 'opportunities') {
      const res = await fetch(`${BASE}/sites/${siteEncoded}/searchAnalytics/query`, {
        method: 'POST', headers,
        body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: 500, dataState: 'final' })
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Opportunities API error:', res.status, err);
        return Response.json({ error: `API error: ${res.status}` }, { status: res.status });
      }
      const data = await res.json();
      // Opportunity = high impressions but position > 10 (page 2+), or high impressions low CTR
      const all = (data.rows || []).map(r => ({
        key: r.keys[0], clicks: r.clicks, impressions: r.impressions,
        ctr: r.ctr, position: r.position
      }));
      const opportunities = all
        .filter(r => r.impressions >= 10 && r.position > 8)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 50);
      const quickWins = all
        .filter(r => r.position > 3 && r.position <= 15 && r.impressions >= 20)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 30);
      const topPerformers = all
        .filter(r => r.position <= 5 && r.clicks >= 1)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 30);
      console.log(`Opportunities: ${opportunities.length}, Quick wins: ${quickWins.length}, Top: ${topPerformers.length}`);
      return Response.json({ opportunities, quickWins, topPerformers, startDate, endDate });
    }

    // Page performance
    if (action === 'pages') {
      const res = await fetch(`${BASE}/sites/${siteEncoded}/searchAnalytics/query`, {
        method: 'POST', headers,
        body: JSON.stringify({ startDate, endDate, dimensions: ['page'], rowLimit: 200, dataState: 'final' })
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Pages API error:', res.status, err);
        return Response.json({ error: `API error: ${res.status}` }, { status: res.status });
      }
      const data = await res.json();
      const rows = (data.rows || []).map(r => ({
        key: r.keys[0], clicks: r.clicks, impressions: r.impressions,
        ctr: r.ctr, position: r.position
      })).sort((a, b) => b.clicks - a.clicks);
      console.log(`Pages: ${rows.length} for ${siteUrl}`);
      return Response.json({ rows, startDate, endDate });
    }

    // Standard dimension query (query, page, country, device)
    const analyticsRes = await fetch(`${BASE}/sites/${siteEncoded}/searchAnalytics/query`, {
      method: 'POST', headers,
      body: JSON.stringify({ startDate, endDate, dimensions: [dimension], rowLimit, dataState: 'final' })
    });

    if (!analyticsRes.ok) {
      const errText = await analyticsRes.text();
      console.error('Search Console API error:', analyticsRes.status, errText);
      return Response.json({ error: `API error: ${analyticsRes.status}`, details: errText }, { status: analyticsRes.status });
    }

    const data = await analyticsRes.json();
    const rows = (data.rows || []).map(row => ({
      key: row.keys[0], clicks: row.clicks, impressions: row.impressions,
      ctr: row.ctr, position: row.position
    }));
    console.log(`Fetched ${rows.length} ${dimension} rows for ${siteUrl} (${startDate} to ${endDate})`);

    return Response.json({ rows, startDate, endDate, dimension, totalRows: rows.length });
  } catch (error) {
    console.error('fetchSearchConsole error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});