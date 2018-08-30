/**
 * @module core/scraper/liveleak
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo Liveleak.
 * @return {Promise} L'URL du fichier.
 */
rules.set(["*://www.liveleak.com/view*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return doc.querySelector("video source[default], video source")
                  .getAttribute("src");
    });
});
