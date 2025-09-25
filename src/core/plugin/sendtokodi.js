/**
 * @module
 * @license MIT
 * @see https://github.com/firsttris/plugin.video.sendtokodi
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.sendtokodi";

/**
 * Génère l'URL d'une vidéo avec l'extension SendToKodi.
 *
 * @param {URL} url L'URL d'une page quelconque.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = ({ href }) => {
    return `${PLUGIN_URL}/?${href}`;
};
