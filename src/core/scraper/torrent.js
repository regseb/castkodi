/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension Elementum pour lire des torrents ou des magnets.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.elementum/play?uri=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'un torrent ou d'un magnet.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
export const extract = matchPattern(action, "*://*/*.torrent", "magnet:*");
