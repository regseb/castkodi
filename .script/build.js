/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";
import webExt from "web-ext";

/**
 * @typedef {import("jsdom").Node} Node
 */

const LOCALES_DIR = "locales";
const SOURCE_DIR = "src";
const BUILD_DIR = "build";

/**
 * Extrait le texte d'un document HTML.
 *
 * @param {string} html Le document HTML.
 * @returns {string} Le texte extrait.
 */
const plain = function (html) {
    let enabled = true;

    /**
     * Extrait le texte d'un élément HTML.
     *
     * @param {Node} node L'élément HTML.
     * @returns {string} Le texte extrait.
     */
    const extract = function (node) {
        switch (node.nodeName) {
            case "#comment":
                switch (node.nodeValue?.trim()) {
                    case "disable chrome":
                        enabled = false;
                        break;
                    case "enable chrome":
                        enabled = true;
                        break;
                    default:
                    // Ignorer les autres commentaires.
                }
                return "";
            case "#text":
                return enabled ? node?.nodeValue ?? "" : "";
            default:
                return Array.from(node.childNodes).map(extract).join("");
        }
    };

    const DOMParser = new JSDOM().window.DOMParser;
    const doc = new DOMParser().parseFromString(html, "text/html");
    return extract(doc).trim();
};

// Créer l'archive de l'extension.
await webExt.cmd.build({
    sourceDir: SOURCE_DIR,
    artifactsDir: BUILD_DIR,
    overwriteDest: true,
});

// Déplacer et générer les fichiers pour les textes dans les boutiques.
for (const store of ["chrome", "firefox"]) {
    const buildStoreDir = path.join(BUILD_DIR, store);
    await fs.mkdir(buildStoreDir, { recursive: true });

    for (const lang of await fs.readdir(LOCALES_DIR)) {
        if ("chrome" === store) {
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.txt`),
                plain(
                    await fs.readFile(
                        path.join(LOCALES_DIR, lang, "description.tpl"),
                        "utf8",
                    ),
                ),
            );
        } else if ("firefox" === store) {
            await fs.cp(
                path.join(LOCALES_DIR, lang, "summary.txt"),
                path.join(buildStoreDir, `summary-${lang}.txt`),
            );

            await fs.cp(
                path.join(LOCALES_DIR, lang, "description.tpl"),
                path.join(buildStoreDir, `description-${lang}.tpl`),
            );
        }
    }
}
