import { motion } from "framer-motion";

/**
 * Landman-style cold open: hard cut from black,
 * a golden horizon line splits the screen like a sunrise
 * over the Permian Basin, then fades to reveal.
 */
export default function LandingOilSplash() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
    >
      {/* Hard black — like a cold open title card */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "#020304" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Top half — slides up */}
      <motion.div
        className="absolute inset-x-0 top-0"
        style={{ background: "linear-gradient(180deg, #020304 0%, #0a1020 100%)" }}
        initial={{ height: "50%" }}
        animate={{ height: "0%" }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Bottom half — slides down */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{ background: "linear-gradient(0deg, #020304 0%, #0a1020 100%)" }}
        initial={{ height: "50%" }}
        animate={{ height: "0%" }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Golden horizon crack — the money line */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px]"
        style={{
          background: "linear-gradient(90deg, transparent 2%, rgba(212,168,67,0.3) 15%, rgba(255,180,40,0.9) 35%, rgba(255,200,60,1) 50%, rgba(255,180,40,0.9) 65%, rgba(212,168,67,0.3) 85%, transparent 98%)",
          boxShadow: "0 0 40px 15px rgba(212,168,67,0.3), 0 0 80px 30px rgba(212,168,67,0.1)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 0.7, 1] }}
      />

      {/* Warm light wash — like sunrise hitting the camera lens */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(212,168,67,0.1) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.0, delay: 0.4, ease: "easeInOut" }}
      />
    </motion.div>
  );
}