/**
 * @module
 * @see https://kodi.wiki/view/Add-on:VRT_NU
 */
/* eslint-disable require-await */

/**
 * L'URL de l'extension pour lire des vidéos issues de VRT NU.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vrt.nu/play/url/";

/**
 * Génère l'URL d'une vidéo dans l'extension VRT NU.
 *
 * @param {URL} videoUrl L'URL de la vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function ({ href }) {
    return PLUGIN_URL + href;
};
