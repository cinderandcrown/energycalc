import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link2, FileCheck, Zap, Leaf, Truck, ShieldCheck } from "lucide-react";

const useCases = [
  {
    icon: Link2,
    title: "Supply Chain Tracking",
    badge: "Production",
    status: "Active",
    description: "Blockchain records every barrel from wellhead to refinery — who produced it, how it was transported, and where it was sold. Companies like ONG.social and Data Gumbo are deploying blockchain-based smart contracts that auto-verify field tickets, eliminating overbilling and service company disputes. Pioneer Natural Resources piloted this in the Permian Basin.",
    example: "A pumper reports 50 bbls hauled → blockchain verifies against SCADA tank levels → auto-approves or flags discrepancy → payment releases automatically. No more he-said-she-said on hauling tickets.",
  },
  {
    icon: FileCheck,
    title: "Land & Title Verification",
    badge: "Legal",
    status: "Emerging",
    description: "Mineral rights and lease ownership records on-chain create an immutable chain of title. Wyoming and Colorado have passed legislation enabling blockchain-based land records. This could eliminate the months-long title opinion process that delays every oil & gas transaction.",
    example: "Instead of hiring a landman to spend 6 weeks abstracting title at $300/day, a blockchain title system shows the complete ownership chain instantly — every conveyance, assignment, and override back to patent.",
  },
  {
    icon: Zap,
    title: "Automated JIB & Revenue Distribution",
    badge: "Finance",
    status: "Active",
    description: "Smart contracts replace the manual Joint Interest Billing (JIB) process. When production revenue hits the escrow contract, it automatically splits payments to all interest owners based on their recorded ownership percentages — royalty owners, WI holders, and ORRI holders all get paid simultaneously.",
    example: "Well produces $100K in monthly revenue → smart contract deducts LOE ($15K) and severance tax ($4.6K) → distributes 75% NRI to WI holders proportionally → pays royalty owners their 25% → all in under 60 seconds, fully auditable.",
  },
  {
    icon: Leaf,
    title: "Carbon Credit & ESG Tracking",
    badge: "Environmental",
    status: "Growing",
    description: "Tokenized carbon credits verify emissions reductions on-chain. Methane capture, flare elimination, and well plugging can be measured via IoT sensors, verified by oracles, and minted as tradeable carbon tokens. This creates a transparent, liquid market for energy ESG compliance.",
    example: "Operator installs vapor recovery unit → IoT sensors measure 500 tons/yr of methane captured → oracle verifies against EPA emissions factors → 500 carbon tokens minted → sold on Toucan Protocol or KlimaDAO marketplace.",
  },
  {
    icon: Truck,
    title: "Commodity Trading & Settlement",
    badge: "Trading",
    status: "Active",
    description: "Blockchain enables T+0 (instant) commodity settlement vs. the traditional T+2 clearing process. Platforms like Vakt (backed by BP, Shell, and Chevron) are digitizing post-trade processes for physical crude. This reduces counterparty risk and frees up billions in trapped collateral.",
    example: "Buyer and seller agree on 10,000 bbls WTI at $72 → smart contract locks funds in escrow → pipeline confirms physical delivery → funds release instantly. No clearing house, no settlement risk, no 48-hour wait.",
  },
  {
    icon: ShieldCheck,
    title: "Investor Protection & Anti-Fraud",
    badge: "Compliance",
    status: "Emerging",
    description: "Blockchain creates an immutable record of every investor communication, fund movement, and operational decision. If an operator commits fraud, the evidence is on-chain and tamper-proof. Combined with on-chain production data from oracles, phantom well schemes and production manipulation become nearly impossible.",
    example: "Operator claims well produces 50 BOPD → on-chain oracle pulls actual production from state database (TX RRC API) → smart contract compares → if actual < 50% of claimed, auto-freezes distributions and alerts investors. Real-time fraud detection.",
  },
];

export default function BlockchainUseCases() {
  const statusColors = {
    Active: "bg-drill-green/10 text-drill-green",
    Emerging: "bg-crude-gold/10 text-crude-gold",
    Growing: "bg-primary/10 text-primary dark:text-accent",
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Blockchain Applications in Oil & Gas</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Beyond tokenized ownership, blockchain technology is being deployed across the energy value chain — from drilling operations to commodity trading. Here are the real-world applications that are reshaping how the industry operates.
      </p>

      <div className="space-y-3">
        {useCases.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge variant="secondary" className="text-[9px] py-0 px-1.5">{item.badge}</Badge>
                    <Badge className={`${statusColors[item.status]} border-0 text-[9px] font-bold`}>{item.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.description}</p>
                  <div className="rounded-lg bg-muted/50 border border-border p-2.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Real-World Example:</strong> {item.example}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}