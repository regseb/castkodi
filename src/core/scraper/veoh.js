/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Veoh pour obtenir des informations sur une vidéo.
 *
 * @type {string}
 */
const API_URL = "https://www.veoh.com/watch/getVideo/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Veoh.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    const response = await fetch(API_URL + pathname.slice(7));
    const json = await response.json();
    return json.success && "" !== json.video.src.HQ ? json.video.src.HQ
                                                    : null;
};
export const extract = matchPattern(action, "*://www.veoh.com/watch/*");
