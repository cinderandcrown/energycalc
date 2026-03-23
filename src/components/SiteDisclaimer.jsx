import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function SiteDisclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("disclaimer-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("disclaimer-dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-primary dark:bg-accent/20 border-b border-primary/30 dark:border-accent/30 px-4 py-2.5 relative" style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-7xl mx-auto flex items-start gap-3 pr-8">
        <AlertTriangle className="w-3.5 h-3.5 text-primary-foreground dark:text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-primary-foreground dark:text-accent/90 leading-relaxed flex-1">
          <strong>AI-Powered Analysis — Not Investment Advice:</strong> This platform was built to combat the widespread fraud and misinformation in energy investing. All reports, calculations, and analyses on this site are AI-driven and for educational purposes only. EnergyCalc Pro, LLC is not a registered broker-dealer, investment adviser, CPA firm, law firm, or FINRA member. Nothing here constitutes investment, tax, or legal advice. All outputs are hypothetical and illustrative. Oil &amp; gas investments are speculative and involve substantial risk, including total loss of capital.{" "}
          <Link to="/legal" onClick={dismiss} className="underline underline-offset-2 font-semibold hover:opacity-80">
            Full Legal Disclosures &amp; Terms →
          </Link>
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md text-primary-foreground dark:text-accent/70 hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}