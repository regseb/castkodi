/**
 * @module core/scraper/jeuxvideocom
 */

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
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.jeuxvideo.com/*", "*://jeuxvideo.com/*"
], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("[data-srcset-video]");
        if (null === video) {
            return null;
        }

        const url = "https://www.jeuxvideo.com" + video.dataset.srcsetVideo;
        return fetch(url).then(function (subresponse) {
            return subresponse.json();
        }).then(function ({ sources }) {
            return sources.find((s) => "true" === s.default).file;
        });
    });
});
