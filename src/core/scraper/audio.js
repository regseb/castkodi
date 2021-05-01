/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * La liste des sélecteurs retournant les éléments <code>audio</code> et leurs
 * sources.
 *
 * @type {string[]}
 */
const SELECTORS = ["audio source[src]", "audio[src]"];

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
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

    const audio = SELECTORS.map((s) => doc.querySelector(s))
                           .find((a) => null !== a &&
                                        "" !== a.getAttribute("src"));
    return undefined === audio ? null
                               : new URL(audio.getAttribute("src"), href).href;
};
export const extract = matchPattern(action, "*://*/*");
