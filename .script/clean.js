/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

const paths = await fs.readFile(".gitignore", "utf8");
paths
    .split("\n")
    // Ignorer les lignes vides et les commentaires.
    .filter((p) => "" !== p && !p.startsWith("#"))
    // Enlever la barre oblique commençant le chemin.
    .map((p) => p.slice(1))
    .forEach((p) => fs.rm(p, { force: true, recursive: true }));
