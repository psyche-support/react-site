// src/lib/articles.ts
export type Lang = "el" | "en";

export type ArticleFrontmatter = {
  slug: string;
  title: string;
  date: string | null;
  tags?: string[];
  banner?: string;
  summary?: string;
  author?: string;
  references?: string[];
  photoCreditText?: string | null;
  photoCreditHref?: string | null;
  sourcePath: string;   // still in manifest
  contentUrl: string;   // fetch from here (can be absolute or relative)
  lang: Lang;           // make sure your manifest includes this
};

export type Article = {
  lang: Lang;
  frontmatter: ArticleFrontmatter;
  html: string;
  plain: string;
  readMinutes: number;
};

/* ---------- URL + fetch helpers (fix base on GitHub Pages) ---------- */

// Vite sets this correctly:
// - custom domain (psyche.support)   -> "/"
// - repo pages (user.github.io/repo) -> "/repo/"
const BASE = (import.meta as any).env?.BASE_URL ?? "/";

// Prefix a path with BASE safely; pass through absolute URLs.
function withBase(pathOrUrl: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) {
    // already absolute (http:, https:, data:, blob:, etc.)
    return pathOrUrl;
  }
  const base = BASE.replace(/\/+$/, "");           // trim trailing slash
  const rel  = String(pathOrUrl || "").replace(/^\/+/, ""); // trim leading slash
  return `${base}/${rel}`;
}

// A tiny retry to smooth out first-hit 404s on GH Pages edges
async function fetchRetry(url: string, init?: RequestInit, retries = 1, delayMs = 150) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(String(res.status));
    return res;
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise(r => setTimeout(r, delayMs));
    return fetchRetry(url, init, retries - 1, delayMs * 2);
  }
}

/* ---------- Caches ---------- */

let manifestCache: ArticleFrontmatter[] | null = null;
let indexCache: Record<string, string[]> | null = null;

async function loadManifest() {
  if (!manifestCache) {
    const [m, idx] = await Promise.all([
      fetchRetry(withBase("search/articles-manifest.json")).then(r => r.json()),
      fetchRetry(withBase("search/articles-index.json")).then(r => r.json()),
    ]);
    manifestCache = m;
    indexCache = idx;
  }
  return { manifest: manifestCache!, index: indexCache! };
}

/* ---------- Public API ---------- */

export async function listArticlesByLang(lang: Lang) {
  const { manifest } = await loadManifest();
  return manifest.filter(m => m.lang === lang);
}

export async function uniqueTags(lang: Lang): Promise<string[]> {
  const list = await listArticlesByLang(lang);
  const set = new Set<string>();
  list.forEach(m => (m.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export type SearchOptions = {
  lang: Lang;
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

function normalize(s = "") {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchArticles(opts: SearchOptions) {
  const { manifest, index } = await loadManifest();
  const { lang, query = "", tag = "", page = 1, perPage = 9 } = opts;

  let results = manifest.filter(m => m.lang === lang);

  if (tag) {
    const t = normalize(tag);
    results = results.filter(m => (m.tags || []).some(x => normalize(x) === t));
  }

  const toks = normalize(query).split(/\s+/).filter(Boolean);
  if (toks.length) {
    let slugs: Set<string> | null = null;
    for (const tok of toks) {
      const list: string[] = index[tok] || [];
      const set = new Set(list);
      slugs = slugs ? new Set([...slugs].filter(s => set.has(s))) : set;
      if (slugs.size === 0) break;
    }
    if (slugs) results = results.filter(m => slugs!.has(m.slug));
  }

  const total = results.length;
  const start = (page - 1) * perPage;
  return { total, items: results.slice(start, start + perPage) };
}

/* ---------- Markdown load/render ---------- */

type FrontParse = { data: Record<string, any>, content: string };
function parseFrontmatter(md: string): FrontParse {
  const m = md.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!m) return { data: {}, content: md };
  const yaml = m[1];
  const content = md.slice(m[0].length);
  const data: any = {};
  let currentArrayKey: string | null = null;

  for (const rawLine of yaml.split("\n")) {
    const line = rawLine.replace(/\r/g, "");
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (currentArrayKey && trimmed.startsWith("-")) {
      const item = trimmed.replace(/^-+\s*/, "").trim().replace(/^["']|["']$/g, "");
      (data[currentArrayKey] ||= []).push(item);
      continue;
    }

    const inlineArr = trimmed.match(/^(\w+):\s*\[(.*)\]\s*$/);
    if (inlineArr) {
      const key = inlineArr[1];
      const items = inlineArr[2]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      data[key] = items;
      currentArrayKey = null;
      continue;
    }

    const kv = trimmed.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let val = kv[2]?.trim() ?? "";
      if (val === "") {
        currentArrayKey = key;
        data[key] = [];
        continue;
      }
      currentArrayKey = null;
      data[key] = val.replace(/^["']|["']$/g, "");
    }
  }

  return { data, content };
}

export async function getArticle(lang: Lang, slug: string): Promise<Article | undefined> {
  const { manifest } = await loadManifest();
  const fm = manifest.find(m => m.lang === lang && m.slug === slug);
  if (!fm) return undefined;

  // Resolve content URL with BASE (works for /, /repo/, or absolute)
  const mdUrl = withBase(fm.contentUrl);
  const res = await fetchRetry(mdUrl);
  if (!res.ok) return undefined;
  const raw = await res.text();

  const { content } = parseFrontmatter(raw);

  const [{ marked }, DOMPurifyModule] = await Promise.all([
    import("marked"),
    import("dompurify"),
  ]);
  const DOMPurify = (DOMPurifyModule as any).default || DOMPurifyModule;

  const htmlUnsafe = marked.parse(content) as string;
  const html = DOMPurify.sanitize(htmlUnsafe);

  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const plain = (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));

  return {
    lang,
    frontmatter: fm,
    html,
    plain,
    readMinutes,
  };
}