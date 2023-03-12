/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

await fs.cp("node_modules/linkedom/worker.js", "src/polyfill/lib/linkedom.js");
