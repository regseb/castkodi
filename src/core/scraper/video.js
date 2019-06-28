/**
 * @module core/scraper/video
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
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://*/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        const type = response.headers.get("Content-Type");
        if (null !== type &&
                (type.startsWith("text/html") ||
                 type.startsWith("application/xhtml+xml"))) {
            return response.text();
        }
        // Si ce n'est pas une page HTML : simuler une page vide.
        return "";
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("video source[src], video[src]");
        return null === video ? null
                              : new URL(video.getAttribute("src"), href).href;
    });
});
