import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const typeLabels = {
  net_investment: "Net Investment",
  barrels_to_cash: "Oil to Cash",
  natgas_to_cash: "Gas to Cash",
  rate_of_return: "Rate of Return",
};

export default function DealAnalysis({ calc, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setAnalysis(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a brutally honest, veteran oil and gas investment analyst with 30+ years of field experience. You've seen every deal structure — the good, the bad, and the outright predatory.

A user has run a "${typeLabels[calc.calc_type]}" calculation with these parameters:

INPUTS: ${JSON.stringify(calc.inputs, null, 2)}
RESULTS: ${JSON.stringify(calc.results, null, 2)}

Give a BLUNT, no-BS assessment of this deal. Your job is to protect this investor. Compare every key metric against real industry standards for U.S. onshore oil & gas working interest investments.

Structure your response EXACTLY like this:

## 🚦 Verdict: [FAIR DEAL / CAUTION / RED FLAG / RIP-OFF]

One-sentence overall take.

### Key Metrics vs. Industry Standard

For each relevant metric, give a line like:
- **[Metric Name]**: Their value → Industry standard range → ✅ Fair / ⚠️ High/Low / 🚩 Red Flag

Use these real benchmarks:
- Working Interest NRI: 75-80% is standard (below 72% is a red flag)
- IDC percentage: 60-75% is typical (above 80% might be inflated to sell tax benefits)
- Operating expenses (LOE): $8-15/bbl onshore is normal
- Decline rates: 15-25% annual for conventional, 50-70% Year-1 for shale
- Operator overhead/G&A: should be under 10% of revenue
- IRR: 15-25% is solid for conventional; above 40% — verify assumptions
- Payout period: 24-48 months is typical; under 12 months = too good to be true
- Monthly income per $100K invested: $2,000-4,000 is realistic
- Royalty burden: 20-25% is standard; above 30% is excessive

### What's Working
Bullet points on the positives.

### What's Concerning
Bullet points on anything that looks off, overoptimistic, or predatory. Be specific with numbers. If their assumptions are unrealistic, say so plainly.

### Bottom Line
2-3 sentences. Would you put YOUR money into this deal at these terms? If not, say why.

Keep it under 350 words. Be direct — investors need the truth, not hand-holding.

End with: *This is AI-generated analysis for educational purposes only. It does not constitute investment advice. Consult a licensed professional before making any investment decision.*`,
    });

    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="mt-3 rounded-xl border border-crude-gold/30 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-crude-gold/5 border-b border-crude-gold/20">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-crude-gold" />
          <span className="text-xs font-semibold text-foreground">AI Deal Analysis</span>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-4">
        {!analysis && !loading && (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground mb-3">
              Get a brutally honest assessment of whether this deal's terms are fair compared to industry standards.
            </p>
            <Button size="sm" onClick={generate} className="gap-1.5 bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 text-xs">
              <Zap className="w-3.5 h-3.5" />
              Analyze This Deal
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Running deal analysis...</span>
          </div>
        )}

        {analysis && (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
            <div className="mt-3 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={generate} className="gap-1.5 text-[10px] h-7">
                <Zap className="w-3 h-3" />
                Re-analyze
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}