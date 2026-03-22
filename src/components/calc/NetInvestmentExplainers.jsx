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
        This is the combined dollar amount you save on your tax bill in Year 1 from both IDC and tangible deductions. It directly reduces your out-of-pocket cost. The higher your tax bracket, the more you save. This is the single biggest reason oil & gas is called a "tax-advantaged" investment.
      </ExplainerCard>

      <ExplainerCard
        icon={DollarSign}
        iconBg="bg-primary/10 dark:bg-accent/10"
        iconColor="text-primary dark:text-accent"
        title="IDC Deduction (100% in Year 1)"
        value={results.idcAmount}
      >
        <strong>Intangible Drilling Costs (IDCs)</strong> are expenses like labor, drilling fluids, chemicals, fuel, and site preparation — anything that has no salvage value. Under <strong>IRC §263(c)</strong>, active working interest holders can deduct 100% of IDCs in the year the money is spent. This is the single largest deduction in oil & gas investing and typically represents 65–85% of your total investment. It's like writing off the majority of your investment against your income before the well even produces.
      </ExplainerCard>

      <ExplainerCard
        icon={ShieldCheck}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="IDC Tax Savings"
        value={results.idcTaxSavings}
        positive
      >
        This is the actual cash you keep by not paying it in taxes, thanks to the IDC deduction. It's calculated as: <strong>IDC Amount × Your Combined Tax Rate</strong>. For example, if you're in the 37% bracket and your IDCs are $187,500, you save ~$69,375 on your federal tax bill alone. This money stays in your pocket — it's real savings, not a deferral.
      </ExplainerCard>

      <ExplainerCard
        icon={Wrench}
        iconBg="bg-muted"
        iconColor="text-muted-foreground"
        title="Tangible Depreciation (Year 1)"
        value={results.tangibleDepreciation}
      >
        <strong>Tangible Drilling Costs (TDCs)</strong> are physical equipment — the wellhead, casing, tubing, tanks, pumps — things with actual salvage value. These are depreciated over 7 years under the <strong>IRS MACRS schedule</strong> (Modified Accelerated Cost Recovery System). In Year 1, you can deduct 14.29% of the tangible cost. It's a smaller deduction than IDCs, but it adds up over the life of the well and further reduces your tax liability each year.
      </ExplainerCard>

      <ExplainerCard
        icon={Banknote}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="Tangible Tax Savings"
        value={results.tangibleTaxSavings}
        positive
      >
        The actual tax dollars saved from the tangible equipment depreciation in Year 1. Calculated as: <strong>Year-1 Depreciation × Your Combined Tax Rate</strong>. While smaller than the IDC savings, remember that tangible depreciation continues for 7 years — so you'll receive additional deductions in Years 2–7 that are not shown in this Year-1 snapshot.
      </ExplainerCard>
    </div>
  );
}