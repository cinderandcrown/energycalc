import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { Target, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function BreakEvenAnalysis({ calc, liveOilPrice, liveGasPrice }) {
  const analysis = useMemo(() => {
    if (!calc?.inputs || !calc?.results) return null;
    const { calc_type, inputs } = calc;

    if (calc_type === "barrels_to_cash") {
      const { workingInterest, netRevenueInterest, dailyBOPD, loePerBbl, severanceTaxRate } = inputs;
      const monthlyBbl = dailyBOPD * 30.44;
      const breakEvenPrice = loePerBbl / (netRevenueInterest - severanceTaxRate);
      const points = [];
      for (let p = 30; p <= 150; p += 2) {
        const gross = monthlyBbl * p * workingInterest * netRevenueInterest;
        const opex = monthlyBbl * loePerBbl * workingInterest;
        const sev = monthlyBbl * p * workingInterest * severanceTaxRate;
        points.push({ price: p, net: gross - opex - sev });
      }
      return {
        type: "oil", breakEvenPrice: breakEvenPrice > 0 ? breakEvenPrice : 0,
        livePrice: liveOilPrice, unit: "$/bbl", points, savedPrice: inputs.oilPrice,
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
        type: "gas", breakEvenPrice: breakEvenPrice > 0 ? breakEvenPrice : 0,
        livePrice: liveGasPrice, unit: "$/MCF", points, savedPrice: inputs.gasPrice,
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

  const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const delta = analysis.liveNet != null ? analysis.liveNet - analysis.savedNet : null;
  const deltaUp = delta != null && delta >= 0;
  const marginOfSafety = analysis.livePrice && analysis.breakEvenPrice > 0
    ? ((analysis.livePrice - analysis.breakEvenPrice) / analysis.breakEvenPrice * 100)
    : null;

  const metrics = [
    {
      label: "Break-Even",
      value: `$${analysis.breakEvenPrice.toFixed(2)}`,
      sub: analysis.unit,
      icon: Target,
      style: "bg-muted/40 border-border",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Live Price",
      value: analysis.livePrice ? `$${analysis.livePrice.toFixed(2)}` : "—",
      sub: analysis.unit,
      icon: DollarSign,
      style: "bg-crude-gold/5 border-crude-gold/20",
      iconColor: "text-crude-gold",
    },
    {
      label: "Margin of Safety",
      value: marginOfSafety != null ? `${marginOfSafety >= 0 ? "+" : ""}${marginOfSafety.toFixed(1)}%` : "—",
      sub: "above break-even",
      icon: TrendingUp,
      style: marginOfSafety != null && marginOfSafety >= 0 ? "bg-drill-green/5 border-drill-green/20" : "bg-flare-red/5 border-flare-red/20",
      iconColor: marginOfSafety != null && marginOfSafety >= 0 ? "text-drill-green" : "text-flare-red",
    },
    {
      label: "Net Income Shift",
      value: delta != null ? `${deltaUp ? "+" : "−"}${fmt(delta)}/mo` : "—",
      sub: "vs saved model",
      icon: deltaUp ? ArrowUpRight : ArrowDownRight,
      style: deltaUp ? "bg-drill-green/10 border-drill-green/30" : delta != null ? "bg-flare-red/10 border-flare-red/30" : "bg-muted/40 border-border",
      iconColor: deltaUp ? "text-drill-green" : delta != null ? "text-flare-red" : "text-muted-foreground",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/30 border-b border-border">
        <Target className="w-4 h-4 text-crude-gold" />
        <h3 className="text-sm font-bold text-foreground">Break-Even & Price Sensitivity</h3>
        <span className="ml-auto text-[10px] text-muted-foreground font-medium">{analysis.type === "oil" ? "Oil" : "Natural Gas"} Model</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {metrics.map((m, i) => {
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
                <p className="font-mono font-bold text-foreground text-base leading-tight">{m.value}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{m.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analysis.points} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="price" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => v >= 1000 || v <= -1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                formatter={(v) => [`$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo`, "Net Income"]}
                labelFormatter={(l) => `${analysis.type === "oil" ? "Oil" : "Gas"} Price: $${l}`}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.5} />
              {analysis.livePrice && (
                <ReferenceLine x={analysis.livePrice} stroke="#D4A843" strokeWidth={2} strokeDasharray="6 4" label={{ value: "LIVE", position: "top", fontSize: 9, fontWeight: 700, fill: "#D4A843" }} />
              )}
              {analysis.savedPrice && (
                <ReferenceLine x={analysis.savedPrice} stroke="#6B7280" strokeDasharray="4 4" label={{ value: "Saved", position: "top", fontSize: 9, fill: "#6B7280" }} />
              )}
              <Area type="monotone" dataKey="net" stroke="#2E7D32" strokeWidth={2.5} fill="url(#netFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}