import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Shield, Calculator, Newspaper } from "lucide-react";

const concepts = [
  {
    icon: BarChart3,
    title: "Live Market Data",
    description: "See real commodity prices across energy, metals, and agriculture. Observe how prices move — understanding the rhythm of markets is the first step.",
    link: "/markets",
    linkLabel: "Explore Markets",
  },
  {
    icon: Calculator,
    title: "Financial Calculators",
    description: "Model scenarios with our 8 specialized calculators. Change one variable, see the ripple effect. Math doesn't have an opinion — it just shows the truth.",
    link: "/calc/net-investment",
    linkLabel: "Try a Calculator",
  },
  {
    icon: Shield,
    title: "Fraud Protection Tools",
    description: "Learn to identify red flags before committing capital. Our AI document analyzer and operator screener help you ask the right questions.",
    link: "/investor-protection",
    linkLabel: "Protect Yourself",
  },
  {
    icon: Newspaper,
    title: "Curated Market News",
    description: "Stay informed with neutrally-curated commodity news. Both bullish and bearish perspectives, sourced and verified. Form your own conclusions.",
    link: "/news",
    linkLabel: "Read News",
  },
];

export default function ConceptCards() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground text-sm">Apply What You Learn</h3>
      <p className="text-xs text-muted-foreground">
        Each tool on this platform was built to help you understand — not to tell you what to do. Explore at your own pace.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {concepts.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary dark:text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-primary dark:text-accent font-medium mt-2 group-hover:gap-2 transition-all">
                    {c.linkLabel}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}