import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  dailyMCF: 500,
  gasPrice: 3.5,
  gatheringFee: 0.75,
  loePerMCF: 0.50,
  severanceTaxRate: 0.075,
  declineRate: 0.20,
  nglYield: 0.01,
  nglPrice: 25,
  includeNGL: false,
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function NatGasToCash() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    const { workingInterest, netRevenueInterest, dailyMCF, gasPrice, gatheringFee, loePerMCF, severanceTaxRate, declineRate, nglYield, nglPrice, includeNGL } = inputs;

    const monthlyMCF = dailyMCF * 30.44;
    const grossGasRevenue = monthlyMCF * gasPrice;
    const nglRevenue = includeNGL ? monthlyMCF * nglYield * nglPrice : 0;
    const totalGrossRevenue = grossGasRevenue + nglRevenue;
    const yourGross = totalGrossRevenue * workingInterest * netRevenueInterest;
    const gatheringFees = monthlyMCF * gatheringFee * workingInterest;
    const operatingExpenses = monthlyMCF * loePerMCF * workingInterest;
    const severanceTax = yourGross * severanceTaxRate;
    const netMonthly = yourGross - gatheringFees - operatingExpenses - severanceTax;
    const netAnnual = netMonthly * 12;

    const months = Array.from({ length: 61 }, (_, m) => {
      const prod = dailyMCF * Math.pow(1 - declineRate, m / 12);
      const mProd = prod * 30.44;
      const mGasRev = mProd * gasPrice;
      const mNGL = includeNGL ? mProd * nglYield * nglPrice : 0;
      const mTotal = mGasRev + mNGL;
      const mGross = mTotal * workingInterest * netRevenueInterest;
      const mGather = mProd * gatheringFee * workingInterest;
      const mOpex = mProd * loePerMCF * workingInterest;
      const mSev = mGross * severanceTaxRate;
      const mNet = Math.max(0, mGross - mGather - mOpex - mSev);
      return { month: m, label: m === 0 ? "Now" : `M${m}`, netIncome: mNet, grossRevenue: mGross };
    });

    const yearlyTable = [1, 2, 3, 4, 5].map((yr) => {
      const m = (yr - 1) * 12;
      const prod = dailyMCF * Math.pow(1 - declineRate, m / 12);
      const mProd = prod * 30.44;
      const mGasRev = mProd * gasPrice;
      const mNGL = includeNGL ? mProd * nglYield * nglPrice : 0;
      const mGross = (mGasRev + mNGL) * workingInterest * netRevenueInterest;
      const mGather = mProd * gatheringFee * workingInterest;
      const mOpex = mProd * loePerMCF * workingInterest;
      const mSev = mGross * severanceTaxRate;
      const mNet = Math.max(0, mGross - mGather - mOpex - mSev);
      return { year: yr, dailyProd: prod.toFixed(0), monthlyNet: mNet, annualNet: mNet * 12 };
    });

    return { yourGross, gatheringFees, operatingExpenses, severanceTax, netMonthly, netAnnual, nglRevenue, months, yearlyTable };
  }, [inputs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Natural Gas to Cash</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Convert MCF/day production into working interest net income</p>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Well Parameters</h2>

          <InputWithSlider
            label="Working Interest (%)"
            value={inputs.workingInterest * 100}
            onChange={(v) => set("workingInterest")(v / 100)}
            min={0.1} max={100} step={0.1} suffix="%"
            tooltip="Your ownership percentage of the well's costs and production revenue."
          />
          <InputWithSlider
            label="Net Revenue Interest (%)"
            value={inputs.netRevenueInterest * 100}
            onChange={(v) => set("netRevenueInterest")(v / 100)}
            min={0.1} max={87.5} step={0.1} suffix="%"
            tooltip="Your share of revenue after deducting royalty burdens from your working interest."
          />
          <InputWithSlider
            label="Daily Production (MCF/day)"
            value={inputs.dailyMCF}
            onChange={set("dailyMCF")}
            min={10} max={100000} step={10}
            tooltip="Thousand Cubic Feet per day — the daily natural gas production rate."
          />
          <InputWithSlider
            label="Gas Price ($/MCF)"
            value={inputs.gasPrice}
            onChange={set("gasPrice")}
            min={1} max={15} step={0.05} prefix="$"
            tooltip="Current Henry Hub natural gas price per MCF. Check the dashboard for the live price feed."
          />
          <InputWithSlider
            label="Gathering & Processing Fees ($/MCF)"
            value={inputs.gatheringFee}
            onChange={set("gatheringFee")}
            min={0.1} max={3} step={0.05} prefix="$"
            tooltip="Fees charged by midstream operators to gather, compress, and process raw gas. Deducted before you receive revenue."
          />
          <InputWithSlider
            label="Lease Operating Expenses ($/MCF)"
            value={inputs.loePerMCF}
            onChange={set("loePerMCF")}
            min={0.1} max={2} step={0.05} prefix="$"
            tooltip="Recurring costs to maintain production: compression, maintenance, labor, chemicals — expressed per MCF produced."
          />
          <InputWithSlider
            label="Severance Tax Rate (%)"
            value={inputs.severanceTaxRate * 100}
            onChange={(v) => set("severanceTaxRate")(v / 100)}
            min={0} max={10} step={0.1} suffix="%"
            tooltip="State production tax on natural gas revenue. Texas is 7.5%, Louisiana is 12.5%."
          />
          <InputWithSlider
            label="Annual Production Decline (%)"
            value={inputs.declineRate * 100}
            onChange={(v) => set("declineRate")(v / 100)}
            min={0} max={60} step={1} suffix="%"
            tooltip="Natural gas wells can decline 60–80% in year one and then flatten out. Enter your expected annual decline rate."
          />

          {/* NGL Toggle */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-sm font-medium">Include NGL Revenue</Label>
                <p className="text-xs text-muted-foreground">Natural Gas Liquids (advanced)</p>
              </div>
              <Switch
                checked={inputs.includeNGL}
                onCheckedChange={(v) => set("includeNGL")(v)}
              />
            </div>
            {inputs.includeNGL && (
              <div className="space-y-4">
                <InputWithSlider
                  label="NGL Yield (BBL/MCF)"
                  value={inputs.nglYield}
                  onChange={set("nglYield")}
                  min={0} max={0.05} step={0.001}
                  tooltip="Barrels of Natural Gas Liquids extracted per MCF of raw gas. Depends on richness of the gas stream."
                />
                <InputWithSlider
                  label="NGL Price ($/BBL)"
                  value={inputs.nglPrice}
                  onChange={set("nglPrice")}
                  min={10} max={60} step={0.5} prefix="$"
                  tooltip="Blended price for natural gas liquids including ethane, propane, butane, and natural gasoline."
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <HeroResultCard label="Net Monthly Income" value={results.netMonthly} sublabel={`$${fmt(results.netAnnual)}/year`} />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Your Gross Revenue" value={results.yourGross} highlight />
            <ResultCard label="Net Annual Income" value={results.netAnnual} positive={results.netAnnual > 0} />
            {inputs.includeNGL && <ResultCard label="NGL Revenue" value={results.nglRevenue} positive />}
            <ResultCard label="Gathering & Processing" value={results.gatheringFees} positive={false} />
            <ResultCard label="Operating Expenses" value={results.operatingExpenses} positive={false} />
            <ResultCard label="Severance Tax" value={results.severanceTax} positive={false} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">60-Month Income Projection (Decline Curve)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={results.months} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={11} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [`$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, name === "netIncome" ? "Net Income" : "Gross Revenue"]}
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
              <th className="text-right text-xs font-medium text-muted-foreground pb-2">Daily Prod (MCF/day)</th>
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

      <GeoDueDiligence calcType="natgas_to_cash" />
      <AIWellEvaluator />
      <DisclaimerFooter />

      <SaveCalcModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        calcType="natgas_to_cash"
        inputs={inputs}
        results={results}
      />
    </div>
  );
}