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
rules.set([
    "*://*.facebook.com/*/videos/*/*", "*://*.facebook.com/watch*"
], function (url) {
    let id;
    if ("/watch" === url.pathname || "/watch/" === url.pathname) {
        if (url.searchParams.has("v")) {
            id = url.searchParams.get("v");
        } else {
            return Promise.reject(new PebkacError("noVideo", "Facebook"));
        }
    } else {
        id = url.pathname.substring(url.pathname.indexOf("/videos/") + 8)
                         .replace(/\/$/u, "");
    }

    const init = { "credentials": "omit" };
    return fetch(PREFIX_VIDEO_URL + id, init).then(function (response) {
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
