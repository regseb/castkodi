/**
 * @module
 * @license MIT
 * @see https://joinpeertube.org/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire la vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo PeerTube.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ href }) {
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
export const extract = matchPattern(
    action,
    "*://*/w/*",
    "*://*/videos/watch/*",
    "*://*/videos/embed/*",
);
