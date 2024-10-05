/**
 * @module
 * @license MIT
 * @see https://github.com/Sandmann79/xbmc/tree/HEAD/plugin.video.amazon-test
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Prime Video (Amazon).
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.amazon-test/?mode=PlayVideo";

/**
 * Génère l'URL d'une vidéo dans l'extension Amazon Prime Video.
 *
 * @param {string} id    L'identifiant de la vidéo.
 * @param {string} title Le titre de la vidéo.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = function (id, title) {
    return `${PLUGIN_URL}&asin=${id}&name=${encodeURIComponent(title)}`;
};
