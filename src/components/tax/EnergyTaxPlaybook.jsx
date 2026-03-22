import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, DollarSign, Shield, BarChart3, Flame, TrendingUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const strategies = [
  {
    icon: Zap,
    title: "Intangible Drilling Costs (IDC) — The Year-1 Nuclear Deduction",
    badge: "Up to 100% Deduction",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    summary: "Deduct 60–80% of your entire investment in the year you write the check. No other asset class in America offers this.",
    details: [
      "IDCs include labor, chemicals, mud, fuel, grease, hauling, supplies, surveying, and ground clearing — everything except the physical equipment.",
      "For a typical well, IDCs represent 60–80% of total drilling costs. On a $500K investment, that's $300K–$400K deductible immediately.",
      "At a 37% federal bracket + 3.8% NIIT + state tax, a $400K IDC deduction can save $160K–$180K in Year 1.",
      "IDCs can offset ALL types of income — W-2, 1099, capital gains, business income — when you hold a working interest.",
      "Alternative Minimum Tax (AMT): IDCs are a preference item. High earners should model AMT impact. A good CPA structures the investment to minimize AMT exposure.",
    ],
    proTip: "Structure your investment to close in Q4 and spud before Dec 31. This allows you to take the full IDC deduction in the current tax year even if the well isn't completed until next year. The IRS rule: the deduction is taken when the expenditure is incurred, not when the well produces.",
  },
  {
    icon: DollarSign,
    title: "Percentage Depletion Allowance — 15% Tax-Free Income Forever",
    badge: "15% Tax-Free",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    summary: "The IRS lets you exclude 15% of gross oil & gas income from taxation — indefinitely — even after you've recovered your entire investment.",
    details: [
      "Unlike cost depletion (which stops when you've recovered your basis), percentage depletion has NO limit on total deductions over the life of the well.",
      "This means you can deduct MORE than your original investment over time. No other asset class has this feature.",
      "The deduction is 15% of gross income from the property, limited to 100% of net income from that property (can't create a loss).",
      "Available to independent producers and royalty owners. NOT available to integrated oil companies (ExxonMobil, Chevron, etc.).",
      "Applies to the first 1,000 barrels/day of oil equivalent per day. For small-to-mid investors, this is rarely a limitation.",
    ],
    proTip: "Percentage depletion is calculated property-by-property. If you invest in multiple wells, each gets its own 15% deduction. Diversifying across 3–5 wells multiplies this benefit while also spreading geological risk.",
  },
  {
    icon: BarChart3,
    title: "Tangible Drilling Costs (TDC) — MACRS Depreciation",
    badge: "7-Year Depreciation",
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    summary: "Physical equipment (casing, tubing, wellhead, tanks) qualifies for accelerated depreciation — and in many years, 100% bonus depreciation.",
    details: [
      "TDCs typically represent 20–40% of total well cost. This covers casing, tubing, Christmas tree, separators, tank batteries, and pumping units.",
      "Under MACRS, oil & gas equipment is 7-year property. With bonus depreciation (check current year's rate), much of this can be written off in Year 1.",
      "Section 179 expensing may also apply for qualifying equipment, subject to annual limits.",
      "Even without bonus depreciation, the 7-year MACRS schedule front-loads deductions: ~14%, ~25%, ~17%, ~12.5%, ~9%, ~9%, ~9%, ~4.5%.",
      "Combined with IDCs, a well structured properly can generate 85–100% of its total cost as deductions within the first 2 years.",
    ],
    proTip: "Keep an eye on Congress. Bonus depreciation rates phase down unless extended. In years with 100% bonus, accelerate equipment purchases. In phase-down years, consider whether Section 179 or standard MACRS gives a better result for your income level.",
  },
  {
    icon: Shield,
    title: "Working Interest = Active Income (Bypass Passive Activity Rules)",
    badge: "No Passive Limits",
    color: "text-flare-red",
    bg: "bg-flare-red/10",
    summary: "Oil & gas working interests are one of the only investments where losses are NOT subject to passive activity limitations — they offset W-2 and other active income directly.",
    details: [
      "Under IRC §469(c)(3), working interests in oil & gas properties held through an entity that does NOT limit liability are treated as active income.",
      "This means losses from your oil & gas investment can offset your salary, bonus, 1099 income, and business income — dollar for dollar.",
      "This is unique. Real estate losses are passive (limited to $25K for most taxpayers). Stock losses are capital (limited to $3K/year). Oil & gas working interest losses? Unlimited offset against active income.",
      "The key requirement: you must hold the working interest through an entity that does NOT limit your liability (general partnership or directly). If held through an LLC or LP, the passive rules MAY apply unless you materially participate.",
      "Material participation safe harbor: if you spend 500+ hours/year on oil & gas activities, or if it's your principal business, you qualify even through an LLC.",
    ],
    proTip: "High-income W-2 earners: this is the single most powerful feature of oil & gas investing. A surgeon making $800K/year can invest $200K in a working interest, generate $160K in IDC deductions, and reduce federal tax by ~$60K — something impossible with real estate or stocks. Structure through a GP interest or ensure material participation if using an LLC.",
  },
  {
    icon: Flame,
    title: "Net Operating Loss (NOL) Carryforward — Bank Your Deductions",
    badge: "Carry Forward",
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    summary: "If your oil & gas deductions exceed your current year income, the excess becomes a Net Operating Loss that can offset up to 80% of future income indefinitely.",
    details: [
      "Post-2017 TCJA rules: NOLs can be carried forward indefinitely (no expiration) and offset up to 80% of taxable income in any future year.",
      "Example: You have $300K income and generate $450K in IDC deductions. The $150K excess becomes an NOL carryforward.",
      "This NOL can then offset up to 80% of next year's income. If you make $300K next year, the NOL reduces taxable income to $60K.",
      "For investors with variable income (bonuses, stock options, business sales), banking NOLs from energy investments in lean years to offset windfall years is a powerful strategy.",
      "State NOL rules vary significantly. Some states don't allow NOL carryforwards. Check your state's rules.",
    ],
    proTip: "Time your energy investments to maximize NOL utility. If you know you'll have a large capital gain next year (selling a business, exercising stock options), invest in a drilling program THIS year. The IDC deductions create NOLs that offset next year's windfall.",
  },
  {
    icon: TrendingUp,
    title: "1031 Exchange — Defer Gains Indefinitely on Oil & Gas Properties",
    badge: "Tax Deferral",
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    summary: "Sell an oil & gas property and roll the proceeds into a like-kind property — defer ALL capital gains tax indefinitely.",
    details: [
      "IRC §1031 allows tax-deferred exchanges of 'like-kind' real property. Oil & gas mineral rights and working interests qualify as real property.",
      "You can exchange a depleting well for a new prospect, royalty interests for working interests, or mineral rights in one basin for another.",
      "The 45-day identification rule: you must identify replacement property within 45 days of closing the sale.",
      "The 180-day exchange rule: the exchange must be completed within 180 days.",
      "Use a Qualified Intermediary (QI) to hold funds. You cannot touch the money or the exchange is disqualified.",
      "Combine with stepped-up basis at death: hold the replacement property until death, and your heirs receive it at fair market value with NO capital gains tax on the deferred gain.",
    ],
    proTip: "The 1031 + stepped-up basis strategy is how generational wealth is built in energy. Invest, produce, exchange into new properties when production declines, repeat for decades. At death, heirs receive properties at stepped-up basis — the entire chain of deferred gains is eliminated. Pair this with a dynasty trust (see Trust Structures tab) and the wealth can pass free of estate tax too.",
  },
];

function StrategyCard({ strategy }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = strategy.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl ${strategy.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4.5 h-4.5 ${strategy.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-bold text-foreground">{strategy.title}</p>
              <Badge className={`${strategy.bg} ${strategy.color} border-0 text-[10px] font-bold`}>{strategy.badge}</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{strategy.summary}</p>
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
                {strategy.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-drill-green shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
              <div className="ml-12 p-3 rounded-lg bg-crude-gold/5 border border-crude-gold/20">
                <p className="text-xs leading-relaxed">
                  <strong className="text-crude-gold">Pro Tip:</strong>{" "}
                  <span className="text-muted-foreground">{strategy.proTip}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EnergyTaxPlaybook() {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Why energy?</strong> The U.S. tax code aggressively incentivizes domestic energy production. These aren't loopholes — they're deliberate policy tools written into the Internal Revenue Code. Congress <em>wants</em> you to drill. The strategies below are used by every sophisticated energy investor, from wildcatters to family offices managing $500M+.
        </p>
      </div>
      {strategies.map((s) => (
        <StrategyCard key={s.title} strategy={s} />
      ))}
    </div>
  );
}