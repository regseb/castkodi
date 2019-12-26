/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * La liste des sélecteur retournant les éléments <code>audio</code> et leurs
 * sources.
 *
 * @constant {Array.<string>}
 */
const SELECTORS = ["audio source[src]", "audio[src]"];

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          url L'URL d'une page quelconque.
 * @param {HTMLDocument} doc Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, doc) {
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
