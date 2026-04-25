/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Piped
 * @see https://github.com/syhlx/plugin.video.piped
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.piped";

/**
 * Génère l'URL d'une vidéo dans l'extension Piped.
 *
 * @param {string} videoId L'identifiant de la vidéo YouTube.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = (videoId) => {
    return `${PLUGIN_URL}/watch/${videoId}`;
};
