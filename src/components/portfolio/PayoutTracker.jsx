import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Calculator, Droplets, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const typeIcons = {
  net_investment: Calculator,
  barrels_to_cash: Droplets,
  natgas_to_cash: Flame,
  rate_of_return: TrendingUp,
};

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function PayoutTracker({ calculations }) {
  const rorCalcs = calculations.filter((c) => c.calc_type === "rate_of_return" && c.results);

  if (rorCalcs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Payout Status Tracker</h3>
      <p className="text-xs text-muted-foreground mb-4">Capital recovery status from Rate of Return calculations</p>

      <div className="space-y-3">
        {rorCalcs.map((calc, i) => {
          const isPaidOut = calc.results?.isPaidOut;
          const payoutMonth = calc.results?.payoutMonth;
          const roi = calc.results?.simpleROI;
          const irr = calc.results?.annualIRR;
          const totalRevenue = calc.results?.totalRevenue || 0;
          const investment = calc.inputs?.netInvestment || 0;
          const progressPct = investment > 0 ? Math.min(100, (totalRevenue / investment) * 100) : 0;

          return (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${
                isPaidOut ? "border-drill-green/30 bg-drill-green/5" : "border-crude-gold/30 bg-crude-gold/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {isPaidOut ? (
                    <CheckCircle2 className="w-4 h-4 text-drill-green" />
                  ) : (
                    <Clock className="w-4 h-4 text-crude-gold" />
                  )}
                  <p className="text-sm font-semibold text-foreground">{calc.name}</p>
                </div>
                <Badge className={`text-[10px] font-bold border-0 ${isPaidOut ? "bg-drill-green/10 text-drill-green" : "bg-crude-gold/10 text-crude-gold"}`}>
                  {isPaidOut ? `Paid Out M${payoutMonth}` : "In Progress"}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${isPaidOut ? "bg-drill-green" : "bg-crude-gold"}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span>Investment: <strong className="text-foreground font-mono">${fmt(investment)}</strong></span>
                <span>Revenue: <strong className="text-foreground font-mono">${fmt(totalRevenue)}</strong></span>
                {roi != null && <span>ROI: <strong className={`font-mono ${roi > 0 ? "text-drill-green" : "text-flare-red"}`}>{roi.toFixed(1)}%</strong></span>}
                {irr != null && <span>IRR: <strong className="text-foreground font-mono">{irr.toFixed(1)}%</strong></span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}