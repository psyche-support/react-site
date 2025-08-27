import React from "react";
import { useLocation } from "react-router-dom";

type AnalyticsProps = {
  /** GA4 Measurement ID, e.g. "G-XXXXXXXXXX" */
  gaId: string;
  /**
   * LocalStorage key used for consent state.
   * Defaults to "analytics_consent".
   * Expected values: "granted" | "denied" | null (not set yet)
   */
  consentStorageKey?: string;
  /**
   * When true, send a page_view right after GA loads (in addition to route changes).
   * Default: true
   */
  sendInitialPageView?: boolean;
};

function hasConsent(key: string) {
  try {
    return localStorage.getItem(key) === "granted";
  } catch {
    return false;
  }
}

function injectGAScripts(gaId: string) {
  if (!gaId) return;

  if (!document.querySelector(`script[data-ga-id="${gaId}"]`)) {
    const s1 = document.createElement("script");
    s1.setAttribute("async", "true");
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    s1.setAttribute("data-ga-id", gaId);
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      // We control page_view manually on route change
      gtag('config', '${gaId}', { send_page_view: false });
    `;
    document.head.appendChild(s2);
  }
}

function sendPageView(pathname: string, search: string) {
  // @ts-ignore
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pathname + search,
  });
}

const Analytics: React.FC<AnalyticsProps> = ({
  gaId,
  consentStorageKey = "analytics_consent",
  sendInitialPageView = true,
}) => {
  const location = useLocation();

  // Init on mount if consent already granted
  React.useEffect(() => {
    if (!gaId) return;

    if (hasConsent(consentStorageKey)) {
      injectGAScripts(gaId);
      if (sendInitialPageView) {
        // fire once on load
        sendPageView(location.pathname, location.search);
      }
    }

    // Listen for consent being granted later (from ConsentBanner)
    const onGranted = () => {
      injectGAScripts(gaId);
      if (sendInitialPageView) {
        sendPageView(location.pathname, location.search);
      }
    };
    window.addEventListener("analytics:consent-granted", onGranted);
    return () => window.removeEventListener("analytics:consent-granted", onGranted);
  }, [gaId, consentStorageKey, sendInitialPageView]);

  // Track page views on route changes (only if consent granted and GA present)
  React.useEffect(() => {
    if (!gaId || !hasConsent(consentStorageKey)) return;
    const timer = setTimeout(() => sendPageView(location.pathname, location.search), 0);
    return () => clearTimeout(timer);
  }, [gaId, consentStorageKey, location.pathname, location.search]);

  return null;
};

export default Analytics;
