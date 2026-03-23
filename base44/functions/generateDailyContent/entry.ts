import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This runs as a scheduled task — use service role
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('[generateDailyContent] Starting daily content pipeline...');

    const today = new Date().toISOString().split('T')[0];

    // Check what was already published today to avoid duplicates
    const recentPosts = await base44.asServiceRole.entities.BlogPost.filter(
      { status: 'published' },
      '-publish_date',
      5
    );
    const recentTitles = recentPosts.map(p => p.title).join(', ');
    console.log(`[generateDailyContent] Recent posts: ${recentTitles}`);

    // Get current market data for timely content
    const cachedData = await base44.asServiceRole.entities.CommodityCache.filter({ cache_key: 'all_commodities' });
    const prices = cachedData.length > 0 ? cachedData[0].data?.commodities?.slice(0, 10) : [];
    const priceContext = prices.map(p => `${p.name}: $${p.price}${p.unit} (${p.changePct > 0 ? '+' : ''}${p.changePct}%)`).join(', ');

    // Get recent news for topical hooks
    const recentNews = await base44.asServiceRole.entities.CommodityNews.filter({}, '-created_date', 3);
    const newsContext = recentNews.map(n => n.headline).join('; ');

    // Category rotation to cover all sectors
    const categories = [
      'oil_gas', 'precious_metals', 'industrial_metals', 'agriculture',
      'investor_protection', 'tax_strategy', 'market_analysis', 'energy_transition',
      'rare_earth', 'how_to_guide'
    ];
    const recentCategories = recentPosts.map(p => p.category);
    const availableCategories = categories.filter(c => !recentCategories.includes(c));
    const targetCategory = availableCategories.length > 0 ? availableCategories[0] : categories[Math.floor(Math.random() * categories.length)];

    console.log(`[generateDailyContent] Target category: ${targetCategory}`);

    // Generate the blog post via LLM
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an expert commodity market content writer for EnergyCalc Pro. Create a comprehensive, SEO-optimized blog post for today (${today}).

TARGET CATEGORY: ${targetCategory}
RECENT MARKET PRICES: ${priceContext || 'Not available — use general market knowledge'}
RECENT NEWS: ${newsContext || 'None — write evergreen content'}
ALREADY PUBLISHED (avoid similar topics): ${recentTitles || 'None'}

Create a blog post that:
1. Targets a specific high-volume search keyword
2. Is 800-1500 words of valuable, educational content
3. Includes data, statistics, and actionable insights
4. Naturally references EnergyCalc Pro tools where relevant
5. Ends with a soft CTA about the free trial
6. Is written for informational purposes only — NO investment advice

Also create:
- A Twitter post (under 280 chars with hashtags)
- A LinkedIn post (200-400 chars, professional tone)
- An email subject line (under 60 chars, curiosity-driven)
- An email preview text (under 100 chars)

Return a JSON object with ALL of these fields:
- title: SEO-optimized article title
- slug: URL-safe version (lowercase, hyphens only)
- excerpt: 150-160 char excerpt
- content: Full article in markdown (include ## headers, bullet points, bold text)
- category: "${targetCategory}"
- tags: array of 5-8 relevant SEO keyword tags
- meta_title: 60 chars max
- meta_description: 155 chars max
- social_post_twitter: under 280 chars
- social_post_linkedin: 200-400 chars
- email_subject: under 60 chars
- email_preview: under 100 chars`,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string' },
          content: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          meta_title: { type: 'string' },
          meta_description: { type: 'string' },
          social_post_twitter: { type: 'string' },
          social_post_linkedin: { type: 'string' },
          email_subject: { type: 'string' },
          email_preview: { type: 'string' }
        }
      },
      add_context_from_internet: true,
      model: 'gemini_3_pro'
    });

    console.log(`[generateDailyContent] Generated: "${result.title}"`);

    // Save the blog post
    const post = await base44.asServiceRole.entities.BlogPost.create({
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      category: result.category || targetCategory,
      tags: result.tags || [],
      meta_title: result.meta_title,
      meta_description: result.meta_description,
      status: 'published',
      publish_date: new Date().toISOString(),
      social_post_twitter: result.social_post_twitter,
      social_post_linkedin: result.social_post_linkedin,
      email_subject: result.email_subject,
      email_preview: result.email_preview,
      view_count: 0,
    });

    console.log(`[generateDailyContent] Blog post saved: ${post.id}`);

    // Also save social posts as MarketingContent for the marketing agent
    await base44.asServiceRole.entities.MarketingContent.create({
      content_type: 'twitter_post',
      platform: 'twitter',
      content: result.social_post_twitter,
      headline: result.title,
      cta: 'Read more at energycalcpro.com',
      target_audience: 'commodity investors',
      commodity_focus: targetCategory,
      campaign_theme: 'general_value',
      status: 'approved',
    });

    await base44.asServiceRole.entities.MarketingContent.create({
      content_type: 'linkedin_post',
      platform: 'linkedin',
      content: result.social_post_linkedin,
      headline: result.title,
      cta: 'Read the full analysis',
      target_audience: 'energy professionals',
      commodity_focus: targetCategory,
      campaign_theme: 'general_value',
      status: 'approved',
    });

    await base44.asServiceRole.entities.MarketingContent.create({
      content_type: 'email_subject',
      platform: 'email',
      content: `Subject: ${result.email_subject}\nPreview: ${result.email_preview}\n\n${result.excerpt}`,
      headline: result.email_subject,
      cta: 'Read more',
      target_audience: 'subscribers',
      commodity_focus: targetCategory,
      campaign_theme: 'general_value',
      status: 'approved',
    });

    console.log(`[generateDailyContent] Social and email content saved. Pipeline complete.`);

    return Response.json({
      success: true,
      blogPost: { id: post.id, title: result.title, slug: result.slug, category: result.category },
      socialPosts: 3,
    });
  } catch (error) {
    console.error('[generateDailyContent] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});