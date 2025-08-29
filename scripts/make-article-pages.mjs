// Node 18+
// Creates static shells for /articles/<slug>/index.html and /articles/<slug>.html
// so GitHub Pages serves real files for deep links.

import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Adjust if your output dir differs
const DIST_DIR = path.resolve(__dirname, "../dist");
// This is where your build put the manifest (copied from public/)
const MANIFEST_PATH = path.resolve(DIST_DIR, "search/articles-manifest.json");
// The built app shell
const APP_SHELL_PATH = path.resolve(DIST_DIR, "index.html");

// Utility
async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  // 1) Read built index.html (app shell)
  let shell = await fs.readFile(APP_SHELL_PATH, "utf8");

  // Optional (recommended): ensure absolute asset resolution works from subpaths
  // Add <base href="/"> if not present
  if (!/<base\s+href=/i.test(shell)) {
    shell = shell.replace(/<head([^>]*)>/i, `<head$1>\n  <base href="/">`);
  }

  // 2) Load manifest with all article slugs
  const manifestJson = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestJson);

  // 3) Unique slugs (the manifest likely has el/en variants)
  const slugs = Array.from(new Set(manifest.map(m => m.slug))).filter(Boolean);

  // 4) For each slug, create:
  //    - dist/articles/<slug>/index.html  (directory style)
  //    - dist/articles/<slug>.html        (file style; helps when trailing slash is removed)
  for (const slug of slugs) {
    const dirIndex = path.join(DIST_DIR, "articles", slug, "index.html");
    const filePath  = path.join(DIST_DIR, "articles", `${slug}.html`);

    await ensureDir(path.dirname(dirIndex));
    await fs.writeFile(dirIndex, shell, "utf8");
    await fs.writeFile(filePath, shell, "utf8");
  }

  console.log(`[make-article-pages] Created shells for ${slugs.length} article routes.`);
}

main().catch(err => {
  console.error("[make-article-pages] FAILED:", err);
  process.exit(1);
});