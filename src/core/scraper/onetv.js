/**
 * @module core/scraper/onetv
 */

import { PebkacError } from "../pebkac.js";

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
 * @param {string} url L'URL d'une vidéo Первый канал.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://www.1tv.ru/shows/*", "*://www.1tv.ru/movies/*"
], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const result = doc.querySelector(`head meta[property="og:video:url"]`);
        if (null === result) {
            throw new PebkacError("noVideo", "Первый канал");
        }
        return result.content;
    });
});
