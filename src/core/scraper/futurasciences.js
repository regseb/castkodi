/**
 * @module
 * @license MIT
 * @see https://www.futura-sciences.com/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url               L'URL d'une vidéo Futura Sciences.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (url, metadata, context) => {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const srcs = [
        ...Array.from(
            doc.querySelectorAll("iframe[data-src]"),
            (i) => i.dataset.src,
        ),
        ...Array.from(
            doc.querySelectorAll("div.vsly-player[data-iframe]"),
            (d) => d.dataset.iframe,
        ),
    ];

    for (const src of srcs) {
        const file = await metaExtract(new URL(src, url), {
            ...context,
            depth: true,
        });
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extract = matchURLPattern(
    action,
    "https://www.futura-sciences.com/*",
);
