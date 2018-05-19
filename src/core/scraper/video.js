/**
 * @module core/scraper/video
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo.
 * @return {Promise} L'URL du fichier.
 */
rules.set([
    "*://*/*asf", "*://*/*avi", "*://*/*flv", "*://*/*mkv",  "*://*/*mov",
    "*://*/*m4v", "*://*/*mp4", "*://*/*ogv", "*://*/*webm", "*://*/*wmv"
], function (url) {
    return Promise.resolve(url.toString());
});
