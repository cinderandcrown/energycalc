import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Gem, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_CALC_MAP = {
  oil_gas: { path: "/calc/barrels-to-cash", label: "Barrels to Cash Calculator", icon: Droplets, desc: "Model oil production revenue — free, no signup required." },
  precious_metals: { path: "/calc/gold-purity", label: "Gold Purity Calculator", icon: Gem, desc: "Calculate gold value by karat and weight — free, no signup required." },
};

/**
 * In-article CTA that maps blog categories to relevant free calculators.
 * Falls back to a generic subscription CTA for categories without free tools.
 */
export default function InArticleCTA({ category }) {
  const calc = CATEGORY_CALC_MAP[category];

  if (calc) {
    const Icon = calc.icon;
    return (
      <div className="not-prose my-8 rounded-2xl border-2 border-crude-gold/30 bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-crude-gold/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-crude-gold" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm mb-1">Try Our Free {calc.label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{calc.desc}</p>
            <Link to={calc.path}>
              <Button size="sm" className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5 text-xs">
                Open Calculator
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generic CTA for other categories
  return (
    <div className="not-prose my-8 rounded-2xl border border-border bg-card/80 p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-primary dark:text-accent" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm mb-1">Model Any Commodity Deal</h3>
          <p className="text-xs text-muted-foreground mb-3">
            9 professional calculators for oil, gas, gold, metals, agriculture, and livestock. AI-powered analysis and investor protection tools.
          </p>
          <Link to="/#pricing">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              Start Free Trial
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
