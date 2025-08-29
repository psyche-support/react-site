// src/i18n/localizedRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import type { LangCode } from "../i18n/types";
export type RouteDef = {
  /** base path without language prefix, e.g. "/", "/services", "/articles/:slug" */
  path: string;
  /** render function that receives the lang and returns the element for that route */
  render: (lang: LangCode) => React.ReactNode;
};

export type LocalizedRoute = {
  /** Final path emitted, e.g. "/", "/services", "/en/services" */
  path: string;
  /** Language this route belongs to */
  lang: LangCode;
  /** The element (already rendered with lang) */
  element: React.ReactNode;
  /** The base (unprefixed) path for reference */
  basePath: string;
  /** Whether this route is the default-language root version */
  isDefaultRoot: boolean;
};

/**
 * Builds localized route objects:
 * - Default language gets root paths ("/", "/services", …)
 * - Every language (including default) also gets "/lang/..." prefixed paths
 */
export function generateLocalizedRouteDefs(
  baseRoutes: RouteDef[],
  defaultLang: LangCode,
  languages: LangCode[]
): LocalizedRoute[] {
  const out: LocalizedRoute[] = [];

  for (const lang of languages) {
    for (const r of baseRoutes) {
      const cleanBase =
        r.path === "/" ? "/" : r.path.startsWith("/") ? r.path : `/${r.path}`;

      // 1) prefixed variant for every language: "/lang/..."
      const prefixed =
        lang === defaultLang
          ? (cleanBase === "/" ? `/${defaultLang}` : `/${defaultLang}${cleanBase}`)
          : (cleanBase === "/" ? `/${lang}` : `/${lang}${cleanBase}`);

      out.push({
        path: prefixed,
        lang,
        element: r.render(lang),
        basePath: cleanBase,
        isDefaultRoot: false,
      });

      // 2) unprefixed root variant ONLY for default language
      if (lang === defaultLang) {
        out.push({
          path: cleanBase,
          lang,
          element: r.render(lang),
          basePath: cleanBase,
          isDefaultRoot: true,
        });
      }
    }
  }

  // Deduplicate in case "/" collides (defensive)
  const seen = new Set<string>();
  return out.filter((r) => {
    const key = `${r.lang}::${r.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Convenience: turn the localized route defs into <Route> elements */
export function makeLangRouteElements(
  baseRoutes: RouteDef[],
  defaultLang: LangCode,
  languages: LangCode[]
) {
  const defs = generateLocalizedRouteDefs(baseRoutes, defaultLang, languages);
  return defs.map((r) => <Route key={`${r.lang}${r.path}`} path={r.path} element={r.element} />);
}