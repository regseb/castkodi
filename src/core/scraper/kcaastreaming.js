/**
 * @module
 * @license MIT
 * @see https://live.kcaastreaming.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} url           L'URL du _live_ de KCAA Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = async (url, metadata) => {
    const doc = await metadata.html();
    return new URL(doc.querySelector("#show a").getAttribute("href"), url).href;
};
export const extract = matchURLPattern(
    action,
    "https://live.kcaastreaming.com/",
);
