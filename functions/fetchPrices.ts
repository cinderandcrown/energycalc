import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

// Extracts a commodity row from oilprice.com HTML using the data-hash attribute
function extractCommodity(html: string, dataHash: string, label: string, unit: string, category: string, symbol: string) {
  // Find the row by data-hash
  const rowRegex = new RegExp(`data-hash="${dataHash}"[^>]*>[\\s\\S]*?<td class="value">([\\d.]+)\\s*<[\\s\\S]*?<td class="change_amount">([+-]?[\\d.]+)<[\\s\\S]*?<td class="change_percent">([+-]?[\\d.]+)%`, 'i');
  const match = html.match(rowRegex);
  if (match) {
    return {
      label,
      symbol,
      price: parseFloat(match[1]),
      unit,
      category,
      change: parseFloat(match[2]),
      changePct: parseFloat(match[3]),
    };
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch('https://oilprice.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });

    const html = await res.text();

    // All commodities we attempt to scrape — ones that fail to parse are silently skipped
    const commodities = [
      // Oil
      { hash: "WTI-Crude", label: "WTI Crude", symbol: "WTI", unit: "/bbl", category: "Oil" },
      { hash: "Brent-Crude", label: "Brent Crude", symbol: "BRENT", unit: "/bbl", category: "Oil" },
      { hash: "Louisiana-Light", label: "Louisiana Light Sweet", symbol: "LLS", unit: "/bbl", category: "Oil" },
      { hash: "Mars-US", label: "Mars US", symbol: "MARS", unit: "/bbl", category: "Oil" },
      { hash: "OPEC-Basket", label: "OPEC Basket", symbol: "OPEC", unit: "/bbl", category: "Oil" },
      // Gas
      { hash: "Natural-gas", label: "Natural Gas", symbol: "NG", unit: "/MMBtu", category: "Gas" },
      { hash: "Propane", label: "Propane", symbol: "PROPANE", unit: "/gal", category: "Gas" },
      // Refined
      { hash: "Heating-Oil", label: "Heating Oil", symbol: "HO", unit: "/gal", category: "Refined" },
      { hash: "Gasoline", label: "RBOB Gasoline", symbol: "RBOB", unit: "/gal", category: "Refined" },
      // Renewables
      { hash: "Ethanol", label: "Ethanol", symbol: "ETHANOL", unit: "/gal", category: "Renewables" },
      // Nuclear
      { hash: "Uranium", label: "Uranium", symbol: "URANIUM", unit: "/lb", category: "Nuclear" },
      // Coal
      { hash: "Coal", label: "Coal", symbol: "COAL", unit: "/ton", category: "Coal" },
    ];

    const prices = [];
    for (const c of commodities) {
      const result = extractCommodity(html, c.hash, c.label, c.unit, c.category, c.symbol);
      if (result) {
        prices.push(result);
      } else {
        console.error(`Failed to parse ${c.label} (data-hash: ${c.hash})`);
      }
    }

    if (prices.length === 0) {
      console.error("No prices parsed from oilprice.com");
      return Response.json({ error: "Failed to parse prices" }, { status: 500 });
    }

    return Response.json({ prices, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("fetchPrices error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});