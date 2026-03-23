import { useState, useMemo } from "react";
import { Beef, DollarSign, TrendingUp, Scale, Package, Truck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MobileSelect from "@/components/mobile/MobileSelect";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PageHeader from "@/components/mobile/PageHeader";
import CalcActionBar from "@/components/CalcActionBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";

const LIVESTOCK_TYPES = [
  { value: "feeder_cattle", label: "Feeder Cattle", unit: "lb", avgWeight: 750, defaultPrice: 2.55 },
  { value: "live_cattle", label: "Live (Fat) Cattle", unit: "lb", avgWeight: 1350, defaultPrice: 1.92 },
  { value: "lean_hogs", label: "Lean Hogs", unit: "lb", avgWeight: 280, defaultPrice: 0.92 },
  { value: "feeder_hogs", label: "Feeder Hogs/Pigs", unit: "lb", avgWeight: 50, defaultPrice: 1.10 },
];

const defaultInputs = {
  livestockType: "feeder_cattle",
  headCount: 50,
  avgWeight: 750,
  marketPrice: 2.55,
  purchasePrice: 2.10,
  purchaseWeight: 550,
  feedCostPerHead: 450,
  vetCostPerHead: 35,
  transportCostPerHead: 25,
  deathLossRate: 2,
  daysOnFeed: 150,
  miscCostPerHead: 15,
};

export default function LivestockCalc() {
  const [inputs, setInputs] = useState(defaultInputs);

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: val }));

  const handleTypeChange = (val) => {
    const type = LIVESTOCK_TYPES.find(t => t.value === val);
    if (type) {
      setInputs(prev => ({
        ...prev,
        livestockType: val,
        avgWeight: type.avgWeight,
        marketPrice: type.defaultPrice,
      }));
    }
  };

  const selectedType = LIVESTOCK_TYPES.find(t => t.value === inputs.livestockType);

  const results = useMemo(() => {
    const {
      headCount, avgWeight, marketPrice, purchasePrice, purchaseWeight,
      feedCostPerHead, vetCostPerHead, transportCostPerHead,
      deathLossRate, daysOnFeed, miscCostPerHead
    } = inputs;

    const effectiveHead = headCount * (1 - deathLossRate / 100);
    const totalPurchaseCost = headCount * purchaseWeight * purchasePrice;

    // Feed cost scales by days on feed (base cost assumes 150-day standard)
    // Industry standard: feed cost is roughly proportional to feeding duration
    const feedDayFactor = daysOnFeed / 150;
    const totalFeedCost = headCount * feedCostPerHead * feedDayFactor;

    const totalVetCost = headCount * vetCostPerHead;
    const totalTransport = headCount * transportCostPerHead;
    const totalMisc = headCount * miscCostPerHead;

    const totalCost = totalPurchaseCost + totalFeedCost + totalVetCost + totalTransport + totalMisc;
    const costPerHead = headCount > 0 ? totalCost / headCount : 0;

    // Revenue is based on surviving head sold at sale weight × market price
    const totalRevenue = effectiveHead * avgWeight * marketPrice;
    // Revenue per head sold (effective head basis)
    const revenuePerHead = effectiveHead > 0 ? totalRevenue / effectiveHead : 0;

    const netProfit = totalRevenue - totalCost;
    // Profit per head purchased — industry standard: measures return per head you bought
    const profitPerHead = headCount > 0 ? netProfit / headCount : 0;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    // Break-even sale price per lb (must cover all costs from surviving head)
    const breakEvenPrice = effectiveHead > 0 && avgWeight > 0
      ? totalCost / (effectiveHead * avgWeight)
      : 0;

    // Cost breakdown for chart
    const costBreakdown = [
      { name: "Purchase", value: totalPurchaseCost },
      { name: "Feed", value: totalFeedCost },
      { name: "Vet/Health", value: totalVetCost },
      { name: "Transport", value: totalTransport },
      { name: "Misc", value: totalMisc },
    ];

    return {
      effectiveHead, totalPurchaseCost, totalFeedCost, totalVetCost,
      totalTransport, totalMisc, totalCost, costPerHead,
      totalRevenue, revenuePerHead, netProfit, profitPerHead,
      roi, breakEvenPrice, costBreakdown,
    };
  }, [inputs]);

  const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtDec = (v) => "$" + v.toFixed(2);

  const chartColors = ["hsl(var(--primary))", "hsl(var(--crude-gold))", "hsl(var(--drill-green))", "hsl(var(--muted-foreground))", "hsl(270, 60%, 55%)"];

  const summaryCards = [
    { label: "Total Revenue", value: fmt(results.totalRevenue), icon: DollarSign, color: "text-drill-green", bg: "bg-drill-green/10" },
    { label: "Total Cost", value: fmt(results.totalCost), icon: Package, color: "text-flare-red", bg: "bg-flare-red/10" },
    { label: "Net Profit", value: `${results.netProfit >= 0 ? "" : "−"}${fmt(results.netProfit)}`, icon: TrendingUp, color: results.netProfit >= 0 ? "text-drill-green" : "text-flare-red", bg: results.netProfit >= 0 ? "bg-drill-green/10" : "bg-flare-red/10" },
    { label: "ROI", value: `${results.roi.toFixed(1)}%`, icon: TrendingUp, color: results.roi >= 0 ? "text-crude-gold" : "text-flare-red", bg: "bg-crude-gold/10" },
    { label: "Break-Even Price", value: `${fmtDec(results.breakEvenPrice)}/${selectedType?.unit}`, icon: Scale, color: "text-primary dark:text-accent", bg: "bg-primary/10 dark:bg-accent/10" },
    { label: "Profit/Head", value: `${results.profitPerHead >= 0 ? "" : "−"}${fmt(Math.abs(results.profitPerHead))}`, icon: Beef, color: results.profitPerHead >= 0 ? "text-drill-green" : "text-flare-red", bg: results.profitPerHead >= 0 ? "bg-drill-green/10" : "bg-flare-red/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Livestock Calculator"
        subtitle="Estimate profit, break-even, and ROI for cattle and hog operations"
        icon={Beef}
      />

      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Beef className="w-4 h-4 text-crude-gold" />
          <h2 className="text-sm font-bold text-foreground">Operation Parameters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Livestock Type</Label>
            <MobileSelect
              value={inputs.livestockType}
              onValueChange={handleTypeChange}
              options={LIVESTOCK_TYPES.map(t => ({ value: t.value, label: t.label }))}
              label="Livestock Type"
              placeholder="Select type"
              triggerClassName="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-sm">Head Count</Label>
            <Input type="number" value={inputs.headCount} onChange={e => set("headCount", +e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm">Purchase Weight ({selectedType?.unit})</Label>
            <Input type="number" value={inputs.purchaseWeight} onChange={e => set("purchaseWeight", +e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm">Purchase Price ($/{selectedType?.unit})</Label>
            <Input type="number" step="0.01" value={inputs.purchasePrice} onChange={e => set("purchasePrice", +e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm">Sale Weight ({selectedType?.unit})</Label>
            <Input type="number" value={inputs.avgWeight} onChange={e => set("avgWeight", +e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm">Market Sale Price ($/{selectedType?.unit})</Label>
            <Input type="number" step="0.01" value={inputs.marketPrice} onChange={e => set("marketPrice", +e.target.value)} className="mt-1.5" />
          </div>
        </div>

        {/* Cost sliders */}
        <div className="pt-3 border-t border-border space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Costs Per Head</h3>

          {[
            { key: "feedCostPerHead", label: "Feed Cost", icon: Package, min: 0, max: 2000, step: 10 },
            { key: "vetCostPerHead", label: "Vet / Health", icon: Stethoscope, min: 0, max: 200, step: 5 },
            { key: "transportCostPerHead", label: "Transport", icon: Truck, min: 0, max: 200, step: 5 },
            { key: "miscCostPerHead", label: "Misc / Insurance", icon: Package, min: 0, max: 200, step: 5 },
          ].map(({ key, label, icon: Icon, min, max, step }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <Label className="text-sm">{label}</Label>
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">${inputs[key]}</span>
              </div>
              <Slider value={[inputs[key]]} onValueChange={([v]) => set(key, v)} min={min} max={max} step={step} />
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm">Death Loss Rate</Label>
              <span className="font-mono text-sm font-semibold text-foreground">{inputs.deathLossRate}%</span>
            </div>
            <Slider value={[inputs.deathLossRate]} onValueChange={([v]) => set("deathLossRate", v)} min={0} max={15} step={0.5} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm">Days on Feed</Label>
              <span className="font-mono text-sm font-semibold text-foreground">{inputs.daysOnFeed}</span>
            </div>
            <Slider value={[inputs.daysOnFeed]} onValueChange={([v]) => set("daysOnFeed", v)} min={30} max={365} step={5} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <TrendingUp className="w-4 h-4 text-drill-green" />
          <h2 className="text-sm font-bold text-foreground">Results</h2>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {Math.round(results.effectiveHead)} effective head
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-xl border border-border ${bg} px-3 py-2.5`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3 h-3 ${color}`} />
                <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
              </div>
              <p className={`font-mono font-bold text-base leading-tight ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Cost breakdown chart */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Cost Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={results.costBreakdown} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                formatter={v => [`$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, "Cost"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {results.costBreakdown.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-head breakdown */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground mb-2">Per-Head Economics</p>
          {[
            { label: "Purchase Cost", value: fmtDec(inputs.purchaseWeight * inputs.purchasePrice) },
            { label: "Feed", value: fmtDec(inputs.feedCostPerHead) },
            { label: "Vet / Health", value: fmtDec(inputs.vetCostPerHead) },
            { label: "Transport", value: fmtDec(inputs.transportCostPerHead) },
            { label: "Misc", value: fmtDec(inputs.miscCostPerHead) },
            { label: "Total Cost/Head", value: fmtDec(results.costPerHead), bold: true },
            { label: "Revenue/Head", value: fmtDec(results.revenuePerHead), bold: true },
            { label: "Profit/Head", value: `${results.profitPerHead >= 0 ? "" : "−"}${fmtDec(Math.abs(results.profitPerHead))}`, bold: true, color: results.profitPerHead >= 0 ? "text-drill-green" : "text-flare-red" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className={`text-xs ${item.bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
              <span className={`font-mono text-xs ${item.bold ? "font-bold" : "font-medium"} ${item.color || "text-foreground"}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <CalcActionBar
        calcType="livestock"
        inputs={inputs}
        results={{
          totalRevenue: results.totalRevenue,
          totalCost: results.totalCost,
          netProfit: results.netProfit,
          profitPerHead: results.profitPerHead,
          roi: results.roi,
          breakEvenPrice: results.breakEvenPrice,
          effectiveHead: results.effectiveHead,
        }}
      />

      <DisclaimerFooter />
    </div>
  );
}