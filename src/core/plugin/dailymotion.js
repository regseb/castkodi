/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:DailyMotion.com
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

/**
 * Génère l'URL d'une vidéo dans l'extension Dailymotion.
 *
 * @param {string} videoId L'identifiant de la vidéo Dailymotion.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = function (videoId) {
    return PLUGIN_URL + videoId;
};
