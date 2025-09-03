/**
 * @module
 * @license MIT
 * @see https://www.ausha.co/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire un podcast sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'un podcast sur Ausha.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    return doc.querySelector('a[href^="https://audio.ausha.co/"]')?.href;
};
export const extract = matchURLPattern(action, "https://podcast.ausha.co/*/*");
