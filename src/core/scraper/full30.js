/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url L'URL d'une vidéo Full30.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
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
