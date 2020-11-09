/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo Metacafe.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const script = doc.querySelector("script#json_video_data");

    return JSON.parse(script.text).sources[0].src;
};
export const extract = matchPattern(action, "*://www.metacafe.com/watch/*");
