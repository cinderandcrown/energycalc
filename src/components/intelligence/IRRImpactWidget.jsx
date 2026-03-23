import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

function calculateIRR(cashFlows, guess = 0.01) {
  let r = guess;
  for (let i = 0; i < 100; i++) {
    let npv = 0, dnpv = 0;
    cashFlows.forEach((cf, t) => {
      npv += cf / Math.pow(1 + r, t);
      dnpv -= t * cf / Math.pow(1 + r, t + 1);
    });
    const newR = r - npv / dnpv;
    if (Math.abs(newR - r) < 1e-7) return newR;
    r = newR;
  }
  return r;
}

function computeIRRAtPrice(calc, oilPrice, gasPrice) {
  const { calc_type, inputs } = calc;
  if (calc_type !== "rate_of_return") return null;
  const { netInvestment, monthlyOilIncome, monthlyGasIncome, timeHorizon, annualDeclineRate } = inputs;
  const savedOilPrice = calc._savedOilPrice || 70;
  const savedGasPrice = calc._savedGasPrice || 3.5;
  const oilScale = oilPrice / savedOilPrice;
  const gasScale = gasPrice / savedGasPrice;
  const scaledOil = monthlyOilIncome * oilScale;
  const scaledGas = monthlyGasIncome * gasScale;
  const combined = scaledOil + scaledGas;
  const cashFlows = [-netInvestment];
  let totalRev = 0;
  let payoutMonth = null;
  let cum = -netInvestment;
  for (let m = 1; m <= timeHorizon; m++) {
    const monthly = combined * Math.pow(1 - annualDeclineRate, m / 12);
    cashFlows.push(monthly);
    totalRev += monthly;
    cum += monthly;
    if (payoutMonth === null && cum >= 0) payoutMonth = m;
  }
  let annualIRR = null;
  try {
    const mIRR = calculateIRR(cashFlows);
    annualIRR = (Math.pow(1 + mIRR, 12) - 1) * 100;
  } catch (e) { /* */ }
  return { annualIRR, totalRev, payoutMonth, combined };
}

export default function IRRImpactWidget({ calc, liveOilPrice, liveGasPrice }) {
  const scenarios = useMemo(() => {
    if (!calc || calc.calc_type !== "rate_of_return") return null;
    const baseOil = liveOilPrice || 70;
    const baseGas = liveGasPrice || 3.5;
    const scenarioList = [
      { label: "−20%", oilMult: 0.8, gasMult: 0.8 },
      { label: "−10%", oilMult: 0.9, gasMult: 0.9 },
      { label: "Live", oilMult: 1.0, gasMult: 1.0, highlight: true },
      { label: "+10%", oilMult: 1.1, gasMult: 1.1 },
      { label: "+20%", oilMult: 1.2, gasMult: 1.2 },
    ];
    return scenarioList.map((s) => {
      const result = computeIRRAtPrice(calc, baseOil * s.oilMult, baseGas * s.gasMult);
      return { ...s, irr: result?.annualIRR ?? 0, payout: result?.payoutMonth ?? null, totalRev: result?.totalRev ?? 0 };
    });
  }, [calc, liveOilPrice, liveGasPrice]);

  if (!scenarios) return null;

  const savedIRR = calc.results?.annualIRR ?? 0;
  const liveScenario = scenarios.find((s) => s.highlight);
  const irrDelta = (liveScenario?.irr ?? 0) - savedIRR;
  const irrUp = irrDelta >= 0;

  const summaryMetrics = [
    {
      label: "Saved Model IRR",
      value: `${savedIRR.toFixed(1)}%`,
      icon: TrendingUp,
      style: "bg-muted/40 border-border",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Live-Price IRR",
      value: `${(liveScenario?.irr ?? 0).toFixed(1)}%`,
      icon: irrUp ? ArrowUpRight : ArrowDownRight,
      style: irrUp ? "bg-drill-green/10 border-drill-green/30" : "bg-flare-red/10 border-flare-red/30",
      iconColor: irrUp ? "text-drill-green" : "text-flare-red",
    },
    {
      label: "Payout Month",
      value: liveScenario?.payout ? `Mo ${liveScenario.payout}` : "N/A",
      icon: Clock,
      style: "bg-muted/40 border-border",
      iconColor: "text-muted-foreground",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/30 border-b border-border">
        <TrendingUp className="w-4 h-4 text-drill-green" />
        <h3 className="text-sm font-bold text-foreground">IRR Impact — Price Sensitivity</h3>
        <span className="ml-auto text-[10px] text-muted-foreground font-medium">Rate of Return Model</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {summaryMetrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                className={`rounded-xl border px-3 py-2.5 ${m.style}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3 h-3 ${m.iconColor}`} />
                  <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                </div>
                <p className="font-mono font-bold text-foreground text-lg leading-tight">{m.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* IRR Delta callout */}
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
          irrUp ? "bg-drill-green/5 border border-drill-green/20" : "bg-flare-red/5 border border-flare-red/20"
        }`}>
          {irrUp ? <ArrowUpRight className="w-5 h-5 text-drill-green" /> : <ArrowDownRight className="w-5 h-5 text-flare-red" />}
          <div>
            <p className={`text-sm font-bold ${irrUp ? "text-drill-green" : "text-flare-red"}`}>
              IRR {irrUp ? "up" : "down"} {Math.abs(irrDelta).toFixed(2)} percentage points
            </p>
            <p className="text-[11px] text-muted-foreground">
              At live market prices vs your original saved assumptions
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scenarios} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                formatter={(v) => [`${v.toFixed(2)}%`, "IRR"]}
              />
              <ReferenceLine y={savedIRR} stroke="#6B7280" strokeDasharray="4 4" label={{ value: `Saved: ${savedIRR.toFixed(1)}%`, position: "right", fontSize: 9, fill: "#6B7280" }} />
              <Bar dataKey="irr" radius={[6, 6, 0, 0]}>
                {scenarios.map((s, i) => (
                  <Cell key={i} fill={s.highlight ? "#D4A843" : s.irr >= savedIRR ? "#2E7D32" : "#C62828"} opacity={s.highlight ? 1 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Shows how your IRR changes if commodity prices shift ±10–20% from today's live market price. The gold bar represents your IRR at current live prices. Gray dashed line = your original saved model.
        </p>
      </div>
    </motion.div>
  );
}