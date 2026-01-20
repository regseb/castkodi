/**
 * @module
 * @license MIT
 * @see https://www.ultimedia.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'expression rationnelle pour extraire les données de la vidéo.
 *
 * @type {RegExp}
 */
const DATA_REGEXP = /"mp4":(?<mp4>\{[^\}]+\})/v;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo de Ultimedia.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = DATA_REGEXP.exec(script.text);
        if (null !== result) {
            return Object.values(JSON.parse(result.groups.mp4)).shift();
        }
    }
    return undefined;
};
export const extract = matchURLPattern(
    action,
    "https://www.ultimedia.com/deliver/generic/iframe/*",
);
