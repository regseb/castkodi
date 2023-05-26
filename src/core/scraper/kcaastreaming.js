/**
 * @module
 * @license MIT
 * @see https://live.kcaastreaming.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      url           L'URL du <em>live</em> de KCAA Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (url, metadata) {
    const doc = await metadata.html();
    return new URL(doc.querySelector("#show a").getAttribute("href"), url).href;
};
export const extract = matchPattern(action, "*://live.kcaastreaming.com/");
