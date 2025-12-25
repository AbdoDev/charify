#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { charify, PRESETS, wrapAsHtml } from "./index.js";
import { fetchImage } from "./utils.js";

const program = new Command();

program
  .name("charify")
  .description("Convert images to ASCII art")
  .argument("[image]", "path to image file")
  .option("-u, --url <url>", "fetch image from URL")
  .option("-w, --width <number>", "output width (characters)", parseInt)
  .option("-r, --ratio <number>", "height scaling ratio", parseFloat)
  .option("-g, --gamma <number>", "gamma correction", parseFloat)
  .option(
    "-p, --preset <name>",
    "character preset: dense, light, blocks, minimal"
  )
  .option("-c, --charset <string>", "custom character ramp")
  .option("-i, --invert", "invert brightness")
  .option("--html", "output as standalone HTML")
  .option("-o, --output <file>", "write to file instead of stdout")
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
  );

program.parse();

const opts = program.opts();
const inputPath = program.args[0];

if (!inputPath && !opts.url) {
  console.error("Error: provide an image path or --url");
  process.exit(1);
}

(async () => {
  try {
    const buffer = opts.url
      ? await fetchImage(opts.url)
      : fs.readFileSync(path.resolve(inputPath));

    const ascii = await charify(buffer, {
      width: opts.width,
      ratio: opts.ratio,
      gamma: opts.gamma,
      preset: opts.preset,
      charset: opts.charset,
      invert: opts.invert,
    });

    const output =
      opts.html || (opts.output && opts.output.endsWith(".html"))
        ? wrapAsHtml(ascii)
        : ascii;

    if (opts.output) {
      fs.writeFileSync(opts.output, output, "utf8");
      console.log(`Saved to ${opts.output}`);
    } else {
      process.stdout.write(output);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
