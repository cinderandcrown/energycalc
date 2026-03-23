import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function useCommodityPrices(category) {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("fetchCommodityPrices", { category });
    if (res.data?.commodities?.length) {
      setCommodities(res.data.commodities);
      setFetchedAt(res.data.fetchedAt);
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [category]);

  return { commodities, loading, fetchedAt, refresh: fetch };
}