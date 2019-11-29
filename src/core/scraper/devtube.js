/**
 * @module
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
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo DevTube.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://dev.tube/video/*"], async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(7);
});
