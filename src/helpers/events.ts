export type GAEvent = {
  name: string;
  params?: Record<string, unknown>;
};

/** Safe wrapper around gtag */
export function trackEvent({ name, params = {} }: GAEvent) {
  // Only send if GA is present (consent granted & script loaded)
  // @ts-ignore
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // @ts-ignore
    window.gtag("event", name, params);
  }
}

/** Convenience helpers */
export const track = {
  bookOpen: (source: string) =>
    trackEvent({ name: "click_book_session", params: { source } }),
  bookClose: (source: string) =>
    trackEvent({ name: "close_booking_modal", params: { source } }),
  serviceClick: (service: string, href: string) =>
    trackEvent({
      name: "outbound_service_click",
      params: { service, link_url: href },
    }),
  cta: (id: string, href: string) =>
    trackEvent({ name: "cta_click", params: { id, link_url: href } }),
  mapOpen: (href: string) =>
    trackEvent({ name: "view_on_map_click", params: { link_url: href } }),
  badgeClick: (alt: string, href: string) =>
    trackEvent({ name: "badge_click", params: { alt, link_url: href } }),
};
