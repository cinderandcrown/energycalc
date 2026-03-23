import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileSelect from "@/components/mobile/MobileSelect";
import { useToast } from "@/components/ui/use-toast";

const DOC_TYPES = [
  { value: "ppm", label: "PPM / Offering Memorandum" },
  { value: "jv_agreement", label: "Joint Venture Agreement" },
  { value: "subscription_doc", label: "Subscription Document" },
  { value: "operating_agreement", label: "Operating Agreement" },
  { value: "land_lease", label: "Land Lease / Mineral Rights" },
  { value: "royalty_deed", label: "Royalty Deed" },
  { value: "promissory_note", label: "Promissory Note" },
  { value: "financial_statement", label: "Financial Statement" },
  { value: "geological_report", label: "Geological Report" },
  { value: "other", label: "Other" },
];

export default function DocumentUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("other");
  const [operatorName, setOperatorName] = useState("");
  const [dealName, setDealName] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      await base44.entities.DealDocument.create({
        title,
        file_url,
        file_name: file.name,
        file_size_kb: Math.round(file.size / 1024),
        document_type: docType,
        operator_name: operatorName || undefined,
        deal_name: dealName || undefined,
        analysis_status: "pending",
      });

      toast({ title: "Document uploaded", description: "Ready for AI analysis." });
      setFile(null);
      setTitle("");
      setOperatorName("");
      setDealName("");
      setDocType("other");
      onUploaded?.();
    } catch (err) {
      toast({ title: "Upload failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Upload className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Upload Deal Document</h3>
      </div>

      {/* File picker */}
      <label className="flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-xl border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        <FileText className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Click to select PDF, DOC, or image"}
        </p>
        <p className="text-[10px] text-muted-foreground">PPMs, JV Agreements, Subscription Docs, etc.</p>
        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.csv,.html" onChange={handleFileChange} />
      </label>

      {file && (
        <>
          <Input placeholder="Document title *" value={title} onChange={(e) => setTitle(e.target.value)} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MobileSelect
              value={docType}
              onValueChange={setDocType}
              options={DOC_TYPES}
              label="Document Type"
              placeholder="Select type"
            />
            <Input placeholder="Operator / Company name" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} />
          </div>

          <Input placeholder="Deal / Project name" value={dealName} onChange={(e) => setDealName(e.target.value)} />

          <Button onClick={handleUpload} disabled={uploading || !title} className="w-full bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-2">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </>
      )}
    </div>
  );
}