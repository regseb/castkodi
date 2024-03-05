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
    // Supprimer les répertoires générés.
    ".stryker/",
    "build/",
    "jsdocs/",
    "node_modules/",
    // Supprimer les autres lockfiles.
    "bun.lockb",
    "pnpm-lock.yaml",
    "yarn.lock",
];

for (const path of PATHS) {
    await fs.rm(path, { force: true, recursive: true });
}
