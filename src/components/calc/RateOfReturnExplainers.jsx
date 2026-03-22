import { TrendingUp, DollarSign, Clock, BarChart3, Percent, ShieldCheck } from "lucide-react";

const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtPct = (v) => (v ?? 0).toFixed(2) + "%";

function ExplainerCard({ icon: Icon, iconBg, iconColor, title, value, positive, negative, children }) {
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
          {value}
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-[46px]">{children}</p>
    </div>
  );
}

export default function RateOfReturnExplainers({ inputs, results }) {
  const years = inputs.timeHorizon / 12;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">What These Numbers Mean</h3>

      <ExplainerCard
        icon={TrendingUp}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="Internal Rate of Return (IRR)"
        value={results.annualIRR !== null ? fmtPct(results.annualIRR) : "N/A"}
        positive={results.annualIRR > 0}
        negative={results.annualIRR !== null && results.annualIRR < 0}
      >
        <strong>IRR is the gold standard</strong> for evaluating investments. It's the annualized discount rate that makes the Net Present Value of all cash flows equal zero — in plain English, it's the true annual return on your money, accounting for the timing and size of every monthly payment. An IRR above 15% is considered strong for energy investments. Above 25% is exceptional. Unlike simple ROI, IRR accounts for the <em>time value of money</em> — getting $10K in Month 3 is worth more than $10K in Month 48. Calculated using the Newton-Raphson iterative method on your monthly cash flow stream.
      </ExplainerCard>

      <ExplainerCard
        icon={Clock}
        iconBg="bg-crude-gold/10"
        iconColor="text-crude-gold"
        title="Payout Period"
        value={results.isPaidOut ? `Month ${results.payoutMonth}` : "Not within timeframe"}
        positive={results.isPaidOut}
        negative={!results.isPaidOut}
      >
        Payout is the month when your cumulative revenue equals your original investment — you've gotten your money back, and everything after is profit. A payout period under 36 months is very strong. 36–60 months is typical for a decent deal. If payout extends beyond 60 months, the deal's economics are marginal and highly sensitive to commodity price fluctuations. {results.isPaidOut ? `Your deal pays out in Month ${results.payoutMonth} (${(results.payoutMonth / 12).toFixed(1)} years).` : `At current projections, this deal does NOT return your capital within the ${years.toFixed(0)}-year timeframe — a significant risk flag.`}
      </ExplainerCard>

      <ExplainerCard
        icon={DollarSign}
        iconBg="bg-primary/10 dark:bg-accent/10"
        iconColor="text-primary dark:text-accent"
        title="Simple ROI"
        value={fmtPct(results.simpleROI)}
        positive={results.simpleROI > 0}
        negative={results.simpleROI < 0}
      >
        Simple ROI = <strong>(Total Revenue − Investment) / Investment × 100</strong>. Over your {years.toFixed(0)}-year horizon, total revenue is {fmt(results.totalRevenue)} on a {fmt(inputs.netInvestment)} investment. Simple ROI is easy to understand but misleading on its own — it ignores the time dimension. A 100% ROI over 10 years sounds great, but it's only ~7% annualized. Always pair ROI with IRR and payout period for a complete picture.
      </ExplainerCard>

      <ExplainerCard
        icon={Percent}
        iconBg="bg-muted"
        iconColor="text-muted-foreground"
        title="Monthly Cash-on-Cash"
        value={fmtPct(results.monthlyCashOnCash)}
      >
        Cash-on-cash yield = <strong>Month-1 Income / Total Investment × 100</strong>. This is a snapshot of initial yield — {fmt(results.combinedMonthly)} per month on {fmt(inputs.netInvestment)} invested. It's useful for comparing to other income-producing assets (rental properties, dividend stocks). But remember: this is the <em>starting</em> yield before production decline kicks in. Your actual monthly income will decrease over time at the {(inputs.annualDeclineRate * 100).toFixed(0)}% annual decline rate you specified.
      </ExplainerCard>

      <ExplainerCard
        icon={BarChart3}
        iconBg="bg-[#6B7280]/10"
        iconColor="text-[#6B7280]"
        title="S&P 500 Comparison"
        value={fmt(inputs.netInvestment * Math.pow(1.00836, inputs.timeHorizon) - inputs.netInvestment)}
        positive
      >
        The chart above compares your oil & gas cumulative cash flow to what {fmt(inputs.netInvestment)} would earn in the S&P 500 (assuming the historical average of ~10.5% annually). This is NOT a recommendation — it's a benchmark. Energy investments can outperform the S&P 500 significantly when deals are good, but they carry concentrated asset risk (single well, single commodity) that index funds don't. The S&P 500 line shows the <strong>net gain</strong> on your investment at the same average annual return.
      </ExplainerCard>

      <ExplainerCard
        icon={ShieldCheck}
        iconBg="bg-drill-green/10"
        iconColor="text-drill-green"
        title="Annualized Return"
        value={fmtPct(results.annualizedReturn)}
        positive={results.annualizedReturn > 0}
        negative={results.annualizedReturn < 0}
      >
        Annualized return converts your total {years.toFixed(0)}-year return into an equivalent annual percentage: <strong>(Total Revenue / Investment)^(1/years) − 1</strong>. This gives you an apples-to-apples comparison with annual returns quoted for stocks, bonds, and real estate. Note: this is a simplified measure that doesn't weight the timing of cash flows (IRR does). If your annualized return is below 10%, you may be better off in index funds with far less risk.
      </ExplainerCard>
    </div>
  );
}