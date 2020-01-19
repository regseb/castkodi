/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire les données de la vidéo.
 *
 * @constant {RegExp}
 */
const DATA_REGEXP = /"mp4":(\{[^}]+\})/u;

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url L'URL d'une video de Ultimedia.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = DATA_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }
        return Object.values(JSON.parse(result[1])).shift();
    }
    return null;
};
export const extract = matchPattern(action,
    "*://www.ultimedia.com/deliver/generic/iframe/*");
