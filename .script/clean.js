/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

/**
 * La liste des répertoires et des fichiers à supprimer.
 *
 * @type {string[]}
 */
const PATHS = [
    // Supprimer les répertoires et les fichiers générés.
    ".stryker/",
    "build/",
    "jsdocs/",
    "node_modules/",
    "src/manifest.json",
    // Supprimer les autres lockfiles.
    "pnpm-lock.yaml",
    "yarn.lock",
];

for (const path of PATHS) {
    await fs.rm(path, { force: true, recursive: true });
}
