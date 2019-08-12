/**
 * @module
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo JeuxVideoCom.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set([
    "*://www.jeuxvideo.com/*", "*://jeuxvideo.com/*"
], function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("[data-srcset-video]");
        if (null === video) {
            return null;
        }

        const url = "https://www.jeuxvideo.com" + video.dataset.srcsetVideo;
        return fetch(url).then((r) => r.json())
                         .then(({ sources }) => {
            return sources.find((s) => "true" === s.default).file;
        });
    });
});
