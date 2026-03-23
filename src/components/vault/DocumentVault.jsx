import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FolderOpen, Shield, AlertTriangle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DocumentUploader from "./DocumentUploader";
import DocumentCard from "./DocumentCard";

export default function DocumentVault() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocs = async () => {
    const docs = await base44.entities.DealDocument.list("-created_date", 100);
    setDocuments(docs);
    setLoading(false);
  };

  useEffect(() => { loadDocs(); }, []);

  const analyzed = documents.filter(d => d.analysis_status === "complete");
  const avgScore = analyzed.length > 0
    ? Math.round(analyzed.reduce((s, d) => s + (d.risk_score || 0), 0) / analyzed.length)
    : null;
  const dangerousDocs = analyzed.filter(d => d.risk_grade === "D" || d.risk_grade === "F");

  return (
    <div className="space-y-5">
      {/* Vault Header */}
      <div className="rounded-2xl border-2 border-flare-red/30 bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-flare-red/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-flare-red" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-base mb-1">Deal Document Vault</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload your commodity deal documents — PPMs, JV agreements, subscription docs, and more. 
              Our AI forensic analyst will grade each document, flag red flags and predatory clauses, 
              and give you an honest report card. <strong className="text-foreground">Protect yourself before you invest.</strong>
            </p>
          </div>
        </div>

        {/* Stats */}
        {documents.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-mono font-bold text-lg text-foreground">{documents.length}</p>
              <p className="text-[10px] text-muted-foreground">Documents</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className={`font-mono font-bold text-lg ${
                avgScore == null ? "text-muted-foreground" : avgScore >= 60 ? "text-drill-green" : avgScore >= 40 ? "text-crude-gold" : "text-flare-red"
              }`}>
                {avgScore != null ? avgScore : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground">Avg Safety Score</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className={`font-mono font-bold text-lg ${dangerousDocs.length > 0 ? "text-flare-red" : "text-drill-green"}`}>
                {dangerousDocs.length}
              </p>
              <p className="text-[10px] text-muted-foreground">Dangerous Deals</p>
            </div>
          </div>
        )}

        {/* Danger alert */}
        {dangerousDocs.length > 0 && (
          <div className="mt-3 rounded-lg bg-flare-red/10 border border-flare-red/30 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-flare-red shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-flare-red">
                {dangerousDocs.length} document{dangerousDocs.length > 1 ? "s" : ""} flagged as dangerous
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {dangerousDocs.map(d => d.title).join(", ")} — exercise extreme caution and consider consulting a securities attorney.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploader */}
      <DocumentUploader onUploaded={loadDocs} />

      {/* Document List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-border bg-card">
          <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">No documents yet</p>
          <p className="text-xs text-muted-foreground">Upload your first deal document above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <DocumentCard key={doc.id} doc={doc} onRefresh={loadDocs} />
          ))}
        </div>
      )}
    </div>
  );
}