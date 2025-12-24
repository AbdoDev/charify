![charify logo](./assets/charify.svg)

High-quality image to ASCII art converter for the command line.
npm-ready. No dependencies on Unix tools.

---

## Install

Global install:

```bash
npm install -g charify
```

Run without installing:

```bash
npx charify image.png
```

---

## Usage

```bash
charify image.png
charify image.jpg -w 120
charify image.png -o output.txt
charify image.png --html -o output.html
charify --link https://example.com/image.jpg
```

---

## Options

| Option       | Description                                                |
| ------------ | ---------------------------------------------------------- |
| -w, --width  | Output width (default: 100)                                |
| --ratio      | Height/width ratio (default: 0.55)                         |
| --gamma      | Gamma correction (default: 2.2)                            |
| --invert     | Invert brightness                                          |
| --html       | Export as HTML (only works if output file ends with .html) |
| -o, --output | Output file (.txt or .html)                                |
| --link       | Load image from URL                                        |
| --charset    | Custom ASCII charset                                       |
| --preset     | Use a preset: dense, light, blocks, minimal                |

---

## Presets

| Name    | Description            |
| ------- | ---------------------- |
| dense   | Best quality (default) |
| light   | Softer output          |
| blocks  | Block-style ASCII      |
| minimal | Very simple            |

Example:

```bash
charify image.png --preset blocks
```

---

## Custom Charset

Specify your own charset to control ASCII output characters:

```bash
charify image.png --charset " .:-=+*#%@"
```

---

## HTML Export

To export ASCII art wrapped in an HTML page, use `--html` **with** an output file ending in `.html`:

```bash
charify image.png --html -o art.html
```

If you use `--html` without specifying an output file ending with `.html`, it will be ignored and plain ASCII will be output instead.

---

## Input from URL

Load image from the internet:

```bash
charify --link https://example.com/image.jpg
```

You can combine with other options like `--html` and `-o`:

```bash
charify --link https://example.com/image.jpg --html -o output.html
```

---

## Quality Tuning

Adjust gamma correction and character aspect ratio:

```bash
charify image.png --gamma 2.0 --ratio 0.6
```

---

## Invert Brightness

Invert the brightness mapping:

```bash
charify image.png --invert
```

---

## Local Development

Run directly without installing:

```bash
node bin/charify.js image.png
```

---

## Donate

If you find **charify** useful and want to support development, you can donate any amount here:

[![Donate](https://img.shields.io/badge/Donate-00457C?logo=paypal)](https://paypal.me/Abdoelsayd81)

Thank you for your support!

---

## License

MIT
