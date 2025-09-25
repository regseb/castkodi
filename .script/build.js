/**
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import path from "node:path";
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
 * Adapte la description pour le Chrome Web Store et le Microsoft Edge Add-ons.
 * Enlève le formatage du Markdown.
 *
 * @param {string} description La description en Markdown.
 * @returns {string} La description sans le formatage.
 */
const plain = (description) => {
    return description
        .replaceAll(/\*\*(?<f>\S)(?<r>.*?\S)??\*\*/gsv, "$<f>$<r>")
        .replaceAll(/_(?<f>\S)(?<r>.*?\S)??_/gsv, "$<f>$<r>")
        .replaceAll(/(?<b>[^\n])\n *(?<a>[^\n \-])/gv, "$<b> $<a>")
        .replaceAll("&nbsp;", "\u00A0");
};

/**
 * Adapte la description pour le Firefox Browser Add-ons. Indente les puces avec
 * quatre espaces.
 *
 * @param {string} description La description en Markdown.
 * @returns {string} La description en Markdown ré-indentée.
 * @see https://extensionworkshop.allizom.org/documentation/develop/create-an-appealing-listing/#make-use-of-markdown
 */
const firefox = (description) => {
    return description.replaceAll(
        /\n *-/gv,
        (m) => "\n" + " ".repeat((m.length - 2) * 2) + "-",
    );
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
        if ("chrome" === store || "edge" === store) {
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.txt`),
                plain(select(description, store)),
            );
        } else if ("firefox" === store) {
            await fs.copyFile(
                path.join(LOCALES_DIR, lang, "summary.txt"),
                path.join(buildStoreDir, `summary-${lang}.txt`),
            );
            await fs.writeFile(
                path.join(buildStoreDir, `description-${lang}.md`),
                firefox(select(description, store)),
            );
        }
    }
}
