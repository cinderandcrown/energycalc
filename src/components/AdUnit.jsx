import { useEffect, useRef } from "react";

/**
 * Google AdSense ad unit.
 *
 * @param {"horizontal"|"vertical"|"rectangle"} variant – layout hint
 * @param {string} className – extra wrapper classes
 */
export default function AdUnit({ variant = "horizontal", className = "" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not loaded (ad blocker, dev, etc.)
    }
  }, []);

  const style =
    variant === "vertical"
      ? { display: "block", width: "160px", height: "600px" }
      : variant === "rectangle"
        ? { display: "inline-block", width: "336px", height: "280px" }
        : { display: "block", width: "100%", height: "90px" };

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3302211011992234"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
