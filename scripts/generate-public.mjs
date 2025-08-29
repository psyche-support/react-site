// scripts/generate-public.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Source-of-truth for static assets you edit:
const SRC_DIR = path.resolve(__dirname, "../assets/public");

// Vite will read from here. We fully regenerate this dir:
const OUT_DIR = path.resolve(__dirname, "../public");

// Basic utils
async function rimraf(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}
async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}
async function copyDir(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      await ensureDir(d);
      await copyDir(s, d);
    } else if (e.isFile()) {
      await copyFile(s, d);
    }
  }
}

// Optional: auto-write a manifest if you don’t keep one in assets/public
async function writeDefaultManifest(destDir) {
  const manifest = {
    name: "Psyche Support",
    short_name: "Psyche",
    start_url: "/",
    display: "standalone",
    background_color: "#0E8AA4",
    theme_color: "#0E8AA4",
    icons: [
      { src: "/favicons/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicons/favicon-310x310.png", sizes: "310x310", type: "image/png" }
    ]
  };
  const file = path.join(destDir, "manifest.webmanifest");
  try {
    await fs.access(file);
    // If you maintain one in assets/public, leave it as-is.
  } catch {
    await fs.writeFile(file, JSON.stringify(manifest, null, 2), "utf8");
  }
}

async function main() {
  // 1) Clean
  await rimraf(OUT_DIR);
  await ensureDir(OUT_DIR);

  // 2) Copy everything from assets/public → public
  try {
    await copyDir(SRC_DIR, OUT_DIR);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.warn(`[generate-public] Source not found: ${SRC_DIR} — creating empty public/`);
    } else {
      throw e;
    }
  }

  // 4) Ensure a basic web manifest exists (if you don’t provide one)
  await writeDefaultManifest(OUT_DIR);

  console.log(`[generate-public] Rebuilt ${OUT_DIR} from ${SRC_DIR}`);
}

main().catch((e) => {
  console.error("[generate-public] Failed:", e);
  process.exit(1);
});