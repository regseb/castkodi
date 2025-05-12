/**
 * @module
 * @license MIT
 * @see https://rumble.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Rumble pour les vidéos.
 *
 * @type {string}
 */
const API_URL = "https://rumble.com/embedJS/u3/?request=video";

/**
 * Extrait les informations nécessaires pour lire une vidéo embarquée sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo embarquée de Rumble.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ pathname }) => {
    const response = await fetch(`${API_URL}&v=${pathname.slice(7)}`);
    const json = await response.json();
    return false === json ? undefined : Object.values(json.ua).at(-1)[0];
};
export const extract = matchPattern(action, "*://rumble.com/embed/*");
