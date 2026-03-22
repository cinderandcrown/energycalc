import InputWithSlider from "@/components/ui/InputWithSlider";
import { DEFAULTS } from "./TaxImpactEngine";

export default function TaxImpactInputs({ params, setParams }) {
  const set = (key) => (val) => setParams((p) => ({ ...p, [key]: val }));

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-bold text-foreground">Investment Parameters</h3>

      <InputWithSlider
        label="Annual Investment"
        value={params.investmentPerYear}
        onChange={set("investmentPerYear")}
        min={10000}
        max={1000000}
        step={5000}
        prefix="$"
        tooltip="Amount invested each year for 5 years"
      />

      <InputWithSlider
        label="IDC Percentage"
        value={params.idcPercent}
        onChange={set("idcPercent")}
        min={50}
        max={90}
        step={1}
        suffix="%"
        tooltip="Intangible Drilling Costs — deductible 100% in Year 1"
      />

      <InputWithSlider
        label="Annual Gross Income (% of investment)"
        value={params.annualGrossIncome}
        onChange={set("annualGrossIncome")}
        min={5}
        max={80}
        step={1}
        suffix="%"
        tooltip="First-year gross revenue as a percentage of investment"
      />

      <InputWithSlider
        label="Annual Production Decline"
        value={params.declineRate}
        onChange={set("declineRate")}
        min={5}
        max={40}
        step={1}
        suffix="%"
        tooltip="Year-over-year production decline rate"
      />

      <InputWithSlider
        label="Lease Operating Expense"
        value={params.loePercent}
        onChange={set("loePercent")}
        min={10}
        max={50}
        step={1}
        suffix="%"
        tooltip="LOE as a percentage of gross income"
      />

      <InputWithSlider
        label="Severance Tax"
        value={params.severanceTaxPercent}
        onChange={set("severanceTaxPercent")}
        min={0}
        max={15}
        step={0.5}
        suffix="%"
        tooltip="State severance/production tax rate"
      />

      <InputWithSlider
        label="Percentage Depletion Rate"
        value={params.depletionRate}
        onChange={set("depletionRate")}
        min={0}
        max={15}
        step={1}
        suffix="%"
        tooltip="IRS allows 15% depletion on gross income for small producers"
      />
    </div>
  );
}