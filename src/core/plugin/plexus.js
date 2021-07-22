/**
 * @module
 */
/* eslint-disable require-await */

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
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};
