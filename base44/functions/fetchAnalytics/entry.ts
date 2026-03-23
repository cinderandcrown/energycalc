import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { propertyId, days = 28, action = 'listProperties' } = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    // Step 1: List available GA4 properties
    if (action === 'listProperties') {
      const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('GA Admin API error:', res.status, errText);
        return Response.json({ error: `API error: ${res.status}`, details: errText }, { status: res.status });
      }
      const data = await res.json();
      const properties = [];
      for (const account of (data.accountSummaries || [])) {
        for (const prop of (account.propertySummaries || [])) {
          properties.push({
            propertyId: prop.property.replace('properties/', ''),
            displayName: prop.displayName,
            accountName: account.displayName
          });
        }
      }
      console.log(`Found ${properties.length} GA4 properties`);
      return Response.json({ properties });
    }

    // Step 2: Fetch conversion data by traffic source
    if (action === 'conversionsBySource') {
      if (!propertyId) {
        return Response.json({ error: 'propertyId is required' }, { status: 400 });
      }

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const body = {
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'sessionDefaultChannelGroup' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'conversions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'engagedSessions' },
          { name: 'userEngagementDuration' }
        ]
      };

      const res = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error('GA Data API error:', res.status, errText);
        return Response.json({ error: `API error: ${res.status}`, details: errText }, { status: res.status });
      }

      const data = await res.json();
      const rows = (data.rows || []).map(row => ({
        source: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value) || 0,
        conversions: parseInt(row.metricValues[1].value) || 0,
        totalUsers: parseInt(row.metricValues[2].value) || 0,
        newUsers: parseInt(row.metricValues[3].value) || 0,
        engagedSessions: parseInt(row.metricValues[4].value) || 0,
        engagementDuration: parseFloat(row.metricValues[5].value) || 0,
      })).map(row => ({
        ...row,
        conversionRate: row.sessions > 0 ? (row.conversions / row.sessions) * 100 : 0,
        engagementRate: row.sessions > 0 ? (row.engagedSessions / row.sessions) * 100 : 0,
      })).sort((a, b) => b.sessions - a.sessions);

      console.log(`Fetched ${rows.length} channel groups for property ${propertyId} (${startDate} to ${endDate})`);

      return Response.json({ rows, startDate, endDate });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('fetchAnalytics error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});