/**
 * @module
 * @license MIT
 * @see https://schema.org/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @type {Set<string>}
 */
const TYPES = new Set([
    "http://schema.org/AudioObject",
    "http://schema.org/MusicVideoObject",
    "http://schema.org/VideoObject",
]);

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page quelconque.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    for (const scope of doc.querySelectorAll("*[itemscope][itemtype]")) {
        if (!TYPES.has(scope.getAttribute("itemtype"))) {
            continue;
        }
        const meta = scope.querySelector('meta[itemprop="url"]');
        if (null === meta) {
            continue;
        }
        return meta.content;
    }
    return undefined;
};
export const extract = matchURLPattern(action, "*://*/*");
