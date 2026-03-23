import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
- Live Cattle (symbol: LE, unit: /lb)
- Feeder Cattle (symbol: GF, unit: /lb)
- Lean Hogs (symbol: HE, unit: /lb)

**Softs & Lumber** (category: "Softs"):
- Lumber (symbol: LBS, unit: /mbf)
- Rubber (symbol: RUB, unit: /kg)

CRITICAL INSTRUCTIONS:
1. Search the web for REAL current market prices. Use financial data sources like MarketWatch, Bloomberg, Trading Economics, Kitco, CME Group, LME.
2. Do NOT fabricate or guess prices. If you cannot find a current price for a commodity, omit it entirely.
3. All prices should be in USD.
4. Change and changePct should reflect the most recent trading session's movement.
5. Be accurate — commodity traders will be using this data.`;

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
    console.log(`Fetched ${commodities.length} commodity prices`);

    return Response.json({
      commodities,
      fetchedAt: new Date().toISOString(),
      count: commodities.length
    });
  } catch (error) {
    console.error("fetchAllCommodities error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});