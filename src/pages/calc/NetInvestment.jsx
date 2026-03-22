import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartTooltip, Legend } from "recharts";
import InputWithSlider from "@/components/ui/InputWithSlider";
import { ResultCard, HeroResultCard } from "@/components/ui/ResultCard";
import CalcActionBar from "@/components/CalcActionBar";
import SaveCalcModal from "@/components/SaveCalcModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";

const TAX_BRACKETS = [10, 12, 22, 24, 32, 35, 37];

const DEFAULTS = {
  totalInvestment: 250000,
  federalTaxRate: 0.37,
  stateTaxRate: 0,
  idcPercentage: 0.75,
  depletionRate: 0.15,
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function NetInvestment() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [saveOpen, setSaveOpen] = useState(false);

  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    const { totalInvestment, federalTaxRate, stateTaxRate, idcPercentage, depletionRate } = inputs;
    const combinedRate = federalTaxRate + stateTaxRate;
    const tangiblePct = 1 - idcPercentage;

    const idcAmount = totalInvestment * idcPercentage;
    const tangibleAmount = totalInvestment * tangiblePct;

    const idcTaxSavings = idcAmount * combinedRate;
    const tangibleDepreciation = tangibleAmount * 0.1429;
    const tangibleTaxSavings = tangibleDepreciation * combinedRate;
    const depletionSavings = totalInvestment * depletionRate * combinedRate;

    const totalTaxSavings = idcTaxSavings + tangibleTaxSavings + depletionSavings;
    const netInvestment = totalInvestment - totalTaxSavings;
    const effectiveCost = netInvestment / totalInvestment;

    return {
      idcAmount,
      tangibleAmount,
      idcTaxSavings,
      tangibleDepreciation,
      tangibleTaxSavings,
      depletionSavings,
      totalTaxSavings,
      netInvestment,
      effectiveCost,
    };
  }, [inputs]);

  const pieData = [
    { name: "IDC", value: results.idcAmount, color: "#D4A843" },
    { name: "Tangible Equipment", value: results.tangibleAmount, color: "#0B2545" },
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
        <CalcActionBar onSave={() => setSaveOpen(true)} onReset={() => setInputs(DEFAULTS)} />
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
            <Select
              value={String(inputs.federalTaxRate * 100)}
              onValueChange={(v) => set("federalTaxRate")(parseFloat(v) / 100)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAX_BRACKETS.map((b) => (
                  <SelectItem key={b} value={String(b)}>{b}%</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <InputWithSlider
            label="Depletion Allowance"
            value={inputs.depletionRate * 100}
            onChange={(v) => set("depletionRate")(v / 100)}
            min={5}
            max={22}
            step={0.5}
            suffix="%"
            tooltip="Statutory percentage depletion for independent oil and gas producers. The IRS allows 15% depletion on gross income from the well."
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <HeroResultCard
            label="Net Out-of-Pocket Investment"
            value={results.netInvestment}
            sublabel={`Effective cost: ${(results.effectiveCost * 100).toFixed(1)}¢ per dollar invested`}
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total Tax Savings" value={results.totalTaxSavings} positive={true} />
            <ResultCard label="IDC Deduction" value={results.idcAmount} />
            <ResultCard label="IDC Tax Savings" value={results.idcTaxSavings} positive={true} />
            <ResultCard label="Tangible Depreciation (Yr 1)" value={results.tangibleDepreciation} />
            <ResultCard label="Tangible Tax Savings" value={results.tangibleTaxSavings} positive={true} />
            <ResultCard label="Depletion Savings" value={results.depletionSavings} positive={true} />
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