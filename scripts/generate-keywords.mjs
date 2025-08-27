#!/usr/bin/env node
/**
 * Better SEO keyword/keyphrase generator for EL/EN content.
 * - Parses Markdown with frontmatter (articles & pages)
 * - Normalizes diacritics (Greek tonos-safe), lowercases
 * - Removes EL/EN stopwords
 * - Builds 1–3 gram candidates
 * - TF-IDF scoring with section boosts (title, H1–H3, strong, first paragraph)
 * - Optional synonym normalization to merge variants (e.g., counselling/counseling, ψυχοθεραπεία/psychotherapy)
 * - Outputs public/seo-keywords.json with per-doc & global top terms (per language)
 */

import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { marked } from "marked";
import dotenv from "dotenv";

dotenv.config();

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_FILE = path.join(PUBLIC_DIR, "seo-keywords.json");

// Where your content lives
const ARTICLE_GLOB = "src/content/articles/**/{en,el}.md";
// Optional: add static page md here (create if you want)
const PAGE_GLOB = "src/content/pages/**/{en,el}.md";

// Site config
const LANGS = ["el", "en"];
const MAX_PER_DOC = 20;     // top terms per doc
const MAX_GLOBAL = 60;      // top terms per language (sitewide)

// Weights (tune freely)
const WEIGHTS = {
  tfidf: 1.0,
  titleBoost: 6.0,
  h1Boost: 5.0,
  h2Boost: 3.0,
  h3Boost: 2.0,
  strongBoost: 1.5,
  firstParaBoost: 1.5,
  tagBoost: 4.0,
  bigramBonus: 1.3,
  trigramBonus: 1.6,
};

// Minimal synonym map (extend as needed)
// left-hand are normalized keys; right-hand are the canonical form to merge into
const SYNONYMS = {
  // EN
  "counseling": "counselling",
  "cognitive behavioral therapy": "cognitive behavioural therapy",
  "cbt": "cognitive behavioural therapy",
  "well-being": "wellbeing",
  // EL
  "ψυχοθεραπεια": "ψυχοθεραπεία",
  "καταθλιψη": "κατάθλιψη",
  "αγχος": "άγχος",
};

// Basic stopwords (expand over time)
const STOP_EN = new Set([
  "a","an","and","the","for","to","of","in","on","with","by","at","as","is","are","be","it","that","this","these","those",
  "from","or","not","but","into","about","your","you","we","our","us","they","their","them","i","me","my","mine",
  "can","could","may","might","should","would","will","just","more","most","such","than","then","so","if","also",
  "have","has","had","do","does","did","been","being","over","per","via","–","—"
]);
const STOP_EL = new Set([
  "και","να","το","η","ο","οι","τι","τις","των","τον","την","στο","στη","στην","στον","σε","για","με","απο","από","που","πως","πώς",
  "ειναι","είναι","ή","θα","αν","ως","ότι","χωρις","χωρίς","οχι","όχι","μια","ένας","ενας","ενω","ενώ","δε","δεν","καθως","καθώς",
  "τα","τις","τους","τους","τιν","οταν","όταν","οπου","όπου","εκει","εκεί","εδώ","εδω"
]);

// ---------- helpers ----------
function stripDiacritics(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function norm(s) {
  return stripDiacritics(s.toLowerCase()).replace(/[’'`´]/g, "'").trim();
}
function detectLangByPath(p) {
  return /\/el\.md$/.test(p) ? "el" : "en";
}
function htmlToText(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function tokenize(text, lang) {
  const stop = lang === "el" ? STOP_EL : STOP_EN;
  const toks = norm(text)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((t) => t && t.length > 1 && !stop.has(t));
  return toks;
}
function applySynonyms(term) {
  return SYNONYMS[term] || term;
}
function ngrams(tokens, n) {
  const grams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    const g = tokens.slice(i, i + n).join(" ");
    grams.push(g);
  }
  return grams;
}
function uniq(arr) { return Array.from(new Set(arr)); }

// Extract weighted zones from HTML
function extractZones(md, lang) {
  const { data, content } = matter(md);
  const html = marked.parse(content);
  const title = norm((data.title || "").toString());
  const tags = (data.tags || []).map((t) => norm(String(t)));

  const zones = {
    title,
    tags,
    h1: [],
    h2: [],
    h3: [],
    strong: [],
    firstPara: "",
    body: htmlToText(html)
  };

  // naive grabs (fast & good-enough)
  const h = html;
  const extractAll = (re) => {
    const out = [];
    let m;
    while ((m = re.exec(h)) !== null) out.push(norm(htmlToText(m[1])));
    return out;
  };
  zones.h1 = extractAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  zones.h2 = extractAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  zones.h3 = extractAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  zones.strong = extractAll(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi).map(s => s); // group 2 in m?
  // fix strong capture (the regex above returns both tag name and content)
  // quick patch: re-run capturing only inner group:
  zones.strong = [];
  let ms;
  const reStrong = /<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi;
  while ((ms = reStrong.exec(h)) !== null) zones.strong.push(norm(htmlToText(ms[2])));

  const paraMatch = h.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  zones.firstPara = paraMatch ? norm(htmlToText(paraMatch[1])) : "";

  return { data, zones, lang, html };
}

// Build candidate terms (1–3 grams) with zone boosts
function buildCandidates({ zones, data, lang }) {
  const stop = lang === "el" ? STOP_EL : STOP_EN;
  const add = (map, key, inc) => { map.set(key, (map.get(key) || 0) + inc); };

  const cands = new Map();

  // zones to tokens
  const z = [
    { text: zones.title, w: WEIGHTS.titleBoost },
    ...zones.h1.map((t) => ({ text: t, w: WEIGHTS.h1Boost })),
    ...zones.h2.map((t) => ({ text: t, w: WEIGHTS.h2Boost })),
    ...zones.h3.map((t) => ({ text: t, w: WEIGHTS.h3Boost })),
    ...zones.strong.map((t) => ({ text: t, w: WEIGHTS.strongBoost })),
    { text: zones.firstPara, w: WEIGHTS.firstParaBoost },
    { text: zones.body, w: 1.0 },
  ];

  // Tags boost
  (zones.tags || []).forEach((t) => {
    if (!t || stop.has(t)) return;
    const canon = applySynonyms(t);
    add(cands, canon, WEIGHTS.tagBoost);
  });

  for (const { text, w } of z) {
    if (!text) continue;
    const toks = tokenize(text, lang).map(applySynonyms).filter(Boolean);

    // unigrams
    toks.forEach((t) => add(cands, t, w));

    // bigrams / trigrams
    for (const g of ngrams(toks, 2)) add(cands, g, w * WEIGHTS.bigramBonus);
    for (const g of ngrams(toks, 3)) add(cands, g, w * WEIGHTS.trigramBonus);
  }

  // Clean trivial items
  for (const k of Array.from(cands.keys())) {
    if (!k) { cands.delete(k); continue; }
    if (/^\d+$/.test(k)) cands.delete(k);
    if (k.length < 3) cands.delete(k);
  }

  return cands;
}

function computeTfIdf(allDocs) {
  // df across docs (per language)
  const dfByLang = { el: new Map(), en: new Map() };
  const docCount = { el: 0, en: 0 };

  for (const d of allDocs) {
    docCount[d.lang]++;
    const seen = new Set();
    for (const term of d.cands.keys()) {
      if (seen.has(term)) continue;
      seen.add(term);
      const dfm = dfByLang[d.lang];
      dfm.set(term, (dfm.get(term) || 0) + 1);
    }
  }

  // tf-idf + local weight
  for (const d of allDocs) {
    const N = docCount[d.lang] || 1;
    const dfm = dfByLang[d.lang];
    const scored = [];
    for (const [term, weight] of d.cands.entries()) {
      const df = dfm.get(term) || 1;
      const idf = Math.log((N + 1) / (df + 0.5));
      const score = WEIGHTS.tfidf * idf * weight;
      scored.push([term, score]);
    }
    scored.sort((a, b) => b[1] - a[1]);
    d.top = scored.slice(0, MAX_PER_DOC);
  }

  // global tops per language
  const global = { el: new Map(), en: new Map() };
  for (const d of allDocs) {
    const gm = global[d.lang];
    for (const [term, score] of d.top) {
      gm.set(term, (gm.get(term) || 0) + score);
    }
  }
  const globalTop = {};
  for (const lang of LANGS) {
    const arr = Array.from(global[lang].entries()).sort((a, b) => b[1] - a[1]);
    globalTop[lang] = arr.slice(0, MAX_GLOBAL).map(([term, score]) => ({ term, score: +score.toFixed(2) }));
  }

  return globalTop;
}

async function loadDocs() {
  const files = await fg([ARTICLE_GLOB, PAGE_GLOB], { dot: false });
  const docs = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const lang = detectLangByPath(file);
    const { data } = matter(raw);

    const parsed = extractZones(raw, lang);
    const cands = buildCandidates({ zones: parsed.zones, data: parsed.data, lang });

    const slug =
      data.slug ||
      path.basename(file).replace(/\.(en|el)\.md$/, "");

    docs.push({
      path: file,
      lang,
      slug,
      title: data.title || slug,
      date: data.date || null,
      tags: data.tags || [],
      cands,
      top: [],
    });
  }

  return docs;
}

function toOutput(docs, globalTop) {
  const perDoc = docs.map((d) => ({
    lang: d.lang,
    slug: d.slug,
    title: d.title,
    tags: d.tags,
    keywords: d.top.map(([term, score]) => ({ term, score: +score.toFixed(2) })),
  }));

  return {
    generatedAt: new Date().toISOString(),
    perDoc,
    globalTop,
  };
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const docs = await loadDocs();
  if (!docs.length) {
    console.warn("No documents found. Check ARTICLE_GLOB/PAGE_GLOB.");
  }
  const globalTop = computeTfIdf(docs);
  const out = toOutput(docs, globalTop);

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), "utf8");
  console.log(`✅ Wrote ${path.relative(ROOT, OUT_FILE)} with ${out.perDoc.length} docs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});