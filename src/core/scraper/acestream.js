/**
 * @module core/scraper/acestream
 */

/**
 * L'URL de l'extension Plexus pour lire des liens Ace Stream.
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
 * @param {string} url L'URL d'un lien Ace Stream.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["acestream://*"], function (url) {
    return Promise.resolve(PLUGIN_URL + encodeURIComponent(url.toString()));
});
