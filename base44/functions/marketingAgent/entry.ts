import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Get latest news for topical content
    const recentNews = await base44.asServiceRole.entities.CommodityNews.list("-created_date", 5);
    const newsContext = recentNews.map(n => `- ${n.headline} (${n.category}, ${n.sentiment})`).join("\n");

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an elite growth marketing strategist for EnergyCalc Pro — the #1 commodity investment analysis platform ($10/mo, 3-day free trial).

Today is ${dayOfWeek}, ${today}.

PLATFORM VALUE PROPS:
- 8 professional calculators (oil, gas, gold, metals, agriculture, rate of return, tax impact, net investment)
- AI PPM Red Flag Analyzer (scans private placement memorandums for predatory clauses)
- AI Operator Screener (background checks on oil & gas operators)
- Live commodity prices for 43+ commodities
- Covers 100+ industrial metals, 120+ agricultural crops, rare earth elements, battery metals
- Fraud pattern library & investor protection center
- Tax optimization tools (IDC deductions, depletion, MACRS depreciation)
- $10/month with 3-day free trial

TARGET AUDIENCES:
1. Accredited investors considering oil & gas deals
2. Commodity traders (metals, agriculture, energy)
3. Financial advisors serving energy/commodity clients
4. Oil & gas professionals evaluating drilling programs
5. Agricultural investors/farmers analyzing crop economics
6. Precious metals investors (gold, silver, platinum)

TODAY'S TRENDING COMMODITY NEWS (use for topical hooks):
${newsContext || "No recent news available — use evergreen angles."}

Generate a DIVERSE batch of marketing content. Return JSON with a "posts" array. Each post:
- "content_type": "twitter_post" | "linkedin_post" | "facebook_ad" | "google_ad" | "email_subject" | "blog_hook" | "seo_snippet"
- "platform": "twitter" | "linkedin" | "facebook" | "google" | "email" | "blog" | "seo"
- "headline": short punchy headline
- "content": the full post/ad copy (platform-appropriate length and tone)
- "cta": call to action
- "target_audience": who this targets
- "commodity_focus": which sector (oil_gas, metals, agriculture, general, fraud_protection)
- "campaign_theme": "fraud_protection" | "calculator_tools" | "market_intelligence" | "tax_savings" | "free_trial" | "general_value"

RULES:
1. Create 10-15 pieces of content
2. Mix platforms: at least 2 Twitter, 2 LinkedIn, 2 Facebook ads, 1 Google ad, 2 email subjects, 1 blog hook, 1 SEO snippet
3. At least 2 must be fraud-protection themed (this is our MISSION — protecting investors)
4. At least 2 must tie into today's trending commodity news
5. Twitter posts: max 280 chars, punchy, use relevant hashtags
6. LinkedIn posts: professional, 150-300 words, thought leadership tone
7. Facebook ads: benefit-driven, emotional, clear CTA
8. Google ads: headline max 30 chars, description max 90 chars
9. Email subjects: curiosity-driven, max 60 chars
10. Include urgency where appropriate ("3-day free trial", "before your next deal")
11. NEVER use fake stats or claims. Be authentic and value-driven.
12. URL is energycalcpro.com
13. Vary the angles — don't repeat the same pitch`,
      add_context_from_internet: true,
      model: 'gemini_3_pro',
      response_json_schema: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                content_type: { type: "string" },
                platform: { type: "string" },
                headline: { type: "string" },
                content: { type: "string" },
                cta: { type: "string" },
                target_audience: { type: "string" },
                commodity_focus: { type: "string" },
                campaign_theme: { type: "string" }
              }
            }
          }
        }
      }
    });

    const posts = result?.posts || [];
    console.log(`Generated ${posts.length} marketing pieces`);

    if (posts.length === 0) {
      return Response.json({ success: true, count: 0, message: "No content generated" });
    }

    // Archive old drafts (older than 7 days) to keep content fresh
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oldContent = await base44.asServiceRole.entities.MarketingContent.filter(
      { status: "draft", created_date: { $lt: sevenDaysAgo } }
    );
    for (const old of oldContent) {
      await base44.asServiceRole.entities.MarketingContent.update(old.id, { status: "archived" });
    }
    console.log(`Archived ${oldContent.length} old drafts`);

    // Dedup by headline
    const existing = await base44.asServiceRole.entities.MarketingContent.list("-created_date", 50);
    const existingHeadlines = new Set(existing.map(e => (e.headline || "").toLowerCase().trim()));
    const newPosts = posts.filter(p => !existingHeadlines.has((p.headline || "").toLowerCase().trim()));
    console.log(`${newPosts.length} new posts after dedup`);

    if (newPosts.length > 0) {
      await base44.asServiceRole.entities.MarketingContent.bulkCreate(
        newPosts.map(p => ({
          content_type: p.content_type || "twitter_post",
          platform: p.platform || "twitter",
          content: p.content,
          headline: p.headline || "",
          cta: p.cta || "Try free at energycalcpro.com",
          target_audience: p.target_audience || "commodity investors",
          commodity_focus: p.commodity_focus || "general",
          campaign_theme: p.campaign_theme || "general_value",
          status: "draft",
        }))
      );
    }

    return Response.json({
      success: true,
      generated: posts.length,
      new: newPosts.length,
      archived: oldContent.length,
    });
  } catch (error) {
    console.error("marketingAgent error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});