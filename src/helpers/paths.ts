// src/helpers/paths.ts
import type { LangCode } from "../i18n/types";
import defaults from "./defaults";

const DEFAULT_LANG: LangCode = "el";

/**
 * Builds a localized path.
 * - Default lang (el) => plain path (e.g., "/about")
 * - Other langs       => prefix with lang code (e.g., "/en/about")
 */
export function localizedPath(
  path: string,
  lang: LangCode,
  defaultLang: LangCode = DEFAULT_LANG
): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return lang === defaultLang ? path : `/${lang}${path}`;
}

/**
 * Builds hreflang alternate entries for a given path.
 * Adds x-default pointing to EN (or fallback).
 */
export function buildAlternates(
  path: string,
  langs: LangCode[] = ["el", "en"],
  defaultLang: LangCode = DEFAULT_LANG
) {
  return [
    ...langs.map((l) => ({
      hrefLang: l,
      href: `${defaults.url}${localizedPath(path, l, defaultLang)}`,
    })),
    {
      hrefLang: "x-default",
      href: `${defaults.url}${localizedPath(path, "en", defaultLang)}`,
    },
  ];
}