import { useLocation } from "react-router-dom";

/**
 * Returns the depth of the current route.
 * Used by components that need route awareness outside of the tab stack system.
 * The primary back-navigation is handled by useTabNavigationStacks in Layout.
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