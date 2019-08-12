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
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Vimeo.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
rules.set("*://vimeo.com/*", function ({ pathname }) {
    return (/^\/[0-9]+$/u).test(pathname) ? PLUGIN_URL + pathname.substring(1)
                                          : null;
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Vimeo intégrée.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
rules.set("*://player.vimeo.com/video/*", function ({ pathname }) {
    return (/^\/video\/[0-9]+$/u).test(pathname)
                                            ? PLUGIN_URL + pathname.substring(7)
                                            : null;
});
