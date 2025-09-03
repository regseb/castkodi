/**
 * @module
 * @license MIT
 * @see https://rumble.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Rumble pour les vidéos.
 *
 * @type {string}
 */
const API_URL = "https://rumble.com/embedJS/u3/?request=video";

/**
 * Extrait les informations nécessaires pour lire une vidéo embarquée sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo embarquée de Rumble avec
 *                            l'identifiant.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ id }) => {
    const response = await fetch(`${API_URL}&v=${id}`);
    const json = await response.json();
    return false === json ? undefined : Object.values(json.ua).at(-1)[0];
};
export const extract = matchURLPattern(action, "https://rumble.com/embed/:id");
