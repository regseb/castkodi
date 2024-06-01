/**
 * @module
 * @license MIT
 * @see https://ok.ru/video
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page mobile de OK.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionMobile = async function (_url, metadata) {
    const doc = await metadata.html();
    const a = doc.querySelector("a.outLnk[data-video]");
    if (null === a) {
        return undefined;
    }

    const data = JSON.parse(a.dataset.video);
    return data.videoSrc;
};
export const extractMobile = matchPattern(actionMobile, "*://m.ok.ru/video/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une page de OK.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url) {
    const mobileUrl = new URL(url.href.replace("//ok.ru/", "//m.ok.ru/"));
    const response = await fetch(mobileUrl);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return await actionMobile(mobileUrl, { html: () => Promise.resolve(doc) });
};
export const extract = matchPattern(action, "*://ok.ru/video/*");
