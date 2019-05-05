/**
 * @module core/scraper/twitch
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.twitch/?mode=play";

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
 * @param {string} url L'URL d'une vidéo Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/videos/*", "*://go.twitch.tv/videos/*",
    "*://m.twitch.tv/videos/*"
], function (url) {
    return Promise.resolve(
        PLUGIN_URL + "&video_id=" + url.pathname.substring(8));
});

/**
 * Extrait les informations nécessaire pour lire le clip sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un clip Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://clips.twitch.tv/*"], function (url) {
    return Promise.resolve(PLUGIN_URL + "&slug=" + url.pathname.substring(1));
});

/**
 * Extrait les informations nécessaire pour lire le clip sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un clip d'une chaine Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*/clip/*", "*://go.twitch.tv/*/clip/*",
    "*://m.twitch.tv/*/clip/*"
], function (url) {
    return Promise.resolve(
        PLUGIN_URL + "&slug=" +
        url.pathname.substring(url.pathname.indexOf("/clip/", 1) + 6));
});

/**
 * Extrait les informations nécessaire pour lire le <em>live</em> sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un <em>live</em> Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*", "*://go.twitch.tv/*", "*://m.twitch.tv/*"
], function (url) {
    return Promise.resolve(
        PLUGIN_URL + "&channel_name=" + url.pathname.substring(1));
});
