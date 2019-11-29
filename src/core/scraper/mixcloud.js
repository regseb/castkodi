/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des musiques issues de Mixcloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.mixcloud/?mode=40&key=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une musique Mixcloud.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://www.mixcloud.com/*/*/"], async function ({ pathname }) {
    return pathname.startsWith("/discover/")
                                    ? null
                                    : PLUGIN_URL + encodeURIComponent(pathname);
});
