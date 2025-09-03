/**
 * @module
 * @license MIT
 * @see https://www.france.tv/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'expression rationnelle pour extraire l'identifiant de la vidéo.
 *
 * @type {RegExp}
 */
const UUID_REGEXP = /"videoId":"(?<videoId>[-0-9a-f]+)"/u;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page de France tv.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = UUID_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }

        // Demander la vidéo pour Safari sur mobile, car l'API retourne une
        // vidéo au format HLS qui fonctionne dans Kodi. Avec Chrome sur un
        // ordinateur, la vidéo est au format DASH qui ne fonctionne pas dans
        // Kodi.
        // https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/francetv.py
        let url =
            `https://k7.ftven.fr/videos/${result.groups.videoId}` +
            "?domain=www.france.tv&device_type=mobile&browser=safari";
        let response = await fetch(url);
        let json = await response.json();

        url =
            "https://hdfauth.ftven.fr/esi/TA?format=json&url=" +
            encodeURIComponent(json.video.url);
        response = await fetch(url);
        json = await response.json();
        return `${json.url}|User-Agent=${encodeURIComponent(navigator.userAgent)}`;
    }
    return undefined;
};
export const extract = matchURLPattern(action, "https://www.france.tv/*");
