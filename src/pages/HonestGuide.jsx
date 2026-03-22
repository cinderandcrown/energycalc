import { Scale, BookOpen, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IndustryHistory from "../components/advisor/IndustryHistory";
import RealNumbers from "../components/advisor/RealNumbers";
import HonestProsAndCons from "../components/advisor/HonestProsAndCons";
import WhoMakesMoney from "../components/advisor/WhoMakesMoney";
import WhenToWalkAway from "../components/advisor/WhenToWalkAway";
import DisclaimerFooter from "../components/DisclaimerFooter";

export default function HonestGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Hero */}
      <div className="rounded-2xl border-2 border-crude-gold/40 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-crude-gold/20 border border-crude-gold/40 flex items-center justify-center">
            <Scale className="w-5 h-5 text-crude-gold" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">The Honest Guide to Oil & Gas Investing</h1>
            <p className="text-white/60 text-xs">160 years of history. No sugarcoating. No sales pitch.</p>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          This guide was built by people who believe you deserve the full picture — the extraordinary wealth that oil & gas has created AND the extraordinary fraud it has enabled. We don't hide the industry's history. We don't minimize the risks. And we don't pretend every deal is a scam.
        </p>
        <p className="text-white/60 text-xs leading-relaxed mb-4">
          What we do is give you everything — objectively, with sources — so you can make your own informed decision. Every section below covers both sides: what works, what doesn't, and who benefits.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { val: "160+ Years", label: "Of documented industry history" },
            { val: "$10B+/yr", label: "Lost to fraud (FBI estimate)" },
            { val: "15%", label: "Tax-free depletion allowance" },
            { val: "$0", label: "What we're selling you" },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="font-mono font-bold text-crude-gold text-sm">{item.val}</p>
              <p className="text-white/50 text-[10px] leading-tight mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Stance */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-crude-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground mb-1">Our Editorial Stance</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We are not anti-oil & gas. We are not pro-oil & gas. We are pro-transparency. This industry has legitimate economics backed by the U.S. tax code and global energy demand. It also has the highest fraud rate of any investment category in America. Both statements are simultaneously true. If that nuance makes someone uncomfortable — whether it's a promoter who doesn't want you reading the history, or a cynic who doesn't want you seeing the real tax advantages — good. That discomfort means we're being honest.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="proscons">
        <TabsList className="w-full grid grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger value="proscons" className="text-[11px] py-2">Pros & Cons</TabsTrigger>
          <TabsTrigger value="money" className="text-[11px] py-2">Who Gets Paid</TabsTrigger>
          <TabsTrigger value="numbers" className="text-[11px] py-2">Real Numbers</TabsTrigger>
          <TabsTrigger value="history" className="text-[11px] py-2">Industry History</TabsTrigger>
          <TabsTrigger value="walkaway" className="text-[11px] py-2">Walk Away?</TabsTrigger>
        </TabsList>

        <TabsContent value="proscons" className="mt-4">
          <HonestProsAndCons />
        </TabsContent>

        <TabsContent value="money" className="mt-4">
          <WhoMakesMoney />
        </TabsContent>

        <TabsContent value="numbers" className="mt-4">
          <RealNumbers />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <IndustryHistory />
        </TabsContent>

        <TabsContent value="walkaway" className="mt-4">
          <WhenToWalkAway />
        </TabsContent>
      </Tabs>

      {/* Bottom note */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A final note on objectivity:</strong> We built this guide because we were tired of two extremes — operators who hide every risk to close a sale, and internet cynics who call every oil deal a scam. Neither is helpful. The truth is that oil & gas investing is a real asset class with real economics, real tax advantages, and real risks. The history of fraud is not a reason to avoid the sector — it's a reason to do your homework. Use the tools on this site. Verify everything independently. And never invest money you can't afford to lose.
          </p>
        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
}