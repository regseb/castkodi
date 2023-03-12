/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:MixCloud
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

/**
 * L'URL de l'extension pour lire des musiques issues de Mixcloud.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.mixcloud/?mode=40&key=";

/**
 * Génère l'URL d'une musique dans l'extension Mixcloud.
 *
 * @param {string} path Le chemin (artiste / musique) de la musique Mixcloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function (path) {
    return PLUGIN_URL + encodeURIComponent(path);
};
