import { GraduationCap, AlertTriangle } from "lucide-react";
import StewardshipBanner from "@/components/literacy/StewardshipBanner";
import SupplyDemandSimulator from "@/components/literacy/SupplyDemandSimulator";
import GuidedLessons from "@/components/literacy/GuidedLessons";
import ConceptCards from "@/components/literacy/ConceptCards";
import DisclaimerFooter from "@/components/DisclaimerFooter";

export default function EnergyLiteracy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-crude-gold" />
          Energy Literacy Center
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Understand how markets work, why prices move, and how to evaluate opportunities — because wise stewardship starts with knowledge
        </p>
      </div>

      {/* Stewardship Philosophy */}
      <StewardshipBanner />

      {/* Interactive Supply/Demand Simulator */}
      <SupplyDemandSimulator />

      {/* Guided Lessons */}
      <GuidedLessons />

      {/* Connect to Tools */}
      <ConceptCards />

      {/* Educational disclaimer */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Educational content only.</strong> Everything in this section teaches economic principles and market mechanics — 
          it does not constitute investment advice, tax advice, or a recommendation to buy or sell any asset. 
          The simulators use simplified models for educational purposes and do not predict actual market prices. 
          Always consult qualified professionals before making financial decisions. 
          Good stewardship includes seeking wise counsel.
        </p>
      </div>

      <DisclaimerFooter />
    </div>
  );
}