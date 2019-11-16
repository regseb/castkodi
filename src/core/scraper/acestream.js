/**
 * @module
 */

/**
 * L'URL de l'extension Plexus pour lire des liens Ace Stream.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://program.plexus/?mode=1&name=&url=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo Ace Stream.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
rules.set(["acestream://*"], async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
});
