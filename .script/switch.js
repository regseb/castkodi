/**
 * @module
 */

import fs from "node:fs/promises";

const browser = process.argv[2];

await fs.cp(`src/manifest-${browser}.json`, "src/manifest.json");
