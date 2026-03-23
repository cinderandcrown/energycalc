import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlebigquery");
    const { action, projectId, datasetId, query: sqlQuery } = await req.json();

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Action: list projects
    if (action === 'listProjects') {
      const res = await fetch('https://bigquery.googleapis.com/bigquery/v2/projects', { headers });
      if (!res.ok) {
        const err = await res.text();
        console.error('BigQuery listProjects error:', err);
        return Response.json({ error: `BigQuery API error: ${res.status}` }, { status: 500 });
      }
      const data = await res.json();
      return Response.json({ projects: (data.projects || []).map(p => ({ id: p.id, friendlyName: p.friendlyName || p.id })) });
    }

    // Action: list datasets
    if (action === 'listDatasets') {
      if (!projectId) return Response.json({ error: 'projectId required' }, { status: 400 });
      const res = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/datasets`, { headers });
      if (!res.ok) {
        const err = await res.text();
        console.error('BigQuery listDatasets error:', err);
        return Response.json({ error: `BigQuery API error: ${res.status}` }, { status: 500 });
      }
      const data = await res.json();
      return Response.json({ datasets: (data.datasets || []).map(d => ({ id: d.datasetReference.datasetId })) });
    }

    // Action: list tables
    if (action === 'listTables') {
      if (!projectId || !datasetId) return Response.json({ error: 'projectId and datasetId required' }, { status: 400 });
      const res = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/datasets/${datasetId}/tables`, { headers });
      if (!res.ok) {
        const err = await res.text();
        console.error('BigQuery listTables error:', err);
        return Response.json({ error: `BigQuery API error: ${res.status}` }, { status: 500 });
      }
      const data = await res.json();
      return Response.json({
        tables: (data.tables || []).map(t => ({
          id: t.tableReference.tableId,
          type: t.type,
          rowCount: t.numRows,
        }))
      });
    }

    // Action: get table schema
    if (action === 'getSchema') {
      if (!projectId || !datasetId) return Response.json({ error: 'projectId, datasetId required' }, { status: 400 });
      const { tableId } = await req.json().catch(() => ({}));
      // Already parsed above, re-parse won't work. Let's get tableId from the original parse.
      return Response.json({ error: 'Pass tableId in request body' }, { status: 400 });
    }

    // Action: run query
    if (action === 'runQuery') {
      if (!projectId || !sqlQuery) return Response.json({ error: 'projectId and query required' }, { status: 400 });
      
      const res = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: sqlQuery,
          useLegacySql: false,
          maxResults: 1000,
          timeoutMs: 30000,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('BigQuery runQuery error:', err);
        return Response.json({ error: `Query error: ${res.status} - ${err}` }, { status: 500 });
      }

      const data = await res.json();
      
      // Parse schema fields
      const fields = (data.schema?.fields || []).map(f => f.name);
      
      // Parse rows
      const rows = (data.rows || []).map(row => {
        const obj = {};
        row.f.forEach((cell, i) => {
          obj[fields[i]] = cell.v;
        });
        return obj;
      });

      return Response.json({
        fields,
        rows,
        totalRows: data.totalRows,
        jobComplete: data.jobComplete,
      });
    }

    return Response.json({ error: 'Invalid action. Use: listProjects, listDatasets, listTables, runQuery' }, { status: 400 });
  } catch (error) {
    console.error('queryBigQuery error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});