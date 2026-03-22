import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

export default function AIWellEvaluator() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnalysis(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior petroleum geologist and reservoir engineer with 30 years of experience evaluating oil and gas prospects for investors. A potential investor has shared well data, log descriptions, or prospect information below.

Provide a BRUTALLY HONEST geological and engineering evaluation. Cover:

1. **Reservoir Assessment** — Based on the data provided, evaluate porosity, permeability, fluid type, net pay, and expected deliverability. Compare to industry benchmarks.

2. **Seismic & Structural Risk** — If seismic data is mentioned, evaluate trap integrity, closure, and fault risk. If NOT mentioned, flag this as a critical gap.

3. **Log Interpretation** — If electric log or mud log data is described, interpret it. Flag any inconsistencies between operator claims and the actual data. If logs are NOT mentioned, flag this.

4. **Production Forecast Reality Check** — Do the claimed production rates make geological sense given the reservoir parameters described? Compare to analogous wells in the same basin/formation.

5. **Red Flags & Deal Breakers** — List anything that would make you walk away as a geologist. Be specific.

6. **Questions the Investor Must Ask** — Give 5 specific technical questions the investor should demand answers to before writing a check.

7. **Overall Risk Rating** — Rate geological risk as LOW / MODERATE / HIGH / CRITICAL with explanation.

Be direct. If the data is incomplete, say so. If the prospect sounds like a scam, say so. You're protecting this investor's money.

DATA PROVIDED:
${input}`,
    });
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-crude-gold/30 bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-crude-gold/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-crude-gold" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">AI Well & Prospect Evaluator</p>
          <p className="text-[10px] text-muted-foreground">Paste well data, log descriptions, or prospect info for an independent AI geological assessment</p>
        </div>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"Paste any well data here — examples:\n\n• Mud log gas shows, lithology descriptions\n• Electric log readings (resistivity, porosity, GR)\n• Seismic interpretations or structure maps described\n• Operator's production forecasts & reservoir claims\n• API number, well name, formation targets\n• PPM geological sections or AFE details\n\nThe more data you provide, the better the analysis."}
        className="min-h-[120px] text-sm"
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="gap-1.5 bg-crude-gold text-petroleum hover:bg-crude-gold/90 font-semibold"
          size="sm"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          {loading ? "Evaluating..." : "Run Geological Evaluation"}
        </Button>
        {analysis && (
          <Button variant="ghost" size="sm" onClick={() => { setAnalysis(null); setInput(""); }} className="text-xs">
            Clear
          </Button>
        )}
      </div>

      {analysis && (
        <div className="rounded-xl border border-border bg-muted/20 p-4 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}