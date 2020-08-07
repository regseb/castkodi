/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Le chemin de l'API de LBRY.
 *
 * @constant {string}
 */
const API_PATH = "/cdn.lbryplayer.xyz/api/v2/streams/free/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo LBRY.
 * @param {object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const meta = doc.querySelector(`meta[property="og:video:secure_url"]`);
    return meta?.content.replace("/lbry.tv/$/embed/", API_PATH) ?? null;
};
export const extract = matchPattern(action,
    "https://lbry.tv/*",
    "https://open.lbry.com/*");
