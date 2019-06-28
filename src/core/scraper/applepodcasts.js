/**
 * @module core/scraper/applepodcasts
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
 * @param {string} url L'URL d'un son de Apple Podcasts.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["https://podcasts.apple.com/*/podcast/*/id*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const script = doc.querySelector("#shoebox-ember-data-store");
        if (null === script) {
            return null;
        }

        return JSON.parse(script.textContent).data.attributes.assetUrl;
    });
});
