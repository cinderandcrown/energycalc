import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import DownloadReportButton from "@/components/DownloadReportButton";
import SocialShareButtons from "@/components/growth/SocialShareButtons";
import ShareResultModal from "@/components/growth/ShareResultModal";

const CALC_LABELS = {
  "net-investment": "Net Investment",
  "barrels-to-cash": "Barrels to Cash",
  "natgas-to-cash": "Nat Gas to Cash",
  "rate-of-return": "Rate of Return",
  "tax-impact": "Tax Impact",
  "gold-purity": "Gold Purity",
  "ag-yield": "Ag Yield",
  "metal-cost": "Metal Cost Basis",
  "livestock": "Livestock",
};

export default function CalcActionBar({ onSave, onReset, calcType, inputs, results }) {
  const calcLabel = CALC_LABELS[calcType] || calcType || "Calculator";
  const shareTitle = `${calcLabel} analysis on Commodity Investor+`;
  const shareUrl = window.location.href;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onSave} size="sm" className="gap-1.5">
        <Save className="w-4 h-4" />
        Save & Name
      </Button>
      {calcType && inputs && results && (
        <DownloadReportButton calcType={calcType} inputs={inputs} results={results} />
      )}
      <SocialShareButtons
        url={shareUrl}
        title={shareTitle}
        description={`I just ran a ${calcLabel} analysis on Commodity Investor+ — the commodity investment toolkit.`}
      />
      {calcType && results && (
        <ShareResultModal calcType={calcType} results={results} />
      )}
      <Button onClick={onReset} size="sm" variant="ghost" className="gap-1.5">
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}
