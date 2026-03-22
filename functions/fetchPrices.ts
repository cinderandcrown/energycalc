import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

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

    // Parse the main ticker prices from the header widget
    // Format: commodity name, price, change, changePct
    const prices = [];

    // WTI Crude
    const wtiMatch = html.match(/WTI Crude[^<]*<[\s\S]*?(\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)%/);
    if (wtiMatch) {
      prices.push({ label: "WTI Crude", price: parseFloat(wtiMatch[1]), unit: "/bbl", change: parseFloat(wtiMatch[2]), changePct: parseFloat(wtiMatch[3]) });
    }

    // Brent Crude
    const brentMatch = html.match(/Brent Crude[^<]*<[\s\S]*?(\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)%/);
    if (brentMatch) {
      prices.push({ label: "Brent Crude", price: parseFloat(brentMatch[1]), unit: "/bbl", change: parseFloat(brentMatch[2]), changePct: parseFloat(brentMatch[3]) });
    }

    // Natural Gas
    const gasMatch = html.match(/Natural Gas[^<]*<[\s\S]*?(\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)%/);
    if (gasMatch) {
      prices.push({ label: "Natural Gas", price: parseFloat(gasMatch[1]), unit: "/MMBtu", change: parseFloat(gasMatch[2]), changePct: parseFloat(gasMatch[3]) });
    }

    // Heating Oil
    const heatMatch = html.match(/Heating Oil[^<]*<[\s\S]*?(\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)[\s\S]*?([+-]?\d+\.\d+)%/);
    if (heatMatch) {
      prices.push({ label: "Heating Oil", price: parseFloat(heatMatch[1]), unit: "/gal", change: parseFloat(heatMatch[2]), changePct: parseFloat(heatMatch[3]) });
    }

    if (prices.length === 0) {
      console.error("Failed to parse any prices from oilprice.com HTML");
      return Response.json({ error: "Failed to parse prices" }, { status: 500 });
    }

    return Response.json({ prices, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("fetchPrices error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});