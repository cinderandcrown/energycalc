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

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-petroleum/50 to-transparent" />
      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}