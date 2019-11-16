/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

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
 * @param {URL}    url          L'URL d'une vidéo Vimeo.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set(["*://vimeo.com/*"], async function ({ pathname }) {
    return (/^\/\d+$/u).test(pathname) ? PLUGIN_URL + pathname.slice(1)
                                       : null;
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Vimeo intégrée.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set(["*://player.vimeo.com/video/*"], async function ({ pathname }) {
    return (/^\/video\/\d+$/u).test(pathname) ? PLUGIN_URL + pathname.slice(7)
                                              : null;
});
