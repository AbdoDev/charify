#!/usr/bin/env node

import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";
import { Command } from "commander";

/* ================= CONFIG ================= */

const PRESETS = {
  dense: "█▓▒░@%#*+=-:. ",
  light: "#*+=-:. ",
  blocks: "█▓▒░ ",
  minimal: "#.+ ",
};

const DEFAULT_PRESET = "dense";
const DEFAULT_WIDTH = 100;
const DEFAULT_RATIO = 0.55;
const DEFAULT_GAMMA = 2.2;

/* ================= CLI ================= */

const program = new Command();

program
  .name("charify")
  .description("Convert images to ASCII art")
  .argument("[image]", "local image path")
  .option("--link <url>", "image URL")
  .option("-w, --width <number>", "output width", String(DEFAULT_WIDTH))
  .option("--ratio <number>", "height/width ratio", String(DEFAULT_RATIO))
  .option("--gamma <number>", "gamma correction", String(DEFAULT_GAMMA))
  .option("--charset <chars>", "custom ASCII charset")
  .option("--preset <name>", "preset: dense | light | blocks | minimal")
  .option("--invert", "invert brightness")
  .option(
    "--html",
    "export as HTML (only works if output file ends with .html)"
  )
  .option("-o, --output <file>", "output file (.txt or .html)");
program
  .addHelpText(
    "before",
    `
       _                _  __       
   ___| |__   __ _ _ __(_)/ _|_   _ 
  / __| '_ \\ / _' | '__| | |_| | | |
 | (__| | | | (_| | |  | |  _| |_| |
  \\___|_| |_|\\__,_|_|  |_|_|  \\__, |
                              |___/ 
`
  )
  .parse(process.argv);

const opts = program.opts();
const inputPath = program.args[0];

if (!opts.link && !inputPath) {
  console.error("❌ Provide an image path or --link URL");
  process.exit(1);
}

/* ================= HELPERS ================= */

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
}

function gammaCorrect(v, gamma) {
  return Math.pow(v / 255, 1 / gamma) * 255;
}

function normalizeBuffer(buffer) {
  let min = 255,
    max = 0;
  for (const v of buffer) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (max === min) return buffer;

  return Buffer.from(
    buffer.map((v) => Math.round(((v - min) / (max - min)) * 255))
  );
}

function toAscii(buffer, width, charset, invert, gamma) {
  let out = "";
  const len = charset.length - 1;

  for (let i = 0; i < buffer.length; i += width) {
    for (let x = 0; x < width; x++) {
      let v = buffer[i + x];
      v = gammaCorrect(v, gamma);
      const idx = Math.floor((v / 255) * len);
      out += invert ? charset[len - idx] : charset[idx];
    }
    out += "\n";
  }
  return out;
}

function wrapHtml(ascii) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>charify</title>
<style>
body {
  background: #000;
  color: #0f0;
  font-family: monospace;
  white-space: pre;
  line-height: 1;
}
</style>
</head>
<body>${ascii}</body>
</html>`;
}

/* ================= MAIN ================= */

(async () => {
  try {
    const width = Number(opts.width);
    const ratio = Number(opts.ratio);
    const gamma = Number(opts.gamma);

    const charset =
      opts.charset || PRESETS[opts.preset] || PRESETS[DEFAULT_PRESET];

    const inputBuffer = opts.link
      ? await fetchImage(opts.link)
      : fs.readFileSync(path.resolve(inputPath));

    let sharpInstance = sharp(inputBuffer)
      .resize({
        width,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .grayscale();

    const metadata = await sharpInstance.metadata();

    const adjustedHeight = Math.round(metadata.height * ratio);

    sharpInstance = sharpInstance.resize(width, adjustedHeight);

    const { data, info } = await sharpInstance
      .raw()
      .toBuffer({ resolveWithObject: true });

    const normalizedData = normalizeBuffer(data);

    const ascii = toAscii(
      normalizedData,
      info.width,
      charset,
      opts.invert,
      gamma
    );

    let output = ascii;
    const wantHtml =
      opts.html && opts.output && opts.output.toLowerCase().endsWith(".html");

    if (wantHtml) {
      output = wrapHtml(ascii);
    } else if (
      opts.html &&
      (!opts.output || !opts.output.toLowerCase().endsWith(".html"))
    ) {
      if (!opts.output) {
        output = ascii;
      } else {
        console.warn(
          "⚠ Warning: --html ignored because output file extension is not .html"
        );
        output = ascii;
      }
    }

    if (opts.output) {
      fs.writeFileSync(opts.output, output, "utf8");
      console.log("✔ Saved:", opts.output);
    } else {
      process.stdout.write(output);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
