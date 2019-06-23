/**
 * @module core/scraper/gamekult
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

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
 * @param {string} url L'URL d'une page de Gamekult.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.gamekult.com/*", "*://gamekult.com/*"
], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector(".js-dailymotion-video[data-id]");
        return null === video ? null
                              : PLUGIN_URL + video.dataset.id;
    });
});
