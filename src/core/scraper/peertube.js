/**
 * @module
 * @license MIT
 * @see https://joinpeertube.org/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire la vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'une éventuelle vidéo PeerTube.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ href }) => {
    const url = href
        .replace(/^http:/iu, "https:")
        .replace(/\/(?:videos\/embed|videos\/watch|w)\//iu, "/api/v1/videos/");
    try {
        const response = await fetch(url);
        const json = await response.json();
        return (
            json.streamingPlaylists?.[0]?.playlistUrl ??
            json.files?.[0]?.fileUrl
        );
    } catch {
        // Ignorer les erreurs, car elles proviennent d'un site qui n'est pas
        // une instance PeerTube (et l'appel à l'API a échoué).
        return undefined;
    }
};
export const extract = matchURLPattern(
    action,
    "*://*/w/*",
    "*://*/videos/watch/*",
    "*://*/videos/embed/*",
);
