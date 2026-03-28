import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Droplets, Gem, Wheat, Factory, Beef, BarChart3, Bell } from "lucide-react";
import useOnboarding from "@/hooks/useOnboarding";

const COMMODITY_INTERESTS = [
  { id: "oil_gas", label: "Oil & Gas", icon: Droplets },
  { id: "precious_metals", label: "Precious Metals", icon: Gem },
  { id: "agriculture", label: "Agriculture", icon: Wheat },
  { id: "industrial_metals", label: "Industrial Metals", icon: Factory },
  { id: "livestock", label: "Livestock", icon: Beef },
  { id: "market_analysis", label: "Market Analysis", icon: BarChart3 },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "New to commodity investing" },
  { id: "intermediate", label: "Intermediate", desc: "Some experience with deals" },
  { id: "advanced", label: "Advanced", desc: "Active commodity investor" },
];

const STEPS = [
  { title: "Welcome", subtitle: "Let's personalize your experience" },
  { title: "Your Interests", subtitle: "What commodities are you interested in?" },
  { title: "Experience Level", subtitle: "This helps us tailor recommendations" },
  { title: "You're All Set!", subtitle: "Start exploring your toolkit" },
];

export default function OnboardingModal() {
  const { showOnboarding, currentStep, nextStep, prevStep, completeOnboarding, skipOnboarding } = useOnboarding();
  const [interests, setInterests] = useState([]);
  const [experience, setExperience] = useState("");

  if (!showOnboarding) return null;

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const step = STEPS[currentStep] || STEPS[STEPS.length - 1];
  const isLastStep = currentStep >= STEPS.length - 1;

  return (
    <Dialog open={showOnboarding} onOpenChange={(open) => { if (!open) skipOnboarding(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-crude-gold transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Step {currentStep + 1} of {STEPS.length}</p>
            <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
            <p className="text-sm text-muted-foreground">{step.subtitle}</p>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-crude-gold/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-crude-gold" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Welcome to Commodity Investor+! Let's take 30 seconds to customize your experience so you get the most out of the platform.
                  </p>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {COMMODITY_INTERESTS.map((item) => {
                    const Icon = item.icon;
                    const selected = interests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors text-left ${
                          selected
                            ? "border-crude-gold bg-crude-gold/10 text-foreground"
                            : "border-border bg-card hover:border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${selected ? "text-crude-gold" : ""}`} aria-hidden="true" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setExperience(level.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                        experience === level.id
                          ? "border-crude-gold bg-crude-gold/10"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.desc}</p>
                      </div>
                      {experience === level.id && <CheckCircle2 className="w-5 h-5 text-crude-gold shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              {currentStep >= 3 && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-drill-green/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-drill-green" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Your account is ready. Here's what to try first:</p>
                    <ul className="text-xs text-muted-foreground space-y-1.5 text-left max-w-xs mx-auto">
                      <li className="flex items-start gap-2">
                        <span className="text-crude-gold mt-0.5">1.</span>
                        <span>Run your first calculator analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-crude-gold mt-0.5">2.</span>
                        <span>Set up a price alert for a commodity you follow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-crude-gold mt-0.5">3.</span>
                        <span>Try the AI PPM Analyzer on a deal document</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {currentStep > 0 ? (
              <Button variant="ghost" size="sm" onClick={prevStep} className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={skipOnboarding} className="text-xs text-muted-foreground">
                Skip
              </Button>
            )}

            {isLastStep ? (
              <Button onClick={completeOnboarding} className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-1.5">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
