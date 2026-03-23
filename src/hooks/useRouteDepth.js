import { useLocation } from "react-router-dom";

/**
 * Returns the depth of the current route and whether a back button should be shown.
 * Root-level tabs (e.g. /dashboard, /markets) are depth 1 — no back button.
 * Sub-pages (e.g. /calc/net-investment, /admin/users) are depth 2+ — show back button.
 */

const ROOT_PATHS = new Set([
  "/dashboard",
  "/markets",
  "/news",
  "/energy-literacy",
  "/intelligence",
  "/portfolio",
  "/investor-protection",
  "/settings",
  "/account",
]);

export default function useRouteDepth() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const depth = segments.length;
  const isRoot = ROOT_PATHS.has(location.pathname);
  const showBack = !isRoot && depth >= 1;

  return { depth, isRoot, showBack, pathname: location.pathname };
}