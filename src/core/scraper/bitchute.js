/**
 * @module
 * @license MIT
 * @see https://www.bitchute.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo de BitChute avec l'identifiant
 *                            de la vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ videoId }) => {
    const response = await fetch(
        "https://api.bitchute.com/api/beta/video/media",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // eslint-disable-next-line camelcase
            body: JSON.stringify({ video_id: videoId }),
        },
    );
    const json = await response.json();
    return json.media_url;
};
export const extract = matchURLPattern(
    action,
    "https://www.bitchute.com/video/:videoId",
);
