import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { appParams } from "@/lib/app-params";

export default function DownloadReportButton({ calcType, inputs, results, size = "sm" }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setLoading(true);
    const cleanResults = { ...results };
    delete cleanResults.months;
    delete cleanResults.chartData;

    // Use direct fetch for binary PDF response
    const response = await base44.functions.invoke("generateReport", {
      calcType,
      inputs,
      results: cleanResults,
    });

    // The response.data may be base64 or text - let's use a workaround
    // Re-fetch the function URL directly with blob response
    const funcUrl = `${appParams.appBaseUrl || ''}/api/functions/generateReport`;
    const fetchRes = await fetch(funcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${appParams.token}`,
      },
      body: JSON.stringify({ calcType, inputs, results: cleanResults }),
    });

    if (!fetchRes.ok) {
      toast({ title: "Error", description: "Failed to generate report. Please try again.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const blob = await fetchRes.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EnergyCalc_${calcType}_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Report downloaded", description: "Your PDF report has been saved." });
    setLoading(false);
  };

  return (
    <Button onClick={handleDownload} disabled={loading} size={size} variant="outline" className="gap-1.5">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      {loading ? "Generating..." : "PDF Report"}
    </Button>
  );
}