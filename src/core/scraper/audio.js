/**
 * @module core/scraper/audio
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://*/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        const contentType = response.headers.get("Content-Type");
        if (null !== contentType &&
                (contentType.startsWith("text/html") ||
                 contentType.startsWith("application/xhtml+xml"))) {
            return response.text();
        }
        // Si ce n'est pas une page HTML : simuler une page vide.
        return "";
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const audio = doc.querySelector("audio source[src], audio[src]");
        return null === audio ? null
                              : new URL(audio.src, href).href;
    });
});
