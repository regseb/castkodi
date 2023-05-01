/**
 * @module
 * @license MIT
 * @see https://www.arte.tv/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Arte.
 *
 * @type {string}
 */
const API_URL = "https://api.arte.tv/api/player/v2/config";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Arte.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const [, lang, , id] = pathname.split("/");
    const response = await fetch(`${API_URL}/${lang}/${id}`);
    const json = await response.json();

    return json.data.attributes.streams?.[0].url;
};
export const extract = matchPattern(action, "*://www.arte.tv/*/videos/*/*");
