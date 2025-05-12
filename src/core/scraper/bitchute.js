/**
 * @module
 * @license MIT
 * @see https://www.bitchute.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de BitChute.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async function ({ pathname }) {
    const response = await fetch(
        "https://api.bitchute.com/api/beta/video/media",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // eslint-disable-next-line camelcase
            body: JSON.stringify({ video_id: pathname.slice(7) }),
        },
    );
    const json = await response.json();
    return json.media_url;
};
export const extract = matchPattern(action, "*://www.bitchute.com/video/*");
