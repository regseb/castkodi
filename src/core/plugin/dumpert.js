/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Dumpert
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Dumpert.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dumpert/?action=play&video_page_url=";

/**
 * Génère l'URL d'une vidéo dans l'extension Dumpert.
 *
 * @param {URL} videoUrl L'URL de la vidéo Dumpert.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateUrl = function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
