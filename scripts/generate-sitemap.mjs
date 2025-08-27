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
// Static routes you want in the sitemap (without lang query)
const STATIC_ROUTES = [
  { loc: "/", changefreq: "monthly", priority: 1.0 },
  { loc: "/services", changefreq: "monthly", priority: 0.8 },
  { loc: "/sessions", changefreq: "monthly", priority: 0.8 },
  { loc: "/articles", changefreq: "weekly", priority: 0.9 },
  { loc: "/about", changefreq: "yearly", priority: 0.5 },
];

// Where to look for articles (en/el versions)
const ARTICLES_GLOB = "src/content/articles/**/{en,el}.md";

// Languages supported
const LANGS = ["el", "en"];

// Use the article front-matter date or file mtime if missing
function toISO(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// Build an entry with `loc` (canonical without ?lang) + xhtml:link alternates with ?lang=
// For articles, canonical is language-neutral path: /articles/<slug>
function buildUrlXml({ loc, lastmod, changefreq, priority, alternates }) {
  // Ensure absolute loc (no query)
  const absLoc = `${SITE_URL}${loc.startsWith("/") ? loc : `/${loc}`}`;
  const last = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  const cf = changefreq ? `<changefreq>${changefreq}</changefreq>` : "";
  const pr = priority != null ? `<priority>${priority}</priority>` : "";

  const altLinks =
    (alternates || [])
      .map(
        (a) =>
          `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${absLoc}${
            a.lang ? `?lang=${a.lang}` : ""
          }" />`
      )
      .join("");

  // Also emit x-default (choose English as default if you prefer)
  const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${absLoc}?lang=en" />`;

  return `
  <url>
    <loc>${absLoc}</loc>
    ${last}
    ${cf}
    ${pr}
    ${altLinks}
    ${xDefault}
  </url>`;
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

    // detect lang from filename
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
    const loc = `/articles/${slug}`;
    const alternates = LANGS.filter((L) => langs.has(L)).map((L) => ({ lang: L }));

    items.push({
      loc,
      lastmod,
      changefreq: "yearly",
      priority: 0.6,
      alternates,
    });
  }

  return items.sort((a, b) => (a.loc < b.loc ? -1 : 1));
}

async function main() {
  // Ensure /public exists
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // Build static URLs
  const today = toISO(new Date());
  const staticEntries = STATIC_ROUTES.map((r) =>
    buildUrlXml({
      loc: r.loc,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
      alternates: LANGS.map((lang) => ({ lang })),
    })
  );

  // Build article URLs
  const articles = await collectArticles();
  const articleEntries = articles.map((a) =>
    buildUrlXml({
      loc: a.loc,
      lastmod: a.lastmod,
      changefreq: a.changefreq,
      priority: a.priority,
      alternates: a.alternates,
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${staticEntries.join("\n")}
${articleEntries.join("\n")}
</urlset>`.trim() + "\n";

  fs.writeFileSync(OUT_FILE, xml, "utf8");
  console.log(`✅ sitemap.xml generated at ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error("❌ Failed to generate sitemap:", err);
  process.exit(1);
});