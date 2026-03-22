import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DownloadReportButton from "@/components/DownloadReportButton";

export default function CalcActionBar({ onSave, onReset, calcType, inputs, results }) {
  const { toast } = useToast();

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast({ title: "Link copied!", description: "Share this URL to share your calculator settings." });
      });
    } else {
      toast({ title: "Share", description: url });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onSave} size="sm" className="gap-1.5">
        <Save className="w-4 h-4" />
        Save & Name
      </Button>
      {calcType && inputs && results && (
        <DownloadReportButton calcType={calcType} inputs={inputs} results={results} />
      )}
      <Button onClick={handleShare} size="sm" variant="outline" className="gap-1.5">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button onClick={onReset} size="sm" variant="ghost" className="gap-1.5">
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}