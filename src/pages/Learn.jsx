import { useState } from "react";
import { ChevronDown, BookOpen, HelpCircle, ExternalLink, Search, GraduationCap, TrendingUp, Scale, DollarSign, Flame, Droplets, BarChart2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── GLOSSARY ────────────────────────────────────────────────────────────────
const GLOSSARY_CATEGORIES = [
  {
    category: "Ownership & Interests",
    icon: Scale,
    color: "text-primary dark:text-accent",
    bg: "bg-primary/10 dark:bg-accent/10",
    terms: [
      { term: "WI — Working Interest", definition: "The percentage ownership of the right to explore, drill, and produce from a well. WI owners bear their proportionate share of all drilling and operating costs and receive a proportionate share of production revenue after royalties." },
      { term: "NRI — Net Revenue Interest", definition: "The percentage of production revenue an interest owner receives after accounting for royalties and other burdens. Example: a 75% NRI on a 1/4 WI means you receive 18.75% of gross revenue." },
      { term: "ORRI — Overriding Royalty Interest", definition: "A royalty carved out of the working interest that does not bear any drilling or operating costs. ORRIs are often retained by landmen, geologists, or promoters and reduce the investor's net revenue." },
      { term: "Royalty Interest (RI)", definition: "A share of production granted to the mineral rights owner (landowner). Royalty owners bear zero cost for drilling or operations. Typical royalty rates range from 12.5% (1/8) to 25% (1/4) of gross production." },
      { term: "Net Profits Interest (NPI)", definition: "An interest that only pays out when the well generates net profits above all costs. NPIs are easily manipulated because costs can be inflated to keep 'net profits' at zero for extended periods. Treat with extreme caution." },
      { term: "Carried Interest", definition: "An arrangement where one party (the carried party) has its share of drilling costs paid by another party (the carrying party) in exchange for a larger share of future production or a back-in after payout." },
      { term: "Back-In After Payout", definition: "A provision allowing a party to convert their interest after the well has paid out. Common in farm-out agreements where the farmee earns an interest and the farmor retains a back-in after costs are recovered." },
      { term: "Farm-Out / Farm-In", definition: "A farm-out is when an operator (farmor) assigns part of their working interest to another party (farmee) in exchange for drilling obligations. The farmee farms in by accepting those obligations." },
      { term: "JOA — Joint Operating Agreement", definition: "The contract governing how co-owners of a working interest operate a well together. It specifies the operator's authority, non-operator rights, cost-sharing, AFE approval thresholds, and default provisions." },
    ]
  },
  {
    category: "Production & Measurement",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    terms: [
      { term: "BOPD — Barrels of Oil Per Day", definition: "Daily oil production rate. One barrel = 42 US gallons. A 100 BOPD well at $70/bbl generates ~$2,100/day in gross oil revenue before royalties, taxes, and expenses." },
      { term: "MCF — Thousand Cubic Feet", definition: "Standard unit for gas volume. 1 MCF ≈ 1 MMBTU of energy. Gas prices are quoted per MCF or MMBTU. A well producing 500 MCF/day at $3/MCF = $1,500/day gross." },
      { term: "MMBTU — Million British Thermal Units", definition: "Energy equivalent to approximately 1 MCF of natural gas. Henry Hub futures prices are quoted in $/MMBTU. Used interchangeably with MCF for pricing purposes." },
      { term: "BOE — Barrels of Oil Equivalent", definition: "A conversion unit equating natural gas to oil on an energy basis. 6 MCF of natural gas = 1 BOE. Used to compare production from oil and gas wells on a common unit basis." },
      { term: "IP Rate — Initial Production Rate", definition: "The flow rate of a new well immediately after completion and stimulation. Often used by operators in marketing materials. IP rates can be misleading — always ask for 30, 60, and 90-day average rates." },
      { term: "Decline Curve", definition: "The predictable pattern of decreasing production over time as reservoir pressure drops. Shale/tight oil wells (Permian, Eagle Ford) often decline 70–80% in Year 1. Conventional wells decline 10–15% annually. Critical for cashflow modeling." },
      { term: "EUR — Estimated Ultimate Recovery", definition: "The total volume of hydrocarbons expected to be economically recovered from a well over its producing life. Used by petroleum engineers to value reserves and estimate payouts." },
      { term: "NGL — Natural Gas Liquids", definition: "Hydrocarbon components of natural gas (ethane, propane, butane, pentane, natural gasoline) that condense out and can be sold as liquids. NGLs add significant incremental value to gas production, often priced as a % of WTI." },
      { term: "GOR — Gas-Oil Ratio", definition: "The ratio of gas produced to oil produced, expressed in MCF per barrel. High GOR wells produce proportionally more gas. GOR increases over time as reservoir pressure drops and more dissolved gas comes out of solution." },
      { term: "Water Cut", definition: "The percentage of produced fluid that is water vs. oil or gas. As wells age, water cut increases. High water cut means higher disposal costs (LOE) and lower net oil production per barrel of total fluid lifted." },
    ]
  },
  {
    category: "Drilling & Operations",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    terms: [
      { term: "AFE — Authorization for Expenditure", definition: "A line-item budget document for a proposed well or workover. The AFE details estimated costs for each phase of drilling and completion. Investors should always demand a detailed AFE before committing capital." },
      { term: "TD — Total Depth", definition: "The deepest point drilled in a wellbore. Measured in feet or meters. TD is reached when the target formation is penetrated and logged. Deeper wells generally cost more but may access better reservoirs." },
      { term: "Spud Date", definition: "The date drilling operations begin on a new well. Marks the official start of the drilling phase. Operators often report 'days to drill' from spud to TD as an efficiency metric." },
      { term: "Completion", definition: "The operations performed after drilling to prepare a well for production. For shale wells, this includes hydraulic fracturing (fracking). For conventional wells, it may involve perforating, acidizing, or sand control." },
      { term: "Hydraulic Fracturing (Fracking)", definition: "A stimulation technique where high-pressure fluid is pumped into a formation to create fractures, releasing trapped hydrocarbons. Essential for producing tight oil and shale gas. A single Permian Basin frac job can cost $2–5M." },
      { term: "Horizontal Drilling", definition: "Drilling a well that turns 90° from vertical to follow a horizontal reservoir layer (e.g., Wolfcamp, Haynesville). Horizontal wells contact much more reservoir rock and produce far more per well than vertical wells." },
      { term: "Workover", definition: "Remedial operations on an existing producing well to restore or increase production. Common workovers include pump replacements, perforating new zones, re-fracking, and scale/paraffin removal." },
      { term: "PW — Plugged & Abandoned Well", definition: "A well that has been permanently sealed with cement plugs per regulatory requirements. P&A costs ($20,000–$500,000+) are typically the operator's responsibility and should be budgeted in the well economics." },
      { term: "LOE — Lease Operating Expenses", definition: "Recurring costs to maintain and operate a producing well, including pumping, electricity, maintenance, chemicals, labor, and supervision. Usually $3–$15/bbl for onshore U.S. wells. High LOE can make marginal wells uneconomic." },
    ]
  },
  {
    category: "Financial & Tax Terms",
    icon: DollarSign,
    color: "text-crude-gold",
    bg: "bg-crude-gold/10",
    terms: [
      { term: "IDC — Intangible Drilling Costs", definition: "Costs with no salvage value: labor, fuel, mud, drilling services. IDCs are typically 65–85% of total drilling costs. Working interest owners can deduct 100% of IDCs in the year incurred — the cornerstone of oil & gas tax benefits." },
      { term: "Percentage Depletion Allowance", definition: "A federal tax deduction of 15% of gross income from a well, available to independent producers (not major integrated companies). Unlike cost depletion, percentage depletion can exceed your basis in the property and is effectively a permanent tax preference." },
      { term: "MACRS Depreciation", definition: "Modified Accelerated Cost Recovery System — the IRS method for depreciating tangible oil field equipment. Standard oil field equipment uses a 7-year recovery schedule, with 14.29% deductible in Year 1 (100% bonus depreciation available under TCJA)." },
      { term: "Active Income Treatment", definition: "A critical IRS classification for working interest owners. Unlike rental real estate (passive activity), working interests are treated as active income — losses can fully offset W-2 wages, business income, and other ordinary income without passive activity limits." },
      { term: "IRR — Internal Rate of Return", definition: "The annualized discount rate at which the NPV of all cash flows equals zero. A 25% IRR means your investment earns 25% per year compounded. Generally, oil & gas deals should target 20%+ IRR to compensate for the risk premium." },
      { term: "NPV — Net Present Value", definition: "The sum of all discounted future cash flows minus the initial investment. A positive NPV at a 10–15% discount rate indicates the investment exceeds a minimum acceptable return. NPV10 (10% discount rate) is the industry standard." },
      { term: "Payout Period", definition: "Months required for cumulative net revenue to equal initial investment (100% ROC). A 24-month payout means you recover your full capital in 2 years. Short payout periods reduce risk exposure to commodity price volatility." },
      { term: "Promote / Carried Interest (Promoter)", definition: "The economic benefit taken by the operator/promoter above their contributed capital. A '2/3 for 3/4' deal means investors pay 2/3 of costs for 3/4 WI — the promoter contributes 1/3 of costs for 1/4 WI. Typical promotes range 20–33%." },
      { term: "Severance Tax", definition: "A state-level production tax on oil and gas extracted within that state. Texas: 4.6% on oil, 7.5% on gas. Oklahoma: ~7%. Louisiana: ~12.5%. Severance taxes are deducted before calculating net revenue to investors." },
      { term: "Ad Valorem Tax", definition: "A local property tax assessed on producing wells based on the value of the mineral rights and equipment. Varies by county. Added to LOE in most revenue statements and reduces net cash distributions to investors." },
      { term: "Cash-on-Cash Return", definition: "Annual net income divided by total cash invested, expressed as a percentage. A $50,000 investment generating $8,000/year net = 16% cash-on-cash. Does not account for tax benefits — after-tax cash-on-cash is often dramatically higher." },
    ]
  },
  {
    category: "Commodities & Pricing",
    icon: TrendingUp,
    color: "text-drill-green",
    bg: "bg-drill-green/10",
    terms: [
      { term: "WTI — West Texas Intermediate", definition: "The U.S. benchmark crude oil grade. Light, sweet (low sulfur), priced at Cushing, Oklahoma. WTI is the primary U.S. futures contract traded on NYMEX. Most domestic wells are priced at a differential to WTI." },
      { term: "Brent Crude", definition: "The international benchmark crude oil grade, sourced from the North Sea. Brent typically trades at a slight premium to WTI. Used to price approximately 2/3 of global oil production. Brent-WTI spreads fluctuate with U.S. pipeline infrastructure." },
      { term: "Henry Hub", definition: "The primary pricing point for U.S. natural gas futures, located in Erath, Louisiana. Henry Hub spot and NYMEX futures prices serve as the U.S. benchmark. Basis differentials apply to wells in remote production areas." },
      { term: "Basis Differential", definition: "The price discount (or premium) applied to a commodity at a specific location versus the benchmark (WTI or Henry Hub). Remote wells with limited pipeline takeaway capacity trade at wider (worse) differentials. Can significantly impact well economics." },
      { term: "Strip Price", definition: "The average of futures contract prices across a defined time period (e.g., 12-month strip). Operators and banks use strip pricing to evaluate well economics and determine borrowing base. More conservative than spot pricing." },
      { term: "Crack Spread", definition: "The price spread between crude oil and refined products (gasoline, diesel). Refinery margins are measured by crack spreads. Wide crack spreads increase demand for crude oil from domestic refiners." },
      { term: "Contango vs. Backwardation", definition: "Contango: futures prices are higher than spot (market expects higher future prices). Backwardation: futures prices are lower than spot (market expects prices to fall). Backwardation signals tight current supply and is historically bullish for oil." },
      { term: "Wellhead Price", definition: "The price received for oil or gas at the point of production (the wellhead), before transportation or processing. Wellhead prices are typically lower than benchmark prices due to gathering, transportation, and processing deductions." },
    ]
  },
  {
    category: "Regulatory & Legal",
    icon: Shield,
    color: "text-flare-red",
    bg: "bg-flare-red/10",
    terms: [
      { term: "Regulation D (Reg D)", definition: "SEC framework allowing companies to raise capital without full registration. Most oil & gas private placements rely on Rule 506(b) (up to 35 non-accredited investors, no general solicitation) or 506(c) (accredited only, general solicitation allowed)." },
      { term: "Accredited Investor", definition: "SEC-defined standard: $200K+ individual income ($300K joint) for 2 years, or $1M+ net worth excluding primary residence, or Series 7/65/82 license holder. Most oil & gas PPMs are restricted to accredited investors." },
      { term: "PPM — Private Placement Memorandum", definition: "The offering document for a private securities offering. A proper PPM includes risk factors, use of proceeds, operator history, well details, subscription agreement, and financial statements. Absence of any of these is a major red flag." },
      { term: "Form D", definition: "An SEC filing required within 15 days of the first sale in a Reg D offering. Investors should verify the Form D on SEC EDGAR (sec.gov) to confirm the offering is properly registered and the operator is legitimate." },
      { term: "Proportionate Reduction Clause", definition: "A lease clause ensuring that if the lessor doesn't own 100% of the minerals, royalties are reduced proportionately. Critical when reviewing title — fractional mineral ownership is common in old-producing basins." },
      { term: "Pooling / Unitization", definition: "Combining multiple tracts into a single drilling unit. Pooling is common in unconventional plays where wells must be drilled across multiple leases. Forced pooling (by state order) can include unwilling mineral owners." },
      { term: "Pugh Clause", definition: "A lease provision that releases depths or acreage not held by production at lease expiration. Protects mineral owners from an operator holding all rights based on shallow production. Negotiate for this in any new mineral lease." },
      { term: "HBP — Held by Production", definition: "When a lease stays in force because a well on the acreage is actively producing in paying quantities. Operators prioritize drilling HBP acreage to maintain lease rights. Leases not HBP expire and revert to the landowner." },
    ]
  },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: "Getting Started as an Investor",
    icon: GraduationCap,
    faqs: [
      {
        q: "How do I evaluate whether an oil & gas investment is legitimate?",
        a: "Start with the operator: verify their Form D on SEC EDGAR, check state court records, and search the state oil & gas board for permit history. Then evaluate the deal: demand an independent petroleum engineer's reserve report, a line-item AFE, title opinion, and 3 years of audited financials. Legitimate operators welcome due diligence — bad actors resist it."
      },
      {
        q: "What is a reasonable minimum investment for a working interest deal?",
        a: "Most private working interest placements require $25,000–$100,000 minimum per well. Programs (multiple wells) may have higher minimums. Be cautious of deals with very low minimums ($5,000–$10,000) as these often indicate high-volume, low-quality mass-marketed schemes targeting retail investors."
      },
      {
        q: "What's the difference between a working interest investment and a royalty investment?",
        a: "Working interest owners pay drilling and operating costs but can deduct IDCs for massive tax benefits. Royalty owners pay nothing and receive a fixed percentage of production with no cost exposure, but receive no IDC deductions and have lower upside potential. WI is higher risk/higher reward with better tax treatment; royalties are passive income with minimal tax benefits."
      },
      {
        q: "Do I need to be an accredited investor to participate in oil & gas deals?",
        a: "For most private placements under Reg D 506(b), yes — though the rules technically allow up to 35 non-accredited investors if they are 'sophisticated.' Under 506(c), all investors must be accredited and the operator must verify your status. If an operator didn't ask about accreditation, that's a regulatory red flag."
      },
      {
        q: "How long does it typically take to start receiving cash distributions from a well?",
        a: "A typical timeline: drilling (30–90 days after funding), completion (2–4 weeks after TD), pipeline hookup and first production (1–3 months after completion). You should generally expect first distributions 6–12 months after investing. Any operator promising cash flow within 30–60 days is unrealistic or selling a producing well, which should be explicitly stated."
      },
    ]
  },
  {
    category: "Understanding the Economics",
    icon: DollarSign,
    faqs: [
      {
        q: "How do IDC deductions actually reduce my out-of-pocket cost?",
        a: "Example: $100,000 investment with 75% IDC. $75,000 is deductible in Year 1 at a 37% federal tax bracket = $27,750 in tax savings. Your real out-of-pocket drops to ~$72,250 before the well produces a drop of oil. If the 15% depletion allowance and MACRS depreciation are factored in, the after-tax cost can drop even further. Use the Net Investment Calculator to model your exact scenario."
      },
      {
        q: "What is a '2/3 for 3/4' deal structure?",
        a: "This means investors pay 2/3 of drilling costs to earn a 3/4 (75%) working interest, while the operator pays 1/3 of costs to keep 1/4 (25%) WI. This is essentially a 33% promote — the operator retains more interest than their capital contribution warrants. Industry-standard promotes are 20–33%; anything above 40% deserves scrutiny."
      },
      {
        q: "What IRR should I expect from a good oil & gas well?",
        a: "A well-performing conventional well might generate 20–40% IRR. Shale/tight oil wells with high IP rates but steep decline curves often show high initial IRRs that taper. Key variables are: initial production rate, decline curve, oil price, LOE, and severance taxes. Use the Rate of Return calculator to model different scenarios. Never invest based on an operator's projected IRR alone — build your own model."
      },
      {
        q: "What happens if the well comes in dry or underperforms?",
        a: "A dry hole means you lose your entire drilling investment minus the tax benefits. At a 37% bracket with 75% IDC, your actual loss on a dry hole is ~$72,250 of a $100,000 investment after tax savings. If it's a producing well that underperforms, you'll receive lower distributions but still get some return. Always diversify across multiple wells or programs — no single well is guaranteed."
      },
      {
        q: "How is monthly revenue calculated from my working interest?",
        a: "Formula: Gross Revenue = Production (BOPD × Days) × Oil Price. Your share = Gross Revenue × Your NRI. Then subtract: LOE × Your WI, Severance Tax × Your NRI. Result = Your net monthly cash distribution. Example: 100 BOPD × 30 days × $70/bbl = $210,000 gross. 10% NRI = $21,000 before expenses and taxes."
      },
      {
        q: "What deductions come off my production revenue check before I receive it?",
        a: "Typical deductions from gross revenue before you receive your check: (1) Royalties/ORRIs (paid to landowners and overriders), (2) Severance taxes (state production tax), (3) Ad valorem taxes, (4) Gathering & transportation fees, (5) Processing fees (for gas/NGLs). Then separately, you'll be billed for your share of LOE monthly. Understanding all these deductions is critical — ask for a sample revenue statement before investing."
      },
    ]
  },
  {
    category: "Taxes & Accounting",
    icon: Scale,
    faqs: [
      {
        q: "Is 15% depletion allowance always applicable?",
        a: "The 15% statutory depletion is available to independent producers and royalty owners who are not classified as 'integrated oil companies.' It applies to gross income from the well, capped at 100% of net income from the property. The deduction effectively makes 15% of your oil & gas income permanently tax-free. It applies regardless of how much you've already deducted via cost depletion."
      },
      {
        q: "Can oil & gas losses offset my W-2 salary?",
        a: "Yes — this is the key advantage of working interests over almost every other investment. Because working interests are classified as active income (not passive), losses from IDC deductions can fully offset W-2 wages, business income, and other ordinary income without passive activity limits. This is explicitly authorized under IRC §469(c)(3). A CPA with oil & gas experience is essential to structure this correctly."
      },
      {
        q: "What tax forms will I receive from an oil & gas investment?",
        a: "You should receive: (1) Schedule K-1 if invested through a partnership/LLC, showing your share of income, deductions, and credits. (2) 1099-MISC if invested directly via a working interest. (3) Annual summary of IDC, depletion, depreciation, and net revenue. Late K-1s (after April 15) are common — budget for a tax extension."
      },
      {
        q: "What is 'recapture' and should I worry about it?",
        a: "If you sell a working interest after taking IDC deductions, the IRS may recapture those deductions as ordinary income (IRC §1254). This reduces the after-tax benefit if you flip the investment quickly. Long-term holds (3–7+ years) reduce recapture exposure. Always model the exit tax consequences with your CPA before investing."
      },
      {
        q: "How does 100% bonus depreciation (TCJA) affect oil & gas investments?",
        a: "The Tax Cuts & Jobs Act (2017) allows 100% first-year bonus depreciation on tangible equipment (normally 7-year MACRS). This accelerates the depreciation deduction to Year 1, compounding tax benefits alongside IDC deductions. 100% bonus depreciation has been phasing down (80% in 2023, 60% in 2024, 40% in 2025) — consult a CPA for the current rate."
      },
    ]
  },
  {
    category: "Risk & Due Diligence",
    icon: Shield,
    faqs: [
      {
        q: "What are the biggest risks in oil & gas investing?",
        a: "In order of frequency: (1) Commodity price risk — a drop from $70 to $50/bbl reduces revenue 28%. (2) Dry hole risk — 20–30% of exploratory wells are unproductive. (3) Operator fraud/mismanagement — the leading cause of total loss. (4) Production shortfall — wells underperform engineering estimates. (5) Regulatory risk — state/federal rule changes affecting drilling rights or environmental costs. (6) Liquidity risk — no public market for WI interests."
      },
      {
        q: "How do I verify an operator's track record?",
        a: "Step 1: Request a list of all wells they've drilled in the past 5 years with well names, API numbers, and state/county. Step 2: Pull production history on the state oil & gas board website (e.g., Texas RRC, Oklahoma OCC, North Dakota DMR). Step 3: Compare actual production to what was projected in prior PPMs. Step 4: Search PACER (federal courts) and state courts for investor lawsuits. Step 5: Call 3+ prior investors the operator gives you as references — and ask for unsolicited references too."
      },
      {
        q: "What should a legitimate PPM always contain?",
        a: "A compliant PPM must include: (1) Risk factors section (at least 3–5 pages of genuine risks, not boilerplate), (2) Use of proceeds showing exactly where your money goes, (3) Operator background including prior litigation history, (4) Description of the proposed well(s) with geological rationale, (5) Independent engineering reserve report or clear statement that none exists (a red flag), (6) Full description of compensation to operator/promoter, (7) Subscription agreement and representations, (8) Financial statements."
      },
      {
        q: "How do I protect myself if an operator defaults or goes bankrupt?",
        a: "Prevention is your best protection: (1) Invest through a properly structured LLC or limited partnership, not directly, (2) Ensure operating funds are held in escrow until the AFE threshold is reached, (3) Have the JOA reviewed by an independent oil & gas attorney, (4) Ensure you receive recorded assignment of your working interest in county deed records, (5) Confirm the operator carries well control insurance and general liability. If bankruptcy occurs despite this, your recorded WI assignment survives as a real property interest."
      },
      {
        q: "Is there a secondary market where I can sell my working interest?",
        a: "There is no organized exchange for working interests. Secondary sales happen through oil & gas brokers, direct negotiations with co-owners or the operator, or specialized energy asset marketplaces (e.g., EnergyNet, PLS Inc.). Liquidity is limited and you should expect significant price discounts on small working interests. Never invest money you may need within 3–5 years."
      },
    ]
  },
  {
    category: "Industry Structure & Basins",
    icon: BarChart2,
    faqs: [
      {
        q: "What are the major U.S. oil producing basins?",
        a: "Key onshore U.S. basins: Permian Basin (West Texas/New Mexico) — largest, most active, Wolfcamp/Spraberry zones; Eagle Ford (South Texas) — oil window + condensate; Bakken (North Dakota/Montana) — tight oil; DJ Basin (Colorado) — Niobrara/Codell; Anadarko/STACK/SCOOP (Oklahoma); Haynesville (Louisiana/Texas) — major gas play; Marcellus/Utica (Appalachia) — largest U.S. gas play. Each basin has unique decline curves, completion costs, and takeaway capacity."
      },
      {
        q: "What's the difference between conventional and unconventional wells?",
        a: "Conventional wells: produce from high-permeability reservoir rock where oil/gas flows naturally to the wellbore. Lower IP rates but slower decline curves. Less expensive to drill. Unconventional wells (shale/tight): low-permeability rock requiring horizontal drilling + hydraulic fracturing. Very high IP rates, very steep Year 1 declines (70–80%), higher drill/complete costs. Both types can be excellent investments with the right economics."
      },
      {
        q: "What is OPEC and how does it affect my investment?",
        a: "OPEC (Organization of Petroleum Exporting Countries) and OPEC+ (including Russia) collectively control ~40% of global oil production. Their output decisions directly set global oil prices. When OPEC cuts production, prices rise (good for your investment). When they flood the market (as in 2014–2016 and 2020), prices collapse. U.S. operators now respond faster with shale's short-cycle development, but global price risk remains unavoidable."
      },
      {
        q: "What does 'midstream' mean and why does it matter to investors?",
        a: "The energy sector has three segments: Upstream (exploration & production — where investors typically participate), Midstream (pipelines, gathering systems, processing plants), and Downstream (refineries, retail). Midstream matters to upstream investors because gathering/transportation/processing fees are deducted from your revenue. Wells without adequate takeaway infrastructure receive heavily discounted prices or can't produce at all."
      },
    ]
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function TermItem({ term, definition }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left hover:text-primary dark:hover:text-accent transition-colors gap-3">
        <span className="text-sm font-medium text-foreground">{term}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <p className="text-sm text-muted-foreground pb-3 leading-relaxed">{definition}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left hover:text-primary dark:hover:text-accent transition-colors gap-3">
        <span className="text-sm font-medium text-foreground pr-2">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <p className="text-sm text-muted-foreground pb-3 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Learn() {
  const [activeTab, setActiveTab] = useState("glossary");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGlossaryCat, setActiveGlossaryCat] = useState("all");
  const [activeFAQCat, setActiveFAQCat] = useState("all");

  const totalTerms = GLOSSARY_CATEGORIES.reduce((sum, c) => sum + c.terms.length, 0);
  const totalFAQs = FAQ_CATEGORIES.reduce((sum, c) => sum + c.faqs.length, 0);

  const filteredGlossary = GLOSSARY_CATEGORIES
    .filter(cat => activeGlossaryCat === "all" || cat.category === activeGlossaryCat)
    .map(cat => ({
      ...cat,
      terms: cat.terms.filter(t =>
        !searchQuery || t.term.toLowerCase().includes(searchQuery.toLowerCase()) || t.definition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.terms.length > 0);

  const filteredFAQs = FAQ_CATEGORIES
    .filter(cat => activeFAQCat === "all" || cat.category === activeFAQCat)
    .map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(f =>
        !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.faqs.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Learn</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Oil & gas investing — fully demystified</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Terms Defined", value: totalTerms, icon: BookOpen },
          { label: "FAQs Answered", value: totalFAQs, icon: HelpCircle },
          { label: "Topic Categories", value: GLOSSARY_CATEGORIES.length + FAQ_CATEGORIES.length, icon: GraduationCap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
            <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="font-mono font-bold text-lg text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search terms, concepts, or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted">
        {[
          { id: "glossary", label: `Glossary (${totalTerms})`, icon: BookOpen },
          { id: "faq", label: `FAQ (${totalFAQs})`, icon: HelpCircle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Glossary Tab */}
      {activeTab === "glossary" && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGlossaryCat("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeGlossaryCat === "all" ? "bg-primary text-primary-foreground border-primary dark:bg-accent dark:text-accent-foreground dark:border-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
            >
              All ({totalTerms})
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveGlossaryCat(cat.category)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeGlossaryCat === cat.category ? "bg-primary text-primary-foreground border-primary dark:bg-accent dark:text-accent-foreground dark:border-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.category}
                </button>
              );
            })}
          </div>

          {filteredGlossary.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No terms match your search.</div>
          ) : (
            filteredGlossary.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.category} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className={`flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/30`}>
                    <div className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">{cat.category}</h2>
                    <Badge className="ml-auto bg-muted text-muted-foreground border-0 text-[10px]">{cat.terms.length} terms</Badge>
                  </div>
                  <div className="px-5">
                    {cat.terms.map((item) => (
                      <TermItem key={item.term} {...item} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFAQCat("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeFAQCat === "all" ? "bg-primary text-primary-foreground border-primary dark:bg-accent dark:text-accent-foreground dark:border-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
            >
              All ({totalFAQs})
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveFAQCat(cat.category)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeFAQCat === cat.category ? "bg-primary text-primary-foreground border-primary dark:bg-accent dark:text-accent-foreground dark:border-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.category.split(' ').slice(0, 2).join(' ')}
                </button>
              );
            })}
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No questions match your search.</div>
          ) : (
            filteredFAQs.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.category} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/30">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">{cat.category}</h2>
                    <Badge className="ml-auto bg-muted text-muted-foreground border-0 text-[10px]">{cat.faqs.length} questions</Badge>
                  </div>
                  <div className="px-5">
                    {cat.faqs.map((item) => (
                      <FAQItem key={item.q} {...item} />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* CTA */}
          <div className="rounded-2xl border border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-6 text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Still have questions?</h3>
            <p className="text-white/70 text-sm mb-4">Connect with a qualified oil and gas advisor before making investment decisions.</p>
            <a
              href="mailto:advisor@energycalcpro.com"
              className="inline-flex items-center gap-2 bg-crude-gold text-petroleum font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Talk to an Advisor
            </a>
          </div>
        </div>
      )}
    </div>
  );
}