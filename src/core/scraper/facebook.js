/**
 * @module core/scraper/facebook
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL pour récupérer la vidéo.
 *
 * @constant {string}
 */
const PREFIX_VIDEO_URL = "https://www.facebook.com/watch/?v=";

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
 * @param {string} url L'URL d'une vidéo Facebook.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://www.facebook.com/*/videos/*/*"], function (url) {
    const id = url.pathname.substring(url.pathname.indexOf("/videos/") + 8)
                           .replace(/\/$/u, "");
    return fetch(PREFIX_VIDEO_URL + id).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const result = doc.querySelector("head meta[property=\"og:video\"]");
        if (null === result) {
            throw new PebkacError("noVideo", "Facebook");
        }
        return result.content;
    });
});

rules.set(["*://www.facebook.com/watch*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const result = doc.querySelector("head meta[property=\"og:video\"]");
        if (null === result) {
            throw new PebkacError("noVideo", "Facebook");
        }
        return result.content;
    });
});
