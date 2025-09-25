/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:SoundCloud
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud";

/**
 * Génère l'URL d'une musique dans l'extension SoundCloud.
 *
 * @param {URL} audioUrl L'URL de la musique SoundCloud.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = ({ href }) => {
    return `${PLUGIN_URL}/play/?url=${encodeURIComponent(href)}`;
};
