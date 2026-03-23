import { useEffect, useRef } from "react";

/**
 * Mobile anchor/sticky ad — shows at the bottom of the screen on mobile.
 * Only renders on screens < 640px. Uses AdSense anchor format.
 */
export default function MobileAnchorAd() {
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
      // fail silently
    }
  }, []);

  return (
    <div className="sm:hidden fixed bottom-[70px] left-0 right-0 z-30" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3302211011992234"
        data-ad-slot="MOBILE_ANCHOR"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}