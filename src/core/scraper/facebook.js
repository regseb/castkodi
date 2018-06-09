/**
 * @module core/scraper/facebook
 */

import { PebkacError } from "../pebkac.js";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo Facebook.
 * @return {Promise} L'URL du fichier.
 */
rules.set(["*://www.facebook.com/*/videos/*/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (response) {
        const RE = /hd_src_no_ratelimit:"([^"]+)/;
        const result = RE.exec(response);
        if (null === result) {
            throw new PebkacError("noVideo", "Facebook");
        }
        return result[1];
    });
});
