/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URLMatch} url L'URL de la vidéo Vimeo.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return /** @type {HTMLMetaElement} */ (
        doc.querySelector('meta[property="og:title"]')
    ).content;
};
export const extract = matchURLPattern(action, "https://vimeo.com/*");
