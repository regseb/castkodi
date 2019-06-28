/**
 * @module core/scraper/arteradio
 */

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string}
 */
const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

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
 * @param {string} url L'URL d'un son de Arte Radio.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.arteradio.com/son/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return BASE_URL + doc.querySelector(".player-main-playlist" +
                                            " *[data-sound-href]")
                             .dataset.soundHref;
    });
});
