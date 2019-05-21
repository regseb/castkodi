/**
 * @module core/scraper/steampowered
 */

import { PebkacError } from "../pebkac.js";

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
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://store.steampowered.com/app/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const div = doc.querySelector(
                                     "div.highlight_movie[data-mp4-hd-source]");
        if (null === div) {
            throw new PebkacError("noVideo", "Steam");
        }
        return div.dataset.mp4HdSource;
    });
});
