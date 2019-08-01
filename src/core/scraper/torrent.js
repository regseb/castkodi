/**
 * @module
 */

/**
 * L'URL de l'extension Elementum pour lire des torrents ou des magnets.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.elementum/play?uri=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un torrent ou d'un magnet.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://*/*.torrent", "magnet:*"], function ({ href }) {
    return Promise.resolve(PLUGIN_URL + encodeURIComponent(href));
});
