/**
 * @module
 * @license MIT
 * @see https://www.radio.net/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'URL de la radio.
 *
 * @type {RegExp}
 */
const REGEXP = /,\\"streams\\":\[\{\\"url\\":\\"(?<url>.+?)\\",/u;

/**
 * Extrait les informations nécessaires pour lire une radio sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une radio de Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }
        return result.groups.url;
    }
    return undefined;
};
export const extract = matchPattern(
    action,
    // Lister les noms de domaines (récupérés de la page
    // https://www.radio.net/country-selector).
    "*://*.radio.net/s/*",
    "*://www.radio.dk/s/*",
    "*://www.radio.de/s/*",
    "*://www.radio.es/s/*",
    "*://www.radio.fr/s/*",
    "*://www.radio.it/s/*",
    "*://www.radio.pl/s/*",
    "*://www.radio.pt/s/*",
    "*://www.radio.se/s/*",
    "*://www.radio.at/s/*",
);
