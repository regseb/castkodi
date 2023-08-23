/**
 * @module
 * @license MIT
 * @see https://www.aparat.com/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo آپارات (Aparat).
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    const id = pathname.slice(3);
    return (
        `https://www.aparat.com/video/hls/manifest/videohash/${id}/f/${id}` +
        ".m3u8"
    );
};
export const extract = matchPattern(action, "*://www.aparat.com/v/*");
