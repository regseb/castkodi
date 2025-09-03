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
 * Extrait le titre d'une musique SoundCloud.
 *
 * @param {URLMatch} url L'URL de la musique SoundCloud.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const meta = /** @type {HTMLMetaElement|null} */ (
        doc.querySelector('meta[property="og:title"]')
    );
    return meta?.content;
};
export const extract = matchURLPattern(
    action,
    "https://soundcloud.com/*",
    "https://mobi.soundcloud.com/*",
);
