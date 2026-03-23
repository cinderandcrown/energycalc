import { motion } from "framer-motion";

/**
 * Animated hero background with gradient mesh, floating particles,
 * and pulsing radial glows for depth and energy.
 */

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 3,
  drift: 10 + Math.random() * 30,
}));

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-petroleum via-[#081e3e] to-background" />

      {/* Animated gradient orbs — create a living mesh effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 700,
          maxHeight: 700,
          top: "-15%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: 600,
          maxHeight: 600,
          bottom: "-10%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.92, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: "35vw",
          height: "35vw",
          maxWidth: 450,
          maxHeight: 450,
          top: "30%",
          left: "30%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating golden particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-crude-gold/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [-p.drift, p.drift, -p.drift],
            x: [0, p.drift * 0.3, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Subtle scanline/grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(0deg, transparent 95%, rgba(212,168,67,0.4) 95%), linear-gradient(90deg, transparent 95%, rgba(212,168,67,0.4) 95%)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ═══ Oil & Gas Imagery ═══ */}
      {/* Oil derrick — right side */}
      <svg
        className="absolute right-[5%] bottom-[8%] w-32 sm:w-44 md:w-56 opacity-[0.06] pointer-events-none"
        viewBox="0 0 200 400"
        fill="none"
        stroke="rgba(212,168,67,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {/* Derrick tower */}
        <line x1="100" y1="20" x2="60" y2="380" />
        <line x1="100" y1="20" x2="140" y2="380" />
        {/* Cross braces */}
        <line x1="72" y1="100" x2="128" y2="100" />
        <line x1="76" y1="160" x2="124" y2="160" />
        <line x1="80" y1="220" x2="120" y2="220" />
        <line x1="84" y1="280" x2="116" y2="280" />
        <line x1="88" y1="340" x2="112" y2="340" />
        {/* X braces */}
        <line x1="72" y1="100" x2="124" y2="160" />
        <line x1="128" y1="100" x2="76" y2="160" />
        <line x1="76" y1="160" x2="120" y2="220" />
        <line x1="124" y1="160" x2="80" y2="220" />
        <line x1="80" y1="220" x2="116" y2="280" />
        <line x1="120" y1="220" x2="84" y2="280" />
        {/* Horsehead pump */}
        <line x1="100" y1="20" x2="150" y2="40" />
        <line x1="150" y1="40" x2="160" y2="60" />
        <ellipse cx="160" cy="60" rx="8" ry="5" />
        {/* Base platform */}
        <line x1="45" y1="380" x2="155" y2="380" />
        <line x1="50" y1="390" x2="150" y2="390" />
      </svg>

      {/* Pumpjack — left side, animated */}
      <motion.svg
        className="absolute left-[3%] sm:left-[6%] bottom-[10%] w-36 sm:w-48 md:w-60 opacity-[0.05] pointer-events-none"
        viewBox="0 0 300 200"
        fill="none"
        stroke="rgba(212,168,67,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Base & support */}
        <line x1="20" y1="180" x2="280" y2="180" />
        <line x1="120" y1="180" x2="120" y2="100" />
        <line x1="110" y1="100" x2="130" y2="100" />
        {/* Walking beam — animated pivot */}
        <motion.g
          style={{ originX: "120px", originY: "100px", transformBox: "fill-box" }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <line x1="40" y1="95" x2="200" y2="95" strokeWidth="2.5" />
          {/* Horsehead */}
          <path d="M40,95 Q30,90 28,100 Q26,110 35,112" strokeWidth="2" />
          {/* Counterweight */}
          <rect x="180" y="88" width="25" height="14" rx="2" strokeWidth="1.5" />
        </motion.g>
        {/* Samson post */}
        <line x1="115" y1="100" x2="105" y2="180" />
        <line x1="125" y1="100" x2="135" y2="180" />
        {/* Pitman arm hinge */}
        <circle cx="120" cy="100" r="4" strokeWidth="1.5" />
        {/* Sucker rod (polished rod going down) */}
        <motion.line
          x1="35" y1="112" x2="35" y2="180"
          strokeWidth="1"
          strokeDasharray="4 3"
          animate={{ y1: [112, 118, 112] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Pipeline / flow lines — bottom decorative */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 sm:h-32 opacity-[0.04] pointer-events-none"
        viewBox="0 0 1200 120"
        fill="none"
        stroke="rgba(212,168,67,0.5)"
        strokeWidth="1.5"
        preserveAspectRatio="none"
      >
        {/* Main pipeline */}
        <path d="M-20,80 Q200,80 300,60 Q400,40 500,50 Q600,60 700,45 Q800,30 900,50 Q1000,70 1100,55 Q1200,40 1250,50" />
        {/* Secondary line */}
        <path d="M-20,100 Q150,100 250,90 Q350,80 500,85 Q650,90 800,75 Q950,60 1100,80 Q1200,90 1250,85" strokeDasharray="8 4" />
        {/* Valve nodes */}
        <circle cx="300" cy="60" r="5" />
        <circle cx="700" cy="45" r="5" />
        <circle cx="1100" cy="55" r="5" />
        {/* Flow arrows */}
        <path d="M480,50 L495,45 L495,55 Z" fill="rgba(212,168,67,0.3)" stroke="none" />
        <path d="M880,50 L895,45 L895,55 Z" fill="rgba(212,168,67,0.3)" stroke="none" />
      </svg>

      {/* Faint barrel/gauge cluster — top-left corner */}
      <svg
        className="absolute top-[12%] left-[8%] w-16 sm:w-20 opacity-[0.05] pointer-events-none"
        viewBox="0 0 80 100"
        fill="none"
        stroke="rgba(212,168,67,0.5)"
        strokeWidth="1.2"
      >
        {/* Barrel */}
        <ellipse cx="40" cy="15" rx="28" ry="10" />
        <ellipse cx="40" cy="85" rx="28" ry="10" />
        <line x1="12" y1="15" x2="12" y2="85" />
        <line x1="68" y1="15" x2="68" y2="85" />
        {/* Hoops */}
        <ellipse cx="40" cy="35" rx="28" ry="6" strokeDasharray="4 3" />
        <ellipse cx="40" cy="65" rx="28" ry="6" strokeDasharray="4 3" />
      </svg>

      {/* Pressure gauge — top-right area */}
      <motion.svg
        className="absolute top-[15%] right-[10%] w-14 sm:w-18 opacity-[0.05] pointer-events-none"
        viewBox="0 0 80 80"
        fill="none"
        stroke="rgba(212,168,67,0.5)"
        strokeWidth="1.2"
      >
        <circle cx="40" cy="40" r="35" />
        <circle cx="40" cy="40" r="30" strokeDasharray="3 3" />
        {/* Tick marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 40 + Math.cos(rad) * 26;
          const y1 = 40 + Math.sin(rad) * 26;
          const x2 = 40 + Math.cos(rad) * 30;
          const y2 = 40 + Math.sin(rad) * 30;
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />;
        })}
        {/* Animated needle */}
        <motion.line
          x1="40"
          y1="40"
          x2="40"
          y2="14"
          strokeWidth="1.5"
          stroke="rgba(212,168,67,0.6)"
          style={{ originX: "40px", originY: "40px", transformBox: "fill-box" }}
          animate={{ rotate: [-40, 50, -40] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="40" cy="40" r="3" fill="rgba(212,168,67,0.3)" />
      </motion.svg>

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-petroleum/50 to-transparent" />
      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}