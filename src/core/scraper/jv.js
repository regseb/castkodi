/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url          L'URL d'une vidéo JV.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content) {
    const doc = await content.html();
    const div = doc.querySelector("div[data-srcset-video]");
    if (null === div) {
        return null;
    }

    const response = await fetch(new URL(div.dataset.srcsetVideo, href));
    const json = await response.json();
    return json.sources[0].file;
};
export const extract = matchPattern(action, "*://www.jeuxvideo.com/*");
