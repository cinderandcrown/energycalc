import { useState, useMemo } from "react";
import { Calculator, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TAX_BRACKETS, DEFAULTS, computeMultiYearModel } from "../../components/calc/TaxImpactEngine";
import TaxImpactInputs from "../../components/calc/TaxImpactInputs";
import TaxImpactChart from "../../components/calc/TaxImpactChart";
import TaxImpactROIChart from "../../components/calc/TaxImpactROIChart";
import TaxImpactTable from "../../components/calc/TaxImpactTable";
import SaveCalcModal from "../../components/SaveCalcModal";
import CalcActionBar from "../../components/CalcActionBar";
import DisclaimerFooter from "../../components/DisclaimerFooter";
import InContentAd from "@/components/ads/InContentAd";
import usePageTitle from "@/hooks/usePageTitle";

const BRACKET_COLORS = ["bg-crude-gold", "bg-drill-green", "bg-blue-500", "bg-purple-500"];
const BRACKET_RING = ["ring-crude-gold", "ring-drill-green", "ring-blue-500", "ring-purple-500"];

function fmt(v) {
  const neg = v < 0;
  const abs = Math.abs(v);
  const str = abs >= 1000000
    ? `$${(abs / 1000000).toFixed(2)}M`
    : abs >= 1000
      ? `$${(abs / 1000).toFixed(1)}K`
      : `$${abs.toLocaleString()}`;
  return neg ? `(${str})` : str;
}

export default function TaxImpact() {
  usePageTitle("Tax Impact Calculator — 5-Year Model");
  const [params, setParams] = useState({ ...DEFAULTS });
  const [activeBrackets, setActiveBrackets] = useState([1, 3]); // 32% and 37% active by default
  const [selectedTable, setSelectedTable] = useState(1); // which bracket to show in table
  const [saveOpen, setSaveOpen] = useState(false);

  const toggleBracket = (i) => {
    setActiveBrackets((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  // Summary cards for each active bracket
  const summaries = useMemo(() => {
    return TAX_BRACKETS.map((b, i) => {
      const data = computeMultiYearModel(params, b.rate);
      const final = data[data.length - 1];
      return { ...b, index: i, final };
    });
  }, [params]);

  const results = useMemo(() => {
    const selected = summaries[selectedTable];
    return {
      bracket: selected.label,
      totalInvested: selected.final.cumulativeInvested,
      totalTaxSavings: selected.final.cumulativeTaxSavings,
      totalNetIncome: selected.final.cumulativeNetIncome,
      netCost: selected.final.cumulativeNetCost,
      effectiveROI: selected.final.effectiveROI,
    };
  }, [summaries, selectedTable]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-petroleum" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Multi-Year Tax Impact Calculator</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Model cumulative IDC, depletion & depreciation benefits across 5 years of energy investments
          </p>
        </div>
      </div>

      {/* Tax Bracket Toggles */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Toggle Tax Brackets to Compare
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TAX_BRACKETS.map((b, i) => {
            const active = activeBrackets.includes(i);
            return (
              <button
                key={b.label}
                onClick={() => toggleBracket(i)}
                className={`rounded-xl border-2 p-3 text-center transition-all min-h-[44px] ${
                  active
                    ? `${BRACKET_RING[i]} ring-2 border-transparent bg-card shadow-sm`
                    : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <p className="text-lg font-bold font-mono text-foreground">{b.label}</p>
                <p className="text-[10px] text-muted-foreground">{b.income}</p>
                {active && (
                  <Badge className={`mt-1.5 text-[9px] ${BRACKET_COLORS[i]} text-white border-0`}>Active</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs */}
      <TaxImpactInputs params={params} setParams={setParams} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaries
          .filter((_, i) => activeBrackets.includes(i))
          .map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label} Bracket</p>
              <p className={`text-xl font-bold font-mono mt-1 ${s.final.cumulativeNetCost <= 0 ? "text-drill-green" : "text-foreground"}`}>
                {fmt(s.final.cumulativeNetCost)}
              </p>
              <p className="text-[10px] text-muted-foreground">Net Cost Year 5</p>
              <p className={`text-sm font-bold font-mono mt-1 ${s.final.effectiveROI >= 100 ? "text-drill-green" : "text-crude-gold"}`}>
                {s.final.effectiveROI}% ROI
              </p>
            </div>
          ))}
      </div>

      {/* Charts */}
      <TaxImpactChart params={params} activeBrackets={activeBrackets} />
      <TaxImpactROIChart params={params} activeBrackets={activeBrackets} />

      {/* Table Bracket Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-xs font-semibold text-muted-foreground">Detailed table for:</p>
        {TAX_BRACKETS.map((b, i) => (
          <Button
            key={b.label}
            variant={selectedTable === i ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTable(i)}
            className="text-xs min-h-[36px]"
          >
            {b.label}
          </Button>
        ))}
      </div>

      <TaxImpactTable
        params={params}
        taxRate={TAX_BRACKETS[selectedTable].rate}
        bracketLabel={TAX_BRACKETS[selectedTable].label}
      />

      {/* Explanation */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary dark:text-accent shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">How This Calculator Works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>IDC (Intangible Drilling Costs):</strong> Typically 65–85% of well costs. 100% deductible in the year the investment is made under IRC §263(c). This is the primary Year-1 tax benefit.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Percentage Depletion:</strong> Small producers (≤1,000 BOE/day) can deduct 15% of gross income from oil & gas properties, even after the property cost is fully recovered. Capped at 65% of net income per property.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Tangible Depreciation:</strong> Equipment and casing are depreciated over 7 years using MACRS accelerated depreciation schedules.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Net Cost:</strong> = Total Invested − Cumulative Tax Savings − Cumulative Net Production Income. When negative, you've recovered more than you put in.
            </p>
          </div>
        </div>
      </div>

      <InContentAd slot="CALC_TAX_MID" />

      <CalcActionBar
        onSave={() => setSaveOpen(true)}
        onReset={() => setParams({ ...DEFAULTS })}
        calcType="tax_impact"
        inputs={params}
        results={results}
      />

      <SaveCalcModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        calcType="tax_impact"
        inputs={params}
        results={results}
      />

      <DisclaimerFooter />
    </div>
  );
}