/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo de ZDF.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const button = doc.querySelector("button.download-btn[data-dialog]");
    if (null === button) {
        return null;
    }

    const { contentUrl, apiToken } = JSON.parse(button.dataset.dialog);
    const url = contentUrl.replace("{playerId}", "ngplayer_2_4");
    const response = await fetch(url, {
        headers: { "Api-Auth": `Bearer ${apiToken}` },
    });
    const json = await response.json();
    return json.priorityList[0].formitaeten[0].qualities[0].audio.tracks[0].uri;
};
export const extract = matchPattern(action, "*://www.zdf.de/*");
