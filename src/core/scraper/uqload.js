/**
 * @module
 * @license MIT
 * @see https://uqload.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire les données de la vidéo.
 *
 * @type {RegExp}
 */
const DATA_REGEXP = /sources: \["(?<source>.*\/v.mp4)"\],/u;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url           L'URL d'une vidéo de Uqload.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async function (url, metadata) {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = DATA_REGEXP.exec(script.text);
        if (null !== result) {
            return result.groups.source + `|Referer=${url.href}`;
        }
    }
    return undefined;
};
// Ne pas filter sur le TLD, car il change régulièrement.
export const extract = matchPattern(action, "*://uqload.*/*.html");
