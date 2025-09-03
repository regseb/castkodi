/**
 * @module
 * @license MIT
 * @see https://www.zdf.de/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo de ZDF.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const button = doc.querySelector("button.download-btn[data-dialog]");
    if (null === button) {
        return undefined;
    }

    const { contentUrl, apiToken } = JSON.parse(button.dataset.dialog);
    const url = contentUrl.replace("{playerId}", "ngplayer_2_4");
    const response = await fetch(url, {
        headers: { "Api-Auth": `Bearer ${apiToken}` },
    });
    const json = await response.json();
    return json.priorityList[0].formitaeten[0].qualities[0].audio.tracks[0].uri;
};
export const extract = matchURLPattern(action, "https://www.zdf.de/*");
