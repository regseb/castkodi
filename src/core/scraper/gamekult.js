/**
 * @module
 */

import * as plugin from "../plugin/dailymotion.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page de Gamekult.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const video = doc.querySelector(".js-dailymotion-video[data-id]");
    return null === video ? undefined
                          : plugin.generateUrl(video.dataset.id);
};
export const extract = matchPattern(action,
    "*://www.gamekult.com/*",
    "*://gamekult.com/*");
