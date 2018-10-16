/**
 * @module core/scraper/twitch
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'API de Twitch pour obtenir des informations sur une chaine.
 *
 * @constant {string} API_URL
 */
const API_URL = "https://api.twitch.tv/kraken/channels";

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @constant {string} PLUGIN_VIDEO_URL
 */
const PLUGIN_VIDEO_URL = "plugin://plugin.video.twitch/?mode=play&video_id=";

/**
 * L'URL de l'extension pour lire les <em>lives</em> des chaines issues de
 * Twitch.
 *
 * @constant {string} PLUGIN_CHANNEL_URL
 */
const PLUGIN_CHANNEL_URL = "plugin://plugin.video.twitch/?mode=play" +
                                                                 "&channel_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {string} url L'URL d'une vidéo Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/videos/*", "*://go.twitch.tv/videos/*"
], function (url) {
    return Promise.resolve(PLUGIN_VIDEO_URL + url.pathname.substr(8));
});

/**
 * Extrait les informations nécessaire pour lire le <em>live</em> sur Kodi.
 *
 * @param {string} url L'URL d'un <em>live</em> Twitch.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.twitch.tv/*", "*://go.twitch.tv/*"
], function (url) {
    const init = {
        "headers": { "client-id": "jzkbprff40iqj646a697cyrvl0zt2m6" }
    };
    return fetch(API_URL + url.pathname, init).then(function (response) {
        return response.json();
    }).then(function (response) {
        if ("_id" in response) {
            return PLUGIN_CHANNEL_URL + response["_id"];
        }
        throw new PebkacError("noVideo", "Twitch");
    });
});
