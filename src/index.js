export { convertToAscii as charify } from "./charify.js";
export { PRESETS } from "./constants.js";
export { wrapAsHtml } from "./utils.js";

export default function (buffer, options) {
  return charify(buffer, options);
}
