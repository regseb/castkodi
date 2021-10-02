/**
 * @module
 */
/* eslint-disable require-await */

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
 * @param {URL}      url          L'URL d'une page quelconque.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>null</code>.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const media = SELECTORS.map((s) => `${s}[src]:not([src=""])` +
                                                `:not([src^="blob:"])`)
                           .map((s) => doc.querySelectorAll(s))
                           .flatMap((l) => Array.from(l))
                           .shift();
    return undefined === media ? null
                               : new URL(media.getAttribute("src"), href).href;
};
export const extract = matchPattern(action, "*://*/*");
