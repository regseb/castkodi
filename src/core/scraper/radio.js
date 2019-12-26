/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire les données de la radio.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /^ *station: *(\{.+\}),$/mu;

/**
 * Extrait les informations nécessaire pour lire une radio sur Kodi.
 *
 * @param {URL}          _url L'URL d'une radio de Radio.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = URL_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }
        return JSON.parse(result[1]).streamUrls[0].streamUrl;
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
