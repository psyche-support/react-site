// src/lib/articles.ts
import DOMPurify from "dompurify";
import { marked } from "marked";

/**
 * Content structure expected:
 * src/content/articles/<slug>/{en.md,el.md,banner.*}
 *
 * Example frontmatter in each .md:
 * ---
 * slug: feeling-unfairness
 * title: When Life Feels Unfair
 * date: 2025-02-10
 * tags: [workplace, emotions, reciprocity]
 * banner: /src/content/articles/feeling-unfairness/banner.jpg
 * summary: Short summary...
 * author: Psyche Support
 * references:
 *   - "Smith, J. (2022). ..."
 * photoCreditText: "Photo: Unsplash"
 * photoCreditHref: "https://unsplash.com/photos/xxxx"
 * ---
 * (markdown content...)
 */

// Load all .md as raw strings so we can parse frontmatter.
const files = import.meta.glob("/src/content/articles/**/**/*.md", { as: "raw", eager: true });
// Also import media so Vite includes them in the build (no direct usage needed here).
import.meta.glob("/src/content/articles/**/**/*.{png,jpg,jpeg,gif,webp,avif}", { eager: true });

export type Lang = "el" | "en";

export type ArticleFrontmatter = {
  slug: string;
  title: string;
  date: string;                   // ISO date
  tags?: string[];
  banner?: string;                // path to banner image
  summary?: string;
  author?: string;
  references?: string[];
  photoCreditText?: string;
  photoCreditHref?: string;
};

export type Article = {
  lang: Lang;
  frontmatter: ArticleFrontmatter;
  html: string;                   // sanitized HTML
  plain: string;                  // plain text (for read/min + search)
  readMinutes: number;
  searchIndex: string;            // normalized index for robust search
};

// ---------- Utilities ----------

function stripDiacritics(s: string): string {
  // Remove Greek tonos/diacritics and general combining marks
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeForSearch(s: string): string {
  return stripDiacritics(s.toLowerCase())
    // Keep letters, numbers, whitespace and # (for tags); drop the rest
    .replace(/[^\p{L}\p{N}\s#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toPlain(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
}

function calcReadMinutes(text: string, wpm = 200): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}

function detectLangFromPath(path: string): Lang {
  return path.endsWith("/el.md") || path.includes("/el.md") ? "el" : "en";
}

// ---------- Minimal robust frontmatter parser (YAML-ish) ----------

type FrontParse = { data: ArticleFrontmatter; content: string };

function parseFrontmatter(md: string): FrontParse {
  const fm = /^---\s*([\s\S]*?)\s*---\s*/;
  const m = md.match(fm);
  if (!m) return { data: { slug: "", title: "", date: "" }, content: md };

  const yaml = m[1];
  const content = md.slice(m[0].length);
  const data: any = {};
  let currentArrayKey: string | null = null;

  for (const rawLine of yaml.split("\n")) {
    const line = rawLine.replace(/\r/g, "");
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Inside a block array:
    if (currentArrayKey && trimmed.startsWith("-")) {
      const item = trimmed.replace(/^-+\s*/, "").trim().replace(/^["']|["']$/g, "");
      (data[currentArrayKey] ||= []).push(item);
      continue;
    }

    // Inline array: key: [a, b, "c"]
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

    // Key with value or start of block array
    const kv = trimmed.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let val = kv[2]?.trim() ?? "";

      // Start of a block array
      if (val === "") {
        currentArrayKey = key;
        data[key] = [];
        continue;
      }

      currentArrayKey = null;
      data[key] = val.replace(/^["']|["']$/g, "");
      continue;
    }
  }

  return { data, content };
}

// ---------- Loader & Indexer ----------

let _cache: Article[] | null = null;

export function loadAllArticles(): Article[] {
  if (_cache) return _cache;

  const list: Article[] = [];

  for (const path in files) {
    const raw = files[path] as string;
    const { data, content } = parseFrontmatter(raw);
    const lang = detectLangFromPath(path);

    // Render Markdown → sanitize HTML
    const htmlUnsafe = marked.parse(content) as string;
    const html = DOMPurify.sanitize(htmlUnsafe);

    const plain = toPlain(html);
    const readMinutes = calcReadMinutes(plain);

    // Build search index: title + summary + content + tags
    const title = data.title || "";
    const summary = data.summary || "";
    const tags = (data.tags || []).join(" ");
    const searchIndex = normalizeForSearch([title, summary, plain, tags].join(" "));

    // Keep banner as provided (Vite will include via glob import)
    const article: Article = {
      lang,
      frontmatter: {
        slug: data.slug || "",
        title: data.title || "",
        date: data.date || "",
        tags: data.tags || [],
        banner: data.banner,
        summary: data.summary,
        author: data.author,
        references: data.references || [],
        photoCreditText: data.photoCreditText,
        photoCreditHref: data.photoCreditHref,
      },
      html,
      plain,
      readMinutes,
      searchIndex,
    };

    // Filter incomplete items (must have slug/title/date)
    if (article.frontmatter.slug && article.frontmatter.title && article.frontmatter.date) {
      list.push(article);
    }
  }

  // Sort by date desc
  list.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  _cache = list;
  return list;
}

export function getArticlesByLang(lang: Lang): Article[] {
  return loadAllArticles().filter((a) => a.lang === lang);
}

export function getArticle(lang: Lang, slug: string): Article | undefined {
  return getArticlesByLang(lang).find((a) => a.frontmatter.slug === slug);
}

export function uniqueTags(lang: Lang): string[] {
  const set = new Set<string>();
  getArticlesByLang(lang).forEach((a) => (a.frontmatter.tags || []).forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ---------- Robust search (tokenized AND + diacritics-insensitive) ----------

export type SearchOptions = {
  query?: string; // supports words and "quoted phrases"
  tag?: string;   // optional exact tag filter (case-insensitive)
};

/**
 * Search articles by language with robust normalization:
 * - strips diacritics (EL/EN)
 * - lowercases
 * - removes punctuation (keeps # for tags)
 * - tokenizes query into words + "quoted phrases"
 * - AND match across tokens
 * - filters by exact tag (case-insensitive) if provided
 */
export function searchArticles(lang: Lang, opts: SearchOptions = {}): Article[] {
  const all = getArticlesByLang(lang);
  const q = (opts.query || "").trim();
  const activeTag = (opts.tag || "").trim();

  if (!q && !activeTag) return all;

  // Tokenize: words + quoted phrases
  const tokens: string[] = [];
  q.replace(/"([^"]+)"|(\S+)/g, (_, phrase, word) => {
    tokens.push(phrase ? phrase : word);
    return "";
  });

  return all.filter((a) => {
    // Tag filter (exact, case-insensitive)
    const tagOk = !activeTag
      ? true
      : (a.frontmatter.tags || []).some((tg) => tg.toLowerCase() === activeTag.toLowerCase());
    if (!tagOk) return false;

    if (!tokens.length) return true;

    const hay = a.searchIndex;
    // AND match
    return tokens.every((tok) => hay.includes(normalizeForSearch(tok)));
  });
}