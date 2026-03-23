import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, ShieldAlert, CheckCircle2, XCircle, AlertTriangle,
  Building2, Globe, FileText, Loader2, Scale, Users, Phone,
  ArrowRight, Shield, TrendingUp, Clock, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TrustScoreGauge from "@/components/screener/TrustScoreGauge";
import OperatorProjectHistory from "@/components/screener/OperatorProjectHistory";
import RegulatoryLinks from "@/components/screener/RegulatoryLinks";

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

Research this operator using your knowledge and any available public information. Search SEC EDGAR, state oil & gas commissions, FINRA, court records, and industry databases. Provide a THOROUGH vetting report.

Return JSON with:
1. "found": boolean — whether you have any information about this operator
2. "trustScore": number 0-100 (100 = highly trustworthy). Weight factors: regulatory compliance history (30%), project track record (25%), financial transparency (20%), industry reputation (15%), years in operation (10%)
3. "trustGrade": "A" | "B" | "C" | "D" | "F" — letter grade based on trustScore (A=80-100, B=65-79, C=50-64, D=30-49, F=0-29)
4. "riskRating": "low" | "medium" | "high" | "critical" | "unknown"
5. "riskScore": number 1-10 (10 = extremely dangerous)
6. "companyProfile": string — detailed company profile including founding year, headquarters, key personnel, primary operations, well count, production data if known
7. "keyPersonnel": array of objects with "name", "title", "background" (string with notable info, past companies, any concerns)
8. "pastProjects": array of objects with "name" (project name), "location" (basin/county/state), "status" ("producing"|"completed"|"abandoned"|"drilling"|"disputed"|"unknown"), "details" (brief description), "outcome" (investor outcome if known)
9. "redFlags": array of strings — specific concerns or red flags found
10. "positiveIndicators": array of strings — any positive indicators found
11. "regulatoryHistory": array of objects with "agency" (e.g. "SEC", "TX RRC"), "action" (description), "date" (approximate), "severity" ("info"|"warning"|"violation"|"enforcement")
12. "verificationSteps": array of strings — specific steps with actual URLs
13. "knownIssues": array of strings — lawsuits, regulatory actions, SEC enforcement, complaints
14. "recommendation": string — 2-3 sentence direct recommendation
15. "stateResources": object with "regulatorName" and "regulatorUrl" for relevant state board
16. "trustScoreBreakdown": object with "regulatory" (0-30), "trackRecord" (0-25), "transparency" (0-20), "reputation" (0-15), "longevity" (0-10) — must sum to trustScore

Be DIRECT and PROTECTIVE of the investor. If you don't have information, say so clearly and emphasize that lack of public information about an oil & gas operator is itself a significant concern. Never give a clean bill of health without evidence. For unknown operators, trustScore should be 25 or below.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          found: { type: "boolean" },
          trustScore: { type: "number" },
          trustGrade: { type: "string" },
          riskRating: { type: "string" },
          riskScore: { type: "number" },
          companyProfile: { type: "string" },
          keyPersonnel: { type: "array", items: { type: "object", properties: { name: { type: "string" }, title: { type: "string" }, background: { type: "string" } } } },
          pastProjects: { type: "array", items: { type: "object", properties: { name: { type: "string" }, location: { type: "string" }, status: { type: "string" }, details: { type: "string" }, outcome: { type: "string" } } } },
          redFlags: { type: "array", items: { type: "string" } },
          positiveIndicators: { type: "array", items: { type: "string" } },
          regulatoryHistory: { type: "array", items: { type: "object", properties: { agency: { type: "string" }, action: { type: "string" }, date: { type: "string" }, severity: { type: "string" } } } },
          verificationSteps: { type: "array", items: { type: "string" } },
          knownIssues: { type: "array", items: { type: "string" } },
          recommendation: { type: "string" },
          stateResources: { type: "object", properties: { regulatorName: { type: "string" }, regulatorUrl: { type: "string" } } },
          trustScoreBreakdown: { type: "object", properties: { regulatory: { type: "number" }, trackRecord: { type: "number" }, transparency: { type: "number" }, reputation: { type: "number" }, longevity: { type: "number" } } }
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

          {/* Trust Score Gauge */}
          <TrustScoreGauge
            score={result.trustScore ?? 50}
            grade={result.trustGrade || "C"}
            operatorName={operatorName}
          />

          {/* Trust Score Breakdown */}
          {result.trustScoreBreakdown && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Target className="w-4 h-4 text-muted-foreground" /> Trust Score Breakdown
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Regulatory Compliance", value: result.trustScoreBreakdown.regulatory, max: 30, color: "bg-blue-500" },
                  { label: "Project Track Record", value: result.trustScoreBreakdown.trackRecord, max: 25, color: "bg-drill-green" },
                  { label: "Financial Transparency", value: result.trustScoreBreakdown.transparency, max: 20, color: "bg-crude-gold" },
                  { label: "Industry Reputation", value: result.trustScoreBreakdown.reputation, max: 15, color: "bg-purple-500" },
                  { label: "Years in Operation", value: result.trustScoreBreakdown.longevity, max: 10, color: "bg-cyan-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-mono font-semibold text-foreground">{item.value ?? 0}/{item.max}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${((item.value ?? 0) / item.max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Profile */}
          <div className={`rounded-xl border p-5 ${riskColors[result.riskRating] || riskColors.unknown}`}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
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

          {/* Quick Action: PPM Analysis */}
          <div className="rounded-xl border-2 border-crude-gold/30 bg-gradient-to-r from-crude-gold/5 to-transparent p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-crude-gold/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-crude-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Got a PPM from this operator?</p>
                  <p className="text-xs text-muted-foreground">Upload it for a full AI red-flag analysis tied to this screening.</p>
                </div>
              </div>
              <Link to="/investor-protection">
                <Button className="gap-2 bg-crude-gold text-petroleum hover:bg-crude-gold/90 font-bold">
                  <Shield className="w-4 h-4" />
                  Analyze PPM
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
            <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide mb-2">Recommendation</p>
            <p className="text-sm font-medium text-foreground leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Key Personnel */}
          {result.keyPersonnel?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" /> Key Personnel ({result.keyPersonnel.length})
              </h3>
              <div className="space-y-2">
                {result.keyPersonnel.map((person, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-foreground">{person.name}</p>
                      {person.title && <Badge variant="outline" className="text-[10px]">{person.title}</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{person.background}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Projects */}
          <OperatorProjectHistory projects={result.pastProjects} />

          {/* Regulatory History */}
          {result.regulatoryHistory?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Scale className="w-4 h-4 text-muted-foreground" /> Regulatory History ({result.regulatoryHistory.length})
              </h3>
              <div className="space-y-2">
                {result.regulatoryHistory.map((entry, i) => {
                  const sevColors = {
                    info: "border-l-blue-500 bg-blue-500/5",
                    warning: "border-l-crude-gold bg-crude-gold/5",
                    violation: "border-l-orange-500 bg-orange-500/5",
                    enforcement: "border-l-flare-red bg-flare-red/5",
                  };
                  return (
                    <div key={i} className={`rounded-lg border border-border border-l-4 ${sevColors[entry.severity] || sevColors.info} p-3`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold">{entry.agency}</Badge>
                          <Badge className={`border-0 text-[10px] font-bold ${
                            entry.severity === "enforcement" ? "bg-flare-red/10 text-flare-red" :
                            entry.severity === "violation" ? "bg-orange-500/10 text-orange-500" :
                            entry.severity === "warning" ? "bg-crude-gold/10 text-crude-gold" :
                            "bg-muted text-muted-foreground"
                          }`}>{entry.severity}</Badge>
                        </div>
                        {entry.date && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{entry.date}</span>}
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{entry.action}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

          {/* Regulatory Database Links */}
          <RegulatoryLinks operatorName={operatorName} stateResources={result.stateResources} />

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

          {/* Disclaimer */}
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This AI-powered screening tool uses publicly available information and AI analysis. It does not access proprietary databases, court records, or state regulatory systems in real time. Results are informational only and do not constitute a legal background check, securities analysis, or investment advice. The Trust Score is an AI-generated composite estimate — not a certified rating. Always verify results independently through SEC EDGAR, FINRA BrokerCheck, state courts, and the relevant state oil & gas regulatory board. Consult a licensed securities attorney before investing.
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Links — shown when no results */}
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