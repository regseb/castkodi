/**
 * @module
 * @license MIT
 * @see https://www.blogtalkradio.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un son Blog Talk Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const meta = doc.querySelector('meta[property="twitter:player:stream"]');
    return meta?.content;
};
export const extract = matchPattern(action, "*://www.blogtalkradio.com/*");
