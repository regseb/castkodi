/**
 * @module
 * @license MIT
 * @see https://www.aparat.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo آپارات (Aparat) avec
 *                            l'identifiant de la vidéo.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ id }) => {
    return Promise.resolve(
        `https://www.aparat.com/video/hls/manifest/videohash/${id}/f/${id}` +
            ".m3u8",
    );
};
export const extract = matchURLPattern(action, "https://www.aparat.com/v/:id");
