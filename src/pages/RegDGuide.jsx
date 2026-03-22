import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Shield, Users, ChevronDown, AlertTriangle,
  ExternalLink, CheckCircle2, XCircle, Scale, BookOpen, DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DisclaimerFooter from "@/components/DisclaimerFooter";

import RegDRules from "@/components/regd/RegDRules";
import FormDExplainer from "@/components/regd/FormDExplainer";
import AccreditedInvestorDefs from "@/components/regd/AccreditedInvestorDefs";
import RegDRedFlags from "@/components/regd/RegDRedFlags";
import RegDResources from "@/components/regd/RegDResources";

export default function RegDGuide() {
  const [openSection, setOpenSection] = useState("rules");

  const sections = [
    { id: "rules", label: "Reg D Rules (504, 506(b), 506(c))", icon: Scale, component: RegDRules },
    { id: "formd", label: "Form D Filing & What to Check", icon: FileText, component: FormDExplainer },
    { id: "accredited", label: "Accredited Investor Definitions", icon: Users, component: AccreditedInvestorDefs },
    { id: "redflags", label: "Reg D Red Flags for Investors", icon: AlertTriangle, component: RegDRedFlags },
    { id: "resources", label: "Official Resources & Verification", icon: ExternalLink, component: RegDResources },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5 text-primary dark:text-accent" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">SEC Regulation D — Investor's Legal Guide</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Understand the legal framework behind private placements, Form D filings, and accredited investor requirements
          </p>
        </div>
      </div>

      {/* Context Banner */}
      <div className="rounded-xl border-2 border-primary/20 dark:border-accent/20 bg-primary/5 dark:bg-accent/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary dark:text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Why This Matters to You</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nearly all oil & gas investment offerings are sold as <strong className="text-foreground">private placements</strong> under SEC Regulation D. 
              This means they are <strong className="text-foreground">exempt from full SEC registration</strong> — the SEC does NOT review or approve these offerings. 
              Understanding Reg D is your first line of defense against fraudulent or misleading deals. If an operator can't explain which Reg D exemption they're using, that's a red flag.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map(({ id, label, icon: Icon, component: Component }) => {
          const isOpen = openSection === id;
          return (
            <div key={id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenSection(isOpen ? null : id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary dark:text-accent" />
                </div>
                <span className="flex-1 text-sm font-bold text-foreground">{label}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <Component />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <BookOpen className="w-5 h-5 text-primary dark:text-accent shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Ready to analyze a deal?</p>
          <p className="text-xs text-muted-foreground">Upload a PPM or paste offering text for an AI red-flag scan.</p>
        </div>
        <Link to="/investor-protection" className="text-xs font-semibold text-primary dark:text-accent hover:underline whitespace-nowrap">
          Go to Investor Protection →
        </Link>
      </div>

      <DisclaimerFooter />
    </div>
  );
}