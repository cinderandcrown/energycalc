import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LivePriceBar from "@/components/calc/LivePriceBar";
import useCommodityPrices from "@/hooks/useCommodityPrices";
import MetalSelector from "@/components/calc/MetalSelector";
import { METAL_DATABASE } from "@/lib/metalData";
import { Badge } from "@/components/ui/badge";
import usePageTitle from "@/hooks/usePageTitle";

const DEFAULTS = {
  metalIndex: 0,
  weightLbs: 10000,
  spotOverride: 0,
  freightPerLb: 0.05,
  processingPerLb: 0.12,
  wastePct: 3,
  storageCostMonthly: 500,
  holdMonths: 3,
  sellPriceOverride: 0,
};

export default function MetalCostBasis() {
  usePageTitle("Metal Cost Basis Calculator — Industrial Metals");
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);
  const { commodities, loading: priceLoading, refresh } = useCommodityPrices("industrial_metals");

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));
  const metal = METAL_DATABASE[inputs.metalIndex];

  const handleMetalChange = (idx) => {
    setInputs(p => ({ ...p, metalIndex: idx }));
  };

  // Try matching live price by symbol or first word of name
  const livePrice = commodities.find(c => {
    const cName = c.name?.toLowerCase() || "";
    const metalName = metal.name.toLowerCase().split(" ")[0].replace("(", "");
    return cName.includes(metalName) || metalName.includes(cName.split(" ")[0]);
  });
  const effectiveSpot = inputs.spotOverride > 0 ? inputs.spotOverride : (livePrice?.price || metal.defaultPrice);

  const results = useMemo(() => {
    const { weightLbs, freightPerLb, processingPerLb, wastePct, storageCostMonthly, holdMonths, sellPriceOverride } = inputs;

    const materialCost = weightLbs * effectiveSpot;
    const freightCost = weightLbs * freightPerLb;
    const processingCost = weightLbs * processingPerLb;
    const wasteCost = materialCost * (wastePct / 100);
    const storageCost = storageCostMonthly * holdMonths;
    const totalCost = materialCost + freightCost + processingCost + wasteCost + storageCost;
    const costPerLb = weightLbs > 0 ? totalCost / weightLbs : 0;

    const usableWeight = weightLbs * (1 - wastePct / 100);
    const sellPrice = sellPriceOverride > 0 ? sellPriceOverride : effectiveSpot;
    const saleRevenue = usableWeight * sellPrice;
    const profitLoss = saleRevenue - totalCost;
    const margin = saleRevenue > 0 ? (profitLoss / saleRevenue) * 100 : 0;
    const breakEvenSellPrice = usableWeight > 0 ? totalCost / usableWeight : 0;

    const costBreakdown = [
      { name: "Material", value: Math.round(materialCost) },
      { name: "Freight", value: Math.round(freightCost) },
      { name: "Processing", value: Math.round(processingCost) },
      { name: "Waste", value: Math.round(wasteCost) },
      { name: "Storage", value: Math.round(storageCost) },
    ];

    return { materialCost, freightCost, processingCost, wasteCost, storageCost, totalCost, costPerLb, usableWeight, saleRevenue, profitLoss, margin, breakEvenSellPrice, costBreakdown };
  }, [inputs, effectiveSpot, metal]);

  const barColors = ["hsl(var(--crude-gold))", "hsl(var(--muted-foreground))", "hsl(220, 80%, 55%)", "hsl(var(--flare-red))", "hsl(270, 60%, 55%)"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Metal & Material Cost-Basis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Full landed cost analysis · {METAL_DATABASE.length} metals across 11 categories</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge className="bg-primary/10 text-primary dark:text-accent border-0 text-[10px]">{metal.category}</Badge>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-mono">{metal.symbol}</Badge>
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">{metal.density} g/cm³</Badge>
          </div>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} calcType="metal_cost" inputs={inputs} results={results} />
      </div>

      <LivePriceBar
        items={commodities.slice(0, 4).map(c => ({
          label: c.name, price: c.price, change: c.changePct, unit: `/${c.unit?.replace("/", "") || "lb"}`
        }))}
        loading={priceLoading}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Metal & Cost Parameters</h2>

          <MetalSelector selectedIndex={inputs.metalIndex} onChange={handleMetalChange} />

          <InputWithSlider label="Weight (lbs)" value={inputs.weightLbs} onChange={set("weightLbs")} min={100} max={500000} step={100} suffix="lb" tooltip="Total weight of metal being purchased." />
          <InputWithSlider label={`Spot Price Override ($/${metal.unit})`} value={inputs.spotOverride} onChange={set("spotOverride")} min={0} max={Math.max(metal.defaultPrice * 3, 50)} step={metal.defaultPrice > 100 ? 1 : metal.defaultPrice > 10 ? 0.1 : 0.01} prefix="$" tooltip={`Leave 0 for default/live price. Current default: $${metal.defaultPrice.toLocaleString()}/${metal.unit}`} />
          <InputWithSlider label={`Freight Cost ($/${metal.unit})`} value={inputs.freightPerLb} onChange={set("freightPerLb")} min={0} max={Math.max(metal.defaultPrice * 0.1, 1)} step={0.01} prefix="$" tooltip="Shipping and transportation cost per unit." />
          <InputWithSlider label={`Processing Cost ($/${metal.unit})`} value={inputs.processingPerLb} onChange={set("processingPerLb")} min={0} max={Math.max(metal.defaultPrice * 0.2, 2)} step={0.01} prefix="$" tooltip="Cutting, forming, or finishing cost per unit." />
          <InputWithSlider label="Waste / Scrap (%)" value={inputs.wastePct} onChange={set("wastePct")} min={0} max={25} step={0.5} suffix="%" tooltip="Expected material loss from cutting, machining, etc." />
          <InputWithSlider label="Monthly Storage Cost ($)" value={inputs.storageCostMonthly} onChange={set("storageCostMonthly")} min={0} max={10000} step={50} prefix="$" tooltip="Warehouse or storage cost per month." />
          <InputWithSlider label="Hold Period (months)" value={inputs.holdMonths} onChange={set("holdMonths")} min={0} max={24} step={1} tooltip="How long material is held before use or sale." />
          <InputWithSlider label={`Expected Sell Price ($/${metal.unit})`} value={inputs.sellPriceOverride} onChange={set("sellPriceOverride")} min={0} max={Math.max(metal.defaultPrice * 3, 50)} step={metal.defaultPrice > 100 ? 1 : metal.defaultPrice > 10 ? 0.1 : 0.01} prefix="$" tooltip="Leave 0 to use current spot for P&L estimate." />

          {effectiveSpot > 0 && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Using Price:</strong>{" "}
                <span className="font-mono text-primary dark:text-accent font-bold">${effectiveSpot.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/{metal.unit}</span>
                {inputs.spotOverride > 0 && <span className="ml-1">(manual override)</span>}
                {inputs.spotOverride === 0 && livePrice && <span className="ml-1">(live market)</span>}
                {inputs.spotOverride === 0 && !livePrice && <span className="ml-1">(default estimate)</span>}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <HeroResultCard label="Total Landed Cost" value={results.totalCost} sublabel={`$${results.costPerLb.toFixed(4)}/lb all-in · ${results.usableWeight.toLocaleString()} lbs usable`} />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Material Cost" value={results.materialCost} />
            <ResultCard label="Freight + Processing" value={results.freightCost + results.processingCost} />
            <ResultCard label="Est. P&L" value={results.profitLoss} positive={results.profitLoss > 0} />
            <ResultCard label="Margin" value={results.margin} prefix="" suffix="%" positive={results.margin > 0} />
          </div>

          <ResultCard label="Break-Even Sell Price" value={results.breakEvenSellPrice} suffix="/lb" highlight />
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={results.costBreakdown} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, "Cost"]} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {results.costBreakdown.map((_, i) => (
                <Cell key={i} fill={barColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DisclaimerFooter />
      <SaveCalcModal open={saveOpen} onClose={() => setSaveOpen(false)} calcType="metal_cost" inputs={inputs} results={results} />
    </div>
  );
}