#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config();

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_FILE = path.join(PUBLIC_DIR, "sitemap.xml");

// Site URL (no trailing slash)
const SITE_URL = (process.env.VITE_SITE_URL || "https://psyche.support").replace(/\/+$/, "");

// ---- CONFIG ----
const DEFAULT_LANG = "el";               // <— change if your default is different
const LANGS = ["el", "en"];              // all supported languages

// Static routes (language-neutral canonical path)
const STATIC_ROUTES = [
  { loc: "/", changefreq: "monthly", priority: 1.0 },
  { loc: "/services", changefreq: "monthly", priority: 0.8 },
  { loc: "/sessions", changefreq: "monthly", priority: 0.8 },
  { loc: "/articles", changefreq: "weekly", priority: 0.9 },
  { loc: "/about", changefreq: "yearly", priority: 0.5 },
  { loc: "/privacy", changefreq: "yearly", priority: 0.3 },
  { loc: "/terms", changefreq: "yearly", priority: 0.2 },
  { loc: "/cookies", changefreq: "yearly", priority: 0.2 },
  { loc: "/accessibility", changefreq: "yearly", priority: 0.2 },
];

// Where to look for articles (en/el versions)
const ARTICLES_GLOB = "src/content/articles/**/{en,el}.md";

// Helpers
function toISO(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function joinUrlPath(...parts) {
  const p = parts
    .filter(Boolean)
    .map((s) => String(s).replace(/\/+$/,"").replace(/^\/+/, ""))
    .join("/");
  return "/" + p.replace(/^\/+/, "");
}

// Build the language-aware path:
// - default lang: no prefix
// - other langs: `/<lang><loc>` (except root: `/<lang>`)
function langPath(loc, lang) {
  if (lang === DEFAULT_LANG) return loc;
  if (loc === "/") return `/${lang}`;
  return `/${lang}${loc.startsWith("/") ? loc : `/${loc}`}`;
}

// One <url> XML block (for a specific language path) with alternate hreflangs
function buildUrlXml({ loc, lastmod, changefreq, priority, alternates }) {
  const absLoc = `${SITE_URL}${loc}`;
  const last = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  const cf = changefreq ? `<changefreq>${changefreq}</changefreq>` : "";
  const pr = priority != null ? `<priority>${priority}</priority>` : "";

  const altLinks = (alternates || [])
    .map(a => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${SITE_URL}${a.loc}" />`)
    .join("");

  // x-default should point to the default-language path
  const xDefaultLoc = alternates.find(a => a.lang === DEFAULT_LANG)?.loc || loc;
  const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${xDefaultLoc}" />`;

  return `
  <url>
    <loc>${absLoc}</loc>
    ${last}
    ${cf}
    ${pr}
    ${altLinks}
    ${xDefault}
  </url>`.trim();
}

async function collectArticles() {
  const files = await fg(ARTICLES_GLOB, { dot: false });
  // Group by slug across languages
  const bySlug = new Map();

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    const slug = data.slug || "";
    if (!slug) continue;

    const lang = /\/el\.md$/.test(file) ? "el" : "en";
    const stat = fs.statSync(file);
    const lastmod = toISO(data.date || stat.mtime);

    const current = bySlug.get(slug) || { slug, dates: [], langs: new Set() };
    current.dates.push(lastmod);
    current.langs.add(lang);
    bySlug.set(slug, current);
  }

  // Produce sitemap entries for each unique slug
  const items = [];
  for (const { slug, dates, langs } of bySlug.values()) {
    const lastmod = dates.sort().pop(); // latest date
    const canonical = `/articles/${slug}`;
    const availableLangs = LANGS.filter(l => langs.has(l)); // only langs that actually exist

    items.push({
      canonical,
      lastmod,
      changefreq: "yearly",
      priority: 0.6,
      languages: availableLangs
    });
  }

  // Sort stable
  items.sort((a, b) => (a.canonical < b.canonical ? -1 : 1));
  return items;
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const today = toISO(new Date());

  // -------- Static routes --------
  const staticBlocks = [];
  for (const r of STATIC_ROUTES) {
    // All languages for this route
    const allLangPaths = LANGS.map(lang => ({
      lang,
      loc: langPath(r.loc, lang),
    }));

    // Emit one <url> per language, with alternates for all languages
    for (const { lang, loc } of allLangPaths) {
      const alternates = allLangPaths; // all langs
      staticBlocks.push(
        buildUrlXml({
          loc,
          lastmod: today,
          changefreq: r.changefreq,
          priority: r.priority,
          alternates,
        })
      );
    }
  }

  // -------- Articles --------
  const articles = await collectArticles();
  const articleBlocks = [];
  for (const a of articles) {
    // Only langs that exist for this slug
    const langPaths = a.languages.map(lang => ({
      lang,
      loc: langPath(a.canonical, lang),
    }));

    for (const entry of langPaths) {
      articleBlocks.push(
        buildUrlXml({
          loc: entry.loc,
          lastmod: a.lastmod,
          changefreq: a.changefreq,
          priority: a.priority,
          alternates: langPaths,
        })
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${staticBlocks.join("\n")}
${articleBlocks.join("\n")}
</urlset>
`.trim() + "\n";

  fs.writeFileSync(OUT_FILE, xml, "utf8");
  console.log(`✅ sitemap.xml generated at ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error("❌ Failed to generate sitemap:", err);
  process.exit(1);
});