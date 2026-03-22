import { Flame, DollarSign, TrendingDown, Percent, Wrench, ArrowDownRight } from "lucide-react";

const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

export default function NatGasToCashExplainers({ inputs, results }) {
  const monthlyMCF = inputs.dailyMCF * 30.44;
  const yourMCF = monthlyMCF * inputs.workingInterest;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">How Your Income Is Calculated</h3>

      <ExplainerCard
        icon={Flame}
        iconBg="bg-primary/10 dark:bg-accent/10"
        iconColor="text-primary dark:text-accent"
        title="Your Gross Revenue (NRI)"
        value={results.yourGross}
        positive
        valueLabel="/mo"
      >
        The well produces <strong>{inputs.dailyMCF.toLocaleString()} MCF/day</strong> ({(monthlyMCF).toLocaleString("en-US", { maximumFractionDigits: 0 })} MCF/month). Your <strong>{(inputs.workingInterest * 100).toFixed(1)}% WI × {(inputs.netRevenueInterest * 100).toFixed(1)}% NRI</strong> gives you revenue on {(yourMCF * inputs.netRevenueInterest).toLocaleString("en-US", { maximumFractionDigits: 0 })} MCF/month at ${inputs.gasPrice}/MCF. {inputs.includeNGL ? `NGL revenue adds ${fmt(results.nglRevenue)}/mo from liquids extracted during processing.` : "NGL revenue is not included — toggle it on if your gas stream is 'wet' (contains extractable liquids)."}
      </ExplainerCard>

      <ExplainerCard
        icon={ArrowDownRight}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Gathering & Processing Fees"
        value={results.gatheringFees}
        negative
        valueLabel="/mo"
      >
        Unlike oil, raw natural gas must be <strong>gathered, compressed, and processed</strong> before it can be sold. Midstream companies charge ${inputs.gatheringFee}/MCF for this service. These fees are deducted from your NRI revenue, not billed separately. At {fmt(results.gatheringFees)}/mo, gathering & processing is often the largest deduction on a gas well — and a common area where operators with affiliated midstream companies inflate costs.
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
        LOE covers wellsite maintenance, compression, chemical treatment, and field labor. At <strong>${inputs.loePerMCF}/MCF</strong>, your WI share is {fmt(results.operatingExpenses)}/mo. Gas well LOE is typically lower per-unit than oil wells because gas flows under its own pressure (no pumping required) — but compression costs can add up as reservoir pressure declines over time.
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
        State production tax at <strong>{(inputs.severanceTaxRate * 100).toFixed(1)}%</strong> applied to your WI share of gross wellhead revenue. Natural gas severance taxes vary widely: Texas 7.5%, Oklahoma 7%, Louisiana 12.5%, Pennsylvania 0% (impact fee instead), West Virginia 5%. This is levied on the gross value <em>before</em> royalty deductions and gathering fees are applied.
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
        Your actual monthly check: <strong>NRI Revenue ({fmt(results.yourGross)}) − Gathering ({fmt(results.gatheringFees)}) − LOE ({fmt(results.operatingExpenses)}) − Severance ({fmt(results.severanceTax)}) = {fmt(results.netMonthly)}</strong>. This is pre-income-tax cash flow. The 15% depletion allowance (IRC §613A) makes 15% of your gross income tax-free, further improving your after-tax return.
      </ExplainerCard>

      <ExplainerCard
        icon={TrendingDown}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Production Decline Impact"
        value={results.yearlyTable?.[4]?.annualNet ?? 0}
        valueLabel="Year 5 annual"
      >
        Gas wells often decline faster than oil wells — at <strong>{(inputs.declineRate * 100).toFixed(0)}% annually</strong>, production drops from {inputs.dailyMCF.toLocaleString()} MCF/day to roughly {(inputs.dailyMCF * Math.pow(1 - inputs.declineRate, 5)).toLocaleString("en-US", { maximumFractionDigits: 0 })} MCF/day by Year 5. The good news: gas wells in tight formations (Marcellus, Haynesville) often flatten to a low decline rate (5–10%) after the initial steep drop, providing decades of cash flow at lower volumes.
      </ExplainerCard>
    </div>
  );
}