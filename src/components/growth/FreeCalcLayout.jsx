import { Outlet, Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import FreeCalcUpsellBanner from "./FreeCalcUpsellBanner";
import EmailCaptureForm from "./EmailCaptureForm";

export default function FreeCalcLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <FreeCalcUpsellBanner />

      {/* Calculator content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom upsell + email capture */}
      <section className="border-t border-border bg-card/50">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8">
          {/* Upsell card */}
          <div className="rounded-2xl border-2 border-crude-gold/30 bg-card p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Unlock the Full Toolkit</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Get all 9 commodity calculators, AI PPM Analyzer, Operator Screener, live market data, and investor protection tools.
            </p>
            <Link to="/#pricing">
              <Button className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-2 h-11 px-8">
                Start 3-Day Free Trial — $10/mo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-[10px] text-muted-foreground">No charge for 3 days. Cancel anytime.</p>
          </div>

          {/* Email capture */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Not ready to subscribe?</h3>
            <p className="text-sm text-muted-foreground">Get free daily commodity market insights delivered to your inbox.</p>
            <EmailCaptureForm variant="inline" source="free_calc" />
          </div>

          {/* Branding */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
            <Shield className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-[10px] text-muted-foreground">
              Powered by <strong className="text-foreground/70">Commodity Investor+</strong> · <Link to="/" className="underline underline-offset-2 hover:text-foreground">commodityinvestor.app</Link>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
