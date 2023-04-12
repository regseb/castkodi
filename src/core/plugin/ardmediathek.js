/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:ARD_Mediathek
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de ARD Mediathek.
 *
 * @type {string}
 */
const PLUGIN_URL =
    "plugin://plugin.video.ardmediathek_de/?client=ard&mode=libArdPlay&id=";

/**
 * Génère l'URL d'une vidéo dans l'extension ARD Mediathek.
 *
 * @param {string} id L'identifiant de la vidéo ARD Mediathek.
 * @returns {string} Le lien du <em>fichier</em>.
 */
export const generateUrl = function (id) {
    return PLUGIN_URL + id;
};
