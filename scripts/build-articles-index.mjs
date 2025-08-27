// scripts/build-articles-index.mjs
// Build a public manifest + search index for articles.
//
// Reads:   src/content/articles/*/*.md   (one level deep, e.g. articles/<slug>/<lang>.md)
// Writes:  public/search/articles-manifest.json
//          public/search/articles-index.json
// Copies:  md + relative banner assets to public/articles/<slug>/

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { globSync } from "glob";

// ---------- Paths ----------
const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src", "content", "articles");
const PUB_DIR = path.join(ROOT, "public");
const PUB_ART_DIR = path.join(PUB_DIR, "articles");
const OUT_DIR = path.join(PUB_DIR, "search");

// ensure dirs
fs.mkdirSync(PUB_ART_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------- Utils ----------
const isHttp = (u) => /^https?:\/\//i.test(u);
const isAbsURL = (u) => typeof u === "string" && (u.startsWith("/") || isHttp(u));
const fileExists = async (p) => !!(await fsp.stat(p).catch(() => null));

function stripDiacritics(s = "") {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function normalize(s = "") {
  return stripDiacritics(String(s).toLowerCase())
    .replace(/[^\p{L}\p{N}\s#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function mdToRoughText(md = "") {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!$begin:math:display$[^$end:math:display$]*]$begin:math:text$[^)]+$end:math:text$/g, " ")
    .replace(/$begin:math:display$([^$end:math:display$]+)]$begin:math:text$[^)]+$end:math:text$/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function parseLangFromFilename(file) {
  const base = path.basename(file).toLowerCase();
  if (base === "el.md") return "el";
  if (base === "en.md") return "en";
  return file.includes("/el.md") ? "el" : "en";
}
function toISOorNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
function slugFromPath(file) {
  return path.basename(path.dirname(file)); // parent directory name
}

// ---------- Collect files ----------
// EXACT pattern you use:
const oneLevel = `${SRC_DIR.replace(/\\/g, "/")}/*/*.md`;
// Fallback (if you add deeper nesting later):
const deeper = `${SRC_DIR.replace(/\\/g, "/")}/**/*.md`;
let files = globSync(oneLevel, { nodir: true });
if (files.length === 0) {
  // Try deeper just in case
  files = globSync(deeper, { nodir: true });
}

if (files.length === 0) {
  console.log("No markdown files found under:", SRC_DIR);
}

// ---------- Build manifest + index ----------
const manifest = [];
const index = Object.create(null);

function addToIndex(slug, textParts) {
  const text = normalize(textParts.filter(Boolean).join(" "));
  if (!text) return;
  const tokens = Array.from(new Set(text.split(/\s+/).filter(Boolean)));
  for (const tok of tokens) {
    if (!index[tok]) index[tok] = [];
    const arr = index[tok];
    if (arr[arr.length - 1] !== slug && !arr.includes(slug)) {
      arr.push(slug);
    }
  }
}

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const gm = matter(raw);
  const data = gm.data || {};
  const content = gm.content || "";

  const lang = parseLangFromFilename(file);
  const slug = String(data.slug || slugFromPath(file));
  const date = toISOorNull(data.date);

  // Resolve/copy banner if relative
  let banner = data.banner || null;
  if (banner && !isAbsURL(banner)) {
    const srcBanner = path.resolve(path.dirname(file), banner);
    if (fs.existsSync(srcBanner)) {
      const targetDir = path.join(PUB_ART_DIR, slug);
      fs.mkdirSync(targetDir, { recursive: true });
      const base = path.basename(srcBanner);
      const dest = path.join(targetDir, base);
      if (!(await fileExists(dest))) {
        await fsp.copyFile(srcBanner, dest).catch(() => {});
      }
      banner = `/articles/${slug}/${base}`;
    } else {
      banner = String(banner);
    }
  } else if (banner && isAbsURL(banner)) {
    banner = String(banner);
  }

  // Copy markdown to public so it can be fetched at runtime
  const targetDir = path.join(PUB_ART_DIR, slug);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetName = `${lang}.md`;
  const targetPath = path.join(targetDir, targetName);
  await fsp.copyFile(file, targetPath);
  const contentUrl = `/articles/${slug}/${targetName}`;

  const entry = {
    slug,
    lang,
    title: String(data.title || ""),
    date, // ISO or null
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    banner: banner || null,
    summary: data.summary ? String(data.summary) : "",
    author: data.author ? String(data.author) : "",
    references: Array.isArray(data.references) ? data.references.map(String) : [],
    photoCreditText: data.photoCreditText ? String(data.photoCreditText) : null,
    photoCreditHref: data.photoCreditHref ? String(data.photoCreditHref) : null,
    sourcePath: file.replace(ROOT, "").replace(/^[\\/]/, ""),
    contentUrl,
  };

  manifest.push(entry);

  addToIndex(slug, [
    entry.title,
    entry.summary,
    mdToRoughText(content),
    (entry.tags || []).join(" "),
  ]);
}

// Sort newest first
const toTs = (v) => {
  if (!v) return 0;
  const t = Date.parse(String(v));
  return isNaN(t) ? 0 : t;
};
manifest.sort((a, b) => toTs(b.date) - toTs(a.date));

// Write outputs
await fsp.writeFile(
  path.join(OUT_DIR, "articles-manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);
await fsp.writeFile(
  path.join(OUT_DIR, "articles-index.json"),
  JSON.stringify(index, null, 0),
  "utf8"
);

console.log(
  `Built manifest with ${manifest.length} item(s) and index with ${Object.keys(index).length} token(s).`
);