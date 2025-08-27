// src/i18n/useI18n.ts
import type { LangCode } from "./types";

/**
 * Eagerly load all translation modules at build time.
 * Each file must export `default` (an object).
 * Expected file names: ./<namespace>.<lang>.ts  e.g. common.el.ts, common.en.ts
 */
const modules = import.meta.glob("./*.{el,en}.ts", { eager: true }) as Record<
  string,
  { default?: any }
>;

// Build a registry: registry[ns][lang] = dict
const registry: Record<string, Partial<Record<LangCode, any>>> = {};

for (const path in modules) {
  // path looks like "./common.el.ts"
  const m = modules[path];
  const match = path.match(/\.\/(.+)\.(el|en)\.ts$/);
  if (!match) continue;
  const ns = match[1]; // "common"
  const lang = match[2] as LangCode; // "el" | "en"
  const dict = m?.default ?? m;

  (registry[ns] ||= {});
  registry[ns][lang] = dict;
}

/**
 * Synchronous i18n accessor. No hooks, no async.
 * Returns { dict, loading:false, error:null } to keep API unchanged.
 */
type Options = {
  fallbackLang?: LangCode; // default: the "other" language
};

export function useI18n(ns: string, lang: LangCode, opts: Options = {}) {
  const fallbackLang: LangCode = opts.fallbackLang ?? (lang === "el" ? "en" : "el");

  const byNs = registry[ns] || {};
  const dict = byNs[lang] ?? byNs[fallbackLang] ?? {};

  // Keep the return shape consistent with previous versions
  return {
    dict,          // ready immediately
    loading: false,
    error: null as Error | null,
  };
}