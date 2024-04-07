/**
 * @module
 * @license MIT
 * @see https://www.primevideo.com/
 * @author Sébastien Règne
 */

import * as primevideoPlugin from "../plugin/primevideo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Prime Video (Amazon).
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const input = doc.querySelector('#dv-action-box input[name="titleId"]');
    if (null === input) {
        return undefined;
    }
    const id = input.value;

    const response = await fetch(`https://www.primevideo.com/detail/${id}`);
    const text = await response.text();
    const subdoc = new DOMParser().parseFromString(text, "text/html");
    const title = subdoc.querySelector("title").textContent.slice(13);

    return primevideoPlugin.generateUrl(id, title);
};
export const extract = matchPattern(
    action,
    "https://www.primevideo.com/detail/*",
    "https://www.primevideo.com/region/*/detail/*",
    "https://www.amazon.de/gp/video/detail/*",
);
