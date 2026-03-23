import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { siteUrl, days = 28, rowLimit = 50, dimension = 'query' } = await req.json();

    // Get the OAuth access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    // Step 1: If no siteUrl provided, list available sites
    if (!siteUrl) {
      const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const sitesData = await sitesRes.json();
      console.log('Available sites:', JSON.stringify(sitesData));
      return Response.json({ sites: sitesData.siteEntry || [] });
    }

    // Step 2: Fetch search analytics data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const analyticsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: [dimension],
          rowLimit,
          dataState: 'final'
        })
      }
    );

    if (!analyticsRes.ok) {
      const errText = await analyticsRes.text();
      console.error('Search Console API error:', analyticsRes.status, errText);
      return Response.json({ error: `API error: ${analyticsRes.status}`, details: errText }, { status: analyticsRes.status });
    }

    const data = await analyticsRes.json();
    const rows = (data.rows || []).map(row => ({
      key: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position
    }));

    console.log(`Fetched ${rows.length} ${dimension} rows for ${siteUrl} (${startDate} to ${endDate})`);

    return Response.json({
      rows,
      startDate,
      endDate,
      dimension,
      totalRows: rows.length
    });
  } catch (error) {
    console.error('fetchSearchConsole error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});