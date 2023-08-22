/**
 * @module
 * @license MIT
 * @see https://www.flickr.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire la clé de l'API de Flickr.
 *
 * @type {RegExp}
 */
const KEY_REGEXP = /root\.YUI_config\.flickr\.api\.site_key = "(?<key>[^"]+)"/u;

/**
 * L'URL de l'API de Flickr pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL =
    "https://api.flickr.com/services/rest" +
    "?method=flickr.video.getStreamInfo" +
    "&format=json" +
    "&nojsoncallback=1";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Flickr.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const video = doc.querySelector("video");
    if (null === video) {
        return undefined;
    }

    const parts = new URL(video.poster).pathname.split(/[./_]/u);
    const photoId = parts[2];
    const secret = parts[3];
    const key = KEY_REGEXP.exec(doc.documentElement.innerHTML).groups.key;
    const response = await fetch(
        `${API_URL}&photo_id=${photoId}&secret=${secret}&api_key=${key}`,
    );
    const json = await response.json();
    return json.streams.stream[0]["_content"];
};
export const extract = matchPattern(action, "*://www.flickr.com/photos/*");
