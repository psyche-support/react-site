import React from "react";
import { useLocation } from "react-router-dom";

const ScrollManager: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  React.useEffect(() => {
    // If there’s a hash (#section), try to scroll to that element.
    if (hash) {
      const id = hash.replace("#", "");
      // wait a tick so the new page content mounts
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        }
      });
      return;
    }

    // No hash: scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    // Optional a11y: move focus to main
    const main = document.querySelector("main.site-main") as HTMLElement | null;
    if (main) {
      // ensure it can receive programmatic focus
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollManager;