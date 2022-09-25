/**
 * @module
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
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son de Acast.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const result = REGEXP.exec(pathname);
    const response = await fetch(`${API_URL}/shows/${result.groups.show}` +
                                          `/episodes/${result.groups.episode}`);
    const json = await response.json();
    return json.url;
};
export const extract = matchPattern(action,
    "*://play.acast.com/s/*/*",
    "*://embed.acast.com/*/*");
