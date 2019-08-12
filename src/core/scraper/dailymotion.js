/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Dailymotion.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://www.dailymotion.com/video/*", function ({ pathname }) {
    return PLUGIN_URL + pathname.substring(7);
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL minifiée d'une vidéo Dailymotion.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://dai.ly/*", function ({ pathname }) {
    return PLUGIN_URL + pathname.substring(1);
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Dailymotion intégrée.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://www.dailymotion.com/embed/video/*", function ({ pathname }) {
    return PLUGIN_URL + pathname.substring(13);
});
