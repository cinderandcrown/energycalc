import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";

/**
 * Upgrade nudge shown to users whose trial has expired or who have no access.
 * Hidden for active subscribers and trial users.
 */
export default function UpgradeNudge() {
  const { hasAccess, loading } = useSubscription();

  if (loading || hasAccess) return null;

  return (
    <div className="rounded-2xl border-2 border-crude-gold/40 bg-gradient-to-br from-petroleum to-[#1a3a6b] dark:from-card dark:to-card/80 p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto mb-4">
        <Zap className="w-6 h-6 text-crude-gold" />
      </div>
      <h3 className="font-bold text-white dark:text-foreground text-base mb-2">
        Subscribe to Unlock Everything
      </h3>
      <p className="text-white/60 dark:text-muted-foreground text-sm leading-relaxed mb-5 max-w-sm mx-auto">
        All 9 calculators, AI PPM Analyzer, Operator Screener, live market intelligence, and investor protection tools — built for serious commodity investors.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <Link to="/">
          <Button className="bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2">
            <Zap className="w-4 h-4" />
            Subscribe Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <p className="text-white/30 dark:text-muted-foreground text-[10px] mt-3">
        From $8.25/mo · Cancel anytime
      </p>
    </div>
  );
}
