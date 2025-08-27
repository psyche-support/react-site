// Robust auto-merging i18n loader for Vite (EL/EN)
// - Auto-imports all .ts under src/i18n/** (except this file and *.d.ts)
// - Accepts multiple shapes per module:
//     default { en, el }  OR  named exports { en, el }  OR  default { translations: { en, el } }
// - Optional flattening for selected namespaces (e.g., "common")
// - Safe array merge strategies (replace/concat/unique) per-namespace
// - Optional folder-based namespacing to avoid collisions
// - Helpful debug logging

export type LangCode = "el" | "en";
type Dict = Record<string, any>;
type ArrayStrategy = "replace" | "concat" | "unique";

// ====== CONFIG ======
const FLATTEN_NAMESPACES = new Set<string>(["common", "homePage"]); // filenames to merge into root
const DEFAULT_ARRAY_STRATEGY: ArrayStrategy = "replace";
const ARRAY_STRATEGY_BY_NS: Record<string, ArrayStrategy> = {
  common: "unique",
};
const UNIQUE_KEYS = ["key", "id", "slug", "name"];
const USE_FOLDER_NAMESPACE = false; // set true => "pages/privacy" becomes namespace "pages.privacy"
const DEBUG_I18N = false; // set true to log what loads/merges
// ====================

const isPlainObject = (v: any) => v != null && typeof v === "object" && !Array.isArray(v);

function uniqueArrayMerge(targetArr: any[], sourceArr: any[]) {
  const out: any[] = [];
  const seen = new Set<string>();
  const keyOf = (item: any) => {
    if (isPlainObject(item)) {
      for (const k of UNIQUE_KEYS) if (k in item) return `obj:${k}:${String(item[k])}`;
    }
    return `raw:${JSON.stringify(item)}`;
  };
  for (const arr of [targetArr, sourceArr]) {
    for (const item of arr) {
      const sig = keyOf(item);
      if (!seen.has(sig)) { seen.add(sig); out.push(item); }
    }
  }
  return out;
}

function mergeArrays(targetArr: any[], sourceArr: any[], strategy: ArrayStrategy) {
  switch (strategy) {
    case "concat": return [...targetArr, ...sourceArr];
    case "unique": return uniqueArrayMerge(targetArr, sourceArr);
    case "replace":
    default: return [...sourceArr];
  }
}

function deepMergeWithArrays(target: Dict, source: Dict, strategy: ArrayStrategy): Dict {
  const out: Dict = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = out[key];
    if (Array.isArray(tv) && Array.isArray(sv)) {
      out[key] = mergeArrays(tv, sv, strategy);
    } else if (isPlainObject(tv) && isPlainObject(sv)) {
      out[key] = deepMergeWithArrays(tv, sv, strategy);
    } else {
      out[key] = sv;
    }
  }
  return out;
}

function nsFromPath(p: string): string {
  const parts = p.replace(/\\/g, "/").split("/");
  const file = parts[parts.length - 1];           // "privacy.ts"
  const base = file.replace(/\.[^.]+$/, "");      // "privacy"
  if (!USE_FOLDER_NAMESPACE) return base;
  const parent = parts.length >= 2 ? parts[parts.length - 2] : "";
  return parent && parent !== "." ? `${parent}.${base}` : base;
}

function normalizePack(mod: any): { en?: Dict; el?: Dict } | null {
  // Try default export first
  const d = mod?.default;
  if (d && (isPlainObject(d.en) || isPlainObject(d.el))) return d;

  // Some modules export { translations: { en, el } }
  if (d && isPlainObject(d.translations) && (isPlainObject(d.translations.en) || isPlainObject(d.translations.el))) {
    return d.translations;
  }

  // Accept named exports en/el
  if (isPlainObject(mod?.en) || isPlainObject(mod?.el)) {
    return { en: mod.en, el: mod.el };
  }

  return null;
}

// Import every TS module under /i18n (except this file and *.d.ts)
const modules = import.meta.glob("./**/*.ts", { eager: true }) as Record<string, any>;

const translations: Record<LangCode, Dict> = { en: {}, el: {} };
const loaded: { path: string; ns: string; flatten: boolean; strategy: ArrayStrategy; hasEn: boolean; hasEl: boolean }[] = [];

for (const [path, mod] of Object.entries(modules)) {
  if (path.endsWith("translations.ts") || path.endsWith(".d.ts")) continue;

  const pack = normalizePack(mod);
  if (!pack) {
    if (DEBUG_I18N) console.warn(`[i18n] Skipped (no {en,el}): ${path}`);
    continue;
  }

  const ns = nsFromPath(path);
  const flatten = FLATTEN_NAMESPACES.has(ns.split(".").slice(-1)[0]); // flatten by filename even when using folder ns
  const strategy = ARRAY_STRATEGY_BY_NS[ns.split(".").slice(-1)[0]] ?? DEFAULT_ARRAY_STRATEGY;

  (["en", "el"] as LangCode[]).forEach((lang) => {
    const block = (pack as any)[lang];
    if (!block || typeof block !== "object") return;

    if (flatten) {
      translations[lang] = deepMergeWithArrays(translations[lang], block, strategy);
    } else {
      // Merge under namespace path (handle "pages.privacy" -> { pages: { privacy: {...} } })
      const segs = ns.split(".");
      let cursor = translations[lang];
      for (let i = 0; i < segs.length - 1; i++) {
        const seg = segs[i];
        if (!isPlainObject(cursor[seg])) cursor[seg] = {};
        cursor = cursor[seg];
      }
      const last = segs[segs.length - 1];
      const target = isPlainObject(cursor[last]) ? cursor[last] : {};
      cursor[last] = deepMergeWithArrays(target, block, strategy);
    }
  });

  loaded.push({
    path, ns, flatten, strategy,
    hasEn: !!pack.en, hasEl: !!pack.el,
  });
}

if (DEBUG_I18N) {
  console.groupCollapsed("[i18n] Loaded translation modules");
  for (const l of loaded) {
    console.log(`${l.path} -> ns="${l.ns}" flatten=${l.flatten} strategy=${l.strategy} en=${l.hasEn} el=${l.hasEl}`);
  }
  console.groupEnd();
}

// Helper to safely read via dot-path
export function t<T = any>(lang: LangCode, path: string, fallback?: T): T | string {
  let cur: any = translations[lang];
  for (const seg of path.split(".")) {
    if (cur == null) return (fallback ?? path) as T | string;
    cur = cur[seg];
  }
  return (cur ?? fallback ?? path) as T | string;
}

export { translations };