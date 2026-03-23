import { useEffect, useRef } from "react";

/**
 * Google AdSense display ad unit.
 * Renders an in-page ad unit that fills the container.
 * Requires the adsbygoogle script loaded in index.html.
 *
 * Props:
 *  - slot: optional specific ad slot ID from AdSense dashboard
 *  - format: "auto" | "horizontal" | "vertical" | "rectangle" (default: "auto")
 *  - className: extra wrapper classes
 */
const PUBLISHER_ID = "ca-pub-3302211011992234";

export default function AdBanner({ slot, format = "auto", className = "" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount, and only if adsbygoogle is available
    if (pushed.current) return;
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not loaded or ad blocker active — fail silently
    }
  }, []);

  const layoutKey = format === "horizontal" ? "-fb+5w+4e-db+86" : undefined;
  const adFormat = format === "horizontal" ? "fluid" : "auto";
  const responsive = format !== "horizontal";

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={PUBLISHER_ID}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format={adFormat}
        {...(responsive ? { "data-full-width-responsive": "true" } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}