// src/helpers/seoKeywords.ts
export type KeywordEntry = {
  lang: "el" | "en";
  slug: string;
  title: string;
  tags?: string[];
  keywords: { term: string; score: number }[];
};

export type SeoKeywordsJson = {
  generatedAt: string;
  perDoc: KeywordEntry[];
  globalTop: { el: { term: string; score: number }[]; en: { term: string; score: number }[] };
};

let _cache: Promise<SeoKeywordsJson> | null = null;

export function loadSeoKeywords(): Promise<SeoKeywordsJson> {
  if (!_cache) {
    _cache = fetch("/seo-keywords.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("seo-keywords.json not found"))))
      .catch(() =>
        // graceful fallback if the file isn't there yet
        ({ generatedAt: new Date().toISOString(), perDoc: [], globalTop: { el: [], en: [] } } as SeoKeywordsJson)
      );
  }
  return _cache;
}

/** Get top N keyword terms (strings) for a given slug/lang */
export async function getTopTermsForArticle(
  slug: string,
  lang: "el" | "en",
  limit = 8
): Promise<string[]> {
  const data = await loadSeoKeywords();
  const entry = data.perDoc.find((d) => d.slug === slug && d.lang === lang);
  if (!entry) return [];
  return entry.keywords.slice(0, limit).map((k) => k.term);
}