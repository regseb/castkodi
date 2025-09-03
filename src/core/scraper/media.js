/**
 * @module
 * @license MIT
 * @see https://developer.mozilla.org/Web/HTML/Element/video
 * @see https://developer.mozilla.org/Web/HTML/Element/audio
 * @see https://developer.mozilla.org/Web/HTML/Element/source
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * La liste des sélecteurs retournant les éléments `video` ou `audio` et leurs
 * sources.
 *
 * @type {string[]}
 */
const SELECTORS = ["video source", "video", "audio source", "audio"];

/**
 * Extrait les informations nécessaires pour lire une vidéo ou une musique sur
 * Kodi.
 *
 * @param {URLMatch} url           L'URL d'une page quelconque.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (url, metadata) => {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const media = SELECTORS.map(
        (s) => `${s}[src]:not([src=""]):not([src^="blob:"])`,
    )
        .map((s) => doc.querySelectorAll(s))
        .flatMap((l) => Array.from(l))
        .shift();
    return undefined === media
        ? undefined
        : new URL(media.getAttribute("src"), url).href;
};
export const extract = matchURLPattern(action, "*://*/*");
