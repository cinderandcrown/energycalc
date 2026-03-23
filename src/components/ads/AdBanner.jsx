/**
 * Google AdSense Auto Ads component.
 * Auto Ads are enabled via the adsbygoogle script in index.html.
 * This component is now a no-op placeholder — Google handles all ad placement automatically.
 * Kept as a component so existing imports don't break.
 */
export default function AdBanner({ slot, format, className = "" }) {
  // Auto Ads are managed by Google — no manual ad units needed.
  // This component renders nothing; Google injects ads automatically.
  return null;
}