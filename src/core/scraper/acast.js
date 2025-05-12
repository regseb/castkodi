/**
 * @module
 * @license MIT
 * @see https://www.acast.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire le podcast et l'épisode de l'URL.
 *
 * @type {RegExp}
 */
const REGEXP = /^(?:\/s)?\/(?<show>[^/]+)\/(?<episode>[^/]+)/u;

/**
 * L'URL de l'API de Acast.
 *
 * @type {string}
 */
const API_URL = "https://feeder.acast.com/api/v1";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son de Acast.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ pathname }) => {
    const result = REGEXP.exec(pathname);
    const response = await fetch(
        `${API_URL}/shows/${result.groups.show}` +
            `/episodes/${result.groups.episode}`,
    );
    const json = await response.json();
    return json.url;
};
export const extract = matchPattern(
    action,
    "*://play.acast.com/s/*/*",
    "*://embed.acast.com/*/*",
);
