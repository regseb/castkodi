/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des musiques issues de Mixcloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.mixcloud/?mode=40&key=";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique Mixcloud.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    return pathname.startsWith("/discover/")
                                    ? null
                                    : PLUGIN_URL + encodeURIComponent(pathname);
};
export const extract = matchPattern(action, "*://www.mixcloud.com/*/*/");
