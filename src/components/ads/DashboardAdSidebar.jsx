import AdBanner from "./AdBanner";
import AffiliatesSidebar from "./AffiliatesSidebar";

/**
 * Combined ad + affiliate sidebar for dashboard pages.
 * Drop this component into any page layout's sidebar area.
 */
export default function DashboardAdSidebar() {
  return (
    <div className="space-y-4">
      {/* AdSense unit */}
      <AdBanner slot="DASHBOARD_SIDE_1" format="auto" className="rounded-xl overflow-hidden" />

      {/* Affiliate partner links */}
      <AffiliatesSidebar />

      {/* Second AdSense unit */}
      <AdBanner slot="DASHBOARD_SIDE_2" format="auto" className="rounded-xl overflow-hidden" />
    </div>
  );
}