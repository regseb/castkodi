/**
 * @module
 * @license MIT
 * @see https://developer.mozilla.org/Web/HTML/Element/video
 * @see https://developer.mozilla.org/Web/HTML/Element/audio
 * @see https://developer.mozilla.org/Web/HTML/Element/source
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * La liste des sélecteurs retournant les éléments <code>video</code> ou
 * <code>audio</code> et leurs sources.
 *
 * @type {string[]}
 */
const SELECTORS = ["video source", "video", "audio source", "audio"];

/**
 * Extrait les informations nécessaire pour lire une vidéo ou une musique sur
 * Kodi.
 *
 * @param {URL}      url           L'URL d'une page quelconque.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, metadata) {
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
export const extract = matchPattern(action, "*://*/*");
