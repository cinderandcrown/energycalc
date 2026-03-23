import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Building2, Landmark, ChevronDown, AlertTriangle,
  CheckCircle2, DollarSign, Scale, FileText, Zap,
  ArrowRight, BookOpen, Lock, Globe, Users, Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import TrustStrategies from "../components/tax/TrustStrategies";
import LLCStrategies from "../components/tax/LLCStrategies";
import EnergyTaxPlaybook from "../components/tax/EnergyTaxPlaybook";
import WealthProtectionChecklist from "../components/tax/WealthProtectionChecklist";

const tabs = [
  { id: "energy", label: "Energy Tax Playbook", icon: Zap },
  { id: "trusts", label: "Trust Structures", icon: Landmark },
  { id: "llc", label: "LLC & Entity Strategy", icon: Building2 },
  { id: "checklist", label: "Protection Checklist", icon: Shield },
];

export default function TaxStrategies() {
  const [activeTab, setActiveTab] = useState("energy");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-crude-gold/15 text-crude-gold border-crude-gold/25 text-[10px] font-bold">
            ADVANCED STRATEGIES
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Tax Strategies & Asset Protection
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
          Legal tax minimization and liability protection strategies used by sophisticated energy investors. Every strategy below is within the bounds of U.S. tax law — the IRS wrote these rules.
        </p>
      </div>

      {/* Key stat banner */}
      <div className="rounded-xl border-2 border-crude-gold/30 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "IDC deduction in Year 1", icon: Zap },
            { value: "15%", label: "Depletion allowance (tax-free)", icon: DollarSign },
            { value: "$0", label: "Self-employment tax via LP", icon: Shield },
            { value: "∞", label: "Generations via dynasty trust", icon: Landmark },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="w-4 h-4 text-crude-gold mx-auto mb-1.5" />
              <p className="font-mono font-bold text-lg text-crude-gold">{s.value}</p>
              <p className="text-[10px] text-white/50 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "energy" && <EnergyTaxPlaybook />}
          {activeTab === "trusts" && <TrustStrategies />}
          {activeTab === "llc" && <LLCStrategies />}
          {activeTab === "checklist" && <WealthProtectionChecklist />}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link to="/calc/net-investment" className="flex-1">
          <Button className="w-full gap-2 bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90">
            <Zap className="w-4 h-4" />
            Model Your Tax Savings
          </Button>
        </Link>
        <Link to="/learn" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <BookOpen className="w-4 h-4" />
            Learn the Fundamentals
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-flare-red/5 border-2 border-flare-red/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-flare-red shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-foreground mb-1">Legal & Tax Disclaimer</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The information on this page is for <strong className="text-foreground">educational purposes only</strong> and does not constitute tax, legal, or financial advice. Tax laws are complex and change frequently. The strategies described may not be suitable for your specific situation and could have unintended consequences if implemented incorrectly. <strong className="text-foreground">Always consult a qualified CPA, tax attorney, and/or estate planning attorney</strong> before implementing any tax strategy, forming any legal entity, or creating any trust. Commodity Investor+ is not a law firm, CPA firm, or registered investment advisor. Individual results vary based on income level, state of residence, and specific circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}