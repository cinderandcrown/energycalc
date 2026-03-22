import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Loader2, ShieldAlert, XCircle, CheckCircle2,
  AlertTriangle, DollarSign, Scale, Trash2, FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import PPMAnalysisResults from "./PPMAnalysisResults";

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/html",
];

const MAX_SIZE_MB = 20;

export default function PPMUploadAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState(""); // upload, extract, analyze
  const inputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ title: "File too large", description: `Maximum file size is ${MAX_SIZE_MB}MB.`, variant: "destructive" });
      return;
    }

    setFile(selected);
    setAnalysis(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (dropped.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({ title: "File too large", description: `Maximum file size is ${MAX_SIZE_MB}MB.`, variant: "destructive" });
        return;
      }
      setFile(dropped);
      setAnalysis(null);
      setError(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const analyzeDocument = async () => {
    if (!file) return;
    setError(null);
    setAnalyzing(true);

    // Step 1: Upload
    setStage("Uploading document securely...");
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);

    // Step 2: Analyze via backend
    setStage("AI is reading and analyzing your document...");
    const res = await base44.functions.invoke("analyzePPM", { fileUrl: file_url });

    if (res.data?.error) {
      setError(res.data.error);
      setAnalyzing(false);
      setStage("");
      return;
    }

    if (res.data?.success) {
      setAnalysis(res.data.analysis);
      toast({ title: "Analysis complete", description: `Risk Level: ${res.data.analysis.riskLevel?.toUpperCase()} (${res.data.analysis.riskScore}/10)` });
    } else {
      setError("Unexpected error during analysis. Please try again.");
    }

    setAnalyzing(false);
    setStage("");
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="rounded-xl border border-primary/30 dark:border-accent/30 bg-primary/5 dark:bg-accent/5 p-4">
        <div className="flex gap-2 items-start">
          <FileSearch className="w-4 h-4 text-primary dark:text-accent mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Upload Your PPM or Offering Document</strong> — Upload a PDF, Word document, or text file of any oil & gas offering. Our AI will extract the text and perform a comprehensive analysis covering deal structure, fee stacking, red flags, legal disclosures, and investor risk assessment. <strong className="text-foreground">Your documents are processed securely and not stored after analysis.</strong> This uses a higher-quality AI model for thorough analysis (uses more credits).
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary dark:hover:border-accent hover:bg-muted/30 transition-all"
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            Drop your PPM here or tap to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, Word (.doc/.docx), HTML, or text file · Max {MAX_SIZE_MB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.html"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary dark:text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "document"}
              </p>
            </div>
            {!analyzing && (
              <Button variant="ghost" size="icon" onClick={clearFile} className="shrink-0 min-w-[44px] min-h-[44px]">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          {/* Analyze Button */}
          {!analysis && (
            <Button
              onClick={analyzeDocument}
              disabled={analyzing}
              className="w-full mt-4 min-h-[44px] gap-2 bg-flare-red hover:bg-flare-red/90 text-white"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {stage}
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Analyze Document for Red Flags
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-flare-red/40 bg-flare-red/5 p-4 flex items-start gap-2">
          <XCircle className="w-4 h-4 text-flare-red shrink-0 mt-0.5" />
          <p className="text-xs text-flare-red">{error}</p>
        </div>
      )}

      {/* Results */}
      {analysis && <PPMAnalysisResults analysis={analysis} onReset={clearFile} />}
    </div>
  );
}