import { useState } from "react";
import { ChevronDown, BookOpen, HelpCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GLOSSARY = [
  { term: "WI — Working Interest", definition: "The percentage ownership of the right to explore, drill, and produce from a well. Working interest owners bear their proportionate share of all drilling and operating costs." },
  { term: "NRI — Net Revenue Interest", definition: "The percentage of production revenue an interest owner receives after accounting for royalties and other burdens. For example, a 25% royalty on a 1% WI results in a 0.75% NRI." },
  { term: "IDC — Intangible Drilling Costs", definition: "Costs that have no salvage value, such as wages, fuel, mud, and drilling services. IDCs are typically 65–85% of total drilling costs and are 100% deductible in the year incurred for working interest owners." },
  { term: "LOE — Lease Operating Expenses", definition: "Recurring costs to maintain and operate a producing well, including pumping, maintenance, chemicals, labor, and supervision. Usually expressed per barrel ($/bbl) or per MCF ($/mcf)." },
  { term: "BOPD — Barrels of Oil Per Day", definition: "The unit of measure for daily oil production rate. One barrel = 42 US gallons. A well producing 100 BOPD at $70/bbl generates roughly $2,100/day in gross oil revenue." },
  { term: "MCF — Thousand Cubic Feet", definition: "The standard unit for measuring natural gas volume. One MCF contains approximately one million BTUs of energy. Gas prices are usually quoted per MCF or MMBTU (million BTU)." },
  { term: "MMBTU — Million British Thermal Units", definition: "An energy measurement equivalent to approximately 1 MCF of natural gas. Henry Hub futures prices are quoted in $/MMBTU." },
  { term: "Severance Tax", definition: "A state production tax levied on oil and gas extracted within that state. It's calculated as a percentage of the value of production. Texas charges 4.6% on oil, 7.5% on gas." },
  { term: "Depletion Allowance", definition: "A federal tax deduction that allows oil and gas producers to account for the reduction in a well's reserves. Small producers may use a statutory rate of 15% of gross income from the well." },
  { term: "MACRS — Modified Accelerated Cost Recovery System", definition: "The IRS depreciation method for tangible oil field equipment. Oil field equipment uses a 7-year recovery period, with 14.29% deductible in Year 1 under standard MACRS." },
  { term: "IRR — Internal Rate of Return", definition: "The discount rate at which the net present value (NPV) of all cash flows from an investment equals zero. A higher IRR indicates a more attractive investment." },
  { term: "ROI — Return on Investment", definition: "A simple measure of profitability: (Net Profit / Investment Cost) × 100. In oil and gas, this is often calculated over the life of the well." },
  { term: "Payout Period", definition: "The number of months required for the cumulative net revenue from a well to equal the initial investment. A well that pays out in 24 months has recovered 100% of its capital." },
  { term: "Decline Curve", definition: "The predictable pattern of decreasing production over time as reservoir pressure drops. Most wells decline sharply (50–80%) in year one and gradually flatten to a terminal decline rate." },
  { term: "NGL — Natural Gas Liquids", definition: "Hydrocarbon components of natural gas (ethane, propane, butane, natural gasoline) that can be separated and sold as liquids. NGLs add incremental value to gas production." },
  { term: "WTI — West Texas Intermediate", definition: "The U.S. benchmark crude oil grade, priced at the Cushing, Oklahoma hub. WTI is slightly lighter and sweeter than Brent and typically trades at a small discount to Brent." },
  { term: "Henry Hub", definition: "The primary pricing point for U.S. natural gas futures, located in Louisiana. Henry Hub spot and futures prices are the U.S. benchmark for natural gas." },
  { term: "Cash-on-Cash Return", definition: "Annual net income divided by total cash invested, expressed as a percentage. This measures current yield without accounting for future appreciation or tax benefits." },
];

const FAQS = [
  {
    q: "What's the difference between Working Interest and Royalty Interest?",
    a: "Working Interest (WI) owners pay their share of drilling and operating costs, and receive a share of production revenue. Royalty Interest (RI) owners receive a fixed percentage of production with no cost obligations — they don't pay to drill but also don't control operations."
  },
  {
    q: "How do IDC deductions actually reduce my out-of-pocket cost?",
    a: "When you invest $100,000 in a well with 75% IDC, $75,000 of that is deductible in Year 1. At a 37% tax bracket, you save $27,750 in federal taxes. Your true out-of-pocket drops to ~$72,250. This is why high-bracket investors find oil and gas investments attractive."
  },
  {
    q: "Is 15% depletion allowance always applicable?",
    a: "The 15% statutory depletion is available to independent producers and royalty owners who are not classified as 'integrated oil companies.' It applies to the gross income from the well (not total investment), up to 100% of the net income from the property."
  },
  {
    q: "What does the IRR tell me vs Simple ROI?",
    a: "Simple ROI divides total profit by total investment — it ignores the time value of money. IRR factors in when cash flows occur. A 25% simple ROI over 5 years is different from a 25% IRR — IRR accounts for the fact that a dollar today is worth more than a dollar in 5 years."
  },
  {
    q: "How accurate are these production decline estimates?",
    a: "Decline rates vary significantly by basin, geology, and completion design. Shale/tight oil wells (Permian, Eagle Ford) often decline 70–80% in year one. Conventional wells may decline 10–15% annually. Always obtain actual production history or engineering reserve reports for investment decisions."
  },
];

function GlossaryItem({ term, definition }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left hover:text-primary dark:hover:text-accent transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{term}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left hover:text-primary dark:hover:text-accent transition-colors"
      >
        <span className="text-sm font-medium text-foreground pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground pb-3 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Learn() {
  const [activeTab, setActiveTab] = useState("glossary");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Learn</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Oil & gas investing — demystified</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted">
        {[
          { id: "glossary", label: "Glossary", icon: BookOpen },
          { id: "faq", label: "FAQ", icon: HelpCircle },
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

      {activeTab === "glossary" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">{GLOSSARY.length} Key Terms Explained</h2>
          {GLOSSARY.map((item) => (
            <GlossaryItem key={item.term} {...item} />
          ))}
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            {FAQS.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] p-6 text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Ready to talk to an expert?</h3>
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