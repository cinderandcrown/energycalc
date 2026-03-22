import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Landmark, Shield, Lock, Globe, Users, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const trusts = [
  {
    icon: Landmark,
    title: "Irrevocable Life Insurance Trust (ILIT)",
    badge: "Estate Tax Elimination",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    purpose: "Remove life insurance proceeds from your taxable estate. A $5M policy inside an ILIT passes to heirs 100% estate-tax-free.",
    howItWorks: [
      "You create an irrevocable trust and name it as the owner AND beneficiary of a life insurance policy.",
      "You make annual gifts to the trust (using your annual gift tax exclusion — $18K/person in 2024) to cover premium payments.",
      "The trust sends 'Crummey notices' to beneficiaries giving them a temporary right to withdraw the gift (they don't — this is just a technicality to qualify for the annual exclusion).",
      "When you die, the insurance proceeds go to the trust — NOT your estate. Zero estate tax on the proceeds.",
      "The trustee distributes funds to your beneficiaries according to your instructions. You can include 'spendthrift' provisions to protect against creditors and irresponsible spending.",
    ],
    numbers: "At the current 40% estate tax rate, a $5M policy outside an ILIT costs your heirs $2M in estate tax. Inside an ILIT: $0 estate tax. Net savings: $2,000,000.",
    warning: "The 3-year rule: if you transfer an existing policy to an ILIT and die within 3 years, the proceeds are pulled back into your estate. Solution: have the trust purchase a NEW policy from the start.",
  },
  {
    icon: Shield,
    title: "Dynasty Trust (Perpetual / Multi-Generational)",
    badge: "Infinite Generational Wealth",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    purpose: "Transfer wealth across unlimited generations without ever paying estate tax again. Fund once, protect forever.",
    howItWorks: [
      "You fund an irrevocable trust in a 'dynasty trust' state (South Dakota, Nevada, Alaska, Delaware) that has abolished the Rule Against Perpetuities.",
      "You use your lifetime gift/estate tax exemption ($13.61M in 2024) to fund the trust. No gift tax is owed.",
      "The trust owns income-producing assets — oil & gas royalties, mineral rights, working interests, equities — and distributes income to beneficiaries across generations.",
      "Because the assets are in the trust (not owned by beneficiaries), they are protected from beneficiaries' creditors, divorcing spouses, and lawsuits.",
      "When a beneficiary dies, the trust assets are NOT included in their estate. No estate tax — ever — for any generation.",
    ],
    numbers: "A $10M dynasty trust growing at 7% for 3 generations (90 years) becomes ~$574M — ALL estate-tax-free. Without the trust, estate tax would consume ~40% at each generational transfer, leaving only ~$49M. The dynasty trust preserves 10x+ more wealth.",
    warning: "Generation-Skipping Transfer (GST) tax applies if you exceed your exemption. Use your full $13.61M GST exemption when funding. Also, some states tax trust income at high rates — choose a no-income-tax trust state.",
  },
  {
    icon: Users,
    title: "Grantor Retained Annuity Trust (GRAT)",
    badge: "Zero-Tax Wealth Transfer",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    purpose: "Transfer appreciating assets (like oil & gas interests) to heirs at zero gift tax cost. Used by nearly every billionaire family in America.",
    howItWorks: [
      "You transfer assets to an irrevocable trust and retain the right to receive annuity payments for a fixed term (typically 2–10 years).",
      "The annuity is calculated using the IRS §7520 rate. You structure it so the present value of annuity payments equals the value of assets transferred — making the taxable gift effectively $0 ('zeroed-out GRAT').",
      "If the assets grow faster than the §7520 rate (currently ~5%), ALL excess growth passes to your heirs gift-tax-free.",
      "You can 'cascade' GRATs — when one term ends, roll remaining assets into a new GRAT. This is called a 'rolling GRAT' strategy.",
      "Oil & gas interests are ideal GRAT assets because they can generate high returns (25–40% IRR), far exceeding the §7520 hurdle rate.",
    ],
    numbers: "Transfer $5M in oil & gas working interests to a 2-year GRAT at a 5% §7520 rate. If the interests return 30% annually, ~$2.1M passes to heirs completely gift-tax and estate-tax-free. Taxable gift: $0.",
    warning: "If you die during the GRAT term, the assets snap back into your estate. Use short-term (2–3 year) GRATs to minimize mortality risk. Also, GRATs don't get a stepped-up basis — heirs take your cost basis.",
  },
  {
    icon: Lock,
    title: "Domestic Asset Protection Trust (DAPT)",
    badge: "Creditor Shield",
    color: "text-flare-red",
    bg: "bg-flare-red/10",
    purpose: "Protect assets from future creditors, lawsuits, and judgments — while you're still alive and can benefit from the trust.",
    howItWorks: [
      "You create a self-settled irrevocable trust in a DAPT state (South Dakota, Nevada, Delaware, Alaska, Wyoming are strongest).",
      "You transfer assets into the trust. You can be a discretionary beneficiary — meaning the trustee CAN distribute to you, but no creditor can force it.",
      "After the state's statute of limitations (typically 2–4 years), the assets are protected from most future creditors.",
      "Use an independent trustee or trust company in the DAPT state. You should NOT be the sole trustee.",
      "Can hold oil & gas interests, royalties, real estate, cash, securities — virtually any asset.",
    ],
    numbers: "A surgeon with $3M in energy royalties faces a $2M malpractice judgment. If the royalties are in a Nevada DAPT (funded 3+ years prior), they are protected. Without the DAPT, the judgment creditor can seize the royalties.",
    warning: "DAPTs don't protect against fraudulent transfers. You MUST fund the trust BEFORE any claim or threatened claim arises. Transferring assets after a lawsuit is filed (or when one is foreseeable) is fraudulent conveyance and the court will claw it back. Plan ahead — protection must be in place before you need it.",
  },
  {
    icon: Globe,
    title: "Charitable Remainder Trust (CRT)",
    badge: "Income + Tax Deduction",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    purpose: "Get an immediate tax deduction, receive income for life, and leave the remainder to charity. Used to sell highly appreciated assets tax-free.",
    howItWorks: [
      "You transfer appreciated oil & gas interests (or any asset) to a CRT. You receive an immediate income tax deduction for the charitable remainder value.",
      "The CRT can sell the assets inside the trust with NO capital gains tax — the full proceeds are reinvested.",
      "The trust pays you (and/or a spouse) a fixed annuity (CRAT) or a fixed percentage of trust value (CRUT) for life or a term of years.",
      "When you die (or the term ends), the remaining trust assets go to a charity of your choice.",
      "CRT income is taxed to you when distributed, but you've already received the upfront deduction AND avoided capital gains on the sale.",
    ],
    numbers: "Transfer $2M in appreciated mineral rights (basis: $200K) to a CRUT paying 5%/year. Immediate deduction: ~$600K–$800K (varies by age and rate). The CRT sells for $2M — no capital gains tax (saves ~$360K). You receive ~$100K/year for life.",
    warning: "CRTs are irrevocable — you can't get the principal back. The payout rate must be at least 5% and the charity must receive at least 10% of the initial value. Not suitable if you need access to the full principal.",
  },
];

function TrustCard({ trust }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = trust.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl ${trust.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${trust.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-bold text-foreground">{trust.title}</p>
              <Badge className={`${trust.bg} ${trust.color} border-0 text-[10px] font-bold`}>{trust.badge}</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{trust.purpose}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs font-bold text-foreground pl-12">How It Works:</p>
              <div className="space-y-2 pl-12">
                {trust.howItWorks.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="ml-12 p-3 rounded-lg bg-drill-green/5 border border-drill-green/20">
                <p className="text-xs leading-relaxed">
                  <strong className="text-drill-green">By the Numbers:</strong>{" "}
                  <span className="text-muted-foreground">{trust.numbers}</span>
                </p>
              </div>
              <div className="ml-12 p-3 rounded-lg bg-flare-red/5 border border-flare-red/20">
                <p className="text-xs leading-relaxed">
                  <AlertTriangle className="w-3 h-3 text-flare-red inline mr-1" />
                  <strong className="text-flare-red">Watch Out:</strong>{" "}
                  <span className="text-muted-foreground">{trust.warning}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrustStrategies() {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Trust structures for minimizing estate taxes, protecting assets, and transferring wealth across generations. Implement with qualified legal counsel.
        </p>
      </div>
      {trusts.map((t) => (
        <TrustCard key={t.title} trust={t} />
      ))}
    </div>
  );
}