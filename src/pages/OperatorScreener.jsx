import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Search, ShieldAlert, CheckCircle2, XCircle, AlertTriangle,
  Building2, Globe, FileText, Loader2, Scale, Users, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function OperatorScreener() {
  const [operatorName, setOperatorName] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScreen = async () => {
    if (!operatorName.trim()) return;
    setLoading(true);
    setResult(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert oil & gas securities fraud investigator and industry analyst. A potential investor wants to vet this operator before investing.

Operator Name: "${operatorName}"
${state ? `State: "${state}"` : ""}

Research this operator using your knowledge and any available public information. Provide a THOROUGH vetting report.

Return JSON with:
1. "found": boolean — whether you have any information about this operator
2. "riskRating": "low" | "medium" | "high" | "critical" | "unknown" — overall investor risk rating
3. "riskScore": number 1-10 (10 = extremely dangerous)
4. "companyProfile": string — what you know about this company (or "No public information found" if unknown)
5. "redFlags": array of strings — specific concerns or red flags found
6. "positiveIndicators": array of strings — any positive indicators found
7. "verificationSteps": array of strings — specific steps the investor should take to verify this operator (include actual URLs where possible — SEC EDGAR, state oil & gas board, etc.)
8. "knownIssues": array of strings — any known lawsuits, regulatory actions, SEC enforcement, complaints
9. "recommendation": string — 2-3 sentence direct recommendation to the investor
10. "stateResources": object with "regulatorName" and "regulatorUrl" fields for the relevant state oil & gas board (if state provided)

Be DIRECT and PROTECTIVE of the investor. If you don't have information, say so clearly and emphasize that lack of public information about an oil & gas operator is itself a significant concern. Never give a clean bill of health without evidence.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          found: { type: "boolean" },
          riskRating: { type: "string" },
          riskScore: { type: "number" },
          companyProfile: { type: "string" },
          redFlags: { type: "array", items: { type: "string" } },
          positiveIndicators: { type: "array", items: { type: "string" } },
          verificationSteps: { type: "array", items: { type: "string" } },
          knownIssues: { type: "array", items: { type: "string" } },
          recommendation: { type: "string" },
          stateResources: {
            type: "object",
            properties: {
              regulatorName: { type: "string" },
              regulatorUrl: { type: "string" }
            }
          }
        }
      }
    });

    setResult(res);
    setLoading(false);
  };

  const riskColors = {
    low: "text-drill-green bg-drill-green/10 border-drill-green/30",
    medium: "text-crude-gold bg-crude-gold/10 border-crude-gold/30",
    high: "text-orange-500 bg-orange-500/10 border-orange-500/30",
    critical: "text-flare-red bg-flare-red/10 border-flare-red/30",
    unknown: "text-muted-foreground bg-muted/50 border-border",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Hero */}
      <div className="rounded-2xl border-2 border-crude-gold/30 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-crude-gold/20 border border-crude-gold/40 flex items-center justify-center">
            <Search className="w-5 h-5 text-crude-gold" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Operator Screener</h1>
            <p className="text-white/60 text-xs">Vet any oil & gas operator before you invest a dime</p>
          </div>
        </div>
        <p className="text-white/75 text-sm leading-relaxed">
          Enter the name of the operator or company pitching you a deal. Our AI investigator will search public records, regulatory databases, and industry sources to flag potential risks. <strong className="text-crude-gold">This is your first line of defense against fraud.</strong>
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Operator / Company Name</label>
            <Input
              placeholder='e.g. "Patriot Energy Group LLC"'
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && runScreen()}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">State (optional)</label>
            <Input
              placeholder='e.g. "Texas"'
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && runScreen()}
            />
          </div>
        </div>
        <Button
          onClick={runScreen}
          disabled={!operatorName.trim() || loading}
          className="w-full gap-2 h-11"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Background Check...
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              Screen This Operator
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* Risk Rating */}
          <div className={`rounded-xl border p-5 ${riskColors[result.riskRating] || riskColors.unknown}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-bold text-base">{operatorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl">{result.riskScore}/10</span>
                <Badge className={`${riskColors[result.riskRating]} border font-bold uppercase text-xs`}>
                  {result.riskRating} risk
                </Badge>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{result.companyProfile}</p>
          </div>

          {/* Recommendation */}
          <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
            <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide mb-2">Recommendation</p>
            <p className="text-sm font-medium text-foreground leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Red Flags */}
          {result.redFlags?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-flare-red uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <XCircle className="w-4 h-4" /> Red Flags ({result.redFlags.length})
              </h3>
              <div className="space-y-2">
                {result.redFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-flare-red/5 border border-flare-red/20">
                    <XCircle className="w-3.5 h-3.5 text-flare-red mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Known Issues */}
          {result.knownIssues?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-4 h-4" /> Known Issues ({result.knownIssues.length})
              </h3>
              <div className="space-y-2">
                {result.knownIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positive Indicators */}
          {result.positiveIndicators?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-drill-green uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Positive Indicators
              </h3>
              <div className="space-y-2">
                {result.positiveIndicators.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-drill-green/5 border border-drill-green/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-drill-green mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Steps */}
          {result.verificationSteps?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-primary dark:text-accent uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <FileText className="w-4 h-4" /> Your Next Steps
              </h3>
              <div className="space-y-2">
                {result.verificationSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border">
                    <span className="text-xs font-mono font-bold text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* State Resources */}
          {result.stateResources?.regulatorName && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-2">
                <Scale className="w-4 h-4 text-muted-foreground" /> State Regulator
              </h3>
              <a
                href={result.stateResources.regulatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
              >
                <Globe className="w-4 h-4 text-primary dark:text-accent shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">{result.stateResources.regulatorName}</p>
                  <p className="text-[10px] text-muted-foreground">{result.stateResources.regulatorUrl}</p>
                </div>
              </a>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This AI-powered screening tool uses publicly available information and AI analysis. It does not access proprietary databases, court records, or state regulatory systems in real time. Results are informational only and do not constitute a legal background check, securities analysis, or investment advice. Always verify results independently through SEC EDGAR, FINRA BrokerCheck, state courts, and the relevant state oil & gas regulatory board. Consult a licensed securities attorney before investing.
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      {!result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "SEC EDGAR", desc: "Search federal filings", url: "https://www.sec.gov/cgi-bin/browse-edgar", icon: FileText },
            { label: "FINRA BrokerCheck", desc: "Verify brokers & reps", url: "https://brokercheck.finra.org/", icon: Users },
            { label: "Report Fraud", desc: "SEC whistleblower tip", url: "https://tips.sec.gov/", icon: Phone },
          ].map(({ label, desc, url, icon: Icon }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}