/**
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import path from "node:path";
import markdownit from "markdown-it";
// @ts-expect-error -- L'outil ne fournit pas de types.
import webExt from "web-ext";

const LOCALES_DIR = "locales";
const SOURCE_DIR = "src";
const BUILD_DIR = "build";

/**
 * Sélectionne les lignes à conserver en fonction de la boutique.
 *
 * @param {string} description Le description de l'extension.
 * @param {string} store       Le nom de la boutique (`"chrome"`, `"edge"` ou
 *                             `"firefox"`).
 * @returns {string} La partie du texte pour la boutique.
 */
const select = (description, store) => {
    const splits = description.split(
        /(?<command><!-- (?:disable|enable) chrome -->)\n{2}/gv,
    );
    let enabled = true;
    return splits
        .filter((split) => {
            switch (split) {
                case "<!-- disable chrome -->":
                    enabled = "chrome" !== store;
                    return false;
                case "<!-- enable chrome -->":
                    enabled = true;
                    return false;
                default:
                    return enabled;
            }
        })
        .join("")
        .replaceAll(/<!--.*?-->\n?/gsv, "");
};

/**
 * Enlève le formatage du Markdown dans la description.
 *
 * @param {string} description La description en Markdown.
 * @returns {string} La description sans le formatage.
 */
const plain = (description) => {
    return description
        .replaceAll(/\*\*(?<f>\S)(?<r>.*?\S)??\*\*/gsv, "$<f>$<r>")
        .replaceAll(/_(?<f>\S)(?<r>.*?\S)??_/gsv, "$<f>$<r>")
        .replaceAll(/(?<b>[^\n])\n *(?<a>[^\n \-])/gv, "$<b> $<a>");
};

/**
 * Convertit le markdown en HTML.
 *
 * @param {string} description La description en Markdown.
 * @returns {string} La description au format HTML.
 */
const html = (description) => {
    return markdownit().render(description);
};

// Supprimer l'éventuel répertoire de la précédente construction.
await fs.rm(BUILD_DIR, { force: true, recursive: true });

// Créer l'archive zippée de l'extension. Pour la boutique de Edge, il faut
// modifier le manifeste, car la boutique ne supporte pas les propriétés
// `background.script` et `key`.
// https://github.com/microsoft/MicrosoftEdge-Extensions/issues/136
await webExt.cmd.build({
    sourceDir: SOURCE_DIR,
    artifactsDir: BUILD_DIR,
});

// Déplacer et générer les fichiers pour les textes dans les boutiques.
for (const store of ["chrome", "edge", "firefox"]) {
    const buildStoreDir = path.join(BUILD_DIR, store);
    await fs.mkdir(buildStoreDir, { recursive: true });

    for (const lang of await fs.readdir(LOCALES_DIR)) {
        const description = await fs.readFile(
            path.join(LOCALES_DIR, lang, "description.md"),
            "utf8",
        );
        if ("chrome" === store) {
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.txt`),
                plain(select(description, store)),
            );
        } else if ("edge" === store) {
            // Utiliser une description en HTML pour la boutique de Edge.
            // https://learn.microsoft.com/en-us/partner-center/marketplace-offers/supported-html-tags
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.html`),
                html(select(description, store)),
            );
        } else if ("firefox" === store) {
            // Utiliser une description en Markdown pour la boutique de Firefox.
            // https://extensionworkshop.allizom.org/documentation/develop/create-an-appealing-listing/#make-use-of-markdown
            await fs.copyFile(
                path.join(LOCALES_DIR, lang, "summary.txt"),
                path.join(buildStoreDir, `summary-${lang}.txt`),
            );
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.md`),
                select(description, store),
            );
        }
    }
}
