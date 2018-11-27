/**
 * @module core/scraper/soundcloud
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'expression rationnelle pour extraire l'URL de la musique.
 *
 * @constant {RegExp} URL_REGEXP
 */
const URL_REGEXP = /api.soundcloud.com%2Ftracks%2F([^&]+)/iu;

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
 * @param {string} url L'URL d'une musique SoundCloud.
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
        const result = URL_REGEXP.exec(response);
        if (null === result) {
            throw new PebkacError("noAudio", "SoundCloud");
        }
        return PLUGIN_URL + result[1];
    });
});
