import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Shield, AlertTriangle, CheckCircle2, Loader2, Trash2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const GRADE_COLORS = {
  A: "bg-drill-green text-white",
  B: "bg-blue-500 text-white",
  C: "bg-crude-gold text-petroleum",
  D: "bg-orange-500 text-white",
  F: "bg-flare-red text-white",
};

const GRADE_LABELS = {
  A: "Institutional Quality",
  B: "Reasonable",
  C: "Significant Concerns",
  D: "Likely Predatory",
  F: "Extremely Dangerous",
};

const DOC_TYPE_LABELS = {
  ppm: "PPM", jv_agreement: "JV Agreement", subscription_doc: "Subscription Doc",
  operating_agreement: "Operating Agreement", land_lease: "Land Lease",
  royalty_deed: "Royalty Deed", promissory_note: "Promissory Note",
  financial_statement: "Financial Statement", geological_report: "Geo Report", other: "Document",
};

export default function DocumentCard({ doc, onRefresh }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await base44.functions.invoke("analyzeDealDocument", { documentId: doc.id });
    toast({ title: "Analysis complete", description: `${doc.title} has been analyzed.` });
    setAnalyzing(false);
    onRefresh?.();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this document and its analysis?")) return;
    setDeleting(true);
    await base44.entities.DealDocument.delete(doc.id);
    toast({ title: "Document deleted" });
    onRefresh?.();
  };

  const isComplete = doc.analysis_status === "complete";
  const grade = doc.risk_grade;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          isComplete && grade ? GRADE_COLORS[grade] : "bg-muted"
        }`}>
          {isComplete && grade ? (
            <span className="font-mono font-bold text-lg">{grade}</span>
          ) : (
            <FileText className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{doc.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge variant="secondary" className="text-[10px]">{DOC_TYPE_LABELS[doc.document_type] || "Doc"}</Badge>
            {doc.operator_name && <Badge variant="outline" className="text-[10px]">{doc.operator_name}</Badge>}
            {isComplete && grade && (
              <Badge className={`text-[10px] ${GRADE_COLORS[grade]}`}>{GRADE_LABELS[grade]}</Badge>
            )}
          </div>
          {doc.deal_name && <p className="text-xs text-muted-foreground mt-1">{doc.deal_name}</p>}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isComplete && (
            <Button size="sm" onClick={handleAnalyze} disabled={analyzing || doc.analysis_status === "analyzing"} className="gap-1.5 bg-crude-gold text-petroleum hover:bg-crude-gold/90 text-xs">
              {analyzing || doc.analysis_status === "analyzing" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              Analyze
            </Button>
          )}
          {isComplete && (
            <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)} className="gap-1 text-xs">
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Report
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={handleDelete} disabled={deleting} className="w-8 h-8 text-muted-foreground hover:text-flare-red" aria-label="Delete document">
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Score bar (compact, always visible when complete) */}
      {isComplete && doc.risk_score != null && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  doc.risk_score >= 70 ? "bg-drill-green" : doc.risk_score >= 40 ? "bg-crude-gold" : "bg-flare-red"
                }`}
                style={{ width: `${doc.risk_score}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-foreground w-8 text-right">{doc.risk_score}</span>
          </div>
        </div>
      )}

      {/* Expanded report card */}
      {expanded && isComplete && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/20">
          {/* Summary */}
          {doc.summary && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{doc.summary}</p>
            </div>
          )}

          {/* Red flags */}
          {doc.red_flags?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-flare-red" />
                <p className="text-xs font-semibold text-flare-red">Red Flags ({doc.red_flags.length})</p>
              </div>
              <ul className="space-y-1">
                {doc.red_flags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-flare-red mt-0.5">✕</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Green flags */}
          {doc.green_flags?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-drill-green" />
                <p className="text-xs font-semibold text-drill-green">Positive Indicators ({doc.green_flags.length})</p>
              </div>
              <ul className="space-y-1">
                {doc.green_flags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-drill-green mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing items */}
          {doc.missing_items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-crude-gold mb-2">Missing Items ({doc.missing_items.length})</p>
              <ul className="space-y-1">
                {doc.missing_items.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-crude-gold mt-0.5">⚠</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Operator flags */}
          {doc.operator_flags?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Shield className="w-3.5 h-3.5 text-flare-red" />
                <p className="text-xs font-semibold text-foreground">Operator Concerns</p>
              </div>
              <ul className="space-y-1">
                {doc.operator_flags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-flare-red mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verdict */}
          {doc.verdict && (
            <div className="rounded-lg border border-crude-gold/30 bg-crude-gold/5 p-3">
              <p className="text-xs font-semibold text-crude-gold mb-1">AI Verdict</p>
              <p className="text-sm text-foreground leading-relaxed">{doc.verdict}</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground">
            Analysis uses a higher-quality AI model for accuracy. This is not legal or financial advice — always consult a qualified professional before making investment decisions.
          </p>
        </div>
      )}
    </div>
  );
}