// scripts/prerender-articles.mjs
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(ROOT, "dist");

const SHELL_PATHS = [
  path.join(DIST_ROOT, "index.html"),
];

const MANIFEST_PATHS = [
  path.join(DIST_ROOT, "search", "articles-manifest.json"),
  path.join(ROOT, "public", "search", "articles-manifest.json"),
];

const LANG_PREFIX = (lang) => (lang === "el" ? "/el" : "");
const URL_BASE = "https://psyche.support"; // change if deploying under a subpath

async function ensureDir(dir) {
  try { await access(dir, constants.F_OK); } catch { await mkdir(dir, { recursive: true }); }
}

function isoDate(d) {
  try { return d ? new Date(d).toISOString() : ""; } catch { return ""; }
}

function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseFrontmatter(md) {
  const m = md.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!m) return { data: {}, content: md };
  const yaml = m[1];
  const content = md.slice(m[0].length);
  const data = {};
  let currentArrayKey = null;

  for (const rawLine of yaml.split("\n")) {
    const line = rawLine.replace(/\r/g, "").trim();
    if (!line) continue;

    if (currentArrayKey && line.startsWith("-")) {
      const item = line.replace(/^-+\s*/, "").trim().replace(/^["']|["']$/g, "");
      (data[currentArrayKey] ||= []).push(item);
      continue;
    }

    const inlineArr = line.match(/^(\w+):\s*\[(.*)\]\s*$/);
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

    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let val = kv[2]?.trim() ?? "";
      if (val === "") { currentArrayKey = key; data[key] = []; continue; }
      currentArrayKey = null;
      data[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return { data, content };
}

function buildHead({ title, desc, url, image, date, author, tags = [], lang }) {
  const og = [
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(desc)}">`,
    url ? `<meta property="og:url" content="${url}">` : "",
    image ? `<meta property="og:image" content="${image}">` : "",
  ].filter(Boolean).join("\n");

  const tw = [
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(desc)}">`,
    image ? `<meta name="twitter:image" content="${image}">` : "",
  ].filter(Boolean).join("\n");

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: desc,
    datePublished: date || undefined,
    dateModified: date || undefined,
    author: author ? { "@type": "Person", name: author } : undefined,
    image: image ? [image] : undefined,
    inLanguage: lang,
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };

  const alternates = [
    `<link rel="alternate" hreflang="en" href="${URL_BASE}/articles/REPL_SLUG/">`,
    `<link rel="alternate" hreflang="el" href="${URL_BASE}/el/articles/REPL_SLUG/">`,
    `<link rel="alternate" hreflang="x-default" href="${URL_BASE}/articles/REPL_SLUG/">`,
  ].join("\n");

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    tags.length ? `<meta name="keywords" content="${escapeHtml(tags.join(", "))}">` : "",
    og,
    tw,
    alternates,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  ].join("\n");
}

function renderArticleHTML(fm, html, lang) {
  return `
<article class="article" data-prerender="1">
  <header class="article-hero" style="--article-hero: url('${fm.banner || ""}')">
    <div class="article-hero__overlay"></div>
    ${fm.photoCreditText ? `
      <span class="article-hero__credit">
        <a href="${fm.photoCreditHref || "#"}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(fm.photoCreditText)}
        </a>
      </span>` : ""}
    <div class="container article-hero__inner">
      <div class="article-hero__meta">
        <time datetime="${fm.date || ""}">
          ${fm.date ? new Date(fm.date).toLocaleDateString(lang, { year: "numeric", month: "short", day: "2-digit" }) : ""}
        </time>
        ${fm.author ? `<span>• ${escapeHtml(fm.author)}</span>` : ""}
      </div>
      <h1 class="article-hero__title">${escapeHtml(fm.title || "")}</h1>
      <div class="article-hero__tags">
        ${(fm.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  </header>

  <main class="container article-body">
    <div class="article-content">
      ${html}
    </div>

    <p class="muted" style="margin-top:1rem;font-size:.95rem">
      ${lang === "el"
        ? "Το περιεχόμενο είναι ενημερωτικό και δεν αντικαθιστά την ψυχοθεραπεία ή ιατρική συμβουλή. Αν βρίσκεστε σε κρίση, αναζητήστε άμεσα επαγγελματική βοήθεια."
        : "Content is informational and not a substitute for therapy or medical advice. If you are in crisis, please seek immediate professional help."
      }
    </p>

    ${(fm.references && fm.references.length)
      ? `<section class="article-refs">
           <h3>${lang === "el" ? "Βιβλιογραφία" : "References"}</h3>
           <ul>${(fm.references || []).map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
         </section>`
      : ""}
  </main>
</article>`;
}

async function readFirst(paths) {
  for (const p of paths) {
    try { return await readFile(p, "utf8"); } catch {}
  }
  throw new Error(`None of the files exist:\n${paths.join("\n")}`);
}

async function loadManifest() {
  for (const p of MANIFEST_PATHS) {
    try {
      const txt = await readFile(p, "utf8");
      return JSON.parse(txt);
    } catch {}
  }
  throw new Error("articles-manifest.json not found in dist/ or public/");
}

async function main() {
  // 1) Load dist shell
  const shell = await readFirst(SHELL_PATHS);

  // 2) Load manifest
  const manifest = await loadManifest();

  let ok = 0;
  for (const fm of manifest) {
    const lang = fm.lang || "en";
    const prefix = LANG_PREFIX(lang);
    const url = `${URL_BASE}${prefix}/articles/${fm.slug}/`;

    // 3) Read markdown from sourcePath (in repo)
    const absSource = path.isAbsolute(fm.sourcePath)
      ? fm.sourcePath
      : path.join(ROOT, fm.sourcePath.replace(/^(\.\/|\/)/, ""));

    let md;
    try {
      md = await readFile(absSource, "utf8");
    } catch {
      console.error(`✗ Missing source: ${absSource}`);
      continue;
    }

    const { data: fmData, content } = parseFrontmatter(md);
    const data = { ...fmData, ...fm }; // manifest wins

    // 4) Render MD → HTML
    const articleHtml = marked.parse(content);

    // 5) Build <head> and body HTML
    const title = data.title || "Article";
    const desc = data.summary || (String(content).replace(/[#>*`*_>\-\n\r]+/g, " ").trim()).slice(0, 160);
    let head = buildHead({
      title,
      desc,
      url,
      image: data.banner || "",
      date: isoDate(data.date),
      author: data.author || "",
      tags: data.tags || [],
      lang
    }).replaceAll("REPL_SLUG", data.slug);

    const bodyHtml = renderArticleHTML(data, articleHtml, lang);

    // 6) Inject into shell
    let outHtml = shell;

    // Inject SEO before </head>
    outHtml = outHtml.replace("</head>", `${head}\n</head>`);

    // Place the article markup right after opening <body> tag,
    // so your SPA assets still load and hydrate if needed.
    outHtml = outHtml.replace(
      /<body([^>]*)>/i,
      (m, attrs) => `<body${attrs}>\n<div id="prerender-article-root">${bodyHtml}</div>`
    );

    // 7) Write to dist
    const outDir = path.join(DIST_ROOT, prefix, "articles", data.slug);
    await ensureDir(outDir);
    const outFile = path.join(outDir, "index.html");
    await writeFile(outFile, outHtml, "utf8");
    ok++;
    console.log(`✓ Wrote ${path.relative(DIST_ROOT, outFile)}`);
  }

  console.log(`\nBuilt ${ok} prerendered article page(s) into dist/.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});