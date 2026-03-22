import { useState } from "react";
import { motion } from "framer-motion";

// Organic blob paths for irregular oil splatter shapes
const BLOB_PATHS = [
  "M44,4 C58,1 78,8 88,22 C98,36 96,56 88,72 C80,88 62,98 46,96 C30,94 14,82 6,66 C-2,50 2,28 12,16 C22,4 30,7 44,4 Z",
  "M52,2 C70,6 86,18 92,36 C98,54 90,74 76,86 C62,98 42,100 26,92 C10,84 2,66 4,48 C6,30 18,12 34,4 C44,0 46,1 52,2 Z",
  "M48,0 C66,4 82,14 90,30 C98,46 94,66 82,80 C70,94 52,100 36,96 C20,92 8,78 2,60 C-4,42 4,22 16,10 C28,-2 36,-2 48,0 Z",
];

// Big splash blobs that cover the screen
function generateSplashBlobs() {
  const blobs = [];
  // Center cluster — big overlapping blobs
  const positions = [
    { x: 50, y: 45, size: 500, delay: 0 },
    { x: 25, y: 30, size: 380, delay: 0.02 },
    { x: 75, y: 35, size: 400, delay: 0.03 },
    { x: 40, y: 70, size: 350, delay: 0.04 },
    { x: 65, y: 65, size: 370, delay: 0.05 },
    { x: 15, y: 60, size: 300, delay: 0.06 },
    { x: 85, y: 55, size: 320, delay: 0.04 },
    { x: 50, y: 15, size: 340, delay: 0.02 },
    { x: 30, y: 90, size: 280, delay: 0.07 },
    { x: 70, y: 85, size: 290, delay: 0.06 },
    // Edge fill
    { x: 5, y: 20, size: 260, delay: 0.05 },
    { x: 95, y: 20, size: 260, delay: 0.05 },
    { x: 5, y: 80, size: 240, delay: 0.08 },
    { x: 95, y: 80, size: 240, delay: 0.08 },
  ];

  positions.forEach((p, i) => {
    blobs.push({
      id: i,
      ...p,
      rotation: Math.random() * 360,
      pathIndex: i % BLOB_PATHS.length,
    });
  });
  return blobs;
}

// Small satellite droplets that fly outward
function generateDroplets() {
  const droplets = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const dist = 30 + Math.random() * 25;
    droplets.push({
      id: i,
      startX: 50,
      startY: 50,
      endX: 50 + Math.cos(angle) * dist,
      endY: 50 + Math.sin(angle) * dist,
      size: 12 + Math.random() * 30,
      delay: 0.05 + Math.random() * 0.1,
    });
  }
  return droplets;
}

// Drips that hang and fall
function generateHangingDrips() {
  const drips = [];
  for (let i = 0; i < 10; i++) {
    drips.push({
      id: i,
      x: 5 + (i / 10) * 90 + Math.random() * 8,
      width: 6 + Math.random() * 18,
      maxHeight: 20 + Math.random() * 40,
      delay: 0.5 + Math.random() * 0.3,
      drainDelay: 0.8 + Math.random() * 0.3,
    });
  }
  return drips;
}

export default function LandingOilSplash() {
  const [blobs] = useState(generateSplashBlobs);
  const [droplets] = useState(generateDroplets);
  const [drips] = useState(generateHangingDrips);

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.4 }}
    >
      {/* Phase 1: Oil SPLASHES onto screen — big blobs expand from center */}
      {blobs.map((b) => (
        <motion.div
          key={`blob-${b.id}`}
          className="absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            transform: `translate(-50%, -50%)`,
          }}
          initial={{ scale: 0, opacity: 1, rotate: b.rotation }}
          animate={[
            { scale: 1, opacity: 1, rotate: b.rotation },
            { scale: 1, opacity: 1, rotate: b.rotation },
            { scale: 0.8, opacity: 0, rotate: b.rotation + 10 },
          ]}
          transition={{
            times: [0, 0.5, 1],
            duration: 1.2,
            delay: b.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: "blur(2px)" }}>
            <path d={BLOB_PATHS[b.pathIndex]} fill="#0a0500" />
            <path d={BLOB_PATHS[b.pathIndex]} fill="none" stroke="rgba(212,168,67,0.12)" strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}

      {/* Phase 1b: Small droplets fly outward like splash impact */}
      {droplets.map((d) => (
        <motion.div
          key={`drop-${d.id}`}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            background: "radial-gradient(circle, #1a0f00 60%, rgba(212,168,67,0.15) 100%)",
          }}
          initial={{
            left: `${d.startX}%`,
            top: `${d.startY}%`,
            scale: 0,
            opacity: 1,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            left: `${d.endX}%`,
            top: `${d.endY}%`,
            scale: [0, 1.2, 0],
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: 0.8,
            delay: d.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}

      {/* Phase 2: Drips form at top and drain down */}
      {drips.map((d) => (
        <motion.div
          key={`drip-${d.id}`}
          className="absolute top-0 rounded-b-full"
          style={{
            left: `${d.x}%`,
            width: d.width,
            background: "linear-gradient(180deg, #0a0500 0%, #1a0f00 50%, rgba(212,168,67,0.1) 100%)",
            transformOrigin: "top center",
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={[
            { height: `${d.maxHeight}vh`, opacity: 1 },
            { height: `${d.maxHeight}vh`, opacity: 1 },
            { height: 0, opacity: 0 },
          ]}
          transition={{
            times: [0.3, 0.6, 1],
            duration: 1.3,
            delay: d.delay,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}

      {/* Phase 2b: Golden light sweep — like light refracting through oil */}
      <motion.div
        className="absolute inset-y-0"
        style={{
          width: "40%",
          background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.12) 25%, rgba(212,168,67,0.3) 50%, rgba(212,168,67,0.12) 75%, transparent 100%)",
          filter: "blur(30px)",
        }}
        initial={{ left: "-40%", opacity: 0 }}
        animate={{ left: "140%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Phase 3: Final golden sheen line wipes up */}
      <motion.div
        className="absolute inset-x-0 h-[3px]"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.5) 30%, rgba(212,168,67,0.9) 50%, rgba(212,168,67,0.5) 70%, transparent 95%)",
          boxShadow: "0 0 20px 4px rgba(212,168,67,0.3)",
        }}
        initial={{ bottom: 0, opacity: 0 }}
        animate={{ bottom: "100vh", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  );
}