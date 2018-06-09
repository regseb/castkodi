/**
 * @module core/scraper/soundcloud
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @constant {string} PLUGIN_URL
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?audio_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {String} url L'URL d'une musique SoundCloud.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://soundcloud.com/*/*", "*://mobi.soundcloud.com/*/*"
], function (url) {
    // Si le chemin contient plusieurs barres obliques.
    if (url.pathname.indexOf("/", 1) !== url.pathname.lastIndexOf("/"))  {
        return Promise.reject(new PebkacError("noAudio", "SoundCloud"));
    }

    return fetch("https://soundcloud.com/oembed?url=" +
                 encodeURIComponent(url.toString()
                                       .replace("//mobi.", "//"))).then(
                                                           function (response) {
        return response.text();
    }).then(function (response) {
        const RE = /api.soundcloud.com%2Ftracks%2F([^&]+)/;
        const result = RE.exec(response);
        if (null === result) {
            throw new PebkacError("noAudio", "SoundCloud");
        }
        return PLUGIN_URL + result[1];
    });
});
