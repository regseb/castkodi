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
 * Extrait le titre d'une vidéo VTM GO.
 *
 * @param {URLMatch} url L'URL de la vidéo VTM GO.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return /** @type {HTMLTitleElement} */ (doc.querySelector("title"))
        ?.textContent;
};
export const extract = matchURLPattern(
    action,
    "https://www.vtmgo.be/vtmgo/afspelen/*",
);
