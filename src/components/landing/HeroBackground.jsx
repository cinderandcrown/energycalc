import { motion } from "framer-motion";

/**
 * Taylor Sheridan "Landman" inspired hero —
 * West Texas night sky, pump jacks on the horizon,
 * heat shimmer, gas flares, dust, and grit.
 */

// Distant pump jack silhouettes rocking
const PUMP_JACKS = [
  { left: "6%", bottom: "20%", size: 50, delay: 0, duration: 3 },
  { left: "18%", bottom: "21%", size: 35, delay: 0.8, duration: 2.8 },
  { left: "72%", bottom: "19%", size: 55, delay: 0.3, duration: 3.2 },
  { left: "88%", bottom: "20.5%", size: 30, delay: 1.5, duration: 2.5 },
];

// Dust particles drifting across the scene
const DUST = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  y: 30 + Math.random() * 50,
  size: 1 + Math.random() * 2.5,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.25,
}));

// Distant flare stacks
const FLARES = [
  { left: "35%", bottom: "23%", size: 4, glowSize: 40, delay: 0 },
  { left: "62%", bottom: "24%", size: 3, glowSize: 30, delay: 1.2 },
  { left: "48%", bottom: "22%", size: 2.5, glowSize: 25, delay: 2.5 },
];

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* West Texas twilight sky */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020408 0%, #0a1628 15%, #142744 35%, #1a3a5c 48%, #3d2814 58%, #1a0f08 65%, #0a0806 75%, hsl(var(--background)) 100%)",
      }} />

      {/* Stars — faint, West Texas sky at dusk */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${3 + Math.random() * 30}%`,
            width: 1 + Math.random() * 1.5,
            height: 1 + Math.random() * 1.5,
            opacity: 0.1 + Math.random() * 0.3,
          }}
          animate={{ opacity: [0.1 + Math.random() * 0.2, 0.3 + Math.random() * 0.4, 0.1 + Math.random() * 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 3 }}
        />
      ))}

      {/* Sunset / horizon burn — that Permian Basin golden hour glow */}
      <div className="absolute inset-x-0 bottom-[30%] h-[25%]" style={{
        background: "radial-gradient(ellipse 120% 70% at 50% 100%, rgba(180,90,20,0.25) 0%, rgba(140,60,10,0.12) 30%, rgba(80,30,5,0.06) 60%, transparent 85%)",
      }} />
      <motion.div
        className="absolute inset-x-0 bottom-[32%] h-[18%]"
        style={{
          background: "radial-gradient(ellipse 90% 50% at 55% 100%, rgba(220,120,20,0.18) 0%, rgba(200,80,10,0.06) 50%, transparent 80%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ═══ GAS FLARES — distant wellhead flares ═══ */}
      {FLARES.map((f, i) => (
        <div key={`flare-${i}`} className="absolute" style={{ left: f.left, bottom: f.bottom }}>
          {/* Flare glow */}
          <motion.div
            className="absolute"
            style={{
              width: f.glowSize,
              height: f.glowSize,
              left: -f.glowSize / 2,
              top: -f.glowSize / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,160,30,0.35) 0%, rgba(255,100,10,0.12) 40%, transparent 70%)`,
              filter: "blur(8px)",
            }}
            animate={{
              scale: [1, 1.4, 0.8, 1.2, 1],
              opacity: [0.4, 0.8, 0.3, 0.7, 0.4],
            }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          />
          {/* Flare point */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: f.size,
              height: f.size * 1.5,
              left: -f.size / 2,
              top: -f.size,
              background: "linear-gradient(180deg, rgba(255,200,80,0.9) 0%, rgba(255,120,20,0.7) 60%, transparent 100%)",
            }}
            animate={{ height: [f.size * 1.5, f.size * 2.5, f.size * 1.2, f.size * 2, f.size * 1.5], opacity: [0.7, 1, 0.5, 0.9, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          />
        </div>
      ))}

      {/* ═══ PUMP JACK SILHOUETTES — rocking motion ═══ */}
      {PUMP_JACKS.map((pj, i) => (
        <div
          key={`pj-${i}`}
          className="absolute pointer-events-none"
          style={{ left: pj.left, bottom: pj.bottom, width: pj.size }}
        >
          <motion.svg
            viewBox="0 0 100 60"
            fill="none"
            className="w-full opacity-[0.14]"
          >
            {/* Base */}
            <rect x="30" y="52" width="40" height="8" fill="#0a0a0a" rx="1" />
            {/* Support frame */}
            <path d="M45,52 L45,25 L55,25 L55,52" fill="#080808" />
            {/* Counterweight */}
            <rect x="60" y="28" width="18" height="12" fill="#0a0a0a" rx="2" />
            {/* Walking beam — animated rotation */}
            <motion.g
              style={{ transformOrigin: "50px 25px" }}
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: pj.duration, repeat: Infinity, ease: "easeInOut", delay: pj.delay }}
            >
              <rect x="20" y="23" width="60" height="4" fill="#090909" rx="1" />
              {/* Horse head */}
              <path d="M20,23 L15,23 L15,35 L22,35 L22,27" fill="#080808" />
            </motion.g>
            {/* Polished rod — goes up and down */}
            <motion.line
              x1="18" y1="35" x2="18" y2="52"
              stroke="#0a0a0a"
              strokeWidth="2"
              animate={{ y1: [35, 30, 35] }}
              transition={{ duration: pj.duration, repeat: Infinity, ease: "easeInOut", delay: pj.delay }}
            />
          </motion.svg>
        </div>
      ))}

      {/* ═══ DERRICK — main tall one, right side ═══ */}
      <div className="absolute bottom-[18%] right-[15%] sm:right-[20%] w-20 sm:w-28 md:w-36 opacity-[0.1] pointer-events-none">
        <svg viewBox="0 0 120 300" fill="none">
          <path d="M60,0 L35,280 L85,280 Z" fill="#0a0a0a" stroke="rgba(212,168,67,0.1)" strokeWidth="0.5" />
          <line x1="48" y1="60" x2="72" y2="60" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="45" y1="120" x2="75" y2="120" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="42" y1="180" x2="78" y2="180" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="39" y1="240" x2="81" y2="240" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          {/* Cross bracing */}
          <line x1="48" y1="60" x2="75" y2="120" stroke="rgba(25,25,25,0.6)" strokeWidth="0.5" />
          <line x1="72" y1="60" x2="45" y2="120" stroke="rgba(25,25,25,0.6)" strokeWidth="0.5" />
          <rect x="52" y="0" width="16" height="8" fill="#080808" />
          <rect x="25" y="278" width="70" height="6" fill="#0a0a0a" rx="1" />
        </svg>
      </div>

      {/* ═══ DUST PARTICLES — blown across the scene ═══ */}
      {DUST.map((d) => (
        <motion.div
          key={`dust-${d.id}`}
          className="absolute rounded-full"
          style={{
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: `rgba(180,150,100,${d.opacity})`,
            filter: "blur(0.5px)",
          }}
          initial={{ left: "-5%" }}
          animate={{ left: "105%" }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: "linear",
            delay: d.delay,
          }}
        />
      ))}

      {/* Heat shimmer effect on the horizon */}
      <motion.div
        className="absolute inset-x-0 bottom-[18%] h-[12%]"
        style={{
          background: "linear-gradient(0deg, transparent, rgba(180,120,40,0.03) 50%, transparent)",
          filter: "blur(3px)",
        }}
        animate={{
          scaleX: [1, 1.01, 0.99, 1.01, 1],
          scaleY: [1, 1.02, 0.98, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Flat earth / mesa line */}
      <div className="absolute inset-x-0 bottom-[17%] h-[1px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(60,30,10,0.3) 20%, rgba(80,40,15,0.2) 50%, rgba(60,30,10,0.3) 80%, transparent 95%)",
      }} />

      {/* Ground — dark Texas dirt */}
      <div className="absolute inset-x-0 bottom-0 h-[18%]" style={{
        background: "linear-gradient(0deg, hsl(var(--background)) 35%, rgba(20,12,5,0.5) 70%, rgba(25,15,8,0.2) 100%)",
      }} />

      {/* Subtle ground texture shimmer */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[10%]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.02) 30%, rgba(140,80,20,0.04) 50%, rgba(212,168,67,0.02) 70%, transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#020408] via-[#020408]/50 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}