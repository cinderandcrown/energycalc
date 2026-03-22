import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const startValue = 0;
    const endValue = target;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startValue + (endValue - startValue) * eased);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

export function ResultCard({ label, value, prefix = "$", suffix = "", highlight = false, positive = null, className = "" }) {
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const displayVal = typeof value === "number"
    ? animated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl border p-4 ${highlight
        ? "bg-gradient-to-br from-petroleum to-[#1a3a6b] dark:from-accent/20 dark:to-accent/10 border-crude-gold/40"
        : "bg-card border-border"
      } ${className}`}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-mono font-bold leading-none ${
        highlight ? "text-2xl text-crude-gold" :
        positive === true ? "text-xl text-drill-green" :
        positive === false ? "text-xl text-flare-red" :
        "text-xl text-foreground"
      }`}>
        {prefix}{displayVal}{suffix}
      </p>
    </motion.div>
  );
}

export function HeroResultCard({ label, value, prefix = "$", suffix = "", sublabel = "" }) {
  const animated = useCountUp(typeof value === "number" ? value : 0, 1200);
  const displayVal = typeof value === "number"
    ? animated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border-2 border-crude-gold/60 bg-gradient-to-br from-petroleum via-[#0d2d5a] to-[#0B2545] dark:from-card dark:via-card dark:to-card/80 p-6 text-center"
    >
      <p className="text-xs font-semibold text-crude-gold uppercase tracking-widest mb-2">{label}</p>
      <p className="font-mono font-bold text-3xl md:text-4xl text-crude-gold leading-none">
        {prefix}{displayVal}{suffix}
      </p>
      {sublabel && <p className="text-xs text-white/60 dark:text-muted-foreground mt-2">{sublabel}</p>}
    </motion.div>
  );
}