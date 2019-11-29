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
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo / playlist sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une vidéo / playlist
 *                                           YouTube (ou Invidious / HookTube).
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set([
    "*://*.youtube.com/watch*", "*://invidio.us/watch*",
    "*://hooktube.com/watch*"
], async function ({ searchParams }) {
    const config = await browser.storage.local.get(["youtube-playlist"]);
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

/**
 * Extrait les informations nécessaire pour lire une playlist sur Kodi.
 *
 * @function action
 * @param {URL}             url              L'URL d'une playlist YouTube.
 * @param {URLSearchParams} url.searchParams Les paramètres de l'URL.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://*.youtube.com/playlist*"], async function ({ searchParams }) {
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
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set([
    "*://www.youtube.com/embed/*", "*://www.youtube-nocookie.com/embed/*",
    "*://invidio.us/embed/*", "*://hooktube.com/embed/*"
], async function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(7);
});

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL minifiée d'une vidéo YouTube.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://youtu.be/*"], async function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(1);
});
