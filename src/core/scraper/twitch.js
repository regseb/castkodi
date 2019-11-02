/**
 * @module
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
 * @constant {Map.<(Array.<string>|string), Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Twitch.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/videos/*", "*://go.twitch.tv/videos/*",
    "*://m.twitch.tv/videos/*"
], function ({ pathname }) {
    return PLUGIN_URL + "&video_id=" + pathname.slice(8);
});

/**
 * Extrait les informations nécessaire pour lire un clip sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'un clip Twitch.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://clips.twitch.tv/*", function ({ pathname }) {
    return PLUGIN_URL + "&slug=" + pathname.slice(1);
});

/**
 * Extrait les informations nécessaire pour lire un clip sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'un clip d'une chaine Twitch.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*/clip/*", "*://go.twitch.tv/*/clip/*",
    "*://m.twitch.tv/*/clip/*"
], function ({ pathname }) {
    return PLUGIN_URL + "&slug=" +
           pathname.slice(pathname.lastIndexOf("/") + 1);
});

/**
 * Extrait les informations nécessaire pour lire un <em>live</em> sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'un <em>live</em> Twitch.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*", "*://go.twitch.tv/*", "*://m.twitch.tv/*"
], function ({ pathname }) {
    return PLUGIN_URL + "&channel_name=" + pathname.slice(1);
});
