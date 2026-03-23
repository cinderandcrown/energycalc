import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * iOS-style independent navigation stack manager for bottom tabs.
 * Each tab maintains its own history stack. Switching tabs restores
 * the last-visited page within that tab. Tapping the active tab
 * pops back to the tab's root page.
 */

const TAB_ROOTS = {
  home: "/dashboard",
  markets: "/markets",
  learn: "/energy-literacy",
  protect: "/investor-protection",
  calc: null, // calc is a drawer, not a stack tab
  more: null, // more is a drawer
};

// Map any path → which tab owns it
function resolveTab(pathname) {
  if (pathname === "/dashboard") return "home";
  if (pathname.startsWith("/markets")) return "markets";
  if (pathname === "/energy-literacy") return "learn";
  if (pathname.startsWith("/investor-protection")) return "protect";
  if (pathname.startsWith("/calc/")) return "home"; // calcs live under home stack
  // All other pages belong to home stack
  return "home";
}

export default function useTabNavigationStacks() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = resolveTab(location.pathname);

  const [activeTab, setActiveTab] = useState(initialTab);
  const stacks = useRef({
    home: ["/dashboard"],
    markets: ["/markets"],
    learn: ["/energy-literacy"],
    protect: ["/investor-protection"],
  });

  // Track navigation — push onto the active tab's stack
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    const path = location.pathname;
    if (path === prevPath.current) return;
    prevPath.current = path;

    const tab = resolveTab(path);
    const stack = stacks.current[tab];
    if (!stack) return;

    // Don't duplicate the same path at the top
    if (stack[stack.length - 1] !== path) {
      stack.push(path);
    }
    setActiveTab(tab);
  }, [location.pathname]);

  // Switch to a tab — navigate to its top-of-stack page
  const switchTab = useCallback((tabKey) => {
    const root = TAB_ROOTS[tabKey];
    if (!root) return; // calc/more don't navigate via stacks

    if (tabKey === activeTab) {
      // Tapping active tab → pop to root
      stacks.current[tabKey] = [root];
      navigate(root);
    } else {
      const stack = stacks.current[tabKey];
      const target = stack && stack.length > 0 ? stack[stack.length - 1] : root;
      navigate(target);
    }
    setActiveTab(tabKey);
  }, [activeTab, navigate]);

  // Go back within the current tab's stack
  const goBack = useCallback(() => {
    const tab = resolveTab(location.pathname);
    const stack = stacks.current[tab];

    if (stack && stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      navigate(prev);
    } else {
      // At stack root — try browser back
      navigate(-1);
    }
  }, [location.pathname, navigate]);

  // Determine if we can go back within the current tab
  const currentTab = resolveTab(location.pathname);
  const currentStack = stacks.current[currentTab] || [];
  const canGoBack = currentStack.length > 1;
  const isTabRoot = currentStack.length <= 1 || location.pathname === TAB_ROOTS[currentTab];

  return {
    activeTab: currentTab,
    switchTab,
    goBack,
    canGoBack,
    isTabRoot,
  };
}