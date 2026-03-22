import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

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

  // Scale income proportionally to price change
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
      { label: "Live Price", oilMult: 1.0, gasMult: 1.0, highlight: true },
      { label: "+10%", oilMult: 1.1, gasMult: 1.1 },
      { label: "+20%", oilMult: 1.2, gasMult: 1.2 },
    ];

    return scenarioList.map((s) => {
      const result = computeIRRAtPrice(
        calc,
        baseOil * s.oilMult,
        baseGas * s.gasMult
      );
      return {
        ...s,
        irr: result?.annualIRR ?? 0,
        payout: result?.payoutMonth ?? null,
        totalRev: result?.totalRev ?? 0,
      };
    });
  }, [calc, liveOilPrice, liveGasPrice]);

  if (!scenarios) return null;

  const savedIRR = calc.results?.annualIRR ?? 0;
  const liveScenario = scenarios.find((s) => s.highlight);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-drill-green" />
        <h3 className="text-sm font-bold text-foreground">IRR Impact — Price Sensitivity</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Saved IRR</p>
          <p className="font-mono font-bold text-foreground">{savedIRR.toFixed(2)}%</p>
        </div>
        <div className={`rounded-lg border px-3 py-2 ${(liveScenario?.irr ?? 0) >= savedIRR ? "bg-drill-green/10 border-drill-green/30" : "bg-flare-red/10 border-flare-red/30"}`}>
          <p className="text-[10px] text-muted-foreground">Live-Price IRR</p>
          <p className={`font-mono font-bold ${(liveScenario?.irr ?? 0) >= savedIRR ? "text-drill-green" : "text-flare-red"}`}>
            {(liveScenario?.irr ?? 0).toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Live Payout</p>
          <p className="font-mono font-bold text-foreground">
            {liveScenario?.payout ? `Mo ${liveScenario.payout}` : "N/A"}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={scenarios} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(v) => [`${v.toFixed(2)}%`, "IRR"]}
          />
          <ReferenceLine y={savedIRR} stroke="#6B7280" strokeDasharray="4 4" label={{ value: `Saved: ${savedIRR.toFixed(1)}%`, position: "right", fontSize: 9, fill: "#6B7280" }} />
          <Bar dataKey="irr" radius={[4, 4, 0, 0]}>
            {scenarios.map((s, i) => (
              <Cell key={i} fill={s.highlight ? "#D4A843" : s.irr >= savedIRR ? "#2E7D32" : "#C62828"} opacity={s.highlight ? 1 : 0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Shows how your IRR changes if commodity prices shift ±10–20% from today's live market price. The gold bar represents your IRR at current live prices. Gray dashed line = your original saved model.
      </p>
    </div>
  );
}