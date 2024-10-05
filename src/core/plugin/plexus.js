/**
 * @module
 * @license MIT
 * @see https://github.com/enen92/program.plexus
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension Plexus pour lire des liens Ace Stream.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://program.plexus/?mode=1&name=&url=";

/**
 * Génère l'URL d'une vidéo dans l'extension Plexus.
 *
 * @param {URL} url L'URL de la vidéo Ace Stream.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
