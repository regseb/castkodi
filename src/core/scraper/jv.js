/**
 * @module
 */

import * as plugin from "../plugin/dailymotion.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url          L'URL d'une vidéo JV.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, content) {
    const doc = await content.html();
    const div = doc.querySelector("div[data-src-video]");
    if (null === div) {
        return undefined;
    }

    const response = await fetch(new URL(div.dataset.srcVideo, url));
    const json = await response.json();
    return plugin.generateUrl(json.options.video);
};
export const extract = matchPattern(action, "*://www.jeuxvideo.com/*");
