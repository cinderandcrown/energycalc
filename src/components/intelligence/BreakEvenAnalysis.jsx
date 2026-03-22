import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Target } from "lucide-react";

export default function BreakEvenAnalysis({ calc, liveOilPrice, liveGasPrice }) {
  const analysis = useMemo(() => {
    if (!calc?.inputs || !calc?.results) return null;
    const { calc_type, inputs } = calc;

    if (calc_type === "barrels_to_cash") {
      const { workingInterest, netRevenueInterest, dailyBOPD, loePerBbl, severanceTaxRate } = inputs;
      const monthlyBbl = dailyBOPD * 30.44;

      // Break-even = price where net monthly = 0
      // net = (monthlyBbl * price * WI * NRI) - (monthlyBbl * LOE * WI) - (monthlyBbl * price * WI * sevTax)
      // 0 = monthlyBbl * WI * price * (NRI - sevTax) - monthlyBbl * WI * LOE
      // price = LOE / (NRI - sevTax)
      const breakEvenPrice = loePerBbl / (netRevenueInterest - severanceTaxRate);

      // Build sensitivity curve: price vs monthly net
      const points = [];
      for (let p = 30; p <= 150; p += 2) {
        const gross = monthlyBbl * p * workingInterest * netRevenueInterest;
        const opex = monthlyBbl * loePerBbl * workingInterest;
        const sev = monthlyBbl * p * workingInterest * severanceTaxRate;
        points.push({ price: p, net: gross - opex - sev });
      }

      return {
        type: "oil",
        breakEvenPrice: breakEvenPrice > 0 ? breakEvenPrice : 0,
        livePrice: liveOilPrice,
        unit: "$/bbl",
        points,
        savedPrice: inputs.oilPrice,
        liveNet: (() => {
          if (!liveOilPrice) return null;
          const gross = monthlyBbl * liveOilPrice * workingInterest * netRevenueInterest;
          const opex = monthlyBbl * loePerBbl * workingInterest;
          const sev = monthlyBbl * liveOilPrice * workingInterest * severanceTaxRate;
          return gross - opex - sev;
        })(),
        savedNet: calc.results.netMonthly,
      };
    }

    if (calc_type === "natgas_to_cash") {
      const { workingInterest, netRevenueInterest, dailyMCF, gatheringFee, loePerMCF, severanceTaxRate } = inputs;
      const monthlyMCF = dailyMCF * 30.44;

      // net = monthlyMCF * price * WI * NRI - monthlyMCF * gathering * WI * NRI - monthlyMCF * LOE * WI - monthlyMCF * price * WI * sevTax
      // 0 = monthlyMCF * WI * [price * (NRI - sevTax) - gathering * NRI - LOE]
      // price = (gathering * NRI + LOE) / (NRI - sevTax)
      const breakEvenPrice = (gatheringFee * netRevenueInterest + loePerMCF) / (netRevenueInterest - severanceTaxRate);

      const points = [];
      for (let p = 1; p <= 12; p += 0.2) {
        const gross = monthlyMCF * p * workingInterest * netRevenueInterest;
        const gather = monthlyMCF * gatheringFee * workingInterest * netRevenueInterest;
        const opex = monthlyMCF * loePerMCF * workingInterest;
        const sev = monthlyMCF * p * workingInterest * severanceTaxRate;
        points.push({ price: Math.round(p * 100) / 100, net: gross - gather - opex - sev });
      }

      return {
        type: "gas",
        breakEvenPrice: breakEvenPrice > 0 ? breakEvenPrice : 0,
        livePrice: liveGasPrice,
        unit: "$/MCF",
        points,
        savedPrice: inputs.gasPrice,
        liveNet: (() => {
          if (!liveGasPrice) return null;
          const gross = monthlyMCF * liveGasPrice * workingInterest * netRevenueInterest;
          const gather = monthlyMCF * gatheringFee * workingInterest * netRevenueInterest;
          const opex = monthlyMCF * loePerMCF * workingInterest;
          const sev = monthlyMCF * liveGasPrice * workingInterest * severanceTaxRate;
          return gross - gather - opex - sev;
        })(),
        savedNet: calc.results.netMonthly,
      };
    }

    return null;
  }, [calc, liveOilPrice, liveGasPrice]);

  if (!analysis) return null;

  const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const delta = analysis.liveNet != null ? analysis.liveNet - analysis.savedNet : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-crude-gold" />
        <h3 className="text-sm font-bold text-foreground">Break-Even & Price Sensitivity</h3>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Break-Even Price</p>
          <p className="font-mono font-bold text-foreground">${analysis.breakEvenPrice.toFixed(2)}</p>
          <p className="text-[9px] text-muted-foreground">{analysis.unit}</p>
        </div>
        <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Live Price</p>
          <p className="font-mono font-bold text-foreground">{analysis.livePrice ? `$${analysis.livePrice.toFixed(2)}` : "—"}</p>
          <p className="text-[9px] text-muted-foreground">{analysis.unit}</p>
        </div>
        <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Saved Model Price</p>
          <p className="font-mono font-bold text-foreground">${analysis.savedPrice?.toFixed(2)}</p>
          <p className="text-[9px] text-muted-foreground">{analysis.unit}</p>
        </div>
        <div className={`rounded-lg border px-3 py-2 ${delta != null && delta >= 0 ? "bg-drill-green/10 border-drill-green/30" : delta != null ? "bg-flare-red/10 border-flare-red/30" : "bg-muted/40 border-border"}`}>
          <p className="text-[10px] text-muted-foreground">Net Income Shift</p>
          <p className={`font-mono font-bold ${delta != null && delta >= 0 ? "text-drill-green" : delta != null ? "text-flare-red" : "text-foreground"}`}>
            {delta != null ? `${delta >= 0 ? "+" : "−"}${fmt(delta)}/mo` : "—"}
          </p>
          <p className="text-[9px] text-muted-foreground">vs saved model</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={analysis.points} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="price"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => `$${v}`}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(v) => [`$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo`, "Net Income"]}
            labelFormatter={(l) => `${analysis.type === "oil" ? "Oil" : "Gas"} Price: $${l}`}
          />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Break-Even", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          {analysis.livePrice && (
            <ReferenceLine x={analysis.livePrice} stroke="#D4A843" strokeDasharray="4 4" label={{ value: "Live", position: "top", fontSize: 10, fill: "#D4A843" }} />
          )}
          {analysis.savedPrice && (
            <ReferenceLine x={analysis.savedPrice} stroke="#6B7280" strokeDasharray="4 4" label={{ value: "Saved", position: "top", fontSize: 10, fill: "#6B7280" }} />
          )}
          <Line type="monotone" dataKey="net" stroke="#2E7D32" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}