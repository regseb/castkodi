/**
 * @module core/scraper/jeuxvideocom
 */

import { PebkacError } from "../pebkac.js";

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
 * @param {string} url L'URL d'une vidéo JeuxVideo.com.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.jeuxvideo.com/*", "*://jeuxvideo.com/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("[data-srcset-video]");
        if (null === video) {
            throw new PebkacError("noVideo", "JeuxVideo.com");
        }
        return fetch("http://www.jeuxvideo.com" + video.dataset.srcsetVideo);
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        return data.sources.find((s) => "true" === s.default).file;
    });
});
