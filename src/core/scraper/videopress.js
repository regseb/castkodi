/**
 * @module
 * @license MIT
 * @see https://videopress.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de VideoPress.
 *
 * @type {string}
 */
const API_URL = "https://public-api.wordpress.com/rest/v1.1/videos/";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo de VideoPress avec
 *                            l'identifiant.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ id }) => {
    const response = await fetch(API_URL + id);
    if (response.ok) {
        const json = await response.json();
        return json.original;
    }
    return undefined;
};
export const extract = matchURLPattern(
    action,
    "https://videopress.com/v/:id",
    "https://videopress.com/embed/:id",
);
