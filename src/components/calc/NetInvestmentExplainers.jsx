import { DollarSign, ShieldCheck, Wrench, Zap, TrendingDown, Banknote } from "lucide-react";

const fmt = (v) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function ExplainerCard({ icon: Icon, iconBg, iconColor, title, value, positive, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        </div>
        <p className={`font-mono font-bold text-base whitespace-nowrap ${positive ? "text-drill-green" : "text-foreground"}`}>
          {positive && "+"}{fmt(value)}
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-[46px]">{children}</p>
    </div>
  );
}

export default function NetInvestmentExplainers({ results }) {
  return (
    <div className="space-y-3">
      <ExplainerCard
        icon={Zap}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Total Year-1 Tax Savings"
        value={results.totalYear1TaxSavings}
        positive
      >
        Combined IDC + tangible deductions. Directly reduces your out-of-pocket cost.
      </ExplainerCard>

      <ExplainerCard
        icon={DollarSign}
        iconBg="bg-primary/10 dark:bg-accent/10"
        iconColor="text-primary dark:text-accent"
        title="IDC Deduction (100% in Year 1)"
        value={results.idcAmount}
      >
        Intangible costs (labor, fluids, fuel, site prep) with no salvage value. 100% deductible under IRC §263(c). Typically 65–85% of total investment.
      </ExplainerCard>

      <ExplainerCard
        icon={ShieldCheck}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="IDC Tax Savings"
        value={results.idcTaxSavings}
        positive
      >
        IDC Amount × Combined Tax Rate. Real cash savings, not a deferral.
      </ExplainerCard>

      <ExplainerCard
        icon={Wrench}
        iconBg="bg-muted"
        iconColor="text-muted-foreground"
        title="Tangible Depreciation (Year 1)"
        value={results.tangibleDepreciation}
      >
        Physical equipment (wellhead, casing, tubing, pumps). MACRS 7-year schedule — Year 1 rate is 14.29%. Additional deductions continue through Year 7.
      </ExplainerCard>

      <ExplainerCard
        icon={Banknote}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="Tangible Tax Savings"
        value={results.tangibleTaxSavings}
        positive
      >
        Year-1 Depreciation × Combined Tax Rate. Smaller than IDC but continues for 7 years.
      </ExplainerCard>
    </div>
  );
}