/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des sons issus de Bandcamp.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.kxmxpxtx.bandcamp/?mode=url&url=";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'un son Bandcamp.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
export const extract = matchPattern(action,
    "*://*.bandcamp.com/*");
