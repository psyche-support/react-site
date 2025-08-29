// src/i18n/langPath.ts
import type { LangCode } from "../i18n/types";

export function getLangFromPath(pathname: string, defaultLang: LangCode, langs: LangCode[]): LangCode {
  const seg = pathname.split("/")[1]?.toLowerCase() || "";
  return langs.includes(seg as LangCode) ? (seg as LangCode) : defaultLang;
}

export function replaceLangInPath(
  pathname: string,
  target: LangCode,
  defaultLang: LangCode,
  langs: LangCode[]
): string {
  const parts = pathname.split("/");
  // parts[0] = ""  (leading slash)
  const seg = parts[1]?.toLowerCase() || "";
  const hasLang = langs.includes(seg as LangCode);

  // Remove existing lang segment if present
  const rest = hasLang ? parts.slice(2) : parts.slice(1);

  // If target is default, we keep *no* prefix
  if (target === defaultLang) {
    return "/" + rest.join("/");
  }
  // Non-default: add prefix
  return "/" + [target, ...rest].join("/");
}