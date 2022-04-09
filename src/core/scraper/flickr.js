/**
 * @module
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
const API_URL = "https://api.flickr.com/services/rest" +
                                          "?method=flickr.video.getStreamInfo" +
                                          "&format=json" +
                                          "&nojsoncallback=1";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo Flickr.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const video = doc.querySelector("video");
    if (null === video) {
        return undefined;
    }

    const parts = video.poster.split(/[./_]/u);
    const photoId = parts[6];
    const secret  = parts[7];
    const key = KEY_REGEXP.exec(doc.documentElement.innerHTML).groups.key;
    const response = await fetch(`${API_URL}&photo_id=${photoId}` +
                                           `&secret=${secret}&api_key=${key}`);
    const json = await response.json();
    return json.streams.stream[0]["_content"];
};
export const extract = matchPattern(action, "*://www.flickr.com/photos/*");
