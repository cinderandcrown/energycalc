import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Fluid page transition — dark curtain slides up with golden edge,
 * matching the landing page reveal style.
 */
export default function OilPourTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* Transition overlay */}
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.65 }}
        >
          {/* Dark curtain — slides up */}
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{
              background: "linear-gradient(0deg, #050208 0%, #0B2545 50%, #0a0a1a 100%)",
            }}
            initial={{ height: "100%" }}
            animate={{ height: "0%" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
          />

          {/* Golden edge line */}
          <motion.div
            className="absolute inset-x-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent 10%, rgba(212,168,67,0.5) 35%, rgba(212,168,67,0.9) 50%, rgba(212,168,67,0.5) 65%, transparent 90%)",
              boxShadow: "0 0 20px 6px rgba(212,168,67,0.2)",
            }}
            initial={{ bottom: "0%" }}
            animate={{ bottom: "100%" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
          />

          {/* Soft glow trail */}
          <motion.div
            className="absolute inset-x-0 h-24"
            style={{
              background: "linear-gradient(0deg, transparent 0%, rgba(212,168,67,0.06) 50%, transparent 100%)",
              filter: "blur(16px)",
            }}
            initial={{ bottom: "-5%" }}
            animate={{ bottom: "105%" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.77, 0, 0.175, 1] }}
          />
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}