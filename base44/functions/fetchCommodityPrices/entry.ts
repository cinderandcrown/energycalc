import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category } = await req.json().catch(() => ({}));

    const prompt = `You are a commodity market data analyst. Search for the latest real-time commodity prices as of today (${new Date().toISOString()}).

Return a JSON object with commodity prices. For each commodity include: name, symbol, price (USD number), unit, change (number, day change), changePct (number, percent change).

${category === 'precious_metals' ? 'Focus on precious metals: Gold (per troy oz), Silver (per troy oz), Platinum (per troy oz), Palladium (per troy oz).' :
  category === 'agriculture' ? 'Focus on agriculture: Corn (per bushel), Wheat (per bushel), Soybeans (per bushel), Coffee (per lb), Cotton (per lb), Sugar (per lb).' :
  category === 'industrial_metals' ? 'Focus on industrial metals: Copper (per lb), Aluminum (per lb), Steel HRC (per ton), Zinc (per lb), Nickel (per lb).' :
  'Include: Gold, Silver, Platinum, Copper, Aluminum, Corn, Wheat, Soybeans, Coffee.'}

CRITICAL: Only return prices you can verify from real market data. Do NOT fabricate prices.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: "object",
        properties: {
          commodities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                symbol: { type: "string" },
                price: { type: "number" },
                unit: { type: "string" },
                change: { type: "number" },
                changePct: { type: "number" }
              }
            }
          }
        }
      }
    });

    return Response.json({
      commodities: result?.commodities || [],
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("fetchCommodityPrices error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});