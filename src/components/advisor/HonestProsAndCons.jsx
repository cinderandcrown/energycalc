import { CheckCircle2, XCircle, Scale } from "lucide-react";

const pros = [
  {
    title: "Unmatched Tax Advantages",
    detail: "No other legal investment in America offers the same tax benefits. IDC deductions (60–80% in Year 1), 15% depletion allowance, active income treatment, and MACRS depreciation make oil & gas the most tax-advantaged asset class available. These aren't loopholes — they're intentional IRC provisions designed to incentivize domestic energy production.",
  },
  {
    title: "Real Asset, Commodity-Backed Income",
    detail: "Oil and gas wells produce a physical commodity with global demand. Your revenue is backed by barrels in the tank and MCF through the meter, not by market sentiment or P/E ratios. In inflationary environments, commodity prices tend to rise, making energy a natural hedge.",
  },
  {
    title: "Monthly Cash Flow (When It Works)",
    detail: "Producing wells generate monthly revenue checks. Unlike stocks that pay quarterly dividends (maybe), a good well sends money every month from Day 1 of production. This income can be significant — 8–20% annual yield on invested capital for well-selected producing properties.",
  },
  {
    title: "Portfolio Diversification",
    detail: "Energy investments have low correlation with stocks and bonds. When the S&P 500 crashed in 2008, 2020, and 2022, oil prices followed their own path. This non-correlation provides genuine portfolio diversification that most alternative investments claim but don't deliver.",
  },
  {
    title: "Real Wealth Has Been Created",
    detail: "For all the fraud in this industry, millions of legitimate fortunes have been built. Texas, Oklahoma, North Dakota, and the Permian Basin have produced multi-generational wealth for families who invested wisely in real operators with real geology. The opportunity is genuine — but so are the risks.",
  },
];

const cons = [
  {
    title: "Geological Risk Is Real and Irreducible",
    detail: "You can do everything right — vet the operator, review the geology, get independent engineering — and the well can still come in dry. A 20% dry hole rate on development wells means 1 in 5 will fail regardless of how good the data looks. For exploratory wells, it's 3 in 5. No amount of due diligence eliminates subsurface uncertainty.",
  },
  {
    title: "The Fraud Rate Is the Highest of Any Asset Class",
    detail: "Oil & gas consistently ranks as the #1 source of investment fraud complaints with state regulators. The Reg D exemption means most offerings never see SEC review. Operators can raise unlimited capital from accredited investors with minimal disclosure. The regulatory gap is enormous and well-documented.",
  },
  {
    title: "Illiquidity — You Cannot Sell Your Position",
    detail: "Working interests, LP units, and JV participations are illiquid. There is no secondary market. If the well underperforms, you're stuck. If you need your capital back, you're stuck. Unlike stocks or bonds, you cannot exit on a bad day. You're locked in for the life of the well or program.",
  },
  {
    title: "Operator Control & Information Asymmetry",
    detail: "The operator controls everything: drilling, completion, production, marketing, and expense allocation. You see monthly statements — but you don't see the invoices behind them. If the operator bills affiliated services at above-market rates, your revenue disappears into their pocket. Most JOAs give investors audit rights, but exercising them is expensive and time-consuming.",
  },
  {
    title: "Commodity Price Exposure Is a Double-Edged Sword",
    detail: "The same commodity exposure that provides an inflation hedge can destroy returns. In 2015–16, oil crashed from $100 to $26. In 2020, it briefly went negative. Wells that were economic at $70/bbl become money-losers at $40. You can't hedge this risk without institutional-grade futures contracts most retail investors can't access.",
  },
  {
    title: "Tax Benefits Can Mask Bad Economics",
    detail: "The biggest danger in oil & gas investing: a deal that only makes sense because of the tax write-off. If you invest $100K and the well produces nothing, your ~$35K tax savings means you still lost $65K. Promoters who lead with taxes and downplay economics are selling you a smaller loss, not a good investment.",
  },
  {
    title: "Environmental Liability Can Follow You",
    detail: "As a working interest owner, you are a legally responsible party for environmental remediation. If the well causes contamination and the operator goes bankrupt, state regulators can come after YOU for cleanup costs. This liability is real, rarely disclosed, and potentially catastrophic.",
  },
];

export default function HonestProsAndCons() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex items-start gap-2">
          <Scale className="w-4 h-4 text-crude-gold mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">We're not selling you anything.</strong> This list presents the genuine advantages alongside the genuine dangers. If a financial advisor or operator only tells you the left column, they're selling. If a cynic only tells you the right column, they don't understand the asset class. The truth is both columns, simultaneously.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros */}
        <div>
          <h3 className="text-sm font-bold text-drill-green uppercase tracking-wide flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" /> The Legitimate Case For
          </h3>
          <div className="space-y-3">
            {pros.map((item, i) => (
              <div key={i} className="rounded-xl border border-drill-green/20 bg-card p-4">
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div>
          <h3 className="text-sm font-bold text-flare-red uppercase tracking-wide flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4" /> The Honest Case Against
          </h3>
          <div className="space-y-3">
            {cons.map((item, i) => (
              <div key={i} className="rounded-xl border border-flare-red/20 bg-card p-4">
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}