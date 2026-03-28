import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action = 'listProjects' } = await req.json();
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gitlab');
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    const BASE = 'https://gitlab.com/api/v4';

    if (action === 'listProjects') {
      const res = await fetch(`${BASE}/projects?membership=true&per_page=100&order_by=last_activity_at`, { headers });
      if (!res.ok) {
        const err = await res.text();
        console.error('GitLab projects error:', res.status, err);
        return Response.json({ error: "API request failed" }, { status: res.status });
      }
      const projects = await res.json();
      console.log(`Found ${projects.length} projects`);
      return Response.json({
        projects: projects.map(p => ({
          id: p.id,
          name: p.name_with_namespace || p.name,
          web_url: p.web_url,
        }))
      });
    }

    if (action === 'listBugIssues') {
      // Fetch open issues with "bug" label across all accessible projects
      const url = `${BASE}/issues?state=opened&labels=bug&per_page=100&order_by=created_at&sort=desc`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const err = await res.text();
        console.error('GitLab issues error:', res.status, err);
        return Response.json({ error: "API request failed" }, { status: res.status });
      }
      const issues = await res.json();
      console.log(`Found ${issues.length} open bug issues`);
      return Response.json({
        issues: issues.map(i => ({
          iid: i.iid,
          id: i.id,
          title: i.title,
          state: i.state,
          labels: i.labels,
          author: i.author?.name,
          assignees: (i.assignees || []).map(a => a.name),
          created_at: i.created_at,
          updated_at: i.updated_at,
          web_url: i.web_url,
          project: i.references?.full?.split('#')[0] || '',
          milestone: i.milestone?.title || null,
        }))
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('fetchGitlabIssues error:', error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});