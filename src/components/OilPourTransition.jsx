import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// SVG path for an irregular oil splash shape
const SPLASH_PATH = "M50,0 C65,5 80,2 90,15 C100,28 98,45 95,55 C92,65 85,78 75,88 C65,98 50,100 40,95 C30,90 15,80 8,65 C1,50 0,35 5,22 C10,9 35,-5 50,0 Z";

// Generate random splatter blobs
function generateSplatters(count) {
  const splatters = [];
  for (let i = 0; i < count; i++) {
    splatters.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 120,
      delay: Math.random() * 0.15,
      rotation: Math.random() * 360,
    });
  }
  return splatters;
}

// Generate drip paths along the bottom
function generateDrips(count) {
  const drips = [];
  for (let i = 0; i < count; i++) {
    drips.push({
      id: i,
      x: (i / count) * 100 + Math.random() * (100 / count),
      width: 8 + Math.random() * 24,
      height: 40 + Math.random() * 60,
      delay: 0.3 + Math.random() * 0.25,
    });
  }
  return drips;
}

export default function OilPourTransition({ children }) {
  const location = useLocation();
  const [splatters] = useState(() => generateSplatters(12));
  const [drips] = useState(() => generateDrips(8));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* === OIL SPLASH OVERLAY === */}
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          {/* Base oil flood — fills from top then drains down */}
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              background: "linear-gradient(180deg, #0a0500 0%, #1a0f00 40%, #2a1800 70%, rgba(26,15,0,0.6) 100%)",
            }}
            initial={{ height: "110vh", y: "-10vh" }}
            animate={{ height: "0vh", y: "110vh" }}
            transition={{
              height: { duration: 0.5, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
              y: { duration: 0.5, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
            }}
          />

          {/* Oil splash blobs — appear then shrink away */}
          {splatters.map((s) => (
            <motion.div
              key={s.id}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
              }}
              initial={{ scale: 1.2, opacity: 0.9 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.25 + s.delay,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d={SPLASH_PATH}
                  fill="#1a0f00"
                  style={{ filter: "blur(1px)" }}
                />
                <path
                  d={SPLASH_PATH}
                  fill="none"
                  stroke="rgba(212,168,67,0.25)"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>
          ))}

          {/* Viscous drips hanging from top */}
          {drips.map((d) => (
            <motion.div
              key={d.id}
              className="absolute top-0 rounded-b-full"
              style={{
                left: `${d.x}%`,
                width: d.width,
                background: "linear-gradient(180deg, #1a0f00 0%, #2a1800 60%, rgba(212,168,67,0.15) 100%)",
                transformOrigin: "top center",
              }}
              initial={{ height: `${d.height}vh`, scaleY: 1, opacity: 1 }}
              animate={{ height: `${d.height}vh`, scaleY: 0, opacity: 0 }}
              transition={{
                scaleY: { duration: 0.45, delay: d.delay, ease: [0.76, 0, 0.24, 1] },
                opacity: { duration: 0.2, delay: d.delay + 0.35 },
              }}
            />
          ))}

          {/* Golden sheen wipe — sweeps across like light on oil */}
          <motion.div
            className="absolute inset-y-0"
            style={{
              width: "30%",
              background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.2) 30%, rgba(212,168,67,0.35) 50%, rgba(212,168,67,0.2) 70%, transparent 100%)",
              filter: "blur(20px)",
            }}
            initial={{ left: "-30%" }}
            animate={{ left: "130%" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Fine golden edge line */}
          <motion.div
            className="absolute inset-x-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent 10%, rgba(212,168,67,0.6) 40%, rgba(212,168,67,0.8) 50%, rgba(212,168,67,0.6) 60%, transparent 90%)",
            }}
            initial={{ top: "100vh", opacity: 1 }}
            animate={{ top: "-2%", opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>

        {/* Page content fades in after splash clears */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}