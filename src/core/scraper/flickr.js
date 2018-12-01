/**
 * @module core/scraper/flickr
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'expression rationnelle pour extraire la clé de l'API de Flickr.
 *
 * @constant {RegExp} REGEXP_KEY
 */
const REGEXP_KEY = /root\.YUI_config\.flickr\.api\.site_key = "([^"]+)"/u;

/**
 * L'URL de l'API de Flickr pour obtenir des informations sur la vidéo.
 *
 * @constant {string} API_URL
 */
const API_URL = "https://api.flickr.com/services/rest" +
                                   "?method=flickr.video.getStreamInfo" +
                                   "&format=json" +
                                   "&nojsoncallback=1";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {string} url L'URL d'une vidéo Flickr.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["https://www.flickr.com/photos/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("video");
        if (null === video) {
            throw new PebkacError("noVideo", "Flickr");
        }

        const [,,,,,,, photoId, secret] = video.getAttribute("poster")
                                               .split(/[/_.]/u);
        const key = REGEXP_KEY.exec(data);
        return fetch(API_URL + "&photo_id=" + photoId + "&secret=" + secret +
                               "&api_key=" + key[1]);
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        return data.streams.stream[0]["_content"];
    });
});
