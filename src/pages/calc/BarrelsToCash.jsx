import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import GeoDueDiligence from "@/components/calc/GeoDueDiligence";
import AIWellEvaluator from "@/components/calc/AIWellEvaluator";

const DEFAULTS = {
  workingInterest: 0.01,
  netRevenueInterest: 0.75,
  dailyBOPD: 50,
  oilPrice: 70,
  loePerBbl: 15,
  severanceTaxRate: 0.046,
  declineRate: 0.15,
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function BarrelsToCash() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    const { workingInterest, netRevenueInterest, dailyBOPD, oilPrice, loePerBbl, severanceTaxRate, declineRate } = inputs;

    // dailyBOPD = total well production (not your share)
    const monthlyProdBbl = dailyBOPD * 30.44;
    const grossRevenue = monthlyProdBbl * oilPrice;
    // Severance tax is levied on gross wellhead revenue × WI share (before royalty deduction in most states)
    const wiGrossRevenue = grossRevenue * workingInterest;
    const severanceTax = wiGrossRevenue * severanceTaxRate;
    // NRI determines your actual revenue share after royalties
    const yourGross = grossRevenue * workingInterest * netRevenueInterest;
    // LOE is borne by WI holders proportional to their WI
    const operatingExpenses = monthlyProdBbl * loePerBbl * workingInterest;
    const netMonthly = yourGross - operatingExpenses - severanceTax;
    const netAnnual = netMonthly * 12;

    // 60-month decline curve
    const months = Array.from({ length: 61 }, (_, m) => {
      const prod = dailyBOPD * Math.pow(1 - declineRate, m / 12);
      const mProd = prod * 30.44;
      const mGross = mProd * oilPrice * workingInterest * netRevenueInterest;
      const mWIGross = mProd * oilPrice * workingInterest;
      const mOpex = mProd * loePerBbl * workingInterest;
      const mSev = mWIGross * severanceTaxRate;
      const mNet = mGross - mOpex - mSev;
      return {
        month: m,
        label: m === 0 ? "Now" : `M${m}`,
        netIncome: Math.max(0, mNet),
        grossRevenue: Math.max(0, mGross),
      };
    });

    // 5-year table — sum each month within the year for accuracy
    const yearlyTable = [1, 2, 3, 4, 5].map((yr) => {
      let annualNet = 0;
      const startMonth = (yr - 1) * 12;
      for (let m = startMonth; m < startMonth + 12; m++) {
        const prod = dailyBOPD * Math.pow(1 - declineRate, m / 12);
        const mProd = prod * 30.44;
        const mGross = mProd * oilPrice * workingInterest * netRevenueInterest;
        const mWIGross = mProd * oilPrice * workingInterest;
        const mOpex = mProd * loePerBbl * workingInterest;
        const mSev = mWIGross * severanceTaxRate;
        annualNet += Math.max(0, mGross - mOpex - mSev);
      }
      const avgProd = dailyBOPD * Math.pow(1 - declineRate, (startMonth + 6) / 12);
      return { year: yr, dailyProd: avgProd.toFixed(1), monthlyNet: annualNet / 12, annualNet };
    });

    return { yourGross, operatingExpenses, severanceTax, netMonthly, netAnnual, months, yearlyTable };
  }, [inputs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Oil (Barrels) to Cash</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Convert BOPD production into working interest monthly income</p>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Well Parameters</h2>

          <InputWithSlider
            label="Working Interest (%)"
            value={inputs.workingInterest * 100}
            onChange={(v) => set("workingInterest")(v / 100)}
            min={0.1} max={100} step={0.1} suffix="%"
            tooltip="Your ownership percentage of the well's costs and production. If you own 1% WI, you pay 1% of costs and receive 1% of production."
          />
          <InputWithSlider
            label="Net Revenue Interest (%)"
            value={inputs.netRevenueInterest * 100}
            onChange={(v) => set("netRevenueInterest")(v / 100)}
            min={0.1} max={87.5} step={0.1} suffix="%"
            tooltip="Your share of production revenue after royalty payments. A 75% NRI means you keep 75% of the revenue after paying the 25% royalty burden."
          />
          <InputWithSlider
            label="Daily Production (BOPD)"
            value={inputs.dailyBOPD}
            onChange={set("dailyBOPD")}
            min={1} max={5000} step={1}
            tooltip="Barrels of Oil Per Day — the daily production rate assigned to your working interest share."
          />
          <InputWithSlider
            label="Oil Price ($/bbl)"
            value={inputs.oilPrice}
            onChange={set("oilPrice")}
            min={20} max={200} step={0.5} prefix="$"
            tooltip="Current market price per barrel of crude oil. WTI Crude is the U.S. benchmark. Check the dashboard for live prices."
          />
          <InputWithSlider
            label="Lease Operating Expenses ($/bbl)"
            value={inputs.loePerBbl}
            onChange={set("loePerBbl")}
            min={5} max={40} step={0.5} prefix="$"
            tooltip="LOE covers pumping, maintenance, chemicals, and other recurring costs to keep the well producing. Expressed per barrel."
          />
          <InputWithSlider
            label="Severance Tax Rate (%)"
            value={inputs.severanceTaxRate * 100}
            onChange={(v) => set("severanceTaxRate")(v / 100)}
            min={0} max={12} step={0.1} suffix="%"
            tooltip="State production tax on oil revenue. Texas is 4.6%, Oklahoma is 7%, Wyoming is 6%. Varies by state."
          />
          <InputWithSlider
            label="Annual Production Decline (%)"
            value={inputs.declineRate * 100}
            onChange={(v) => set("declineRate")(v / 100)}
            min={0} max={50} step={1} suffix="%"
            tooltip="The annual percentage decline in production as reservoir pressure decreases. New wells often decline 50–70% in year one, stabilizing at 10–20%."
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <HeroResultCard label="Net Monthly Income" value={results.netMonthly} sublabel={`$${fmt(results.netAnnual)}/year`} />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Your Gross Revenue" value={results.yourGross} highlight />
            <ResultCard label="Net Annual Income" value={results.netAnnual} positive={results.netAnnual > 0} />
            <ResultCard label="Operating Expenses" value={results.operatingExpenses} positive={false} />
            <ResultCard label="Severance Tax" value={results.severanceTax} positive={false} />
          </div>
        </div>
      </div>

      {/* Decline Chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">60-Month Income Projection (Decline Curve)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={results.months} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={11} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, name === "netIncome" ? "Net Income" : "Gross Revenue"]}
            />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs">{v === "netIncome" ? "Net Income" : "Gross Revenue"}</span>} />
            <Line type="monotone" dataKey="grossRevenue" stroke="#D4A843" strokeWidth={2} dot={false} name="grossRevenue" />
            <Line type="monotone" dataKey="netIncome" stroke="#2E7D32" strokeWidth={2} dot={false} name="netIncome" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 5-Year Table */}
      <div className="rounded-2xl border border-border bg-card p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">5-Year Production Projection</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Year</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-2">Daily Prod (BOPD)</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-2">Monthly Net</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-2">Annual Net</th>
            </tr>
          </thead>
          <tbody>
            {results.yearlyTable.map((row) => (
              <tr key={row.year} className="border-b border-border/50">
                <td className="py-2 text-foreground font-medium">Year {row.year}</td>
                <td className="py-2 text-right font-mono text-foreground">{row.dailyProd}</td>
                <td className="py-2 text-right font-mono text-drill-green">${fmt(row.monthlyNet)}</td>
                <td className="py-2 text-right font-mono text-drill-green">${fmt(row.annualNet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GeoDueDiligence calcType="barrels_to_cash" />
      <AIWellEvaluator />
      <DisclaimerFooter />

      <SaveCalcModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        calcType="barrels_to_cash"
        inputs={inputs}
        results={results}
      />
    </div>
  );
}