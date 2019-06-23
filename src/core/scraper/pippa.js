/**
 * @module core/scraper/pippa
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
 * @param {string} url L'URL d'un son de Pippa.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://shows.pippa.io/*/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const meta = doc.querySelector(`head meta[property="og:audio"]`);
        return null === meta ? null
                             : meta.content;
    });
});
