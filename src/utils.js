import https from "https";

export function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

export function wrapAsHtml(ascii) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>ASCII Art</title>
  <style>
    body { 
      margin: 20px; 
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
