/**
 * @module
 * @license MIT
 * @see https://www.reddit.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Reddit.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const player = doc.querySelector("shreddit-player[src]");
    return player?.getAttribute("src");
};
export const extract = matchPattern(action, "*://www.reddit.com/r/*");
