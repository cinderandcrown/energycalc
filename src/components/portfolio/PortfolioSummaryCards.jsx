import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Shield, Layers } from "lucide-react";

const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function PortfolioSummaryCards({ stats }) {
  const cards = [
    {
      label: "Total Capital Deployed",
      value: `$${fmt(stats.totalInvested)}`,
      icon: DollarSign,
      color: "text-primary dark:text-accent",
      bg: "bg-primary/10 dark:bg-accent/10",
    },
    {
      label: "Total Year-1 Tax Savings",
      value: `$${fmt(stats.totalTaxSavings)}`,
      icon: Shield,
      color: "text-drill-green",
      bg: "bg-drill-green/10",
    },
    {
      label: "Projected Annual Cash Flow",
      value: `$${fmt(stats.totalAnnualCashFlow)}`,
      icon: TrendingUp,
      color: "text-crude-gold",
      bg: "bg-crude-gold/10",
    },
    {
      label: "Active Projects",
      value: stats.projectCount,
      icon: Layers,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="font-mono font-bold text-lg text-foreground">{card.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}