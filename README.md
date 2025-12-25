![charify logo](./assets/charify.svg)

# charify

High-quality image to ASCII art converter – CLI tool and npm library.

Powered by `sharp` for excellent image processing. No external Unix tools required.

---

## Install

Global install (recommended for CLI usage):

```batch
npm install -g charify
```

Run without installing:

```batch
npx charify image.png
```

Install as a library in your project:

```batch
npm install charify
```

---

## CLI Usage

```batch
charify <image> [options]
charify --url <image-url> [options]
```

## Examples

### Basic conversion (prints to terminal)

```batch
charify photo.jpg
```

### Wider output

```batch
charify photo.jpg -w 140
```

### Save to file

```batch
charify photo.jpg -o art.txt
```

### Export as standalone HTML

```batch
charify photo.jpg --html -o art.html
```

### From URL

```batch
charify --url https://example.com/photo.jpg --preset blocks -o blocks.html
```

### Invert colors with custom preset

```batch
charify photo.jpg --invert --preset light
```

### CLI Options

| Option                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `<image>`             | Path to local image file                                   |
| `-u, --url <url>`     | Fetch image from URL                                       |
| `-w, --width <n>`     | Output width in characters (default: 100)                  |
| `-r, --ratio <n>`     | Height-to-width ratio for character aspect (default: 0.55) |
| `-g, --gamma <n>`     | Gamma correction (default: 2.2)                            |
| `-p, --preset <name>` | Preset charset: dense (default), light, blocks, minimal    |
| `-c, --charset <str>` | Custom character ramp (e.g. " .:-=+\*#%@")                 |
| `-i, --invert`        | Invert brightness mapping                                  |
| `--html`              | Output as standalone HTML page                             |
| `-o, --output <file>` | Write result to file (.txt for plain, .html for HTML)      |

Note: --html is automatically enabled if the output filename ends with .html.

---

## Library Usage

Import and use directly in Node.js projects:

```js
import charify, { PRESETS, wrapAsHtml } from "charify";
import fs from "fs";

const buffer = fs.readFileSync("photo.jpg");

const ascii = await charify(buffer, {
  width: 140,
  preset: "blocks",
  invert: true,
  gamma: 2.0,
  ratio: 0.6,
});

console.log(ascii);

// Or generate HTML manually
const html = wrapAsHtml(ascii);
fs.writeFileSync("art.html", html);
```

### Exported API

- `charify(buffer, options?)` – main function (default export)
- `PRESETS` – object with built-in charsets (dense, light, blocks, minimal)
- `wrapAsHtml(asciiString)` – utility to wrap plain ASCII in a minimal standalone HTML page

Requires sharp at runtime (peer dependency). Install it in your project:

```batch
npm install sharp
```

---

## Presets

| Preset  | Charset        | Best for                     |
| ------- | -------------- | ---------------------------- |
| dense   | █▓▒░@%#\*+=-:. | Highest detail (default)     |
| light   | #\*+=-:.       | Softer, less dense output    |
| blocks  | █▓▒░           | Classic blocky ASCII style   |
| minimal | #.+            | Extremely simple, clean look |

Example:

```batch
charify photo.jpg --preset blocks
```

### Custom Charset

Override with your own ramp (dark → bright):

```batch
charify photo.jpg --charset " .:-=+\*#%@"
```

---

## HTML Export

Creates a ready-to-open HTML file with green-on-black terminal styling:

```batch
charify photo.jpg --html -o my-art.html
```

# or simply

```batch
charify photo.jpg -o my-art.html # auto-detects .html extension
```

---

## Browser Demo

Try charify instantly in the browser!

Open `demo/index.html` (included in the package):

- Drag & drop images
- Live preview
- Adjustable width, preset, invert
- Download as HTML

No build step required – uses Tailwind CSS via CDN.

---

## Local Development

```batch
git clone https://github.com/abdodev/charify.git
cd charify
npm install
```

# Run CLI directly

```batch
node src/cli.js image.png
```

# Test library

```batch
node -e "import { charify } from './src/index.js'; /_ your test code _/"
```

---

## ⭐ Star on GitHub

If you like charify, please star the repo!

[![GitHub stars](https://img.shields.io/github/stars/abdodev/charify?style=social)](https://github.com/abdodev/charify)

It helps others discover the project.

---

## Donate

If charify saves you time or brings you joy, consider supporting development:

[![Donate](https://img.shields.io/badge/Donate-PayPal-00457C?logo=paypal)](https://paypal.me/Abdoelsayd81)

Thank you ❤️

---

## License

MIT
