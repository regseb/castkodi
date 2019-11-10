/**
 * @module
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo Full30.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set([
    "*://www.full30.com/watch/*", "*://www.full30.com/video/*"
], function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const script = doc.querySelector("#video-player noscript");
        if (null === script) {
            return null;
        }

        const subdoc = new DOMParser().parseFromString(script.textContent,
                                                       "text/html");
        return subdoc.querySelector("video source").src;
    });
});
