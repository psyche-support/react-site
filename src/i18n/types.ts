// src/i18n/types.ts
export type LangCode = "el" | "en"; // extend as you add more

// Canonical OG (Open Graph) locale for each language
export const OG_LOCALE: Record<LangCode, string> = {
  el: "el_GR",
  en: "en_US",
};

// Reasonable alternates for each language (shown to crawlers as og:locale:alternate)
export const OG_LOCALE_ALTERNATES: Record<LangCode, string[]> = {
  el: ["en_US"],
  en: ["el_GR"],
};