import { useState, useMemo } from "react";
import MobileSelect from "@/components/mobile/MobileSelect";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartTooltip, Legend } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import InContentAd from "@/components/ads/InContentAd";
import GeoDueDiligence from "@/components/calc/GeoDueDiligence";
import AIWellEvaluator from "@/components/calc/AIWellEvaluator";
import NetInvestmentExplainers from "@/components/calc/NetInvestmentExplainers";

const TAX_BRACKETS = [10, 12, 22, 24, 32, 35, 37];

const DEFAULTS = {
  totalInvestment: 250000,
  federalTaxRate: 0.37,
  stateTaxRate: 0,
  idcPercentage: 0.75,
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function NetInvestment() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    const { totalInvestment, federalTaxRate, stateTaxRate, idcPercentage } = inputs;
    // State deduction reduces federal taxable income (itemized deduction), so the
    // combined marginal benefit is: state_rate + federal_rate × (1 - state_rate)
    // This avoids double-counting the state deduction against itself.
    const combinedRate = stateTaxRate + federalTaxRate * (1 - stateTaxRate);
    const tangiblePct = 1 - idcPercentage;

    const idcAmount = totalInvestment * idcPercentage;
    const tangibleAmount = totalInvestment * tangiblePct;

    // IRC §263(c): IDCs are 100% deductible in Year 1 for active WI holders
    const idcTaxSavings = idcAmount * combinedRate;
    // MACRS 7-year, half-year convention: Year 1 rate = 14.29% (IRS Publication 946)
    const tangibleDepreciation = tangibleAmount * 0.1429;
    const tangibleTaxSavings = tangibleDepreciation * combinedRate;

    const totalYear1TaxSavings = idcTaxSavings + tangibleTaxSavings;
    const netInvestment = totalInvestment - totalYear1TaxSavings;
    const effectiveCost = netInvestment / totalInvestment;

    return {
      idcAmount,
      tangibleAmount,
      idcTaxSavings,
      tangibleDepreciation,
      tangibleTaxSavings,
      totalYear1TaxSavings,
      netInvestment,
      effectiveCost,
    };
  }, [inputs]);

  const pieData = [
    { name: "IDC Tax Savings", value: results.idcTaxSavings, color: "#D4A843" },
    { name: "Tangible Tax Savings (Yr 1)", value: results.tangibleTaxSavings, color: "#0B2545" },
    { name: "Net Out-of-Pocket", value: results.netInvestment, color: "#2E7D32" },
  ];

  const getInputs = () => inputs;
  const getResults = () => results;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Net Investment Calculator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">After-tax cost of your oil & gas investment with federal deductions</p>
        </div>
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} calcType="net_investment" inputs={inputs} results={results} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Investment Parameters</h2>

          <InputWithSlider
            label="Total Investment Amount"
            value={inputs.totalInvestment}
            onChange={set("totalInvestment")}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            tooltip="The total dollar amount you are investing in the oil and gas project, including all drilling costs."
          />

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label>Federal Tax Bracket</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Your marginal federal income tax rate. This determines how much tax savings you receive from deductions.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <MobileSelect
              value={String(inputs.federalTaxRate * 100)}
              onValueChange={(v) => set("federalTaxRate")(parseFloat(v) / 100)}
              options={TAX_BRACKETS.map((b) => ({ value: String(b), label: `${b}%` }))}
              label="Federal Tax Bracket"
              placeholder="Select bracket"
            />
          </div>

          <InputWithSlider
            label="State Tax Rate"
            value={inputs.stateTaxRate * 100}
            onChange={(v) => set("stateTaxRate")(v / 100)}
            min={0}
            max={13.3}
            step={0.1}
            suffix="%"
            tooltip="Your state income tax rate. Combined with federal rate to calculate total deduction value."
          />

          <InputWithSlider
            label="Intangible Drilling Cost (IDC) %"
            value={inputs.idcPercentage * 100}
            onChange={(v) => set("idcPercentage")(v / 100)}
            min={65}
            max={85}
            step={0.5}
            suffix="%"
            tooltip="IDC includes wages, fuel, drilling fluids, and other costs with no salvage value. Typically 65–85% of total investment and 100% deductible in year one."
          />

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Tangible Cost:</strong> {((1 - inputs.idcPercentage) * 100).toFixed(1)}%
              = ${fmt(results.tangibleAmount)} (equipment with salvage value, MACRS 7-year)
            </p>
          </div>

          {/* SALT cap note */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note on state taxes:</strong> The SALT deduction cap ($10K) may limit your ability to deduct state taxes against federal income. This calculator adds the rates for simplicity — consult your CPA for your specific situation.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <HeroResultCard
            label="Net Out-of-Pocket Investment"
            value={results.netInvestment}
            sublabel={`Effective cost: ${(results.effectiveCost * 100).toFixed(1)}¢ per dollar invested`}
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total Year-1 Tax Savings" value={results.totalYear1TaxSavings} positive />
            <ResultCard label="IDC Deduction" value={results.idcAmount} highlight />
            <ResultCard label="Tangible Equipment" value={results.tangibleAmount} />
            <ResultCard label="Tangible Yr-1 Depreciation" value={results.tangibleDepreciation} />
          </div>

          <NetInvestmentExplainers results={results} />

          {/* Depletion note */}
          <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">15% Percentage Depletion (IRC §613A):</strong> Not shown above because it applies during <em>production</em>, not at investment. Once the well produces, you can deduct 15% of gross well income as depletion — tax-free cash flow. This further reduces your effective cost over the life of the well. The depletion allowance has no cost basis limit for independent producers (unlike cost depletion).
            </p>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Investment Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <RechartTooltip
                  formatter={(v) => [`$${v.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span className="text-xs text-foreground">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InContentAd slot="CALC_NET_MID" />
      <GeoDueDiligence calcType="net_investment" />
      <AIWellEvaluator />
      <DisclaimerFooter />

      <SaveCalcModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        calcType="net_investment"
        inputs={getInputs()}
        results={getResults()}
      />
    </div>
  );
}