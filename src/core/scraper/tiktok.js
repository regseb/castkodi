/**
 * @module
 * @license MIT
 * @see https://www.tiktok.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo TikTok.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const script = doc.querySelector("script#SIGI_STATE");
    if (null === script) {
        return undefined;
    }

    const json = JSON.parse(script.text);
    return "ItemModule" in json
        ? Object.values(json.ItemModule)[0].video.playAddr
        : undefined;
};
export const extract = matchPattern(action, "*://www.tiktok.com/*");
