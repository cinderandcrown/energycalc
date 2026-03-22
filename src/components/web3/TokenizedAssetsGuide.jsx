import { motion } from "framer-motion";
import { Coins, ShieldCheck, BarChart3, Users, ArrowRight, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const benefits = [
  {
    icon: Coins,
    title: "Fractional Ownership",
    description: "Break a $500K working interest into thousands of tokens, enabling minimums as low as $1,000.",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
  },
  {
    icon: BarChart3,
    title: "24/7 Liquidity",
    description: "Tokenized interests trade on security token exchanges (tZERO, INX), providing exit options unavailable in traditional structures.",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Revenue Distribution",
    description: "Smart contracts split production revenue by token ownership. Every payment is auditable on-chain.",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
  },
  {
    icon: Users,
    title: "Decentralized Governance",
    description: "Token holders vote on well operations, AFE approvals, and operator replacement — enforced by smart contracts.",
    color: "text-[#9b59b6]",
    bg: "bg-[#9b59b6]/10",
  },
  {
    icon: Globe,
    title: "Global Investor Access",
    description: "Compliant STOs give global investors access to U.S. energy assets, tax advantages, and commodity exposure.",
    color: "text-flare-red",
    bg: "bg-flare-red/10",
  },
];

const comparisons = [
  { feature: "Minimum Investment", traditional: "$50K – $500K", tokenized: "$1K – $10K" },
  { feature: "Liquidity", traditional: "Months to sell (if ever)", tokenized: "Trade anytime on exchanges" },
  { feature: "Revenue Transparency", traditional: "Operator-provided statements", tokenized: "On-chain, auditable by anyone" },
  { feature: "Investor Governance", traditional: "Limited (operator controls)", tokenized: "DAO voting on key decisions" },
  { feature: "Settlement Time", traditional: "30–90 days", tokenized: "Minutes (blockchain finality)" },
  { feature: "Regulatory Compliance", traditional: "Reg D 506(b/c)", tokenized: "Reg D / Reg A+ via STO" },
  { feature: "Production Verification", traditional: "Trust the operator", tokenized: "On-chain oracle data feeds" },
];

export default function TokenizedAssetsGuide() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-xl border-2 border-crude-gold/30 bg-crude-gold/5 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">What is tokenization?</strong> Converting ownership in a real-world asset (working interest, royalty, mineral rights) into digital tokens on a blockchain. Each token represents a tradeable fraction with proportional rights to revenue, tax benefits, and governance.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Why Tokenization Matters for Energy Investors</h3>
        {benefits.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-border bg-card p-5 overflow-x-auto">
        <h3 className="text-sm font-bold text-foreground mb-4">Traditional vs. Tokenized Energy Investment</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Feature</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">Traditional</th>
              <th className="text-left text-xs font-medium text-muted-foreground pb-2">
                <span className="flex items-center gap-1">Tokenized <Badge className="bg-crude-gold/10 text-crude-gold border-0 text-[9px]">WEB3</Badge></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row) => (
              <tr key={row.feature} className="border-b border-border/50">
                <td className="py-2.5 text-foreground font-medium text-xs">{row.feature}</td>
                <td className="py-2.5 text-xs text-muted-foreground">{row.traditional}</td>
                <td className="py-2.5 text-xs text-drill-green font-medium">{row.tokenized}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}