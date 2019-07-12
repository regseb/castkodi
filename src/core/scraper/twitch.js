/**
 * @module core/scraper/twitch
 */

/**
 * L'URL de l'extension pour lire des <em>live</em>s issus de Twitch.
 *
 * @constant {string}
 */
const PLUGIN_CHANNEL_URL = "plugin://plugin.video.twitch/?mode=play" +
                                                        "&channel_name=";

/**
 * L'URL de l'extension pour lire des clips issus de Twitch.
 *
 * @constant {string}
 */
const PLUGIN_CLIP_URL = "plugin://plugin.video.twitch/?mode=play&slug=";

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @constant {string}
 */
const PLUGIN_VIDEO_URL = "plugin://plugin.video.twitch/?mode=play&video_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo Twitch.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/videos/*", "*://go.twitch.tv/videos/*",
    "*://m.twitch.tv/videos/*"
], function ({ pathname }) {
    return Promise.resolve(PLUGIN_VIDEO_URL + pathname.substring(8));
});

/**
 * Extrait les informations nécessaire pour lire un clip sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un clip Twitch.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://clips.twitch.tv/*"], function ({ pathname }) {
    return Promise.resolve(PLUGIN_CLIP_URL + pathname.substring(1));
});

/**
 * Extrait les informations nécessaire pour lire un clip sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un clip d'une chaine Twitch.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*/clip/*", "*://go.twitch.tv/*/clip/*",
    "*://m.twitch.tv/*/clip/*"
], function ({ pathname }) {
    return Promise.resolve(PLUGIN_CLIP_URL +
                           pathname.substring(pathname.lastIndexOf("/") + 1));
});

/**
 * Extrait les informations nécessaire pour lire un <em>live</em> sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un <em>live</em> Twitch.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*", "*://go.twitch.tv/*", "*://m.twitch.tv/*"
], function ({ pathname }) {
    return Promise.resolve(PLUGIN_CHANNEL_URL + pathname.substring(1));
});
