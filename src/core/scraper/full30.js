/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo Full30.
 * @param {object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const noscript = doc.querySelector("#video-player noscript");
    if (null === noscript) {
        return null;
    }

    const subdoc = new DOMParser().parseFromString(noscript.innerHTML,
                                                   "text/html");
    return subdoc.querySelector("video source").src;
};
export const extract = matchPattern(action,
    "*://www.full30.com/watch/*",
    "*://www.full30.com/video/*");
