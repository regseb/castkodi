/**
 * @module core/scraper/acestream
 */

/**
 * L'URL de l'extension Plexus pour lire des liens AceStream.
 *
 * @constant {string} PLUGIN_URL
 */
const PLUGIN_URL = "plugin://program.plexus/?mode=1&name=&url=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {String} url L'URL d'un lien AceStream.
 * @return {Promise} L'URL du fichier.
 */
rules.set(["acestream://*"], function (url) {
    return Promise.resolve(PLUGIN_URL + encodeURIComponent(url.toString()));
});
