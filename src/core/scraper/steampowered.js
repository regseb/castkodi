/**
 * @module core/scraper/steampowered
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
 * @param {string} url L'URL d'un jeu sur Steam.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["*://store.steampowered.com/app/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
        return null === div ? null
                            : div.dataset.mp4HdSource;
    });
});
