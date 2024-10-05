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
 *                                      _fichier_ ou `undefined`.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const script = doc.querySelector(
        "script#__UNIVERSAL_DATA_FOR_REHYDRATION__",
    );
    if (null === script) {
        return undefined;
    }

    const json = JSON.parse(script.text);
    return json["__DEFAULT_SCOPE__"]["webapp.video-detail"]?.itemInfo.itemStruct
        .video.playAddr;
};
export const extract = matchPattern(action, "*://www.tiktok.com/*");
