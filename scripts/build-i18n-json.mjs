// scripts/build-i18n-json.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, "../src/i18n");
const OUT_DIR = path.resolve(__dirname, "../public/i18n");

// Files to skip (wrappers, types, etc.)
const SKIP = new Set(["translations.ts", "loader.ts", "jsonLoader.ts", "useI18n.ts", "types.ts"]);

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function isLangFile(file) {
  // match <namespace>.<lang>.ts where lang is el|en
  const base = path.basename(file);
  if (SKIP.has(base)) return false;
  const m = base.match(/^(.+)\.(el|en)\.ts$/);
  return !!m;
}

async function transpileAndLoad(tsFile) {
  const src = await fs.readFile(tsFile, "utf8");
  const { code } = await esbuild.transform(src, {
    loader: "ts",
    format: "esm",
    target: "es2020",
    sourcemap: false,
  });

  // Create a temporary JS file next to the TS, import it as module, then delete it.
  const tmpJs = tsFile.replace(/\.ts$/, `.tmp.i18n.js`);
  await fs.writeFile(tmpJs, code, "utf8");

  try {
    const mod = await import(pathToFileURL(tmpJs).href);
    return mod.default ?? mod;
  } finally {
    await fs.unlink(tmpJs).catch(() => {});
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = [];
  for await (const p of walk(SRC_DIR)) {
    if (p.endsWith(".ts") && isLangFile(p)) files.push(p);
  }
  if (!files.length) {
    console.log(`[i18n-json] No i18n TS files found in ${SRC_DIR}`);
    return;
  }

  for (const tsFile of files) {
    const base = path.basename(tsFile);           // e.g. "aboutPage.el.ts"
    const m = base.match(/^(.+)\.(el|en)\.ts$/);
    if (!m) continue;
    const [ , ns, lang ] = m;
    const obj = await transpileAndLoad(tsFile);

    // Validate it’s plain JSON-serializable
    const json = JSON.stringify(obj, null, 2);

    const outFile = path.join(OUT_DIR, `${ns}.${lang}.json`);
    await fs.writeFile(outFile, json, "utf8");
    console.log(`✓ wrote ${path.relative(process.cwd(), outFile)}`);
  }

  console.log(`\n[i18n-json] Done. Output: /public/i18n/*.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});