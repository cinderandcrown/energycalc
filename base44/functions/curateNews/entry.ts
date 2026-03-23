import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date().toISOString().split('T')[0];

    // Fetch curated news via AI web search
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a senior commodity market news editor and investor protection advocate. Today is ${today}.

Search the web for the LATEST commodity market news from the past 24 hours. Focus on stories that matter to commodity investors — especially those in oil & gas, metals, and agriculture.

Return a JSON object with an "articles" array. Each article should have:
- "headline": string (concise, professional headline)
- "summary": string (2-3 sentence summary with key facts and numbers)
- "category": one of "oil_gas", "precious_metals", "industrial_metals", "agriculture", "energy_transition", "regulation", "fraud_alert", "market_analysis"
- "commodities_mentioned": array of commodity names referenced
- "sentiment": "bullish" | "bearish" | "neutral" | "warning"
- "impact_level": "high" | "medium" | "low"
- "source": string (publication name like "Reuters", "Bloomberg", "WSJ", etc.)
- "source_url": string (actual URL to the article if available, otherwise empty string)
- "ai_analysis": string (1-2 sentences on what this means for investors — be direct and actionable)
- "fraud_relevance": boolean (true if related to fraud, SEC enforcement, investor warnings, bad actors)
- "published_date": ISO date string

PRIORITIES (in order):
1. **Fraud alerts & enforcement actions** — SEC actions, CFTC enforcement, investor warnings, Ponzi scheme busts, operator fraud cases. These are CRITICAL for our mission to protect investors.
2. **Major price movements** — significant moves in crude oil, natural gas, gold, copper, agricultural commodities
3. **Supply/demand disruptions** — OPEC decisions, weather events, trade policy, sanctions
4. **Regulatory changes** — new rules affecting commodity trading or investment
5. **Energy transition** — renewable energy developments affecting traditional commodity markets
6. **Market analysis** — expert forecasts and institutional positioning

Aim for 12-18 articles. ALWAYS include at least 2-3 fraud/enforcement stories if any exist in recent news. Search specifically for "commodity fraud", "SEC enforcement oil gas", "CFTC enforcement", "investment scam" in addition to regular commodity news.

CRITICAL: Only include real, verifiable news stories. Do not fabricate headlines or sources.`,
      add_context_from_internet: true,
      model: 'gemini_3_pro',
      response_json_schema: {
        type: "object",
        properties: {
          articles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                headline: { type: "string" },
                summary: { type: "string" },
                category: { type: "string" },
                commodities_mentioned: { type: "array", items: { type: "string" } },
                sentiment: { type: "string" },
                impact_level: { type: "string" },
                source: { type: "string" },
                source_url: { type: "string" },
                ai_analysis: { type: "string" },
                fraud_relevance: { type: "boolean" },
                published_date: { type: "string" }
              }
            }
          }
        }
      }
    });

    const articles = result?.articles || [];
    console.log(`Curated ${articles.length} news articles`);

    if (articles.length === 0) {
      return Response.json({ success: true, count: 0, message: "No articles found" });
    }

    // Delete news older than 3 days to keep feed fresh
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const oldNews = await base44.asServiceRole.entities.CommodityNews.filter(
      { created_date: { $lt: threeDaysAgo } }
    );
    for (const old of oldNews) {
      await base44.asServiceRole.entities.CommodityNews.delete(old.id);
    }
    console.log(`Cleaned up ${oldNews.length} old articles`);

    // Check existing headlines to avoid duplicates
    const existing = await base44.asServiceRole.entities.CommodityNews.list("-created_date", 50);
    const existingHeadlines = new Set(existing.map(e => e.headline.toLowerCase().trim()));

    const newArticles = articles.filter(a => !existingHeadlines.has(a.headline.toLowerCase().trim()));
    console.log(`${newArticles.length} new articles after dedup`);

    // Bulk create new articles
    if (newArticles.length > 0) {
      await base44.asServiceRole.entities.CommodityNews.bulkCreate(
        newArticles.map(a => ({
          headline: a.headline,
          summary: a.summary,
          category: a.category || "market_analysis",
          commodities_mentioned: a.commodities_mentioned || [],
          sentiment: a.sentiment || "neutral",
          impact_level: a.impact_level || "medium",
          source: a.source || "Unknown",
          source_url: a.source_url || "",
          ai_analysis: a.ai_analysis || "",
          fraud_relevance: a.fraud_relevance || false,
          published_date: a.published_date || new Date().toISOString(),
        }))
      );
    }

    return Response.json({
      success: true,
      curated: articles.length,
      new: newArticles.length,
      cleaned: oldNews.length,
    });
  } catch (error) {
    console.error("curateNews error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});