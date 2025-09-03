/**
 * @module
 * @license MIT
 * @see https://www.arte.tv/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Arte.
 *
 * @type {string}
 */
const API_URL = "https://api.arte.tv/api/player/v2/config";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo Arte avec la langue et
 *                            l'identifiant de la vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ lang, id }) => {
    const response = await fetch(`${API_URL}/${lang}/${id}`);
    const json = await response.json();

    return json.data.attributes.streams[0]?.url;
};
export const extract = matchURLPattern(
    action,
    "https://www.arte.tv/:lang/videos/:id/*",
);
