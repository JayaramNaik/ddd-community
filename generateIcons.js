// ─────────────────────────────────────────────────────────────
//  generateIcons.js — Run once to generate PWA icons
//  Run: node generateIcons.js
//  Requires: npm install canvas
// ─────────────────────────────────────────────────────────────

import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = "./public/icons";

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, "#020818");
  bg.addColorStop(1, "#0c1445");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Accent circle
  const circle = ctx.createRadialGradient(size * 0.5, size * 0.4, 0, size * 0.5, size * 0.4, size * 0.4);
  circle.addColorStop(0, "rgba(56,189,248,0.25)");
  circle.addColorStop(1, "transparent");
  ctx.fillStyle = circle;
  ctx.fillRect(0, 0, size, size);

  // Text "DDD"
  const fontSize = size * 0.22;
  ctx.font       = `900 ${fontSize}px serif`;
  ctx.textAlign  = "center";
  ctx.textBaseline = "middle";

  // Gradient text
  const textGrad = ctx.createLinearGradient(size * 0.2, 0, size * 0.8, 0);
  textGrad.addColorStop(0, "#38bdf8");
  textGrad.addColorStop(1, "#818cf8");
  ctx.fillStyle = textGrad;
  ctx.fillText("DDD", size * 0.5, size * 0.42);

  // Subtitle
  const subSize = size * 0.08;
  ctx.font      = `600 ${subSize}px sans-serif`;
  ctx.fillStyle = "rgba(148,163,184,0.8)";
  ctx.fillText("Community", size * 0.5, size * 0.65);

  // Save
  const buffer = canvas.toBuffer("image/png");
  const path   = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(path, buffer);
  console.log(`✅ Generated icon-${size}.png`);
}

console.log("🎉 All icons generated in public/icons/");
