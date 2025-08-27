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
  sourcePath: string;  // still in manifest
  contentUrl: string;  // <-- fetch from here
};

export type Article = {
  lang: Lang;
  frontmatter: ArticleFrontmatter;
  html: string;
  plain: string;
  readMinutes: number;
};

let manifestCache: ArticleFrontmatter[] | null = null;
let indexCache: Record<string, string[]> | null = null;

async function loadManifest() {
  if (!manifestCache) {
    const [m, idx] = await Promise.all([
      fetch("/search/articles-manifest.json").then(r => r.json()),
      fetch("/search/articles-index.json").then(r => r.json()),
    ]);
    manifestCache = m;
    indexCache = idx;
  }
  return { manifest: manifestCache!, index: indexCache! };
}

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

  // Fetch markdown from public URL (no dynamic import)
  const res = await fetch(fm.contentUrl);
  if (!res.ok) return undefined;
  const raw = await res.text();

  const { content } = parseFrontmatter(raw);

  // Load heavy libs only here
  const [{ marked }, DOMPurifyModule] = await Promise.all([
    import("marked"),
    import("dompurify"),
  ]);
  const DOMPurify = (DOMPurifyModule as any).default || DOMPurifyModule;

  const htmlUnsafe = marked.parse(content) as string;
  const html = DOMPurify.sanitize(htmlUnsafe);

  // derive plain + read time
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