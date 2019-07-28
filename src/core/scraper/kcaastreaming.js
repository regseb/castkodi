/**
 * @module core/scraper/kcaastreaming
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
 * @param {string} url L'URL du <em>live</em> de KCAA Radio.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["http://live.kcaastreaming.com/"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return doc.querySelector("#show a").href;
    });
});
