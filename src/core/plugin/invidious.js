/**
 * @module
 * @license MIT
 * @see https://github.com/lekma/plugin.video.invidious
 * @author David Magnus Henriques
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Invidious.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.invidious";

/**
 * Génère l'URL d'une vidéo dans l'extension Invidious.
 *
 * @param {string} videoId L'identifiant de la vidéo YouTube.
 * @returns {string} Le lien du _fichier_.
 */
export const generateVideoUrl = (videoId) => {
    return `${PLUGIN_URL}/?action=play&videoId=${videoId}`;
};
