/**
 * @module core/scraper/mycloudplayers
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?audio_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une musique de My Cloud Player.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://mycloudplayers.com/*"], function (url) {
    if (url.searchParams.has("play")) {
        return Promise.resolve(PLUGIN_URL + url.searchParams.get("play"));
    }

    return Promise.reject(new PebkacError("noAudio", "My Cloud Player"));
});
