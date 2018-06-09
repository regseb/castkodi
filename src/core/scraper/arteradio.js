/**
 * @module core/scraper/arteradio
 */

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string} BASE_URL
 */
const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {String} url L'URL d'un son de Arte Radio.
 * @return {Promise} L'URL du fichier.
 */
rules.set(["*://www.arteradio.com/son/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return BASE_URL + doc.querySelector(".player-main-playlist" +
                                            " a[data-sound-href]")
                             .getAttribute("data-sound-href");
    });
});
