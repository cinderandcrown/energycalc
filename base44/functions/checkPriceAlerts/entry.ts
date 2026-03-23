import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch current prices
    let prices = [];
    try {
      const priceRes = await base44.asServiceRole.functions.invoke('fetchPrices', {});
      prices = priceRes?.prices || [];
    } catch (e) {
      console.error('Failed to fetch prices from fetchPrices:', e.message);
    }

    // Also fetch all commodities for metals etc.
    let allCommodities = [];
    try {
      const allRes = await base44.asServiceRole.functions.invoke('fetchAllCommodities', {});
      allCommodities = allRes?.commodities || [];
    } catch (e) {
      console.error('Failed to fetch all commodities:', e.message);
    }

    // Build a price lookup map
    const priceMap = {};
    for (const p of prices) {
      if (p.label && p.price != null) {
        priceMap[p.label] = p.price;
      }
    }
    for (const c of allCommodities) {
      if (c.name && c.price != null && !priceMap[c.name]) {
        priceMap[c.name] = c.price;
      }
    }

    console.log('Price map keys:', Object.keys(priceMap));

    // Fetch all active, non-triggered alerts (service role to see all users' alerts)
    const alerts = await base44.asServiceRole.entities.PriceAlert.filter({
      is_active: true,
      is_triggered: false,
    });

    console.log(`Found ${alerts.length} active alerts to check`);

    let triggeredCount = 0;

    for (const alert of alerts) {
      const currentPrice = priceMap[alert.commodity];
      if (currentPrice == null) {
        continue;
      }

      let shouldTrigger = false;
      if (alert.direction === 'above' && currentPrice >= alert.threshold) {
        shouldTrigger = true;
      } else if (alert.direction === 'below' && currentPrice <= alert.threshold) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        console.log(`TRIGGERED: ${alert.commodity} ${alert.direction} $${alert.threshold} — current: $${currentPrice}`);
        await base44.asServiceRole.entities.PriceAlert.update(alert.id, {
          is_triggered: true,
          triggered_at: new Date().toISOString(),
          triggered_price: currentPrice,
        });
        triggeredCount++;
      }
    }

    console.log(`Check complete. ${triggeredCount} alerts triggered.`);

    return Response.json({
      checked: alerts.length,
      triggered: triggeredCount,
      pricesAvailable: Object.keys(priceMap).length,
    });
  } catch (error) {
    console.error('checkPriceAlerts error:', error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});