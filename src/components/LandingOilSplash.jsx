import { motion } from "framer-motion";

/**
 * Smooth oil-pour reveal: a dark curtain rises with a golden edge,
 * followed by a luminous golden sweep — fluid and elegant, not splatty.
 */
export default function LandingOilSplash() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 1.1 }}
    >
      {/* Dark oil curtain — slides up to reveal */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{
          background: "linear-gradient(0deg, #050208 0%, #0B2545 40%, #0a0a1a 100%)",
        }}
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Golden edge line — rides the curtain edge */}
      <motion.div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.4) 25%, rgba(212,168,67,0.9) 50%, rgba(212,168,67,0.4) 75%, transparent 95%)",
          boxShadow: "0 0 30px 8px rgba(212,168,67,0.25), 0 0 60px 20px rgba(212,168,67,0.1)",
        }}
        initial={{ bottom: "0%" }}
        animate={{ bottom: "100%" }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Broad golden glow sweep — follows the edge */}
      <motion.div
        className="absolute inset-x-0 h-32"
        style={{
          background: "linear-gradient(0deg, transparent 0%, rgba(212,168,67,0.08) 40%, rgba(212,168,67,0.15) 60%, transparent 100%)",
          filter: "blur(20px)",
        }}
        initial={{ bottom: "-10%" }}
        animate={{ bottom: "110%" }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
      />

      {/* Horizontal light sweep — like light glinting across oil */}
      <motion.div
        className="absolute inset-y-0"
        style={{
          width: "35%",
          background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.06) 30%, rgba(212,168,67,0.15) 50%, rgba(212,168,67,0.06) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
        initial={{ left: "-35%", opacity: 0 }}
        animate={{ left: "135%", opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </motion.div>
  );
}