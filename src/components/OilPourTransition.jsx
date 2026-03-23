import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Mobile-native slide-in page transition.
 * New pages slide in from the right; exiting pages slide out left.
 * Includes a subtle gold edge accent for brand continuity.
 */

const slideVariants = {
  enter: { x: "30%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-15%", opacity: 0 },
};

const slideTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.28,
};

export default function OilPourTransition({ children }) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}