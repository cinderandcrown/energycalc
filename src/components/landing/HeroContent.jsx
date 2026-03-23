import { motion } from "framer-motion";
import { Zap, Lock, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const TAGLINES = [
  "Every deal has a number. Know yours before you sign.",
  "The money's in the ground. The risk is in the paperwork.",
  "They'll tell you it's a sure thing. It never is.",
  "Run your numbers. Vet the operator. Then decide.",
  "In commodities, due diligence isn't optional — it's survival.",
];

const STATS = [
  { value: "$10B+", label: "Lost to commodity fraud annually" },
  { value: "65–80%", label: "Year-1 IDC tax write-off" },
  { value: "9", label: "Commodity sectors covered" },
  { value: "8", label: "Professional calculators" },
];

export default function HeroContent({ scrollToPricing, handleSignIn }) {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Cold open badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <Badge className="bg-flare-red/15 text-flare-red border-flare-red/25 mb-6 text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.15em] backdrop-blur-sm">
          <Crosshair className="w-3 h-3 mr-1.5" />
          Investor Protection Platform
        </Badge>
      </motion.div>

      {/* The headline — Sheridan-style blunt, dramatic */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white leading-[1.05] mb-5 tracking-tight"
      >
        Everybody Lies
        <br />
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]">About </span>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="bg-gradient-to-r from-crude-gold via-yellow-400 to-crude-gold bg-clip-text text-transparent">
            the Numbers.
          </span>
        </motion.span>
      </motion.h1>

      {/* Rotating taglines — cinematic voiceover feel */}
      <div className="h-14 sm:h-12 flex items-center justify-center mb-8">
        <motion.p
          key={taglineIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white/55 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic font-light"
        >
          "{TAGLINES[taglineIndex]}"
        </motion.p>
      </div>

      {/* Hard-sell subline — no BS, direct */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center text-white/40 text-sm max-w-xl mx-auto leading-relaxed mb-10"
      >
        AI-powered deal analysis, operator vetting, PPM red-flag scanning, and 8 commodity calculators — covering oil, gas, metals, agriculture, and more.
        Built for the people writing the checks.
      </motion.p>

      {/* CTAs — bold, high contrast */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Button
          size="lg"
          className="bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 px-8 h-13 text-base shadow-lg shadow-crude-gold/20 hover:shadow-crude-gold/30 transition-all"
          onClick={scrollToPricing}
        >
          <Zap className="w-5 h-5" />
          Start Free Trial
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/15 text-white/80 hover:bg-white/10 gap-2 h-13 text-base backdrop-blur-sm"
          onClick={handleSignIn}
        >
          <Lock className="w-4 h-4" />
          Sign In
        </Button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 + i * 0.08, duration: 0.4 }}
            className="text-center rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-md px-3 py-4 hover:bg-white/[0.06] hover:border-crude-gold/15 transition-all duration-300"
          >
            <p className="font-mono font-bold text-xl text-crude-gold">{s.value}</p>
            <p className="text-[11px] text-white/40 mt-1.5 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Cinematic bottom line — the closer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center text-white/20 text-[11px] mt-10 tracking-wide uppercase"
      >
        Oil · Gas · Gold · Silver · Copper · Agriculture · Livestock · Rare Earth · Battery Metals — All Sectors. One Platform.
      </motion.p>
    </div>
  );
}