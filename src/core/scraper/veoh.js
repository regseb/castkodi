/**
 * @module
 * @license MIT
 * @see https://www.veoh.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Veoh pour obtenir des informations sur une vidéo.
 *
 * @type {string}
 */
const API_URL = "https://www.veoh.com/watch/getVideo/";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Veoh.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const response = await fetch(API_URL + pathname.slice(7));
    const json = await response.json();
    const hq = json.video?.src.HQ ?? "";
    return "" === hq ? undefined : hq;
};
export const extract = matchPattern(action, "*://www.veoh.com/watch/*");
