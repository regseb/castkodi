/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo PeerTube.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }) {
    const url = href.replace(/^http:/iu, "https:")
                    .replace("videos/watch", "api/v1/videos")
                    .replace("videos/embed", "api/v1/videos");
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json.files?.[0].fileUrl ?? null;
    } catch {
        // Ignorer les erreurs car elles proviennent d'un site qui n'est pas une
        // instance PeerTube (et l'appel à l'API a échoué).
    }
    return null;
};
export const extract = matchPattern(action,
    "*://*/videos/watch/*",
    "*://*/videos/embed/*");
