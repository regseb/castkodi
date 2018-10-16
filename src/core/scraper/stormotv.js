/**
 * @module core/scraper/stormotv
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
 * @param {string} url L'URL d'une vidéo StormoTV.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["https://www.stormo.tv/videos/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const meta = doc.querySelector("meta[property=\"ya:ovs:content_url\"]");
        if (null === meta) {
            throw new PebkacError("noVideo", "StormoTV");
        }
        return meta.getAttribute("content");
    });
});
