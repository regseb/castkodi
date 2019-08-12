/**
 * @module
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube/play/";

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
rules.set([
    "*://*.youtube.com/watch*", "*://invidio.us/watch*",
    "*://hooktube.com/watch*"
], function ({ searchParams }) {
    return browser.storage.local.get(["youtube-playlist"]).then((config) => {
        if (searchParams.has("list") &&
                ("playlist" === config["youtube-playlist"] ||
                 !searchParams.has("v"))) {
            return PLUGIN_URL + "?playlist_id=" + searchParams.get("list");
        }
        if (searchParams.has("v")) {
            return PLUGIN_URL + "?video_id=" + searchParams.get("v");
        }

        return null;
    });
});

/**
 * Extrait les informations nécessaire pour lire une playlist sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une playlist YouTube.
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
rules.set("*://*.youtube.com/playlist*", function ({ searchParams }) {
    return searchParams.has("list")
                       ? PLUGIN_URL + "?playlist_id=" + searchParams.get("list")
                       : null;
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo YouTube intégrée (ou Invidious
 *                              / HookTube).
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set([
    "*://www.youtube.com/embed/*", "*://www.youtube-nocookie.com/embed/*",
    "*://invidio.us/embed/*", "*://hooktube.com/embed/*"
], function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.substring(7);
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL minifiée d'une vidéo YouTube.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 */
rules.set("*://youtu.be/*", function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.substring(1);
});
