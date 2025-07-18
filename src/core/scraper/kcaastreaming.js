/**
 * @module
 * @license MIT
 * @see https://live.kcaastreaming.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      url           L'URL du _live_ de KCAA Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = async (url, metadata) => {
    const doc = await metadata.html();
    return new URL(doc.querySelector("#show a").getAttribute("href"), url).href;
};
export const extract = matchPattern(action, "*://live.kcaastreaming.com/");
