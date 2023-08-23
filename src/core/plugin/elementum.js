/**
 * @module
 * @license MIT
 * @see http://elementum.surge.sh/
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension Elementum pour lire des torrents ou des magnets.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.elementum/play?uri=";

/**
 * Génère l'URL d'un torrent ou d'un magnet dans l'extension Elementum.
 *
 * @param {URL} url L'URL du torrent ou du magnet.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateUrl = function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
