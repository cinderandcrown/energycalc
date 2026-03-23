import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LivePriceBar from "@/components/calc/LivePriceBar";
import useCommodityPrices from "@/hooks/useCommodityPrices";
import CropSelector from "@/components/calc/CropSelector";
import { CROP_DATABASE } from "@/lib/cropData";
import { Badge } from "@/components/ui/badge";

const DEFAULTS = {
  cropIndex: 0,
  acreage: 500,
  yieldPerAcre: 175,
  priceOverride: 0,
  years: 5,
  yieldGrowthPct: 1,
  priceVolatilityPct: 10,
  insurancePct: 5,
};

export default function AgYieldCalc() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);
  const { commodities, loading: priceLoading, refresh } = useCommodityPrices("agriculture");

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));
  const crop = CROP_DATABASE[inputs.cropIndex];

  const handleCropChange = (idx) => {
    setInputs(p => ({ ...p, cropIndex: idx, yieldPerAcre: CROP_DATABASE[idx].avgYield }));
  };

  // Try matching live price by name (works for major commodities)
  const livePrice = commodities.find(c => {
    const cName = c.name?.toLowerCase() || "";
    const cropName = crop.name.toLowerCase();
    return cName.includes(cropName.split(" ")[0].toLowerCase()) || cropName.includes(cName.split(" ")[0].toLowerCase());
  });
  const effectivePrice = inputs.priceOverride > 0 ? inputs.priceOverride : (livePrice?.price || 0);

  const results = useMemo(() => {
    const { acreage, yieldPerAcre, years, yieldGrowthPct, priceVolatilityPct, insurancePct } = inputs;
    const costPerAcre = crop.costPerAcre;
    const projections = [];
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    for (let y = 1; y <= years; y++) {
      const adjYield = yieldPerAcre * Math.pow(1 + yieldGrowthPct / 100, y - 1);
      const totalProduction = adjYield * acreage;
      const yearRevenue = totalProduction * effectivePrice;
      const yearCost = costPerAcre * acreage;
      const insurance = yearRevenue * (insurancePct / 100);
      const yearProfit = yearRevenue - yearCost - insurance;

      const bearRevenue = totalProduction * effectivePrice * (1 - priceVolatilityPct / 100);
      const bullRevenue = totalProduction * effectivePrice * (1 + priceVolatilityPct / 100);

      totalRevenue += yearRevenue;
      totalCost += yearCost + insurance;
      totalProfit += yearProfit;

      projections.push({
        year: `Year ${y}`,
        revenue: Math.round(yearRevenue),
        cost: Math.round(yearCost + insurance),
        profit: Math.round(yearProfit),
        bearProfit: Math.round(bearRevenue - yearCost - insurance),
        bullProfit: Math.round(bullRevenue - yearCost - insurance),
        production: Math.round(totalProduction),
      });
    }

    const revenuePerAcre = acreage > 0 ? totalRevenue / acreage / years : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const breakEvenPrice = acreage > 0 && yieldPerAcre > 0 ? (costPerAcre / yieldPerAcre) : 0;

    return { projections, totalRevenue, totalCost, totalProfit, revenuePerAcre, profitMargin, breakEvenPrice };
  }, [inputs, effectivePrice, crop]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Agricultural Yield Projections</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Multi-year crop revenue forecasting · {CROP_DATABASE.length} crops across 12 categories</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge className="bg-drill-green/10 text-drill-green border-0 text-[10px]">{crop.category}</Badge>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">{crop.avgYield.toLocaleString()} {crop.unit} avg</Badge>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">${crop.costPerAcre.toLocaleString()}/ac cost</Badge>
          </div>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} calcType="ag_yield" inputs={inputs} results={{ ...results, projections: undefined }} />
      </div>

      <LivePriceBar
        items={commodities.slice(0, 4).map(c => ({
          label: c.name, price: c.price, change: c.changePct, unit: `/${c.unit?.replace("/", "") || "unit"}`
        }))}
        loading={priceLoading}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Crop & Field Parameters</h2>

          <CropSelector selectedIndex={inputs.cropIndex} onChange={handleCropChange} />

          <InputWithSlider label="Acreage" value={inputs.acreage} onChange={set("acreage")} min={10} max={10000} step={10} suffix="ac" tooltip="Total planted acreage." />
          <InputWithSlider label={`Yield (${crop.unit})`} value={inputs.yieldPerAcre} onChange={set("yieldPerAcre")} min={1} max={Math.max(crop.avgYield * 3, 10)} step={crop.avgYield > 1000 ? 50 : crop.avgYield > 100 ? 5 : 1} tooltip={`Expected yield per acre. National avg: ${crop.avgYield.toLocaleString()} ${crop.unit}`} />
          <InputWithSlider label="Projection Years" value={inputs.years} onChange={set("years")} min={1} max={10} step={1} tooltip="Number of years to project forward." />
          <InputWithSlider label="Annual Yield Growth (%)" value={inputs.yieldGrowthPct} onChange={set("yieldGrowthPct")} min={-5} max={10} step={0.5} suffix="%" tooltip="Expected annual improvement in yield through better seed/tech." />
          <InputWithSlider label="Price Volatility Band (%)" value={inputs.priceVolatilityPct} onChange={set("priceVolatilityPct")} min={0} max={50} step={1} suffix="%" tooltip="Range for bull/bear scenario projections." />
          <InputWithSlider label="Crop Insurance (%)" value={inputs.insurancePct} onChange={set("insurancePct")} min={0} max={15} step={0.5} suffix="%" tooltip="Insurance cost as % of revenue." />
          <InputWithSlider label={`Price Override ($/${crop.unit.split("/")[0]})`} value={inputs.priceOverride} onChange={set("priceOverride")} min={0} max={500} step={0.01} prefix="$" tooltip="Leave 0 to use live market price (if available for this crop)." />

          {effectivePrice > 0 && (
            <div className="p-3 rounded-lg bg-drill-green/10 border border-drill-green/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Using Price:</strong>{" "}
                <span className="font-mono text-drill-green font-bold">${effectivePrice.toFixed(2)}/{crop.unit.split("/")[0]}</span>
                {inputs.priceOverride > 0 && <span className="ml-1">(manual)</span>}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <HeroResultCard label={`${inputs.years}-Year Net Profit`} value={results.totalProfit} sublabel={`Revenue: $${Math.round(results.totalRevenue).toLocaleString()} · Cost: $${Math.round(results.totalCost).toLocaleString()}`} />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total Revenue" value={results.totalRevenue} positive={results.totalRevenue > 0} />
            <ResultCard label="Total Costs" value={results.totalCost} />
            <ResultCard label="Profit Margin" value={results.profitMargin} prefix="" suffix="%" positive={results.profitMargin > 0} />
            <ResultCard label="Break-Even Price" value={results.breakEvenPrice} suffix={`/${crop.unit.split("/")[0]}`} />
          </div>

          <ResultCard label="Revenue per Acre (avg/yr)" value={results.revenuePerAcre} highlight />
        </div>
      </div>

      {/* Projection Chart */}
      {results.projections.length > 0 && effectivePrice > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Profit Projection — Base vs Bear vs Bull</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={results.projections} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="profit" stroke="#2E7D32" strokeWidth={2.5} dot={false} name="Base" />
              <Line type="monotone" dataKey="bearProfit" stroke="#d32f2f" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Bear" />
              <Line type="monotone" dataKey="bullProfit" stroke="#1976d2" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Bull" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <DisclaimerFooter />
      <SaveCalcModal open={saveOpen} onClose={() => setSaveOpen(false)} calcType="ag_yield" inputs={inputs} results={{ ...results, projections: undefined }} />
    </div>
  );
}