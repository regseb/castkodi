/**
 * @module core/scraper/vimeo
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo Vimeo.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://vimeo.com/*"], function ({ pathname }) {
    if ((/^\/[0-9]+$/u).test(pathname)) {
        return Promise.resolve(PLUGIN_URL + pathname.substring(1));
    }

    return Promise.resolve(null);
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL du lecteur de Vimeo avec une vidéo.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://player.vimeo.com/video/*"], function ({ pathname }) {
    if ((/^\/video\/[0-9]+$/u).test(pathname)) {
        return Promise.resolve(PLUGIN_URL + pathname.substring(7));
    }

    return Promise.resolve(null);
});
