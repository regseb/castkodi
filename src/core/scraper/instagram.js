/**
 * @module core/scraper/instagram
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
 * @param {string} url L'URL d'une vidéo Instagram.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.instagram.com/p/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const result = doc.querySelector(`head meta[property="og:video"]`);
        if (null === result) {
            throw new PebkacError("noVideo", "Instagram");
        }
        return result.content;
    });
});
