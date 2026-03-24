import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FreeCalcUpsellBanner() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-petroleum via-[#0e2f55] to-petroleum border-b border-crude-gold/20">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-crude-gold shrink-0" aria-hidden="true" />
          <p className="text-xs text-white/80 truncate">
            <span className="hidden sm:inline">You're using a free tool. </span>
            <strong className="text-crude-gold">Unlock all 9 calculators + AI tools</strong>
            <span className="hidden md:inline"> for $10/mo</span>
          </p>
        </div>
        <Link to="/#pricing">
          <Button size="sm" className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5 text-xs h-7 px-3 shrink-0">
            Start Free Trial
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
