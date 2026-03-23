import { motion } from "framer-motion";
import {
  XCircle, CheckCircle2, AlertTriangle, DollarSign, Scale,
  FileText, RotateCcw, Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const riskColor = {
  low: "text-drill-green border-drill-green/40 bg-drill-green/10",
  medium: "text-crude-gold border-crude-gold/40 bg-crude-gold/10",
  high: "text-orange-500 border-orange-500/40 bg-orange-500/10",
  critical: "text-flare-red border-flare-red/40 bg-flare-red/10",
};

const sevColor = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-crude-gold/10 text-crude-gold",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-flare-red/10 text-flare-red",
};

export default function PPMAnalysisResults({ analysis, onReset }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Risk Score Header */}
      <div className={`rounded-xl border p-4 ${riskColor[analysis.riskLevel] || riskColor.medium}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm uppercase tracking-wide">Risk Assessment</span>
            {analysis.dealStructure && (
              <Badge className="bg-background/50 border border-current text-[10px] font-bold">{analysis.dealStructure}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-2xl">{analysis.riskScore}/10</span>
            <Badge className={`${riskColor[analysis.riskLevel]} border font-bold uppercase text-xs`}>
              {analysis.riskLevel}
            </Badge>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Key Terms */}
      {analysis.keyTerms?.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Key Deal Terms
          </p>
          <div className="grid grid-cols-2 gap-2">
            {analysis.keyTerms.map((t, i) => (
              <div key={i} className="rounded-lg bg-muted/30 border border-border p-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t.term}</p>
                <p className="text-xs font-semibold text-foreground">{t.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee Analysis */}
      {analysis.feeAnalysis && (
        <div className="rounded-xl border border-crude-gold/30 bg-crude-gold/5 p-4">
          <p className="text-xs font-semibold text-crude-gold uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Fee & Cost Analysis
          </p>
          {analysis.feeAnalysis.totalFeeEstimate && (
            <p className="text-sm font-medium text-foreground mb-2">
              Estimated Total Fee Load: <strong className="text-crude-gold">{analysis.feeAnalysis.totalFeeEstimate}</strong>
            </p>
          )}
          {analysis.feeAnalysis.fees?.length > 0 && (
            <div className="space-y-1.5">
              {analysis.feeAnalysis.fees.map((f, i) => (
                <div key={i} className="rounded-lg bg-card border border-border p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-foreground">{f.name}</p>
                    <p className="text-xs font-mono font-semibold text-crude-gold">{f.amount}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{f.assessment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legal Disclosures */}
      {analysis.legalDisclosures && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Legal & Regulatory Compliance
          </p>
          <div className="space-y-2">
            {[
              { label: "Reg D Type", value: analysis.legalDisclosures.regDType },
              { label: "Accredited Investor Verification", value: analysis.legalDisclosures.accreditedVerification },
              { label: "Risk Factors Section", value: analysis.legalDisclosures.riskFactors },
              { label: "Conflicts of Interest", value: analysis.legalDisclosures.conflictsOfInterest },
            ].filter(d => d.value).map((d, i) => (
              <div key={i} className="rounded-lg bg-muted/30 border border-border p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{d.label}</p>
                <p className="text-xs text-foreground leading-relaxed">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      <div className="rounded-xl border-2 border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Verdict
        </p>
        <p className="text-sm font-medium text-foreground leading-relaxed">{analysis.verdict}</p>
      </div>

      {/* Red Flags */}
      {analysis.redFlags?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-flare-red uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <XCircle className="w-4 h-4" /> Red Flags ({analysis.redFlags.length})
          </h3>
          <div className="space-y-2">
            {analysis.redFlags.map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-start gap-2 mb-1">
                  <Badge className={`${sevColor[f.severity] || sevColor.medium} border-0 text-[10px] font-semibold uppercase shrink-0`}>{f.severity}</Badge>
                  <p className="text-xs font-semibold text-foreground leading-snug">{f.flag}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-1">{f.explanation}</p>
                {f.quotedText && (
                  <div className="mt-1.5 pl-1 border-l-2 border-flare-red/30 ml-1">
                    <p className="text-[11px] text-muted-foreground italic">"{f.quotedText}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Green Flags */}
      {analysis.greenFlags?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-drill-green uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4" /> Positive Indicators
          </h3>
          <div className="space-y-1">
            {analysis.greenFlags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-drill-green/5 border border-drill-green/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-drill-green mt-0.5 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Items */}
      {analysis.missingItems?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-crude-gold uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4" /> Missing From This Document
          </h3>
          <div className="space-y-1">
            {analysis.missingItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-crude-gold/5 border border-crude-gold/20">
                <AlertTriangle className="w-3.5 h-3.5 text-crude-gold mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl bg-muted/50 border border-border p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">⚠️ AI-Generated Analysis — May Contain Errors:</strong> This analysis was produced by artificial intelligence and <strong className="text-foreground">may contain hallucinations, inaccuracies, misinterpretations, or fabricated information</strong>. AI can miss critical context, misread legal language, or produce entirely incorrect risk assessments. This output is for informational and educational purposes only.
        </p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Not Legal, Financial, or Investment Advice:</strong> This is NOT a legal review, securities opinion, investment recommendation, or substitute for professional counsel. Do NOT rely on this analysis to make investment decisions. Always have offering documents reviewed by a <strong className="text-foreground">licensed securities attorney</strong> and <strong className="text-foreground">independent petroleum engineer</strong> before investing.
        </p>
      </div>

      {/* Reset */}
      <Button variant="outline" onClick={onReset} className="w-full min-h-[44px] gap-2">
        <RotateCcw className="w-4 h-4" />
        Analyze Another Document
      </Button>
    </motion.div>
  );
}