/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import { notify } from "../notify.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url         L'URL d'un jeu Steam.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
 const action = async function (url, content) {
    const html = (await (await fetch(url)).text());
    const video_match = html.match(/https:.*.m3u8/gm);
    if (video_match === null){
        return "";
    }
    return video_match[0];
};
export const extract = matchPattern(action, "https://www.star.gr/*");