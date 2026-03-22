import { useState } from "react";
import { Shield, CheckCircle2, Circle, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    title: "Entity Structure",
    items: [
      { text: "Each oil & gas investment held in its own LLC", priority: "critical" },
      { text: "Holding company LLC in a favorable state (WY, NV, SD)", priority: "high" },
      { text: "Operating agreements drafted by oil & gas attorney", priority: "critical" },
      { text: "EIN obtained for each entity (not using personal SSN)", priority: "critical" },
      { text: "Separate bank accounts for each LLC", priority: "high" },
      { text: "Annual state filings and registered agent maintained", priority: "high" },
    ],
  },
  {
    title: "Tax Optimization",
    items: [
      { text: "CPA specializing in oil & gas taxation engaged", priority: "critical" },
      { text: "IDC deductions properly documented and filed", priority: "critical" },
      { text: "Percentage depletion tracked per property", priority: "high" },
      { text: "Tangible equipment depreciation scheduled (MACRS / bonus)", priority: "high" },
      { text: "Working interest vs. LP interest optimized for your situation", priority: "medium" },
      { text: "AMT impact modeled before year-end investments", priority: "medium" },
      { text: "Estimated quarterly tax payments adjusted for IDC deductions", priority: "high" },
      { text: "NOL carryforward tracked and utilized strategically", priority: "medium" },
    ],
  },
  {
    title: "Asset Protection",
    items: [
      { text: "Umbrella insurance policy ($2M+ for active investors)", priority: "critical" },
      { text: "Domestic Asset Protection Trust (DAPT) funded in advance", priority: "high" },
      { text: "Personal assets not commingled with business entities", priority: "critical" },
      { text: "No personal guarantees on oil & gas entity debts", priority: "high" },
      { text: "Environmental liability insurance or indemnification in JOA", priority: "high" },
      { text: "Pre-nuptial or post-nuptial agreement addressing energy assets", priority: "medium" },
    ],
  },
  {
    title: "Estate & Wealth Transfer",
    items: [
      { text: "Estate plan reviewed by attorney specializing in oil & gas", priority: "critical" },
      { text: "Dynasty trust established in favorable jurisdiction", priority: "high" },
      { text: "Life insurance owned by ILIT (not personally)", priority: "high" },
      { text: "Annual gifting strategy using FLP discounts or annual exclusion", priority: "medium" },
      { text: "Beneficiary designations reviewed and current", priority: "critical" },
      { text: "Powers of attorney and healthcare directives in place", priority: "critical" },
      { text: "Successor manager/trustee designated for energy assets", priority: "high" },
    ],
  },
  {
    title: "Professional Team",
    items: [
      { text: "CPA with oil & gas industry experience", priority: "critical" },
      { text: "Oil & gas attorney (not a general practice lawyer)", priority: "critical" },
      { text: "Estate planning attorney familiar with energy assets", priority: "high" },
      { text: "Independent petroleum geologist for due diligence", priority: "high" },
      { text: "Registered Investment Advisor (RIA) — fiduciary, not commission-based", priority: "medium" },
      { text: "Insurance broker specializing in energy sector coverage", priority: "medium" },
    ],
  },
];

const priorityConfig = {
  critical: { label: "Critical", color: "text-flare-red", bg: "bg-flare-red/10" },
  high: { label: "High", color: "text-crude-gold", bg: "bg-crude-gold/10" },
  medium: { label: "Medium", color: "text-muted-foreground", bg: "bg-muted" },
};

export default function WealthProtectionChecklist() {
  const [checked, setChecked] = useState({});

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Use this checklist to audit your own protection posture.</strong> Tap items to mark them complete. Focus on "Critical" items first — these are non-negotiable for any energy investor with $100K+ deployed.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-foreground">Your Protection Score</p>
          <Badge className={`${pct >= 80 ? "bg-drill-green/10 text-drill-green" : pct >= 50 ? "bg-crude-gold/10 text-crude-gold" : "bg-flare-red/10 text-flare-red"} border-0 text-xs font-bold`}>
            {checkedCount}/{totalItems} — {pct}%
          </Badge>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? "bg-drill-green" : pct >= 50 ? "bg-crude-gold" : "bg-flare-red"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat, catIdx) => {
        const catChecked = cat.items.filter((_, i) => checked[`${catIdx}-${i}`]).length;
        return (
          <div key={cat.title} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-bold text-foreground">{cat.title}</p>
              <span className="text-xs text-muted-foreground">{catChecked}/{cat.items.length}</span>
            </div>
            <div className="divide-y divide-border/50">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const done = checked[key];
                const pri = priorityConfig[item.priority];
                return (
                  <button
                    key={itemIdx}
                    onClick={() => toggle(catIdx, itemIdx)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors ${done ? "opacity-60" : ""}`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-drill-green shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs leading-relaxed flex-1 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.text}
                    </span>
                    <Badge className={`${pri.bg} ${pri.color} border-0 text-[9px] font-bold shrink-0`}>{pri.label}</Badge>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="p-3 rounded-xl bg-flare-red/5 border border-flare-red/20">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <AlertTriangle className="w-3 h-3 text-flare-red inline mr-1" />
          This checklist is educational. It is not legal, tax, or financial advice. Your specific situation requires analysis by qualified professionals in your state. Do not implement any strategy without professional counsel.
        </p>
      </div>
    </div>
  );
}