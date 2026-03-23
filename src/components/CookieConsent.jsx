import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "energycalc_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      // Restore granted consent on return visits
      if (window.gtag) {
        window.gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto rounded-2xl border border-border bg-card shadow-2xl p-5 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-4.5 h-4.5 text-primary dark:text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">We value your privacy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to serve personalized ads, measure performance, and improve your experience. You can choose to accept or decline non-essential cookies. See our{" "}
              <Link to="/legal" className="underline hover:text-foreground">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 mt-4 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="text-xs"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="text-xs"
          >
            Accept All Cookies
          </Button>
        </div>
      </div>
    </div>
  );
}