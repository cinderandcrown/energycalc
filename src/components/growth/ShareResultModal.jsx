import { useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image, Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import ShareableResultCard from "./ShareableResultCard";
import SocialShareButtons from "./SocialShareButtons";

/**
 * Modal that generates a branded result card image and offers share/download options.
 */
export default function ShareResultModal({ calcType, results }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { toast } = useToast();

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const url = canvas.toDataURL("image/png");
      setImageUrl(url);
    } catch {
      toast({ title: "Error", description: "Could not generate image. Please try again.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }, [toast]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = `commodity-investor-${calcType || "result"}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <Image className="w-3.5 h-3.5" />
          Share as Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          {imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={imageUrl} alt="Shareable result card" className="w-full" />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-3">
              <Image className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Generate a branded image of your results to share on social media.</p>
              <Button onClick={generateImage} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
                {generating ? "Generating..." : "Generate Image"}
              </Button>
            </div>
          )}

          {/* Actions */}
          {imageUrl && (
            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={handleDownload} size="sm" className="gap-1.5">
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <SocialShareButtons
                url={window.location.href}
                title={`My ${calcType || "calculator"} results on Commodity Investor+`}
                description="Check out my analysis on Commodity Investor+ — the commodity investment toolkit."
              />
            </div>
          )}
        </div>

        {/* Hidden card for html2canvas capture */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <ShareableResultCard ref={cardRef} calcType={calcType} results={results} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
