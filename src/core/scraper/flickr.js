/**
 * @module
 */

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
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo Flickr.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://www.flickr.com/photos/*", function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const video = doc.querySelector("video");
        if (null === video) {
            return null;
        }

        const parts = video.poster.split(/[/_.]/u);
        const photoId = parts[6];
        const secret  = parts[7];
        const url = API_URL + "&photo_id=" + photoId + "&secret=" + secret +
                              "&api_key=" + KEY_REGEXP.exec(data)[1];
        return fetch(url).then((r) => r.json())
                         .then(({ "streams": { stream } }) => {
            return stream.find((s) => "orig" === s.type)["_content"];
        });
    });
});
