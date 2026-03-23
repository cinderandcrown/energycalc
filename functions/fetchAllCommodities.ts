import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const CACHE_KEY = 'all_commodities';
const CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { forceRefresh, cacheOnly } = await req.json().catch(() => ({}));

    // Try to serve from cache first
    const cachedEntries = await base44.asServiceRole.entities.CommodityCache.filter({ cache_key: CACHE_KEY });
    const entry = cachedEntries.length > 0 ? cachedEntries[0] : null;
    const age = entry ? Date.now() - new Date(entry.fetched_at).getTime() : Infinity;
    const hasFreshCache = entry && age < CACHE_MAX_AGE_MS && entry.data?.commodities?.length > 0;

    // If cacheOnly mode, return whatever cache we have (even stale) so UI loads fast
    if (cacheOnly) {
      if (entry?.data?.commodities?.length > 0) {
        console.log(`Serving ${entry.data.commodities.length} commodities from cache (${Math.round(age / 60000)}m old, staleOk)`);
        return Response.json({
          commodities: entry.data.commodities,
          fetchedAt: entry.fetched_at,
          count: entry.data.commodities.length,
          cached: true,
          stale: !hasFreshCache
        });
      }
      return Response.json({ commodities: [], cached: false, stale: false });
    }

    // Normal mode: return fresh cache if available
    if (!forceRefresh && hasFreshCache) {
      console.log(`Serving ${entry.data.commodities.length} commodities from fresh cache (${Math.round(age / 60000)}m old)`);
      return Response.json({
        commodities: entry.data.commodities,
        fetchedAt: entry.fetched_at,
        count: entry.data.commodities.length,
        cached: true,
        stale: false
      });
    }

    // Cache miss or stale — fetch fresh data
    const today = new Date().toISOString().split('T')[0];
    const prompt = `You are a professional commodity market data analyst with access to real-time market data. Search for the latest commodity prices as of today (${today}).

Return a JSON object with ALL of the following commodities organized by category. For EACH commodity, provide: name, symbol, price (number in USD), unit (string like "/bbl", "/oz", "/lb", "/bu"), change (number — today's price change), changePct (number — today's percent change), category (string matching one of the categories below).

CATEGORIES AND COMMODITIES TO INCLUDE:

**Energy** (category: "Energy"):
- WTI Crude Oil (symbol: WTI, unit: /bbl)
- Brent Crude Oil (symbol: BRENT, unit: /bbl)
- Natural Gas (symbol: NG, unit: /MMBtu)
- Heating Oil (symbol: HO, unit: /gal)
- RBOB Gasoline (symbol: RB, unit: /gal)
- UK Natural Gas (symbol: UKNG, unit: /therm)
- Coal Newcastle (symbol: COAL, unit: /ton)
- Uranium U3O8 (symbol: U3O8, unit: /lb)
- Ethanol (symbol: ETH, unit: /gal)
- Propane (symbol: PROP, unit: /gal)

**Precious Metals** (category: "Precious Metals"):
- Gold (symbol: XAU, unit: /oz)
- Silver (symbol: XAG, unit: /oz)
- Platinum (symbol: XPT, unit: /oz)
- Palladium (symbol: XPD, unit: /oz)
- Rhodium (symbol: XRH, unit: /oz)

**Industrial Metals** (category: "Industrial Metals"):
- Copper (symbol: HG, unit: /lb)
- Aluminum (symbol: ALI, unit: /lb)
- Zinc (symbol: ZN, unit: /lb)
- Nickel (symbol: NI, unit: /lb)
- Lead (symbol: PB, unit: /lb)
- Tin (symbol: SN, unit: /lb)
- Steel HRC (symbol: HRC, unit: /ton)
- Iron Ore 62% Fe (symbol: FE, unit: /ton)
- Cobalt (symbol: CO, unit: /lb)
- Lithium Carbonate (symbol: LICO, unit: /ton)
- Molybdenum (symbol: MO, unit: /lb)

**Agriculture** (category: "Agriculture"):
- Corn (symbol: ZC, unit: /bu)
- Wheat (symbol: ZW, unit: /bu)
- Soybeans (symbol: ZS, unit: /bu)
- Coffee Arabica (symbol: KC, unit: /lb)
- Cotton (symbol: CT, unit: /lb)
- Sugar #11 (symbol: SB, unit: /lb)
- Cocoa (symbol: CC, unit: /ton)
- Rice (symbol: ZR, unit: /cwt)
- Orange Juice (symbol: OJ, unit: /lb)
- Oats (symbol: ZO, unit: /bu)
- Soybean Oil (symbol: ZL, unit: /lb)
- Palm Oil (symbol: PALM, unit: /ton)

**Livestock** (category: "Livestock"):
- Live Cattle (symbol: LE, unit: /lb) — CME futures, major U.S. beef benchmark
- Feeder Cattle (symbol: GF, unit: /lb) — CME futures, young cattle for feedlots
- Lean Hogs (symbol: HE, unit: /lb) — CME futures, U.S. pork benchmark
- Class III Milk (symbol: DC, unit: /cwt) — CME futures, U.S. dairy benchmark
- Chicken Breast (symbol: CHKN, unit: /lb) — wholesale poultry price

**Softs & Lumber** (category: "Softs"):
- Lumber (symbol: LBS, unit: /mbf)
- Rubber (symbol: RUB, unit: /kg)

CRITICAL INSTRUCTIONS:
1. Search the web for REAL current market prices. Use financial data sources like MarketWatch, Bloomberg, Trading Economics, Kitco, CME Group, LME, barchart.com.
2. Do NOT fabricate or guess prices. If you cannot find a current price for a commodity, omit it entirely.
3. All prices should be in USD.
4. Change and changePct should reflect the most recent trading session's movement.
5. Be accurate — commodity traders will be using this data.
6. IMPORTANT: Do NOT skip the Livestock category. Live Cattle, Feeder Cattle, and Lean Hogs are major CME-traded U.S. commodities — search CME Group or barchart.com for current futures prices. Cattle futures are among the most actively traded agricultural commodities in the United States.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_pro',
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
                changePct: { type: "number" },
                category: { type: "string" }
              }
            }
          }
        }
      }
    });

    const commodities = result?.commodities || [];
    console.log(`Fetched ${commodities.length} fresh commodity prices`);

    // Save to cache
    if (commodities.length > 0) {
      const fetchedAt = new Date().toISOString();
      const existing = await base44.asServiceRole.entities.CommodityCache.filter({ cache_key: CACHE_KEY });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.CommodityCache.update(existing[0].id, {
          data: { commodities },
          fetched_at: fetchedAt
        });
      } else {
        await base44.asServiceRole.entities.CommodityCache.create({
          cache_key: CACHE_KEY,
          data: { commodities },
          fetched_at: fetchedAt
        });
      }
      console.log('Cache updated with fresh prices');
    }

    return Response.json({
      commodities,
      fetchedAt: new Date().toISOString(),
      count: commodities.length,
      cached: false
    });
  } catch (error) {
    console.error("fetchAllCommodities error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});