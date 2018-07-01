/**
 * @module core/scraper/devtube
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string} PLUGIN_VIDEO_URL
 */
const PLUGIN_VIDEO_URL = "plugin://plugin.video.youtube/play/?video_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo DevTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://dev.tube/video/*"], function (url) {
    return Promise.resolve(PLUGIN_VIDEO_URL + url.pathname.substr(7));
});
