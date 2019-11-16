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
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'un torrent ou d'un magnet.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
rules.set(["*://*/*.torrent", "magnet:*"], async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
});
