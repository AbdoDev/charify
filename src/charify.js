import sharp from "sharp";
import { PRESETS, DEFAULTS } from "./constants.js";
import { SharpMissingError } from "./errors.js";

export async function convertToAscii(buffer, options = {}) {
  if (!sharp) {
    throw new SharpMissingError();
  }

  const {
    width = DEFAULTS.width,
    ratio = DEFAULTS.ratio,
    gamma = DEFAULTS.gamma,
    preset = DEFAULTS.preset,
    charset,
    invert = false,
  } = options;

  const chars = charset || PRESETS[preset] || PRESETS.dense;
  const rampLength = chars.length - 1;

  let image = sharp(buffer)
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .grayscale();

  const { height: originalHeight } = await image.metadata();
  const targetHeight = Math.round(originalHeight * ratio);

  image = image.resize(width, targetHeight);

  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Normalize contrast
  let min = 255;
  let max = 0;
  for (const value of data) {
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const range = max - min || 1;
  const normalized = Buffer.from(
    data.map((v) => Math.round(((v - min) / range) * 255))
  );

  // Build ASCII
  let result = "";
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = y * info.width + x;
      let intensity = normalized[idx];
      intensity = Math.pow(intensity / 255, 1 / gamma) * 255;

      const charIndex = Math.floor((intensity / 255) * rampLength);
      const finalIndex = invert ? rampLength - charIndex : charIndex;

      result += chars[finalIndex];
    }
    result += "\n";
  }

  return result;
}
