import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, BookOpen, TrendingUp, Calculator, Shield, Flame, Wheat, Gem, Factory, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LESSONS = [
  {
    id: "supply-demand",
    title: "How Supply & Demand Set Prices",
    icon: TrendingUp,
    category: "Economics",
    difficulty: "Beginner",
    calcLink: null,
    steps: [
      {
        title: "The Foundation",
        content: "Every commodity — oil, gold, wheat, copper — has a price determined by two forces: how much is available (supply) and how much people want (demand). This isn't opinion or speculation — it's a mechanical relationship as reliable as gravity.",
        insight: "When you hear 'oil is up 5%,' the underlying cause is always a shift in supply, demand, or the market's expectation of a future shift."
      },
      {
        title: "Supply: Who Controls It?",
        content: "For oil: OPEC+ nations control ~40% of global output and actively manage production quotas. U.S. shale producers respond to price signals — when prices rise, more rigs deploy. For gold: annual mining output is relatively fixed, so supply changes slowly. For agriculture: weather, planting decisions, and trade policy drive supply.",
        insight: "Understanding who controls supply for a given commodity tells you where to watch for price-moving events."
      },
      {
        title: "Demand: What Drives It?",
        content: "Economic growth increases demand for energy and industrial metals. Seasonal patterns matter — heating oil demand rises in winter, gasoline in summer. Long-term trends like EV adoption, renewable energy, and population growth create structural demand shifts that unfold over years.",
        insight: "Demand isn't just about 'wanting' something — it's about the ability and willingness to pay at a given price."
      },
      {
        title: "The Price Discovery Mechanism",
        content: "Commodity futures markets (CME, LME, ICE) aggregate millions of buy/sell decisions into a single price. When buyers outnumber sellers, prices tick up until enough sellers appear. When sellers outnumber buyers, prices tick down until enough buyers step in. This happens thousands of times per second.",
        insight: "Markets are not random — they are real-time voting machines where every participant reveals their view through their transactions."
      },
      {
        title: "Try It Yourself",
        content: "Use the Supply & Demand Simulator above to experiment with these forces. Try increasing demand by 5M bbl/day while cutting supply by 3M — watch the price response. Then reverse it. Notice how disruption premiums amplify moves. These are the same forces that move real markets every day.",
        insight: "The goal isn't to predict prices — it's to understand the cause-and-effect relationships that drive them."
      },
    ]
  },
  {
    id: "oil-economics",
    title: "Oil Well Economics: From Ground to Bank Account",
    icon: Flame,
    category: "Energy",
    difficulty: "Intermediate",
    calcLink: "/calc/barrels-to-cash",
    steps: [
      {
        title: "The Revenue Chain",
        content: "A producing oil well generates revenue through a chain: barrels produced per day × oil price per barrel × your ownership percentage (NRI) = gross revenue to you. But that's just the beginning — multiple deductions happen before cash reaches your account.",
        insight: "Understanding this chain is essential. Many investors focus only on production and price, ignoring the deductions that determine actual cash flow."
      },
      {
        title: "Deductions Layer by Layer",
        content: "From gross revenue, subtract: (1) Royalties to landowners (12.5–25%), (2) Severance taxes to the state (4.6–12.5%), (3) Gathering & transportation fees, (4) Processing fees for NGLs, (5) Your share of lease operating expenses (LOE). What remains is your net monthly distribution.",
        insight: "A well producing 100 BOPD at $70/bbl generates $210,000/month gross — but after all deductions, an investor with a 5% NRI might receive $5,000–$8,000/month."
      },
      {
        title: "The Decline Curve Reality",
        content: "All wells decline over time as reservoir pressure drops. Shale wells often decline 70–80% in Year 1, then 30–40% in Year 2, then 15–20% annually. Conventional wells decline more slowly (10–15%/year). This means Year 1 cash flow is dramatically higher than Year 3.",
        insight: "This is why payout period matters so much — you want to recover your capital before the steep part of the decline curve."
      },
      {
        title: "The Tax Dimension",
        content: "Working interest owners get unique tax benefits: 65–85% of drilling costs (IDCs) are deductible in Year 1, equipment depreciates on an accelerated schedule, and 15% of gross production income is sheltered by the depletion allowance. These benefits can dramatically change the after-tax economics.",
        insight: "A $100,000 investment with 75% IDC at a 37% tax bracket saves $27,750 in taxes Year 1 — reducing your effective cost to $72,250 before the well produces anything."
      },
      {
        title: "Model It Yourself",
        content: "Use the Barrels to Cash calculator to input different production rates, oil prices, and decline curves. Change the oil price from $70 to $50 — what happens to your payout period? Change decline rate from 65% to 40% — see how conventional vs. shale economics differ.",
        insight: "The calculator doesn't tell you whether to invest. It shows you the math so you can evaluate any deal on its merits."
      },
    ]
  },
  {
    id: "precious-metals",
    title: "Gold & Precious Metals: Store of Value Mechanics",
    icon: Gem,
    category: "Metals",
    difficulty: "Beginner",
    calcLink: "/calc/gold-purity",
    steps: [
      {
        title: "Why Precious Metals Hold Value",
        content: "Gold, silver, platinum, and palladium have maintained purchasing power across millennia because of scarcity (limited mining output), durability (they don't corrode), divisibility (can be split into small units), and universal recognition. These aren't arbitrary — they're physical properties that make them naturally suited as stores of value.",
        insight: "An ounce of gold bought a quality Roman toga 2,000 years ago. Today it buys a quality suit. The purchasing power persists even as currencies come and go."
      },
      {
        title: "What Moves Gold Prices",
        content: "Gold responds to: (1) Real interest rates — when returns on cash/bonds are low after inflation, gold becomes more attractive, (2) Currency strength — a weaker dollar makes dollar-priced gold cheaper for foreign buyers, (3) Geopolitical fear — uncertainty drives safe-haven demand, (4) Central bank buying — governments diversifying reserves.",
        insight: "Gold often moves inversely to confidence in financial systems. It's not about gold 'going up' — it's about what's happening to everything else."
      },
      {
        title: "Purity, Weight & Real Value",
        content: "Not all gold is equal. 24K = 99.9% pure, 22K = 91.7%, 18K = 75%, 14K = 58.3%. A '1 oz gold coin' at 22K contains less pure gold than a 24K bar. Understanding the math of purity × weight × spot price reveals the true metal value of any gold item — crucial when buying or selling.",
        insight: "Premiums (the price above spot) vary wildly — from 2% for bulk bars to 20%+ for collectible coins. The metal value is the floor."
      },
      {
        title: "Try the Purity Calculator",
        content: "Use the Gold Purity calculator to see how karat, weight, and spot price interact. Try comparing a 1oz 24K bar vs. a 1oz 22K coin — see the real difference in metal value. Then adjust the spot price to see how a $100 move in gold affects the value of items you may already own.",
        insight: "Knowledge of these mechanics helps you evaluate any precious metals transaction objectively — whether buying, selling, or inheriting."
      },
    ]
  },
  {
    id: "agriculture",
    title: "Agricultural Commodities: Food, Weather & Money",
    icon: Wheat,
    category: "Agriculture",
    difficulty: "Beginner",
    calcLink: "/calc/ag-yield",
    steps: [
      {
        title: "The Food-Price Connection",
        content: "Agricultural commodity prices directly affect food costs worldwide. Corn, wheat, soybeans, and rice are the foundation crops — their prices ripple through the entire economy. When corn prices rise, everything from beef (cattle eat corn) to ethanol (made from corn) to cereal is affected.",
        insight: "Understanding ag economics isn't just about farming — it's about understanding a fundamental cost driver in every household budget."
      },
      {
        title: "Weather: The Uncontrollable Variable",
        content: "Unlike oil (where production can be adjusted), crop yields are heavily dependent on weather. A drought in the U.S. Midwest can cut corn yields 30–40%, while perfect growing conditions can produce record harvests. This weather dependency creates natural volatility that no amount of technology fully eliminates.",
        insight: "Agricultural markets remind us that some economic forces are genuinely beyond human control — a humbling principle for any investor."
      },
      {
        title: "The Global Trade Web",
        content: "Agricultural commodities are globally traded. A tariff on U.S. soybeans diverts demand to Brazil. A war in Ukraine disrupts wheat exports to Africa. Climate change shifts growing regions northward. These interconnections mean local events have global price impacts.",
        insight: "When you see food prices change at the grocery store, there's usually a traceable commodity market story behind it."
      },
      {
        title: "Model Crop Economics",
        content: "Use the Ag Yield calculator to explore how acreage, yield per acre, and market price interact to determine farm revenue. Adjust the price per bushel and see how a 20% price swing affects profitability. Compare base, bull, and bear scenarios to understand the range of outcomes.",
        insight: "The same economic principles — supply, demand, cost basis, margin — apply whether you're analyzing a cornfield or a gold mine."
      },
    ]
  },
  {
    id: "industrial-metals",
    title: "Industrial Metals: The Hidden Backbone of Modern Life",
    icon: Factory,
    category: "Metals",
    difficulty: "Intermediate",
    calcLink: "/calc/metal-cost",
    steps: [
      {
        title: "Why Industrial Metals Matter",
        content: "Copper wires your home. Aluminum frames your car. Lithium powers your phone. Steel structures your buildings. Nickel alloys fly in jet engines. These aren't abstract commodities — they're the physical materials that make modern civilization function. Their prices reflect real supply chains.",
        insight: "When copper prices rise sharply, it often signals infrastructure spending and economic growth. When they fall, it may signal a slowdown. Economists call copper 'Dr. Copper' because it 'diagnoses' the economy."
      },
      {
        title: "The Mining-to-Market Pipeline",
        content: "Industrial metals follow a chain: mining ore → smelting/refining → shipping → fabrication → end use. At each stage, costs accumulate: extraction, energy (smelting is energy-intensive), transportation, tariffs, and processing. The final 'landed cost' to an end user can be 20–40% above the exchange-quoted metal price.",
        insight: "Understanding the cost chain explains why metal prices at the LME or CME don't directly equal what a manufacturer pays."
      },
      {
        title: "The Energy Transition Connection",
        content: "The global push toward renewable energy and electric vehicles is creating enormous new demand for specific metals: lithium and cobalt for batteries, copper for wiring and motors, rare earths for magnets, silver for solar panels. These structural demand shifts play out over decades.",
        insight: "Every major energy transition in history — wood to coal, coal to oil, oil to renewables — has created both winners and losers in commodity markets. Understanding which materials are needed helps you understand the economic landscape."
      },
      {
        title: "Calculate Landed Costs",
        content: "Use the Metal Cost calculator to model the full cost-basis of industrial metals including freight, processing, waste, and storage. Adjust the spot price and see how margins respond. Compare different metals to understand which have thin vs. fat margins.",
        insight: "Whether you're evaluating a mining stock, a metals fund, or just understanding why your copper plumbing costs more — the economics are the same."
      },
    ]
  },
  {
    id: "tax-stewardship",
    title: "Tax-Aware Stewardship: Keeping More of What You Earn",
    icon: Calculator,
    category: "Financial Literacy",
    difficulty: "Intermediate",
    calcLink: "/calc/tax-impact",
    steps: [
      {
        title: "Taxes Are the Biggest Expense You Don't See",
        content: "For most households, taxes are the single largest annual expense — often exceeding housing, food, and transportation combined. Yet most people spend more time planning a vacation than understanding their tax situation. Stewardship means being informed about where your money goes.",
        insight: "You don't need to be a CPA. You need to understand the basic framework so you can have informed conversations with tax professionals."
      },
      {
        title: "How Tax Brackets Actually Work",
        content: "A common misconception: 'If I earn more, I'll pay more tax on ALL my income.' In reality, the U.S. uses marginal tax brackets — you only pay the higher rate on income above each threshold. Understanding this prevents the fear of earning more and helps you evaluate the real after-tax impact of any financial decision.",
        insight: "Someone in the '37% bracket' doesn't pay 37% on everything — they pay 10% on the first ~$11K, 12% on the next ~$34K, and so on up."
      },
      {
        title: "Deductions: What Reduces Your Tax Bill",
        content: "Deductions reduce your taxable income. Some are universal (standard deduction), some require specific activities (mortgage interest, charitable giving, business expenses). Certain investments, like working interests in oil & gas wells, offer unique deductions (IDCs, depletion) that can significantly reduce taxable income.",
        insight: "Deductions aren't loopholes — they're policy tools written into law to incentivize specific economic activities that Congress deems beneficial."
      },
      {
        title: "Model Multi-Year Impact",
        content: "Use the Tax Impact calculator to model how different scenarios affect your tax situation over 5 years. See how timing matters — deductions taken in Year 1 reduce your tax bill immediately, while income flows in over many years. This is the mechanical reality of tax-advantaged structures.",
        insight: "The goal isn't to avoid taxes — it's to understand the real after-tax cost and return of any financial decision. That's stewardship."
      },
    ]
  },
];

const difficultyColors = {
  Beginner: "bg-drill-green/10 text-drill-green border-drill-green/20",
  Intermediate: "bg-crude-gold/10 text-crude-gold border-crude-gold/20",
  Advanced: "bg-flare-red/10 text-flare-red border-flare-red/20",
};

export default function GuidedLessons() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveStep(0);
  };

  const markComplete = (lessonId, stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [lessonId]: [...(prev[lessonId] || []), stepIdx]
    }));
  };

  const lesson = activeLesson ? LESSONS.find(l => l.id === activeLesson) : null;

  if (lesson) {
    const step = lesson.steps[activeStep];
    const isCompleted = completedSteps[lesson.id]?.includes(activeStep);
    const totalCompleted = completedSteps[lesson.id]?.length || 0;

    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Lesson header */}
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveLesson(null)} className="text-xs text-muted-foreground hover:text-foreground">
              ← All Lessons
            </button>
            <Badge variant="outline" className="text-[10px] ml-auto">
              {activeStep + 1} of {lesson.steps.length}
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground text-sm mt-2">{lesson.title}</h3>
          {/* Progress bar */}
          <div className="flex gap-1 mt-3">
            {lesson.steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === activeStep ? "bg-primary dark:bg-accent" :
                  completedSteps[lesson.id]?.includes(i) ? "bg-drill-green" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
              
              {/* Insight box */}
              <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4 flex gap-3">
                <Zap className="w-4 h-4 text-crude-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-crude-gold uppercase tracking-wide font-bold mb-1">Key Insight</p>
                  <p className="text-xs text-foreground leading-relaxed">{step.insight}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {!isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markComplete(lesson.id, activeStep)}
                  className="gap-1 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Complete
                </Button>
              )}
              {isCompleted && (
                <span className="text-xs text-drill-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            {activeStep < lesson.steps.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setActiveStep(activeStep + 1)}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : lesson.calcLink ? (
              <Link to={lesson.calcLink}>
                <Button size="sm" className="gap-1 text-xs">
                  <Calculator className="w-3.5 h-3.5" />
                  Try the Calculator
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveLesson(null)}
                className="text-xs"
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Lesson list
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-primary dark:text-accent" />
        <h3 className="font-semibold text-foreground text-sm">Guided Lessons</h3>
        <Badge variant="secondary" className="text-[10px] ml-auto">{LESSONS.length} lessons</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Step-by-step walkthroughs that teach economic principles using real-world commodity examples. Each lesson connects to a calculator so you can explore the math yourself.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LESSONS.map((l) => {
          const Icon = l.icon;
          const completed = completedSteps[l.id]?.length || 0;
          return (
            <button
              key={l.id}
              onClick={() => openLesson(l.id)}
              className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 dark:group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary dark:text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{l.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[9px]">{l.category}</Badge>
                    <Badge className={`text-[9px] border ${difficultyColors[l.difficulty]}`}>{l.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-drill-green rounded-full transition-all"
                        style={{ width: `${(completed / l.steps.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{completed}/{l.steps.length}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}