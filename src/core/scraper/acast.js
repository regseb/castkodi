/**
 * @module
 * @license MIT
 * @see https://www.acast.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Acast.
 *
 * @type {string}
 */
const API_URL = "https://feeder.acast.com/api/v1";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'un son de Acast avec le podcast et
 *                            l'épisode.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ show, episode }) => {
    const response = await fetch(
        `${API_URL}/shows/${show}/episodes/${episode}`,
    );
    const json = await response.json();
    return json.url;
};
export const extract = matchURLPattern(
    action,
    "https://shows.acast.com/:show/episodes/:episode",
    "https://embed.acast.com/$/:show/:episode",
);
