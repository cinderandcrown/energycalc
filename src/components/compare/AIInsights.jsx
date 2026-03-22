import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function AIInsights({ scenarios }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setAnalysis(null);

    const scenarioSummaries = scenarios.map((s) => ({
      name: s.name,
      type: s.calc_type,
      inputs: s.inputs,
      results: s.results,
    }));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert oil and gas financial analyst. The user is comparing ${scenarios.length} saved investment calculation scenarios side by side.

Here are the scenarios:
${JSON.stringify(scenarioSummaries, null, 2)}

Provide a detailed comparative analysis covering:

1. **Winner Summary** — Which scenario appears strongest overall and why (1-2 sentences)
2. **ROI & Returns Comparison** — Compare the return metrics across scenarios. Which offers the best risk-adjusted return?
3. **Tax Benefits Analysis** — Compare IDC deductions, depletion benefits, and net after-tax costs. Which scenario maximizes tax efficiency?
4. **Cash Flow Comparison** — Compare monthly/annual income projections. Which generates the most consistent cash flow?
5. **Risk Assessment** — Which scenario has more risk (higher decline rates, more leverage, commodity exposure)?
6. **Recommendation** — A clear, actionable conclusion

Use specific numbers from the data. Format with markdown headers and bullet points. Be direct and practical — this is for a real investor making decisions. Keep it to about 300 words.

IMPORTANT: End with a disclaimer that this is AI-generated analysis for educational purposes only and does not constitute investment advice.`,
    });

    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Zap className="w-4 h-4 text-crude-gold" />
        <h3 className="text-sm font-semibold text-foreground">AI Comparative Analysis</h3>
      </div>

      <div className="p-4">
        {!analysis && !loading && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Get an AI-powered analysis comparing your selected scenarios on ROI, tax efficiency, cash flow, and risk.
            </p>
            <Button onClick={generate} className="gap-2 bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90">
              <Zap className="w-4 h-4" />
              Generate AI Analysis
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing {scenarios.length} scenarios...</span>
          </div>
        )}

        {analysis && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}

        {analysis && (
          <div className="mt-4 pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={generate} className="gap-1.5 text-xs">
              <Zap className="w-3 h-3" />
              Regenerate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}