/**
 * @module
 * @see https://kodi.wiki/view/Add-on:ARD_Mediathek
 */
/* eslint-disable require-await */

/**
 * L'URL de l'extension pour lire des vidéos issues de ARD Mediathek.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.ardmediathek_de/?client=ard" +
                                                         "&mode=libArdPlay&id=";

/**
 * Génère l'URL d'une vidéo dans l'extension ARD Mediathek.
 *
 * @param {string} id L'identifiant de la vidéo ARD Mediathek.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function (id) {
    return PLUGIN_URL + id;
};
