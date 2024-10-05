/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo VTM GO.
 *
 * @param {URL} url L'URL de la vidéo VTM GO.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      `undefined`.
 */
const action = async function (url) {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return /** @type {HTMLHeadingElement|null} */ (
        doc.querySelector("h1.player__title")
    )?.textContent;
};
export const extract = matchPattern(action, "*://vtm.be/vtmgo/afspelen/*");
