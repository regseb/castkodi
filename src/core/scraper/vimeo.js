/**
 * @module core/scraper/vimeo
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @constant {string} PLUGIN_URL
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {string} url L'URL d'une vidéo Vimeo.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://vimeo.com/*"], function (url) {
    if ((/^\/[0-9]+$/u).test(url.pathname)) {
        return Promise.resolve(PLUGIN_URL + url.pathname.substr(1));
    }

    return Promise.reject(new PebkacError("noVideo", "Vimeo"));
});

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {string} url L'URL du lecteur de Vimeo avec une vidéo.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://player.vimeo.com/video/*"], function (url) {
    if ((/^\/video\/[0-9]+$/u).test(url.pathname)) {
        return Promise.resolve(PLUGIN_URL + url.pathname.substr(7));
    }

    return Promise.reject(new PebkacError("noVideo", "Vimeo"));
});
