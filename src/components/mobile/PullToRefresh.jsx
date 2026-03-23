import { useState, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 80;

/**
 * Pull-to-refresh wrapper for mobile. Wraps any scrollable content.
 * onRefresh should return a Promise that resolves when data is ready.
 */
export default function PullToRefresh({ onRefresh, children, className = "" }) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    // Only activate when the page is scrolled to top
    // Check both container scroll and window scroll
    const containerAtTop = !containerRef.current || containerRef.current.scrollTop <= 0;
    const windowAtTop = window.scrollY <= 0;
    if (containerAtTop && windowAtTop) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling || refreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - startY.current);
    // Dampen the pull
    setPullDistance(Math.min(diff * 0.5, THRESHOLD * 1.5));
  }, [pulling, refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    if (pullDistance >= THRESHOLD && onRefresh) {
      setRefreshing(true);
      setPullDistance(THRESHOLD * 0.6);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    setPulling(false);
  }, [pulling, pullDistance, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200 ease-out"
        style={{ height: pullDistance > 0 || refreshing ? `${Math.max(pullDistance, refreshing ? 48 : 0)}px` : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-muted-foreground transition-transform ${refreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${progress * 360}deg)`, opacity: progress }}
        />
      </div>
      {children}
    </div>
  );
}