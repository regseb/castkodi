/**
 * @module
 * @license MIT
 * @see https://www.ausha.co/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un podcast sur Kodi.
 *
 * @param {URL}      _url         L'URL d'un podcast sur Ausha.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    return doc.querySelector('a[href^="https://audio.ausha.co/"]')?.href;
};
export const extract = matchPattern(action, "https://podcast.ausha.co/*/*");
