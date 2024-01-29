/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URL} url L'URL de la vidéo Vimeo.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async function (url) {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return /** @type {HTMLMetaElement} */ (
        doc.querySelector('meta[property="og:title"]')
    ).content;
};
export const extract = matchPattern(action, "*://vimeo.com/*");
