import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component - Automatically scrolls to top on route changes
 *
 * This component listens to route changes and scrolls the window to the top.
 * It should be placed inside the Router but doesn't render anything.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
