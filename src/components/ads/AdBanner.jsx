import { useEffect, useRef } from "react";

/**
 * Google AdSense display ad component.
 * Renders a responsive ad unit in-page.
 * Replace data-ad-client and data-ad-slot with your real AdSense values.
 */
export default function AdBanner({ slot = "XXXXXXXXXX", format = "auto", className = "" }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded or ad-blocker active — fail silently
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <p className="text-[8px] text-muted-foreground text-center mt-0.5 opacity-50">Advertisement</p>
    </div>
  );
}