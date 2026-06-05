/**
 * Generate PNG favicons from the Janeiro Tour balloon SVG.
 * Run: node scripts/src/gen-favicons.mjs
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const publicDir = path.join(root, "artifacts/janeiro-tour/public");

const svgPath = path.join(publicDir, "favicon.svg");
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: "favicon-16x16.png",         size: 16 },
  { name: "favicon-32x32.png",         size: 32 },
  { name: "apple-touch-icon.png",      size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

for (const { name, size } of sizes) {
  const outPath = path.join(publicDir, name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`✓ ${name} (${size}×${size})`);
}

console.log("All favicon PNGs generated.");
