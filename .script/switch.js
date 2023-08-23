/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import process from "node:process";

const browser = process.argv[2];

// Utiliser des manifestes différents pour Chromium et Firefox, car :
// - Chromium ne gère pas les Event Pages ; https://crbug.com/1418934
// - Firefox ne gère pas les Services Worker. https://bugzil.la/1573659
// https://github.com/w3c/webextensions/issues/282
await fs.cp(`src/manifest-${browser}.json`, "src/manifest.json");
