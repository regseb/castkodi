/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo TikTok.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const script = doc.querySelector("script#sigi-persisted-data");
    if (null === script) {
        return undefined;
    }

    const json = JSON.parse(script.text.slice(21,
                                              script.text.indexOf(";window")));
    return "ItemModule" in json
                              ? Object.values(json.ItemModule)[0].video.playAddr
                              : undefined;
};
export const extract = matchPattern(action, "*://www.tiktok.com/*");
