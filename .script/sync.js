/**
 * @module
 */

import fs from "node:fs/promises";

await fs.cp("node_modules/webextension-polyfill/dist/browser-polyfill.js",
            "src/polyfill/lib/browser-polyfill.js");
