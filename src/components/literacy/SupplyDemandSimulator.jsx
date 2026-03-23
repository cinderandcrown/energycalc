import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3, Info } from "lucide-react";

const BASE_PRICE = 70;
const BASE_SUPPLY = 100; // million bbl/day
const BASE_DEMAND = 100;

function generatePriceData(supplyShift, demandShift, disruption) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const supplyFactor = (BASE_SUPPLY + supplyShift) / BASE_SUPPLY;
  const demandFactor = (BASE_DEMAND + demandShift) / BASE_DEMAND;
  const disruptionFactor = 1 + (disruption / 100);

  return months.map((month, i) => {
    const seasonal = 1 + Math.sin((i - 3) * Math.PI / 6) * 0.03;
    const noise = 1 + (Math.sin(i * 2.1) * 0.015);
    const rawPrice = BASE_PRICE * (demandFactor / supplyFactor) * disruptionFactor * seasonal * noise;
    return {
      month,
      price: Math.round(rawPrice * 100) / 100,
      baseline: BASE_PRICE,
    };
  });
}

export default function SupplyDemandSimulator() {
  const [supplyShift, setSupplyShift] = useState(0);
  const [demandShift, setDemandShift] = useState(0);
  const [disruption, setDisruption] = useState(0);

  const data = useMemo(
    () => generatePriceData(supplyShift, demandShift, disruption),
    [supplyShift, demandShift, disruption]
  );

  const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;
  const pctChange = ((avgPrice - BASE_PRICE) / BASE_PRICE) * 100;
  const direction = pctChange > 1 ? "up" : pctChange < -1 ? "down" : "neutral";

  const presets = [
    { label: "OPEC Cuts Production", supply: -5, demand: 0, disruption: 0 },
    { label: "Global Recession", supply: 0, demand: -8, disruption: 0 },
    { label: "Supply Glut", supply: 8, demand: 0, disruption: 0 },
    { label: "Geopolitical Crisis", supply: -3, demand: 0, disruption: 15 },
    { label: "EV Adoption Surge", supply: 0, demand: -5, disruption: 0 },
    { label: "Cold Winter + OPEC Cut", supply: -4, demand: 6, disruption: 5 },
  ];

  const applyPreset = (p) => {
    setSupplyShift(p.supply);
    setDemandShift(p.demand);
    setDisruption(p.disruption);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary dark:text-accent" />
          <h3 className="font-semibold text-foreground text-sm">Supply & Demand Simulator</h3>
          <Badge variant="outline" className="text-[10px] ml-auto">Interactive</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Adjust variables to see how supply, demand, and disruptions mechanically affect commodity prices. This is economics, not advice.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Presets */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">Quick Scenarios</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 dark:hover:border-accent/30 hover:bg-primary/5 dark:hover:bg-accent/5 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SliderControl
            label="Global Supply"
            value={supplyShift}
            onChange={(v) => setSupplyShift(v[0])}
            min={-15}
            max={15}
            unit="M bbl/day"
            description="OPEC decisions, shale output, new discoveries"
          />
          <SliderControl
            label="Global Demand"
            value={demandShift}
            onChange={(v) => setDemandShift(v[0])}
            min={-15}
            max={15}
            unit="M bbl/day"
            description="Economic growth, EV adoption, seasonal"
          />
          <SliderControl
            label="Disruption Premium"
            value={disruption}
            onChange={(v) => setDisruption(v[0])}
            min={0}
            max={40}
            unit="%"
            description="Wars, sanctions, pipeline outages, weather"
          />
        </div>

        {/* Result */}
        <div className="grid grid-cols-3 gap-3">
          <ResultCard
            label="Projected Avg Price"
            value={`$${avgPrice.toFixed(2)}`}
            sub="/bbl"
            direction={direction}
          />
          <ResultCard
            label="vs. Baseline ($70)"
            value={`${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%`}
            sub={`$${(avgPrice - BASE_PRICE).toFixed(2)}`}
            direction={direction}
          />
          <ResultCard
            label="Market Regime"
            value={direction === "up" ? "Tight" : direction === "down" ? "Oversupplied" : "Balanced"}
            sub={direction === "up" ? "Demand > Supply" : direction === "down" ? "Supply > Demand" : "Equilibrium"}
            direction={direction}
          />
        </div>

        {/* Chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`$${v.toFixed(2)}`, ""]}
              />
              <ReferenceLine y={BASE_PRICE} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Baseline $70", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="price" stroke="#D4A843" fill="url(#priceGrad)" strokeWidth={2} name="Price" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Educational callout */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2.5">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Economic principle:</strong> When demand exceeds supply, prices rise as buyers compete for scarce resources. 
            When supply exceeds demand, prices fall as sellers compete for fewer buyers. Disruption premiums reflect uncertainty — markets price in fear 
            of potential shortages even before they happen. These are mechanical relationships, not predictions or recommendations.
          </p>
        </div>

        <button
          onClick={() => { setSupplyShift(0); setDemandShift(0); setDisruption(0); }}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Reset to baseline
        </button>
      </div>
    </div>
  );
}

function SliderControl({ label, value, onChange, min, max, unit, description }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <span className="font-mono text-xs text-foreground font-bold">
          {value >= 0 ? "+" : ""}{value} {unit}
        </span>
      </div>
      <Slider value={[value]} onValueChange={onChange} min={min} max={max} step={1} />
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

function ResultCard({ label, value, sub, direction }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const color = direction === "up" ? "text-drill-green" : direction === "down" ? "text-flare-red" : "text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <p className={`font-mono font-bold text-base ${color}`}>{value}</p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}