import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    category: "Success Rates",
    items: [
      { label: "Exploratory (wildcat) wells — dry hole rate", value: "60–80%", trend: "negative", source: "EIA / AAPG historical data", note: "The majority of wildcat wells find nothing. This has improved with 3D seismic but remains high." },
      { label: "Development wells — dry hole rate", value: "10–20%", trend: "neutral", source: "EIA drilling reports", note: "Development wells in proven fields have much higher success rates, but still carry geological risk." },
      { label: "Shale/horizontal wells — economic success rate", value: "70–85%", trend: "positive", source: "Industry reports (Permian, Eagle Ford)", note: "Modern shale wells in established basins have high completion rates, but 'economic success' depends heavily on the oil price at the time." },
      { label: "LP drilling programs — investor return of capital", value: "20–40%", trend: "negative", source: "NASAA investor surveys, SEC enforcement", note: "The majority of LP drilling programs in the 1980s–2000s did NOT return investor capital. Fee structures, dry holes, and operator mismanagement consumed most invested dollars." },
    ]
  },
  {
    category: "Realistic Returns",
    items: [
      { label: "Direct WI in a producing well (conservative)", value: "8–15% annual", trend: "positive", source: "Industry averages for stripper/marginal wells", note: "A low-risk producing well with established decline curves. Not exciting, but real. These are the deals where you buy existing production at a fair price." },
      { label: "Direct WI in a new drill (moderate risk)", value: "15–35% IRR", trend: "positive", source: "Operator track record data", note: "IF the well comes in as projected. Big if. Actual IRR depends on initial production rate, decline curve, and commodity prices over the well's life." },
      { label: "LP program (after all GP fees)", value: "0–12% net", trend: "neutral", source: "LP performance data, SEC filings", note: "After management fees, carry, and overhead, LP investors typically see significantly less than the gross well economics would suggest. Many LPs return less than capital." },
      { label: "What the promoter TELLS you", value: "25–100%+ IRR", trend: "negative", source: "Marketing materials", note: "These projections use best-case assumptions: high initial production, flat decline, high oil prices, and zero operational problems. Reality is almost always worse." },
    ]
  },
  {
    category: "The Tax Reality",
    items: [
      { label: "IDC deduction (Year 1, typical)", value: "60–80% of investment", trend: "positive", source: "IRC §263(c)", note: "This is real and legitimate. Intangible Drilling Costs can be deducted in the year incurred. This is the single biggest tax advantage of oil & gas investing." },
      { label: "Percentage depletion allowance", value: "15% of gross income", trend: "positive", source: "IRC §613A", note: "15% of your gross production income is tax-free. Limited to the lesser of 15% of gross or 100% of net income. Only available to small producers (<1,000 bbl/day)." },
      { label: "Active income treatment (WI only)", value: "Offsets W-2 income", trend: "positive", source: "IRC §469(c)(3)", note: "Working interest income is classified as active, not passive — meaning losses can offset your W-2 or business income without passive activity limitations. This is unique to oil & gas." },
      { label: "BUT: A tax deduction on a bad investment", value: "Still a loss", trend: "negative", source: "Math", note: "If you invest $100K and the well produces nothing, you get a ~$35K tax deduction (at 35% bracket). You still lost $65K. Tax benefits don't fix bad deals — they soften the blow." },
    ]
  },
  {
    category: "Industry Fraud Statistics",
    items: [
      { label: "Annual losses to oil & gas fraud (FBI est.)", value: "$10B+", trend: "negative", source: "FBI Financial Crimes Section", note: "This includes both retail investor fraud and institutional misrepresentation. The actual number is likely higher because most fraud goes unreported." },
      { label: "NASAA top fraud category (multiple years)", value: "#1: Oil & Gas", trend: "negative", source: "NASAA annual enforcement reports", note: "State securities regulators consistently rank oil & gas as the most common category of investment fraud complaints." },
      { label: "SEC enforcement actions (oil & gas, 2015–2025)", value: "200+", trend: "negative", source: "SEC EDGAR enforcement database", note: "These are only the cases the SEC has resources to pursue. Most fraud is at the state level and handled (or not handled) by underfunded state regulators." },
      { label: "Average investor recovery in fraud cases", value: "10–30 cents on the dollar", trend: "negative", source: "SEC and NASAA enforcement outcomes", note: "Even when fraud is proven, operator assets are usually gone. Receivers recover a fraction. Criminal prosecution is rare — most cases are civil." },
    ]
  },
];

const trendIcons = {
  positive: <CheckCircle2 className="w-3.5 h-3.5 text-drill-green" />,
  negative: <AlertTriangle className="w-3.5 h-3.5 text-flare-red" />,
  neutral: <Minus className="w-3.5 h-3.5 text-crude-gold" />,
};

const trendBorders = {
  positive: "border-drill-green/20",
  negative: "border-flare-red/20",
  neutral: "border-crude-gold/20",
};

export default function RealNumbers() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">No cherry-picking.</strong> These numbers include the good, the bad, and the ugly. Sources are cited. Where exact data isn't available, we provide industry-consensus ranges and say so. Always verify any specific claim with the cited source.
        </p>
      </div>

      {stats.map((section) => (
        <div key={section.category}>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">{section.category}</h3>
          <div className="space-y-2">
            {section.items.map((item, i) => (
              <div key={i} className={`rounded-xl border ${trendBorders[item.trend]} bg-card p-4`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{trendIcons[item.trend]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <span className="font-mono font-bold text-sm text-foreground">{item.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{item.note}</p>
                    <Badge variant="outline" className="text-[9px] font-normal text-muted-foreground">Source: {item.source}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}