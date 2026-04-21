import fs from "node:fs";
import path from "node:path";

const outputDir = path.resolve("dist/public");
const indexPath = path.join(outputDir, "index.html");
const notFoundPath = path.join(outputDir, "404.html");
const noJekyllPath = path.join(outputDir, ".nojekyll");

if (!fs.existsSync(indexPath)) {
  console.error("GitHub Pages preparation failed: dist/public/index.html was not found.");
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
fs.writeFileSync(noJekyllPath, "");

console.log("GitHub Pages files prepared in dist/public");
