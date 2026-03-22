import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";

const PriceContext = createContext(null);

// Default price entries — populated with nulls until real data arrives
const DEFAULT_PRICES = [
  { label: "WTI Crude", symbol: "WTI", price: null, change: 0, changePct: 0, unit: "/bbl", category: "Oil" },
  { label: "Brent Crude", symbol: "BRENT", price: null, change: 0, changePct: 0, unit: "/bbl", category: "Oil" },
  { label: "Louisiana Light Sweet", symbol: "LLS", price: null, change: 0, changePct: 0, unit: "/bbl", category: "Oil" },
  { label: "Mars US", symbol: "MARS", price: null, change: 0, changePct: 0, unit: "/bbl", category: "Oil" },
  { label: "OPEC Basket", symbol: "OPEC", price: null, change: 0, changePct: 0, unit: "/bbl", category: "Oil" },
  { label: "Natural Gas", symbol: "NG", price: null, change: 0, changePct: 0, unit: "/MMBtu", category: "Gas" },
  { label: "Propane", symbol: "PROPANE", price: null, change: 0, changePct: 0, unit: "/gal", category: "Gas" },
  { label: "Heating Oil", symbol: "HO", price: null, change: 0, changePct: 0, unit: "/gal", category: "Refined" },
  { label: "RBOB Gasoline", symbol: "RBOB", price: null, change: 0, changePct: 0, unit: "/gal", category: "Refined" },
  { label: "Ethanol", symbol: "ETHANOL", price: null, change: 0, changePct: 0, unit: "/gal", category: "Renewables" },
  { label: "Uranium", symbol: "URANIUM", price: null, change: 0, changePct: 0, unit: "/lb", category: "Nuclear" },
  { label: "Coal", symbol: "COAL", price: null, change: 0, changePct: 0, unit: "/ton", category: "Coal" },
];

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function PriceProvider({ children }) {
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await base44.functions.invoke("fetchPrices", {});
      if (res.data?.prices?.length) {
        // Merge fetched prices with defaults (keep defaults for any that didn't parse)
        const fetched = res.data.prices;
        const merged = DEFAULT_PRICES.map((def) => {
          const found = fetched.find(
            (f) => f.symbol === def.symbol || f.label === def.label
          );
          return found
            ? { ...def, ...found }
            : def;
        });
        // Also add any fetched commodities not in defaults
        const extraSymbols = fetched
          .filter((f) => !DEFAULT_PRICES.some((d) => d.symbol === f.symbol || d.label === f.label))
          .map((f) => ({ ...f, symbol: f.symbol || f.label }));
        setPrices([...merged, ...extraSymbols]);
        setLastUpdated(new Date(res.data.fetchedAt || Date.now()));
      }
    } catch (e) {
      // Keep existing prices on error
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchPrices();
  }, [fetchPrices]);

  const getPrice = useCallback(
    (symbol) => prices.find((p) => p.symbol === symbol) || null,
    [prices]
  );

  // Fetch on mount and auto-refresh every 5 minutes
  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchPrices]);

  return (
    <PriceContext.Provider value={{ prices, loading, lastUpdated, refresh, getPrice }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrices() {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error("usePrices must be used within <PriceProvider>");
  return ctx;
}

export default PriceContext;