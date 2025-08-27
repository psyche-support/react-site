import { common } from "./common";
import { homePage } from "./homePage";
import { servicesPage } from "./servicesPage";
import { aboutPage } from "./aboutPage";
import { sessionsPage } from "./sessionsPage";

/** Minimal deep merge for plain objects/arrays (no class instances). */
function deepMerge<T extends Record<string, any>>(...objs: T[]): T {
  const out: any = {};
  for (const obj of objs) {
    for (const k in obj) {
      const v = (obj as any)[k];
      if (Array.isArray(v)) {
        out[k] = (out[k] ?? []).concat(v);
      } else if (v && typeof v === "object") {
        out[k] = deepMerge(out[k] ?? {}, v);
      } else {
        out[k] = v;
      }
    }
  }
  return out;
}

// Merge per language
const el = deepMerge({}, common.el, homePage.el, servicesPage.el, aboutPage.el, sessionsPage.el);
const en = deepMerge({}, common.en, homePage.en, servicesPage.en, aboutPage.en, sessionsPage.en);

// Final export (same shape/name as before)
export const translations = { el, en } as const;
export type LangCode = keyof typeof translations;