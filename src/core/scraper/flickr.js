/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire la clé de l'API de Flickr.
 *
 * @constant {RegExp}
 */
const KEY_REGEXP = /root\.YUI_config\.flickr\.api\.site_key = "([^"]+)"/u;

/**
 * L'URL de l'API de Flickr pour obtenir des informations sur la vidéo.
 *
 * @constant {string}
 */
const API_URL = "https://api.flickr.com/services/rest" +
                                          "?method=flickr.video.getStreamInfo" +
                                          "&format=json" +
                                          "&nojsoncallback=1";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url L'URL d'une vidéo Flickr.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    const video = doc.querySelector("video");
    if (null === video) {
        return null;
    }

    const parts = video.poster.split(/[/_.]/u);
    const photoId = parts[6];
    const secret  = parts[7];
    const url = API_URL + "&photo_id=" + photoId + "&secret=" + secret +
                          "&api_key=" +
                          KEY_REGEXP.exec(doc.documentElement.innerHTML)[1];
    const response = await fetch(url);
    const json = await response.json();
    return json.streams.stream[0]["_content"];
};
export const extract = matchPattern(action, "*://www.flickr.com/photos/*");
