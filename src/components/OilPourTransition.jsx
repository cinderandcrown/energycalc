import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function OilPourTransition({ children }) {
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* Oil pour overlay */}
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Dark oil layer */}
          <motion.div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#1a0f00] via-[#2a1800] to-transparent"
            initial={{ height: "100vh" }}
            animate={{ height: "0vh" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Golden sheen */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-crude-gold to-transparent"
            initial={{ top: "100%", opacity: 1 }}
            animate={{ top: "-2%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}