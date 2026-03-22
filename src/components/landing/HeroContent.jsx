import { motion } from "framer-motion";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { value: "$10B+", label: "Annual energy investment fraud (FBI)" },
  { value: "65–80%", label: "Year-1 tax deduction (typical WI)" },
  { value: "25–40%", label: "Avg IRR on producing assets" },
  { value: "6+", label: "Commodity sectors covered" },
];

export default function HeroContent({ scrollToPricing, handleSignIn }) {
  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <Badge className="bg-crude-gold/15 text-crude-gold border-crude-gold/25 mb-7 text-xs font-semibold px-5 py-1.5 backdrop-blur-sm">
          Built for Commodity Energy Investors
        </Badge>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight"
      >
        Know Your Numbers.
        <br className="hidden sm:block" />{" "}
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="bg-gradient-to-r from-crude-gold via-yellow-400 to-crude-gold bg-clip-text text-transparent">
            Protect Your Capital.
          </span>
        </motion.span>
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
      >
        The most powerful investor protection and deal analysis platform for oil & gas.
        Vet operators, analyze PPMs, model tax-adjusted returns — built by investors, for investors.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Button
          size="lg"
          className="bg-crude-gold text-petroleum font-bold hover:bg-crude-gold/90 gap-2 px-8 h-13 text-base shadow-lg shadow-crude-gold/20 hover:shadow-crude-gold/30 transition-shadow"
          onClick={scrollToPricing}
        >
          <Zap className="w-5 h-5" />
          View Plans & Pricing
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 gap-2 h-13 text-base backdrop-blur-sm"
          onClick={handleSignIn}
        >
          <Lock className="w-4 h-4" />
          Sign In
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 + i * 0.08, duration: 0.4 }}
            className="text-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3 py-4 hover:bg-white/[0.07] hover:border-crude-gold/20 transition-all duration-300"
          >
            <p className="font-mono font-bold text-xl text-crude-gold">{s.value}</p>
            <p className="text-[11px] text-white/45 mt-1.5 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}