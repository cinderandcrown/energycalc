import { Droplets, DollarSign, TrendingDown, Percent, ShieldCheck, Wrench } from "lucide-react";

const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBbl = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function ExplainerCard({ icon: Icon, iconBg, iconColor, title, value, valueLabel, positive, negative, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        </div>
        <p className={`font-mono font-bold text-base whitespace-nowrap ${positive ? "text-drill-green" : negative ? "text-flare-red" : "text-foreground"}`}>
          {negative && "−"}{positive && "+"}{fmt(value)}
          {valueLabel && <span className="text-xs text-muted-foreground font-normal ml-1">{valueLabel}</span>}
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-[46px]">{children}</p>
    </div>
  );
}

export default function BarrelsToCashExplainers({ inputs, results }) {
  const monthlyBbl = inputs.dailyBOPD * 30.44;
  const yourBbl = monthlyBbl * inputs.workingInterest;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">How Your Income Is Calculated</h3>

      <ExplainerCard
        icon={Droplets}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Your Monthly Production"
        value={yourBbl * inputs.netRevenueInterest * inputs.oilPrice}
        positive
        valueLabel="/mo gross"
      >
        The well produces <strong>{fmtBbl(inputs.dailyBOPD)} BOPD</strong> total. Your <strong>{(inputs.workingInterest * 100).toFixed(1)}% Working Interest</strong> entitles you to {fmtBbl(yourBbl)} bbl/month, but your check is based on your <strong>{(inputs.netRevenueInterest * 100).toFixed(1)}% NRI</strong> (after royalties), which means you're paid on {fmtBbl(yourBbl * inputs.netRevenueInterest)} bbl/month at ${inputs.oilPrice}/bbl.
      </ExplainerCard>

      <ExplainerCard
        icon={Wrench}
        iconBg="bg-muted"
        iconColor="text-muted-foreground"
        title="Lease Operating Expenses (LOE)"
        value={results.operatingExpenses}
        negative
        valueLabel="/mo"
      >
        LOE covers the costs of keeping the well running: pumping equipment, maintenance, chemicals, electricity, water disposal, and labor. At <strong>${inputs.loePerBbl}/bbl</strong>, your WI share of monthly LOE is {fmt(results.operatingExpenses)}. LOE is charged against your <strong>Working Interest</strong>, not your NRI — you pay WI% of all operating costs, even though you only receive NRI% of revenue. This spread is why WI/NRI economics matter so much.
      </ExplainerCard>

      <ExplainerCard
        icon={Percent}
        iconBg="bg-flare-red/10"
        iconColor="text-flare-red"
        title="Severance Tax"
        value={results.severanceTax}
        negative
        valueLabel="/mo"
      >
        Severance (production) tax is levied by the state on the gross value of oil produced. At <strong>{(inputs.severanceTaxRate * 100).toFixed(1)}%</strong>, this is applied to your WI share of gross wellhead revenue ({fmt(monthlyBbl * inputs.oilPrice * inputs.workingInterest)}/mo) — <em>before</em> royalty deductions, because the state taxes the production, not your net revenue. Common rates: Texas 4.6%, Oklahoma 7%, North Dakota 5%, Wyoming 6%.
      </ExplainerCard>

      <ExplainerCard
        icon={DollarSign}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="Net Monthly Income"
        value={results.netMonthly}
        positive
        valueLabel="/mo"
      >
        This is your actual monthly check: <strong>NRI Revenue ({fmt(results.yourGross)}) − LOE ({fmt(results.operatingExpenses)}) − Severance Tax ({fmt(results.severanceTax)}) = {fmt(results.netMonthly)}</strong>. This is pre-income-tax cash flow — you'll still owe federal and state income taxes on this revenue, partially offset by the 15% depletion allowance (IRC §613A) which makes 15% of your gross income tax-free.
      </ExplainerCard>

      <ExplainerCard
        icon={TrendingDown}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Production Decline Impact"
        value={results.yearlyTable?.[4]?.annualNet ?? 0}
        valueLabel="Year 5 annual"
      >
        At a <strong>{(inputs.declineRate * 100).toFixed(0)}% annual decline</strong>, your production drops from {fmtBbl(inputs.dailyBOPD)} BOPD to roughly {fmtBbl(inputs.dailyBOPD * Math.pow(1 - inputs.declineRate, 5))} BOPD by Year 5. This is normal — all oil wells decline as reservoir pressure depletes. The key question is whether your cumulative revenue over the well's life exceeds your investment. Use the <strong>Rate of Return calculator</strong> to model this.
      </ExplainerCard>
    </div>
  );
}