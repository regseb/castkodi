/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de VrtNu (https://vrtnu.be).
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vrt.nu/play/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<(Array.<string>|string), Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo / playlist sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une vidéo / playlist
 *                                           YouTube (ou Invidious / HookTube).
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://*.vrt.be/vrtnu/a-z/*", function ({ pathname }) {
    if (pathname.length <= 11) return null;
    if (pathname.substring(0,11) != "/vrtnu/a-z/") return null;
    return PLUGIN_URL + 'url/https://vrt.be' + pathname;
});
