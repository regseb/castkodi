/**
 * @module core/scraper/youtube
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string} PLUGIN_VIDEO_URL
 */
const PLUGIN_VIDEO_URL = "plugin://plugin.video.youtube/play/?video_id=";

/**
 * L'URL de l'extension pour lire des playlists issues de YouTube.
 *
 * @constant {string} PLUGIN_PLAYLIST_URL
 */
const PLUGIN_PLAYLIST_URL = "plugin://plugin.video.youtube/play/?playlist_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo ou la playlist sur
 * Kodi.
 *
 * @param {String} url L'URL d'une vidéo ou playlist YouTube (ou HookTube).
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "https://www.youtube.com/watch*", "https://m.youtube.com/watch*",
    "https://hooktube.com/watch*"
], function (url) {
    return browser.storage.local.get(["youtube-playlist"]).then(
                                                             function (config) {
        if (url.searchParams.has("list") &&
                "playlist" === config["youtube-playlist"]) {
            return PLUGIN_PLAYLIST_URL + url.searchParams.get("list");
        }
        if (url.searchParams.has("v")) {
            return PLUGIN_VIDEO_URL + url.searchParams.get("v");
        }

        throw new PebkacError("novideo", "YouTube");
    });
});

/**
 * Extrait les informations nécessaire pour lire la playlist sur Kodi.
 *
 * @param {String} url L'URL d'une playlist YouTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "https://www.youtube.com/playlist*", "https://m.youtube.com/playlist*"
], function (url) {
    if (url.searchParams.has("list")) {
        return Promise.resolve(
                            PLUGIN_PLAYLIST_URL + url.searchParams.get("list"));
    }

    return Promise.reject(new PebkacError("novideo", "YouTube"));
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {String} url L'URL minifié d'une vidéo YouTube.
 * @return {Promise} L'identifiant de la file d'attente et l'URL du
 *                   <em>fichier</em>.
 */
rules.set(["https://youtu.be/*"], function (url) {
    return Promise.resolve(PLUGIN_VIDEO_URL + url.pathname.substr(1));
});
