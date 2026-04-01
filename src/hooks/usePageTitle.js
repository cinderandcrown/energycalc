import { useEffect } from "react";

const BASE_TITLE = "Commodity Investor+";

/**
 * Sets the document title for the current page.
 * Appends the base brand name automatically.
 * Example: usePageTitle("Net Investment Calculator")
 *   → "Net Investment Calculator | Commodity Investor+"
 */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [title]);
}
