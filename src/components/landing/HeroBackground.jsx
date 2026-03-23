import { motion } from "framer-motion";

/**
 * Cinematic "There Will Be Blood" style hero —
 * dark crude textures, silhouetted derricks against fire-lit sky,
 * animated oil gusher, dripping crude, and smoke haze.
 */

// Oil drip columns — thick crude dripping down from top
const DRIPS = [
  { left: "8%", delay: 0, height: "35%", width: 6, duration: 4 },
  { left: "15%", delay: 1.2, height: "22%", width: 4, duration: 3.5 },
  { left: "23%", delay: 2.5, height: "40%", width: 8, duration: 5 },
  { left: "42%", delay: 0.8, height: "18%", width: 3, duration: 3 },
  { left: "58%", delay: 3.2, height: "30%", width: 5, duration: 4.5 },
  { left: "71%", delay: 1.8, height: "25%", width: 7, duration: 3.8 },
  { left: "85%", delay: 0.5, height: "33%", width: 4, duration: 4.2 },
  { left: "93%", delay: 2.1, height: "20%", width: 6, duration: 3.2 },
];

// Embers / sparks floating up from the glow
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  size: 1.5 + Math.random() * 3,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 4,
  drift: 5 + Math.random() * 15,
}));

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep crude black base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #030508 0%, #0a0d12 20%, #0B2545 55%, #0d1a2e 80%, hsl(var(--background)) 100%)",
      }} />

      {/* Fiery horizon glow — like burning gas flares on the horizon */}
      <div className="absolute inset-x-0 bottom-[25%] h-[35%]" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(180,80,10,0.15) 0%, rgba(212,168,67,0.06) 40%, transparent 70%)",
      }} />
      <motion.div
        className="absolute inset-x-0 bottom-[28%] h-[25%]"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(200,100,20,0.12) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gas flare glow — right side */}
      <motion.div
        className="absolute"
        style={{
          right: "15%",
          bottom: "35%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,140,20,0.2) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.3, 0.9, 1.15, 1],
          opacity: [0.5, 0.8, 0.4, 0.7, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary flare — left */}
      <motion.div
        className="absolute"
        style={{
          left: "20%",
          bottom: "32%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,100,10,0.15) 0%, transparent 70%)",
          filter: "blur(25px)",
        }}
        animate={{
          scale: [1, 1.2, 0.85, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* ═══ DERRICK SILHOUETTES ═══ */}
      {/* Main derrick — center-right, tall and imposing */}
      <div className="absolute bottom-[18%] right-[12%] sm:right-[18%] w-24 sm:w-32 md:w-40 opacity-[0.12] pointer-events-none">
        <svg viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60,0 L35,280 L85,280 Z" fill="#0a0a0a" stroke="rgba(212,168,67,0.15)" strokeWidth="0.5" />
          {/* Internal lattice */}
          <line x1="48" y1="60" x2="72" y2="60" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="45" y1="120" x2="75" y2="120" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="42" y1="180" x2="78" y2="180" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          <line x1="39" y1="240" x2="81" y2="240" stroke="rgba(30,30,30,0.8)" strokeWidth="1" />
          {/* Crown block */}
          <rect x="52" y="0" width="16" height="8" fill="#080808" />
          {/* Base */}
          <rect x="25" y="278" width="70" height="6" fill="#0a0a0a" rx="1" />
        </svg>
      </div>

      {/* Smaller distant derrick — far left */}
      <div className="absolute bottom-[20%] left-[8%] sm:left-[12%] w-12 sm:w-16 md:w-20 opacity-[0.08] pointer-events-none">
        <svg viewBox="0 0 120 300" fill="none">
          <path d="M60,0 L35,280 L85,280 Z" fill="#070707" />
          <rect x="52" y="0" width="16" height="8" fill="#060606" />
          <rect x="25" y="278" width="70" height="6" fill="#070707" rx="1" />
        </svg>
      </div>

      {/* Third derrick — mid-left distance */}
      <div className="hidden sm:block absolute bottom-[22%] left-[30%] w-10 md:w-14 opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 120 300" fill="none">
          <path d="M60,0 L35,280 L85,280 Z" fill="#080808" />
          <rect x="25" y="278" width="70" height="6" fill="#080808" rx="1" />
        </svg>
      </div>

      {/* ═══ OIL GUSHER — erupting from center-right derrick ═══ */}
      <div className="absolute bottom-[38%] sm:bottom-[42%] right-[16%] sm:right-[22%] pointer-events-none" style={{ width: 60 }}>
        {/* Main gusher column */}
        <motion.div
          style={{
            width: 8,
            marginLeft: 26,
            borderRadius: "4px 4px 0 0",
            background: "linear-gradient(180deg, rgba(20,15,10,0.9) 0%, rgba(40,30,15,0.7) 50%, rgba(20,15,10,0.3) 100%)",
          }}
          animate={{
            height: [60, 90, 70, 85, 60],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Spray splatter — left */}
        <motion.div
          className="absolute"
          style={{
            top: 0,
            left: 5,
            width: 20,
            height: 30,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(15,12,8,0.6) 0%, transparent 70%)",
          }}
          animate={{
            y: [-5, -15, -5],
            x: [-3, -8, -3],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Spray splatter — right */}
        <motion.div
          className="absolute"
          style={{
            top: 0,
            right: 5,
            width: 18,
            height: 25,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(15,12,8,0.5) 0%, transparent 70%)",
          }}
          animate={{
            y: [-3, -12, -3],
            x: [3, 10, 3],
            scale: [0.9, 1.3, 0.9],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>

      {/* ═══ CRUDE OIL DRIPS — from top, thick and viscous ═══ */}
      {DRIPS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute top-0 rounded-b-full"
          style={{
            left: d.left,
            width: d.width,
            background: "linear-gradient(180deg, rgba(8,5,2,0.9) 0%, rgba(20,15,8,0.7) 60%, rgba(30,22,10,0.3) 85%, transparent 100%)",
          }}
          initial={{ height: "0%" }}
          animate={{
            height: ["0%", d.height, d.height, "0%"],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.delay,
            times: [0, 0.4, 0.7, 1],
          }}
        />
      ))}

      {/* ═══ RISING EMBERS / SPARKS ═══ */}
      {EMBERS.map((e) => (
        <motion.div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            bottom: "25%",
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, rgba(255,${120 + Math.random() * 80},20,0.8) 0%, rgba(212,168,67,0.4) 60%, transparent 100%)`,
          }}
          animate={{
            y: [0, -(80 + e.drift * 3), -(160 + e.drift * 5)],
            x: [0, e.drift, -e.drift * 0.5],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: e.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: e.delay,
          }}
        />
      ))}

      {/* ═══ SMOKE / HAZE LAYERS ═══ */}
      <motion.div
        className="absolute inset-x-0 bottom-[20%] h-[30%]"
        style={{
          background: "linear-gradient(0deg, transparent 0%, rgba(20,18,14,0.15) 30%, rgba(30,25,18,0.08) 60%, transparent 100%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 30, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-[30%] h-[20%]"
        style={{
          background: "linear-gradient(0deg, transparent 0%, rgba(15,12,8,0.1) 50%, transparent 100%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -40, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dark ground plane — flat earth silhouette */}
      <div className="absolute inset-x-0 bottom-[16%] h-[4%]" style={{
        background: "linear-gradient(0deg, transparent 0%, rgba(5,3,1,0.2) 40%, rgba(5,3,1,0.15) 100%)",
      }} />

      {/* Crude oil pooling at bottom — viscous sheen */}
      <div className="absolute inset-x-0 bottom-0 h-[18%]" style={{
        background: "linear-gradient(0deg, hsl(var(--background)) 30%, rgba(15,12,8,0.4) 70%, rgba(20,15,8,0.15) 100%)",
      }} />
      {/* Oil sheen shimmer on the pool */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[12%]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.04) 20%, rgba(100,60,20,0.06) 40%, rgba(212,168,67,0.03) 60%, transparent 80%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Top vignette — heavy darkness */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#030508] via-[#030508]/60 to-transparent" />
      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}