import AdBanner from "./AdBanner";

/**
 * In-content ad placement — fits naturally between content sections.
 * Use between calculator results, article sections, or list items.
 */
export default function InContentAd({ slot = "IN_CONTENT", className = "" }) {
  return (
    <div className={`my-6 ${className}`}>
      <AdBanner slot={slot} format="horizontal" className="rounded-xl" />
    </div>
  );
}