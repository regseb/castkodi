/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire les données de la radio.
 *
 * @type {RegExp}
 */
const URL_REGEXP = /^ *station: *(?<station>\{.+\}),$/mu;

/**
 * Extrait les informations nécessaire pour lire une radio sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une radio de Radio.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = URL_REGEXP.exec(script.text);
        if (null !== result) {
            return JSON.parse(result.groups.station).streams[0].url;
        }
    }
    return null;
};
export const extract = matchPattern(action,
    "*://*.radio.net/s/*",
    "*://www.radio.de/s/*",
    "*://www.radio.at/s/*",
    "*://www.radio.fr/s/*",
    "*://www.radio.pt/s/*",
    "*://www.radio.es/s/*",
    "*://www.radio.dk/s/*",
    "*://www.radio.se/s/*",
    "*://www.radio.it/s/*",
    "*://www.radio.pl/s/*");
