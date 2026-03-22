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
    <div className="bg-primary dark:bg-accent/20 border-b border-primary/30 dark:border-accent/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertTriangle className="w-3.5 h-3.5 text-primary-foreground dark:text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-primary-foreground dark:text-accent/90 leading-relaxed flex-1">
          <strong>Not investment advice.</strong> EnergyCalc Pro is not a broker-dealer, investment adviser, or FINRA member. All calculations are hypothetical. Oil &amp; gas investments carry substantial risk including total loss of capital.{" "}
          <Link to="/legal" onClick={dismiss} className="underline underline-offset-2 font-semibold hover:opacity-80">
            Full Disclosures →
          </Link>
        </p>
        <button onClick={dismiss} className="text-primary-foreground dark:text-accent/70 hover:opacity-70 transition-opacity shrink-0 mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}