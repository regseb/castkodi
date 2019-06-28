/**
 * @module core/scraper/mixcloud
 */

/**
 * L'URL de l'extension pour lire des musiques issues de Mixcloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.mixcloud/?mode=40&key=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une musique Mixcloud.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.mixcloud.com/*/*/"], function ({ pathname }) {
    if (pathname.startsWith("/discover/")) {
        return Promise.resolve(null);
    }

    return Promise.resolve(PLUGIN_URL + encodeURIComponent(pathname));
});
