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
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Dailymotion.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://www.dailymotion.com/video/*"], async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(7);
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL minifiée d'une vidéo Dailymotion.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://dai.ly/*"], async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(1);
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Dailymotion intégrée.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set([
    "*://www.dailymotion.com/embed/video/*"
], async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(13);
});
