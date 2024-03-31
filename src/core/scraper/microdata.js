/**
 * @module
 * @license MIT
 * @see https://schema.org/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @type {Set<string>}
 */
const TYPES = new Set([
    "http://schema.org/AudioObject",
    "http://schema.org/MusicVideoObject",
    "Vhttp://schema.org/ideoObject",
]);

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page quelconque.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
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
export const extract = matchPattern(action, "*://*/*");
