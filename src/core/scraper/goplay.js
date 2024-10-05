/**
 * @module
 * @license MIT
 * @see https://www.goplay.be/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de GoPlay pour obtenir des informations sur une vidéo.
 *
 * @type {string}
 */
const API_URL = "https://api.goplay.be/web/v1/videos/short-form/";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo GoPlay.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const div = doc.querySelector("div[data-video]");
    if (null === div) {
        return undefined;
    }

    const { id } = JSON.parse(div.dataset.video);
    const response = await fetch(API_URL + id);
    const json = await response.json();
    return json.manifestUrls.hls;
};
export const extract = matchPattern(action, "*://www.goplay.be/video/*");
