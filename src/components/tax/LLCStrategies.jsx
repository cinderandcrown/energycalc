import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Building2, Shield, Lock, DollarSign, Scale, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const structures = [
  {
    icon: Building2,
    title: "Single-Member LLC for Each Well / Property",
    badge: "Basic Protection",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    summary: "Hold each oil & gas investment in its own LLC. If one well has an environmental liability or lawsuit, the others are insulated.",
    details: [
      "Create a separate LLC for each well, lease, or property interest. This is standard practice for sophisticated operators and investors.",
      "A single-member LLC is a 'disregarded entity' for tax purposes — all income/losses flow to your personal return. No separate tax filing required.",
      "If Well A has a blowout, environmental cleanup, or injury lawsuit, only the assets in Well A's LLC are at risk. Wells B, C, and D are untouched.",
      "Wyoming and New Mexico LLCs are popular for oil & gas — Wyoming has no state income tax and strong charging order protection. New Mexico offers privacy and low fees.",
      "Cost: ~$100–$300/year per LLC depending on the state. A trivial price for asset isolation.",
    ],
    proTip: "Name your LLCs something generic (e.g., 'Permian Holdings 1, LLC') rather than your personal name. This adds a layer of privacy and makes it harder for plaintiffs' attorneys to identify your total asset picture in litigation discovery.",
  },
  {
    icon: Layers,
    title: "Holding Company LLC (Nested LLC Structure)",
    badge: "Advanced Protection",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    summary: "Stack LLCs: a parent holding company LLC owns the individual property LLCs. Centralized management with maximum isolation.",
    details: [
      "Structure: You (or your trust) own a Wyoming Holding LLC. The Holding LLC owns subsidiary LLCs in the states where your wells operate.",
      "The Holding LLC is your single point of management — one bank account, one set of books. Subsidiary LLCs hold individual assets.",
      "Wyoming's Series LLC statute lets you create 'cells' within a single LLC, each with separate liability protection. Even cheaper than individual LLCs.",
      "Profits flow up: Subsidiary LLC → Holding LLC → You (or your trust). Tax treatment is pass-through at every level.",
      "If a creditor gets a judgment against YOU personally, Wyoming's charging order protection means they can only get distributions — they can't seize LLC assets or force distributions.",
    ],
    proTip: "The 'fortress' structure used by family offices: Dynasty Trust (South Dakota) → Holding LLC (Wyoming) → Individual Property LLCs (operating states). This gives you asset protection, estate tax elimination, AND pass-through tax treatment simultaneously.",
  },
  {
    icon: Scale,
    title: "Limited Partnership (LP) for Energy Investments",
    badge: "No SE Tax + Protection",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    summary: "Limited partners in oil & gas pay ZERO self-employment tax on their share of income. An LP also provides strong liability protection.",
    details: [
      "Structure: An LLC serves as General Partner (GP), and you (or your trust) are the Limited Partner (LP).",
      "LP income from oil & gas is NOT subject to self-employment tax (15.3%). On $200K of oil income, that's a $30,600 annual savings vs. a working interest held directly.",
      "As a Limited Partner, your liability is limited to your investment. You're not personally liable for well operations, environmental issues, or injuries.",
      "The GP (your LLC) manages operations and assumes unlimited liability — but the LLC shields your personal assets from the GP's liability.",
      "LPs are the standard structure for oil & gas investment partnerships and joint ventures. Every major drilling fund uses this structure.",
    ],
    proTip: "The trade-off: LP interests are passive by default (passive activity rules apply). If you want to use losses against active income, you either need to (a) materially participate (500+ hours) or (b) hold a working interest through a GP entity. Discuss with your CPA which structure optimizes your specific tax situation.",
  },
  {
    icon: DollarSign,
    title: "S-Corp Election for Operator Income",
    badge: "SE Tax Savings",
    color: "text-flare-red",
    bg: "bg-flare-red/10",
    summary: "If you're an active operator, an S-Corp election lets you split income between salary (subject to payroll tax) and distributions (not subject to payroll tax).",
    details: [
      "An S-Corp pays you a 'reasonable salary' — subject to FICA/payroll taxes. Income above that salary is distributed as profit — NO payroll tax.",
      "Example: Your operating company earns $400K. You pay yourself $150K salary (payroll tax applies). The remaining $250K is distributed — saving ~$38K in payroll taxes.",
      "The IRS requires 'reasonable compensation' — if you pay yourself $20K salary on $400K of income, expect an audit. Work with a CPA to set the right level.",
      "S-Corps are most beneficial for active operators, consultants, and landmen with high earned income. Less relevant for passive investors.",
      "S-Corp income retains its character for oil & gas deductions — IDCs, depletion, and depreciation all flow through to your personal return.",
    ],
    proTip: "Combine the S-Corp with a solo 401(k): contribute up to $69K/year (2024, if over 50) in pre-tax dollars, further reducing your taxable income. An operator making $400K can shelter $69K in a 401(k) + $160K in IDC deductions = $229K sheltered. Effective tax rate on a $400K income: potentially under 15%.",
  },
  {
    icon: Lock,
    title: "Family Limited Partnership (FLP) for Wealth Transfer",
    badge: "Discounted Gifting",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    summary: "Transfer oil & gas interests to your children at a 25–40% discount to fair market value — legally — using valuation discounts on LP interests.",
    details: [
      "You create an FLP and contribute oil & gas properties. You (or your LLC) are the 1% GP. Your children receive 99% LP interests.",
      "LP interests in an FLP are DISCOUNTED for gift tax purposes because they lack marketability and control. Typical discounts: 25–40%.",
      "A $1M interest, discounted 35%, has a gift tax value of $650K. You've transferred $1M of value while only using $650K of your lifetime gift tax exemption.",
      "You retain control as GP — you manage the properties, make investment decisions, and control distributions. Your children own the economics but not the management.",
      "Over time, you gift additional LP interests using your annual exclusion ($18K/person/year) — gradually shifting wealth without triggering gift tax.",
    ],
    proTip: "The IRS scrutinizes FLPs aggressively. To survive an audit: (1) have a legitimate business purpose beyond tax savings, (2) get a qualified appraisal from a certified business valuation professional, (3) observe all formalities — annual meetings, K-1s, separate bank accounts, (4) don't commingle personal and FLP funds. The structure works, but sloppy execution gets it thrown out.",
  },
];

function StructureCard({ structure }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = structure.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl ${structure.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${structure.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-bold text-foreground">{structure.title}</p>
              <Badge className={`${structure.bg} ${structure.color} border-0 text-[10px] font-bold`}>{structure.badge}</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{structure.summary}</p>
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
              <div className="space-y-2 pl-12">
                {structure.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-drill-green shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
              <div className="ml-12 p-3 rounded-lg bg-crude-gold/5 border border-crude-gold/20">
                <p className="text-xs leading-relaxed">
                  <strong className="text-crude-gold">Pro Tip:</strong>{" "}
                  <span className="text-muted-foreground">{structure.proTip}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LLCStrategies() {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          LLC, LP, and corporate structures for limiting personal liability, reducing taxes, and enabling efficient wealth transfer.
        </p>
      </div>

      {/* Visual structure diagram */}
      <div className="p-4 rounded-xl border-2 border-dashed border-crude-gold/30 bg-crude-gold/5">
        <p className="text-xs font-bold text-foreground mb-2 text-center">Recommended Structure for $250K+ Energy Investors</p>
        <div className="flex flex-col items-center gap-1.5 text-[11px]">
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 font-semibold text-foreground">You (or Dynasty Trust)</div>
          <div className="text-muted-foreground">↓ owns</div>
          <div className="px-3 py-1.5 rounded-lg bg-crude-gold/10 border border-crude-gold/20 font-semibold text-foreground">Holding LLC (Wyoming)</div>
          <div className="text-muted-foreground">↓ owns</div>
          <div className="flex gap-2 flex-wrap justify-center">
            <div className="px-2 py-1 rounded bg-muted border border-border text-muted-foreground">Well A LLC</div>
            <div className="px-2 py-1 rounded bg-muted border border-border text-muted-foreground">Well B LLC</div>
            <div className="px-2 py-1 rounded bg-muted border border-border text-muted-foreground">Royalties LLC</div>
          </div>
        </div>
      </div>

      {structures.map((s) => (
        <StructureCard key={s.title} structure={s} />
      ))}
    </div>
  );
}