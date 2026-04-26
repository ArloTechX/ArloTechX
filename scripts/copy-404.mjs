import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distIndex = resolve("dist", "index.html");
const dist404 = resolve("dist", "404.html");

if (!existsSync(distIndex)) {
  console.error("copy-404: dist/index.html not found. Run build first.");
  process.exit(1);
}

copyFileSync(distIndex, dist404);
console.log("copy-404: dist/404.html generated.");
