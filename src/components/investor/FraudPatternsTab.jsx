import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Siren, Zap, BookOpen, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dealTypeColors = {
  "Promissory Note": "bg-flare-red/10 text-flare-red",
  "Limited Partnership": "bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent",
  "Joint Venture": "bg-crude-gold/10 text-crude-gold",
  "All Deal Types": "bg-muted text-muted-foreground",
};

const filterOptions = ["All", "Limited Partnership", "Joint Venture", "Promissory Note", "All Deal Types"];

export default function FraudPatternsTab({ fraudPatterns }) {
  const [dealFilter, setDealFilter] = useState("All");

  const filtered = dealFilter === "All"
    ? fraudPatterns
    : fraudPatterns.filter(p => p.dealType === dealFilter);

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          These are the most common fraud patterns in oil & gas deals — <strong className="text-foreground">LP programs, Joint Ventures, promissory notes, and direct participation</strong> — based on SEC enforcement actions, FBI investigations, and industry litigation. Filter by deal type to see risks specific to your structure.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1.5" />
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setDealFilter(opt)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
              dealFilter === opt
                ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt === "All" ? `All (${fraudPatterns.length})` : opt}
          </button>
        ))}
      </div>

      {filtered.map((pattern, i) => (
        <motion.div
          key={pattern.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`rounded-xl border p-4 ${
            pattern.severity === "critical" ? "border-flare-red/30 bg-flare-red/5" :
            pattern.severity === "high" ? "border-orange-500/30 bg-orange-500/5" :
            "border-crude-gold/30 bg-crude-gold/5"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Siren className={`w-4 h-4 shrink-0 ${
              pattern.severity === "critical" ? "text-flare-red" :
              pattern.severity === "high" ? "text-orange-500" : "text-crude-gold"
            }`} />
            <p className="text-sm font-bold text-foreground">{pattern.name}</p>
            <div className="flex gap-1.5 ml-auto">
              <Badge className={`${dealTypeColors[pattern.dealType] || dealTypeColors["All Deal Types"]} border-0 text-[10px] font-bold`}>
                {pattern.dealType}
              </Badge>
              <Badge className={`border-0 text-[10px] font-bold uppercase ${
                pattern.severity === "critical" ? "bg-flare-red/10 text-flare-red" :
                pattern.severity === "high" ? "bg-orange-500/10 text-orange-500" :
                "bg-crude-gold/10 text-crude-gold"
              }`}>{pattern.severity}</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{pattern.description}</p>
          <div className="flex items-start gap-2 rounded-lg bg-background/60 border border-border p-2.5">
            <Zap className="w-3.5 h-3.5 text-crude-gold mt-0.5 shrink-0" />
            <p className="text-xs text-foreground leading-relaxed"><strong>Protect Yourself:</strong> {pattern.warning}</p>
          </div>
        </motion.div>
      ))}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex gap-2 items-start">
          <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Legal Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute legal advice, a securities analysis, or an investment recommendation. Commodity Investor+ is not a registered broker-dealer, investment advisor, or FINRA member. The fraud patterns and red flags described are generalizations based on publicly available SEC enforcement actions, FBI reports, and court records. Not every operator exhibiting these characteristics is committing fraud. Always engage a licensed securities attorney and independent petroleum engineer before investing.{" "}
            <Link to="/legal" className="underline underline-offset-2 text-primary dark:text-accent hover:opacity-80">View full legal disclosures →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}