// scripts/optimize-images.js
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { glob } from "glob";

/** CONFIG */
const ARTICLES_DIR = path.resolve("public/articles");
const MAX_WIDTH = parseInt(process.env.MAX_WIDTH || "1920", 10);       // px
const MAX_SIZE_BYTES = parseInt(process.env.MAX_SIZE || `${300*1024}`, 10); // 300 KB
const JPEG_QUALITY = parseInt(process.env.JPEG_QUALITY || "80", 10);
const WEBP_QUALITY = parseInt(process.env.WEBP_QUALITY || "80", 10);
const PNG_COMPRESSION = parseInt(process.env.PNG_COMPRESSION || "9", 10);

/** Helpers */
const fmtKB = b => `${Math.round(b / 1024)} KB`;

async function optimizeImage(file) {
  const stat = await fs.promises.stat(file);
  const ext = path.extname(file).toLowerCase();
  const tmp = file + ".opt.tmp";

  // Read image metadata
  const input = sharp(file, { failOn: "none" });
  const meta = await input.metadata();
  if (!meta || !meta.format) {
    console.warn(`Skip (unknown format): ${file}`);
    return;
  }

  const tooWide = (meta.width || 0) > MAX_WIDTH;
  const tooHeavy = stat.size > MAX_SIZE_BYTES;

  if (!tooWide && !tooHeavy) {
    // Nothing to do
    return;
  }

  console.log(
    `Optimizing: ${path.relative(ARTICLES_DIR, file)} — ` +
    `${meta.width || "?"}x${meta.height || "?"}, ${fmtKB(stat.size)}`
  );

  // Build pipeline
  let pipe = sharp(file, { failOn: "none" })
    .rotate(); // respect EXIF orientation

  if (tooWide) {
    pipe = pipe.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Encode with same format to avoid broken links
  switch (meta.format) {
    case "jpeg":
    case "jpg":
      pipe = pipe.jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true,
        progressive: true,
        chromaSubsampling: "4:2:0"
      });
      break;
    case "png":
      // keep alpha; compress strongly
      pipe = pipe.png({
        compressionLevel: PNG_COMPRESSION,
        palette: true,
        adaptiveFiltering: true
      });
      break;
    case "webp":
      pipe = pipe.webp({
        quality: WEBP_QUALITY,
        effort: 5
      });
      break;
    default:
      // For other raster types (e.g., tiff), re-encode as webp but keep extension?
      // Safer: just skip to avoid changing format silently.
      console.warn(`Skip (unsupported encoder for ${meta.format}): ${file}`);
      return;
  }

  await pipe.toFile(tmp);

  // Only replace if we actually improved size
  const newStat = await fs.promises.stat(tmp);
  if (newStat.size < stat.size) {
    await fs.promises.rename(tmp, file);
    console.log(`→ Saved ${fmtKB(stat.size - newStat.size)} (now ${fmtKB(newStat.size)})`);
  } else {
    await fs.promises.unlink(tmp);
    console.log(`→ No gain, kept original`);
  }
}

async function main() {
  const files = await glob(`${ARTICLES_DIR}/**/*.{jpg,jpeg,png,webp}`);
  if (!files.length) {
    console.log("No article images found.");
    return;
  }
  for (const f of files) {
    try {
      await optimizeImage(f);
    } catch (err) {
      console.error(`Failed: ${f}`, err.message);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});