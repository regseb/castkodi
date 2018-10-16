/**
 * @module core/scraper/torrent
 */

/**
 * L'URL de l'extension Elementum pour lire des torrents ou des magnets.
 *
 * @constant {string} PLUGIN_URL
 */
const PLUGIN_URL = "plugin://plugin.video.elementum/play?uri=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {string} url L'URL d'un torrent ou d'un magnet.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://*/*.torrent", "magnet:*"], function (url) {
    return Promise.resolve(PLUGIN_URL + encodeURIComponent(url.toString()));
});
