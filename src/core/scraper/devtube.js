/**
 * @module core/scraper/devtube
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube/play/?video_id=";

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
 * @param {string} url L'URL d'une vidéo DevTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://dev.tube/video/*"], function (url) {
    return Promise.resolve(PLUGIN_URL + url.pathname.substring(7));
});
