/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de VRT NU.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vrt.nu/play/url/";

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
 * @param {URL}    url          L'URL d'une vidéo VRT NU.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set([
    "*://www.vrt.be/vrtnu/a-z/*", "*://vrt.be/vrtnu/a-z/*"
], function ({ href }) {
    return PLUGIN_URL + href;
});
