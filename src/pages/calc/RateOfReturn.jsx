import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, LineChart, Line } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import { Badge } from "@/components/ui/badge";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import GeoDueDiligence from "@/components/calc/GeoDueDiligence";
import AIWellEvaluator from "@/components/calc/AIWellEvaluator";
import RateOfReturnExplainers from "@/components/calc/RateOfReturnExplainers";
import { motion } from "framer-motion";

const DEFAULTS = {
  netInvestment: 250000,
  monthlyOilIncome: 2000,
  monthlyGasIncome: 500,
  timeHorizon: 60,
  annualDeclineRate: 0.15,
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Newton-Raphson IRR
function calculateIRR(cashFlows, guess = 0.01) {
  let r = guess;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dnpv = 0;
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

export default function RateOfReturn() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    const { netInvestment, monthlyOilIncome, monthlyGasIncome, timeHorizon, annualDeclineRate } = inputs;
    const combinedMonthly = monthlyOilIncome + monthlyGasIncome;

    // Monthly cashflows
    const cashFlows = [-netInvestment];
    const chartData = [];
    let cumulative = -netInvestment;
    let payoutMonth = null;
    let totalRevenue = 0;

    // S&P 500 avg ~10.5% annual → ~0.836% monthly
    const sp500Monthly = 0.00836;

    for (let m = 1; m <= timeHorizon; m++) {
      const monthly = combinedMonthly * Math.pow(1 - annualDeclineRate, m / 12);
      cashFlows.push(monthly);
      totalRevenue += monthly;
      cumulative += monthly;

      // SP500 equivalent: invest the same dollars, track cumulative net gain/loss
      // Value = Investment × (1+r)^m, net P&L = Value - Investment, cumulative = net - initial
      const sp500Value = netInvestment * Math.pow(1 + sp500Monthly, m) - netInvestment;

      if (payoutMonth === null && cumulative >= 0) {
        payoutMonth = m;
      }
      chartData.push({
        month: `M${m}`,
        cumulative: cumulative,
        sp500: sp500Value,
        monthlyIncome: monthly,
      });
    }

    const simpleROI = ((totalRevenue - netInvestment) / netInvestment) * 100;
    // Cash-on-cash uses initial month income (before decline) as a snapshot metric
    const monthlyCashOnCash = (combinedMonthly / netInvestment) * 100;
    // Simple annualized return: total net profit / investment / years × 100
    // This is an average annual return on invested capital (not compounded).
    // For compounded return, use IRR above.
    const years = timeHorizon / 12;
    const netProfit = totalRevenue - netInvestment;
    const annualizedReturn = years > 0 && netInvestment > 0 ? (netProfit / netInvestment / years) * 100 : 0;

    // IRR (monthly, annualize)
    let monthlyIRR = null;
    let annualIRR = null;
    try {
      monthlyIRR = calculateIRR(cashFlows);
      annualIRR = (Math.pow(1 + monthlyIRR, 12) - 1) * 100;
    } catch (e) {
      annualIRR = null;
    }

    const isPaidOut = payoutMonth !== null && payoutMonth <= timeHorizon;

    return {
      combinedMonthly,
      totalRevenue,
      simpleROI,
      payoutMonth,
      monthlyCashOnCash,
      annualizedReturn,
      annualIRR,
      isPaidOut,
      chartData,
      monthsRemaining: isPaidOut ? null : "N/A in timeframe",
    };
  }, [inputs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Rate of Return Calculator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Full IRR, payout period, and ROI on your energy investment</p>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} calcType="rate_of_return" inputs={inputs} results={results} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Investment Parameters</h2>

          <InputWithSlider
            label="Net Investment Amount ($)"
            value={inputs.netInvestment}
            onChange={set("netInvestment")}
            min={10000} max={5000000} step={5000} prefix="$"
            tooltip="Your actual out-of-pocket cost after tax savings. Use the Net Investment Calculator to compute this precisely."
          />
          <InputWithSlider
            label="Monthly Oil Income ($)"
            value={inputs.monthlyOilIncome}
            onChange={set("monthlyOilIncome")}
            min={0} max={100000} step={100} prefix="$"
            tooltip="Your net monthly oil income from the Barrels to Cash calculator."
          />
          <InputWithSlider
            label="Monthly Gas Income ($)"
            value={inputs.monthlyGasIncome}
            onChange={set("monthlyGasIncome")}
            min={0} max={100000} step={100} prefix="$"
            tooltip="Your net monthly natural gas income from the Gas to Cash calculator."
          />

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Combined Monthly Income:</strong>{" "}
              <span className="font-mono text-foreground">${inputs.monthlyOilIncome + inputs.monthlyGasIncome > 0 ? (inputs.monthlyOilIncome + inputs.monthlyGasIncome).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}</span>
            </p>
          </div>

          <InputWithSlider
            label="Time Horizon (months)"
            value={inputs.timeHorizon}
            onChange={set("timeHorizon")}
            min={12} max={120} step={6}
            tooltip="How long you expect to hold this investment. Most oil and gas investments are evaluated over 5–10 years."
          />
          <InputWithSlider
            label="Annual Production Decline (%)"
            value={inputs.annualDeclineRate * 100}
            onChange={(v) => set("annualDeclineRate")(v / 100)}
            min={0} max={50} step={1} suffix="%"
            tooltip="Expected annual decline in production — decreases your monthly income over time."
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Payout Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-4 border-2 flex items-center justify-between ${
              results.isPaidOut
                ? "border-drill-green/50 bg-drill-green/10"
                : "border-crude-gold/50 bg-crude-gold/10"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payout Status</p>
              <p className={`text-lg font-bold mt-0.5 ${results.isPaidOut ? "text-drill-green" : "text-crude-gold"}`}>
                {results.isPaidOut ? `PAID OUT — Month ${results.payoutMonth}` : "NOT RECOVERED IN TIMEFRAME"}
              </p>
            </div>
            <Badge className={`text-sm px-3 py-1 ${results.isPaidOut ? "bg-drill-green text-white" : "bg-crude-gold text-petroleum"}`}>
              {results.isPaidOut ? "✓ PAID OUT" : "IN PROGRESS"}
            </Badge>
          </motion.div>

          <HeroResultCard
            label="Simple ROI"
            value={results.simpleROI}
            prefix=""
            suffix="%"
            sublabel={`Total Revenue: $${fmt(results.totalRevenue)}`}
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total Revenue" value={results.totalRevenue} positive={results.totalRevenue > inputs.netInvestment} />
            <ResultCard label="Monthly Cash-on-Cash" value={results.monthlyCashOnCash} prefix="" suffix="%" />
            <ResultCard label="Avg. Annual Return" value={results.annualizedReturn} prefix="" suffix="%" positive={results.annualizedReturn > 0} />
            <ResultCard
              label="IRR (Annual)"
              value={results.annualIRR ?? 0}
              prefix=""
              suffix="%"
              positive={results.annualIRR !== null && results.annualIRR > 0}
            />
          </div>

          <RateOfReturnExplainers inputs={inputs} results={results} />
        </div>
      </div>

      {/* Cumulative Cash Flow Chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Cumulative Cash Flow vs S&P 500 Equivalent</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(inputs.timeHorizon / 6)} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => {
                const labels = { cumulative: "Cumulative Cash Flow", sp500: "S&P 500 Equiv.", monthlyIncome: "Monthly Income" };
                return [`$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, labels[name] || name];
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
            <Legend iconType="circle" iconSize={8} formatter={(v) => {
              const l = { cumulative: "Cumulative Cash Flow", sp500: "S&P 500 Equiv." };
              return <span className="text-xs">{l[v] || v}</span>;
            }} />
            <Line type="monotone" dataKey="cumulative" stroke="#2E7D32" strokeWidth={2.5} dot={false} name="cumulative" />
            <Line type="monotone" dataKey="sp500" stroke="#6B7280" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="sp500" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <GeoDueDiligence calcType="rate_of_return" />
      <AIWellEvaluator />
      <DisclaimerFooter />

      <SaveCalcModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        calcType="rate_of_return"
        inputs={inputs}
        results={{ ...results, chartData: undefined }}
      />
    </div>
  );
}