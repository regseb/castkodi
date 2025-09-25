/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:MixCloud
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des musiques issues de Mixcloud.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.mixcloud";

/**
 * Génère l'URL d'une musique dans l'extension Mixcloud.
 *
 * @param {string} path Le chemin (artiste / musique) de la musique Mixcloud.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = (path) => {
    return `${PLUGIN_URL}/?mode=40&key=${encodeURIComponent(path)}`;
};
