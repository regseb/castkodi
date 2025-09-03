/**
 * @module
 * @license MIT
 * @see https://ok.ru/video
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page d'OK.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionMobile = async (_url, metadata) => {
    const doc = await metadata.html();
    const a = doc.querySelector("a.outLnk[data-video]");
    if (null === a) {
        return undefined;
    }

    const data = JSON.parse(a.dataset.video);
    return data.videoSrc;
};
export const extract = matchURLPattern(actionMobile, "https://m.ok.ru/video/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'une page mobile d'OK.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (url) => {
    const mobileUrl = new URL(url.href.replace("//ok.ru/", "//m.ok.ru/"));
    const response = await fetch(mobileUrl);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return await actionMobile(mobileUrl, { html: () => Promise.resolve(doc) });
};
export const extractMobile = matchURLPattern(action, "https://ok.ru/video/*");
